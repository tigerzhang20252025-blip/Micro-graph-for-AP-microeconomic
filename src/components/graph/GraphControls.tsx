import React from 'react';
import { EconomicModel } from '../../types/graph';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAppState } from '../../context/AppStateContext';
import { RotateCcw, Sliders, Layers, Sparkles } from 'lucide-react';

interface GraphControlsProps {
  model: EconomicModel;
  params: Record<string, any>;
  onParamChange: (key: string, value: any) => void;
  onReset: () => void;
  onApplyPreset: (presetParams: Record<string, any>) => void;
}

export const GraphControls: React.FC<GraphControlsProps> = ({
  model,
  params,
  onParamChange,
  onReset,
  onApplyPreset
}) => {
  const { t, tr } = useLanguage();
  const { layerVisibility, toggleLayer } = useAppState();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-6">
      {/* Controls Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <Sliders className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-slate-800 text-sm sm:text-base">
            {t.controlsPanelTitle}
          </h3>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
          title={t.resetToDefaults}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.resetToDefaults}</span>
        </button>
      </div>

      {/* Preset Scenarios (if available) */}
      {model.presets && model.presets.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {t.presetScenarios}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {model.presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onApplyPreset(preset.params)}
                className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/50 transition-all group"
              >
                <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                  {tr(preset.name)}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                  {tr(preset.description)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Model Controls */}
      <div className="space-y-4 pt-2">
        {model.controls.map((ctrl) => {
          const currentValue = params[ctrl.id] !== undefined ? params[ctrl.id] : model.defaultParams[ctrl.id];

          if (ctrl.type === 'slider') {
            return (
              <div key={ctrl.id} className="space-y-1.5 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-700">{tr(ctrl.label)}</span>
                  <span className="font-mono font-semibold px-2 py-0.5 bg-white border border-slate-200 rounded text-blue-600">
                    {currentValue} {ctrl.unit || ''}
                  </span>
                </div>
                <input
                  type="range"
                  min={ctrl.min}
                  max={ctrl.max}
                  step={ctrl.step}
                  value={currentValue}
                  onChange={(e) => onParamChange(ctrl.id, parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>{ctrl.min} {ctrl.unit || ''}</span>
                  {ctrl.help && <span className="text-slate-500 italic">{tr(ctrl.help)}</span>}
                  <span>{ctrl.max} {ctrl.unit || ''}</span>
                </div>
              </div>
            );
          }

          if (ctrl.type === 'select') {
            return (
              <div key={ctrl.id} className="space-y-1.5 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <label className="text-xs font-medium text-slate-700 block">
                  {tr(ctrl.label)}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  {ctrl.options.map((opt) => {
                    const isSelected = currentValue === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onParamChange(ctrl.id, opt.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-center border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {tr(opt.label)}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }

          if (ctrl.type === 'toggle') {
            return (
              <div key={ctrl.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                <div>
                  <div className="text-xs font-medium text-slate-700">{tr(ctrl.label)}</div>
                  {ctrl.help && <div className="text-[11px] text-slate-400 mt-0.5">{tr(ctrl.help)}</div>}
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(currentValue)}
                    onChange={(e) => onParamChange(ctrl.id, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Layer Visibility Controls */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          <span>{t.graphVisibilityToggle}</span>
        </div>
        <div className="space-y-1.5 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
            <input
              type="checkbox"
              checked={layerVisibility.showSurplus}
              onChange={() => toggleLayer('showSurplus')}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>{t.showSurplusAreas}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
            <input
              type="checkbox"
              checked={layerVisibility.showDropLines}
              onChange={() => toggleLayer('showDropLines')}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>{t.showEquilibriumPoints}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
            <input
              type="checkbox"
              checked={layerVisibility.showGrid}
              onChange={() => toggleLayer('showGrid')}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>{t.showGridLines}</span>
          </label>
        </div>
      </div>
    </div>
  );
};
