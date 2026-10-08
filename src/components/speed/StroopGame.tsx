import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../services/sound';
import { recordGameResult } from '../../services/storage';
import { speechCoach } from '../../services/speechCoach';
import { StroopLabSvg } from '../world/WorldLandmarkIllustrations';
import { GameRulesModal } from '../common/GameRulesModal';
import { ArrowLeft, Clock, RotateCcw, Award, Zap, HelpCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
  isDaily?: boolean;
  onCompleteDaily?: (score: number) => void;
}

interface StroopTrial {
  text: string;
  inkColor: string; // hex
  correctColorName: string; // Persian color name
  isCongruent: boolean;
}

const COLORS = [
  { name: 'قرمز', hex: '#ef4444' },
  { name: 'آبی', hex: '#3b82f6' },
  { name: 'سبز', hex: '#10b981' },
  { name: 'زرد', hex: '#eab308' },
];

export const StroopGame: React.FC<Props> = ({ onBack, isDaily, onCompleteDaily }) => {
  const [trialCount, setTrialCount] = useState(0);
  const [currentTrial, setCurrentTrial] = useState<StroopTrial | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [errorsCount, setErrorsCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [flashFeedback, setFlashFeedback] = useState<'success' | 'error' | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const trialStartTimeRef = useRef<number>(Date.now());
  const TOTAL_TRIALS = 15;

  const generateTrial = (): StroopTrial => {
    const isCongruent = Math.random() < 0.35;
    const textIdx = Math.floor(Math.random() * COLORS.length);
    let colorIdx = textIdx;

    if (!isCongruent) {
      const otherIndices = [0, 1, 2, 3].filter((i) => i !== textIdx);
      colorIdx = otherIndices[Math.floor(Math.random() * otherIndices.length)];
    }

    return {
      text: COLORS[textIdx].name,
      inkColor: COLORS[colorIdx].hex,
      correctColorName: COLORS[colorIdx].name,
      isCongruent,
    };
  };

  useEffect(() => {
    startNewTrial();
  }, []);

  const startNewTrial = () => {
    const trial = generateTrial();
    setCurrentTrial(trial);
    trialStartTimeRef.current = Date.now();
  };

  const handlePickColor = (chosenColorName: string) => {
    if (!currentTrial || isGameOver) return;
    sounds.playTap();

    const elapsedMs = Date.now() - trialStartTimeRef.current;
    const isCorrect = chosenColorName === currentTrial.correctColorName;

    if (isCorrect) {
      sounds.playSuccess();
      const speedBonus = Math.max(0, Math.round((1200 - elapsedMs) / 10));
      const trialScore = 20 + speedBonus + streak * 3;
      setScore((prev) => prev + trialScore);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setReactionTimes((prev) => [...prev, elapsedMs]);
      setFlashFeedback('success');
      if (nextStreak === 5) {
        speechCoach.speakContext('combo_high', 'آفرین! مقاومت در برابر تداخل کلمه بی‌نظیره!');
      }
    } else {
      sounds.playError();
      setStreak(0);
      setErrorsCount((prev) => prev + 1);
      setFlashFeedback('error');
      speechCoach.speakContext('mistake_calm', 'آرامش داشته باش؛ فقط روی رنگ جوهر تمرکز کن.');
    }

    const nextCount = trialCount + 1;
    setTrialCount(nextCount);

    if (nextCount < TOTAL_TRIALS) {
      setTimeout(() => {
        setFlashFeedback(null);
        startNewTrial();
      }, 120);
    } else {
      handleFinishGame();
    }
  };

  const handleFinishGame = () => {
    setIsGameOver(true);
    sounds.playWin();
    speechCoach.speakContext('level_complete', 'فوق‌العاده بود! تمرکز و تفکیک شناختی درخشانی ثبت کردی.');

    const avgMs = reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 800;

    // Cognitive metric mapping
    const processingScore = Math.max(30, Math.min(98, Math.round(100 - avgMs / 15)));
    const inhibitoryScore = Math.max(30, Math.min(98, Math.round(100 - errorsCount * 12)));

    recordGameResult('stroop', score, {
      processingSpeed: processingScore,
      inhibitoryControl: inhibitoryScore,
    });

    if (isDaily && onCompleteDaily) {
      onCompleteDaily(score);
    }
  };

  const handleRestart = () => {
    sounds.playTap();
    setTrialCount(0);
    setScore(0);
    setStreak(0);
    setReactionTimes([]);
    setErrorsCount(0);
    setIsGameOver(false);
    setFlashFeedback(null);
    startNewTrial();
  };

  const avgReactionTime = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;

  return (
    <div className="max-w-xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rotate-180" />
            <span>نقشه جهان</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs text-pink-400">
            <StroopLabSvg className="w-5 h-5 inline-block" />
            <span>مکان: منشور طیف استروپ</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">کوشش {trialCount + 1} از {TOTAL_TRIALS}</span>
          <button
            onClick={() => { sounds.playTap(); setIsRulesOpen(true); }}
            className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-amber-400 hover:text-amber-300 transition-colors shadow-sm ml-1"
            title="راهنمای بازی"
            aria-label="قوانین بازی"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* HUD */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-xs text-slate-500 block">امتیاز کل</span>
            <span className="text-2xl font-bold text-amber-400 tabular-nums">{score}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">پیوستگی</span>
            <span className="text-lg font-bold text-emerald-400 tabular-nums">×{streak}</span>
          </div>
        </div>

        <div>
          <span className="text-xs text-slate-500 block">میانگین واکنش</span>
          <span className="text-base font-bold text-slate-200 tabular-nums">
            {avgReactionTime ? `${avgReactionTime} میلی‌ثانیه` : '—'}
          </span>
        </div>
      </div>

      {!isGameOver && currentTrial ? (
        <div className="space-y-6">
          <div className="text-center text-xs text-slate-400">
            «رنگ جوهر» را انتخاب کنید؛ نه کلمه‌ای که نوشته شده است!
          </div>

          {/* Stroop Word Box */}
          <div
            className={`min-h-48 rounded-3xl border flex items-center justify-center p-8 transition-all ${
              flashFeedback === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/80 ring-2 ring-emerald-500/20'
                : flashFeedback === 'error'
                ? 'bg-rose-950/40 border-rose-500/80 ring-2 ring-rose-500/20'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <span
              className="text-6xl md:text-7xl font-black select-none transition-transform"
              style={{ color: currentTrial.inkColor }}
            >
              {currentTrial.text}
            </span>
          </div>

          {/* Color Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {COLORS.map((col) => (
              <button
                key={col.name}
                onClick={() => handlePickColor(col.name)}
                className="py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-lg font-bold text-slate-100 flex items-center justify-center gap-3 transition-all"
              >
                <span
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: col.hex }}
                />
                <span>{col.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Game Over Analysis */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-100">آزمون استروپ تکمیل شد!</h3>
            <p className="text-slate-400 text-sm mt-1">
              کنترل بازداری شناختی و تفکیک معنایی شما ثبت گردید.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-right">
            <div>
              <span className="text-xs text-slate-500 block">امتیاز کل</span>
              <span className="text-xl font-bold text-amber-400 tabular-nums">{score}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">میانگین واکنش</span>
              <span className="text-lg font-bold text-slate-200 tabular-nums">{avgReactionTime} ms</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">خطاهای ناهماهنگ</span>
              <span className="text-lg font-bold text-rose-400 tabular-nums">{errorsCount}</span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>تلاش مجدد</span>
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors"
            >
              بازگشت به منو
            </button>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      <GameRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        title="استروپ (رنگ جوهر)"
        categoryName="سرعت، دقت و توجه"
        duration="۳۰ ثانیه"
        rules={[
          'یک کلمه رنگی روی صفحه ظاهر می‌شود (مثلاً کلمه «قرمز» با رنگ آبی نوشته شده است).',
          'شما باید فقط «رنگ واقعی جوهر نوشته» را انتخاب کنید، نه معنای کلمه را!',
          'این آزمون مقاومت شناختی شما در برابر خطاهای خودکار مغز را می‌سنجد.',
          'هرچه سریع‌تر و بدون خطا پاسخ دهید، امتیاز واکنش بالاتری می‌گیرید.',
        ]}
        scoringNote="پاسخ درست + پاداش سرعت میلی‌ثانیه‌ای و ضریب شتاب پیوستگی."
      />
    </div>
  );
};
