import React, { useState, useRef } from 'react';
import { sounds } from '../../services/sound';
import { recordGameResult } from '../../services/storage';
import { GameRulesModal } from '../common/GameRulesModal';
import { ArrowLeft, Zap, RotateCcw, Award, HelpCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
  isDaily?: boolean;
  onCompleteDaily?: (score: number) => void;
}

type Stage = 'idle' | 'waiting' | 'ready' | 'too_early' | 'result' | 'finished';

export const ReactionGame: React.FC<Props> = ({ onBack, isDaily, onCompleteDaily }) => {
  const [stage, setStage] = useState<Stage>('idle');
  const [attempts, setAttempts] = useState<number[]>([]);
  const [lastMs, setLastMs] = useState(0);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoNextTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const MAX_ATTEMPTS = 5;

  const handleStartAttempt = () => {
    sounds.playTap();
    setStage('waiting');

    // Wait random delay 1.5s - 4s
    const delay = 1500 + Math.random() * 2500;
    timeoutRef.current = setTimeout(() => {
      setStage('ready');
      startTimeRef.current = performance.now();
    }, delay);
  };

  const handleAreaClick = () => {
    if (stage === 'waiting') {
      // Too early!
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      sounds.playError();
      setStage('too_early');
    } else if (stage === 'ready') {
      const elapsed = Math.round(performance.now() - startTimeRef.current);
      sounds.playSuccess();
      setLastMs(elapsed);
      const newAttempts = [...attempts, elapsed];
      setAttempts(newAttempts);

      if (newAttempts.length >= MAX_ATTEMPTS) {
        setStage('finished');
        finishGame(newAttempts);
      } else {
        setStage('result');
        // Auto-advance to next attempt after 1 second without waiting for user click!
        if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
        autoNextTimeoutRef.current = setTimeout(() => {
          handleStartAttempt();
        }, 1000);
      }
    } else if (stage === 'idle' || stage === 'too_early' || stage === 'result') {
      if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
      handleStartAttempt();
    }
  };

  const finishGame = (results: number[]) => {
    sounds.playWin();
    const avg = Math.round(results.reduce((a, b) => a + b, 0) / results.length);
    // 200ms is elite, 350ms is average, 500ms is slow
    const calculatedScore = Math.max(100, Math.round(1000 - avg * 1.5));
    const processingScore = Math.max(30, Math.min(99, Math.round(110 - avg / 5)));

    recordGameResult('reaction', calculatedScore, {
      processingSpeed: processingScore,
    });

    if (isDaily && onCompleteDaily) {
      onCompleteDaily(calculatedScore);
    }
  };

  const handleRestart = () => {
    sounds.playTap();
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
    setAttempts([]);
    setLastMs(0);
    setStage('idle');
  };

  const bestMs = attempts.length > 0 ? Math.min(...attempts) : 0;
  const avgMs = attempts.length > 0
    ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)
    : 0;

  return (
    <div className="max-w-xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <span>بازگشت</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            تلاش {Math.min(attempts.length + 1, MAX_ATTEMPTS)} از {MAX_ATTEMPTS}
          </span>
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

      {/* Rules Modal */}
      <GameRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        title="زمان واکنش میلی‌ثانیه‌ای (Reaction Time)"
        categoryName="سرعت خالص"
        duration="۲۰ ثانیه"
        rules={[
          'روی صفحه کلیک کنید تا مرحله آغاز شود (حالت قرمز/منتظر).',
          'به محض اینکه صفحه سبز شد، در سریع‌ترین زمان ممکن کلیک کنید.',
          'اگر قبل از سبز شدن کلیک کنید، خطای «خیلی زود» ثبت می‌شود.',
          'بین ۵ تلاش متوالی، نتایج پس از ۱ ثانیه به طور خودکار به تلاش بعدی می‌روند.',
        ]}
        scoringNote="واکنش زیر ۲۵۰ میلی‌ثانیه امتیاز فوق‌العاده و طلایی دارد"
      />

      {stage !== 'finished' ? (
        <div className="space-y-6">
          {/* Reaction Surface */}
          <div
            onClick={handleAreaClick}
            className={`h-80 rounded-3xl border flex flex-col items-center justify-center p-8 select-none cursor-pointer transition-colors shadow-lg ${
              stage === 'idle'
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                : stage === 'waiting'
                ? 'bg-amber-950/80 border-amber-600/80 text-amber-200'
                : stage === 'ready'
                ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                : stage === 'too_early'
                ? 'bg-rose-950/90 border-rose-600 text-rose-200'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            {stage === 'idle' && (
              <div className="text-center space-y-3">
                <Zap className="w-12 h-12 text-amber-400 mx-auto" />
                <h3 className="text-2xl font-bold text-slate-100">آزمون سرعت واکنش خالص</h3>
                <p className="text-xs text-slate-400">روی این کادر کلیک کنید تا شروع شود</p>
              </div>
            )}

            {stage === 'waiting' && (
              <div className="text-center space-y-2">
                <span className="text-3xl font-extrabold">صبر کنید...</span>
                <p className="text-xs text-amber-300/80">به محض سبز شدن کادر سریع ضربه بزنید!</p>
              </div>
            )}

            {stage === 'ready' && (
              <div className="text-center">
                <span className="text-5xl font-black text-slate-950 animate-bounce">ضربه بزن!</span>
              </div>
            )}

            {stage === 'too_early' && (
              <div className="text-center space-y-2">
                <span className="text-2xl font-bold">خیلی زود بود!</span>
                <p className="text-xs">قبل از سبز شدن نباید کلیک می‌کردید. دوباره کلیک کنید.</p>
              </div>
            )}

            {stage === 'result' && (
              <div className="text-center space-y-3">
                <span className="text-5xl font-extrabold text-amber-400 tabular-nums">{lastMs} ms</span>
                <p className="text-xs text-slate-400">برای تلاش بعدی کلیک کنید</p>
              </div>
            )}
          </div>

          {/* Past trials pill list */}
          {attempts.length > 0 && (
            <div className="flex items-center justify-between text-xs text-slate-400 p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-3">
                <span>تلاش‌ها:</span>
                {attempts.map((ms, i) => (
                  <span key={i} className="font-mono text-slate-200 tabular-nums">
                    {ms}ms
                  </span>
                ))}
              </div>
              <div>
                <span>بهترین: </span>
                <span className="font-bold text-emerald-400 tabular-nums">{bestMs}ms</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Finished */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-100">نتایج آزمون واکنش</h3>
            <p className="text-slate-400 text-sm mt-1">
              ثبت میانگین ۵ کوشش شما در سیستم شناختی
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto bg-slate-950 p-4 rounded-2xl border border-slate-800 text-right">
            <div>
              <span className="text-xs text-slate-500 block">بهترین رکورد</span>
              <span className="text-xl font-bold text-emerald-400 tabular-nums">{bestMs} ms</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">میانگین کل</span>
              <span className="text-xl font-bold text-amber-400 tabular-nums">{avgMs} ms</span>
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
    </div>
  );
};
