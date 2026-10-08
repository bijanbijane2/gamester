import React, { useState, useEffect, useMemo } from 'react';
import { sounds } from '../../services/sound';
import { recordGameResult } from '../../services/storage';
import { ChainStationSvg } from '../world/WorldLandmarkIllustrations';
import { GameRulesModal } from '../common/GameRulesModal';
import { ArrowLeft, Clock, Zap, RotateCcw, Award, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
  isDaily?: boolean;
  onCompleteDaily?: (score: number) => void;
}

const INITIAL_WORDS = ['کتاب', 'پرواز', 'آسمان', 'دانش', 'امید', 'خورشید', 'سفره'];

// Rich dictionary categorized by starting letters to provide valid continuations and distractors
const WORD_DICTIONARY: Record<string, string[]> = {
  'ب': ['باغ', 'باران', 'بهار', 'بلبل', 'برگ', 'بوسه', 'بید', 'بازی', 'بال', 'باد'],
  'ا': ['آدم', 'انار', 'امید', 'ابر', 'انگور', 'آب', 'آتش', 'ایران', 'آهو', 'ادب'],
  'آ': ['آدم', 'آسمان', 'آینه', 'آهو', 'آرام', 'آشنا', 'آفتاب', 'آهنگ', 'آبی'],
  'م': ['ماه', 'مادر', 'مرغ', 'میوه', 'میز', 'موج', 'مهر', 'مرد', 'ماست', 'مشق'],
  'ز': ['زمین', 'زندگی', 'زمستان', 'زنبور', 'زنگ', 'زرشک', 'زرد', 'زلف', 'زیبا'],
  'ش': ['شب', 'شعر', 'شمع', 'شیر', 'شادی', 'شکوفه', 'شمال', 'شانه', 'شور'],
  'ه': ['هوا', 'هستی', 'هلو', 'هدهد', 'هنر', 'هوش', 'همراه', 'هفته', 'هفت'],
  'د': ['درخت', 'دریا', 'دست', 'دوست', 'دفتر', 'دیوار', 'دشت', 'دل', 'دانا'],
  'ن': ['نان', 'نور', 'نگاه', 'نامه', 'نسیم', 'نغمه', 'نیلوفر', 'نرم', 'نیک'],
  'ر': ['روز', 'رود', 'رنگ', 'راز', 'روشن', 'رویا', 'رهبر', 'راه', 'ریشه'],
  'غ': ['غذا', 'غروب', 'غزال', 'غم', 'غنچه', 'غار', 'غواص'],
  'ت': ['تیر', 'توپ', 'تاب', 'توت', 'تصویر', 'ترانه', 'تند', 'تبسم'],
  'س': ['سیب', 'سنگ', 'ساعت', 'ستاره', 'سفره', 'سبز', 'سلام', 'سرود'],
  'گ': ['گل', 'گندم', 'گیاه', 'گردو', 'گربه', 'گوش', 'گام', 'گرم'],
  'ک': ['کتاب', 'کوچه', 'کوه', 'کار', 'کفش', 'کاغذ', 'کبوتر', 'کلید'],
};

// General fallback pool
const ALL_WORDS_POOL = Object.values(WORD_DICTIONARY).flat();

