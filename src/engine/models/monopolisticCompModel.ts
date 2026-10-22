import { EconomicModel, GraphCalculationOutput, ScenarioPreset, CurveSpec, KeyPointSpec, ShadedAreaSpec, Point2D } from '../../types/graph';
import { generateLinearPoints } from '../economicMath';

export interface MonopolisticCompParams {
  demandIntercept: number; // Vertical intercept (e.g. 70 to 110, default 90)
  demandSlope: number;     // e.g. 0.8 to 1.5, default 1.0
  fixedCost: number;       // e.g. 200 to 500, default 360
  marginalCostSlope: number; // e.g. 0.3 to 0.7, default 0.5
  marketPhase: 'short_run_profit' | 'long_run_tangency' | 'short_run_loss';
}

const defaultParams: MonopolisticCompParams = {
  demandIntercept: 90,
  demandSlope: 1.0,
  fixedCost: 360,
  marginalCostSlope: 0.5,
  marketPhase: 'long_run_tangency'
};

const presets: ScenarioPreset[] = [
  {
    id: 'long-run-tangency',
    name: {
      en: 'Long-Run Tangency Equilibrium (Zero Economic Profit)',
      zh: '长期相切均衡（零经济利润，P = ATC）'
    },
    description: {
      en: 'Firms have entered/exited until the firm demand curve is exactly tangent to the ATC curve at the profit-maximizing output. Economic profit is zero, but excess capacity persists.',
      zh: '厂商自由进出直至个别需求曲线与 ATC 曲线在利润最大化产量处精确相切。超额利润归零，但存在过剩生产能力（Excess Capacity）。'
    },
    params: {
      demandIntercept: 90,
      demandSlope: 1.0,
      fixedCost: 360,
      marginalCostSlope: 0.5,
      marketPhase: 'long_run_tangency'
    }
  },
  {
    id: 'short-run-profit',
    name: {
      en: 'Short-Run Economic Profit (P > ATC)',
      zh: '短期超额利润（P > ATC，吸引新厂商进入）'
    },
    description: {
      en: 'Firm experiences high brand popularity or low competition. Price exceeds ATC at Q*, yielding positive economic profit and attracting new entrants.',
      zh: '厂商拥有较高品牌美誉度或短期竞争较弱。在最优产量 Q* 处价格高于 ATC，赚取正超额经济利润，将吸引新竞争者涌入。'
    },
    params: {
      demandIntercept: 110,
      demandSlope: 1.0,
      fixedCost: 360,
      marginalCostSlope: 0.5,
      marketPhase: 'short_run_profit'
    }
  },
  {
    id: 'short-run-loss',
    name: {
      en: 'Short-Run Economic Loss (P < ATC)',
      zh: '短期经济亏损（P < ATC，引发厂商退出）'
    },
    description: {
      en: 'Firm demand weakens or substitutes increase. Price is below ATC at Q*, resulting in economic losses and driving firm exits in the long run.',
      zh: '厂商面临更激烈替代品竞争或需求减弱。在 Q* 处价格低于 ATC，企业面临亏损，长期将促使部分厂商退出市场。'
    },
    params: {
      demandIntercept: 75,
      demandSlope: 1.0,
      fixedCost: 360,
      marginalCostSlope: 0.5,
      marketPhase: 'short_run_loss'
    }
  }
];

