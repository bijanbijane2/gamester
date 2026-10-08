/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * مودال پیشرفته «رمز روز» - مبتنی بر ۱۰۰ مرحله ژرف روانشناسی، فلسفه و سیاست
 * همراه با تصادفی‌سازی اختصاصی هر دستگاه (دو دستگاه همزمان مراحل متفاوتی را دریافت می‌کنند)
 */

import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../services/sound';
import { speechCoach } from '../../services/speechCoach';
import {
  getDeviceDailyStageNumber,
  rollNewRandomStage,
  isStageSolved,
  markStageSolved,
  getSolvedStages,
} from '../../services/dailyEnigmaService';
import {
  ENIGMA_STAGES_100,
  EnigmaStage,
  checkEnigmaAnswer,
} from '../../data/enigmaJourney100';
import {
  Flame,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Volume2,
  X,
  Shuffle,
  Compass,
  ArrowRight,
  ShieldCheck,
  Brain,
  BookOpen,
  Award,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenEnigmaProgression?: (stageNumber?: number) => void;
  onLaunchDailyGame?: (gameId: any) => void;
}

export const DailyChallengeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenEnigmaProgression,
}) => {
  if (!isOpen) return null;

  const [currentStageNumber, setCurrentStageNumber] = useState<number>(() => {
    return getDeviceDailyStageNumber();
  });

  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{
    type: 'idle' | 'correct' | 'wrong';
    message: string;
    subtleHint?: string;
    explanation?: string;
  }>({ type: 'idle', message: '' });

  const [showClue, setShowClue] = useState(false);
  const [isReadingPrompt, setIsReadingPrompt] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const stageIndex = Math.min(ENIGMA_STAGES_100.length - 1, Math.max(0, currentStageNumber - 1));
  const stage: EnigmaStage = ENIGMA_STAGES_100[stageIndex] || ENIGMA_STAGES_100[0];
  const isAlreadySolved = isStageSolved(currentStageNumber);
  const totalSolvedCount = getSolvedStages().length;

  // بازنشانی وضعیت هنگام تغییر مرحله
  useEffect(() => {
    setUserAnswer('');
    setFeedback({ type: 'idle', message: '' });
    setShowClue(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentStageNumber]);

  // ثبت پاسخ
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userAnswer.trim()) return;

    const isCorrect = checkEnigmaAnswer(stageIndex, userAnswer);

    if (isCorrect) {
      sounds.playCorrect();
      const { isNew, xpEarned } = markStageSolved(currentStageNumber);

      setFeedback({
        type: 'correct',
        message: isNew
          ? `آفرین! رمز روز با موفقیت گشوده شد. (+${xpEarned} امتیاز)`
          : 'درست است! این مرحله پیش‌تر نیز حل شده بود.',
        explanation: stage.solutionExplanation,
      });

      speechCoach.speak(
        `پاسخ صحیح است. ${stage.solutionExplanation}`,
        'level_complete'
      );
    } else {
      sounds.playWrong();
      setFeedback({
        type: 'wrong',
        message: 'پاسخ نادرست است. دوباره بیندیش یا راهنمایی را مطالعه کن.',
        subtleHint: stage.subtleHint,
      });
      speechCoach.speak('دقت کن؛ دوباره بیندیش یا از راهنمایی ظریف استفاده کن.', 'mistake_calm');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  // دریافت مرحله تصادفی تازه برای این دستگاه
  const handleRollNewRandom = () => {
    sounds.playTap();
    setIsRolling(true);
    setTimeout(() => {
      const newStage = rollNewRandomStage(currentStageNumber);
      setCurrentStageNumber(newStage);
      setIsRolling(false);
      speechCoach.speak(`رمز تصادفی جدید برای شما: مرحله ${newStage} از ۱۰۰.`, 'game_start');
    }, 280);
  };

  // خواندن صوتی صورت معما
  const handleReadAloud = () => {
    sounds.playTap();
    setIsReadingPrompt(true);
    const text = `رمز روز، مرحله ${stage.stage} از ۱۰۰. حوزه ${stage.domainLabel}. ${stage.title}. ${stage.prompt}`;
    speechCoach.speak(text, 'cognitive_tip');
    setTimeout(() => setIsReadingPrompt(false), 5000);
  };

  // ورود به پویش ۱۰۰ مرحله‌ای
  const handleOpenFullEngine = () => {
    sounds.playTap();
    onClose();
    if (onOpenEnigmaProgression) {
      onOpenEnigmaProgression(currentStageNumber);
    }
  };

  // رنگ و نشان حوزه
  const getDomainStyle = (domain: EnigmaStage['domain']) => {
    switch (domain) {
      case 'psychology':
        return {
          badge: '🧠 روانشناسی و شناخت',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        };
      case 'philosophy':
        return {
          badge: '🏛️ فلسفه و معناشناسی',
          bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
        };
      case 'political':
      default:
        return {
          badge: '⚖️ سیاست و جامعه‌شناسی',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        };
    }
  };

  const domainStyle = getDomainStyle(stage.domain);

  // برچسب درجه سختی
  const getTierBadge = (tier: number) => {
    switch (tier) {
      case 1:
        return { label: 'رده ۱ · مقدماتی و کلاسیک', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40' };
      case 2:
        return { label: 'رده ۲ · تحلیلی و پارادوکس', color: 'text-sky-400 bg-sky-950/60 border-sky-800/40' };
      case 3:
        return { label: 'رده ۳ · انتقادی و ساختاری', color: 'text-purple-400 bg-purple-950/60 border-purple-800/40' };
      case 4:
      default:
        return { label: 'رده ۴ · فوق‌تخصصی و عمیق', color: 'text-rose-400 bg-rose-950/60 border-rose-800/40' };
    }
  };

  const tierBadge = getTierBadge(stage.difficultyTier);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in text-right font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 max-w-xl w-full max-h-[94vh] overflow-y-auto relative shadow-2xl space-y-5">
        {/* بستن */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-slate-400 hover:text-white transition-colors p-1"
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {/* سربرگ رمز روز */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500/15 rounded-2xl border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Flame className="w-6 h-6 fill-amber-400/30 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>رمز روز · ۱۰۰ مرحله معما و شناخت</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-100 flex items-center gap-2">
                <span>مرحله {stage.stage} از ۱۰۰</span>
                {isAlreadySolved && (
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> حل شده
                  </span>
                )}
              </h3>
            </div>
          </div>

          {/* دکمه تولید رمز تصادفی اختصاصی */}
          <button
            onClick={handleRollNewRandom}
            disabled={isRolling}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-750 border border-slate-700/80 text-amber-300 transition-all active:scale-95 shrink-0 ${
              isRolling ? 'opacity-50 animate-spin' : ''
            }`}
            title="تولید رمز تصادفی دیگر برای این دستگاه"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">رمز تصادفی دیگر</span>
          </button>
        </div>

        {/* یادداشت تنوع دستگاه‌ها */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-slate-950/80 rounded-xl border border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>رمز اختصاصی دستگاه شما (دستگاه‌های دیگر مراحل متفاوتی دارند)</span>
          </div>
          <span className="text-amber-400 font-mono font-bold">حل‌شده: {totalSolvedCount}/۱۰۰</span>
        </div>

        {/* برچسب‌های حوزه و سطح دشواری */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2.5 py-1 rounded-xl text-xs font-semibold border ${domainStyle.bg}`}>
            {domainStyle.badge}
          </span>
          <span className={`px-2.5 py-1 rounded-xl text-xs font-semibold border ${tierBadge.color}`}>
            {tierBadge.label}
          </span>
          <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 mr-auto">
            +{stage.xpReward} XP
          </span>
        </div>

        {/* محتوای معمای رمز روز */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/90 space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
            <h4 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{stage.title}</span>
            </h4>
            <button
              onClick={handleReadAloud}
              disabled={isReadingPrompt}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800 transition-colors"
              title="شنیدن صوتی صورت معما"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {stage.prompt}
          </p>

          {/* سرنخ بافتی */}
          {stage.contextClue && (
            <div>
              {!showClue ? (
                <button
                  onClick={() => setShowClue(true)}
                  className="text-xs font-semibold text-amber-400/90 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>نمایش سرنخ بافتی (فیلسوف / مکتب / منبع)</span>
                </button>
              ) : (
                <div className="p-3 bg-slate-900/90 border border-amber-500/20 rounded-xl text-xs text-amber-300/90 leading-relaxed">
                  <span className="font-bold block mb-1">سرنخ بافتی:</span>
                  {stage.contextClue}
                </div>
              )}
            </div>
          )}
        </div>

        {/* بازخورد پاسخ */}
        {feedback.type === 'correct' && (
          <div className="p-4 bg-emerald-950/50 border border-emerald-800/70 rounded-2xl text-xs text-emerald-200 space-y-2 animate-fade-in">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
              <CheckCircle2 className="w-4 h-4" />
              <span>{feedback.message}</span>
            </div>
            {feedback.explanation && (
              <p className="leading-relaxed text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-emerald-900/40">
                {feedback.explanation}
              </p>
            )}
          </div>
        )}

        {feedback.type === 'wrong' && (
          <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-2xl text-xs text-rose-200 space-y-2 animate-fade-in">
            <div className="flex items-center gap-2 font-bold text-rose-300">
              <AlertCircle className="w-4 h-4" />
              <span>{feedback.message}</span>
            </div>
            {feedback.subtleHint && (
              <div className="p-2.5 bg-slate-900/80 rounded-xl border border-rose-900/30 text-amber-300/90">
                <span className="font-bold">راهنمایی ظریف: </span>
                <span>{feedback.subtleHint}</span>
              </div>
            )}
          </div>
        )}

        {/* فرم ثبت پاسخ */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="پاسخ، مفهوم یا واژه کلیدی را بنویسید..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-2xl px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={!userAnswer.trim()}
              className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 active:scale-95 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <span>ثبت و بررسی پاسخ</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={handleRollNewRandom}
              className="px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
              title="تولید رمز تصادفی دیگر"
            >
              <Shuffle className="w-4 h-4 text-amber-400" />
              <span>تصادفی</span>
            </button>
          </div>
        </form>

        {/* پاورقی و دسترسی به کل ۱۰۰ مرحله */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <button
            onClick={handleOpenFullEngine}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>مشاهده نقشه و فهرست ۱۰۰ مرحله</span>
          </button>

          <span className="text-[11px] text-slate-500 text-center sm:text-left">
            سطح پیچیدگی با جلوتر رفتن مراحل افزایش می‌یابد
          </span>
        </div>
      </div>
    </div>
  );
};
