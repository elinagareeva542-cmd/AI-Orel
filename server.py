import base64
import hashlib
import hmac
import json
import mimetypes
import re
import secrets
import sqlite3
import threading
import time
import webbrowser
from datetime import datetime, timezone
from http import HTTPStatus
from http.cookies import SimpleCookie
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib import error as urllib_error
from urllib import request as urllib_request
from urllib.parse import urlparse


HOST = "127.0.0.1"
PORT = 8000
ROOT = Path(__file__).resolve().parent
DATABASE = ROOT / "users.db"
SESSION_COOKIE = "lingua_session"
PASSWORD_ITERATIONS = 310_000
SESSIONS = {}
MAX_JSON_BODY = 2_000_000
MAX_TEXTBOOK_CHARS = 120_000
AI_SAMPLE_CHARS = 28_000
MIN_PLAN_TOPICS = 10
MAX_PLAN_TOPICS = 12
DEFAULT_LAST_FEEDBACK = "Это первое занятие пользователя"


def utc_now():
    return datetime.now(timezone.utc).isoformat()


def hash_password(password):
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt, PASSWORD_ITERATIONS
    )
    return "pbkdf2_sha256${}${}${}".format(
        PASSWORD_ITERATIONS,
        base64.urlsafe_b64encode(salt).decode("ascii"),
        base64.urlsafe_b64encode(digest).decode("ascii"),
    )


def verify_password(password, encoded):
    try:
        algorithm, iterations, salt, expected = encoded.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        digest = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            base64.urlsafe_b64decode(salt),
            int(iterations),
        )
        return hmac.compare_digest(
            base64.urlsafe_b64encode(digest).decode("ascii"), expected
        )
    except (TypeError, ValueError):
        return False


def database_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def migrate_database():
    with database_connection() as connection:
        columns = {
            row["name"] for row in connection.execute("PRAGMA table_info(users)")
        }
        if "последняя обратная связь" not in columns:
            connection.execute(
                """
                ALTER TABLE users
                ADD COLUMN "последняя обратная связь" TEXT
                NOT NULL DEFAULT 'Это первое занятие пользователя'
                """
            )
        connection.execute(
            """
            UPDATE users
            SET "последняя обратная связь" = ?
            WHERE "последняя обратная связь" IS NULL
               OR trim("последняя обратная связь") = ''
            """,
            (DEFAULT_LAST_FEEDBACK,),
        )


def read_llm_config():
    source = (ROOT / "config.js").read_text(encoding="utf-8")

    def value(name):
        match = re.search(
            rf"\b{name}\s*:\s*(['\"])(.*?)\1", source, re.DOTALL
        )
        return match.group(2).strip() if match else ""

    return {"url": value("url"), "token": value("token"), "model": value("model")}


def extract_ai_text(payload):
    if isinstance(payload.get("output_text"), str):
        return payload["output_text"]
    if isinstance(payload.get("text"), str):
        return payload["text"]
    choices = payload.get("choices")
    if isinstance(choices, list) and choices:
        choice = choices[0] if isinstance(choices[0], dict) else {}
        message = choice.get("message", {})
        content = message.get("content") if isinstance(message, dict) else None
        if isinstance(content, str):
            return content
        if isinstance(choice.get("text"), str):
            return choice["text"]
    output = payload.get("output")
    if isinstance(output, list):
        parts = []
        for item in output:
            for content in item.get("content", []) if isinstance(item, dict) else []:
                text = content.get("text") if isinstance(content, dict) else None
                if isinstance(text, str):
                    parts.append(text)
        if parts:
            return "\n".join(parts)
    raise ValueError("AI response does not contain text")


def extract_json_object(text):
    cleaned = text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start < 0 or end <= start:
            raise
        return json.loads(cleaned[start : end + 1])


