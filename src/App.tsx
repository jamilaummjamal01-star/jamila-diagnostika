import { useMemo, useState } from "react";

type AnswerMap = Record<string, string>;

type Question = {
  id: string;
  title: string;
  help: string;
  options: Array<{
    value: string;
    label: string;
    note?: string;
  }>;
};

type SectorProfile = {
  label: string;
  focus: string;
  pillars: [string, string, string];
  formats: [string, string, string];
  notice?: string;
};

const questions: Question[] = [
  {
    id: "sector",
    title: "В какой сфере работает Ваш бизнес?",
    help: "Выберите наиболее близкий вариант. Это поможет подобрать релевантную модель контента.",
    options: [
      { value: "beauty", label: "Косметика и парфюмерия" },
      { value: "modest", label: "Одежда и аксессуары" },
      { value: "home", label: "Дом, декор и подарки" },
      { value: "islamic", label: "Исламские товары" },
      { value: "family", label: "Детские и семейные товары" },
      { value: "bakery", label: "Десерты и выпечка" },
      { value: "supplements", label: "БАДы и товары для здоровья" },
      { value: "horeca", label: "Кафе, ресторан или общепит" },
      { value: "kindergarten", label: "Частный детский сад" },
      { value: "bookstore", label: "Книжный магазин" },
      { value: "rehab", label: "Реабилитационный центр" },
      { value: "marketplace", label: "Маркетплейс или интернет-магазин" },
      { value: "expert", label: "Эксперт, обучение или услуги" },
      {
        value: "local",
        label: "Локальный бизнес",
        note: "Работает в конкретном городе или районе и привлекает клиентов рядом",
      },
      { value: "other", label: "Другое направление" },
    ],
  },
  {
    id: "stage",
    title: "На каком этапе находится бизнес?",
    help: "Этап определяет, нужен ли Вам запуск, настройка системы или масштабирование работающей модели.",
    options: [
      { value: "launch", label: "Новый проект или запуск", note: "Нужно представить продукт с нуля" },
      { value: "growth", label: "Стабильная работа и рост", note: "Есть продажи, нужен более сильный контент" },
      { value: "scale", label: "Масштабирование", note: "Нужно больше контента без потери качества" },
      { value: "restart", label: "Перезапуск", note: "Контент есть, но направление нужно пересобрать" },
    ],
  },
  {
    id: "goal",
    title: "Какова главная задача контента сейчас?",
    help: "Выберите только одну приоритетную цель на ближайший цикл. Остальные задачи можно подключить позже.",
    options: [
      { value: "sales", label: "Поддержать продажи" },
      { value: "launch", label: "Провести запуск" },
      { value: "trust", label: "Повысить доверие" },
      { value: "recognition", label: "Усилить узнаваемость" },
      { value: "system", label: "Наладить регулярный контент" },
      { value: "presentation", label: "Показать продукт сильнее" },
    ],
  },
  {
    id: "audience",
    title: "Насколько хорошо Вы понимаете свою аудиторию?",
    help: "Важно знать не только возраст и город, но и задачу, сомнения и критерии выбора клиента.",
    options: [
      { value: "clear", label: "Есть чёткий сегмент и понимание потребностей" },
      { value: "partial", label: "Есть общее представление, но без глубокой проверки" },
      { value: "unclear", label: "Пока ориентируемся на широкую аудиторию" },
    ],
  },
  {
    id: "offer",
    title: "Насколько ясно сформулировано Ваше предложение?",
    help: "Контент усиливает понятный оффер, но не может заменить сам продукт, цену и условия покупки.",
    options: [
      { value: "clear", label: "Понятны продукт, выгода, цена и отличие" },
      { value: "partial", label: "Основа есть, но формулировки нужно усилить" },
      { value: "unclear", label: "Предложение пока меняется или не оформлено" },
    ],
  },
  {
    id: "content",
    title: "Как выглядит Ваш контент сейчас?",
    help: "Это поможет выбрать между запуском с нуля, корректировкой или масштабированием.",
    options: [
      { value: "working", label: "Публикуем регулярно и видим отклик" },
      { value: "regular", label: "Публикуем регулярно, но результат слабый" },
      { value: "irregular", label: "Публикуем время от времени" },
      { value: "none", label: "Контента почти нет" },
    ],
  },
  {
    id: "channel",
    title: "Где контент должен работать в первую очередь?",
    help: "Сначала выбираем основную площадку, затем адаптируем сильные материалы под остальные.",
    options: [
      { value: "instagram", label: "Instagram" },
      { value: "telegram", label: "Telegram" },
      { value: "marketplace", label: "Маркетплейс или карточки товара" },
      { value: "multi", label: "Несколько площадок" },
    ],
  },
  {
    id: "assets",
    title: "Какие материалы уже есть для производства?",
    help: "Подойдут фотографии продукта, фирменный стиль, описание, отзывы, видео и реальные факты о товаре.",
    options: [
      { value: "ready", label: "Есть качественные исходники и фирменная база" },
      { value: "partial", label: "Есть часть материалов" },
      { value: "none", label: "Нужно начать со сбора исходников" },
    ],
  },
  {
    id: "cadence",
    title: "Какой объём нужен на первом этапе?",
    help: "Лучше начать с объёма, который можно стабильно согласовывать и использовать.",
    options: [
      { value: "campaign", label: "Контент-спринт под запуск", note: "Серия материалов на 2–3 недели" },
      { value: "light", label: "4–6 ключевых материалов в месяц" },
      { value: "standard", label: "8–12 материалов в месяц" },
      { value: "intensive", label: "16 и более материалов в месяц" },
    ],
  },
  {
    id: "values",
    title: "Соответствует ли проект этическим и исламским ограничениям?",
    help: "Мы не работаем с запретными товарами и услугами, обманом, откровенными образами, магией и гаданиями, нарушением авторских прав или недостоверными обещаниями.",
    options: [
      { value: "aligned", label: "Да, направление соответствует" },
      { value: "review", label: "Есть вопросы — нужна предварительная проверка" },
      { value: "not_aligned", label: "Нет, есть прямое несоответствие" },
    ],
  },
];

