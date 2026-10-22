import { EconomicModel, GraphCalculationOutput, ScenarioPreset, CurveSpec, KeyPointSpec, ShadedAreaSpec, CustomTableSpec, Point2D } from '../../types/graph';

export interface LorenzParams {
  inequalityExponent: number; // alpha: 1.0 to 5.0 (default 2.5)
  redistributionEffect: number; // 0 to 40% tax & transfer mitigation (default 0)
}

const defaultParams: LorenzParams = {
  inequalityExponent: 2.5,
  redistributionEffect: 0
};

const presets: ScenarioPreset[] = [
  {
    id: 'moderate-inequality',
    name: {
      en: 'Moderate Inequality (Gini ≈ 0.40, Typical Developed Market)',
      zh: '中度不平等（基尼系数 ≈ 0.40，典型发达市场）'
    },
    description: {
      en: 'Standard market distribution before redistributive fiscal policy. Bottom 20% receives roughly 5% of income, while top 20% earns over 45%.',
      zh: '未经过大规模财政再分配的市场初次分配。底层 20% 人口仅占约 5% 收入，顶层 20% 人口占有超过 45% 的国民收入。'
    },
    params: {
      inequalityExponent: 2.33,
      redistributionEffect: 0
    }
  },
  {
    id: 'progressive-redistribution',
    name: {
      en: 'Progressive Tax & Welfare Transfers (Gini drops to 0.28)',
      zh: '累进税与福利转移支付调节（基尼系数降至 0.28）'
    },
    description: {
      en: 'Progressive income taxes on top earners combined with welfare cash transfers to low-income households shifts the Lorenz curve inward toward the 45-degree line.',
      zh: '对高收入阶层征收累进所得税，并对低收入家庭提供现金转移支付，推动洛伦兹曲线向 45 度完全平等线内收，显著改善收入分配。'
    },
    params: {
      inequalityExponent: 2.33,
      redistributionEffect: 35
    }
  },
  {
    id: 'severe-inequality',
    name: {
      en: 'High Inequality (Gini ≈ 0.55, Developing / Unregulated)',
      zh: '高度不平等（基尼系数 ≈ 0.55，差距显著）'
    },
    description: {
      en: 'Significant wealth and income concentration. The Lorenz curve sags deeply away from the line of equality, and Area A is exceptionally large.',
      zh: '财富与收入高度集中。洛伦兹曲线极度向右下凹陷远离 45 度线，面积 A 极大，底层阶层收入微薄。'
    },
    params: {
      inequalityExponent: 3.44,
      redistributionEffect: 0
    }
  },
  {
    id: 'perfect-equality',
    name: {
      en: 'Theoretical Perfect Equality (Gini = 0.00)',
      zh: '理论完全平等基准（基尼系数 = 0.00）'
    },
    description: {
      en: 'Every quintile earns exactly 20% of the total income. The Lorenz curve coincides directly with the 45-degree diagonal line.',
      zh: '每一个 20% 的人口组别恰好分配到 20% 的国民总收入。洛伦兹曲线与 45 度对角线完全重合。'
    },
    params: {
      inequalityExponent: 1.0,
      redistributionEffect: 0
    }
  }
];

