import { EconomicModel, GraphCalculationOutput, ScenarioPreset, CurveSpec, KeyPointSpec, ShadedAreaSpec, Point2D } from '../../types/graph';

export interface LRATCParams {
  outputQ: number;          // Firm current output Q (10 to 120, default 45)
  showSRATC: boolean;       // Show short-run plant size curves
  showScalePhases: boolean; // Show Economies, Constant, Diseconomies zones
  mesQuantity: number;      // Minimum Efficient Scale Q (default 40)
  disQuantity: number;      // Start of Diseconomies of scale Q (default 75)
}

const defaultParams: LRATCParams = {
  outputQ: 45,
  showSRATC: true,
  showScalePhases: true,
  mesQuantity: 40,
  disQuantity: 75
};

const presets: ScenarioPreset[] = [
  {
    id: 'economies-of-scale-phase',
    name: {
      en: 'Economies of Scale (Increasing Returns to Scale)',
      zh: '规模经济阶段（规模报酬递增，Q < MES）'
    },
    description: {
      en: 'As the firm doubles all inputs, output more than doubles. Long-Run Average Total Cost (LRATC) falls as plant size expands, driven by labor specialization and bulk purchasing.',
      zh: '当所有要素投入翻倍时，产出增长超过一倍。随着厂房规模扩大，受劳动专业化分工和批量采购优势驱动，长期平均总成本（LRATC）持续下降。'
    },
    params: {
      outputQ: 25,
      showSRATC: true,
      showScalePhases: true,
      mesQuantity: 40,
      disQuantity: 75
    }
  },
  {
    id: 'constant-returns-phase',
    name: {
      en: 'Constant Returns to Scale & MES (Minimum Efficient Scale)',
      zh: '规模报酬不变阶段与最低有效规模（MES）'
    },
    description: {
      en: 'LRATC reaches its minimum and stays constant across a range of output. Minimum Efficient Scale (MES) is the lowest level of output at which LRATC is minimized (Q = 40).',
      zh: 'LRATC 达到最低点并在平坦区间保持稳定。最低有效规模（MES）是使长期平均总成本降至最低水平的最小产出量（Q = 40）。'
    },
    params: {
      outputQ: 55,
      showSRATC: true,
      showScalePhases: true,
      mesQuantity: 40,
      disQuantity: 75
    }
  },
  {
    id: 'diseconomies-of-scale-phase',
    name: {
      en: 'Diseconomies of Scale (Decreasing Returns to Scale)',
      zh: '规模不经济阶段（规模报酬递减，Q > 75）'
    },
    description: {
      en: 'As the firm grows excessively large, managerial coordination failures, communication bottlenecks, and bureaucracy cause LRATC to rise.',
      zh: '当企业过度庞大时，管理协调失灵、信息沟通瓶颈与官僚主义使长期平均总成本（LRATC）不降反升。'
    },
    params: {
      outputQ: 95,
      showSRATC: true,
      showScalePhases: true,
      mesQuantity: 40,
      disQuantity: 75
    }
  }
];

