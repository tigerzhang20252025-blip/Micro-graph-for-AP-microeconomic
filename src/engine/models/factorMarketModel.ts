import { EconomicModel, GraphCalculationOutput, ScenarioPreset, CurveSpec, KeyPointSpec, ShadedAreaSpec } from '../../types/graph';
import { generateLinearPoints } from '../economicMath';

export interface FactorMarketParams {
  marketStructure: 'competitive_firm' | 'monopsony';
  laborProductPrice: number;    // Price of good sold (default 5)
  marginalProductBase: number;  // Initial MP (default 24)
  mpDiminishingRate: number;    // Diminishing rate of MP (default 1.2)
  laborSupplyBase: number;      // Wage intercept (default 10)
  laborSupplySlope: number;     // Labor supply slope (default 1.5)
  minWageRate?: number;         // Optional minimum wage (e.g. 0 to 60)
}

const defaultParams: FactorMarketParams = {
  marketStructure: 'monopsony',
  laborProductPrice: 5,
  marginalProductBase: 24,
  mpDiminishingRate: 1.2,
  laborSupplyBase: 10,
  laborSupplySlope: 1.5,
  minWageRate: 0
};

const presets: ScenarioPreset[] = [
  {
    id: 'monopsony-baseline',
    name: {
      en: 'Monopsony Labor Market (MFC > S_L, Wage Exploitation)',
      zh: '买方垄断劳动力市场（MFC > S_L，工资压低与雇佣不足）'
    },
    description: {
      en: 'A single employer hires labor where MRP = MFC, but pays the lower wage from the labor supply curve (Wm < Wc), causing deadweight loss and underemployment.',
      zh: '劳动力市场单一买家：在 MRP = MFC 处决定雇佣人数 Lm，但在劳动力供给线上支付较低工资 Wm（Wm < Wc），导致雇佣不足与死重损失。'
    },
    params: {
      marketStructure: 'monopsony',
      laborProductPrice: 5,
      marginalProductBase: 24,
      mpDiminishingRate: 1.2,
      laborSupplyBase: 10,
      laborSupplySlope: 1.5,
      minWageRate: 0
    }
  },
  {
    id: 'monopsony-min-wage',
    name: {
      en: 'Minimum Wage in Monopsony (Increases Employment!)',
      zh: '买方垄断下的最低工资政策（罕见地同时提高工资与就业！）'
    },
    description: {
      en: 'Imposing a minimum wage equal to the competitive wage flattens the MFC, neutralizing monopsony power and simultaneously increasing both wages and employment.',
      zh: '设定等于竞争工资的法定最低工资，使雇主的边际要素成本线在受控区间内变平，神奇地消除买方垄断扭曲，使就业量与工资率同时上升！'
    },
    params: {
      marketStructure: 'monopsony',
      laborProductPrice: 5,
      marginalProductBase: 24,
      mpDiminishingRate: 1.2,
      laborSupplyBase: 10,
      laborSupplySlope: 1.5,
      minWageRate: 37
    }
  },
  {
    id: 'competitive-factor-firm',
    name: {
      en: 'Competitive Labor Market (Wage Taker: S_L = MFC = W*)',
      zh: '完全竞争劳动力市场（工资接受者：S_L = MFC = W*）'
    },
    description: {
      en: 'Firms are wage-takers facing a perfectly elastic labor supply curve (W = MFC). Hiring expands until MRP = W*. Allocative efficiency in factor markets is achieved.',
      zh: '厂商是工资接受者，面对完全水平的劳动供给曲线（W = MFC）。厂商雇佣工人直至 MRP = 工资率 W*，达成要素市场的配置效率。'
    },
    params: {
      marketStructure: 'competitive_firm',
      laborProductPrice: 5,
      marginalProductBase: 24,
      mpDiminishingRate: 1.2,
      laborSupplyBase: 35,
      laborSupplySlope: 0,
      minWageRate: 0
    }
  }
];

