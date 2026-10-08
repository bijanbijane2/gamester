import React, { useState, useEffect } from 'react';
import { MISSING_LETTER_QUESTIONS, MissingLetterQuestion } from '../../data/wordBank';
import { sounds } from '../../services/sound';
import { recordGameResult } from '../../services/storage';
import { SpeedTowerSvg } from '../world/WorldLandmarkIllustrations';
import { GameRulesModal } from '../common/GameRulesModal';
import { ArrowLeft, Clock, Zap, RotateCcw, Award, HelpCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
  isDaily?: boolean;
  onCompleteDaily?: (score: number) => void;
}

export const HarfeBaadiGame: React.FC<Props> = ({ onBack, isDaily, onCompleteDaily }) => {
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);
  const [flashFeedback, setFlashFeedback] = useState<'success' | 'error' | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const currentQ: MissingLetterQuestion = MISSING_LETTER_QUESTIONS[qIndex];

  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameOver, qIndex]);

  const handleGameOver = () => {
    setIsGameOver(true);
    sounds.playWin();
    recordGameResult('harfe_baadi', score, {
      processingSpeed: Math.min(95, 55 + combo * 5),
      verbalFluency: Math.min(95, 60 + Math.round(score / 4)),
    });
    if (isDaily && onCompleteDaily) {
      onCompleteDaily(score);
    }
  };

  const handlePickOption = (letter: string) => {
    if (isGameOver) return;
    sounds.playTap();

    if (letter === currentQ.missingLetter) {
      sounds.playSuccess();
      const points = 20 + combo * 5;
      setScore((prev) => prev + points);
      setCombo((prev) => prev + 1);
      setFlashFeedback('success');

      if (qIndex + 1 < MISSING_LETTER_QUESTIONS.length) {
        setTimeout(() => {
          setQIndex((prev) => prev + 1);
          setFlashFeedback(null);
        }, 150);
      } else {
        handleGameOver();
      }
    } else {
      sounds.playError();
      setCombo(0);
      setFlashFeedback('error');
      setTimeout(() => setFlashFeedback(null), 200);
    }
  };

  const handleRestart = () => {
    sounds.playTap();
    setQIndex(0);
    setScore(0);
    setCombo(0);
    setTimeLeft(30);
    setIsGameOver(false);
    setFlashFeedback(null);
  };

  return (
    <div className="max-w-xl mx-auto py-6 px-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rotate-180" />
            <span>نقشه جهان</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400">
            <SpeedTowerSvg className="w-5 h-5 inline-block" />
            <span>مکان: برج سرعت بادنما</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            سؤال {qIndex + 1} از {MISSING_LETTER_QUESTIONS.length}
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
        title="حرف بعدی / جای خالی واژه"
        categoryName="سرعت و زبان"
        duration="۳۰ ثانیه"
        rules={[
          'یک کلمه با یک حرف جای خالی (ـ) به شما نمایش داده می‌شود.',
          'از میان حروف پیشنهادی در پایین صفحه، حرف صحیح را به سرعت انتخاب کنید.',
          'با هر پاسخ درست پیاپی، شتاب (Combo) شما افزایش می‌یابد و امتیاز چندبرابر می‌شود.',
          'پاسخ اشتباه ضریب شتاب را صفر می‌کند.',
        ]}
        scoringNote="۲۰ امتیاز پایه به ازای هر حرف + ضریب شتاب صعودی"
      />

      {/* HUD */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-xs text-slate-500 block">امتیاز</span>
            <span className="text-2xl font-bold text-amber-400 tabular-nums">{score}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">شتاب (Combo)</span>
            <span className="text-lg font-bold text-emerald-400 tabular-nums">×{combo}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-xl">
          <Clock className={`w-4 h-4 ${timeLeft < 8 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
          <span className={`text-lg font-bold tabular-nums ${timeLeft < 8 ? 'text-red-400' : 'text-slate-200'}`}>
            {timeLeft} ثانیه
          </span>
        </div>
      </div>

      {!isGameOver ? (
        <div className="space-y-6">
          {/* Masked Word */}
          <div
            className={`min-h-36 rounded-3xl border flex flex-col items-center justify-center p-6 transition-all ${
              flashFeedback === 'success'
                ? 'bg-emerald-950/50 border-emerald-500/80 ring-2 ring-emerald-500/30'
                : flashFeedback === 'error'
                ? 'bg-rose-950/50 border-rose-500/80 ring-2 ring-rose-500/30'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <span className="text-xs text-slate-400 mb-2 font-medium">کدام حرف جای خالی را کامل می‌کند؟</span>
            <div className="text-4xl md:text-5xl font-extrabold tracking-widest text-amber-300">
              {currentQ.masked}
            </div>
          </div>

          {/* Rapid Options */}
          <div className="grid grid-cols-4 gap-3 pt-2">
            {currentQ.options.map((optLetter, idx) => (
              <button
                key={idx}
                onClick={() => handlePickOption(optLetter)}
                className="h-20 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-3xl font-bold text-slate-100 flex items-center justify-center shadow-md transition-all"
              >
                {optLetter}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Game Over */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-100">پایان آزمون سریع حرف بعدی!</h3>
            <p className="text-slate-400 text-sm mt-1">
              امتیاز کسب شده: {score} · بالاترین شتاب: ×{combo}
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>شروع مجدد</span>
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors"
            >
              بازگشت به خانه
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
