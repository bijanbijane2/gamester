import React, { useState, useEffect } from 'react';
import { sounds } from '../../services/sound';
import { recordGameResult } from '../../services/storage';
import { GameRulesModal } from '../common/GameRulesModal';
import { ArrowLeft, RotateCcw, Award, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
  isDaily?: boolean;
  onCompleteDaily?: (score: number) => void;
}

type Mode = 'forward' | 'reverse';
type Stage = 'memorize' | 'recall' | 'feedback' | 'gameover';

export const DigitSpanGame: React.FC<Props> = ({ onBack, isDaily, onCompleteDaily }) => {
  const [mode, setMode] = useState<Mode>('forward');
  const [stage, setStage] = useState<Stage>('memorize');
  const [spanLength, setSpanLength] = useState(4);
  const [sequence, setSequence] = useState<number[]>([]);
  const [visibleDigitIndex, setVisibleDigitIndex] = useState<number>(-1);
  const [userInputs, setUserInputs] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [maxSpanAchieved, setMaxSpanAchieved] = useState(4);
  const [lastSuccess, setLastSuccess] = useState<boolean>(true);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  // Generate sequence on span change
  useEffect(() => {
    generateNewSequence(spanLength);
  }, [spanLength, mode]);

  const generateNewSequence = (len: number) => {
    const seq: number[] = [];
    for (let i = 0; i < len; i++) {
      seq.push(Math.floor(Math.random() * 9) + 1);
    }
    setSequence(seq);
    setUserInputs([]);
    setStage('memorize');
    startDigitAnimation(seq);
  };

  const startDigitAnimation = (seq: number[]) => {
    let currentIdx = 0;
    setVisibleDigitIndex(-1);

    const interval = setInterval(() => {
      if (currentIdx < seq.length) {
        setVisibleDigitIndex(currentIdx);
        sounds.playTap();
        currentIdx++;
      } else {
        clearInterval(interval);
        setVisibleDigitIndex(-1);
        setStage('recall');
      }
    }, 900);
  };

  const handleNumpad = (num: number) => {
    if (stage !== 'recall') return;
    sounds.playTap();

    const nextInputs = [...userInputs, num];
    setUserInputs(nextInputs);

    // If filled expected length
    if (nextInputs.length === sequence.length) {
      checkRecall(nextInputs);
    }
  };

  const checkRecall = (inputs: number[]) => {
    const targetSeq = mode === 'forward' ? sequence : [...sequence].reverse();
    const isCorrect = inputs.every((val, idx) => val === targetSeq[idx]);

    setLastSuccess(isCorrect);
    setStage('feedback');

    if (isCorrect) {
      sounds.playSuccess();
      const points = spanLength * 30 + (mode === 'reverse' ? 40 : 20);
      setScore((prev) => prev + points);
      setMaxSpanAchieved((prev) => Math.max(prev, spanLength));

      setTimeout(() => {
        if (spanLength < 8) {
          setSpanLength((prev) => prev + 1);
        } else {
          endGame();
        }
      }, 1200);
    } else {
      sounds.playError();
      setTimeout(() => {
        endGame();
      }, 1500);
    }
  };

  const endGame = () => {
    setStage('gameover');
    sounds.playWin();

    const flexibilityScore = Math.min(95, 50 + maxSpanAchieved * 6);
    recordGameResult('digit_span', score, {
      cognitiveFlexibility: flexibilityScore,
    });

    if (isDaily && onCompleteDaily) {
      onCompleteDaily(score);
    }
  };

  const handleRestart = () => {
    sounds.playTap();
    setSpanLength(4);
    setScore(0);
    setMaxSpanAchieved(4);
    generateNewSequence(4);
  };

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
          <button
            onClick={() => { setMode('forward'); handleRestart(); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              mode === 'forward' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 bg-slate-900'
            }`}
          >
            ترتیب مستقیم
          </button>
          <button
            onClick={() => { setMode('reverse'); handleRestart(); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              mode === 'reverse' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 bg-slate-900'
            }`}
          >
            ترتیب معکوس (سخت‌تر)
          </button>
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
        title="فراخنای ارقام (Digit Span)"
        categoryName="حافظه کاری و انعطاف"
        duration="۲ دقیقه"
        rules={[
          'یک رشته از ارقام تک رقمی یکی‌یکی روی صفحه ظاهر می‌شوند.',
          'در مرحله یادآوری، با استفاده از صفحه کلید ارقام، زنجیره را به یاد بیاورید.',
          'در حالت مستقیم: ارقام را دقیقاً به همان ترتیبی که دیدید وارد کنید.',
          'در حالت معکوس: ارقام را از آخر به اول وارد کنید (تمرین قوی قشر پیش‌پیشانی).',
          'با هر موفقیت، طول رشته یک رقم افزایش می‌یابد.',
        ]}
        scoringNote="امتیاز بر اساس طول زنجیره (Span) و حالت معکوس"
      />

      {/* HUD */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6">
        <div>
          <span className="text-xs text-slate-500 block">امتیاز کل</span>
          <span className="text-2xl font-bold text-amber-400 tabular-nums">{score}</span>
        </div>
        <div>
          <span className="text-xs text-slate-500 block">طول ارقام (Span)</span>
          <span className="text-xl font-bold text-slate-200 tabular-nums">{spanLength} رقم</span>
        </div>
      </div>

      {stage !== 'gameover' ? (
        <div className="space-y-6">
          {/* Display screen */}
          <div className="min-h-48 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center justify-center p-6 text-center">
            {stage === 'memorize' && (
              <div className="space-y-2">
                <span className="text-xs text-slate-400 block">اعداد را به خاطر بسپارید...</span>
                <span className="text-7xl font-black text-amber-400 tabular-nums tracking-widest animate-pulse">
                  {visibleDigitIndex >= 0 ? sequence[visibleDigitIndex] : '—'}
                </span>
              </div>
            )}

            {stage === 'recall' && (
              <div className="space-y-3">
                <span className="text-xs text-slate-400 block">
                  {mode === 'forward' ? 'ارقام را به همان ترتیب وارد کنید:' : 'ارقام را به ترتیب «معکوس» وارد کنید:'}
                </span>
                <div className="flex gap-2 justify-center">
                  {Array.from({ length: sequence.length }).map((_, i) => (
                    <span
                      key={i}
                      className="w-10 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl font-bold text-slate-100 tabular-nums"
                    >
                      {userInputs[i] !== undefined ? userInputs[i] : '•'}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {stage === 'feedback' && (
              <div className="space-y-2">
                {lastSuccess ? (
                  <div className="text-emerald-400 font-bold text-lg flex items-center gap-2 justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                    <span>آفرین! گام بعدی...</span>
                  </div>
                ) : (
                  <div className="text-rose-400 font-bold text-lg flex items-center gap-2 justify-center">
                    <AlertCircle className="w-6 h-6" />
                    <span>پاسخ اشتباه بود</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Numpad */}
          {stage === 'recall' && (
            <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  onClick={() => handleNumpad(n)}
                  className="h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-2xl font-bold text-slate-100 transition-all shadow-sm"
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Game Over */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-100">پایان آزمون فراخنای ارقام</h3>
            <p className="text-slate-400 text-sm mt-1">
              بیشترین حافظه عددی ثبت شده: {maxSpanAchieved} رقم ({mode === 'reverse' ? 'معکوس' : 'مستقیم'})
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
