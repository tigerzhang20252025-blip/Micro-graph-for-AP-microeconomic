import { EconomicModel, GraphCalculationOutput, ScenarioPreset, CurveSpec } from '../../types/graph';
import { generatePPCPoints } from '../economicMath';

export interface PPCParams {
  costShape: 'bowed' | 'linear'; // increasing vs constant opportunity cost
  techConsumerGoods: number;    // 60 to 120 (Max Good X)
  techCapitalGoods: number;     // 60 to 120 (Max Good Y)
  productionX: number;          // 0 to max X
  showGrowthShift: boolean;
}

const defaultParams: PPCParams = {
  costShape: 'bowed',
  techConsumerGoods: 100,
  techCapitalGoods: 100,
  productionX: 60,
  showGrowthShift: false
};

const presets: ScenarioPreset[] = [
  {
    id: 'bowed-increasing',
    name: {
      en: 'Increasing Opportunity Cost (Bowed-Out PPC)',
      zh: '机会成本递增（外凸型 PPC）'
    },
    description: {
      en: 'Reflects non-homogeneous resources. As more consumer goods are produced, increasingly unsuitable resources must be transferred.',
      zh: '反映生产要素不具同质性。生产越来越多的消费品必须调用越发不匹配的资源，导致边际机会成本递增。'
    },
    params: {
      costShape: 'bowed',
      techConsumerGoods: 100,
      techCapitalGoods: 100,
      productionX: 60,
      showGrowthShift: false
    }
  },
  {
    id: 'linear-constant',
    name: {
      en: 'Constant Opportunity Cost (Straight-Line PPC)',
      zh: '机会成本恒定（直线型 PPC）'
    },
    description: {
      en: 'Reflects completely adaptable, homogeneous resources. The trade-off ratio between both goods remains strictly constant.',
      zh: '反映生产要素完全具有替代性与同质性。两种物品之间的转换比率（机会成本）严格保持恒定不变。'
    },
    params: {
      costShape: 'linear',
      techConsumerGoods: 100,
      techCapitalGoods: 100,
      productionX: 50,
      showGrowthShift: false
    }
  },
  {
    id: 'capital-tech-growth',
    name: {
      en: 'Biased Economic Growth (Capital Goods Breakthrough)',
      zh: '偏向型经济增长（资本品技术突破）'
    },
    description: {
      en: 'A technological breakthrough specific to capital goods pivots the curve outward along the vertical axis.',
      zh: '专门针对资本品生产的技术突破使曲线以横轴为支点向上外旋扩展，拓宽未来生产可能性边界。'
    },
    params: {
      costShape: 'bowed',
      techConsumerGoods: 100,
      techCapitalGoods: 130,
      productionX: 70,
      showGrowthShift: true
    }
  }
];