export const monopolisticCompModel: EconomicModel = {
  id: 'monopolistic-competition',
  topicId: 'monopolistic-competition',
  name: {
    en: 'Monopolistic Competition: Short Run vs Long Run',
    zh: '垄断竞争：短期与长期均衡及过剩产能'
  },
  description: {
    en: 'Illustrates short-run profit/loss, long-run tangency equilibrium (zero economic profit), product differentiation, and excess capacity.',
    zh: '深入演示产品差异化下的短期超额利润与亏损、长期需求与 ATC 相切均衡（零经济利润），以及过剩生产能力（Excess Capacity）。'
  },
  defaultParams,
  presets,
  controls: [
    {
      type: 'select',
      id: 'marketPhase',
      label: { en: 'Market Horizon & Profit Status', zh: '市场阶段与利润状态' },
      options: [
        { id: 'long_run_tangency', label: { en: 'Long-Run Tangency (Normal Profit)', zh: '长期相切均衡（正常利润）' } },
        { id: 'short_run_profit', label: { en: 'Short-Run Profit (P > ATC)', zh: '短期超额利润（P > ATC）' } },
        { id: 'short_run_loss', label: { en: 'Short-Run Loss (P < ATC)', zh: '短期经济亏损（P < ATC）' } }
      ]
    },
    {
      type: 'slider',
      id: 'demandIntercept',
      label: { en: 'Brand Demand Strength (Intercept)', zh: '品牌需求强度（需求截距）' },
      min: 70,
      max: 115,
      step: 1
    },
    {
      type: 'slider',
      id: 'fixedCost',
      label: { en: 'Fixed Overhead Costs (FC in $)', zh: '固定间接成本（FC，美元）' },
      min: 250,
      max: 500,
      step: 10,
      unit: '$'
    }
  ],

  calculate(params: Record<string, any>): GraphCalculationOutput {
    let a = Number(params.demandIntercept) || 90;
    const b = Number(params.demandSlope) || 1.0;
    const FC = Number(params.fixedCost) || 360;
    const mcSlope = Number(params.marginalCostSlope) || 0.5;
    const phase = params.marketPhase || 'long_run_tangency';

    if (phase === 'long_run_tangency') {
      const qTangent = Math.sqrt(FC / (b + 0.5 * mcSlope));
      a = 10 + (2 * b + mcSlope) * qTangent;
    } else if (phase === 'short_run_profit' && a <= 95) {
      a = 110;
    } else if (phase === 'short_run_loss' && a >= 85) {
      a = 75;
    }

    const qStar = (a - 10) / (2 * b + mcSlope);
    const pStar = a - b * qStar;
    const mcStar = mcSlope * qStar + 10;
    const atcStar = FC / qStar + 10 + 0.5 * mcSlope * qStar;
    const profit = (pStar - atcStar) * qStar;

    const qMes = Math.sqrt((2 * FC) / mcSlope);
    const minAtc = FC / qMes + 10 + 0.5 * mcSlope * qMes;

    const excessCapacity = Math.max(0, qMes - qStar);

    const xMax = 70;
    const yMax = 120;

    const demandPoints = generateLinearPoints(
      { intercept: a, slope: -b },
      0,
      Math.min(xMax, a / b),
      50,
      0,
      yMax
    );

    const mrPoints = generateLinearPoints(
      { intercept: a, slope: -2 * b },
      0,
      Math.min(xMax, a / (2 * b)),
      50,
      0,
      yMax
    );

    const mcPoints = generateLinearPoints(
      { intercept: 10, slope: mcSlope },
      0,
      xMax,
      50,
      0,
      yMax
    );

    const atcPoints: Point2D[] = [];
    for (let q = 4; q <= xMax; q += 1) {
      const atcVal = FC / q + 10 + 0.5 * mcSlope * q;
      if (atcVal <= yMax + 20) {
        atcPoints.push({ x: Number(q.toFixed(1)), y: Number(atcVal.toFixed(2)) });
      }
    }

    const curves: CurveSpec[] = [
      {
        id: 'demand',
        name: { en: 'Firm Demand (D)', zh: '个别厂商需求曲线（D）' },
        shortLabel: 'D',
        points: demandPoints,
        color: '#2563eb',
        strokeWidth: 3,
        visible: true,
        equation: `P = ${a.toFixed(1)} - ${b.toFixed(1)}Q`
      },
      {
        id: 'mr',
        name: { en: 'Marginal Revenue (MR)', zh: '边际收益曲线（MR）' },
        shortLabel: 'MR',
        points: mrPoints,
        color: '#7c3aed',
        strokeWidth: 2.5,
        strokeDasharray: '4,3',
        visible: true,
        equation: `MR = ${a.toFixed(1)} - ${(2 * b).toFixed(1)}Q`
      },
      {
        id: 'mc',
        name: { en: 'Marginal Cost (MC)', zh: '边际成本曲线（MC）' },
        shortLabel: 'MC',
        points: mcPoints,
        color: '#dc2626',
        strokeWidth: 3,
        visible: true,
        equation: `MC = 10 + ${mcSlope.toFixed(2)}Q`
      },
      {
        id: 'atc',
        name: { en: 'Average Total Cost (ATC)', zh: '平均总成本曲线（ATC）' },
        shortLabel: 'ATC',
        points: atcPoints,
        color: '#d97706',
        strokeWidth: 2.5,
        visible: true,
        equation: `ATC = ${FC}/Q + 10 + ${(0.5 * mcSlope).toFixed(2)}Q`
      },
      {
        id: 'mes-ref',
        name: { en: 'Min ATC Capacity (MES)', zh: '最小有效规模（MES，Min ATC）' },
        shortLabel: 'MES',
        points: [
          { x: qMes, y: 0 },
          { x: qMes, y: minAtc }
        ],
        color: '#6b7280',
        strokeWidth: 1.5,
        strokeDasharray: '3,3',
        visible: true
      },
      {
        id: 'excess-cap-bracket',
        name: { en: 'Excess Capacity Gap', zh: '过剩生产能力区间' },
        shortLabel: 'Gap',
        points: [
          { x: qStar, y: 12 },
          { x: qMes, y: 12 }
        ],
        color: '#0891b2',
        strokeWidth: 3,
        visible: true
      }
    ];

    const points: KeyPointSpec[] = [
      {
        id: 'optimal-prod',
        x: qStar,
        y: pStar,
        shortLabel: 'P*',
        label: { en: `Firm Price & Q* (P=${pStar.toFixed(1)}, Q=${qStar.toFixed(1)})`, zh: `厂商售价与产量 (P=${pStar.toFixed(1)}, Q=${qStar.toFixed(1)})` },
        color: '#2563eb',
        showDropLines: true
      },
      {
        id: 'mr-mc-eq',
        x: qStar,
        y: mcStar,
        shortLabel: 'MR=MC',
        label: { en: `MR = MC ($${mcStar.toFixed(1)})`, zh: `MR = MC ($${mcStar.toFixed(1)})` },
        color: '#dc2626',
        showDropLines: true
      },
      {
        id: 'atc-at-qstar',
        x: qStar,
        y: atcStar,
        shortLabel: 'ATC(Q*)',
        label: { en: `ATC(Q*) = $${atcStar.toFixed(1)}`, zh: `ATC(Q*) = $${atcStar.toFixed(1)}` },
        color: '#d97706',
        showDropLines: true
      },
      {
        id: 'min-atc-point',
        x: qMes,
        y: minAtc,
        shortLabel: 'MES',
        label: { en: `Min ATC (MES = ${qMes.toFixed(1)})`, zh: `最低 ATC（有效规模 = ${qMes.toFixed(1)}）` },
        color: '#059669',
        showDropLines: true
      }
    ];

    const shadedAreas: ShadedAreaSpec[] = [];

    if (Math.abs(profit) > 5) {
      if (profit > 0) {
        shadedAreas.push({
          id: 'profit-rect',
          label: { en: `Economic Profit (+$${profit.toFixed(0)})`, zh: `超额经济利润 (+$${profit.toFixed(0)})` },
          points: [
            { x: 0, y: atcStar },
            { x: qStar, y: atcStar },
            { x: qStar, y: pStar },
            { x: 0, y: pStar }
          ],
          fill: '#10b981',
          opacity: 0.25,
          visible: true
        });
      } else {
        shadedAreas.push({
          id: 'loss-rect',
          label: { en: `Economic Loss (-$${Math.abs(profit).toFixed(0)})`, zh: `经济亏损 (-$${Math.abs(profit).toFixed(0)})` },
          points: [
            { x: 0, y: pStar },
            { x: qStar, y: pStar },
            { x: qStar, y: atcStar },
            { x: 0, y: atcStar }
          ],
          fill: '#ef4444',
          opacity: 0.25,
          visible: true
        });
      }
    }

    const results = [
      {
        id: 'qStar',
        label: { en: 'Profit-Maximizing Output (Q*)', zh: '利润最大化产量（Q*）' },
        value: `${qStar.toFixed(1)} units`,
        color: '#2563eb',
        formula: 'MR = MC'
      },
      {
        id: 'pStar',
        label: { en: 'Firm Price (P*)', zh: '厂商销售价格（P*）' },
        value: `$${pStar.toFixed(2)}`,
        color: '#2563eb',
        formula: 'P(Q*) on Demand'
      },
      {
        id: 'atcVal',
        label: { en: 'Average Total Cost (ATC)', zh: '平均总成本（ATC）' },
        value: `$${atcStar.toFixed(2)}`,
        color: '#d97706'
      },
      {
        id: 'profitVal',
        label: { en: 'Economic Profit / (Loss)', zh: '经济利润 / （亏损）' },
        value: profit >= 0 ? `+$${profit.toFixed(2)}` : `-$${Math.abs(profit).toFixed(2)}`,
        color: Math.abs(profit) < 2 ? '#059669' : profit > 0 ? '#16a34a' : '#dc2626',
        formula: '(P - ATC) × Q*'
      },
      {
        id: 'excessCapVal',
        label: { en: 'Excess Capacity (Qmes - Q*)', zh: '过剩生产能力（Qmes - Q*）' },
        value: `${excessCapacity.toFixed(1)} units`,
        color: '#0891b2',
        formula: 'Q(min ATC) - Q*'
      },
      {
        id: 'efficiencyStatus',
        label: { en: 'AP Efficiency Assessment', zh: 'AP 效率评估结论' },
        value: 'Neither Productively nor Allocatively Efficient',
        color: '#dc2626'
      }
    ];

    const explanation = {
      en: phase === 'long_run_tangency'
        ? `In the long run, entry of new competing brands erodes economic profit until the firm's downward-sloping demand curve is exactly tangent to its ATC curve at Q* = ${qStar.toFixed(1)}. Here, Price ($${pStar.toFixed(2)}) equals ATC ($${atcStar.toFixed(2)}), leaving Normal Profit (Zero Economic Profit). However, because demand slopes downward, the tangency occurs on the downward-sloping portion of ATC, resulting in Excess Capacity of ${excessCapacity.toFixed(1)} units (firm produces less than the cost-minimizing MES of ${qMes.toFixed(1)} units).`
        : profit > 0
        ? `In the short run, the firm earns an Economic Profit of +$${profit.toFixed(1)} because Price ($${pStar.toFixed(2)}) exceeds ATC ($${atcStar.toFixed(2)}). Because barriers to entry are low in monopolistic competition, this economic profit will attract new firms producing close substitutes, shifting this firm's demand curve to the left until economic profit reaches zero in the long run.`
        : `In the short run, the firm suffers an Economic Loss of -$${Math.abs(profit).toFixed(1)} because Price ($${pStar.toFixed(2)}) is below ATC ($${atcStar.toFixed(2)}). In the long run, firms experiencing losses will exit the industry, shifting the remaining firms' demand curves to the right until zero economic profit is restored.`,
      zh: phase === 'long_run_tangency'
        ? `在长期均衡中，新竞争品牌的自由进入稀释了市场份额，直至向下倾斜的需求曲线与 ATC 曲线在 Q* = ${qStar.toFixed(1)} 处精确相切。此时价格（$${pStar.toFixed(2)}）等于 ATC（$${atcStar.toFixed(2)}），超额利润降为零（仅获得正常利润）。但由于产品差异化使需求曲线向下倾斜，切点必然落在 ATC 曲线向下的倾斜段，产生 ${excessCapacity.toFixed(1)} 个单位的“过剩生产能力”（厂商实际产量低于生产效率最优的 MES 规模 ${qMes.toFixed(1)} 单位）。`
        : profit > 0
        ? `在短期内，企业获得 +$${profit.toFixed(1)} 的超额经济利润，因为产品售价（$${pStar.toFixed(2)}）高于平均总成本（$${atcStar.toFixed(2)}）。由于垄断竞争市场进出壁垒极低，超额利润将吸引生产近似替代品的新厂商进入，导致现有厂商的需求曲线向左平移，直至长期利润归零。`
        : `在短期内，企业面临 -$${Math.abs(profit).toFixed(1)} 的经济亏损，因为销售价格（$${pStar.toFixed(2)}）低于平均成本（$${atcStar.toFixed(2)}）。在长期中，承受亏损的厂商将陆续退出市场，使存留厂商的需求曲线向右平移，直至重新恢复零经济利润切线均衡。`
    };

    const analysisPoints = [
      {
        en: 'Excess Capacity Theorem: In monopolistic competition, firms operate at an output below the minimum of Average Total Cost (MES). Society pays for product variety with slightly higher average production costs.',
        zh: '过剩生产能力定理：垄断竞争厂商的生产规模永远小于平均总成本最低点（MES）。社会为了享受商品的多样性（不同款式、口味、品牌），付出了稍高平均生产成本的代价。'
      },
      {
        en: 'Double Inefficiency: Unlike Perfect Competition, Monopolistic Competition is NEITHER allocatively efficient (P > MC) NOR productively efficient (P > min ATC) in long-run equilibrium.',
        zh: '双重低效率：与完全竞争不同，垄断竞争在长期中既不满足配置效率（P > MC），也不满足生产效率（P > min ATC）。'
      },
      {
        en: 'Product Differentiation & Advertising: Non-price competition (advertising, quality differences, packaging) is heavily utilized by firms to shift demand to the right and make it less elastic.',
        zh: '产品差异化与广告营销：企业广泛采用非价格竞争手段（广告推广、独特包装、售后服务）以增强品牌忠诚度，使个别需求曲线向右移动并变得更加缺乏弹性。'
      }
    ];

    return {
      axes: {
        xLabel: { en: 'Firm Quantity (Q in units)', zh: '厂商生产数量（Q，单位）' },
        yLabel: { en: 'Price & Costs (P, MC, ATC in $)', zh: '价格与成本（P, MC, ATC，美元）' },
        xMin: 0,
        xMax,
        yMin: 0,
        yMax,
        xStep: 10,
        yStep: 10,
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
