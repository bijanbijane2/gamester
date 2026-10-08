import React from 'react';
import { GameId } from '../../types/game';
import { GAME_TITLES, checkLevelLockStatus } from '../../services/levelProgression';
import { sounds } from '../../services/sound';
import { Star, Trophy, ArrowRight, RotateCcw, Brain, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  gameId: GameId;
  level: number;
  score: number;
  targetScore: number;
  stars: number;
  unlockedPartnerGames?: { gameId: GameId; gameTitle: string; unlockedLevel: number }[];
  onNextLevel: () => void;
  onOpenLevelSelect: () => void;
  onRestartLevel: () => void;
  onBackToMenu: () => void;
}

export const LevelCompletionBanner: React.FC<Props> = ({
  gameId,
  level,
  score,
  targetScore,
  stars,
  unlockedPartnerGames,
  onNextLevel,
  onOpenLevelSelect,
  onRestartLevel,
  onBackToMenu,
}) => {
  const toPersianNum = (n: number | string): string => {
    const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return n.toString().replace(/\d/g, (d) => pDigits[parseInt(d, 10)]);
  };

  const nextLevelNumber = level + 1;
  const nextLockStatus = nextLevelNumber <= 100 ? checkLevelLockStatus(gameId, nextLevelNumber) : null;
  const canGoNext = nextLockStatus?.isUnlocked ?? false;

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl animate-fade-in max-w-xl mx-auto my-4 text-right font-sans">
      {/* Trophy Badge & Stars */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg">
          <Trophy className="w-8 h-8" />
        </div>

        <div className="flex items-center gap-1.5 justify-center">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={`w-7 h-7 transition-all ${
                s <= stars
                  ? 'text-yellow-400 fill-yellow-400 scale-110 drop-shadow-md'
                  : 'text-slate-700 fill-slate-800'
              }`}
            />
          ))}
        </div>

        <h3 className="text-2xl font-black text-slate-100">
          مرحله {toPersianNum(level)} با موفقیت به پایان رسید!
        </h3>
        <p className="text-xs text-slate-400">
          بازی {GAME_TITLES[gameId]} · امتیاز شما: <strong className="text-amber-400">{toPersianNum(score)}</strong> (هدف: {toPersianNum(targetScore)})
        </p>
      </div>

      {/* Cross-Game Psychological Unlock Alert */}
      {unlockedPartnerGames && unlockedPartnerGames.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/40 rounded-2xl p-4 text-right space-y-2">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
            <Brain className="w-4 h-4 text-amber-400" />
            <span>پیروزی در زنجیره شناختی!</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            با تکمیل این سطح، مسیر عصبی مربوطه تقویت شد و قفل بازی‌های زیر گشوده شد:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {unlockedPartnerGames.map((ug, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-amber-300 text-xs font-bold"
              >
                🔓 {ug.gameTitle} (مرحله {toPersianNum(ug.unlockedLevel)})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Next level status note */}
      {nextLockStatus && !canGoNext && nextLevelNumber <= 100 && (
        <div className="bg-amber-950/30 border border-amber-900/50 rounded-2xl p-4 text-right space-y-1.5 text-xs">
          <div className="font-bold text-amber-400">
            🔒 مرحله {toPersianNum(nextLevelNumber)} قفل است
          </div>
          <p className="text-slate-300 leading-relaxed">
            {nextLockStatus.reason}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {canGoNext && nextLevelNumber <= 100 ? (
          <button
            onClick={() => {
              sounds.playSuccess();
              onNextLevel();
            }}
            className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
          >
            <span>ورود به مرحله {toPersianNum(nextLevelNumber)}</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        ) : null}

        <button
          onClick={() => {
            sounds.playTap();
            onOpenLevelSelect();
          }}
          className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
        >
          انتخاب مرحله (۱ تا ۱۰۰)
        </button>

        <button
          onClick={() => {
            sounds.playTap();
            onRestartLevel();
          }}
          className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-colors"
          title="تلاش دوباره در همین مرحله"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            sounds.playTap();
            onBackToMenu();
          }}
          className="px-5 py-3.5 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs rounded-xl transition-colors"
        >
          بازگشت به خانه
        </button>
      </div>
    </div>
  );
};
