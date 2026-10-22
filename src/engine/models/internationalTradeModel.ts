import { EconomicModel, GraphCalculationOutput, ScenarioPreset, CurveSpec, KeyPointSpec, ShadedAreaSpec } from '../../types/graph';
import { generateLinearPoints } from '../economicMath';

export interface InternationalTradeParams {
  worldPrice: number;        // 15 to 45 (default 30)
  tariffPerUnit: number;     // 0 to 25 (default 10)
  quotaLimit?: number;
  tradePolicy: 'free_trade' | 'tariff' | 'autarky';
}

const defaultParams: InternationalTradeParams = {
  worldPrice: 30,
  tariffPerUnit: 12,
  tradePolicy: 'tariff'
};

const presets: ScenarioPreset[] = [
  {
    id: 'free-trade',
    name: {
      en: 'Free Trade (World Price Pw, Consumer Surplus Maximized)',
      zh: '自由贸易基准（世界价格 Pw，消费者剩余极大化）'
    },
    description: {
      en: 'Domestic price drops to the world price (Pw). Domestic production contracts, imports surge, and total surplus expands with zero deadweight loss.',
      zh: '国内价格直接跌至世界价格（Pw）。国内产量缩减、进口激增，社会总剩余显著扩张且无任何无谓损失。'
    },
    params: {
      worldPrice: 30,
      tariffPerUnit: 0,
      tradePolicy: 'free_trade'
    }
  },
  {
    id: 'import-tariff',
    name: {
      en: 'Import Tariff (Two Deadweight Loss Triangles)',
      zh: '征收进口关税（两个死重损失三角形）'
    },
    description: {
      en: 'A per-unit tariff raises domestic price to Pw + Tariff. Domestic production expands, imports drop, and tariff revenue is collected, but two DWL triangles are created.',
      zh: '征收关税将国内价格推高至 Pw + 关税。国内高成本生产扩张、进口萎缩，政府获取关税财政收入，但产生生产扭曲与消费扭曲双重无谓损失。'
    },
    params: {
      worldPrice: 30,
      tariffPerUnit: 14,
      tradePolicy: 'tariff'
    }
  },
  {
    id: 'autarky-no-trade',
    name: {
      en: 'Autarky (Closed Domestic Economy)',
      zh: '封闭经济均衡（无国际贸易）'
    },
    description: {
      en: 'No international trade permitted. The market clears strictly where domestic demand equals domestic supply at a higher price (P_autarky).',
      zh: '禁止国际贸易。国内需求与国内供给在较高价格（P_autarky）处出清，丧失国际低价贸易带来的巨大福利。'
    },
    params: {
      worldPrice: 30,
      tariffPerUnit: 30, // Prohibitive tariff
      tradePolicy: 'autarky'
    }
  }
];

