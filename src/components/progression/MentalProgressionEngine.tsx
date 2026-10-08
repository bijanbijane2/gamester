/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * موتور پویش ۱۰۰ مرحله‌ای رمز روز و شناخت
 * حوزه‌های روانشناسی، فلسفه، سیاست و جامعه‌شناسی با درجه سختی صعودی
 * پشتیبانی از حالت تصادفی دستگاه، پیشرفت ترتیبی و مرور جامع ۱۰۰ مرحله
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ENIGMA_STAGES_100,
  EnigmaStage,
  EnigmaDomain,
  checkEnigmaAnswer,
} from '../../data/enigmaJourney100';
import {
  getDeviceDailyStageNumber,
  rollNewRandomStage,
  isStageSolved,
  markStageSolved,
  getSolvedStages,
} from '../../services/dailyEnigmaService';
import { sounds } from '../../services/sound';
import { speechCoach } from '../../services/speechCoach';
import {
  Brain,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Volume2,
  Trophy,
  Zap,
  ShieldCheck,
  Lock,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Compass,
  Shuffle,
  BookOpen,
  Filter,
  Search,
  Scale,
  Flame,
} from 'lucide-react';

interface Props {
  onBack: () => void;
  onStageCompleted?: (stageNum: number) => void;
  initialStage?: number;
}

const STORAGE_KEY_STAGE = 'zehen_enigma_journey_stage';

