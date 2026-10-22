import React from 'react';
import { ResultMetric } from '../../types/graph';
import { useLanguage } from '../../i18n/LanguageContext';
import { Calculator } from 'lucide-react';

interface GraphResultsProps {
  results: ResultMetric[];
}

export const GraphResults: React.FC<GraphResultsProps> = ({ results }) => {
  const { t, tr } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
          <Calculator className="w-4 h-4" />
        </div>
        <h3 className="font-semibold text-slate-800 text-sm sm:text-base">
          {t.resultsPanelTitle}
        </h3>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {results.map((metric) => (
          <div
            key={metric.id}
            className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors"
          >
            <div className="text-[11px] font-medium text-slate-500 line-clamp-1">
              {tr(metric.label)}
            </div>
            <div
              className="text-base sm:text-lg font-bold font-mono mt-1"
              style={{ color: metric.color || '#0f172a' }}
            >
              {metric.value}
            </div>
            {metric.formula && (
              <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate" title={metric.formula}>
                {metric.formula}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
