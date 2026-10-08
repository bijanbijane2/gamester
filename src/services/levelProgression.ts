/**
 * 100-Level Progression & Psychological Cognitive Unlock Chain System
 */

import { GameId } from '../types/game';

export interface PrerequisiteRule {
  targetGame: GameId;
  requiredGame: GameId;
  requiredGameTitle: string;
  cognitiveSkill: string;
  psychologicalRationale: string;
}

export interface LevelConfig {
  level: number;
  tier: 'beginner' | 'intermediate' | 'advanced' | 'master' | 'grandmaster';
  tierLabel: string;
  tierColor: string;
  title: string;
  targetScore: number;
  timeLimitSeconds: number;
  distractorCount: number;
  speedMultiplier: number;
}

export interface LevelLockStatus {
  isUnlocked: boolean;
  isCompleted: boolean;
  stars: number;
  highScore: number;
  level: number;
  gameId: GameId;
  reason?: string;
  prerequisite?: {
    gameId: GameId;
    gameTitle: string;
    requiredLevel: number;
    currentPrereqLevel: number;
    cognitiveSkill: string;
    psychologicalRationale: string;
  };
}

export const GAME_TITLES: Record<GameId, string> = {
  horoofchin: 'حروف‌چین',
  sarenakh: 'کلمه ممنوع (سرنخ)',
  zanjireh: 'زنجیره کلمات',
  kalameh_ezafi: 'کلمه اضافی',
  panj_kalameh: 'پنج کلمه',
  harfe_baadi: 'حرف بعدی (واکنش)',
  stroop: 'استروپ (رنگ جوهر)',
  flanker: 'فلنکر',
  gonogo: 'برو / نرو (مهار)',
  visual_search: 'جستجوی بصری',
  reaction: 'زمان واکنش',
  digit_span: 'فراخنای ارقام',
  rule_switch: 'تغییر قانون',
  illusions: 'گالری خطای دید',
  balloon: 'بادکنک جسور (BART)',
  iowa_boxes: 'چهار جعبه (Iowa)',
  social_mind: 'ذهن و نیت دیگران',
  case_2347: 'پرونده: پیام ۲۳:۴۷',
  case_whisper: 'پرونده: زمزمه در راهرو',
};

