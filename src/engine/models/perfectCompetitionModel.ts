import { EconomicModel, GraphCalculationOutput, ScenarioPreset, CurveSpec, KeyPointSpec, ShadedAreaSpec, Point2D } from '../../types/graph';
import { evaluateMC, evaluateAVC, evaluateATC, generateLinearPoints, findLinearIntersection } from '../economicMath';

export interface PerfectCompParams {
  marketDemandShift: number;  // -30 to +30 (controls market price)
  firmFixedCost: number;      // 60 to 180 (controls firm ATC height)
  firmEntryExitAdjustment: number; // -30 to +30 (shifts market supply via firm entry/exit)
}

const defaultParams: PerfectCompParams = {
  marketDemandShift: 0,
  firmFixedCost: 110,
  firmEntryExitAdjustment: 0
};

const presets: ScenarioPreset[] = [
  {
    id: 'long-run-equilibrium',
    name: {
      en: 'Long-Run Equilibrium (Zero Economic Profit / P = min ATC)',
      zh: '长期均衡状态（零经济利润 / P = min ATC）'
    },
    description: {
      en: 'Market equilibrium sets price exactly equal to the minimum of the firm’s ATC. The firm earns normal profit with zero incentive for entry or exit.',
      zh: '市场供求决定的价格恰好等于企业 ATC 的最低点。企业获得正常利润（经济利润为零），行业达到长期稳态，无企业进出。'
    },
    params: {
      marketDemandShift: 0,
      firmFixedCost: 110,
      firmEntryExitAdjustment: 0
    }
  },
  {
    id: 'economic-profit',
    name: {
      en: 'Short-Run Economic Profit (P > ATC)',
      zh: '短期超额经济利润（P > ATC）'
    },
    description: {
      en: 'A surge in market demand raises price above ATC. The firm earns economic profit, which will attract new entrants in the long run.',
      zh: '市场需求激增推高市场价格，使其高于企业 ATC。企业获得超额经济利润，这在长期中将吸引新厂商不断涌入。'
    },
    params: {
      marketDemandShift: 18,
      firmFixedCost: 110,
      firmEntryExitAdjustment: 0
    }
  },
  {
    id: 'loss-minimizing',
    name: {
      en: 'Short-Run Loss with Production (AVC ≤ P < ATC)',
      zh: '短期亏损但继续生产（AVC ≤ P < ATC）'
    },
    description: {
      en: 'Market price drops below ATC but remains above AVC. The firm operates at a loss in the short run to help cover fixed costs.',
      zh: '市场价格跌破 ATC 但依然高于 AVC。企业短期内继续生产，因为收益在弥补全部可变成本后还能补贴部分固定成本。'
    },
    params: {
      marketDemandShift: -10,
      firmFixedCost: 110,
      firmEntryExitAdjustment: 0
    }
  },
  {
    id: 'shutdown-condition',
    name: {
      en: 'Short-Run Shutdown Condition (P < min AVC)',
      zh: '短期停产临界状态（P < min AVC）'
    },
    description: {
      en: 'Price falls below minimum AVC. Revenue fails to even cover operating variable costs, so the firm shuts down immediately (q = 0).',
      zh: '价格跌破最低 AVC。总收益甚至无法弥补日常可变成本，企业必须立即停产（产出归零），将亏损严格限定为固定成本。'
    },
    params: {
      marketDemandShift: -20,
      firmFixedCost: 110,
      firmEntryExitAdjustment: 0
    }
  }
];

