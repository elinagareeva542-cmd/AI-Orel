const ui = {
  authOverlay: document.getElementById('authOverlay'),
  authEmail: document.getElementById('authEmail'),
  authPassword: document.getElementById('authPassword'),
  loginBtn: document.getElementById('loginBtn'),
  registerBtn: document.getElementById('registerBtn'),
  googleSignInWrap: document.getElementById('googleSignInWrap'),
  authMsg: document.getElementById('authMsg'),
  fileInput: document.getElementById('fileInput'),
  dropzone: document.getElementById('dropzone'),
  fileList: document.getElementById('fileList'),
  extractStatus: document.getElementById('extractStatus'),
  parseMode: document.getElementById('parseMode'),
  language: document.getElementById('language'),
  level: document.getElementById('level'),
  targetLevel: document.getElementById('targetLevel'),
  hours: document.getElementById('hours'),
  timerMinutes: document.getElementById('timerMinutes'),
  timerView: document.getElementById('timerView'),
  startTimerBtn: document.getElementById('startTimerBtn'),
  pauseTimerBtn: document.getElementById('pauseTimerBtn'),
  resetTimerBtn: document.getElementById('resetTimerBtn'),
  buildPlanBtn: document.getElementById('buildPlanBtn'),
  nextTopicBtn: document.getElementById('nextTopicBtn'),
  completeTopicBtn: document.getElementById('completeTopicBtn'),
  checkTasksBtn: document.getElementById('checkTasksBtn'),
  aiQuizBtn: document.getElementById('aiQuizBtn'),
  checkQuizBtn: document.getElementById('checkQuizBtn'),
  approveCardsBtn: document.getElementById('approveCardsBtn'),
  exportAnkiBtn: document.getElementById('exportAnkiBtn'),
  roadmapPanel: document.getElementById('roadmapPanel'),
  tasksPanel: document.getElementById('tasksPanel'),
  quizPanel: document.getElementById('quizPanel'),
  cardsPanel: document.getElementById('cardsPanel'),
  roadmap: document.getElementById('roadmap'),
  planSummary: document.getElementById('planSummary'),
  activeTopic: document.getElementById('activeTopic'),
  topicGuide: document.getElementById('topicGuide'),
  bookExercises: document.getElementById('bookExercises'),
  tasks: document.getElementById('tasks'),
  taskFeedback: document.getElementById('taskFeedback'),
  quiz: document.getElementById('quiz'),
  quizResult: document.getElementById('quizResult'),
  pendingCards: document.getElementById('pendingCards')
};

const STORAGE_KEY = 'lingua-path-state-v9';
const USERS_KEY = 'lingua-users-v1';
const GOOGLE_CLIENT_ID = 'PASTE_GOOGLE_CLIENT_ID_HERE';

const PDF_MODE = {
  fast: { pageLimit: 15, ocrLimit: 4, scale: 1.3 },
  accurate: { pageLimit: 180, ocrLimit: 120, scale: 2.1 }
};

const LANGUAGE_KEY_BY_LABEL = {
  'Английский': 'en',
  'Испанский': 'es',
  'Турецкий': 'tr',
  'Арабский': 'ar'
};

const LANGUAGE_LABEL_BY_KEY = {
  en: 'Английский',
  es: 'Испанский',
  tr: 'Турецкий',
  ar: 'Арабский',
  unknown: 'не определен'
};

