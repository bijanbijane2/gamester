import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../services/sound';
import { recordGameResult } from '../../services/storage';
import { speechCoach } from '../../services/speechCoach';
import { GameRulesModal } from '../common/GameRulesModal';
import { ArrowLeft, RotateCcw, Award, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
  isDaily?: boolean;
  onCompleteDaily?: (score: number) => void;
}

export const GoNoGoGame: React.FC<Props> = ({ onBack, isDaily, onCompleteDaily }) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [currentSignal, setCurrentSignal] = useState<'go' | 'nogo' | 'wait'>('wait');
  const [trialIndex, setTrialIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hits, setHits] = useState(0);
  const [falseAlarms, setFalseAlarms] = useState(0);
  const [flashFeedback, setFlashFeedback] = useState<'hit' | 'false_alarm' | 'inhibited' | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const TOTAL_TRIALS = 20;
  const trialTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const actionTakenRef = useRef<boolean>(false);
  const currentSignalRef = useRef<'go' | 'nogo' | 'wait'>('wait');

  currentSignalRef.current = currentSignal;

  const runTrial = (index: number) => {
    if (index >= TOTAL_TRIALS) {
      endGame();
      return;
    }

    setTrialIndex(index);
    actionTakenRef.current = false;
    setCurrentSignal('wait');
    setFlashFeedback(null);

    // Random ISI (inter-stimulus interval)
    const isi = 400 + Math.random() * 400;

    trialTimeoutRef.current = setTimeout(() => {
      // 75% Go, 25% No-Go to build motor priming
      const isGo = Math.random() > 0.28;
      const signal = isGo ? 'go' : 'nogo';
      setCurrentSignal(signal);

      // Duration signal stays active (decreases slightly as trials progress)
      const duration = Math.max(500, 800 - index * 12);

      trialTimeoutRef.current = setTimeout(() => {
        // If trial ended and was No-Go, and user refrained from clicking: that's a successful inhibition!
        if (currentSignalRef.current === 'nogo' && !actionTakenRef.current) {
          sounds.playSuccess();
          setScore((prev) => prev + 35);
          setStreak((prev) => prev + 1);
          setFlashFeedback('inhibited');
        } else if (currentSignalRef.current === 'go' && !actionTakenRef.current) {
          // Missed green
          setStreak(0);
        }

        setTimeout(() => {
          runTrial(index + 1);
        }, 200);
      }, duration);
    }, isi);
  };

  const handleUserTap = () => {
    if (gameState !== 'playing') return;
    if (actionTakenRef.current) return; // already acted this trial

    actionTakenRef.current = true;
    sounds.playTap();

    if (currentSignal === 'go') {
      sounds.playSuccess();
      setHits((prev) => prev + 1);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      const points = 25 + streak * 3;
      setScore((prev) => prev + points);
      setFlashFeedback('hit');
      if (nextStreak === 5) {
        speechCoach.speakContext('combo_high', 'عالیه! ریتم شلیک و سرعتت فوق‌العاده‌ست.');
      }
    } else if (currentSignal === 'nogo') {
      sounds.playError();
      setFalseAlarms((prev) => prev + 1);
      setStreak(0);
      setScore((prev) => Math.max(0, prev - 20));
      setFlashFeedback('false_alarm');
      speechCoach.speakContext('mistake_calm', 'آرامش داشته باش؛ سرعت رو فدای ترمز دقت نکن.');
    }
  };

  const handleStartGame = () => {
    sounds.playTap();
    setGameState('playing');
    setScore(0);
    setStreak(0);
    setHits(0);
    setFalseAlarms(0);
    setTrialIndex(0);
    speechCoach.speakContext('game_start', 'ترمزهای ذهنت رو آماده کن؛ سبز بزن و قرمز نزن!');
    runTrial(0);
  };

  const endGame = () => {
    setGameState('gameover');
    sounds.playWin();
    speechCoach.speakContext('level_complete', 'آفرین! مدار قشر پیش‌پیشانی تو عملکرد مهارکننده درخشانی داشت.');

    // Calculate inhibitory control score (100 - false alarm penalty)
    const inhibitionScore = Math.max(30, Math.min(99, Math.round(100 - falseAlarms * 18)));
    const processingScore = Math.max(40, Math.min(95, Math.round((hits / 15) * 85)));

    recordGameResult('gonogo', score, {
      inhibitoryControl: inhibitionScore,
      processingSpeed: processingScore,
    });

    if (isDaily && onCompleteDaily) {
      onCompleteDaily(score);
    }
  };

  useEffect(() => {
    return () => {
      if (trialTimeoutRef.current) clearTimeout(trialTimeoutRef.current);
    };
  }, []);

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
          {gameState === 'playing' && (
            <span className="text-xs text-slate-400">
              محرک {trialIndex + 1} از {TOTAL_TRIALS}
            </span>
          )}
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
        title="آزمون کنترل تکانه (Go / No-Go)"
        categoryName="سرعت و توجه"
        duration="۴۰ ثانیه"
        rules={[
          'صفحه منتظر می‌ماند و ناگهان دایره رنگی ظاهر می‌شود.',
          'دایره سبز (GO): در سریع‌ترین زمان ممکن هر کجای صفحه کلیک کنید.',
          'دایره قرمز (NO-GO): دست نگه دارید و اصلاً کلیک نکنید!',
          'کلیک کردن روی قرمز یا از دست دادن سبز امتیاز منفی دارد.',
        ]}
        scoringNote="۳۵ امتیاز به ازای هر مهار موفق قرمز یا واکنش سریع به سبز"
      />

      {gameState === 'intro' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <span className="text-2xl font-black">GO</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-100">آزمون کنترل تکانه (Go / No-Go)</h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              ریتم تحریک سرعت می‌گیرد:<br />
              هنگام ظاهر شدن دایره <span className="text-emerald-400 font-bold">سبز</span> فوراً ضربه بزنید.<br />
              هنگام ظاهر شدن دایره <span className="text-rose-400 font-bold">قرمز</span>، دست خود را متوقف کنید و ضربه نزنید!
            </p>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
          >
            شروع آزمون
          </button>
        </div>
      ) : gameState === 'playing' ? (
        <div className="space-y-6">
          {/* HUD */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div>
              <span className="text-xs text-slate-500 block">امتیاز</span>
              <span className="text-2xl font-bold text-amber-400 tabular-nums">{score}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">پیوستگی بدون خطا</span>
              <span className="text-lg font-bold text-emerald-400 tabular-nums">×{streak}</span>
            </div>
          </div>

          {/* Large Tap Arena */}
          <div
            onClick={handleUserTap}
            className="h-80 bg-slate-900/90 border border-slate-800 rounded-3xl flex flex-col items-center justify-center p-8 select-none cursor-pointer active:scale-98 transition-all relative overflow-hidden"
          >
            {currentSignal === 'wait' && (
              <div className="w-12 h-12 rounded-full border-2 border-slate-700 animate-pulse flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-slate-600" />
              </div>
            )}

            {currentSignal === 'go' && (
              <div className="w-40 h-40 rounded-full bg-emerald-500 shadow-2xl shadow-emerald-500/50 flex items-center justify-center animate-scale-up">
                <span className="text-2xl font-black text-slate-950">بزن! (GO)</span>
              </div>
            )}

            {currentSignal === 'nogo' && (
              <div className="w-40 h-40 rounded-full bg-rose-600 shadow-2xl shadow-rose-600/50 flex items-center justify-center animate-scale-up">
                <span className="text-2xl font-black text-white">نزن! (STOP)</span>
              </div>
            )}

            {/* Flash text status */}
            <div className="absolute bottom-4 text-xs font-semibold">
              {flashFeedback === 'hit' && <span className="text-emerald-400">عالی! واکنش سریع</span>}
              {flashFeedback === 'false_alarm' && <span className="text-rose-400">خطای تکانه‌ای! روی قرمز ضربه زدید</span>}
              {flashFeedback === 'inhibited' && <span className="text-cyan-400">آفرین! مهار موفق تکانه</span>}
            </div>
          </div>

          <div className="text-center text-xs text-slate-500">
            روی صفحه ضربه بزنید یا برای توقف روی قرمز دست نگه‌دارید
          </div>
        </div>
      ) : (
        /* Game Over */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-100">پایان آزمون Go / No-Go</h3>
            <p className="text-slate-400 text-sm mt-1">
              توانایی بازداری رفتاری و مهار تکانه شما ثبت شد.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-right">
            <div>
              <span className="text-xs text-slate-500 block">امتیاز کل</span>
              <span className="text-xl font-bold text-amber-400 tabular-nums">{score}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">واکنش‌های موفق سبز</span>
              <span className="text-lg font-bold text-emerald-400 tabular-nums">{hits}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">خطاهای تکانه‌ای قرمز</span>
              <span className="text-lg font-bold text-rose-400 tabular-nums">{falseAlarms}</span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleStartGame}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>تلاش مجدد</span>
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
