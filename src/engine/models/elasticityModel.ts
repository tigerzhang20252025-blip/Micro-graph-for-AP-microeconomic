import { EconomicModel, GraphCalculationOutput, ScenarioPreset, CurveSpec, KeyPointSpec, ShadedAreaSpec } from '../../types/graph';
import { generateLinearPoints, generateParabolicPoints } from '../economicMath';

export interface ElasticityParams {
  priceLevel: number;        // 10 to 90
  demandIntercept: number;   // 80 to 120
  demandSlope: number;       // -0.5 to -1.5 (default -1.0)
  crossPricePercentage: number; // % price change in related good Y (-20% to +20%)
  crossGoodType: 'substitute' | 'complement' | 'unrelated';
  incomePercentage: number;     // % income change (-20% to +20%)
  incomeGoodType: 'normal_luxury' | 'normal_necessity' | 'inferior';
}

const defaultParams: ElasticityParams = {
  priceLevel: 60,
  demandIntercept: 100,
  demandSlope: -1.0,
  crossPricePercentage: 10,
  crossGoodType: 'substitute',
  incomePercentage: 10,
  incomeGoodType: 'normal_necessity'
};

const presets: ScenarioPreset[] = [
  {
    id: 'elastic-zone',
    name: {
      en: 'Elastic Region (|PED| > 1)',
      zh: '富有弹性区间（|PED| > 1）'
    },
    description: {
      en: 'High price, low quantity. A price drop causes quantity to surge by a greater percentage, raising Total Revenue.',
      zh: '高价格、低数量区间。降价促使需求量以更大百分比激增，从而增加总收益（TR）。'
    },
    params: {
      priceLevel: 75,
      demandIntercept: 100,
      demandSlope: -1.0,
      crossPricePercentage: 10,
      crossGoodType: 'substitute',
      incomePercentage: 10,
      incomeGoodType: 'normal_necessity'
    }
  },
  {
    id: 'unit-elastic-point',
    name: {
      en: 'Unit Elastic Midpoint (|PED| = 1.0, Max TR)',
      zh: '单位弹性中点（|PED| = 1.0，总收益最大）'
    },
    description: {
      en: 'The exact geometric midpoint of linear demand. Total Revenue is at its absolute mathematical maximum (MR = 0).',
      zh: '线性需求曲线的几何中点。边际收益（MR）为零，厂商总收益达到绝对数学极大值。'
    },
    params: {
      priceLevel: 50,
      demandIntercept: 100,
      demandSlope: -1.0,
      crossPricePercentage: 10,
      crossGoodType: 'substitute',
      incomePercentage: 10,
      incomeGoodType: 'normal_necessity'
    }
  },
  {
    id: 'inelastic-zone',
    name: {
      en: 'Inelastic Region (|PED| < 1)',
      zh: '缺乏弹性区间（|PED| < 1）'
    },
    description: {
      en: 'Low price, high quantity. A price increase loses few customers, thus increasing Total Revenue.',
      zh: '低价格、高数量区间。提价流失的客户比例较小，因此提价反而会增加总收益（TR）。'
    },
    params: {
      priceLevel: 25,
      demandIntercept: 100,
      demandSlope: -1.0,
      crossPricePercentage: 10,
      crossGoodType: 'substitute',
      incomePercentage: 10,
      incomeGoodType: 'normal_necessity'
    }
  }
];

