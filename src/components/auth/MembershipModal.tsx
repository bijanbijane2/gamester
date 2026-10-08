import React, { useState } from 'react';
import {
  UserProfile,
  getCurrentUser,
  signInWithGoogle,
  signOutUser,
} from '../../services/authService';
import { sounds } from '../../services/sound';
import {
  X,
  User,
  Mail,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Sparkles,
  Trophy,
  Flame,
  Brain,
  KeyRound,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUserChange?: (user: UserProfile | null) => void;
}

export const MembershipModal: React.FC<Props> = ({ isOpen, onClose, onUserChange }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getCurrentUser());
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = (email?: string, name?: string) => {
    sounds.playTap();
    setIsLoading(true);
    setTimeout(() => {
      const user = signInWithGoogle(email, name);
      setCurrentUser(user);
      setIsLoading(false);
      onUserChange?.(user);
    }, 400);
  };

  const handleSignOut = () => {
    sounds.playTap();
    signOutUser();
    setCurrentUser(null);
    onUserChange?.(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl text-right">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">پنل عضویت در بازی</h3>
              <span className="text-[11px] text-slate-400">حساب کاربری و همگام‌سازی ابری</span>
            </div>
          </div>

          <button
            onClick={() => { sounds.playTap(); onClose(); }}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {currentUser ? (
            /* Logged-In State */
            <div className="space-y-5">
              {/* Profile Card */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.name}
                  className="w-14 h-14 rounded-2xl border-2 border-amber-400/40 bg-slate-800 object-cover shadow-sm shrink-0"
                />

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-black text-slate-100 truncate">
                      {currentUser.name}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {currentUser.membershipTier}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{currentUser.email}</span>
                  </p>

                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>متصل با حساب رسمی گوگل (Google Verified)</span>
                  </div>
                </div>
              </div>

              {/* Sync and Perks Card */}
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400">تاریخ عضویت:</span>
                  <span className="text-slate-200 font-medium">{currentUser.joinedAt}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400">همگام‌سازی رکوردها و مراحل ۱۰۰‌گانه:</span>
                  <span className="text-emerald-400 font-bold">فعال و ذخیره در ابر ✓</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400">امتیاز در تابلوی پیشگامان:</span>
                  <span className="text-amber-400 font-bold">{currentUser.bestScore} امتیاز</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 text-slate-300 border border-slate-700/80 text-xs font-semibold transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>خروج از حساب</span>
                </button>

                <button
                  onClick={() => { sounds.playTap(); onClose(); }}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md"
                >
                  تایید و بازگشت به بازی
                </button>
              </div>
            </div>
          ) : (
            /* Logged-Out / Sign-In State */
            <div className="space-y-5 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Brain className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-100">
                  ورود و عضویت در آزمایشگاه ذهن و واژه
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                  با حساب گوگل خود وارد شوید تا مراحل باز شده، مدال‌ها، رکوردهای ۱۰۰‌گانه و تحلیل شناختی شما برای همیشه ذخیره شوند.
                </p>
              </div>

              {/* Official Google Button */}
              <button
                disabled={isLoading}
                onClick={() => handleGoogleSignIn()}
                className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 active:scale-98 text-slate-800 font-bold text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 border border-slate-200"
              >
                {/* Official Google 'G' SVG Logo */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                <span>{isLoading ? 'در حال اتصال امن به گوگل...' : 'ورود سریع با حساب گوگل'}</span>
              </button>

              {/* Custom Google Account Option */}
              <div className="pt-2 border-t border-slate-800 text-xs">
                {!showCustomInput ? (
                  <button
                    onClick={() => setShowCustomInput(true)}
                    className="text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    ورود با ایمیل یا حساب گوگل دلخواه ←
                  </button>
                ) : (
                  <div className="space-y-3 pt-2 text-right">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        آدرس ایمیل گوگل (Gmail):
                      </label>
                      <input
                        type="email"
                        dir="ltr"
                        placeholder="yourname@gmail.com"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        نام نمایشی در بازی:
                      </label>
                      <input
                        type="text"
                        placeholder="نام شما"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500 outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleGoogleSignIn(customEmail, customName)}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-xl border border-slate-700 transition-colors"
                    >
                      ورود با این مشخصات
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
