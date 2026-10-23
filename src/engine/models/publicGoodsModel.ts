import { EconomicModel, GraphCalculationOutput, ScenarioPreset, CurveSpec, KeyPointSpec, ShadedAreaSpec, Point2D } from '../../types/graph';

export interface PublicGoodsParams {
  mb1Intercept: number;     // Consumer 1 willingness to pay intercept (20 to 50, default 35)
  mb2Intercept: number;     // Consumer 2 willingness to pay intercept (20 to 50, default 45)
  marginalCost: number;     // Constant or upward sloping MC (10 to 60, default 40)
  showIndividualDemands: boolean;
  showVerticalSummation: boolean;
}

const defaultParams: PublicGoodsParams = {
  mb1Intercept: 35,
  mb2Intercept: 45,
  marginalCost: 40,
  showIndividualDemands: true,
  showVerticalSummation: true
};

const presets: ScenarioPreset[] = [
  {
    id: 'optimal-public-provision',
    name: {
      en: 'Socially Optimal Public Good Provision (MSB = MC)',
      zh: '公共物品社会最优提供水平（MSB = MC）'
    },
    description: {
      en: 'Because public goods are non-rival, total society willingness to pay is the VERTICAL summation of individual demands: MSB = MB₁ + MB₂. Social optimum occurs where MSB intersects MC.',
      zh: '由于公共物品具备非竞争性，全社会的总支付意愿是个人需求曲线的垂直相加（MSB = MB₁ + MB₂）。社会最优提供量由 MSB 与边际成本 MC 的交点决定。'
    },
    params: {
      mb1Intercept: 35,
      mb2Intercept: 45,
      marginalCost: 40,
      showIndividualDemands: true,
      showVerticalSummation: true
    }
  },
  {
    id: 'free-rider-underprovision',
    name: {
      en: 'Free-Rider Problem & Market Underprovision',
      zh: '搭便车问题与私人市场提供不足'
    },
    description: {
      en: 'Non-excludability allows individuals to consume without paying (free riders). Private markets only produce where an individual\'s MB = MC (or 0), failing to account for the other consumer\'s benefit and creating deadweight loss.',
      zh: '非排他性导致消费者企图免费搭便车。私人市场仅根据个体意愿提供（或甚至完全无人出资提供），严重忽视其他人的外部收益，造成严重的资源配置效率损失。'
    },
    params: {
      mb1Intercept: 25,
      mb2Intercept: 35,
      marginalCost: 45,
      showIndividualDemands: true,
      showVerticalSummation: true
    }
  }
];

