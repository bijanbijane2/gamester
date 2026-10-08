/**
 * Cognitive Weakness Analysis & Complementary Game Recommendation System
 * Analyzes cognitive deficits (e.g. lower inhibitory control in Go/No-Go)
 * and recommends targeted complementary brain exercises.
 */

import { GameId, UserStats } from '../types/game';

export interface RecommendedGame {
  gameId: GameId;
  title: string;
  category: string;
  trainingRole: string; // e.g. 'مکمل مستقیم مهار تکانه'
  whyItHelps: string;   // Psychological reason why this reinforces the weakness
  duration: string;
  expectedBenefit: string;
}

export interface CognitiveWeaknessReport {
  domainKey: keyof UserStats['cognitiveProfile'];
  domainLabel: string;
  currentScore: number;
  benchmarkScore: number;
  severity: 'high' | 'medium' | 'mild';
  statusLabel: string;
  cognitiveSymptom: string;      // e.g. "کاهش دقت در Go/No-Go و شلیک تکانشی به محرک قرمز"
  psychologicalMechanism: string;// Deep psychological explanation of the brain mechanism
  recommendedGames: RecommendedGame[];
}

const DOMAIN_DETAILS: Record<
  keyof UserStats['cognitiveProfile'],
  {
    label: string;
    symptom: string;
    mechanism: string;
    recommendations: RecommendedGame[];
  }
