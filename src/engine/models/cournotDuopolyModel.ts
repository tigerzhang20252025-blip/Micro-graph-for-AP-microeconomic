import { EconomicModel, GraphCalculationOutput, ScenarioPreset, CurveSpec, KeyPointSpec } from '../../types/graph';
import { generateLinearPoints } from '../economicMath';

export interface CournotParams {
  demandIntercept: number; // A: 80 to 140, default 120
  marginalCost: number;    // c: 10 to 40, default 30
  demandSlope: number;     // B: 0.5 to 2.0, default 1.0
}

const defaultParams: CournotParams = {
  demandIntercept: 120,
  marginalCost: 30,
  demandSlope: 1.0
};

const presets: ScenarioPreset[] = [
  {
    id: 'cournot-baseline',
    name: {
      en: 'Standard Cournot Duopoly Equilibrium (Simultaneous Output)',
      zh: '标准古诺双头垄断均衡（同时产量决策博弈）'
    },
    description: {
      en: 'Two symmetric firms simultaneously pick output. Best response reaction curves intersect at the Cournot-Nash equilibrium.',
      zh: '两家对称厂商同时决定产量。最佳应对反应曲线的交点即为古诺-纳什均衡点。'
    },
    params: {
      demandIntercept: 120,
      marginalCost: 30,
      demandSlope: 1.0
    }
  },
  {
    id: 'low-cost-innovation',
    name: {
      en: 'Technological Cost Reduction (MC falls to $15)',
      zh: '技术革新与成本降低（MC 降至 $15）'
    },
    description: {
      en: 'A lower marginal cost increases profit margins, shifting both firms\' best response curves outward and expanding industry output.',
      zh: '更低的边际成本扩大了利润边际，推动两家厂商的最佳反应曲线同时向外平移，全行业总产出显著扩张。'
    },
    params: {
      demandIntercept: 120,
      marginalCost: 15,
      demandSlope: 1.0
    }
  },
  {
    id: 'large-market-expansion',
    name: {
      en: 'Market Demand Expansion (Intercept rises to 140)',
      zh: '市场需求规模扩张（需求截距升至 140）'
    },
    description: {
      en: 'Growing consumer appetite expands market capacity, drawing more production from both duopolists.',
      zh: '市场总体需求扩大，带动两家双头厂商同时大幅增加供应配额。'
    },
    params: {
      demandIntercept: 140,
      marginalCost: 30,
      demandSlope: 1.0
    }
  }
];

