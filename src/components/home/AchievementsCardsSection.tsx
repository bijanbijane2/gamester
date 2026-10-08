import React, { useState } from 'react';
import { UserStats } from '../../types/game';
import { evaluateAchievements, Achievement } from '../../services/achievements';
import { sounds } from '../../services/sound';
import {
  Trophy,
  Zap,
  Link,
  ShieldCheck,
  Sparkles,
  Flame,
  Brain,
  Eye,
  Search,
  Users,
  Compass,
  CheckCircle2,
  Lock,
  Award,
  Filter,
} from 'lucide-react';

interface Props {
  stats: UserStats;
}

export const AchievementsCardsSection: React.FC<Props> = ({ stats }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unlocked' | 'in_progress'>('all');
  const allAchievements = evaluateAchievements(stats);

  const unlockedCount = allAchievements.filter((a) => a.isUnlocked).length;
  const totalCount = allAchievements.length;

  const filtered = allAchievements.filter((a) => {
    if (activeFilter === 'unlocked') return a.isUnlocked;
    if (activeFilter === 'in_progress') return !a.isUnlocked;
    return true;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Link': return <Link className="w-5 h-5 text-emerald-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-cyan-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-rose-400" />;
      case 'Brain': return <Brain className="w-5 h-5 text-indigo-400" />;
      case 'Eye': return <Eye className="w-5 h-5 text-teal-400" />;
      case 'Search': return <Search className="w-5 h-5 text-amber-300" />;
      case 'Users': return <Users className="w-5 h-5 text-violet-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-blue-400" />;
      default: return <Award className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <section className="space-y-4">
      {/* Header and Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-800/80 pb-3 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-bold text-slate-100">دستاوردهای کسب‌شده در طول بازی</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {unlockedCount} از {totalCount} دستاورد
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            نشان‌ها و مدال‌های افتخار حاصل از رکوردشکنی در آزمون‌های شناختی، زبانی و رفتاری
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => { sounds.playTap(); setActiveFilter('all'); }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeFilter === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            همه ({totalCount})
          </button>
          <button
            onClick={() => { sounds.playTap(); setActiveFilter('unlocked'); }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeFilter === 'unlocked'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            کسب‌شده ({unlockedCount})
          </button>
          <button
            onClick={() => { sounds.playTap(); setActiveFilter('in_progress'); }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeFilter === 'in_progress'
                ? 'bg-slate-700 text-slate-200 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            در مسیر فتح ({totalCount - unlockedCount})
          </button>
        </div>
      </div>

      {/* Graphic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((ach) => {
          const progressPercent = Math.min(100, Math.round((ach.currentProgress / ach.maxProgress) * 100));

          return (
            <div
              key={ach.id}
              className={`relative overflow-hidden rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 border ${
                ach.isUnlocked
                  ? 'bg-gradient-to-b from-slate-900/95 via-slate-900 to-slate-950 border-slate-700/80 hover:border-amber-500/50 shadow-lg'
                  : 'bg-slate-950/70 border-slate-900/90 opacity-70 hover:opacity-85'
              }`}
            >
              {/* Top ambient glow banner for unlocked badges */}
              {ach.isUnlocked && (
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400" />
              )}

              <div className="space-y-3">
                {/* Badge Header: Icon + Rarity Tag */}
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-sm ${
                      ach.isUnlocked
                        ? 'bg-slate-800/90 border-slate-700'
                        : 'bg-slate-900/70 border-slate-800'
                    }`}
                  >
                    {getIcon(ach.iconName)}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${ach.rarityColor}`}>
                      {ach.rarity}
                    </span>
                    {ach.isUnlocked ? (
                      <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-400" title="دستاورد باز شد">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="p-1 rounded-full bg-slate-800/80 text-slate-500" title="قفل است">
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h4 className={`text-sm font-bold transition-colors ${
                    ach.isUnlocked ? 'text-slate-100 font-black' : 'text-slate-300'
                  }`}>
                    {ach.title}
                  </h4>
                  <span className="text-[11px] text-amber-400/90 block mt-0.5">
                    {ach.subtitle}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {ach.description}
                </p>
              </div>

              {/* Bottom Progress Bar & State */}
              <div className="pt-3 mt-3 border-t border-slate-800/70 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>پیشرفت:</span>
                  <span className="font-mono tabular-nums font-bold text-slate-300">
                    {ach.isUnlocked ? (
                      <span className="text-emerald-400">تکمیل شد ✓</span>
                    ) : (
                      `${ach.currentProgress} / ${ach.maxProgress}`
                    )}
                  </span>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full h-1.5 bg-slate-800/90 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ach.isUnlocked
                        ? 'bg-gradient-to-r from-emerald-500 to-amber-400'
                        : 'bg-slate-600'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
