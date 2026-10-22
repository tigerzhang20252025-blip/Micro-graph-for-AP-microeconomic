import { EconomicModel, GraphCalculationOutput, ScenarioPreset, CurveSpec } from '../../types/graph';
import {
  evaluateLinearPrice,
  findLinearIntersection,
  generateLinearPoints,
  calculatePointElasticity
} from '../economicMath';

export interface MarketEquilibriumParams {
  demandShift: number; // -30 to +30
  supplyShift: number; // -30 to +30
  taxPerUnit: number;  // 0 to 20
  priceControlMode: 'none' | 'ceiling' | 'floor';
  controlledPrice: number; // 10 to 90
}

const defaultParams: MarketEquilibriumParams = {
  demandShift: 0,
  supplyShift: 0,
  taxPerUnit: 0,
  priceControlMode: 'none',
  controlledPrice: 40
};

const presets: ScenarioPreset[] = [
  {
    id: 'baseline',
    name: {
      en: 'Competitive Market Baseline',
      zh: '完全竞争市场基准'
    },
    description: {
      en: 'Equilibrium where Qs = Qd. Allocative efficiency is achieved; CS and PS are maximized with zero deadweight loss.',
      zh: 'Qs = Qd 的供求均衡基准点。实现配置效率，社会总剩余最大化，无谓损失为零。'
    },
    params: {
      demandShift: 0,
      supplyShift: 0,
      taxPerUnit: 0,
      priceControlMode: 'none',
      controlledPrice: 50
    }
  },
  {
    id: 'excise-tax',
    name: {
      en: 'Excise Tax & Deadweight Loss',
      zh: '消费税与无谓损失（DWL）'
    },
    description: {
      en: 'A per-unit excise tax drives a wedge between buyer price (Pb) and seller price (Ps), creating tax revenue and DWL.',
      zh: '征收单位消费税在买价（Pb）与卖价（Ps）之间形成税收楔子，带来政府财政收入并产生社会净福利损失（DWL）。'
    },
    params: {
      demandShift: 0,
      supplyShift: 0,
      taxPerUnit: 16,
      priceControlMode: 'none',
      controlledPrice: 50
    }
  },
  {
    id: 'price-ceiling',
    name: {
      en: 'Binding Price Ceiling (Shortage)',
      zh: '有约束力的价格上限（短缺）'
    },
    description: {
      en: 'A legal maximum price set below equilibrium price (e.g. rent control), leading to excess demand (shortage) and DWL.',
      zh: '设定低于均衡价格的法定最高限价（如房租管制），导致需求量大于供给量（短缺）并伴随无谓损失。'
    },
    params: {
      demandShift: 0,
      supplyShift: 0,
      taxPerUnit: 0,
      priceControlMode: 'ceiling',
      controlledPrice: 35
    }
  },
  {
    id: 'price-floor',
    name: {
      en: 'Binding Price Floor (Surplus)',
      zh: '有约束力的价格下限（过剩）'
    },
    description: {
      en: 'A legal minimum price set above equilibrium price (e.g. agricultural price supports), causing excess supply (surplus) and DWL.',
      zh: '设定高于均衡价格的法定最低限价（如农产品保护价），导致供给量大于需求量（产品过剩）及无谓损失。'
    },
    params: {
      demandShift: 0,
      supplyShift: 0,
      taxPerUnit: 0,
      priceControlMode: 'floor',
      controlledPrice: 65
    }
  },
  {
    id: 'demand-increase',
    name: {
      en: 'Demand Increase (Shift Right)',
      zh: '需求增加（右移）'
    },
    description: {
      en: 'A favorable change in consumer tastes or income shifts demand rightward, raising both equilibrium price and quantity.',
      zh: '消费者偏好提升或收入增加驱动需求曲线整体右移，促使均衡价格与均衡数量同步上升。'
    },
    params: {
      demandShift: 18,
      supplyShift: 0,
      taxPerUnit: 0,
      priceControlMode: 'none',
      controlledPrice: 50
    }
  }
];