const LANGUAGE_PACKS = {
  en: {
    modules: [
      {
        topic: 'Greetings and Introductions',
        summary: 'Приветствия, знакомство, базовые вопросы о себе.',
        grammarTitle: 'To be: am / is / are',
        grammarRule: 'Используем am/is/are для рассказа о себе и других: I am, you are, she is.',
        grammarExamples: [
          { target: 'I am Maria.', ru: 'Я Мария.' },
          { target: 'She is a student.', ru: 'Она студентка.' },
          { target: 'We are from Moscow.', ru: 'Мы из Москвы.' }
        ],
        grammarQuiz: [
          { q: 'Выберите правильный вариант: "He ___ a teacher."', options: ['is', 'am', 'are', 'be'], ok: 0 },
          { q: 'Какой вариант верный?', options: ['I am from Spain.', 'I are from Spain.', 'I is from Spain.', 'I be from Spain.'], ok: 0 }
        ],
        vocab: [
          { ru: 'привет', target: 'hello' },
          { ru: 'пока', target: 'goodbye' },
          { ru: 'имя', target: 'name' },
          { ru: 'страна', target: 'country' },
          { ru: 'город', target: 'city' },
          { ru: 'друг', target: 'friend' },
          { ru: 'семья', target: 'family' },
          { ru: 'учитель', target: 'teacher' }
        ],
        ruPrompts: ['Меня зовут Анна.', 'Я из России.', 'Он мой друг.', 'Она учитель.', 'Мы в городе.']
      },
      {
        topic: 'Daily Routine',
        summary: 'Действия каждый день и настоящее простое время.',
        grammarTitle: 'Present Simple',
        grammarRule: 'Для привычек используем Present Simple: I work, she works.',
        grammarExamples: [
          { target: 'I work every day.', ru: 'Я работаю каждый день.' },
          { target: 'She studies English.', ru: 'Она изучает английский.' },
          { target: 'They live in Ankara.', ru: 'Они живут в Анкаре.' }
        ],
        grammarQuiz: [
          { q: 'Выберите верно: "She ___ to school every day."', options: ['goes', 'go', 'going', 'gone'], ok: 0 },
          { q: 'Как правильно?', options: ['I play football.', 'I plays football.', 'I playing football.', 'I played football.'], ok: 0 }
        ],
        vocab: [
          { ru: 'работать', target: 'work' },
          { ru: 'учиться', target: 'study' },
          { ru: 'жить', target: 'live' },
          { ru: 'утро', target: 'morning' },
          { ru: 'вечер', target: 'evening' },
          { ru: 'школа', target: 'school' },
          { ru: 'дом', target: 'home' },
          { ru: 'время', target: 'time' }
        ],
        ruPrompts: ['Я встаю утром.', 'Он учится в школе.', 'Мы живем в доме.', 'Они работают вечером.', 'У меня мало времени.']
      }
    ]
  },
  es: {
    modules: [
      {
        topic: 'Saludos y presentaciones',
        summary: 'Приветствия, представление, личная информация.',
        grammarTitle: 'Ser: soy / eres / es / somos',
        grammarRule: 'Ser используем для имени, происхождения, профессии и постоянных характеристик.',
        grammarExamples: [
          { target: 'Soy Ana.', ru: 'Я Ана.' },
          { target: 'Él es profesor.', ru: 'Он преподаватель.' },
          { target: 'Somos amigos.', ru: 'Мы друзья.' }
        ],
        grammarQuiz: [
          { q: 'Выберите правильное: "Yo ___ de Rusia."', options: ['soy', 'estoy', 'eres', 'son'], ok: 0 },
          { q: 'Как правильно?', options: ['Ella es estudiante.', 'Ella está estudiante.', 'Ella soy estudiante.', 'Ella son estudiante.'], ok: 0 }
        ],
        vocab: [
          { ru: 'привет', target: 'hola' },
          { ru: 'до свидания', target: 'adiós' },
          { ru: 'имя', target: 'nombre' },
          { ru: 'друг', target: 'amigo' },
          { ru: 'семья', target: 'familia' },
          { ru: 'город', target: 'ciudad' },
          { ru: 'страна', target: 'país' },
          { ru: 'учитель', target: 'profesor' }
        ],
        ruPrompts: ['Меня зовут Мария.', 'Я из Испании.', 'Он мой друг.', 'Мы студенты.', 'Это моя семья.']
      },
      {
        topic: 'Rutina diaria',
        summary: 'Повседневные действия в настоящем времени.',
        grammarTitle: 'Presente de indicativo (регулярные глаголы)',
        grammarRule: 'Для привычек: hablo, comes, vive. Окончания зависят от -ar/-er/-ir.',
        grammarExamples: [
          { target: 'Trabajo cada día.', ru: 'Я работаю каждый день.' },
          { target: 'Ella estudia español.', ru: 'Она изучает испанский.' },
          { target: 'Vivimos en Madrid.', ru: 'Мы живем в Мадриде.' }
        ],
        grammarQuiz: [
          { q: 'Выберите верно: "Nosotros ___ en Madrid."', options: ['vivimos', 'vive', 'vivo', 'viven'], ok: 0 },
          { q: 'Как правильно?', options: ['Ella trabaja mucho.', 'Ella trabajo mucho.', 'Ella trabajan mucho.', 'Ella trabajas mucho.'], ok: 0 }
        ],
        vocab: [
          { ru: 'работать', target: 'trabajar' },
          { ru: 'изучать', target: 'estudiar' },
          { ru: 'жить', target: 'vivir' },
          { ru: 'утро', target: 'mañana' },
          { ru: 'вечер', target: 'tarde' },
          { ru: 'дом', target: 'casa' },
          { ru: 'школа', target: 'escuela' },
          { ru: 'время', target: 'tiempo' }
        ],
        ruPrompts: ['Я работаю утром.', 'Она живет в городе.', 'Мы учим испанский.', 'Они дома вечером.', 'У нас урок сегодня.']
      }
    ]
  },
  tr: {
    modules: [
      {
        topic: 'Selamlaşma',
        summary: 'Приветствия и базовое знакомство.',
        grammarTitle: 'Именные предложения (без явного глагола "быть")',
        grammarRule: 'В турецком часто нет отдельного глагола "быть": Ben öğretmenim = Я учитель.',
        grammarExamples: [
          { target: 'Ben öğrenciyim.', ru: 'Я студент.' },
          { target: 'O öğretmen.', ru: 'Он/она учитель.' },
          { target: 'Biz arkadaşız.', ru: 'Мы друзья.' }
        ],
        grammarQuiz: [
          { q: 'Как правильно: "Я студент"?', options: ['Ben öğrenciyim.', 'Ben öğrenci.', 'Ben öğrencisin.', 'Ben öğrenciler.'], ok: 0 },
          { q: 'Выберите верно: "Мы друзья."', options: ['Biz arkadaşız.', 'Biz arkadaşım.', 'Biz arkadaştır.', 'Biz arkadaşsın.'], ok: 0 }
        ],
        vocab: [
          { ru: 'привет', target: 'merhaba' },
          { ru: 'спасибо', target: 'teşekkür ederim' },
          { ru: 'друг', target: 'arkadaş' },
          { ru: 'семья', target: 'aile' },
          { ru: 'город', target: 'şehir' },
          { ru: 'учитель', target: 'öğretmen' },
          { ru: 'ученик', target: 'öğrenci' },
          { ru: 'имя', target: 'isim' }
        ],
        ruPrompts: ['Меня зовут Али.', 'Я из Турции.', 'Это мой друг.', 'Мы студенты.', 'Это мой учитель.']
      },
      {
        topic: 'Günlük hayat',
        summary: 'Речь о ежедневных действиях.',
        grammarTitle: 'Geniş zaman (настоящее общее время)',
        grammarRule: 'Для регулярных действий: gelirim, çalışır, okuruz.',
        grammarExamples: [
          { target: 'Her gün çalışırım.', ru: 'Я работаю каждый день.' },
          { target: 'O Türkçe öğrenir.', ru: 'Он/она учит турецкий.' },
          { target: 'Biz okulda okuruz.', ru: 'Мы учимся в школе.' }
        ],
        grammarQuiz: [
          { q: 'Выберите верно: "Он учит турецкий."', options: ['O Türkçe öğrenir.', 'O Türkçe öğreniyorum.', 'O Türkçe öğrenirsin.', 'O Türkçe öğreniriz.'], ok: 0 },
          { q: 'Как правильно?', options: ['Ben her gün çalışırım.', 'Ben her gün çalışırsın.', 'Ben her gün çalışırız.', 'Ben her gün çalışır.'], ok: 0 }
        ],
        vocab: [
          { ru: 'работать', target: 'çalışmak' },
          { ru: 'учиться', target: 'okumak' },
          { ru: 'жить', target: 'yaşamak' },
          { ru: 'утро', target: 'sabah' },
          { ru: 'вечер', target: 'akşam' },
          { ru: 'дом', target: 'ev' },
          { ru: 'время', target: 'zaman' },
          { ru: 'урок', target: 'ders' }
        ],
        ruPrompts: ['Я живу в Анкаре.', 'Мы учимся утром.', 'Он работает вечером.', 'Урок начинается в девять.', 'Я дома сегодня.']
      }
    ]
  },
  ar: {
    modules: [
      {
        topic: 'التحيات والتعارف',
        summary: 'Приветствия и представление себя.',
        grammarTitle: 'الجملة الاسمية (именное предложение)',
        grammarRule: 'В настоящем часто используется именное предложение без глагола "быть": أنا طالب.',
        grammarExamples: [
          { target: 'أنا طالب.', ru: 'Я студент.' },
          { target: 'هي معلمة.', ru: 'Она учительница.' },
          { target: 'نحن أصدقاء.', ru: 'Мы друзья.' }
        ],
        grammarQuiz: [
          { q: 'Выберите верно: "Я студент".', options: ['أنا طالب.', 'أنا طالبون.', 'أنا طلاب.', 'أنا دراسة.'], ok: 0 },
          { q: 'Как правильно: "Мы друзья"?', options: ['نحن أصدقاء.', 'نحن صديق.', 'أنا أصدقاء.', 'هو أصدقاء.'], ok: 0 }
        ],
        vocab: [
          { ru: 'привет', target: 'مرحبا' },
          { ru: 'спасибо', target: 'شكرا' },
          { ru: 'имя', target: 'اسم' },
          { ru: 'друг', target: 'صديق' },
          { ru: 'семья', target: 'عائلة' },
          { ru: 'город', target: 'مدينة' },
          { ru: 'учитель', target: 'معلم' },
          { ru: 'ученик', target: 'طالب' }
        ],
        ruPrompts: ['Меня зовут Лейла.', 'Я из Египта.', 'Это мой друг.', 'Мы семья.', 'Она учитель.']
      },
      {
        topic: 'الحياة اليومية',
        summary: 'Ежедневные действия и базовые глагольные формы.',
        grammarTitle: 'المضارع (настоящее время)',
        grammarRule: 'Настоящее время строится с префиксами: أنا أ..., أنتَ ت..., هو ي....',
        grammarExamples: [
          { target: 'أنا أدرس العربية.', ru: 'Я изучаю арабский.' },
          { target: 'هو يعمل كل يوم.', ru: 'Он работает каждый день.' },
          { target: 'نحن نسكن في المدينة.', ru: 'Мы живем в городе.' }
        ],
        grammarQuiz: [
          { q: 'Выберите верно: "Я изучаю арабский".', options: ['أنا أدرس العربية.', 'أنا يدرس العربية.', 'أنا تدرس العربية.', 'أنا درس العربية.'], ok: 0 },
          { q: 'Как правильно: "Он работает каждый день"?', options: ['هو يعمل كل يوم.', 'هو أعمل كل يوم.', 'هو نعمل كل يوم.', 'هو تعمل كل يوم.'], ok: 0 }
        ],
        vocab: [
          { ru: 'учить', target: 'يدرس' },
          { ru: 'работать', target: 'يعمل' },
          { ru: 'жить', target: 'يسكن' },
          { ru: 'утро', target: 'صباح' },
          { ru: 'вечер', target: 'مساء' },
          { ru: 'дом', target: 'بيت' },
          { ru: 'школа', target: 'مدرسة' },
          { ru: 'время', target: 'وقت' }
        ],
        ruPrompts: ['Я учусь утром.', 'Он живет в доме.', 'Мы работаем вечером.', 'У меня урок сегодня.', 'Я в школе.']
      }
    ]
  }
};

const GENERIC_TOPIC_RE = {
  en: /^(unit|lesson|chapter|module|section|topic)\s*[\divx\-.:]*/i,
  es: /^(unidad|leccion|lección|tema|capitulo|capítulo|seccion|sección)\s*[\divx\-.:]*/i,
  tr: /^(unite|ünite|ders|bolum|bölüm|konu)\s*[\divx\-.:]*/i,
  ar: /^(الوحدة|الدرس|الفصل|الموضوع)\s*[\divx\-.:]*/i
};

