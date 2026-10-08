import React, { useState } from 'react';
import { sounds } from '../../services/sound';
import { recordGameResult } from '../../services/storage';
import { GameRulesModal } from '../common/GameRulesModal';
import { ArrowLeft, RotateCcw, Award, DollarSign, TrendingUp, AlertTriangle, HelpCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
  isDaily?: boolean;
  onCompleteDaily?: (score: number) => void;
}

interface Outcome {
  win: number;
  loss: number;
  net: number;
  deck: string;
}

export const IowaBoxesGame: React.FC<Props> = ({ onBack, isDaily, onCompleteDaily }) => {
  const [balance, setBalance] = useState(1000);
  const [turn, setTurn] = useState(1);
  const [lastOutcome, setLastOutcome] = useState<Outcome | null>(null);
  const [advantageousPicks, setAdvantageousPicks] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const TOTAL_TURNS = 15;

  // Deck A & B: High immediate reward (+100), but heavy occasional losses (Net Negative)
  // Deck C & D: Moderate immediate reward (+50), but low penalties (Net Positive)
  const drawDeck = (deckName: 'A' | 'B' | 'C' | 'D') => {
    if (isGameOver) return;
    sounds.playTap();

    let win = 50;
    let loss = 0;
    let isAdvantageous = false;

    if (deckName === 'A') {
      win = 100;
      loss = Math.random() < 0.5 ? 250 : 0;
    } else if (deckName === 'B') {
      win = 100;
      loss = Math.random() < 0.2 ? 700 : 0;
    } else if (deckName === 'C') {
      win = 50;
      loss = Math.random() < 0.5 ? 25 : 0;
      isAdvantageous = true;
    } else {
      // D
      win = 50;
      loss = Math.random() < 0.1 ? 150 : 0;
      isAdvantageous = true;
    }

    const net = win - loss;
    if (net >= 0) {
      sounds.playSuccess();
    } else {
      sounds.playError();
    }

    setBalance((prev) => prev + net);
    if (isAdvantageous) {
      setAdvantageousPicks((prev) => prev + 1);
    }
    setLastOutcome({ win, loss, net, deck: deckName });

    if (turn < TOTAL_TURNS) {
      setTurn((prev) => prev + 1);
    } else {
      endGame(balance + net, advantageousPicks + (isAdvantageous ? 1 : 0));
    }
  };

  const endGame = (finalBal: number, goodPicks: number) => {
    setIsGameOver(true);
    sounds.playWin();

    // Reward understanding advantageous decks
    const decisionScore = Math.min(95, Math.round(50 + (goodPicks / TOTAL_TURNS) * 45));
    const normalizedPoints = Math.max(0, finalBal);

    recordGameResult('iowa_boxes', normalizedPoints, {
      riskRegulation: decisionScore,
    });

    if (isDaily && onCompleteDaily) {
      onCompleteDaily(normalizedPoints);
    }
  };

  const handleRestart = () => {
    sounds.playTap();
    setBalance(1000);
    setTurn(1);
    setLastOutcome(null);
    setAdvantageousPicks(0);
    setIsGameOver(false);
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
          <span className="text-xs text-slate-400">
            انتخاب {turn} از {TOTAL_TURNS}
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
        title="چهار جعبه (Iowa Gambling Task)"
        categoryName="تصمیم‌گیری و ریسک"
        duration="۲ دقیقه"
        rules={[
          'شما با ۱۰۰۰ دلار سرمایه اولیه شروع می‌کنید و باید در ۱۵ نوبت از بین ۴ جعبه انتخاب کنید.',
          'جعبه‌های پرخطر (A و B): پاداش‌های فوری بزرگ دارند، اما جریمه‌های سنگین تصادفی شما را ورشکست می‌کنند.',
          'جعبه‌های پایدار (C و D): سودهای ملایم‌تری دارند اما جریمه‌هایشان ناچیز است و در درازمدت سودآورند.',
          'هدف: کشف شهودی جعبه‌های امن و حداکثر کردن ثروت نهایی.',
        ]}
        scoringNote="امتیاز بر اساس موجودی نهایی و درصد انتخاب‌های پایدار"
      />

      {/* HUD */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6">
        <div>
          <span className="text-xs text-slate-500 block">موجودی سرمایه</span>
          <span className={`text-2xl font-bold tabular-nums ${balance >= 1000 ? 'text-emerald-400' : 'text-rose-400'}`}>
            ${balance}
          </span>
        </div>
        <div className="text-left">
          <span className="text-xs text-slate-500 block">هدف آزمون</span>
          <span className="text-xs text-amber-300 font-medium">کشف شهودی استراتژی سودآور درازمدت</span>
        </div>
      </div>

      {!isGameOver ? (
        <div className="space-y-6">
          <div className="text-center text-xs text-slate-400">
            یکی از ۴ جعبه را باز کنید. هر جعبه الگوی پاداش و جریمه خاص خود را دارد:
          </div>

          {/* 4 Boxes */}
          <div className="grid grid-cols-2 gap-3">
            {(['A', 'B', 'C', 'D'] as const).map((deckId) => (
              <button
                key={deckId}
                onClick={() => drawDeck(deckId)}
                className="h-32 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-95 border border-slate-800 hover:border-amber-500/50 flex flex-col items-center justify-center p-4 transition-all shadow-md group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800 group-hover:bg-amber-500/10 border border-slate-700 group-hover:border-amber-500/30 flex items-center justify-center text-xl font-bold text-slate-200 group-hover:text-amber-400 mb-2 transition-colors">
                  {deckId}
                </div>
                <span className="text-xs text-slate-400">جعبه {deckId}</span>
              </button>
            ))}
          </div>

          {/* Last Turn Outcome */}
          {lastOutcome && (
            <div
              className={`p-4 rounded-2xl border text-sm flex items-center justify-between ${
                lastOutcome.net >= 0
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
              }`}
            >
              <div>
                <span className="font-bold">جعبه {lastOutcome.deck}: </span>
                <span>سود +${lastOutcome.win}</span>
                {lastOutcome.loss > 0 && <span className="text-rose-400"> · جریمه -${lastOutcome.loss}</span>}
              </div>
              <span className="font-extrabold tabular-nums">
                {lastOutcome.net >= 0 ? `+${lastOutcome.net}` : `${lastOutcome.net}`} $
              </span>
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
            <h3 className="text-2xl font-bold text-slate-100">پایان آزمون تصمیم‌گیری ۴ جعبه!</h3>
            <p className="text-slate-400 text-sm mt-1">
              موجودی نهایی شما: ${balance}
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-right space-y-2 text-xs leading-relaxed text-slate-300">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>بینش روانشناختی قمار آیوا (Iowa Gambling Task):</span>
            </div>
            <p>
              جعبه‌های A و B پاداش اولیه چشمگیر ($۱۰۰) داشتند اما جریمه‌های سهمگین ناگهانی مانع سود پایدار بود. در مقابل، جعبه‌های C و D سودهای معتدل ($۵۰) با زیان‌های ناچیز داشتند و استراتژی عقلانی بلندمدت را تشکیل می‌دادند.
            </p>
            <p className="text-emerald-400 font-medium pt-1">
              انتخاب‌های هوشمندانه شما از جعبه‌های پایدار (C و D): {advantageousPicks} از {TOTAL_TURNS}
            </p>
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
              بازگشت به خانه
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