export const marketEquilibriumModel: EconomicModel = {
  id: 'market-equilibrium-welfare',
  topicId: 'market-equilibrium-welfare',
  name: {
    en: 'Supply, Demand, Equilibrium & Welfare',
    zh: '供求均衡、社会福利与市场干预'
  },
  description: {
    en: 'Interactive model of competitive equilibrium, surplus distribution, per-unit excise taxes, and price controls.',
    zh: '完全竞争均衡、经济剩余分配、单位消费税及价格管制的交互仿真模型。'
  },
  defaultParams,
  presets,
  controls: [
    {
      type: 'slider',
      id: 'demandShift',
      label: {
        en: 'Demand Curve Shift (ΔD)',
        zh: '需求曲线平移（ΔD）'
      },
      min: -30,
      max: 30,
      step: 2,
      unit: '',
      help: {
        en: 'Positive shifts demand rightward (increase in demand); negative shifts leftward.',
        zh: '正值表示需求增加（曲线右移）；负值表示需求减少（曲线左移）。'
      }
    },
    {
      type: 'slider',
      id: 'supplyShift',
      label: {
        en: 'Supply Curve Shift (ΔS)',
        zh: '供给曲线平移（ΔS）'
      },
      min: -30,
      max: 30,
      step: 2,
      unit: '',
      help: {
        en: 'Positive shifts supply rightward (increase in supply); negative shifts leftward.',
        zh: '正值表示供给增加（曲线右移）；负值表示供给减少（曲线左移）。'
      }
    },
    {
      type: 'slider',
      id: 'taxPerUnit',
      label: {
        en: 'Excise Tax per Unit ($/unit)',
        zh: '单位从量消费税（$/单位）'
      },
      min: 0,
      max: 24,
      step: 1,
      unit: '$',
      help: {
        en: 'Per-unit tax placed on production/consumption, shifting effective supply upward.',
        zh: '对商品征收的单位从量税，使有效供给曲线垂直向上平移。'
      }
    },
    {
      type: 'select',
      id: 'priceControlMode',
      label: {
        en: 'Government Price Control',
        zh: '政府价格管制政策'
      },
      options: [
        { id: 'none', label: { en: 'None (Free Market)', zh: '无管制（自由竞争市场）' } },
        { id: 'ceiling', label: { en: 'Price Ceiling (Max Legal Price)', zh: '价格上限（最高法定限价）' } },
        { id: 'floor', label: { en: 'Price Floor (Min Legal Price)', zh: '价格下限（最低法定限价）' } }
      ]
    },
    {
      type: 'slider',
      id: 'controlledPrice',
      label: {
        en: 'Controlled Price Level ($)',
        zh: '管制价格设定值（$）'
      },
      min: 15,
      max: 85,
      step: 1,
      unit: '$',
      help: {
        en: 'Active when Price Ceiling or Price Floor is selected above.',
        zh: '当上方选择了价格上限或下限时生效。'
      }
    }
  ],
  calculate(rawParams: Record<string, any>): GraphCalculationOutput {
    const params: MarketEquilibriumParams = { ...defaultParams, ...rawParams };

    // Base Linear Equations:
    // Demand: P = a - b * Q  (Base: P = 90 - 0.8 * Q)
    // Supply: P = c + d * Q  (Base: P = 10 + 0.8 * Q)
    const demandIntercept = 90 + params.demandShift;
    const demandSlope = -0.8;

    const supplyIntercept = 10 - params.supplyShift;
    const supplySlope = 0.8;

    // Free market equilibrium (before tax)
    const freeMarketInter = findLinearIntersection(
      { intercept: demandIntercept, slope: demandSlope },
      { intercept: supplyIntercept, slope: supplySlope }
    );

    const qStar = freeMarketInter ? Math.max(0, freeMarketInter.x) : 50;
    const pStar = freeMarketInter ? freeMarketInter.y : 50;

    // With excise tax: Supply curve shifts up by taxPerUnit
    const effectiveSupplyIntercept = supplyIntercept + params.taxPerUnit;
    const taxedInter = findLinearIntersection(
      { intercept: demandIntercept, slope: demandSlope },
      { intercept: effectiveSupplyIntercept, slope: supplySlope }
    );

    let actualQ = taxedInter ? Math.max(0, taxedInter.x) : qStar;
    let priceBuyer = evaluateLinearPrice({ intercept: demandIntercept, slope: demandSlope }, actualQ);
    let priceSeller = evaluateLinearPrice({ intercept: supplyIntercept, slope: supplySlope }, actualQ);

    // Apply Price Controls if active
    let isBindingControl = false;
    let shortageOrSurplus: 'shortage' | 'surplus' | null = null;
    let controlDiscrepancyAmount = 0;

    if (params.priceControlMode === 'ceiling') {
      if (params.controlledPrice < pStar) {
        isBindingControl = true;
        // Ceiling binds below P*
        // At ceiling: Qd = (Pceiling - a) / slopeD, Qs = (Pceiling - c) / slopeS
        const qDemandedAtCeiling = (params.controlledPrice - demandIntercept) / demandSlope;
        const qSuppliedAtCeiling = Math.max(0, (params.controlledPrice - supplyIntercept) / supplySlope);
        actualQ = Math.min(qDemandedAtCeiling, qSuppliedAtCeiling); // voluntary exchange rule
        priceBuyer = params.controlledPrice;
        priceSeller = params.controlledPrice;
        shortageOrSurplus = 'shortage';
        controlDiscrepancyAmount = Math.max(0, qDemandedAtCeiling - qSuppliedAtCeiling);
      }
    } else if (params.priceControlMode === 'floor') {
      if (params.controlledPrice > pStar) {
        isBindingControl = true;
        // Floor binds above P*
        const qDemandedAtFloor = Math.max(0, (params.controlledPrice - demandIntercept) / demandSlope);
        const qSuppliedAtFloor = (params.controlledPrice - supplyIntercept) / supplySlope;
        actualQ = Math.min(qDemandedAtFloor, qSuppliedAtFloor);
        priceBuyer = params.controlledPrice;
        priceSeller = params.controlledPrice;
        shortageOrSurplus = 'surplus';
        controlDiscrepancyAmount = Math.max(0, qSuppliedAtFloor - qDemandedAtFloor);
      }
    }

    // Welfare Calculations
    // CS = Area between Demand curve and priceBuyer up to actualQ
    const cs = Math.max(0, 0.5 * (demandIntercept - priceBuyer) * actualQ);
    // PS = Area between priceSeller and Supply curve up to actualQ
    const ps = Math.max(0, 0.5 * (priceSeller - supplyIntercept) * actualQ);
    // Tax Revenue = taxPerUnit * actualQ
    const taxRevenue = params.taxPerUnit > 0 ? params.taxPerUnit * actualQ : 0;
    // Deadweight Loss (DWL)
    const deltaQ = Math.max(0, qStar - actualQ);
    let dwl = 0;
    if (params.taxPerUnit > 0) {
      dwl = 0.5 * params.taxPerUnit * deltaQ;
    } else if (isBindingControl) {
      // Area between Demand and Supply from actualQ to qStar
      const pDemandAtQ = evaluateLinearPrice({ intercept: demandIntercept, slope: demandSlope }, actualQ);
      const pSupplyAtQ = evaluateLinearPrice({ intercept: supplyIntercept, slope: supplySlope }, actualQ);
      dwl = 0.5 * Math.abs(pDemandAtQ - pSupplyAtQ) * deltaQ;
    }
    const totalWelfare = cs + ps + taxRevenue;

    // Elasticity at equilibrium
    const ped = calculatePointElasticity(demandSlope, pStar, qStar);

    // Generate Curve Points
    const xMax = 110;
    const yMax = 100;

    const demandPoints = generateLinearPoints(
      { intercept: demandIntercept, slope: demandSlope },
      0,
      xMax,
      25,
      0,
      yMax
    );

    const supplyPoints = generateLinearPoints(
      { intercept: supplyIntercept, slope: supplySlope },
      0,
      xMax,
      25,
      0,
      yMax
    );

    const curves: CurveSpec[] = [
      {
        id: 'demand',
        name: { en: 'Demand (D)', zh: '需求曲线（D）' },
        shortLabel: 'D',
        points: demandPoints,
        color: '#2563eb', // Blue
        strokeWidth: 3,
        strokeDasharray: 'none',
        visible: true,
        equation: `P = ${demandIntercept.toFixed(0)} - 0.8Q`,
        endLabelPosition: 'end' as const
      },
      {
        id: 'supply',
        name: { en: 'Supply (S)', zh: '供给曲线（S）' },
        shortLabel: 'S',
        points: supplyPoints,
        color: '#dc2626', // Red
        strokeWidth: 3,
        strokeDasharray: 'none',
        visible: true,
        equation: `P = ${supplyIntercept.toFixed(0)} + 0.8Q`,
        endLabelPosition: 'end' as const
      }
    ];

    // If tax is active, show the shifted supply curve
    if (params.taxPerUnit > 0) {
      const taxedSupplyPoints = generateLinearPoints(
        { intercept: effectiveSupplyIntercept, slope: supplySlope },
        0,
        xMax,
        25,
        0,
        yMax
      );
      curves.push({
        id: 'supplyTax',
        name: { en: `Supply + Tax ($${params.taxPerUnit})`, zh: `含税供给曲线（+${params.taxPerUnit}）` },
        shortLabel: 'S + Tax',
        points: taxedSupplyPoints,
        color: '#9333ea', // Purple
        strokeWidth: 2.5,
        strokeDasharray: '5,4',
        visible: true,
        equation: `P = ${effectiveSupplyIntercept.toFixed(0)} + 0.8Q`,
        endLabelPosition: 'end' as const
      });
    }

    // If price control is active, show horizontal controlled price line
    if (params.priceControlMode !== 'none') {
      curves.push({
        id: 'controlLine',
        name: {
          en: params.priceControlMode === 'ceiling' ? 'Price Ceiling Line' : 'Price Floor Line',
          zh: params.priceControlMode === 'ceiling' ? '价格上限控制线' : '价格下限控制线'
        },
        shortLabel: params.priceControlMode === 'ceiling' ? 'P_Ceiling' : 'P_Floor',
        points: [
          { x: 0, y: params.controlledPrice },
          { x: xMax, y: params.controlledPrice }
        ],
        color: params.priceControlMode === 'ceiling' ? '#d97706' : '#0284c7',
        strokeWidth: 2,
        strokeDasharray: '6,3',
        visible: true,
        endLabelPosition: 'end' as const
      });
    }

    // Points of interest
    const points = [
      {
        id: 'eqFree',
        label: { en: 'Free Market Equilibrium (E₀)', zh: '自由市场均衡点（E₀）' },
        shortLabel: 'E₀',
        x: Number(qStar.toFixed(1)),
        y: Number(pStar.toFixed(1)),
        color: '#059669',
        showDropLines: true,
        xLabel: `Q*=${qStar.toFixed(1)}`,
        yLabel: `P*=$${pStar.toFixed(1)}`
      }
    ];

    if (params.taxPerUnit > 0) {
      points.push(
        {
          id: 'buyerPricePoint',
          label: { en: 'Buyer Price (Pb)', zh: '买方支付价格（Pb）' },
          shortLabel: 'Pb',
          x: Number(actualQ.toFixed(1)),
          y: Number(priceBuyer.toFixed(1)),
          color: '#2563eb',
          showDropLines: true,
          xLabel: `Qt=${actualQ.toFixed(1)}`,
          yLabel: `Pb=$${priceBuyer.toFixed(1)}`
        },
        {
          id: 'sellerPricePoint',
          label: { en: 'Seller Price (Ps)', zh: '卖方所得价格（Ps）' },
          shortLabel: 'Ps',
          x: Number(actualQ.toFixed(1)),
          y: Number(priceSeller.toFixed(1)),
          color: '#dc2626',
          showDropLines: true,
          xLabel: '',
          yLabel: `Ps=$${priceSeller.toFixed(1)}`
        }
      );
    }

    // Welfare Shaded Areas
    const shadedAreas = [];

    // Consumer Surplus (CS)
    if (actualQ > 0 && demandIntercept > priceBuyer) {
      shadedAreas.push({
        id: 'cs',
        label: { en: 'Consumer Surplus (CS)', zh: '消费者剩余（CS）' },
        points: [
          { x: 0, y: demandIntercept },
          { x: actualQ, y: priceBuyer },
          { x: 0, y: priceBuyer }
        ],
        fill: '#3b82f6', // Blue tint
        opacity: 0.25,
        pattern: 'diagonal-right' as const,
        value: Number(cs.toFixed(1)),
        valuePrefix: '$',
        visible: true
      });
    }

    // Producer Surplus (PS)
    if (actualQ > 0 && priceSeller > supplyIntercept) {
      shadedAreas.push({
        id: 'ps',
        label: { en: 'Producer Surplus (PS)', zh: '生产者剩余（PS）' },
        points: [
          { x: 0, y: supplyIntercept },
          { x: actualQ, y: priceSeller },
          { x: 0, y: priceSeller }
        ],
        fill: '#f59e0b', // Amber tint
        opacity: 0.25,
        pattern: 'diagonal-left' as const,
        value: Number(ps.toFixed(1)),
        valuePrefix: '$',
        visible: true
      });
    }

    // Tax Revenue Box
    if (params.taxPerUnit > 0 && actualQ > 0) {
      shadedAreas.push({
        id: 'taxRevenue',
        label: { en: 'Tax Revenue', zh: '政府税收收入' },
        points: [
          { x: 0, y: priceBuyer },
          { x: actualQ, y: priceBuyer },
          { x: actualQ, y: priceSeller },
          { x: 0, y: priceSeller }
        ],
        fill: '#8b5cf6', // Violet tint
        opacity: 0.35,
        pattern: 'dots' as const,
        value: Number(taxRevenue.toFixed(1)),
        valuePrefix: '$',
        visible: true
      });
    }

    // Deadweight Loss (DWL)
    if (dwl > 0.1 && actualQ < qStar) {
      shadedAreas.push({
        id: 'dwl',
        label: { en: 'Deadweight Loss (DWL)', zh: '无谓损失（DWL）' },
        points: [
          { x: actualQ, y: priceBuyer },
          { x: qStar, y: pStar },
          { x: actualQ, y: priceSeller }
        ],
        fill: '#ef4444', // Red warning
        opacity: 0.38,
        pattern: 'cross' as const,
        value: Number(dwl.toFixed(1)),
        valuePrefix: '$',
        visible: true
      });
    }

    // Results metrics
    const results = [
      {
        id: 'eqPrice',
        label: { en: 'Equilibrium Price (P*)', zh: '均衡价格（P*）' },
        value: `$${pStar.toFixed(2)}`,
        color: '#059669'
      },
      {
        id: 'eqQuantity',
        label: { en: 'Equilibrium Quantity (Q*)', zh: '均衡数量（Q*）' },
        value: `${qStar.toFixed(2)} units`,
        color: '#059669'
      },
      {
        id: 'cs',
        label: { en: 'Consumer Surplus (CS)', zh: '消费者剩余（CS）' },
        value: `$${cs.toFixed(2)}`,
        color: '#2563eb',
        formula: '1/2 × (P_max - P_buyer) × Q'
      },
      {
        id: 'ps',
        label: { en: 'Producer Surplus (PS)', zh: '生产者剩余（PS）' },
        value: `$${ps.toFixed(2)}`,
        color: '#d97706',
        formula: '1/2 × (P_seller - P_min) × Q'
      },
      {
        id: 'totalSurplus',
        label: { en: 'Total Welfare', zh: '社会总福利' },
        value: `$${totalWelfare.toFixed(2)}`,
        color: '#10b981',
        formula: 'CS + PS + Tax Revenue'
      },
      {
        id: 'dwl',
        label: { en: 'Deadweight Loss (DWL)', zh: '无谓损失（DWL）' },
        value: `$${dwl.toFixed(2)}`,
        color: dwl > 0.1 ? '#dc2626' : '#64748b',
        formula: '1/2 × Tax × (Q* - Qt)'
      }
    ];

    if (params.taxPerUnit > 0) {
      const consumerIncidence = Math.max(0, priceBuyer - pStar);
      const producerIncidence = Math.max(0, pStar - priceSeller);
      results.push(
        {
          id: 'taxRev',
          label: { en: 'Tax Revenue', zh: '政府税收收入' },
          value: `$${taxRevenue.toFixed(2)}`,
          color: '#8b5cf6'
        },
        {
          id: 'taxIncidence',
          label: { en: 'Consumer vs Producer Burden', zh: '消费者与生产者税负分担' },
          value: `$${consumerIncidence.toFixed(1)} / $${producerIncidence.toFixed(1)}`,
          color: '#6366f1'
        }
      );
    }

    if (isBindingControl && shortageOrSurplus) {
      results.push({
        id: 'discrepancy',
        label: {
          en: shortageOrSurplus === 'shortage' ? 'Market Shortage (Qd - Qs)' : 'Market Surplus (Qs - Qd)',
          zh: shortageOrSurplus === 'shortage' ? '市场短缺量（Qd - Qs）' : '市场过剩量（Qs - Qd）'
        },
        value: `${controlDiscrepancyAmount.toFixed(1)} units`,
        color: '#e11d48'
      });
    }

    // Dynamic educational notes
    const explanation = {
      en: params.taxPerUnit > 0
        ? `A per-unit excise tax of $${params.taxPerUnit} drives a wedge between buyer price ($${priceBuyer.toFixed(1)}) and seller price ($${priceSeller.toFixed(1)}). The reduction in quantity traded from ${qStar.toFixed(1)} to ${actualQ.toFixed(1)} creates a Deadweight Loss of $${dwl.toFixed(1)} because mutually beneficial trades are prevented.`
        : isBindingControl
        ? `The binding ${params.priceControlMode === 'ceiling' ? 'Price Ceiling' : 'Price Floor'} set at $${params.controlledPrice} restricts voluntary market transactions to ${actualQ.toFixed(1)} units, producing a ${shortageOrSurplus} of ${controlDiscrepancyAmount.toFixed(1)} units and generating a deadweight loss of $${dwl.toFixed(1)}.`
        : `At the competitive market equilibrium (P* = $${pStar.toFixed(1)}, Q* = ${qStar.toFixed(1)}), the Marginal Benefit equals Marginal Cost (Allocative Efficiency). Total economic surplus (CS + PS = $${totalWelfare.toFixed(1)}) is maximized, yielding zero deadweight loss.`,
      zh: params.taxPerUnit > 0
        ? `征收每单位 $${params.taxPerUnit} 的消费税在买方价格（$${priceBuyer.toFixed(1)}）与卖方价格（$${priceSeller.toFixed(1)}）之间形成税收楔子。交易量从 ${qStar.toFixed(1)} 减少到 ${actualQ.toFixed(1)}，因阻碍了互利交易而产生 $${dwl.toFixed(1)} 的无谓损失（DWL）。`
        : isBindingControl
        ? `设定在 $${params.controlledPrice} 的有约束力${params.priceControlMode === 'ceiling' ? '价格上限' : '价格下限'}将市场自愿交易量限制在 ${actualQ.toFixed(1)} 单位，引发了 ${controlDiscrepancyAmount.toFixed(1)} 单位的市场${shortageOrSurplus === 'shortage' ? '短缺' : '过剩'}，并造成 $${dwl.toFixed(1)} 的无谓损失。`
        : `在完全竞争市场均衡点（P* = $${pStar.toFixed(1)}, Q* = ${qStar.toFixed(1)}），边际收益等于边际成本（配置效率达成）。社会总经济剩余（CS + PS = $${totalWelfare.toFixed(1)}）达到最大化，无谓损失为零。`
    };

    const analysisPoints = [
      {
        en: 'Allocative Efficiency: Occurs when market produces where MB = MC, maximizing Total Surplus (CS + PS).',
        zh: '配置效率（Allocative Efficiency）：当市场在 MB = MC 处生产时达成，社会总剩余（CS + PS）达到最大。'
      },
      {
        en: `Price Elasticity of Demand (PED) at equilibrium is approximately ${ped.toFixed(2)}, which ${ped > 1 ? 'is elastic (> 1)' : ped < 1 ? 'is inelastic (< 1)' : 'is unit-elastic (= 1)'}.`,
        zh: `均衡点处的需求价格弹性（PED）约为 ${ped.toFixed(2)}，属于${ped > 1 ? '富有弹性（> 1）' : ped < 1 ? '缺乏弹性（< 1）' : '单位弹性（= 1）'}。`
      },
      {
        en: 'Tax Incidence: The burden of an excise tax falls more heavily on whichever side of the market is more inelastic.',
        zh: '税负归宿原则：消费税的税收负担更多地落在弹性较小（更不敏感）的一方身上。'
      }
    ];

    return {
      axes: {
        xLabel: { en: 'Quantity (Q)', zh: '数量（Q）' },
        yLabel: { en: 'Price (P in $)', zh: '价格（P，美元）' },
        xMin: 0,
        xMax: xMax,
        yMin: 0,
        yMax: yMax,
        xStep: 10,
        yStep: 10,
        xSuffix: ' units',
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
