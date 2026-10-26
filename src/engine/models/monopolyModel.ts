import { EconomicModel, GraphCalculationOutput, ScenarioPreset, CurveSpec, KeyPointSpec, ShadedAreaSpec } from '../../types/graph';
import { generateLinearPoints } from '../economicMath';

export interface MonopolyParams {
  demandIntercept: number;      // 80 to 120 (default 100)
  demandSlope: number;          // -0.6 to -1.4 (default -1.0)
  mcSlope: number;              // 0.2 to 0.8 (default 0.5)
  fixedCost: number;            // 100 to 300 (default 180)
  isPriceDiscrimination: boolean; // First-degree perfect price discrimination
  regulationType: 'none' | 'socially_optimal' | 'fair_return';
}

const defaultParams: MonopolyParams = {
  demandIntercept: 100,
  demandSlope: -1.0,
  mcSlope: 0.5,
  fixedCost: 180,
  isPriceDiscrimination: false,
  regulationType: 'none'
};

const presets: ScenarioPreset[] = [
  {
    id: 'single-price-profit',
    name: {
      en: 'Standard Single-Price Monopoly (MR = MC)',
      zh: '标准单一定价垄断（MR = MC）'
    },
    description: {
      en: 'Finds MR = MC output (Qm), charges price on Demand curve (Pm). Creates economic profit and deadweight loss.',
      zh: '在 MR = MC 处确定垄断产量（Qm），在需求曲线上索取高价（Pm）。产生超额垄断利润与社会无谓损失。'
    },
    params: {
      demandIntercept: 100,
      demandSlope: -1.0,
      mcSlope: 0.5,
      fixedCost: 180,
      isPriceDiscrimination: false,
      regulationType: 'none'
    }
  },
  {
    id: 'perfect-price-discrimination',
    name: {
      en: 'Perfect (First-Degree) Price Discrimination',
      zh: '完全一级价格歧视（按意愿逐一收费）'
    },
    description: {
      en: 'Charges each consumer their exact willingness to pay. MR becomes Demand, output expands to allocative efficiency (P=MC), CS=0, DWL=0.',
      zh: '按每位消费者的保留价格收费。MR 与需求曲线完全重合，产出扩大到社会最优水平（P=MC），消费者剩余归零，无谓损失彻底消除！'
    },
    params: {
      demandIntercept: 100,
      demandSlope: -1.0,
      mcSlope: 0.5,
      fixedCost: 180,
      isPriceDiscrimination: true,
      regulationType: 'none'
    }
  },
  {
    id: 'socially-optimal-regulation',
    name: {
      en: 'Socially Optimal Regulation (P = MC)',
      zh: '社会最优价格管制（P = MC 配置效率）'
    },
    description: {
      en: 'Government caps price at P = MC (Allocative Efficiency), maximizing total economic surplus and eliminating deadweight loss.',
      zh: '政府强制实行 P = MC 的边际成本定价管制（配置效率），社会总剩余达到极大值，消除垄断无谓损失。'
    },
    params: {
      demandIntercept: 100,
      demandSlope: -1.0,
      mcSlope: 0.5,
      fixedCost: 180,
      isPriceDiscrimination: false,
      regulationType: 'socially_optimal'
    }
  },
  {
    id: 'fair-return-regulation',
    name: {
      en: 'Fair-Return Regulation (P = ATC)',
      zh: '公平回报率定价管制（P = ATC 零经济利润）'
    },
    description: {
      en: 'Regulator sets P = ATC where the firm earns normal accounting profit (zero economic profit), preventing bankruptcy without government subsidy.',
      zh: '监管机构将价格限制在 P = ATC 切点，使垄断企业获得正常会计利润（零经济利润），既压低了垄断高价又无需财政补贴救济。'
    },
    params: {
      demandIntercept: 100,
      demandSlope: -1.0,
      mcSlope: 0.5,
      fixedCost: 180,
      isPriceDiscrimination: false,
      regulationType: 'fair_return'
    }
  },
  {
    id: 'natural-monopoly-falling-atc',
    name: {
      en: 'Natural Monopoly (High Fixed Cost & Falling ATC)',
      zh: '自然垄断典型模型（高固定成本与持续下降的 ATC）'
    },
    description: {
      en: 'Natural monopolies (e.g. utilities) feature huge fixed costs and declining ATC over the entire market demand. A single firm can supply the whole market at lower cost than multiple competitors.',
      zh: '自然垄断（如自来水、电网）具备极高的固定投资，在整个市场需求范围内 ATC 持续递减。由一家企业独家生产的总成本远低于多家小企业分散竞争的成本。'
    },
    params: {
      demandIntercept: 110,
      demandSlope: -0.9,
      mcSlope: 0.2,
      fixedCost: 420,
      isPriceDiscrimination: false,
      regulationType: 'none'
    }
  }
];

