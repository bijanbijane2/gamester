/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * نشان پویا و دستاورد روزانه (Daily Achievement Badge)
 * گشودن جلوه‌های بصری و نشان‌های افتخار بر اساس تعداد روزهای متوالی پیوستگی (Streak)
 */

import React, { useState } from 'react';
import { Flame, Sparkles, Zap, Award, Crown, Star, ChevronLeft, ShieldCheck, Lock } from 'lucide-react';

export interface StreakTier {
  id: string;
  minStreak: number;
  title: string;
  shortTitle: string;
  desc: string;
  flairColor: string;
  badgeBg: string;
  badgeBorder: string;
  glowEffect: string;
  icon: React.ReactNode;
  particles: string;
}

export const STREAK_TIERS: StreakTier[] = [
  {
    id: 'tier_spark',
    minStreak: 1,
    title: 'نخستین جرقه ذهن',
    shortTitle: 'جرقه ذهن',
    desc: 'ورود به حلقه پیوستگی و گشودن نخستین رمز روز',
    flairColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/30',
    glowEffect: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]',
    icon: <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />,
    particles: 'from-amber-500/20 to-orange-500/20',
  },
  {
    id: 'tier_flame',
    minStreak: 3,
    title: 'شعله بیداری و تمرکز',
    shortTitle: 'شعله تمرکز',
    desc: '۳ روز استقامت مداوم در آزمون‌های شناختی',
    flairColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/15',
    badgeBorder: 'border-emerald-500/40',
    glowEffect: 'shadow-[0_0_16px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500/30',
    icon: <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />,
    particles: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    id: 'tier_sage',
    minStreak: 7,
    title: 'هفت‌اقلیم خرد',
    shortTitle: 'حکیم هفت‌روزه',
    desc: 'یک هفته کامل حضور بدون وقفه در حل معماها',
    flairColor: 'text-cyan-300',
    badgeBg: 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20',
    badgeBorder: 'border-cyan-400/50',
    glowEffect: 'shadow-[0_0_20px_rgba(6,182,212,0.4)] ring-1 ring-cyan-400/50 animate-pulse',
    icon: <Star className="w-3.5 h-3.5 text-cyan-300 fill-cyan-300/30" />,
    particles: 'from-cyan-500/25 to-blue-500/25',
  },
  {
    id: 'tier_meteor',
    minStreak: 14,
    title: 'شهاب پرفروغ شناخت',
    shortTitle: 'شهاب شناخت',
    desc: 'دو هفته مداومت فولادین در کشف حقایق فلسفی و روانی',
    flairColor: 'text-purple-300',
    badgeBg: 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20',
    badgeBorder: 'border-purple-400/60',
    glowEffect: 'shadow-[0_0_24px_rgba(168,85,247,0.45)] ring-2 ring-purple-400/40',
    icon: <Award className="w-3.5 h-3.5 text-purple-300 fill-purple-300/30" />,
    particles: 'from-purple-500/30 to-pink-500/20',
  },
  {
    id: 'tier_titan',
    minStreak: 30,
    title: 'استاد بزرگ جاودانگی',
    shortTitle: 'تاج اسطوره‌ای',
    desc: 'یک ماه کامل پیوستگی قهرمانانه بدون یک روز غیبت',
    flairColor: 'text-amber-200',
    badgeBg: 'bg-gradient-to-r from-amber-500/30 via-yellow-400/25 to-amber-600/30',
    badgeBorder: 'border-amber-300/80',
    glowEffect: 'shadow-[0_0_28px_rgba(251,191,36,0.6)] ring-2 ring-amber-300/60 animate-pulse',
    icon: <Crown className="w-4 h-4 text-amber-200 fill-amber-200/40" />,
    particles: 'from-amber-400/30 to-yellow-300/30',
  },
];

interface Props {
  streak: number;
  compact?: boolean;
}

