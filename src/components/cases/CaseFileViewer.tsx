import React, { useState } from 'react';
import { CASES_LIST, CaseFile, CaseStage } from '../../data/casesData';
import { sounds } from '../../services/sound';
import { markCaseCompleted } from '../../services/storage';
import { CaseOfficeSvg } from '../world/WorldLandmarkIllustrations';
import { GameRulesModal } from '../common/GameRulesModal';
import {
  ArrowLeft,
  FileText,
  Clock,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface Props {
  caseId: string;
  onBack: () => void;
}

export const CaseFileViewer: React.FC<Props> = ({ caseId, onBack }) => {
  const caseData: CaseFile | undefined = CASES_LIST.find((c) => c.id === caseId) || CASES_LIST[0];

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [userChoices, setUserChoices] = useState<Record<number, string>>({});
  const [sliderVal, setSliderVal] = useState<number>(65);
  const [stroopTrialIdx, setStroopTrialIdx] = useState(0);
  const [stroopCompleted, setStroopCompleted] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const stage: CaseStage = caseData.stages[currentStageIndex];
  const isLastStage = currentStageIndex === caseData.stages.length - 1;

  const handleSelectChoice = (optionId: string) => {
    sounds.playTap();
    setUserChoices((prev) => ({ ...prev, [stage.id]: optionId }));
  };

  const handleStroopPick = (ans: string) => {
    if (!stage.interactiveTask?.stroopTrials) return;
    const currentTrial = stage.interactiveTask.stroopTrials[stroopTrialIdx];

    if (ans === currentTrial.answer) {
      sounds.playSuccess();
    } else {
      sounds.playError();
    }

    if (stroopTrialIdx + 1 < stage.interactiveTask.stroopTrials.length) {
      setStroopTrialIdx((prev) => prev + 1);
    } else {
      setStroopCompleted(true);
      sounds.playCombo();
    }
  };

  const handleNextStage = () => {
    sounds.playTap();
    if (!isLastStage) {
      setCurrentStageIndex((prev) => prev + 1);
    } else {
      // Complete case
      sounds.playWin();
      setIsRevealed(true);
      markCaseCompleted(caseData.id, 250);
    }
  };

  const isCurrentStageReadyToAdvance = () => {
    if (!stage.interactiveTask) return true;
    if (stage.interactiveTask.type === 'choice') {
      return !!userChoices[stage.id];
    }
    if (stage.interactiveTask.type === 'anchor_slider') {
      return true;
    }
    if (stage.interactiveTask.type === 'quick_stroop') {
      return stroopCompleted;
    }
    return true;
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rotate-180" />
            <span>نقشه جهان</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-400">
            <CaseOfficeSvg className="w-5 h-5 inline-block" />
            <span>مکان: بایگانی کارآگاه شبانه</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1 text-amber-400 font-medium">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{caseData.category}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span>زمان: {caseData.estimatedMinutes} دقیقه</span>
          <button
            onClick={() => { sounds.playTap(); setIsRulesOpen(true); }}
            className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-amber-400 hover:text-amber-300 transition-colors shadow-sm ml-1"
            title="راهنمای پرونده"
            aria-label="قوانین پرونده"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rules Modal */}
      <GameRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        title={caseData.title}
        categoryName="پرونده‌های داستانی ترکیبی"
        duration={`${caseData.estimatedMinutes} دقیقه`}
        rules={[
          'در این پرونده چندمرحله‌ای، با موقعیت‌های تصمیم‌گیری زیر فشار و شواهد ضدونقیض روبرو می‌شوید.',
          'آزمون‌های سرعتی و شناختی در دل روایت رخ می‌دهند و بر نتایج قضاوت تأثیر می‌گذارند.',
          'در هر مرحله شواهد را به دقت مطالعه کرده و تصمیم خود را ثبت کنید.',
          'در پایان پرونده، تحلیل رفتاری و تله‌های شناختی شما فاش می‌شود.',
        ]}
        scoringNote="۲۵۰ امتیاز تجربه کارآگاهی پس از کشف و پایان پرونده"
      />

      {!isRevealed ? (
        <div className="space-y-6">
          {/* Case Dossier Title Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-400">
                گام {stage.id} از {caseData.stages.length}
              </span>
              <span className="text-xs text-slate-500 font-mono">CASE_ID: {caseData.id.toUpperCase()}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100">{caseData.title}</h2>
            <p className="text-xs text-slate-400 mt-1">{caseData.tagline}</p>
          </div>

          {/* Current Stage Content */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs text-amber-400 font-bold block mb-1">{stage.subtitle}</span>
              <h3 className="text-xl font-bold text-slate-100">{stage.title}</h3>
            </div>

            {/* Narrative text */}
            <div className="text-sm md:text-base text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80">
              {stage.narrativeText}
            </div>

            {/* Evidence items if any */}
            {stage.evidenceItems && stage.evidenceItems.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 block">شواهد و مدارک پرونده:</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {stage.evidenceItems.map((ev, i) => (
                    <div key={i} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                      <span className="text-amber-400 font-bold block mb-1">{ev.label}</span>
                      <span className="text-slate-300">{ev.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Task */}
            {stage.interactiveTask && (
              <div className="pt-4 border-t border-slate-800/80 space-y-4">
                <h4 className="text-sm font-bold text-slate-100">
                  {stage.interactiveTask.question}
                </h4>

                {/* Task Type: Choice */}
                {stage.interactiveTask.type === 'choice' && stage.interactiveTask.options && (
                  <div className="space-y-2.5">
                    {stage.interactiveTask.options.map((opt) => {
                      const isSelected = userChoices[stage.id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectChoice(opt.id)}
                          className={`w-full p-4 rounded-2xl border text-right text-sm transition-all flex flex-col gap-1 ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500 text-amber-200 ring-2 ring-amber-500/20'
                              : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="font-semibold leading-relaxed">{opt.label}</span>
                          {isSelected && opt.biasTag && (
                            <span className="text-xs text-amber-400/90 font-mono mt-1">
                              سوگیری نهفته: {opt.biasTag}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Task Type: Quick Stroop under crisis */}
                {stage.interactiveTask.type === 'quick_stroop' && stage.interactiveTask.stroopTrials && (
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-4">
                    {!stroopCompleted ? (
                      <>
                        <span className="text-xs text-slate-400 block">
                          تأیید فوری هویت: رنگ نوشته چیست؟
                        </span>
                        <div className="py-2">
                          <span
                            className="text-4xl font-black"
                            style={{
                              color: stage.interactiveTask.stroopTrials[stroopTrialIdx].color,
                            }}
                          >
                            {stage.interactiveTask.stroopTrials[stroopTrialIdx].word}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
                          {stage.interactiveTask.stroopTrials[stroopTrialIdx].options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleStroopPick(opt)}
                              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs font-bold text-slate-200"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-emerald-400 text-sm font-bold flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>سیستم با موفقیت تأیید شد و از انسداد خارج شدید.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Task Type: Anchor Slider */}
                {stage.interactiveTask.type === 'anchor_slider' && (
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>تخمین حداقل (۰٪)</span>
                      <span className="text-amber-400 font-bold text-lg tabular-nums">
                        {sliderVal}٪
                      </span>
                      <span>تخمین حداکثر (۱۰۰٪)</span>
                    </div>
                    <input
                      type="range"
                      min={stage.interactiveTask.sliderMin || 0}
                      max={stage.interactiveTask.sliderMax || 100}
                      value={sliderVal}
                      onChange={(e) => setSliderVal(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <p className="text-xs text-slate-400 text-center">
                      آیا متوجه شدید عدد ۶۰۰ میلیون در شایعه چطور تخمین شما را لنگر انداخت؟
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Advance Button */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleNextStage}
                disabled={!isCurrentStageReadyToAdvance()}
                className="flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <span>{isLastStage ? 'مشاهده افشاگری نهایی (Reveal)' : 'مرحله بعد پرونده'}</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Final Reveal & Psychological Deep Dive */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 space-y-8 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 mb-2">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-100">افشاگری و تحلیل پرونده</h2>
            <p className="text-xs text-amber-400 font-medium">پاداش حل موفق پرونده: +۲۵۰ امتیاز ثبت شد</p>
          </div>

          {/* Truth Summary */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>حقیقت ماجرا چه بود؟</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {caseData.reveal.truthSummary}
            </p>
          </div>

          {/* Psychological Insights List */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-200">
              خطاهای شناختی و تله‌های فکری تجربه شده در این پرونده:
            </h4>
            <div className="space-y-3">
              {caseData.reveal.psychologicalInsights.map((insight, idx) => (
                <div key={idx} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-amber-400 font-bold text-sm block">
                    {insight.biasName}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {insight.description}
                  </p>
                  <div className="pt-1 text-xs text-slate-400 italic border-t border-slate-900">
                    انعکاس در پرونده: {insight.userReflection}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final takeaway recommendation */}
          <div className="p-5 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-xs text-amber-300 leading-relaxed">
            <span className="font-bold block mb-1">توصیه شناختی برای زندگی و محیط کار:</span>
            {caseData.reveal.finalRecommendation}
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={onBack}
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-md"
            >
              بازگشت به فهرست پرونده‌ها
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