export const publicGoodsModel: EconomicModel = {
  id: 'public-goods-provision',
  topicId: 'public-goods-provision',
  name: {
    en: 'Public Goods: Vertical Summation of Demand & Optimal Provision',
    zh: '公共物品：需求的垂直求和与最优提供量'
  },
  description: {
    en: 'Contrasts horizontal market demand summation for private goods with VERTICAL summation (MSB = MB₁ + MB₂) for non-rival public goods. Demonstrates free-rider market failure and optimal government provision where MSB = MC.',
    zh: '鲜明对比私人物品需求的水平求和与非竞争性公共物品需求的垂直求和（MSB = MB₁ + MB₂）。直观剖析搭便车导致的私人市场失灵，以及政府最优供给量（MSB = MC）的确定。'
  },
  defaultParams,
  presets,
  controls: [
    {
      type: 'slider',
      id: 'mb1Intercept',
      label: {
        en: 'Consumer 1 Willingness to Pay (MB₁)',
        zh: '消费者 1 的边际收益 / 支付意愿（MB₁ 截距）'
      },
      min: 20,
      max: 50,
      step: 5,
      unit: '$',
      help: {
        en: 'Adjust Consumer 1\'s private valuation of the public good.',
        zh: '调整消费者 1 对该公共物品的个人估值与支付意愿。'
      }
    },
    {
      type: 'slider',
      id: 'mb2Intercept',
      label: {
        en: 'Consumer 2 Willingness to Pay (MB₂)',
        zh: '消费者 2 的边际收益 / 支付意愿（MB₂ 截距）'
      },
      min: 20,
      max: 55,
      step: 5,
      unit: '$',
      help: {
        en: 'Adjust Consumer 2\'s private valuation of the public good.',
        zh: '调整消费者 2 对该公共物品的个人估值与支付意愿。'
      }
    },
    {
      type: 'slider',
      id: 'marginalCost',
      label: {
        en: 'Marginal Cost of Provision (MC)',
        zh: '提供公共物品的边际成本（MC）'
      },
      min: 15,
      max: 65,
      step: 5,
      unit: '$',
      help: {
        en: 'The constant marginal cost to society for producing each unit.',
        zh: '社会每多提供一个单位公共物品所需支付的恒定边际成本。'
      }
    },
    {
      type: 'toggle',
      id: 'showIndividualDemands',
      label: {
        en: 'Show Individual MB Curves (MB₁, MB₂)',
        zh: '显示个人边际收益曲线（MB₁, MB₂）'
      }
    },
    {
      type: 'toggle',
      id: 'showVerticalSummation',
      label: {
        en: 'Show Vertical Sum (MSB = MB₁ + MB₂)',
        zh: '显示垂直求和曲线（MSB = MB₁ + MB₂）'
      }
    }
  ],
  calculate(rawParams: Record<string, any>): GraphCalculationOutput {
    const params: PublicGoodsParams = { ...defaultParams, ...rawParams };
    const a1 = params.mb1Intercept;
    const a2 = params.mb2Intercept;
    const mc = params.marginalCost;
    const slope = 3.0; // slope magnitude for individual MB: MB = a - 3*Q

    // Choke quantities: where MB drops to 0
    const q1Choke = a1 / slope;
    const q2Choke = a2 / slope;
    const minChoke = Math.min(q1Choke, q2Choke);

    // Individual MB functions
    const mb1 = (q: number): number => Math.max(0, a1 - slope * q);
    const mb2 = (q: number): number => Math.max(0, a2 - slope * q);

    // Vertical Summation: MSB(Q) = MB1(Q) + MB2(Q)
    const msbFunc = (q: number): number => mb1(q) + mb2(q);

    // Social optimum: where MSB(Q) = MC
    // When Q <= minChoke: MSB = (a1 + a2) - 2*slope*Q
    // When Q > minChoke: MSB = max(a1, a2) - slope*Q
    let qOpt = 0;
    const totalIntercept = a1 + a2;
    if (mc < totalIntercept) {
      if (mc >= (Math.abs(a1 - a2) + (minChoke * slope))) {
        // Intersects in the joint segment (both consumers have positive MB)
        qOpt = (totalIntercept - mc) / (2 * slope);
      } else {
        // Intersects in the single-consumer segment
        const largerA = Math.max(a1, a2);
        qOpt = Math.max(0, (largerA - mc) / slope);
      }
    }

    qOpt = Math.max(0, Math.min(18, Number(qOpt.toFixed(2))));

    // Points generation
    const qMax = 18;
    const steps = 60;
    const mb1Points: Point2D[] = [];
    const mb2Points: Point2D[] = [];
    const msbPoints: Point2D[] = [];
    const mcPoints: Point2D[] = [
      { x: 0, y: mc },
      { x: qMax, y: mc }
    ];

    for (let i = 0; i <= steps; i++) {
      const q = (i / steps) * qMax;
      mb1Points.push({ x: Number(q.toFixed(2)), y: Number(mb1(q).toFixed(2)) });
      mb2Points.push({ x: Number(q.toFixed(2)), y: Number(mb2(q).toFixed(2)) });
      msbPoints.push({ x: Number(q.toFixed(2)), y: Number(msbFunc(q).toFixed(2)) });
    }

    const curves: CurveSpec[] = [];

    if (params.showVerticalSummation) {
      curves.push({
        id: 'curve-msb',
        name: { en: 'Marginal Social Benefit (MSB = MB₁ + MB₂)', zh: '边际社会收益曲线（MSB = MB₁ + MB₂）' },
        shortLabel: 'MSB',
        color: '#1e3a8a',
        strokeWidth: 3.5,
        visible: true,
        points: msbPoints
      });
    }

    curves.push({
      id: 'curve-mc',
      name: { en: 'Marginal Cost of Provision (MC)', zh: '边际提供成本（MC）' },
      shortLabel: 'MC',
      color: '#dc2626',
      strokeWidth: 3,
      visible: true,
      points: mcPoints
    });

    if (params.showIndividualDemands) {
      curves.push({
        id: 'curve-mb1',
        name: { en: 'Consumer 1 Valuation (MB₁)', zh: '消费者 1 支付意愿（MB₁）' },
        shortLabel: 'MB₁',
        color: '#0284c7',
        strokeWidth: 2,
        strokeDasharray: '4,4',
        visible: true,
        points: mb1Points
      });
      curves.push({
        id: 'curve-mb2',
        name: { en: 'Consumer 2 Valuation (MB₂)', zh: '消费者 2 支付意愿（MB₂）' },
        shortLabel: 'MB₂',
        color: '#059669',
        strokeWidth: 2,
        strokeDasharray: '4,4',
        visible: true,
        points: mb2Points
      });
    }

    // Key points
    const points: KeyPointSpec[] = [
      {
        id: 'pt-social-opt',
        label: { en: 'Socially Optimal Output (MSB = MC)', zh: '社会最优提供量（MSB = MC）' },
        shortLabel: 'Social Optimum (Q*)',
        x: qOpt,
        y: mc,
        color: '#4f46e5',
        showDropLines: true,
        xLabel: `Q*=${qOpt}`,
        yLabel: `$${mc}`
      }
    ];

    if (qOpt > 0 && params.showIndividualDemands) {
      points.push({
        id: 'pt-mb1-q',
        label: { en: `Consumer 1 MB at Q*`, zh: `消费者 1 在 Q* 处的个人估值` },
        shortLabel: `MB₁=${mb1(qOpt).toFixed(0)}`,
        x: qOpt,
        y: mb1(qOpt),
        color: '#0284c7',
        showDropLines: false
      });
      points.push({
        id: 'pt-mb2-q',
        label: { en: `Consumer 2 MB at Q*`, zh: `消费者 2 在 Q* 处的个人估值` },
        shortLabel: `MB₂=${mb2(qOpt).toFixed(0)}`,
        x: qOpt,
        y: mb2(qOpt),
        color: '#059669',
        showDropLines: false
      });
    }

    // Shaded net social benefit area
    const shadedAreas: ShadedAreaSpec[] = [];
    if (qOpt > 0) {
      const benefitPoints: Point2D[] = [];
      const stepsArea = 30;
      for (let i = 0; i <= stepsArea; i++) {
        const qVal = (i / stepsArea) * qOpt;
        benefitPoints.push({ x: qVal, y: msbFunc(qVal) });
      }
      benefitPoints.push({ x: qOpt, y: mc });
      benefitPoints.push({ x: 0, y: mc });

      shadedAreas.push({
        id: 'area-net-benefit',
        label: { en: 'Net Social Benefit from Optimal Provision', zh: '最优提供量下的社会净总福利' },
        fill: '#3b82f6',
        opacity: 0.18,
        visible: true,
        points: benefitPoints
      });
    }

    return {
      axes: {
        xLabel: { en: 'Quantity of Public Good (Q)', zh: '公共物品提供数量（Q）' },
        yLabel: { en: 'Marginal Benefit & Cost ($ / unit)', zh: '边际收益与边际成本（$ / 单位）' },
        xMin: 0,
        xMax: 18,
        xStep: 3,
        yMin: 0,
        yMax: 100,
        yStep: 20,
        yPrefix: '$'
      },
      curves,
      points,
      shadedAreas,
      results: [
        {
          id: 'res-optimal-q',
          label: { en: 'Socially Optimal Quantity (Q*)', zh: '社会最优提供数量（Q*）' },
          value: `${qOpt} units`,
          color: '#4f46e5'
        },
        {
          id: 'res-provision-mc',
          label: { en: 'Marginal Cost of Provision (MC)', zh: '边际提供成本（MC）' },
          value: `$${mc} / unit`
        },
        {
          id: 'res-consumer-1-valuation',
          label: { en: 'Consumer 1 Valuation at Q*', zh: '消费者 1 在 Q* 处的支付意愿' },
          value: `$${mb1(qOpt).toFixed(2)}`
        },
        {
          id: 'res-consumer-2-valuation',
          label: { en: 'Consumer 2 Valuation at Q*', zh: '消费者 2 在 Q* 处的支付意愿' },
          value: `$${mb2(qOpt).toFixed(2)}`
        },
        {
          id: 'res-total-msb',
          label: { en: 'Total Willingness to Pay (MSB)', zh: '全社会总支付意愿（MSB）' },
          value: `$${msbFunc(qOpt).toFixed(2)}`
        }
      ],
      explanation: {
        en: `Because public goods are non-rival, both Consumer 1 and Consumer 2 can enjoy the exact same unit simultaneously. Therefore, the market demand curve is formed by VERTICAL summation: MSB = MB₁ + MB₂ ($${mb1(qOpt).toFixed(1)} + $${mb2(qOpt).toFixed(1)} = $${msbFunc(qOpt).toFixed(1)} at Q* = ${qOpt}). The socially optimal provision occurs where MSB = MC ($${mc}). Due to non-excludability and the free-rider problem, private competitive markets fail to provide this optimal output, justifying government intervention or public financing.`,
        zh: `由于公共物品具备非竞争性，消费者 1 和消费者 2 可以同时享用完全相同的产出。因此，全社会的总需求曲线必须通过【垂直求和】得出：MSB = MB₁ + MB₂（在 Q* = ${qOpt} 时，各自意愿为 $${mb1(qOpt).toFixed(1)} 和 $${mb2(qOpt).toFixed(1)}，纵向相加为 $${msbFunc(qOpt).toFixed(1)}）。社会最优供给量位于 MSB = MC（$${mc}）交点处。由于非排他性与搭便车行为，自由私人市场无法自发提供该最优产量，必须通过政府公共财政资助或统一提供。`
      },
      analysisPoints: [
        {
          en: 'Vertical vs Horizontal Summation: Private goods sum quantities horizontally (Q_total = Q₁ + Q₂ at each price). Public goods sum willingness to pay vertically (MSB = MB₁ + MB₂ at each quantity).',
          zh: '垂直求和对比水平求和：私人物品在每个价格水平上横向加总数量（Q_total = Q₁ + Q₂）；公共物品在每个数量水平上纵向加总支付意愿（MSB = MB₁ + MB₂）。'
        },
        {
          en: 'Non-Rivalry: One person\'s consumption does not reduce the amount available to others. Everyone consumes the exact same quantity Q.',
          zh: '非竞争性：一个人的消费绝不会减少其他人消费该物品的数量或效用，所有人共同消费完全相同数量的 Q。'
        },
        {
          en: 'Non-Excludability & Free-Rider Problem: People cannot be prevented from enjoying the good once provided, tempting individuals to withhold payment, causing unregulated private markets to underprovide or completely fail.',
          zh: '非排他性与搭便车困境：一旦公共物品被提供，无法阻止未付款者享用，导致每个人都试图搭便车不愿出资，最终导致自由市场供给严重不足甚至完全失灵。'
        }
      ]
    };
  }
};
