import React, { useState } from 'react';
import { ODD_WORD_QUESTIONS, OddWordQuestion } from '../../data/wordBank';
import { sounds } from '../../services/sound';
import { recordGameResult } from '../../services/storage';
import { LogicRoomSvg } from '../world/WorldLandmarkIllustrations';
import { GameRulesModal } from '../common/GameRulesModal';
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Lightbulb, Award, HelpCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
  isDaily?: boolean;
  onCompleteDaily?: (score: number) => void;
}

export const KalamehEzafiGame: React.FC<Props> = ({ onBack, isDaily, onCompleteDaily }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const currentQ: OddWordQuestion = ODD_WORD_QUESTIONS[currentIndex];

  const handleSelectWord = (index: number) => {
    if (isAnswered) return;
    sounds.playTap();
    setSelectedIndex(index);
    setIsAnswered(true);

    let points = 0;
    if (index === currentQ.oddIndex) {
      sounds.playSuccess();
      points = currentQ.level === 'easy' ? 40 : currentQ.level === 'medium' ? 60 : currentQ.level === 'hard' ? 80 : 100;
      setScore((prev) => prev + points);
    } else {
      sounds.playError();
    }

    // Auto-advance to next question exactly after 1 second without waiting for user click!
    setTimeout(() => {
      advanceNext(score + points);
    }, 1000);
  };

  const advanceNext = (currentTotalScore: number) => {
    if (currentIndex + 1 < ODD_WORD_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIndex(null);
      setIsAnswered(false);
    } else {
      sounds.playWin();
      setIsGameOver(true);
      recordGameResult('kalameh_ezafi', currentTotalScore, {
        verbalFluency: Math.min(95, 60 + Math.round(currentTotalScore / 5)),
        cognitiveFlexibility: 75,
      });
      if (isDaily && onCompleteDaily) {
        onCompleteDaily(currentTotalScore);
      }
    }
  };

  const handleRestart = () => {
    sounds.playTap();
    setCurrentIndex(0);
    setSelectedIndex(null);
    setIsAnswered(false);
    setScore(0);
    setIsGameOver(false);
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
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-400">
            <LogicRoomSvg className="w-5 h-5 inline-block" />
            <span>مکان: اتاق منطق و نظم</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>سؤال {currentIndex + 1} از {ODD_WORD_QUESTIONS.length}</span>
            <span aria-hidden="true">·</span>
            <span>{currentQ.levelLabel}</span>
          </div>
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
        <div>
          <span className="text-xs text-slate-500 block">امتیاز کل</span>
          <span className="text-2xl font-bold text-amber-400 tabular-nums">{score}</span>
        </div>
        <div className="text-left">
          <span className="text-xs text-slate-500 block">هدف چالش</span>
          <span className="text-sm font-medium text-slate-300">کشف رابطه پنهان و یافتن کلمه ناسازگار</span>
        </div>
      </div>

      {!isGameOver ? (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-slate-100">کدام کلمه با بقیه تفاوت ریشه‌ای دارد؟</h3>
            <p className="text-xs text-slate-400">
              روی کلمه‌ای که ارتباط منطقی کمتری با سایرین دارد کلیک کنید.
            </p>
          </div>

          {/* Words Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {currentQ.words.map((word, idx) => {
              const isCorrectTarget = idx === currentQ.oddIndex;
              const isUserPicked = selectedIndex === idx;

              let btnStyle = 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-100';

              if (isAnswered) {
                if (isCorrectTarget) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30';
                } else if (isUserPicked && !isCorrectTarget) {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/30';
                } else {
                  btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectWord(idx)}
                  disabled={isAnswered}
                  className={`p-5 rounded-2xl border text-lg md:text-xl font-bold transition-all flex items-center justify-between shadow-sm active:scale-95 ${btnStyle}`}
                >
                  <span>{word}</span>
                  {isAnswered && (
                    <span>
                      {isCorrectTarget && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                      {isUserPicked && !isCorrectTarget && <XCircle className="w-5 h-5 text-rose-400" />}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 1-Second Auto Advance Alert */}
          {isAnswered && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2 animate-fade-in text-center">
              <div className="flex items-center justify-center gap-2 text-amber-400 text-xs font-semibold">
                <Lightbulb className="w-4 h-4" />
                <span>تحلیل منطقی: {currentQ.rationale}</span>
              </div>
              <div className="text-xs text-emerald-400 font-bold pt-1 animate-pulse">
                انتقال خودکار به سؤال بعدی در ۱ ثانیه...
              </div>
            </div>
          )}
        </div>
      ) : (
        /* End Screen */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-100">پایان آزمون کلمه اضافی!</h3>
            <p className="text-slate-400 text-sm mt-1">
              مجموع امتیاز کسب شده: {score}
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>آزمون مجدد</span>
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
        title="کلمه اضافی"
        categoryName="استدلال زبانی و منطق"
        duration="۱ دقیقه"
        rules={[
          'چهار یا پنج کلمه به شما نمایش داده می‌شود که بین اکثر آن‌ها رابطه منطقی پنهانی وجود دارد.',
          'باید کلمه‌ای را که با بقیه تفاوت ریشه‌ای دارد شناسایی کنید.',
          'بلافاصله پس از انتخاب، درستی یا نادرستی پاسخ مشخص شده و پس از ۱ ثانیه خودبه‌خود به مرحله بعد می‌روید.',
        ]}
        scoringNote="سؤالات آسان: +۴۰ امتیاز · متوسط: +۶۰ امتیاز · سخت: +۸۰ امتیاز · انتزاعی: +۱۰۰ امتیاز."
      />
    </div>
  );
};