const DEFAULT_PATH_BY_LANG = {
  en: [
    { topic: 'Greetings and Introductions', grammarTitle: 'To be: am / is / are', grammarRule: 'Говорим о себе и других через am/is/are.' },
    { topic: 'Family and Possessives', grammarTitle: 'Have got + possessive adjectives', grammarRule: 'Используем have got и my/your/his/her для семьи и вещей.' },
    { topic: 'Numbers, Time and Dates', grammarTitle: 'There is / There are + time expressions', grammarRule: 'Описываем количество и время в базовых фразах.' },
    { topic: 'Daily Routine', grammarTitle: 'Present Simple', grammarRule: 'Рассказываем о привычках: I work, she works.' },
    { topic: 'Home and City', grammarTitle: 'Prepositions of place', grammarRule: 'in/on/under/next to для описания местоположения.' },
    { topic: 'Food and Shopping', grammarTitle: 'Countable/uncountable + some/any', grammarRule: 'Различаем исчисляемые и неисчисляемые существительные.' },
    { topic: 'Past Events', grammarTitle: 'Past Simple', grammarRule: 'Описываем завершенные действия в прошлом.' },
    { topic: 'Plans and Future', grammarTitle: 'Going to / will', grammarRule: 'Говорим о планах и спонтанных решениях.' },
    { topic: 'Travel and Directions', grammarTitle: 'Imperatives and can', grammarRule: 'Даём инструкции и спрашиваем дорогу.' },
    { topic: 'Opinions and Comparison', grammarTitle: 'Comparatives and superlatives', grammarRule: 'Сравниваем предметы, города и варианты.' }
  ],
  es: [
    { topic: 'Saludos y presentaciones', grammarTitle: 'Ser: soy / eres / es / somos', grammarRule: 'Ser для имени, происхождения и профессии.' },
    { topic: 'Familia y posesivos', grammarTitle: 'Tener + adjetivos posesivos', grammarRule: 'Выражаем принадлежность и семейные связи.' },
    { topic: 'Números, hora y fecha', grammarTitle: 'Hay + expresiones de tiempo', grammarRule: 'Описываем количество, дату и время.' },
    { topic: 'Rutina diaria', grammarTitle: 'Presente de indicativo', grammarRule: 'Говорим о повседневных действиях в настоящем времени.' },
    { topic: 'Casa y ciudad', grammarTitle: 'Estar + preposiciones de lugar', grammarRule: 'Показываем, где что находится.' },
    { topic: 'Comida y compras', grammarTitle: 'Me gusta / Quiero + artículos', grammarRule: 'Просим, выбираем и говорим о предпочтениях.' },
    { topic: 'Pasado básico', grammarTitle: 'Pretérito perfecto / indefinido', grammarRule: 'Рассказываем о прошлом опыте и завершенных событиях.' },
    { topic: 'Planes y futuro', grammarTitle: 'Ir a + infinitivo', grammarRule: 'Говорим о ближайших планах.' },
    { topic: 'Viajes y direcciones', grammarTitle: 'Imperativo afirmativo', grammarRule: 'Даём простые инструкции и маршруты.' },
    { topic: 'Opiniones y comparación', grammarTitle: 'Comparativos y superlativos', grammarRule: 'Сравниваем объекты и варианты.' }
  ],
  tr: [
    { topic: 'Selamlaşma ve tanışma', grammarTitle: 'İsim cümleleri', grammarRule: 'Базовые представления без отдельного глагола "быть".' },
    { topic: 'Aile ve sahiplik', grammarTitle: 'İyelik ekleri', grammarRule: 'Показываем принадлежность с притяжательными окончаниями.' },
    { topic: 'Sayılar, saat ve tarih', grammarTitle: 'Var / Yok + zaman ifadeleri', grammarRule: 'Описываем количество и время.' },
    { topic: 'Günlük hayat', grammarTitle: 'Geniş zaman', grammarRule: 'Регулярные действия и привычки.' },
    { topic: 'Ev ve şehir', grammarTitle: 'Bulunma hali (-de/-da)', grammarRule: 'Описываем местоположение предметов и людей.' },
    { topic: 'Yemek ve alışveriş', grammarTitle: 'İstemek ve rica kalıpları', grammarRule: 'Просим, заказываем и говорим о предпочтениях.' },
    { topic: 'Geçmiş deneyimler', grammarTitle: 'Geçmiş zaman (-di)', grammarRule: 'Говорим о завершенных действиях в прошлом.' },
    { topic: 'Gelecek planları', grammarTitle: 'Gelecek zaman (-ecek)', grammarRule: 'Рассказываем о планах и намерениях.' },
    { topic: 'Yol tarifi ve ulaşım', grammarTitle: 'Emir kipi + modal kalıplar', grammarRule: 'Даем короткие инструкции.' },
    { topic: 'Karşılaştırmalar ve fikirler', grammarTitle: 'Karşılaştırma yapıları', grammarRule: 'Сравниваем варианты и выражаем мнение.' }
  ],
  ar: [
    { topic: 'التحيات والتعارف', grammarTitle: 'الجملة الاسمية', grammarRule: 'Базовые утверждения в настоящем без отдельного "быть".' },
    { topic: 'الأسرة والملكية', grammarTitle: 'الإضافة والضمائر المتصلة', grammarRule: 'Показываем принадлежность и родственные связи.' },
    { topic: 'الأرقام والوقت', grammarTitle: 'تراكيب الوقت والعدد', grammarRule: 'Описываем количество, дату и время.' },
    { topic: 'الحياة اليومية', grammarTitle: 'المضارع', grammarRule: 'Повседневные действия в настоящем времени.' },
    { topic: 'البيت والمدينة', grammarTitle: 'حروف الجر: في / على / تحت', grammarRule: 'Описываем местоположение.' },
    { topic: 'الطعام والتسوق', grammarTitle: 'أريد / أحب + المفرد والجمع', grammarRule: 'Просим, выбираем и говорим о предпочтениях.' },
    { topic: 'أحداث الماضي', grammarTitle: 'الفعل الماضي', grammarRule: 'Рассказываем о завершенных действиях.' },
    { topic: 'الخطط المستقبلية', grammarTitle: 'سوف / سـ', grammarRule: 'Говорим о планах на будущее.' },
    { topic: 'السفر والاتجاهات', grammarTitle: 'صيغة الأمر', grammarRule: 'Даем краткие инструкции и маршруты.' },
    { topic: 'المقارنة وإبداء الرأي', grammarTitle: 'أفعل التفضيل وتراكيب الرأي', grammarRule: 'Сравниваем и выражаем мнение.' }
  ]
};

const TOPIC_KEYWORDS_BY_LANG = {
  en: [
    { topic: 'Greetings and Introductions', keys: ['hello', 'name', 'introduc', 'greet', 'meet'] },
    { topic: 'Family and Possessives', keys: ['family', 'mother', 'father', 'sister', 'brother'] },
    { topic: 'Numbers, Time and Dates', keys: ['time', 'clock', 'date', 'number', 'today'] },
    { topic: 'Daily Routine', keys: ['daily', 'routine', 'every day', 'usually', 'always'] },
    { topic: 'Home and City', keys: ['home', 'house', 'room', 'city', 'street'] },
    { topic: 'Food and Shopping', keys: ['food', 'eat', 'drink', 'shop', 'market'] },
    { topic: 'Travel and Directions', keys: ['travel', 'station', 'map', 'direction', 'bus'] }
  ],
  es: [
    { topic: 'Saludos y presentaciones', keys: ['hola', 'saludo', 'present', 'nombre', 'llamo'] },
    { topic: 'Familia y posesivos', keys: ['familia', 'madre', 'padre', 'hermano', 'hermana'] },
    { topic: 'Números, hora y fecha', keys: ['hora', 'fecha', 'numero', 'número', 'minuto'] },
    { topic: 'Rutina diaria', keys: ['rutina', 'cada dia', 'cada día', 'siempre', 'normalmente'] },
    { topic: 'Casa y ciudad', keys: ['casa', 'ciudad', 'calle', 'barrio', 'habitacion', 'habitación'] },
    { topic: 'Comida y compras', keys: ['comida', 'restaurante', 'comprar', 'mercado', 'menu', 'menú'] },
    { topic: 'Viajes y direcciones', keys: ['viaje', 'estacion', 'estación', 'mapa', 'direccion', 'dirección'] }
  ],
  tr: [
    { topic: 'Selamlaşma ve tanışma', keys: ['merhaba', 'tanisma', 'tanışma', 'adim', 'adım'] },
    { topic: 'Aile ve sahiplik', keys: ['aile', 'anne', 'baba', 'kardes', 'kardeş'] },
    { topic: 'Sayılar, saat ve tarih', keys: ['saat', 'tarih', 'sayi', 'sayı', 'dakika'] },
    { topic: 'Günlük hayat', keys: ['gunluk', 'günlük', 'her gun', 'her gün', 'genis zaman', 'geniş zaman'] },
    { topic: 'Ev ve şehir', keys: ['ev', 'sehir', 'şehir', 'oda', 'sokak'] },
    { topic: 'Yemek ve alışveriş', keys: ['yemek', 'restoran', 'alisveris', 'alışveriş', 'market'] },
    { topic: 'Yol tarifi ve ulaşım', keys: ['yol', 'otobus', 'otobüs', 'harita', 'durak'] }
  ],
  ar: [
    { topic: 'التحيات والتعارف', keys: ['مرحبا', 'السلام', 'الاسم', 'تعارف'] },
    { topic: 'الأسرة والملكية', keys: ['اسرة', 'أسرة', 'ام', 'أم', 'اب', 'أب', 'اخ', 'أخ'] },
    { topic: 'الأرقام والوقت', keys: ['ساعة', 'وقت', 'تاريخ', 'رقم'] },
    { topic: 'الحياة اليومية', keys: ['يومي', 'روتين', 'عادة', 'كل يوم'] },
    { topic: 'البيت والمدينة', keys: ['بيت', 'منزل', 'مدينة', 'شارع', 'غرفة'] },
    { topic: 'الطعام والتسوق', keys: ['طعام', 'ماء', 'مطعم', 'سوق', 'شراء'] },
    { topic: 'السفر والاتجاهات', keys: ['سفر', 'طريق', 'محطة', 'اتجاه', 'خريطة'] }
  ]
};