// Psychological Cognitive Dependency Chains
export const COGNITIVE_DEPENDENCIES: Record<GameId, { requiredGame: GameId; cognitiveSkill: string; rationale: string }> = {
  horoofchin: {
    requiredGame: 'zanjireh',
    cognitiveSkill: 'روانی تداعی لغوی',
    rationale: 'برای استخراج واژگان در حروف‌چین، مغز به مهارت اتصال سریع واژگان در بازی زنجیره کلمات نیاز دارد.',
  },
  zanjireh: {
    requiredGame: 'panj_kalameh',
    cognitiveSkill: 'دسته‌بندی و عمق معنایی',
    rationale: 'پیوند سریع حرف پایانی به آغازین، وابسته به گنجینه طبقه‌بندی شده واژگان در بازی پنج کلمه است.',
  },
  panj_kalameh: {
    requiredGame: 'kalameh_ezafi',
    cognitiveSkill: 'تمایز منطقی مقوله‌ها',
    rationale: 'استخراج پنج کلمه هم‌خانواده بدون خطا، نیازمند درک مرزهای مفهومی آموخته شده در کلمه اضافی است.',
  },
  kalameh_ezafi: {
    requiredGame: 'sarenakh',
    cognitiveSkill: 'کشف روابط مفهومی پنهان',
    rationale: 'تفکیک عضو نامتناسب از روی نشانه‌های پنهان، از مهارت رمزگشایی در معماهای سرنخ الگو می‌گیرد.',
  },
  sarenakh: {
    requiredGame: 'rule_switch',
    cognitiveSkill: 'انعطاف‌پذیری شناختی',
    rationale: 'حدس راز معما نیازمند چرخش توجه و رهایی از فرضیات اولیه‌ای است که در تغییر قانون تمرین می‌شود.',
  },
  rule_switch: {
    requiredGame: 'digit_span',
    cognitiveSkill: 'حافظه فعال ارقام',
    rationale: 'تغییر همزمان و مداوم قوانین در ذهن، مستلزم نگهداری چندگانه اطلاعات در حافظه کاری ارقام است.',
  },
  digit_span: {
    requiredGame: 'stroop',
    cognitiveSkill: 'مهار تداخل شناختی',
    rationale: 'حفظ رشته‌های بلند ارقام بدون پاک شدن، نیازمند فیلتر کردن اطلاعات مزاحم در آزمون استروپ است.',
  },
  stroop: {
    requiredGame: 'gonogo',
    cognitiveSkill: 'بازداری حرکتی و کنترل تکانه',
    rationale: 'غلبه بر وسوسه خواندن نوشته به جای اعلام رنگ، مستلزم تقویت ترمزهای مهاری در بازی برو/نرو است.',
  },
  gonogo: {
    requiredGame: 'visual_search',
    cognitiveSkill: 'پایش سریع میدان بینایی',
    rationale: 'تصمیم‌گیری میلی‌ثانیه‌ای برای شلیک یا بازداری، محتاج اسکن تیزبینانه در جستجوی بصری است.',
  },
  visual_search: {
    requiredGame: 'reaction',
    cognitiveSkill: 'زمان واکنش عصبی پایه',
    rationale: 'ردیابی اهداف در محیط‌های شلوغ، بر پایه سرعت تحریک عصب به عضله در زمان واکنش استوار است.',
  },
  reaction: {
    requiredGame: 'harfe_baadi',
    cognitiveSkill: 'شتاب پردازش محرک‌ها',
    rationale: 'کاهش زمان واکنش به تحریکات ناگهانی، از سرعت پردازش لغوی در آزمون حرف بعدی نیرو می‌گیرد.',
  },
  harfe_baadi: {
    requiredGame: 'horoofchin',
    cognitiveSkill: 'دسترسی سریع به واژگان',
    rationale: 'حدس فوری حرف گم‌شده، بر غنای گنجینه لغات حاصل از ساخت واژه در حروف‌چین تکیه دارد.',
  },
  balloon: {
    requiredGame: 'gonogo',
    cognitiveSkill: 'مهار طمع و تنظیم هیجان',
    rationale: 'توقف به موقع بادکنک پیش از انفجار، مستلزم ترمزهای مهاری قوی آموخته شده در بازی برو/نرو است.',
  },
  iowa_boxes: {
    requiredGame: 'balloon',
    cognitiveSkill: 'کالیبراسیون احساس ریسک',
    rationale: 'کشف شهودی جعبه‌های امن، از تجربه سود و زیان‌های غیرمنتظره در میدان بادکنک مشتق می‌شود.',
  },
  social_mind: {
    requiredGame: 'kalameh_ezafi',
    cognitiveSkill: 'تشخیص تناقض‌های رفتاری',
    rationale: 'فهم احساسات و نیات حقیقی دیگران، محتاج تمایز دادن نشانه‌های ناهمخوان و نامتناسب است.',
  },
  illusions: {
    requiredGame: 'visual_search',
    cognitiveSkill: 'واکاوی لایه‌ای تصویر',
    rationale: 'رهایی از خطاهای ادراک بینایی، مستلزم دقت در اجزای تصویر آموخته شده در جستجوی دیداری است.',
  },
  case_2347: {
    requiredGame: 'social_mind',
    cognitiveSkill: 'استنباط روانشناختی انگیزه‌ها',
    rationale: 'حل معمای کارآگاهی شبانه، بر پایه تحلیل انگیزه‌ها و رفتار انسان‌ها در ذهن دیگران است.',
  },
  case_whisper: {
    requiredGame: 'case_2347',
    cognitiveSkill: 'استدلال زنجیره‌ای کارآگاهی',
    rationale: 'شکستن تله تفکر گروهی مستلزم گذراندن تحلیل‌های مستند در پرونده پیام ۲۳:۴۷ است.',
  },
  flanker: {
    requiredGame: 'stroop',
    cognitiveSkill: 'توجه متمرکز انتخابی',
    rationale: 'مهار فلش‌های مزاحم کناری نیازمند توجه متمرکز پرورش‌یافته در استروپ است.',
  },
};

const STORAGE_KEY_LEVELS = 'zehen_game_levels_v2';

