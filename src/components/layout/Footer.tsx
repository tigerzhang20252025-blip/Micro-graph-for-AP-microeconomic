import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-white py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-700">{t.cedAlignmentBadge}</span>
            <span className="text-slate-300">|</span>
            <span>{t.officialCedYear}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px]">
              {t.stageBadge}
            </span>
          </div>
        </div>

        <p className="text-slate-400 text-center md:text-left leading-relaxed">
          {t.disclaimerText} AP® is a trademark registered by the College Board, which is not affiliated with, and does not endorse, this educational tool.
        </p>
      </div>
    </footer>
  );
};
