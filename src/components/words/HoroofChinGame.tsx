import React, { useState, useEffect, useMemo } from 'react';
import { ANAGRAM_SETS, AnagramSet } from '../../data/wordBank';
import { sounds } from '../../services/sound';
import { recordGameResult } from '../../services/storage';
import { speechCoach } from '../../services/speechCoach';
import { WordLibrarySvg } from '../world/WorldLandmarkIllustrations';
import { GameRulesModal } from '../common/GameRulesModal';
import { RotateCcw, Zap, Clock, Award, ArrowLeft, CheckCircle2, BookOpen, HelpCircle, Sparkles } from 'lucide-react';

interface Props {
  onBack: () => void;
  isDaily?: boolean;
  onCompleteDaily?: (score: number) => void;
}

// Global word pool to draw plausible distractors
const ALL_ANAGRAM_WORDS = ANAGRAM_SETS.flatMap((s) => s.validWords.map((v) => v.word));

export const HoroofChinGame: React.FC<Props> = ({ onBack, isDaily, onCompleteDaily }) => {
  const [mode, setMode] = useState<'blitz' | 'classic'>('blitz');
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<number[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [optionSeed, setOptionSeed] = useState(0); // Triggers re-generation of 5 options

  const currentSet: AnagramSet = ANAGRAM_SETS[currentSetIndex];

  // 5 rapid options: candidates from current set + distractors
  const currentOptions = useMemo(() => {
    const validRemaining = currentSet.validWords.filter((w) => !foundWords.includes(w.word));
    const allValidCandidates = validRemaining.length > 0 ? validRemaining : currentSet.validWords;
    const shuffledValid = [...allValidCandidates].sort(() => 0.5 - Math.random());

    // Distractors: words containing letters not in this set
    const distractors = ALL_ANAGRAM_WORDS.filter((w) => {
      return !currentSet.validWords.some((vw) => vw.word === w);
    }).sort(() => 0.5 - Math.random());

    const pickValid = Math.min(shuffledValid.length, 3);
    const pickDistractor = 5 - pickValid;

    const chosen = [
      ...shuffledValid.slice(0, pickValid).map((item) => item.word),
      ...distractors.slice(0, pickDistractor),
    ];

    return chosen.sort(() => 0.5 - Math.random());
  }, [currentSet, foundWords, optionSeed]);

  const handleSelectOption = (word: string) => {
    if (isGameOver) return;

    if (foundWords.includes(word)) {
      sounds.playError();
      setFeedback({ message: 'این کلمه را قبلاً ثبت کرده‌اید!', type: 'info' });
      // Always refresh 5 options!
      setOptionSeed((prev) => prev + 1);
      return;
    }

    const matched = currentSet.validWords.find((w) => w.word === word);
    if (matched) {
      const comboBonus = combo * 5;
      const totalWordScore = matched.score + comboBonus;
      setScore((prev) => prev + totalWordScore);
      setFoundWords((prev) => [...prev, word]);
      setCombo((prev) => prev + 1);

      if (combo >= 2) {
        sounds.playCombo();
        setFeedback({ message: `عالی! +${totalWordScore} امتیاز (ضریب شتاب ×${combo + 1})`, type: 'success' });
      } else {
        sounds.playSuccess();
        setFeedback({ message: `درست است! «${word}» (+${totalWordScore} امتیاز)`, type: 'success' });
      }
    } else {
      sounds.playError();
      setCombo(0);
      setFeedback({ message: `«${word}» با این حروف قابل ساخت نیست!`, type: 'error' });
    }

    // Every single click (correct or wrong), refresh all 5 options!
    setOptionSeed((prev) => prev + 1);
  };

  // Timer for blitz mode
  useEffect(() => {
    if (mode === 'classic' || isGameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleEndGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mode, isGameOver, score]);

  const handleEndGame = () => {
    setIsGameOver(true);
    sounds.playWin();
    speechCoach.speakContext('level_complete', 'تبریک! گنجینه لغات و روانی کلامی ذهن تو رکورد ارزنده‌ای ثبت کرد.');
    recordGameResult('horoofchin', score, {
      verbalFluency: Math.min(95, 50 + foundWords.length * 6),
      processingSpeed: Math.min(95, 50 + Math.round(score / 5)),
    });
    if (isDaily && onCompleteDaily) {
      onCompleteDaily(score);
    }
  };

  const handleLetterClick = (index: number) => {
    sounds.playTap();
    if (selectedLetters.includes(index)) {
      setSelectedLetters(selectedLetters.filter((i) => i !== index));
    } else {
      setSelectedLetters([...selectedLetters, index]);
    }
  };

  const currentConstructedWord = selectedLetters
    .map((idx) => currentSet.letters[idx])
    .join('');

  const handleClear = () => {
    sounds.playTap();
    setSelectedLetters([]);
    setFeedback(null);
  };

  const handleSubmit = () => {
    if (!currentConstructedWord) return;

    if (foundWords.includes(currentConstructedWord)) {
      sounds.playError();
      setFeedback({ message: 'این کلمه را قبلاً ثبت کرده‌اید!', type: 'info' });
      setSelectedLetters([]);
      return;
    }

    const matched = currentSet.validWords.find((w) => w.word === currentConstructedWord);
    if (matched) {
      const comboBonus = combo * 5;
      const totalWordScore = matched.score + comboBonus;
      setScore((prev) => prev + totalWordScore);
      setFoundWords((prev) => [...prev, currentConstructedWord]);
      setCombo((prev) => prev + 1);

      if (combo >= 2) {
        sounds.playCombo();
        setFeedback({ message: `عالی! +${totalWordScore} امتیاز (ضریب شتاب ×${combo + 1})`, type: 'success' });
      } else {
        sounds.playSuccess();
        setFeedback({ message: `درست است! +${totalWordScore} امتیاز`, type: 'success' });
      }
    } else {
      sounds.playError();
      setCombo(0);
      setFeedback({ message: 'کلمه در فهرست واژگان معتبر این مرحله یافت نشد', type: 'error' });
    }

    setSelectedLetters([]);
  };

  const handleNextSet = () => {
    sounds.playTap();
    const nextIdx = (currentSetIndex + 1) % ANAGRAM_SETS.length;
    setCurrentSetIndex(nextIdx);
    setSelectedLetters([]);
    setFoundWords([]);
    setFeedback(null);
  };

  const handleRestart = () => {
    sounds.playTap();
    setCurrentSetIndex(0);
    setSelectedLetters([]);
    setFoundWords([]);
    setScore(0);
    setCombo(0);
    setTimeLeft(60);
    setIsGameOver(false);
    setFeedback(null);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      {/* Top Controls */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rotate-180" />
            <span>نقشه جهان</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
            <WordLibrarySvg className="w-5 h-5 inline-block" />
            <span>مکان: کتابخانه کلمات</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setMode('blitz'); handleRestart(); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              mode === 'blitz' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            برق‌آسا (۶۰ ثانیه)
          </button>
          <button
            onClick={() => { setMode('classic'); handleRestart(); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              mode === 'classic' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            آرام و کلاسیک
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

      {/* Game HUD */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-xs text-slate-500 block mb-0.5">امتیاز</span>
            <span className="text-2xl font-bold text-amber-400 tabular-nums">{score}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block mb-0.5">زنجیره (Combo)</span>
            <span className="text-lg font-semibold text-emerald-400 tabular-nums">×{combo}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block mb-0.5">کلمات کشف شده</span>
            <span className="text-lg font-semibold text-slate-200 tabular-nums">{foundWords.length}</span>
          </div>
        </div>

        {mode === 'blitz' && (
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl">
            <Clock className={`w-4 h-4 ${timeLeft < 15 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
            <span className={`text-xl font-bold tabular-nums ${timeLeft < 15 ? 'text-red-400' : 'text-slate-100'}`}>
              {timeLeft} ثانیه
            </span>
          </div>
        )}
      </div>

      {!isGameOver ? (
        <div className="space-y-6">
          {/* Constructed word display */}
          <div className="min-h-20 bg-slate-900/50 border border-slate-800/80 rounded-2xl flex items-center justify-center p-4">
            {currentConstructedWord ? (
              <span className="text-3xl font-extrabold tracking-widest text-amber-300">
                {currentConstructedWord}
              </span>
            ) : (
              <span className="text-sm text-slate-500">برای ساخت کلمه، روی حروف زیر کلیک کنید</span>
            )}
          </div>

          {/* Feedback message */}
          {feedback && (
            <div
              className={`text-center text-sm py-2 px-4 rounded-xl transition-all ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                  : feedback.type === 'error'
                  ? 'bg-rose-950/60 text-rose-300 border border-rose-800/50'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {feedback.message}
            </div>
          )}

          {/* Rapid 5-Option Grid (Refreshes all 5 on every click!) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>گزینه‌های سریع ۵ تایی (با هر انتخاب، هر ۵ تا عوض می‌شوند)</span>
              </span>
              <span className="text-[11px] text-slate-500">یا با حروف بالا دستی کلمه بسازید</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {currentOptions.map((optWord, optIdx) => (
                <button
                  key={`${optWord}-${optIdx}`}
                  onClick={() => handleSelectOption(optWord)}
                  className="py-3 px-2 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-slate-100 hover:text-amber-300 font-bold text-base shadow-sm transition-all active:scale-95"
                >
                  {optWord}
                </button>
              ))}
            </div>
          </div>

          {/* Letter Tiles (Manual builder) */}
          <div className="flex flex-wrap items-center justify-center gap-3 py-2">
            {currentSet.letters.map((letter, index) => {
              const isSelected = selectedLetters.includes(index);
              return (
                <button
                  key={index}
                  onClick={() => handleLetterClick(index)}
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl text-xl md:text-2xl font-bold flex items-center justify-center shadow-md transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-400/40 translate-y-1'
                      : 'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleClear}
              disabled={selectedLetters.length === 0}
              className="px-5 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent text-sm font-medium transition-colors"
            >
              پاک کردن
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedLetters.length === 0}
              className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 disabled:opacity-40 transition-all active:scale-95"
            >
              ثبت کلمه
            </button>
            {mode === 'classic' && (
              <button
                onClick={handleNextSet}
                className="px-5 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
              >
                حروف بعدی
              </button>
            )}
          </div>

          {/* Found Words List */}
          {foundWords.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <span className="text-xs text-slate-400 block mb-3">کلمات پیدا شده در این دور:</span>
              <div className="flex flex-wrap gap-2">
                {foundWords.map((word, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Game Over Summary */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-100 mb-2">زمان تمام شد!</h3>
            <p className="text-slate-400 text-sm">
              توانستید {foundWords.length} کلمه بسازید و به امتیاز {score} برسید.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-right bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs text-slate-500 block">امتیاز کسب شده</span>
              <span className="text-xl font-bold text-amber-400">{score}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">بیشترین زنجیره</span>
              <span className="text-xl font-bold text-emerald-400">×{combo}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
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
              بازگشت به خانه
            </button>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      <GameRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        title="حروف‌چین (حروف‌باز)"
        categoryName="واژه و زبان"
        duration="۶۰ ثانیه"
        rules={[
          'چند حرف فارسی به شما داده می‌شود تا کلمات بامعنی بسازید.',
          'روی حروف کلیک کنید تا کلمه تشکیل شود، سپس دکمه «ثبت کلمه» را بزنید.',
          'پاسخ‌های متوالی درست ضریب شتاب (Combo) را بالا می‌برند.',
          'در حالت برق‌آسا ۶۰ ثانیه فرصت دارید حداکثر کلمات ممکن را بسازید.',
        ]}
        scoringNote="کلمات کوتاه: امتیاز پایه · کلمات بلندتر: امتیاز بیشتر · زنجیره متوالی: پاداش ضریب شتاب."
      />
    </div>
  );
};
