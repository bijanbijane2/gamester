import React from 'react';
import { HelpCircle, X, CheckCircle2, Award, Clock } from 'lucide-react';
import { sounds } from '../../services/sound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  categoryName: string;
  rules: string[];
  scoringNote?: string;
  duration?: string;
}

export const GameRulesModal: React.FC<Props> = ({
  isOpen,
  onClose,
  title,
  categoryName,
  rules,
  scoringNote,
  duration,
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    sounds.playTap();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 md:p-8 max-w-md w-full relative shadow-2xl space-y-5 text-slate-100">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-amber-400 font-medium block">{categoryName}</span>
            <h3 className="text-lg font-bold text-slate-100">راهنما و قوانین: {title}</h3>
          </div>
        </div>

        {/* Duration badge if any */}
        {duration && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>مدت زمان معمول: </span>
            <span className="font-bold text-slate-200">{duration}</span>
          </div>
        )}

        {/* Rules list */}
        <div className="space-y-2.5">
          <span className="text-xs font-semibold text-slate-400 block">چگونه بازی کنیم؟</span>
          <div className="space-y-2">
            {rules.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scoring note if any */}
        {scoringNote && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-2 text-xs text-amber-300 leading-relaxed">
            <Award className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <span className="font-bold block mb-0.5">امتیازدهی:</span>
              <span>{scoringNote}</span>
            </div>
          </div>
        )}

        {/* Got it button */}
        <button
          onClick={handleClose}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
        >
          متوجه شدم، بزن بریم!
        </button>
      </div>
    </div>
  );
};