export const perfectCompetitionModel: EconomicModel = {
  id: 'perfect-competition-side-by-side',
  topicId: 'perfect-competition-side-by-side',
  name: {
    en: 'Perfect Competition: Side-by-Side Market & Firm',
    zh: '完全竞争：市场与厂商并排联动双图'
  },
  description: {
    en: 'The signature AP Microeconomics side-by-side model. The market determines the price that individual price-taker firms accept as horizontal demand (Mr. DARP: P = MR = D = AR).',
    zh: 'AP 微观最具标志性的双图联动模型。左图大市场供求决定均衡价格，右图个别价格接受者厂商面对水平需求线（Mr. DARP: P = MR = D = AR），展示利润最大化与进退调整。'
  },
  defaultParams,
  presets,
  controls: [
    {
      type: 'slider',
      id: 'marketDemandShift',
      label: {
        en: 'Market Demand Shift (ΔD_market)',
        zh: '市场需求变动平移（ΔD_market）'
      },
      min: -30,
      max: 30,
      step: 2,
      unit: '',
      help: {
        en: 'Simulates industry demand shocks (e.g. consumer tastes, population).',
        zh: '模拟整个行业的需求冲击（如消费者偏好变化、人口增减）。'
      }
    },
    {
      type: 'slider',
      id: 'firmEntryExitAdjustment',
      label: {
        en: 'Long-Run Firm Entry / Exit (ΔS_market)',
        zh: '长期厂商进入/退出（行业供给平移 ΔS_market）'
      },
      min: -30,
      max: 30,
      step: 2,
      unit: '',
      help: {
        en: 'Positive = new firms enter (supply shifts right); Negative = existing firms exit.',
        zh: '正值代表新厂商涌入（行业供给右移）；负值代表亏损厂商退出行业。'
      }
    },
    {
      type: 'slider',
      id: 'firmFixedCost',
      label: {
        en: 'Firm Fixed Cost (TFC)',
        zh: '企业固定成本规模（TFC）'
      },
      min: 60,
      max: 180,
      step: 10,
      unit: '$',
      help: {
        en: 'Adjusts the vertical position of the firm’s ATC curve.',
        zh: '调节企业平均总成本（ATC）曲线的垂直高度。'
      }
    }
  ],
  calculate(rawParams: Record<string, any>): GraphCalculationOutput {
    const params: PerfectCompParams = { ...defaultParams, ...rawParams };

    // 1. Market Supply & Demand Specifications
    // Base calibrated so that at baseline (delta=0), P* = min ATC = $35.0
    // Market Demand: P = 60 + demandShift - 0.05 * Q_market
    // Market Supply: P = 10 - entryExitAdjustment + 0.05 * Q_market
    const marketDIntercept = 60 + params.marketDemandShift;
    const marketDSlope = -0.05;
    const marketSIntercept = 10 - params.firmEntryExitAdjustment;
    const marketSSlope = 0.05;

    const marketEq = findLinearIntersection(
      { intercept: marketDIntercept, slope: marketDSlope },
      { intercept: marketSIntercept, slope: marketSSlope }
    );

    const marketQ = marketEq ? Math.max(100, marketEq.x) : 700;
    const marketP = marketEq ? Math.max(10, marketEq.y) : 45;

    // 2. Individual Firm Cost Curve Specifications
    // MC = m0 - m1*q + m2*q^2
    const firmCostParams = {
      fixedCost: params.firmFixedCost,
      m0: 38,
      m1: 1.8,
      m2: 0.075
    };

    // Calculate Minimum of AVC
    const qMinAVC = (3 * firmCostParams.m1) / (4 * firmCostParams.m2); // ~18 units
    const minAVC = evaluateAVC(firmCostParams, qMinAVC);

    // Calculate Minimum of ATC
    let qMinATC = 22;
    let minATC = 999;
    for (let cq = 8; cq <= 45; cq += 0.1) {
      const atcCandidate = evaluateATC(firmCostParams, cq);
      if (atcCandidate < minATC) {
        minATC = atcCandidate;
        qMinATC = cq;
      }
    }

    // Profit-Maximizing Firm Output: MR = MC => P* = MC(q) on upward sloping portion
    // Solve: 38 - 1.8*q + 0.075*q^2 = marketP
    let firmQ = 0;
    const isShutdown = marketP < minAVC;

    if (!isShutdown) {
      // Find q on rising MC where MC(q) = marketP
      let bestQ = qMinAVC;
      let minDiff = 999;
      for (let cq = qMinAVC; cq <= 45; cq += 0.1) {
        const diff = Math.abs(evaluateMC(firmCostParams, cq) - marketP);
        if (diff < minDiff) {
          minDiff = diff;
          bestQ = cq;
        }
      }
      firmQ = bestQ;
    }

    const firmATCAtQ = firmQ > 0 ? evaluateATC(firmCostParams, firmQ) : evaluateATC(firmCostParams, qMinATC);
    const perUnitProfit = firmQ > 0 ? marketP - firmATCAtQ : 0;
    const totalProfit = firmQ > 0 ? perUnitProfit * firmQ : -params.firmFixedCost;

    // Market Graph (Primary / Left)
    const marketMaxQ = 1400;
    const marketMaxP = 100;

    const marketDPoints = generateLinearPoints(
      { intercept: marketDIntercept, slope: marketDSlope },
      0,
      marketMaxQ,
      25,
      0,
      marketMaxP
    );

    const marketSPoints = generateLinearPoints(
      { intercept: marketSIntercept, slope: marketSSlope },
      0,
      marketMaxQ,
      25,
      0,
      marketMaxP
    );

    const marketCurves: CurveSpec[] = [
      {
        id: 'marketDemand',
        name: { en: 'Market Demand (D_market)', zh: '市场总需求（D_market）' },
        shortLabel: 'D_mkt',
        points: marketDPoints,
        color: '#2563eb',
        strokeWidth: 3,
        strokeDasharray: 'none',
        visible: true,
        endLabelPosition: 'end'
      },
      {
        id: 'marketSupply',
        name: { en: 'Market Supply (S_market)', zh: '市场总供给（S_market）' },
        shortLabel: 'S_mkt',
        points: marketSPoints,
        color: '#dc2626',
        strokeWidth: 3,
        strokeDasharray: 'none',
        visible: true,
        endLabelPosition: 'end'
      },
      // Horizontal projection line showing market price setting firm's demand
      {
        id: 'priceTransmission',
        name: { en: 'Price Taker Transmitted Price (P*)', zh: '价格接受者传导基准价格（P*）' },
        shortLabel: 'P*',
        points: [{ x: 0, y: marketP }, { x: marketMaxQ, y: marketP }],
        color: '#059669',
        strokeWidth: 1.5,
        strokeDasharray: '4,4',
        visible: true,
        endLabelPosition: 'end'
      }
    ];

    const marketPoints: KeyPointSpec[] = [
      {
        id: 'marketEquilibrium',
        label: { en: 'Market Equilibrium (E_market)', zh: '行业市场均衡点（E_market）' },
        shortLabel: 'E_mkt',
        x: Number(marketQ.toFixed(0)),
        y: Number(marketP.toFixed(1)),
        color: '#059669',
        showDropLines: true,
        xLabel: `Q_mkt=${marketQ.toFixed(0)}`,
        yLabel: `P*=$${marketP.toFixed(1)}`
      }
    ];

    // Individual Firm Graph (Secondary / Right)
    const firmMaxQ = 45;
    const firmMaxP = 85;

    const firmMCPoints: Point2D[] = [];
    const firmATCPoints: Point2D[] = [];
    const firmAVCPoints: Point2D[] = [];
    const steps = 50;
    const dq = firmMaxQ / steps;

    for (let i = 1; i <= steps; i++) {
      const cq = i * dq;
      const mc = evaluateMC(firmCostParams, cq);
      const atc = evaluateATC(firmCostParams, cq);
      const avc = evaluateAVC(firmCostParams, cq);
      if (mc >= 0 && mc <= firmMaxP + 5) firmMCPoints.push({ x: Number(cq.toFixed(2)), y: Number(mc.toFixed(2)) });
      if (atc >= 0 && atc <= firmMaxP + 5) firmATCPoints.push({ x: Number(cq.toFixed(2)), y: Number(atc.toFixed(2)) });
      if (avc >= 0 && avc <= firmMaxP + 5) firmAVCPoints.push({ x: Number(cq.toFixed(2)), y: Number(avc.toFixed(2)) });
    }

    const firmCurves: CurveSpec[] = [
      {
        id: 'firmDARP',
        name: { en: 'Firm Demand: P = MR = D = AR (Mr. DARP)', zh: '厂商需求线：P = MR = D = AR（Mr. DARP）' },
        shortLabel: 'Mr. DARP',
        points: [{ x: 0, y: marketP }, { x: firmMaxQ, y: marketP }],
        color: '#059669', // Emerald horizontal
        strokeWidth: 3,
        strokeDasharray: 'none',
        visible: true,
        endLabelPosition: 'end'
      },
      {
        id: 'firmMC',
        name: { en: 'Firm Marginal Cost (MC)', zh: '企业边际成本（MC）' },
        shortLabel: 'MC',
        points: firmMCPoints,
        color: '#dc2626',
        strokeWidth: 3,
        strokeDasharray: 'none',
        visible: true,
        endLabelPosition: 'end'
      },
      {
        id: 'firmATC',
        name: { en: 'Firm Average Total Cost (ATC)', zh: '企业平均总成本（ATC）' },
        shortLabel: 'ATC',
        points: firmATCPoints,
        color: '#2563eb',
        strokeWidth: 2.5,
        strokeDasharray: 'none',
        visible: true,
        endLabelPosition: 'end'
      },
      {
        id: 'firmAVC',
        name: { en: 'Firm Average Variable Cost (AVC)', zh: '企业平均可变成本（AVC）' },
        shortLabel: 'AVC',
        points: firmAVCPoints,
        color: '#d97706',
        strokeWidth: 2,
        strokeDasharray: '4,3',
        visible: true,
        endLabelPosition: 'end'
      }
    ];

    const firmPoints: KeyPointSpec[] = [];
    if (!isShutdown && firmQ > 0) {
      firmPoints.push(
        {
          id: 'firmOpt',
          label: { en: 'Profit Max: MR = MC (q*)', zh: '利润最大化产量点：MR = MC（q*）' },
          shortLabel: 'q*',
          x: Number(firmQ.toFixed(1)),
          y: Number(marketP.toFixed(1)),
          color: '#059669',
          showDropLines: true,
          xLabel: `q*=${firmQ.toFixed(1)}`,
          yLabel: `P*=$${marketP.toFixed(1)}`
        },
        {
          id: 'firmATCPoint',
          label: { en: `ATC at q* ($${firmATCAtQ.toFixed(1)})`, zh: `q* 对应的 ATC（$${firmATCAtQ.toFixed(1)}）` },
          shortLabel: 'ATC(q*)',
          x: Number(firmQ.toFixed(1)),
          y: Number(firmATCAtQ.toFixed(1)),
          color: '#2563eb',
          showDropLines: true,
          xLabel: '',
          yLabel: `ATC=$${firmATCAtQ.toFixed(1)}`
        }
      );
    } else {
      firmPoints.push({
        id: 'shutdownIndicator',
        label: { en: 'Shutdown: q = 0 (P < AVC)', zh: '已停产：产出 q = 0（因 P < AVC）' },
        shortLabel: 'Shut Down',
        x: 0,
        y: Number(marketP.toFixed(1)),
        color: '#dc2626',
        showDropLines: false
      });
    }

    // Profit / Loss Shaded Rectangle
    const firmShadedAreas: ShadedAreaSpec[] = [];
    if (!isShutdown && firmQ > 0) {
      if (totalProfit > 5) {
        // Economic Profit: Rectangle between marketP and firmATCAtQ from 0 to firmQ
        firmShadedAreas.push({
          id: 'economicProfitBox',
          label: { en: `Economic Profit: +$${totalProfit.toFixed(1)}`, zh: `超额经济利润：+$${totalProfit.toFixed(1)}` },
          points: [
            { x: 0, y: firmATCAtQ },
            { x: firmQ, y: firmATCAtQ },
            { x: firmQ, y: marketP },
            { x: 0, y: marketP }
          ],
          fill: '#10b981', // Green
          opacity: 0.28,
          pattern: 'diagonal-right',
          value: Number(totalProfit.toFixed(1)),
          valuePrefix: '+$',
          visible: true
        });
      } else if (totalProfit < -5) {
        // Economic Loss: Rectangle between firmATCAtQ and marketP from 0 to firmQ
        firmShadedAreas.push({
          id: 'economicLossBox',
          label: { en: `Economic Loss: -$${Math.abs(totalProfit).toFixed(1)}`, zh: `经济亏损：-$${Math.abs(totalProfit).toFixed(1)}` },
          points: [
            { x: 0, y: marketP },
            { x: firmQ, y: marketP },
            { x: firmQ, y: firmATCAtQ },
            { x: 0, y: firmATCAtQ }
          ],
          fill: '#ef4444', // Red
          opacity: 0.28,
          pattern: 'cross',
          value: Number(totalProfit.toFixed(1)),
          valuePrefix: '$',
          visible: true
        });
      }
    }

    const secondaryGraph = {
      title: {
        en: `Individual Price-Taker Firm: MR. DARP, Costs & Profit/Loss`,
        zh: `单个价格接受者企业：Mr. DARP、成本族与利润/亏损`
      },
      axes: {
        xLabel: { en: 'Firm Output (q in units)', zh: '个别企业产量（q，单位）' },
        yLabel: { en: 'Price & Costs ($)', zh: '价格与单位成本（$）' },
        xMin: 0,
        xMax: firmMaxQ,
        yMin: 0,
        yMax: firmMaxP,
        xStep: 5,
        yStep: 10,
        xSuffix: ' q',
        yPrefix: '$'
      },
      curves: firmCurves,
      points: firmPoints,
      shadedAreas: firmShadedAreas
    };

    // Custom Comparison Table
    const customTable = {
      title: { en: 'Market vs. Firm Decision & Long-Run Adjustment Table', zh: '市场 vs. 企业决策与长期调整逻辑表' },
      subtitle: { en: 'AP Side-by-Side Model Relationships (CED Unit 3.7)', zh: 'AP 经典双图对应关系（CED 第三单元 3.7 核心考点）' },
      headers: [
        { en: 'Dimension', zh: '分析维度' },
        { en: 'Market (Entire Industry)', zh: '大市场（整个行业）' },
        { en: 'Individual Firm', zh: '单个代表性企业' },
        { en: 'Long-Run Dynamic Adjustment', zh: '长期动态进退调整' }
      ],
      rows: [
        {
          id: 'row-price-role',
          label: { en: 'Price Determination', zh: '价格决定机制' },
          values: [
            `Price Maker via S & D: P* = $${marketP.toFixed(1)}`,
            'Price Taker: Perfect Elasticity (Mr. DARP)',
            'Industry entry/exit shifts Supply until P = min ATC.'
          ]
        },
        {
          id: 'row-profit-status',
          label: { en: 'Current Profitability', zh: '当前盈亏状态' },
          values: [
            `Industry Output Q = ${marketQ.toFixed(0)} units`,
            isShutdown ? 'SHUTDOWN (q=0, P < AVC)' : totalProfit > 5 ? `Economic Profit: +$${totalProfit.toFixed(1)}` : totalProfit < -5 ? `Loss Minimizing: -$${Math.abs(totalProfit).toFixed(1)}` : 'Normal Profit (Zero Economic Profit)',
            totalProfit > 5 ? 'Profits induce ENTRY of new firms ⇒ S_mkt shifts RIGHT ⇒ P falls to min ATC.' : totalProfit < -5 ? 'Losses induce EXIT of firms ⇒ S_mkt shifts LEFT ⇒ P rises to min ATC.' : 'Long-run steady state achieved; no incentive to enter or exit.'
          ],
          highlight: true
        }
      ]
    };

    const results = [
      {
        id: 'marketPResult',
        label: { en: 'Market Price (P* = MR)', zh: '市场均衡价格（P* = MR）' },
        value: `$${marketP.toFixed(2)}`,
        color: '#059669'
      },
      {
        id: 'marketQResult',
        label: { en: 'Market Output (Q_mkt)', zh: '市场总交易量（Q_mkt）' },
        value: `${marketQ.toFixed(0)} units`,
        color: '#2563eb'
      },
      {
        id: 'firmQResult',
        label: { en: 'Firm Optimal Output (q*)', zh: '企业最优产量（q*）' },
        value: isShutdown ? '0 units (SHUTDOWN)' : `${firmQ.toFixed(1)} units`,
        color: isShutdown ? '#dc2626' : '#059669',
        formula: 'MR = MC'
      },
      {
        id: 'firmProfitResult',
        label: { en: 'Firm Economic Profit / Loss', zh: '企业经济利润 / 亏损' },
        value: isShutdown ? `-$${params.firmFixedCost} (Fixed Cost Loss)` : `$${totalProfit.toFixed(1)}`,
        color: totalProfit > 5 ? '#10b981' : totalProfit < -5 ? '#dc2626' : '#059669',
        formula: '(P - ATC) × q'
      },
      {
        id: 'longRunStatus',
        label: { en: 'Long-Run Industry Status', zh: '长期行业调整趋势' },
        value: isShutdown ? 'Severe Losses ⇒ Firm Exit in Long Run' : totalProfit > 5 ? 'Firms Enter (Supply Right)' : totalProfit < -5 ? 'Firms Exit (Supply Left)' : 'Long-Run Equilibrium (Stable)',
        color: '#7c3aed'
      }
    ];

    const explanation = {
      en: `The overall market sets the price at P* = $${marketP.toFixed(1)}. As a price taker, the individual firm accepts this price as its perfectly horizontal demand curve (Mr. DARP: P = MR = D = AR). To maximize profits, the firm produces where MR = MC (${isShutdown ? 'however, because P* is below the minimum AVC of $' + minAVC.toFixed(1) + ', the firm SHUTS DOWN in the short run to minimize losses to TFC' : 'yielding q* = ' + firmQ.toFixed(1) + ' units'}). At this output, ATC is $${firmATCAtQ.toFixed(1)}, resulting in an economic ${totalProfit >= 0 ? 'profit of +$' + totalProfit.toFixed(1) : 'loss of -$' + Math.abs(totalProfit).toFixed(1)}. ${totalProfit > 5 ? 'In the long run, positive economic profits will attract new firms to enter the industry, shifting market supply rightward and driving price down to the minimum ATC of $' + minATC.toFixed(1) + '.' : totalProfit < -5 ? 'In the long run, economic losses will cause existing firms to exit the industry, shifting market supply leftward and raising price until zero economic profit is restored.' : 'Because P = min ATC, the industry is in Long-Run Equilibrium (Zero Economic Profit / Normal Profit).'}` ,
      zh: `大市场供求关系决定出清价格 P* = $${marketP.toFixed(1)}。作为完全竞争市场中的“价格接受者”，个别企业必须被动接受该价格，形成一条完全水平的需求线（Mr. DARP: P = MR = D = AR）。企业按照 MR = MC 的黄金法则决定生产量（${isShutdown ? '但由于市场价格低于最低平均可变成本 $' + minAVC.toFixed(1) + '，企业在短期内必须【立即停产】，亏损额恰好为固定成本' : '此时最优产出 q* = ' + firmQ.toFixed(1) + ' 单位'}）。在此产量下，ATC 为 $${firmATCAtQ.toFixed(1)}，产生【${totalProfit >= 0 ? '超额经济利润 +$' + totalProfit.toFixed(1) : '经济亏损 -$' + Math.abs(totalProfit).toFixed(1)}】。${totalProfit > 5 ? '在长期中，超额利润将吸引外部新企业涌入行业，导致市场供给曲线整体右移，驱动价格持续回落直至最低 ATC（$' + minATC.toFixed(1) + '）。' : totalProfit < -5 ? '在长期中，持续亏损将促使部分企业退出行业，导致市场供给曲线整体左移，推动价格回升直至恢复零经济利润。' : '因为价格恰好等于最低平均总成本（P = min ATC），行业达到长期稳态均衡（正常利润 / 零经济利润）。'}`
    };

    const analysisPoints = [
      {
        en: 'Mr. DARP Acronym: In perfect competition, Price = Marginal Revenue = Demand = Average Revenue (horizontal line for firm).',
        zh: 'Mr. DARP 记忆法则：在完全竞争中，价格（P）= 边际收益（MR）= 需求（D）= 平均收益（AR），个别企业面对水平线。'
      },
      {
        en: 'Shutdown Rule vs Loss Minimization: If P ≥ min AVC, firm produces at a loss (covers VC and contributes to FC). If P < min AVC, firm shuts down immediately (q = 0, loss = TFC).',
        zh: '停产法则 vs 亏损继续生产：若 P ≥ min AVC，企业继续生产以最小化亏损；若 P < min AVC，企业立刻停产（产量归零，亏损等于固定成本）。'
      },
      {
        en: 'Long-Run Zero Profit: Free entry and exit guarantee that in the long run, perfectly competitive firms earn zero economic profit (normal profit) where P = MR = MC = min ATC.',
        zh: '长期零利润规律：自由进入与退出机制保证了在长期均衡中，所有企业只能获得零经济利润（正常利润），达成三重相等：P = MR = MC = min ATC（兼具生产效率与配置效率）。'
      }
    ];

    return {
      axes: {
        xLabel: { en: 'Market Quantity (Q_market in units)', zh: '市场总交易量（Q_market，单位）' },
        yLabel: { en: 'Market Price (P in $)', zh: '市场价格（P，美元）' },
        xMin: 0,
        xMax: marketMaxQ,
        yMin: 0,
        yMax: marketMaxP,
        xStep: 200,
        yStep: 20,
        xSuffix: ' Q',
        yPrefix: '$'
      },
      curves: marketCurves,
      points: marketPoints,
      shadedAreas: [],
      results,
      secondaryGraph,
      customTable,
      explanation,
      analysisPoints
    };
  }
};
