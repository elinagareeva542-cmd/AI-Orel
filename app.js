const ui = {
  logoutBtn: document.getElementById('logoutBtn'),
  fileInput: document.getElementById('fileInput'),
  dropzone: document.getElementById('dropzone'),
  fileList: document.getElementById('fileList'),
  extractStatus: document.getElementById('extractStatus'),
  language: document.getElementById('language'),
  level: document.getElementById('level'),
  targetLevel: document.getElementById('targetLevel'),
  hours: document.getElementById('hours'),
  confirmProfileBtn: document.getElementById('confirmProfileBtn'),
  profileStatus: document.getElementById('profileStatus'),
  dropzoneText: document.getElementById('dropzoneText'),
  timerMinutes: document.getElementById('timerMinutes'),
  timerView: document.getElementById('timerView'),
  startTimerBtn: document.getElementById('startTimerBtn'),
  pauseTimerBtn: document.getElementById('pauseTimerBtn'),
  resetTimerBtn: document.getElementById('resetTimerBtn'),
  buildPlanBtn: document.getElementById('buildPlanBtn'),
  nextTopicBtn: document.getElementById('nextTopicBtn'),
  completeTopicBtn: document.getElementById('completeTopicBtn'),
  checkTasksBtn: document.getElementById('checkTasksBtn'),
  checkQuizBtn: document.getElementById('checkQuizBtn'),
  roadmapPanel: document.getElementById('roadmapPanel'),
  tasksPanel: document.getElementById('tasksPanel'),
  quizPanel: document.getElementById('quizPanel'),
  roadmap: document.getElementById('roadmap'),
  planSummary: document.getElementById('planSummary'),
  activeTopic: document.getElementById('activeTopic'),
  topicGuide: document.getElementById('topicGuide'),
  tasks: document.getElementById('tasks'),
  taskFeedback: document.getElementById('taskFeedback'),
  quiz: document.getElementById('quiz'),
  quizResult: document.getElementById('quizResult')
};

const STORAGE_KEY = 'lingua-path-state-v10';

const PDF_CONFIG = { ocrSamples: 8, scale: 1.5 };

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
  streak: 0,
  lastActiveDate: null,
  timerSeconds: 1500,
  timerRunning: false,
  timerDefaultMinutes: 25,
  profileConfirmed: false,
  planBuilding: false,
  profile: { language: 'Английский', level: 'A1', targetLevel: 'B1', hours: 5 }
};

let timerId = null;
bindEvents();
restoreState();
renderAll();

function bindEvents() {
  ui.logoutBtn.addEventListener('click', logoutUser);
  ui.confirmProfileBtn.addEventListener('click', confirmProfile);
  ui.fileInput.addEventListener('change', async (e) => handleSelectedFiles(Array.from(e.target.files || [])));
  ui.dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (state.profileConfirmed) ui.dropzone.classList.add('drag');
  });
  ui.dropzone.addEventListener('dragleave', () => ui.dropzone.classList.remove('drag'));
  ui.dropzone.addEventListener('drop', async (e) => {
    e.preventDefault();
    ui.dropzone.classList.remove('drag');
    if (!state.profileConfirmed) {
      ui.profileStatus.textContent = 'Сначала подтвердите язык и уровни.';
      return;
    }
    await handleSelectedFiles(Array.from(e.dataTransfer?.files || []));
  });
  ui.buildPlanBtn.addEventListener('click', buildPlanFlow);
  ui.nextTopicBtn.addEventListener('click', nextTopic);
  ui.completeTopicBtn.addEventListener('click', completeTopic);
  ui.checkTasksBtn.addEventListener('click', checkTaskAnswers);
  ui.checkQuizBtn.addEventListener('click', checkQuiz);
  ui.startTimerBtn.addEventListener('click', startTimer);
  ui.pauseTimerBtn.addEventListener('click', pauseTimer);
  ui.resetTimerBtn.addEventListener('click', resetTimer);
  [ui.language, ui.level, ui.targetLevel, ui.hours].forEach((control) => {
    control.addEventListener('change', invalidateProfile);
  });
}

function confirmProfile() {
  const levelOrder = { A0: 0, A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
  if ((levelOrder[ui.targetLevel.value] ?? 0) < (levelOrder[ui.level.value] ?? 0)) {
    ui.profileStatus.textContent = 'Желаемый уровень не может быть ниже текущего.';
    return;
  }
  const hours = Number(ui.hours.value);
  if (!Number.isFinite(hours) || hours < 1 || hours > 30) {
    ui.profileStatus.textContent = 'Укажите от 1 до 30 часов занятий в неделю.';
    return;
  }

  const previous = JSON.stringify(state.profile);
  syncProfile();
  state.profileConfirmed = true;
  setUploadAvailability();
  ui.profileStatus.textContent = `Выбрано: ${state.profile.language}, ${state.profile.level} → ${state.profile.targetLevel}, ${state.profile.hours} ч/нед.`;

  if (state.extractedText && previous !== JSON.stringify(state.profile)) {
    state.files = [];
    state.extractedText = '';
    state.materialThemes = [];
    state.steps = [];
    state.currentStep = 0;
    ui.extractStatus.textContent = 'Параметры изменены. Загрузите учебник заново.';
    renderAll();
  }
  persistState();
}

function invalidateProfile() {
  state.profileConfirmed = false;
  ui.profileStatus.textContent = 'Подтвердите изменённые параметры перед загрузкой.';
  setUploadAvailability();
}

function setUploadAvailability() {
  ui.fileInput.disabled = !state.profileConfirmed;
  ui.dropzone.classList.toggle('locked', !state.profileConfirmed);
  ui.dropzoneText.textContent = state.profileConfirmed
    ? 'Нажмите или перетащите учебник сюда'
    : 'Сначала подтвердите язык и уровни';
}

async function logoutUser() {
  try {
    await fetch('/api/logout', { method: 'POST' });
  } finally {
    window.location.replace('/login.html');
  }
}

async function handleSelectedFiles(files) {
  if (!files.length) return;
  if (!state.profileConfirmed) {
    ui.profileStatus.textContent = 'Сначала подтвердите язык и уровни.';
    return;
  }
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
    ui.extractStatus.textContent = `Обработано ${i + 1}/${files.length}. Учебник готов к анализу нейросетью.`;
    persistState();
  }

  state.steps = [];
  state.currentStep = 0;
  ui.extractStatus.textContent = 'Учебник загружен. Нажмите «Построить план».';
  ui.buildPlanBtn.disabled = !state.extractedText.trim();
  renderAll();
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
        const progress = mode.startsWith('OCR')
          ? `${mode} (образец ${page}/${totalPages})`
          : `${mode}: страница ${page} из ${totalPages}`;
        ui.extractStatus.textContent = `Файл ${fileNo}/${totalFiles}: ${progress}`;
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
  const cfg = PDF_CONFIG;
  const pageCount = pdf.numPages;
  let ocrWorker = null;
  const chunks = new Array(pageCount).fill('');
  const scannedPages = [];

  try {
    for (let p = 1; p <= pageCount; p += 1) {
      const page = await pdf.getPage(p);
      const textContent = await page.getTextContent();
      const textLayer = extractPageTextLines(textContent.items);
      const cleaned = normalizeExtractedText(textLayer);
      if (!isGarbageText(cleaned)) {
        chunks[p - 1] = cleaned;
      } else {
        scannedPages.push(p);
      }
      if (statusCb) statusCb(p, pageCount, 'чтение страниц');
    }

    const pagesForOcr = pickEvenlySpaced(scannedPages, cfg.ocrSamples);
    for (let index = 0; index < pagesForOcr.length; index += 1) {
      const pageNumber = pagesForOcr[index];
      const page = await pdf.getPage(pageNumber);
      if (!ocrWorker) ocrWorker = await createOcrWorker();
      const ocrText = await ocrPdfPage(page, cfg.scale, ocrWorker);
      chunks[pageNumber - 1] = normalizeExtractedText(ocrText);
      if (statusCb) statusCb(index + 1, pagesForOcr.length, `OCR, страница ${pageNumber} из ${pageCount}`);
    }
  } finally {
    if (ocrWorker) await ocrWorker.terminate();
  }

  return chunks.filter(Boolean).join('\n');
}

