/**
 * Cognitive Intelligence Quotient (IQ) Analytics Engine
 * Calculates user's Cognitive IQ index across 4 core domains:
 * 1. حافظه (Memory)
 * 2. تمرکز (Focus & Inhibitory Control)
 * 3. تصمیم‌گیری (Decision Making & Risk)
 * 4. پردازش کلامی (Verbal Fluency & Language Processing)
 * Normalized on a standard cognitive index scale (Mean = 100, SD = 15, range 75 - 145)
 */

import { UserStats, GameId } from '../types/game';
import { loadLevelProgress } from './levelProgression';

export interface CognitiveCategoryBreakdown {
  key: 'memory' | 'focus' | 'decision' | 'verbal';
  title: string;
  englishTitle: string;
  iqScore: number;          // 75 to 145 scale
  percentageScore: number;  // 0 to 100%
  grade: 'نخبه و سرآمد' | 'بسیار بالا' | 'بالاتر از میانگین' | 'متوسط پویا' | 'نیازمند تمرین';
  color: string;
  borderColor: string;
  bgColor: string;
  iconName: string;
  strengths: string;
  recommendation: string;
  associatedGames: string[];
}

export interface CognitiveIQReport {
  compositeIQ: number;           // Total Cognitive Quotient (e.g., 122)
  percentileRank: number;         // e.g. 91%
  classification: string;        // e.g. 'هوش تحلیلی و شناختی سرآمد (Superior)'
  archetype: string;             // e.g. 'استراتژیست تیزبین و چندوجهی'
  archetypeDesc: string;
  categories: {
    memory: CognitiveCategoryBreakdown;
    focus: CognitiveCategoryBreakdown;
    decision: CognitiveCategoryBreakdown;
    verbal: CognitiveCategoryBreakdown;
  };
  totalGamesSampled: number;
  confidenceLevel: 'مقدماتی' | 'متوسط' | 'جامع و دقیق';
  summaryInsight: string;
}

/**
 * Calculates standardized Cognitive IQ (75-145) from raw 0-100 metric and performance samples
 */
function rawToIQScale(rawScore: number, sampleBonus: number = 0): number {
  // Baseline mean is 100, with raw 65 = 100 IQ. Each 10 points raw ≈ 7.5 IQ points
  const centered = (rawScore - 65) * 0.75;
  const sampledAdj = Math.min(6, sampleBonus * 0.5);
  const calculated = Math.round(100 + centered + sampledAdj);
  return Math.max(78, Math.min(145, calculated));
}

function getGrade(iq: number): CognitiveCategoryBreakdown['grade'] {
  if (iq >= 130) return 'نخبه و سرآمد';
  if (iq >= 120) return 'بسیار بالا';
  if (iq >= 110) return 'بالاتر از میانگین';
  if (iq >= 95) return 'متوسط پویا';
  return 'نیازمند تمرین';
}

