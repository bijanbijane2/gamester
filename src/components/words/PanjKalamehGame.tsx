import React, { useState, useEffect, useMemo } from 'react';
import { FIVE_WORDS_CATEGORIES, FiveWordsCategory } from '../../data/wordBank';
import { sounds } from '../../services/sound';
import { recordGameResult } from '../../services/storage';
import { WordMarketSvg } from '../world/WorldLandmarkIllustrations';
import { GameRulesModal } from '../common/GameRulesModal';
import { ArrowLeft, Clock, CheckCircle2, RotateCcw, Award, AlertCircle, HelpCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
  isDaily?: boolean;
  onCompleteDaily?: (score: number) => void;
}

// Distractor words pool from across topics
const DISTRACTOR_WORDS = [
  'هواپیما', 'شیروانی', 'صخره', 'کهکشان', 'پیانو', 'دوربین', 'تلسکوپ', 'رایانه',
  'گردنبند', 'چمدان', 'بادبادک', 'کبریت', 'شمع', 'نقشه', 'طوفان', 'پرچم'
];

export const PanjKalamehGame: React.FC<Props> = ({ onBack, isDaily, onCompleteDaily }) => {
  const [catIndex, setCatIndex] = useState(0);
  const [submittedWords, setSubmittedWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'error' | 'success' } | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [seed, setSeed] = useState(0); // Triggers fresh 5 options

  const currentCategory: FiveWordsCategory = FIVE_WORDS_CATEGORIES[catIndex];

  // Generate 5 quick choices (2-3 valid category items not yet submitted + 2-3 distractors)
  const currentOptions = useMemo(() => {
    const remainingValid = currentCategory.validList.filter((w) => !submittedWords.includes(w));
    const shuffledValid = [...remainingValid].sort(() => 0.5 - Math.random());
    const shuffledDistractors = [...DISTRACTOR_WORDS].sort(() => 0.5 - Math.random());

    const pickValidCount = Math.min(shuffledValid.length, 3);
    const pickDistractorCount = 5 - pickValidCount;

    const chosen = [
      ...shuffledValid.slice(0, pickValidCount),
      ...shuffledDistractors.slice(0, pickDistractorCount),
    ];

    return chosen.sort(() => 0.5 - Math.random());
  }, [currentCategory, submittedWords, seed]);

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
  }, [isGameOver, catIndex]);

  const handleTimeUp = () => {
    setIsGameOver(true);
    sounds.playWin();
    recordGameResult('panj_kalameh', score, {
      verbalFluency: Math.min(95, 55 + submittedWords.length * 8),
      processingSpeed: Math.min(95, 50 + Math.round(score / 5)),
    });
    if (isDaily && onCompleteDaily) {
      onCompleteDaily(score);
    }
  };

  const handleSelectOption = (word: string) => {
    if (isGameOver) return;

    if (submittedWords.includes(word)) {
      sounds.playError();
      setFeedback({ msg: 'این کلمه را قبلاً ثبت کرده‌اید!', type: 'error' });
      setSeed((prev) => prev + 1);
      return;
    }

    const isMatched = currentCategory.validList.includes(word);

    if (isMatched) {
      sounds.playSuccess();
      const newSubmitted = [...submittedWords, word];
      setSubmittedWords(newSubmitted);
      const points = 20 + Math.round(timeLeft / 2);
      setScore((prev) => prev + points);
      setFeedback({ msg: `درست است! «${word}» به سبد اضافه شد (+${points} امتیاز)`, type: 'success' });

      // If reached 5 words -> auto advance after 1 second!
      if (newSubmitted.length >= 5) {
        sounds.playCombo();
        setTimeout(() => {
          if (catIndex + 1 < FIVE_WORDS_CATEGORIES.length) {
            setCatIndex((prev) => prev + 1);
            setSubmittedWords([]);
            setTimeLeft(40);
            setFeedback(null);
            setSeed((prev) => prev + 1);
          } else {
            setIsGameOver(true);
            sounds.playWin();
            recordGameResult('panj_kalameh', score + points, {
              verbalFluency: 92,
              processingSpeed: 88,
            });
            if (isDaily && onCompleteDaily) {
              onCompleteDaily(score + points);
            }
          }
        }, 1000);
      }
    } else {
      sounds.playError();
      setFeedback({ msg: `«${word}» متعلق به دسته «${currentCategory.title}» نیست!`, type: 'error' });
    }

    // Refresh 5 options immediately on each click!
    setSeed((prev) => prev + 1);
  };

  const handleRestart = () => {
    sounds.playTap();
    setCatIndex(0);
    setSubmittedWords([]);
    setScore(0);
    setTimeLeft(40);
    setIsGameOver(false);
    setFeedback(null);
    setSeed((prev) => prev + 1);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
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
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-400">
            <WordMarketSvg className="w-5 h-5 inline-block" />
            <span>مکان: بازارچه کلمات</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">دسته {catIndex + 1} از {FIVE_WORDS_CATEGORIES.length}</span>
          {/* Rules Help Icon Button */}
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
            <span className="text-xs text-slate-500 block">امتیاز</span>
            <span className="text-2xl font-bold text-amber-400 tabular-nums">{score}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">کلمات جمع‌آوری شده</span>
            <span className="text-xl font-bold text-emerald-400 tabular-nums">{submittedWords.length} / 5</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-xl">
          <Clock className={`w-4 h-4 ${timeLeft < 10 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
          <span className={`text-lg font-bold tabular-nums ${timeLeft < 10 ? 'text-red-400' : 'text-slate-200'}`}>
            {timeLeft} ثانیه
          </span>
        </div>
      </div>

      {!isGameOver ? (
        <div className="space-y-6">
          {/* Topic Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-center space-y-2">
            <span className="text-xs font-semibold text-amber-400/90 block">موضوع این بخش بازار:</span>
            <h3 className="text-2xl font-extrabold text-slate-100">{currentCategory.title}</h3>
            <p className="text-sm text-slate-400">{currentCategory.description}</p>
          </div>

          {/* 5 Slots */}
          <div className="grid grid-cols-5 gap-2 py-2">
            {[0, 1, 2, 3, 4].map((slotIdx) => {
              const word = submittedWords[slotIdx];
              return (
                <div
                  key={slotIdx}
                  className={`h-16 rounded-xl border flex flex-col items-center justify-center text-center p-2 transition-all ${
                    word
                      ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}
                >
                  <span className="text-xs text-slate-500 mb-0.5">#{slotIdx + 1}</span>
                  <span className="text-sm font-bold truncate max-w-full">
                    {word || '—'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 5 Rapid Dynamic Options - Replaced on every click! */}
          <div className="space-y-3">
            <div className="text-center text-xs text-slate-400 font-medium">
              از بین ۵ گزینه سریع انتخاب کنید (با هر کلیک ۵ گزینه جدید ظاهر می‌شوند):
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {currentOptions.map((optWord, idx) => (
                <button
                  key={`${optWord}-${idx}-${seed}`}
                  onClick={() => handleSelectOption(optWord)}
                  className="py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-95 border border-slate-700/80 hover:border-orange-500 text-slate-100 font-bold text-base transition-all shadow-sm flex items-center justify-center"
                >
                  {optWord}
                </button>
              ))}
            </div>

            {feedback && (
              <div
                className={`flex items-center gap-2 text-xs p-3 rounded-xl border ${
                  feedback.type === 'success'
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-900/50'
                    : 'bg-rose-950/40 text-rose-300 border-rose-900/50'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                )}
                <span>{feedback.msg}</span>
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
            <h3 className="text-2xl font-bold text-slate-100">پایان چالش پنج‌کلمه!</h3>
            <p className="text-slate-400 text-sm mt-1">
              امتیاز نهایی کسب شده: {score}
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>بازی مجدد</span>
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors"
            >
              بازگشت به نقشه
            </button>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      <GameRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        title="پنج کلمه"
        categoryName="واژه و طبقه‌بندی"
        duration="۱ دقیقه"
        rules={[
          'یک موضوع به شما داده می‌شود (مانند وسایل آشپزخانه یا میوه‌ها).',
          'به جای تایپ دستی، ۵ گزینه به شما نمایش داده می‌شود که با هر بار ضربه (درست یا غلط)، هر ۵ گزینه سریعاً عوض می‌شوند.',
          'باید ۵ کلمه مرتبط با موضوع را قبل از پایان زمان جمع‌آوری کنید.',
          'پس از تکمیل ۵ کلمه، بازی پس از ۱ ثانیه خودبه‌خود وارد دسته بعدی می‌شود.',
        ]}
        scoringNote="هر کلمه درست +۲۰ امتیاز پایه به همراه پاداش زمان باقیمانده دارد."
      />
    </div>
  );
};