const GRAMMAR_HINTS_BY_LANG = {
  en: [
    { keys: ['present simple', 'every day', 'usually'], grammarTitle: 'Present Simple', grammarRule: 'Привычки и регулярные действия: I work, she works.' },
    { keys: ['past simple', 'yesterday', 'last'], grammarTitle: 'Past Simple', grammarRule: 'Завершенные действия в прошлом.' },
    { keys: ['future', 'going to', 'will'], grammarTitle: 'Going to / will', grammarRule: 'Ближайшие планы и будущие решения.' },
    { keys: ['there is', 'there are'], grammarTitle: 'There is / There are', grammarRule: 'Описываем наличие объектов.' }
  ],
  es: [
    { keys: ['presente', 'cada día', 'cada dia'], grammarTitle: 'Presente de indicativo', grammarRule: 'Повседневные действия в настоящем времени.' },
    { keys: ['pretérito', 'pasado', 'ayer'], grammarTitle: 'Pretérito básico', grammarRule: 'Действия в прошлом и недавние события.' },
    { keys: ['futuro', 'ir a'], grammarTitle: 'Ir a + infinitivo', grammarRule: 'Планы и намерения на ближайшее будущее.' },
    { keys: ['ser', 'estar'], grammarTitle: 'Ser y Estar', grammarRule: 'Различаем постоянные характеристики и состояния.' }
  ],
  tr: [
    { keys: ['geniş zaman', 'genis zaman', 'her gün', 'her gun'], grammarTitle: 'Geniş zaman', grammarRule: 'Регулярные действия и привычки.' },
    { keys: ['geçmiş zaman', 'gecmis zaman', '-di'], grammarTitle: 'Geçmiş zaman (-di)', grammarRule: 'Завершенные действия в прошлом.' },
    { keys: ['gelecek zaman', '-ecek'], grammarTitle: 'Gelecek zaman (-ecek)', grammarRule: 'Будущие планы и намерения.' },
    { keys: ['-de', '-da', 'bulunma'], grammarTitle: 'Bulunma hali (-de/-da)', grammarRule: 'Местоположение предметов и людей.' }
  ],
  ar: [
    { keys: ['المضارع', 'كل يوم'], grammarTitle: 'المضارع', grammarRule: 'Регулярные действия в настоящем времени.' },
    { keys: ['الماضي', 'أمس', 'امس'], grammarTitle: 'الفعل الماضي', grammarRule: 'Завершенные действия в прошлом.' },
    { keys: ['سوف', 'المستقبل'], grammarTitle: 'سوف / سـ', grammarRule: 'Планы и намерения в будущем времени.' },
    { keys: ['في', 'على', 'تحت'], grammarTitle: 'حروف الجر الأساسية', grammarRule: 'Описание местоположения через базовые предлоги.' }
  ]
};

const GLOSSARY_BY_LANG = {
  en: {
    hello: 'привет', goodbye: 'до свидания', name: 'имя', family: 'семья', friend: 'друг',
    city: 'город', country: 'страна', school: 'школа', teacher: 'учитель', student: 'ученик',
    house: 'дом', room: 'комната', street: 'улица', food: 'еда', water: 'вода',
    bread: 'хлеб', coffee: 'кофе', work: 'работа', study: 'учеба', time: 'время',
    morning: 'утро', evening: 'вечер', travel: 'путешествие', train: 'поезд', bus: 'автобус',
    map: 'карта', hospital: 'больница', doctor: 'врач', market: 'рынок', shop: 'магазин',
    question: 'вопрос', answer: 'ответ', language: 'язык', grammar: 'грамматика', word: 'слово'
  },
  es: {
    hola: 'привет', adios: 'до свидания', adiós: 'до свидания', nombre: 'имя', familia: 'семья',
    amigo: 'друг', ciudad: 'город', pais: 'страна', país: 'страна', escuela: 'школа',
    profesor: 'учитель', estudiante: 'ученик', casa: 'дом', habitacion: 'комната', habitación: 'комната',
    calle: 'улица', comida: 'еда', agua: 'вода', pan: 'хлеб', cafe: 'кофе', café: 'кофе',
    trabajo: 'работа', estudiar: 'учиться', tiempo: 'время', manana: 'утро', mañana: 'утро',
    tarde: 'вечер', viaje: 'путешествие', tren: 'поезд', autobus: 'автобус', autobús: 'автобус',
    mapa: 'карта', hospital: 'больница', medico: 'врач', médico: 'врач', mercado: 'рынок',
    tienda: 'магазин', pregunta: 'вопрос', respuesta: 'ответ', idioma: 'язык', palabra: 'слово'
  },
  tr: {
    merhaba: 'привет', gulegule: 'до свидания', gülegüle: 'до свидания', isim: 'имя', aile: 'семья',
    arkadas: 'друг', arkadaş: 'друг', sehir: 'город', şehir: 'город', ulke: 'страна', ülke: 'страна',
    okul: 'школа', ogretmen: 'учитель', öğretmen: 'учитель', ogrenci: 'ученик', öğrenci: 'ученик',
    ev: 'дом', oda: 'комната', sokak: 'улица', yemek: 'еда', su: 'вода', ekmek: 'хлеб',
    kahve: 'кофе', calisma: 'работа', çalışma: 'работа', ders: 'урок', zaman: 'время',
    sabah: 'утро', aksam: 'вечер', akşam: 'вечер', yolculuk: 'путешествие', tren: 'поезд',
    otobus: 'автобус', otobüs: 'автобус', harita: 'карта', hastane: 'больница', doktor: 'врач',
    market: 'магазин', soru: 'вопрос', cevap: 'ответ', dil: 'язык', kelime: 'слово'
  },
  ar: {
    'مرحبا': 'привет', 'السلام': 'приветствие', 'اسم': 'имя', 'صديق': 'друг', 'اسرة': 'семья', 'أسرة': 'семья',
    'مدينة': 'город', 'بلد': 'страна', 'مدرسة': 'школа', 'معلم': 'учитель', 'طالب': 'ученик',
    'بيت': 'дом', 'غرفة': 'комната', 'شارع': 'улица', 'طعام': 'еда', 'ماء': 'вода',
    'خبز': 'хлеб', 'قهوة': 'кофе', 'عمل': 'работа', 'درس': 'урок', 'وقت': 'время',
    'صباح': 'утро', 'مساء': 'вечер', 'سفر': 'путешествие', 'قطار': 'поезд', 'حافلة': 'автобус',
    'خريطة': 'карта', 'مستشفى': 'больница', 'طبيب': 'врач', 'سوق': 'рынок', 'متجر': 'магазин',
    'سؤال': 'вопрос', 'جواب': 'ответ', 'لغة': 'язык', 'كلمة': 'слово'
  }
};

const STOPWORDS_BY_LANG = {
  en: new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'has', 'are', 'was', 'were', 'you', 'your', 'our', 'their', 'about', 'into', 'there', 'here']),
  es: new Set(['que', 'para', 'con', 'una', 'uno', 'los', 'las', 'del', 'por', 'como', 'esta', 'este', 'estos', 'estas', 'pero', 'muy', 'más', 'mas']),
  tr: new Set(['ve', 'ile', 'bir', 'bu', 'şu', 'icin', 'için', 'ama', 'çok', 'cok', 'daha', 'gibi', 'olan', 'olarak']),
  ar: new Set(['هذا', 'هذه', 'ذلك', 'الى', 'إلى', 'على', 'في', 'من', 'عن', 'هو', 'هي', 'نحن', 'هم', 'ثم', 'أو', 'او'])
};

const state = {
  files: [],
  extractedText: '',
  detectedLang: 'unknown',
  materialThemes: [],
  steps: [],
  currentStep: 0,
  pendingCards: [],
  approvedCards: [],
  streak: 0,
  lastActiveDate: null,
  timerSeconds: 1500,
  timerRunning: false,
  timerDefaultMinutes: 25,
  authUser: null,
  parseMode: 'accurate',
  profile: { language: 'Английский', level: 'A1', targetLevel: 'B1', hours: 5 }
};

let timerId = null;
bindEvents();
restoreState();
initGoogleAuth();
renderAll();

function bindEvents() {
  ui.registerBtn.addEventListener('click', registerUser);
  ui.loginBtn.addEventListener('click', loginUser);
  ui.fileInput.addEventListener('change', async (e) => handleSelectedFiles(Array.from(e.target.files || [])));
  ui.dropzone.addEventListener('dragover', (e) => { e.preventDefault(); ui.dropzone.classList.add('drag'); });
  ui.dropzone.addEventListener('dragleave', () => ui.dropzone.classList.remove('drag'));
  ui.dropzone.addEventListener('drop', async (e) => {
    e.preventDefault();
    ui.dropzone.classList.remove('drag');
    await handleSelectedFiles(Array.from(e.dataTransfer?.files || []));
  });
  ui.buildPlanBtn.addEventListener('click', buildPlanFlow);
  ui.nextTopicBtn.addEventListener('click', nextTopic);
  ui.completeTopicBtn.addEventListener('click', completeTopic);
  ui.checkTasksBtn.addEventListener('click', checkTaskAnswers);
  ui.aiQuizBtn.addEventListener('click', generateAiQuiz);
  ui.checkQuizBtn.addEventListener('click', checkQuiz);
  ui.approveCardsBtn.addEventListener('click', approveSelectedCards);
  ui.exportAnkiBtn.addEventListener('click', exportAnkiCsv);
  ui.startTimerBtn.addEventListener('click', startTimer);
  ui.pauseTimerBtn.addEventListener('click', pauseTimer);
  ui.resetTimerBtn.addEventListener('click', resetTimer);
  if (ui.parseMode) {
    ui.parseMode.addEventListener('change', () => {
      state.parseMode = ui.parseMode.value || 'accurate';
      persistState();
    });
  }
}

function initGoogleAuth() {
  if (!window.google || GOOGLE_CLIENT_ID === 'PASTE_GOOGLE_CLIENT_ID_HERE') return;
  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleCredential
  });
  window.google.accounts.id.renderButton(ui.googleSignInWrap, {
    theme: 'outline',
    size: 'large',
    text: 'signin_with'
  });
}

