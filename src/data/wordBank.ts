export interface AnagramSet {
  id: string;
  letters: string[]; // e.g. ['م', 'ا', 'ر', 'د', 'ن']
  validWords: {
    word: string;
    score: number;
    definition?: string;
  }[];
}

export const ANAGRAM_SETS: AnagramSet[] = [
  {
    id: 'set-1',
    letters: ['م', 'ا', 'ر', 'د', 'ن'],
    validWords: [
      { word: 'مار', score: 10 },
      { word: 'نام', score: 10 },
      { word: 'نمد', score: 15 },
      { word: 'ران', score: 10 },
      { word: 'مرد', score: 10 },
      { word: 'دام', score: 10 },
      { word: 'مادر', score: 25 },
      { word: 'رمان', score: 25 },
      { word: 'دامن', score: 25 },
      { word: 'نادم', score: 25 },
      { word: 'درمان', score: 45 },
      { word: 'اندام', score: 45 },
      { word: 'نماد', score: 20 },
    ],
  },
  {
    id: 'set-2',
    letters: ['س', 'ت', 'ا', 'ر', 'ه'],
    validWords: [
      { word: 'تار', score: 10 },
      { word: 'رها', score: 10 },
      { word: 'راست', score: 25 },
      { word: 'تراس', score: 25 },
      { word: 'ستاره', score: 50 },
      { word: 'هراس', score: 25 },
      { word: 'ترسا', score: 25 },
      { word: 'سره', score: 15 },
      { word: 'سار', score: 10 },
    ],
  },
  {
    id: 'set-3',
    letters: ['گ', 'ل', 'د', 'ا', 'ن'],
    validWords: [
      { word: 'گل', score: 10 },
      { word: 'لگد', score: 15 },
      { word: 'دانا', score: 20 },
      { word: 'لنگ', score: 15 },
      { word: 'گند', score: 15 },
      { word: 'گلدان', score: 50 },
      { word: 'انگل', score: 25 },
      { word: 'دنگ', score: 15 },
      { word: 'لادن', score: 25 },
    ],
  },
  {
    id: 'set-4',
    letters: ['پ', 'ر', 'و', 'ا', 'ز'],
    validWords: [
      { word: 'پر', score: 10 },
      { word: 'راز', score: 10 },
      { word: 'روز', score: 10 },
      { word: 'زور', score: 10 },
      { word: 'پارو', score: 25 },
      { word: 'زوار', score: 25 },
      { word: 'پرواز', score: 50 },
      { word: 'پراز', score: 20 },
    ],
  },
  {
    id: 'set-5',
    letters: ['آ', 'س', 'م', 'ا', 'ن'],
    validWords: [
      { word: 'نما', score: 10 },
      { word: 'نام', score: 10 },
      { word: 'سام', score: 10 },
      { word: 'سان', score: 10 },
      { word: 'سامان', score: 35 },
      { word: 'آسمان', score: 50 },
      { word: 'امان', score: 25 },
      { word: 'آسان', score: 25 },
    ],
  },
];

export interface ClueQuestion {
  id: string;
  category: string;
  answer: string;
  clues: [string, string, string];
  explanation: string;
}

