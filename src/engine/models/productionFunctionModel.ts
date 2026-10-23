import { EconomicModel, GraphCalculationOutput, ScenarioPreset, CurveSpec, KeyPointSpec, ShadedAreaSpec, Point2D } from '../../types/graph';

export interface ProductionFunctionParams {
  labor: number;             // Labor input L (0 to 15, default 6)
  capitalScale: number;      // Capital/technology scaling (0.8 to 1.5, default 1.0)
  showTP: boolean;
  showMP: boolean;
  showAP: boolean;
  showStages: boolean;
}

const defaultParams: ProductionFunctionParams = {
  labor: 6,
  capitalScale: 1.0,
  showTP: true,
  showMP: true,
  showAP: true,
  showStages: true
};

const presets: ScenarioPreset[] = [
  {
    id: 'stage-1-increasing-returns',
    name: {
      en: 'Stage I: Increasing Marginal Returns (L = 4)',
      zh: '第一阶段：边际报酬递增阶段（L = 4）'
    },
    description: {
      en: 'Specialization allows additional workers to be increasingly productive. Marginal Product (MP) rises to its peak, and Average Product (AP) is increasing.',
      zh: '分工与专业化使新增工人效率不断提高。边际产量（MP）上升至最高点，平均产量（AP）持续攀升。'
    },
    params: {
      labor: 4,
      capitalScale: 1.0,
      showTP: true,
      showMP: true,
      showAP: true,
      showStages: true
    }
  },
  {
    id: 'stage-2-diminishing-returns',
    name: {
      en: 'Stage II: Rational Operating Range (L = 9)',
      zh: '第二阶段：理性生产决策区间（L = 9，MP 与 AP 相交）'
    },
    description: {
      en: 'Diminishing marginal returns set in. MP is falling but still positive. Crucial AP benchmark: MP intersects AP at AP\'s exact maximum point (L = 9). Rational firms always operate in Stage II.',
      zh: '边际报酬递减规律显现。MP 下降但仍为正值。极其关键的 AP 考点：MP 恰好穿过 AP 的最高点（L = 9）。理性厂商的生产必定位于第二阶段。'
    },
    params: {
      labor: 9,
      capitalScale: 1.0,
      showTP: true,
      showMP: true,
      showAP: true,
      showStages: true
    }
  },
  {
    id: 'stage-3-negative-returns',
    name: {
      en: 'Stage III: Negative Marginal Returns (L = 13)',
      zh: '第三阶段：负边际报酬阶段（L = 13，工人过度拥挤）'
    },
    description: {
      en: 'Fixed capital is overcrowded. An extra worker actually reduces total output (MP < 0, Total Product TP is declining). Rational firms never operate here.',
      zh: '固定资本设备过度拥挤。多雇佣一名工人反而导致总产量下降（MP < 0，总产量 TP 开始下滑）。理性厂商绝不会在此阶段生产。'
    },
    params: {
      labor: 13,
      capitalScale: 1.0,
      showTP: true,
      showMP: true,
      showAP: true,
      showStages: true
    }
  }
];