interface LevelStoreData {
  completedLevels: Record<GameId, number[]>; // Array of completed level numbers [1, 2, ...]
  levelStars: Record<GameId, Record<number, number>>; // { horoofchin: { 1: 3, 2: 2 } }
  levelHighScores: Record<GameId, Record<number, number>>;
}

export function loadLevelProgress(): LevelStoreData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEVELS);
    if (!raw) {
      // Default: Level 1 completed for basic start, levels 1, 2, 3 accessible
      return {
        completedLevels: {
          horoofchin: [1],
          sarenakh: [1],
          zanjireh: [1],
          kalameh_ezafi: [1],
          panj_kalameh: [1],
          harfe_baadi: [1],
          stroop: [1],
          flanker: [1],
          gonogo: [1],
          visual_search: [1],
          reaction: [1],
          digit_span: [1],
          rule_switch: [1],
          illusions: [1],
          balloon: [1],
          iowa_boxes: [1],
          social_mind: [1],
          case_2347: [1],
          case_whisper: [1],
        },
        levelStars: {
          horoofchin: { 1: 3 },
          zanjireh: { 1: 2 },
          stroop: { 1: 3 },
        } as any,
        levelHighScores: {} as any,
      };
    }
    return JSON.parse(raw);
  } catch {
    return { completedLevels: {} as any, levelStars: {} as any, levelHighScores: {} as any };
  }
}

export function saveLevelProgress(data: LevelStoreData): void {
  try {
    localStorage.setItem(STORAGE_KEY_LEVELS, JSON.stringify(data));
  } catch {}
}

/**
 * Returns the highest completed level for a game (0 if none)
 */
export function getHighestCompletedLevel(gameId: GameId): number {
  const data = loadLevelProgress();
  const completed = data.completedLevels[gameId] || [];
  if (completed.length === 0) return 0;
  return Math.max(...completed);
}

/**
 * Generates parameters for any level 1 to 100
 */
export function getLevelConfig(level: number): LevelConfig {
  let tier: LevelConfig['tier'] = 'beginner';
  let tierLabel = 'مبتدی (آشنایی)';
  let tierColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

  if (level > 15 && level <= 35) {
    tier = 'intermediate';
    tierLabel = 'میان‌رده (شتاب شناختی)';
    tierColor = 'text-blue-400 bg-blue-500/10 border-blue-500/30';
  } else if (level > 35 && level <= 60) {
    tier = 'advanced';
    tierLabel = 'پیشرفته (تسلط و تمرکز)';
    tierColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  } else if (level > 60 && level <= 85) {
    tier = 'master';
    tierLabel = 'حرفه‌ای (کارآزموده)';
    tierColor = 'text-purple-400 bg-purple-500/10 border-purple-500/30';
  } else if (level > 85) {
    tier = 'grandmaster';
    tierLabel = 'استاد بزرگ (اوج نبوغ)';
    tierColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  }

  // Scaling target score and speed
  const baseTarget = 100 + (level - 1) * 35;
  const timeLimit = Math.max(22, 60 - Math.floor(level * 0.35));
  const distractorCount = Math.min(8, 3 + Math.floor(level / 20));
  const speedMultiplier = 1 + level * 0.015;

  return {
    level,
    tier,
    tierLabel,
    tierColor,
    title: `مرحله ${level}: ${tierLabel.split(' ')[0]}`,
    targetScore: baseTarget,
    timeLimitSeconds: timeLimit,
    distractorCount,
    speedMultiplier,
  };
}

/**
 * Checks lock status for a specific game and level
 * - Levels 1, 2, 3: Unlocked for everyone!
 * - Levels 4+: Interconnected via Psychological Chain!
 */