function handleGoogleCredential(response) {
  try {
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    state.authUser = payload.email || payload.sub;
    ui.authOverlay.style.display = 'none';
    persistState();
  } catch {
    ui.authMsg.textContent = 'Ошибка входа через Google.';
  }
}

function registerUser() {
  const email = ui.authEmail.value.trim().toLowerCase();
  const password = ui.authPassword.value;
  if (!email || !password) {
    ui.authMsg.textContent = 'Введите email и пароль.';
    return;
  }
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  if (users[email]) {
    ui.authMsg.textContent = 'Пользователь уже существует.';
    return;
  }
  users[email] = { password };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  ui.authMsg.textContent = 'Регистрация успешна. Теперь войдите.';
}

function loginUser() {
  const email = ui.authEmail.value.trim().toLowerCase();
  const password = ui.authPassword.value;
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  if (!users[email] || users[email].password !== password) {
    ui.authMsg.textContent = 'Неверные данные.';
    return;
  }
  state.authUser = email;
  ui.authOverlay.style.display = 'none';
  persistState();
}

async function handleSelectedFiles(files) {
  if (!files.length) return;
  state.files = files;
  state.extractedText = '';
  state.materialThemes = [];
  ui.extractStatus.textContent = `Загружено файлов: ${files.length}. Обрабатываю...`;
  renderFileList();
  ui.buildPlanBtn.disabled = true;

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    ui.extractStatus.textContent = `Обработка файла ${i + 1}/${files.length}: ${file.name}`;
    const text = await extractTextFromSingleFile(file, i + 1, files.length);
    state.extractedText += `\n${text}`;
    state.detectedLang = detectLanguage(state.extractedText);
    const selectedLang = state.detectedLang !== 'unknown' ? state.detectedLang : getLanguageKey(state.profile.language);
    state.materialThemes = extractThemesInOrder(state.extractedText, selectedLang);
    ui.extractStatus.textContent = `Обработано ${i + 1}/${files.length}. Язык: ${LANGUAGE_LABEL_BY_KEY[state.detectedLang] || 'не определен'}. Найдено тем: ${state.materialThemes.length}.`;
    ui.buildPlanBtn.disabled = state.materialThemes.length === 0;
    persistState();
  }

  ui.extractStatus.textContent = `Готово. Язык: ${LANGUAGE_LABEL_BY_KEY[state.detectedLang] || 'не определен'}. Найдено тем: ${state.materialThemes.length}. Можно строить план.`;
  ui.buildPlanBtn.disabled = state.materialThemes.length === 0;
}

async function extractTextFromSingleFile(file, fileNo, totalFiles) {
  const name = file.name.toLowerCase();
  if (name.endsWith('.txt') || name.endsWith('.md')) {
    return (await file.text()).slice(0, 120000);
  }
  if (name.endsWith('.docx') && window.mammoth) {
    try {
      const arr = await file.arrayBuffer();
      const result = await window.mammoth.extractRawText({ arrayBuffer: arr });
      return (result.value || '').slice(0, 120000);
    } catch {
      return '';
    }
  }
  if (name.endsWith('.pdf')) {
    try {
      const arr = await file.arrayBuffer();
      return await parsePdf(arr, (page, totalPages, mode) => {
        ui.extractStatus.textContent = `Файл ${fileNo}/${totalFiles}: страница ${page}/${totalPages} (${mode})`;
      });
    } catch {
      return '';
    }
  }
  return '';
}

async function parsePdf(arrayBuffer, statusCb) {
  const pdfjsLib = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@4.5.136/build/pdf.min.mjs');
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.5.136/build/pdf.worker.min.mjs';
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const cfg = getPdfModeConfig();
  const pageLimit = Math.min(cfg.pageLimit, pdf.numPages);
  let usedOcr = 0;
  const chunks = [];

  for (let p = 1; p <= pageLimit; p += 1) {
    const page = await pdf.getPage(p);
    const textContent = await page.getTextContent();
    const textLayer = extractPageTextLines(textContent.items);
    const cleaned = normalizeExtractedText(textLayer);
    if (!isGarbageText(cleaned)) {
      chunks.push(cleaned);
      if (statusCb) statusCb(p, pageLimit, 'text');
      continue;
    }
    if (usedOcr >= cfg.ocrLimit) {
      if (statusCb) statusCb(p, pageLimit, 'skip');
      continue;
    }
    usedOcr += 1;
    const ocrText = await ocrPdfPage(page, cfg.scale);
    chunks.push(normalizeExtractedText(ocrText));
    if (statusCb) statusCb(p, pageLimit, 'ocr');
  }

  return chunks.join('\n');
}

async function ocrPdfPage(page, scale) {
  if (!window.Tesseract) return '';
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  await page.render({ canvasContext: ctx, viewport }).promise;
  const lang = 'eng+spa+tur+ara';
  const result = await window.Tesseract.recognize(canvas, lang);
  return result?.data?.text || '';
}

function detectLanguage(text) {
  const sample = normalizeExtractedText(text).slice(0, 40000);
  const norm = normalizeLookupToken(sample, 'en');
  const ar = (sample.match(/[\u0600-\u06FF]/g) || []).length;
  const tr = (norm.match(/\b(ve|bir|bu|icin|ile|ama|cok|su|degil|turkce)\b/gi) || []).length;
  const es = (norm.match(/\b(el|la|los|las|de|que|para|con|por|una|uno|esta|ser|hola|gracias)\b/gi) || []).length;
  const en = (norm.match(/\b(the|and|with|have|this|that|from|there|would|could)\b/gi) || []).length;
  if (ar > 60) return 'ar';
  if (tr > es && tr > 8) return 'tr';
  if (es > 8) return 'es';
  if (en > 8) return 'en';
  return 'unknown';
}

function extractThemesInOrder(text, langKey) {
  const normalized = normalizeExtractedText(text);
  const lines = normalized.split('\n').map(x => x.trim()).filter(Boolean);
  if (!lines.length) return [];

  const headingRe = getHeadingRegex(langKey);
  const headingIndexes = [];

  lines.forEach((line, index) => {
    if (
      headingRe.test(line) ||
      /^\d{1,2}([\.\)]|\.\d{1,2})\s+\p{L}{3,}/u.test(line) ||
      /^[ivxlcdm]+\.\s+\p{L}{3,}/iu.test(line)
    ) {
      headingIndexes.push(index);
    }
  });

  const sections = [];
  if (headingIndexes.length >= 3) {
    for (let i = 0; i < headingIndexes.length; i += 1) {
      const start = headingIndexes[i];
      const end = i + 1 < headingIndexes.length ? headingIndexes[i + 1] : lines.length;
      const blockLines = lines.slice(start, end);
      sections.push(buildSectionFromLines(blockLines, langKey));
    }
  } else {
    // fallback: chunks if headings are damaged by OCR
    const chunks = splitBySize(normalized, 2200);
    for (let i = 0; i < chunks.length; i += 1) {
      const chunkLines = chunks[i].split('\n').map(x => x.trim()).filter(Boolean);
      sections.push(buildSectionFromLines([`Section ${i + 1}`, ...chunkLines], langKey));
    }
  }

  const deduped = dedupeSectionTitles(sections).filter(s => s.title);
  return deduped.slice(0, 80);
}

function getHeadingRegex(langKey) {
  if (langKey === 'es') return /^(unidad|lección|leccion|tema|capítulo|capitulo|sección|seccion)\b/i;
  if (langKey === 'tr') return /^(ünite|unite|ders|bölüm|bolum|konu)\b/i;
  if (langKey === 'ar') return /^(الوحدة|الدرس|الفصل|الموضوع)\b/i;
  return /^(unit|lesson|chapter|module|section|topic)\b/i;
}

function buildSectionFromLines(lines, langKey) {
  const titleRaw = lines[0] || '';
  const title = sanitizeTitle(titleRaw);
  const bodyLines = lines.slice(1);
  const chunk = bodyLines.join('\n');
  return {
    title,
    chunk,
    summary: summarizeChunk(chunk),
    exercises: extractExercisesFromLines(bodyLines, langKey)
  };
}

