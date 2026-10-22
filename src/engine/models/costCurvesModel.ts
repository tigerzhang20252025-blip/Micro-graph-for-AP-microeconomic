import { EconomicModel, GraphCalculationOutput, ScenarioPreset, CurveSpec, KeyPointSpec, ShadedAreaSpec, Point2D } from '../../types/graph';
import { evaluateMC, evaluateAVC, evaluateATC, evaluateAFC } from '../economicMath';

export interface CostCurvesParams {
  fixedCost: number;        // TFC (default 120, range 40 to 240)
  perUnitTax: number;       // $/unit (default 0, range 0 to 15)
  chosenQuantity: number;   // Q (default 24, range 2 to 45)
  showAFC: boolean;
  showAVC: boolean;
  showATC: boolean;
  showMC: boolean;
}

const defaultParams: CostCurvesParams = {
  fixedCost: 120,
  perUnitTax: 0,
  chosenQuantity: 24,
  showAFC: true,
  showAVC: true,
  showATC: true,
  showMC: true
};

const presets: ScenarioPreset[] = [
  {
    id: 'baseline-costs',
    name: {
      en: 'Standard Short-Run Cost Curves',
      zh: '标准短期生产成本曲线族'
    },
    description: {
      en: 'Classic U-shaped curves. MC cuts AVC and ATC at their exact minimum points, with the vertical gap between ATC and AVC equal to AFC.',
      zh: '经典的 U 型成本曲线。MC 严格穿过 AVC 与 ATC 的最低点，且 ATC 与 AVC 之间的垂直距离恒等于 AFC。'
    },
    params: {
      fixedCost: 120,
      perUnitTax: 0,
      chosenQuantity: 24,
      showAFC: true,
      showAVC: true,
      showATC: true,
      showMC: true
    }
  },
  {
    id: 'lump-sum-tax',
    name: {
      en: 'Lump-Sum Tax (Fixed Cost Increase)',
      zh: '一次性定额税（仅增加固定成本 TFC）'
    },
    description: {
      en: 'A lump-sum tax acts as an increase in Fixed Cost. Crucially, ATC and AFC shift upward, but MC and AVC do NOT move at all!',
      zh: '定额税相当于增加固定成本。极其关键的 AP 考点：仅 ATC 与 AFC 向上平移，而 MC 与 AVC 完全保持不变！'
    },
    params: {
      fixedCost: 220,
      perUnitTax: 0,
      chosenQuantity: 24,
      showAFC: true,
      showAVC: true,
      showATC: true,
      showMC: true
    }
  },
  {
    id: 'per-unit-tax',
    name: {
      en: 'Per-Unit Tax (Variable Cost Increase)',
      zh: '从量单位税（增加可变成本 TVC）'
    },
    description: {
      en: 'A per-unit tax increases marginal cost directly. MC, AVC, and ATC all shift upward, while AFC remains completely unchanged.',
      zh: '每单位产品征税直接抬高边际成本。MC、AVC 与 ATC 均垂直向上平移，而 AFC 保持不变。'
    },
    params: {
      fixedCost: 120,
      perUnitTax: 10,
      chosenQuantity: 24,
      showAFC: true,
      showAVC: true,
      showATC: true,
      showMC: true
    }
  }
];

