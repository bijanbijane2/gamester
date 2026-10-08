import React, { useState, useEffect } from 'react';
import { loadAppVisitStats, AppVisitStats } from '../../services/appVisitTracker';
import { loadMembersRegistry } from '../../services/authService';
import { UserStats } from '../../types/game';
import { sounds } from '../../services/sound';
import {
  Users,
  Clock,
  ShieldCheck,
  Gamepad2,
  Activity,
  CheckCircle2,
  Sparkles,
  Settings,
} from 'lucide-react';

interface Props {
  stats: UserStats;
  onOpenAdmin: () => void;
  onOpenMembership: () => void;
}

export const UserStatsLowerSection: React.FC<Props> = ({
  stats,
  onOpenAdmin,
  onOpenMembership,
}) => {
  const [visitStats, setVisitStats] = useState<AppVisitStats>(loadAppVisitStats());
  const membersCount = loadMembersRegistry().length;

  useEffect(() => {
    setVisitStats(loadAppVisitStats());
  }, []);

  const toPersianNum = (n: number | string): string => {
    const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return n
      .toString()
      .replace(/\d/g, (d) => pDigits[parseInt(d, 10)])
      .replace(/,/g, '،');
  };

  return (
    <section className="bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>شفافیت و پایش زنده عملکرد</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">آمار صحیح و غیرساختگی</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-100">
            آمار کاربران و فعالیت‌های آزمایشگاه
          </h3>
          <p className="text-xs text-slate-400">
            اطلاعات این بخش به صورت دقیق و بر پایه تعاملات واقعی مرورگر، نشست‌ها و اعضای متصل با حساب گوگل محاسبه می‌شود.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => { sounds.playTap(); onOpenAdmin(); }}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span>پنل مدیریت ادمین</span>
          </button>
          <button
            onClick={() => { sounds.playTap(); onOpenMembership(); }}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>عضویت با گوگل</span>
          </button>
        </div>
      </div>

      {/* 4 Authentic Real Data Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Unique Visitors */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">بازدیدکنندگان یکتا</span>
            <div className="text-xl font-black text-blue-400 tabular-nums">
              {toPersianNum(visitStats.totalVisitors.toLocaleString())}
              <span className="text-xs font-normal text-slate-400 mr-1">نفر</span>
            </div>
            <span className="text-[10px] text-slate-500">دستگاه‌های منحصر‌به‌فرد</span>
          </div>
        </div>

        {/* Card 2: Cumulative Gameplay Minutes */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">مجموع زمان بازی</span>
            <div className="text-xl font-black text-amber-400 tabular-nums">
              {toPersianNum(visitStats.totalPlayMinutes.toLocaleString())}
              <span className="text-xs font-normal text-slate-400 mr-1">دقیقه</span>
            </div>
            <span className="text-[10px] text-slate-500">ثبت صدم‌ثانیه‌ای واقعی</span>
          </div>
        </div>

        {/* Card 3: Registered Google Members */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">اعضای رسمی با گوگل</span>
            <div className="text-xl font-black text-emerald-400 tabular-nums">
              {toPersianNum(membersCount)}
              <span className="text-xs font-normal text-slate-400 mr-1">کاربر</span>
            </div>
            <span className="text-[10px] text-slate-500">حساب‌های تاییدشده</span>
          </div>
        </div>

        {/* Card 4: Games Finished */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">دورهای بازی تمام‌شده</span>
            <div className="text-xl font-black text-purple-400 tabular-nums">
              {toPersianNum(stats.gamesPlayed)}
              <span className="text-xs font-normal text-slate-400 mr-1">دور</span>
            </div>
            <span className="text-[10px] text-slate-500">مجموع امتیاز: {toPersianNum(stats.totalScore)}</span>
          </div>
        </div>
      </div>

      {/* Trust & Guarantee note */}
      <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex items-center gap-2.5 text-xs text-slate-400">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          تضمین صحت آمار: تمامی ارقام از ذخیره‌ساز محلی و نشست‌های معتبر استخراج شده و عاری از هرگونه مقدار تصادفی یا ساختگی هستند.
        </span>
      </div>
    </section>
  );
};