export const elasticityModel: EconomicModel = {
  id: 'price-elasticity-demand',
  topicId: 'price-elasticity-demand',
  name: {
    en: 'Price Elasticity & Total Revenue Test',
    zh: '需求价格弹性与总收益测试'
  },
  description: {
    en: 'Dual-panel model linking price elasticity of demand (|PED|) along a linear curve to the Total Revenue parabola, plus cross-price and income elasticity.',
    zh: '连接线性需求弹性（|PED|）与抛物线总收益（TR）的双图联动模型，兼顾交叉价格弹性与收入弹性测试。'
  },
  defaultParams,
  presets,
  controls: [
    {
      type: 'slider',
      id: 'priceLevel',
      label: {
        en: 'Product Price (P)',
        zh: '商品售价（P）'
      },
      min: 10,
      max: 90,
      step: 1,
      unit: '$',
      help: {
        en: 'Slide to move up and down the demand curve and observe the Total Revenue Test.',
        zh: '拖动滑块沿着需求曲线上下移动，实时观察总收益的变化方向。'
      }
    },
    {
      type: 'slider',
      id: 'demandSlope',
      label: {
        en: 'Demand Curve Slope (dP/dQ)',
        zh: '需求曲线斜率（dP/dQ）'
      },
      min: -2.0,
      max: -0.5,
      step: 0.1,
      unit: '',
      help: {
        en: 'Adjusts steepness. Notice: slope is constant everywhere on the line, but elasticity changes at every point!',
        zh: '调节需求曲线的陡峭程度。请注意：直线上任意一点的斜率恒定，但弹性却处处不同！'
      }
    },
    {
      type: 'select',
      id: 'crossGoodType',
      label: {
        en: 'Cross-Price Related Good Relationship',
        zh: '相关商品关系（交叉价格弹性 XED）'
      },
      options: [
        { id: 'substitute', label: { en: 'Substitutes (XED > 0)', zh: '替代品（XED > 0）' } },
        { id: 'complement', label: { en: 'Complements (XED < 0)', zh: '互补品（XED < 0）' } },
        { id: 'unrelated', label: { en: 'Unrelated Goods (XED = 0)', zh: '无关品（XED = 0）' } }
      ]
    },
    {
      type: 'select',
      id: 'incomeGoodType',
      label: {
        en: 'Income Elasticity Classification',
        zh: '商品收入属性（收入弹性 YED）'
      },
      options: [
        { id: 'normal_luxury', label: { en: 'Normal Luxury (YED > 1)', zh: '正常奢侈品（YED > 1）' } },
        { id: 'normal_necessity', label: { en: 'Normal Necessity (0 < YED ≤ 1)', zh: '正常必需品（0 < YED ≤ 1）' } },
        { id: 'inferior', label: { en: 'Inferior Good (YED < 0)', zh: '劣等品（YED < 0）' } }
      ]
    }
  ],
  calculate(rawParams: Record<string, any>): GraphCalculationOutput {
    const params: ElasticityParams = { ...defaultParams, ...rawParams };

    const a = params.demandIntercept;
    const b = Math.abs(params.demandSlope); // slope magnitude: P = a - b * Q
    const maxQ = a / b;
    const midQ = a / (2 * b);
    const midP = a / 2;

    const currentP = Math.min(a - 2, Math.max(2, params.priceLevel));
    const currentQ = Math.max(0, (a - currentP) / b);
    const currentTR = currentP * currentQ;

    // Point PED: | (dQ/dP) * (P/Q) | = (1/b) * (currentP / currentQ)
    const ped = currentQ > 0 ? (currentP / (b * currentQ)) : 99;
    const elasticityCategory = ped > 1.05 ? 'elastic' : ped < 0.95 ? 'inelastic' : 'unit';

    // Total Revenue Test direction:
    // If elastic: P down -> TR up; P up -> TR down
    // If inelastic: P down -> TR down; P up -> TR up
    const trTestInsight = {
      en: elasticityCategory === 'elastic'
        ? 'In the ELASTIC zone (|PED| > 1): Price and Total Revenue move in OPPOSITE directions (P↓ ⇒ TR↑, P↑ ⇒ TR↓).'
        : elasticityCategory === 'inelastic'
        ? 'In the INELASTIC zone (|PED| < 1): Price and Total Revenue move in the SAME direction (P↑ ⇒ TR↑, P↓ ⇒ TR↓).'
        : 'At UNIT ELASTICITY (|PED| = 1.0): Total Revenue is MAXIMIZED ($2500). Marginal Revenue = $0.',
      zh: elasticityCategory === 'elastic'
        ? '在【富有弹性区间】（|PED| > 1）：价格与总收益呈【反向变动】（降价 P↓ ⇒ TR↑，提价 P↑ ⇒ TR↓）。'
        : elasticityCategory === 'inelastic'
        ? '在【缺乏弹性区间】（|PED| < 1）：价格与总收益呈【同向变动】（提价 P↑ ⇒ TR↑，降价 P↓ ⇒ TR↓）。'
        : '在【单位弹性中点】（|PED| = 1.0）：总收益达到【最大值】（$2,500），边际收益 MR = 0。'
    };

    // Main Graph: Demand Curve with Colorized Segments
    const demandPoints = generateLinearPoints({ intercept: a, slope: -b }, 0, maxQ, 30, 0, a);

    const curves: CurveSpec[] = [
      {
        id: 'demandCurve',
        name: { en: `Demand Curve (P = ${a} - ${b.toFixed(1)}Q)`, zh: `需求曲线（P = ${a} - ${b.toFixed(1)}Q）` },
        shortLabel: 'D',
        points: demandPoints,
        color: '#2563eb',
        strokeWidth: 3.5,
        strokeDasharray: 'none',
        visible: true,
        equation: `P = ${a} - ${b.toFixed(1)}Q`,
        endLabelPosition: 'end'
      },
      // Horizontal dashed boundary line at midpoint
      {
        id: 'midpointBoundary',
        name: { en: 'Unit-Elastic Midpoint (PED = 1)', zh: '单位弹性中点水平线（PED = 1）' },
        shortLabel: 'PED = 1',
        points: [{ x: 0, y: midP }, { x: maxQ, y: midP }],
        color: '#059669',
        strokeWidth: 1.5,
        strokeDasharray: '4,4',
        visible: true,
        endLabelPosition: 'end'
      }
    ];

    const points: KeyPointSpec[] = [
      {
        id: 'currentChoice',
        label: { en: 'Selected Price Point', zh: '当前选定价格点' },
        shortLabel: `(${currentQ.toFixed(0)}, $${currentP.toFixed(0)})`,
        x: Number(currentQ.toFixed(1)),
        y: Number(currentP.toFixed(1)),
        color: elasticityCategory === 'elastic' ? '#2563eb' : elasticityCategory === 'inelastic' ? '#dc2626' : '#059669',
        showDropLines: true,
        xLabel: `Q=${currentQ.toFixed(0)}`,
        yLabel: `P=$${currentP.toFixed(0)}`
      },
      {
        id: 'midPoint',
        label: { en: 'Midpoint (Unit Elastic)', zh: '中点（单位弹性）' },
        shortLabel: 'Mid',
        x: Number(midQ.toFixed(1)),
        y: Number(midP.toFixed(1)),
        color: '#059669',
        showDropLines: false
      }
    ];

    // Shaded Revenue Area (P * Q rectangle)
    const shadedAreas: ShadedAreaSpec[] = [
      {
        id: 'revenueBox',
        label: { en: `Total Revenue Box (P × Q = $${currentTR.toFixed(0)})`, zh: `总收益矩形面积（P × Q = $${currentTR.toFixed(0)}）` },
        points: [
          { x: 0, y: 0 },
          { x: currentQ, y: 0 },
          { x: currentQ, y: currentP },
          { x: 0, y: currentP }
        ],
        fill: elasticityCategory === 'elastic' ? '#3b82f6' : elasticityCategory === 'inelastic' ? '#f59e0b' : '#10b981',
        opacity: 0.22,
        pattern: 'dots',
        value: Number(currentTR.toFixed(0)),
        valuePrefix: '$',
        visible: true
      }
    ];

    // Secondary Graph: Total Revenue Parabola (TR = a*Q - b*Q^2)
    const trPoints: KeyPointSpec[] = [
      {
        id: 'currentTRPoint',
        label: { en: 'Current Total Revenue', zh: '当前总收益点' },
        shortLabel: `TR=$${currentTR.toFixed(0)}`,
        x: Number(currentQ.toFixed(1)),
        y: Number(currentTR.toFixed(0)),
        color: '#7c3aed',
        showDropLines: true,
        xLabel: `Q=${currentQ.toFixed(0)}`,
        yLabel: `$${currentTR.toFixed(0)}`
      },
      {
        id: 'maxTRPoint',
        label: { en: 'Maximum Total Revenue', zh: '最大总收益点' },
        shortLabel: 'Max TR',
        x: Number(midQ.toFixed(1)),
        y: Number((midP * midQ).toFixed(0)),
        color: '#059669',
        showDropLines: true,
        xLabel: `Q=${midQ.toFixed(0)}`,
        yLabel: `$${(midP * midQ).toFixed(0)}`
      }
    ];

    const trCurvePoints = generateParabolicPoints(a, b, 0, maxQ, 40);
    const secondaryGraph = {
      title: {
        en: 'Total Revenue Curve: TR = P × Q (Parabola)',
        zh: '总收益曲线：TR = P × Q（抛物线，中点处达到极大值）'
      },
      axes: {
        xLabel: { en: 'Quantity Demanded (Q)', zh: '需求量（Q）' },
        yLabel: { en: 'Total Revenue (TR in $)', zh: '总收益（TR，美元）' },
        xMin: 0,
        xMax: maxQ * 1.1,
        yMin: 0,
        yMax: (a * a) / (4 * b) * 1.15,
        xStep: 20,
        yStep: 500,
        xSuffix: '',
        yPrefix: '$'
      },
      curves: [
        {
          id: 'trParabola',
          name: { en: 'Total Revenue (TR = aQ - bQ²)', zh: '总收益曲线（TR = aQ - bQ²）' },
          shortLabel: 'TR',
          points: trCurvePoints,
          color: '#7c3aed', // Purple
          strokeWidth: 3,
          strokeDasharray: 'none',
          visible: true,
          equation: `TR = ${a}Q - ${b.toFixed(1)}Q²`,
          endLabelPosition: 'end' as const
        }
      ],
      points: trPoints,
      shadedAreas: [
        {
          id: 'trAreaUnderCurve',
          label: { en: 'Total Revenue Level', zh: '总收益水平' },
          points: [
            { x: 0, y: 0 },
            { x: currentQ, y: 0 },
            { x: currentQ, y: currentTR },
            { x: 0, y: currentTR }
          ],
          fill: '#8b5cf6',
          opacity: 0.15,
          pattern: 'solid' as const,
          visible: true
        }
      ]
    };

    // Custom Interactive Elasticity Table
    const xedValue = params.crossGoodType === 'substitute' ? '+1.45' : params.crossGoodType === 'complement' ? '-1.20' : '0.00';
    const yedValue = params.incomeGoodType === 'normal_luxury' ? '+2.10' : params.incomeGoodType === 'normal_necessity' ? '+0.65' : '-0.85';

    const customTable = {
      title: { en: 'AP Microeconomics Elasticities Summary Matrix', zh: 'AP 微观经济学核心弹性测试对照表' },
      subtitle: { en: 'PED, Total Revenue Test, XED & YED', zh: '需求价格弹性、总收益检验、交叉弹性与收入弹性' },
      headers: [
        { en: 'Metric', zh: '弹性指标' },
        { en: 'Formula & Value', zh: '计算公式与当前数值' },
        { en: 'Economic Meaning', zh: '经济学性质判定' },
        { en: 'AP Exam Decision Rule', zh: 'AP 考试解题核心法则' }
      ],
      rows: [
        {
          id: 'ped-row',
          label: { en: 'Price Elasticity of Demand (|PED|)', zh: '需求价格弹性（|PED|）' },
          values: [
            `|(%ΔQ) / (%ΔP)| = ${ped.toFixed(2)}`,
            {
              en: elasticityCategory === 'elastic' ? 'Elastic (|PED| > 1)' : elasticityCategory === 'inelastic' ? 'Inelastic (|PED| < 1)' : 'Unit Elastic (|PED| = 1)',
              zh: elasticityCategory === 'elastic' ? '富有弹性（|PED| > 1）' : elasticityCategory === 'inelastic' ? '缺乏弹性（|PED| < 1）' : '单位弹性（|PED| = 1）'
            },
            trTestInsight
          ],
          highlight: true
        },
        {
          id: 'xed-row',
          label: { en: 'Cross-Price Elasticity (XED)', zh: '交叉价格弹性（XED）' },
          values: [
            `(%ΔQ_A) / (%ΔP_B) = ${xedValue}`,
            {
              en: params.crossGoodType === 'substitute' ? 'Substitutes (XED > 0)' : params.crossGoodType === 'complement' ? 'Complements (XED < 0)' : 'Unrelated (XED = 0)',
              zh: params.crossGoodType === 'substitute' ? '替代品（XED > 0）' : params.crossGoodType === 'complement' ? '互补品（XED < 0）' : '无关品（XED = 0）'
            },
            {
              en: 'If Py ↑ leads to Qx ↑, consumers switch away to X (Substitutes like Coke & Pepsi).',
              zh: '若 Y 商品涨价导致 X 商品需求量增加，说明二者可互相替代（如可口可乐与百事可乐）。'
            }
          ]
        },
        {
          id: 'yed-row',
          label: { en: 'Income Elasticity of Demand (YED)', zh: '收入弹性（YED）' },
          values: [
            `(%ΔQ) / (%ΔIncome) = ${yedValue}`,
            {
              en: params.incomeGoodType === 'normal_luxury' ? 'Normal Luxury (YED > 1)' : params.incomeGoodType === 'normal_necessity' ? 'Normal Necessity (0 < YED ≤ 1)' : 'Inferior Good (YED < 0)',
              zh: params.incomeGoodType === 'normal_luxury' ? '正常奢侈品（YED > 1）' : params.incomeGoodType === 'normal_necessity' ? '正常必需品（0 < YED ≤ 1）' : '劣等品（YED < 0）'
            },
            {
              en: 'If Income ↑ leads to Q ↓, it is an Inferior Good (e.g. instant noodles, used cars).',
              zh: '若居民收入增加导致对该物品的需求量反而减少，则为劣等品（如泡面、廉价二手车）。'
            }
          ]
        }
      ]
    };

    const results = [
      {
        id: 'pedValue',
        label: { en: 'Price Elasticity (|PED|)', zh: '需求价格弹性值（|PED|）' },
        value: `${ped.toFixed(2)}`,
        color: elasticityCategory === 'elastic' ? '#2563eb' : elasticityCategory === 'inelastic' ? '#dc2626' : '#059669',
        formula: '|(dQ/dP) × (P/Q)|'
      },
      {
        id: 'elasticityType',
        label: { en: 'Elasticity Zone', zh: '弹性区间判定' },
        value: elasticityCategory === 'elastic' ? 'Elastic (|PED| > 1)' : elasticityCategory === 'inelastic' ? 'Inelastic (|PED| < 1)' : 'Unit Elastic (|PED| = 1)',
        color: elasticityCategory === 'elastic' ? '#2563eb' : elasticityCategory === 'inelastic' ? '#dc2626' : '#059669'
      },
      {
        id: 'totalRev',
        label: { en: 'Current Total Revenue (TR)', zh: '当前总收益（TR）' },
        value: `$${currentTR.toFixed(2)}`,
        color: '#7c3aed',
        formula: 'P × Q'
      },
      {
        id: 'maxTR',
        label: { en: 'Max Potential Revenue', zh: '最大潜在总收益' },
        value: `$${((a * a) / (4 * b)).toFixed(2)}`,
        color: '#059669',
        formula: 'At Midpoint (P=50, Q=50)'
      },
      {
        id: 'marginalRev',
        label: { en: 'Marginal Revenue (MR)', zh: '边际收益（MR）' },
        value: `$${(a - 2 * b * currentQ).toFixed(2)}`,
        color: (a - 2 * b * currentQ) >= 0 ? '#059669' : '#dc2626',
        formula: 'dTR/dQ = a - 2bQ'
      }
    ];

    const explanation = {
      en: `At a price of $${currentP.toFixed(0)}, quantity demanded is ${currentQ.toFixed(0)} units, yielding a Total Revenue of $${currentTR.toFixed(0)}. The price elasticity of demand is |PED| = ${ped.toFixed(2)}, putting the market in the ${elasticityCategory.toUpperCase()} region. ${trTestInsight.en} Crucially, notice that the slope of this linear demand curve is constant at ${params.demandSlope.toFixed(1)}, but the elasticity changes continuously from infinity at the top to zero at the bottom!`,
      zh: `在当前售价 $${currentP.toFixed(0)} 下，市场需求量为 ${currentQ.toFixed(0)} 单位，厂商总收益为 $${currentTR.toFixed(0)}。此时需求价格弹性 |PED| = ${ped.toFixed(2)}，处于【${elasticityCategory === 'elastic' ? '富有弹性' : elasticityCategory === 'inelastic' ? '缺乏弹性' : '单位弹性'}】区间。${trTestInsight.zh} 极为关键的是：整条线性需求曲线的斜率严格恒定为 ${params.demandSlope.toFixed(1)}，但弹性却从纵轴截距处的无穷大持续下降至横轴截距处的 0！斜率绝对不等于弹性！`
    };

    const analysisPoints = [
      {
        en: 'Slope ≠ Elasticity: Slope is the constant ratio of absolute changes (ΔP/ΔQ), whereas elasticity is the ratio of percentage changes (%ΔQ/%ΔP).',
        zh: '斜率不等于弹性：斜率衡量绝对变动之比（ΔP/ΔQ，直线上恒定不变），而弹性衡量百分比变动之比（%ΔQ/%ΔP，直线上处处不同）。'
      },
      {
        en: 'Total Revenue Test: When demand is elastic, price cuts increase revenue. When demand is inelastic, price hikes increase revenue. Revenue peaks where PED = 1.0 (MR = 0).',
        zh: '总收益检验法则：在富有弹性区间，降价增加总收益；在缺乏弹性区间，提价增加总收益。总收益在中点 PED = 1.0 处达到极大值（对应 MR = 0）。'
      },
      {
        en: 'Cross-Price & Income Elasticity: XED sign indicates substitute (+) vs complement (-); YED sign indicates normal (+) vs inferior (-).',
        zh: '交叉与收入弹性符号法则：XED 正号代表替代品，负号代表互补品；YED 正号代表正常品，负号代表劣等品。'
      }
    ];

    return {
      axes: {
        xLabel: { en: 'Quantity Demanded (Q in units)', zh: '需求量（Q，单位）' },
        yLabel: { en: 'Price (P in $)', zh: '价格（P，美元）' },
        xMin: 0,
        xMax: maxQ * 1.1,
        yMin: 0,
        yMax: a * 1.08,
        xStep: 20,
        yStep: 20,
        xSuffix: ' units',
        yPrefix: '$'
      },
      curves,
      points,
      shadedAreas,
      results,
      secondaryGraph,
      customTable,
      explanation,
      analysisPoints
    };
  }
};
