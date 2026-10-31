import { EconomicModel, GraphCalculationOutput, ScenarioPreset, CurveSpec, KeyPointSpec, CustomTableSpec, CustomTableRow } from '../../types/graph';
import { generateLinearPoints } from '../economicMath';

export interface UtilityParams {
  income: number;    // e.g. 20 to 60, default 40
  priceX: number;    // e.g. 2 to 10, default 4
  priceY: number;    // e.g. 2 to 10, default 8
}

const defaultParams: UtilityParams = {
  income: 40,
  priceX: 4,
  priceY: 8
};

const presets: ScenarioPreset[] = [
  {
    id: 'baseline-optimum',
    name: {
      en: 'Baseline Optimum: Income $40, Px = $4, Py = $8',
      zh: '基准最优解：预算 $40，Px = $4，Py = $8'
    },
    description: {
      en: 'Consumer maximizes total utility subject to the budget constraint where MUx / Px = MUy / Py.',
      zh: '在预算约束下，消费者在 MUx / Px = MUy / Py 的均衡点处实现总效用最大化。'
    },
    params: {
      income: 40,
      priceX: 4,
      priceY: 8
    }
  },
  {
    id: 'income-increase',
    name: {
      en: 'Income Expansion: Income increases to $60',
      zh: '收入扩张效应：预算提升至 $60'
    },
    description: {
      en: 'Expanding consumer income relaxes the budget constraint, shifting the affordable combinations outward and allowing consumption of both normal goods to rise.',
      zh: '消费者预算增加放宽了约束，使可负担组合向外移动，正常商品的购买量与总效用显著增加。'
    },
    params: {
      income: 60,
      priceX: 4,
      priceY: 8
    }
  },
  {
    id: 'price-x-drop',
    name: {
      en: 'Price of Good X drops to $2 (Increases MUx / Px)',
      zh: '商品 X 价格降至 $2（提升 MUx / Px 边际性价比）'
    },
    description: {
      en: 'A drop in the price of Good X makes each dollar spent on Good X yield more marginal utility, incentivizing the consumer to substitute toward Good X.',
      zh: '商品 X 降价使花在 X 上的每一美元带来更高的边际效用，激励消费者通过替代效应与收入效应增购商品 X。'
    },
    params: {
      income: 40,
      priceX: 2,
      priceY: 8
    }
  }
];

