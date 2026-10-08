import React, { useState } from 'react';
import { UserStats } from '../../types/game';
import { loadUserStats } from '../../services/storage';
import { calculateCognitiveIQ, CognitiveIQReport } from '../../services/cognitiveIQService';
import { speechCoach } from '../../services/speechCoach';
import { sounds } from '../../services/sound';
import { AchievementsCardsSection } from '../home/AchievementsCardsSection';
import {
  Brain,
  Trophy,
  Flame,
  ShieldCheck,
  Zap,
  Sparkles,
  Info,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Volume2,
  Award,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const MindMapProfile: React.FC<Props> = ({ onBack }) => {
  const stats: UserStats = loadUserStats();
  const iqReport: CognitiveIQReport = calculateCognitiveIQ(stats);
  const [isPlayingAudioReport, setIsPlayingAudioReport] = useState(false);

  const handlePlayVoiceSummary = () => {
    sounds.playTap();
    setIsPlayingAudioReport(true);
    const summaryText = `ضریب هوش شناختی شما ${iqReport.compositeIQ} محاسبه شده است. کهن‌الگوی ذهنی شما ${iqReport.archetype} است و در صدک برتر ${iqReport.percentileRank} درصدی قرار دارید. ترمزهای تمرکز و روانی کلامی شما در سطح برجسته‌ای عمل می‌کنند.`;
    speechCoach.speak(summaryText, 'cognitive_tip');
    setTimeout(() => setIsPlayingAudioReport(false), 8000);
  };

  const categoriesList = [
    iqReport.categories.memory,
    iqReport.categories.focus,
    iqReport.categories.decision,
    iqReport.categories.verbal,
  ];

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-8 animate-fade-in font-sans text-right">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Brain className="w-5 h-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
              کارنامه جامع و ضریب هوش شناختی
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            محاسبه علمی شاخص هوش شناختی بر اساس تاریخچه رکوردهای بازی‌ها در ۴ حوزه تفکر
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handlePlayVoiceSummary}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shadow-sm ${
              isPlayingAudioReport
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-900 hover:bg-slate-800 text-amber-400 border-amber-500/30'
            }`}
            title="قرائت صوتی گزارش با Web Speech API"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlayingAudioReport ? 'در حال قرائت صوتی...' : 'شنیدن گزارش صوتی هوش'}</span>
          </button>

          <button
            onClick={onBack}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <span>بازگشت به خانه</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>
      </div>

      {/* 1. Main Cognitive IQ Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-amber-950/30 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>ارزیابی چندعاملی ضریب هوش شناختی (Cognitive Quotient)</span>
              <span>·</span>
              <span className="text-emerald-400">اعتبار: {iqReport.confidenceLevel}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-100">
              کهن‌الگو: {iqReport.archetype}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {iqReport.archetypeDesc}
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-medium">
                رتبه صدک: برتر از {iqReport.percentileRank}٪ جامعه
              </span>
              <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-medium">
                طبقه: {iqReport.classification}
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300">
                بر اساس {iqReport.totalGamesSampled} آزمون ثبت‌شده
              </span>
            </div>
          </div>

          {/* Glowing IQ Metric Dial */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800/80 flex flex-col items-center justify-center shrink-0 self-center lg:self-auto min-w-[200px] shadow-lg">
            <span className="text-xs text-slate-400 font-semibold mb-2">ضریب هوش شناختی کل</span>
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-400"
                  strokeWidth="3.2"
                  strokeDasharray={`${Math.min(100, Math.round(((iqReport.compositeIQ - 75) / 70) * 100))}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-black text-amber-400 tabular-nums font-mono block">
                  {iqReport.compositeIQ}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">نمره شاخص IQ</span>
              </div>
            </div>
            <span className="text-[11px] text-emerald-400 font-bold mt-2">
              میانگین پایه جمعیت: ۱۰۰
            </span>
          </div>
        </div>
      </div>

      {/* 2. Detailed Breakdown in 4 Core Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>تحلیل ضریب هوش در ۴ دسته بنیادین</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              تفکیک توانمندی‌های مغز در حافظه، تمرکز، تصمیم‌گیری و پردازش کلامی
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoriesList.map((cat) => {
            const getIcon = () => {
              switch (cat.key) {
                case 'memory':
                  return <Brain className="w-5 h-5 text-indigo-400" />;
                case 'focus':
                  return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
                case 'decision':
                  return <TrendingUp className="w-5 h-5 text-rose-400" />;
                case 'verbal':
                  return <BookOpen className="w-5 h-5 text-amber-400" />;
              }
            };

            return (
              <div
                key={cat.key}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 space-y-4 flex flex-col justify-between transition-all shadow-md"
              >
                <div className="space-y-3">
                  {/* Category Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-2xl ${cat.bgColor} border ${cat.borderColor}`}>
                        {getIcon()}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-100">{cat.title}</h4>
                        <span className="text-[11px] text-slate-400 block">{cat.englishTitle}</span>
                      </div>
                    </div>

                    <div className="text-left shrink-0">
                      <div className="text-base font-black font-mono tabular-nums text-slate-100">
                        IQ {cat.iqScore}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${cat.bgColor} ${cat.color} ${cat.borderColor}`}>
                        {cat.grade}
                      </span>
                    </div>
                  </div>

                  {/* Percentage Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>تطبیق کارایی شناختی:</span>
                      <span className="font-bold text-slate-200">{cat.percentageScore}٪</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          cat.key === 'memory' ? 'bg-indigo-400' :
                          cat.key === 'focus' ? 'bg-emerald-400' :
                          cat.key === 'decision' ? 'bg-rose-400' : 'bg-amber-400'
                        }`}
                        style={{ width: `${cat.percentageScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Strengths & Recommendations */}
                  <div className="space-y-2 text-xs leading-relaxed pt-1">
                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/70">
                      <span className="font-bold text-slate-300 block mb-0.5">نقاط قوت الگو:</span>
                      <p className="text-slate-400">{cat.strengths}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/70">
                      <span className="font-bold text-amber-300 block mb-0.5">توصیه تقویت عملکرد:</span>
                      <p className="text-slate-400">{cat.recommendation}</p>
                    </div>
                  </div>
                </div>

                {/* Associated Games Pill Tags */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>بازی‌های شاخص:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {cat.associatedGames.map((g, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px]">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Overall Stats Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-right">
        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-500 block mb-1">مجموع امتیاز انباشته</span>
          <span className="text-xl font-black text-amber-400 tabular-nums">{stats.totalScore}</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-500 block mb-1">بازی‌های انجام‌شده</span>
          <span className="text-xl font-black text-slate-200 tabular-nums">{stats.gamesPlayed} دور</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-500 block mb-1">پیوستگی حضور در بازی</span>
          <span className="text-xl font-black text-emerald-400 tabular-nums">{stats.dailyStreak} روز</span>
        </div>
      </div>

      {/* 4. مدال‌های دیجیتالی و کارت‌های دستاورد در پروفایل */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-lg">
        <AchievementsCardsSection stats={stats} />
      </div>

      {/* 5. Completed Narrative Cases Dossier */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">پرونده‌های داستانی و رفتاری</h3>
          </div>
          <span className="text-xs text-slate-400">
            {stats.completedCases.length} از ۲ پرونده حل شده
          </span>
        </div>

        {stats.completedCases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stats.completedCases.map((caseId) => (
              <div
                key={caseId}
                className="p-4 bg-slate-950 rounded-2xl border border-emerald-900/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-slate-200">
                    {caseId === 'case_2347' ? 'پرونده: پیام ساعت ۲۳:۴۷' : 'پرونده: زمزمه در راهرو'}
                  </span>
                </div>
                <span className="text-xs text-emerald-400 font-mono">حل شده ✓</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center text-xs text-slate-500">
            هنوز پرونده‌ای را حل نکرده‌اید. برای کشف پرونده‌های رفتاری، بخش «پرونده‌های من» را آغاز کنید.
          </div>
        )}
      </div>

      {/* 5. Ethical Transparency Disclaimer */}
      <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-400/90 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-400 leading-relaxed">
          <span className="font-bold text-slate-300 block">
            اصل شفافیت اخلاقی و مرز محصولات شناختی:
          </span>
          <p>
            ضریب هوش شناختی ارائه‌شده در این اپلیکیشن بر مبنای عملکرد در بازی‌های تعاملی و برای برانگیختن کنجکاوی، سرگرمی، خودآگاهی و تمرین ذهنی است. این شاخص یک معیار خودارزیابی شناختی بوده و به هیچ وجه به عنوان ارزیابی تشخیصی یا آزمون‌های بالینی پزشکی قلمداد نمی‌شود.
          </p>
        </div>
      </div>
    </div>
  );
};