export const DailyAchievementBadge: React.FC<Props> = ({ streak, compact = false }) => {
  const [showTiersModal, setShowTiersModal] = useState(false);

  // یافتن رده فعلی
  const currentTier = [...STREAK_TIERS]
    .reverse()
    .find((t) => streak >= t.minStreak) || STREAK_TIERS[0];

  // یافتن رده بعدی
  const nextTier = STREAK_TIERS.find((t) => t.minStreak > streak);

  const daysToNext = nextTier ? nextTier.minStreak - streak : 0;
  const progressPercent = nextTier
    ? Math.min(100, Math.max(0, ((streak - currentTier.minStreak) / (nextTier.minStreak - currentTier.minStreak)) * 100))
    : 100;

  const toPersianNum = (n: number | string): string => {
    const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return n.toString().replace(/\d/g, (d) => pDigits[parseInt(d, 10)]);
  };

  // حالت فشرده (برای نوار پایین ویجت در حالت مینیمایز)
  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all ${currentTier.badgeBg} ${currentTier.badgeBorder} ${currentTier.flairColor} ${currentTier.glowEffect}`}
        title={`نشان دستاورد پیوستگی: ${currentTier.title} (${streak} روز متوالی)`}
      >
        {currentTier.icon}
        <span>{currentTier.shortTitle}</span>
        <span className="font-mono text-[9px] tabular-nums mr-0.5 opacity-90">({toPersianNum(streak)}د)</span>
      </div>
    );
  }

  // حالت کامل (درون کادر بازشده ویجت)
  return (
    <div className="relative">
      <div
        onClick={() => setShowTiersModal(!showTiersModal)}
        className={`relative overflow-hidden cursor-pointer rounded-2xl border p-3 transition-all hover:scale-[1.01] active:scale-[0.99] ${currentTier.badgeBg} ${currentTier.badgeBorder} ${currentTier.glowEffect}`}
      >
        {/* پس‌زمینه درخشان محو */}
        <div
          className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${currentTier.particles} blur-xl pointer-events-none opacity-60`}
        />

        <div className="relative z-10 flex items-center justify-between gap-2.5">
          {/* آیکون و نام نشان */}
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${currentTier.badgeBg} ${currentTier.badgeBorder} shadow-sm`}
            >
              {currentTier.icon}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  نشان دستاورد پیوستگی
                </span>
                <span className="text-[8px] px-1.5 py-0.2 rounded bg-slate-900/80 text-amber-300 font-mono">
                  {toPersianNum(streak)} روز
                </span>
              </div>
              <h4 className={`text-xs font-black ${currentTier.flairColor}`}>
                {currentTier.title}
              </h4>
            </div>
          </div>

          {/* نشانگر رده و بازشونده */}
          <div className="text-left shrink-0">
            <span className="text-[9px] text-slate-400 flex items-center gap-0.5 hover:text-white transition-colors">
              <span>همه سطوح</span>
              <ChevronLeft className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>

        {/* نوار پیشرفت به رده بعدی */}
        {nextTier ? (
          <div className="mt-2.5 pt-2 border-t border-slate-800/60 space-y-1">
            <div className="flex items-center justify-between text-[9px] text-slate-400">
              <span>گام بعدی: {nextTier.shortTitle}</span>
              <span className="font-mono text-amber-300">
                {toPersianNum(daysToNext)} روز مانده
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(8, progressPercent)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="mt-2 pt-1.5 border-t border-amber-500/20 text-[9px] text-amber-300 font-semibold text-center flex items-center justify-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            <span>بالاترین نشان جاودانگی ذهن فتح شد!</span>
          </div>
        )}
      </div>

      {/* مودال کشویی جزئیات تمام سطوح دستاورد */}
      {showTiersModal && (
        <div className="mt-2 p-3 bg-slate-950/95 border border-slate-800 rounded-2xl space-y-2 animate-fade-in text-[10px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-slate-200 flex items-center gap-1 text-[11px]">
              <Crown className="w-3 h-3 text-amber-400" />
              <span>سطوح دستاورد روزانه</span>
            </span>
            <span className="text-[9px] text-slate-400 font-mono">
              پیوستگی کنونی: {toPersianNum(streak)} روز
            </span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
            {STREAK_TIERS.map((tier) => {
              const isUnlocked = streak >= tier.minStreak;
              const isCurrent = tier.id === currentTier.id;

              return (
                <div
                  key={tier.id}
                  className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                    isCurrent
                      ? `${tier.badgeBg} ${tier.badgeBorder} ring-1 ring-amber-400/40`
                      : isUnlocked
                      ? 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                      : 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-slate-900 border border-slate-800">
                      {isUnlocked ? tier.icon : <Lock className="w-3 h-3 text-slate-600" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1 font-bold">
                        <span className={isUnlocked ? tier.flairColor : 'text-slate-500'}>
                          {tier.title}
                        </span>
                        {isCurrent && (
                          <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500 text-slate-950 font-black">
                            فعلی
                          </span>
                        )}
                      </div>
                      <div className="text-[9px] text-slate-400 line-clamp-1">{tier.desc}</div>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono font-bold shrink-0 text-slate-400">
                    {toPersianNum(tier.minStreak)}+ روز
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
