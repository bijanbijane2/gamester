export type GameCategory = 
  | 'words'         // واژه و زبان
  | 'speed'         // سرعت و توجه
  | 'memory'        // حافظه و انعطاف
  | 'perception'    // ادراک و خطای دید
  | 'decision'      // ریسک و تصمیم
  | 'social'        // آدم‌ها و ذهن دیگران
  | 'case';         // پرونده‌ها

export type GameId = 
  | 'horoofchin'      // حروف‌چین
  | 'sarenakh'        // سرنخ
  | 'zanjireh'        // زنجیره
  | 'kalameh_ezafi'   // کلمه اضافی
  | 'panj_kalameh'    // پنج کلمه
  | 'harfe_baadi'     // حرف بعدی
  | 'stroop'          // استروپ
  | 'flanker'         // فلنکر
  | 'gonogo'          // Go / No-Go
  | 'visual_search'   // جستجوی بصری
  | 'reaction'        // زمان واکنش
  | 'digit_span'      // حافظه ارقام
  | 'rule_switch'     // تغییر قانون
  | 'illusions'       // خطای دید
  | 'balloon'         // بادکنک BART
  | 'iowa_boxes'      // چهار جعبه
  | 'social_mind'     // ذهن و نیت دیگران
  | 'case_2347'       // پرونده پیام ساعت ۲۳:۴۷
  | 'case_whisper';   // پرونده زمزمه در راهرو

export interface GameMetadata {
  id: GameId;
  title: string;
  category: GameCategory;
  categoryLabel: string;
  description: string;
  duration: string;
  type: 'entertainment' | 'cognitive' | 'case';
  badge?: string;
  unlockedByDefault?: boolean;
}

export interface UserStats {
  totalScore: number;
  gamesPlayed: number;
  dailyStreak: number;
  lastDailyDate: string;
  highScores: Record<GameId, number>;
  // Cognitive metrics (accumulated and normalized 0-100)
  cognitiveProfile: {
    processingSpeed: number;     // سرعت پردازش (Reaction, Stroop, Blitz)
    inhibitoryControl: number;   // بازداری تکانه (Go/No-Go, Flanker, Stroop)
    cognitiveFlexibility: number;// انعطاف ذهنی (Rule Switch)
    riskRegulation: number;      // مدیریت ریسک (Balloon BART, Iowa Boxes)
    verbalFluency: number;       // روانی کلامی (حروف‌چین، زنجیره، پنج کلمه)
    socialPerception: number;    // استنباط اجتماعی (تشخیص نیت، پرونده)
  };
  sampleCounts: {
    processingSpeed: number;
    inhibitoryControl: number;
    cognitiveFlexibility: number;
    riskRegulation: number;
    verbalFluency: number;
    socialPerception: number;
  };
  completedCases: string[];
}