> = {
  inhibitoryControl: {
    label: 'مهار تکانه و کنترل ترمزهای ذهنی (Inhibitory Control)',
    symptom: 'کاهش دقت در Go/No-Go، شلیک ناخواسته به محرک‌های قرمز یا خطا در تفکیک رنگ جوهر',
    mechanism:
      'در موقعیت‌های پرشتاب، مدار قشر پیش‌پیشانی جانبی (DLPFC) دچار فرسودگی بازدارنده می‌شود و تمایل خودکار دست به پاسخ، پیش از تایید نهایی آگاهانه فعال می‌گردد. تمرینات مکمل با تاخیر کنترل‌شده، قدرت بازداری را تقویت می‌کنند.',
    recommendations: [
      {
        gameId: 'gonogo',
        title: 'برو / نرو (Go / No-Go)',
        category: 'مهار حرکتی',
        trainingRole: 'تمرین مستقیم ترمز حرکتی',
        whyItHelps: 'تقویت نورون‌های مهاری مغز برای توقف فوری واکنش‌های خودکار با محرک‌های فریبنده سبز و قرمز.',
        duration: '۴۰ ثانیه',
        expectedBenefit: 'کاهش خطاهای کلیک کاذب و بازیابی تسلط بر واکنش‌های هیجانی',
      },
      {
        gameId: 'stroop',
        title: 'استروپ (رنگ جوهر)',
        category: 'مهار تداخل شناختی',
        trainingRole: 'تمرین تفکیک و فیلتر اطلاعات مزاحم',
        whyItHelps: 'مقاومت در برابر خواندن ناخودآگاه کلمه و وادار کردن کورتکس سینگولیت پیشین به تمرکز روی رنگ جوهر.',
        duration: '۳۰ ثانیه',
        expectedBenefit: 'ارتقای کنترل ارادی بر کانون توجه تحت فشار زمانی',
      },
      {
        gameId: 'balloon',
        title: 'بادکنک جسور (BART)',
        category: 'مهار طمع و تنظیم ریسک',
        trainingRole: 'مکمل تنظیم تکانشگری مالی/رفتاری',
        whyItHelps: 'آموختن توقف ارادی قبل از وقوع فاجعه انفجار، از طریق پاداش‌دهی به خویشتن‌داری.',
        duration: '۲ دقیقه',
        expectedBenefit: 'کاهش رفتارهای نسنجیده و افزایش تامل منطقی در لحظات حساس',
      },
    ],
  },
  processingSpeed: {
    label: 'سرعت پردازش و زمان واکنش عصبی (Processing Speed)',
    symptom: 'تاخیر در پردازش محرک‌های ناگهانی و طولانی شدن زمان تصمیم‌گیری اولیه',
    mechanism:
      'سرعت انتقال پیام‌های الکتروشیمیایی در ماده سفید مغز و هماهنگی عصب-عضله با کاهش تمرکز افت می‌کند. تمرین‌های ریز-سرعتی مسیرهای سیناپسی پاسخ را به شدت فعال و پرسرعت می‌سازند.',
    recommendations: [
      {
        gameId: 'reaction',
        title: 'زمان واکنش (Reaction Time)',
        category: 'سرعت پایه عصبی',
        trainingRole: 'تحریک رفلکس‌های صدم‌ثانیه‌ای',
        whyItHelps: 'تنظیم حساسیت سیستم عصبی مرکزی به تغییرات بصری ناگهانی با فیدبک میلی‌ثانیه‌ای.',
        duration: '۲۰ ثانیه',
        expectedBenefit: 'کاهش زمان پاسخ حسی و افزایش گوش‌به‌زنگی',
      },
      {
        gameId: 'harfe_baadi',
        title: 'حرف بعدی (واکنش شتابان)',
        category: 'شتاب رمزگشایی',
        trainingRole: 'ترکیب سرعت حسی با دسترسی زبانی',
        whyItHelps: 'مجبور کردن ذهن به بازیابی رعدآسای ساختار حروف در شرایط تپش عقربه ساعت.',
        duration: '۴۵ ثانیه',
        expectedBenefit: 'افزایش سرعت تصمیم‌گیری هم‌زمان در موقعیت‌های شلوغ',
      },
      {
        gameId: 'visual_search',
        title: 'جستجوی بصری (Visual Search)',
        category: 'اسکن محیطی',
        trainingRole: 'سرعت اسکن میدان دید',
        whyItHelps: 'تمرین فیلتر کردن پارازیت‌های بصری و شکار نشانه‌های هدف در کمترین کسورات ثانیه.',
        duration: '۳۰ ثانیه',
        expectedBenefit: 'تسریع یافتن اهداف مهم در میان حجم زیاد اطلاعات',
      },
    ],
  },
  cognitiveFlexibility: {
    label: 'انعطاف‌پذیری شناختی و رهایی از جمود (Cognitive Flexibility)',
    symptom: 'اصرار بر الگوی قبلی و دشواری در تغییر استراتژی هنگامی که شرایط دگرگون می‌شود',
    mechanism:
      'گیر افتادن در «حلقه سوگیری تثبیت» ناشی از وابستگی هسته‌های قاعده‌ای به الگوهای خوگرفته است. مغز باید یاد بگیرد بدون مقاومت قوانین کهنه را ابطال کند.',
    recommendations: [
      {
        gameId: 'rule_switch',
        title: 'تغییر قانون (Wisconsin Card Task)',
        category: 'انعطاف‌پذیری ناب',
        trainingRole: 'کشف شهودی قواعد متغیر',
        whyItHelps: 'ذهن به قانون رنگ یا شکل عادت می‌کند؛ بازی ناگهان قانون را می‌شکند تا انعطاف مغز را بیازماید.',
        duration: '۲ دقیقه',
        expectedBenefit: 'رهایی از تعصبات تصمیم‌گیری و سازگاری سریع با تغییرات',
      },
      {
        gameId: 'kalameh_ezafi',
        title: 'کلمه اضافی (تفکر منطقی چندبعدی)',
        category: 'چرخش فرضیه',
        trainingRole: 'بازتعریف پیوندهای مفهومی',
        whyItHelps: 'بررسی واژگان از زوایای معنایی گوناگون تا فرضیه اولیه‌ای که ذهن را فریب می‌دهد باطل شود.',
        duration: '۱ دقیقه',
        expectedBenefit: 'پرورش دیدگاه چندجانبه و تفکر خارج از چارچوب',
      },
      {
        gameId: 'sarenakh',
        title: 'معمای سرنخ (کلمه مخفی)',
        category: 'استدلال استقرایی',
        trainingRole: 'تغییر فرضیه با سرنخ‌های متضاد',
        whyItHelps: 'همگام‌سازی فرضیات در مواجهه با سرنخ‌های تدریجی و دست کشیدن شجاعانه از حدس‌های اشتباه.',
        duration: '۲ دقیقه',
        expectedBenefit: 'توانایی تفکر نقادانه و تغییر موضع هوشمندانه',
      },
    ],
  },
  riskRegulation: {
    label: 'تنظیم ریسک و هیجان تصمیم‌گیری (Risk Regulation)',
    symptom: 'افراط در ریسک‌های مخرب یا تفریط و احتیاط بازدارنده که مانع کسب سود می‌شود',
    mechanism:
      'عدم هماهنگی بین مدار پاداش دوپامینرژیک و آمیگدال باعث می‌شود فرد تخمین درستی از احتمالات و پیامدهای درازمدت نداشته باشد.',
    recommendations: [
      {
        gameId: 'balloon',
        title: 'بادکنک جسور (BART)',
        category: 'کالیبراسیون احساس ریسک',
        trainingRole: 'تنظیم نقطه بهینه سود و خطر',
        whyItHelps: 'تمرین شهودی درک نقطه بازده نزولی و خروج پیروزمندانه از میدان پیش از وقوع انفجار.',
        duration: '۲ دقیقه',
        expectedBenefit: 'مدیریت طمع و محافظت از دستاوردهای پایدار',
      },
      {
        gameId: 'iowa_boxes',
        title: 'چهار جعبه (Iowa Gambling Task)',
        category: 'تصمیم‌گیری شهودی بلندمدت',
        trainingRole: 'کشف خطرات نامرئی وسوسه‌انگیز',
        whyItHelps: 'تفکیک گزینه‌هایی که سود ظاهری زیاد ولی زیان ویرانگر دارند از گزینه‌های مطمئن و کم‌نوسان.',
        duration: '۲ دقیقه',
        expectedBenefit: 'توانایی انتخاب استراتژی‌های سودآور در بلندمدت',
      },
      {
        gameId: 'gonogo',
        title: 'برو / نرو (مهار تکانه)',
        category: 'مهار شتاب‌زدگی',
        trainingRole: 'توقف تکانه پیش از عمل خطرناک',
        whyItHelps: 'ترمز زدن به هیجان زودگذر پیش از تصمیم‌گیری‌های پرریسک.',
        duration: '۴۰ ثانیه',
        expectedBenefit: 'آرام‌سازی هیجانات در لحظات سرنوشت‌ساز',
      },
    ],
  },
  verbalFluency: {
    label: 'روانی کلامی و دسترسی واژگانی (Verbal Fluency)',
    symptom: 'کند شدن سرعت بازیابی کلمات در ذهن و گیر افتادن در انتخاب واژگان دقیق',
    mechanism:
      'کاهش تعاملات شبکه تمپورال-فرونتال چپ که مسئول ذخیره‌سازی و تداعی واژگان است. فعال‌سازی این شبکه با چالش‌های زنجیره‌ای، گنجینه لغات را دوباره در دسترس قرار می‌دهد.',
    recommendations: [
      {
        gameId: 'horoofchin',
        title: 'حروف‌چین (Word Anagrams)',
        category: 'ساخت و ترکیب کلمات',
        trainingRole: 'فعال‌سازی ذخایر واژگانی پنهان',
        whyItHelps: 'استخراج سریع‌ترین کلمات ممکن از میان حروف به‌هم‌ریخته تحت محدودیت زمانی.',
        duration: '۱ دقیقه',
        expectedBenefit: 'شتاب در ساخت واژه و تقویت حضور ذهن کلامی',
      },
      {
        gameId: 'zanjireh',
        title: 'زنجیره کلمات (Word Chain)',
        category: 'روانی تداعی پیوسته',
        trainingRole: 'پیوند زدن حرف پایانی به آغازین',
        whyItHelps: 'تداعی مداوم کلمات هم‌ریشه و زنجیره‌ای بدون مکث و تردید ذهنی.',
        duration: '۴۵ ثانیه',
        expectedBenefit: 'روانی زبان در سخنرانی، مکالمه و نگارش سریع',
      },
      {
        gameId: 'panj_kalameh',
        title: 'پنج کلمه (مقوله‌بندی واژگان)',
        category: 'شبکه‌بندی معنایی',
        trainingRole: 'طبقه‌بندی ساختارمند واژه‌ها',
        whyItHelps: 'دسته‌بندی موضوعی کلمات و کشف ۵ واژه متعلق به یک خانواده مفهومی.',
        duration: '۱ دقیقه',
        expectedBenefit: 'دقت در گزینش واژگان متناسب در مکالمات حرفه‌ای',
      },
    ],
  },
  socialPerception: {
    label: 'ادراک اجتماعی و استنباط نیات دیگران (Social Perception)',
    symptom: 'سخت شدن رمزگشایی از لحن‌ها، متن‌های مبهم و پیش‌بینی انگیزه‌های پنهان رفتاری',
    mechanism:
      'نظریه ذهن (Theory of Mind) نیازمند فعال‌سازی لوب گیجگاهی قدامی و قشر پیش‌پیشانی میانی است تا ناهماهنگی بین کلمات ظاهری و نیات باطنی آشکار شود.',
    recommendations: [
      {
        gameId: 'social_mind',
        title: 'ذهن و نیت دیگران (Social Mind)',
        category: 'روانشناسی ارتباطات',
        trainingRole: 'رمزگشایی از پیام‌های مبهم دیجیتال',
        whyItHelps: 'بررسی انگیزه‌های حقیقی پشت پیام‌های پیام‌رسان‌ها و تفکیک صمیمیت از کنایه.',
        duration: '۲ دقیقه',
        expectedBenefit: 'هوش هیجانی و ارتباطی بالاتر در محیط کار و زندگی',
      },
      {
        gameId: 'case_2347',
        title: 'پرونده: پیام ساعت ۲۳:۴۷',
        category: 'تحلیل روانشناختی رفتار',
        trainingRole: 'استدلال پرونده‌ای کارآگاهی',
        whyItHelps: 'بررسی شواهد، تناقض‌گویی‌ها و پیش‌داوری‌ها در یک سناریوی کارآگاهی چندمرحله‌ای.',
        duration: '۳ دقیقه',
        expectedBenefit: 'تشخیص بازی‌های روانی و مهار سوگیری‌های قضاوت',
      },
      {
        gameId: 'kalameh_ezafi',
        title: 'کلمه اضافی (کشف تناقض‌ها)',
        category: 'تشخیص عنصر نامتناسب',
        trainingRole: 'حساسیت به عناصر ناهماهنگ',
        whyItHelps: 'تقویت حس ششم برای شناسایی رفتارهای ناسازگار با موقعیت.',
        duration: '۱ دقیقه',
        expectedBenefit: 'تیزبینی در کشف عدم تطابق در رفتار دیگران',
      },
    ],
  },
};