export const CLUE_QUESTIONS: ClueQuestion[] = [
  {
    id: 'clue-1',
    category: 'طبیعت و آب‌وهوا',
    answer: 'باران',
    clues: [
      'قطره‌های خیس و مداوم از دل آسمان',
      'ابرهای خاکستری تیره و بوی خاک نم‌خورده',
      'چترهای باز شده بالای سر عابران پیاده',
    ],
    explanation: 'باران پدیده جوی است که با متراکم شدن بخار آب در ابرها و ریزش قطرات شکل می‌گیرد.',
  },
  {
    id: 'clue-2',
    category: 'فرهنگ و مطالعه',
    answer: 'کتاب',
    clues: [
      'منبع خرد، سکوت و ورق زدن',
      'بوی کاغذ چاپ‌شده و عطف مقوایی',
      'قفسه‌های کتابخانه پر از سطرهای خواندنی',
    ],
    explanation: 'کتاب رسانه ماندگار دانش و داستان در طول قرن‌هاست.',
  },
  {
    id: 'clue-3',
    category: 'زمان و ابزار',
    answer: 'ساعت',
    clues: [
      'صدای تیک‌تاک یکنواخت و گذر لحظه‌ها',
      'دو یا سه عقربه دوان در یک صفحه مدور',
      'بستن بند چرمی یا فلزی روی مچ دست',
    ],
    explanation: 'ساعت ابزار سنجش گذار زمان از کهن‌ترین اختراعات بشر است.',
  },
  {
    id: 'clue-4',
    category: 'نوشیدنی و زندگی روزمره',
    answer: 'چای',
    clues: [
      'برگ‌های خشک گیاهی معطر از کوهپایه‌ها',
      'دم کشیدن در قوری چینی با بخار داغ',
      'استکان شیشه‌ای کمرباریک به همراه قند',
    ],
    explanation: 'چای نوشیدنی اصیل و نماد مهمان‌نوازی در فرهنگ ایرانی است.',
  },
  {
    id: 'clue-5',
    category: 'فناوری و ارتباطات',
    answer: 'نامه',
    clues: [
      'پیامی نگاشته با قلم روی صفحه‌ای سپید',
      'تمبری در گوشه پاکت ممهور به مهر اداره پست',
      'انتظار چند روزه برای شنیدن پاسخ از دوستی دوردست',
    ],
    explanation: 'نامه قدیمی‌ترین شکل ارتباط مکتوب از راه دور پیش از عصر اینترنت بود.',
  },
  {
    id: 'clue-6',
    category: 'طبیعت زمستانی',
    answer: 'برف',
    clues: [
      'سکوت وهم‌انگیز صبحگاهی در سرمای زیر صفر',
      'دانه‌های بلورین و شش‌ضلعی هندسی از ابرها',
      'سپیدپوش شدن بام خانه‌ها و ساختن آدم‌برفی',
    ],
    explanation: 'برف بلورهای یخ آب است که منظره‌ای یکدست سپید خلق می‌کند.',
  },
];

export interface OddWordQuestion {
  id: string;
  words: string[];
  oddIndex: number;
  level: 'easy' | 'medium' | 'hard' | 'abstract';
  levelLabel: string;
  rationale: string;
}

export const ODD_WORD_QUESTIONS: OddWordQuestion[] = [
  {
    id: 'odd-1',
    words: ['سیب', 'موز', 'پرتقال', 'صندلی'],
    oddIndex: 3,
    level: 'easy',
    levelLabel: 'آسان (رابطه رده‌ای)',
    rationale: '«صندلی» شیء غیرمیوه و اثاثیه منزل است، در حالی که بقیه میوه‌های خوراکی‌اند.',
  },
  {
    id: 'odd-2',
    words: ['پزشک', 'پرستار', 'بیمارستان', 'داروخانه', 'راننده'],
    oddIndex: 4,
    level: 'medium',
    levelLabel: 'متوسط (رابطه کارکردی)',
    rationale: '«راننده» ارتباط مستقیمی با زنجیره درمان و خدمات پزشکی ندارد.',
  },
  {
    id: 'odd-3',
    words: ['خودکار', 'مداد', 'روان‌نویس', 'تراش'],
    oddIndex: 3,
    level: 'medium',
    levelLabel: 'متوسط (ابزار نگارش)',
    rationale: '«تراش» ابزار آماده‌سازی و پیراستن است، در حالی که سایر گزینه‌ها ابزار مستقیم نوشتن هستند.',
  },
  {
    id: 'odd-4',
    words: ['شطرنج', 'تخته‌نرد', 'فوتبال', 'دوز'],
    oddIndex: 2,
    level: 'hard',
    levelLabel: 'سخت (رابطه مفهومی)',
    rationale: '«فوتبال» ورزش فیزیکی و حرکتی میدانی است، در حالی که سه مورد دیگر بازی‌های فکری رومیزی (Board Games) هستند.',
  },
  {
    id: 'odd-5',
    words: ['آهن', 'مس', 'طلا', 'شیشه'],
    oddIndex: 3,
    level: 'hard',
    levelLabel: 'سخت (ساختار ماده)',
    rationale: '«شیشه» جامد بی‌شکل (آمورف) و نارسانا است، در حالی که سه مورد دیگر فلزات خالص با رسانایی الکتریکی و گرمایی بالا هستند.',
  },
  {
    id: 'odd-6',
    words: ['امید', 'شجاعت', 'ترس', 'صبر'],
    oddIndex: 2,
    level: 'abstract',
    levelLabel: 'خیلی سخت (رابطه انتزاعی)',
    rationale: '«ترس» یک واکنش دفاعی هیجانی غیرارادی و بازدارنده است، در حالی که امید، شجاعت و صبر فضایل فعال و ارادی اخلاقی هستند.',
  },
];

