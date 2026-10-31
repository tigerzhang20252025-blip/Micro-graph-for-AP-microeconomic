import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { getModelById } from '../../engine/models';
import { AP_TOPICS } from '../../data/topicRegistry';
import { GraphContainer } from './GraphContainer';
import { GraphControls } from './GraphControls';
import { GraphResults } from './GraphResults';
import { ArrowLeft, Lightbulb, GraduationCap, Sparkles } from 'lucide-react';
import { LEARNING_ACTIVITIES } from '../../data/learningActivities';

export const GraphWorkspace: React.FC = () => {
  const {
    selectedModelId,
    selectedTopicId,
    modelParams,
    updateModelParam,
    setModelParams,
    resetModelParams,
    setCurrentView,
    setActiveLearningActivityId
  } = useAppState();

  const { language, t, tr } = useLanguage();

  const model = getModelById(selectedModelId) || getModelById('market-equilibrium-welfare')!;
  const currentTopic = AP_TOPICS.find((top) => top.id === selectedTopicId || top.graphModelId === model.id);
  const matchingActivity = LEARNING_ACTIVITIES.find(
    (a) => a.modelId === model.id || (currentTopic && a.topicId === currentTopic.id)
  );

  const activeParams = modelParams[model.id] || model.defaultParams;

  // Run economic mathematical simulation
  const graphOutput = model.calculate(activeParams);

  const handleParamChange = (key: string, value: any) => {
    updateModelParam(model.id, key, value);
  };

  const handleReset = () => {
    resetModelParams(model.id, model.defaultParams);
  };

  const handleApplyPreset = (presetParams: Record<string, any>) => {
    setModelParams(model.id, presetParams);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Title Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('library')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/70 hover:bg-blue-100/70 px-3 py-1.5 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.backToLibrary}</span>
            </button>

            {matchingActivity && (
              <button
                onClick={() => {
                  setActiveLearningActivityId(matchingActivity.id);
                  setCurrentView('learning');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'zh' ? '前往本考点预测挑战' : 'Try Prediction Challenge'}</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {currentTopic && (
              <>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {t.unit} {currentTopic.unit} ({currentTopic.topicCode})
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {t.scopeCore}
                </span>
              </>
            )}
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {tr(model.name)}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          {tr(model.description)}
        </p>

        {currentTopic && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{t.officialRefLabel}:</span>
            <span className="font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              {currentTopic.officialRef}
            </span>
          </div>
        )}
      </div>

      {/* Main Graph Grid (Chart on Left/Top, Controls on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chart Container, Secondary Graph, Custom Table & Calculations (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <GraphContainer data={graphOutput} title={tr(model.name)} visibilityScope={model.id} />

          {/* Secondary Graph (for Dual-Panel Models like Total Revenue or Firm side-by-side) */}
          {graphOutput.secondaryGraph && (
            <GraphContainer
              data={{
                axes: graphOutput.secondaryGraph.axes,
                curves: graphOutput.secondaryGraph.curves,
                points: graphOutput.secondaryGraph.points,
                shadedAreas: graphOutput.secondaryGraph.shadedAreas || [],
                results: [],
                explanation: { en: '', zh: '' },
                analysisPoints: []
              }}
              title={tr(graphOutput.secondaryGraph.title)}
              visibilityScope={`${model.id}:secondary`}
            />
          )}

          {/* Custom Interactive Table (e.g. Terms of Trade, Elasticity Matrix, Payoff Matrix) */}
          {graphOutput.customTable && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800 text-sm sm:text-base">
                  {tr(graphOutput.customTable.title)}
                </h3>
                {graphOutput.customTable.subtitle && (
                  <span className="text-xs text-slate-500 font-mono">
                    {tr(graphOutput.customTable.subtitle)}
                  </span>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                      {graphOutput.customTable.headers.map((h, i) => (
                        <th key={i} className="py-2.5 px-3 font-semibold">
                          {tr(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {graphOutput.customTable.rows.map((row) => (
                      <tr
                        key={row.id}
                        className={`transition-colors ${
                          row.highlight
                            ? 'bg-blue-50/80 font-semibold text-blue-900 border-l-4 border-blue-600'
                            : 'hover:bg-slate-50/60 text-slate-700'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-medium">
                          {tr(row.label)}
                        </td>
                        {row.values.map((v, valIdx) => (
                          <td key={valIdx} className="py-2.5 px-3 font-mono">
                            {typeof v === 'object' && v !== null && 'en' in v ? tr(v as any) : String(v)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <GraphResults results={graphOutput.results} />
        </div>

        {/* Right Column: Dynamic Parameter Controls & Insights (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <GraphControls
            model={model}
            params={activeParams}
            curves={graphOutput.curves}
            onParamChange={handleParamChange}
            onReset={handleReset}
            onApplyPreset={handleApplyPreset}
          />

          {/* Educational Insights Box */}
          <div className="bg-gradient-to-br from-blue-50/70 via-slate-50 to-indigo-50/60 rounded-2xl border border-blue-100/80 p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>{t.insightsPanelTitle}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
              {tr(graphOutput.explanation)}
            </p>

            {graphOutput.analysisPoints && graphOutput.analysisPoints.length > 0 && (
              <div className="mt-3 pt-3 border-t border-blue-200/40 space-y-2">
                <div className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>AP Key Takeaways</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {graphOutput.analysisPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                      <span>{tr(pt)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
