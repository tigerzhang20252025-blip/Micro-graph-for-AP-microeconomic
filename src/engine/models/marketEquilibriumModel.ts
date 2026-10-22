import { EconomicModel, GraphCalculationOutput, ScenarioPreset, CurveSpec, KeyPointSpec, ShadedAreaSpec } from '../../types/graph';
import {
  evaluateLinearPrice,
  findLinearIntersection,
  generateLinearPoints,
  calculatePointElasticity,
  analyzeSimultaneousShifts
} from '../economicMath';

export interface MarketEquilibriumParams {
  demandShift: number;     // -30 to +30
  supplyShift: number;     // -30 to +30 (positive = supply right/increase)
  taxPerUnit: number;      // 0 to 24
  subsidyPerUnit: number;  // 0 to 20
  priceControlMode: 'none' | 'ceiling' | 'floor';
  controlledPrice: number; // 15 to 85
  showBaselineComparison: boolean;
}

const defaultParams: MarketEquilibriumParams = {
  demandShift: 0,
  supplyShift: 0,
  taxPerUnit: 0,
  subsidyPerUnit: 0,
  priceControlMode: 'none',
  controlledPrice: 40,
  showBaselineComparison: false
};

const presets: ScenarioPreset[] = [
  {
    id: 'baseline',
    name: {
      en: 'Competitive Market Baseline (MB = MC)',
      zh: '完全竞争市场基准（MB = MC）'
    },
    description: {
      en: 'Competitive equilibrium with Qs = Qd. Allocative efficiency is achieved; CS and PS are maximized with zero deadweight loss.',
      zh: '完全竞争基准点（Qs = Qd）。达到配置效率（MB = MC），消费者与生产者剩余最大化，无谓损失为零。'
    },
    params: {
      demandShift: 0,
      supplyShift: 0,
      taxPerUnit: 0,
      subsidyPerUnit: 0,
      priceControlMode: 'none',
      controlledPrice: 50,
      showBaselineComparison: false
    }
  },
  {
    id: 'simultaneous-d-up-s-up',
    name: {
      en: 'Simultaneous Shift: D ↑ & S ↑ (Q ↑, P Indeterminate)',
      zh: '双重移动：D ↑ 与 S ↑（Q 确定增加，P 不确定）'
    },
    description: {
      en: 'Both demand and supply shift rightward. Quantity unequivocally increases, while the effect on price depends on which shift is larger.',
      zh: '供求双方同时增加（右移）。均衡数量必然增加，而均衡价格的涨跌取决于需求与供给平移相对幅度。'
    },
    params: {
      demandShift: 20,
      supplyShift: 20,
      taxPerUnit: 0,
      subsidyPerUnit: 0,
      priceControlMode: 'none',
      controlledPrice: 50,
      showBaselineComparison: true
    }
  },
  {
    id: 'simultaneous-d-up-s-down',
    name: {
      en: 'Simultaneous Shift: D ↑ & S ↓ (P ↑, Q Indeterminate)',
      zh: '双重移动：D ↑ 与 S ↓（P 确定上涨，Q 不确定）'
    },
    description: {
      en: 'Demand increases while supply decreases. Price unequivocally rises, while the effect on quantity is indeterminate.',
      zh: '需求增加而供给减少。均衡价格必然上涨，而均衡数量的增减取决于哪一方的变动占主导。'
    },
    params: {
      demandShift: 20,
      supplyShift: -20,
      taxPerUnit: 0,
      subsidyPerUnit: 0,
      priceControlMode: 'none',
      controlledPrice: 50,
      showBaselineComparison: true
    }
  },
  {
    id: 'excise-tax',
    name: {
      en: 'Excise Tax Wedge & Deadweight Loss',
      zh: '从量消费税楔子与无谓损失（DWL）'
    },
    description: {
      en: 'A per-unit tax drives a wedge between buyer price (Pb) and seller price (Ps), generating tax revenue and deadweight loss.',
      zh: '征收每单位从量消费税在买方价格（Pb）与卖方价格（Ps）之间形成税收楔子，减少交易量并产生社会福利无谓损失。'
    },
    params: {
      demandShift: 0,
      supplyShift: 0,
      taxPerUnit: 16,
      subsidyPerUnit: 0,
      priceControlMode: 'none',
      controlledPrice: 50,
      showBaselineComparison: false
    }
  },
  {
    id: 'per-unit-subsidy',
    name: {
      en: 'Per-Unit Production Subsidy (Overproduction DWL)',
      zh: '单位生产补贴（过度生产导致的 DWL）'
    },
    description: {
      en: 'Government pays producers a per-unit subsidy, shifting effective supply down. Output expands beyond efficient Q*, creating deadweight loss.',
      zh: '政府向生产商发放单位补贴，使有效供给下移。产量扩张至社会有效水平以上，财政支出超过社会剩余增量从而产生无谓损失。'
    },
    params: {
      demandShift: 0,
      supplyShift: 0,
      taxPerUnit: 0,
      subsidyPerUnit: 14,
      priceControlMode: 'none',
      controlledPrice: 50,
      showBaselineComparison: false
    }
  },
  {
    id: 'price-ceiling',
    name: {
      en: 'Binding Price Ceiling (Rent Control Shortage)',
      zh: '有约束力的价格上限（房租管制短缺）'
    },
    description: {
      en: 'A legal maximum price set below equilibrium price, leading to persistent shortage (Qd > Qs) and deadweight loss.',
      zh: '设定低于均衡价格的法定最高限价，导致需求量大于供给量形成持久短缺，并导致部分互利交易无法达成。'
    },
    params: {
      demandShift: 0,
      supplyShift: 0,
      taxPerUnit: 0,
      subsidyPerUnit: 0,
      priceControlMode: 'ceiling',
      controlledPrice: 35,
      showBaselineComparison: false
    }
  },
  {
    id: 'price-floor',
    name: {
      en: 'Binding Price Floor (Agricultural Surplus)',
      zh: '有约束力的价格下限（农产品保护价过剩）'
    },
    description: {
      en: 'A legal minimum price set above equilibrium price, creating excess supply (surplus) and deadweight loss.',
      zh: '设定高于均衡价格的法定最低限价，导致供给量大于需求量形成产品积压过剩及无谓损失。'
    },
    params: {
      demandShift: 0,
      supplyShift: 0,
      taxPerUnit: 0,
      subsidyPerUnit: 0,
      priceControlMode: 'floor',
      controlledPrice: 65,
      showBaselineComparison: false
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
    en: 'Interactive model of competitive equilibrium, simultaneous shifts, elasticity, excise taxes, subsidies, and price controls.',
    zh: '完全竞争均衡、供求双重平移、弹性、单位消费税、生产补贴以及价格管制的完整仿真模型。'
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
        en: 'Positive = increase in demand (right); Negative = decrease in demand (left).',
        zh: '正值代表需求增加（右移）；负值代表需求减少（左移）。'
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
        en: 'Positive = increase in supply (right); Negative = decrease in supply (left).',
        zh: '正值代表供给增加（右移）；负值代表供给减少（左移）。'
      }
    },
    {
      type: 'slider',
      id: 'taxPerUnit',
      label: {
        en: 'Per-Unit Excise Tax ($/unit)',
        zh: '单位从量消费税（$/单位）'
      },
      min: 0,
      max: 24,
      step: 1,
      unit: '$',
      help: {
        en: 'Per-unit tax driving a wedge between buyer and seller prices.',
        zh: '政府征收的单位从量税，使买方支付价格与卖方获得价格分离。'
      }
    },
    {
      type: 'slider',
      id: 'subsidyPerUnit',
      label: {
        en: 'Per-Unit Production Subsidy ($/unit)',
        zh: '单位生产补贴（$/单位）'
      },
      min: 0,
      max: 20,
      step: 1,
      unit: '$',
      help: {
        en: 'Per-unit subsidy lowering effective production cost and expanding output.',
        zh: '政府向生产者发放的单位补贴，降低有效成本并扩大产出。'
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
        en: 'Active when Price Ceiling or Price Floor is selected.',
        zh: '在选择价格上限或下限时生效。'
      }
    },
    {
      type: 'toggle',
      id: 'showBaselineComparison',
      label: {
        en: 'Show Baseline Comparison (Original E₀)',
        zh: '显示初始基准对比（原均衡点 E₀）'
      },
      help: {
        en: 'Overlays original equilibrium curves to clearly show before-and-after shifts.',
        zh: '叠加显示初始基准曲线，清晰对比平移前后的变动。'
      }
    }
  ],
  calculate(rawParams: Record<string, any>): GraphCalculationOutput {
    const params: MarketEquilibriumParams = { ...defaultParams, ...rawParams };

    // Linear Model Specifications:
    // Base Demand: P = 90 - 0.8 * Q  (Intercept: 90, slope: -0.8)
    // Base Supply: P = 10 + 0.8 * Q  (Intercept: 10, slope: 0.8)
    const baseDemandIntercept = 90;
    const baseSupplyIntercept = 10;
    const demandSlope = -0.8;
    const supplySlope = 0.8;

    // Shifted intercepts:
    const demandIntercept = baseDemandIntercept + params.demandShift;
    const supplyIntercept = baseSupplyIntercept - params.supplyShift; // Note: positive supplyShift means curve shifts right / down

    // Baseline Free Market Equilibrium (without current shift/tax/subsidy)
    const baseInter = findLinearIntersection(
      { intercept: baseDemandIntercept, slope: demandSlope },
      { intercept: baseSupplyIntercept, slope: supplySlope }
    );
    const baseQ0 = baseInter ? baseInter.x : 50;
    const baseP0 = baseInter ? baseInter.y : 50;

    // Current Shifted Market Equilibrium (before tax/subsidy/controls)
    const marketInter = findLinearIntersection(
      { intercept: demandIntercept, slope: demandSlope },
      { intercept: supplyIntercept, slope: supplySlope }
    );
    const qStar = marketInter ? Math.max(0, marketInter.x) : 50;
    const pStar = marketInter ? marketInter.y : 50;

    // Tax or Subsidy effective intercept:
    // If tax: effective supply shifts up by taxPerUnit
    // If subsidy: effective supply shifts down by subsidyPerUnit
    const netIntervention = params.taxPerUnit - params.subsidyPerUnit;
    const effectiveSupplyIntercept = supplyIntercept + netIntervention;

    const postInterventionInter = findLinearIntersection(
      { intercept: demandIntercept, slope: demandSlope },
      { intercept: effectiveSupplyIntercept, slope: supplySlope }
    );

    let actualQ = postInterventionInter ? Math.max(0, postInterventionInter.x) : qStar;
    let priceBuyer = evaluateLinearPrice({ intercept: demandIntercept, slope: demandSlope }, actualQ);
    let priceSeller = evaluateLinearPrice({ intercept: supplyIntercept, slope: supplySlope }, actualQ);

    // Apply Price Controls if selected
    let isBindingControl = false;
    let shortageOrSurplus: 'shortage' | 'surplus' | null = null;
    let controlDiscrepancyAmount = 0;

    if (params.priceControlMode === 'ceiling') {
      if (params.controlledPrice < pStar) {
        isBindingControl = true;
        const qDemandedAtCeiling = (params.controlledPrice - demandIntercept) / demandSlope;
        const qSuppliedAtCeiling = Math.max(0, (params.controlledPrice - supplyIntercept) / supplySlope);
        actualQ = Math.min(qDemandedAtCeiling, qSuppliedAtCeiling); // short side of the market rule
        priceBuyer = params.controlledPrice;
        priceSeller = params.controlledPrice;
        shortageOrSurplus = 'shortage';
        controlDiscrepancyAmount = Math.max(0, qDemandedAtCeiling - qSuppliedAtCeiling);
      }
    } else if (params.priceControlMode === 'floor') {
      if (params.controlledPrice > pStar) {
        isBindingControl = true;
        const qDemandedAtFloor = Math.max(0, (params.controlledPrice - demandIntercept) / demandSlope);
        const qSuppliedAtFloor = (params.controlledPrice - supplyIntercept) / supplySlope;
        actualQ = Math.min(qDemandedAtFloor, qSuppliedAtFloor);
        priceBuyer = params.controlledPrice;
        priceSeller = params.controlledPrice;
        shortageOrSurplus = 'surplus';
        controlDiscrepancyAmount = Math.max(0, qSuppliedAtFloor - qDemandedAtFloor);
      }
    }

    // Welfare Calculations:
    const cs = Math.max(0, 0.5 * (demandIntercept - priceBuyer) * actualQ);
    const ps = Math.max(0, 0.5 * (priceSeller - supplyIntercept) * actualQ);
    const taxRevenue = params.taxPerUnit > 0 ? params.taxPerUnit * actualQ : 0;
    const subsidyExpense = params.subsidyPerUnit > 0 ? params.subsidyPerUnit * actualQ : 0;

    let dwl = 0;
    if (params.taxPerUnit > 0) {
      // Underproduction DWL
      const deltaQ = Math.max(0, qStar - actualQ);
      dwl = 0.5 * params.taxPerUnit * deltaQ;
    } else if (params.subsidyPerUnit > 0) {
      // Overproduction DWL
      const deltaQ = Math.max(0, actualQ - qStar);
      dwl = 0.5 * params.subsidyPerUnit * deltaQ;
    } else if (isBindingControl) {
      const deltaQ = Math.max(0, qStar - actualQ);
      const pDemandAtQ = evaluateLinearPrice({ intercept: demandIntercept, slope: demandSlope }, actualQ);
      const pSupplyAtQ = evaluateLinearPrice({ intercept: supplyIntercept, slope: supplySlope }, actualQ);
      dwl = 0.5 * Math.abs(pDemandAtQ - pSupplyAtQ) * deltaQ;
    }

    const totalWelfare = cs + ps + taxRevenue - subsidyExpense;

    // Elasticity at market equilibrium
    const ped = calculatePointElasticity(demandSlope, pStar, qStar);
    const pes = calculatePointElasticity(supplySlope, pStar, qStar);

    // Simultaneous Shift Analysis
    const shiftAnalysis = analyzeSimultaneousShifts(params.demandShift, params.supplyShift);

    // Generate Curve Points
    const xMax = 120;
    const yMax = 110;

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
        name: { en: 'Demand Curve (D)', zh: '需求曲线（D）' },
        shortLabel: 'D',
        points: demandPoints,
        color: '#2563eb', // Blue
        strokeWidth: 3,
        strokeDasharray: 'none',
        visible: true,
        equation: `P = ${demandIntercept.toFixed(0)} - 0.8Q`,
        endLabelPosition: 'end'
      },
      {
        id: 'supply',
        name: { en: 'Supply Curve (S)', zh: '供给曲线（S）' },
        shortLabel: 'S',
        points: supplyPoints,
        color: '#dc2626', // Red
        strokeWidth: 3,
        strokeDasharray: 'none',
        visible: true,
        equation: `P = ${supplyIntercept.toFixed(0)} + 0.8Q`,
        endLabelPosition: 'end'
      }
    ];

    // Baseline Comparison Curves (if toggled)
    if (params.showBaselineComparison && (params.demandShift !== 0 || params.supplyShift !== 0)) {
      const baseDemandPts = generateLinearPoints({ intercept: baseDemandIntercept, slope: demandSlope }, 0, xMax, 25, 0, yMax);
      const baseSupplyPts = generateLinearPoints({ intercept: baseSupplyIntercept, slope: supplySlope }, 0, xMax, 25, 0, yMax);
      curves.unshift(
        {
          id: 'baseDemand',
          name: { en: 'Initial Demand (D₀)', zh: '初始需求（D₀）' },
          shortLabel: 'D₀',
          points: baseDemandPts,
          color: '#94a3b8',
          strokeWidth: 2,
          strokeDasharray: '4,4',
          visible: true,
          endLabelPosition: 'end'
        },
        {
          id: 'baseSupply',
          name: { en: 'Initial Supply (S₀)', zh: '初始供给（S₀）' },
          shortLabel: 'S₀',
          points: baseSupplyPts,
          color: '#cbd5e1',
          strokeWidth: 2,
          strokeDasharray: '4,4',
          visible: true,
          endLabelPosition: 'end'
        }
      );
    }

    // Excise Tax Shifted Curve
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
        endLabelPosition: 'end'
      });
    }

    // Subsidy Shifted Curve
    if (params.subsidyPerUnit > 0) {
      const subsidizedSupplyPoints = generateLinearPoints(
        { intercept: effectiveSupplyIntercept, slope: supplySlope },
        0,
        xMax,
        25,
        0,
        yMax
      );
      curves.push({
        id: 'supplySubsidy',
        name: { en: `Supply - Subsidy ($${params.subsidyPerUnit})`, zh: `含补贴供给曲线（-${params.subsidyPerUnit}）` },
        shortLabel: 'S - Subsidy',
        points: subsidizedSupplyPoints,
        color: '#0891b2', // Cyan
        strokeWidth: 2.5,
        strokeDasharray: '5,4',
        visible: true,
        equation: `P = ${effectiveSupplyIntercept.toFixed(0)} + 0.8Q`,
        endLabelPosition: 'end'
      });
    }

    // Price Control Line
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
        endLabelPosition: 'end'
      });
    }

    // Key Coordinate Points
    const points: KeyPointSpec[] = [
      {
        id: 'eqMarket',
        label: { en: 'Equilibrium (E*)', zh: '市场均衡点（E*）' },
        shortLabel: 'E*',
        x: Number(qStar.toFixed(1)),
        y: Number(pStar.toFixed(1)),
        color: '#059669',
        showDropLines: true,
        xLabel: `Q*=${qStar.toFixed(1)}`,
        yLabel: `P*=$${pStar.toFixed(1)}`
      }
    ];

    if (params.showBaselineComparison && (params.demandShift !== 0 || params.supplyShift !== 0)) {
      points.unshift({
        id: 'eqBase',
        label: { en: 'Initial Equilibrium (E₀)', zh: '初始基准均衡（E₀）' },
        shortLabel: 'E₀',
        x: Number(baseQ0.toFixed(1)),
        y: Number(baseP0.toFixed(1)),
        color: '#94a3b8',
        showDropLines: true,
        xLabel: `Q₀=${baseQ0.toFixed(1)}`,
        yLabel: `P₀=$${baseP0.toFixed(1)}`
      });
    }

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

    if (params.subsidyPerUnit > 0) {
      points.push(
        {
          id: 'buyerPriceSub',
          label: { en: 'Buyer Price with Subsidy (Pb)', zh: '享受补贴后买价（Pb）' },
          shortLabel: 'Pb',
          x: Number(actualQ.toFixed(1)),
          y: Number(priceBuyer.toFixed(1)),
          color: '#0891b2',
          showDropLines: true,
          xLabel: `Qsub=${actualQ.toFixed(1)}`,
          yLabel: `Pb=$${priceBuyer.toFixed(1)}`
        },
        {
          id: 'sellerPriceSub',
          label: { en: 'Seller Price with Subsidy (Ps)', zh: '享受补贴后卖价（Ps）' },
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
    const shadedAreas: ShadedAreaSpec[] = [];

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
        fill: '#3b82f6',
        opacity: 0.25,
        pattern: 'diagonal-right',
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
        fill: '#f59e0b',
        opacity: 0.25,
        pattern: 'diagonal-left',
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
        fill: '#8b5cf6',
        opacity: 0.35,
        pattern: 'dots',
        value: Number(taxRevenue.toFixed(1)),
        valuePrefix: '$',
        visible: true
      });
    }

    // Subsidy Expense Box
    if (params.subsidyPerUnit > 0 && actualQ > 0) {
      shadedAreas.push({
        id: 'subsidyExpense',
        label: { en: 'Government Subsidy Cost', zh: '政府补贴财政支出' },
        points: [
          { x: 0, y: priceSeller },
          { x: actualQ, y: priceSeller },
          { x: actualQ, y: priceBuyer },
          { x: 0, y: priceBuyer }
        ],
        fill: '#06b6d4',
        opacity: 0.3,
        pattern: 'dots',
        value: Number(subsidyExpense.toFixed(1)),
        valuePrefix: '$',
        visible: true
      });
    }

    // Deadweight Loss (DWL)
    if (dwl > 0.1) {
      let dwlPoints = [
        { x: actualQ, y: priceBuyer },
        { x: qStar, y: pStar },
        { x: actualQ, y: priceSeller }
      ];
      if (params.subsidyPerUnit > 0) {
        // Subsidy DWL triangle is between Q* and actualQ (to the right of equilibrium)
        dwlPoints = [
          { x: qStar, y: pStar },
          { x: actualQ, y: priceSeller },
          { x: actualQ, y: priceBuyer }
        ];
      }
      shadedAreas.push({
        id: 'dwl',
        label: { en: 'Deadweight Loss (DWL)', zh: '无谓损失（DWL）' },
        points: dwlPoints,
        fill: '#ef4444',
        opacity: 0.38,
        pattern: 'cross',
        value: Number(dwl.toFixed(1)),
        valuePrefix: '$',
        visible: true
      });
    }

    // Results Metrics
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
        label: { en: 'Total Welfare', zh: '社会总净福利' },
        value: `$${totalWelfare.toFixed(2)}`,
        color: '#10b981',
        formula: params.subsidyPerUnit > 0 ? 'CS + PS - Subsidy Cost' : 'CS + PS + Tax Revenue'
      },
      {
        id: 'dwl',
        label: { en: 'Deadweight Loss (DWL)', zh: '无谓损失（DWL）' },
        value: `$${dwl.toFixed(2)}`,
        color: dwl > 0.1 ? '#dc2626' : '#64748b',
        formula: params.subsidyPerUnit > 0 ? '1/2 × Subsidy × (Q_sub - Q*)' : '1/2 × Wedge × |Q* - Q_traded|'
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
          label: { en: 'Tax Incidence (Buyer / Seller)', zh: '税负归宿分担（买方 / 卖方）' },
          value: `$${consumerIncidence.toFixed(1)} / $${producerIncidence.toFixed(1)}`,
          color: '#6366f1'
        }
      );
    }

    if (params.subsidyPerUnit > 0) {
      results.push({
        id: 'subsidyCost',
        label: { en: 'Subsidy Expense', zh: '政府补贴财政总支出' },
        value: `$${subsidyExpense.toFixed(2)}`,
        color: '#0891b2'
      });
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

    // Dynamic Bilingual Educational Explanations
    let explanationTextEn = '';
    let explanationTextZh = '';

    if (params.demandShift !== 0 || params.supplyShift !== 0) {
      explanationTextEn += shiftAnalysis.explanationEn + ' ';
      explanationTextZh += shiftAnalysis.explanationZh + ' ';
    }

    if (params.taxPerUnit > 0) {
      explanationTextEn += `A per-unit tax of $${params.taxPerUnit} creates a tax wedge: buyers pay $${priceBuyer.toFixed(1)} while sellers receive $${priceSeller.toFixed(1)}. Market quantity contracts to ${actualQ.toFixed(1)} units, causing $${dwl.toFixed(1)} in deadweight loss.`;
      explanationTextZh += `征收每单位 $${params.taxPerUnit} 的消费税形成税收楔子：买方支付 $${priceBuyer.toFixed(1)}，卖方实得 $${priceSeller.toFixed(1)}。交易量萎缩至 ${actualQ.toFixed(1)} 单位，造成 $${dwl.toFixed(1)} 的社会死重损失。`;
    } else if (params.subsidyPerUnit > 0) {
      explanationTextEn += `A per-unit production subsidy of $${params.subsidyPerUnit} lowers the buyer price to $${priceBuyer.toFixed(1)} and raises the seller price to $${priceSeller.toFixed(1)}. Output expands to ${actualQ.toFixed(1)} units (overproduction relative to allocatively efficient Q*=${qStar.toFixed(1)}), generating a deadweight loss of $${dwl.toFixed(1)} because the cost to government exceeds total surplus gains.`;
      explanationTextZh += `每单位 $${params.subsidyPerUnit} 的生产补贴使买价降至 $${priceBuyer.toFixed(1)}，卖价升至 $${priceSeller.toFixed(1)}。产出扩张至 ${actualQ.toFixed(1)} 单位（超过配置有效水平 Q*=${qStar.toFixed(1)}，造成过度生产），因政府财政支出超过了剩余增长而产生 $${dwl.toFixed(1)} 的无谓损失。`;
    } else if (isBindingControl) {
      explanationTextEn += `The binding ${params.priceControlMode === 'ceiling' ? 'Price Ceiling' : 'Price Floor'} set at $${params.controlledPrice} restricts voluntary market transactions to ${actualQ.toFixed(1)} units, producing a ${shortageOrSurplus} of ${controlDiscrepancyAmount.toFixed(1)} units and generating a deadweight loss of $${dwl.toFixed(1)}.`;
      explanationTextZh += `设定在 $${params.controlledPrice} 的有约束力${params.priceControlMode === 'ceiling' ? '价格上限' : '价格下限'}将市场交易量压制在 ${actualQ.toFixed(1)} 单位，引发了 ${controlDiscrepancyAmount.toFixed(1)} 单位的市场${shortageOrSurplus === 'shortage' ? '短缺' : '过剩'}，并造成 $${dwl.toFixed(1)} 的无谓损失。`;
    } else if (explanationTextEn === '') {
      explanationTextEn = `At the competitive equilibrium (P* = $${pStar.toFixed(1)}, Q* = ${qStar.toFixed(1)}), Marginal Benefit equals Marginal Cost. Total economic surplus ($${totalWelfare.toFixed(1)}) is maximized with zero deadweight loss.`;
      explanationTextZh = `在完全竞争均衡点（P* = $${pStar.toFixed(1)}, Q* = ${qStar.toFixed(1)}），边际收益等于边际成本（MB = MC）。社会总剩余（$${totalWelfare.toFixed(1)}）达到最大，无谓损失为零。`;
    }

    const analysisPoints = [
      {
        en: `Elasticities at Equilibrium: Price Elasticity of Demand (PED) = ${ped.toFixed(2)} (${ped > 1 ? 'Elastic' : ped < 1 ? 'Inelastic' : 'Unit Elastic'}), Price Elasticity of Supply (PES) = ${pes.toFixed(2)}.`,
        zh: `均衡点弹性：需求价格弹性（PED）= ${ped.toFixed(2)}（${ped > 1 ? '富有弹性' : ped < 1 ? '缺乏弹性' : '单位弹性'}），供给价格弹性（PES）= ${pes.toFixed(2)}。`
      },
      {
        en: 'Tax/Subsidy Burden: The more inelastic curve bears the larger share of tax burden or captures the larger share of subsidy benefit.',
        zh: '税负与补贴归宿法则：弹性越小（越陡峭/越缺乏弹性）的一方承担越多的税负，或捕获越多的补贴收益。'
      },
      {
        en: 'Simultaneous Shifts Rule: When both curves shift simultaneously, either equilibrium price OR equilibrium quantity is unequivocally determined, while the other variable is indeterminate without knowing the exact magnitudes.',
        zh: '供求双重移动法则：当供求两条曲线同时平移时，均衡价格或均衡数量中必然有一个是确定性变动的，而另一个在不知道具体平移幅度时必然是不确定的（Indeterminate）。'
      }
    ];

    return {
      axes: {
        xLabel: { en: 'Quantity (Q in units)', zh: '数量（Q，单位）' },
        yLabel: { en: 'Price (P in $)', zh: '价格（P，美元）' },
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
      explanation: { en: explanationTextEn, zh: explanationTextZh },
      analysisPoints
    };
  }
};