const sectorProfiles: Record<string, SectorProfile> = {
  beauty: {
    label: "визуальный beauty-бренд",
    focus: "передать качество, фактуру и ценность продукта без недостоверных обещаний и неподходящих образов",
    pillars: ["Продукт в деталях", "Сценарии применения", "Доверие и доказательства"],
    formats: ["нейрофотографии продукта", "короткие предметные видео", "карусели свойств и отличий"],
  },
  modest: {
    label: "бренд одежды и аксессуаров",
    focus: "показать коллекцию, материалы и сочетания в эстетичной, деликатной и коммерчески понятной форме",
    pillars: ["Коллекция и фактура", "Образы и сочетания", "Качество и история бренда"],
    formats: ["faceless fashion-видео", "редакционные нейрофотографии", "серии деталей и сочетаний"],
  },
  home: {
    label: "бренд товаров для дома",
    focus: "поместить продукт в узнаваемые жизненные сценарии и создать эмоционально цельную визуальную среду",
    pillars: ["Атмосфера и сценарий", "Материал и качество", "Повод для покупки"],
    formats: ["предметные нейросцены", "короткие атмосферные видео", "подборки и подарочные серии"],
  },
  islamic: {
    label: "бренд исламских товаров",
    focus: "соединить уважительную подачу, практическую пользу продукта и визуальную узнаваемость",
    pillars: ["Польза продукта", "Качество и смысл", "Доверие к бренду"],
    formats: ["предметные фото", "спокойные видео без музыки", "образовательные карусели"],
  },
  family: {
    label: "семейный или детский бренд",
    focus: "показать безопасность, практичность и пользу через продукт, не используя детей как инструмент давления",
    pillars: ["Польза для семьи", "Качество и безопасность", "Реальные сценарии"],
    formats: ["продуктовые нейрофотографии", "демонстрационные видео", "понятные карточки преимуществ"],
  },
  bakery: {
    label: "кондитерская или пекарня",
    focus: "показать вкус, фактуру, свежесть и поводы для заказа через аппетитную, но правдивую визуальную подачу",
    pillars: ["Ассортимент и детали", "Процесс и ингредиенты", "Повод для заказа"],
    formats: ["предметные фото десертов", "короткие ASMR-видео процесса", "сезонные меню и подборки"],
    notice: "Состав, вес, внешний вид и условия заказа должны соответствовать реальному продукту. Для халяль-позиционирования нужны подтверждённые данные о составе.",
  },
  supplements: {
    label: "бренд БАДов и товаров для здоровья",
    focus: "понятно представить состав, назначение и способ использования без медицинских гарантий и недостоверных обещаний",
    pillars: ["Состав и назначение", "Правила использования", "Документы и доверие"],
    formats: ["предметные продуктовые визуалы", "образовательные карусели", "короткие объясняющие видео"],
    notice: "Все утверждения о действии продукта должны быть подтверждены и предварительно согласованы. Контент не должен обещать лечение или гарантированный результат.",
  },
  horeca: {
    label: "кафе, ресторан или проект общепита",
    focus: "показать меню, качество приготовления, атмосферу и понятный повод посетить заведение или оформить заказ",
    pillars: ["Блюда и меню", "Процесс и качество", "Локальный повод прийти"],
    formats: ["фото блюд и меню", "короткие процессные видео", "сезонные предложения и афиши"],
    notice: "Визуал не должен заметно искажать размер порции, состав или внешний вид блюда. Информация о халяльности должна быть достоверной.",
  },
  kindergarten: {
    label: "частный детский сад",
    focus: "укрепить доверие родителей через программу, безопасность, среду, специалистов и прозрачный порядок знакомства с садом",
    pillars: ["Программа и развитие", "Безопасность и среда", "Команда и доверие"],
    formats: ["faceless-обзоры пространства", "информационные карусели", "короткие видео о распорядке и подходе"],
    notice: "Лица, имена и личные данные детей нельзя использовать без подтверждённого согласия родителей. Предпочтительна faceless-подача через пространство, материалы и работу команды.",
  },
  bookstore: {
    label: "книжный магазин",
    focus: "превратить ассортимент в понятные тематические подборки и помочь читателю быстрее выбрать подходящую книгу или подарок",
    pillars: ["Подборки и новинки", "Польза для читателя", "Атмосфера и сообщество"],
    formats: ["предметные книжные серии", "карусели-подборки", "короткие видео с новинками"],
    notice: "Для религиозной и образовательной литературы важно отдельно проверять корректность рекомендаций и не публиковать большие фрагменты книг без разрешения.",
  },
  rehab: {
    label: "реабилитационный центр",
    focus: "понятно объяснить направления помощи, квалификацию специалистов, условия обращения и путь клиента без давления и обещаний гарантированного результата",
    pillars: ["Направления помощи", "Специалисты и метод", "Условия и доверие"],
    formats: ["информационные карусели", "faceless-видео о центре", "понятные схемы пути обращения"],
    notice: "Нужны проверенные сведения о лицензиях, специалистах и методах. Нельзя обещать гарантированное восстановление или использовать истории клиентов без явного согласия.",
  },
  marketplace: {
    label: "товарный e-commerce проект",
    focus: "быстро объяснить ценность товара, снять возражения и выстроить масштабируемую систему визуальных материалов",
    pillars: ["Главная выгода", "Детали и доказательства", "Сценарии использования"],
    formats: ["карточки и инфографика", "короткие продуктовые видео", "варианты креативов для тестов"],
  },
  expert: {
    label: "экспертный или образовательный проект",
    focus: "показать компетентность через ясную пользу, метод и доказательства, сохраняя faceless-подачу",
    pillars: ["Полезные разборы", "Метод и процесс", "Результаты без преувеличений"],
    formats: ["карусели и схемы", "faceless-видео", "визуальные серии для прогрева"],
  },
  local: {
    label: "локальный бизнес",
    focus: "привлекать людей из конкретного города или района, показывая услугу, расположение, качество и понятный способ записаться или прийти",
    pillars: ["Услуга или продукт", "Процесс и качество", "Отзывы и следующий шаг"],
    formats: ["локальные промо-серии", "короткие процессные видео", "визуалы под акции и сезоны"],
    notice: "Локальный бизнес обслуживает клиентов в определённой географической зоне: например, салон, мастерская, клиника, студия, кафе или учебный центр в конкретном городе или районе.",
  },
  other: {
    label: "проект с индивидуальной моделью",
    focus: "сначала проверить аудиторию, предложение и путь клиента, затем выбрать визуальную систему",
    pillars: ["Ценность предложения", "Контекст использования", "Доверие к проекту"],
    formats: ["тестовая серия визуалов", "короткие объясняющие видео", "контент-гипотезы"],
  },
};

