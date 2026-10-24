import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAppState } from '../../context/AppStateContext';
import { AP_UNITS } from '../../data/topicRegistry';
import {
  AP_DECISION_RULES,
  AP_EXAM_MISTAKES,
  AP_FORMULAS
} from '../../data/referenceContent';
import { searchDictionary } from '../../engine/search/dictionarySearch';
import {
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Search,
  HelpCircle,
  AlertCircle,
  AlertTriangle,
  Scale,
  Sparkles,
  ExternalLink,
  Calculator,
  Lightbulb,
  ArrowRight,
  LayoutGrid,
  Table as TableIcon,
  X
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', en: 'All Categories', zh: '全部类别' },
  { id: 'cost', en: 'Costs & Production', zh: '成本与生产' },
  { id: 'revenue', en: 'Revenue & Profit', zh: '收益与利润' },
  { id: 'elasticity', en: 'Elasticity', zh: '弹性理论' },
  { id: 'welfare', en: 'Welfare & Policy', zh: '福利与管制' },
  { id: 'factor', en: 'Factor Markets', zh: '要素市场' },
  { id: 'externality', en: 'Externalities & Public', zh: '外部性与公共品' },
  { id: 'structure', en: 'Market Structures', zh: '市场竞争形态' }
];

export const ReferenceMode: React.FC = () => {
  const { language, t, tr } = useLanguage();
  const { navigateToGraph } = useAppState();
  const [activeTab, setActiveTab] = useState<'glossary' | 'rules' | 'mistakes' | 'framework'>('glossary');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<number | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewStyle, setViewStyle] = useState<'cards' | 'table'>('cards');

  const isZh = language === 'zh';

  const filteredTerms = searchDictionary(searchTerm, {
    unit: selectedUnit,
    category: selectedCategory !== 'all' ? selectedCategory : undefined
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-sm">
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          <span>{t.modeReference}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {t.officialFrameworkHeader}
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-3xl">
          {t.modeReferenceDesc}
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2 overflow-x-auto scrollbar-thin">
        <button
          onClick={() => setActiveTab('glossary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'glossary'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{t.refTabGlossary}</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'rules'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>{t.refTabRules}</span>
        </button>

        <button
          onClick={() => setActiveTab('mistakes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'mistakes'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{t.refTabMistakes}</span>
        </button>

        <button
          onClick={() => setActiveTab('framework')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'framework'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{t.refTabFramework}</span>
        </button>
      </div>

      {/* Tab 1: Enhanced Dictionary & Acronym Explorer */}
      {activeTab === 'glossary' && (
        <div className="space-y-4">
          {/* Search & Filter Header Panel */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">
                  {isZh ? 'AP 微观经济学核心术语与缩写词典' : 'AP Microeconomics Terminology & Acronym Dictionary'}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
                  {filteredTerms.length} {isZh ? '词条' : 'terms'}
                </span>
              </div>

              {/* View Switcher: Cards vs Table */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                <button
                  onClick={() => setViewStyle('cards')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    viewStyle === 'cards'
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>{isZh ? '卡片视图' : 'Cards'}</span>
                </button>
                <button
                  onClick={() => setViewStyle('table')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    viewStyle === 'table'
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>{isZh ? '紧凑表格' : 'Table'}</span>
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  isZh
                    ? '输入任何 AP 经济学缩写 (MC, ATC, DWL, MRP...)、中英文术语或公式...'
                    : 'Search any acronym (MC, ATC, DWL, MRP...), concept name, or formula...'
                }
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Popular Quick-Select Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                {isZh ? '高频缩写:' : 'Popular:'}
              </span>
              {['MC', 'ATC', 'DWL', 'PED', 'Mr. DARP', 'MRP', 'MSC', 'PPC', 'NE', 'Gini', 'Shutdown Rule'].map((abbr) => (
                <button
                  key={abbr}
                  onClick={() => setSearchTerm(abbr)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold shrink-0 transition-colors ${
                    searchTerm.toLowerCase() === abbr.toLowerCase()
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  {abbr}
                </button>
              ))}
            </div>

            {/* Unit & Category Filter Chips */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
                  Unit:
                </span>
                <button
                  onClick={() => setSelectedUnit(undefined)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                    selectedUnit === undefined
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isZh ? '全部单元' : 'All Units'}
                </button>
                {[1, 2, 3, 4, 5, 6].map((u) => (
                  <button
                    key={u}
                    onClick={() => setSelectedUnit(u)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                      selectedUnit === u
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Unit {u}
                  </button>
                ))}
              </div>

              {/* Categories */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
                  {isZh ? '分类:' : 'Category:'}
                </span>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isZh ? cat.zh : cat.en}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Display */}
          {filteredTerms.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400 space-y-2">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">
                {isZh ? '未找到符合条件的经济学术语或缩写' : 'No matching terms or acronyms found'}
              </p>
              <p className="text-xs text-slate-400">
                {isZh ? '请尝试更换关键词（例如搜索 "MC"、"边际" 或 "DWL"）或重置筛选' : 'Try searching another keyword (e.g. "MC", "elasticity", "DWL") or clear filters'}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedUnit(undefined);
                  setSelectedCategory('all');
                }}
                className="mt-2 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
              >
                {isZh ? '重置全部筛选' : 'Reset all filters'}
              </button>
            </div>
          ) : viewStyle === 'cards' ? (
            /* Cards View */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredTerms.map((term) => (
                <div
                  key={term.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        {term.abbreviation ? (
                          <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-mono font-extrabold text-xs shadow-2xs">
                            {term.abbreviation}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 font-mono font-bold text-xs">
                            U{term.unit}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[11px] font-semibold">
                          Unit {term.unit} ({term.topicCode})
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded uppercase tracking-wider">
                        {term.category}
                      </span>
                    </div>

                    {/* Titles */}
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {isZh ? term.zh : term.en}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {isZh ? term.en : term.zh}
                      </p>
                    </div>

                    {/* Mathematical Formula Callout */}
                    {term.formula && (
                      <div className="p-2.5 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs font-bold border border-slate-800 flex items-start gap-2">
                        <Calculator className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <div className="break-all">{term.formula}</div>
                      </div>
                    )}

                    {/* Definition */}
                    <div className="text-xs text-slate-700 leading-relaxed font-sans space-y-1">
                      <p className="font-medium text-slate-800">{isZh ? term.definition.zh : term.definition.en}</p>
                      <p className="text-slate-400 italic text-[11px]">{isZh ? term.definition.en : term.definition.zh}</p>
                    </div>

                    {/* Real-World Concrete Example */}
                    {term.example && (
                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 space-y-1">
                        <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>{isZh ? '真实案例与典型数值计算' : 'Numerical Example'}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">{tr(term.example)}</p>
                      </div>
                    )}

                    {/* AP Exam Tips */}
                    {term.examTip && (
                      <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-950 space-y-1">
                        <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1">
                          <Lightbulb className="w-3 h-3 text-blue-600" />
                          <span>{isZh ? 'AP 命题与答题要点' : 'AP Exam Tip'}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">{tr(term.examTip)}</p>
                      </div>
                    )}

                    {/* Related Concepts */}
                    {term.relatedConcepts && term.relatedConcepts.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                          {isZh ? '关联概念:' : 'Related:'}
                        </span>
                        {term.relatedConcepts.map((rel) => (
                          <button
                            key={rel.termId}
                            onClick={() => setSearchTerm(rel.labelEn)}
                            className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] font-medium transition-colors"
                          >
                            {isZh ? rel.labelZh : rel.labelEn}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Link to Graph Lab */}
                  {term.linkedModelId && (
                    <div className="pt-3 border-t border-slate-100">
                      <button
                        onClick={() => navigateToGraph(term.linkedModelId!)}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white font-bold text-xs transition-all active:scale-95 group/btn"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-blue-600 group-hover/btn:text-white transition-colors" />
                        <span>{isZh ? '在交互实验室中查看图像模型' : 'Open in Interactive Graph Lab'}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700">
                    <th className="py-2.5 px-3 font-semibold">AP Abbr.</th>
                    <th className="py-2.5 px-3 font-semibold">English Term</th>
                    <th className="py-2.5 px-3 font-semibold">中文术语</th>
                    <th className="py-2.5 px-3 font-semibold">Unit</th>
                    <th className="py-2.5 px-3 font-semibold">Formula / Rule</th>
                    <th className="py-2.5 px-3 font-semibold">Definition</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {filteredTerms.map((term) => (
                    <tr key={term.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600">
                        {term.abbreviation || '—'}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {term.en}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {term.zh}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        Unit {term.unit}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-emerald-700 max-w-xs truncate">
                        {term.formula || '—'}
                      </td>
                      <td className="py-2.5 px-3 text-[11px] max-w-md leading-relaxed">
                        <p className="text-slate-800">{isZh ? term.definition.zh : term.definition.en}</p>
                        <p className="text-slate-400 italic mt-0.5">{isZh ? term.definition.en : term.definition.zh}</p>
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        {term.linkedModelId ? (
                          <button
                            onClick={() => navigateToGraph(term.linkedModelId!)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold text-[11px] transition-colors"
                          >
                            <span>Graph</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Decision Rules & Formulas */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-600" />
              <span>{t.rulesHeader}</span>
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {AP_DECISION_RULES.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {tr(rule.name)}
                    </h3>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {rule.unit}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs font-bold tracking-wide">
                    {rule.condition}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                    {tr(rule.economicMeaning)}
                  </p>

                  <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-1.5">
                    <span className="font-semibold text-slate-600">{t.appliesToLabel}:</span>
                    <span>{tr(rule.appliesTo)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulas Box */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>Core AP Microeconomic Formulas</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {AP_FORMULAS.map((form) => (
                <div key={form.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{tr(form.name)}</h4>
                  <div className="font-mono text-xs font-bold text-purple-700 bg-white p-2 rounded border border-purple-100 break-words">
                    {form.formula}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{tr(form.notes)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Common AP Mistakes */}
      {activeTab === 'mistakes' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>{t.mistakesHeader}</span>
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {AP_EXAM_MISTAKES.map((mistake) => (
              <div
                key={mistake.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4"
              >
                <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>{tr(mistake.mistakeTitle)}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200 space-y-1">
                    <span className="font-bold text-red-800 uppercase tracking-wider text-[11px] block">
                      {t.wrongViewLabel}
                    </span>
                    <p className="text-red-950 leading-relaxed font-sans">
                      {tr(mistake.wrongThinking)}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                    <span className="font-bold text-emerald-800 uppercase tracking-wider text-[11px] block">
                      {t.correctViewLabel}
                    </span>
                    <p className="text-emerald-950 leading-relaxed font-sans">
                      {tr(mistake.correctThinking)}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 font-sans">
                  <span className="font-bold text-slate-700 mr-1">{t.whyItMattersLabel}:</span>
                  {tr(mistake.whyItMatters)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Official Framework */}
      {activeTab === 'framework' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>AP Microeconomics 6 Units & Official Exam Weights</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700">
                    <th className="py-2.5 px-3 font-semibold">Unit</th>
                    <th className="py-2.5 px-3 font-semibold">Title (English / 中文)</th>
                    <th className="py-2.5 px-3 font-semibold">Exam Weight</th>
                    <th className="py-2.5 px-3 font-semibold">Core Graphical Models</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {AP_UNITS.map((u) => (
                    <tr key={u.unit} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                        Unit {u.unit}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-800">{u.title.en}</div>
                        <div className="text-slate-500 text-[11px]">{u.title.zh}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600">
                        {u.examWeight}
                      </td>
                      <td className="py-2.5 px-3 text-[11px] leading-relaxed">
                        {tr(u.description)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Scope Boundaries */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.scopeCore}</span>
              </div>
              <p className="text-xs text-emerald-900/90 leading-relaxed font-sans">
                Strictly tested on College Board AP Microeconomics multiple-choice (MCQ) and free-response (FRQ) exams. Fully modeled in our graph engine.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>{t.scopeExtension}</span>
              </div>
              <p className="text-xs text-amber-900/90 leading-relaxed font-sans">
                Advanced microeconomic topics (e.g. Indifference Curves, Cournot Duopoly) frequently taught in honors or introductory college microeconomics courses.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>{t.scopeExcluded}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Historical concepts removed by College Board (e.g. Kinked Demand Curve) or models exclusive to AP Macroeconomics (e.g. Phillips Curve, AD-AS).
              </p>
            </div>
          </div>

          {/* Official College Board Links */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800">College Board AP Central Official CED Resource</span>
              <p className="text-slate-500 text-[11px]">Official Course and Exam Description reference portal</p>
            </div>
            <a
              href="https://apcentral.collegeboard.org/courses/ap-microeconomics"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              <span>AP Central Microeconomics</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
