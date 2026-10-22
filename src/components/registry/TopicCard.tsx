import React from 'react';
import { APTopic } from '../../types/registry';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAppState } from '../../context/AppStateContext';
import { ArrowRight, CheckCircle2, Clock, HelpCircle } from 'lucide-react';

interface TopicCardProps {
  topic: APTopic;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  const { t, tr } = useLanguage();
  const { navigateToTopic } = useAppState();

  const getScopeBadge = () => {
    switch (topic.scope) {
      case 'core':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            {t.scopeCore}
          </span>
        );
      case 'extension':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <HelpCircle className="w-3 h-3" />
            {t.scopeExtension}
          </span>
        );
      case 'excluded':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {t.scopeExcluded}
          </span>
        );
    }
  };

  const getStatusBadge = () => {
    switch (topic.status) {
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            {t.statusReady}
          </span>
        );
      case 'planned':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-200">
            <Clock className="w-3 h-3" />
            {t.statusPlanned}
          </span>
        );
      case 'reference':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 border border-slate-200">
            {t.statusReference}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group">
      <div>
        {/* Card Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            {topic.unit > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                Unit {topic.unit} ({topic.topicCode})
              </span>
            )}
            {getScopeBadge()}
          </div>
          {getStatusBadge()}
        </div>

        {/* Title & Subtitle */}
        <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-blue-600 transition-colors">
          {tr(topic.title)}
        </h3>
        <p className="text-xs font-medium text-slate-500 mt-1 line-clamp-1">
          {tr(topic.subtitle)}
        </p>

        {/* Description */}
        <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
          {tr(topic.description)}
        </p>

        {/* Official CED Reference */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-600">{t.officialRefLabel}: </span>
          <span className="font-mono text-slate-500">{topic.officialRef}</span>
        </div>

        {/* Key Terminology Pills */}
        {topic.keyTerms && topic.keyTerms.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {topic.keyTerms.slice(0, 3).map((term, i) => (
              <span
                key={i}
                className="text-[10px] font-medium bg-slate-100/70 text-slate-600 px-2 py-0.5 rounded-md"
              >
                {tr(term)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        {topic.examWeight && (
          <span className="text-[11px] font-medium text-slate-400">
            {t.examWeightLabel}: <strong className="text-slate-600 font-mono">{topic.examWeight}</strong>
          </span>
        )}

        {topic.status === 'ready' ? (
          <button
            onClick={() => navigateToTopic(topic.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 group-hover:translate-x-0.5 transition-all ml-auto"
          >
            <span>{t.openGraph}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="text-[11px] text-slate-400 italic ml-auto">
            {t.statusPlanned}
          </span>
        )}
      </div>
    </div>
  );
};