/**
 * Identify the primary cognitive weakness from UserStats and return recommendations
 */
export function analyzeCognitiveWeaknesses(stats: UserStats): CognitiveWeaknessReport {
  const profile = stats.cognitiveProfile;
  const domains = Object.keys(profile) as Array<keyof UserStats['cognitiveProfile']>;

  // Prioritize inhibitoryControl if its score is suboptimal (e.g. < 72)
  // as explicitly noted in user brief ("مثل کاهش دقت در Go/No-Go")
  let targetKey: keyof UserStats['cognitiveProfile'] = 'inhibitoryControl';
  let minScore = profile.inhibitoryControl;

  domains.forEach((key) => {
    const val = profile[key];
    if (val < minScore) {
      minScore = val;
      targetKey = key;
    }
  });

  const detail = DOMAIN_DETAILS[targetKey];
  const benchmarkScore = 80;

  let severity: CognitiveWeaknessReport['severity'] = 'mild';
  let statusLabel = 'نیازمند تمرین منظم برای ثبات عملکرد';

  if (minScore < 60) {
    severity = 'high';
    statusLabel = 'اولویت اول تمرین شناختی (افت محسوس دقت)';
  } else if (minScore < 72) {
    severity = 'medium';
    statusLabel = 'فرصت طلایی ارتقا (نزدیک به سطح مطلوب)';
  }

  return {
    domainKey: targetKey,
    domainLabel: detail.label,
    currentScore: minScore,
    benchmarkScore,
    severity,
    statusLabel,
    cognitiveSymptom: detail.symptom,
    psychologicalMechanism: detail.mechanism,
    recommendedGames: detail.recommendations,
  };
}

/**
 * Get report for any specific cognitive domain
 */
export function getDomainWeaknessReport(
  domainKey: keyof UserStats['cognitiveProfile'],
  stats: UserStats
): CognitiveWeaknessReport {
  const score = stats.cognitiveProfile[domainKey];
  const detail = DOMAIN_DETAILS[domainKey];
  const benchmarkScore = 80;

  let severity: CognitiveWeaknessReport['severity'] = 'mild';
  let statusLabel = 'وضعیت پایدار';
  if (score < 60) {
    severity = 'high';
    statusLabel = 'نیازمند تمرین ویژه';
  } else if (score < 72) {
    severity = 'medium';
    statusLabel = 'تمرین تکمیلی پیشنهادی';
  }

  return {
    domainKey,
    domainLabel: detail.label,
    currentScore: score,
    benchmarkScore,
    severity,
    statusLabel,
    cognitiveSymptom: detail.symptom,
    psychologicalMechanism: detail.mechanism,
    recommendedGames: detail.recommendations,
  };
}