export const ppcModel: EconomicModel = {
  id: 'ppc-model',
  topicId: 'ppc-model',
  name: {
    en: 'Production Possibilities Curve (PPC)',
    zh: '生产可能性曲线（PPC）'
  },
  description: {
    en: 'Visualizes scarcity, opportunity cost, productive efficiency, unemployment, and economic growth.',
    zh: '直观展示稀缺性、机会成本、生产效率、失业以及经济增长的经典宏微观基石模型。'
  },
  defaultParams,
  presets,
  controls: [
    {
      type: 'select',
      id: 'costShape',
      label: {
        en: 'Opportunity Cost Shape',
        zh: '机会成本特征（曲线形态）'
      },
      options: [
        { id: 'bowed', label: { en: 'Bowed-Out (Increasing Opportunity Cost)', zh: '向外凸出（机会成本递增）' } },
        { id: 'linear', label: { en: 'Straight-Line (Constant Opportunity Cost)', zh: '平直折线（机会成本恒定）' } }
      ]
    },
    {
      type: 'slider',
      id: 'productionX',
      label: {
        en: 'Consumer Goods Production (Good X)',
        zh: '消费品生产量（物品 X）'
      },
      min: 0,
      max: 100,
      step: 2,
      unit: 'units',
      help: {
        en: 'Slide to move the economy’s allocation along the Production Possibility frontier.',
        zh: '拖动以沿着生产可能性边界移动经济体的资源配置组合。'
      }
    },
    {
      type: 'slider',
      id: 'techConsumerGoods',
      label: {
        en: 'Consumer Goods Resource / Tech (X capacity)',
        zh: '消费品资源/技术水平（X轴最大产能）'
      },
      min: 70,
      max: 130,
      step: 5,
      unit: '',
      help: {
        en: 'Changes maximum potential output for Consumer Goods.',
        zh: '改变消费品的最大潜在生产能力。'
      }
    },
    {
      type: 'slider',
      id: 'techCapitalGoods',
      label: {
        en: 'Capital Goods Resource / Tech (Y capacity)',
        zh: '资本品资源/技术水平（Y轴最大产能）'
      },
      min: 70,
      max: 130,
      step: 5,
      unit: '',
      help: {
        en: 'Changes maximum potential output for Capital Goods.',
        zh: '改变资本品的最大潜在生产能力。'
      }
    },
    {
      type: 'toggle',
      id: 'showGrowthShift',
      label: {
        en: 'Compare with Baseline Frontier (Growth Overlay)',
        zh: '对比基准边界（显示经济增长对比线）'
      },
      help: {
        en: 'Shows the initial 100x100 baseline boundary for visual comparison of economic expansion.',
        zh: '展示初始 100x100 的基准边界，用于清晰对比经济外展扩张幅度。'
      }
    }
  ],
  calculate(rawParams: Record<string, any>): GraphCalculationOutput {
    const params: PPCParams = { ...defaultParams, ...rawParams };
    const power = params.costShape === 'bowed' ? 2 : 1;
    const maxX = params.techConsumerGoods;
    const maxY = params.techCapitalGoods;

    // Current production choice
    const actualX = Math.min(maxX, Math.max(0, params.productionX));
    let actualY = 0;
    if (power === 1) {
      actualY = Math.max(0, maxY * (1 - actualX / maxX));
    } else {
      const ratio = Math.min(1, actualX / maxX);
      actualY = Math.max(0, maxY * Math.sqrt(Math.max(0, 1 - ratio * ratio)));
    }

    // Opportunity cost of next consumer good: |dY/dX|
    let oppCost = 0;
    if (power === 1) {
      oppCost = maxY / maxX;
    } else {
      if (actualY > 0.5) {
        oppCost = (maxY * maxY * actualX) / (maxX * maxX * actualY);
      } else {
        oppCost = 10; // high slope near X-intercept
      }
    }

    // Generate curve points
    const currentCurvePoints = generatePPCPoints(maxX, maxY, power, 40);

    const curves: CurveSpec[] = [
      {
        id: 'ppcCurrent',
        name: {
          en: params.costShape === 'bowed' ? 'PPC (Increasing Opp Cost)' : 'PPC (Constant Opp Cost)',
          zh: params.costShape === 'bowed' ? 'PPC（机会成本递增）' : 'PPC（机会成本恒定）'
        },
        shortLabel: 'PPC',
        points: currentCurvePoints,
        color: '#2563eb', // Blue
        strokeWidth: 3.5,
        strokeDasharray: 'none',
        visible: true,
        endLabelPosition: 'end' as const
      }
    ];

    if (params.showGrowthShift) {
      const baselinePoints = generatePPCPoints(100, 100, power, 40);
      curves.unshift({
        id: 'ppcBaseline',
        name: { en: 'Baseline Frontier (PPC₀)', zh: '基准生产边界（PPC₀）' },
        shortLabel: 'PPC₀',
        points: baselinePoints,
        color: '#94a3b8', // Gray dashed
        strokeWidth: 2,
        strokeDasharray: '4,4',
        visible: true,
        endLabelPosition: 'end' as const
      });
    }

    // Key points
    const points = [
      {
        id: 'pointCurrent',
        label: { en: 'Point A: Productive Efficiency', zh: '点 A：生产有效配置点' },
        shortLabel: 'A',
        x: Number(actualX.toFixed(1)),
        y: Number(actualY.toFixed(1)),
        color: '#059669',
        showDropLines: true,
        xLabel: `X=${actualX.toFixed(0)}`,
        yLabel: `Y=${actualY.toFixed(0)}`
      },
      {
        id: 'pointInefficient',
        label: { en: 'Point B: Inefficient (Recession / Unemployment)', zh: '点 B：生产无效率（失业/资源闲置）' },
        shortLabel: 'B',
        x: Number((maxX * 0.35).toFixed(1)),
        y: Number((maxY * 0.35).toFixed(1)),
        color: '#dc2626',
        showDropLines: false
      },
      {
        id: 'pointUnattainable',
        label: { en: 'Point C: Unattainable (Current Technology)', zh: '点 C：当前不可企及点' },
        shortLabel: 'C',
        x: Number((maxX * 0.85).toFixed(1)),
        y: Number((maxY * 0.85).toFixed(1)),
        color: '#7c3aed',
        showDropLines: false
      }
    ];

    // Shaded attainable region
    const shadedAreas = [
      {
        id: 'attainableRegion',
        label: { en: 'Attainable Production Set', zh: '可实现生产集合' },
        points: [
          { x: 0, y: 0 },
          { x: 0, y: maxY },
          ...currentCurvePoints,
          { x: maxX, y: 0 }
        ],
        fill: '#3b82f6',
        opacity: 0.1,
        pattern: 'solid' as const,
        visible: true
      }
    ];

    const results = [
      {
        id: 'consumerOutput',
        label: { en: 'Consumer Goods Output (X)', zh: '消费品产出量（X）' },
        value: `${actualX.toFixed(1)} units`,
        color: '#2563eb'
      },
      {
        id: 'capitalOutput',
        label: { en: 'Capital Goods Output (Y)', zh: '资本品产出量（Y）' },
        value: `${actualY.toFixed(1)} units`,
        color: '#d97706'
      },
      {
        id: 'oppCostPerUnit',
        label: { en: 'Per-Unit Opportunity Cost (ΔY/ΔX)', zh: '单位机会成本（ΔY/ΔX）' },
        value: `${oppCost.toFixed(2)} Capital Goods`,
        color: '#7c3aed',
        formula: '|d(Capital) / d(Consumer)|'
      },
      {
        id: 'efficiencyStatus',
        label: { en: 'Point A Status', zh: '点 A 运行状态' },
        value: 'Productively Efficient (On PPC)',
        color: '#059669'
      }
    ];

    const explanation = {
      en: `At Point A (${actualX.toFixed(0)} Consumer Goods, ${actualY.toFixed(0)} Capital Goods), the economy achieves Productive Efficiency because all resources are fully and efficiently utilized. Producing 1 additional Consumer Good currently requires sacrificing approximately ${oppCost.toFixed(2)} Capital Goods (${params.costShape === 'bowed' ? 'Increasing' : 'Constant'} Opportunity Cost). Point B lies inside the PPC representing unemployment or underutilization, while Point C is currently unattainable without economic growth or international trade.`,
      zh: `在生产点 A（${actualX.toFixed(0)} 单位消费品，${actualY.toFixed(0)} 单位资本品），经济体实现了“生产效率”（Productive Efficiency），所有资源均得到充分且最高效的利用。当前每增产 1 单位消费品，需要牺牲约 ${oppCost.toFixed(2)} 单位资本品（体现了机会成本${params.costShape === 'bowed' ? '递增' : '恒定'}规律）。点 B 位于曲线内部，代表资源闲置或高失业率；点 C 位于外部，若无经济增长或国际贸易则当前无法企及。`
    };

    const analysisPoints = [
      {
        en: 'Productive Efficiency: Every point directly on the PPC frontier is productively efficient (no resources wasted).',
        zh: '生产效率：直接位于 PPC 边界上的任意一点均具有生产效率（不存在资源浪费）。'
      },
      {
        en: 'Allocative Efficiency: Requires society’s preferences to determine the ONE optimal point on the PPC where MB = MC.',
        zh: '配置效率：需要结合全社会的偏好，在生产可能性曲线上找出边际收益等于边际成本（MB = MC）的唯一最优点。'
      },
      {
        en: 'Economic Growth: Caused by increases in resource quantity, resource quality, or technological advancement, shifting the PPC outward.',
        zh: '经济增长：由生产要素数量增加、劳动力及资本质量提升或技术进步驱动，表现为 PPC 边界整体向外扩展。'
      }
    ];

    return {
      axes: {
        xLabel: { en: 'Consumer Goods (Quantity)', zh: '消费品数量（横轴）' },
        yLabel: { en: 'Capital Goods (Quantity)', zh: '资本品数量（纵轴）' },
        xMin: 0,
        xMax: 150,
        yMin: 0,
        yMax: 150,
        xStep: 25,
        yStep: 25,
        xSuffix: '',
        yPrefix: ''
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