const goalProfiles: Record<
  string,
  { label: string; focus: string; mix: [string, string, string, string] }
> = {
  sales: {
    label: "поддержка продаж",
    focus: "связать каждый материал с ценностью продукта, возражением или понятным следующим действием",
    mix: ["35% продукт и ценность", "30% доказательства", "25% сценарии применения", "10% прямой оффер"],
  },
  launch: {
    label: "последовательный запуск",
    focus: "провести аудиторию от контекста и интереса к презентации продукта и предложению",
    mix: ["30% контекст и ожидание", "30% презентация", "25% доверие", "15% предложение"],
  },
  trust: {
    label: "рост доверия",
    focus: "показывать процесс, факты, критерии качества и полезную экспертность без завышенных обещаний",
    mix: ["35% процесс и экспертность", "30% доказательства", "25% польза", "10% предложение"],
  },
  recognition: {
    label: "узнаваемая подача",
    focus: "закрепить повторяемую визуальную систему и несколько смыслов, по которым бренд легко узнаётся",
    mix: ["40% фирменные серии", "25% история бренда", "25% польза", "10% предложение"],
  },
  system: {
    label: "регулярная контент-система",
    focus: "собрать повторяемые рубрики и производство, которое не зависит от ежедневного вдохновения",
    mix: ["35% ключевой продукт", "30% польза", "25% доверие", "10% предложение"],
  },
  presentation: {
    label: "сильная презентация продукта",
    focus: "показать детали, качество и сценарии так, чтобы ценность была понятна ещё до обращения",
    mix: ["40% продукт в деталях", "30% сценарии", "20% доказательства", "10% предложение"],
  },
};