export function calculateCognitiveIQ(stats: UserStats): CognitiveIQReport {
  const profile = stats.cognitiveProfile;
  const scores = stats.highScores;
  const levelStore = loadLevelProgress();

  // 1. حافظه (Memory & Working Cognitive Capacity)
  // Derived from: rule_switch, digit_span, cognitiveFlexibility, sample count
  const rawMemory = (
    profile.cognitiveFlexibility * 0.55 +
    (scores.digit_span > 0 ? Math.min(100, scores.digit_span * 0.8) : profile.cognitiveFlexibility) * 0.25 +
    (scores.rule_switch > 0 ? Math.min(100, scores.rule_switch * 0.5) : profile.cognitiveFlexibility) * 0.20
  );
  const memoryIQ = rawToIQScale(rawMemory, stats.sampleCounts.cognitiveFlexibility);

  // 2. تمرکز و مهار تکانه (Focus, Attention & Inhibitory Control)
  // Derived from: stroop, gonogo, visual_search, reaction, processingSpeed, inhibitoryControl
  const rawFocus = (
    profile.inhibitoryControl * 0.45 +
    profile.processingSpeed * 0.35 +
    (scores.stroop > 0 ? Math.min(100, scores.stroop * 0.5) : profile.inhibitoryControl) * 0.10 +
    (scores.gonogo > 0 ? Math.min(100, scores.gonogo * 0.8) : profile.inhibitoryControl) * 0.10
  );
  const focusIQ = rawToIQScale(rawFocus, stats.sampleCounts.inhibitoryControl + stats.sampleCounts.processingSpeed);

  // 3. تصمیم‌گیری و تنظیم ریسک (Decision Making, Risk & Emotional Calibration)
  // Derived from: balloon, iowa_boxes, social_mind, riskRegulation, socialPerception, completedCases
  const caseBonus = Math.min(15, (stats.completedCases?.length || 0) * 7.5);
  const rawDecision = (
    profile.riskRegulation * 0.40 +
    profile.socialPerception * 0.35 +
    (scores.balloon > 0 ? Math.min(100, scores.balloon * 0.35) : profile.riskRegulation) * 0.15 +
    caseBonus
  );
  const decisionIQ = rawToIQScale(rawDecision, stats.sampleCounts.riskRegulation);

  // 4. پردازش کلامی (Verbal Fluency & Language Processing)
  // Derived from: verbalFluency, horoofchin, sarenakh, zanjireh, kalameh_ezafi, panj_kalameh
  const rawVerbal = (
    profile.verbalFluency * 0.50 +
    (scores.horoofchin > 0 ? Math.min(100, scores.horoofchin * 0.8) : profile.verbalFluency) * 0.20 +
    (scores.zanjireh > 0 ? Math.min(100, scores.zanjireh * 0.7) : profile.verbalFluency) * 0.15 +
    (scores.kalameh_ezafi > 0 ? Math.min(100, scores.kalameh_ezafi * 0.8) : profile.verbalFluency) * 0.15
  );
  const verbalIQ = rawToIQScale(rawVerbal, stats.sampleCounts.verbalFluency);

  // Composite Weighted Calculation
  const compositeIQ = Math.round(
    memoryIQ * 0.25 +
    focusIQ * 0.30 +
    decisionIQ * 0.25 +
    verbalIQ * 0.20
  );

  // Approximate Population Percentile Rank
  // IQ 100 -> 50%, IQ 115 -> 84%, IQ 120 -> 91%, IQ 130 -> 98%
  const zScore = (compositeIQ - 100) / 15;
  const approxPercentile = Math.max(
    10,
    Math.min(99, Math.round(50 + 50 * Math.tanh(zScore * 0.85)))
  );

  let classification = 'هوش شناختی متعادل و فعال (Average Active)';
  if (compositeIQ >= 130) classification = 'هوش شناختی سرآمد و درخشان (Superior Genius)';
  else if (compositeIQ >= 120) classification = 'هوش شناختی بسیار برجسته (High Superior)';
  else if (compositeIQ >= 110) classification = 'هوش شناختی بالاتر از میانگین (Above Average)';
  else if (compositeIQ >= 95) classification = 'هوش شناختی بهینه و فعال (Active Baseline)';

  // Archetype Synthesis
  let archetype = 'تحلیل‌گر چندبعدی و منعطف';
  let archetypeDesc = 'شما تعادل مناسبی میان بازداری تکانه، ریتم واژگان و درک شهودی از موقعیت‌های پرریسک دارید.';

  if (focusIQ >= memoryIQ && focusIQ >= decisionIQ && focusIQ >= verbalIQ) {
    archetype = 'دیده‌بان تیزبین و مهارگر تکانه (Focused Guardian)';
    archetypeDesc = 'قدرت فیلتر کردن اطلاعات مزاحم و واکنش دقیق در شرایط پرتنش، بارزترین نقطه قوت مغز شماست.';
  } else if (verbalIQ >= focusIQ && verbalIQ >= memoryIQ && verbalIQ >= decisionIQ) {
    archetype = 'معمار زبانی و بازیابی معنایی (Verbal Architect)';
    archetypeDesc = 'گنجینه واژگانی غنی و سرعت تداعی مفاهیم در ذهن شما نسبت به سایر شاخص‌ها تسلط بالاتری دارد.';
  } else if (decisionIQ >= focusIQ && decisionIQ >= memoryIQ && decisionIQ >= verbalIQ) {
    archetype = 'استراتژیست محاسباتی و ریسک‌پژوه (Calculated Strategist)';
    archetypeDesc = 'توانایی تشخیص فرصت‌ها، مهار طمع و سنجش پیامدهای درازمدت مهم‌ترین ویژگی تفکر شماست.';
  } else if (memoryIQ >= focusIQ && memoryIQ >= decisionIQ && memoryIQ >= verbalIQ) {
    archetype = 'مغز متفکر و گنجینه حافظه کاری (Cognitive Synthesizer)';
    archetypeDesc = 'انعطاف در نگهداری اطلاعات همزمان و تطبیق سریع با قوانین جدید، مغز شما را به سیستمی پویا تبدیل کرده است.';
  }

  const confidenceLevel =
    stats.gamesPlayed >= 15 ? 'جامع و دقیق' : stats.gamesPlayed >= 5 ? 'متوسط' : 'مقدماتی';

  return {
    compositeIQ,
    percentileRank: approxPercentile,
    classification,
    archetype,
    archetypeDesc,
    categories: {
      memory: {
        key: 'memory',
        title: 'حافظه فعال و انعطاف الگو',
        englishTitle: 'Working Memory & Flexibility',
        iqScore: memoryIQ,
        percentageScore: Math.round(rawMemory),
        grade: getGrade(memoryIQ),
        color: 'text-indigo-400',
        borderColor: 'border-indigo-500/30',
        bgColor: 'bg-indigo-500/10',
        iconName: 'Brain',
        strengths: 'نگهداری هم‌زمان متغیرها در ذهن و شکستن سریع قوانین قدیمی هنگام تغییر شرایط.',
        recommendation: 'تمرین چالش‌های «تغییر قانون ویسکانسین» و «فراخنای ارقام مستقیم و معکوس».',
        associatedGames: ['تغییر قانون', 'فراخنای ارقام', 'سرنخ'],
      },
      focus: {
        key: 'focus',
        title: 'تمرکز، مهار تکانه و دقت حسی',
        englishTitle: 'Inhibitory Focus & Precision',
        iqScore: focusIQ,
        percentageScore: Math.round(rawFocus),
        grade: getGrade(focusIQ),
        color: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
        bgColor: 'bg-emerald-500/10',
        iconName: 'ShieldCheck',
        strengths: 'توانایی تفکیک داده‌های متضاد، مهار کلیک‌های اشتباه و زمان واکنش عصبی مناسب.',
        recommendation: 'آزمون‌های سرعتی «استروپ رنگ جوهر» و بازی «برو / نرو» جهت تثبیت ترمزهای مغزی.',
        associatedGames: ['استروپ', 'برو / نرو', 'زمان واکنش', 'جستجوی بصری'],
      },
      decision: {
        key: 'decision',
        title: 'تصمیم‌گیری، ریسک و هوش اجتماعی',
        englishTitle: 'Risk Calibration & Social Mind',
        iqScore: decisionIQ,
        percentageScore: Math.round(rawDecision),
        grade: getGrade(decisionIQ),
        color: 'text-rose-400',
        borderColor: 'border-rose-500/30',
        bgColor: 'bg-rose-500/10',
        iconName: 'TrendingUp',
        strengths: 'ارزیابی هوشمندانه میان سود فوری و خطر انفجار؛ درک پیام‌های مبهم و خواندن انگیزه‌های پنهان.',
        recommendation: 'تعمیق در پرونده‌های تعاملی رفتاری و کالیبراسیون احساس سود در «چهار جعبه Iowa».',
        associatedGames: ['بادکنک BART', 'چهار جعبه Iowa', 'ذهن دیگران', 'پرونده‌های کارآگاهی'],
      },
      verbal: {
        key: 'verbal',
        title: 'پردازش کلامی و روانی دسترسی به واژگان',
        englishTitle: 'Verbal Fluency & Lexical Speed',
        iqScore: verbalIQ,
        percentageScore: Math.round(rawVerbal),
        grade: getGrade(verbalIQ),
        color: 'text-amber-400',
        borderColor: 'border-amber-500/30',
        bgColor: 'bg-amber-500/10',
        iconName: 'BookOpen',
        strengths: 'سرعت کشف روابط پنهان کلمات، تداعی پیوسته حرف پایانی به آغازین و استخراج واژگان غنی.',
        recommendation: 'انجام رکوردهای زنجیره‌ای در «حروف‌چین» و تفکیک مفهومی در «کلمه اضافی».',
        associatedGames: ['حروف‌چین', 'زنجیره کلمات', 'کلمه اضافی', 'پنج کلمه'],
      },
    },
    totalGamesSampled: stats.gamesPlayed,
    confidenceLevel,
    summaryInsight: `پروفایل شناختی شما ضریب هوش کلی ${compositeIQ} را ثبت کرده که شما را در چارک برتر ${approxPercentile} درصدی کاربران قرار می‌دهد. تداوم تمرین در زنجیره ۱۰۰ مرحله‌ای به ثبات قشر پیش‌پیشانی در تمام ۴ دسته کمک می‌کند.`,
  };
}