export const lorenzCurveModel: EconomicModel = {
  id: 'lorenz-curve-gini',
  topicId: 'lorenz-curve-gini',
  name: {
    en: 'Income Distribution: Lorenz Curve & Gini Coefficient',
    zh: '收入分配：洛伦兹曲线与基尼系数模型'
  },
  description: {
    en: 'Visualizes cumulative population vs cumulative income, computes the Gini coefficient A / (A + B), and analyzes the impact of progressive taxation and welfare transfers.',
    zh: '直观呈现累积人口与累积收入对应关系，精确测算基尼系数 A / (A + B)，并深度演示累进税收与转移支付对收入均等化的调节作用。'
  },
  defaultParams,
  presets,
  controls: [
    {
      type: 'slider',
      id: 'inequalityExponent',
      label: { en: 'Market Inequality Intensity (Curvature α)', zh: '市场初次分配不平等强度（曲率参数 α）' },
      min: 1.0,
      max: 4.5,
      step: 0.1
    },
    {
      type: 'slider',
      id: 'redistributionEffect',
      label: { en: 'Government Progressive Redistribution (%)', zh: '政府累进税收与转移支付力度 (%)' },
      min: 0,
      max: 50,
      step: 5,
      unit: '%'
    }
  ],

  calculate(params: Record<string, any>): GraphCalculationOutput {
    const rawAlpha = Number(params.inequalityExponent) || 2.5;
    const redist = Number(params.redistributionEffect) || 0;

    const effectiveAlpha = 1.0 + (rawAlpha - 1.0) * (1 - redist / 100);

    const lorenzFn = (x: number) => {
      if (x <= 0) return 0;
      if (x >= 100) return 100;
      return Math.pow(x / 100, effectiveAlpha) * 100;
    };

    const gini = (effectiveAlpha - 1) / (effectiveAlpha + 1);
    const rawGini = (rawAlpha - 1) / (rawAlpha + 1);

    const equalityPoints: Point2D[] = [
      { x: 0, y: 0 },
      { x: 100, y: 100 }
    ];

    const lorenzPoints: Point2D[] = [];
    const numSteps = 50;
    for (let i = 0; i <= numSteps; i++) {
      const x = (i / numSteps) * 100;
      lorenzPoints.push({ x: Number(x.toFixed(2)), y: Number(lorenzFn(x).toFixed(2)) });
    }

    let preRedistPoints: Point2D[] | undefined;
    if (redist > 0 && Math.abs(rawAlpha - effectiveAlpha) > 0.05) {
      preRedistPoints = [];
      for (let i = 0; i <= numSteps; i++) {
        const x = (i / numSteps) * 100;
        preRedistPoints.push({ x: Number(x.toFixed(2)), y: Number((Math.pow(x / 100, rawAlpha) * 100).toFixed(2)) });
      }
    }

    const curves: CurveSpec[] = [
      {
        id: 'perfect-equality',
        name: { en: 'Line of Perfect Equality (45° Diagonal)', zh: '45° 完全平等线' },
        shortLabel: 'Y=X',
        points: equalityPoints,
        color: '#059669',
        strokeWidth: 2.5,
        strokeDasharray: '4,3',
        visible: true,
        equation: 'Y = X (Gini = 0)'
      },
      {
        id: 'lorenz-curve',
        name: { en: redist > 0 ? 'Lorenz Curve (Post-Tax & Transfers)' : 'Lorenz Curve (Income Distribution)', zh: redist > 0 ? '洛伦兹曲线（税收与转移支付后）' : '洛伦兹曲线（实际收入分配）' },
        shortLabel: 'Lorenz',
        points: lorenzPoints,
        color: '#2563eb',
        strokeWidth: 3.5,
        visible: true,
        equation: `Y = (X/100)^${effectiveAlpha.toFixed(2)} × 100`
      }
    ];

    if (preRedistPoints) {
      curves.push({
        id: 'pre-redist-lorenz',
        name: { en: 'Pre-Tax & Transfer Lorenz Curve', zh: '再分配前原始洛伦兹曲线' },
        shortLabel: 'Pre-Tax',
        points: preRedistPoints,
        color: '#9ca3af',
        strokeWidth: 2,
        strokeDasharray: '5,3',
        visible: true
      });
    }

    const q20 = lorenzFn(20);
    const q40 = lorenzFn(40);
    const q60 = lorenzFn(60);
    const q80 = lorenzFn(80);

    const points: KeyPointSpec[] = [
      {
        id: 'pt-20',
        x: 20,
        y: q20,
        shortLabel: 'Q1',
        label: { en: `Bottom 20% owns ${q20.toFixed(1)}%`, zh: `底层 20% 占有 ${q20.toFixed(1)}%` },
        color: '#2563eb',
        showDropLines: true
      },
      {
        id: 'pt-80',
        x: 80,
        y: q80,
        shortLabel: 'Q4',
        label: { en: `Bottom 80% owns ${q80.toFixed(1)}%`, zh: `前 80% 占有 ${q80.toFixed(1)}%` },
        color: '#2563eb',
        showDropLines: true
      }
    ];

    const areaAPoints: Point2D[] = [];
    areaAPoints.push({ x: 0, y: 0 });
    areaAPoints.push({ x: 100, y: 100 });
    for (let i = lorenzPoints.length - 1; i >= 0; i--) {
      areaAPoints.push(lorenzPoints[i]);
    }

    const shadedAreas: ShadedAreaSpec[] = [
      {
        id: 'area-a',
        label: { en: `Area A (Inequality Area, Gini = ${gini.toFixed(3)})`, zh: `面积 A（不平等差距面积，基尼系数 = ${gini.toFixed(3)}）` },
        points: areaAPoints,
        fill: '#f59e0b',
        opacity: 0.28,
        visible: true
      }
    ];

    const incQ1 = q20;
    const incQ2 = q40 - q20;
    const incQ3 = q60 - q40;
    const incQ4 = q80 - q60;
    const incQ5 = 100 - q80;

    const customTable: CustomTableSpec = {
      title: {
        en: 'Quintile Income Distribution Schedule',
        zh: '五等分位人口收入份额明细表'
      },
      headers: [
        { en: 'Population Quintile', zh: '人口五等分位组' },
        { en: 'Cum. Population', zh: '累积人口占比' },
        { en: 'Cum. Income % (Lorenz Y)', zh: '累积收入占比 (Y)' },
        { en: 'Group Share of Total Income', zh: '本组占国民总收入比例' },
        { en: 'Equal Share Benchmark', zh: '完全平等基准份额' }
      ],
      rows: [
        {
          id: 'q1',
          label: { en: 'Lowest 20% (First Quintile)', zh: '最低 20%（第一五等分位）' },
          values: ['20%', `${q20.toFixed(1)}%`, `${incQ1.toFixed(1)}%`, '20.0%']
        },
        {
          id: 'q2',
          label: { en: 'Second 20% (20%–40%)', zh: '次低 20%（第二五等分位）' },
          values: ['40%', `${q40.toFixed(1)}%`, `${incQ2.toFixed(1)}%`, '20.0%']
        },
        {
          id: 'q3',
          label: { en: 'Third 20% (Middle Class)', zh: '中间 20%（第三五等分位）' },
          values: ['60%', `${q60.toFixed(1)}%`, `${incQ3.toFixed(1)}%`, '20.0%']
        },
        {
          id: 'q4',
          label: { en: 'Fourth 20% (60%–80%)', zh: '次高 20%（第四五等分位）' },
          values: ['80%', `${q80.toFixed(1)}%`, `${incQ4.toFixed(1)}%`, '20.0%']
        },
        {
          id: 'q5',
          label: { en: 'Highest 20% (Top Quintile)', zh: '最高 20%（第五五等分位）' },
          values: ['100%', '100.0%', `${incQ5.toFixed(1)}%`, '20.0%'],
          highlight: true
        }
      ]
    };

    const results = [
      {
        id: 'giniResult',
        label: { en: 'Gini Coefficient (Ratio A / (A + B))', zh: '基尼系数（比率 A / (A + B)）' },
        value: gini.toFixed(3),
        color: gini < 0.3 ? '#059669' : gini < 0.45 ? '#d97706' : '#dc2626',
        formula: 'A / (A + B)'
      },
      {
        id: 'topToBottomRatio',
        label: { en: 'Top 20% / Bottom 20% Ratio', zh: '顶层与底层 20% 收入倍数' },
        value: `${(incQ5 / Math.max(0.1, incQ1)).toFixed(1)}×`,
        color: '#2563eb',
        formula: 'Q5 Share / Q1 Share'
      },
      {
        id: 'giniChange',
        label: { en: 'Fiscal Policy Redistribution Impact', zh: '财政再分配调节效应' },
        value: redist > 0 ? `Reduced by -${(rawGini - gini).toFixed(3)} (-${((1 - gini / rawGini) * 100).toFixed(1)}%)` : 'No fiscal redistribution active',
        color: redist > 0 ? '#059669' : '#6b7280'
      },
      {
        id: 'unAssessment',
        label: { en: 'International Inequality Classification', zh: '联合国标准收入分配评估' },
        value: gini < 0.25 ? 'High Equality (< 0.25)' : gini < 0.35 ? 'Relatively Reasonable (0.25–0.35)' : gini < 0.40 ? 'Adequate (0.35–0.40)' : gini < 0.50 ? 'Large Gap (0.40–0.50 Warning)' : 'Severe Inequality (> 0.50 Danger)',
        color: gini < 0.35 ? '#059669' : gini < 0.40 ? '#d97706' : '#dc2626'
      }
    ];

    const explanation = {
      en: redist > 0
        ? `Fiscal Policy in Action: Progressive income taxation combined with social transfer programs (e.g., food assistance, earned income tax credits) has successfully reduced the Gini coefficient from ${rawGini.toFixed(3)} down to ${gini.toFixed(3)}. The Lorenz curve has bowed inward toward the 45-degree line, increasing the bottom quintile's share from ${Math.pow(0.2, rawAlpha) * 100 > 0.1 ? (Math.pow(0.2, rawAlpha) * 100).toFixed(1) : '<1'}% to ${incQ1.toFixed(1)}% of national income.`
        : `Understanding the Lorenz Curve: The horizontal axis plots the cumulative percentage of households from poorest to richest; the vertical axis plots the cumulative percentage of total national income earned. In a hypothetical world of perfect equality, 20% of people earn 20% of income, 50% earn 50%, etc., creating the 45-degree line. Because actual income is distributed unequally, the Lorenz curve bows downward. The Gini coefficient measures the size of Area A (between the 45° line and Lorenz curve) relative to the total triangle (A + B = 0.5). A Gini of ${gini.toFixed(3)} indicates that the top 20% earns ${incQ5.toFixed(1)}% of total income while the bottom 20% captures only ${incQ1.toFixed(1)}%.`,
      zh: redist > 0
        ? `财政再分配机制生效：通过对高收入群体征收累进所得税，并对低收入家庭发放定向福利转移支付（如工作所得税抵免、食品券补贴），成功将基尼系数从 ${rawGini.toFixed(3)} 压降至 ${gini.toFixed(3)}。洛伦兹曲线显著向 45 度平等线内收，使最低 20% 底层家庭的收入占比从之前的微弱份额提高到 ${incQ1.toFixed(1)}%。`
        : `洛伦兹曲线深度解读：横轴代表由穷到富排序的累积家庭人口百分比；纵轴代表这些家庭所获得的累积国民收入百分比。在理论上的“完全平等”社会中，20% 人口赚得 20% 收入，50% 人口赚得 50% 收入，形成一条 45 度的绝对对角线。现实中由于收入分配存在差距，洛伦兹曲线永远向右下方凹陷。基尼系数精确计算面积 A（对角线与洛伦兹曲线之间）占总三角形 (A + B = 0.5) 的比值。当前的基尼系数为 ${gini.toFixed(3)}，表明最高收入的 20% 人口瓜分了全社会 ${incQ5.toFixed(1)}% 的总收入，而最低收入的 20% 人口仅分得 ${incQ1.toFixed(1)}%。`
    };

    const analysisPoints = [
      {
        en: 'The Gini Ratio Formula: Gini = Area A / (Area A + Area B). Since Area A + Area B is always equal to 0.5 (half of the 100×100 unit square), Gini = 2 × Area A. Scale ranges strictly from 0 (perfect equality) to 1 (pure inequality).',
        zh: '基尼系数数学公式：基尼系数 = 面积 A / (面积 A + 面积 B)。因为 (A + B) 恒等于整个 100×100 坐标正方形的一半（即 0.5），故基尼系数 = 2 × 面积 A。数值严格介于 0（绝对平等）与 1（一人独占全部财富）之间。'
      },
      {
        en: 'Market Income vs Disposable Income: Pre-tax market income produces a higher Gini coefficient. Post-tax and transfer disposable income produces a lower Gini coefficient, demonstrating how fiscal policy alters the distribution.',
        zh: '初次市场收入 vs 最终可支配收入：税前初次分配的市场基尼系数通常较高；经过累进税收扣除与转移支付后的可支配收入基尼系数显著下降，直观反映公共政策的调节效能。'
      },
      {
        en: 'Limitations of Gini: Different income distribution curves can yield the exact same single Gini coefficient! Two countries with identical Gini numbers may have very different distributions between the middle class and extreme poverty.',
        zh: '基尼系数的局限性：不同形态的洛伦兹曲线可能算出完全相同的基尼系数！两个基尼系数相同的国家，其中产阶级受挤压程度与极端贫困发生率可能存在巨大差异。'
      }
    ];

    return {
      axes: {
        xLabel: { en: 'Cumulative % of Population (Poorest to Richest)', zh: '累积人口百分比（由贫至富，%）' },
        yLabel: { en: 'Cumulative % of Total National Income', zh: '累积国民总收入百分比（%）' },
        xMin: 0,
        xMax: 100,
        yMin: 0,
        yMax: 100,
        xStep: 20,
        yStep: 20,
        xSuffix: '%',
        yPrefix: ''
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