const stageNotes: Record<string, string> = {
  launch: "Начать с одной аудитории и одного главного продукта: сначала контекст, затем презентация, доказательства и оффер.",
  growth: "Сохранить сильные темы, убрать случайные публикации и превратить лучшие идеи в повторяемые серии.",
  scale: "Создать мастер-материалы, систему вариаций и правила адаптации под разные площадки.",
  restart: "Провести короткий аудит, уточнить позиционирование и заново связать визуал с задачей бизнеса.",
};

const channelNotes: Record<string, string> = {
  instagram: "Основная связка: короткое вертикальное видео, карусели, предметные визуалы и поддерживающие Stories.",
  telegram: "Основная связка: нативные полезные публикации, компактные визуалы, серии сообщений и мягкие переходы к предложению.",
  marketplace: "Основная связка: обложка, понятная инфографика, доказательства, сценарии использования и короткое продуктовое видео.",
  multi: "Сначала создаётся один мастер-сюжет, затем он адаптируется под формат каждой площадки без механического дублирования.",
};

const cadenceNotes: Record<string, string> = {
  campaign: "контент-спринт на 2–3 недели с последовательностью «контекст → презентация → доказательство → действие»",
  light: "4–6 опорных материалов в месяц с аккуратным переиспользованием",
  standard: "8–12 материалов в месяц: базовый ритм для тестирования рубрик и форматов",
  intensive: "16+ материалов в месяц только при заранее утверждённых рубриках, шаблонах и порядке согласования",
};

