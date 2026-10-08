import React, { useState } from 'react';
import { GameId, UserStats } from '../../types/game';
import {
  analyzeCognitiveWeaknesses,
  getDomainWeaknessReport,
  CognitiveWeaknessReport,
} from '../../services/cognitiveWeaknessService';
import { sounds } from '../../services/sound';
import {
  Brain,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  Target,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface Props {
  stats: UserStats;
  onSelectGame: (gameId: GameId) => void;
}

export const WeaknessRecommendationSection: React.FC<Props> = ({ stats, onSelectGame }) => {
  const defaultReport = analyzeCognitiveWeaknesses(stats);
  const [selectedDomain, setSelectedDomain] = useState<keyof UserStats['cognitiveProfile']>(
    defaultReport.domainKey
  );

  const report: CognitiveWeaknessReport =
    selectedDomain === defaultReport.domainKey
      ? defaultReport
      : getDomainWeaknessReport(selectedDomain, stats);

  const handleLaunch = (id: GameId) => {
    sounds.playTap();
    onSelectGame(id);
  };

  const domainTabs: Array<{ key: keyof UserStats['cognitiveProfile']; label: string }> = [
    { key: 'inhibitoryControl', label: 'مهار تکانه (Go/No-Go)' },
    { key: 'processingSpeed', label: 'سرعت پردازش و واکنش' },
    { key: 'cognitiveFlexibility', label: 'انعطاف ذهنی' },
    { key: 'riskRegulation', label: 'تنظیم ریسک و طمع' },
    { key: 'verbalFluency', label: 'روانی کلامی' },
    { key: 'socialPerception', label: 'ادراک اجتماعی' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/95 to-amber-950/20 border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
      {/* Top Banner and Diagnosis */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span>سیستم تحلیل نقاط ضعف شناختی و تمرینات مکمل</span>
            <span aria-hidden="true">·</span>
            <span className="text-rose-400">{report.statusLabel}</span>
          </div>

          <h3 className="text-xl md:text-2xl font-black text-slate-100 flex items-center gap-2">
            <Target className="w-6 h-6 text-amber-400" />
            <span>نقطه نیازمند تقویت: {report.domainLabel.split('(')[0]}</span>
          </h3>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2 text-xs leading-relaxed">
            <div className="flex items-start gap-2 text-amber-300 font-medium">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>نشانه‌های رفتاری در بازی: {report.cognitiveSymptom}</span>
            </div>

            <p className="text-slate-400 pr-6">
              <strong className="text-slate-300">منطق روانشناختی و ریشه عصبی: </strong>
              {report.psychologicalMechanism}
            </p>
          </div>
        </div>

        {/* Current Score Dial Card */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 shrink-0 flex items-center gap-4 self-start">
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-amber-400"
                strokeWidth="3.5"
                strokeDasharray={`${report.currentScore}, 100`}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-sm font-bold tabular-nums text-amber-400 font-mono">
              {report.currentScore}٪
            </span>
          </div>

          <div className="text-xs space-y-1">
            <div className="font-bold text-slate-200">امتیاز فعلی شاخص</div>
            <div className="text-slate-400">معیار استاندارد: ۸۰٪</div>
            <div className="text-[11px] text-amber-400/90 font-medium">
              نیاز به تقویت: {Math.max(0, report.benchmarkScore - report.currentScore)}٪
            </div>
          </div>
        </div>
      </div>

      {/* Domain Switcher Pill Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
        <span className="text-slate-400 font-medium shrink-0 ml-1">بررسی شاخص:</span>
        {domainTabs.map((tab) => {
          const isActive = selectedDomain === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                sounds.playTap();
                setSelectedDomain(tab.key);
              }}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-medium ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 3 Complementary Recommended Games Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>بازی‌های مکمل پیشنهادی برای تقویت این مهارت:</span>
          </span>
          <span className="text-slate-400">انجام روزانه ۱۰ دقیقه توصیه می‌شود</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.recommendedGames.map((game, idx) => (
            <div
              key={game.gameId}
              className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all group shadow-sm hover:-translate-y-0.5"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
                    {game.trainingRole}
                  </span>
                  <span className="text-slate-400">{game.duration}</span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                    {game.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {game.category}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-slate-400 font-normal">علت پیشنهاد: </strong>
                  {game.whyItHelps}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-[11px] text-emerald-400 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>نتیجه: {game.expectedBenefit}</span>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  تمرین شناختی هدفمند
                </span>
                <button
                  onClick={() => handleLaunch(game.gameId)}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-slate-950" />
                  <span>شروع تمرین مکمل</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