export function checkLevelLockStatus(gameId: GameId, level: number): LevelLockStatus {
  const store = loadLevelProgress();
  const completed = store.completedLevels[gameId] || [];
  const isCompleted = completed.includes(level);
  const stars = store.levelStars[gameId]?.[level] || (isCompleted ? 2 : 0);
  const highScore = store.levelHighScores[gameId]?.[level] || 0;

  // Levels 1, 2, 3 are ALWAYS unlocked by default as requested!
  if (level <= 3) {
    return {
      isUnlocked: true,
      isCompleted,
      stars,
      highScore,
      level,
      gameId,
    };
  }

  // For level > 3:
  // 1. Must complete the immediately previous level of this game
  const prevLevelCompleted = completed.includes(level - 1);
  if (!prevLevelCompleted) {
    return {
      isUnlocked: false,
      isCompleted: false,
      stars: 0,
      highScore: 0,
      level,
      gameId,
      reason: `برای ورود به این مرحله ابتدا باید مرحله ${level - 1} همین بازی را به پایان برسانید.`,
    };
  }

  // 2. Psychological Cross-Game Interconnection!
  // To unlock level L of gameId, you must have advanced in its connected cognitive prerequisite game
  const dependency = COGNITIVE_DEPENDENCIES[gameId];
  if (dependency) {
    const prereqGameId = dependency.requiredGame;
    const prereqGameTitle = GAME_TITLES[prereqGameId] || prereqGameId;
    const highestPrereqCompleted = getHighestCompletedLevel(prereqGameId);

    // Required level in the partner game: e.g. for level 4, requires level 2 or 3 in partner
    // For level L, requires max(2, L - 2) in the prerequisite game
    const requiredPrereqLevel = Math.max(2, level - 2);

    if (highestPrereqCompleted < requiredPrereqLevel) {
      return {
        isUnlocked: false,
        isCompleted: false,
        stars: 0,
        highScore: 0,
        level,
        gameId,
        reason: `قفل روانشناختی: برای باز شدن مرحله ${level} این بازی، نیاز به تقویت «${dependency.cognitiveSkill}» دارید. باید بازی «${prereqGameTitle}» را حداقل تا مرحله ${requiredPrereqLevel} ارتقا دهید.`,
        prerequisite: {
          gameId: prereqGameId,
          gameTitle: prereqGameTitle,
          requiredLevel: requiredPrereqLevel,
          currentPrereqLevel: highestPrereqCompleted,
          cognitiveSkill: dependency.cognitiveSkill,
          psychologicalRationale: dependency.rationale,
        },
      };
    }
  }

  // All prerequisite conditions met!
  return {
    isUnlocked: true,
    isCompleted,
    stars,
    highScore,
    level,
    gameId,
  };
}

/**
 * Record completion of a level and update unlocks
 */
export function recordLevelCompletion(
  gameId: GameId,
  level: number,
  score: number,
  earnedStars: number = 3
): {
  newlyUnlockedThisGame: number[];
  unlockedPartnerGames: { gameId: GameId; gameTitle: string; unlockedLevel: number }[];
} {
  const store = loadLevelProgress();
  const currentCompleted = store.completedLevels[gameId] || [];

  if (!currentCompleted.includes(level)) {
    store.completedLevels[gameId] = [...currentCompleted, level];
  }

  // Store stars and high scores
  if (!store.levelStars[gameId]) store.levelStars[gameId] = {};
  const prevStars = store.levelStars[gameId][level] || 0;
  store.levelStars[gameId][level] = Math.max(prevStars, earnedStars);

  if (!store.levelHighScores[gameId]) store.levelHighScores[gameId] = {};
  const prevHigh = store.levelHighScores[gameId][level] || 0;
  store.levelHighScores[gameId][level] = Math.max(prevHigh, score);

  saveLevelProgress(store);

  // Check what partner games got unlocked by completing this level
  const partnerUnlocks: { gameId: GameId; gameTitle: string; unlockedLevel: number }[] = [];
  (Object.keys(COGNITIVE_DEPENDENCIES) as GameId[]).forEach((dependentGameId) => {
    if (COGNITIVE_DEPENDENCIES[dependentGameId].requiredGame === gameId) {
      // Check if dependent game has newly accessible levels
      const candidateLevel = level + 2;
      if (candidateLevel <= 100) {
        const status = checkLevelLockStatus(dependentGameId, candidateLevel);
        if (status.isUnlocked) {
          partnerUnlocks.push({
            gameId: dependentGameId,
            gameTitle: GAME_TITLES[dependentGameId],
            unlockedLevel: candidateLevel,
          });
        }
      }
    }
  });

  return {
    newlyUnlockedThisGame: [level + 1],
    unlockedPartnerGames: partnerUnlocks,
  };
}
