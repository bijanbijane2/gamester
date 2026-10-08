import React, { useState } from 'react';
import { SOCIAL_SCENARIOS, SocialScenarioItem } from '../../data/cognitiveData';
import { sounds } from '../../services/sound';
import { recordGameResult } from '../../services/storage';
import { GameRulesModal } from '../common/GameRulesModal';
import { ArrowLeft, MessageSquare, CheckCircle2, XCircle, RotateCcw, Lightbulb, Award, HelpCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
  isDaily?: boolean;
  onCompleteDaily?: (score: number) => void;
}

export const SocialMindGame: React.FC<Props> = ({ onBack, isDaily, onCompleteDaily }) => {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const scenario: SocialScenarioItem = SOCIAL_SCENARIOS[scenarioIdx];

  const handleSelectOption = (optId: string) => {
    if (isAnswered) return;
    sounds.playTap();
    setSelectedOptId(optId);
    setIsAnswered(true);

    const chosen = scenario.options.find((o) => o.id === optId);
    const addedPoints = chosen?.isCorrectTruth ? 75 : 25;
    if (chosen?.isCorrectTruth) {
      sounds.playSuccess();
    } else {
      sounds.playError();
    }
    const newTotal = score + addedPoints;
    setScore(newTotal);

    // Auto-advance after exactly 1 second without waiting for user click!
    setTimeout(() => {
      handleNext(newTotal);
    }, 1000);
  };

  const handleNext = (finalScore?: number) => {
    const currentScore = finalScore ?? score;
    if (scenarioIdx + 1 < SOCIAL_SCENARIOS.length) {
      setScenarioIdx((prev) => prev + 1);
      setSelectedOptId(null);
      setIsAnswered(false);
    } else {
      sounds.playWin();
      setIsGameOver(true);
      recordGameResult('social_mind', currentScore, {
        socialPerception: 85,
      });
      if (isDaily && onCompleteDaily) {
        onCompleteDaily(currentScore);
      }
    }
  };

  const handleRestart = () => {
    sounds.playTap();
    setScenarioIdx(0);
    setSelectedOptId(null);
    setIsAnswered(false);
    setScore(0);
    setIsGameOver(false);
  };

  return (
    <div className="max-w-xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <span>بازگشت</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            سناریو {scenarioIdx + 1} از {SOCIAL_SCENARIOS.length}
          </span>
          <button
            onClick={() => { sounds.playTap(); setIsRulesOpen(true); }}
            className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-amber-400 hover:text-amber-300 transition-colors shadow-sm ml-1"
            title="راهنمای بازی"
            aria-label="قوانین بازی"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rules Modal */}
      <GameRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        title="ذهن دیگران و درک نیت (Social Cognition)"
        categoryName="ادراک اجتماعی و نظریه ذهن"
        duration="۱ دقیقه"
        rules={[
          'یک پیام متنی از یک همکار، دوست یا مدیر همراه با زمینه موقعیت به شما نمایش داده می‌شود.',
          'باید انگیزه واقعی، زیرمتن احساسی یا سوگیری پنهان فرستنده را از میان گزینه‌ها تشخیص دهید.',
          'پس از انتخاب گزینه، پاسخ درست نشان داده شده و بازی پس از ۱ ثانیه خودکار به سناریوی بعدی می‌رود.',
        ]}
        scoringNote="۷۵ امتیاز برای تشخیص دقیق نیت واقعی پنهان"
      />

      {!isGameOver ? (
        <div className="space-y-6">
          {/* Simulated Chat Message Bubble */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
                  {scenario.senderName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{scenario.senderName}</h4>
                  <span className="text-xs text-slate-500">{scenario.senderRole}</span>
                </div>
              </div>
              <span className="text-xs text-slate-500">امروز</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 text-sm text-slate-200 leading-relaxed">
              {scenario.messageText}
            </div>

            <p className="text-xs text-slate-400 italic">
              یادداشت زمینه: {scenario.contextNote}
            </p>
          </div>

          <div className="text-center text-xs text-slate-400">
            برداشت و انگیزه پنهان محتمل‌تر فرستنده پیام را انتخاب کنید:
          </div>

          {/* Options */}
          <div className="space-y-3">
            {scenario.options.map((opt) => {
              const isPicked = selectedOptId === opt.id;
              let style = 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200';

              if (isAnswered) {
                if (opt.isCorrectTruth) {
                  style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                } else if (isPicked && !opt.isCorrectTruth) {
                  style = 'bg-rose-950/60 border-rose-500 text-rose-200';
                } else {
                  style = 'bg-slate-950 border-slate-900 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-2xl border text-right text-sm font-medium transition-all flex items-start justify-between gap-3 ${style}`}
                >
                  <span className="leading-relaxed">{opt.text}</span>
                  {isAnswered && (
                    <span className="shrink-0 mt-0.5">
                      {opt.isCorrectTruth ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : isPicked ? (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      ) : null}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Ground truth reveal */}
          {isAnswered && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <Lightbulb className="w-4 h-4" />
                <span>واقعیت پشت پرده (Ground Truth):</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {scenario.groundTruthReveal}
              </p>

              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="text-amber-400/80 animate-pulse">انتقال خودکار در ۱ ثانیه...</span>
                <button
                  onClick={() => handleNext()}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all"
                >
                  {scenarioIdx + 1 < SOCIAL_SCENARIOS.length ? 'سناریو بعدی' : 'جمع‌بندی نهایی'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Finished */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-100">پایان آزمون استنباط ذهن دیگران!</h3>
            <p className="text-slate-400 text-sm mt-1">
              مجموع امتیاز ادراک اجتماعی شما: {score}
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>شروع مجدد</span>
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors"
            >
              بازگشت به خانه
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