def call_llm(
    messages,
    max_tokens=7000,
    json_mode=False,
    timeout=120,
    retry_count=0,
    max_retries=2,
):
    config = read_llm_config()
    if not config["url"] or not config["token"]:
        raise RuntimeError("Укажите url и token в config.js.")

    api_url = config["url"].rstrip("/")
    api_path = urlparse(api_url).path.rstrip("/")
    if api_path.endswith("/v1"):
        api_url += "/chat/completions"
        api_path += "/chat/completions"

    is_responses_api = api_path.endswith("/responses")
    if is_responses_api:
        payload = {
            "input": messages,
            "temperature": 0.25,
            "max_output_tokens": max_tokens,
        }
    else:
        payload = {
            "messages": messages,
        }
        if config["model"].lower().startswith("gpt-5"):
            payload["max_completion_tokens"] = max_tokens
        else:
            payload["temperature"] = 0.25
            payload["max_tokens"] = max_tokens
        if json_mode:
            payload["response_format"] = {"type": "json_object"}
    if config["model"]:
        payload["model"] = config["model"]

    request = urllib_request.Request(
        api_url,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {config['token']}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )
    try:
        with urllib_request.urlopen(request, timeout=timeout) as response:
            result = json.loads(response.read().decode("utf-8"))
    except urllib_error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")[:500]
        if exc.code == 429 and retry_count < max_retries:
            time.sleep(5 + retry_count * 5)
            return call_llm(
                messages,
                max_tokens=max_tokens,
                json_mode=json_mode,
                timeout=timeout,
                retry_count=retry_count + 1,
                max_retries=max_retries,
            )
        raise RuntimeError(f"AI API вернуло ошибку {exc.code}: {detail}") from exc
    except (urllib_error.URLError, TimeoutError) as exc:
        if "timed out" in str(exc).lower():
            raise RuntimeError(
                f"AI API не успело ответить за {timeout} секунд. "
                "Попробуйте построить план ещё раз."
            ) from exc
        raise RuntimeError(f"AI API недоступно: {exc}") from exc
    return extract_ai_text(result)


def extract_json_with_repair(text):
    try:
        return extract_json_object(text)
    except json.JSONDecodeError as original_error:
        repair_prompt = f"""
Исправь синтаксис повреждённого JSON ниже.
Не сокращай данные, не меняй структуру и содержание.
Верни только один валидный JSON-объект без markdown и пояснений.

ПОВРЕЖДЁННЫЙ JSON:
{text}
"""
        repaired = call_llm(
            [
                {
                    "role": "system",
                    "content": "Ты исправляешь синтаксис JSON и возвращаешь только валидный JSON-объект.",
                },
                {"role": "user", "content": repair_prompt},
            ],
            max_tokens=16000,
            json_mode=True,
            timeout=300,
        )
        try:
            return extract_json_object(repaired)
        except json.JSONDecodeError as repair_error:
            raise ValueError(
                f"Нейросеть дважды вернула повреждённый JSON: {repair_error}"
            ) from original_error


def build_textbook_outline(textbook, language):
    if len(textbook) <= AI_SAMPLE_CHARS:
        return textbook

    sample_count = 6
    sample_size = AI_SAMPLE_CHARS // sample_count
    max_start = max(0, len(textbook) - sample_size)
    samples = []
    for index in range(sample_count):
        start = round(index * max_start / max(1, sample_count - 1))
        chunk = textbook[start : start + sample_size]
        samples.append(f"ФРАГМЕНТ {index + 1} ИЗ РАЗНЫХ ЧАСТЕЙ УЧЕБНИКА:\n{chunk}")
    return "\n\n".join(samples)


