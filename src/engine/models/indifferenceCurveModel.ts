import { EconomicModel, GraphCalculationOutput, ScenarioPreset, CurveSpec, KeyPointSpec, ShadedAreaSpec, Point2D } from '../../types/graph';

export interface IndifferenceParams {
  income: number;    // e.g. 60 to 180, default 120
  priceX: number;    // e.g. 2 to 10, default 4
  priceY: number;    // e.g. 2 to 10, default 6
}

const defaultParams: IndifferenceParams = {
  income: 120,
  priceX: 4,
  priceY: 6
};

const presets: ScenarioPreset[] = [
  {
    id: 'baseline-optimum',
    name: {
      en: 'Consumer Tangency Optimum (MRS = Px / Py)',
      zh: '消费者切点最优均衡（MRS = Px / Py）'
    },
    description: {
      en: 'The highest reachable indifference curve (U2) is exactly tangent to the budget line at the optimal bundle (X*, Y*).',
      zh: '最高可企及的无差异曲线（U2）与预算约束线在最优组合点（X*, Y*）处精确相切，边际替代率等于价格比。'
    },
    params: {
      income: 120,
      priceX: 4,
      priceY: 6
    }
  },
  {
    id: 'income-shift',
    name: {
      en: 'Income Expansion to $160 (Parallel Budget Shift)',
      zh: '收入扩张至 $160（预算线平行外移）'
    },
    description: {
      en: 'Higher income shifts the budget constraint outward in parallel, reaching a higher utility indifference curve (higher living standard).',
      zh: '收入增加推动预算约束线平行向外平移，使消费者能够触及更高效用的无差异曲线，整体生活水平提升。'
    },
    params: {
      income: 160,
      priceX: 4,
      priceY: 6
    }
  },
  {
    id: 'price-x-pivot',
    name: {
      en: 'Price of Good X drops to $2.5 (Budget Line Pivots Outward)',
      zh: '商品 X 降价至 $2.5（预算线绕纵截距向外旋转）'
    },
    description: {
      en: 'A decrease in Px rotates the budget constraint outward along the horizontal axis, decomposing into substitution and income effects.',
      zh: '商品 X 降价使预算约束线以纵截距为支点向外旋转，可进一步分解为纯替代效应与实际收入效应。'
    },
    params: {
      income: 120,
      priceX: 2.5,
      priceY: 6
    }
  }
];

