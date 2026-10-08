import React, { useState } from 'react';
import { sounds } from '../../services/sound';
import { getCurrentUser } from '../../services/authService';
import { speechCoach } from '../../services/speechCoach';
import { Volume2, VolumeX, Flame, Brain, ShieldCheck, User, Settings, Mic, MicOff } from 'lucide-react';

interface Props {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenDaily: () => void;
  onOpenChainModal?: () => void;
  onOpenMembership?: () => void;
  dailyStreak: number;
}

export const Header: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  onOpenDaily,
  onOpenChainModal,
  onOpenMembership,
  dailyStreak,
}) => {
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const [isSpeechCoachOn, setIsSpeechCoachOn] = useState(speechCoach.isEnabled());
  const currentUser = getCurrentUser();

  const handleToggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) sounds.playTap();
  };

  const handleToggleSpeech = () => {
    sounds.playTap();
    const next = speechCoach.toggleEnabled();
    setIsSpeechCoachOn(next);
    if (next) {
      speechCoach.speak('مربی صوتی ذهن فعال شد.');
    }
  };

  const navLinks = [
    { id: 'home', label: 'نقشه جهان' },
    { id: 'enigma_100', label: 'رمز روز (۱۰۰ مرحله)' },
    { id: 'chain_network', label: 'شبکه زنجیره‌ای' },
    { id: 'fast_play', label: 'سریع بازی کن' },
    { id: 'test_mind', label: 'محک ذهن' },
    { id: 'cases', label: 'پرونده‌ها' },
    { id: 'analytics', label: 'آمار و تحلیل' },
    { id: 'mind_map', label: 'کارنامه هوش' },
    { id: 'admin', label: 'مدیریت بازی' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Zone 1: Single Text Element Brand Wordmark */}
        <button
          onClick={() => { sounds.playTap(); onSelectTab('home'); }}
          className="text-lg md:text-xl font-black tracking-tight text-slate-100 hover:text-amber-400 transition-colors shrink-0"
        >
          ذهن و واژه
        </button>

        {/* Zone 2: 4-6 Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs lg:text-sm font-medium text-slate-400">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  sounds.playTap();
                  if (link.id === 'chain_network') {
                    onOpenChainModal?.();
                  } else {
                    onSelectTab(link.id);
                  }
                }}
                className={`transition-colors py-1 relative ${
                  isActive
                    ? 'text-amber-400 font-bold'
                    : 'hover:text-slate-200'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 Primary Actions */}
        <div className="flex items-center gap-2">
          {/* Cognitive Chain Quick Action */}
          <button
            onClick={() => {
              sounds.playTap();
              onOpenChainModal?.();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all shadow-sm active:scale-95 whitespace-nowrap"
            title="مشاهده شبکه زنجیره روانشناختی بازی‌ها"
          >
            <Brain className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline">زنجیره بازی‌ها</span>
          </button>

          {/* Voice Coach Toggle */}
          <button
            onClick={handleToggleSpeech}
            aria-label={isSpeechCoachOn ? 'مربی صوتی فعال است' : 'مربی صوتی قطع است'}
            title={isSpeechCoachOn ? 'مربی صوتی فارسی فعال است (کلیک برای قطع)' : 'فعال‌سازی مربی صوتی فارسی'}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${
              isSpeechCoachOn
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            {isSpeechCoachOn ? <Mic className="w-4 h-4 text-amber-400" /> : <MicOff className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleMute}
            aria-label={isMuted ? 'فعال‌سازی صدا' : 'قطع صدا'}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Google Membership Account Action */}
          <button
            onClick={() => {
              sounds.playTap();
              onOpenMembership?.();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all text-xs font-semibold ${
              currentUser
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
            title={currentUser ? `حساب کاربری: ${currentUser.name}` : 'ورود با حساب گوگل'}
          >
            {currentUser ? (
              <>
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full object-cover border border-amber-400"
                />
                <span className="hidden sm:inline text-[11px] font-bold truncate max-w-[80px]">
                  {currentUser.name.split(' ')[0]}
                </span>
              </>
            ) : (
              <>
                {/* Google G Logo */}
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="hidden sm:inline text-[11px]">عضویت گوگل</span>
              </>
            )}
          </button>

          {/* Daily Challenge Action Button */}
          <button
            onClick={() => { sounds.playTap(); onOpenDaily(); }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all shadow-sm active:scale-95 whitespace-nowrap"
          >
            <Flame className="w-4 h-4 text-slate-950 fill-slate-950/30" />
            <span>رمز روز</span>
            <span className="tabular-nums font-mono text-[11px] opacity-90 mr-0.5">({dailyStreak}د)</span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="flex md:hidden overflow-x-auto no-scrollbar px-4 py-2 border-t border-slate-900 gap-4 text-xs font-medium text-slate-400 bg-slate-950/95">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => {
              sounds.playTap();
              if (link.id === 'chain_network') {
                onOpenChainModal?.();
              } else {
                onSelectTab(link.id);
              }
            }}
            className={`whitespace-nowrap pb-1 ${
              activeTab === link.id ? 'text-amber-400 font-bold border-b border-amber-400' : 'hover:text-slate-200'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
};
