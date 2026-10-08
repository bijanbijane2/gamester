import React, { useState } from 'react';
import { GameId } from '../../types/game';
import {
  GAME_TITLES,
  checkLevelLockStatus,
  getLevelConfig,
  getHighestCompletedLevel,
  loadLevelProgress,
  COGNITIVE_DEPENDENCIES,
} from '../../services/levelProgression';
import { sounds } from '../../services/sound';
import {
  X,
  Lock,
  Star,
  CheckCircle2,
  Play,
  ArrowRight,
  Brain,
  Sparkles,
  Flame,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  gameId: GameId;
  onClose: () => void;
  onSelectLevel: (level: number) => void;
  onNavigateToPrereqGame: (prereqGameId: GameId) => void;
  onOpenChainMap: () => void;
}

export const LevelSelectModal: React.FC<Props> = ({
  isOpen,
  gameId,
  onClose,
  onSelectLevel,
  onNavigateToPrereqGame,
  onOpenChainMap,
}) => {
  const [activeTierRange, setActiveTierRange] = useState<number>(0); // 0: 1-20, 1: 21-40, 2: 41-60, 3: 61-80, 4: 81-100
  const [lockedModalInfo, setLockedModalInfo] = useState<{
    level: number;
    reason: string;
    prereqGameId?: GameId;
    prereqGameTitle?: string;
    requiredLevel?: number;
    currentPrereqLevel?: number;
    cognitiveSkill?: string;
    rationale?: string;
  } | null>(null);

  if (!isOpen) return null;

  const gameTitle = GAME_TITLES[gameId] || gameId;
  const store = loadLevelProgress();
  const completedList = store.completedLevels[gameId] || [];
  const completedCount = completedList.length;

  // Total stars earned in this game
  const starObj = store.levelStars[gameId] || {};
  const totalStars = Object.values(starObj).reduce((a, b) => a + b, 0);

  const highestUnlocked = Math.max(3, ...completedList.map((c) => c + 1));

  const tierRanges = [
    { label: 'مراحل ۱ - ۲۰ (مبتدی)', start: 1, end: 20 },
    { label: 'مراحل ۲۱ - ۴۰ (شتاب)', start: 21, end: 40 },
    { label: 'مراحل ۴۱ - ۶۰ (پیشرفته)', start: 41, end: 60 },
    { label: 'مراحل ۶۱ - ۸۰ (حرفه‌ای)', start: 61, end: 80 },
    { label: 'مراحل ۸۱ - ۱۰۰ (استاد بزرگ)', start: 81, end: 100 },
  ];

  const currentRange = tierRanges[activeTierRange];
  const levelNumbers = Array.from(
    { length: currentRange.end - currentRange.start + 1 },
    (_, i) => currentRange.start + i
  );

  const toPersianNum = (n: number | string): string => {
    const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return n.toString().replace(/\d/g, (d) => pDigits[parseInt(d, 10)]);
  };

  const handleLevelClick = (level: number) => {
    sounds.playTap();
    const status = checkLevelLockStatus(gameId, level);

    if (status.isUnlocked) {
      onSelectLevel(level);
      onClose();
    } else {
      sounds.playError();
      const dep = COGNITIVE_DEPENDENCIES[gameId];
      setLockedModalInfo({
        level,
        reason: status.reason || 'این مرحله در حال حاضر قفل است.',
        prereqGameId: status.prerequisite?.gameId || dep?.requiredGame,
        prereqGameTitle: status.prerequisite?.gameTitle || (dep ? GAME_TITLES[dep.requiredGame] : undefined),
        requiredLevel: status.prerequisite?.requiredLevel || Math.max(2, level - 2),
        currentPrereqLevel: status.prerequisite?.currentPrereqLevel || (dep ? getHighestCompletedLevel(dep.requiredGame) : 0),
        cognitiveSkill: status.prerequisite?.cognitiveSkill || dep?.cognitiveSkill,
        rationale: status.prerequisite?.psychologicalRationale || dep?.rationale,
      });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="level-select-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in text-right font-sans"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                ۱۰۰ مرحله اختصاصی
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-emerald-400 font-medium">
                ۳ سطح نخست باز است
              </span>
            </div>
            <h2 id="level-select-title" className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
              <span>مراحل بازی {gameTitle}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playTap();
                onOpenChainMap();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-400 border border-slate-700 transition-colors"
              title="مشاهده نقشه ارتباط بازی‌ها"
            >
              <Brain className="w-4 h-4" />
              <span>زنجیره روانشناختی</span>
            </button>

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
        </div>

        {/* Progress Summary Strip */}
        <div className="px-5 py-3 bg-slate-950/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-300">
            <span>
              مراحل تکمیل‌شده: <strong className="text-amber-400">{toPersianNum(completedCount)}</strong> از ۱۰۰
            </span>
            <span>
              مجموع ستاره‌ها: <strong className="text-yellow-400">{toPersianNum(totalStars)} ★</strong>
            </span>
          </div>

          <div className="text-slate-400">
            بالاترین مرحله در دسترس: <strong className="text-emerald-400">{toPersianNum(highestUnlocked)}</strong>
          </div>
        </div>

        {/* Tier Range Tabs */}
        <div className="px-5 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {tierRanges.map((range, idx) => (
            <button
              key={idx}
              onClick={() => {
                sounds.playTap();
                setActiveTierRange(idx);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTierRange === idx
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* 20 Levels Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
            {levelNumbers.map((lvl) => {
              const status = checkLevelLockStatus(gameId, lvl);
              const config = getLevelConfig(lvl);

              return (
                <button
                  key={lvl}
                  onClick={() => handleLevelClick(lvl)}
                  className={`relative p-3.5 rounded-2xl border transition-all text-right flex flex-col justify-between min-h-[105px] group ${
                    status.isUnlocked
                      ? status.isCompleted
                        ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-950/40'
                        : 'bg-slate-800/80 border-slate-700 hover:border-amber-400 hover:bg-slate-800 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-60 hover:opacity-90 hover:border-slate-700 cursor-pointer'
                  }`}
                >
                  {/* Top Bar: Level number & Lock/Check status */}
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-black text-slate-200 group-hover:text-amber-400 transition-colors">
                      سطح {toPersianNum(lvl)}
                    </span>

                    {status.isUnlocked ? (
                      status.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                      )
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </div>

                  {/* Stars / Target info */}
                  <div className="space-y-1 my-1 w-full">
                    {status.isUnlocked ? (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= status.stars
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-slate-700 fill-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-rose-400/90 flex items-center gap-1 font-medium">
                        <Lock className="w-2.5 h-2.5 inline" />
                        <span>قفل زنجیره</span>
                      </span>
                    )}

                    <div className="text-[10px] text-slate-400 truncate">
                      هدف: {toPersianNum(config.targetScore)} امتیاز
                    </div>
                  </div>

                  {/* Tier indicator tag */}
                  <div className="pt-1 border-t border-slate-800/60 w-full flex justify-between items-center text-[9px] text-slate-500">
                    <span>{config.tierLabel.split(' ')[0]}</span>
                    <span>{toPersianNum(config.timeLimitSeconds)} ثانیه</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Psychological Chain Lock Dialog */}
      {lockedModalInfo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in text-right font-sans"
        >
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  قفل روانشناختی مرحله {toPersianNum(lockedModalInfo.level)}
                </h3>
                <p className="text-xs text-amber-400 font-medium">
                  وابستگی زنجیره‌ای مهارت‌های ذهن
                </p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs leading-relaxed text-slate-300">
              <p>{lockedModalInfo.reason}</p>

              {lockedModalInfo.rationale && (
                <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-amber-200 text-xs">
                  💡 <strong>چرا این پیش‌نیاز لازم است؟</strong>
                  <br />
                  {lockedModalInfo.rationale}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setLockedModalInfo(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-medium text-slate-300 transition-colors"
              >
                متوجه شدم
              </button>

              {lockedModalInfo.prereqGameId && (
                <button
                  onClick={() => {
                    sounds.playSuccess();
                    const prereqId = lockedModalInfo.prereqGameId!;
                    setLockedModalInfo(null);
                    onClose();
                    onNavigateToPrereqGame(prereqId);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-xs font-bold text-slate-950 transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>ورود به بازی پیش‌نیاز ({lockedModalInfo.prereqGameTitle})</span>
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