class LinguaHandler(SimpleHTTPRequestHandler):
    server_version = "LinguaPath/1.0"

    def do_GET(self):
        path = urlparse(self.path).path

        if path == "/api/session":
            user = self.current_user()
            if not user:
                self.send_json({"authenticated": False}, HTTPStatus.UNAUTHORIZED)
                return
            self.send_json(
                {
                    "authenticated": True,
                    "user": {"username": user["username"], "email": user["email"]},
                }
            )
            return

        if path == "/":
            self.serve_file("login.html")
            return

        if path == "/index.html":
            if not self.current_user():
                self.redirect("/login.html")
                return
            self.serve_file("index.html")
            return

        if path == "/login.html":
            self.serve_file("login.html")
            return

        allowed_files = {
            "/app.js": "app.js",
            "/styles.css": "styles.css",
        }
        filename = allowed_files.get(path)
        if filename:
            self.serve_file(filename)
            return

        self.send_error(HTTPStatus.NOT_FOUND)

    def do_POST(self):
        path = urlparse(self.path).path
        if path == "/api/register":
            self.register()
        elif path == "/api/login":
            self.login()
        elif path == "/api/logout":
            self.logout()
        elif path == "/api/ai-plan":
            self.ai_plan()
        elif path == "/api/ai-lesson":
            self.ai_lesson()
        elif path == "/api/ai-quiz":
            self.ai_quiz()
        elif path == "/api/ai-feedback":
            self.ai_feedback()
        elif path == "/api/ai-test-feedback":
            self.ai_test_feedback()
        else:
            self.send_error(HTTPStatus.NOT_FOUND)

    def register(self):
        data = self.read_json()
        if data is None:
            return

        username = str(data.get("username", "")).strip()
        email = str(data.get("email", "")).strip().lower()
        password = str(data.get("password", ""))

        if not re.fullmatch(r"[\w-]{3,32}", username, re.UNICODE):
            self.send_json(
                {"error": "Логин: от 3 до 32 букв, цифр, дефисов или подчёркиваний."},
                HTTPStatus.BAD_REQUEST,
            )
            return
        if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
            self.send_json(
                {"error": "Введите корректный email."}, HTTPStatus.BAD_REQUEST
            )
            return
        if len(password) < 8:
            self.send_json(
                {"error": "Пароль должен содержать не менее 8 символов."},
                HTTPStatus.BAD_REQUEST,
            )
            return

        try:
            with database_connection() as connection:
                cursor = connection.execute(
                    """
                    INSERT INTO users (username, email, password_hash, updated_at)
                    VALUES (?, ?, ?, ?)
                    """,
                    (username, email, hash_password(password), utc_now()),
                )
                user_id = cursor.lastrowid
        except sqlite3.IntegrityError:
            self.send_json(
                {"error": "Пользователь с таким логином или email уже существует."},
                HTTPStatus.CONFLICT,
            )
            return

        token = self.create_session(user_id)
        self.send_json(
            {"ok": True, "username": username},
            HTTPStatus.CREATED,
            cookie=self.session_cookie(token),
        )

    def login(self):
        data = self.read_json()
        if data is None:
            return

        login = str(data.get("login", "")).strip()
        password = str(data.get("password", ""))
        with database_connection() as connection:
            user = connection.execute(
                """
                SELECT id, username, email, password_hash, is_active
                FROM users
                WHERE lower(username) = lower(?) OR lower(email) = lower(?)
                """,
                (login, login),
            ).fetchone()

            if (
                not user
                or not user["is_active"]
                or not verify_password(password, user["password_hash"])
            ):
                self.send_json(
                    {"error": "Неверный логин, email или пароль."},
                    HTTPStatus.UNAUTHORIZED,
                )
                return

            connection.execute(
                "UPDATE users SET last_login = ?, updated_at = ? WHERE id = ?",
                (utc_now(), utc_now(), user["id"]),
            )

        token = self.create_session(user["id"])
        self.send_json(
            {"ok": True, "username": user["username"]},
            cookie=self.session_cookie(token),
        )

    def logout(self):
        token = self.session_token()
        if token:
            SESSIONS.pop(token, None)
        self.send_json(
            {"ok": True},
            cookie=f"{SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
        )

    def ai_plan_bundle(self):
        if not self.current_user():
            self.send_json({"error": "Требуется вход."}, HTTPStatus.UNAUTHORIZED)
            return
        data = self.read_json()
        if data is None:
            return

        textbook = str(data.get("textbook", "")).strip()[:MAX_TEXTBOOK_CHARS]
        profile = data.get("profile") if isinstance(data.get("profile"), dict) else {}
        if len(textbook) < 100:
            self.send_json(
                {"error": "В учебнике недостаточно распознанного текста."},
                HTTPStatus.BAD_REQUEST,
            )
            return

        language = str(profile.get("language", "иностранный язык"))
        level = str(profile.get("level", "A1"))
        target_level = str(profile.get("targetLevel", "B1"))
        hours = str(profile.get("hours", "5"))
        textbook_map = build_textbook_outline(textbook, language)

        prompt = f"""
Проанализируй учебник для языка "{language}" и одним ответом создай полностью готовый курс.
Ученик переходит с {level} на {target_level}, занимается {hours} часов в неделю.

Верни ровно 10 последовательных грамматических уроков от простого к сложному.
Объедини точные повторы учебника. Если тем мало, раздели крупные темы на формы,
употребление, вопросы/отрицание, исключения и более сложные случаи.

Для каждого урока обязательно:
- конкретное грамматическое название и уровень между {level} и {target_level};
- понятное подробное правило: назначение, образование, употребление и ошибки;
- 3 коротких смысловых раздела правила и 3 естественных примера с переводом;
- 24 уникальных тематических слова или фразы в 4 группах; лексика усложняется по курсу;
- ровно 3 задания: grammar, vocabulary, production;
- у задания есть однозначная инструкция, hints и скрытый referenceAnswer;
- для диалога с пропусками дай банк слов или подсказку к каждому номеру, а в
  referenceAnswer — весь заполненный диалог;
- тест: grammar, vocabulary, comprehension, по 3 вопроса в каждом разделе;
- у вопроса ровно 4 варианта и индекс правильного ответа ok от 0 до 3.

Не копируй упражнения из учебника. Не используй названия "Учебная тема", "Часть",
"Раздел", "Урок", Section или Topic. Не добавляй markdown и пояснения вне JSON.

Строгая компактная структура:
{{
  "detectedLanguage": "язык",
  "topics": [
    {{
      "topic": "точная грамматическая тема",
      "grammarTitle": "точная грамматическая тема",
      "level": "A1",
      "learningGoal": "результат",
      "summary": "краткое введение",
      "grammarRule": "подробное цельное объяснение",
      "ruleSections": [
        {{"title": "Назначение", "text": "объяснение"}},
        {{"title": "Образование и употребление", "text": "объяснение"}},
        {{"title": "Ошибки и исключения", "text": "объяснение"}}
      ],
      "grammarExamples": [{{"target": "пример", "ru": "перевод"}}],
      "vocabularyGroups": [
        {{"title": "группа", "items": [{{"target": "слово или фраза", "ru": "перевод"}}]}}
      ],
      "generatedTasks": [
        {{"type": "grammar", "title": "Грамматика", "instruction": "задание", "hints": ["подсказка"], "referenceAnswer": "полный ответ"}},
        {{"type": "vocabulary", "title": "Лексика", "instruction": "задание", "hints": ["подсказка"], "referenceAnswer": "полный ответ"}},
        {{"type": "production", "title": "Диалог или текст", "instruction": "однозначное задание", "hints": ["подсказки или банк слов"], "referenceAnswer": "полный диалог или текст"}}
      ],
      "quizSections": [
        {{"type": "grammar", "title": "Грамматика", "questions": [{{"q": "вопрос", "a": ["1", "2", "3", "4"], "ok": 0}}]}},
        {{"type": "vocabulary", "title": "Лексика", "questions": [{{"q": "вопрос", "a": ["1", "2", "3", "4"], "ok": 0}}]}},
        {{"type": "comprehension", "title": "Понимание темы", "questions": [{{"q": "вопрос", "a": ["1", "2", "3", "4"], "ok": 0}}]}}
      ]
    }}
  ]
}}

СОДЕРЖАНИЕ УЧЕБНИКА:
{textbook_map}
"""
        try:
            text = call_llm(
                [
                    {
                        "role": "system",
                        "content": "Ты методист по иностранным языкам. Верни один строгий компактный JSON с десятью полностью готовыми уроками.",
                    },
                    {"role": "user", "content": prompt},
                ],
                max_tokens=16000,
                json_mode=True,
                timeout=165,
                max_retries=0,
            )
            plan = extract_json_object(text)
            topics = plan.get("topics") if isinstance(plan, dict) else None
            if not isinstance(topics, list) or len(topics) < MIN_PLAN_TOPICS:
                count = len(topics) if isinstance(topics, list) else 0
                raise ValueError(
                    f"Нейросеть вернула только {count} готовых уроков вместо 10."
                )
            self.send_json(
                {
                    "detectedLanguage": str(plan.get("detectedLanguage", "")).strip(),
                    "topics": topics[:MIN_PLAN_TOPICS],
                }
            )
        except (RuntimeError, ValueError, json.JSONDecodeError) as exc:
            self.send_json({"error": str(exc)}, HTTPStatus.BAD_GATEWAY)

    def ai_plan(self):
        if not self.current_user():
            self.send_json({"error": "Требуется вход."}, HTTPStatus.UNAUTHORIZED)
            return
        data = self.read_json()
        if data is None:
            return
        textbook = str(data.get("textbook", "")).strip()[:MAX_TEXTBOOK_CHARS]
        profile = data.get("profile") if isinstance(data.get("profile"), dict) else {}
        if len(textbook) < 100:
            self.send_json(
                {"error": "В учебнике недостаточно распознанного текста."},
                HTTPStatus.BAD_REQUEST,
            )
            return

        language = str(profile.get("language", "иностранный язык"))
        level = str(profile.get("level", "A1"))
        target_level = str(profile.get("targetLevel", "B1"))
        hours = str(profile.get("hours", "5"))
        textbook_map = build_textbook_outline(textbook, language)

        prompt = f"""
Быстро проанализируй содержание учебника для языка "{language}" и составь только карту курса.
Ученик переходит с {level} на {target_level}, занимается {hours} часов в неделю.

Правила:
1. Верни от {MIN_PLAN_TOPICS} до {MAX_PLAN_TOPICS} последовательных грамматических тем.
2. Объедини точные повторы, но не своди целый учебник к нескольким общим темам.
3. Если тема крупная, раздели её на самостоятельные этапы: формы, употребление,
   вопросы и отрицание, исключения или более сложные случаи.
4. Расположи материал от простого к сложному и оставь только диапазон {level}-{target_level}.
5. Названия должны быть конкретными грамматическими темами. Запрещены названия
   "Учебная тема", "Часть", "Раздел", "Урок", "Section", "Topic" и номера страниц.
6. Сейчас не создавай правила, лексику, упражнения и тесты. Они будут созданы отдельным запросом.

Верни только короткий валидный JSON:
{{
  "detectedLanguage": "язык учебника",
  "topics": [
    {{
      "topic": "конкретное название грамматической темы",
      "grammarTitle": "то же точное название правила",
      "level": "A1",
      "learningGoal": "чему научится ученик",
      "summary": "1-2 предложения о содержании урока"
    }}
  ]
}}

СОДЕРЖАНИЕ УЧЕБНИКА:
{textbook_map}
"""
        try:
            text = call_llm(
                [
                    {
                        "role": "system",
                        "content": "Ты методист по иностранным языкам и возвращаешь только строгий JSON.",
                    },
                    {"role": "user", "content": prompt},
                ],
                max_tokens=3500,
                json_mode=True,
                timeout=45,
                max_retries=0,
            )
            plan = extract_json_object(text)
            topics = plan.get("topics") if isinstance(plan, dict) else None
            if not isinstance(topics, list) or not topics:
                raise ValueError("В ответе нет массива topics")
            if len(topics) < MIN_PLAN_TOPICS:
                expansion_prompt = f"""
Ты вернул только {len(topics)} урока(ов), но требуется минимум {MIN_PLAN_TOPICS}.
Расширь план до {MIN_PLAN_TOPICS}-{MAX_PLAN_TOPICS} последовательных грамматических уроков.
Раздели крупные темы на методически самостоятельные этапы без бессодержательных повторов.
Для каждого урока нужны только topic, grammarTitle, level, learningGoal и краткий summary.
Сохрани язык, диапазон {level}-{target_level} и логический порядок.
Верни полный короткий JSON-объект без правил, лексики, заданий и тестов.

ИСХОДНЫЙ ПЛАН:
{json.dumps(plan, ensure_ascii=False)}
"""
                expanded_text = call_llm(
                    [
                        {
                            "role": "system",
                            "content": "Ты расширяешь учебный план и возвращаешь только строгий JSON.",
                        },
                        {"role": "user", "content": expansion_prompt},
                    ],
                    max_tokens=3500,
                    json_mode=True,
                    timeout=45,
                    max_retries=0,
                )
                plan = extract_json_object(expanded_text)
                topics = plan.get("topics") if isinstance(plan, dict) else None
            if not isinstance(topics, list) or len(topics) < MIN_PLAN_TOPICS:
                count = len(topics) if isinstance(topics, list) else 0
                raise ValueError(
                    f"Нейросеть сформировала только {count} тем вместо минимум {MIN_PLAN_TOPICS}."
                )
            self.send_json(
                {
                    "detectedLanguage": str(plan.get("detectedLanguage", "")).strip(),
                    "topics": topics[:MAX_PLAN_TOPICS],
                }
            )
        except (RuntimeError, ValueError, json.JSONDecodeError) as exc:
            self.send_json(
                {"error": str(exc)}, HTTPStatus.BAD_GATEWAY
            )

    def ai_lesson(self):
        if not self.current_user():
            self.send_json({"error": "Требуется вход."}, HTTPStatus.UNAUTHORIZED)
            return
        data = self.read_json()
        if data is None:
            return

        textbook = str(data.get("textbook", "")).strip()[:MAX_TEXTBOOK_CHARS]
        profile = data.get("profile") if isinstance(data.get("profile"), dict) else {}
        topic = data.get("topic") if isinstance(data.get("topic"), dict) else {}
        title = str(topic.get("grammarTitle") or topic.get("topic") or "").strip()
        if len(textbook) < 100 or len(title) < 4:
            self.send_json(
                {"error": "Недостаточно данных для создания урока."},
                HTTPStatus.BAD_REQUEST,
            )
            return

        language = str(profile.get("language", "иностранный язык"))
        level = str(topic.get("level") or profile.get("level", "A1"))
        target_level = str(profile.get("targetLevel", "B1"))
        topic_index = max(0, int(data.get("topicIndex", 0) or 0))
        total_topics = max(1, int(data.get("totalTopics", MIN_PLAN_TOPICS) or MIN_PLAN_TOPICS))
        textbook_map = build_textbook_outline(textbook, language)

        prompt = f"""
Создай один полноценный урок по теме "{title}" для языка "{language}".
Уровень урока: {level}. Целевой уровень курса: {target_level}.
Это урок {topic_index + 1} из {total_topics}; лексика должна соответствовать этому этапу курса
и быть заметно сложнее в поздних уроках.

Используй содержание учебника как опору для темы и правила, но упражнения создавай самостоятельно.
Требования:
1. Подробно объясни, где и зачем правило используется, как образуется, формы, окончания,
   согласование, исключения, ограничения и типичные ошибки.
2. Дай 6-10 естественных примеров с русским переводом.
3. Создай 45-55 уникальных слов и фраз в 4-6 смысловых группах. Они должны относиться
   к контексту этой темы, а не быть одинаковым базовым списком для всех уроков.
4. Создай ровно 3 задания без видимых пользователю ответов: grammar, vocabulary, production.
   Для каждого задания добавь hints с понятными подсказками и referenceAnswer с полным эталоном.
   Production — диалог с пропусками или связный текст в зависимости от темы.
   Если это диалог с пропусками, каждый пропуск должен иметь только один естественный ответ:
   добавь банк слов либо отдельную подсказку для каждого номера. В referenceAnswer верни весь
   диалог целиком без пропусков, а не просто список отдельных слов.
5. Создай тест из трёх разделов: grammar, vocabulary, comprehension.
   В каждом разделе ровно 4 вопроса, у каждого 4 варианта и один корректный индекс ok от 0 до 3.
6. Проверяй грамматический род, число, падеж и естественность русских формулировок.

Верни только валидный JSON:
{{
  "topic": "{title}",
  "grammarTitle": "{title}",
  "level": "{level}",
  "learningGoal": "результат урока",
  "summary": "развёрнутое введение",
  "grammarRule": "целостное подробное объяснение",
  "ruleSections": [
    {{"title": "Где и для чего используется", "text": "подробно"}},
    {{"title": "Как образуется", "text": "формы, формулы, окончания"}},
    {{"title": "Исключения и типичные ошибки", "text": "подробно"}}
  ],
  "grammarExamples": [{{"target": "пример", "ru": "перевод"}}],
  "vocabularyGroups": [
    {{"title": "смысловая группа", "items": [{{"target": "слово или фраза", "ru": "перевод"}}]}}
  ],
  "generatedTasks": [
    {{"type": "grammar", "title": "Отработка грамматического материала", "instruction": "однозначное задание", "hints": ["подсказка"], "referenceAnswer": "полный эталон"}},
    {{"type": "vocabulary", "title": "Отработка лексического материала", "instruction": "однозначное задание", "hints": ["подсказка"], "referenceAnswer": "полный эталон"}},
    {{"type": "production", "title": "Диалог или связный текст", "instruction": "задание с банком слов или подсказкой для каждого пропуска", "hints": ["1 — подсказка", "2 — подсказка"], "referenceAnswer": "полностью заполненный диалог или образец текста"}}
  ],
  "quizSections": [
    {{"type": "grammar", "title": "Грамматика", "questions": [{{"q": "вопрос", "a": ["вариант 1", "вариант 2", "вариант 3", "вариант 4"], "ok": 0}}]}},
    {{"type": "vocabulary", "title": "Лексика: слова и фразы", "questions": [{{"q": "вопрос", "a": ["вариант 1", "вариант 2", "вариант 3", "вариант 4"], "ok": 0}}]}},
    {{"type": "comprehension", "title": "Понимание темы", "questions": [{{"q": "вопрос", "a": ["вариант 1", "вариант 2", "вариант 3", "вариант 4"], "ok": 0}}]}}
  ]
}}

ФРАГМЕНТЫ УЧЕБНИКА:
{textbook_map}
"""
        try:
            text = call_llm(
                [
                    {
                        "role": "system",
                        "content": "Ты методист по иностранным языкам. Возвращай только строгий JSON одного подробного урока.",
                    },
                    {"role": "user", "content": prompt},
                ],
                max_tokens=11000,
                json_mode=True,
                timeout=180,
            )
            lesson = extract_json_with_repair(text)
            if not isinstance(lesson, dict):
                raise ValueError("Нейросеть не вернула объект урока.")
            self.send_json({"lesson": lesson})
        except (RuntimeError, ValueError, json.JSONDecodeError) as exc:
            self.send_json({"error": str(exc)}, HTTPStatus.BAD_GATEWAY)

    def ai_quiz(self):
        if not self.current_user():
            self.send_json({"error": "Требуется вход."}, HTTPStatus.UNAUTHORIZED)
            return
        data = self.read_json()
        if data is None:
            return
        prompt = str(data.get("prompt", "")).strip()
        if not prompt:
            self.send_json({"error": "Пустой запрос."}, HTTPStatus.BAD_REQUEST)
            return
        try:
            text = call_llm(
                [
                    {
                        "role": "system",
                        "content": "Ты создаёшь учебные тесты и возвращаешь только JSON.",
                    },
                    {"role": "user", "content": prompt[:20_000]},
                ],
                max_tokens=3000,
            )
            self.send_json({"output_text": text})
        except RuntimeError as exc:
            self.send_json({"error": str(exc)}, HTTPStatus.BAD_GATEWAY)

    def ai_feedback(self):
        user = self.current_user()
        if not user:
            self.send_json({"error": "Требуется вход."}, HTTPStatus.UNAUTHORIZED)
            return
        data = self.read_json()
        if data is None:
            return
        topic = data.get("topic") if isinstance(data.get("topic"), dict) else {}
        answers = data.get("answers") if isinstance(data.get("answers"), list) else []
        if not answers:
            self.send_json({"error": "Нет ответов для проверки."}, HTTPStatus.BAD_REQUEST)
            return

        prompt = f"""
Проверь ответы ученика по уроку иностранного языка.
Тема: {topic.get("topic", "")}
Уровень: {topic.get("level", "")}
Правило: {topic.get("grammarRule", "")}
Лексика: {json.dumps(topic.get("vocabularyGroups", []), ensure_ascii=False)}
Задания, эталоны и ответы ученика: {json.dumps(answers, ensure_ascii=False)}

Дай подробную, доброжелательную и конкретную обратную связь на русском языке.
Для каждого задания объясни:
- что выполнено хорошо;
- какие грамматические или лексические ошибки есть;
- почему это ошибка и как исправить;
- на какое правило, форму и лексику сделать упор;
- предложи короткий следующий шаг для тренировки.
В поле correctedAnswer верни полный правильный вариант задания. Для диалога верни весь
диалог целиком, структурно и без пропусков, используя referenceAnswer как эталон и при
необходимости исправляя его по правилам языка.
Не ограничивайся длиной ответа или подсчётом слов.
Верни только JSON:
{{
  "overall": "общий разбор",
  "focusGrammar": ["что повторить"],
  "focusVocabulary": ["слова или группы для повторения"],
  "items": [
    {{"taskIndex": 0, "feedback": "подробный комментарий", "strengths": "сильные стороны", "improvements": "что исправить", "correctedAnswer": "полный правильный ответ"}}
  ]
}}
"""
        try:
            text = call_llm(
                [
                    {
                        "role": "system",
                        "content": "Ты преподаватель языка, проверяющий письменные работы. Возвращай строгий JSON.",
                    },
                    {"role": "user", "content": prompt},
                ],
                max_tokens=3500,
                json_mode=True,
            )
            feedback = extract_json_with_repair(text)
            stored_feedback = json.dumps(feedback, ensure_ascii=False)
            with database_connection() as connection:
                connection.execute(
                    """
                    UPDATE users
                    SET "последняя обратная связь" = ?, updated_at = ?
                    WHERE id = ?
                    """,
                    (stored_feedback, utc_now(), user["id"]),
                )
            self.send_json(feedback)
        except (RuntimeError, ValueError, json.JSONDecodeError) as exc:
            self.send_json({"error": str(exc)}, HTTPStatus.BAD_GATEWAY)

    def ai_test_feedback(self):
        user = self.current_user()
        if not user:
            self.send_json({"error": "Требуется вход."}, HTTPStatus.UNAUTHORIZED)
            return
        data = self.read_json()
        if data is None:
            return

        topic = data.get("topic") if isinstance(data.get("topic"), dict) else {}
        answers = data.get("answers") if isinstance(data.get("answers"), list) else []
        score = data.get("score") if isinstance(data.get("score"), dict) else {}
        if not answers:
            self.send_json(
                {"error": "Нет ответов теста для анализа."},
                HTTPStatus.BAD_REQUEST,
            )
            return

        with database_connection() as connection:
            row = connection.execute(
                """
                SELECT "последняя обратная связь"
                FROM users
                WHERE id = ?
                """,
                (user["id"],),
            ).fetchone()
        last_feedback = (
            row["последняя обратная связь"]
            if row and row["последняя обратная связь"]
            else DEFAULT_LAST_FEEDBACK
        )

        prompt = f"""
Проанализируй результат нового теста ученика по иностранному языку.

Тема: {topic.get("topic", "")}
Уровень: {topic.get("level", "")}
Правило урока: {topic.get("grammarRule", "")}
Результат: {json.dumps(score, ensure_ascii=False)}
Ответы теста: {json.dumps(answers, ensure_ascii=False)}

Последняя обратная связь по предыдущим заданиям ученика:
{last_feedback}

Сопоставь текущие ошибки с предыдущей обратной связью. Отдельно укажи:
- улучшилось ли то, что раньше западало;
- какие ошибки повторились;
- что повторить по грамматике и лексике;
- какой следующий короткий шаг выполнить.

Верни только JSON:
{{
  "overall": "развёрнутый анализ результата",
  "progress": "что изменилось относительно прошлой обратной связи",
  "repeatedIssues": ["повторяющиеся затруднения"],
  "focusGrammar": ["что повторить"],
  "focusVocabulary": ["что повторить"],
  "nextStep": "конкретное следующее действие"
}}
"""
        try:
            text = call_llm(
                [
                    {
                        "role": "system",
                        "content": "Ты преподаватель языка, анализирующий динамику ученика. Возвращай строгий JSON.",
                    },
                    {"role": "user", "content": prompt},
                ],
                max_tokens=2500,
                json_mode=True,
                timeout=90,
            )
            feedback = extract_json_with_repair(text)
            self.send_json(feedback)
        except (RuntimeError, ValueError, json.JSONDecodeError) as exc:
            self.send_json({"error": str(exc)}, HTTPStatus.BAD_GATEWAY)

    def current_user(self):
        token = self.session_token()
        user_id = SESSIONS.get(token)
        if not user_id:
            return None
        with database_connection() as connection:
            return connection.execute(
                """
                SELECT id, username, email, "последняя обратная связь"
                FROM users
                WHERE id = ? AND is_active = 1
                """,
                (user_id,),
            ).fetchone()

    def session_token(self):
        cookie = SimpleCookie(self.headers.get("Cookie"))
        morsel = cookie.get(SESSION_COOKIE)
        return morsel.value if morsel else None

    def create_session(self, user_id):
        token = secrets.token_urlsafe(32)
        SESSIONS[token] = user_id
        return token

    @staticmethod
    def session_cookie(token):
        return f"{SESSION_COOKIE}={token}; Path=/; HttpOnly; SameSite=Lax"

    def read_json(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0 or length > MAX_JSON_BODY:
                raise ValueError
            return json.loads(self.rfile.read(length).decode("utf-8"))
        except (ValueError, UnicodeDecodeError, json.JSONDecodeError):
            self.send_json(
                {"error": "Некорректный запрос."}, HTTPStatus.BAD_REQUEST
            )
            return None

    def send_json(self, payload, status=HTTPStatus.OK, cookie=None):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        if cookie:
            self.send_header("Set-Cookie", cookie)
        self.end_headers()
        self.wfile.write(body)

    def redirect(self, location):
        self.send_response(HTTPStatus.SEE_OTHER)
        self.send_header("Location", location)
        self.end_headers()

    def serve_file(self, filename):
        path = ROOT / filename
        try:
            content = path.read_bytes()
        except FileNotFoundError:
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        content_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        if content_type.startswith("text/") or content_type in {
            "application/javascript",
            "application/json",
        }:
            content_type += "; charset=utf-8"
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(content)))
        if path.suffix in {".html", ".js", ".css"}:
            self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(content)


if __name__ == "__main__":
    migrate_database()
    address = f"http://{HOST}:{PORT}"
    print(f"Lingua Path: {address}")
    threading.Timer(0.6, lambda: webbrowser.open(address)).start()
    ThreadingHTTPServer((HOST, PORT), LinguaHandler).serve_forever()
