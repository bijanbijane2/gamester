import React, { useState } from 'react';
import { OPTICAL_ILLUSIONS, OpticalIllusionItem } from '../../data/cognitiveData';
import { sounds } from '../../services/sound';
import { recordGameResult } from '../../services/storage';
import { GameRulesModal } from '../common/GameRulesModal';
import { ArrowLeft, Eye, EyeOff, RotateCcw, Lightbulb, CheckCircle2, HelpCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
  isDaily?: boolean;
  onCompleteDaily?: (score: number) => void;
}

export const IllusionGame: React.FC<Props> = ({ onBack, isDaily, onCompleteDaily }) => {
  const [index, setIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [completedAll, setCompletedAll] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const illusion: OpticalIllusionItem = OPTICAL_ILLUSIONS[index];

  const handleToggleReveal = () => {
    sounds.playTap();
    if (!isRevealed) {
      sounds.playSuccess();
      setScore((prev) => prev + 50);
      setIsRevealed(true);
    } else {
      setIsRevealed(false);
    }
  };

  const handleNext = () => {
    sounds.playTap();
    if (index + 1 < OPTICAL_ILLUSIONS.length) {
      setIndex((prev) => prev + 1);
      setIsRevealed(false);
    } else {
      sounds.playWin();
      setCompletedAll(true);
      recordGameResult('illusions', score + 50, {
        cognitiveFlexibility: 80,
      });
      if (isDaily && onCompleteDaily) {
        onCompleteDaily(score + 50);
      }
    }
  };

  const handleRestart = () => {
    sounds.playTap();
    setIndex(0);
    setIsRevealed(false);
    setScore(0);
    setCompletedAll(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
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
            خطای دید {index + 1} از {OPTICAL_ILLUSIONS.length}
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
        title="گالری خطای دید (Optical Illusions)"
        categoryName="ادراک و بینایی"
        duration="۲ دقیقه"
        rules={[
          'تصاویر مشهور خطای دید مغز مانند مولر-لایر، پونزو و کنتراست همزمان نمایش داده می‌شوند.',
          'حدس اولیه خود را درباره ابعاد، هم‌اندازه بودن یا رنگ عناصر بزنید.',
          'با زدن دکمه «بررسی واقعیت»، خطوط اندازه‌گیری دقیق و حقایق علمی آشکار می‌شوند.',
        ]}
        scoringNote="۵۰ امتیاز به ازای هر کشف علمی خطای ادراکی"
      />

      {!completedAll ? (
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-bold text-slate-100">{illusion.title}</h3>
            <p className="text-xs text-slate-400">{illusion.description}</p>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="min-h-72 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {illusion.id === 'muller_lyer' && (
              <div className="space-y-12 py-4 w-full flex flex-col items-center">
                {/* Line 1 with outward arrows */}
                <div className="relative flex items-center justify-center">
                  <div className="w-60 h-1.5 bg-amber-400 relative">
                    {/* Left arrow < */}
                    <div className="absolute -left-3 -top-3 w-4 h-4 border-l-2 border-t-2 border-amber-400 -rotate-45" />
                    <div className="absolute -left-3 -bottom-3 w-4 h-4 border-l-2 border-b-2 border-amber-400 rotate-45" />
                    {/* Right arrow > */}
                    <div className="absolute -right-3 -top-3 w-4 h-4 border-r-2 border-t-2 border-amber-400 rotate-45" />
                    <div className="absolute -right-3 -bottom-3 w-4 h-4 border-r-2 border-b-2 border-amber-400 -rotate-45" />
                  </div>
                  {isRevealed && (
                    <div className="absolute -top-6 text-xs text-emerald-400 font-mono">طول: 240px</div>
                  )}
                </div>

                {/* Line 2 with inward arrows */}
                <div className="relative flex items-center justify-center">
                  <div className="w-60 h-1.5 bg-amber-400 relative">
                    {/* Left arrow > */}
                    <div className="absolute left-0 -top-3 w-4 h-4 border-r-2 border-t-2 border-amber-400 rotate-45" />
                    <div className="absolute left-0 -bottom-3 w-4 h-4 border-r-2 border-b-2 border-amber-400 -rotate-45" />
                    {/* Right arrow < */}
                    <div className="absolute right-0 -top-3 w-4 h-4 border-l-2 border-t-2 border-amber-400 -rotate-45" />
                    <div className="absolute right-0 -bottom-3 w-4 h-4 border-l-2 border-b-2 border-amber-400 rotate-45" />
                  </div>
                  {isRevealed && (
                    <div className="absolute -top-6 text-xs text-emerald-400 font-mono">طول: 240px</div>
                  )}
                </div>

                {/* Guide lines when revealed */}
                {isRevealed && (
                  <div className="absolute inset-y-0 w-60 border-l border-r border-dashed border-emerald-500/70 pointer-events-none" />
                )}
              </div>
            )}

            {illusion.id === 'simultaneous_contrast' && (
              <div className="flex items-center gap-6 py-6">
                {/* Dark background panel */}
                <div className="w-36 h-36 bg-black rounded-2xl flex items-center justify-center border border-slate-800">
                  <div className="w-12 h-12 bg-zinc-500 rounded-lg shadow-sm" />
                </div>

                {/* Light background panel */}
                <div className="w-36 h-36 bg-white rounded-2xl flex items-center justify-center border border-slate-300">
                  <div className="w-12 h-12 bg-zinc-500 rounded-lg shadow-sm" />
                </div>

                {isRevealed && (
                  <div className="absolute bottom-3 text-xs text-emerald-400 font-mono">
                    کد رنگ هر دو مربع خاکستری: #71717a
                  </div>
                )}
              </div>
            )}

            {illusion.id === 'ponzo_illusion' && (
              <div className="relative w-64 h-56 flex flex-col items-center justify-between py-6">
                {/* Converging railway lines */}
                <svg className="absolute inset-0 w-full h-full stroke-slate-700" viewBox="0 0 250 200">
                  <line x1="20" y1="190" x2="105" y2="10" strokeWidth="3" />
                  <line x1="230" y1="190" x2="145" y2="10" strokeWidth="3" />
                  {/* Railroad ties */}
                  <line x1="45" y1="160" x2="205" y2="160" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="70" y1="120" x2="180" y2="120" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="90" y1="80" x2="160" y2="80" strokeWidth="1" strokeDasharray="3 3" />
                </svg>

                {/* Top bar (looks longer) */}
                <div className="relative z-10 w-28 h-2 bg-amber-400 rounded-full" />
                {/* Bottom bar (looks shorter) */}
                <div className="relative z-10 w-28 h-2 bg-amber-400 rounded-full" />

                {isRevealed && (
                  <div className="absolute inset-y-0 w-28 border-l border-r border-dashed border-emerald-500/80 pointer-events-none" />
                )}
              </div>
            )}
          </div>

          {/* Reveal & Explain Button */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleToggleReveal}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
                isRevealed
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{isRevealed ? 'پنهان کردن خطوط راهنما' : 'نمایش واقعیت خطای دید'}</span>
            </button>

            {isRevealed && (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all"
              >
                {index + 1 < OPTICAL_ILLUSIONS.length ? 'خطای بعدی' : 'مشاهده جمع‌بندی'}
              </button>
            )}
          </div>

          {/* Psychological insight note */}
          {isRevealed && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <Lightbulb className="w-4 h-4" />
                <span>تحلیل عصب‌شناختی ادراک:</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {illusion.explanation}
              </p>
              <p className="text-xs text-amber-300 font-medium pt-1">
                {illusion.revealText}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Finished */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-100">پایان گالری خطاهای ادراکی</h3>
            <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto leading-relaxed">
              آنچه می‌بینیم بازنمایی محض واقعیت نیست؛ بلکه پیش‌بینی فعال و پردازش پس‌زمینه در قشر بینایی مغز است.
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>مشاهده دوباره</span>
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
