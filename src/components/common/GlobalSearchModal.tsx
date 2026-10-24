import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAppState } from '../../context/AppStateContext';
import { searchDictionary, getTermById } from '../../engine/search/dictionarySearch';
import { EconomicTermDefinition } from '../../data/economicDictionary';
import {
  Search,
  X,
  ExternalLink,
  BookOpen,
  Sparkles,
  Calculator,
  Lightbulb,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_ACRONYMS = ['MC', 'ATC', 'DWL', 'PED', 'Mr. DARP', 'MRP', 'MSC', 'PPC', 'NE', 'Gini', 'TRPE', 'HHI', 'FOP', 'MRC'];

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { language, tr } = useLanguage();
  const { navigateToGraph, setCurrentView } = useAppState();

  const [query, setQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<number | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTermId, setActiveTermId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedUnit(undefined);
      setSelectedCategory('all');
      setActiveTermId(null);
    }
  }, [isOpen]);

  // Global Esc key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = searchDictionary(query, {
    unit: selectedUnit,
    category: selectedCategory !== 'all' ? selectedCategory : undefined
  });

  const activeTerm: EconomicTermDefinition | undefined = activeTermId
    ? getTermById(activeTermId)
    : results.length > 0
    ? results[0]
    : undefined;

  const handleSelectTerm = (term: EconomicTermDefinition) => {
    setActiveTermId(term.id);
  };

  const handleNavigateToGraph = (modelId: string) => {
    onClose();
    navigateToGraph(modelId);
  };

  const handleViewInReference = () => {
    onClose();
    setCurrentView('reference');
  };

  const isZh = language === 'zh';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Search className="w-5 h-5" />
          </div>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveTermId(null); // Reset selection to top match
              }}
              placeholder={
                isZh
                  ? '搜索 AP 经济学缩写（如 MC, ATC, DWL, MRP）或概念定义...'
                  : 'Search AP Micro acronym (e.g. MC, ATC, DWL, MRP) or concept...'
              }
              className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-200/80 text-slate-600 hover:bg-slate-300 hover:text-slate-900 transition-colors flex items-center gap-1"
          >
            <span>ESC</span>
          </button>
        </div>

        {/* Quick Filters & Popular Acronym Tags */}
        <div className="px-4 py-2.5 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Quick Acronym Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              {isZh ? '热门缩写:' : 'Popular:'}
            </span>
            {POPULAR_ACRONYMS.map((abbr) => (
              <button
                key={abbr}
                onClick={() => {
                  setQuery(abbr);
                  setActiveTermId(null);
                }}
                className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold transition-colors ${
                  query.toUpperCase() === abbr.toUpperCase()
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                {abbr}
              </button>
            ))}
          </div>

          {/* Unit Filter Selector */}
          <div className="flex items-center gap-1 shrink-0 ml-auto">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              value={selectedUnit || ''}
              onChange={(e) => setSelectedUnit(e.target.value ? Number(e.target.value) : undefined)}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="">{isZh ? '全部单元 (Unit 1-6)' : 'All Units (1-6)'}</option>
              <option value="1">Unit 1: Basic Economic Concepts</option>
              <option value="2">Unit 2: Supply & Demand</option>
              <option value="3">Unit 3: Production, Cost & Perfect Comp.</option>
              <option value="4">Unit 4: Imperfect Competition</option>
              <option value="5">Unit 5: Factor Markets</option>
              <option value="6">Unit 6: Market Failure & Gov. Role</option>
            </select>
          </div>
        </div>

        {/* Content Body: Left Results List, Right Detailed View */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Left Column: Result items (4 or 5 columns on desktop) */}
          <div className="md:col-span-5 overflow-y-auto max-h-[380px] md:max-h-[520px] p-2 space-y-1">
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>{isZh ? `匹配结果 (${results.length})` : `Matches (${results.length})`}</span>
              {results.length > 0 && <span className="text-[10px] lowercase text-slate-400">click to view details</span>}
            </div>

            {results.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <BookOpen className="w-8 h-8 mx-auto text-slate-300 stroke-[1.5]" />
                <p className="text-xs font-medium">
                  {isZh ? '未找到匹配的概念或缩写' : 'No matching economic terms or acronyms found'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {isZh ? '请尝试输入 "MC", "ATC", "弹性" 或清除筛选' : 'Try searching "MC", "ATC", "elasticity" or clear filters'}
                </p>
              </div>
            ) : (
              results.map((term) => {
                const isSelected = activeTerm?.id === term.id;
                return (
                  <div
                    key={term.id}
                    onClick={() => handleSelectTerm(term)}
                    className={`p-2.5 rounded-xl cursor-pointer transition-all border text-left flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-300 shadow-xs'
                        : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    {term.abbreviation ? (
                      <span className="shrink-0 px-2 py-1 rounded-md bg-blue-600 text-white font-mono font-bold text-xs tracking-wide">
                        {term.abbreviation.split('/')[0].trim()}
                      </span>
                    ) : (
                      <span className="shrink-0 px-2 py-1 rounded-md bg-slate-200 text-slate-700 font-mono font-bold text-xs">
                        U{term.unit}
                      </span>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {isZh ? term.zh : term.en}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          U{term.unit}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {isZh ? term.en : term.zh}
                      </p>
                      {term.formula && (
                        <p className="text-[10px] font-mono text-emerald-700 bg-emerald-50 rounded px-1.5 py-0.5 mt-1 truncate border border-emerald-200/50">
                          {term.formula}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Detailed Term Card (7 columns on desktop) */}
          <div className="md:col-span-7 overflow-y-auto max-h-[420px] md:max-h-[520px] p-4 sm:p-5 bg-slate-50/40 space-y-4">
            {activeTerm ? (
              <div className="space-y-4">
                {/* Header info */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {activeTerm.abbreviation && (
                      <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-mono font-extrabold text-sm shadow-xs">
                        {activeTerm.abbreviation}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold text-xs">
                      Unit {activeTerm.unit} ({activeTerm.topicCode})
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 font-medium text-xs uppercase tracking-wider">
                      {activeTerm.category}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    {isZh ? activeTerm.zh : activeTerm.en}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    {isZh ? activeTerm.en : activeTerm.zh}
                  </p>
                </div>

                {/* Formula Highlight Box */}
                {activeTerm.formula && (
                  <div className="p-3 rounded-xl bg-slate-900 text-white space-y-1 shadow-xs border border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                      <Calculator className="w-3.5 h-3.5" />
                      <span>{isZh ? '数学计算公式 / 判定条件' : 'Mathematical Formula / Decision Rule'}</span>
                    </div>
                    <div className="font-mono text-xs sm:text-sm font-bold text-emerald-300 tracking-wide break-all">
                      {activeTerm.formula}
                    </div>
                    {activeTerm.unitOfMeasure && (
                      <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                        <span className="font-semibold text-slate-300">{isZh ? '度量单位: ' : 'Unit of Measure: '}</span>
                        {tr(activeTerm.unitOfMeasure)}
                      </div>
                    )}
                  </div>
                )}

                {/* Definition */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                    <span>{isZh ? '官方考纲概念定义' : 'Official CED Definition'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                    {isZh ? activeTerm.definition.zh : activeTerm.definition.en}
                  </p>
                  <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-100">
                    {isZh ? activeTerm.definition.en : activeTerm.definition.zh}
                  </p>
                </div>

                {/* Real-World Concrete Example */}
                {activeTerm.example && (
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1 shadow-xs">
                    <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isZh ? '真实案例与典型数值计算' : 'Real-World Example & Numerical Calculation'}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-sans">
                      {tr(activeTerm.example)}
                    </p>
                  </div>
                )}

                {/* AP Exam Tips */}
                {activeTerm.examTip && (
                  <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 space-y-1 shadow-xs">
                    <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
                      <span>{isZh ? 'AP 考卷避坑指南 & 高频命题点' : 'AP Exam Tips & Common Trap Analysis'}</span>
                    </div>
                    <p className="text-xs text-blue-950 leading-relaxed font-sans">
                      {tr(activeTerm.examTip)}
                    </p>
                  </div>
                )}

                {/* Key Characteristics */}
                {activeTerm.keyCharacteristics && activeTerm.keyCharacteristics.length > 0 && (
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {isZh ? '核心特征清单' : 'Key Characteristics'}
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {activeTerm.keyCharacteristics.map((char, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{tr(char)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Related Concepts */}
                {activeTerm.relatedConcepts && activeTerm.relatedConcepts.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {isZh ? '关联概念链与对比 (点击直接跳转):' : 'Related Concepts & Comparisons:'}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeTerm.relatedConcepts.map((rel) => (
                        <button
                          key={rel.termId}
                          onClick={() => {
                            const target = getTermById(rel.termId);
                            if (target) {
                              if (selectedUnit && target.unit !== selectedUnit) {
                                setSelectedUnit(undefined);
                              }
                              if (selectedCategory !== 'all' && target.category !== selectedCategory) {
                                setSelectedCategory('all');
                              }
                              setQuery(isZh ? target.zh : target.en);
                              setActiveTermId(target.id);
                            } else {
                              const cleanFallback = (isZh ? rel.labelZh : rel.labelEn).replace(/\([^)]*\)/g, '').trim();
                              setQuery(cleanFallback);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 hover:text-blue-700 transition-colors text-xs font-medium flex items-center gap-1.5 shadow-2xs group"
                        >
                          <span className="font-semibold">{isZh ? rel.labelZh : rel.labelEn}</span>
                          <span className="text-[10px] text-slate-400 group-hover:text-blue-500">
                            ({isZh ? rel.relationZh : rel.relationEn})
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-200/80">
                  {activeTerm.linkedModelId && (
                    <button
                      onClick={() => handleNavigateToGraph(activeTerm.linkedModelId!)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>{isZh ? '在交互实验室中打开此模型' : 'Open in Interactive Graph Lab'}</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  )}

                  <button
                    onClick={handleViewInReference}
                    className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-200/70 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{isZh ? '前往速查中心' : 'View in Reference'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400 space-y-2">
                <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-medium">
                  {isZh ? '在左侧选择一个术语以查看详细公式、举例和考点' : 'Select a term on the left to see details, formulas, and examples'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 bg-slate-100/90 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-600 text-[10px]">ESC</kbd>
              <span>{isZh ? '关闭' : 'close'}</span>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-600 text-[10px]">⌘K</kbd>
              <span>{isZh ? '全局随时唤起' : 'shortcut anytime'}</span>
            </span>
          </div>

          <span className="font-sans text-[11px] text-slate-400">
            {isZh ? '覆盖 AP 考纲 6 大单元全部 50+ 核心缩写与概念' : '50+ AP Micro CED Terms & Acronyms'}
          </span>
        </div>
      </div>
    </div>
  );
};
