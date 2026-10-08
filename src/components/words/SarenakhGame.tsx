import React, { useState, useEffect, useMemo } from 'react';
import { CLUE_QUESTIONS, ClueQuestion } from '../../data/wordBank';
import { sounds } from '../../services/sound';
import { recordGameResult } from '../../services/storage';
import { MysteryRoomSvg } from '../world/WorldLandmarkIllustrations';
import { GameRulesModal } from '../common/GameRulesModal';
import { ArrowLeft, HelpCircle, Sparkles, CheckCircle2, RotateCcw, AlertCircle, Clock } from 'lucide-react';

interface Props {
  onBack: () => void;
  isDaily?: boolean;
  onCompleteDaily?: (score: number) => void;
}

// Pool of Persian candidate words for generating distractors
const CANDIDATE_WORDS_POOL = [
  'باران', 'کتاب', 'ساعت', 'چای', 'نامه', 'برف', 'خورشید', 'دریا', 'آسمان',
  'پرواز', 'شطرنج', 'ستاره', 'گلدان', 'آینه', 'قاشق', 'پنجره', 'امید', 'زمستان',
  'چشمه', 'جنگل', 'کوهستان', 'فانوس', 'قطار', 'سفر', 'کوچه', 'نگاه', 'لبخند'
];

export const SarenakhGame: React.FC<Props> = ({ onBack, isDaily, onCompleteDaily }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [revealedCluesCount, setRevealedCluesCount] = useState(1);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [optionSeed, setOptionSeed] = useState(0); // Used to re-roll options

  const currentQ: ClueQuestion = CLUE_QUESTIONS[questionIndex];

  // Generate 5 options (1 correct answer + 4 random distractors)
  const currentOptions = useMemo(() => {
    const correct = currentQ.answer;
    const others = CANDIDATE_WORDS_POOL.filter((w) => w !== correct);
    // Shuffle others and pick 4
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 4);
    // Combine and shuffle 5 options
    return [correct, ...shuffledOthers].sort(() => 0.5 - Math.random());
  }, [currentQ.answer, optionSeed]);

  const calculatePointsForClues = (clueCount: number) => {
    if (clueCount === 1) return 100;
    if (clueCount === 2) return 60;
    return 30;
  };

  const handleRevealNextClue = () => {
    if (revealedCluesCount < 3) {
      sounds.playTap();
      setRevealedCluesCount((prev) => prev + 1);
      setErrorMsg(null);
    }
  };

  const handleSelectOption = (chosenWord: string) => {
    if (isAnswered) return;
    setAttempts((prev) => prev + 1);

    if (chosenWord === currentQ.answer) {
      sounds.playSuccess();
      const points = calculatePointsForClues(revealedCluesCount);
      setScore((prev) => prev + points);
      setIsAnswered(true);
      setErrorMsg(null);

      // Auto-advance after exactly 1 second (1000ms) without waiting for click!
      setTimeout(() => {
        handleNextQuestion(points);
      }, 1000);
    } else {
      sounds.playError();
      setErrorMsg(`«${chosenWord}» نادرست بود! گزینه‌ها تغییر کردند، دوباره انتخاب کنید.`);
      // Refresh options dynamically on wrong choice
      setOptionSeed((prev) => prev + 1);
    }
  };

  const handleNextQuestion = (addedPoints: number = 0) => {
    if (questionIndex + 1 < CLUE_QUESTIONS.length) {
      setQuestionIndex((prev) => prev + 1);
      setRevealedCluesCount(1);
      setIsAnswered(false);
      setErrorMsg(null);
      setOptionSeed((prev) => prev + 1);
    } else {
      sounds.playWin();
      setIsGameOver(true);
      recordGameResult('sarenakh', score + addedPoints, {
        verbalFluency: Math.min(95, 60 + Math.round((score + addedPoints) / 5)),
        processingSpeed: 75,
      });
      if (isDaily && onCompleteDaily) {
        onCompleteDaily(score + addedPoints);
      }
    }
  };

  const handleRestart = () => {
    sounds.playTap();
    setQuestionIndex(0);
    setRevealedCluesCount(1);
    setScore(0);
    setAttempts(0);
    setIsAnswered(false);
    setIsGameOver(false);
    setErrorMsg(null);
    setOptionSeed((prev) => prev + 1);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* Top Bar with Question Mark / Help Modal */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rotate-180" />
            <span>نقشه جهان</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-400">
            <MysteryRoomSvg className="w-5 h-5 inline-block" />
            <span>مکان: اتاق معمایی (سرنخ)</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="text-xs text-slate-400">
            <span>مرحله {questionIndex + 1} از {CLUE_QUESTIONS.length}</span>
          </div>
          {/* Rules Help Icon Button */}
          <button
            onClick={() => { sounds.playTap(); setIsRulesOpen(true); }}
            className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-amber-400 hover:text-amber-300 transition-colors shadow-sm"
            title="راهنمای بازی"
            aria-label="قوانین بازی"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Score HUD */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6">
        <div>
          <span className="text-xs text-slate-500 block">امتیاز کل</span>
          <span className="text-2xl font-bold text-amber-400 tabular-nums">{score}</span>
        </div>
        <div className="text-left">
          <span className="text-xs text-slate-500 block">ارزش پاسخ در این گام</span>
          <span className="text-lg font-semibold text-emerald-400 tabular-nums">
            +{calculatePointsForClues(revealedCluesCount)} امتیاز
          </span>
        </div>
      </div>

      {!isGameOver ? (
        <div className="space-y-6">
          {/* Clues Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs font-medium text-slate-400">سرنخ‌های مرحله‌ای</span>
              <span className="text-xs text-amber-400/90 font-medium">
                {revealedCluesCount === 1 ? 'سرنخ اول (حداکثر ۱۰۰ امتیاز)' : revealedCluesCount === 2 ? 'سرنخ دوم (۶۰ امتیاز)' : 'سرنخ سوم (۳۰ امتیاز)'}
              </span>
            </div>

            <div className="space-y-3">
              {currentQ.clues.map((clue, idx) => {
                const isRevealed = idx < revealedCluesCount;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      isRevealed
                        ? 'bg-slate-800/80 border-slate-700 text-slate-100'
                        : 'bg-slate-950/40 border-slate-900 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isRevealed ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-900 text-slate-600'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className="text-base font-medium">
                        {isRevealed ? clue : 'سرنخ قفل شده است'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next Clue Button */}
            {!isAnswered && revealedCluesCount < 3 && (
              <button
                onClick={handleRevealNextClue}
                className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span>نمایش سرنخ بعدی (کاهش ارزش به +{calculatePointsForClues(revealedCluesCount + 1)} امتیاز)</span>
              </button>
            )}
          </div>

          {/* 5 Dynamic Rapid Options (No manual typing, replaces options instantly!) */}
          {!isAnswered ? (
            <div className="space-y-3">
              <div className="text-center text-xs text-slate-400 font-medium">
                یک گزینه را انتخاب کنید (با هر کلیک ۵ گزینه جدید جایگزین می‌شوند):
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {currentOptions.map((opt, i) => (
                  <button
                    key={`${opt}-${i}-${optionSeed}`}
                    onClick={() => handleSelectOption(opt)}
                    className="py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-95 border border-slate-700/80 hover:border-amber-500 text-slate-100 font-bold text-base transition-all shadow-sm flex items-center justify-center"
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-rose-400 text-xs p-3 bg-rose-950/40 rounded-xl border border-rose-900/50">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          ) : (
            /* Correct answer celebration & 1-second auto-transition */
            <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-3xl p-6 text-center space-y-3 animate-scale-up">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-emerald-300">آفرین! پاسخ صحیح است</h4>
              <p className="text-slate-200 font-semibold text-lg">«{currentQ.answer}»</p>
              <p className="text-slate-400 text-xs">{currentQ.explanation}</p>
              <div className="text-xs text-amber-400 font-medium pt-2 animate-pulse">
                انتقال خودکار به مرحله بعد در ۱ ثانیه...
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Game completion */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-100">پایان معماهای سرنخ!</h3>
            <p className="text-slate-400 text-sm mt-1">
              مجموع امتیاز نهایی شما در این دور: {score}
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
              بازگشت به نقشه
            </button>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      <GameRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        title="سرنخ (کلمه ممنوع)"
        categoryName="واژه و معما"
        duration="۲ دقیقه"
        rules={[
          'یک کلمه پنهان وجود دارد و ۳ سرنخ تدریجی برای کشف آن نمایش داده می‌شود.',
          'به جای تایپ دستی، ۵ گزینه سریع نمایش داده می‌شود. با هر بار انتخاب (درست یا غلط)، ۵ گزینه جدید ظاهر می‌شوند.',
          'هرچه سریع‌تر و با سرنخ‌های کمتر پاسخ دهید، امتیاز بیشتری دریافت می‌کنید.',
          'با پاسخ صحیح، پس از ۱ ثانیه به طور خودکار به مرحله بعدی منتقل می‌شوید.',
        ]}
        scoringNote="حدس در سرنخ اول: +۱۰۰ امتیاز · سرنخ دوم: +۶۰ امتیاز · سرنخ سوم: +۳۰ امتیاز."
      />
    </div>
  );
};
