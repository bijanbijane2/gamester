import React from 'react';
import { UserStats } from '../../types/game';
import { loadUserStats } from '../../services/storage';
import { calculateCognitiveIQ } from '../../services/cognitiveIQService';
import {
  Trophy,
  Flame,
  Zap,
  Brain,
  ShieldCheck,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface Props {
  onBack: () => void;
  onSelectGame?: (gameId: any) => void;
}

export const VisualAnalyticsPanel: React.FC<Props> = ({ onBack, onSelectGame }) => {
  const stats: UserStats = loadUserStats();
  const iqReport = calculateCognitiveIQ(stats);

  // Interpretations based on actual user scores
  const getSpeedInterpretation = (val: number) => {
    if (val >= 80) return 'بسیار چابک؛ سرعت انتقال و واکنش عصبی شما در بالاترین سطح است.';
    if (val >= 60) return 'متعادل و خوب؛ در بیشتر مواقع زمان مناسبی برای پاسخ صرف می‌کنید.';
    return 'آرام و با تامل؛ شما دقت را به شتاب ترجیح می‌دهید.';
  };

  const getInhibitionInterpretation = (val: number) => {
    if (val >= 80) return 'کنترل تکانه عالی؛ در برابر محرک‌های ناگهانی خونسردی خود را حفظ می‌کنید.';
    if (val >= 60) return 'پایداری مناسب؛ به ندرت در تله خطاها و کلیک‌های اشتباه می‌افتید.';
    return 'هیجان‌محور؛ گاهی سرعت را قربانی بازداری محرک متضاد می‌کنید.';
  };

  const getVerbalInterpretation = (val: number) => {
    if (val >= 80) return 'گنجینه واژگان غنی؛ سرعت بازیابی و ساخت کلمات در ذهن شما بالاست.';
    if (val >= 60) return 'روانی کلامی خوب؛ دسترسی ذهنی به الگوهای حروف و کلمات فعال است.';
    return 'در حال پیشرفت؛ با انجام چالش‌های کلمه‌ای پیوند واژگان تقویت می‌شود.';
  };

  const getRiskInterpretation = (val: number) => {
    if (val >= 80) return 'مدیریت بهینه ریسک؛ تعادل طلایی میان اشتیاق سود و مهار خطر را پیدا کرده‌اید.';
    if (val >= 60) return 'سنجیده و محتاط؛ تمایل به حفظ سرمایه در برابر خطرات انفجاری دارید.';
    return 'جسور و اهل ریسک؛ تمایل بالایی به رفتن تا مرز خطر برای پاداش بیشتر دارید.';
  };

  const metrics = [
    {
      title: 'سرعت و شتاب واکنش',
      score: stats.cognitiveProfile.processingSpeed,
      color: 'text-amber-400',
      strokeColor: '#f59e0b',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      interpretation: getSpeedInterpretation(stats.cognitiveProfile.processingSpeed),
      icon: <Zap className="w-5 h-5 text-amber-400" />,
    },
    {
      title: 'دقت و مهار تکانه',
      score: stats.cognitiveProfile.inhibitoryControl,
      color: 'text-emerald-400',
      strokeColor: '#10b981',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      interpretation: getInhibitionInterpretation(stats.cognitiveProfile.inhibitoryControl),
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: 'قدرت و روانی واژگان',
      score: stats.cognitiveProfile.verbalFluency,
      color: 'text-cyan-400',
      strokeColor: '#06b6d4',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      interpretation: getVerbalInterpretation(stats.cognitiveProfile.verbalFluency),
      icon: <BookOpen className="w-5 h-5 text-cyan-400" />,
    },
    {
      title: 'تعادل ریسک و تصمیم',
      score: stats.cognitiveProfile.riskRegulation,
      color: 'text-rose-400',
      strokeColor: '#f43f5e',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      interpretation: getRiskInterpretation(stats.cognitiveProfile.riskRegulation),
      icon: <TrendingUp className="w-5 h-5 text-rose-400" />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-fade-in text-slate-100">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs text-amber-400 font-semibold block mb-0.5">
            آمار گرافیکی و تحلیل تفسیری عملکرد
          </span>
          <h2 className="text-2xl font-black text-slate-100">پنل آمار و تحلیل ذهن</h2>
        </div>

        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
        >
          بازگشت به خانه
        </button>
      </div>

      {/* Cognitive IQ Hero Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-amber-950/40 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Brain className="w-4 h-4" />
            <span>ضریب هوش شناختی محاسبه‌شده (Cognitive IQ)</span>
            <span>·</span>
            <span className="text-emerald-400">صدک {iqReport.percentileRank}٪</span>
          </div>
          <h3 className="text-xl font-black text-slate-100">
            {iqReport.archetype}
          </h3>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            {iqReport.archetypeDesc}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
          <div className="text-left">
            <span className="text-[10px] text-slate-400 block font-medium">ضریب هوش کل</span>
            <span className="text-2xl font-black text-amber-400 font-mono tabular-nums">
              IQ {iqReport.compositeIQ}
            </span>
          </div>
        </div>
      </div>

      {/* Overview Metric Ribbon */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">امتیاز انباشته</span>
            <span className="text-xl font-bold text-amber-400 tabular-nums">{stats.totalScore}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">پیوستگی حضور</span>
            <span className="text-xl font-bold text-emerald-400 tabular-nums">{stats.dailyStreak} روز</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">بازی‌های تمام‌شده</span>
            <span className="text-xl font-bold text-cyan-400 tabular-nums">{stats.gamesPlayed}</span>
          </div>
        </div>
      </div>

      {/* Graphical Cards with Simple Visual Gauges and Interpretations */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Brain className="w-5 h-5 text-amber-400" />
          <span>تحلیل تفسیری توانمندی‌های ۴ گانه</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${m.bgColor} border ${m.borderColor}`}>
                    {m.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{m.title}</h4>
                    <span className="text-xs text-slate-400">شاخص عملکردی آزمون‌ها</span>
                  </div>
                </div>

                {/* Circular Percentage Dial */}
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      stroke={m.strokeColor}
                      strokeWidth="3.5"
                      strokeDasharray={`${m.score}, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className={`absolute text-xs font-bold tabular-nums ${m.color}`}>
                    {m.score}٪
                  </span>
                </div>
              </div>

              {/* Simple Interpretation Box */}
              <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-amber-300 block mb-0.5">تفسیر ساده:</span>
                <span>{m.interpretation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High Scores Snapshot */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>رکورد بهترین بازی‌های شما</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">حروف‌چین:</span>
            <span className="font-bold text-amber-400 tabular-nums">{stats.highScores.horoofchin}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">سرنخ:</span>
            <span className="font-bold text-indigo-400 tabular-nums">{stats.highScores.sarenakh}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">استروپ:</span>
            <span className="font-bold text-pink-400 tabular-nums">{stats.highScores.stroop}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">بادکنک BART:</span>
            <span className="font-bold text-rose-400 tabular-nums">{stats.highScores.balloon}</span>
          </div>
        </div>
      </div>

      {/* Warm Friendly Takeaway */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed">
        <span className="font-bold block mb-1">جمع‌بندی عملکرد:</span>
        <p>
          الگوی بازی‌های شما نشان‌دهنده تعادل بسیار خوب میان ریتم سریع و تصمیم‌گیری آرام است. برای به حداکثر رساندن روانی کلامی، انجام چالش‌های روزانه و پرونده‌های داستانی به شکل پایدار پیشنهاد می‌شود.
        </p>
      </div>
    </div>
  );
};