export const lratcModel: EconomicModel = {
  id: 'lratc-economies-of-scale',
  topicId: 'lratc-economies-of-scale',
  name: {
    en: 'Long-Run Costs: LRATC, Economies of Scale & MES',
    zh: '长期生产成本：LRATC 曲线、规模经济与最低有效规模'
  },
  description: {
    en: 'Models the Long-Run Average Total Cost (LRATC) envelope curve. Illustrates Economies of Scale, Constant Returns to Scale, Diseconomies of Scale, Minimum Efficient Scale (MES), and tangent Short-Run ATC curves.',
    zh: '构建长期平均总成本（LRATC）包络线模型。生动呈现规模经济、规模报酬不变、规模不经济三大区间、最低有效规模（MES）以及与其相切的多个短期 ATC 曲线。'
  },
  defaultParams,
  presets,
  controls: [
    {
      type: 'slider',
      id: 'outputQ',
      label: {
        en: 'Firm Scale / Output (Q)',
        zh: '企业生产规模 / 产量（Q）'
      },
      min: 10,
      max: 110,
      step: 5,
      unit: 'units',
      help: {
        en: 'Move across output levels to see how per-unit long-run costs evolve.',
        zh: '调整产量以观察长期单位成本在不同规模下的变化趋势。'
      }
    },
    {
      type: 'slider',
      id: 'mesQuantity',
      label: {
        en: 'Minimum Efficient Scale (MES)',
        zh: '最低有效规模（MES）'
      },
      min: 25,
      max: 55,
      step: 5,
      unit: 'units',
      help: {
        en: 'The lowest output level where the firm achieves minimum LRATC.',
        zh: '企业实现长期平均总成本最低所需的最小产出水平。'
      }
    },
    {
      type: 'toggle',
      id: 'showSRATC',
      label: {
        en: 'Show Short-Run ATC Curves (Plant Sizes)',
        zh: '显示各厂房规模的短期 ATC 曲线（SRATC）'
      }
    },
    {
      type: 'toggle',
      id: 'showScalePhases',
      label: {
        en: 'Shade Scale Phases (Economies, Constant, Diseconomies)',
        zh: '彩色阴影标注规模经济/不变/不经济三阶段'
      }
    }
  ],
  calculate(rawParams: Record<string, any>): GraphCalculationOutput {
    const params: LRATCParams = { ...defaultParams, ...rawParams };
    const q = Math.max(10, Math.min(110, params.outputQ));
    const mes = params.mesQuantity;
    const dis = Math.max(mes + 20, params.disQuantity);
    const minCost = 28.0;

    // Mathematical definition of LRATC:
    // Flat bottom between mes and dis at cost minCost.
    // Quadratic bowl on left (economies of scale): cost = minCost + 0.04 * (mes - q)^2
    // Quadratic bowl on right (diseconomies of scale): cost = minCost + 0.035 * (q - dis)^2
    const evaluateLRATC = (output: number): number => {
      if (output < mes) {
        return minCost + 0.038 * Math.pow(mes - output, 2);
      } else if (output <= dis) {
        return minCost;
      } else {
        return minCost + 0.032 * Math.pow(output - dis, 2);
      }
    };

    const currentCost = evaluateLRATC(q);

    // Identify current phase
    let phaseNameEn = 'Constant Returns to Scale';
    let phaseNameZh = '规模报酬不变阶段';
    let phaseBadge = 'bg-blue-50 text-blue-700';

    if (q < mes) {
      phaseNameEn = 'Economies of Scale (Increasing Returns)';
      phaseNameZh = '规模经济阶段（规模报酬递增）';
      phaseBadge = 'bg-emerald-50 text-emerald-700';
    } else if (q > dis) {
      phaseNameEn = 'Diseconomies of Scale (Decreasing Returns)';
      phaseNameZh = '规模不经济阶段（规模报酬递减）';
      phaseBadge = 'bg-rose-50 text-rose-700';
    }

    // Generate points for LRATC curve
    const steps = 60;
    const lratcPoints: Point2D[] = [];
    for (let i = 0; i <= steps; i++) {
      const qVal = 10 + (i / steps) * 105;
      lratcPoints.push({
        x: Number(qVal.toFixed(1)),
        y: Number(evaluateLRATC(qVal).toFixed(2))
      });
    }

    const curves: CurveSpec[] = [
      {
        id: 'curve-lratc',
        name: { en: 'Long-Run Average Total Cost (LRATC)', zh: '长期平均总成本曲线（LRATC）' },
        shortLabel: 'LRATC',
        color: '#1e3a8a',
        strokeWidth: 3.5,
        visible: true,
        points: lratcPoints
      }
    ];

    // Short-Run ATC curves for 4 discrete plant sizes
    if (params.showSRATC) {
      const plantSizes = [
        { id: 'sratc-1', qOpt: 24, label: 'SRATC₁ (Small)', color: '#0284c7' },
        { id: 'sratc-2', qOpt: 45, label: 'SRATC₂ (Medium)', color: '#059669' },
        { id: 'sratc-3', qOpt: 70, label: 'SRATC₃ (Large)', color: '#d97706' },
        { id: 'sratc-4', qOpt: 95, label: 'SRATC₄ (Huge)', color: '#dc2626' }
      ];

      plantSizes.forEach((plant) => {
        const sratcPts: Point2D[] = [];
        const baseCost = evaluateLRATC(plant.qOpt);
        const span = 22;
        for (let i = 0; i <= 24; i++) {
          const ptQ = plant.qOpt - span + (i / 24) * (2 * span);
          if (ptQ >= 10 && ptQ <= 115) {
            // SRATC is steeper than LRATC envelope
            const cVal = baseCost + 0.12 * Math.pow(ptQ - plant.qOpt, 2);
            if (cVal <= 80) {
              sratcPts.push({ x: Number(ptQ.toFixed(1)), y: Number(cVal.toFixed(2)) });
            }
          }
        }
        curves.push({
          id: plant.id,
          name: { en: plant.label, zh: `${plant.label} 厂房规模` },
          shortLabel: plant.label.split(' ')[0],
          color: plant.color,
          strokeWidth: 1.8,
          strokeDasharray: '4,4',
          visible: true,
          points: sratcPts
        });
      });
    }

    // Key points
    const points: KeyPointSpec[] = [
      {
        id: 'pt-current-q',
        label: { en: `Current Output (Q = ${q})`, zh: `当前产量（Q = ${q}）` },
        shortLabel: `Q=${q}`,
        x: q,
        y: currentCost,
        color: '#4f46e5',
        showDropLines: true,
        xLabel: `Q=${q}`,
        yLabel: `$${currentCost.toFixed(1)}`
      },
      {
        id: 'pt-mes',
        label: { en: 'Minimum Efficient Scale (MES)', zh: '最低有效规模点（MES）' },
        shortLabel: 'MES',
        x: mes,
        y: minCost,
        color: '#059669',
        showDropLines: true,
        xLabel: `MES=${mes}`,
        yLabel: `$${minCost.toFixed(0)}`
      },
      {
        id: 'pt-dis',
        label: { en: 'Diseconomies of Scale Boundary', zh: '规模不经济临界点' },
        shortLabel: 'DIS',
        x: dis,
        y: minCost,
        color: '#dc2626',
        showDropLines: true,
        xLabel: `Q=${dis}`,
        yLabel: `$${minCost.toFixed(0)}`
      }
    ];

    // Shaded scale phases
    const shadedAreas: ShadedAreaSpec[] = [];
    if (params.showScalePhases) {
      // Economies of scale zone (Green)
      shadedAreas.push({
        id: 'zone-economies',
        label: { en: 'Economies of Scale', zh: '规模经济区间' },
        fill: '#10b981',
        opacity: 0.1,
        visible: true,
        points: [
          { x: 10, y: 0 },
          { x: mes, y: 0 },
          { x: mes, y: 75 },
          { x: 10, y: 75 }
        ]
      });

      // Constant returns zone (Blue)
      shadedAreas.push({
        id: 'zone-constant',
        label: { en: 'Constant Returns to Scale', zh: '规模报酬不变区间' },
        fill: '#3b82f6',
        opacity: 0.1,
        visible: true,
        points: [
          { x: mes, y: 0 },
          { x: dis, y: 0 },
          { x: dis, y: 75 },
          { x: mes, y: 75 }
        ]
      });

      // Diseconomies of scale zone (Red)
      shadedAreas.push({
        id: 'zone-diseconomies',
        label: { en: 'Diseconomies of Scale', zh: '规模不经济区间' },
        fill: '#ef4444',
        opacity: 0.1,
        visible: true,
        points: [
          { x: dis, y: 0 },
          { x: 115, y: 0 },
          { x: 115, y: 75 },
          { x: dis, y: 75 }
        ]
      });
    }

    return {
      axes: {
        xLabel: { en: 'Output Quantity (Q)', zh: '总产出数量（Q）' },
        yLabel: { en: 'Per-Unit Cost ($ / unit)', zh: '单位成本（$ / 单位）' },
        xMin: 0,
        xMax: 120,
        xStep: 20,
        yMin: 0,
        yMax: 80,
        yStep: 15,
        yPrefix: '$'
      },
      curves,
      points,
      shadedAreas,
      results: [
        {
          id: 'res-current-scale-phase',
          label: { en: 'Current Scale Phase', zh: '当前所处规模阶段' },
          value: phaseNameEn,
          color: phaseBadge.includes('emerald') ? '#059669' : (phaseBadge.includes('rose') ? '#dc2626' : '#2563eb'),
          interpretation: { en: phaseNameEn, zh: phaseNameZh }
        },
        {
          id: 'res-current-lratc',
          label: { en: 'LRATC at Output Q', zh: '当前长期平均总成本' },
          value: `$${currentCost.toFixed(2)} / unit`
        },
        {
          id: 'res-mes-quantity',
          label: { en: 'Minimum Efficient Scale (MES)', zh: '最低有效规模（MES）' },
          value: `Q = ${mes} units`
        },
        {
          id: 'res-min-cost',
          label: { en: 'Minimum Possible LRATC', zh: '最低可能单位成本' },
          value: `$${minCost.toFixed(2)}`
        },
        {
          id: 'res-dis-threshold',
          label: { en: 'Diseconomies Threshold', zh: '规模不经济临界产量' },
          value: `Q = ${dis} units`
        }
      ],
      explanation: {
        en: `At Q = ${q}, the firm operates in the ${phaseNameEn} phase with an LRATC of $${currentCost.toFixed(2)}. Minimum Efficient Scale (MES) is achieved at Q = ${mes}, where long-run per-unit costs are minimized ($${minCost.toFixed(2)}). The LRATC acts as an envelope curve tangentially wrapping around the short-run average cost (SRATC) curves for all possible plant sizes.`,
        zh: `在产量 Q = ${q} 时，企业处于 ${phaseNameZh}，长期平均总成本为 $${currentCost.toFixed(2)}。最低有效规模（MES）在 Q = ${mes} 处达成，此时长期单位成本达到全行业最低水平（$${minCost.toFixed(2)}）。LRATC 曲线作为一条“包络线”，与企业所有可选厂房规模下的短期平均成本曲线（SRATC）在最优点相切。`
      },
      analysisPoints: [
        {
          en: 'Economies of Scale (Q < MES): As production expands, LRATC falls due to labor specialization, managerial specialization, efficient capital equipment, and bulk input discounts.',
          zh: '规模经济（Q < MES）：随着产量扩张，得益于分工专业化、大型高效机械设备以及批量原材料折扣，单位成本持续走低。'
        },
        {
          en: 'Minimum Efficient Scale (MES): The lowest output at which a firm can achieve minimum long-run average total cost. Crucial in determining market structure (high MES creates barriers to entry and oligopoly/monopoly).',
          zh: '最低有效规模（MES）：企业实现最低单位成本的最小产量。MES 的高低直接决定了该行业的市场结构（高 MES 构成高进入壁垒，容易形成寡头或自然垄断）。'
        },
        {
          en: 'Diseconomies of Scale (Q > DIS): Caused by coordination problems, communication breakdowns, and bureaucratic inefficiencies in very large firms.',
          zh: '规模不经济（Q > DIS）：由于特大型企业内部沟通脱节、管理官僚化与协调失灵，导致单位成本不降反升。'
        }
      ]
    };
  }
};
