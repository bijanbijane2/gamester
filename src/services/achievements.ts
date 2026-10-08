/**
 * Comprehensive Achievement System (سیستم جامع دستاوردها و مدال‌های دیجیتال)
 */

import { UserStats, GameId } from '../types/game';
import { getHighestCompletedLevel } from './levelProgression';

export type AchievementRarity = 'برنزی' | 'نقره‌ای' | 'طلایی' | 'الماس';

export interface Achievement {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  rarity: AchievementRarity;
  rarityColor: string;
  borderGlow: string;
  currentProgress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  category: 'speed' | 'words' | 'decision' | 'memory' | 'case' | 'general';
}

export function evaluateAchievements(stats: UserStats): Achievement[] {
  const highScores = stats.highScores;

  // Retrieve linear 100-enigma journey progress
  let enigmaCurrentStage = 1;
  try {
    const raw = localStorage.getItem('zehen_enigma_journey_stage');
    if (raw) enigmaCurrentStage = Math.max(1, Number(raw));
  } catch {}

  const focusScore = Math.max(highScores.stroop || 0, highScores.gonogo || 0);
  const wordSpeedScore = (highScores.horoofchin || 0) + (highScores.zanjireh || 0);

  return [
    {
      id: 'master_of_focus',
      title: 'استاد تمرکز',
      subtitle: 'مهار کامل خطاها و تثبیت توجه پایدار',
      description: 'کسب امتیاز بالای ۱۲۰ در آزمون‌های تمرکزی (استروپ یا برو/نرو) بدون ارتکاب خطای مهارکننده.',
      iconName: 'ShieldCheck',
      rarity: 'الماس',
      rarityColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      borderGlow: 'hover:border-cyan-400/50 shadow-cyan-500/10',
      currentProgress: Math.min(120, focusScore),
      maxProgress: 120,
      isUnlocked: focusScore >= 120,
      unlockedAt: focusScore >= 120 ? 'کسب شده' : undefined,
      category: 'speed',
    },
    {
      id: 'fast_wordcrafter',
      title: 'واژه‌پرداز سریع',
      subtitle: 'شتاب رعدآسا در بازیابی و ساخت کلمات',
      description: 'ثبت مجموع امتیاز بالای ۱۵۰ در چالش‌های زبانی پرشتاب و ساخت واژگان.',
      iconName: 'Zap',
      rarity: 'طلایی',
      rarityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      borderGlow: 'hover:border-amber-400/50 shadow-amber-500/10',
      currentProgress: Math.min(150, wordSpeedScore),
      maxProgress: 150,
      isUnlocked: wordSpeedScore >= 150,
      unlockedAt: wordSpeedScore >= 150 ? 'کسب شده' : undefined,
      category: 'words',
    },
    {
      id: 'enigma_centurion',
      title: 'پیشگام ۱۰۰ معما',
      subtitle: 'پیشروی در پویش خطی رمزگشایی و منطق',
      description: 'حل متوالی حداقل ۵ مرحله اختصاصی و غیرتکراری از پویش ۱۰۰ معما.',
      iconName: 'Compass',
      rarity: 'طلایی',
      rarityColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      borderGlow: 'hover:border-purple-400/50 shadow-purple-500/10',
      currentProgress: Math.min(5, enigmaCurrentStage),
      maxProgress: 5,
      isUnlocked: enigmaCurrentStage >= 5,
      unlockedAt: enigmaCurrentStage >= 5 ? 'کسب شده' : undefined,
      category: 'general',
    },
    {
      id: 'cipher_decryptor',
      title: 'رمزگشای باستانی',
      subtitle: 'شکستن کدهای الفبایی و معماهای متنی',
      description: 'کشف رمزهای پنهان در معماهای متنی و آزمون‌های استنتاج کلامی.',
      iconName: 'Search',
      rarity: 'نقره‌ای',
      rarityColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
      borderGlow: 'hover:border-teal-400/50 shadow-teal-500/10',
      currentProgress: Math.min(100, (highScores.sarenakh || 0) + (highScores.kalameh_ezafi || 0)),
      maxProgress: 100,
      isUnlocked: ((highScores.sarenakh || 0) + (highScores.kalameh_ezafi || 0)) >= 80,
      unlockedAt: ((highScores.sarenakh || 0) + (highScores.kalameh_ezafi || 0)) >= 80 ? 'کسب شده' : undefined,
      category: 'words',
    },
    {
      id: 'logic_virtuoso',
      title: 'استدلال‌گر منطقی',
      subtitle: 'انعطاف در ابطال فرضیات و قواعد نو',
      description: 'کسب بیش از ۱۲۰ امتیاز در آزمون‌های تغییر قانون و استدلال چندبعدی.',
      iconName: 'Brain',
      rarity: 'الماس',
      rarityColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      borderGlow: 'hover:border-indigo-400/50 shadow-indigo-500/10',
      currentProgress: Math.min(120, highScores.rule_switch || 0),
      maxProgress: 120,
      isUnlocked: (highScores.rule_switch || 0) >= 120,
      unlockedAt: (highScores.rule_switch || 0) >= 120 ? 'کسب شده' : undefined,
      category: 'memory',
    },
    {
      id: 'stroop_specialist',
      title: 'متخصص استروپ',
      subtitle: 'تفکیک بی‌نقص رنگ از واژه',
      description: 'کسب امتیاز بالای ۱۵۰ در آزمون استروپ تحت تداخل شدید شناختی.',
      iconName: 'Zap',
      rarity: 'طلایی',
      rarityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      borderGlow: 'hover:border-amber-400/50 shadow-amber-500/10',
      currentProgress: Math.min(150, highScores.stroop || 0),
      maxProgress: 150,
      isUnlocked: (highScores.stroop || 0) >= 150,
      unlockedAt: (highScores.stroop || 0) >= 150 ? 'کسب شده' : undefined,
      category: 'speed',
    },
    {
      id: 'word_chain_record',
      title: 'رکورددار زنجیره کلمات',
      subtitle: 'تداعی پیوسته واژگان',
      description: 'ثبت رکورد بالای ۱۲۰ در ساخت کلمات پیوسته با حرف پایانی.',
      iconName: 'Link',
      rarity: 'طلایی',
      rarityColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      borderGlow: 'hover:border-emerald-400/50 shadow-emerald-500/10',
      currentProgress: Math.min(120, highScores.zanjireh || 0),
      maxProgress: 120,
      isUnlocked: (highScores.zanjireh || 0) >= 120,
      unlockedAt: (highScores.zanjireh || 0) >= 120 ? 'کسب شده' : undefined,
      category: 'words',
    },
    {
      id: 'impulse_master',
      title: 'مهارگر تکانه',
      subtitle: 'تسلط بر ترمزهای حرکتی',
      description: 'ثبت امتیاز بالای ۱۰۰ در بازی برو/نرو بدون کلیک اشتباه روی قرمز.',
      iconName: 'ShieldCheck',
      rarity: 'الماس',
      rarityColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      borderGlow: 'hover:border-cyan-400/50 shadow-cyan-500/10',
      currentProgress: Math.min(100, highScores.gonogo || 0),
      maxProgress: 100,
      isUnlocked: (highScores.gonogo || 0) >= 100,
      unlockedAt: (highScores.gonogo || 0) >= 100 ? 'کسب شده' : undefined,
      category: 'speed',
    },
    {
      id: 'word_architect',
      title: 'معمار واژه‌ها',
      subtitle: 'استخراج لغات از حروف‌چین',
      description: 'کسب امتیاز بالای ۱۰۰ در استخراج واژگان در حروف‌چین ۶۰ ثانیه‌ای.',
      iconName: 'Sparkles',
      rarity: 'نقره‌ای',
      rarityColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      borderGlow: 'hover:border-purple-400/50 shadow-purple-500/10',
      currentProgress: Math.min(100, highScores.horoofchin || 0),
      maxProgress: 100,
      isUnlocked: (highScores.horoofchin || 0) >= 100,
      unlockedAt: (highScores.horoofchin || 0) >= 100 ? 'کسب شده' : undefined,
      category: 'words',
    },
    {
      id: 'calculated_risk',
      title: 'ریسک‌پذیر هوشمند',
      subtitle: 'مهار طمع در بادکنک BART',
      description: 'کسب بیش از ۲۵۰ امتیاز در بادکنک جسور و واریز امن سکه‌ها.',
      iconName: 'Flame',
      rarity: 'طلایی',
      rarityColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      borderGlow: 'hover:border-rose-400/50 shadow-rose-500/10',
      currentProgress: Math.min(250, highScores.balloon || 0),
      maxProgress: 250,
      isUnlocked: (highScores.balloon || 0) >= 250,
      unlockedAt: (highScores.balloon || 0) >= 250 ? 'کسب شده' : undefined,
      category: 'decision',
    },
    {
      id: 'master_detective',
      title: 'کارآگاه اعظم',
      subtitle: 'رمزگشایی پرونده‌های رفتاری',
      description: 'بررسی کامل و حل حداقل یک پرونده روانشناختی چندمرحله‌ای.',
      iconName: 'Search',
      rarity: 'طلایی',
      rarityColor: 'text-amber-300 bg-amber-400/10 border-amber-400/30',
      borderGlow: 'hover:border-amber-300/50 shadow-amber-400/10',
      currentProgress: Math.min(1, stats.completedCases?.length || 0),
      maxProgress: 1,
      isUnlocked: (stats.completedCases?.length || 0) >= 1,
      unlockedAt: (stats.completedCases?.length || 0) >= 1 ? 'حل شده' : undefined,
      category: 'case',
    },
    {
      id: 'iron_will',
      title: 'استقامت روزانه',
      subtitle: 'تداوم در چالش رمز روز',
      description: 'حفظ پیوستگی حضور در بازی حداقل به مدت ۳ روز پیاپی.',
      iconName: 'Trophy',
      rarity: 'برنزی',
      rarityColor: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
      borderGlow: 'hover:border-orange-400/50 shadow-orange-500/10',
      currentProgress: Math.min(3, stats.dailyStreak || 1),
      maxProgress: 3,
      isUnlocked: (stats.dailyStreak || 1) >= 3,
      unlockedAt: (stats.dailyStreak || 1) >= 3 ? 'پیوسته' : undefined,
      category: 'general',
    },
  ];
}