export const utilityMaximizationModel: EconomicModel = {
  id: 'marginal-analysis-utility',
  topicId: 'marginal-analysis-utility',
  name: {
    en: 'Marginal Utility Analysis & Equi-Marginal Rule',
    zh: '边际效用分析与等边际效用法则'
  },
  description: {
    en: 'Solves the consumer choice problem where MUx / Px = MUy / Py subject to the budget constraint, illustrating diminishing marginal utility and the optimal consumption bundle.',
    zh: '在预算约束下求解消费者的效用最大化组合：MUx / Px = MUy / Py，直观演示边际效用递减规律与最优支出分配。'
  },
  defaultParams,
  presets,
  controls: [
    {
      type: 'slider',
      id: 'income',
      label: { en: 'Total Consumer Income / Budget ($)', zh: '消费者总收入 / 预算（美元）' },
      min: 20,
      max: 80,
      step: 4,
      unit: '$'
    },
    {
      type: 'slider',
      id: 'priceX',
      label: { en: 'Price of Good X ($/unit)', zh: '商品 X 单价（美元/件）' },
      min: 2,
      max: 10,
      step: 1,
      unit: '$'
    },
    {
      type: 'slider',
      id: 'priceY',
      label: { en: 'Price of Good Y ($/unit)', zh: '商品 Y 单价（美元/件）' },
      min: 2,
      max: 12,
      step: 1,
      unit: '$'
    }
  ],

  calculate(params: Record<string, any>): GraphCalculationOutput {
    const income = Number(params.income) || 40;
    const px = Number(params.priceX) || 4;
    const py = Number(params.priceY) || 8;

    let bestQx = 0;
    let bestQy = 0;
    let maxTotalUtility = -1;
    let bestSpent = 0;

    const tuX = (q: number) => {
      let sum = 0;
      for (let k = 1; k <= q; k++) sum += Math.max(0, 48 - 4 * k);
      return sum;
    };
    const tuY = (q: number) => {
      let sum = 0;
      for (let k = 1; k <= q; k++) sum += Math.max(0, 64 - 8 * k);
      return sum;
    };

    const maxUnitsX = Math.floor(income / px);
    const maxUnitsY = Math.floor(income / py);
    // Search every affordable discrete bundle. Do not force the consumer to
    // spend income on units whose marginal utility has already fallen to zero.
    for (let qx = 0; qx <= maxUnitsX; qx++) {
      for (let qy = 0; qy <= maxUnitsY; qy++) {
        const spent = qx * px + qy * py;
        if (spent > income) continue;
        const currentTU = tuX(qx) + tuY(qy);
        if (currentTU > maxTotalUtility || (currentTU === maxTotalUtility && spent < bestSpent)) {
          maxTotalUtility = currentTU;
          bestQx = qx;
          bestQy = qy;
          bestSpent = spent;
        }
      }
    }

    const muXStar = Math.max(0, 48 - 4 * bestQx);
    const muYStar = Math.max(0, 64 - 8 * bestQy);
    const muPerDollarX = muXStar / px;
    const muPerDollarY = muYStar / py;

    const xMax = 12;
    const yMax = 20;

    const muPxPoints = generateLinearPoints(
      { intercept: 48 / px, slope: -4 / px },
      0.5,
      11,
      40,
      0,
      yMax
    );

    const muPyPoints = generateLinearPoints(
      { intercept: 64 / py, slope: -8 / py },
      0.5,
      7.5,
      40,
      0,
      yMax
    );

    const curves: CurveSpec[] = [
      {
        id: 'mu-px',
        name: { en: `MUx / Px (Good X, Px=$${px})`, zh: `MUx / Px（商品 X 每美元边际效用，Px=$${px}）` },
        shortLabel: 'MUx/Px',
        points: muPxPoints,
        color: '#2563eb',
        strokeWidth: 3,
        visible: true,
        equation: `MUx/Px = (48 - 4Q) / ${px}`
      },
      {
        id: 'mu-py',
        name: { en: `MUy / Py (Good Y, Py=$${py})`, zh: `MUy / Py（商品 Y 每美元边际效用，Py=$${py}）` },
        shortLabel: 'MUy/Py',
        points: muPyPoints,
        color: '#d97706',
        strokeWidth: 3,
        visible: true,
        equation: `MUy/Py = (64 - 8Q) / ${py}`
      },
      {
        id: 'equi-mu-ref',
        name: { en: 'Target Equalized MU / $ Level', zh: '目标等边际性价比水平线' },
        shortLabel: 'Eq MU/$',
        points: [
          { x: 0, y: Math.max(muPerDollarX, muPerDollarY) },
          { x: xMax, y: Math.max(muPerDollarX, muPerDollarY) }
        ],
        color: '#6b7280',
        strokeWidth: 1.5,
        strokeDasharray: '3,3',
        visible: true
      }
    ];

    const points: KeyPointSpec[] = [
      {
        id: 'opt-x-pt',
        x: bestQx,
        y: muPerDollarX,
        shortLabel: 'X*',
        label: { en: `Good X Optimum: Qx = ${bestQx} (MUx/Px = ${muPerDollarX.toFixed(1)})`, zh: `商品 X 最优量: Qx = ${bestQx} (MUx/Px = ${muPerDollarX.toFixed(1)})` },
        color: '#2563eb',
        showDropLines: true
      },
      {
        id: 'opt-y-pt',
        x: bestQy,
        y: muPerDollarY,
        shortLabel: 'Y*',
        label: { en: `Good Y Optimum: Qy = ${bestQy} (MUy/Py = ${muPerDollarY.toFixed(1)})`, zh: `商品 Y 最优量: Qy = ${bestQy} (MUy/Py = ${muPerDollarY.toFixed(1)})` },
        color: '#d97706',
        showDropLines: true
      }
    ];

    const tableRows: CustomTableRow[] = [];
    for (let q = 1; q <= 6; q++) {
      const mx = Math.max(0, 48 - 4 * q);
      const mxPer = mx / px;
      const my = Math.max(0, 64 - 8 * q);
      const myPer = my / py;

      const isChoice = q === bestQx || q === bestQy;

      tableRows.push({
        id: `unit-${q}`,
        label: { en: `Unit ${q}`, zh: `第 ${q} 件` },
        values: [
          `${mx} utils`,
          `${mxPer.toFixed(1)}${q === bestQx ? ' ★ (X*)' : ''}`,
          `${my} utils`,
          `${myPer.toFixed(1)}${q === bestQy ? ' ★ (Y*)' : ''}`
        ],
        highlight: isChoice
      });
    }

    const customTable: CustomTableSpec = {
      title: {
        en: 'Discrete Marginal Utility per Dollar Schedule (AP Exam Style)',
        zh: '每美元边际效用分级决策表（AP 考试经典大题格式）'
      },
      headers: [
        { en: 'Unit Consumed', zh: '消费件数（Q）' },
        { en: 'MU_X (utils)', zh: '商品 X 边际效用 (MU_x)' },
        { en: 'MU_X / P_X', zh: 'X 每美元边际效用 (MU_x/Px)' },
        { en: 'MU_Y (utils)', zh: '商品 Y 边际效用 (MU_y)' },
        { en: 'MU_Y / P_Y', zh: 'Y 每美元边际效用 (MU_y/Py)' }
      ],
      rows: tableRows
    };

    const results = [
      {
        id: 'optBundle',
        label: { en: 'Optimal Utility-Maximizing Bundle', zh: '效用最大化最优消费组合' },
        value: `(${bestQx} units of X, ${bestQy} units of Y)`,
        color: '#059669',
        formula: 'MUx/Px ≈ MUy/Py'
      },
      {
        id: 'totalUtility',
        label: { en: 'Total Utility Achieved (TU)', zh: '实现的总效用（TU）' },
        value: `${maxTotalUtility} utils`,
        color: '#2563eb',
        formula: 'TU_X + TU_Y'
      },
      {
        id: 'budgetSpent',
        label: { en: 'Total Expenditure vs Budget', zh: '总支出对比总预算' },
        value: `$${bestSpent} / $${income}`,
        color: bestSpent <= income ? '#059669' : '#dc2626',
        formula: 'Px·Qx + Py·Qy ≤ Income'
      },
      {
        id: 'muPxRatio',
        label: { en: 'Last Dollar Value on Good X (MUx / Px)', zh: '花在 X 最后一美元边际效用' },
        value: `${muPerDollarX.toFixed(2)} utils/$`,
        color: '#2563eb'
      },
      {
        id: 'muPyRatio',
        label: { en: 'Last Dollar Value on Good Y (MUy / Py)', zh: '花在 Y 最后一美元边际效用' },
        value: `${muPerDollarY.toFixed(2)} utils/$`,
        color: '#d97706'
      }
    ];

    const explanation = {
      en: `The consumer maximizes Total Utility at ${bestQx} units of X ($${bestQx * px}) and ${bestQy} units of Y ($${bestQy * py}), spending $${bestSpent} of the $${income} budget. With indivisible goods, the final MU-per-dollar values may be close rather than exactly equal, and unspent income can be optimal once every additional affordable unit has zero marginal utility.`,
      zh: `消费者在购买 ${bestQx} 件 X（花费 $${bestQx * px}）与 ${bestQy} 件 Y（花费 $${bestQy * py}）时实现总效用最大化，共支出 $${bestSpent} / $${income}。由于商品不可分割，最后一单位的每美元边际效用可能只接近而非严格相等；当所有可额外购买单位的边际效用均为零时，保留未花完的预算也可能最优。`
    };

    const analysisPoints = [
      {
        en: 'The Equi-Marginal Principle: Always purchase the good that provides the highest marginal utility per dollar (MU / P). Continue allocating sequential dollars until the entire budget is exhausted and MUx / Px = MUy / Py.',
        zh: '等边际准则：每一块钱永远优先购买“每美元边际效用（MU / P）”最高的商品。随着边际效用递减，不断比较并购买性价比最高的商品，直至预算用尽且两者的 MU / P 齐平。'
      },
      {
        en: 'Price Change Response: If the price of Good X rises, MUx / Px immediately drops. To re-equalize the condition, the consumer must buy LESS of Good X (which raises MUx due to diminishing marginal returns). This is the behavioral origin of the downward-sloping Demand curve!',
        zh: '价格变动与需求定理推导：若商品 X 价格上涨，MUx / Px 瞬时下降。为了恢复等边际均衡，消费者必须减少购买 X（根据边际效用递减规律，减少购买会使 MUx 回升）。这就是需求曲线向下倾斜的微观行为学根源！'
      },
      {
        en: 'AP Exam Pitfall: Never maximize total utility by merely equalizing MUx = MUy! You MUST divide by the respective prices because goods have different dollar costs.',
        zh: 'AP 考试高频陷阱：切勿单纯令 MUx = MUy！必须除以各自的单价比较“性价比”，因为不同商品耗费的预算成本不同。'
      }
    ];

    return {
      axes: {
        xLabel: { en: 'Quantity of Goods (Units)', zh: '商品消费数量（件数）' },
        yLabel: { en: 'Marginal Utility per Dollar (MU / P in utils/$)', zh: '每美元边际效用（MU / P，效用/美元）' },
        xMin: 0,
        xMax,
        yMin: 0,
        yMax,
        xStep: 2,
        yStep: 4,
        xSuffix: ' u',
        yPrefix: ''
      },
      curves,
      points,
      shadedAreas: [],
      results,
      customTable,
      explanation,
      analysisPoints
    };
  }
};
