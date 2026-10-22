import { EconomicModel, GraphCalculationOutput, ScenarioPreset, CurveSpec, KeyPointSpec, ShadedAreaSpec } from '../../types/graph';
import { generateLinearPoints } from '../economicMath';

export interface ExternalityParams {
  externalityType: 'negative_production' | 'positive_consumption';
  externalityMagnitude: number; // Size of MEC or MEB (e.g. 10 to 40, default 25)
  correctivePolicyActive: boolean; // Pigouvian tax or subsidy turned on/off
  privateDemandIntercept: number; // default 100
  privateSupplyIntercept: number; // default 20
}

const defaultParams: ExternalityParams = {
  externalityType: 'negative_production',
  externalityMagnitude: 24,
  correctivePolicyActive: false,
  privateDemandIntercept: 100,
  privateSupplyIntercept: 20
};

const presets: ScenarioPreset[] = [
  {
    id: 'negative-pollution-unregulated',
    name: {
      en: 'Negative Production Externality (Unregulated Overproduction & DWL)',
      zh: '负面生产外部性（未管制污染过度生产与死重损失）'
    },
    description: {
      en: 'Firms emit pollution without bearing social costs (MSC > MPC). The free market produces too much (Qm > Qopt), causing a deadweight loss triangle pointing to the social optimum.',
      zh: '厂商排放污染但无需承担外部社会成本（MSC > MPC）。自由市场过度生产（Qm > Qopt），产生朝向社会最优点的无谓损失三角形。'
    },
    params: {
      externalityType: 'negative_production',
      externalityMagnitude: 24,
      correctivePolicyActive: false,
      privateDemandIntercept: 100,
      privateSupplyIntercept: 20
    }
  },
  {
    id: 'negative-pigouvian-tax',
    name: {
      en: 'Pigouvian Corrective Tax (Restores Social Optimum Qopt)',
      zh: '庇古矫正税调节（征收单位税 = MEC，完全消除无谓损失）'
    },
    description: {
      en: 'A per-unit Pigouvian tax equal to Marginal External Cost (MEC) internalizes the externality, shifting MPC up to MSC and bringing output to the socially efficient level.',
      zh: '政府征收等于边际外部成本（MEC）的单位庇古税，将外部性内部化，推动 MPC 向上平移与 MSC 重合，完美恢复社会配置效率。'
    },
    params: {
      externalityType: 'negative_production',
      externalityMagnitude: 24,
      correctivePolicyActive: true,
      privateDemandIntercept: 100,
      privateSupplyIntercept: 20
    }
  },
  {
    id: 'positive-vaccine-unregulated',
    name: {
      en: 'Positive Consumption Externality (Unregulated Underproduction)',
      zh: '正面消费外部性（未补贴疫苗消费不足与死重损失）'
    },
    description: {
      en: 'Consumption yields spillover social benefits (e.g. vaccines, education: MSB > MPB). Unregulated markets underproduce (Qm < Qopt), creating deadweight loss.',
      zh: '消费产生外溢社会收益（如疫苗接种、教育普及：MSB > MPB）。自由市场产量不足（Qm < Qopt），造成社会净福利损失。'
    },
    params: {
      externalityType: 'positive_consumption',
      externalityMagnitude: 24,
      correctivePolicyActive: false,
      privateDemandIntercept: 80,
      privateSupplyIntercept: 20
    }
  },
  {
    id: 'positive-pigouvian-subsidy',
    name: {
      en: 'Pigouvian Corrective Subsidy (Expands Output to Qopt)',
      zh: '庇古单位补贴调节（发放补贴 = MEB，消除低效率）'
    },
    description: {
      en: 'A per-unit Pigouvian subsidy equal to Marginal External Benefit (MEB) shifts effective private demand up to MSB, expanding consumption to the socially optimal quantity.',
      zh: '政府发放等于边际外部收益（MEB）的单位庇古补贴，将有效需求提升至与 MSB 重合，把消费量扩大到社会有效水平。'
    },
    params: {
      externalityType: 'positive_consumption',
      externalityMagnitude: 24,
      correctivePolicyActive: true,
      privateDemandIntercept: 80,
      privateSupplyIntercept: 20
    }
  }
];

