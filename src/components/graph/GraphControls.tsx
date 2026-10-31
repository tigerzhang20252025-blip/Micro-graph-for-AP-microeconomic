import React, { useState } from 'react';
import { EconomicModel, CurveSpec } from '../../types/graph';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAppState } from '../../context/AppStateContext';
import { RotateCcw, Sliders, Layers, Sparkles, ChevronDown, ChevronUp, Eye } from 'lucide-react';

interface GraphControlsProps {
  model: EconomicModel;
  params: Record<string, any>;
  curves?: CurveSpec[];
  onParamChange: (key: string, value: any) => void;
  onReset: () => void;
  onApplyPreset: (presetParams: Record<string, any>) => void;
}

export const GraphControls: React.FC<GraphControlsProps> = ({
  model,
  params,
  curves,
  onParamChange,
  onReset,
  onApplyPreset
}) => {
  const { language, t, tr } = useLanguage();
  const { layerVisibility, toggleLayer, hiddenCurveIds, toggleCurveVisibility } = useAppState();
  const [expandedPresets, setExpandedPresets] = useState(false);

  const presets = model.presets || [];
  const presetsToShow = expandedPresets ? presets : presets.slice(0, 4);

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
      {presets.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.presetScenarios}</span>
              <span className="text-[11px] font-normal text-slate-400 font-mono">
                ({presets.length})
              </span>
            </label>
            {presets.length > 4 && (
              <button
                type="button"
                onClick={() => setExpandedPresets(!expandedPresets)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-0.5 transition-colors"
              >
                <span>{expandedPresets ? t.showFewerPresets : t.showAllPresets}</span>
                {expandedPresets ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2">
            {presetsToShow.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onApplyPreset(preset.params)}
                className="text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/50 transition-all group"
              >
                <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-700 flex items-center justify-between">
                  <span>{tr(preset.name)}</span>
                  <span className="text-[10px] text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded border border-blue-100 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {language === 'zh' ? '应用预设' : 'Apply'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {tr(preset.description)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Model Controls */}
      <div className="space-y-4 pt-1">
        {model.controls.map((ctrl) => {
          const currentValue = params[ctrl.id] !== undefined ? params[ctrl.id] : model.defaultParams[ctrl.id];

          if (ctrl.type === 'slider') {
            const isControlledPriceNone = ctrl.id === 'controlledPrice' && params.priceControlMode === 'none';

            return (
              <div
                key={ctrl.id}
                className={`space-y-1.5 p-3 rounded-xl border transition-colors ${
                  isControlledPriceNone
                    ? 'bg-slate-50/40 border-slate-200/60 opacity-60'
                    : 'bg-slate-50/70 border-slate-100'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{tr(ctrl.label)}</span>
                  <span className="font-mono font-semibold px-2 py-0.5 bg-white border border-slate-200 rounded text-blue-600 shadow-2xs">
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
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>{ctrl.min} {ctrl.unit || ''}</span>
                  {ctrl.help && <span className="text-slate-500 italic max-w-[200px] text-center truncate">{tr(ctrl.help)}</span>}
                  <span>{ctrl.max} {ctrl.unit || ''}</span>
                </div>
                {isControlledPriceNone && (
                  <div className="text-[11px] text-amber-700 bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-200 mt-1">
                    {language === 'zh'
                      ? '提示：当前价格管制为“无管制”，该管制价格滑块在上方选择“最高限价”或“最低限价”后生效。'
                      : 'Note: Price control is currently None. Select Price Ceiling or Floor above to activate this price level.'}
                  </div>
                )}
              </div>
            );
          }

          if (ctrl.type === 'select') {
            const isTwoOptions = ctrl.options.length === 2;

            return (
              <div key={ctrl.id} className="space-y-2 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-800">
                    {tr(ctrl.label)}
                  </label>
                  {ctrl.help && <span className="text-[10px] text-slate-400 italic">{tr(ctrl.help)}</span>}
                </div>

                {isTwoOptions ? (
                  <div className="grid grid-cols-2 gap-2">
                    {ctrl.options.map((opt) => {
                      const isSelected = currentValue === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => onParamChange(ctrl.id, opt.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-medium transition-all text-center border ${
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
                ) : (
                  <div className="space-y-1.5">
                    {ctrl.options.map((opt) => {
                      const isSelected = currentValue === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => onParamChange(ctrl.id, opt.id)}
                          className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition-all text-left flex items-center justify-between border ${
                            isSelected
                              ? 'bg-blue-50 text-blue-900 border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <span className="leading-snug pr-2">{tr(opt.label)}</span>
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          if (ctrl.type === 'toggle') {
            return (
              <div key={ctrl.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="pr-3">
                  <div className="text-xs font-semibold text-slate-800">{tr(ctrl.label)}</div>
                  {ctrl.help && <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{tr(ctrl.help)}</div>}
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
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
      <div className="pt-2 border-t border-slate-100 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          <span>{t.graphVisibilityToggle}</span>
        </div>
        <div className="grid grid-cols-1 gap-1.5 text-xs">
          <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 text-slate-700">
            <input
              type="checkbox"
              checked={layerVisibility.showSurplus}
              onChange={() => toggleLayer('showSurplus')}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium">{t.showSurplusAreas}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 text-slate-700">
            <input
              type="checkbox"
              checked={layerVisibility.showDropLines}
              onChange={() => toggleLayer('showDropLines')}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium">{t.showEquilibriumPoints}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 text-slate-700">
            <input
              type="checkbox"
              checked={layerVisibility.showGrid}
              onChange={() => toggleLayer('showGrid')}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium">{t.showGridLines}</span>
          </label>
        </div>

        {/* Dynamic Individual Curve Visibility Controls */}
        {curves && curves.length > 0 && (
          <div className="pt-2.5 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.showCurveLayers}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
              {curves.map((curve) => {
                const isVisible = !(hiddenCurveIds[model.id] || []).includes(curve.id);
                return (
                  <label
                    key={curve.id}
                    className={`flex items-center gap-2 cursor-pointer p-2 rounded-xl border transition-colors ${
                      isVisible
                        ? 'bg-slate-50/80 border-slate-200 text-slate-800'
                        : 'bg-white border-dashed border-slate-200 text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={() => toggleCurveVisibility(model.id, curve.id)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: curve.color }}
                    />
                    <span className="truncate font-medium">{tr(curve.name)}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