export const MentalProgressionEngine: React.FC<Props> = ({
  onBack,
  onStageCompleted,
  initialStage,
}) => {
  // مرحله جاری: مقدار اولیه ارسالی یا آخرین مرحله فعال
  const [currentStageNumber, setCurrentStageNumber] = useState<number>(() => {
    if (initialStage && initialStage >= 1 && initialStage <= 100) {
      return initialStage;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STAGE);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 100) {
          return parsed;
        }
      }
    } catch {}
    return getDeviceDailyStageNumber();
  });

  const [solvedStages, setSolvedStages] = useState<number[]>(() => {
    return getSolvedStages();
  });

  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{
    type: 'idle' | 'correct' | 'wrong';
    message: string;
    subtleHint?: string;
    explanation?: string;
  }>({ type: 'idle', message: '' });

  const [isReadingPrompt, setIsReadingPrompt] = useState(false);
  const [showClue, setShowClue] = useState(false);
  const [showStageBrowser, setShowStageBrowser] = useState(false);
  const [browserFilterDomain, setBrowserFilterDomain] = useState<EnigmaDomain | 'all'>('all');
  const [browserSearchQuery, setBrowserSearchQuery] = useState('');
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalStages = ENIGMA_STAGES_100.length; // 100 stages
  const stageIndex = Math.min(totalStages - 1, Math.max(0, currentStageNumber - 1));
  const currentStage: EnigmaStage = ENIGMA_STAGES_100[stageIndex] || ENIGMA_STAGES_100[0];
  const isCurrentSolved = solvedStages.includes(currentStageNumber);

  // فوکوس مجدد روی ورودی با تغییر مرحله
  useEffect(() => {
    setUserAnswer('');
    setFeedback({ type: 'idle', message: '' });
    setShowClue(false);
    setIsAdvancing(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    try {
      localStorage.setItem(STORAGE_KEY_STAGE, currentStageNumber.toString());
    } catch {}
  }, [currentStageNumber]);

  // ثبت و بررسی پاسخ
  const handleSubmitAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userAnswer.trim() || isAdvancing) return;

    const isCorrect = checkEnigmaAnswer(stageIndex, userAnswer);

    if (isCorrect) {
      sounds.playCorrect();
      setIsAdvancing(true);

      const { isNew, xpEarned } = markStageSolved(currentStageNumber);
      const updatedSolved = Array.from(new Set([...solvedStages, currentStageNumber]));
      setSolvedStages(updatedSolved);

      setFeedback({
        type: 'correct',
        message: isNew
          ? `آفرین! پاسخ کاملاً درست است (+${xpEarned} امتیاز)`
          : 'درست است! این مرحله قبلاً نیز فتح شده بود.',
        explanation: currentStage.solutionExplanation,
      });

      speechCoach.speak(
        `پاسخ صحیح است. ${currentStage.title}. ${currentStage.solutionExplanation}`,
        'level_complete'
      );

      if (onStageCompleted) {
        onStageCompleted(currentStageNumber);
      }

      // هدایت به مرحله بعد پس از وقفه کوتاه
      setTimeout(() => {
        if (currentStageNumber < totalStages) {
          setCurrentStageNumber((prev) => prev + 1);
        }
      }, 1600);
    } else {
      sounds.playWrong();
      setFeedback({
        type: 'wrong',
        message: 'پاسخ نادرست است. دوباره بیندیش یا راهنمایی را بررسی کن.',
        subtleHint: currentStage.subtleHint,
      });

      speechCoach.speak('دقت کن؛ دوباره بیندیش یا از راهنمایی ظریف استفاده کن.', 'mistake_calm');

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  // دریافت رمز تصادفی اختصاصی دیگر برای این دستگاه
  const handleRollRandomStage = () => {
    sounds.playTap();
    setIsRolling(true);
    setTimeout(() => {
      const nextRandom = rollNewRandomStage(currentStageNumber);
      setCurrentStageNumber(nextRandom);
      setIsRolling(false);
      speechCoach.speak(`رمز تصادفی جدید برای شما بارگذاری شد: مرحله ${nextRandom} از ۱۰۰.`, 'game_start');
    }, 250);
  };

  // شنیدن صوتی صورت معما
  const handleReadPromptAloud = () => {
    sounds.playTap();
    setIsReadingPrompt(true);
    const speechText = `رمز روز، مرحله ${currentStageNumber} از ۱۰۰. حوزه ${currentStage.domainLabel}. ${currentStage.title}. ${currentStage.prompt}`;
    speechCoach.speak(speechText, 'cognitive_tip');
    setTimeout(() => setIsReadingPrompt(false), 6000);
  };

  // افزودن حروف کمکی فارسی
  const handleInsertChar = (char: string) => {
    sounds.playTap();
    setUserAnswer((prev) => prev + char);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // اطلاعات تم حوزه
  const getDomainTheme = (domain: EnigmaDomain) => {
    switch (domain) {
      case 'psychology':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          badge: '🧠 روانشناسی و شناخت',
          desc: 'خطاهای شناختی، روانکاوی، رفتارگرایی و روانشناسی اجتماعی',
        };
      case 'philosophy':
        return {
          bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
          badge: '🏛️ فلسفه و معرفت‌شناسی',
          desc: 'اگزیستانسیالیسم، پارادوکس‌های منطقی، اخلاق و هستی‌شناسی',
        };
      case 'political':
      default:
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          badge: '⚖️ سیاست و جامعه‌شناسی',
          desc: 'قدرت، آزادی، نظریه انتقادی، قرارداد اجتماعی و حاکمیت',
        };
    }
  };

  const domainTheme = getDomainTheme(currentStage.domain);

  // سطح دشواری رده‌ها
  const getTierInfo = (tier: number) => {
    switch (tier) {
      case 1:
        return { label: 'رده ۱ · مقدماتی و کلاسیک (مراحل ۱ تا ۲۵)', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40' };
      case 2:
        return { label: 'رده ۲ · تحلیلی و پارادوکس‌ها (مراحل ۲۶ تا ۵۰)', color: 'text-sky-400 border-sky-500/30 bg-sky-950/40' };
      case 3:
        return { label: 'رده ۳ · انتقادی و ساختاری (مراحل ۵۱ تا ۷۵)', color: 'text-purple-400 border-purple-500/30 bg-purple-950/40' };
      case 4:
      default:
        return { label: 'رده ۴ · فوق‌تخصصی و عمیق (مراحل ۷۶ تا ۱۰۰)', color: 'text-rose-400 border-rose-500/30 bg-rose-950/40' };
    }
  };

  const tierInfo = getTierInfo(currentStage.difficultyTier);

  // فیلتر کردن مراحل در مرورگر ۱۰۰ مرحله
  const filteredBrowserStages = ENIGMA_STAGES_100.filter((s) => {
    const matchDomain = browserFilterDomain === 'all' || s.domain === browserFilterDomain;
    const matchQuery =
      !browserSearchQuery.trim() ||
      s.title.includes(browserSearchQuery.trim()) ||
      s.prompt.includes(browserSearchQuery.trim()) ||
      s.stage.toString() === browserSearchQuery.trim();
    return matchDomain && matchQuery;
  });

  const helperChars = ['پ', 'چ', 'ژ', 'گ', 'ک', 'ی', 'آ', 'ء'];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6 font-sans text-right animate-fade-in">
      {/* سربرگ کنترل و راهبری */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Flame className="w-5 h-5 fill-amber-400/20" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100">
              رمز روز · ۱۰۰ مرحله معما و شناخت
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            مفاهیم عمیق روانشناسی، فلسفه و سیاست با شیب پیچیدگی فزاینده (مراحل ۱ تا ۱۰۰)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {/* دکمه رمز تصادفی اختصاصی */}
          <button
            onClick={handleRollRandomStage}
            disabled={isRolling}
            className={`px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all flex items-center gap-1.5 active:scale-95 ${
              isRolling ? 'opacity-50' : ''
            }`}
            title="تولید رمز تصادفی دیگر برای این دستگاه"
          >
            <Shuffle className={`w-3.5 h-3.5 ${isRolling ? 'animate-spin' : ''}`} />
            <span>رمز تصادفی دیگر</span>
          </button>

          {/* دکمه مشاهده و جستجوی تمام ۱۰۰ مرحله */}
          <button
            onClick={() => setShowStageBrowser(!showStageBrowser)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 transition-colors flex items-center gap-1.5"
            title="فهرست و نقشه کامل ۱۰۰ مرحله"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>فهرست ۱۰۰ مرحله ({solvedStages.length}/۱۰۰)</span>
            {showStageBrowser ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onBack}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            بازگشت
          </button>
        </div>
      </div>

      {/* اعلان اختصاصی بودن تصادفی‌سازی دستگاه‌ها */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2.5 bg-slate-900/60 rounded-2xl border border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            سیستم رمز روز هوشمند: هر دستگاه به صورت مستقل رمزهای تصادفی متفاوتی را همزمان دریافت می‌کند.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-slate-300 font-mono text-[11px]">
          <span>حل‌شده: <strong className="text-amber-400">{solvedStages.length}</strong> از ۱۰۰</span>
        </div>
      </div>

      {/* کشوی مرورگر و فهرست ۱۰۰ مرحله (بازشونده) */}
      {showStageBrowser && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-200">
                فهرست کامل ۱۰۰ مرحله رمز روز (تفکیک‌شده بر اساس حوزه و سختی)
              </h3>
            </div>

            {/* نوار جستجو */}
            <div className="relative">
              <input
                type="text"
                value={browserSearchQuery}
                onChange={(e) => setBrowserSearchQuery(e.target.value)}
                placeholder="جستجوی مرحله یا عنوان..."
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 w-48"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* فیلتر حوزه‌ها */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <Filter className="w-3 h-3" /> فیلتر:
            </span>
            <button
              onClick={() => setBrowserFilterDomain('all')}
              className={`px-2.5 py-1 rounded-lg border transition-colors ${
                browserFilterDomain === 'all'
                  ? 'bg-slate-200 text-slate-950 font-bold border-slate-200'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              همه (۱۰۰)
            </button>
            <button
              onClick={() => setBrowserFilterDomain('psychology')}
              className={`px-2.5 py-1 rounded-lg border transition-colors ${
                browserFilterDomain === 'psychology'
                  ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-emerald-300'
              }`}
            >
              🧠 روانشناسی
            </button>
            <button
              onClick={() => setBrowserFilterDomain('philosophy')}
              className={`px-2.5 py-1 rounded-lg border transition-colors ${
                browserFilterDomain === 'philosophy'
                  ? 'bg-indigo-500 text-slate-950 font-bold border-indigo-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-indigo-300'
              }`}
            >
              🏛️ فلسفه
            </button>
            <button
              onClick={() => setBrowserFilterDomain('political')}
              className={`px-2.5 py-1 rounded-lg border transition-colors ${
                browserFilterDomain === 'political'
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-amber-300'
              }`}
            >
              ⚖️ سیاست و جامعه
            </button>
          </div>

          {/* شبکه مربعی انتخاب ۱۰۰ مرحله */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-h-64 overflow-y-auto p-1">
            {filteredBrowserStages.map((s) => {
              const isSolved = solvedStages.includes(s.stage);
              const isCurrent = s.stage === currentStageNumber;
              return (
                <button
                  key={s.stage}
                  onClick={() => {
                    sounds.playTap();
                    setCurrentStageNumber(s.stage);
                    setShowStageBrowser(false);
                  }}
                  className={`p-2 rounded-xl text-xs font-mono font-bold flex flex-col items-center justify-center transition-all border relative ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/50 shadow-md scale-105'
                      : isSolved
                      ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60'
                      : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white'
                  }`}
                  title={`${s.stage}. ${s.title} (${s.domainLabel})`}
                >
                  <span>{s.stage}</span>
                  {isSolved && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* نوار ناوبری مرحله: قبلی / تصادفی / بعدی */}
      <div className="flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 rounded-2xl">
        <button
          onClick={() => {
            if (currentStageNumber > 1) {
              sounds.playTap();
              setCurrentStageNumber((prev) => prev - 1);
            }
          }}
          disabled={currentStageNumber <= 1}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-950 hover:bg-slate-850 disabled:opacity-30 disabled:pointer-events-none text-slate-300 border border-slate-800 transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>مرحله قبل ({currentStageNumber - 1})</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-amber-400 font-mono">
            مرحله {currentStageNumber} از ۱۰۰
          </span>
          {isCurrentSolved && (
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> حل شده
            </span>
          )}
        </div>

        <button
          onClick={() => {
            if (currentStageNumber < totalStages) {
              sounds.playTap();
              setCurrentStageNumber((prev) => prev + 1);
            }
          }}
          disabled={currentStageNumber >= totalStages}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-950 hover:bg-slate-850 disabled:opacity-30 disabled:pointer-events-none text-slate-300 border border-slate-800 transition-colors"
        >
          <span>مرحله بعد ({currentStageNumber + 1})</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* کارت اصلی معمای رمز روز */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* نشان‌های حوزه، رده سختی و امتیاز */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${domainTheme.bg}`}>
              {domainTheme.badge}
            </span>
            <span className={`px-3 py-1 rounded-xl text-xs font-semibold border ${tierInfo.color}`}>
              {tierInfo.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30">
              +{currentStage.xpReward} XP
            </span>
            <button
              onClick={handleReadPromptAloud}
              disabled={isReadingPrompt}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-amber-400 border border-slate-800 transition-colors"
              title="شنیدن صوتی معما"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* عنوان و صورت معما */}
        <div className="space-y-4">
          <h3 className="text-xl md:text-2xl font-black text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{currentStage.title}</span>
          </h3>

          <p className="text-sm md:text-base text-slate-200 leading-relaxed font-medium bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80">
            {currentStage.prompt}
          </p>

          {/* سرنخ بافتی فیلسوف/مکتب */}
          {currentStage.contextClue && (
            <div>
              {!showClue ? (
                <button
                  onClick={() => setShowClue(true)}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>نمایش سرنخ بافتی (فیلسوف / مکتب / منبع فکری)</span>
                </button>
              ) : (
                <div className="p-3.5 bg-slate-950/90 border border-amber-500/25 rounded-2xl text-xs text-amber-300/90 leading-relaxed animate-fade-in">
                  <span className="font-bold block mb-1">سرنخ بافتی:</span>
                  {currentStage.contextClue}
                </div>
              )}
            </div>
          )}
        </div>

        {/* بازخورد پاسخ */}
        {feedback.type === 'correct' && (
          <div className="p-5 bg-emerald-950/50 border border-emerald-800/70 rounded-2xl text-xs sm:text-sm text-emerald-200 space-y-2 animate-fade-in">
            <div className="flex items-center gap-2 font-bold text-emerald-300">
              <CheckCircle2 className="w-5 h-5" />
              <span>{feedback.message}</span>
            </div>
            {feedback.explanation && (
              <p className="leading-relaxed text-slate-300 bg-slate-900/80 p-4 rounded-xl border border-emerald-900/50 mt-2">
                <span className="font-bold text-emerald-400 block mb-1">شرح و ریشه‌یابی معرفتی:</span>
                {feedback.explanation}
              </p>
            )}
          </div>
        )}

        {feedback.type === 'wrong' && (
          <div className="p-5 bg-rose-950/40 border border-rose-800/60 rounded-2xl text-xs sm:text-sm text-rose-200 space-y-2 animate-fade-in">
            <div className="flex items-center gap-2 font-bold text-rose-300">
              <AlertCircle className="w-5 h-5" />
              <span>{feedback.message}</span>
            </div>
            {feedback.subtleHint && (
              <div className="p-3 bg-slate-900/80 rounded-xl border border-rose-900/40 text-amber-300/95 mt-2">
                <span className="font-bold">راهنمایی ظریف: </span>
                <span>{feedback.subtleHint}</span>
              </div>
            )}
          </div>
        )}

        {/* فرم ثبت پاسخ */}
        <form onSubmit={handleSubmitAnswer} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="پاسخ، اصطلاح یا مفهوم را تایپ کنید..."
              className="flex-1 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-2xl px-5 py-4 text-base text-slate-100 placeholder:text-slate-600 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!userAnswer.trim() || isAdvancing}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 active:scale-95 text-slate-950 font-black rounded-2xl text-base transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>ثبت پاسخ</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* کلیدهای کمکی فارسی (برای راحتی موبایل) */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] text-slate-500 ml-1">حروف کمکی:</span>
            {helperChars.map((char) => (
              <button
                key={char}
                type="button"
                onClick={() => handleInsertChar(char)}
                className="w-7 h-7 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-bold text-slate-300 hover:text-white transition-colors"
              >
                {char}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};
