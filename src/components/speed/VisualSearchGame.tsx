import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../services/sound';
import { recordGameResult } from '../../services/storage';
import { GameRulesModal } from '../common/GameRulesModal';
import { ArrowLeft, Clock, RotateCcw, Award, HelpCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
  isDaily?: boolean;
  onCompleteDaily?: (score: number) => void;
}

export const VisualSearchGame: React.FC<Props> = ({ onBack, isDaily, onCompleteDaily }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const startTimeRef = useRef<number>(Date.now());

  // Grid size grows with level
  const gridSize = level < 3 ? 4 : level < 6 ? 5 : 6;
  const totalItems = gridSize * gridSize;

  useEffect(() => {
    generateGrid();
  }, [level]);

  const generateGrid = () => {
    const randomIndex = Math.floor(Math.random() * totalItems);
    setTargetIndex(randomIndex);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameOver, level]);

  const handleTimeUp = () => {
    setIsGameOver(true);
    sounds.playWin();
    recordGameResult('visual_search', score, {
      processingSpeed: Math.min(95, 50 + level * 7),
      inhibitoryControl: 70,
    });
    if (isDaily && onCompleteDaily) {
      onCompleteDaily(score);
    }
  };

  const handleTileClick = (index: number) => {
    if (isGameOver) return;
    sounds.playTap();

    if (index === targetIndex) {
      sounds.playSuccess();
      const elapsed = Date.now() - startTimeRef.current;
      const speedBonus = Math.max(0, Math.round((2000 - elapsed) / 20));
      const points = 30 + speedBonus;
      setScore((prev) => prev + points);
      setLevel((prev) => prev + 1);
    } else {
      sounds.playError();
      setScore((prev) => Math.max(0, prev - 15));
    }
  };

  const handleRestart = () => {
    sounds.playTap();
    setLevel(1);
    setScore(0);
    setTimeLeft(30);
    setIsGameOver(false);
    generateGrid();
  };

  // Feature variation based on level
  const distractorChar = level < 4 ? '○' : level < 7 ? 'C' : 'E';
  const targetChar = level < 4 ? '●' : level < 7 ? 'O' : 'F';

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
          <span className="text-xs text-slate-400">سطح {level}</span>
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
        title="جستجوی بصری (Visual Search)"
        categoryName="دقت و سرعت دیداری"
        duration="۳۰ ثانیه"
        rules={[
          'در یک شبکه از نمادهای مشابه، یک نماد متفاوت پنهان شده است.',
          'در کمترین زمان ممکن نماد متفاوت را پیدا کرده و روی آن کلیک کنید.',
          'با هر پاسخ صحیح، ابعاد جدول بزرگتر و تفاوت نمادها ظریف‌تر می‌شود.',
        ]}
        scoringNote="امتیاز متناسب با سرعت یافتن و سطح پیشرفت"
      />

      {/* HUD */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6">
        <div>
          <span className="text-xs text-slate-500 block">امتیاز کل</span>
          <span className="text-2xl font-bold text-amber-400 tabular-nums">{score}</span>
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
          <div className="text-center text-xs text-slate-400">
            عنصر متفاوت (<span className="text-amber-400 font-bold text-sm mx-1">{targetChar}</span>) را در شبکه پیدا کنید:
          </div>

          {/* Dynamic Grid */}
          <div
            className="p-4 bg-slate-900/90 border border-slate-800 rounded-3xl grid gap-2.5 mx-auto max-w-sm justify-center"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: totalItems }).map((_, idx) => {
              const isTarget = idx === targetIndex;
              const char = isTarget ? targetChar : distractorChar;

              return (
                <button
                  key={idx}
                  onClick={() => handleTileClick(idx)}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700/80 flex items-center justify-center text-xl md:text-2xl font-black text-slate-200 transition-all"
                >
                  {char}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Game Over */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-100">پایان جستجوی بصری!</h3>
            <p className="text-slate-400 text-sm mt-1">
              رسیدن به سطح {level} با مجموع امتیاز {score}
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
              بازگشت به منو
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
