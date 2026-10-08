import React, { useState, useEffect } from 'react';
import { sounds } from '../../services/sound';
import { recordGameResult } from '../../services/storage';
import { GameRulesModal } from '../common/GameRulesModal';
import { ArrowLeft, RotateCcw, Award, CheckCircle2, XCircle, Shuffle, HelpCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
  isDaily?: boolean;
  onCompleteDaily?: (score: number) => void;
}

type Dimension = 'color' | 'shape' | 'count';

interface CardItem {
  color: 'red' | 'blue' | 'green';
  shape: 'circle' | 'triangle' | 'star';
  count: 1 | 2 | 3;
}

const REFERENCE_DECKS: CardItem[] = [
  { color: 'red', shape: 'circle', count: 1 },
  { color: 'blue', shape: 'triangle', count: 2 },
  { color: 'green', shape: 'star', count: 3 },
];

const COLORS_MAP = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#10b981',
};

export const RuleSwitchGame: React.FC<Props> = ({ onBack, isDaily, onCompleteDaily }) => {
  const [activeRule, setActiveRule] = useState<Dimension>('color');
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [currentCard, setCurrentCard] = useState<CardItem | null>(null);
  const [trialCount, setTrialCount] = useState(0);
  const [score, setScore] = useState(0);
  const [perseverativeErrors, setPerseverativeErrors] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean } | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const TOTAL_TRIALS = 20;

  const generateCard = (): CardItem => {
    const colors: ('red' | 'blue' | 'green')[] = ['red', 'blue', 'green'];
    const shapes: ('circle' | 'triangle' | 'star')[] = ['circle', 'triangle', 'star'];
    const counts: (1 | 2 | 3)[] = [1, 2, 3];

    return {
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      count: counts[Math.floor(Math.random() * counts.length)],
    };
  };

  useEffect(() => {
    setCurrentCard(generateCard());
  }, []);

  const handleMatchDeck = (deckIndex: number) => {
    if (!currentCard || isGameOver) return;
    sounds.playTap();

    const targetDeck = REFERENCE_DECKS[deckIndex];
    let isCorrect = false;

    if (activeRule === 'color' && currentCard.color === targetDeck.color) isCorrect = true;
    if (activeRule === 'shape' && currentCard.shape === targetDeck.shape) isCorrect = true;
    if (activeRule === 'count' && currentCard.count === targetDeck.count) isCorrect = true;

    setFeedback({ isCorrect });

    if (isCorrect) {
      sounds.playSuccess();
      setScore((prev) => prev + 25);
      const nextConsecutive = consecutiveCorrect + 1;
      setConsecutiveCorrect(nextConsecutive);

      // Silent rule change after 5-6 consecutive correct answers!
      if (nextConsecutive >= 5) {
        const otherRules: Dimension[] = (['color', 'shape', 'count'] as Dimension[]).filter(
          (r) => r !== activeRule
        );
        const newRule = otherRules[Math.floor(Math.random() * otherRules.length)];
        setActiveRule(newRule);
        setConsecutiveCorrect(0);
      }
    } else {
      sounds.playError();
      setConsecutiveCorrect(0);
      setPerseverativeErrors((prev) => prev + 1);
    }

    const nextTrials = trialCount + 1;
    setTrialCount(nextTrials);

    if (nextTrials < TOTAL_TRIALS) {
      setTimeout(() => {
        setFeedback(null);
        setCurrentCard(generateCard());
      }, 350);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setIsGameOver(true);
    sounds.playWin();

    const flexibilityScore = Math.max(30, Math.min(99, Math.round(100 - perseverativeErrors * 10)));
    recordGameResult('rule_switch', score, {
      cognitiveFlexibility: flexibilityScore,
    });

    if (isDaily && onCompleteDaily) {
      onCompleteDaily(score);
    }
  };

  const renderShapeIcon = (shape: string, colorHex: string) => {
    if (shape === 'circle') {
      return <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colorHex }} />;
    }
    if (shape === 'triangle') {
      return (
        <div
          className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px]"
          style={{ borderBottomColor: colorHex }}
        />
      );
    }
    return (
      <span className="text-2xl font-black" style={{ color: colorHex }}>
        ★
      </span>
    );
  };

  const handleRestart = () => {
    sounds.playTap();
    setActiveRule('color');
    setConsecutiveCorrect(0);
    setTrialCount(0);
    setScore(0);
    setPerseverativeErrors(0);
    setFeedback(null);
    setIsGameOver(false);
    setCurrentCard(generateCard());
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

      {/* Rules Modal */}
      <GameRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        title="تغییر قانون (Wisconsin Card Sorting)"
        categoryName="انعطاف‌پذیری شناختی"
        duration="۲ دقیقه"
        rules={[
          'کارت‌ها بر اساس ۳ ویژگی تفکیک می‌شوند: رنگ، شکل یا تعداد نمادها.',
          'بازی قانون فعال را به شما نمی‌گوید! با آزمون و خطای هوشمندانه آن را کشف کنید.',
          'پس از چند پاسخ درست متوالی، قانون به صورت پنهانی تغییر می‌کند!',
          'توانایی رها کردن قانون قبلی و کشف سریع قانون جدید، نشانگر انعطاف شناختی بالای مغز است.',
        ]}
        scoringNote="۲۵ امتیاز به ازای هر تطابق درست بر اساس قانون مخفی"
      />

      {/* HUD */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6">
        <div>
          <span className="text-xs text-slate-500 block">امتیاز</span>
          <span className="text-2xl font-bold text-amber-400 tabular-nums">{score}</span>
        </div>
        <div className="text-left">
          <span className="text-xs text-slate-500 block">قانون بازی</span>
          <span className="text-xs text-amber-300 font-medium">پنهان است؛ با آزمون و خطا کشف کنید!</span>
        </div>
      </div>

      {!isGameOver && currentCard ? (
        <div className="space-y-6">
          <div className="text-center text-xs text-slate-400">
            کارت پایینی را با یکی از ۳ دسته مرجع بالا مطابقت دهید. قانون طبق رنگ، شکل یا تعداد تغییر می‌کند.
          </div>

          {/* Reference Decks */}
          <div className="grid grid-cols-3 gap-3">
            {REFERENCE_DECKS.map((deck, idx) => (
              <button
                key={idx}
                onClick={() => handleMatchDeck(idx)}
                className="h-32 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-95 border border-slate-800 hover:border-slate-700 flex flex-col items-center justify-center p-3 transition-all shadow-md"
              >
                <div className="flex items-center gap-1.5 justify-center mb-2">
                  {Array.from({ length: deck.count }).map((_, i) => (
                    <React.Fragment key={i}>
                      {renderShapeIcon(deck.shape, COLORS_MAP[deck.color])}
                    </React.Fragment>
                  ))}
                </div>
                <span className="text-xs text-slate-500 font-medium">دسته #{idx + 1}</span>
              </button>
            ))}
          </div>

          {/* Target Card Under Evaluation */}
          <div
            className={`min-h-40 rounded-3xl border flex flex-col items-center justify-center p-6 transition-all ${
              feedback?.isCorrect === true
                ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                : feedback?.isCorrect === false
                ? 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/20'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <span className="text-xs text-slate-500 mb-3">کارت فعلی برای دسته‌بندی:</span>
            <div className="flex items-center gap-3">
              {Array.from({ length: currentCard.count }).map((_, i) => (
                <React.Fragment key={i}>
                  {renderShapeIcon(currentCard.shape, COLORS_MAP[currentCard.color])}
                </React.Fragment>
              ))}
            </div>

            {feedback && (
              <div className="mt-4 text-xs font-bold flex items-center gap-1">
                {feedback.isCorrect ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> مطابق با قانون فعلی!
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> با قانون مطابقت نداشت!
                  </span>
                )}
              </div>
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
            <h3 className="text-2xl font-bold text-slate-100">پایان آزمون انعطاف شناختی!</h3>
            <p className="text-slate-400 text-sm mt-1">
              توانایی مغز شما در رها کردن قاعده قدیمی و پذیرش قانون نو ارزیابی شد.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto bg-slate-950 p-4 rounded-2xl border border-slate-800 text-right">
            <div>
              <span className="text-xs text-slate-500 block">امتیاز کل</span>
              <span className="text-xl font-bold text-amber-400 tabular-nums">{score}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">خطاهای پافشاری (درجا زدن)</span>
              <span className="text-xl font-bold text-rose-400 tabular-nums">{perseverativeErrors}</span>
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
              بازگشت به خانه
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
