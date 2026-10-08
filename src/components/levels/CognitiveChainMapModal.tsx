import React from 'react';
import {
  COGNITIVE_DEPENDENCIES,
  GAME_TITLES,
  getHighestCompletedLevel,
} from '../../services/levelProgression';
import { GameId } from '../../types/game';
import { sounds } from '../../services/sound';
import { X, ArrowRight, Brain, Sparkles, CheckCircle2, Lock, Zap } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectGame: (gameId: GameId) => void;
}

export const CognitiveChainMapModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectGame,
}) => {
  if (!isOpen) return null;

  const toPersianNum = (n: number | string): string => {
    const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return n.toString().replace(/\d/g, (d) => pDigits[parseInt(d, 10)]);
  };

  const gameIds = Object.keys(COGNITIVE_DEPENDENCIES) as GameId[];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cognitive-chain-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in text-right"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 id="cognitive-chain-title" className="text-xl font-black text-slate-100 flex items-center gap-2">
                <span>زنجیره روانشناختی ارتباط بازی‌ها</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-normal">
                  شبکه پیش‌نیازهای ذهنی
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                هر بازی با منطق عصب‌شناختی به بازی دیگری متصل است؛ ارتقا در یک مهارت، قفل مراحل بالاتر مهارت بعدی را باز می‌کند.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="px-6 py-3.5 bg-indigo-950/30 border-b border-indigo-900/40 text-xs text-indigo-200 flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>قانون مراحل ۱ تا ۳:</strong> سه مرحله اول تمام بازی‌ها همیشه باز است. از مرحله ۴ به بعد، برای باز شدن هر مرحله، باید بازی متصل در زنجیره را ۲ تا ۳ مرحله بالا ببرید!
          </span>
        </div>

        {/* Chain Items List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gameIds.map((targetId) => {
              const dep = COGNITIVE_DEPENDENCIES[targetId];
              const targetTitle = GAME_TITLES[targetId];
              const reqTitle = GAME_TITLES[dep.requiredGame];
              const targetLevel = getHighestCompletedLevel(targetId);
              const reqLevel = getHighestCompletedLevel(dep.requiredGame);

              return (
                <div
                  key={targetId}
                  className="bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-4.5 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Node Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-slate-100 text-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                        <span>{targetTitle}</span>
                        <span className="text-[11px] font-normal text-slate-400">
                          (سطح فعلی: {toPersianNum(targetLevel || 1)})
                        </span>
                      </div>

                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 border border-slate-700 font-medium">
                        {dep.cognitiveSkill}
                      </span>
                    </div>

                    {/* Connection Link */}
                    <div className="flex items-center gap-2 text-xs bg-slate-900/90 rounded-xl p-2.5 border border-slate-800/80">
                      <span className="text-slate-400 text-[11px] shrink-0">وابسته به:</span>
                      <button
                        onClick={() => {
                          sounds.playTap();
                          onClose();
                          onSelectGame(dep.requiredGame);
                        }}
                        className="text-amber-400 hover:text-amber-300 font-bold hover:underline flex items-center gap-1 transition-colors"
                      >
                        <span>{reqTitle}</span>
                        <span className="text-slate-400 font-normal">
                          (سطح {toPersianNum(reqLevel || 1)})
                        </span>
                      </button>
                    </div>

                    {/* Psychological Rationale */}
                    <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/50">
                      💡 <strong>تحلیل شناختی:</strong> {dep.rationale}
                    </p>
                  </div>

                  {/* Play Action */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        sounds.playTap();
                        onClose();
                        onSelectGame(targetId);
                      }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>ورود به بازی</span>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playTap();
                        onClose();
                        onSelectGame(dep.requiredGame);
                      }}
                      className="text-xs text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1"
                    >
                      <span>تقویت پیش‌نیاز ({reqTitle})</span>
                      <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
