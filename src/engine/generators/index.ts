import { PracticeQuestion } from '../../data/practiceQuestions';
import { DynamicQuestionTemplate } from '../../types/practice';
import { randomChoice } from './helper';

import {
  generatePpcOppCostQuestion,
  generateComparativeAdvantageQuestion,
  generateUtilityMaximizationQuestion,
  generateScarcitySystemsQuestion,
  generateAbsoluteVsComparativeQuestion
} from './unit1Generators';

import {
  generateMarketEquilibriumSurplusQuestion,
  generateElasticityTotalRevenueQuestion,
  generateExciseTaxDwlQuestion,
  generatePriceControlQuestion,
  generateCrossIncomeElasticityQuestion,
  generateTariffWelfareQuestion,
  generateSimultaneousShiftsQuestion
} from './unit2Generators';

import {
  generateProductionStagesQuestion,
  generateCostTaxShiftQuestion,
  generateShutdownDecisionQuestion,
  generateLratcScaleQuestion,
  generateDiscreteCostScheduleQuestion,
  generatePerfectCompLongRunAdjustmentQuestion
} from './unit3Generators';

import {
  generateMonopolyPricingQuestion,
  generateGameTheoryPayoffQuestion,
  generateNaturalMonopolyRegulationQuestion,
  generateMonopolisticCompExcessCapacityQuestion,
  generatePriceDiscriminationEfficiencyQuestion
} from './unit4Generators';

import {
  generateFactorMarketHiringQuestion,
  generateMonopsonyWageQuestion,
  generateMonopsonyVsCompetitiveComparisonQuestion,
  generateMinimumWageMonopsonyQuestion
} from './unit5Generators';

import {
  generateExternalitiesQuestion,
  generatePublicGoodsQuestion,
  generateLorenzGiniQuestion,
  generateCoaseTheoremQuestion
} from './unit6Generators';