export const productionFunctionModel: EconomicModel = {
  id: 'production-function-tp-mp-ap',
  topicId: 'production-function-tp-mp-ap',
  name: {
    en: 'Production Function: Total, Marginal & Average Product',
    zh: '生产函数：总产量、边际产量与平均产量'
  },
  description: {
    en: 'Dynamic model of the Law of Diminishing Marginal Returns. Demonstrates the three stages of production, the exact intersection where MP cuts AP at AP\'s maximum, and the mirror-image relationship to short-run cost curves.',
    zh: '边际报酬递减规律经典数理模型。动态展示生产的三大阶段、MP 必然穿过 AP 最高点的几何特征，以及生产率曲线与短期成本曲线的镜像对应关系。'
  },
  defaultParams,
  presets,
  controls: [
    {
      type: 'slider',
      id: 'labor',
      label: {
        en: 'Labor Input (L: Workers)',
        zh: '劳动力投入（L：雇佣工人数）'
      },
      min: 1,
      max: 14,
      step: 1,
      unit: 'workers',
      help: {
        en: 'Adjust the number of workers to observe shifts across Stage I, II, and III.',
        zh: '调节工人雇佣量，观察跨越第一、二、三生产阶段的产量变化。'
      }
    },
    {
      type: 'slider',
      id: 'capitalScale',
      label: {
        en: 'Capital / Technology Scale',
        zh: '资本设备 / 生产技术规模'
      },
      min: 0.8,
      max: 1.4,
      step: 0.1,
      unit: 'x',
      help: {
        en: 'Increase in capital or technology shifts all product curves upward.',
        zh: '资本规模或技术进步使所有产量曲线整体向上平移。'
      }
    },
    {
      type: 'toggle',
      id: 'showTP',
      label: {
        en: 'Show Total Product (TP)',
        zh: '显示总产量曲线（TP）'
      }
    },
    {
      type: 'toggle',
      id: 'showMP',
      label: {
        en: 'Show Marginal Product (MP)',
        zh: '显示边际产量曲线（MP）'
      }
    },
    {
      type: 'toggle',
      id: 'showAP',
      label: {
        en: 'Show Average Product (AP)',
        zh: '显示平均产量曲线（AP）'
      }
    },
    {
      type: 'toggle',
      id: 'showStages',
      label: {
        en: 'Highlight Production Stages (I, II, III)',
        zh: '高亮划分生产阶段（I, II, III）'
      }
    }
  ],
  calculate(rawParams: Record<string, any>): GraphCalculationOutput {
    const params: ProductionFunctionParams = { ...defaultParams, ...rawParams };
    const k = params.capitalScale;
    const currentL = Math.max(0.5, Math.min(14, params.labor));

    // Production function: TP(L) = k * (3.6 * L^2 - 0.2 * L^3)
    // First derivative: MP(L) = d(TP)/dL = k * (7.2 * L - 0.6 * L^2)
    // Peak of MP: d(MP)/dL = 7.2 - 1.2*L = 0 => L_diminishing = 6.0
    // Average Product: AP(L) = TP / L = k * (3.6 * L - 0.2 * L^2)
    // Peak of AP: d(AP)/dL = 3.6 - 0.4*L = 0 => L_ap_max = 9.0
    // At L = 9.0, MP(9) = k*(64.8 - 48.6) = 16.2*k; AP(9) = k*(32.4 - 16.2) = 16.2*k. Exactly equal!
    // TP reaches peak when MP = 0 => 7.2*L - 0.6*L^2 = 0 => L_tp_max = 12.0
    // Stage I: 0 <= L <= 9 (AP is rising; ends where MP = AP)
    // Stage II: 9 <= L <= 12 (Diminishing positive returns; AP falling, MP falling but >= 0; ends where MP = 0)
    // Stage III: L > 12 (Negative returns; MP < 0, TP falling)

    const tpFunc = (l: number): number => Math.max(0, k * (3.6 * Math.pow(l, 2) - 0.2 * Math.pow(l, 3)));
    const mpFunc = (l: number): number => k * (7.2 * l - 0.6 * Math.pow(l, 2));
    const apFunc = (l: number): number => (l > 0 ? tpFunc(l) / l : k * 3.6 * 0.1);

    const currentTP = tpFunc(currentL);
    const currentMP = mpFunc(currentL);
    const currentAP = apFunc(currentL);

    // Identify stage
    let stageNameEn = 'Stage II: Rational Operating Range';
    let stageNameZh = '第二阶段：理性生产区间';
    let stageClass = 'bg-blue-50 text-blue-700';

    if (currentL < 9.0) {
      stageNameEn = 'Stage I: Increasing Marginal Returns';
      stageNameZh = '第一阶段：边际报酬递增';
      stageClass = 'bg-emerald-50 text-emerald-700';
    } else if (currentL > 12.0) {
      stageNameEn = 'Stage III: Negative Returns (Overcrowding)';
      stageNameZh = '第三阶段：负报酬（设备拥挤）';
      stageClass = 'bg-rose-50 text-rose-700';
    }

    // Generate points for curves
    const steps = 70;
    const lMax = 15;
    const tpPoints: Point2D[] = [];
    const mpPoints: Point2D[] = [];
    const apPoints: Point2D[] = [];

    for (let i = 0; i <= steps; i++) {
      const l = (i / steps) * lMax;
      tpPoints.push({ x: Number(l.toFixed(2)), y: Number(tpFunc(l).toFixed(2)) });
      mpPoints.push({ x: Number(l.toFixed(2)), y: Number(mpFunc(l).toFixed(2)) });
      if (l >= 0.5) {
        apPoints.push({ x: Number(l.toFixed(2)), y: Number(apFunc(l).toFixed(2)) });
      }
    }

    const curves: CurveSpec[] = [];

    // Main graph focuses on MP and AP (with secondary graph showing Total Product TP)
    if (params.showMP) {
      curves.push({
        id: 'curve-mp',
        name: { en: 'Marginal Product (MP)', zh: '边际产量曲线（MP）' },
        shortLabel: 'MP',
        color: '#dc2626',
        strokeWidth: 3,
        visible: true,
        points: mpPoints
      });
    }

    if (params.showAP) {
      curves.push({
        id: 'curve-ap',
        name: { en: 'Average Product (AP)', zh: '平均产量曲线（AP）' },
        shortLabel: 'AP',
        color: '#2563eb',
        strokeWidth: 3,
        visible: true,
        points: apPoints
      });
    }

    // Key points
    const points: KeyPointSpec[] = [
      {
        id: 'pt-current-l',
        label: { en: `Current Labor (L = ${currentL})`, zh: `当前雇佣量（L = ${currentL}）` },
        shortLabel: `L=${currentL}`,
        x: currentL,
        y: Math.max(0, currentMP),
        color: '#4f46e5',
        showDropLines: true,
        xLabel: `L=${currentL}`,
        yLabel: `MP=${currentMP.toFixed(1)}`
      },
      {
        id: 'pt-ap-max',
        label: { en: 'MP = AP Maximum Intersection', zh: 'MP 与 AP 最高点交点' },
        shortLabel: 'Max AP (MP=AP)',
        x: 9.0,
        y: Number((16.2 * k).toFixed(1)),
        color: '#059669',
        showDropLines: true,
        xLabel: 'L=9 (Stage I/II)',
        yLabel: `${(16.2 * k).toFixed(1)}`
      },
      {
        id: 'pt-mp-zero',
        label: { en: 'MP = 0 (TP Maximum)', zh: 'MP = 0（TP 达到峰值）' },
        shortLabel: 'MP=0 (Max TP)',
        x: 12.0,
        y: 0,
        color: '#ea580c',
        showDropLines: true,
        xLabel: 'L=12 (Stage II/III)',
        yLabel: '0'
      }
    ];

    // Shaded areas for Stage I, II, III
    const shadedAreas: ShadedAreaSpec[] = [];
    if (params.showStages) {
      // Stage II shaded (The rational zone)
      shadedAreas.push({
        id: 'stage-2-zone',
        label: { en: 'Stage II: Rational Operating Range', zh: '第二阶段：理性生产区间' },
        fill: '#3b82f6',
        opacity: 0.12,
        visible: true,
        points: [
          { x: 9.0, y: 0 },
          { x: 12.0, y: 0 },
          { x: 12.0, y: 30 * k },
          { x: 9.0, y: 30 * k }
        ]
      });
    }

    // Secondary graph: Total Product TP curve
    const secondaryGraph = params.showTP
      ? {
          title: {
            en: 'Total Product Curve (TP)',
            zh: '总产量曲线（TP）'
          },
          axes: {
            xLabel: { en: 'Labor Input (L)', zh: '劳动力投入（L）' },
            yLabel: { en: 'Total Output (Q / TP)', zh: '总产出数量（Q / TP）' },
            xMin: 0,
            xMax: 15,
            xStep: 3,
            yMin: 0,
            yMax: Math.ceil((200 * k) / 20) * 20,
            yStep: 40
          },
          curves: [
            {
              id: 'curve-tp',
              name: { en: 'Total Product (TP)', zh: '总产量曲线（TP）' },
              shortLabel: 'TP',
              color: '#059669',
              strokeWidth: 3.5,
              visible: true,
              points: tpPoints
            }
          ],
          points: [
            {
              id: 'pt-tp-current',
              label: { en: `TP at L=${currentL}`, zh: `L=${currentL} 处的总产量` },
              shortLabel: `TP=${currentTP.toFixed(0)}`,
              x: currentL,
              y: currentTP,
              color: '#059669',
              showDropLines: true,
              xLabel: `L=${currentL}`,
              yLabel: `${currentTP.toFixed(0)}`
            },
            {
              id: 'pt-tp-max',
              label: { en: 'Maximum Total Product (L = 12)', zh: '总产量极大值点（L = 12）' },
              shortLabel: 'Max TP',
              x: 12.0,
              y: Number((172.8 * k).toFixed(1)),
              color: '#dc2626',
              showDropLines: true,
              xLabel: 'L=12',
              yLabel: `${(172.8 * k).toFixed(0)}`
            }
          ]
        }
      : undefined;

    return {
      axes: {
        xLabel: { en: 'Labor Input (L: Workers)', zh: '劳动力投入（L：工人数）' },
        yLabel: { en: 'Marginal & Average Product (Units/Worker)', zh: '边际与平均产量（单位产出/人）' },
        xMin: 0,
        xMax: 15,
        xStep: 3,
        yMin: -10,
        yMax: Math.ceil((28 * k) / 5) * 5,
        yStep: 5
      },
      curves,
      points,
      shadedAreas,
      secondaryGraph,
      results: [
        {
          id: 'res-current-stage',
          label: { en: 'Current Stage', zh: '当前生产阶段' },
          value: stageNameEn,
          color: stageClass.includes('emerald') ? '#059669' : (stageClass.includes('rose') ? '#dc2626' : '#2563eb'),
          interpretation: { en: stageNameEn, zh: stageNameZh }
        },
        {
          id: 'res-current-tp',
          label: { en: 'Total Product (TP)', zh: '当前总产量（TP）' },
          value: `${currentTP.toFixed(1)} units`
        },
        {
          id: 'res-current-mp',
          label: { en: 'Marginal Product (MP)', zh: '当前边际产量（MP）' },
          value: `${currentMP.toFixed(1)} units/worker`
        },
        {
          id: 'res-current-ap',
          label: { en: 'Average Product (AP)', zh: '当前平均产量（AP）' },
          value: `${currentAP.toFixed(1)} units/worker`
        },
        {
          id: 'res-diminishing-pt',
          label: { en: 'Point of Diminishing Returns', zh: '边际报酬递减临界点' },
          value: 'L = 6.0 (Peak MP)'
        },
        {
          id: 'res-stage1-2-boundary',
          label: { en: 'Stage I / Stage II Boundary', zh: '第一/第二阶段分界线' },
          value: 'L = 9.0 (MP = AP Max)'
        },
        {
          id: 'res-stage2-3-boundary',
          label: { en: 'Stage II / Stage III Boundary', zh: '第二/第三阶段分界线' },
          value: 'L = 12.0 (MP = 0, Max TP)'
        }
      ],
      explanation: {
        en: `At L = ${currentL} workers, the firm produces TP = ${currentTP.toFixed(1)} units. Diminishing marginal returns begin at L = 6 (peak MP). At L = 9, MP cuts AP at AP's maximum (${(16.2 * k).toFixed(1)}). When MP reaches 0 at L = 12, Total Product reaches its absolute peak (${(172.8 * k).toFixed(0)}). Rational profit-maximizing firms always hire labor within Stage II (between L = 9 and L = 12).`,
        zh: `在雇佣 L = ${currentL} 名工人时，总产量 TP 为 ${currentTP.toFixed(1)} 单位。边际报酬递减从 L = 6（MP 最高点）开始显现。在 L = 9 时，MP 严格穿过 AP 的最高点（${(16.2 * k).toFixed(1)}）。当 MP 在 L = 12 降至 0 时，总产量 TP 达到最大值（${(172.8 * k).toFixed(0)}）。追求利润最大化的理性厂商必然在第二阶段（L 介于 9 到 12 之间）组织生产。`
      },
      analysisPoints: [
        {
          en: 'Mirror Image to Costs: When MP is increasing, Marginal Cost (MC) is decreasing. When MP peaks, MC is minimized. When AP is maximized, Average Variable Cost (AVC) is minimized.',
          zh: '生产率与成本的镜像关系：MP 上升时 MC 下降；MP 达到最大值时 MC 达到最低点；AP 达到最大值时 AVC 达到最低点。'
        },
        {
          en: 'Stage I (0 < L < 9): Specialization raises AP. Never stop hiring in Stage I because each worker increases average productivity.',
          zh: '第一阶段（0 < L < 9）：分工推高 AP。理性企业绝不应在第一阶段停止招工，因为新工人仍在提高团队平均生产率。'
        },
        {
          en: 'Stage II (9 <= L <= 12): Diminishing positive returns. Rational operating zone where profit maximization (MRP = MFC) occurs.',
          zh: '第二阶段（9 <= L <= 12）：边际收益递减但仍为正。追求利润最大化（MRP = MFC）的唯一理性生产区间。'
        },
        {
          en: 'Stage III (L > 12): Overcrowding causes negative marginal returns (MP < 0). Adding workers actually reduces total output.',
          zh: '第三阶段（L > 12）：厂房过度拥挤导致负边际报酬（MP < 0）。多招工人反而使总产出净减少。'
        }
      ]
    };
  }
};