export const cournotDuopolyModel: EconomicModel = {
  id: 'cournot-duopoly',
  topicId: 'cournot-duopoly',
  name: {
    en: 'Cournot Duopoly: Reaction Curves & Nash Equilibrium',
    zh: '古诺双头垄断：反应曲线与纳什均衡'
  },
  description: {
    en: 'Advanced oligopoly model of simultaneous quantity competition: reaction curves R1(q2) and R2(q1), Cournot-Nash equilibrium, and comparison with cartel collusion and perfect competition.',
    zh: '高级寡头垄断数理模型：同时产量决策下的最佳反应函数 R1(q2) 与 R2(q1)、古诺-纳什均衡解，以及与卡特尔合谋及完全竞争基准的对比。'
  },
  defaultParams,
  presets,
  controls: [
    {
      type: 'slider',
      id: 'demandIntercept',
      label: { en: 'Market Demand Intercept (A in $)', zh: '市场需求截距（A，美元）' },
      min: 80,
      max: 150,
      step: 5,
      unit: '$'
    },
    {
      type: 'slider',
      id: 'marginalCost',
      label: { en: 'Constant Marginal Cost (c in $)', zh: '固定边际成本（c，美元）' },
      min: 10,
      max: 45,
      step: 5,
      unit: '$'
    },
    {
      type: 'slider',
      id: 'demandSlope',
      label: { en: 'Demand Slope Sensitivity (B)', zh: '需求斜率敏感度（B）' },
      min: 0.5,
      max: 2.0,
      step: 0.1
    }
  ],

  calculate(params: Record<string, any>): GraphCalculationOutput {
    const A = Number(params.demandIntercept) || 120;
    const c = Number(params.marginalCost) || 30;
    const B = Number(params.demandSlope) || 1.0;

    const netA = Math.max(10, A - c);
    const qMono = netA / (2 * B);
    const qCournotEach = netA / (3 * B);
    const qCollusionEach = netA / (4 * B);
    const qCompTotal = netA / B;

    const pCournot = A - B * (2 * qCournotEach);
    const pCollusion = A - B * (2 * qCollusionEach);
    const profitCournotEach = (pCournot - c) * qCournotEach;
    const profitCollusionEach = (pCollusion - c) * qCollusionEach;

    const xMax = Math.max(50, Math.ceil((netA / B) * 1.25 / 5) * 5);
    const yMax = xMax;

    // Reaction curves:
    // R1: q2 = (netA / B) - 2 * q1
    const r1Points = generateLinearPoints(
      { intercept: netA / B, slope: -2 },
      0,
      Math.min(xMax, netA / (2 * B)),
      40,
      0,
      yMax
    );

    // R2: q2 = (netA / (2*B)) - 0.5 * q1
    const r2Points = generateLinearPoints(
      { intercept: netA / (2 * B), slope: -0.5 },
      0,
      Math.min(xMax, netA / B),
      40,
      0,
      yMax
    );

    const symmetryPoints = [
      { x: 0, y: 0 },
      { x: xMax, y: xMax }
    ];

    const curves: CurveSpec[] = [
      {
        id: 'reaction-1',
        name: { en: 'Firm 1 Best Response R1(q2)', zh: '厂商 1 最佳应对曲线 R1(q2)' },
        shortLabel: 'R1',
        points: r1Points,
        color: '#2563eb',
        strokeWidth: 3,
        visible: true,
        equation: `q1 = ${(netA / (2 * B)).toFixed(1)} - 0.5 q2`
      },
      {
        id: 'reaction-2',
        name: { en: 'Firm 2 Best Response R2(q1)', zh: '厂商 2 最佳应对曲线 R2(q1)' },
        shortLabel: 'R2',
        points: r2Points,
        color: '#dc2626',
        strokeWidth: 3,
        visible: true,
        equation: `q2 = ${(netA / (2 * B)).toFixed(1)} - 0.5 q1`
      },
      {
        id: 'symmetry-line',
        name: { en: 'Symmetry Line (q1 = q2)', zh: '对称线（q1 = q2）' },
        shortLabel: 'q1=q2',
        points: symmetryPoints,
        color: '#9ca3af',
        strokeWidth: 1.5,
        strokeDasharray: '4,3',
        visible: true
      }
    ];

    const points: KeyPointSpec[] = [
      {
        id: 'cournot-nash-pt',
        x: qCournotEach,
        y: qCournotEach,
        shortLabel: 'Nash',
        label: { en: `Cournot-Nash Equilibrium (q1*=${qCournotEach.toFixed(1)}, q2*=${qCournotEach.toFixed(1)})`, zh: `古诺-纳什均衡点 (q1*=${qCournotEach.toFixed(1)}, q2*=${qCournotEach.toFixed(1)})` },
        color: '#059669',
        showDropLines: true
      },
      {
        id: 'collusion-pt',
        x: qCollusionEach,
        y: qCollusionEach,
        shortLabel: 'Cartel',
        label: { en: `Cartel Collusion (q1=${qCollusionEach.toFixed(1)}, q2=${qCollusionEach.toFixed(1)})`, zh: `卡特尔合谋点 (q1=${qCollusionEach.toFixed(1)}, q2=${qCollusionEach.toFixed(1)})` },
        color: '#7c3aed',
        showDropLines: true
      }
    ];

    const results = [
      {
        id: 'cournotQ',
        label: { en: 'Cournot Output per Firm (q1* = q2*)', zh: '古诺各厂均衡产量（q1* = q2*）' },
        value: `${qCournotEach.toFixed(1)} units`,
        color: '#059669',
        formula: '(A - c) / (3B)'
      },
      {
        id: 'totalOutput',
        label: { en: 'Total Industry Output (Q = q1 + q2)', zh: '全行业总产出（Q = q1 + q2）' },
        value: `${(2 * qCournotEach).toFixed(1)} units`,
        color: '#2563eb',
        formula: '2(A - c) / (3B)'
      },
      {
        id: 'cournotPrice',
        label: { en: 'Cournot Market Price (P_cournot)', zh: '古诺市场出清价格' },
        value: `$${pCournot.toFixed(2)}`,
        color: '#2563eb',
        formula: '(A + 2c) / 3'
      },
      {
        id: 'firmProfit',
        label: { en: 'Individual Firm Profit (π)', zh: '个别企业净利润（π）' },
        value: `$${profitCournotEach.toFixed(2)}`,
        color: '#059669',
        formula: '(P - c) × q*'
      },
      {
        id: 'collusionProfit',
        label: { en: 'Cartel Collusion Profit per Firm', zh: '若合谋卡特尔各厂利润' },
        value: `$${profitCollusionEach.toFixed(2)}`,
        color: '#7c3aed',
        formula: '(P_cartel - c) × q_cartel'
      }
    ];

    const explanation = {
      en: `In Cournot competition, each firm chooses its output taking the rival's output as given. The downward-sloping best response curves reflect that when Firm 2 increases output, the remaining residual demand for Firm 1 shrinks, inducing Firm 1 to produce less. The intersection of R1 and R2 establishes the Cournot-Nash Equilibrium (q1* = ${qCournotEach.toFixed(1)}, q2* = ${qCournotEach.toFixed(1)}). Total industry output is ${(2 * qCournotEach).toFixed(1)} units, which lies strictly between pure monopoly (${qMono.toFixed(1)} units) and perfect competition (${qCompTotal.toFixed(1)} units). Notice that while both firms could earn higher profits ($${profitCollusionEach.toFixed(1)} vs $${profitCournotEach.toFixed(1)}) by colluding to restrict output to ${qCollusionEach.toFixed(1)} units each, the cartel point is unstable because each firm faces an incentive to cheat and produce more!`,
      zh: `在古诺产量博弈中，两家厂商将对手的产量视为既定来决定自身的最优产量。向下倾斜的反应函数说明：当对手增产时，留给自身的残余市场需求萎缩，促使己方减产。两条最佳反应曲线 R1 与 R2 的交点构成了唯一的古诺-纳什均衡（q1* = ${qCournotEach.toFixed(1)}, q2* = ${qCournotEach.toFixed(1)}）。全行业总产出为 ${(2 * qCournotEach).toFixed(1)} 单位，严格介于纯垄断产量（${qMono.toFixed(1)} 单位）与完全竞争产量（${qCompTotal.toFixed(1)} 单位）之间。值得注意的是：虽然双方如果合谋将各厂产量限制在 ${qCollusionEach.toFixed(1)} 单位能赚取更高的利润（$${profitCollusionEach.toFixed(1)} vs $${profitCournotEach.toFixed(1)}），但合谋点极不稳定，因为双方都存在单方面背叛偷产以攫取更大利润的强烈诱惑！`
    };

    const analysisPoints = [
      {
        en: 'The Oligopoly Spectrum: Total Output and Price rank as follows: Monopoly Output < Cournot Duopoly Output < Perfect Competition Output, while Monopoly Price > Cournot Price > Competitive Price (= MC).',
        zh: '寡头市场谱系排序：总产量与市场价格严格遵循：纯垄断产量 < 古诺双头总产量 < 完全竞争产量；而纯垄断价格 > 古诺价格 > 完全竞争价格（= MC）。'
      },
      {
        en: 'Incentive to Cheat: At the collusive cartel outcome, each firm has a profitable unilateral incentive to expand output along its reaction curve, illustrating the Prisoner\'s Dilemma inherent in cartels.',
        zh: '背叛合谋的内生动力：在卡特尔合谋点上，任何一家厂商沿着自己的最佳反应曲线单方面偷产均能增加利润，生动展现了卡特尔组织内生的囚徒困境。'
      },
      {
        en: 'Convergence to Perfect Competition: As the number of competing Cournot firms (N) increases toward infinity, the market price converges to marginal cost (P -> MC), and total output approaches competitive equilibrium!',
        zh: '向完全竞争收敛：当古诺厂商数量 N 趋向于无穷大时，市场价格将逐步收敛于边际成本（P -> MC），总产量趋近于完全竞争水平！'
      }
    ];

    return {
      axes: {
        xLabel: { en: 'Firm 1 Output (q1 in units)', zh: '厂商 1 产量（q1，单位）' },
        yLabel: { en: 'Firm 2 Output (q2 in units)', zh: '厂商 2 产量（q2，单位）' },
        xMin: 0,
        xMax,
        yMin: 0,
        yMax,
        xStep: 10,
        yStep: 10,
        xSuffix: ' u',
        yPrefix: ''
      },
      curves,
      points,
      shadedAreas: [],
      results,
      explanation,
      analysisPoints
    };
  }
};
