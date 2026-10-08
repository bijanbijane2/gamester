import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/70 py-8 px-4 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-3">
        {/* Creator Attribution */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-sm font-bold text-amber-400 shadow-md">
          <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          <span>ساخته شده توسط بیژن بیژنه</span>
          <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400/20" />
        </div>

        <p className="text-xs text-slate-400 leading-relaxed max-w-md">
          ذهن و واژه · مجموعه جامع بازی‌های زبانی، هوش کلامی، تصمیم‌گیری و آزمون‌های شناختی تعاملی
        </p>

        <div className="text-[11px] text-slate-500 flex items-center justify-center gap-2">
          <span>طراحی و توسعه اختصاصی</span>
          <span>•</span>
          <span>بیژن بیژنه</span>
          <span>•</span>
          <span>همه حقوق محفوظ است</span>
        </div>
      </div>
    </footer>
  );
};