export const ZanjirehGame: React.FC<Props> = ({ onBack, isDaily, onCompleteDaily }) => {
  const [mode, setMode] = useState<'blitz' | 'relaxed'>('blitz');
  const [chain, setChain] = useState<string[]>([INITIAL_WORDS[0]]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isGameOver, setIsGameOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [seed, setSeed] = useState(0); // Triggers re-generation of 5 options

  const lastWord = chain[chain.length - 1];
  const rawLastChar = lastWord.charAt(lastWord.length - 1);
  const requiredFirstLetter = rawLastChar === 'آ' ? 'ا' : rawLastChar;

  // Generate 5 quick options (2-3 matching candidates + 2-3 distractors)
  const currentOptions = useMemo(() => {
    // Matching candidates for required letter
    const validMatches = (WORD_DICTIONARY[requiredFirstLetter] || [])
      .filter((w) => !chain.includes(w));
    
    // Distractors (words starting with different letters)
    const distractors = ALL_WORDS_POOL.filter((w) => {
      const first = w.charAt(0);
      return first !== requiredFirstLetter && (requiredFirstLetter !== 'ا' || first !== 'آ');
    });

    const shuffledMatches = [...validMatches].sort(() => 0.5 - Math.random());
    const shuffledDistractors = [...distractors].sort(() => 0.5 - Math.random());

    // Pick 2-3 valid matches and 2-3 distractors, total 5
    const pickCountValid = Math.min(shuffledMatches.length, 3);
    const pickCountDistractor = 5 - pickCountValid;

    const chosen = [
      ...shuffledMatches.slice(0, pickCountValid),
      ...shuffledDistractors.slice(0, pickCountDistractor),
    ];

    // Shuffle 5 options
    return chosen.sort(() => 0.5 - Math.random());
  }, [requiredFirstLetter, chain, seed]);

  useEffect(() => {
    if (mode === 'relaxed' || isGameOver) return;
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
  }, [mode, isGameOver, chain.length]);

  const handleGameOver = () => {
    setIsGameOver(true);
    sounds.playWin();
    recordGameResult('zanjireh', score, {
      verbalFluency: Math.min(95, 55 + chain.length * 4),
      processingSpeed: Math.min(95, 50 + combo * 6),
    });
    if (isDaily && onCompleteDaily) {
      onCompleteDaily(score);
    }
  };

  const handleSelectWord = (word: string) => {
    if (isGameOver) return;

    const firstChar = word.charAt(0);
    const normalize = (c: string) => (c === 'آ' || c === 'ا' ? 'ا' : c);
    const isValid = normalize(firstChar) === normalize(requiredFirstLetter) && !chain.includes(word);

    if (isValid) {
      const basePts = word.length * 10;
      const comboPts = combo * 5;
      const totalPts = basePts + comboPts;

      setScore((prev) => prev + totalPts);
      setCombo((prev) => prev + 1);
      setChain((prev) => [...prev, word]);
      setErrorMsg(null);

      if (combo >= 2) {
        sounds.playCombo();
      } else {
        sounds.playSuccess();
      }

      if (mode === 'blitz') {
        setTimeLeft((prev) => Math.min(60, prev + 2));
      }
    } else {
      sounds.playError();
      setCombo(0);
      setErrorMsg(`«${word}» با حرف «${requiredFirstLetter}» شروع نمی‌شود!`);
    }

    // Every time an option is clicked (correct or wrong), regenerate all 5 options immediately!
    setSeed((prev) => prev + 1);
  };

  const handleRestart = () => {
    sounds.playTap();
    const randStart = INITIAL_WORDS[Math.floor(Math.random() * INITIAL_WORDS.length)];
    setChain([randStart]);
    setScore(0);
    setCombo(0);
    setTimeLeft(45);
    setIsGameOver(false);
    setErrorMsg(null);
    setSeed((prev) => prev + 1);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
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
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
            <ChainStationSvg className="w-5 h-5 inline-block" />
            <span>مکان: ایستگاه پیوند کلمات</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setMode('blitz'); handleRestart(); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              mode === 'blitz' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 bg-slate-900'
            }`}
          >
            برق‌آسا
          </button>
          <button
            onClick={() => { setMode('relaxed'); handleRestart(); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              mode === 'relaxed' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 bg-slate-900'
            }`}
          >
            آرام
          </button>

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
            <span className="text-xs text-slate-500 block">امتیاز کل</span>
            <span className="text-2xl font-bold text-amber-400 tabular-nums">{score}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">طول زنجیره</span>
            <span className="text-xl font-bold text-slate-200 tabular-nums">{chain.length}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">پیوستگی (Combo)</span>
            <span className="text-lg font-bold text-emerald-400 tabular-nums">×{combo}</span>
          </div>
        </div>

        {mode === 'blitz' && (
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-xl">
            <Clock className={`w-4 h-4 ${timeLeft < 10 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
            <span className={`text-lg font-bold tabular-nums ${timeLeft < 10 ? 'text-red-400' : 'text-slate-200'}`}>
              {timeLeft} ثانیه
            </span>
          </div>
        )}
      </div>

      {!isGameOver ? (
        <div className="space-y-6">
          {/* Target Word & Required Letter */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-center space-y-3">
            <span className="text-xs font-medium text-slate-400 block">کلمه قبلی زنجیره:</span>
            <div className="inline-flex items-center gap-1 text-3xl md:text-4xl font-extrabold text-slate-100 px-6 py-2 bg-slate-950 rounded-2xl border border-slate-800">
              <span>{lastWord.slice(0, -1)}</span>
              <span className="text-amber-400 underline decoration-amber-500 decoration-4 underline-offset-8">
                {rawLastChar}
              </span>
            </div>
            <p className="text-xs text-slate-400 pt-1">
              کلمه بعدی باید با حرف <span className="text-amber-400 font-bold">«{requiredFirstLetter}»</span> شروع شود.
            </p>
          </div>

          {/* 5 Dynamic Rapid Options - Changes every click! */}
          <div className="space-y-3">
            <div className="text-center text-xs text-slate-400 font-medium">
              از بین ۵ گزینه سریع انتخاب کنید (با هر کلیک ۵ گزینه جدید جایگزین می‌شوند):
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {currentOptions.map((optWord, idx) => (
                <button
                  key={`${optWord}-${idx}-${seed}`}
                  onClick={() => handleSelectWord(optWord)}
                  className="py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-95 border border-slate-700/80 hover:border-emerald-500 text-slate-100 font-bold text-base transition-all shadow-sm flex items-center justify-center"
                >
                  {optWord}
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

          {/* Chain Stream */}
          <div className="mt-8 pt-4 border-t border-slate-800/80">
            <span className="text-xs text-slate-500 block mb-3">مسیر زنجیره شما:</span>
            <div className="flex flex-wrap items-center gap-2">
              {chain.map((word, idx) => (
                <React.Fragment key={idx}>
                  <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-sm font-medium text-slate-300">
                    {word}
                  </span>
                  {idx < chain.length - 1 && (
                    <span className="text-slate-600 text-xs">←</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Game Over */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-100">پایان زنجیره کلمات!</h3>
            <p className="text-slate-400 text-sm mt-1">
              طول زنجیره موفق شما: {chain.length} کلمه · امتیاز: {score}
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
        title="زنجیره کلمات"
        categoryName="واژه و سرعت"
        duration="۴۵ ثانیه"
        rules={[
          'حرف پایانی کلمه قبلی، باید حرف آغازین کلمه انتخابی بعدی شما باشد.',
          'به جای نوشتن، ۵ گزینه پرسرعت ظاهر می‌شوند که با هر بار انتخاب (درست یا نادرست)، هر ۵ گزینه سریعاً عوض می‌شوند.',
          'پاسخ‌های صحیح پی‌درپی زنجیره Combo را افزایش داده و در حالت برق‌آسا به زمان شما اضافه می‌کنند.',
          'کلمات تکراری در زنجیره پذیرفته نمی‌شوند.',
        ]}
        scoringNote="کلمات طولانی‌تر و زنجیره‌های متوالی امتیاز بالاتری دارند."
      />
    </div>
  );
};
