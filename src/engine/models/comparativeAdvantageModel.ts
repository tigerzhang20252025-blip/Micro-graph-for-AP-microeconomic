import { EconomicModel, GraphCalculationOutput, ScenarioPreset, CurveSpec, KeyPointSpec, ShadedAreaSpec } from '../../types/graph';

export interface ComparativeAdvantageParams {
  countryAMaxCars: number;   // 20 to 100 (Default 60)
  countryAMaxWheat: number;  // 40 to 180 (Default 120)
  countryBMaxCars: number;   // 10 to 80 (Default 40)
  countryBMaxWheat: number;  // 20 to 100 (Default 40)
  termsOfTradeCarToWheat: number; // 0.8 to 2.5 Wheat per Car (Default 1.5)
}

const defaultParams: ComparativeAdvantageParams = {
  countryAMaxCars: 60,
  countryAMaxWheat: 120,
  countryBMaxCars: 40,
  countryBMaxWheat: 40,
  termsOfTradeCarToWheat: 1.5
};

const presets: ScenarioPreset[] = [
  {
    id: 'classic-ricardo',
    name: {
      en: 'Classic Gains from Trade (A has Absolute Adv in Both)',
      zh: '经典分工收益（国家 A 在两产品上均具绝对优势）'
    },
    description: {
      en: 'Country A produces more Cars and more Wheat, yet Country B still holds comparative advantage in Cars due to lower opportunity cost.',
      zh: '国家 A 在汽车和小麦生产上均具绝对优势，但国家 B 生产汽车的机会成本更低，依然享有汽车的比较优势。'
    },
    params: {
      countryAMaxCars: 60,
      countryAMaxWheat: 120,
      countryBMaxCars: 40,
      countryBMaxWheat: 40,
      termsOfTradeCarToWheat: 1.5
    }
  },
  {
    id: 'equal-advantage',
    name: {
      en: 'Equal Opportunity Costs (No Gains from Trade)',
      zh: '机会成本相等（无法产生贸易互利）'
    },
    description: {
      en: 'When both countries face identical per-unit opportunity costs, neither has a comparative advantage, so specialization yields no gains.',
      zh: '当两国单位机会成本完全一致时，双方均无比较优势，此时专业化分工无法带来任何额外消费拓展。'
    },
    params: {
      countryAMaxCars: 50,
      countryAMaxWheat: 100,
      countryBMaxCars: 25,
      countryBMaxWheat: 50,
      termsOfTradeCarToWheat: 2.0
    }
  }
];