function sanitizeTitle(title) {
  return String(title || '')
    .replace(/^(тема|section|unit|lesson|chapter|module|topic|unidad|leccion|lección|capitulo|capítulo|tema|unite|ünite|ders|bolum|bölüm|konu|الوحدة|الدرس|الفصل|الموضوع)\s*[\divx]+[:.\-]*/i, '')
    .replace(/\s+\d{1,3}$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function dedupeSectionTitles(sections) {
  const counts = new Map();
  return sections.map((s) => {
    const key = (s.title || '').toLowerCase() || 'untitled';
    const n = (counts.get(key) || 0) + 1;
    counts.set(key, n);
    return n === 1 ? s : { ...s, title: `${s.title} (часть ${n})` };
  });
}

function summarizeChunk(chunk) {
  const sentences = chunk
    .split(/(?<=[.!?؟])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20);
  return sentences.slice(0, 2).join(' ').slice(0, 360);
}

function extractExercisesFromLines(lines, langKey) {
  const patterns = {
    en: [/^exercise\b/i, /^activity\b/i, /^task\b/i, /^practice\b/i, /\b(fill|match|translate|choose|write|complete)\b/i],
    es: [/^ejercicio\b/i, /^actividad\b/i, /^práctica\b/i, /^completa\b/i, /^elige\b/i, /^escribe\b/i, /\b(traduce|relaciona|responde)\b/i],
    tr: [/^alıştırma\b/i, /^etkinlik\b/i, /^görev\b/i, /^tamamla\b/i, /^yaz\b/i, /\b(çevir|eşleştir|seç)\b/i],
    ar: [/^تمرين\b/i, /^نشاط\b/i, /^اكتب\b/i, /^أكمل\b/i, /\b(ترجم|اختر|اجب|أجب)\b/i]
  }[langKey] || [/^exercise\b/i];

  const instructionWords = {
    en: ['fill', 'match', 'translate', 'choose', 'write', 'complete', 'answer'],
    es: ['completa', 'elige', 'traduce', 'escribe', 'responde', 'relaciona'],
    tr: ['tamamla', 'çevir', 'esleştir', 'eşleştir', 'seç', 'yaz', 'cevapla'],
    ar: ['اكمل', 'أكمل', 'ترجم', 'اختر', 'اكتب', 'اجب', 'أجب']
  }[langKey] || ['exercise'];

  const out = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.length < 8) continue;
    if (/^\d+\s*$/.test(line)) continue;
    if (/\.{3,}\s*\d+$/.test(line)) continue;
    const numbered = /^\d{1,2}[\.\)]\s+/.test(line) || /^(exercise|ejercicio|alıştırma|تمرين)\s*\d+/i.test(line);
    const matched = patterns.some(re => re.test(line));
    const lineLow = normalizeLookupToken(line, langKey);
    const hasInstructionWord = instructionWords.some((w) => lineLow.includes(normalizeLookupToken(w, langKey)));
    if (matched || (numbered && hasInstructionWord)) {
      out.push(line);
    }
    if (out.length >= 8) break;
  }
  return unique(out);
}

function getDefaultPathPoint(langKey, idx) {
  const path = DEFAULT_PATH_BY_LANG[langKey] || DEFAULT_PATH_BY_LANG.en;
  return path[idx % path.length];
}

function pickModuleForSection(pack, section, idx, langKey) {
  const base = pack.modules[idx % pack.modules.length];
  const byKeywords = inferTopicByKeywords(`${section.title}\n${section.chunk}`, langKey);
  if (!byKeywords) return base;
  const candidate = pack.modules.find((m) => normalizeLookupToken(m.topic, langKey).includes(normalizeLookupToken(byKeywords, langKey)));
  return candidate || base;
}

function resolveTopicTitle(section, langKey, fallbackPathTopic, moduleTopic, idx) {
  const cleanTitle = sanitizeTitle(section.title || '');
  if (cleanTitle && !isGenericTopicTitle(cleanTitle, langKey) && cleanTitle.length > 4) return cleanTitle;
  const inferred = inferTopicByKeywords(`${section.title}\n${section.chunk}`, langKey);
  if (inferred) return inferred;
  if (fallbackPathTopic) return fallbackPathTopic;
  return moduleTopic || `Topic ${idx + 1}`;
}

function isGenericTopicTitle(title, langKey) {
  const t = String(title || '').trim();
  if (!t) return true;
  if (/^\d{1,3}$/.test(t)) return true;
  const re = GENERIC_TOPIC_RE[langKey] || GENERIC_TOPIC_RE.en;
  return re.test(t);
}

function inferTopicByKeywords(text, langKey) {
  const source = normalizeLookupToken(text, langKey);
  const rows = TOPIC_KEYWORDS_BY_LANG[langKey] || TOPIC_KEYWORDS_BY_LANG.en;
  for (const row of rows) {
    if (row.keys.some((k) => source.includes(normalizeLookupToken(k, langKey)))) return row.topic;
  }
  return '';
}

function inferGrammarInfo(section, langKey, fallbackPathPoint, module) {
  const source = normalizeLookupToken(`${section.title}\n${section.chunk}`, langKey);
  const hints = GRAMMAR_HINTS_BY_LANG[langKey] || GRAMMAR_HINTS_BY_LANG.en;
  for (const hint of hints) {
    if (hint.keys.some((k) => source.includes(normalizeLookupToken(k, langKey)))) {
      return { grammarTitle: hint.grammarTitle, grammarRule: hint.grammarRule };
    }
  }
  if (fallbackPathPoint?.grammarTitle) {
    return {
      grammarTitle: fallbackPathPoint.grammarTitle,
      grammarRule: fallbackPathPoint.grammarRule || module.grammarRule
    };
  }
  return { grammarTitle: module.grammarTitle, grammarRule: module.grammarRule };
}

function extractTopicVocabulary(chunk, langKey, fallbackVocab) {
  const glossary = GLOSSARY_BY_LANG[langKey] || GLOSSARY_BY_LANG.en;
  const stopwords = STOPWORDS_BY_LANG[langKey] || STOPWORDS_BY_LANG.en;
  const tokens = tokenizeWordsByLanguage(chunk, langKey);
  const freq = new Map();

  for (const raw of tokens) {
    const normalized = normalizeLookupToken(raw, langKey);
    if (!normalized || normalized.length < 2) continue;
    if (stopwords.has(normalized)) continue;
    if (!glossary[normalized]) continue;
    const rec = freq.get(normalized) || { count: 0, sample: raw.toLowerCase() };
    rec.count += 1;
    if (!rec.sample || rec.sample.length < raw.length) rec.sample = raw.toLowerCase();
    freq.set(normalized, rec);
  }

  const extracted = [...freq.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([k, v]) => ({ ru: glossary[k], target: v.sample }));

  const merged = [];
  const pushPair = (pair) => {
    if (!pair?.ru || !pair?.target) return;
    const key = `${normalizeLookupToken(pair.ru, 'en')}::${normalizeLookupToken(pair.target, langKey)}`;
    if (merged.find(m => `${normalizeLookupToken(m.ru, 'en')}::${normalizeLookupToken(m.target, langKey)}` === key)) return;
    merged.push({ ru: String(pair.ru).trim(), target: String(pair.target).trim() });
  };

  extracted.forEach(pushPair);
  (fallbackVocab || []).forEach(pushPair);
  return merged.slice(0, 8);
}

function buildRuPrompts(vocabPairs, fallbackPrompts) {
  const words = vocabPairs.slice(0, 6).map(v => v.ru).filter(Boolean);
  if (words.length < 4) return fallbackPrompts;
  return [
    `Это мой/моя ${words[0]}.`,
    `Где находится ${words[1]}?`,
    `Сегодня мне нужен/нужна ${words[2]}.`,
    `Я говорю о теме: ${words[3]}.`,
    `Мы используем слова ${words[0]} и ${words[4] || words[1]}.`
  ];
}