export const monopolyModel: EconomicModel = {
  id: 'monopoly-single-price',
  topicId: 'monopoly-single-price',
  name: {
    en: 'Monopoly: Single-Price & Price Discrimination',
    zh: '垄断市场：单一定价、价格歧视与政府管制'
  },
  description: {
    en: 'Coherent monopoly model strictly linking Market Demand, MR (twice as steep), MC, ATC, economic profits, deadweight loss, and perfect price discrimination.',
    zh: '数理逻辑严密连接需求曲线、斜率双倍的边际收益（MR）、边际成本（MC）、平均总成本（ATC）、超额利润、无谓损失及完全价格歧视的垄断模型。'
  },
  defaultParams,
  presets,
  controls: [
    {
      type: 'toggle',
      id: 'isPriceDiscrimination',
      label: {
        en: 'Perfect (First-Degree) Price Discrimination',
        zh: '启用完全一级价格歧视（MR 与需求曲线重合）'
      },
      help: {
        en: 'Firm charges each buyer their maximum willingness to pay.',
        zh: '垄断厂商按每位买家的最高保留意愿价格收费。'
      }
    },
    {
      type: 'select',
      id: 'regulationType',
      label: {
        en: 'Government Regulatory Policy',
        zh: '政府垄断反垄断管制政策'
      },
      options: [
        { id: 'none', label: { en: 'Unregulated Monopoly (Profit Max MR=MC)', zh: '无管制自由垄断（MR=MC 利润最大化）' } },
        { id: 'socially_optimal', label: { en: 'Socially Optimal Price (P = MC)', zh: '社会最优定价（P = MC 配置效率）' } },
        { id: 'fair_return', label: { en: 'Fair-Return Price (P = ATC)', zh: '公平回报率定价（P = ATC 零利润）' } }
      ]
    },
    {
      type: 'slider',
      id: 'demandIntercept',
      label: {
        en: 'Demand Vertical Intercept (Market Size)',
        zh: '需求曲线截距（市场规模）'
      },
      min: 80,
      max: 120,
      step: 2,
      unit: '$'
    },
    {
      type: 'slider',
      id: 'fixedCost',
      label: {
        en: 'Fixed Cost (TFC / Infrastructure)',
        zh: '固定成本（TFC / 基础设施投入）'
      },
      min: 80,
      max: 300,
      step: 10,
      unit: '$'
    }
  ],
  calculate(rawParams: Record<string, any>): GraphCalculationOutput {
    const params: MonopolyParams = { ...defaultParams, ...rawParams };

    // Linear Demand: P = a - b*Q  (a=demandIntercept, b=|demandSlope|)
    const a = params.demandIntercept;
    const b = Math.abs(params.demandSlope);
    // Marginal Revenue: MR = a - 2b*Q (twice as steep)
    // Marginal Cost: MC = 10 + mcSlope * Q
    const mcIntercept = 10;
    const mcSlope = params.mcSlope;

    // ATC(Q) = FC/Q + 10 + 0.5 * mcSlope * Q
    const evaluateFirmATC = (q: number) => {
      if (q <= 0) return 999;
      return params.fixedCost / q + mcIntercept + 0.5 * mcSlope * q;
    };

    // Allocatively Efficient quantity (Socially Optimal where P = MC):
    // a - b*Q = mcIntercept + mcSlope*Q => Q_so = (a - mcIntercept) / (b + mcSlope)
    const qSO = (a - mcIntercept) / (b + mcSlope);
    const pSO = a - b * qSO;

    // Unregulated Profit-Maximizing Output (MR = MC):
    // a - 2b*Q = mcIntercept + mcSlope*Q => Q_m = (a - mcIntercept) / (2b + mcSlope)
    const qMonopoly = (a - mcIntercept) / (2 * b + mcSlope);
    const pMonopoly = a - b * qMonopoly;

    // Determine actual operating Q and P depending on discrimination or regulation
    let actualQ = qMonopoly;
    let actualP = pMonopoly;

    if (params.isPriceDiscrimination) {
      // In perfect price discrimination, MR coincides with Demand, so MR = MC yields Q_so!
      actualQ = qSO;
      actualP = pSO; // marginal price; inframarginal prices are all points on D above
    } else if (params.regulationType === 'socially_optimal') {
      actualQ = qSO;
      actualP = pSO;
    } else if (params.regulationType === 'fair_return') {
      // Fair return: P = ATC => a - b*Q = FC/Q + 10 + 0.5*mcSlope*Q
      // Solve numerically:
      let bestQ = qMonopoly;
      let minDiff = 999;
      for (let cq = qMonopoly; cq <= qSO * 1.2; cq += 0.1) {
        const diff = Math.abs((a - b * cq) - evaluateFirmATC(cq));
        if (diff < minDiff) {
          minDiff = diff;
          bestQ = cq;
        }
      }
      actualQ = bestQ;
      actualP = a - b * actualQ;
    }

    const atcAtQ = evaluateFirmATC(actualQ);
    const mcAtQ = mcIntercept + mcSlope * actualQ;

    // Welfare Calculations:
    let cs = 0;
    let profit = 0;
    let dwl = 0;

    if (params.isPriceDiscrimination) {
      // Entire area between Demand and MC up to Q_so is captured as profit; CS = 0; DWL = 0
      cs = 0;
      dwl = 0;
      // Total revenue is area under demand from 0 to actualQ
      const totalRevenueDiscrim = 0.5 * (a + actualP) * actualQ;
      const totalCost = atcAtQ * actualQ;
      profit = totalRevenueDiscrim - totalCost;
    } else {
      cs = Math.max(0, 0.5 * (a - actualP) * actualQ);
      profit = (actualP - atcAtQ) * actualQ;
      if (actualQ < qSO) {
        // Triangle between Demand and MC from actualQ to qSO
        const pDemandAtQ = a - b * actualQ;
        const pMCAtQ = mcIntercept + mcSlope * actualQ;
        dwl = 0.5 * (pDemandAtQ - pMCAtQ) * (qSO - actualQ);
      }
    }

    // Generate Curves
    const xMax = 80;
    const yMax = a * 1.1;

    const demandPts = generateLinearPoints({ intercept: a, slope: -b }, 0, xMax, 30, 0, yMax);
    const mrPts = generateLinearPoints({ intercept: a, slope: -2 * b }, 0, xMax, 30, 0, yMax);
    const mcPts = generateLinearPoints({ intercept: mcIntercept, slope: mcSlope }, 0, xMax, 30, 0, yMax);

    const atcPts: { x: number; y: number }[] = [];
    for (let cq = 4; cq <= xMax; cq += 1.5) {
      const atc = evaluateFirmATC(cq);
      if (atc <= yMax) atcPts.push({ x: Number(cq.toFixed(2)), y: Number(atc.toFixed(2)) });
    }

    const curves: CurveSpec[] = [
      {
        id: 'demand',
        name: { en: `Demand Curve (D = AR)`, zh: `需求曲线（D = AR）` },
        shortLabel: 'D',
        points: demandPts,
        color: '#2563eb', // Blue
        strokeWidth: 3,
        strokeDasharray: 'none',
        visible: true,
        equation: `P = ${a} - ${b.toFixed(1)}Q`,
        endLabelPosition: 'end'
      },
      {
        id: 'mr',
        name: {
          en: params.isPriceDiscrimination ? 'MR Curve (Coincides with D)' : 'Marginal Revenue (MR = a - 2bQ)',
          zh: params.isPriceDiscrimination ? '边际收益线（与需求曲线完全重合）' : '边际收益曲线（MR = a - 2bQ）'
        },
        shortLabel: 'MR',
        points: params.isPriceDiscrimination ? demandPts : mrPts,
        color: '#d97706', // Amber
        strokeWidth: 2.5,
        strokeDasharray: params.isPriceDiscrimination ? 'none' : '5,3',
        visible: true,
        equation: params.isPriceDiscrimination ? `MR = Demand` : `MR = ${a} - ${(2 * b).toFixed(1)}Q`,
        endLabelPosition: 'end'
      },
      {
        id: 'mc',
        name: { en: 'Marginal Cost (MC)', zh: '边际成本曲线（MC）' },
        shortLabel: 'MC',
        points: mcPts,
        color: '#dc2626', // Red
        strokeWidth: 3,
        strokeDasharray: 'none',
        visible: true,
        equation: `MC = ${mcIntercept} + ${mcSlope.toFixed(1)}Q`,
        endLabelPosition: 'end'
      },
      {
        id: 'atc',
        name: { en: 'Average Total Cost (ATC)', zh: '平均总成本曲线（ATC）' },
        shortLabel: 'ATC',
        points: atcPts,
        color: '#7c3aed', // Purple
        strokeWidth: 2,
        strokeDasharray: '4,4',
        visible: true,
        endLabelPosition: 'end'
      }
    ];

    // Key points
    const points: KeyPointSpec[] = [
      {
        id: 'chosenPricePoint',
        label: { en: `Price on Demand ($${actualP.toFixed(1)})`, zh: `需求线对应价格（$${actualP.toFixed(1)}）` },
        shortLabel: `Pm=$${actualP.toFixed(1)}`,
        x: Number(actualQ.toFixed(1)),
        y: Number(actualP.toFixed(1)),
        color: '#2563eb',
        showDropLines: true,
        xLabel: `Qm=${actualQ.toFixed(1)}`,
        yLabel: `Pm=$${actualP.toFixed(1)}`
      },
      {
        id: 'mrMcInter',
        label: { en: 'MR = MC Intersection', zh: 'MR = MC 最优产量交点' },
        shortLabel: 'MR=MC',
        x: Number(actualQ.toFixed(1)),
        y: Number(mcAtQ.toFixed(1)),
        color: '#dc2626',
        showDropLines: true,
        xLabel: '',
        yLabel: `MC=$${mcAtQ.toFixed(1)}`
      },
      {
        id: 'sociallyOptimalPoint',
        label: { en: 'Allocatively Efficient Point (P = MC)', zh: '社会有效点（P = MC 配置效率）' },
        shortLabel: 'P=MC (SO)',
        x: Number(qSO.toFixed(1)),
        y: Number(pSO.toFixed(1)),
        color: '#059669',
        showDropLines: false
      }
    ];

    // Producer Surplus calculation
    const producerSurplus = Math.max(0, profit + params.fixedCost);

    // Shaded Welfare Areas
    const shadedAreas: ShadedAreaSpec[] = [];

    // Consumer Surplus (CS)
    if (cs > 1 && !params.isPriceDiscrimination) {
      shadedAreas.push({
        id: 'cs',
        label: { en: `Consumer Surplus ($${cs.toFixed(1)})`, zh: `消费者剩余（$${cs.toFixed(1)}）` },
        points: [
          { x: 0, y: a },
          { x: actualQ, y: actualP },
          { x: 0, y: actualP }
        ],
        fill: '#3b82f6',
        opacity: 0.22,
        pattern: 'diagonal-right',
        value: Number(cs.toFixed(1)),
        valuePrefix: '$',
        visible: true
      });
    }

    // Monopoly Economic Profit or Loss Box
    if (profit > 1 && !params.isPriceDiscrimination) {
      shadedAreas.push({
        id: 'monopolyProfit',
        label: { en: `Monopoly Economic Profit (+$${profit.toFixed(1)})`, zh: `垄断超额经济利润（+$${profit.toFixed(1)}）` },
        points: [
          { x: 0, y: atcAtQ },
          { x: actualQ, y: atcAtQ },
          { x: actualQ, y: actualP },
          { x: 0, y: actualP }
        ],
        fill: '#10b981',
        opacity: 0.28,
        pattern: 'dots',
        value: Number(profit.toFixed(1)),
        valuePrefix: '+$',
        visible: true
      });
    } else if (profit < -1 && !params.isPriceDiscrimination) {
      shadedAreas.push({
        id: 'monopolyLoss',
        label: { en: `Economic Loss (-$${Math.abs(profit).toFixed(1)})`, zh: `经济亏损 (-$${Math.abs(profit).toFixed(1)})` },
        points: [
          { x: 0, y: actualP },
          { x: actualQ, y: actualP },
          { x: actualQ, y: atcAtQ },
          { x: 0, y: atcAtQ }
        ],
        fill: '#ef4444',
        opacity: 0.28,
        pattern: 'cross',
        value: Number(Math.abs(profit).toFixed(1)),
        valuePrefix: '-$',
        visible: true
      });
    } else if (params.isPriceDiscrimination) {
      // Entire area captured as profit
      shadedAreas.push({
        id: 'discrimProfit',
        label: { en: `Extracted Total Surplus via Price Discrimination: +$${producerSurplus.toFixed(1)} (Profit: +$${profit.toFixed(1)})`, zh: `通过一级价格歧视掠夺的总剩余：+$${producerSurplus.toFixed(1)}（净利润：+$${profit.toFixed(1)}）` },
        points: [
          { x: 0, y: mcIntercept },
          { x: actualQ, y: actualP },
          { x: 0, y: a }
        ],
        fill: '#10b981',
        opacity: 0.3,
        pattern: 'dots',
        value: Number(producerSurplus.toFixed(1)),
        valuePrefix: '+$',
        visible: true
      });
    }

    // Deadweight Loss (DWL)
    if (dwl > 1) {
      shadedAreas.push({
        id: 'dwl',
        label: { en: `Deadweight Loss: $${dwl.toFixed(1)}`, zh: `社会无谓损失：$${dwl.toFixed(1)}` },
        points: [
          { x: actualQ, y: actualP },
          { x: qSO, y: pSO },
          { x: actualQ, y: mcAtQ }
        ],
        fill: '#ef4444',
        opacity: 0.38,
        pattern: 'cross',
        value: Number(dwl.toFixed(1)),
        valuePrefix: '$',
        visible: true
      });
    }

    // Custom Interactive Table
    const customTable = {
      title: { en: 'Monopoly vs. Perfect Competition & Regulatory Pricing Comparison', zh: '垄断定价、完全竞争与两类政府价格管制对照表' },
      subtitle: { en: 'Comparison Matrix (CED Unit 4.2, 4.3 & 6.4)', zh: '核心指标对比矩阵（CED 第四单元 4.2、4.3 及第六单元 6.4）' },
      headers: [
        { en: 'Market Structure / Policy', zh: '市场体制 / 管制政策' },
        { en: 'Pricing Rule', zh: '定价决策准则' },
        { en: 'Output (Q) & Price (P)', zh: '产量 (Q) 与 价格 (P)' },
        { en: 'Economic Profit', zh: '经济利润' },
        { en: 'Allocative Efficiency (DWL)', zh: '配置效率与社会净福利损失' }
      ],
      rows: [
        {
          id: 'row-single-price',
          label: { en: 'Unregulated Single-Price Monopoly', zh: '无管制单一定价垄断' },
          values: [
            'MR = MC, Price from Demand',
            `Qm = ${qMonopoly.toFixed(1)}, Pm = $${pMonopoly.toFixed(1)}`,
            `+$${((pMonopoly - evaluateFirmATC(qMonopoly)) * qMonopoly).toFixed(1)}`,
            `Inefficient (DWL = $${(0.5 * (pMonopoly - (mcIntercept + mcSlope * qMonopoly)) * (qSO - qMonopoly)).toFixed(1)})`
          ],
          highlight: !params.isPriceDiscrimination && params.regulationType === 'none'
        },
        {
          id: 'row-discrim',
          label: { en: 'Perfect Price Discrimination', zh: '完全一级价格歧视' },
          values: [
            'Each buyer charged exact willingness to pay',
            `Q = ${qSO.toFixed(1)} (Allocative Efficient)`,
            'Maximum Profit (All Surplus Captured)',
            'Efficient! DWL = $0, but CS = $0'
          ],
          highlight: params.isPriceDiscrimination
        },
        {
          id: 'row-socially-optimal',
          label: { en: 'Socially Optimal Regulation (P = MC)', zh: '社会最优定价管制（P = MC）' },
          values: [
            'P = MC (Marginal Cost Pricing)',
            `Q = ${qSO.toFixed(1)}, P = $${pSO.toFixed(1)}`,
            'May suffer loss if natural monopoly (needs subsidy)',
            'Allocatively Efficient (DWL = $0)'
          ],
          highlight: params.regulationType === 'socially_optimal'
        },
        {
          id: 'row-fair-return',
          label: { en: 'Fair-Return Regulation (P = ATC)', zh: '公平回报率定价管制（P = ATC）' },
          values: [
            'P = ATC (Average Cost Pricing)',
            'Output between Qm and Q_so',
            'Zero Economic Profit (Break-even)',
            'Minor DWL, but firm stays solvent without subsidy'
          ],
          highlight: params.regulationType === 'fair_return'
        }
      ]
    };

    const results = [
      {
        id: 'monopolyQ',
        label: { en: 'Optimal Output (Q)', zh: '垄断最优产量（Q）' },
        value: `${actualQ.toFixed(1)} units`,
        color: '#2563eb',
        formula: params.isPriceDiscrimination ? 'MR(=D) = MC' : 'MR = MC'
      },
      {
        id: 'monopolyP',
        label: { en: 'Market Price (P)', zh: '垄断索取价格（P）' },
        value: params.isPriceDiscrimination ? `Marginal $${actualP.toFixed(1)} (Ranges $${actualP.toFixed(0)}–$${a})` : `$${actualP.toFixed(1)}`,
        color: '#2563eb',
        formula: 'Price from Demand Curve'
      },
      {
        id: 'profitResult',
        label: { en: 'Economic Profit / (Loss)', zh: '超额经济利润 / （亏损）' },
        value: profit >= 0 ? `+$${profit.toFixed(1)}` : `-$${Math.abs(profit).toFixed(1)}`,
        color: profit > 1 ? '#10b981' : profit < -1 ? '#dc2626' : '#059669',
        formula: '(P - ATC) × Q'
      },
      {
        id: 'psResult',
        label: { en: 'Producer Surplus (PS)', zh: '生产者剩余（PS）' },
        value: `$${producerSurplus.toFixed(1)}`,
        color: '#f59e0b',
        formula: 'TR - TVC = Profit + FC'
      },
      {
        id: 'dwlResult',
        label: { en: 'Deadweight Loss (DWL)', zh: '社会无谓损失（DWL）' },
        value: `$${dwl.toFixed(1)}`,
        color: dwl > 1 ? '#dc2626' : '#059669',
        formula: '1/2 × (Pm - MC) × (Q_so - Qm)'
      },
      {
        id: 'soOutput',
        label: { en: 'Socially Efficient Output (P = MC)', zh: '社会最优产出（配置效率）' },
        value: `${qSO.toFixed(1)} units ($${pSO.toFixed(1)})`,
        color: '#059669'
      }
    ];

    const explanation = {
      en: params.isPriceDiscrimination
        ? `Under Perfect Price Discrimination, the monopolist charges each consumer their exact willingness to pay. Consequently, MR coincides with the Demand curve. The firm produces where MR = MC (${actualQ.toFixed(1)} units), which equals the socially optimal quantity (P = MC). Deadweight Loss is ZERO, but Consumer Surplus is completely eliminated as all economic surplus (+$${profit.toFixed(1)}) is converted into monopoly profit!`
        : params.regulationType === 'socially_optimal'
        ? `Under Socially Optimal Regulation, price is capped at P = MC ($${pSO.toFixed(1)}). Output expands to ${qSO.toFixed(1)} units, eliminating deadweight loss and achieving allocative efficiency.`
        : params.regulationType === 'fair_return'
        ? `Under Fair-Return Regulation, price is capped at P = ATC ($${actualP.toFixed(1)}). The firm produces ${actualQ.toFixed(1)} units and earns zero economic profit (normal accounting profit), preventing bankruptcy without government subsidies.`
        : `To maximize profit, the single-price monopolist first finds where MR = MC (${actualQ.toFixed(1)} units), then projects UP to the Demand curve to charge P = $${actualP.toFixed(1)}. Because P ($${actualP.toFixed(1)}) exceeds MC ($${mcAtQ.toFixed(1)}), the monopoly restricts output below the socially efficient level (${qSO.toFixed(1)} units), creating an economic profit of +$${profit.toFixed(1)} and a Deadweight Loss of $${dwl.toFixed(1)}.`,
      zh: params.isPriceDiscrimination
        ? `在【完全一级价格歧视】下，垄断企业对每位买家精准索取其最高的保留支付意愿。因此，MR 曲线与需求曲线完全重合！厂商在 MR = MC 处生产 ${actualQ.toFixed(1)} 单位，这恰好等于社会最优配置产量（P = MC）。社会无谓损失彻底降为【零】，但消费者剩余被完全掠夺殆尽，全部社会剩余转化为高达 +$${profit.toFixed(1)} 的垄断暴利！`
        : params.regulationType === 'socially_optimal'
        ? `在【社会最优价格管制】下，价格被强制限定在 P = MC（$${pSO.toFixed(1)}）。产出扩大至 ${qSO.toFixed(1)} 单位，彻底消除了无谓损失，达成了全社会的配置效率。`
        : params.regulationType === 'fair_return'
        ? `在【公平回报率管制】下，价格被限定在 P = ATC（$${actualP.toFixed(1)}）。厂商生产 ${actualQ.toFixed(1)} 单位，获得零经济利润（正常会计利润），既遏制了垄断暴利，又避免了自然垄断亏损破产。`
        : `为实现利润最大化，单一定价垄断企业首先在 MR = MC 处确定产量（${actualQ.toFixed(1)} 单位），然后【垂直向上投影】到需求曲线上确定最高卖价 P = $${actualP.toFixed(1)}。因为价格 P（$${actualP.toFixed(1)}）显著高于边际成本 MC（$${mcAtQ.toFixed(1)}），垄断者人为限制了产量（低于社会最优水平 ${qSO.toFixed(1)} 单位），掠夺了 +$${profit.toFixed(1)} 的超额利润，并造成了 $${dwl.toFixed(1)} 的社会净无谓损失。`
    };

    const analysisPoints = [
      {
        en: 'MR < P for Monopolist: Because a single-price monopolist must lower the price on ALL units sold to sell one more unit, MR lies strictly below the downward-sloping Demand curve.',
        zh: 'MR 位于需求线下方法则：由于单一定价垄断厂商要想多卖一单位产品，必须降低所有先前产品的售价，因此边际收益（MR）严格位于向下倾斜的需求曲线下方（斜率是需求的 2 倍）。'
      },
      {
        en: 'Price Maker Step: Find Q where MR = MC; then look UP to the Demand curve at that Q to find Price P. Do NOT set price at the MR=MC intersection!',
        zh: '价格制定者经典步骤：先找 MR = MC 交点定产量 Q；然后【必须向上看】到需求曲线定售价 P！绝不能把 MR=MC 交点的纵坐标当成售价！'
      },
      {
        en: 'Price Discrimination Efficiency Paradox: Perfect price discrimination achieves Allocative Efficiency (DWL = 0) while leaving ZERO Consumer Surplus (CS = 0)!',
        zh: '价格歧视效率悖论：完全价格歧视在消除无谓损失、达成社会配置效率（DWL = 0）的同时，却将消费者的剩余彻底榨干归零（CS = 0）！'
      }
    ];

    return {
      axes: {
        xLabel: { en: 'Output / Quantity (Q in units)', zh: '产量 / 产出量（Q，单位）' },
        yLabel: { en: 'Price & Costs ($)', zh: '价格与单位成本（$）' },
        xMin: 0,
        xMax,
        yMin: 0,
        yMax,
        xStep: 10,
        yStep: 10,
        xSuffix: ' units',
        yPrefix: '$'
      },
      curves,
      points,
      shadedAreas,
      results,
      customTable,
      explanation,
      analysisPoints
    };
  }
};