function pickEvenlySpaced(items, limit) {
  if (items.length <= limit) return items;
  if (limit <= 1) return [items[0]];
  return Array.from({ length: limit }, (_, index) => {
    const position = Math.round(index * (items.length - 1) / (limit - 1));
    return items[position];
  });
}

async function createOcrWorker() {
  if (!window.Tesseract) return null;
  const languageByProfile = {
    'Английский': 'eng',
    'Испанский': 'spa',
    'Турецкий': 'tur',
    'Арабский': 'ara'
  };
  const language = languageByProfile[state.profile.language] || 'eng';
  return window.Tesseract.createWorker(language);
}

async function ocrPdfPage(page, scale, worker) {
  if (!worker) return '';
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  await page.render({ canvasContext: ctx, viewport }).promise;
  const result = await worker.recognize(canvas);
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
    summary: summarizeChunk(chunk)
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

async function buildPlanFlow() {
  syncProfile();
  touchActivity();
  if (!state.extractedText.trim()) {
    ui.extractStatus.textContent = 'Сначала загрузите учебник с распознаваемым текстом.';
    return;
  }

  ui.buildPlanBtn.disabled = true;
  state.planBuilding = true;
  ui.buildPlanBtn.textContent = 'Уточняем темы...';
  state.steps = buildGuaranteedPlan();
  state.currentStep = 0;
  persistState();
  renderAll();
  ui.extractStatus.textContent = '10 готовых уроков уже построены. Нейросеть уточняет порядок тем по учебнику...';

  const controller = new AbortController();
  const requestTimer = setTimeout(() => controller.abort(), 50_000);
  try {
    const response = await fetch('/api/ai-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        textbook: state.extractedText,
        profile: state.profile
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Не удалось получить план от нейросети.');
    if (!Array.isArray(data.topics) || !data.topics.length) {
      throw new Error('Нейросеть не вернула темы.');
    }

    const validTopics = data.topics.filter(topic => {
      const title = String(topic?.grammarTitle || topic?.topic || '').trim();
      return title.length >= 4 && !/^(учебная тема|тема|часть|раздел|урок)\s*\d*$/i.test(title);
    });
    if (!validTopics.length) throw new Error('Нейросеть не вернула грамматические темы.');
    if (validTopics.length >= 10) {
      state.steps = state.steps.map((step, index) => {
        const aiTopic = validTopics[index];
        if (!aiTopic) return step;
        const title = cleanTopicTitle(aiTopic.grammarTitle || aiTopic.topic, step.grammarTitle);
        return {
          ...step,
          topic: title,
          level: String(aiTopic.level || step.level),
          learningGoal: String(aiTopic.learningGoal || step.learningGoal),
          summary: String(aiTopic.summary || step.summary)
        };
      });
      state.steps = numberStepTitles(state.steps);
    }
    const languageInfo = data.detectedLanguage ? ` Язык учебника: ${data.detectedLanguage}.` : '';
    ui.extractStatus.textContent = `Готово.${languageInfo} Все ${state.steps.length} уроков подготовлены, темы уточнены нейросетью.`;
  } catch (error) {
    ui.extractStatus.textContent = error.name === 'AbortError'
      ? 'Готово: 10 уроков построены по учебнику. Нейросеть не успела уточнить названия, но план полностью доступен.'
      : `Готово: 10 уроков построены по учебнику. AI-уточнение временно недоступно: ${error.message}`;
  } finally {
    clearTimeout(requestTimer);
    state.planBuilding = false;
    state.currentStep = 0;
    persistState();
    renderAll();
    ui.buildPlanBtn.textContent = 'Построить план';
    ui.buildPlanBtn.disabled = !state.extractedText.trim();
  }
}

function buildGuaranteedPlan() {
  const langKey = state.detectedLang !== 'unknown'
    ? state.detectedLang
    : getLanguageKey(state.profile.language);
  const pack = LANGUAGE_PACKS[langKey] || LANGUAGE_PACKS.en;
  const path = DEFAULT_PATH_BY_LANG[langKey] || DEFAULT_PATH_BY_LANG.en;
  const sections = groupLocalSections(state.materialThemes, langKey);
  const steps = path.slice(0, 10).map((point, index) => {
    const section = sections[index] || { title: point.topic, summary: '', chunk: state.extractedText };
    return composeGuaranteedStep(point, section, index, pack, langKey, path);
  });
  return numberStepTitles(steps);
}

function composeGuaranteedStep(point, section, index, pack, langKey, path) {
  const module = pickModuleForSection(pack, section, index, langKey);
  const vocabulary = buildGuaranteedVocabulary(section.chunk, module, langKey, index);
  const vocabularyGroups = Array.from({ length: 5 }, (_, groupIndex) => ({
    title: ['Основные понятия', 'Действия', 'Признаки и описания', 'Ситуации общения', 'Устойчивые фразы'][groupIndex],
    items: vocabulary.slice(groupIndex * 8, groupIndex * 8 + 8)
  }));
  const examples = (module.grammarExamples || []).slice(0, 4);
  const grammarRule = [
    point.grammarRule,
    `Это правило необходимо для полноценного общения в ситуациях «${point.topic}»: утверждений, уточнений, вопросов и отрицаний.`,
    'Перед построением фразы определите коммуникативную задачу, лицо, число, время и тип предложения.',
    'Затем выберите основу слова, добавьте нужные показатели формы и проверьте порядок слов.',
    'В вопросах и отрицаниях обращайте внимание на служебные элементы и изменение позиции сказуемого.',
    'Сопоставляйте форму с контекстом, потому что буквальный перевод русской конструкции часто создаёт ошибку.',
    'После составления предложения отдельно проверьте согласование, исключения и естественность получившейся фразы.'
  ].join(' ');
  const generatedTasks = buildGuaranteedTasks(point, examples, vocabulary, index);
  const quizSections = buildGuaranteedQuizSections(point, module, vocabulary, path, index);

  return {
    id: `local-${index}-${Date.now()}`,
    topic: point.grammarTitle,
    level: levelForLesson(index),
    learningGoal: `Понять правило «${point.grammarTitle}» и уверенно применять его в речи и письме.`,
    summary: section.summary || `Урок по теме «${point.topic}» с опорой на содержание загруженного учебника.`,
    grammarTitle: point.grammarTitle,
    grammarRule,
    ruleSections: [
      { title: 'Значение и ситуации употребления', text: `Правило «${point.grammarTitle}» помогает говорить и писать по теме «${point.topic}», описывать факты, задавать уточняющие вопросы и связывать реплики в естественное высказывание.` },
      { title: 'Пошаговое образование формы', text: `${point.grammarRule} Алгоритм: определите основу, выберите лицо и число, добавьте нужный показатель, затем проверьте согласование и порядок слов.` },
      { title: 'Утверждение, вопрос и отрицание', text: 'Сравнивайте три типа предложения. Форма или служебное слово могут меняться, поэтому не ограничивайтесь заменой одного русского слова.' },
      { title: 'Ограничения и исключения', text: 'Проверяйте нерегулярные формы, особые окончания, выпадение или чередование звуков и случаи, где правило зависит от контекста.' },
      { title: 'Типичные ошибки русскоязычных учеников', text: 'Не переносите русский порядок слов буквально, не смешивайте формы разных лиц и времён, проверяйте предлоги, артикли, падежи и согласование.' }
    ],
    grammarExamples: examples,
    grammarQuiz: module.grammarQuiz || [],
    vocabularyGroups,
    vocabPairs: vocabulary,
    generatedTasks,
    quizSections,
    quiz: quizSections.flatMap(sectionItem => sectionItem.questions),
    lessonLoaded: true,
    lessonLoading: false,
    lessonError: '',
    status: 'pending'
  };
}

function buildGuaranteedVocabulary(chunk, module, langKey, lessonIndex) {
  const glossary = GLOSSARY_BY_LANG[langKey] || GLOSSARY_BY_LANG.en;
  const extracted = extractTopicVocabulary(chunk, langKey, module.vocab);
  const pool = [
    ...extracted,
    ...(module.vocab || []),
    ...Object.entries(glossary).map(([target, ru]) => ({ target, ru }))
  ];
  const uniquePool = uniqueObjects(pool, item =>
    `${normalizeLookupToken(item.target, langKey)}|${normalizeLookupToken(item.ru, 'en')}`
  );
  if (!uniquePool.length) return [];
  const offset = (lessonIndex * 7) % uniquePool.length;
  return Array.from({ length: Math.min(40, uniquePool.length) }, (_, index) =>
    uniquePool[(offset + index) % uniquePool.length]
  );
}

function buildGuaranteedTasks(point, examples, vocabulary, lessonIndex = 0) {
  const words = vocabulary.slice(0, 14);
  const wordBank = words.map(item => `${item.target} — ${item.ru}`).join('; ');
  const exampleAnswer = examples.map(item => `${item.target} — ${item.ru}`).join('\n');
  const grammarVariants = [
    {
      type: 'grammar',
      title: 'Отработка грамматического материала',
      instruction: `Составьте 6 предложений по правилу «${point.grammarTitle}»: два утвердительных, два отрицательных и два вопросительных.`,
      hints: ['Используйте разные лица и числа.', 'Проверьте форму сказуемого и порядок слов.'],
      referenceAnswer: exampleAnswer || `Шесть корректных предложений с правилом «${point.grammarTitle}».`
    },
    {
      type: 'grammar',
      title: 'Исправление грамматических ошибок',
      instruction: `Напишите 6 примеров с типичными ошибками по теме «${point.grammarTitle}», затем рядом дайте исправленный вариант и кратко назовите правило.`,
      hints: ['Меняйте лицо, число и тип предложения.', 'Объясняйте исправление, а не только переписывайте фразу.'],
      referenceAnswer: exampleAnswer || `Корректные примеры по теме «${point.grammarTitle}».`
    },
    {
      type: 'grammar',
      title: 'Трансформация предложений',
      instruction: `Составьте 4 утвердительных предложения, затем преобразуйте каждое в вопрос и отрицание. Всего должно получиться 12 форм.`,
      hints: ['Сохраняйте исходный смысл.', 'Проверяйте изменения служебных слов и порядка слов.'],
      referenceAnswer: exampleAnswer || `Набор утверждений, вопросов и отрицаний по правилу «${point.grammarTitle}».`
    }
  ];
  const vocabularyVariants = [
    {
      type: 'vocabulary',
      title: 'Отработка лексического материала',
      instruction: `Составьте 10 предложений, употребив не менее 10 единиц из банка слов: ${wordBank}.`,
      hints: ['Каждое слово используйте в естественном контексте.', 'Не переводите русскую конструкцию дословно.'],
      referenceAnswer: words.slice(0, 10).map((item, index) => `${index + 1}. ${item.target} — ${item.ru}`).join('\n')
    },
    {
      type: 'vocabulary',
      title: 'Лексика в контексте',
      instruction: `Разделите слова на смысловые группы и составьте по две связанные фразы для каждой группы. Банк слов: ${wordBank}.`,
      hints: ['Объясните принцип группировки.', 'Используйте грамматику текущего урока.'],
      referenceAnswer: words.map(item => `${item.target} — ${item.ru}`).join('\n')
    },
    {
      type: 'vocabulary',
      title: 'Перевод и выбор сочетаемости',
      instruction: `Выберите 10 единиц из банка, составьте с ними естественные словосочетания и переведите получившиеся фразы на русский язык: ${wordBank}.`,
      hints: ['Проверяйте управление и предлоги.', 'Избегайте изолированных слов без контекста.'],
      referenceAnswer: words.slice(0, 10).map(item => `${item.target} — ${item.ru}`).join('\n')
    }
  ];
  const productionVariants = [
    {
      type: 'production',
      title: 'Ситуативный диалог',
      instruction: `Напишите диалог из 10 реплик по теме «${point.topic}». Используйте правило урока и минимум 6 единиц из банка слов.`,
      hints: [`Банк слов: ${wordBank}`, 'Структура: начало разговора, обмен информацией, уточняющий вопрос, завершение.'],
      referenceAnswer: [
        `Образец строится по теме «${point.topic}».`,
        ...examples.map(item => `— ${item.target}`),
        '— Добавьте логичное завершение разговора с изученной лексикой.'
      ].join('\n')
    },
    {
      type: 'production',
      title: 'Связный текст',
      instruction: `Напишите связный текст из 10-12 предложений по теме «${point.topic}». Используйте правило урока минимум 6 раз и не менее 8 новых слов.`,
      hints: ['Структура: введение, основная мысль, примеры, вывод.', `Банк слов: ${wordBank}`],
      referenceAnswer: exampleAnswer || `Образец связного текста по теме «${point.topic}».`
    },
    {
      type: 'production',
      title: 'Ответ в практической ситуации',
      instruction: `Представьте реальную ситуацию по теме «${point.topic}»: запрос информации, объяснение или решение проблемы. Напишите развёрнутый ответ или диалог из 10-12 реплик.`,
      hints: ['Сформулируйте цель общения.', 'Добавьте уточнение, реакцию собеседника и логичное завершение.', `Лексическая опора: ${wordBank}`],
      referenceAnswer: exampleAnswer || `Образец ответа в ситуации по теме «${point.topic}».`
    }
  ];
  return [
    grammarVariants[lessonIndex % grammarVariants.length],
    vocabularyVariants[(lessonIndex + 1) % vocabularyVariants.length],
    productionVariants[(lessonIndex + 2) % productionVariants.length]
  ];
}

function buildGuaranteedQuizSections(point, module, vocabulary, path, lessonIndex) {
  const grammarQuestions = (module.grammarQuiz || []).slice(0, 3).map(item => ({
    q: item.q,
    a: item.options,
    ok: item.ok
  }));
  while (grammarQuestions.length < 3) {
    grammarQuestions.push({
      q: `Какое правило отрабатывается в этом уроке?`,
      a: shuffle([
        point.grammarTitle,
        ...path.filter(item => item.grammarTitle !== point.grammarTitle).slice(0, 3).map(item => item.grammarTitle)
      ]),
      ok: 0
    });
    const last = grammarQuestions[grammarQuestions.length - 1];
    last.ok = last.a.indexOf(point.grammarTitle);
  }

  const vocabularyQuestions = vocabulary.slice(0, 3).map((pair, index) => {
    const wrong = vocabulary
      .filter(item => item.target !== pair.target)
      .slice(index + 1, index + 4)
      .map(item => item.target);
    const options = shuffle([pair.target, ...wrong]).slice(0, 4);
    return {
      q: `Выберите перевод: «${pair.ru}»`,
      a: options,
      ok: options.indexOf(pair.target)
    };
  });

  const comprehensionPool = [
    {
      q: `В какой ситуации прежде всего понадобится тема «${point.topic}»?`,
      a: [`Для общения по теме «${point.topic}»`, 'Только для записи чисел', 'Только для чтения алфавита', 'Для вычисления процентов'],
      ok: 0
    },
    {
      q: 'Что следует определить до выбора грамматической формы?',
      a: ['Цель высказывания, лицо, число и время', 'Только длину фразы', 'Цвет страницы', 'Количество новых слов'],
      ok: 0
    },
    {
      q: 'Зачем сравнивать утверждение, вопрос и отрицание?',
      a: ['Чтобы увидеть изменение формы и порядка слов', 'Чтобы убрать сказуемое', 'Чтобы не использовать лексику', 'Чтобы всегда писать одну форму'],
      ok: 0
    },
    {
      q: 'Какая проверка помогает избежать буквального перевода?',
      a: ['Проверка естественности, управления и порядка слов', 'Подсчёт букв', 'Удаление предлогов', 'Замена всех слов инфинитивами'],
      ok: 0
    },
    {
      q: 'Что особенно важно проверить в готовом предложении?',
      a: ['Согласование и соответствие контексту', 'Только первую букву', 'Только количество слов', 'Наличие длинного слова'],
      ok: 0
    },
    {
      q: 'Как лучше закрепить новое правило?',
      a: ['Применять его в разных ситуациях и типах предложений', 'Повторять один пример без изменений', 'Не использовать в речи', 'Учить только название'],
      ok: 0
    },
    {
      q: 'Почему недостаточно заменить одно русское слово иностранным?',
      a: ['Языки различаются формами, управлением и порядком слов', 'Все языки имеют одинаковую структуру', 'Перевод зависит только от длины', 'Грамматика не влияет на смысл'],
      ok: 0
    },
    {
      q: 'Какую роль выполняет контекст?',
      a: ['Помогает выбрать подходящую форму и значение', 'Определяет размер шрифта', 'Заменяет грамматику', 'Нужен только для произношения'],
      ok: 0
    },
    {
      q: 'Когда следует проверять исключения?',
      a: ['После выбора общей модели образования формы', 'Только до чтения темы', 'Исключения не проверяют', 'Только в русском переводе'],
      ok: 0
    },
    {
      q: 'Что показывает успешное понимание темы?',
      a: ['Умение самостоятельно построить новую фразу', 'Запоминание номера урока', 'Копирование одного примера', 'Подсчёт слов в правиле'],
      ok: 0
    }
  ];
  const start = (lessonIndex * 3) % comprehensionPool.length;
  const comprehensionQuestions = Array.from({ length: 2 }, (_, offset) =>
    comprehensionPool[(start + offset) % comprehensionPool.length]
  ).map(item => ({ ...item, a: [...item.a] }));
  comprehensionQuestions.push({
    q: `Какова главная грамматическая тема урока ${lessonIndex + 1}?`,
    a: shuffle([
      point.grammarTitle,
      ...path.filter(item => item.grammarTitle !== point.grammarTitle).slice(lessonIndex % 4, lessonIndex % 4 + 3).map(item => item.grammarTitle)
    ]),
    ok: 0
  });
  comprehensionQuestions[2].ok = comprehensionQuestions[2].a.indexOf(point.grammarTitle);

  return [
    { type: 'grammar', title: 'Грамматика', questions: grammarQuestions },
    { type: 'vocabulary', title: 'Лексика: слова и фразы', questions: vocabularyQuestions },
    { type: 'comprehension', title: 'Понимание темы', questions: comprehensionQuestions }
  ];
}

function levelForLesson(index) {
  const levels = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const start = Math.max(0, levels.indexOf(state.profile.level));
  const end = Math.max(start, levels.indexOf(state.profile.targetLevel));
  const position = Math.round(start + (end - start) * index / 9);
  return levels[position];
}

function buildLocalPlan() {
  const langKey = state.detectedLang !== 'unknown' ? state.detectedLang : getLanguageKey(state.profile.language);
  const pack = LANGUAGE_PACKS[langKey] || LANGUAGE_PACKS.en;
  const rawSections = state.materialThemes.length ? state.materialThemes : pack.modules.map((m) => ({
    title: m.topic,
    summary: m.summary,
    exercises: [],
    chunk: ''
  }));
  const sections = groupLocalSections(rawSections, langKey).slice(0, 8);
  state.steps = numberStepTitles(sections.map((section, idx) => composeStep(section, idx, pack, langKey)));
}

function composeAiStep(topic, idx) {
  const langKey = state.detectedLang !== 'unknown' ? state.detectedLang : getLanguageKey(state.profile.language);
  const pack = LANGUAGE_PACKS[langKey] || LANGUAGE_PACKS.en;
  const fallbackSection = state.materialThemes[idx] || { title: '', summary: '', chunk: '' };
  const fallback = composeStep(fallbackSection, idx, pack, langKey);
  const cleanString = (value, fallbackValue = '') => {
    const text = typeof value === 'string' ? value.trim() : '';
    return text || fallbackValue;
  };
  const vocabularyGroups = Array.isArray(topic.vocabularyGroups)
    ? topic.vocabularyGroups
      .map((group, groupIndex) => ({
        title: cleanString(group?.title, `Лексика ${groupIndex + 1}`),
        items: Array.isArray(group?.items)
          ? group.items
            .map(pair => ({ target: cleanString(pair?.target), ru: cleanString(pair?.ru) }))
            .filter(pair => pair.target && pair.ru)
            .slice(0, 15)
          : []
      }))
      .filter(group => group.items.length)
      .slice(0, 6)
    : [];
  const vocabPairs = vocabularyGroups.flatMap(group => group.items).slice(0, 60);
  const grammarExamples = Array.isArray(topic.grammarExamples)
    ? topic.grammarExamples
      .map(example => ({
        target: cleanString(example?.target),
        ru: cleanString(example?.ru)
      }))
      .filter(example => example.target && example.ru)
      .slice(0, 8)
    : [];
  const generatedTasks = Array.isArray(topic.generatedTasks)
    ? topic.generatedTasks
      .map(task => ({
        type: cleanString(task?.type),
        title: cleanString(task?.title),
        instruction: cleanString(task?.instruction),
        hints: Array.isArray(task?.hints)
          ? task.hints.map(hint => cleanString(hint)).filter(Boolean)
          : [],
        referenceAnswer: cleanString(task?.referenceAnswer)
      }))
      .filter(task => task.title && task.instruction)
      .slice(0, 3)
    : [];
  const quizSections = Array.isArray(topic.quizSections)
    ? topic.quizSections
      .map(section => ({
        type: cleanString(section?.type),
        title: cleanString(section?.title),
        questions: normalizeQuizQuestions(section?.questions)
      }))
      .filter(section => section.title && section.questions.length)
      .slice(0, 3)
    : [];
  const ruleSections = Array.isArray(topic.ruleSections)
    ? topic.ruleSections
      .map(section => ({ title: cleanString(section?.title), text: cleanString(section?.text) }))
      .filter(section => section.title && section.text)
    : [];

  return {
    id: `ai-${idx}-${Date.now()}`,
    topic: cleanTopicTitle(cleanString(topic.grammarTitle || topic.topic), ''),
    level: cleanString(topic.level, state.profile.level),
    learningGoal: cleanString(topic.learningGoal),
    summary: cleanString(topic.summary, fallback.summary),
    grammarTitle: cleanString(topic.grammarTitle, fallback.grammarTitle),
    grammarRule: cleanString(topic.grammarRule, fallback.grammarRule),
    ruleSections,
    grammarExamples: grammarExamples.length ? grammarExamples : fallback.grammarExamples,
    grammarQuiz: fallback.grammarQuiz,
    vocabularyGroups,
    vocabPairs,
    generatedTasks,
    quizSections,
    quiz: quizSections.flatMap(section => section.questions),
    status: 'pending'
  };
}

function normalizeQuizQuestions(items) {
  if (!Array.isArray(items)) return [];
  return items.map(item => {
    const answers = Array.isArray(item?.a)
      ? item.a.map(answer => String(answer || '').trim()).filter(Boolean).slice(0, 4)
      : [];
    const ok = Number(item?.ok);
    return {
      q: String(item?.q || '').trim(),
      a: answers,
      ok: Number.isInteger(ok) && ok >= 0 && ok < answers.length ? ok : 0
    };
  }).filter(item => item.q && item.a.length === 4).slice(0, 6);
}

function cleanTopicTitle(value, fallback = 'Учебная тема') {
  const cleaned = String(value || '')
    .replace(/^(?:тема|часть|раздел|урок|section|topic|part)\s*\d*\s*[:.\-–—]?\s*/i, '')
    .replace(/\s*\((?:часть|part)\s*\d+\)\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.length >= 4 ? cleaned : fallback;
}

function filterStepsByLevel(steps, currentLevel, targetLevel) {
  const order = { A0: 0, A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
  const min = order[currentLevel] ?? 0;
  const max = order[targetLevel] ?? 6;
  const filtered = steps.filter(step => {
    const level = String(step.level || '').toUpperCase().match(/[ABC][0-2]/)?.[0];
    if (!level || order[level] === undefined) return true;
    return order[level] >= min && order[level] <= max;
  });
  return filtered.length ? filtered : steps;
}

function topicWords(title) {
  return new Set(
    cleanTopicTitle(title, '')
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter(word => word.length > 2)
  );
}

function areSimilarTopics(left, right) {
  const a = topicWords(left);
  const b = topicWords(right);
  if (!a.size || !b.size) return false;
  const common = [...a].filter(word => b.has(word)).length;
  return common / Math.min(a.size, b.size) >= 0.6;
}

function mergeSimilarSteps(steps) {
  const merged = [];
  for (const step of steps) {
    const existing = merged.find(item => areSimilarTopics(item.topic, step.topic));
    if (!existing) {
      merged.push({ ...step, topic: cleanTopicTitle(step.topic) });
      continue;
    }
    existing.summary = [existing.summary, step.summary].filter(Boolean).join(' ');
    existing.grammarExamples = uniqueObjects([...existing.grammarExamples, ...step.grammarExamples], item => `${item.target}|${item.ru}`).slice(0, 8);
    existing.vocabPairs = uniqueObjects([...existing.vocabPairs, ...step.vocabPairs], item => `${item.target}|${item.ru}`).slice(0, 12);
    existing.generatedTasks = uniqueObjects([...existing.generatedTasks, ...step.generatedTasks], item => `${item.title}|${item.instruction}`).slice(0, 8);
    existing.quiz = uniqueObjects([...existing.quiz, ...step.quiz], item => item.q).slice(0, 10);
  }
  return merged;
}

function groupLocalSections(sections, langKey) {
  const grouped = [];
  for (const section of sections) {
    const inferred = inferTopicByKeywords(`${section.title}\n${section.chunk}`, langKey);
    const title = cleanTopicTitle(inferred || section.title, '');
    const existing = grouped.find(item => areSimilarTopics(item.title, title));
    if (!existing) {
      grouped.push({ ...section, title: title || `Учебная тема ${grouped.length + 1}` });
      continue;
    }
    existing.chunk = `${existing.chunk}\n${section.chunk}`.slice(0, 12_000);
    existing.summary = [existing.summary, section.summary].filter(Boolean).join(' ').slice(0, 700);
  }
  return grouped;
}

function uniqueObjects(items, keyFn) {
  const seen = new Set();
  return items.filter(item => {
    const key = keyFn(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function numberStepTitles(steps) {
  return steps.map((step, idx) => ({
    ...step,
    topic: `Тема ${idx + 1}. ${cleanTopicTitle(step.topic, `Учебная тема ${idx + 1}`)}`
  }));
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
    level: state.profile.level,
    learningGoal: `Освоить тему «${title}» и подготовиться к уровню ${state.profile.targetLevel}.`,
    summary: section.summary || module.summary,
    grammarTitle: grammarInfo.grammarTitle,
    grammarRule: grammarInfo.grammarRule,
    grammarExamples,
    grammarQuiz,
    vocabPairs,
    ruPrompts,
    generatedTasks: buildTasksFromModule({
      ...module,
      grammarTitle: grammarInfo.grammarTitle,
      grammarRule: grammarInfo.grammarRule,
      vocab: vocabPairs,
      ruPrompts
    }),
    quiz: buildQuizFromModule({
      grammarQuiz,
      vocab: vocabPairs
    }),
    status: 'pending'
  };
}

function buildTasksFromModule(module) {
  const vocab = Array.isArray(module.vocab) && module.vocab.length ? module.vocab : [];
  const helperWords = vocab.slice(0, 6).map(v => `${v.ru} - ${v.target}`).join(', ');
  const tasks = [
    {
      title: `Отработка правила: ${module.grammarTitle}`,
      instruction: `Составьте 6 собственных предложений по правилу темы. Используйте разные лица, числа и формы. Не повторяйте примеры из объяснения.`
    },
    {
      title: 'Перевод RU -> язык',
      instruction: `Составьте и переведите 5 естественных русских предложений по теме, используя слова: ${helperWords}. Проверьте согласование рода, числа и падежа.`
    },
    {
      title: 'Изменение формы',
      instruction: `Напишите 5 предложений, затем измените в каждом лицо, число или время согласно правилу темы.`
    },
    {
      title: 'Связный текст',
      instruction: `Напишите 8-10 связанных предложений по теме, используя не менее 5 слов из списка: ${helperWords}.`
    }
  ];
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

function nextTopic() {
  if (!state.steps.length || state.currentStep >= state.steps.length - 1) return;
  state.currentStep += 1;
  resetLessonInteraction();
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
  }
  resetLessonInteraction();
  persistState();
  renderAll();
}

async function checkTaskAnswers() {
  const inputs = [...document.querySelectorAll('textarea[data-task-answer="1"]')];
  if (!inputs.length) return;
  const step = state.steps[state.currentStep];
  const answers = inputs.map((input, index) => ({
    taskIndex: index,
    type: step.generatedTasks[index]?.type || '',
    title: step.generatedTasks[index]?.title || `Задание ${index + 1}`,
    instruction: step.generatedTasks[index]?.instruction || '',
    hints: step.generatedTasks[index]?.hints || [],
    referenceAnswer: step.generatedTasks[index]?.referenceAnswer || '',
    answer: input.value.trim()
  }));
  if (answers.some(item => !item.answer)) {
    ui.taskFeedback.textContent = 'Заполните все три задания перед проверкой.';
    return;
  }

  ui.checkTasksBtn.disabled = true;
  ui.taskFeedback.textContent = 'Нейросеть подробно проверяет ответы...';
  try {
    const feedback = await fetchJsonWithAutomaticRetry(
      '/api/ai-feedback',
      {
        topic: {
          topic: step.topic,
          level: step.level,
          grammarRule: step.grammarRule,
          vocabularyGroups: step.vocabularyGroups
        },
        answers
      },
      (attempt, maxAttempts) => {
        ui.taskFeedback.textContent = `Нейросеть проверяет ответы: попытка ${attempt}/${maxAttempts}...`;
      }
    );
    renderTaskFeedback(feedback);
  } catch (error) {
    ui.taskFeedback.textContent = `Не удалось получить AI-комментарий после автоматических повторов: ${error.message}`;
  } finally {
    ui.checkTasksBtn.disabled = false;
  }
}

function renderTaskFeedback(feedback) {
  const step = state.steps[state.currentStep];
  const items = Array.isArray(feedback.items)
    ? feedback.items.map((item, index) => {
      const taskIndex = Number.isInteger(Number(item.taskIndex)) ? Number(item.taskIndex) : index;
      const correctedAnswer = String(
        item.correctedAnswer || step?.generatedTasks?.[taskIndex]?.referenceAnswer || ''
      ).trim();
      return `
      <article class="task feedback-card">
        <h3>Задание ${taskIndex + 1}</h3>
        <p><strong>Что получилось:</strong> ${item.strengths || '—'}</p>
        <p><strong>Что улучшить:</strong> ${item.improvements || '—'}</p>
        <p>${item.feedback || ''}</p>
        ${correctedAnswer ? `
          <div class="reference-answer">
            <h4>Правильный вариант</h4>
            <div>${formatMultilineText(correctedAnswer)}</div>
          </div>
        ` : ''}
      </article>
    `;
    }).join('')
    : '';
  const grammar = Array.isArray(feedback.focusGrammar) ? feedback.focusGrammar.join('; ') : '';
  const vocabulary = Array.isArray(feedback.focusVocabulary) ? feedback.focusVocabulary.join('; ') : '';
  ui.taskFeedback.innerHTML = `
    <strong>Общий комментарий:</strong> ${feedback.overall || ''}
    ${grammar ? `<p><strong>Грамматический фокус:</strong> ${grammar}</p>` : ''}
    ${vocabulary ? `<p><strong>Лексический фокус:</strong> ${vocabulary}</p>` : ''}
    <div class="tasks">${items}</div>
  `;
}

async function checkQuiz() {
  const step = state.steps[state.currentStep];
  if (!step) return;
  const questionCards = [...ui.quiz.querySelectorAll('.q-item')];
  const selectedAnswers = questionCards.map(card => card.querySelector('input[type="radio"]:checked'));
  if (selectedAnswers.some(answer => !answer)) {
    ui.quizResult.textContent = 'Ответьте на все вопросы перед проверкой.';
    return;
  }

  let score = 0;
  const answers = [];
  step.quiz.forEach((q, i) => {
    const card = questionCards[i];
    if (!card) return;
    const checked = card.querySelector('input[type="radio"]:checked');
    const selected = checked ? Number(checked.value) : -1;
    const isCorrect = selected === q.ok;
    if (isCorrect) score += 1;
    answers.push({
      question: q.q,
      selectedAnswer: selected >= 0 ? q.a[selected] : '',
      correctAnswer: q.a[q.ok],
      isCorrect
    });

    card.classList.remove('quiz-correct', 'quiz-wrong');
    card.classList.add(isCorrect ? 'quiz-correct' : 'quiz-wrong');
    card.querySelectorAll('label').forEach((label, optionIndex) => {
      label.classList.remove('answer-correct', 'answer-wrong');
      if (optionIndex === q.ok) label.classList.add('answer-correct');
      if (optionIndex === selected && !isCorrect) label.classList.add('answer-wrong');
    });
    const oldMarker = card.querySelector('.quiz-marker');
    if (oldMarker) oldMarker.remove();
    const marker = document.createElement('div');
    marker.className = `quiz-marker ${isCorrect ? 'correct' : 'wrong'}`;
    marker.textContent = isCorrect
      ? '✓ Правильно'
      : `✕ Неправильно. Верный ответ: ${q.a[q.ok]}`;
    card.appendChild(marker);
  });
  const pct = Math.round((score / Math.max(1, step.quiz.length)) * 100);
  ui.quizResult.textContent = `Результат: ${score}/${step.quiz.length} (${pct}%). Нейросеть анализирует прогресс...`;
  if (pct >= 70 && step.status === 'pending') step.status = 'in_progress';
  persistState();

  ui.checkQuizBtn.disabled = true;
  try {
    const feedback = await fetchJsonWithAutomaticRetry(
      '/api/ai-test-feedback',
      {
        topic: {
          topic: step.topic,
          level: step.level,
          grammarRule: step.grammarRule
        },
        score: {
          correct: score,
          total: step.quiz.length,
          percent: pct
        },
        answers
      },
      (attempt, maxAttempts) => {
        ui.quizResult.textContent = `Результат: ${score}/${step.quiz.length} (${pct}%). AI-анализ: попытка ${attempt}/${maxAttempts}...`;
      }
    );
    renderQuizFeedback(score, step.quiz.length, pct, feedback);
  } catch (error) {
    ui.quizResult.textContent = `Результат: ${score}/${step.quiz.length} (${pct}%). AI-анализ недоступен: ${error.message}`;
  } finally {
    ui.checkQuizBtn.disabled = false;
  }
}

async function fetchJsonWithAutomaticRetry(url, payload, onAttempt, maxAttempts = 5) {
  let lastError = new Error('AI API не ответило.');
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    if (onAttempt) onAttempt(attempt, maxAttempts);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 100_000);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Ошибка API ${response.status}`);
      return data;
    } catch (error) {
      lastError = error.name === 'AbortError'
        ? new Error('Превышено время ожидания ответа.')
        : error;
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, attempt * 3000));
      }
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError;
}

function renderQuizFeedback(score, total, percent, feedback) {
  const repeated = Array.isArray(feedback.repeatedIssues) ? feedback.repeatedIssues.join('; ') : '';
  const grammar = Array.isArray(feedback.focusGrammar) ? feedback.focusGrammar.join('; ') : '';
  const vocabulary = Array.isArray(feedback.focusVocabulary) ? feedback.focusVocabulary.join('; ') : '';
  ui.quizResult.innerHTML = `
    <div class="test-feedback">
      <h3>Результат: ${score}/${total} (${percent}%)</h3>
      <p><strong>Общий анализ:</strong> ${feedback.overall || '—'}</p>
      <p><strong>Динамика:</strong> ${feedback.progress || '—'}</p>
      ${repeated ? `<p><strong>Повторяющиеся трудности:</strong> ${repeated}</p>` : ''}
      ${grammar ? `<p><strong>Повторить грамматику:</strong> ${grammar}</p>` : ''}
      ${vocabulary ? `<p><strong>Повторить лексику:</strong> ${vocabulary}</p>` : ''}
      ${feedback.nextStep ? `<p><strong>Следующий шаг:</strong> ${feedback.nextStep}</p>` : ''}
    </div>
  `;
}

function formatMultilineText(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replace(/\n/g, '<br>');
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
  renderProfile();
  renderFileList();
  renderRoadmap();
  renderTopicGuide();
  renderTasks();
  renderQuiz();
  renderTimer();
  setUploadAvailability();

  ui.buildPlanBtn.disabled = !state.extractedText.trim() || state.planBuilding;
  const hasPlan = state.steps.length > 0;
  ui.roadmapPanel.hidden = !hasPlan;
  ui.tasksPanel.hidden = !hasPlan;
  ui.quizPanel.hidden = !hasPlan;
}

function renderProfile() {
  ui.language.value = state.profile.language;
  ui.level.value = state.profile.level;
  ui.targetLevel.value = state.profile.targetLevel;
  ui.hours.value = state.profile.hours;
  ui.timerMinutes.value = state.timerDefaultMinutes;
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
    btn.textContent = `${step.topic}${step.level ? ` [${step.level}]` : ''}`;
    btn.addEventListener('click', () => {
      state.currentStep = idx;
      resetLessonInteraction();
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
  ui.activeTopic.textContent = step.topic;
  if (step.lessonLoading) {
    ui.topicGuide.innerHTML = '<p>Нейросеть готовит подробное правило, лексику, задания и тест для этой темы. Обычно это занимает до 3 минут.</p>';
    return;
  }
  if (!step.lessonLoaded) {
    const error = step.lessonError ? `<p class="error">${step.lessonError}</p>` : '';
    ui.topicGuide.innerHTML = `${error}<p>Это старый незавершённый план. Нажмите «Построить план», чтобы получить все уроки одним запросом.</p>`;
    return;
  }
  const examples = step.grammarExamples.map(e => `<li>${e.target} - ${e.ru}</li>`).join('');
  const ruleSections = (step.ruleSections || []).map(section => `
    <section class="rule-section">
      <h5>${section.title}</h5>
      <p>${section.text}</p>
    </section>
  `).join('');
  const vocabGroups = (step.vocabularyGroups || []).map((group, index) => {
    const rows = group.items.map(v => `<tr><td>${v.ru}</td><td>${v.target}</td></tr>`).join('');
    return `
      <details class="vocab-group" ${index === 0 ? 'open' : ''}>
        <summary>${group.title} (${group.items.length})</summary>
        <table class="vocab-table"><tbody>${rows}</tbody></table>
      </details>
    `;
  }).join('');
  ui.topicGuide.innerHTML = `
    <p><strong>Уровень:</strong> ${step.level || state.profile.level}</p>
    ${step.learningGoal ? `<p><strong>Цель:</strong> ${step.learningGoal}</p>` : ''}
    <p><strong>Содержание:</strong> ${step.summary || ''}</p>
    <h4>Правило: ${step.grammarTitle}</h4>
    <p>${step.grammarRule}</p>
    ${ruleSections}
    <h4>Примеры правила</h4>
    <ol class="guide-list">${examples}</ol>
    <h4>Лексика урока (${step.vocabPairs.length} слов и фраз)</h4>
    <div class="vocab-groups">${vocabGroups}</div>
  `;
}

function renderTasks() {
  ui.tasks.innerHTML = '';
  const step = state.steps[state.currentStep];
  if (!step || !step.lessonLoaded) {
    ui.checkTasksBtn.disabled = true;
    return;
  }
  ui.checkTasksBtn.disabled = false;
  step.generatedTasks.forEach((task, index) => {
    const card = document.createElement('article');
    card.className = 'task task-block';
    const hints = Array.isArray(task.hints) && task.hints.length
      ? `<details class="task-hints"><summary>Подсказки и условия</summary><ol>${task.hints.map(hint => `<li>${hint}</li>`).join('')}</ol></details>`
      : '';
    card.innerHTML = `
      <h3>${index + 1}. ${task.title}</h3>
      <div class="task-instruction">${formatMultilineText(task.instruction)}</div>
      ${hints}
      <textarea data-task-answer="1" rows="8" placeholder="Введите ваш ответ..."></textarea>
    `;
    ui.tasks.appendChild(card);
  });
}

function renderQuiz() {
  ui.quiz.innerHTML = '';
  const step = state.steps[state.currentStep];
  if (!step || !step.lessonLoaded) {
    ui.checkQuizBtn.disabled = true;
    return;
  }
  ui.checkQuizBtn.disabled = false;
  let questionIndex = 0;
  (step.quizSections || []).forEach(section => {
    const wrapper = document.createElement('section');
    wrapper.className = 'quiz-section';
    wrapper.innerHTML = `<h3>${section.title}</h3>`;
    section.questions.forEach(q => {
      const currentIndex = questionIndex;
      questionIndex += 1;
      const el = document.createElement('article');
      el.className = 'q-item';
      const options = q.a.map((option, idx) => `<label><input type="radio" name="q-${currentIndex}" value="${idx}" /> ${option}</label>`).join('');
      el.innerHTML = `<p>${q.q}</p>${options}`;
      wrapper.appendChild(el);
    });
    ui.quiz.appendChild(wrapper);
  });
}

function resetLessonInteraction() {
  ui.taskFeedback.textContent = '';
  ui.quizResult.textContent = '';
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
    delete state.pendingCards;
    delete state.approvedCards;
    state.profileConfirmed = false;
    state.planBuilding = false;
    state.timerRunning = false;
    state.steps = Array.isArray(state.steps)
      ? state.steps.map(step => ({
        ...step,
        lessonLoaded: step.lessonLoaded ?? Boolean(step.grammarRule && step.generatedTasks?.length),
        lessonLoading: false,
        lessonError: ''
      }))
      : [];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}