export const DYNAMIC_QUESTION_TEMPLATES: DynamicQuestionTemplate[] = [
  // Unit 1
  {
    templateId: 'dyn-ppc-opp-cost',
    unit: 1,
    topicCode: '1.3',
    topicId: 'ppc-model',
    title: { en: 'PPC Opportunity Cost Calculator', zh: 'PPC 机会成本动态计算' },
    description: { en: 'Generates randomized combinations along a PPC curve.', zh: '随机生成生产组合，考察单位机会成本计算。' },
    generate: generatePpcOppCostQuestion
  },
  {
    templateId: 'dyn-comparative-trade',
    unit: 1,
    topicCode: '1.4',
    topicId: 'comparative-advantage',
    title: { en: 'Comparative Advantage & Terms of Trade', zh: '比较优势与互利贸易区间' },
    description: { en: 'Generates randomized production costs to identify mutually beneficial terms of trade.', zh: '随机生成两国生产成本，推导贸易条件上下限。' },
    generate: generateComparativeAdvantageQuestion
  },
  {
    templateId: 'dyn-utility-equi-marginal',
    unit: 1,
    topicCode: '1.6',
    topicId: 'marginal-analysis-utility',
    title: { en: 'Consumer Utility Maximization (Equi-Marginal Rule)', zh: '消费者效用最大化等边际法则' },
    description: { en: 'Solves for MUx/Px = MUy/Py under consumer budget constraints.', zh: '在预算约束下求解每美元边际效用相等的最优决策。' },
    generate: generateUtilityMaximizationQuestion
  },
  {
    templateId: 'dyn-scarcity-systems',
    unit: 1,
    topicCode: '1.3',
    topicId: 'ppc-model',
    title: { en: 'Capital Goods vs Consumer Goods Economic Growth', zh: '资本品与消费品配置及长期经济增长' },
    description: { en: 'Analyzes long-run outward shifts of the PPC driven by capital accumulation.', zh: '考察牺牲即期消费品投入资本品积累对未来 PPC 向外扩张的决定作用。' },
    generate: generateScarcitySystemsQuestion
  },
  {
    templateId: 'dyn-absolute-vs-comparative',
    unit: 1,
    topicCode: '1.4',
    topicId: 'comparative-advantage',
    title: { en: 'Absolute vs Comparative Advantage Analysis', zh: '绝对优势对比比较优势深度辨析' },
    description: { en: 'Derives opportunity costs to distinguish absolute productivity from comparative trade basis.', zh: '推导双边单位机会成本，辨析绝对生产率与比较优势分工依据。' },
    generate: generateAbsoluteVsComparativeQuestion
  },

  // Unit 2
  {
    templateId: 'dyn-eq-surplus',
    unit: 2,
    topicCode: '2.6',
    topicId: 'market-equilibrium-welfare',
    title: { en: 'Market Equilibrium & Consumer/Producer Surplus', zh: '市场均衡与消费者/生产者剩余' },
    description: { en: 'Randomizes supply and demand equations to calculate equilibrium price and surplus.', zh: '随机生成供求线性方程，计算均衡价格与经济剩余面积。' },
    generate: generateMarketEquilibriumSurplusQuestion
  },
  {
    templateId: 'dyn-ped-tr-test',
    unit: 2,
    topicCode: '2.3',
    topicId: 'price-elasticity-demand',
    title: { en: 'Price Elasticity & Total Revenue Test', zh: '需求价格弹性与总收益测试' },
    description: { en: 'Relates price changes to total revenue directions to infer elasticity.', zh: '由价格变动与总收益增减反推需求价格弹性区间。' },
    generate: generateElasticityTotalRevenueQuestion
  },
  {
    templateId: 'dyn-tax-dwl-calculation',
    unit: 2,
    topicCode: '2.8',
    topicId: 'gov-intervention-taxes-deadweight',
    title: { en: 'Excise Tax Incidence & Deadweight Loss', zh: '从量消费税税负与无谓损失' },
    description: { en: 'Calculates the tax wedge, government revenue, and deadweight loss triangle.', zh: '推导税收楔子、政府税收与无谓损失三角形面积。' },
    generate: generateExciseTaxDwlQuestion
  },
  {
    templateId: 'dyn-price-controls-binding',
    unit: 2,
    topicCode: '2.8',
    topicId: 'price-controls-ceilings-floors',
    title: { en: 'Binding Price Ceilings & Floors', zh: '有约束力价格上限与价格下限' },
    description: { en: 'Determines whether a price control is binding and calculates shortages/surpluses.', zh: '判定管制是否有约束力并精确计算短缺或过剩数量。' },
    generate: generatePriceControlQuestion
  },
  {
    templateId: 'dyn-elasticity-cross-income',
    unit: 2,
    topicCode: '2.4',
    topicId: 'price-elasticity-demand',
    title: { en: 'Cross-Price & Income Elasticity Classification', zh: '需求交叉价格弹性与收入弹性计算' },
    description: { en: 'Solves XED (substitutes/complements) and YED (normal/inferior goods).', zh: '推导 XED 判定替代品与互补品，推导 YED 判定正常品与劣等品。' },
    generate: generateCrossIncomeElasticityQuestion
  },
  {
    templateId: 'dyn-tariff-welfare-calculation',
    unit: 2,
    topicCode: '2.9',
    topicId: 'international-trade-tariffs',
    title: { en: 'Tariffs, Import Quotas & Deadweight Loss Triangles', zh: '关税扭曲、进口缩减与无谓损失双三角形' },
    description: { en: 'Calculates tariff revenue and two efficiency loss triangles.', zh: '计算世界价格下关税导致的生产扭曲与消费抑制两块无谓损失。' },
    generate: generateTariffWelfareQuestion
  },
  {
    templateId: 'dyn-simultaneous-shifts',
    unit: 2,
    topicCode: '2.7',
    topicId: 'market-equilibrium-welfare',
    title: { en: 'Simultaneous Shifts in Demand and Supply', zh: '供求双平移与确定性/不确定性判定' },
    description: { en: 'Applies AP Micro double shift rules to determine price and quantity effects.', zh: '运用双平移口诀判定价格与成交量维度的确定变动项与不确定项。' },
    generate: generateSimultaneousShiftsQuestion
  },

  // Unit 3
  {
    templateId: 'dyn-production-stages',
    unit: 3,
    topicCode: '3.1',
    topicId: 'production-function-tp-mp-ap',
    title: { en: 'Production Stages & Diminishing Marginal Returns', zh: '生产三阶段与边际报酬递减规律' },
    description: { en: 'Identifies production stages (I, II, III) and benchmarks for MP and AP.', zh: '识别生产阶段归属，定位 MP 与 AP 交点及 TP 最大值。' },
    generate: generateProductionStagesQuestion
  },
  {
    templateId: 'dyn-cost-curve-shifts',
    unit: 3,
    topicCode: '3.2',
    topicId: 'cost-curves-short-run',
    title: { en: 'Cost Curves: Lump-Sum vs Per-Unit Tax Shifts', zh: '成本曲线：定额税对比单位税平移' },
    description: { en: 'Tests the distinction between fixed cost shifts and marginal cost shifts.', zh: '辨析固定成本平移与边际可变成本平移的差异。' },
    generate: generateCostTaxShiftQuestion
  },
  {
    templateId: 'dyn-shutdown-decision',
    unit: 3,
    topicCode: '3.6',
    topicId: 'shutdown-rule',
    title: { en: 'Firm Short-Run Shutdown vs Loss Minimization', zh: '企业短期停产法则与亏损最小化' },
    description: { en: 'Evaluates market price against min AVC and min ATC to determine optimal output.', zh: '对比市场价格与 min AVC / min ATC 确定最优短期决策。' },
    generate: generateShutdownDecisionQuestion
  },
  {
    templateId: 'dyn-lratc-scale-economies',
    unit: 3,
    topicCode: '3.3',
    topicId: 'lratc-economies-of-scale',
    title: { en: 'Economies of Scale & Minimum Efficient Scale (MES)', zh: '规模经济、规模不经济与最小有效规模 MES' },
    description: { en: 'Explores long-run cost curves and returns to scale.', zh: '考察长期平均成本曲线形态与规模报酬变动趋势。' },
    generate: generateLratcScaleQuestion
  },
  {
    templateId: 'dyn-discrete-cost-schedule',
    unit: 3,
    topicCode: '3.2',
    topicId: 'cost-curves-short-run',
    title: { en: 'Discrete Cost Schedule: MC, ATC, AVC, TFC Table', zh: '离散成本表格数值推导（MC/ATC/AVC/TFC）' },
    description: { en: 'Calculates per-unit costs from a discrete Total Cost schedule table.', zh: '从离散总成本序列中逐级推导计算边际成本与平均总成本。' },
    generate: generateDiscreteCostScheduleQuestion
  },
  {
    templateId: 'dyn-perfect-competition-long-run',
    unit: 3,
    topicCode: '3.7',
    topicId: 'perfect-competition-side-by-side',
    title: { en: 'Perfect Competition Long-Run Zero Economic Profit', zh: '完全竞争长期进退均衡与零经济利润' },
    description: { en: 'Traces industry supply shifts driven by free entry and exit until P = min ATC.', zh: '推导自由进退驱动的市场供给平移与 P=min ATC 长期出清过程。' },
    generate: generatePerfectCompLongRunAdjustmentQuestion
  },

  // Unit 4
  {
    templateId: 'dyn-monopoly-output-price',
    unit: 4,
    topicCode: '4.2',
    topicId: 'monopoly-single-price',
    title: { en: 'Single-Price Monopoly Output & Price Reading', zh: '单一定价垄断利润最大化与读图定价' },
    description: { en: 'Solves MR = MC for Qm and projects to the Demand curve for Pm.', zh: '在 MR=MC 求解产量，并垂直投射到需求线上读取价格。' },
    generate: generateMonopolyPricingQuestion
  },
  {
    templateId: 'dyn-game-theory-nash',
    unit: 4,
    topicCode: '4.5',
    topicId: 'oligopoly-game-theory',
    title: { en: 'Oligopoly Payoff Matrix & Nash Equilibrium', zh: '寡头收益矩阵、占优策略与纳什均衡' },
    description: { en: 'Analyzes simultaneous 2x2 game matrices to solve for dominant strategies.', zh: '通过划线分析法求解 2x2 矩阵中的占优策略与纳什均衡。' },
    generate: generateGameTheoryPayoffQuestion
  },
  {
    templateId: 'dyn-natural-monopoly-regulation',
    unit: 4,
    topicCode: '4.4',
    topicId: 'monopoly-single-price',
    title: { en: 'Natural Monopoly: Socially Optimal vs Fair-Return Price', zh: '自然垄断管制：社会最优定价与公平回报定价' },
    description: { en: 'Contrasts P = MC (allocative efficiency + subsidy) with P = ATC (normal profit).', zh: '对比 P = MC（消除 DWL 但需财政补贴）与 P = ATC（保本正常利润）。' },
    generate: generateNaturalMonopolyRegulationQuestion
  },
  {
    templateId: 'dyn-monopolistic-competition-excess-capacity',
    unit: 4,
    topicCode: '4.3',
    topicId: 'monopolistic-competition',
    title: { en: 'Monopolistic Competition Long-Run Tangency & Excess Capacity', zh: '垄断竞争长期切点与过剩产能计算' },
    description: { en: 'Calculates excess capacity: Q(min ATC) - Q(actual).', zh: '在长期均衡 P=ATC 处精确计算有效产能与实际产量的差额。' },
    generate: generateMonopolisticCompExcessCapacityQuestion
  },
  {
    templateId: 'dyn-price-discrimination-efficiency',
    unit: 4,
    topicCode: '4.2',
    topicId: 'monopoly-price-discrimination',
    title: { en: 'First-Degree Price Discrimination & Zero DWL', zh: '完全一级价格歧视：剩余全夺与无谓损失归零' },
    description: { en: 'Demonstrates output expansion to competitive level where DWL = 0 and CS = 0.', zh: '论证价格歧视使产量扩大至竞争水平，消灭 DWL 但剥夺全部消费者剩余。' },
    generate: generatePriceDiscriminationEfficiencyQuestion
  },

  // Unit 5
  {
    templateId: 'dyn-factor-mrp-mfc',
    unit: 5,
    topicCode: '5.3',
    topicId: 'factor-market-competitive',
    title: { en: 'Factor Market Profit-Maximizing Hiring (MRP = MFC)', zh: '要素市场利润最大化雇佣法则（MRP = MFC）' },
    description: { en: 'Calculates Marginal Revenue Product from MP and price to find optimal employment.', zh: '根据产品价格与边际产量计算 MRP，并确定最优雇工数量。' },
    generate: generateFactorMarketHiringQuestion
  },
  {
    templateId: 'dyn-monopsony-wage-reading',
    unit: 5,
    topicCode: '5.4',
    topicId: 'monopsony-factor-market',
    title: { en: 'Monopsony Labor Market Wage Markdown', zh: '买方垄断劳动力市场工资压低与雇佣不足' },
    description: { en: 'Solves MFC = MRP for employment and reads the wage off the Labor Supply curve.', zh: '在 MFC=MRP 确定雇佣量，向下在劳动供给线上读取工资。' },
    generate: generateMonopsonyWageQuestion
  },
  {
    templateId: 'dyn-monopsony-vs-competitive',
    unit: 5,
    topicCode: '5.4',
    topicId: 'monopsony-factor-market',
    title: { en: 'Monopsony vs Perfectly Competitive Factor Market', zh: '买方垄断对比完全竞争要素市场' },
    description: { en: 'Compares wage markdown, underemployment, and factor market deadweight loss.', zh: '对比自由要素市场与买方垄断在工人工资、雇佣人数与无谓损失上的差异。' },
    generate: generateMonopsonyVsCompetitiveComparisonQuestion
  },
  {
    templateId: 'dyn-minimum-wage-monopsony',
    unit: 5,
    topicCode: '5.4',
    topicId: 'monopsony-factor-market',
    title: { en: 'Minimum Wage Paradox in Monopsonistic Labor Market', zh: '买方垄断下的法定最低工资增岗悖论' },
    description: { en: 'Shows how binding minimum wage can simultaneously increase wage and employment in monopsony.', zh: '推导在买方垄断下适度最低工资如何削平 MFC，实现薪资与就业双增。' },
    generate: generateMinimumWageMonopsonyQuestion
  },

  // Unit 6
  {
    templateId: 'dyn-externality-pigouvian-policy',
    unit: 6,
    topicCode: '6.2',
    topicId: 'negative-externalities',
    title: { en: 'Externalities & Pigouvian Corrective Tax/Subsidy', zh: '外部性与纠正性庇古税/庇古补贴' },
    description: { en: 'Determines the optimal per-unit tax or subsidy to internalize external costs/benefits.', zh: '确定消除外部性无谓损失所需的单位庇古税或补贴额。' },
    generate: generateExternalitiesQuestion
  },
  {
    templateId: 'dyn-public-goods-vertical-sum',
    unit: 6,
    topicCode: '6.3',
    topicId: 'public-goods-provision',
    title: { en: 'Public Goods: Vertical Summation of Willingness to Pay', zh: '公共物品：需求曲线垂直求和与最优供给' },
    description: { en: 'Vertically sums individual marginal benefits to determine MSB = MC provision.', zh: '纵向加总各人支付意愿，并在 MSB=MC 处确定最优公共供给量。' },
    generate: generatePublicGoodsQuestion
  },
  {
    templateId: 'dyn-lorenz-gini-calculation',
    unit: 6,
    topicCode: '6.5',
    topicId: 'lorenz-curve-gini',
    title: { en: 'Lorenz Curve, Gini Coefficient & Tax Progressivity', zh: '洛伦兹曲线、基尼系数与累进税制分配效应' },
    description: { en: 'Analyzes income inequality metrics and progressive redistribution policies.', zh: '分析基尼系数经济含义及累进所得税政策对洛伦兹曲线的改善效应。' },
    generate: generateLorenzGiniQuestion
  },
  {
    templateId: 'dyn-coase-theorem-property-rights',
    unit: 6,
    topicCode: '6.2',
    topicId: 'negative-externalities',
    title: { en: 'Coase Theorem & Private Bargaining of Externalities', zh: '科斯定理与低交易成本私人协商效率' },
    description: { en: 'Demonstrates private negotiation reaching the efficient outcome regardless of initial rights.', zh: '验证在明确产权和零交易成本下，私人谈判必能自发达成社会最优配置。' },
    generate: generateCoaseTheoremQuestion
  }
];

