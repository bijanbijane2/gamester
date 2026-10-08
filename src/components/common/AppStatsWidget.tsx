import React, { useState, useEffect } from 'react';
import { Users, Clock, Flame, ChevronDown, ChevronUp, Activity, Sparkles, ShieldCheck } from 'lucide-react';
import { loadAppVisitStats, registerAppVisit, addGameplaySeconds } from '../../services/appVisitTracker';
import { loadMembersRegistry } from '../../services/authService';
import { loadUserStats } from '../../services/storage';
import { DailyAchievementBadge } from './DailyAchievementBadge';

export const AppStatsWidget: React.FC = () => {
  const [stats, setStats] = useState(loadAppVisitStats());
  const [userStats, setUserStats] = useState(loadUserStats());
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const registeredCount = loadMembersRegistry().length;

  // Register session on mount & refresh user stats
  useEffect(() => {
    registerAppVisit();
    setStats(loadAppVisitStats());
    setUserStats(loadUserStats());
  }, []);

  // Track active session seconds & accumulate genuine gameplay minutes every 60 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => {
        const next = prev + 1;
        if (next % 60 === 0) {
          const updated = addGameplaySeconds(60);
          setStats(updated);
          setUserStats(loadUserStats());
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toPersianNum = (n: number | string): string => {
    const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return n
      .toString()
      .replace(/\d/g, (d) => pDigits[parseInt(d, 10)])
      .replace(/,/g, '،');
  };

  const sessionMinutes = Math.floor(sessionSeconds / 60);
  const sessionRemSec = sessionSeconds % 60;
  const streak = userStats.dailyStreak || 1;

  return (
    <aside
      aria-label="آمار دقیق بازدید و دستاورد روزانه"
      className="fixed bottom-2 left-2 sm:bottom-4 sm:left-4 z-40 transition-all duration-300 font-sans select-none"
    >
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 hover:border-amber-500/50 shadow-2xl rounded-2xl overflow-hidden transition-all text-right max-w-[290px] sm:max-w-[330px]">
        {/* Header bar / Toggle */}
        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
            setUserStats(loadUserStats());
          }}
          className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-800/90 hover:bg-slate-800 transition-colors text-xs text-slate-200 border-b border-slate-800"
          title={isExpanded ? 'کوچک کردن کادر آمار' : 'بزرگ کردن کادر آمار'}
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-slate-100 flex items-center gap-1 text-[11px] sm:text-xs">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>آمار و دستاورد پیوستگی</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
            <span className="text-emerald-400 font-medium">
              آمار دقیق
            </span>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </div>
        </button>

        {/* Content Body */}
        {isExpanded ? (
          <div className="p-3.5 space-y-2.5 text-xs">
            {/* Dynamic Daily Achievement Badge with Unique Visual Flairs */}
            <DailyAchievementBadge streak={streak} />

            {/* Stat 1: Total Genuine visitors */}
            <div className="flex items-center justify-between bg-slate-950/70 border border-slate-800/80 rounded-xl px-3 py-2">
              <div className="flex items-center gap-2 text-slate-300">
                <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-200 text-[11px]">تعداد بازدیدکنندگان واقعی</div>
                  <div className="text-[9px] text-slate-400">ثبت دستگاه‌های یکتا</div>
                </div>
              </div>
              <div className="text-left">
                <span className="text-sm font-extrabold text-blue-400">
                  {toPersianNum(stats.totalVisitors.toLocaleString())}
                </span>
                <span className="text-[10px] text-slate-400 mr-1">نفر</span>
              </div>
            </div>

            {/* Stat 2: Registered members */}
            <div className="flex items-center justify-between bg-slate-950/70 border border-slate-800/80 rounded-xl px-3 py-2">
              <div className="flex items-center gap-2 text-slate-300">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-200 text-[11px]">کاربران عضو با گوگل</div>
                  <div className="text-[9px] text-slate-400">اعضای رسمی آزمایشگاه</div>
                </div>
              </div>
              <div className="text-left">
                <span className="text-sm font-extrabold text-emerald-400">
                  {toPersianNum(registeredCount)}
                </span>
                <span className="text-[10px] text-slate-400 mr-1">عضو</span>
              </div>
            </div>

            {/* Stat 3: Total minutes played */}
            <div className="flex items-center justify-between bg-slate-950/70 border border-slate-800/80 rounded-xl px-3 py-2">
              <div className="flex items-center gap-2 text-slate-300">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-200 text-[11px]">مجموع زمان بازی</div>
                  <div className="text-[9px] text-slate-400">کل دقایق بازی در سیستم</div>
                </div>
              </div>
              <div className="text-left">
                <span className="text-sm font-extrabold text-amber-400">
                  {toPersianNum(stats.totalPlayMinutes.toLocaleString())}
                </span>
                <span className="text-[10px] text-slate-400 mr-1">دقیقه</span>
              </div>
            </div>

            {/* Stat 4: Current session duration */}
            <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-slate-400 border-t border-slate-800/60">
              <span className="flex items-center gap-1 text-slate-300 text-[10px]">
                <Flame className="w-3 h-3 text-emerald-400" />
                <span>زمان این نشست شما:</span>
              </span>
              <span className="font-mono text-emerald-400 font-bold text-[11px]">
                {toPersianNum(sessionMinutes)}:{sessionRemSec < 10 ? '۰' : ''}{toPersianNum(sessionRemSec)}
              </span>
            </div>
          </div>
        ) : (
          /* Minimized pill glance at the bottom with Dynamic Achievement Flair */
          <div
            onClick={() => {
              setIsExpanded(true);
              setUserStats(loadUserStats());
            }}
            className="px-3 py-2 flex items-center justify-between gap-2 text-[10px] sm:text-[11px] cursor-pointer hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-1.5 truncate">
              <DailyAchievementBadge streak={streak} compact />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-slate-300 font-medium">
                👥 {toPersianNum(stats.totalVisitors.toLocaleString())}
              </span>
              <span className="text-amber-400 font-semibold">
                ⏱️ {toPersianNum(stats.totalPlayMinutes.toLocaleString())}د
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