export interface FiveWordsCategory {
  id: string;
  title: string;
  description: string;
  validList: string[];
}

export const FIVE_WORDS_CATEGORIES: FiveWordsCategory[] = [
  {
    id: 'cat-kitchen',
    title: 'وسایل و لوازم آشپزخانه',
    description: '۵ وسیله یا ابزار پرکاربرد در آشپزخانه بنویسید',
    validList: [
      'قاشق', 'چنگال', 'کارد', 'چاقو', 'بشقاب', 'لیوان', 'کاسه', 'قابلمه', 'ماهیتابه',
      'یخچال', 'اجاق', 'گاز', 'سینک', 'قوری', 'کتری', 'فنجان', 'مایکروویو', 'مخلوط‌کن',
      'رنده', 'کفگیر', 'ملاقه', 'آبکش', 'پیش‌بند', 'دستمال', 'سینی', 'سفره'
    ],
  },
  {
    id: 'cat-fruits',
    title: 'میوه‌های تازه و خوش‌طعم',
    description: '۵ نوع میوه مختلف را نام ببرید',
    validList: [
      'سیب', 'پرتقال', 'موز', 'نارنگی', 'کیوی', 'هندوانه', 'خربزه', 'طالبی', 'هلو',
      'شلیل', 'زردآلو', 'گیلاس', 'آلبالو', 'انگور', 'انجیر', 'انار', 'گلابی', 'توت',
      'خیار', 'آناناس', 'انبه', 'لیمو', 'گریپ‌فروت'
    ],
  },
  {
    id: 'cat-fragile',
    title: 'چیزهایی که می‌شکنند ولی خوردنی نیستند',
    description: '۵ چیزی که قابلیت شکستن دارند بنویسید',
    validList: [
      'شیشه', 'آینه', 'استکان', 'لیوان', 'بشقاب', 'گلدان', 'پنجره', 'قلب', 'عهد',
      'قول', 'پیمان', 'کاسه', 'ظرف', 'لامپ', 'استخوان', 'قفل', 'شاخه', 'سنگ', 'عینک'
    ],
  },
  {
    id: 'cat-cities',
    title: 'شهرهای بزرگ و دیدنی ایران',
    description: '۵ شهر شناخته‌شده کشورمان را بنویسید',
    validList: [
      'تهران', 'اصفهان', 'شیراز', 'مشهد', 'تبریز', 'یزد', 'اهواز', 'کرمان', 'رشت',
      'ساری', 'همدان', 'کرمانشاه', 'ارومیه', 'زاهدان', 'بوشهر', 'بندرعباس', 'کاشان', 'اردبیل'
    ],
  },
];

export interface MissingLetterQuestion {
  id: string;
  masked: string; // e.g. '_تاب'
  missingLetter: string; // e.g. 'ک'
  fullWord: string; // 'کتاب'
  options: string[]; // ['ک', 'ب', 'م', 'س']
}

export const MISSING_LETTER_QUESTIONS: MissingLetterQuestion[] = [
  {
    id: 'ml-1',
    masked: 'کتـ_ـب',
    missingLetter: 'ا',
    fullWord: 'کتاب',
    options: ['ا', 'و', 'ر', 'ی'],
  },
  {
    id: 'ml-2',
    masked: 'با_ان',
    missingLetter: 'ر',
    fullWord: 'باران',
    options: ['ر', 'ز', 'د', 'ل'],
  },
  {
    id: 'ml-3',
    masked: 'د_یا',
    missingLetter: 'ر',
    fullWord: 'دریا',
    options: ['ر', 'ن', 'س', 'ک'],
  },
  {
    id: 'ml-4',
    masked: 'آسـ_ـان',
    missingLetter: 'م',
    fullWord: 'آسمان',
    options: ['م', 'ت', 'ب', 'د'],
  },
  {
    id: 'ml-5',
    masked: 'پـ_ـواز',
    missingLetter: 'ر',
    fullWord: 'پرواز',
    options: ['ر', 'د', 'ش', 'ن'],
  },
  {
    id: 'ml-6',
    masked: 'شـ_ـرنج',
    missingLetter: 'ط',
    fullWord: 'شطرنج',
    options: ['ط', 'ت', 'ص', 'ق'],
  },
  {
    id: 'ml-7',
    masked: 'ستـ_ـره',
    missingLetter: 'ا',
    fullWord: 'ستاره',
    options: ['ا', 'و', 'ی', 'ه'],
  },
];