export const externalitiesModel: EconomicModel = {
  id: 'negative-externalities',
  topicId: 'negative-externalities',
  name: {
    en: 'Externalities, Social Efficiency & Pigouvian Policy',
    zh: '外部性、社会最优效率与庇古税费政策'
  },
  description: {
    en: 'Analyzes negative and positive externalities: private vs social costs/benefits (MPC, MSC, MPB, MSB), market over/underproduction, DWL triangles, and Pigouvian taxes/subsidies.',
    zh: '全面剖析负面与正面外部性：私人与社会边际成本/收益（MPC、MSC、MPB、MSB）、市场过度/不足生产、死重损失三角形及庇古纠正性税收与补贴。'
  },
  defaultParams,
  presets,
  controls: [
    {
      type: 'select',
      id: 'externalityType',
      label: { en: 'Type of Market Externality', zh: '外部性类型' },
      options: [
        { id: 'negative_production', label: { en: 'Negative Production (Pollution: MSC > MPC)', zh: '负面生产外部性（污染：MSC > MPC）' } },
        { id: 'positive_consumption', label: { en: 'Positive Consumption (Vaccines: MSB > MPB)', zh: '正面消费外部性（疫苗：MSB > MPB）' } }
      ]
    },
    {
      type: 'slider',
      id: 'externalityMagnitude',
      label: { en: 'External Cost / Benefit per Unit (MEC / MEB in $)', zh: '单位外部成本 / 收益大小（MEC / MEB，美元）' },
      min: 10,
      max: 40,
      step: 2,
      unit: '$'
    },
    {
      type: 'toggle',
      id: 'correctivePolicyActive',
      label: { en: 'Pigouvian Corrective Tax / Subsidy Policy', zh: '实施庇古单位纠正税 / 补贴政策' }
    }
  ],

  calculate(params: Record<string, any>): GraphCalculationOutput {
    const isNegative = (params.externalityType || 'negative_production') === 'negative_production';
    const extMag = Number(params.externalityMagnitude) || 24;
    const policyActive = Boolean(params.correctivePolicyActive);

    const b = 1.0;
    const d = 1.0;
    const a = isNegative ? 100 : 80;
    const c = 20;

    const qMarket = (a - c) / (b + d);
    const pMarket = a - b * qMarket;

    let qSocialOpt = 0;
    let pSocialOpt = 0;
    let dwl = 0;

    const xMax = 70;
    const yMax = 120;

    const curves: CurveSpec[] = [];
    const points: KeyPointSpec[] = [];
    const shadedAreas: ShadedAreaSpec[] = [];

    if (isNegative) {
      qSocialOpt = (a - (c + extMag)) / (b + d);
      pSocialOpt = a - b * qSocialOpt;
      dwl = policyActive ? 0 : 0.5 * extMag * (qMarket - qSocialOpt);

      curves.push({
        id: 'mpb-msb',
        name: { en: 'Marginal Social Benefit (MSB = MPB)', zh: '边际社会收益（MSB = MPB）' },
        shortLabel: 'MSB=MPB',
        points: generateLinearPoints({ intercept: a, slope: -b }, 0, Math.min(xMax, a / b), 40, 0, yMax),
        color: '#2563eb',
        strokeWidth: 3,
        visible: true,
        equation: `MSB = ${a} - ${b}Q`
      });

      curves.push({
        id: 'mpc',
        name: { en: policyActive ? 'MPC (Private Cost before Tax)' : 'Marginal Private Cost (MPC / S)', zh: policyActive ? 'MPC（税前私人边际成本）' : '边际私人成本（MPC / 供给曲线）' },
        shortLabel: 'MPC',
        points: generateLinearPoints({ intercept: c, slope: d }, 0, xMax, 40, 0, yMax),
        color: policyActive ? '#9ca3af' : '#dc2626',
        strokeWidth: policyActive ? 2 : 3,
        strokeDasharray: policyActive ? '4,3' : 'none',
        visible: true,
        equation: `MPC = ${c} + ${d}Q`
      });

      curves.push({
        id: 'msc',
        name: { en: policyActive ? 'MSC = MPC + Tax (Socially Optimal S)' : 'Marginal Social Cost (MSC = MPC + MEC)', zh: policyActive ? 'MSC = MPC + 税（社会最优供给线）' : '边际社会成本（MSC = MPC + MEC）' },
        shortLabel: 'MSC',
        points: generateLinearPoints({ intercept: c + extMag, slope: d }, 0, xMax, 40, 0, yMax),
        color: '#059669',
        strokeWidth: 3,
        visible: true,
        equation: `MSC = ${c + extMag} + ${d}Q`
      });

      points.push({
        id: 'social-opt-pt',
        x: qSocialOpt,
        y: pSocialOpt,
        shortLabel: 'E_opt',
        label: { en: `Social Optimum (Q_opt=${qSocialOpt.toFixed(1)}, P_opt=$${pSocialOpt.toFixed(1)})`, zh: `社会最优均衡 (Q_opt=${qSocialOpt.toFixed(1)}, P_opt=$${pSocialOpt.toFixed(1)})` },
        color: '#059669',
        showDropLines: true
      });

      points.push({
        id: 'market-eq-pt',
        x: qMarket,
        y: pMarket,
        shortLabel: 'E_m',
        label: { en: `Market Eq (Q_m=${qMarket.toFixed(1)}, P_m=$${pMarket.toFixed(1)})`, zh: `自由市场均衡 (Q_m=${qMarket.toFixed(1)}, P_m=$${pMarket.toFixed(1)})` },
        color: '#dc2626',
        showDropLines: true
      });

      if (!policyActive && dwl > 0.5) {
        const mscAtQm = c + extMag + d * qMarket;
        shadedAreas.push({
          id: 'neg-dwl',
          label: { en: `Deadweight Loss from Overproduction ($${dwl.toFixed(1)})`, zh: `过度生产无谓损失 ($${dwl.toFixed(1)})` },
          points: [
            { x: qSocialOpt, y: pSocialOpt },
            { x: qMarket, y: mscAtQm },
            { x: qMarket, y: pMarket }
          ],
          fill: '#ef4444',
          opacity: 0.28,
          visible: true
        });
      }
    } else {
      qSocialOpt = (a + extMag - c) / (b + d);
      pSocialOpt = c + d * qSocialOpt;
      dwl = policyActive ? 0 : 0.5 * extMag * (qSocialOpt - qMarket);

      curves.push({
        id: 'mpb',
        name: { en: policyActive ? 'MPB (Private Demand before Subsidy)' : 'Marginal Private Benefit (MPB / D)', zh: policyActive ? 'MPB（补贴前私人需求线）' : '边际私人收益（MPB / 需求线）' },
        shortLabel: 'MPB',
        points: generateLinearPoints({ intercept: a, slope: -b }, 0, Math.min(xMax, a / b), 40, 0, yMax),
        color: policyActive ? '#9ca3af' : '#2563eb',
        strokeWidth: policyActive ? 2 : 3,
        strokeDasharray: policyActive ? '4,3' : 'none',
        visible: true,
        equation: `MPB = ${a} - ${b}Q`
      });

      curves.push({
        id: 'msb',
        name: { en: policyActive ? 'MSB = MPB + Subsidy (Effective D)' : 'Marginal Social Benefit (MSB = MPB + MEB)', zh: policyActive ? 'MSB = MPB + 补贴（补贴后有效需求线）' : '边际社会收益（MSB = MPB + MEB）' },
        shortLabel: 'MSB',
        points: generateLinearPoints({ intercept: a + extMag, slope: -b }, 0, Math.min(xMax, (a + extMag) / b), 40, 0, yMax),
        color: '#059669',
        strokeWidth: 3,
        visible: true,
        equation: `MSB = ${a + extMag} - ${b}Q`
      });

      curves.push({
        id: 'mpc-msc',
        name: { en: 'Marginal Cost (MSC = MPC)', zh: '边际成本曲线（MSC = MPC）' },
        shortLabel: 'MSC=MPC',
        points: generateLinearPoints({ intercept: c, slope: d }, 0, xMax, 40, 0, yMax),
        color: '#dc2626',
        strokeWidth: 3,
        visible: true,
        equation: `MSC = ${c} + ${d}Q`
      });

      points.push({
        id: 'social-opt-pt-pos',
        x: qSocialOpt,
        y: pSocialOpt,
        shortLabel: 'E_opt',
        label: { en: `Social Optimum (Q_opt=${qSocialOpt.toFixed(1)}, P_opt=$${pSocialOpt.toFixed(1)})`, zh: `社会最优均衡 (Q_opt=${qSocialOpt.toFixed(1)}, P_opt=$${pSocialOpt.toFixed(1)})` },
        color: '#059669',
        showDropLines: true
      });

      points.push({
        id: 'market-eq-pt-pos',
        x: qMarket,
        y: pMarket,
        shortLabel: 'E_m',
        label: { en: `Market Eq (Q_m=${qMarket.toFixed(1)}, P_m=$${pMarket.toFixed(1)})`, zh: `自由市场均衡 (Q_m=${qMarket.toFixed(1)}, P_m=$${pMarket.toFixed(1)})` },
        color: '#2563eb',
        showDropLines: true
      });

      if (!policyActive && dwl > 0.5) {
        const msbAtQm = a + extMag - b * qMarket;
        shadedAreas.push({
          id: 'pos-dwl',
          label: { en: `Deadweight Loss from Underproduction ($${dwl.toFixed(1)})`, zh: `生产不足无谓损失 ($${dwl.toFixed(1)})` },
          points: [
            { x: qMarket, y: msbAtQm },
            { x: qSocialOpt, y: pSocialOpt },
            { x: qMarket, y: pMarket }
          ],
          fill: '#ef4444',
          opacity: 0.28,
          visible: true
        });
      }
    }

    const results = [
      {
        id: 'qMarketResult',
        label: { en: 'Free Market Quantity (Q_m)', zh: '自由市场产量（Q_m）' },
        value: `${qMarket.toFixed(1)} units`,
        color: '#dc2626',
        formula: 'MPB = MPC'
      },
      {
        id: 'qOptResult',
        label: { en: 'Socially Efficient Quantity (Q_opt)', zh: '社会最优配置产量（Q_opt）' },
        value: `${qSocialOpt.toFixed(1)} units`,
        color: '#059669',
        formula: 'MSB = MSC'
      },
      {
        id: 'extResult',
        label: { en: isNegative ? 'Marginal External Cost (MEC)' : 'Marginal External Benefit (MEB)', zh: isNegative ? '边际外部成本（MEC）' : '边际外部收益（MEB）' },
        value: `$${extMag.toFixed(2)}/unit`,
        color: '#7c3aed'
      },
      {
        id: 'dwlResult',
        label: { en: 'Market Deadweight Loss (DWL)', zh: '市场无谓损失（DWL）' },
        value: policyActive ? '$0.00 (Restored)' : `$${dwl.toFixed(2)}`,
        color: policyActive ? '#059669' : '#dc2626'
      },
      {
        id: 'policyRemedy',
        label: { en: 'AP Optimal Pigouvian Remedy', zh: 'AP 推荐最优庇古纠正政策' },
        value: isNegative ? `Per-unit tax T = $${extMag.toFixed(0)}` : `Per-unit subsidy s = $${extMag.toFixed(0)}`,
        color: '#2563eb'
      }
    ];

    const explanation = {
      en: isNegative
        ? policyActive
          ? `Pigouvian Policy Success: By levying a corrective per-unit tax of exactly T = MEC = $${extMag.toFixed(0)}, the government forces polluters to internalize their external spillover cost. The private supply curve shifts upward by the tax amount to coincide with MSC, contracting output from Q_m = ${qMarket.toFixed(1)} to the socially efficient level Q_opt = ${qSocialOpt.toFixed(1)} and completely eliminating the $${(0.5 * extMag * (qMarket - qSocialOpt)).toFixed(1)} deadweight loss!`
          : `Market Failure (Negative Externality): Because firms produce pollution without paying for the environmental damage, Marginal Social Cost (MSC) exceeds Marginal Private Cost (MPC) by MEC = $${extMag.toFixed(0)}. The unregulated market overproduces at Q_m = ${qMarket.toFixed(1)} (greater than Q_opt = ${qSocialOpt.toFixed(1)}). For every unit produced between Q_opt and Q_m, the social cost to society exceeds the social benefit, creating a deadweight loss triangle of $${dwl.toFixed(1)} pointing leftward toward the social optimum.`
        : policyActive
        ? `Pigouvian Policy Success: By granting a corrective per-unit subsidy of s = MEB = $${extMag.toFixed(0)}, the government aligns private consumption incentives with social value. Demand expands from Q_m = ${qMarket.toFixed(1)} to Q_opt = ${qSocialOpt.toFixed(1)}, capturing unrealized social surplus and eliminating deadweight loss.`
        : `Market Failure (Positive Externality): Because private consumers ignore the positive spillovers to third parties (such as herd immunity or an educated populace), Marginal Social Benefit (MSB) exceeds Marginal Private Benefit (MPB) by MEB = $${extMag.toFixed(0)}. The free market underproduces at Q_m = ${qMarket.toFixed(1)} (less than Q_opt = ${qSocialOpt.toFixed(1)}), creating a deadweight loss of $${dwl.toFixed(1)} pointing rightward toward the social optimum.`,
      zh: isNegative
        ? policyActive
          ? `庇古税调节大获成功：通过征收恰好等于边际外部成本 T = MEC = $${extMag.toFixed(0)} 的单位纠正税，政府迫使污染企业将外部社会成本内部化。私人供给线（MPC）向上平移税额幅度与 MSC 重合，将过剩产量从 Q_m = ${qMarket.toFixed(1)} 压缩至社会最优水平 Q_opt = ${qSocialOpt.toFixed(1)}，彻底消除了 $${(0.5 * extMag * (qMarket - qSocialOpt)).toFixed(1)} 的死重损失！`
          : `市场失灵（负面外部性）：由于厂商排放污染却无需支付环境损害赔偿，边际社会成本（MSC）高出私人边际成本（MPC）达 MEC = $${extMag.toFixed(0)}。自由市场在 Q_m = ${qMarket.toFixed(1)} 处过度生产（远大于社会最优产量 Q_opt = ${qSocialOpt.toFixed(1)}）。在 Q_opt 到 Q_m 之间的每一单位，社会付出的真实成本都高于消费者获得的收益，形成面积为 $${dwl.toFixed(1)} 且尖端指向社会最优点的死重损失三角形。`
        : policyActive
        ? `庇古补贴调节大获成功：通过发放等于边际外部收益 s = MEB = $${extMag.toFixed(0)} 的单位补贴，政府使私人消费决策与社会总体价值完全接轨。产出规模从 Q_m = ${qMarket.toFixed(1)} 顺利扩张至 Q_opt = ${qSocialOpt.toFixed(1)}，捕获了未被开发的社会剩余并清除了无谓损失。`
        : `市场失灵（正面外部性）：由于私人个体在决策时忽略了给第三方带来的外部益处（如疫苗构建群体免疫屏障、基础教育提高国民素质），边际社会收益（MSB）高出私人边际收益（MPB）达 MEB = $${extMag.toFixed(0)}。自由市场生产不足（Q_m = ${qMarket.toFixed(1)} 低于 Q_opt = ${qSocialOpt.toFixed(1)}），导致 $${dwl.toFixed(1)} 的无谓损失，其三角形尖端指向社会最优水平。`
    };

    const analysisPoints = [
      {
        en: 'The DWL Arrow Rule: In AP Microeconomics, the deadweight loss triangle in externality diagrams ALWAYS points like an arrowhead directly toward the socially optimal quantity (Q_opt)!',
        zh: 'DWL 箭头黄金法则：在 AP 微观外部性图表中，无谓损失三角形永远像一个箭头一样，尖端笔直指向社会最优产量（Q_opt）！'
      },
      {
        en: 'Pigouvian Prescription: The optimal corrective tax equals Marginal External Cost (T = MEC); the optimal corrective subsidy equals Marginal External Benefit (s = MEB).',
        zh: '庇古处方定量准则：最优纠正税额必须精确等于边际外部成本（T = MEC）；最优纠正补贴额必须精确等于边际外部收益（s = MEB）。'
      },
      {
        en: 'Coase Theorem: If property rights are clearly defined and transaction costs are negligible, private parties can bargain to solve externalities without government intervention.',
        zh: '科斯定理（Coase Theorem）：若产权界定清晰且交易成本微不足道，私人各方可以通过自愿协商达成帕累托最优，无需政府直接干预。'
      }
    ];

    return {
      axes: {
        xLabel: { en: 'Quantity (Q in units)', zh: '数量（Q，单位）' },
        yLabel: { en: 'Price & Marginal Cost/Benefit ($)', zh: '价格与边际成本/收益（美元）' },
        xMin: 0,
        xMax,
        yMin: 0,
        yMax,
        xStep: 10,
        yStep: 20,
        xSuffix: ' u',
        yPrefix: '$'
      },
      curves,
      points,
      shadedAreas,
      results,
      explanation,
      analysisPoints
    };
  }
};