export const comparativeAdvantageModel: EconomicModel = {
  id: 'comparative-advantage',
  topicId: 'comparative-advantage',
  name: {
    en: 'Comparative Advantage & Terms of Trade',
    zh: '比较优势、专业化分工与贸易条件'
  },
  description: {
    en: 'Two-country trade model. Calculates per-unit opportunity costs, assigns comparative advantage, and proves how mutually beneficial terms of trade expand consumption beyond the PPC.',
    zh: '两国双产品贸易模型。精确计算单位机会成本、判定比较优势，并展示互利贸易条件如何使消费可能性边界（CPC）突破原有 PPC。'
  },
  defaultParams,
  presets,
  controls: [
    {
      type: 'slider',
      id: 'termsOfTradeCarToWheat',
      label: {
        en: 'Terms of Trade (1 Car = ? Wheat)',
        zh: '贸易条件（1 辆汽车 = ？ 蒲式耳小麦）'
      },
      min: 0.8,
      max: 2.5,
      step: 0.1,
      unit: 'Wheat',
      help: {
        en: 'Mutually beneficial terms of trade must fall strictly between both countries’ opportunity costs.',
        zh: '互利的贸易价格必须严格介于两国各自的单位机会成本之间。'
      }
    },
    {
      type: 'slider',
      id: 'countryAMaxCars',
      label: {
        en: 'Country A: Max Potential Cars',
        zh: '国家 A：最大潜在汽车产能'
      },
      min: 30,
      max: 90,
      step: 5,
      unit: 'Cars'
    },
    {
      type: 'slider',
      id: 'countryAMaxWheat',
      label: {
        en: 'Country A: Max Potential Wheat',
        zh: '国家 A：最大潜在小麦产能'
      },
      min: 60,
      max: 180,
      step: 10,
      unit: 'Wheat'
    },
    {
      type: 'slider',
      id: 'countryBMaxCars',
      label: {
        en: 'Country B: Max Potential Cars',
        zh: '国家 B：最大潜在汽车产能'
      },
      min: 20,
      max: 70,
      step: 5,
      unit: 'Cars'
    },
    {
      type: 'slider',
      id: 'countryBMaxWheat',
      label: {
        en: 'Country B: Max Potential Wheat',
        zh: '国家 B：最大潜在小麦产能'
      },
      min: 20,
      max: 80,
      step: 5,
      unit: 'Wheat'
    }
  ],
  calculate(rawParams: Record<string, any>): GraphCalculationOutput {
    const params: ComparativeAdvantageParams = { ...defaultParams, ...rawParams };

    const cA = params.countryAMaxCars;
    const wA = params.countryAMaxWheat;
    const cB = params.countryBMaxCars;
    const wB = params.countryBMaxWheat;

    // Per-unit opportunity costs:
    // Country A: 1 Car costs (wA / cA) Wheat; 1 Wheat costs (cA / wA) Cars
    const oppCostCarA = wA / cA;
    const oppCostWheatA = cA / wA;

    // Country B: 1 Car costs (wB / cB) Wheat; 1 Wheat costs (cB / wB) Cars
    const oppCostCarB = wB / cB;
    const oppCostWheatB = cB / wB;

    // Determine comparative advantages:
    const aAdvCar = oppCostCarA < oppCostCarB;
    const bAdvCar = oppCostCarB < oppCostCarA;
    const aAdvWheat = oppCostWheatA < oppCostWheatB;
    const bAdvWheat = oppCostWheatB < oppCostWheatA;
    const hasComparativeAdvantage = aAdvCar || aAdvWheat || bAdvCar || bAdvWheat;

    const lowerBoundTrade = Math.min(oppCostCarA, oppCostCarB);
    const upperBoundTrade = Math.max(oppCostCarA, oppCostCarB);
    const tot = params.termsOfTradeCarToWheat;

    const isMutuallyBeneficial = tot > lowerBoundTrade && tot < upperBoundTrade;

    // Country A Graph:
    // If Country A specializes in Wheat (wA), exporting Wheat for Cars at rate 1 Car = tot Wheat
    // Max Cars Country A could consume via trade = wA / tot
    const maxCarsViaTradeA = aAdvWheat ? (wA / tot) : cA;
    const maxWheatViaTradeA = aAdvCar ? (cA * tot) : wA;

    const countryAPpcPoints = [
      { x: 0, y: wA },
      { x: cA, y: 0 }
    ];

    const countryACpcPoints = [
      { x: 0, y: maxWheatViaTradeA },
      { x: maxCarsViaTradeA, y: 0 }
    ];

    const curvesA: CurveSpec[] = [
      {
        id: 'ppcA',
        name: { en: 'Country A: Domestic PPC', zh: '国家 A：国内生产可能性边界（PPC）' },
        shortLabel: 'PPC_A',
        points: countryAPpcPoints,
        color: '#dc2626', // Red
        strokeWidth: 3,
        strokeDasharray: 'none',
        visible: true,
        equation: `W = ${wA} - ${(wA / cA).toFixed(2)}C`,
        endLabelPosition: 'end'
      },
      {
        id: 'cpcA',
        name: { en: `Country A: Consumption Frontier with Trade (CPC)`, zh: `国家 A：贸易消费可能性边界（CPC）` },
        shortLabel: 'CPC_A',
        points: countryACpcPoints,
        color: '#2563eb', // Blue dashed
        strokeWidth: 2.5,
        strokeDasharray: '5,4',
        visible: true,
        equation: `1 Car = ${tot.toFixed(1)} Wheat`,
        endLabelPosition: 'end'
      }
    ];

    const pointsA: KeyPointSpec[] = [
      {
        id: 'specA',
        label: {
          en: aAdvWheat ? 'Country A Specialization: 100% Wheat' : aAdvCar ? 'Country A Specialization: 100% Cars' : 'Country A: No Comparative Advantage',
          zh: aAdvWheat ? '国家 A 完全分工点：100% 生产小麦' : aAdvCar ? '国家 A 完全分工点：100% 生产汽车' : '国家 A：无比较优势'
        },
        shortLabel: aAdvWheat ? 'Spec(W)' : aAdvCar ? 'Spec(C)' : 'No CA',
        x: aAdvWheat ? 0 : aAdvCar ? cA : 0,
        y: aAdvWheat ? wA : aAdvCar ? 0 : 0,
        color: '#059669',
        showDropLines: true,
        xLabel: aAdvWheat ? '0 Cars' : `${cA} Cars`,
        yLabel: aAdvWheat ? `${wA} Wheat` : '0 Wheat'
      }
    ];

    const shadedAreasA: ShadedAreaSpec[] = [];
    if (isMutuallyBeneficial && (aAdvWheat || aAdvCar)) {
      shadedAreasA.push({
        id: 'gainsFromTradeA',
        label: { en: 'Country A: Gains from Trade (Expanded Consumption)', zh: '国家 A：贸易利得（超越 PPC 的消费扩张）' },
        points: aAdvWheat
          ? [{ x: 0, y: wA }, { x: maxCarsViaTradeA, y: 0 }, { x: cA, y: 0 }]
          : [{ x: 0, y: maxWheatViaTradeA }, { x: cA, y: 0 }, { x: 0, y: wA }],
        fill: '#3b82f6',
        opacity: 0.2,
        pattern: 'diagonal-right',
        visible: true
      });
    }

    // Secondary Graph: Country B
    const maxCarsViaTradeB = bAdvWheat ? (wB / tot) : cB;
    const maxWheatViaTradeB = bAdvCar ? (cB * tot) : wB;

    const countryBPpcPoints = [
      { x: 0, y: wB },
      { x: cB, y: 0 }
    ];

    const countryBCpcPoints = [
      { x: 0, y: maxWheatViaTradeB },
      { x: maxCarsViaTradeB, y: 0 }
    ];

    const secondaryGraph = {
      title: {
        en: `Country B: PPC and Trade Expansion (1 Car = ${tot.toFixed(1)} Wheat)`,
        zh: `国家 B：PPC 与贸易消费拓展线（1 辆汽车 = ${tot.toFixed(1)} 蒲式耳小麦）`
      },
      axes: {
        xLabel: { en: 'Cars (Quantity)', zh: '汽车产出量（辆）' },
        yLabel: { en: 'Wheat (Quantity)', zh: '小麦产出量（蒲式耳）' },
        xMin: 0,
        xMax: Math.max(cB, maxCarsViaTradeB) * 1.25,
        yMin: 0,
        yMax: Math.max(wB, maxWheatViaTradeB) * 1.25,
        xStep: 10,
        yStep: 10,
        xSuffix: ' Cars',
        yPrefix: ''
      },
      curves: [
        {
          id: 'ppcB',
          name: { en: 'Country B: Domestic PPC', zh: '国家 B：国内生产可能性边界（PPC）' },
          shortLabel: 'PPC_B',
          points: countryBPpcPoints,
          color: '#d97706', // Amber
          strokeWidth: 3,
          strokeDasharray: 'none',
          visible: true,
          equation: `W = ${wB} - ${(wB / cB).toFixed(2)}C`,
          endLabelPosition: 'end' as const
        },
        {
          id: 'cpcB',
          name: { en: 'Country B: Consumption Frontier (CPC)', zh: '国家 B：贸易消费拓展线（CPC）' },
          shortLabel: 'CPC_B',
          points: countryBCpcPoints,
          color: '#059669', // Emerald dashed
          strokeWidth: 2.5,
          strokeDasharray: '5,4',
          visible: true,
          equation: `Trade: 1C = ${tot.toFixed(1)}W`,
          endLabelPosition: 'end' as const
        }
      ],
      points: [
        {
          id: 'specB',
          label: {
            en: bAdvCar ? 'Country B Specialization: 100% Cars' : bAdvWheat ? 'Country B Specialization: 100% Wheat' : 'Country B: No Comparative Advantage',
            zh: bAdvCar ? '国家 B 完全分工点：100% 生产汽车' : bAdvWheat ? '国家 B 完全分工点：100% 生产小麦' : '国家 B：无比较优势'
          },
          shortLabel: bAdvCar ? 'Spec(C)' : bAdvWheat ? 'Spec(W)' : 'No CA',
          x: bAdvCar ? cB : bAdvWheat ? 0 : 0,
          y: bAdvCar ? 0 : bAdvWheat ? wB : 0,
          color: '#059669',
          showDropLines: true,
          xLabel: bAdvCar ? `${cB} Cars` : '0 Cars',
          yLabel: bAdvCar ? '0 Wheat' : `${wB} Wheat`
        }
      ],
      shadedAreas: isMutuallyBeneficial && (bAdvCar || bAdvWheat) ? [
        {
          id: 'gainsFromTradeB',
          label: { en: 'Country B: Gains from Trade', zh: '国家 B：贸易利得区' },
          points: bAdvCar
            ? [{ x: 0, y: maxWheatViaTradeB }, { x: cB, y: 0 }, { x: 0, y: wB }]
            : [{ x: 0, y: wB }, { x: maxCarsViaTradeB, y: 0 }, { x: cB, y: 0 }],
          fill: '#10b981',
          opacity: 0.2,
          pattern: 'diagonal-left' as const,
          visible: true
        }
      ] : []
    };

    // Custom Interactive Comparative Advantage Table
    const customTable = {
      title: { en: 'Per-Unit Opportunity Cost & Specialization Table', zh: '单位机会成本测算与分工决策表' },
      subtitle: { en: 'Official Output Method Matrix (CED Unit 1.4)', zh: '官方产出法标准解题矩阵（CED 第一单元 1.4 考点）' },
      headers: [
        { en: 'Entity', zh: '国家/主体' },
        { en: 'Max Cars (C)', zh: '汽车最大产能' },
        { en: 'Max Wheat (W)', zh: '小麦最大产能' },
        { en: 'Opp Cost of 1 Car', zh: '生产 1 辆汽车的机会成本' },
        { en: 'Opp Cost of 1 Wheat', zh: '生产 1 蒲式耳小麦的机会成本' },
        { en: 'Comparative Advantage', zh: '比较优势分工决策' }
      ],
      rows: [
        {
          id: 'countryA-row',
          label: { en: 'Country A', zh: '国家 A' },
          values: [
            `${cA} units`,
            `${wA} units`,
            `${oppCostCarA.toFixed(2)} Wheat`,
            `${oppCostWheatA.toFixed(2)} Cars`,
            {
              en: aAdvWheat ? 'Wheat (Lower Cost: ' + oppCostWheatA.toFixed(2) + ' < ' + oppCostWheatB.toFixed(2) + ')' : aAdvCar ? 'Cars (Lower Cost: ' + oppCostCarA.toFixed(2) + ' < ' + oppCostCarB.toFixed(2) + ')' : 'None (Equal Costs)',
              zh: aAdvWheat ? '小麦（成本更低：' + oppCostWheatA.toFixed(2) + ' < ' + oppCostWheatB.toFixed(2) + ' 辆车）' : aAdvCar ? '汽车（成本更低：' + oppCostCarA.toFixed(2) + ' < ' + oppCostCarB.toFixed(2) + ' 蒲式耳小麦）' : '无（机会成本相等）'
            }
          ],
          highlight: aAdvWheat
        },
        {
          id: 'countryB-row',
          label: { en: 'Country B', zh: '国家 B' },
          values: [
            `${cB} units`,
            `${wB} units`,
            `${oppCostCarB.toFixed(2)} Wheat`,
            `${oppCostWheatB.toFixed(2)} Cars`,
            {
              en: bAdvCar ? 'Cars (Lower Cost: ' + oppCostCarB.toFixed(2) + ' < ' + oppCostCarA.toFixed(2) + ')' : bAdvWheat ? 'Wheat (Lower Cost: ' + oppCostWheatB.toFixed(2) + ' < ' + oppCostWheatA.toFixed(2) + ')' : 'None (Equal Costs)',
              zh: bAdvCar ? '汽车（成本更低：' + oppCostCarB.toFixed(2) + ' < ' + oppCostCarA.toFixed(2) + ' 蒲式耳小麦）' : bAdvWheat ? '小麦（成本更低：' + oppCostWheatB.toFixed(2) + ' < ' + oppCostWheatA.toFixed(2) + ' 辆车）' : '无（机会成本相等）'
            }
          ],
          highlight: bAdvCar
        }
      ]
    };

    const results = [
      {
        id: 'oppCostCarA',
        label: { en: 'Country A: Cost of 1 Car', zh: '国家 A：1 辆汽车成本' },
        value: `${oppCostCarA.toFixed(2)} Wheat`,
        color: '#dc2626'
      },
      {
        id: 'oppCostCarB',
        label: { en: 'Country B: Cost of 1 Car', zh: '国家 B：1 辆汽车成本' },
        value: `${oppCostCarB.toFixed(2)} Wheat`,
        color: '#d97706'
      },
      {
        id: 'tradeTermsRange',
        label: { en: 'Mutually Beneficial Terms of Trade', zh: '互利贸易条件区间（1 辆车）' },
        value: `${lowerBoundTrade.toFixed(2)} < P < ${upperBoundTrade.toFixed(2)} Wheat`,
        color: '#059669'
      },
      {
        id: 'tradeStatus',
        label: { en: 'Current Terms of Trade Status', zh: '当前设定贸易条件有效性' },
        value: isMutuallyBeneficial ? 'Mutually Beneficial (Gains for Both)' : 'Unfavorable / One-Sided',
        color: isMutuallyBeneficial ? '#059669' : '#dc2626'
      }
    ];

    const explanation = {
      en: !hasComparativeAdvantage
        ? `Both countries face the same opportunity cost of ${oppCostCarA.toFixed(2)} Wheat per Car. Neither country has a comparative advantage, so specialization and trade cannot create gains from trade.`
        : `For 1 Car, Country A sacrifices ${oppCostCarA.toFixed(2)} Wheat and Country B sacrifices ${oppCostCarB.toFixed(2)} Wheat. ${aAdvCar ? 'Country A has the comparative advantage in Cars and Country B in Wheat.' : 'Country B has the comparative advantage in Cars and Country A in Wheat.'} At the current terms of trade (1 Car = ${tot.toFixed(1)} Wheat), ${isMutuallyBeneficial ? 'both countries gain because the exchange rate lies strictly between their opportunity costs, expanding consumption beyond their PPCs.' : 'trade is NOT mutually beneficial because the exchange rate falls outside the acceptable range of ' + lowerBoundTrade.toFixed(2) + ' to ' + upperBoundTrade.toFixed(2) + ' Wheat.'}`,
      zh: !hasComparativeAdvantage
        ? `两国生产 1 辆汽车的机会成本同为 ${oppCostCarA.toFixed(2)} 蒲式耳小麦，双方均无比较优势，因此专业化和贸易不能创造贸易利得。`
        : `生产 1 辆汽车，国家 A 放弃 ${oppCostCarA.toFixed(2)} 蒲式耳小麦，国家 B 放弃 ${oppCostCarB.toFixed(2)} 蒲式耳小麦。${aAdvCar ? '国家 A 在汽车上有比较优势，国家 B 在小麦上有比较优势。' : '国家 B 在汽车上有比较优势，国家 A 在小麦上有比较优势。'}当前贸易条件为 1 辆汽车 = ${tot.toFixed(1)} 蒲式耳小麦；${isMutuallyBeneficial ? '该汇率严格位于双方机会成本之间，双方可以通过贸易将消费扩展到 PPC 之外。' : '该汇率超出了 ' + lowerBoundTrade.toFixed(2) + ' 至 ' + upperBoundTrade.toFixed(2) + ' 蒲式耳小麦的互利区间，无法实现互利。'}`
    };

    const analysisPoints = [
      {
        en: 'Comparative vs Absolute Advantage: A country can have an absolute advantage in both goods (producing more with given resources), but it CANNOT have a comparative advantage in both goods!',
        zh: '比较优势 vs 绝对优势：一个国家可能在两种物品上均具备绝对优势，但绝不可能在两种物品上同时具备比较优势（机会成本互为倒数）！'
      },
      {
        en: 'Terms of Trade Rule: A mutually beneficial trade price for 1 unit of Good X must lie strictly between the two producers’ per-unit opportunity costs.',
        zh: '贸易条件判定法则：对于 1 单位物品 X，互利贸易的汇率必须严格界定在两国各自单位机会成本之间。'
      },
      {
        en: 'Consumption Beyond PPC: While an economy cannot produce beyond its PPC without technological growth, international trade allows it to CONSUME beyond its PPC!',
        zh: '超越 PPC 的消费拓展：虽然在缺乏技术增长的前提下国内产出无法突破 PPC，但国际分工与自由贸易允许全社会在 PPC 之外实现更高的消费水准！'
      }
    ];

    return {
      axes: {
        xLabel: { en: 'Cars (Quantity)', zh: '汽车产出量（辆）' },
        yLabel: { en: 'Wheat (Quantity)', zh: '小麦产出量（蒲式耳）' },
        xMin: 0,
        xMax: Math.max(cA, maxCarsViaTradeA) * 1.25,
        yMin: 0,
        yMax: Math.max(wA, maxWheatViaTradeA) * 1.25,
        xStep: 20,
        yStep: 20,
        xSuffix: ' Cars',
        yPrefix: ''
      },
      curves: curvesA,
      points: pointsA,
      shadedAreas: shadedAreasA,
      results,
      secondaryGraph,
      customTable,
      explanation,
      analysisPoints
    };
  }
};