function tokenizeWordsByLanguage(text, langKey) {
  const source = normalizeExtractedText(text || '');
  if (!source) return [];
  if (langKey === 'ar') return source.match(/[\u0600-\u06FF]{2,}/g) || [];
  return source.match(/[\p{L}][\p{L}'’-]{1,}/gu) || [];
}

function buildPlanFlow() {
  syncProfile();
  touchActivity();
  const langKey = state.detectedLang !== 'unknown' ? state.detectedLang : getLanguageKey(state.profile.language);
  const pack = LANGUAGE_PACKS[langKey] || LANGUAGE_PACKS.en;
  const sections = state.materialThemes.length ? state.materialThemes : pack.modules.map((m) => ({
    title: m.topic,
    summary: m.summary,
    exercises: [],
    chunk: ''
  }));

  state.steps = ensureUniqueStepTitles(sections.map((section, idx) => composeStep(section, idx, pack, langKey)));
  state.currentStep = 0;
  state.pendingCards = state.steps[0] ? buildCards(state.steps[0]) : [];
  state.approvedCards = [];
  persistState();
  renderAll();
}

function composeStep(section, idx, pack, langKey) {
  const module = pickModuleForSection(pack, section, idx, langKey);
  const fallbackPathPoint = getDefaultPathPoint(langKey, idx);
  const grammarInfo = inferGrammarInfo(section, langKey, fallbackPathPoint, module);
  const vocabPairs = extractTopicVocabulary(section.chunk, langKey, module.vocab);
  const ruPrompts = buildRuPrompts(vocabPairs, module.ruPrompts);
  const title = resolveTopicTitle(section, langKey, fallbackPathPoint.topic, module.topic, idx);
  const grammarExamples = Array.isArray(module.grammarExamples) && module.grammarExamples.length
    ? module.grammarExamples
    : pack.modules[0].grammarExamples;
  const grammarQuiz = Array.isArray(module.grammarQuiz) && module.grammarQuiz.length
    ? module.grammarQuiz
    : pack.modules[0].grammarQuiz;
  return {
    id: `${idx}-${Date.now()}`,
    topic: title,
    summary: section.summary || module.summary,
    grammarTitle: grammarInfo.grammarTitle,
    grammarRule: grammarInfo.grammarRule,
    grammarExamples,
    grammarQuiz,
    vocabPairs,
    ruPrompts,
    textbookExercises: section.exercises || [],
    generatedTasks: buildTasksFromModule({
      ...module,
      grammarTitle: grammarInfo.grammarTitle,
      grammarRule: grammarInfo.grammarRule,
      vocab: vocabPairs,
      ruPrompts
    }, section.exercises || []),
    quiz: buildQuizFromModule({
      grammarQuiz,
      vocab: vocabPairs
    }),
    status: 'pending'
  };
}

function buildTasksFromModule(module, textbookExercises) {
  const vocab = Array.isArray(module.vocab) && module.vocab.length ? module.vocab : [];
  const helperWords = vocab.slice(0, 6).map(v => `${v.ru} - ${v.target}`).join(', ');
  const prompts = Array.isArray(module.ruPrompts) && module.ruPrompts.length ? module.ruPrompts.join(' / ') : 'Составьте 5 фраз по теме.';
  const tasks = [
    {
      title: 'Грамматика с опорой',
      instruction: `${module.grammarRule}\nПримеры: ${(module.grammarExamples || []).map(e => `${e.target} (${e.ru})`).join('; ')}\nОпорные слова: ${helperWords}.`
    },
    {
      title: 'Перевод RU -> язык',
      instruction: `Переведите фразы: ${prompts}`
    },
    {
      title: 'Свой текст',
      instruction: `Напишите 8-10 предложений, используя не менее 5 слов из списка: ${helperWords}.`
    }
  ];
  if (textbookExercises.length) {
    tasks.push({
      title: 'Упражнения из учебника',
      instruction: textbookExercises.slice(0, 3).join(' | ')
    });
  }
  return tasks;
}

function buildQuizFromModule(module) {
  const quiz = [];
  const vocab = Array.isArray(module.vocab) && module.vocab.length ? module.vocab : [
    { ru: 'слово', target: 'word' },
    { ru: 'город', target: 'city' },
    { ru: 'время', target: 'time' },
    { ru: 'дом', target: 'home' }
  ];

  (module.grammarQuiz || []).forEach(q => quiz.push({ q: q.q, a: q.options, ok: q.ok }));

  for (let i = 0; i < 4; i += 1) {
    const pair = vocab[i % vocab.length];
    const wrong = shuffle(vocab.filter(v => v.target !== pair.target)).slice(0, 3).map(v => v.target);
    const options = shuffle([pair.target, ...wrong]);
    quiz.push({
      q: `Выберите перевод слова "${pair.ru}"`,
      a: options,
      ok: options.indexOf(pair.target)
    });
  }

  for (let i = 4; i < 8; i += 1) {
    const pair = vocab[i % vocab.length];
    const wrong = shuffle(vocab.filter(v => v.ru !== pair.ru)).slice(0, 3).map(v => v.ru);
    const options = shuffle([pair.ru, ...wrong]);
    quiz.push({
      q: `Выберите перевод "${pair.target}"`,
      a: options,
      ok: options.indexOf(pair.ru)
    });
  }

  return quiz.slice(0, 10);
}

function normalizeQuizOptions(aiOptions, fallbackOptions) {
  const clean = (aiOptions || []).map(v => String(v || '').trim()).filter(Boolean);
  const hasOnlyPlaceholders = clean.length >= 3 && clean.every((opt) => {
    const low = opt.toLowerCase();
    if (['a', 'b', 'c', 'd'].includes(low)) return true;
    return /^вариант\s*[abcd]/i.test(low) || /^option\s*[abcd]/i.test(low);
  });
  if (clean.length < 4 || hasOnlyPlaceholders) return fallbackOptions.slice(0, 4);
  return clean.slice(0, 4);
}

function buildCards(step) {
  return step.vocabPairs.map((p, idx) => ({
    id: `${step.id}-${idx}`,
    ru: p.ru,
    target: p.target,
    approved: false
  }));
}

function nextTopic() {
  if (!state.steps.length || state.currentStep >= state.steps.length - 1) return;
  state.currentStep += 1;
  state.pendingCards = buildCards(state.steps[state.currentStep]);
  touchActivity();
  persistState();
  renderAll();
}

function completeTopic() {
  const step = state.steps[state.currentStep];
  if (!step) return;
  step.status = 'done';
  if (state.currentStep < state.steps.length - 1) {
    state.currentStep += 1;
    state.pendingCards = buildCards(state.steps[state.currentStep]);
  }
  persistState();
  renderAll();
}

async function generateAiQuiz() {
  const step = state.steps[state.currentStep];
  if (!step) return;
  const prompt = `Сделай 10 вопросов теста по теме "${step.topic}".
Верни JSON-массив вида [{q,a,ok}].
Каждый вопрос должен иметь 4 реальных варианта ответа, а не A/B/C/D заглушки.
Грамматика: ${step.grammarTitle}. Слова: ${step.vocabPairs.map(v => `${v.ru}-${v.target}`).join(', ')}.`;
  try {
    const res = await fetch('/api/ai-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error('api');
    const data = await res.json();
    const text = data.output_text || data.text || '';
    const m = text.match(/\[[\s\S]*\]/);
    if (!m) throw new Error('format');
    const parsed = JSON.parse(m[0]);
    const fallbackQuiz = buildQuizFromModule({
      grammarQuiz: step.grammarQuiz,
      vocab: step.vocabPairs
    });
    step.quiz = parsed.slice(0, 10).map((x, i) => {
      const fb = fallbackQuiz[i] || fallbackQuiz[0];
      const rawOptions = Array.isArray(x.a) ? x.a.slice(0, 4).map(v => String(v || '').trim()) : [];
      const options = normalizeQuizOptions(rawOptions, fb.a);
      let ok = Number.isInteger(x.ok) ? x.ok : options.indexOf(rawOptions[0]);
      if (ok < 0 || ok >= options.length) ok = fb.ok;
      return {
        q: String(x.q || '').trim() || fb.q || `Вопрос ${i + 1}`,
        a: options,
        ok
      };
    });
    if (step.quiz.length < 10) {
      step.quiz = [...step.quiz, ...fallbackQuiz.slice(step.quiz.length, 10)];
    }
    ui.quizResult.textContent = 'AI-тест обновлен.';
  } catch {
    step.quiz = buildQuizFromModule({
      grammarQuiz: step.grammarQuiz,
      vocab: step.vocabPairs
    });
    ui.quizResult.textContent = 'AI-сервис недоступен. Показан локальный тест с реальными вариантами.';
  }
  persistState();
  renderQuiz();
}

function checkTaskAnswers() {
  const inputs = [...document.querySelectorAll('textarea[data-task-answer="1"]')];
  if (!inputs.length) return;
  const step = state.steps[state.currentStep];
  let score = 0;
  const feedback = [];
  const keyTargets = step.vocabPairs.slice(0, 6).map(v => v.target.toLowerCase());

  inputs.forEach((input, i) => {
    const txt = (input.value || '').trim();
    const low = txt.toLowerCase();
    if (txt.length >= 80) score += 1;
    else feedback.push(`Задание ${i + 1}: добавьте больше текста.`);
    const used = keyTargets.filter(w => low.includes(w)).length;
    if (used < 2) feedback.push(`Задание ${i + 1}: используйте больше слов темы (${step.vocabPairs.slice(0, 4).map(v => v.target).join(', ')}).`);
  });

  const pct = Math.round((score / inputs.length) * 100);
  ui.taskFeedback.textContent = `Проверка: ${pct}%. ${feedback.join(' ') || 'Хорошо: вы используете лексику и структуру темы.'}`;
}

function checkQuiz() {
  const step = state.steps[state.currentStep];
  if (!step) return;
  const picks = [...document.querySelectorAll('input[type="radio"]:checked')];
  let score = 0;
  step.quiz.forEach((q, i) => {
    const checked = picks.find(p => Number(p.name.replace('q-', '')) === i);
    if (checked && Number(checked.value) === q.ok) score += 1;
  });
  const pct = Math.round((score / Math.max(1, step.quiz.length)) * 100);
  ui.quizResult.textContent = `Результат: ${score}/${step.quiz.length} (${pct}%).`;
  if (pct >= 70 && step.status === 'pending') step.status = 'in_progress';
  persistState();
}

function approveSelectedCards() {
  const checked = [...document.querySelectorAll('input[data-card-check="1"]:checked')].map(x => x.value);
  for (const id of checked) {
    const card = state.pendingCards.find(c => c.id === id);
    if (card && !state.approvedCards.find(a => a.id === id)) {
      card.approved = true;
      state.approvedCards.push(card);
    }
  }
  persistState();
  renderCards();
}

function exportAnkiCsv() {
  if (!state.approvedCards.length) return;
  const lines = ['Front,Back', ...state.approvedCards.map(c => `${csvEscape(c.ru)},${csvEscape(c.target)}`)];
  downloadFile('anki_cards_ru_foreign.csv', lines.join('\n'), 'text/csv;charset=utf-8');
}

function startTimer() {
  if (state.timerRunning) return;
  state.timerDefaultMinutes = Math.max(5, Math.min(120, Number(ui.timerMinutes.value || 25)));
  if (state.timerSeconds <= 0 || state.timerSeconds > state.timerDefaultMinutes * 60) {
    state.timerSeconds = state.timerDefaultMinutes * 60;
  }
  state.timerRunning = true;
  timerId = setInterval(() => {
    state.timerSeconds -= 1;
    if (state.timerSeconds <= 0) {
      pauseTimer();
      state.timerSeconds = state.timerDefaultMinutes * 60;
    }
    renderTimer();
  }, 1000);
}

function pauseTimer() {
  if (timerId) clearInterval(timerId);
  timerId = null;
  state.timerRunning = false;
  persistState();
}

function resetTimer() {
  pauseTimer();
  state.timerDefaultMinutes = Math.max(5, Math.min(120, Number(ui.timerMinutes.value || 25)));
  state.timerSeconds = state.timerDefaultMinutes * 60;
  renderTimer();
}

function renderAll() {
  ui.authOverlay.style.display = state.authUser ? 'none' : 'grid';
  renderProfile();
  renderFileList();
  renderRoadmap();
  renderTopicGuide();
  renderBookExercises();
  renderTasks();
  renderQuiz();
  renderCards();
  renderTimer();

  ui.buildPlanBtn.disabled = state.materialThemes.length === 0;
  const hasPlan = state.steps.length > 0;
  ui.roadmapPanel.hidden = !hasPlan;
  ui.tasksPanel.hidden = !hasPlan;
  ui.quizPanel.hidden = !hasPlan;
  ui.cardsPanel.hidden = !hasPlan;
}

function renderProfile() {
  ui.language.value = state.profile.language;
  ui.level.value = state.profile.level;
  ui.targetLevel.value = state.profile.targetLevel;
  ui.hours.value = state.profile.hours;
  ui.timerMinutes.value = state.timerDefaultMinutes;
  if (ui.parseMode) ui.parseMode.value = state.parseMode || 'accurate';
}

function renderFileList() {
  ui.fileList.innerHTML = '';
  state.files.forEach(file => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${file.name}</span><small>${Math.max(1, Math.round(file.size / 1024))} KB</small>`;
    ui.fileList.appendChild(li);
  });
}

function renderRoadmap() {
  ui.roadmap.innerHTML = '';
  if (!state.steps.length) return;
  ui.planSummary.textContent = `Темы из учебника: ${state.steps.length}. Нажмите на тему, чтобы открыть объяснение и задания.`;
  state.steps.forEach((step, idx) => {
    const li = document.createElement('li');
    li.className = step.status === 'done' ? 'done' : idx === state.currentStep ? 'active' : '';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = step.topic;
    btn.addEventListener('click', () => {
      state.currentStep = idx;
      state.pendingCards = buildCards(state.steps[state.currentStep]);
      persistState();
      renderAll();
    });
    li.appendChild(btn);
    ui.roadmap.appendChild(li);
  });
}

function renderTopicGuide() {
  const step = state.steps[state.currentStep];
  if (!step || !ui.topicGuide) return;
  const examples = step.grammarExamples.map(e => `<li>${e.target} - ${e.ru}</li>`).join('');
  const rows = step.vocabPairs.map(v => `<tr><td>${v.ru}</td><td>${v.target}</td></tr>`).join('');
  ui.activeTopic.textContent = step.topic;
  ui.topicGuide.innerHTML = `
    <h4>${step.grammarTitle}</h4>
    <p>${step.grammarRule}</p>
    <p>${step.summary || ''}</p>
    <ol class="guide-list">${examples}</ol>
    <table class="vocab-table">
      <thead><tr><th>Русский</th><th>${state.profile.language}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderBookExercises() {
  ui.bookExercises.innerHTML = '';
  const step = state.steps[state.currentStep];
  if (!step) return;

  const list = step.textbookExercises.length
    ? step.textbookExercises
    : ['Не удалось извлечь упражнения из этой темы. Загрузите PDF с более четким текстом или включите режим "Точно".'];

  list.forEach((ex) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${ex}</span><small>из учебника</small>`;
    ui.bookExercises.appendChild(li);
  });
}

function renderTasks() {
  ui.tasks.innerHTML = '';
  const step = state.steps[state.currentStep];
  if (!step) return;
  step.generatedTasks.forEach((task) => {
    const card = document.createElement('article');
    card.className = 'task';
    card.innerHTML = `<h3>${task.title}</h3><p>${task.instruction}</p><textarea data-task-answer="1" rows="4" placeholder="Введите ваш ответ..."></textarea>`;
    ui.tasks.appendChild(card);
  });
}

function renderQuiz() {
  ui.quiz.innerHTML = '';
  const step = state.steps[state.currentStep];
  if (!step) return;
  step.quiz.forEach((q, i) => {
    const el = document.createElement('article');
    el.className = 'q-item';
    const options = q.a.map((option, idx) => `<label><input type="radio" name="q-${i}" value="${idx}" /> ${option}</label>`).join('');
    el.innerHTML = `<p>${q.q}</p>${options}`;
    ui.quiz.appendChild(el);
  });
}

function renderCards() {
  ui.pendingCards.innerHTML = '';
  if (!state.pendingCards.length) {
    const li = document.createElement('li');
    li.innerHTML = '<span>Нет карточек для текущей темы.</span><small>—</small>';
    ui.pendingCards.appendChild(li);
    return;
  }
  state.pendingCards.forEach(card => {
    const li = document.createElement('li');
    const checked = state.approvedCards.find(a => a.id === card.id) ? 'checked' : '';
    li.innerHTML = `<span><label><input type="checkbox" data-card-check="1" value="${card.id}" ${checked}/> ${card.ru} -> ${card.target}</label></span><small>${checked ? 'одобрено' : 'ожидает'}</small>`;
    ui.pendingCards.appendChild(li);
  });
}

function renderTimer() {
  const m = String(Math.floor(state.timerSeconds / 60)).padStart(2, '0');
  const s = String(state.timerSeconds % 60).padStart(2, '0');
  ui.timerView.textContent = `${m}:${s}`;
}

function syncProfile() {
  state.profile = {
    language: ui.language.value,
    level: ui.level.value,
    targetLevel: ui.targetLevel.value,
    hours: Number(ui.hours.value || 5)
  };
}

function touchActivity() {
  const today = toISODate(new Date());
  if (!state.lastActiveDate) {
    state.streak = 1;
  } else {
    const diff = Math.round((new Date(today) - new Date(state.lastActiveDate)) / 86400000);
    state.streak = diff === 1 ? state.streak + 1 : diff > 1 ? 1 : state.streak;
  }
  state.lastActiveDate = today;
}

function getLanguageKey(label) {
  return LANGUAGE_KEY_BY_LABEL[label] || 'en';
}

function getPdfModeConfig() {
  return PDF_MODE[state.parseMode] || PDF_MODE.accurate;
}

function normalizeLookupToken(value, langKey) {
  let out = String(value || '').toLowerCase().trim();
  if (langKey !== 'ar') {
    out = out.normalize('NFD').replace(/\p{Diacritic}/gu, '');
  }
  out = out.replace(/[’'`]/g, '');
  out = out.replace(/\s+/g, ' ');
  return out;
}

function normalizeExtractedText(text) {
  return String(text || '')
    .replace(/\r\n?/g, '\n')
    .replace(/[^\p{L}\p{N}\n.,!?;:'"()\-–— ]/gu, ' ')
    .replace(/[ \t\f\v]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function isGarbageText(text) {
  if (!text || text.length < 40) return true;
  const letters = (text.match(/\p{L}/gu) || []).length;
  if (!letters) return true;
  const weird = (text.match(/[^ \p{L}\p{N}\n.,!?;:'"()\-–—]/gu) || []).length;
  return weird / Math.max(1, text.length) > 0.08;
}

function extractPageTextLines(items) {
  if (!Array.isArray(items) || !items.length) return '';
  const lines = [];
  let current = [];
  let lastY = null;
  const threshold = 2.5;
  for (const item of items) {
    const y = item?.transform?.[5] ?? 0;
    const str = String(item?.str || '').trim();
    if (!str) continue;
    if (lastY !== null && Math.abs(y - lastY) > threshold) {
      if (current.length) lines.push(current.join(' '));
      current = [str];
    } else {
      current.push(str);
    }
    lastY = y;
  }
  if (current.length) lines.push(current.join(' '));
  return lines.join('\n');
}

function splitBySize(text, size) {
  const out = [];
  for (let i = 0; i < text.length; i += size) out.push(text.slice(i, i + size));
  return out;
}

function unique(list) {
  return [...new Set(list)];
}

function ensureUniqueStepTitles(steps) {
  const counts = new Map();
  return steps.map((step) => {
    const key = normalizeLookupToken(step.topic, getLanguageKey(state.profile.language)) || 'topic';
    const n = (counts.get(key) || 0) + 1;
    counts.set(key, n);
    if (n === 1) return step;
    return { ...step, topic: `${step.topic} (${n})` };
  });
}

function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function toISODate(d) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
}

function csvEscape(v) {
  const s = String(v ?? '');
  return `"${s.replaceAll('"', '""')}"`;
}

function downloadFile(name, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function persistState() {
  const serializable = {
    ...state,
    files: state.files.map(f => ({ name: f.name, size: f.size, type: f.type }))
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
}

function restoreState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    Object.assign(state, JSON.parse(raw));
    state.timerRunning = false;
    if (!PDF_MODE[state.parseMode]) state.parseMode = 'accurate';
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}
