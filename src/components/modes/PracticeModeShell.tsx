import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAppState } from '../../context/AppStateContext';
import { Target, CheckCircle2, ArrowRight, BrainCircuit } from 'lucide-react';

export const PracticeModeShell: React.FC = () => {
  const { t } = useLanguage();
  const { navigateToTopic } = useAppState();

  const practiceModules = [
    {
      titleEn: 'Supply & Demand Shift Identification',
      titleZh: '供求曲线平移方向判定与均衡分析',
      descEn: 'Identify price and quantity changes caused by simultaneous shifts in demand and supply.',
      descZh: '分析因供求双重移动导致的均衡价格与数量变动，掌握不确定性（Indeterminate）规律。',
      unit: 'Unit 2',
      status: 'Engine Connected'
    },
    {
      titleEn: 'Tax Incidence & Deadweight Loss Calculation',
      titleZh: '税收归宿分配与无谓损失数理计算',
      descEn: 'Compute exact tax revenue, consumer burden, producer burden, and deadweight loss triangles.',
      descZh: '高精度计算政府税收收入、消费者与生产者税负分摊，以及死重损失三角形面积。',
      unit: 'Unit 2',
      status: 'Engine Connected'
    },
    {
      titleEn: 'Cost Curve Intersections & Profit Maximization (MR = MC)',
      titleZh: '成本曲线交点特征与 MR = MC 利润最大化推导',
      descEn: 'Identify MC = ATC minimum, MC = AVC shutdown point, and firm economic profit zones.',
      descZh: '识别 MC 与 ATC 最低点交点、停产点，推算完全竞争与垄断厂商的超额经济利润区间。',
      unit: 'Unit 3 & 4',
      status: 'Part 3 Target'
    },
    {
      titleEn: 'Externalities & Corrective Pigouvian Policies',
      titleZh: '外部性识别与庇古纠正税/补贴测算',
      descEn: 'Determine the exact per-unit tax or subsidy needed to achieve the socially optimal quantity (Q_SO).',
      descZh: '根据边际外部成本或收益测算使产出达到社会最优水平（Q_SO）所需的单位税或补贴。',
      unit: 'Unit 6',
      status: 'Part 3 Target'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold backdrop-blur-sm">
          <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t.modePractice}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {t.modePracticeComingSoonTitle}
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-sans max-w-3xl">
          {t.modePracticeComingSoonDesc}
        </p>

        <div className="pt-2">
          <button
            onClick={() => {
              navigateToTopic('market-equilibrium-welfare');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold text-xs rounded-xl shadow transition-all"
          >
            <span>{t.openGraph}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Planned Modules Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-600" />
          <span>Interactive Practice Modules (Roadmap for Part 3)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {practiceModules.map((mod, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {mod.unit}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {mod.status}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {mod.titleZh}
                </h3>
                <div className="text-xs text-slate-500 italic mt-0.5">
                  {mod.titleEn}
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {mod.descZh}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Architecture Verified</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
