import React, { useState } from 'react';
import { sounds } from '../../services/sound';
import { recordGameResult } from '../../services/storage';
import { speechCoach } from '../../services/speechCoach';
import { BalloonCarnivalSvg } from '../world/WorldLandmarkIllustrations';
import { GameRulesModal } from '../common/GameRulesModal';
import { ArrowLeft, RotateCcw, Award, Coins, Flame, HelpCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
  isDaily?: boolean;
  onCompleteDaily?: (score: number) => void;
}

export const BalloonRiskGame: React.FC<Props> = ({ onBack, isDaily, onCompleteDaily }) => {
  const [round, setRound] = useState(1);
  const [bankedCoins, setBankedCoins] = useState(0);
  const [currentPumps, setCurrentPumps] = useState(0);
  const [isPopped, setIsPopped] = useState(false);
  const [isCashedOut, setIsCashedOut] = useState(false);
  const [popThreshold, setPopThreshold] = useState(() => Math.floor(Math.random() * 16) + 4);
  const [successfulPumpsHistory, setSuccessfulPumpsHistory] = useState<number[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const TOTAL_ROUNDS = 8;

  const handlePump = () => {
    if (isPopped || isCashedOut || isGameOver) return;

    const nextPumps = currentPumps + 1;
    sounds.playPump(nextPumps);

    if (nextPumps >= popThreshold) {
      // Balloon pops!
      sounds.playPop();
      setIsPopped(true);
      setCurrentPumps(0);
      speechCoach.speakContext('mistake_calm', 'طمع زیاد باعث انفجار شد؛ در نوبت بعد قبل از مرز خطر واریز کن.');
      // Auto-advance to next round after 1 second without waiting for user click
      setTimeout(() => {
        handleNextRound();
      }, 1000);
    } else {
      setCurrentPumps(nextPumps);
    }
  };

  const handleCashOut = () => {
    if (isPopped || isCashedOut || currentPumps === 0 || isGameOver) return;
    sounds.playSuccess();

    const roundEarnings = currentPumps * 15;
    setBankedCoins((prev) => prev + roundEarnings);
    setSuccessfulPumpsHistory((prev) => [...prev, currentPumps]);
    setIsCashedOut(true);

    if (currentPumps >= 6) {
      speechCoach.speakContext('combo_high', 'عالیه! تعادل هوشمندانه‌ای بین سود و مهار خطر برقرار کردی.');
    }

    // Auto-advance to next round after 1 second without waiting for user click
    setTimeout(() => {
      handleNextRound();
    }, 1000);
  };

  const handleNextRound = () => {
    sounds.playTap();
    if (round < TOTAL_ROUNDS) {
      setRound((prev) => prev + 1);
      setCurrentPumps(0);
      setIsPopped(false);
      setIsCashedOut(false);
      setPopThreshold(Math.floor(Math.random() * 16) + 4);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setIsGameOver(true);
    sounds.playWin();
    speechCoach.speakContext('level_complete', 'آفرین! تنظیم هیجان ریسک و مهار طمع در ذهن تو عالی سنجیده شد.');

    const avgPumps = successfulPumpsHistory.length > 0
      ? successfulPumpsHistory.reduce((a, b) => a + b, 0) / successfulPumpsHistory.length
      : 0;

    // Risk regulation: moderate pumps (6-11) is optimal calibration (75-90 score)
    const riskScore = Math.min(95, Math.round(50 + avgPumps * 4));

    recordGameResult('balloon', bankedCoins, {
      riskRegulation: riskScore,
    });

    if (isDaily && onCompleteDaily) {
      onCompleteDaily(bankedCoins);
    }
  };

  const handleRestart = () => {
    sounds.playTap();
    setRound(1);
    setBankedCoins(0);
    setCurrentPumps(0);
    setIsPopped(false);
    setIsCashedOut(false);
    setPopThreshold(Math.floor(Math.random() * 16) + 4);
    setSuccessfulPumpsHistory([]);
    setIsGameOver(false);
  };

  // Visual balloon scale
  const balloonScale = 1 + currentPumps * 0.08;

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
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
            <BalloonCarnivalSvg className="w-5 h-5 inline-block" />
            <span>مکان: میدان ریسک و سکه (BART)</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            بادکنک {round} از {TOTAL_ROUNDS}
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

      {/* HUD */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6">
        <div>
          <span className="text-xs text-slate-500 block">سکه ذخیره‌شده در بانک</span>
          <div className="flex items-center gap-1.5 text-2xl font-bold text-amber-400 tabular-nums">
            <Coins className="w-5 h-5 text-amber-400" />
            <span>{bankedCoins}</span>
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500 block">پاداش این بادکنک</span>
          <span className="text-xl font-bold text-emerald-400 tabular-nums">
            +{currentPumps * 15} سکه
          </span>
        </div>
      </div>

      {!isGameOver ? (
        <div className="space-y-6">
          {/* Balloon Chamber */}
          <div className="h-72 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {!isPopped ? (
              <div
                className="transition-transform duration-200 flex flex-col items-center"
                style={{ transform: `scale(${balloonScale})` }}
              >
                <div className="w-24 h-28 rounded-full bg-gradient-to-t from-rose-600 via-rose-500 to-rose-400 shadow-xl shadow-rose-600/30 flex items-center justify-center relative">
                  <span className="text-xs font-bold text-white/80 tabular-nums select-none">
                    {currentPumps > 0 ? `${currentPumps}` : ''}
                  </span>
                  {/* Glossy highlight */}
                  <div className="absolute top-3 left-4 w-5 h-7 rounded-full bg-white/30 rotate-12" />
                </div>
                {/* Knot */}
                <div className="w-3 h-2 bg-rose-700 rounded-sm -mt-0.5" />
              </div>
            ) : (
              <div className="text-center space-y-2 animate-bounce">
                <span className="text-5xl">💥</span>
                <p className="text-sm font-bold text-rose-400">بادکنک ترکید! پاداش این دور سوخت.</p>
              </div>
            )}

            {isCashedOut && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center space-y-2">
                <span className="text-emerald-400 font-bold text-lg">
                  +{currentPumps * 15} سکه با موفقیت به بانک منتقل شد!
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3">
            {!isPopped && !isCashedOut ? (
              <>
                <button
                  onClick={handlePump}
                  className="flex-1 py-4 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-rose-600/20 text-base transition-all flex items-center justify-center gap-2"
                >
                  <Flame className="w-5 h-5" />
                  <span>باد کن (+۱۵ سکه)</span>
                </button>
                <button
                  onClick={handleCashOut}
                  disabled={currentPumps === 0}
                  className="flex-1 py-4 bg-amber-500 hover:bg-amber-400 active:scale-95 disabled:opacity-40 text-slate-950 font-bold rounded-2xl shadow-lg shadow-amber-500/20 text-base transition-all flex items-center justify-center gap-2"
                >
                  <Coins className="w-5 h-5" />
                  <span>ذخیره در بانک</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleNextRound}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-2xl text-base transition-all"
              >
                {round < TOTAL_ROUNDS ? 'بادکنک بعدی' : 'مشاهده نتایج نهایی'}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Game Over */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-100">پایان آزمون بادکنک BART!</h3>
            <p className="text-slate-400 text-sm mt-1">
              مجموع سکه‌های ذخیره شده در بانک: {bankedCoins}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto bg-slate-950 p-4 rounded-2xl border border-slate-800 text-right">
            <div>
              <span className="text-xs text-slate-500 block">سکه ذخیره‌شده</span>
              <span className="text-xl font-bold text-amber-400 tabular-nums">{bankedCoins}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">بادکنک‌های سالم</span>
              <span className="text-xl font-bold text-emerald-400 tabular-nums">
                {successfulPumpsHistory.length} / {TOTAL_ROUNDS}
              </span>
            </div>
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

      {/* Rules Modal */}
      <GameRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        title="بادکنک جسور (BART)"
        categoryName="ریسک، پاداش و تصمیم‌گیری"
        duration="۲ دقیقه"
        rules={[
          'با هر بار زدن دکمه «باد کن»، بادکنک بزرگتر شده و ۱۵ سکه به پاداش احتمالی اضافه می‌شود.',
          'اما هر بار احتمال ترکیدن بادکنک بالاتر می‌رود! اگر بادکنک بترکد، سکه‌های آن بادکنک می‌سوزد.',
          'هر زمان حس کردید به اندازه کافی باد شده، دکمه «ذخیره در بانک» را بزنید تا سکه‌ها تثبیت شوند.',
          'شما در مجموع ۸ بادکنک دارید؛ هنر بازی در تنظیم هوشمندانه طمع و محافظت از دارایی است.',
        ]}
        scoringNote="سکه‌هایی که با موفقیت در بانک ذخیره شوند، امتیاز نهایی شما را می‌سازند."
      />
    </div>
  );
};