export const internationalTradeModel: EconomicModel = {
  id: 'international-trade-tariffs',
  topicId: 'international-trade-tariffs',
  name: {
    en: 'International Trade, World Price & Tariffs',
    zh: '国际贸易、世界价格与关税福利分析'
  },
  description: {
    en: 'Analyzes the effects of world price, free trade imports, domestic surplus redistribution, and the two deadweight loss triangles caused by protective tariffs.',
    zh: '深入分析世界价格、自由贸易进口对国内供求与福利分配的重塑，以及保护性关税引发的双重无谓损失三角形。'
  },
  defaultParams,
  presets,
  controls: [
    {
      type: 'slider',
      id: 'tariffPerUnit',
      label: {
        en: 'Import Tariff ($/unit)',
        zh: '进口从量关税（$/单位）'
      },
      min: 0,
      max: 25,
      step: 1,
      unit: '$',
      help: {
        en: 'Raises the domestic price above the world price: P_domestic = Pw + Tariff.',
        zh: '使国内售价高于世界价格：P_domestic = Pw + 关税。'
      }
    },
    {
      type: 'slider',
      id: 'worldPrice',
      label: {
        en: 'World Price (Pw in $)',
        zh: '世界市场价格（Pw，美元）'
      },
      min: 15,
      max: 45,
      step: 1,
      unit: '$',
      help: {
        en: 'The perfectly elastic international supply price.',
        zh: '国际市场上完全富有弹性（水平）的供货价格。'
      }
    }
  ],
  calculate(rawParams: Record<string, any>): GraphCalculationOutput {
    const params: InternationalTradeParams = { ...defaultParams, ...rawParams };

    // Domestic Linear Curves:
    // Demand: P = 90 - 0.8 * Q => Q = (90 - P) / 0.8
    // Supply: P = 10 + 0.8 * Q => Q = (P - 10) / 0.8
    const a = 90;
    const b = 0.8;
    const c = 10;
    const d = 0.8;

    // Autarky equilibrium
    const qAutarky = (a - c) / (b + d); // 50
    const pAutarky = a - b * qAutarky;   // 50

    const pw = Math.min(pAutarky, Math.max(10, params.worldPrice));
    const effectiveTariff = params.tradePolicy === 'autarky' ? (pAutarky - pw) : Math.min(pAutarky - pw, Math.max(0, params.tariffPerUnit));
    const domesticPrice = pw + effectiveTariff;

    // Domestic quantities at domesticPrice:
    const qSuppliedDomestic = Math.max(0, (domesticPrice - c) / d);
    const qDemandedDomestic = Math.max(0, (a - domesticPrice) / b);
    const imports = Math.max(0, qDemandedDomestic - qSuppliedDomestic);

    // Domestic quantities at free trade pw:
    const qSuppliedFree = Math.max(0, (pw - c) / d);
    const qDemandedFree = Math.max(0, (a - pw) / b);
    const freeTradeImports = Math.max(0, qDemandedFree - qSuppliedFree);

    // Welfare Calculations:
    // CS = 1/2 * (a - domesticPrice) * qDemandedDomestic
    const cs = 0.5 * (a - domesticPrice) * qDemandedDomestic;
    // PS = 1/2 * (domesticPrice - c) * qSuppliedDomestic
    const ps = 0.5 * (domesticPrice - c) * qSuppliedDomestic;
    // Tariff Revenue = effectiveTariff * imports
    const tariffRevenue = effectiveTariff * imports;

    // Two DWL Triangles:
    // DWL 1 (Production Distortion / Inefficient Domestic Production):
    // 1/2 * Tariff * (qSuppliedDomestic - qSuppliedFree)
    const dwlProduction = 0.5 * effectiveTariff * Math.max(0, qSuppliedDomestic - qSuppliedFree);
    // DWL 2 (Consumption Distortion / Lost Consumer Surplus):
    // 1/2 * Tariff * (qDemandedFree - qDemandedDomestic)
    const dwlConsumption = 0.5 * effectiveTariff * Math.max(0, qDemandedFree - qDemandedDomestic);
    const totalDWL = dwlProduction + dwlConsumption;

    // Curves
    const xMax = 120;
    const yMax = 105;

    const demandPts = generateLinearPoints({ intercept: a, slope: -b }, 0, xMax, 25, 0, yMax);
    const supplyPts = generateLinearPoints({ intercept: c, slope: d }, 0, xMax, 25, 0, yMax);

    const curves: CurveSpec[] = [
      {
        id: 'domesticDemand',
        name: { en: 'Domestic Demand (D_dom)', zh: '国内需求曲线（D_dom）' },
        shortLabel: 'D_dom',
        points: demandPts,
        color: '#2563eb', // Blue
        strokeWidth: 3,
        strokeDasharray: 'none',
        visible: true,
        equation: `P = ${a} - ${b}Q`,
        endLabelPosition: 'end'
      },
      {
        id: 'domesticSupply',
        name: { en: 'Domestic Supply (S_dom)', zh: '国内供给曲线（S_dom）' },
        shortLabel: 'S_dom',
        points: supplyPts,
        color: '#dc2626', // Red
        strokeWidth: 3,
        strokeDasharray: 'none',
        visible: true,
        equation: `P = ${c} + ${d}Q`,
        endLabelPosition: 'end'
      },
      // World Price horizontal line
      {
        id: 'worldPriceLine',
        name: { en: `World Price (Pw = $${pw.toFixed(0)})`, zh: `世界价格水平线（Pw = $${pw.toFixed(0)}）` },
        shortLabel: 'Pw',
        points: [{ x: 0, y: pw }, { x: xMax, y: pw }],
        color: '#059669', // Emerald
        strokeWidth: 2,
        strokeDasharray: 'none',
        visible: true,
        equation: `Pw = $${pw.toFixed(0)}`,
        endLabelPosition: 'end'
      }
    ];

    if (effectiveTariff > 0 && domesticPrice < pAutarky) {
      curves.push({
        id: 'tariffPriceLine',
        name: { en: `Domestic Price with Tariff (Pw + T = $${domesticPrice.toFixed(0)})`, zh: `含关税国内价格线（Pw + T = $${domesticPrice.toFixed(0)}）` },
        shortLabel: 'Pw + T',
        points: [{ x: 0, y: domesticPrice }, { x: xMax, y: domesticPrice }],
        color: '#7c3aed', // Purple dashed
        strokeWidth: 2.5,
        strokeDasharray: '5,3',
        visible: true,
        equation: `P_tariff = $${domesticPrice.toFixed(0)}`,
        endLabelPosition: 'end'
      });
    }

    // Key points
    const points: KeyPointSpec[] = [
      {
        id: 'qSuppliedPt',
        label: { en: `Domestic Supply ($${domesticPrice.toFixed(0)}, ${qSuppliedDomestic.toFixed(0)}u)`, zh: `国内供给量（$${domesticPrice.toFixed(0)}，${qSuppliedDomestic.toFixed(0)}单位）` },
        shortLabel: `Qs=${qSuppliedDomestic.toFixed(0)}`,
        x: Number(qSuppliedDomestic.toFixed(1)),
        y: Number(domesticPrice.toFixed(1)),
        color: '#dc2626',
        showDropLines: true,
        xLabel: `Qs=${qSuppliedDomestic.toFixed(0)}`,
        yLabel: `P=$${domesticPrice.toFixed(0)}`
      },
      {
        id: 'qDemandedPt',
        label: { en: `Domestic Demand ($${domesticPrice.toFixed(0)}, ${qDemandedDomestic.toFixed(0)}u)`, zh: `国内需求量（$${domesticPrice.toFixed(0)}，${qDemandedDomestic.toFixed(0)}单位）` },
        shortLabel: `Qd=${qDemandedDomestic.toFixed(0)}`,
        x: Number(qDemandedDomestic.toFixed(1)),
        y: Number(domesticPrice.toFixed(1)),
        color: '#2563eb',
        showDropLines: true,
        xLabel: `Qd=${qDemandedDomestic.toFixed(0)}`,
        yLabel: ''
      }
    ];

    // Shaded Welfare Areas
    const shadedAreas: ShadedAreaSpec[] = [
      // Consumer Surplus
      {
        id: 'csArea',
        label: { en: `Consumer Surplus ($${cs.toFixed(1)})`, zh: `消费者剩余（$${cs.toFixed(1)}）` },
        points: [
          { x: 0, y: a },
          { x: qDemandedDomestic, y: domesticPrice },
          { x: 0, y: domesticPrice }
        ],
        fill: '#3b82f6',
        opacity: 0.22,
        pattern: 'diagonal-right',
        value: Number(cs.toFixed(1)),
        valuePrefix: '$',
        visible: true
      },
      // Producer Surplus
      {
        id: 'psArea',
        label: { en: `Domestic Producer Surplus ($${ps.toFixed(1)})`, zh: `国内生产者剩余（$${ps.toFixed(1)}）` },
        points: [
          { x: 0, y: c },
          { x: qSuppliedDomestic, y: domesticPrice },
          { x: 0, y: domesticPrice }
        ],
        fill: '#f59e0b',
        opacity: 0.25,
        pattern: 'diagonal-left',
        value: Number(ps.toFixed(1)),
        valuePrefix: '$',
        visible: true
      }
    ];

    if (effectiveTariff > 0 && imports > 0) {
      // Tariff Revenue Box: from qSuppliedDomestic to qDemandedDomestic between pw and domesticPrice
      shadedAreas.push({
        id: 'tariffRevArea',
        label: { en: `Government Tariff Revenue ($${tariffRevenue.toFixed(1)})`, zh: `政府关税税收收入（$${tariffRevenue.toFixed(1)}）` },
        points: [
          { x: qSuppliedDomestic, y: pw },
          { x: qDemandedDomestic, y: pw },
          { x: qDemandedDomestic, y: domesticPrice },
          { x: qSuppliedDomestic, y: domesticPrice }
        ],
        fill: '#8b5cf6',
        opacity: 0.35,
        pattern: 'dots',
        value: Number(tariffRevenue.toFixed(1)),
        valuePrefix: '$',
        visible: true
      });

      // DWL 1: Production Inefficiency Triangle
      if (dwlProduction > 0.5) {
        shadedAreas.push({
          id: 'dwlProdArea',
          label: { en: `Production Distortion DWL: $${dwlProduction.toFixed(1)}`, zh: `生产扭曲无谓损失：$${dwlProduction.toFixed(1)}` },
          points: [
            { x: qSuppliedFree, y: pw },
            { x: qSuppliedDomestic, y: pw },
            { x: qSuppliedDomestic, y: domesticPrice }
          ],
          fill: '#ef4444',
          opacity: 0.4,
          pattern: 'cross',
          value: Number(dwlProduction.toFixed(1)),
          valuePrefix: '$',
          visible: true
        });
      }

      // DWL 2: Consumption Inefficiency Triangle
      if (dwlConsumption > 0.5) {
        shadedAreas.push({
          id: 'dwlConsArea',
          label: { en: `Consumption Distortion DWL: $${dwlConsumption.toFixed(1)}`, zh: `消费扭曲无谓损失：$${dwlConsumption.toFixed(1)}` },
          points: [
            { x: qDemandedDomestic, y: pw },
            { x: qDemandedFree, y: pw },
            { x: qDemandedDomestic, y: domesticPrice }
          ],
          fill: '#ef4444',
          opacity: 0.4,
          pattern: 'cross',
          value: Number(dwlConsumption.toFixed(1)),
          valuePrefix: '$',
          visible: true
        });
      }
    }

    // Custom Interactive Table
    const customTable = {
      title: { en: 'Trade Policy Welfare Breakdown Table (CED Unit 2.9)', zh: '国际贸易政策社会福利对比表（CED 第二单元 2.9）' },
      subtitle: { en: 'Autarky vs. Free Trade vs. Tariff Distortion', zh: '封闭经济 vs. 自由贸易 vs. 关税福利扭曲' },
      headers: [
        { en: 'Policy Regime', zh: '贸易政策机制' },
        { en: 'Domestic Price & Quantity', zh: '国内售价与供求量' },
        { en: 'Imports Volume', zh: '进口量' },
        { en: 'Tariff Revenue', zh: '政府关税收入' },
        { en: 'Net Welfare Deadweight Loss', zh: '社会净无谓损失（DWL）' }
      ],
      rows: [
        {
          id: 'row-free',
          label: { en: 'Free International Trade', zh: '自由国际贸易' },
          values: [
            `P = $${pw.toFixed(0)}, Q_dom = ${qSuppliedFree.toFixed(0)}, Q_dem = ${qDemandedFree.toFixed(0)}`,
            `${freeTradeImports.toFixed(0)} units`,
            '$0 (Zero Tariff)',
            'DWL = $0 (Maximum Total Surplus)'
          ],
          highlight: effectiveTariff === 0
        },
        {
          id: 'row-tariff',
          label: { en: `Import Tariff ($${effectiveTariff.toFixed(0)}/unit)`, zh: `征收从量关税（$${effectiveTariff.toFixed(0)}/单位）` },
          values: [
            `P = $${domesticPrice.toFixed(0)}, Q_dom = ${qSuppliedDomestic.toFixed(0)}, Q_dem = ${qDemandedDomestic.toFixed(0)}`,
            `${imports.toFixed(0)} units (Contracted)`,
            `+$${tariffRevenue.toFixed(1)}`,
            `DWL = $${totalDWL.toFixed(1)} (Two Triangles)`
          ],
          highlight: effectiveTariff > 0 && domesticPrice < pAutarky
        },
        {
          id: 'row-autarky',
          label: { en: 'Closed Economy (Autarky)', zh: '封闭经济（无贸易）' },
          values: [
            `P = $${pAutarky.toFixed(0)}, Q = ${qAutarky.toFixed(0)} units`,
            '0 units (Self-Sufficient)',
            '$0',
            'Severe loss of gains from specialization'
          ],
          highlight: domesticPrice >= pAutarky
        }
      ]
    };

    const results = [
      {
        id: 'domPrice',
        label: { en: 'Domestic Market Price', zh: '国内市场售价' },
        value: `$${domesticPrice.toFixed(2)}`,
        color: '#7c3aed'
      },
      {
        id: 'importsVal',
        label: { en: 'Imports Volume (Qd - Qs)', zh: '进口量（Qd - Qs）' },
        value: `${imports.toFixed(1)} units`,
        color: '#2563eb',
        formula: 'Qd - Qs'
      },
      {
        id: 'tariffRev',
        label: { en: 'Government Tariff Revenue', zh: '政府关税财政收入' },
        value: `$${tariffRevenue.toFixed(2)}`,
        color: '#8b5cf6',
        formula: 'Tariff × Imports'
      },
      {
        id: 'dwlTotal',
        label: { en: 'Total Deadweight Loss (Two Triangles)', zh: '关税总无谓损失（双三角形）' },
        value: `$${totalDWL.toFixed(2)}`,
        color: totalDWL > 0.5 ? '#dc2626' : '#059669',
        formula: 'DWL_prod + DWL_cons'
      },
      {
        id: 'csResult',
        label: { en: 'Consumer Surplus (CS)', zh: '消费者剩余（CS）' },
        value: `$${cs.toFixed(2)}`,
        color: '#2563eb'
      },
      {
        id: 'psResult',
        label: { en: 'Domestic Producer Surplus (PS)', zh: '国内生产者剩余（PS）' },
        value: `$${ps.toFixed(2)}`,
        color: '#d97706'
      }
    ];

    const explanation = {
      en: effectiveTariff === 0
        ? `Under Free Trade at the world price (Pw = $${pw.toFixed(0)}), domestic consumers buy ${qDemandedFree.toFixed(0)} units while domestic producers supply ${qSuppliedFree.toFixed(0)} units, with the gap of ${freeTradeImports.toFixed(0)} units filled by imports. Total surplus is maximized with zero deadweight loss.`
        : domesticPrice >= pAutarky
        ? `The tariff is prohibitive (greater than or equal to $${(pAutarky - pw).toFixed(0)}), completely eliminating imports and reverting the market to closed autarky equilibrium (P* = $${pAutarky.toFixed(0)}, Q* = ${qAutarky.toFixed(0)}).`
        : `A tariff of $${effectiveTariff.toFixed(0)} raises the domestic price to $${domesticPrice.toFixed(0)}. Domestic production expands from ${qSuppliedFree.toFixed(0)} to ${qSuppliedDomestic.toFixed(0)} units, domestic demand shrinks from ${qDemandedFree.toFixed(0)} to ${qDemandedDomestic.toFixed(0)} units, and imports contract to ${imports.toFixed(0)} units. While the government collects $${tariffRevenue.toFixed(1)} in revenue, society suffers $${totalDWL.toFixed(1)} in deadweight loss from production and consumption distortions (the classic two AP DWL triangles).`,
      zh: effectiveTariff === 0
        ? `在世界价格（Pw = $${pw.toFixed(0)}）的自由贸易下，国内消费者购买 ${qDemandedFree.toFixed(0)} 单位，国内生产者仅供应 ${qSuppliedFree.toFixed(0)} 单位，其余 ${freeTradeImports.toFixed(0)} 单位全部由低价进口补齐。社会总剩余达到最大，无谓损失为零。`
        : domesticPrice >= pAutarky
        ? `该关税具有“禁止性”（税额大于或等于国内自给差价 $${(pAutarky - pw).toFixed(0)}），彻底消灭了全部进口，使市场被迫退回封闭经济均衡点（P* = $${pAutarky.toFixed(0)}, Q* = ${qAutarky.toFixed(0)}）。`
        : `征收每单位 $${effectiveTariff.toFixed(0)} 的进口关税使国内售价升至 $${domesticPrice.toFixed(0)}。国内生产从 ${qSuppliedFree.toFixed(0)} 扩张至 ${qSuppliedDomestic.toFixed(0)} 单位，国内需求从 ${qDemandedFree.toFixed(0)} 萎缩至 ${qDemandedDomestic.toFixed(0)} 单位，进口量被压缩至 ${imports.toFixed(0)} 单位。虽然政府获得了 $${tariffRevenue.toFixed(1)} 的关税税收，但社会蒙受了 $${totalDWL.toFixed(1)} 的双重无谓损失（生产扭曲与消费扭曲两个经典的 AP 考试死重损失三角形）。`
    };

    const analysisPoints = [
      {
        en: 'Two DWL Triangles: Tariff DWL consists of (1) Production distortion (inefficient domestic producers producing at costs above Pw) and (2) Consumption distortion (consumers priced out of purchases).',
        zh: '双重无谓损失三角形：关税造成的死重损失由两部分构成：（1）生产扭曲（国内低效厂商以高于世界价格的成本生产）；（2）消费扭曲（国内消费者因涨价而被迫减少消费）。'
      },
      {
        en: 'Tariff vs Quota Equivalence: An import quota that limits imports to the exact same quantity achieves the same price and domestic production, but the quota rent goes to quota holders instead of government revenue (unless auctioned).',
        zh: '关税 vs 配额等价性：将进口量限制在同等数量的进口配额会产生相同的价格与产量，但矩形收入变成了配额持有者的“配额租金”，而非政府财政收入（除非公开拍卖配额）。'
      },
      {
        en: 'Winners & Losers: Domestic producers WIN (PS increases), Government WINS (tariff revenue), but Domestic Consumers LOSE substantially more than the combined gains of producers and government!',
        zh: '胜者与败者：国内生产商受益（生产者剩余增加），政府受益（获得税收），但国内消费者的福利损失显著大于生产商和政府收益之和！'
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
      customTable,
      explanation,
      analysisPoints
    };
  }
};