export const costCurvesModel: EconomicModel = {
  id: 'cost-curves-short-run',
  topicId: 'cost-curves-short-run',
  name: {
    en: 'Short-Run Production Costs: MC, ATC, AVC & AFC',
    zh: '短期生产成本：MC、ATC、AVC 与 AFC 曲线族'
  },
  description: {
    en: 'Mathematical and graphical cost model. Proves geometrically why MC intersects ATC and AVC at their minimums, and explores lump-sum vs. per-unit cost shifts.',
    zh: '严谨短期成本数理模型。数理证明 MC 必然穿过 ATC 和 AVC 的最低点，并动态演示定额税与单位税对各成本曲线的差异化影响。'
  },
  defaultParams,
  presets,
  controls: [
    {
      type: 'slider',
      id: 'chosenQuantity',
      label: {
        en: 'Firm Output Level (Q)',
        zh: '企业生产产量（Q）'
      },
      min: 2,
      max: 45,
      step: 1,
      unit: 'units',
      help: {
        en: 'Slide to evaluate per-unit costs at different output levels.',
        zh: '滑动以查看不同产量水平下的单位生产成本。'
      }
    },
    {
      type: 'slider',
      id: 'fixedCost',
      label: {
        en: 'Total Fixed Cost (TFC / Lump-Sum)',
        zh: '总固定成本（TFC / 一次性定额成本）'
      },
      min: 40,
      max: 240,
      step: 10,
      unit: '$',
      help: {
        en: 'Shifts ATC and AFC only. MC and AVC are unaffected by fixed costs.',
        zh: '仅使 ATC 与 AFC 垂直平移，MC 与 AVC 绝不受固定成本变化影响。'
      }
    },
    {
      type: 'slider',
      id: 'perUnitTax',
      label: {
        en: 'Per-Unit Tax / Variable Shift ($/unit)',
        zh: '从量单位税 / 可变成本平移（$/单位）'
      },
      min: 0,
      max: 15,
      step: 1,
      unit: '$',
      help: {
        en: 'Shifts MC, AVC, and ATC upward by the per-unit amount.',
        zh: '使 MC、AVC 与 ATC 同时向上平移该单位税额。'
      }
    },
    {
      type: 'toggle',
      id: 'showMC',
      label: {
        en: 'Show Marginal Cost (MC)',
        zh: '显示边际成本曲线（MC）'
      }
    },
    {
      type: 'toggle',
      id: 'showATC',
      label: {
        en: 'Show Average Total Cost (ATC)',
        zh: '显示平均总成本曲线（ATC）'
      }
    },
    {
      type: 'toggle',
      id: 'showAVC',
      label: {
        en: 'Show Average Variable Cost (AVC)',
        zh: '显示平均可变成本曲线（AVC）'
      }
    },
    {
      type: 'toggle',
      id: 'showAFC',
      label: {
        en: 'Show Average Fixed Cost (AFC)',
        zh: '显示平均固定成本曲线（AFC）'
      }
    }
  ],
  calculate(rawParams: Record<string, any>): GraphCalculationOutput {
    const params: CostCurvesParams = { ...defaultParams, ...rawParams };

    // Standard AP Micro quadratic MC / cubic TC parameters:
    // MC = m0 - m1*Q + m2*Q^2 + perUnitTax
    const costParams = {
      fixedCost: params.fixedCost,
      m0: 42,
      m1: 2.1,
      m2: 0.084,
      perUnitTax: params.perUnitTax
    };

    const q = Math.max(1, params.chosenQuantity);
    const mcVal = evaluateMC(costParams, q);
    const atcVal = evaluateATC(costParams, q);
    const avcVal = evaluateAVC(costParams, q);
    const afcVal = evaluateAFC(costParams, q);

    // Exact Minimum of AVC: where d(AVC)/dQ = 0 => Q_AVC = 3*m1 / (4*m2)
    const qMinAVC = (3 * costParams.m1) / (4 * costParams.m2);
    const minAVC = evaluateAVC(costParams, qMinAVC);

    // Minimum of ATC: numerically solve MC(q) = ATC(q)
    let qMinATC = 20;
    let minATC = 999;
    for (let candidateQ = 5; candidateQ <= 45; candidateQ += 0.1) {
      const atcCandidate = evaluateATC(costParams, candidateQ);
      if (atcCandidate < minATC) {
        minATC = atcCandidate;
        qMinATC = candidateQ;
      }
    }

    // Generate Curve Points
    const xMax = 48;
    const yMax = 85;
    const steps = 60;

    const mcPoints: Point2D[] = [];
    const atcPoints: Point2D[] = [];
    const avcPoints: Point2D[] = [];
    const afcPoints: Point2D[] = [];

    const dq = xMax / steps;
    for (let i = 1; i <= steps; i++) {
      const currentQ = i * dq;
      const mc = evaluateMC(costParams, currentQ);
      const atc = evaluateATC(costParams, currentQ);
      const avc = evaluateAVC(costParams, currentQ);
      const afc = evaluateAFC(costParams, currentQ);

      if (mc >= 0 && mc <= yMax + 5) mcPoints.push({ x: Number(currentQ.toFixed(2)), y: Number(mc.toFixed(2)) });
      if (atc >= 0 && atc <= yMax + 5) atcPoints.push({ x: Number(currentQ.toFixed(2)), y: Number(atc.toFixed(2)) });
      if (avc >= 0 && avc <= yMax + 5) avcPoints.push({ x: Number(currentQ.toFixed(2)), y: Number(avc.toFixed(2)) });
      if (afc >= 0 && afc <= yMax + 5) afcPoints.push({ x: Number(currentQ.toFixed(2)), y: Number(afc.toFixed(2)) });
    }

    const curves: CurveSpec[] = [];

    if (params.showMC) {
      curves.push({
        id: 'mc',
        name: { en: 'Marginal Cost (MC)', zh: '边际成本（MC）' },
        shortLabel: 'MC',
        points: mcPoints,
        color: '#dc2626', // Red
        strokeWidth: 3.5,
        strokeDasharray: 'none',
        visible: true,
        endLabelPosition: 'end'
      });
    }

    if (params.showATC) {
      curves.push({
        id: 'atc',
        name: { en: 'Average Total Cost (ATC)', zh: '平均总成本（ATC）' },
        shortLabel: 'ATC',
        points: atcPoints,
        color: '#2563eb', // Blue
        strokeWidth: 3,
        strokeDasharray: 'none',
        visible: true,
        endLabelPosition: 'end'
      });
    }

    if (params.showAVC) {
      curves.push({
        id: 'avc',
        name: { en: 'Average Variable Cost (AVC)', zh: '平均可变成本（AVC）' },
        shortLabel: 'AVC',
        points: avcPoints,
        color: '#d97706', // Amber
        strokeWidth: 2.5,
        strokeDasharray: '5,3',
        visible: true,
        endLabelPosition: 'end'
      });
    }

    if (params.showAFC) {
      curves.push({
        id: 'afc',
        name: { en: 'Average Fixed Cost (AFC)', zh: '平均固定成本（AFC）' },
        shortLabel: 'AFC',
        points: afcPoints,
        color: '#64748b', // Slate gray
        strokeWidth: 2,
        strokeDasharray: '2,2',
        visible: true,
        endLabelPosition: 'end'
      });
    }

    // Key points (Minimum ATC, Minimum AVC, and Current output Q)
    const points: KeyPointSpec[] = [
      {
        id: 'minATCPoint',
        label: { en: 'Minimum ATC (Productive Efficiency / MES)', zh: 'ATC 最低点（生产有效规模 MES）' },
        shortLabel: 'Min ATC',
        x: Number(qMinATC.toFixed(1)),
        y: Number(minATC.toFixed(1)),
        color: '#2563eb',
        showDropLines: true,
        xLabel: `Q=${qMinATC.toFixed(1)}`,
        yLabel: `$${minATC.toFixed(1)}`
      },
      {
        id: 'minAVCPoint',
        label: { en: 'Minimum AVC (Short-Run Shutdown Price)', zh: 'AVC 最低点（短期停产临界价格）' },
        shortLabel: 'Shutdown',
        x: Number(qMinAVC.toFixed(1)),
        y: Number(minAVC.toFixed(1)),
        color: '#d97706',
        showDropLines: true,
        xLabel: `Q=${qMinAVC.toFixed(1)}`,
        yLabel: `$${minAVC.toFixed(1)}`
      },
      {
        id: 'choicePoint',
        label: { en: `Current Output Q = ${q}`, zh: `当前产量 Q = ${q}` },
        shortLabel: `Q=${q}`,
        x: q,
        y: Number(atcVal.toFixed(1)),
        color: '#059669',
        showDropLines: true,
        xLabel: `Q=${q}`,
        yLabel: `ATC=$${atcVal.toFixed(1)}`
      }
    ];

    // Shaded Area between ATC and AVC representing Total Fixed Cost: (ATC - AVC) * Q = TFC
    const shadedAreas: ShadedAreaSpec[] = [
      {
        id: 'tfcArea',
        label: { en: `Total Fixed Cost Box: AFC × Q = $${params.fixedCost}`, zh: `总固定成本矩形面积：AFC × Q = $${params.fixedCost}` },
        points: [
          { x: 0, y: avcVal },
          { x: q, y: avcVal },
          { x: q, y: atcVal },
          { x: 0, y: atcVal }
        ],
        fill: '#8b5cf6',
        opacity: 0.2,
        pattern: 'dots',
        value: params.fixedCost,
        valuePrefix: '$',
        visible: true
      }
    ];

    // Custom Interactive Cost Schedule Table
    const customTable = {
      title: { en: 'Discrete Production & Cost Schedule (CED Unit 3.2)', zh: '离散产出与各类成本测算对照表（CED 第三单元 3.2）' },
      subtitle: { en: 'Formulas: TC = FC + VC, ATC = TC/Q, MC = ΔTC/ΔQ', zh: '核心公式：TC = FC + VC，ATC = TC/Q，MC = ΔTC/ΔQ' },
      headers: [
        { en: 'Quantity (Q)', zh: '产出量 (Q)' },
        { en: 'Fixed Cost (FC)', zh: '固定成本 (FC)' },
        { en: 'Variable Cost (VC)', zh: '可变成本 (VC)' },
        { en: 'Total Cost (TC)', zh: '总成本 (TC)' },
        { en: 'AFC ($/unit)', zh: '平均固定 (AFC)' },
        { en: 'AVC ($/unit)', zh: '平均可变 (AVC)' },
        { en: 'ATC ($/unit)', zh: '平均总成本 (ATC)' },
        { en: 'MC ($/unit)', zh: '边际成本 (MC)' }
      ],
      rows: [5, 10, 15, Math.round(qMinAVC), 20, Math.round(qMinATC), 30, 40].map((sampleQ) => {
        const sampleAVC = evaluateAVC(costParams, sampleQ);
        const sampleATC = evaluateATC(costParams, sampleQ);
        const sampleAFC = evaluateAFC(costParams, sampleQ);
        const sampleMC = evaluateMC(costParams, sampleQ);
        const sampleVC = sampleAVC * sampleQ;
        const sampleTC = sampleATC * sampleQ;

        return {
          id: `q-row-${sampleQ}`,
          label: { en: `${sampleQ} units`, zh: `${sampleQ} 单位` },
          values: [
            `$${params.fixedCost}`,
            `$${sampleVC.toFixed(0)}`,
            `$${sampleTC.toFixed(0)}`,
            `$${sampleAFC.toFixed(2)}`,
            `$${sampleAVC.toFixed(2)}`,
            `$${sampleATC.toFixed(2)}`,
            `$${sampleMC.toFixed(2)}`
          ],
          highlight: sampleQ === q
        };
      })
    };

    const results = [
      {
        id: 'mcResult',
        label: { en: 'Marginal Cost (MC at Q)', zh: '当前边际成本（MC）' },
        value: `$${mcVal.toFixed(2)}`,
        color: '#dc2626',
        formula: 'ΔTC / ΔQ'
      },
      {
        id: 'atcResult',
        label: { en: 'Average Total Cost (ATC at Q)', zh: '当前平均总成本（ATC）' },
        value: `$${atcVal.toFixed(2)}`,
        color: '#2563eb',
        formula: 'TC / Q = AFC + AVC'
      },
      {
        id: 'avcResult',
        label: { en: 'Average Variable Cost (AVC at Q)', zh: '当前平均可变成本（AVC）' },
        value: `$${avcVal.toFixed(2)}`,
        color: '#d97706',
        formula: 'TVC / Q'
      },
      {
        id: 'afcResult',
        label: { en: 'Average Fixed Cost (AFC at Q)', zh: '当前平均固定成本（AFC）' },
        value: `$${afcVal.toFixed(2)}`,
        color: '#64748b',
        formula: 'TFC / Q'
      },
      {
        id: 'minATCResult',
        label: { en: 'Min ATC (Productive Efficiency Price)', zh: '最低平均总成本（生产效率价格）' },
        value: `$${minATC.toFixed(2)} (at Q=${qMinATC.toFixed(0)})`,
        color: '#059669'
      },
      {
        id: 'shutdownResult',
        label: { en: 'Short-Run Shutdown Price (Min AVC)', zh: '短期停产临界价格（Min AVC）' },
        value: `$${minAVC.toFixed(2)} (at Q=${qMinAVC.toFixed(0)})`,
        color: '#d97706'
      }
    ];

    const explanation = {
      en: `At Q = ${q} units, Average Total Cost is $${atcVal.toFixed(2)} (composed of $${afcVal.toFixed(2)} AFC + $${avcVal.toFixed(2)} AVC), while Marginal Cost is $${mcVal.toFixed(2)}. Geometrically, because MC is ${mcVal < atcVal ? 'BELOW ATC, it pulls the average DOWN' : mcVal > atcVal ? 'ABOVE ATC, it pulls the average UP' : 'EQUAL to ATC, ATC is at its exact mathematical minimum'}. The vertical distance between ATC and AVC continuously shrinks as Q increases because AFC = TFC / Q approaches zero.`,
      zh: `在产量 Q = ${q} 单位时，平均总成本为 $${atcVal.toFixed(2)}（由 $${afcVal.toFixed(2)} 的固定成本 AFC 与 $${avcVal.toFixed(2)} 的可变成本 AVC 组成），边际成本为 $${mcVal.toFixed(2)}。在几何逻辑上：当 MC ${mcVal < atcVal ? '低于 ATC 时，平均值必然被向下拖拽拉低' : mcVal > atcVal ? '高于 ATC 时，平均值必然被向上推高' : '等于 ATC 时，ATC 恰好处在其绝对数学最低点'}。随着产量 Q 持续扩大，ATC 与 AVC 之间的垂直差距不断收窄，因为 AFC = TFC / Q 随着分母变大而趋近于零。`
    };

    const analysisPoints = [
      {
        en: 'MC Cuts Minimum Rule: MC cuts both AVC and ATC at their lowest points. If marginal cost is below average, average is falling; if marginal cost is above average, average is rising.',
        zh: '交于最低点法则：MC 穿过 AVC 与 ATC 各自的最低点。当边际成本小于平均成本时，平均成本必然递减；当边际成本大于平均成本时，平均成本必然递增。'
      },
      {
        en: 'Lump-Sum vs Per-Unit Taxes: A lump-sum tax alters ONLY fixed cost, shifting ATC and AFC upward while leaving MC and AVC untouched! A per-unit tax raises variable costs, shifting MC, AVC, and ATC upward.',
        zh: '定额税 vs 单位税核心考点：一次性定额税仅改变固定成本，导致 ATC 和 AFC 向上平移，而 MC 与 AVC 绝不改变！从量单位税改变可变成本，导致 MC、AVC 和 ATC 全部向上平移。'
      },
      {
        en: 'Shutdown Condition: In the short run, a firm continues producing if Price covers AVC (P ≥ min AVC), because it can cover all variable costs and contribute towards fixed costs.',
        zh: '短期停产法则：只要市场价格高于或等于最低平均可变成本（P ≥ min AVC），亏损企业就应当继续生产，因为其收益在弥补全部可变成本后，还能弥补部分固定成本。'
      }
    ];

    return {
      axes: {
        xLabel: { en: 'Output / Quantity (Q in units)', zh: '产量 / 产出（Q，单位）' },
        yLabel: { en: 'Costs ($ per unit)', zh: '各类单位成本（美元/单位）' },
        xMin: 0,
        xMax,
        yMin: 0,
        yMax,
        xStep: 5,
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