export const factorMarketModel: EconomicModel = {
  id: 'monopsony-factor-market',
  topicId: 'monopsony-factor-market',
  name: {
    en: 'Factor Markets: Competitive Labor vs Monopsony',
    zh: '要素市场：完全竞争劳动力市场与买方垄断模型'
  },
  description: {
    en: 'Calculates Marginal Revenue Product (MRP = MP × P), Marginal Factor Cost (MFC), competitive vs monopsonistic wage determination, and minimum wage remedies.',
    zh: '精确计算边际收益产品（MRP = MP × P）、边际要素成本（MFC）、竞争与买方垄断雇佣及工资决策，以及最低工资的政策效应。'
  },
  defaultParams,
  presets,
  controls: [
    {
      type: 'select',
      id: 'marketStructure',
      label: { en: 'Factor Market Structure', zh: '要素市场结构' },
      options: [
        { id: 'monopsony', label: { en: 'Monopsony (Single Buyer of Labor)', zh: '买方垄断（单一雇主）' } },
        { id: 'competitive_firm', label: { en: 'Competitive Labor Firm (Wage Taker)', zh: '完全竞争厂商（工资接受者）' } }
      ]
    },
    {
      type: 'slider',
      id: 'laborProductPrice',
      label: { en: 'Product Selling Price ($/unit of output)', zh: '最终产出品售价（P，美元）' },
      min: 3,
      max: 8,
      step: 0.5,
      unit: '$'
    },
    {
      type: 'slider',
      id: 'minWageRate',
      label: { en: 'Statutory Minimum Wage ($/hour, 0 = none)', zh: '法定最低工资（美元/小时，0 为无管制）' },
      min: 0,
      max: 55,
      step: 1,
      unit: '$/hr'
    }
  ],

  calculate(params: Record<string, any>): GraphCalculationOutput {
    const isMonopsony = (params.marketStructure || 'monopsony') === 'monopsony';
    const P = Number(params.laborProductPrice) || 5;
    const mp0 = Number(params.marginalProductBase) || 24;
    const mpSlope = Number(params.mpDiminishingRate) || 1.2;
    const minWage = Number(params.minWageRate) || 0;

    const mrpIntercept = P * mp0;
    const mrpSlope = P * mpSlope;

    const a = isMonopsony ? (Number(params.laborSupplyBase) || 10) : 35;
    const b = isMonopsony ? (Number(params.laborSupplySlope) || 1.5) : 0;

    const mfcIntercept = a;
    const mfcSlope = isMonopsony ? 2 * b : 0;

    const lComp = (mrpIntercept - a) / (b + mrpSlope);
    const wComp = a + b * lComp;

    const lMonoRaw = (mrpIntercept - mfcIntercept) / (mrpSlope + mfcSlope);
    const wMonoRaw = a + b * lMonoRaw;
    const mrpAtMono = mrpIntercept - mrpSlope * lMonoRaw;

    let lActual = isMonopsony ? lMonoRaw : lComp;
    let wActual = isMonopsony ? wMonoRaw : wComp;

    if (isMonopsony && minWage > 0) {
      if (minWage > wMonoRaw) {
        const lFlatCapacity = b > 0 ? (minWage - a) / b : lComp;
        const lMrpDemand = (mrpIntercept - minWage) / mrpSlope;

        if (minWage <= wComp) {
          lActual = Math.min(lFlatCapacity, lMrpDemand);
          wActual = minWage;
        } else {
          lActual = Math.max(0, lMrpDemand);
          wActual = minWage;
        }
      }
    }

    const dwl = isMonopsony
      ? 0.5 * (mrpAtMono - wMonoRaw) * (lComp - lMonoRaw)
      : 0;

    const xMax = 25;
    const yMax = 130;

    const mrpPoints = generateLinearPoints(
      { intercept: mrpIntercept, slope: -mrpSlope },
      0,
      Math.min(xMax, mrpIntercept / mrpSlope),
      40,
      0,
      yMax
    );

    const slPoints = generateLinearPoints(
      { intercept: a, slope: b },
      0,
      xMax,
      40,
      0,
      yMax
    );

    const curves: CurveSpec[] = [
      {
        id: 'mrp',
        name: { en: 'Marginal Revenue Product (MRP_L = MP × P)', zh: '边际收益产品（MRP_L = MP × P）' },
        shortLabel: 'MRP_L',
        points: mrpPoints,
        color: '#2563eb',
        strokeWidth: 3,
        visible: true,
        equation: `MRP = ${mrpIntercept.toFixed(1)} - ${mrpSlope.toFixed(1)}L`
      },
      {
        id: 'sl',
        name: { en: isMonopsony ? 'Labor Supply (S_L / Average Factor Cost)' : 'Labor Supply (S_L = MFC = W*)', zh: isMonopsony ? '劳动力供给（S_L / 平均要素成本）' : '劳动力供给（S_L = MFC = W*）' },
        shortLabel: isMonopsony ? 'S_L' : 'S_L=MFC',
        points: slPoints,
        color: '#059669',
        strokeWidth: 3,
        visible: true,
        equation: isMonopsony ? `W = ${a.toFixed(1)} + ${b.toFixed(1)}L` : `W = $${a.toFixed(1)}`
      }
    ];

    if (isMonopsony) {
      const mfcPoints = generateLinearPoints(
        { intercept: mfcIntercept, slope: mfcSlope },
        0,
        Math.min(xMax, (yMax - mfcIntercept) / (mfcSlope || 1)),
        40,
        0,
        yMax
      );

      curves.push({
        id: 'mfc',
        name: { en: 'Marginal Factor Cost (MFC / MRC)', zh: '边际要素成本（MFC / MRC）' },
        shortLabel: 'MFC',
        points: mfcPoints,
        color: '#dc2626',
        strokeWidth: 2.5,
        strokeDasharray: '4,2',
        visible: true,
        equation: `MFC = ${mfcIntercept.toFixed(1)} + ${mfcSlope.toFixed(1)}L`
      });
    }

    if (minWage > 0) {
      curves.push({
        id: 'minWageLine',
        name: { en: `Statutory Minimum Wage ($${minWage})`, zh: `法定最低工资（$${minWage}）` },
        shortLabel: 'W_min',
        points: [
          { x: 0, y: minWage },
          { x: xMax, y: minWage }
        ],
        color: '#9333ea',
        strokeWidth: 2,
        strokeDasharray: '5,3',
        visible: true
      });
    }

    const points: KeyPointSpec[] = [];

    if (isMonopsony) {
      points.push({
        id: 'mono-mfc-eq',
        x: lMonoRaw,
        y: mrpAtMono,
        shortLabel: 'MRP=MFC',
        label: { en: `MRP = MFC (L_m = ${lMonoRaw.toFixed(1)})`, zh: `MRP = MFC (L_m = ${lMonoRaw.toFixed(1)})` },
        color: '#dc2626',
        showDropLines: true
      });

      points.push({
        id: 'mono-wage-point',
        x: lMonoRaw,
        y: wMonoRaw,
        shortLabel: 'W_m',
        label: { en: `Monopsony Wage W_m = $${wMonoRaw.toFixed(1)}`, zh: `买方垄断工资 W_m = $${wMonoRaw.toFixed(1)}` },
        color: '#059669',
        showDropLines: true
      });

      points.push({
        id: 'comp-benchmark',
        x: lComp,
        y: wComp,
        shortLabel: 'E_c',
        label: { en: `Competitive Benchmark (L_c=${lComp.toFixed(1)}, W_c=$${wComp.toFixed(1)})`, zh: `完全竞争基准 (L_c=${lComp.toFixed(1)}, W_c=$${wComp.toFixed(1)})` },
        color: '#2563eb',
        showDropLines: true
      });
    } else {
      points.push({
        id: 'comp-hire-point',
        x: lComp,
        y: wComp,
        shortLabel: 'E*',
        label: { en: `Firm Optimum: MRP = W* (L* = ${lComp.toFixed(1)})`, zh: `厂商最优点：MRP = W* (L* = ${lComp.toFixed(1)})` },
        color: '#2563eb',
        showDropLines: true
      });
    }

    const shadedAreas: ShadedAreaSpec[] = [];

    if (isMonopsony && minWage === 0) {
      shadedAreas.push({
        id: 'mono-dwl',
        label: { en: `Monopsony Deadweight Loss ($${dwl.toFixed(1)})`, zh: `买方垄断死重损失 ($${dwl.toFixed(1)})` },
        points: [
          { x: lMonoRaw, y: mrpAtMono },
          { x: lComp, y: wComp },
          { x: lMonoRaw, y: wMonoRaw }
        ],
        fill: '#ef4444',
        opacity: 0.25,
        visible: true
      });
    }

    const results = [
      {
        id: 'actualL',
        label: { en: 'Labor Hired (Employment L)', zh: '实际雇佣人数（L）' },
        value: `${lActual.toFixed(1)} workers`,
        color: '#2563eb',
        formula: isMonopsony ? 'MRP = MFC rule' : 'MRP = W* rule'
      },
      {
        id: 'actualW',
        label: { en: 'Wage Rate Paid (W)', zh: '支付工资率（W）' },
        value: `$${wActual.toFixed(2)}/hr`,
        color: '#059669',
        formula: isMonopsony ? 'From S_L curve' : 'Market wage'
      },
      {
        id: 'compL',
        label: { en: 'Competitive Efficient L (L_c)', zh: '完全竞争有效雇佣量（L_c）' },
        value: `${lComp.toFixed(1)} workers`,
        color: '#4b5563'
      },
      {
        id: 'compW',
        label: { en: 'Competitive Wage (W_c)', zh: '完全竞争均衡工资（W_c）' },
        value: `$${wComp.toFixed(2)}/hr`,
        color: '#4b5563'
      },
      {
        id: 'dwlVal',
        label: { en: 'Market Deadweight Loss', zh: '市场无谓损失（DWL）' },
        value: isMonopsony && minWage === 0 ? `$${dwl.toFixed(2)}` : '$0.00',
        color: isMonopsony && minWage === 0 ? '#dc2626' : '#059669'
      }
    ];

    const explanation = {
      en: isMonopsony
        ? minWage > 0 && minWage <= wComp
          ? `Remarkable Monopsony Phenomenon: Setting a minimum wage of $${minWage.toFixed(2)} actually INCREASES employment from ${lMonoRaw.toFixed(1)} to ${lActual.toFixed(1)} workers while simultaneously raising wages from $${wMonoRaw.toFixed(2)} to $${wActual.toFixed(2)}! Because the minimum wage eliminates the monopsonist's incentive to restrict hiring, MFC becomes horizontal at $${minWage.toFixed(2)}.`
          : `Because the monopsonist is the sole buyer of labor, hiring an additional worker forces it to raise wages for all previous workers. Hence, MFC lies above Labor Supply. The monopsonist hires where MRP = MFC (${lMonoRaw.toFixed(1)} workers), but pays only $${wMonoRaw.toFixed(2)} from the Labor Supply curve. This creates wage exploitation ($${(mrpAtMono - wMonoRaw).toFixed(2)} markdown below MRP) and $${dwl.toFixed(1)} in deadweight loss.`
        : `In a competitive factor market, the individual firm is a wage-taker facing a perfectly horizontal labor supply curve (S_L = MFC = W* = $${wComp.toFixed(2)}). The firm maximizes profit by hiring workers up to the point where MRP_L = W* (${lComp.toFixed(1)} workers). Factor resources are allocatively efficient.`,
      zh: isMonopsony
        ? minWage > 0 && minWage <= wComp
          ? `罕见的买方垄断经济奇迹：设立 $${minWage.toFixed(2)} 的法定最低工资，竟然将雇佣量从 ${lMonoRaw.toFixed(1)} 人扩大到 ${lActual.toFixed(1)} 人，同时将工人工资从 $${wMonoRaw.toFixed(2)} 提高到 $${wActual.toFixed(2)}！这是因为最低工资消除了垄断雇主压低产量的动力，使 MFC 在受控范围内变平。`
          : `由于买方垄断是当地唯一的劳动力买家，增聘一名工人必须给所有已有员工同等加薪，导致 MFC 显著陡峭于劳动力供给曲线。企业在 MRP = MFC 处雇佣 ${lMonoRaw.toFixed(1)} 人，却顺着劳动供给线仅支付 $${wMonoRaw.toFixed(2)} 的低工资，产生 $${(mrpAtMono - wMonoRaw).toFixed(2)} 的“工资剥削（Wage Markdown）”与 $${dwl.toFixed(1)} 的社会死重损失。`
        : `在完全竞争要素市场中，个别企业是工资接受者，面对完全水平的劳动力供给曲线（S_L = MFC = W* = $${wComp.toFixed(2)}）。企业遵循边际分析法雇佣员工直至 MRP_L = W*（${lComp.toFixed(1)} 人），要素市场达到社会配置最优。`
    };

    const analysisPoints = [
      {
        en: 'Derived Demand: The demand for labor is derived from the demand for the final good produced. If product price (P) or marginal productivity (MP_L) rises, labor demand (MRP) shifts right.',
        zh: '派生需求法则：对劳动力（要素）的需求派生自对最终产品的市场需求。若产品售价（P）或工人边际产出（MP_L）上升，劳动力需求曲线（MRP）将向右平移。'
      },
      {
        en: 'Hiring Rules: All firms hire where MRP = MFC (or MRC). For a competitive wage-taker, MFC = Wage (W). For a monopsonist, MFC > Wage (W).',
        zh: '通用雇佣准则：所有厂商均在 MRP = MFC（或 MRC）处做出雇佣决策。对于竞争性雇主，MFC = W；而对于买方垄断雇主，MFC > W。'
      },
      {
        en: 'AP Exam Classic: In competitive markets, a binding minimum wage causes unemployment (surplus of labor). In a monopsony, a well-chosen minimum wage can INCREASE employment!',
        zh: 'AP 经典必考点：在完全竞争劳动力市场，最低工资必然导致失业（劳动力过剩）；但在买方垄断市场中，适度的最低工资反而能“同时增进就业与提高工资”！'
      }
    ];

    return {
      axes: {
        xLabel: { en: 'Quantity of Labor (L in workers)', zh: '劳动力雇佣量（L，工人数）' },
        yLabel: { en: 'Wage & Marginal Value (W, MRP, MFC in $/hr)', zh: '工资率与边际收益（W, MRP, MFC，美元/小时）' },
        xMin: 0,
        xMax,
        yMin: 0,
        yMax,
        xStep: 5,
        yStep: 20,
        xSuffix: ' w',
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
