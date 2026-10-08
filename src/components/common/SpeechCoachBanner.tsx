import React, { useState, useEffect } from 'react';
import { speechCoach, SpeechContext } from '../../services/speechCoach';
import { Volume2, VolumeX, Sparkles, Brain, X, MessageSquareQuote } from 'lucide-react';
import { sounds } from '../../services/sound';

export const SpeechCoachBanner: React.FC = () => {
  const [currentText, setCurrentText] = useState<string | null>(null);
  const [currentContext, setCurrentContext] = useState<SpeechContext>('game_start');
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(speechCoach.isEnabled());

  useEffect(() => {
    const unsubscribe = speechCoach.subscribe((text, context) => {
      setCurrentText(text);
      setCurrentContext(context);
      setIsVisible(true);

      // Auto dismiss after 4.5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 4500);

      return () => clearTimeout(timer);
    });

    return () => unsubscribe();
  }, []);

  const handleToggle = () => {
    sounds.playTap();
    const next = speechCoach.toggleEnabled();
    setIsEnabled(next);
    if (next) {
      speechCoach.speak('راهنمای صوتی و انگیزشی فعال شد.');
    }
  };

  const getContextLabel = (ctx: SpeechContext) => {
    switch (ctx) {
      case 'combo_high':
        return 'شتاب شناختی';
      case 'mistake_calm':
        return 'تنظیم هیجان و دقت';
      case 'level_complete':
        return 'دستاورد عصبی';
      case 'near_end':
        return 'تمرکز نهایی';
      case 'game_start':
      default:
        return 'مربی صوتی ذهن';
    }
  };

  if (!isVisible || !currentText) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 right-4 left-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-bounce-in font-sans select-none pointer-events-auto"
    >
      <div className="bg-slate-900/95 backdrop-blur-md border border-amber-500/40 hover:border-amber-400 shadow-2xl rounded-2xl p-3.5 flex items-start gap-3 text-right">
        {/* Animated Sound Wave / Coach Icon */}
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {getContextLabel(currentContext)}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">بازخورد گفتاری Web Speech</span>
          </div>

          <p className="text-xs font-semibold text-slate-100 leading-relaxed">
            «{currentText}»
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-500 hover:text-slate-300 transition-colors p-1"
          title="بستن پیام"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
