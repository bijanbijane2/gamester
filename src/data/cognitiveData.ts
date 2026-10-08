export interface OpticalIllusionItem {
  id: string;
  title: string;
  type: 'size' | 'color' | 'motion';
  description: string;
  question: string;
  explanation: string;
  revealText: string;
}

export const OPTICAL_ILLUSIONS: OpticalIllusionItem[] = [
  {
    id: 'muller_lyer',
    title: 'خطای دید مولر-لایر (Müller-Lyer)',
    type: 'size',
    description: 'دو پاره‌خط با طول کاملاً یکسان، اما با پیکان‌های معکوس در انتها.',
    question: 'کدام خط به نظر شما بلندتر می‌رسد؟',
    explanation: 'مغز زاویه‌های باز پیکان را مانند گوشه داخلی یک اتاق (دورتر در فضا) تفسیر می‌کند و بر اساس اصل ثبات اندازه، آن را درازتر تخمین می‌زند.',
    revealText: 'هر دو پاره‌خط دارای طول دقیقاً ۲۴۰ پیکسل هستند!',
  },
  {
    id: 'simultaneous_contrast',
    title: 'کنتراست همزمان رنگ و روشنایی',
    type: 'color',
    description: 'دو مربع کوچک خاکستری دقیقاً هم‌رنگ که یکی روی پس‌زمینه تیره و دیگری روی پس‌زمینه روشن قرار دارند.',
    question: 'آیا مربع سمت راست روشن‌تر از مربع سمت چپ است؟',
    explanation: 'سلول‌های گانگلیونی شبکیه از طریق مهار جانبی (Lateral Inhibition) کنتراست را نسبت به زمینه اطراف برجسته می‌کنند.',
    revealText: 'هر دو مربع دقیقاً کد رنگی #71717a دارند!',
  },
  {
    id: 'ponzo_illusion',
    title: 'خطای پونزو (ریل قطار و ژرفا)',
    type: 'size',
    description: 'دو میله افقی هم‌اندازه روی دو خط همگرا (مانند ریل راه‌آهن که در افق به هم می‌رسند).',
    question: 'میله بالایی بلندتر است یا پایینی؟',
    explanation: 'مغز ناخودآگاه نشانه‌های ژرفانمایی و پرسپکتیو خطی را اعمال می‌کند و جسم دورتر را بزرگتر بازنمایی می‌کند.',
    revealText: 'طول هر دو میله بدون ۱ پیکسل اختلاف برابر است!',
  },
];

export interface SocialScenarioItem {
  id: string;
  senderName: string;
  senderRole: string;
  messageText: string;
  contextNote: string;
  options: {
    id: string;
    text: string;
    isCorrectTruth: boolean;
    insight: string;
  }[];
  groundTruthReveal: string;
}

export const SOCIAL_SCENARIOS: SocialScenarioItem[] = [
  {
    id: 'soc-1',
    senderName: 'مهرداد',
    senderRole: 'همکار در پروژه بازاریابی',
    messageText: '«سلام. ارائه‌ات تموم شد؟ دستت درد نکنه. اسلایدها رو فرستادم برای مدیریت. فقط صفحه ۵ رو یه تغییری دادم.»',
    contextNote: 'مهرداد لحن بسیار خشکی در پیام‌رسان دارد ولی در جلسات حضوری معمولاً گرم است.',
    options: [
      {
        id: 'opt1',
        text: 'او می‌خواهد کار شما را بی‌ارزش جلوه دهد و اعتبار را برای خودش بردارد.',
        isCorrectTruth: false,
        insight: 'سوگیری بدبینی ارتباط دیجیتال؛ در غیاب لحن و چهره، مغز گرایش به فرض بدترین نیت دارد.',
      },
      {
        id: 'opt2',
        text: 'او صرفاً غلط املایی یا شماره تماس اصلاح کرده تا آبروی کل تیم حفظ شود.',
        isCorrectTruth: true,
        insight: 'اصل تیغ هانلون (Hanlon’s Razor): هرگز چیزی را به نیت سوء نسبت ندهید وقتی سهل‌انگاری یا وظیفه‌شناسی ساده آن را توضیح می‌دهد.',
      },
      {
        id: 'opt3',
        text: 'او حسودی کرده و نخواسته شما به چشم بیایید.',
        isCorrectTruth: false,
        insight: 'خطای فرافکنی رقابتی ناشی از ناامنی روانی ناظر.',
      },
    ],
    groundTruthReveal: 'مهرداد صرفاً تاریخ جلسه را که به اشتباه هفته قبل خورده بود در صفحه ۵ به‌روزرسانی کرده بود و نام شما همچنان به عنوان ارائه‌دهنده اصلی در سربرگ قرار داشت.',
  },
  {
    id: 'soc-2',
    senderName: 'نگین',
    senderRole: 'مدیر توسعه محصول',
    messageText: '«لطفاً فردا قبل از ناهار ۱۰ دقیقه بیا اتاقم. درباره وظایف ماه آینده صحبت کنیم.»',
    contextNote: 'پیام ساعت ۱۷:۴۵ پنج‌شنبه ارسال شده است.',
    options: [
      {
        id: 'n1',
        text: 'قصد توبیخ، کاهش حقوق یا تعدیل نیرو دارد.',
        isCorrectTruth: false,
        insight: 'فاجعه‌سازی ذهنی (Catastrophizing) و اضطراب انتظار.',
      },
      {
        id: 'n2',
        text: 'قصد پیشنهاد ارتقای سمتی و تحویل دادن مسئولیت یک عضو جدید به شما دارد.',
        isCorrectTruth: true,
        insight: 'پیام‌های خنثی در واقعیت اداری معمولاً نشان‌دهنده روتین‌های برنامه‌ریزی هستند، نه بحران.',
      },
    ],
    groundTruthReveal: 'نگین می‌خواست پیشنهاد سرپرستی یک تیم دونفره جدید را مطرح کند و ترجیح داده بود موضوع را حضوری با شما هماهنگ کند.',
  },
];