function buildStrategy(answers: AnswerMap) {
  const sector = sectorProfiles[answers.sector] ?? sectorProfiles.other;
  const goal = goalProfiles[answers.goal] ?? goalProfiles.system;

  let readinessScore = 10;
  readinessScore += answers.audience === "clear" ? 15 : answers.audience === "partial" ? 8 : 0;
  readinessScore += answers.offer === "clear" ? 15 : answers.offer === "partial" ? 8 : 0;
  readinessScore +=
    answers.content === "working"
      ? 20
      : answers.content === "regular"
        ? 12
        : answers.content === "irregular"
          ? 5
          : 0;
  readinessScore += answers.assets === "ready" ? 15 : answers.assets === "partial" ? 8 : 0;
  readinessScore += answers.stage === "growth" || answers.stage === "scale" ? 15 : 10;
  readinessScore +=
    answers.cadence === "standard" || answers.cadence === "intensive" ? 15 : 10;
  readinessScore = Math.min(100, readinessScore);

  const readiness =
    readinessScore >= 78
      ? {
          label: "Готовность к системному производству",
          text: "Основа уже достаточно ясна. Можно переходить к регулярному циклу с рубриками, метриками и плановыми тестами.",
        }
      : readinessScore >= 58
        ? {
            label: "Готовность к тестовому циклу",
            text: "База есть, но сначала лучше провести короткий цикл из нескольких гипотез и уточнить то, что влияет на результат.",
          }
        : {
            label: "Сначала — настройка основы",
            text: "До большого объёма контента важно уточнить аудиторию, предложение и исходные материалы. Это снизит лишние расходы и правки.",
          };

  const priorities: string[] = [];
  if (answers.audience !== "clear") {
    priorities.push("Выбрать один приоритетный сегмент аудитории и зафиксировать его задачу, сомнения и критерии выбора.");
  }
  if (answers.offer !== "clear") {
    priorities.push("Сформулировать один главный оффер: продукт, выгода, отличие, цена или условия и следующий шаг.");
  }
  if (answers.assets !== "ready") {
    priorities.push("Собрать проверенные исходники: фото, свойства, размеры, факты, отзывы, фирменные элементы и ограничения.");
  }
  if (answers.content === "none" || answers.content === "irregular") {
    priorities.push("Создать первую связанную серию, а не набор отдельных публикаций: ценность → доказательство → применение → действие.");
  }
  priorities.push("Зафиксировать короткий контент-бриф: приоритетный продукт, аудитория, оффер, ограничения и один измеримый сигнал.");
  priorities.push(`Подготовить 3 контент-гипотезы под задачу «${goal.label}» и заранее определить, по каким сигналам их сравнивать.`);
  priorities.push("После первого цикла сохранить сильные решения как шаблоны и только затем увеличивать объём.");

  const channelFormat =
    answers.channel === "instagram"
      ? "серии для Instagram: Reels без музыки, карусели и предметные визуалы"
      : answers.channel === "telegram"
        ? "нативные серии для Telegram: полезный текст, визуальная опора и последовательные касания"
        : answers.channel === "marketplace"
          ? "комплект для карточки товара: обложка, инфографика, детали и короткое видео"
          : "мастер-серия с адаптацией под Instagram, Telegram и коммерческие площадки";

  const formats = Array.from(
    new Set([...sector.formats, channelFormat]),
  ).slice(0, 4);

  return {
    sector,
    goal,
    readiness,
    readinessScore,
    priorities: priorities.slice(0, 3),
    formats,
    stage: stageNotes[answers.stage] ?? stageNotes.growth,
    channel: channelNotes[answers.channel] ?? channelNotes.instagram,
    cadence: cadenceNotes[answers.cadence] ?? cadenceNotes.standard,
    eligible: answers.values !== "not_aligned",
    needsReview: answers.values === "review",
  };
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [complete, setComplete] = useState(false);
  const [copied, setCopied] = useState(false);

  const strategy = useMemo(() => buildStrategy(answers), [answers]);
  const question = questions[current];
  const selected = answers[question.id];

  const scrollTo = (id: string) => {
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 30);
  };

  const startDiagnostic = () => {
    setAnswers({});
    setCurrent(0);
    setStarted(true);
    setComplete(false);
    setCopied(false);
    scrollTo("diagnostic");
  };

  const selectAnswer = (value: string) => {
    setAnswers((previous) => ({ ...previous, [question.id]: value }));
  };

  const goNext = () => {
    if (!selected) return;
    if (current === questions.length - 1) {
      setComplete(true);
      scrollTo("result");
      return;
    }
    setCurrent((value) => value + 1);
  };

  const goBack = () => {
    if (current === 0) {
      setStarted(false);
      return;
    }
    setCurrent((value) => value - 1);
  };

  const restart = () => {
    startDiagnostic();
  };

  const resultText = complete
    ? [
        "Предварительная контент-диагностика",
        `Тип проекта: ${strategy.sector.label}.`,
        `Главная задача: ${strategy.goal.label}.`,
        `Стратегический фокус: ${strategy.sector.focus}; ${strategy.goal.focus}.`,
        `Готовность: ${strategy.readiness.label} — ${strategy.readinessScore}/100.`,
        `Рекомендуемый ритм: ${strategy.cadence}.`,
        `Первые шаги: ${strategy.priorities.join(" ")}`,
      ].join("\n")
    : "";

  const copyResult = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(resultText);
      } else {
        throw new Error("Clipboard API unavailable");
      }
      setCopied(true);
    } catch {
      const field = document.createElement("textarea");
      field.value = resultText;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(field);
      setCopied(successful);
    }
  };

  const progress = complete ? 100 : ((current + 1) / questions.length) * 100;

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="https://shakurova-content.ru" aria-label="Вернуться на главную страницу">
          <span className="brand-logo" aria-hidden="true" />
          <span>
            <strong>Джамиля Шакурова</strong>
            <small>ИИ-КОНТЕНТ ДЛЯ БИЗНЕСА</small>
          </span>
        </a>
        <div className="header-actions-nav">
          <a className="home-link" href="https://shakurova-content.ru">
            ← На главную
          </a>
          <button className="header-link" type="button" onClick={startDiagnostic}>
            Начать диагностику
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span />
            Персональная контент-диагностика
          </div>
          <h1>
            ИИ-контент, который
            <br />
            <span>работает на Ваш бизнес.</span>
          </h1>
          <p className="hero-lead">
            Пройдите короткую диагностику и получите персональный ориентир:
            на чём сосредоточиться, какие форматы использовать и с чего начать
            продвижение без лишней сложности.
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={startDiagnostic}>
              Пройти диагностику
              <span aria-hidden="true">→</span>
            </button>
            <p>
              <strong>5–7 минут</strong>
              Без регистрации
            </p>
          </div>
          <div className="values-note">
            <span aria-hidden="true">✓</span>
            Вера и этика — обязательная часть каждого решения
          </div>
        </div>

        <div className="hero-panel" id="diagnostic">
          <div className="panel-top">
            <span>{complete ? "Диагностика завершена" : "Предварительная диагностика"}</span>
            <span>{complete ? "Готово" : `${String(current + 1).padStart(2, "0")} / ${questions.length}`}</span>
          </div>
          <div className="progress" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>

          {!started ? (
            <div className="panel-intro">
              <div className="panel-logo-large" aria-hidden="true" />
              <p className="panel-kicker">Ваш результат</p>
              <h2>Ориентир для контента, основанный на задачах бизнеса</h2>
              <ul>
                <li>главный стратегический фокус;</li>
                <li>рекомендуемые форматы и ритм;</li>
                <li>три первых шага без лишней сложности.</li>
              </ul>
              <button className="panel-button" type="button" onClick={startDiagnostic}>
                Начать
              </button>
            </div>
          ) : complete ? (
            <div className="panel-complete">
              <div className="complete-mark" aria-hidden="true">✓</div>
              <p className="panel-kicker">Предварительный результат готов</p>
              <h2>
                {strategy.eligible
                  ? strategy.readiness.label
                  : "Проект требует пересмотра"}
              </h2>
              <p>
                {strategy.eligible
                  ? strategy.readiness.text
                  : "По указанным ответам продукт или способ продвижения не проходит обязательный этический фильтр."}
              </p>
              <button className="panel-button" type="button" onClick={() => scrollTo("result")}>
                {strategy.eligible ? "Открыть рекомендации" : "Посмотреть результат"}
              </button>
            </div>
          ) : (
            <div className="question-preview">
              <p className="panel-kicker">Вопрос {current + 1}</p>
              <h2>{question.title}</h2>
              <p className="question-help">{question.help}</p>
              <div className="option-grid">
                {question.options.map((option) => (
                  <button
                    className={selected === option.value ? "option selected" : "option"}
                    key={option.value}
                    type="button"
                    aria-pressed={selected === option.value}
                    onClick={() => selectAnswer(option.value)}
                  >
                    <span aria-hidden="true" />
                    <span className="option-copy">
                      <strong>{option.label}</strong>
                      {option.note ? <small>{option.note}</small> : null}
                    </span>
                  </button>
                ))}
              </div>
              <div className="panel-navigation">
                <button className="back-button" type="button" onClick={goBack}>
                  ← Назад
                </button>
                <button className="panel-button" type="button" disabled={!selected} onClick={goNext}>
                  {current === questions.length - 1 ? "Получить результат" : "Продолжить"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="trust-row" aria-label="Преимущества диагностики">
        <article>
          <span>01</span>
          <div>
            <strong>Аутентично</strong>
            <p>Рекомендации учитывают характер и реальную задачу Вашего бренда.</p>
          </div>
        </article>
        <article>
          <span>02</span>
          <div>
            <strong>Без лишних обещаний</strong>
            <p>Конкретный ориентир без давления, шаблонов и громких гарантий.</p>
          </div>
        </article>
        <article>
          <span>03</span>
          <div>
            <strong>Вера и этика</strong>
            <p>Контент проходит обязательную проверку на соответствие ценностям.</p>
          </div>
        </article>
      </section>

      {complete ? (
        <section className="result-section" id="result" aria-live="polite">
          {!strategy.eligible ? (
            <div className="ineligible-card">
              <p className="section-kicker">Результат проверки</p>
              <h2>Проект не подходит для сотрудничества в текущем виде</h2>
              <p>
                Я не создаю контент для направлений и способов продвижения,
                которые прямо противоречат исламским ограничениям. Если сам
                продукт или подход к продвижению будет изменён, диагностику
                можно пройти заново.
              </p>
              <button className="secondary-button" type="button" onClick={restart}>
                Пройти заново
              </button>
            </div>
          ) : (
            <>
              <div className="result-heading">
                <div>
                  <p className="section-kicker">Ваш персональный ориентир</p>
                  <h2>
                    {strategy.sector.label}
                    <br />
                    <em>фокус: {strategy.goal.label}</em>
                  </h2>
                </div>
                <div className="readiness-score" aria-label={`Готовность ${strategy.readinessScore} из 100`}>
                  <strong>{strategy.readinessScore}</strong>
                  <span>/ 100</span>
                  <small>готовность базы</small>
                </div>
              </div>

              {strategy.needsReview ? (
                <div className="review-notice">
                  <strong>Нужна предварительная этическая проверка.</strong>
                  До разработки контента важно уточнить продукт, визуальную
                  подачу и способ продвижения. Окончательное решение принимается
                  после короткого личного обсуждения.
                </div>
              ) : null}

              {strategy.sector.notice ? (
                <div className="sector-notice">
                  <strong>Важно для этой ниши.</strong>
                  {strategy.sector.notice}
                </div>
              ) : null}

              <div className="result-grid">
                <article className="result-card result-card-wide">
                  <p className="card-number">01 · Стратегический фокус</p>
                  <h3>{strategy.readiness.label}</h3>
                  <p>{strategy.readiness.text}</p>
                  <p>
                    Для Вашего проекта важно {strategy.sector.focus}. Главная
                    задача этого цикла — {strategy.goal.focus}.
                  </p>
                </article>

                <article className="result-card">
                  <p className="card-number">02 · Три опоры контента</p>
                  <ul className="clean-list">
                    {strategy.sector.pillars.map((pillar) => (
                      <li key={pillar}>{pillar}</li>
                    ))}
                  </ul>
                </article>

                <article className="result-card">
                  <p className="card-number">03 · Ориентировочная пропорция</p>
                  <ul className="mix-list">
                    {strategy.goal.mix.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>

                <article className="result-card">
                  <p className="card-number">04 · Форматы</p>
                  <ul className="clean-list">
                    {strategy.formats.map((format) => (
                      <li key={format}>{format}</li>
                    ))}
                  </ul>
                  <p className="card-note">
                    Звуковое оформление — без музыки; допустимые варианты
                    согласовываются отдельно.
                  </p>
                </article>

                <article className="result-card">
                  <p className="card-number">05 · Ритм и площадка</p>
                  <p>{strategy.cadence}.</p>
                  <p>{strategy.channel}</p>
                </article>

                <article className="result-card result-card-wide">
                  <p className="card-number">06 · Первые три шага</p>
                  <ol className="steps-list">
                    {strategy.priorities.map((priority) => (
                      <li key={priority}>{priority}</li>
                    ))}
                  </ol>
                  <div className="stage-note">
                    <strong>Тактика с учётом этапа:</strong>
                    {strategy.stage}
                  </div>
                </article>
              </div>

              <div className="result-disclaimer">
                Это предварительное, намеренно недетализированное направление.
                Полная стратегия строится после анализа продукта, аудитории,
                конкурентов, ресурсов и реального пути клиента.
              </div>

              <div className="cta-card">
                <div>
                  <p className="section-kicker">Следующий шаг</p>
                  <h2>Хотите превратить ориентир в рабочую систему?</h2>
                  <p>
                    Скопируйте результат и отправьте его мне. Я посмотрю вводные
                    и предложу подходящий формат сотрудничества без навязывания
                    лишнего объёма.
                  </p>
                </div>
                <div className="cta-actions">
                  <button className="secondary-button light" type="button" onClick={copyResult}>
                    {copied ? "Результат скопирован ✓" : "Скопировать результат"}
                  </button>
                  <a
                    className="primary-button"
                    href="https://www.instagram.com/jamila.shakurova_ai/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Обсудить проект
                    <span aria-hidden="true">→</span>
                  </a>
                  <button className="restart-link" type="button" onClick={restart}>
                    Пройти диагностику заново
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      ) : (
        <section className="method-section">
          <div>
            <p className="section-kicker">Как строится результат</p>
            <h2>Технологии на службе Вашего бизнеса.</h2>
            <p className="method-lead">
              ИИ — это инструмент, а не замена живого бренда. Поэтому сначала
              мы определяем смысл и задачу, а затем выбираем визуальное решение.
            </p>
          </div>
          <div className="method-grid">
            <article>
              <span>01</span>
              <h3>Бизнес-задача</h3>
              <p>Сфера, этап, аудитория и ясность Вашего предложения.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Аутентичность</h3>
              <p>Не готовый шаблон, а направление под характер Вашего бренда.</p>
            </article>
            <article>
              <span>03</span>
              <h3>ИИ-система</h3>
              <p>Понятные форматы, ритм и следующие действия с учётом ресурсов.</p>
            </article>
            <article>
              <span>04</span>
              <h3>Вера и этика</h3>
              <p>Обязательная проверка продукта, образов и способа продвижения.</p>
            </article>
          </div>
        </section>
      )}

      <footer>
        <span>© Джамиля Шакурова</span>
        <span>Корни · Современность · Технологии</span>
      </footer>
    </main>
  );
}