/**
 * Generates a single dynamic question filtered by unit or topic, or fully random.
 */
export function generateRandomDynamicQuestion(unit?: number, topicId?: string): PracticeQuestion {
  let pool = DYNAMIC_QUESTION_TEMPLATES;
  if (unit && unit > 0) {
    pool = pool.filter((t) => t.unit === unit);
  }
  if (topicId) {
    const topicFiltered = pool.filter((t) => t.topicId === topicId);
    if (topicFiltered.length > 0) pool = topicFiltered;
  }
  if (pool.length === 0) pool = DYNAMIC_QUESTION_TEMPLATES;

  const chosenTemplate = randomChoice(pool);
  return chosenTemplate.generate();
}

/**
 * Generates a fresh numerical variant of the exact same template.
 */
export function generateSimilarQuestion(templateId?: string): PracticeQuestion {
  const template = DYNAMIC_QUESTION_TEMPLATES.find((t) => t.templateId === templateId);
  if (template) {
    return template.generate();
  }
  return generateRandomDynamicQuestion();
}

/**
 * Generates a balanced mock exam adhering to official College Board unit weights.
 * Default is 15 questions for quick drills, or 30/60 for full exams.
 */
export function generateMockExamQuestions(count: number = 15): PracticeQuestion[] {
  // Unit weight distribution in College Board AP Microeconomics:
  // Unit 1: ~15%
  // Unit 2: ~25%
  // Unit 3: ~25%
  // Unit 4: ~15%
  // Unit 5: ~10%
  // Unit 6: ~10%
  const result: PracticeQuestion[] = [];
  const targetPerUnit: Record<number, number> = {
    1: Math.max(1, Math.round(count * 0.15)),
    2: Math.max(2, Math.round(count * 0.25)),
    3: Math.max(2, Math.round(count * 0.25)),
    4: Math.max(2, Math.round(count * 0.15)),
    5: Math.max(1, Math.round(count * 0.10)),
    6: Math.max(1, Math.round(count * 0.10))
  };

  for (let u = 1; u <= 6; u++) {
    const needed = targetPerUnit[u] || 1;
    const unitTemplates = DYNAMIC_QUESTION_TEMPLATES.filter((t) => t.unit === u);
    for (let i = 0; i < needed; i++) {
      const tmpl = unitTemplates[i % unitTemplates.length];
      result.push(tmpl.generate());
    }
  }

  // If count exceeds or falls short due to rounding, adjust with random questions
  while (result.length < count) {
    result.push(generateRandomDynamicQuestion());
  }

  // Shuffle order of questions so units are mixed realistically as on the real AP exam
  return result.slice(0, count).sort(() => Math.random() - 0.5);
}
