import React, { useState, useMemo } from 'react';
import { AP_TOPICS, AP_UNITS } from '../../data/topicRegistry';
import { APUnitId, ScopeClassification, TopicStatus } from '../../types/registry';
import { useLanguage } from '../../i18n/LanguageContext';
import { TopicCard } from './TopicCard';
import { Search, Filter, X, CheckCircle2 } from 'lucide-react';

export const TopicLibrary: React.FC = () => {
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<APUnitId | 'all'>('all');
  const [selectedScope, setSelectedScope] = useState<ScopeClassification | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<TopicStatus | 'all'>('all');

  const filteredTopics = useMemo(() => {
    return AP_TOPICS.filter((topic) => {
      // Unit filter
      if (selectedUnit !== 'all' && topic.unit !== selectedUnit) {
        return false;
      }

      // Scope filter
      if (selectedScope !== 'all' && topic.scope !== selectedScope) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && topic.status !== selectedStatus) {
        return false;
      }

      // Search Query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const titleEn = topic.title.en.toLowerCase();
        const titleZh = topic.title.zh.toLowerCase();
        const descEn = topic.description.en.toLowerCase();
        const descZh = topic.description.zh.toLowerCase();
        const code = topic.topicCode.toLowerCase();
        const officialRef = topic.officialRef.toLowerCase();
        const keywords = topic.keywords.map((k) => k.toLowerCase()).join(' ');

        const match =
          titleEn.includes(q) ||
          titleZh.includes(q) ||
          descEn.includes(q) ||
          descZh.includes(q) ||
          code.includes(q) ||
          officialRef.includes(q) ||
          keywords.includes(q);

        if (!match) return false;
      }

      return true;
    });
  }, [searchQuery, selectedUnit, selectedScope, selectedStatus]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedUnit !== 'all' ||
    selectedScope !== 'all' ||
    selectedStatus !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedUnit('all');
    setSelectedScope('all');
    setSelectedStatus('all');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.cedAlignmentBadge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t.brandTitle}
          </h1>

          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-sans">
            {t.brandSubtitle} — {t.disclaimerText}
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs text-blue-200/80">
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">6 Units (100% CED Coverage)</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">20+ Graphical Models Registry</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">English & Simplified Chinese</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Unit Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              {t.filterByUnit}:
            </span>
            <button
              onClick={() => setSelectedUnit('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedUnit === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.allUnits}
            </button>
            {AP_UNITS.map((unit) => (
              <button
                key={unit.unit}
                onClick={() => setSelectedUnit(unit.unit)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedUnit === unit.unit
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                U{unit.unit}
              </button>
            ))}
          </div>

          {/* Scope and Status Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value as any)}
              className="text-xs font-medium bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">{t.allScopes}</option>
              <option value="core">{t.scopeCore}</option>
              <option value="extension">{t.scopeExtension}</option>
              <option value="excluded">{t.scopeExcluded}</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="text-xs font-medium bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">{t.allStatuses}</option>
              <option value="ready">{t.statusReady}</option>
              <option value="planned">{t.statusPlanned}</option>
              <option value="reference">{t.statusReference}</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 underline"
              >
                {t.clearFilters}
              </button>
            )}
          </div>
        </div>

        {/* Results Count bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 font-mono">
          <span>
            {filteredTopics.length} {t.topicsFound}
          </span>
          <span className="text-[11px] text-slate-400">
            {t.officialCedYear} (2026–27)
          </span>
        </div>
      </div>

      {/* Topics Grid */}
      {filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">
            {t.noTopicsFoundTitle}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t.noTopicsFoundDesc}
          </p>
          <button
            onClick={clearFilters}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            {t.clearFilters}
          </button>
        </div>
      )}
    </div>
  );
};
