import { PracticeQuestion } from '../../data/practiceQuestions';
import { DynamicQuestionTemplate } from '../../types/practice';
import { randomChoice } from './helper';

import {
  generatePpcOppCostQuestion,
  generateComparativeAdvantageQuestion,
  generateUtilityMaximizationQuestion
} from './unit1Generators';

import {
  generateMarketEquilibriumSurplusQuestion,
  generateElasticityTotalRevenueQuestion,
  generateExciseTaxDwlQuestion,
  generatePriceControlQuestion
} from './unit2Generators';

import {
  generateProductionStagesQuestion,
  generateCostTaxShiftQuestion,
  generateShutdownDecisionQuestion
} from './unit3Generators';

import {
  generateMonopolyPricingQuestion,
  generateGameTheoryPayoffQuestion
} from './unit4Generators';

import {
  generateFactorMarketHiringQuestion,
  generateMonopsonyWageQuestion
} from './unit5Generators';

import {
  generateExternalitiesQuestion,
  generatePublicGoodsQuestion
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