export const indifferenceCurveModel: EconomicModel = {
  id: 'indifference-curves-budget',
  topicId: 'indifference-curves-budget',
  name: {
    en: 'Indifference Curves & Budget Constraints',
    zh: '无差异曲线与预算约束线切点模型'
  },
  description: {
    en: 'Advanced consumer theory extension: models convex indifference curves tangent to the linear budget line where MRS equals the relative price ratio (Px / Py).',
    zh: '高级微观消费者行为学拓展：建模凸向原点的无差异曲线族与线性预算约束线的切点最优决策（MRS = Px / Py）。'
  },
  defaultParams,
  presets,
  controls: [
    {
      type: 'slider',
      id: 'income',
      label: { en: 'Consumer Total Income / Budget ($)', zh: '消费者总收入 / 预算（美元）' },
      min: 60,
      max: 180,
      step: 10,
      unit: '$'
    },
    {
      type: 'slider',
      id: 'priceX',
      label: { en: 'Price of Good X ($/unit)', zh: '商品 X 单价（美元/件）' },
      min: 2,
      max: 8,
      step: 0.5,
      unit: '$'
    },
    {
      type: 'slider',
      id: 'priceY',
      label: { en: 'Price of Good Y ($/unit)', zh: '商品 Y 单价（美元/件）' },
      min: 3,
      max: 10,
      step: 0.5,
      unit: '$'
    }
  ],

  calculate(params: Record<string, any>): GraphCalculationOutput {
    const income = Number(params.income) || 120;
    const px = Number(params.priceX) || 4;
    const py = Number(params.priceY) || 6;

    const xIntercept = income / px;
    const yIntercept = income / py;
    const slope = px / py;

    const optX = income / (2 * px);
    const optY = income / (2 * py);
    const optUtility = Math.sqrt(optX * optY);

    const u1 = optUtility * 0.72;
    const u3 = optUtility * 1.30;

    const xMax = Math.max(40, Math.ceil((xIntercept * 1.25) / 5) * 5);
    const yMax = Math.max(35, Math.ceil((yIntercept * 1.25) / 5) * 5);

    const budgetPoints: Point2D[] = [
      { x: 0, y: yIntercept },
      { x: xIntercept, y: 0 }
    ];

    const generateIndifferenceCurve = (uVal: number, minX = 2, maxX = xMax): Point2D[] => {
      const pts: Point2D[] = [];
      const uSq = uVal * uVal;
      for (let x = minX; x <= maxX; x += 0.8) {
        const y = uSq / x;
        if (y <= yMax + 5) {
          pts.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
        }
      }
      return pts;
    };

    const ic1Points = generateIndifferenceCurve(u1, 2, xMax);
    const icOptPoints = generateIndifferenceCurve(optUtility, 2, xMax);
    const ic3Points = generateIndifferenceCurve(u3, 4, xMax);

    const curves: CurveSpec[] = [
      {
        id: 'budget-line',
        name: { en: 'Budget Constraint Line (Px·X + Py·Y = I)', zh: '预算约束线（Px·X + Py·Y = I）' },
        shortLabel: 'BC',
        points: budgetPoints,
        color: '#dc2626',
        strokeWidth: 3,
        visible: true,
        equation: `Y = ${yIntercept.toFixed(1)} - ${slope.toFixed(2)}X`
      },
      {
        id: 'ic-tangent',
        name: { en: `Optimal Indifference Curve U* (${optUtility.toFixed(1)} utils)`, zh: `最优切点无差异曲线 U*（${optUtility.toFixed(1)} 效用）` },
        shortLabel: 'U*',
        points: icOptPoints,
        color: '#2563eb',
        strokeWidth: 3.5,
        visible: true,
        equation: `Y = ${(optUtility * optUtility).toFixed(1)} / X`
      },
      {
        id: 'ic-lower',
        name: { en: `Lower Indifference Curve U1 (${u1.toFixed(1)} utils)`, zh: `较低效用无差异曲线 U1（${u1.toFixed(1)} 效用）` },
        shortLabel: 'U1',
        points: ic1Points,
        color: '#93c5fd',
        strokeWidth: 2,
        strokeDasharray: '4,3',
        visible: true
      },
      {
        id: 'ic-higher',
        name: { en: `Unattainable Indifference Curve U3 (${u3.toFixed(1)} utils)`, zh: `不可企及无差异曲线 U3（${u3.toFixed(1)} 效用）` },
        shortLabel: 'U3',
        points: ic3Points,
        color: '#9ca3af',
        strokeWidth: 2,
        strokeDasharray: '5,3',
        visible: true
      }
    ];

    const points: KeyPointSpec[] = [
      {
        id: 'opt-bundle',
        x: optX,
        y: optY,
        shortLabel: 'E*',
        label: { en: `Consumer Optimum E* (${optX.toFixed(1)} X, ${optY.toFixed(1)} Y)`, zh: `消费者最优切点 E* (${optX.toFixed(1)} X, ${optY.toFixed(1)} Y)` },
        color: '#2563eb',
        showDropLines: true
      },
      {
        id: 'x-max-intercept',
        x: xIntercept,
        y: 0,
        shortLabel: 'I/Px',
        label: { en: `Max X = ${xIntercept.toFixed(1)}`, zh: `全买 X 截距 = ${xIntercept.toFixed(1)}` },
        color: '#dc2626'
      },
      {
        id: 'y-max-intercept',
        x: 0,
        y: yIntercept,
        shortLabel: 'I/Py',
        label: { en: `Max Y = ${yIntercept.toFixed(1)}`, zh: `全买 Y 截距 = ${yIntercept.toFixed(1)}` },
        color: '#dc2626'
      }
    ];

    const shadedAreas: ShadedAreaSpec[] = [
      {
        id: 'budget-set',
        label: { en: 'Affordable Budget Set', zh: '可负担预算可行集' },
        points: [
          { x: 0, y: 0 },
          { x: 0, y: yIntercept },
          { x: xIntercept, y: 0 }
        ],
        fill: '#60a5fa',
        opacity: 0.12,
        visible: true
      }
    ];

    const results = [
      {
        id: 'optimalX',
        label: { en: 'Optimal Good X Consumption (X*)', zh: '商品 X 最优购买量（X*）' },
        value: `${optX.toFixed(1)} units`,
        color: '#2563eb',
        formula: 'I / (2 · Px)'
      },
      {
        id: 'optimalY',
        label: { en: 'Optimal Good Y Consumption (Y*)', zh: '商品 Y 最优购买量（Y*）' },
        value: `${optY.toFixed(1)} units`,
        color: '#2563eb',
        formula: 'I / (2 · Py)'
      },
      {
        id: 'mrsVal',
        label: { en: 'Marginal Rate of Substitution (MRS)', zh: '边际替代率（MRS = MUx / MUy）' },
        value: slope.toFixed(2),
        color: '#059669',
        formula: 'Px / Py'
      },
      {
        id: 'maxUtil',
        label: { en: 'Maximized Utility Level (U*)', zh: '最大化效用水平（U*）' },
        value: `${optUtility.toFixed(1)} utils`,
        color: '#7c3aed',
        formula: '√(X* · Y*)'
      },
      {
        id: 'budgetCheck',
        label: { en: 'Budget Constraint Verification', zh: '预算约束验证' },
        value: `$${(optX * px + optY * py).toFixed(0)} spent of $${income}`,
        color: '#059669'
      }
    ];

    const explanation = {
      en: `The consumer reaches optimal equilibrium at point E* (${optX.toFixed(1)} units of X, ${optY.toFixed(1)} units of Y) where the budget constraint is exactly tangent to the highest attainable indifference curve (U* = ${optUtility.toFixed(1)} utils). At this point, the Marginal Rate of Substitution (MRS = ${slope.toFixed(2)}), representing the consumer's subjective willingness to trade Good Y for Good X, exactly equals the market price ratio (Px / Py = ${slope.toFixed(2)}). Any bundle on curve U3 is unaffordable under current income, while bundles on curve U1 provide strictly lower satisfaction.`,
      zh: `消费者在切点 E*（购买 ${optX.toFixed(1)} 件商品 X 与 ${optY.toFixed(1)} 件商品 Y）达到最优均衡。此时预算约束线与最高可企及的无差异曲线（U* = ${optUtility.toFixed(1)} 效用）精确相切。在此最优点上，代表消费者主观交换意愿的边际替代率（MRS = ${slope.toFixed(2)}）恰好等于市场客观价格比（Px / Py = ${slope.toFixed(2)}）。U3 曲线上的组合因预算不足而不可企及，而 U1 曲线上的组合效用明显偏低。`
    };

    const analysisPoints = [
      {
        en: 'Tangency Condition: Consumer utility is maximized where the slope of the indifference curve (-MRS) equals the slope of the budget line (-Px / Py). Thus, MRS = Px / Py.',
        zh: '切点最优条件：无差异曲线的斜率（-MRS）与预算约束线的斜率（-Px / Py）相等的切点即为效用最大化点，即 MRS = Px / Py。'
      },
      {
        en: 'Price Change Decomposition: When Px falls, the budget line swings outward. This total change can be decomposed into: (1) Substitution Effect (moving along the same indifference curve to a steeper point) and (2) Income Effect (shifting to a higher indifference curve).',
        zh: '价格效应分解：当 Px 下降时，预算线向外旋转。总效应可精确分解为：（1）替代效应（在同一条无差异曲线上滑动至更陡峭处，多买便宜商品）；（2）收入效应（因购买力增强而跃迁至更高无差异曲线）。'
      },
      {
        en: 'Diminishing MRS: Indifference curves are convex to the origin because consumers become progressively less willing to give up scarce Y to gain an additional unit of abundant X.',
        zh: '边际替代率递减法则：无差异曲线之所以向原点凸出，是因为随着消费者拥有的 X 越来越多，愿意为了多得一单位 X 而放弃的稀缺 Y 数量越来越少。'
      }
    ];

    return {
      axes: {
        xLabel: { en: 'Quantity of Good X (Units)', zh: '商品 X 消费量（件数）' },
        yLabel: { en: 'Quantity of Good Y (Units)', zh: '商品 Y 消费量（件数）' },
        xMin: 0,
        xMax,
        yMin: 0,
        yMax,
        xStep: 5,
        yStep: 5,
        xSuffix: ' u',
        yPrefix: ''
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
