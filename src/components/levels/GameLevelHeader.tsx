import React, { useState } from 'react';
import { GameId } from '../../types/game';
import { GAME_TITLES, getLevelConfig, COGNITIVE_DEPENDENCIES } from '../../services/levelProgression';
import { speechCoach } from '../../services/speechCoach';
import { sounds } from '../../services/sound';
import { Brain, Layers, Target, Clock, ArrowRight, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface Props {
  gameId: GameId;
  currentLevel: number;
  onOpenLevelSelect: () => void;
  onOpenChainMap: () => void;
  onBack: () => void;
}

export const GameLevelHeader: React.FC<Props> = ({
  gameId,
  currentLevel,
  onOpenLevelSelect,
  onOpenChainMap,
  onBack,
}) => {
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(speechCoach.isEnabled());
  const config = getLevelConfig(currentLevel);
  const dep = COGNITIVE_DEPENDENCIES[gameId];

  const handleToggleSpeech = () => {
    sounds.playTap();
    const next = speechCoach.toggleEnabled();
    setIsSpeechEnabled(next);
    if (next) {
      speechCoach.speak('مربی صوتی ذهن فعال است.');
    }
  };

  const toPersianNum = (n: number | string): string => {
    const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return n.toString().replace(/\d/g, (d) => pDigits[parseInt(d, 10)]);
  };

  return (
    <div className="bg-slate-900/90 border-b border-slate-800/90 py-2.5 px-4 backdrop-blur-sm sticky top-16 z-30 font-sans text-right">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Level badge & details */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              sounds.playTap();
              onOpenLevelSelect();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold transition-all shadow-sm group"
            title="انتخاب از بین ۱۰۰ مرحله"
          >
            <Layers className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span>مرحله {toPersianNum(currentLevel)} از ۱۰۰</span>
            <span className="text-[10px] text-amber-300/70 font-normal mr-0.5">▾</span>
          </button>

          <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-medium ${config.tierColor}`}>
            {config.tierLabel.split(' ')[0]}
          </span>

          <span className="hidden sm:inline-flex items-center gap-1 text-slate-400 text-[11px]">
            <Target className="w-3 h-3 text-amber-400" />
            <span>هدف: {toPersianNum(config.targetScore)} امتیاز</span>
          </span>
        </div>

        {/* Right: Psychological connection link & chain button */}
        <div className="flex items-center gap-2">
          {dep && (
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-slate-400">
              <span className="text-slate-500">زنجیره:</span>
              <span className="text-cyan-300 font-medium">{dep.cognitiveSkill}</span>
            </span>
          )}

          {/* Speech Coach toggle */}
          <button
            onClick={handleToggleSpeech}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border transition-colors text-[11px] ${
              isSpeechEnabled
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
            }`}
            title={isSpeechEnabled ? 'مربی صوتی فعال است (کلیک برای قطع)' : 'فعال‌سازی مربی صوتی هوش شناختی'}
          >
            {isSpeechEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span className="hidden sm:inline">
              {isSpeechEnabled ? 'مربی صوتی: روشن' : 'مربی صوتی: خاموش'}
            </span>
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              onOpenChainMap();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px]"
            title="مشاهده نقشه ارتباط روانشناختی بازی‌ها"
          >
            <Brain className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">زنجیره شناختی</span>
          </button>
        </div>
      </div>
    </div>
  );
};
