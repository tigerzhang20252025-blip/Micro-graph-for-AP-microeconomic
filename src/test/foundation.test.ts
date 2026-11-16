import { AP_TOPICS, AP_UNITS } from '../data/topicRegistry';
import { translations } from '../i18n/translations';
import { getModelById } from '../engine/models/index';
import { resolveGraphDomain } from '../engine/graphDomain';
import { GraphCalculationOutput, SecondaryGraphSpec } from '../types/graph';
import { LEARNING_ACTIVITIES } from '../data/learningActivities';
import { PRACTICE_QUESTIONS } from '../data/practiceQuestions';
import { AP_DECISION_RULES, AP_EXAM_MISTAKES, AP_FORMULAS } from '../data/referenceContent';
import {
  DYNAMIC_QUESTION_TEMPLATES,
  generateRandomDynamicQuestion,
  generateSimilarQuestion,
  generateMockExamQuestions
} from '../engine/generators';
import { productionFunctionModel } from '../engine/models/productionFunctionModel';
import { lratcModel } from '../engine/models/lratcModel';
import { publicGoodsModel } from '../engine/models/publicGoodsModel';
import { marketEquilibriumModel } from '../engine/models/marketEquilibriumModel';
import { ppcModel } from '../engine/models/ppcModel';
import { comparativeAdvantageModel } from '../engine/models/comparativeAdvantageModel';
import { elasticityModel } from '../engine/models/elasticityModel';
import { costCurvesModel } from '../engine/models/costCurvesModel';
import { perfectCompetitionModel } from '../engine/models/perfectCompetitionModel';
import { monopolyModel } from '../engine/models/monopolyModel';
import { gameTheoryModel } from '../engine/models/gameTheoryModel';
import { internationalTradeModel } from '../engine/models/internationalTradeModel';
import { monopolisticCompModel } from '../engine/models/monopolisticCompModel';
import { factorMarketModel } from '../engine/models/factorMarketModel';
import { externalitiesModel } from '../engine/models/externalitiesModel';
import { lorenzCurveModel } from '../engine/models/lorenzCurveModel';
import { utilityMaximizationModel } from '../engine/models/utilityMaximizationModel';
import { indifferenceCurveModel } from '../engine/models/indifferenceCurveModel';
import { cournotDuopolyModel } from '../engine/models/cournotDuopolyModel';
import { ECONOMIC_DICTIONARY } from '../data/economicDictionary';
import { searchDictionary, getTermById } from '../engine/search/dictionarySearch';
import { ECONOMIC_MODELS } from '../engine/models/index';
import { TOPIC_INITIAL_PARAMS } from '../context/AppStateContext';

console.log('==============================================');
console.log('🧪 AP MICROECONOMICS GRAPH LAB: COMPREHENSIVE AUDIT');
console.log('==============================================\n');

let failedTests = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failedTests++;
  }
}

// 1. Topic Registry & Scope Verification
console.log('--- 1. CED Topic Registry & Scope Classification ---');
assert(AP_UNITS.length === 6, 'All 6 official AP Microeconomics units registered');
assert(AP_TOPICS.length >= 18, `Topic registry contains ${AP_TOPICS.length} topics (>= 18)`);

const coreTopics = AP_TOPICS.filter(t => t.scope === 'core');
const extensionTopics = AP_TOPICS.filter(t => t.scope === 'extension');
const excludedTopics = AP_TOPICS.filter(t => t.scope === 'excluded');

assert(coreTopics.length >= 14, `Core AP Content classified: ${coreTopics.length} topics`);
assert(extensionTopics.length >= 2, `Optional Extensions classified: ${extensionTopics.length} topics`);
assert(excludedTopics.length >= 2, `Not in Current AP Exam Scope classified: ${excludedTopics.length} topics`);

const readyTopics = AP_TOPICS.filter(t => t.status === 'ready');
assert(readyTopics.length >= 16, `Active Interactive Models in Registry: ${readyTopics.length} topics`);

// Verify all ready topics resolve to a valid model in ECONOMIC_MODELS
for (const topic of readyTopics) {
  const model = getModelById(topic.id);
  assert(model !== undefined, `Topic "${topic.id}" resolves to registered EconomicModel`);
}

// 2. Translation Parity & Completeness
console.log('\n--- 2. Translation Parity & Terminology Check ---');
const enKeys = Object.keys(translations.en) as (keyof typeof translations.en)[];
const zhKeys = Object.keys(translations.zh) as (keyof typeof translations.zh)[];

assert(enKeys.length === zhKeys.length, `Translation key parity: EN has ${enKeys.length}, ZH has ${zhKeys.length}`);
const missingZh = enKeys.filter(k => !translations.zh[k] || translations.zh[k].trim() === '');
assert(missingZh.length === 0, `All ${enKeys.length} keys translated to Chinese`);

// 3. Batch 1 Verification: Market Equilibrium, Elasticity, PPC, Comparative Advantage
console.log('\n--- 3. Batch 1 Models Verification ---');
const baseEq = marketEquilibriumModel.calculate({ demandShift: 0, supplyShift: 0, taxPerUnit: 0, subsidyPerUnit: 0, priceControlMode: 'none', controlledPrice: 50, showBaselineComparison: false });
assert(baseEq.results.find(r => r.id === 'eqPrice')?.value === '$50.00', 'Market equilibrium P* = $50.00');

const taxedEq = marketEquilibriumModel.calculate({ demandShift: 0, supplyShift: 0, taxPerUnit: 16, subsidyPerUnit: 0, priceControlMode: 'none', controlledPrice: 50, showBaselineComparison: false });
assert(taxedEq.results.find(r => r.id === 'dwl')?.value === '$80.00', 'Tax DWL = $80.00');

const ceilingEq = marketEquilibriumModel.calculate({ demandShift: 0, supplyShift: 0, taxPerUnit: 0, subsidyPerUnit: 0, priceControlMode: 'ceiling', controlledPrice: 40, showBaselineComparison: false });
const ceilingDWL = ceilingEq.shadedAreas.find(s => s.id === 'dwl');
assert(ceilingDWL !== undefined && ceilingDWL.points.length === 3, 'Binding price ceiling generates non-degenerate DWL triangle');
const ceilingCS = ceilingEq.shadedAreas.find(s => s.id === 'cs');
assert(ceilingCS !== undefined && ceilingCS.points.length === 4, 'Binding price ceiling yields 4-point trapezoid Consumer Surplus');

const floorEq = marketEquilibriumModel.calculate({ demandShift: 0, supplyShift: 0, taxPerUnit: 0, subsidyPerUnit: 0, priceControlMode: 'floor', controlledPrice: 60, showBaselineComparison: false });
const floorPS = floorEq.shadedAreas.find(s => s.id === 'ps');
assert(floorPS !== undefined && floorPS.points.length === 4, 'Binding price floor yields 4-point trapezoid Producer Surplus');

const taxCeiling = marketEquilibriumModel.calculate({ demandShift: 0, supplyShift: 0, taxPerUnit: 20, subsidyPerUnit: 0, priceControlMode: 'ceiling', controlledPrice: 40, showBaselineComparison: false });
const taxCeilingPb = taxCeiling.points.find(p => p.id === 'buyerPricePoint');
const taxCeilingPs = taxCeiling.points.find(p => p.id === 'sellerPricePoint');
assert(taxCeilingPb?.y === 40 && taxCeilingPs?.y === 20, 'Tax plus binding price ceiling preserves the $20 buyer-seller wedge');
const subsidyFloor = marketEquilibriumModel.calculate({ demandShift: 0, supplyShift: 0, taxPerUnit: 0, subsidyPerUnit: 20, priceControlMode: 'floor', controlledPrice: 60, showBaselineComparison: false });
const subsidyFloorPb = subsidyFloor.points.find(p => p.id === 'buyerPriceSub');
const subsidyFloorPs = subsidyFloor.points.find(p => p.id === 'sellerPriceSub');
assert(subsidyFloorPb?.y === 60 && subsidyFloorPs?.y === 80, 'Subsidy plus binding price floor preserves the $20 buyer-seller wedge');
assert(subsidyFloor.explanation.en.includes('binding price control determines actual trade'), 'Combined subsidy and price-control explanation does not falsely claim overproduction');

const elasticityMid = elasticityModel.calculate({ priceLevel: 50, demandIntercept: 100, demandSlope: -1.0, crossPricePercentage: 10, crossGoodType: 'substitute', incomePercentage: 10, incomeGoodType: 'normal_necessity' });
assert(elasticityMid.results.find(r => r.id === 'pedValue')?.value === '1.00', 'Demand Midpoint |PED| = 1.00');
assert(elasticityMid.secondaryGraph !== undefined, 'Elasticity outputs secondary Total Revenue parabola');

const compAdv = comparativeAdvantageModel.calculate({ countryAMaxCars: 60, countryAMaxWheat: 120, countryBMaxCars: 40, countryBMaxWheat: 40, termsOfTradeCarToWheat: 1.5 });
assert(compAdv.results.find(r => r.id === 'oppCostCarB')?.value === '1.00 Wheat', 'Country B Car opportunity cost = 1.00 Wheat');
const equalCompAdv = comparativeAdvantageModel.calculate({ countryAMaxCars: 50, countryAMaxWheat: 100, countryBMaxCars: 25, countryBMaxWheat: 50, termsOfTradeCarToWheat: 2 });
assert(String((equalCompAdv.customTable?.rows[0].values[4] as any).en).includes('None'), 'Equal opportunity costs report no comparative advantage');

const ppcSample = ppcModel.calculate({ costShape: 'bowed', techConsumerGoods: 100, techCapitalGoods: 100, productionX: 60, showGrowthShift: false });
assert(ppcSample.curves.length > 0, 'PPC generates curve');

// 4. Batch 2 Verification: Production Cost Curves
console.log('\n--- 4. Batch 2: Short-Run Production Cost Curves (MC, ATC, AVC, AFC) ---');
const baseCosts = costCurvesModel.calculate({ fixedCost: 120, perUnitTax: 0, chosenQuantity: 24, showAFC: true, showAVC: true, showATC: true, showMC: true });
const atcVal = baseCosts.results.find(r => r.id === 'atcResult');
const avcVal = baseCosts.results.find(r => r.id === 'avcResult');
const afcVal = baseCosts.results.find(r => r.id === 'afcResult');

assert(atcVal !== undefined && avcVal !== undefined && afcVal !== undefined, 'Cost curves output ATC, AVC, AFC metrics');
assert(baseCosts.customTable !== undefined, 'Cost curves output full AP discrete cost schedule table');

// Lump-sum test: Fixed Cost changes from 120 to 220 -> ATC and AFC change, but AVC and MC do NOT change!
const lumpSumCosts = costCurvesModel.calculate({ fixedCost: 220, perUnitTax: 0, chosenQuantity: 24, showAFC: true, showAVC: true, showATC: true, showMC: true });
assert(lumpSumCosts.results.find(r => r.id === 'avcResult')?.value === baseCosts.results.find(r => r.id === 'avcResult')?.value, 'Lump-sum tax leaves AVC completely unchanged');
assert(lumpSumCosts.results.find(r => r.id === 'mcResult')?.value === baseCosts.results.find(r => r.id === 'mcResult')?.value, 'Lump-sum tax leaves MC completely unchanged');

// 5. Batch 2 Verification: Perfect Competition Side-by-Side Market & Firm
console.log('\n--- 5. Batch 2: Perfect Competition Side-by-Side (Market & Firm) ---');
const pcProfit = perfectCompetitionModel.calculate({ marketDemandShift: 18, firmFixedCost: 110, firmEntryExitAdjustment: 0 });
assert(pcProfit.secondaryGraph !== undefined, 'Perfect Competition outputs secondary Individual Firm graph');
const profitVal = String(pcProfit.results.find(r => r.id === 'firmProfitResult')?.value || '');
assert(profitVal.includes('+') || (!profitVal.includes('-') && profitVal !== '$0.0'), 'High demand leads to short-run economic profit');

const pcShutdown = perfectCompetitionModel.calculate({ marketDemandShift: -20, firmFixedCost: 110, firmEntryExitAdjustment: 0 });
assert(String(pcShutdown.results.find(r => r.id === 'firmQResult')?.value).includes('SHUTDOWN'), 'P < AVC triggers short-run shutdown rule (q = 0)');

const pcLongRun = perfectCompetitionModel.calculate({ marketDemandShift: 0, firmFixedCost: 110, firmEntryExitAdjustment: 0 });
assert(String(pcLongRun.results.find(r => r.id === 'longRunStatus')?.value).includes('Long-Run Equilibrium'), 'P ≈ min ATC is Long-Run Equilibrium without tolerance hack');
assert(pcLongRun.shadedAreas.find(s => s.id === 'market-cs') !== undefined, 'Market graph shades Consumer Surplus');
assert(pcLongRun.shadedAreas.find(s => s.id === 'market-ps') !== undefined, 'Market graph shades Producer Surplus');

// 6. Batch 2 Verification: Monopoly (Single-Price & Price Discrimination)
console.log('\n--- 6. Batch 2: Monopoly & Price Discrimination ---');
const monopolySingle = monopolyModel.calculate({ demandIntercept: 100, demandSlope: -1.0, mcSlope: 0.5, fixedCost: 180, isPriceDiscrimination: false, regulationType: 'none' });
assert(monopolySingle.results.find(r => r.id === 'monopolyQ')?.value === '36.0 units', 'Monopoly output Qm = 36.0 units');
assert(monopolySingle.results.find(r => r.id === 'monopolyP')?.value === '$64.0', 'Monopoly price on Demand curve Pm = $64.0');
assert(Number(String(monopolySingle.results.find(r => r.id === 'dwlResult')?.value).replace('$', '')) > 0, 'Single-price monopoly generates deadweight loss');
assert(monopolySingle.results.find(r => r.id === 'psResult') !== undefined, 'Monopoly calculates Producer Surplus');

const monopolyDiscrim = monopolyModel.calculate({ demandIntercept: 100, demandSlope: -1.0, mcSlope: 0.5, fixedCost: 180, isPriceDiscrimination: true, regulationType: 'none' });
assert(monopolyDiscrim.results.find(r => r.id === 'monopolyQ')?.value === '60.0 units', 'Price discrimination expands output to allocatively efficient 60.0 units');
assert(monopolyDiscrim.results.find(r => r.id === 'dwlResult')?.value === '$0.0', 'Price discrimination eliminates all deadweight loss (DWL = 0)');

const monopolyRegLoss = monopolyModel.calculate({ demandIntercept: 100, demandSlope: -1.0, mcSlope: 0.5, fixedCost: 2000, isPriceDiscrimination: false, regulationType: 'socially_optimal' });
assert(monopolyRegLoss.shadedAreas.find(s => s.id === 'monopolyLoss') !== undefined, 'Monopoly under socially optimal regulation with loss shades economic loss box');

// 7. Batch 2 Verification: Oligopoly & Game Theory Payoff Matrix
console.log('\n--- 7. Batch 2: Oligopoly & Game Theory Payoff Matrix ---');
const gameClassic = gameTheoryModel.calculate({
  presetScenario: 'prisoners_dilemma',
  tl1: 50, tl2: 50,
  tr1: 10, tr2: 80,
  bl1: 80, bl2: 10,
  br1: 25, br2: 25
});
assert(String(gameClassic.results.find(r => r.id === 'p1DomResult')?.value).includes('Low Price'), 'Firm 1 dominant strategy is Low Price (Defect)');
assert(String(gameClassic.results.find(r => r.id === 'p2DomResult')?.value).includes('Low Price'), 'Firm 2 dominant strategy is Low Price (Defect)');
assert(String(gameClassic.results.find(r => r.id === 'nashResult')?.value).includes('BR'), 'Nash Equilibrium is at Bottom-Right (BR)');
assert(String(gameClassic.results.find(r => r.id === 'dilemmaResult')?.value).includes('YES'), "Detected classic Prisoner's Dilemma");
assert(gameClassic.customTable !== undefined, 'Game theory outputs interactive 2x2 matrix schedule');

// 8. Batch 3 Verification: International Trade & Tariffs
console.log('\n--- 8. Batch 3: International Trade & Tariffs ---');
const tradeFree = internationalTradeModel.calculate({ worldPrice: 30, tariffPerUnit: 0, tradePolicy: 'free_trade' });
assert(tradeFree.results.find(r => r.id === 'domPrice')?.value === '$30.00', 'Free trade domestic price = World Price $30.00');
assert(tradeFree.results.find(r => r.id === 'dwlTotal')?.value === '$0.00', 'Free trade has zero deadweight loss');

const tradeTariff = internationalTradeModel.calculate({ worldPrice: 30, tariffPerUnit: 10, tradePolicy: 'tariff' });
assert(tradeTariff.results.find(r => r.id === 'domPrice')?.value === '$40.00', 'Tariff raises domestic price to $40.00');
assert(Number(String(tradeTariff.results.find(r => r.id === 'tariffRev')?.value).replace('$', '')) > 0, 'Tariff collects positive government revenue');
assert(tradeTariff.customTable !== undefined, 'International trade outputs CED welfare comparison table');

// 9. Batch 3 Verification: Monopolistic Competition
console.log('\n--- 9. Batch 3: Monopolistic Competition ---');
const monoCompLR = monopolisticCompModel.calculate({ marketPhase: 'long_run_tangency', demandIntercept: 90, demandSlope: 1.0, fixedCost: 360, marginalCostSlope: 0.5 });
assert(Number(String(monoCompLR.results.find(r => r.id === 'excessCapVal')?.value).split(' ')[0]) > 0, 'Monopolistic competition exhibits Excess Capacity in long run');
const profitLR = Number(String(monoCompLR.results.find(r => r.id === 'profitVal')?.value).replace('$', '').replace('+', ''));
assert(Math.abs(profitLR) < 5, 'Long-run tangency yields approximately zero economic profit');
assert(monoCompLR.shadedAreas.find(s => s.id === 'cs') !== undefined, 'Monopolistic competition in long run displays Consumer Surplus');
assert(monoCompLR.shadedAreas.find(s => s.id === 'dwl') !== undefined, 'Monopolistic competition in long run displays Deadweight Loss');
assert(monoCompLR.results.find(r => r.id === 'psVal') !== undefined, 'Monopolistic competition calculates Producer Surplus');

// 10. Batch 3 Verification: Factor Markets (Competitive & Monopsony)
console.log('\n--- 10. Batch 3: Factor Markets (Labor Supply, MRP, Monopsony) ---');
const monopsonyBase = factorMarketModel.calculate({ marketStructure: 'monopsony', laborProductPrice: 5, minWageRate: 0 });
assert(monopsonyBase.curves.find(c => c.id === 'mfc') !== undefined, 'Monopsony plots Marginal Factor Cost (MFC) curve');
assert(monopsonyBase.shadedAreas.find(s => s.id === 'mono-dwl') !== undefined, 'Monopsony generates Deadweight Loss from underemployment');

const compFactor = factorMarketModel.calculate({ marketStructure: 'competitive_firm', laborProductPrice: 5, minWageRate: 0 });
assert(compFactor.results.find(r => r.id === 'dwlVal')?.value === '$0.00', 'Competitive factor market has zero deadweight loss');
const monopsonyNonbindingFloor = factorMarketModel.calculate({ marketStructure: 'monopsony', laborProductPrice: 5, minWageRate: 10 });
assert(monopsonyNonbindingFloor.results.find(r => r.id === 'dwlVal')?.value !== '$0.00', 'Nonbinding monopsony minimum wage does not erase existing DWL');
const monopsonyHighFloor = factorMarketModel.calculate({ marketStructure: 'monopsony', laborProductPrice: 5, minWageRate: 55 });
assert(monopsonyHighFloor.results.find(r => r.id === 'dwlVal')?.value !== '$0.00', 'Excessive monopsony minimum wage reports DWL');

// 11. Batch 3 Verification: Externalities (Negative & Positive)
console.log('\n--- 11. Batch 3: Market Failure (Externalities & Pigouvian Policy) ---');
const negExtUnregulated = externalitiesModel.calculate({ externalityType: 'negative_production', externalityMagnitude: 24, correctivePolicyActive: false });
assert(Number(String(negExtUnregulated.results.find(r => r.id === 'dwlResult')?.value).replace('$', '')) > 0, 'Unregulated pollution generates deadweight loss');

const negExtPigouvian = externalitiesModel.calculate({ externalityType: 'negative_production', externalityMagnitude: 24, correctivePolicyActive: true });
assert(String(negExtPigouvian.results.find(r => r.id === 'dwlResult')?.value).includes('$0.00'), 'Pigouvian tax restores social efficiency (DWL = 0)');

const posExtUnregulated = externalitiesModel.calculate({ externalityType: 'positive_consumption', externalityMagnitude: 24, correctivePolicyActive: false });
assert(posExtUnregulated.curves.find(c => c.id === 'msb') !== undefined, 'Positive externality displays MSB > MPB');

// 12. Batch 3 Verification: Lorenz Curve & Gini Coefficient
console.log('\n--- 12. Batch 3: Income Inequality (Lorenz Curve & Gini) ---');
const lorenzBase = lorenzCurveModel.calculate({ inequalityExponent: 2.5, redistributionEffect: 0 });
const giniBase = Number(lorenzBase.results.find(r => r.id === 'giniResult')?.value);
assert(giniBase > 0.35 && giniBase < 0.50, `Gini coefficient correctly computed: ${giniBase}`);
assert(lorenzBase.customTable !== undefined, 'Lorenz model outputs quintile income distribution table');

const lorenzRedist = lorenzCurveModel.calculate({ inequalityExponent: 2.5, redistributionEffect: 30 });
const giniRedist = Number(lorenzRedist.results.find(r => r.id === 'giniResult')?.value);
assert(giniRedist < giniBase, `Progressive redistribution reduces Gini coefficient: ${giniBase} -> ${giniRedist}`);

// 13. Batch 3 Verification: Marginal Analysis & Utility Maximization
console.log('\n--- 13. Batch 3: Marginal Analysis & Utility Maximization ---');
const utilityModelResult = utilityMaximizationModel.calculate({ income: 40, priceX: 4, priceY: 8 });
assert(utilityModelResult.results.find(r => r.id === 'optBundle') !== undefined, 'Utility model computes optimal consumption bundle');
assert(utilityModelResult.customTable !== undefined, 'Utility model outputs AP discrete equi-marginal schedule');
const utilitySatiation = utilityMaximizationModel.calculate({ income: 80, priceX: 10, priceY: 2 });
assert(utilitySatiation.results.find(r => r.id === 'budgetSpent')?.value === '$74 / $80', 'Utility model does not buy zero-MU units merely to exhaust budget');

// 14. Batch 3 Verification: Optional Honors Extensions
console.log('\n--- 14. Optional Extensions (Indifference Curves & Cournot Duopoly) ---');
const icOpt = indifferenceCurveModel.calculate({ income: 120, priceX: 4, priceY: 6 });
assert(icOpt.curves.find(c => c.id === 'ic-tangent') !== undefined, 'Indifference curve tangency optimum computed');

const cournotOpt = cournotDuopolyModel.calculate({ demandIntercept: 120, marginalCost: 30, demandSlope: 1.0 });
assert(cournotOpt.results.find(r => r.id === 'cournotQ') !== undefined, 'Cournot duopoly outputs equilibrium quantities per firm');

// 15. Learning Mode & Prediction Activities Audit
console.log('\n--- 15. Learning Mode: Prediction-First Activities Audit ---');
assert(LEARNING_ACTIVITIES.length >= 7, `Learning activities registered: ${LEARNING_ACTIVITIES.length} (>= 7)`);

for (const act of LEARNING_ACTIVITIES) {
  assert(act.id.length > 0, `Activity "${act.id}" has valid ID`);
  assert(act.unit >= 1 && act.unit <= 6, `Activity "${act.id}" assigned to valid AP unit ${act.unit}`);
  assert(act.title.en.length > 0 && act.title.zh.length > 0, `Activity "${act.id}" has bilingual title`);
  assert(act.scenario.en.length > 0 && act.scenario.zh.length > 0, `Activity "${act.id}" has bilingual scenario`);
  assert(act.options.length >= 3, `Activity "${act.id}" has at least 3 prediction options`);
  
  const correctOptions = act.options.filter(o => o.isCorrect);
  assert(correctOptions.length === 1, `Activity "${act.id}" has exactly ONE correct prediction option`);

  // Verify connection to real economic model
  const model = getModelById(act.modelId);
  assert(model !== undefined, `Activity "${act.id}" links to valid registered EconomicModel "${act.modelId}"`);

  if (model) {
    const initCalc = model.calculate(act.graphInitialParams);
    assert(initCalc.curves.length > 0, `Activity "${act.id}" initial params calculate valid curves`);
    const targetCalc = model.calculate(act.graphTargetParams);
    assert(targetCalc.curves.length > 0, `Activity "${act.id}" target params calculate valid curves`);
  }
}

// 16. AP-Style Practice Questions Audit
console.log('\n--- 16. Practice Mode: AP-Style Questions & Distractor Audit ---');
assert(PRACTICE_QUESTIONS.length >= 10, `Practice question bank size: ${PRACTICE_QUESTIONS.length} questions (>= 10)`);

// Check unit coverage across all 6 AP units
for (let u = 1; u <= 6; u++) {
  const unitQs = PRACTICE_QUESTIONS.filter(q => q.unit === u);
  assert(unitQs.length >= 1, `AP Unit ${u} has at least 1 verified practice question (${unitQs.length} found)`);
}

for (const q of PRACTICE_QUESTIONS) {
  assert(q.prompt.en.length > 0 && q.prompt.zh.length > 0, `Question "${q.id}" has bilingual prompt`);
  assert(q.options.length === 4, `Question "${q.id}" has standard AP 4 options (A, B, C, D)`);
  const correctOpt = q.options.find(o => o.id === q.correctOptionId);
  assert(correctOpt !== undefined, `Question "${q.id}" correctOptionId "${q.correctOptionId}" matches an option`);
  assert(q.overallExplanation.en.length > 0 && q.overallExplanation.zh.length > 0, `Question "${q.id}" has bilingual explanation`);
  
  // Verify topicId resolves in AP_TOPICS
  const linkedTopic = AP_TOPICS.find(t => t.id === q.topicId);
  assert(linkedTopic !== undefined, `Question "${q.id}" links to valid registered topic "${q.topicId}"`);
}

// 17. Reference Mode Content Audit
console.log('\n--- 17. Reference Mode: Rules, Traps & Formulas Audit ---');
assert(AP_DECISION_RULES.length >= 4, `Core AP decision rules registered: ${AP_DECISION_RULES.length}`);
assert(AP_EXAM_MISTAKES.length >= 4, `Top AP exam traps registered: ${AP_EXAM_MISTAKES.length}`);
assert(AP_FORMULAS.length >= 3, `Essential AP formulas registered: ${AP_FORMULAS.length}`);

for (const rule of AP_DECISION_RULES) {
  assert(rule.condition.length > 0, `Rule "${rule.id}" specifies mathematical condition`);
}
for (const mistake of AP_EXAM_MISTAKES) {
  assert(mistake.wrongThinking.en.length > 0 && mistake.correctThinking.en.length > 0, `Mistake "${mistake.id}" has wrong vs correct comparison`);
}

// 18. CED Topic 3.1: Production Function (TP, MP, AP)
console.log('\n--- 18. Batch 4: Production Function (TP, MP, AP & Law of Diminishing Returns) ---');
const prodStage1 = productionFunctionModel.calculate({ labor: 4, capitalScale: 1.0 });
assert(String(prodStage1.results.find(r => r.label.en === 'Current Stage')?.value).includes('Stage I'), 'L=4 is in Stage I (Increasing returns)');

const prodStage2 = productionFunctionModel.calculate({ labor: 9, capitalScale: 1.0 });
assert(String(prodStage2.results.find(r => r.label.en === 'Current Stage')?.value).includes('Stage II'), 'L=9 is in Stage II (Rational zone, MP=AP)');
const apIntersection = prodStage2.points.find(p => p.id === 'pt-ap-max');
assert(apIntersection !== undefined && apIntersection.x === 9.0, 'MP cuts AP at exactly L = 9.0 (Peak AP)');

const prodStage3 = productionFunctionModel.calculate({ labor: 13, capitalScale: 1.0 });
assert(String(prodStage3.results.find(r => r.label.en === 'Current Stage')?.value).includes('Stage III'), 'L=13 is in Stage III (Negative returns, overcrowding)');

// 19. CED Topic 3.3: LRATC & Economies of Scale
console.log('\n--- 19. Batch 4: Long-Run Costs & Economies of Scale (LRATC Envelope & MES) ---');
const lratcEcon = lratcModel.calculate({ outputQ: 25, mesQuantity: 40, disQuantity: 75 });
assert(String(lratcEcon.results.find(r => r.label.en === 'Current Scale Phase')?.value).includes('Economies of Scale'), 'Q=25 operates under Economies of Scale');

const lratcConst = lratcModel.calculate({ outputQ: 55, mesQuantity: 40, disQuantity: 75 });
assert(String(lratcConst.results.find(r => r.label.en === 'Current Scale Phase')?.value).includes('Constant Returns'), 'Q=55 operates under Constant Returns to Scale');

const lratcDis = lratcModel.calculate({ outputQ: 95, mesQuantity: 40, disQuantity: 75 });
assert(String(lratcDis.results.find(r => r.label.en === 'Current Scale Phase')?.value).includes('Diseconomies of Scale'), 'Q=95 operates under Diseconomies of Scale');

// 20. CED Topic 6.3: Public Goods (Vertical Summation of Demand & Optimal Provision)
console.log('\n--- 20. Batch 4: Public Goods (Vertical Summation MSB = MB1 + MB2 & Optimal Provision) ---');
const publicGood = publicGoodsModel.calculate({ mb1Intercept: 35, mb2Intercept: 45, marginalCost: 40 });
const optQ = publicGood.results.find(r => r.label.en.includes('Socially Optimal Quantity'));
assert(optQ !== undefined && String(optQ.value).length > 0, `Optimal public good quantity calculated: ${optQ?.value}`);
assert(optQ?.value === '6.67 units', 'Public-good optimum satisfies MSB = MC at Q = 6.67');
const msbAtOpt = Number(String(publicGood.results.find(r => r.id === 'res-total-msb')?.value).replace('$', ''));
assert(Math.abs(msbAtOpt - 40) < 0.05, 'Public-good MSB at optimum equals marginal cost');
assert(publicGood.curves.some(c => c.shortLabel === 'MSB'), 'Public goods outputs vertical summation MSB curve');
assert(publicGood.curves.some(c => c.shortLabel === 'MC'), 'Public goods outputs constant/upward MC curve');

// 21. Dynamic Question Generator Engine Audit
console.log('\n--- 21. Dynamic Question Generator & Procedural Variation Audit ---');
assert(DYNAMIC_QUESTION_TEMPLATES.length >= 15, `Registered dynamic question templates: ${DYNAMIC_QUESTION_TEMPLATES.length} (>= 15)`);

// Check each template produces valid questions with valid math and bilingual parity
for (const tmpl of DYNAMIC_QUESTION_TEMPLATES) {
  const q = tmpl.generate();
  assert(q.prompt.en.length > 0 && q.prompt.zh.length > 0, `Template "${tmpl.templateId}" has bilingual prompt`);
  assert(q.options.length === 4, `Template "${tmpl.templateId}" generates exactly 4 options`);
  const correct = q.options.find(o => o.id === q.correctOptionId);
  assert(correct !== undefined, `Template "${tmpl.templateId}" has valid correctOptionId "${q.correctOptionId}"`);
  assert(q.overallExplanation.en.length > 0 && q.overallExplanation.zh.length > 0, `Template "${tmpl.templateId}" has bilingual overall explanation`);
}

// Check mock exam generation produces balanced 15 questions across units 1-6
const mockExamSample = generateMockExamQuestions(15);
assert(mockExamSample.length === 15, `Mock exam generator produces 15 questions`);
for (let u = 1; u <= 6; u++) {
  const hasUnit = mockExamSample.some(q => q.unit === u);
  assert(hasUnit, `Mock exam includes questions from Unit ${u}`);
}

// Check similar question generator produces question with same topic
const similarSample = generateSimilarQuestion('dyn-ppc-opp-cost');
assert(similarSample.topicId === 'ppc-model', 'Similar question generator matches target topicId');

// Check random dynamic question generator
const randomDyn = generateRandomDynamicQuestion(2);
assert(randomDyn.unit === 2, 'Random dynamic question filters to requested unit');

// 22. Economic Dictionary & Acronym Search Engine Audit
console.log('\n--- 22. Economic Dictionary & Acronym Search Engine Audit ---');
assert(ECONOMIC_DICTIONARY.length >= 50, `Dictionary contains ${ECONOMIC_DICTIONARY.length} terms (>= 50 terms across all 6 AP units)`);

// Check unit representation
for (let u = 1; u <= 6; u++) {
  const count = ECONOMIC_DICTIONARY.filter(t => t.unit === u).length;
  assert(count >= 3, `Unit ${u} has rich terminology representation: ${count} terms`);
}

// Check every term has valid bilingual content
for (const term of ECONOMIC_DICTIONARY) {
  assert(term.en.length > 0 && term.zh.length > 0, `Term "${term.id}" has bilingual title`);
  assert(term.definition.en.length > 0 && term.definition.zh.length > 0, `Term "${term.id}" has bilingual definition`);
  assert(term.unit >= 1 && term.unit <= 6, `Term "${term.id}" has valid unit ${term.unit}`);
  
  if (term.linkedModelId) {
    const model = getModelById(term.linkedModelId);
    assert(model !== undefined, `Term "${term.id}" linkedModelId "${term.linkedModelId}" resolves to registered model`);
  }

  for (const rc of term.relatedConcepts) {
    const target = getTermById(rc.termId);
    assert(target !== undefined, `Term "${term.id}" related concept "${rc.termId}" exists in dictionary`);
  }
}

// Search engine exact match checks
const mcResults = searchDictionary('MC');
assert(mcResults.length > 0 && (mcResults[0].abbreviation === 'MC' || mcResults[0].id === 'term-marginal-cost'), 'Search "MC" ranks Marginal Cost as #1');

const atcResults = searchDictionary('ATC');
assert(atcResults.length > 0 && atcResults[0].id === 'term-atc', 'Search "ATC" ranks Average Total Cost as #1');

const dwlResults = searchDictionary('DWL');
assert(dwlResults.length > 0 && dwlResults[0].id === 'term-deadweight-loss', 'Search "DWL" ranks Deadweight Loss as #1');

const mrpResults = searchDictionary('MRP');
assert(mrpResults.length > 0 && mrpResults[0].id === 'term-mrp', 'Search "MRP" ranks Marginal Revenue Product as #1');

const zhResults = searchDictionary('边际成本');
assert(zhResults.length > 0 && zhResults[0].id === 'term-marginal-cost', 'Search "边际成本" returns Marginal Cost');

// Parenthetical acronym and robust concept jumping search checks
const caParenResults = searchDictionary('Comparative Advantage (CA)');
assert(caParenResults.length > 0 && caParenResults[0].id === 'term-comparative-advantage', 'Search with parenthetical acronym "Comparative Advantage (CA)" ranks Comparative Advantage as #1');

const caAbbrResults = searchDictionary('CA');
assert(caAbbrResults.length > 0 && caAbbrResults[0].id === 'term-comparative-advantage', 'Search "CA" ranks Comparative Advantage as #1');

const caZhResults = searchDictionary('比较优势');
assert(caZhResults.length > 0 && caZhResults[0].id === 'term-comparative-advantage', 'Search "比较优势" ranks Comparative Advantage as #1');

const hhiResults = searchDictionary('HHI');
assert(hhiResults.length > 0 && hhiResults[0].id === 'term-herfindahl-index', 'Search "HHI" ranks Herfindahl-Hirschman Index as #1');

const trpeResults = searchDictionary('TRPE');
assert(trpeResults.length > 0 && trpeResults[0].id === 'term-total-revenue-test', 'Search "TRPE" ranks Total Revenue Test as #1');

const oooResults = searchDictionary('OOO Rule');
assert(oooResults.length > 0 && oooResults[0].id === 'term-output-method-ooo', 'Search "OOO Rule" ranks Output Method as #1');

const formulaResults = searchDictionary('d(TC)/dQ');
assert(formulaResults.some(t => t.id === 'term-marginal-cost'), 'Search formula "d(TC)/dQ" finds Marginal Cost');

// Filter checks
const unit3Filtered = searchDictionary('', { unit: 3 });
assert(unit3Filtered.every(t => t.unit === 3), 'Filter by Unit 3 returns only Unit 3 terms');

const costFiltered = searchDictionary('', { category: 'cost' });
assert(costFiltered.every(t => t.category === 'cost'), 'Filter by category "cost" returns only cost terms');

// 23. Full AP Micro Topic Coverage Dynamic Question Generator Audit
console.log('\n--- 23. Expanded 100% AP Topic Dynamic Generator Audit (31 Templates) ---');
assert(DYNAMIC_QUESTION_TEMPLATES.length >= 30, `Registered dynamic templates: ${DYNAMIC_QUESTION_TEMPLATES.length} (>= 30 covering all AP topics)`);

// Check each unit has at least 4 dynamic generators
for (let u = 1; u <= 6; u++) {
  const unitTemplates = DYNAMIC_QUESTION_TEMPLATES.filter(t => t.unit === u);
  assert(unitTemplates.length >= 4, `Unit ${u} has rich dynamic generator coverage: ${unitTemplates.length} templates`);
}

// Generate an instance from EVERY single one of the 31 templates and verify full validity
for (const tmpl of DYNAMIC_QUESTION_TEMPLATES) {
  const q = tmpl.generate();
  assert(q.prompt.en.length > 0 && q.prompt.zh.length > 0, `Template "${tmpl.templateId}" generates non-empty bilingual prompt`);
  assert(q.options.length === 4, `Template "${tmpl.templateId}" generates exactly 4 options`);
  const correct = q.options.find(o => o.id === q.correctOptionId);
  assert(correct !== undefined, `Template "${tmpl.templateId}" has valid correctOptionId "${q.correctOptionId}"`);
  assert(q.overallExplanation.en.length > 0 && q.overallExplanation.zh.length > 0, `Template "${tmpl.templateId}" has bilingual overall explanation`);
  assert(q.isDynamic === true, `Template "${tmpl.templateId}" produces questions marked isDynamic=true`);
}

// 24. Classic Archetypes to Dynamic Generator Mapping Audit
console.log('\n--- 24. Classic Archetype Mapping & Live Variant Generation Audit ---');
assert(PRACTICE_QUESTIONS.length >= 12, `Classic question archetypes: ${PRACTICE_QUESTIONS.length}`);

for (const q of PRACTICE_QUESTIONS) {
  assert(q.templateId !== undefined, `Classic question "${q.id}" has mapped templateId`);
  const targetTemplate = DYNAMIC_QUESTION_TEMPLATES.find(t => t.templateId === q.templateId);
  assert(targetTemplate !== undefined, `Classic question "${q.id}" templateId "${q.templateId}" exists in dynamic templates`);
  
  // Verify that generating a live variant produces a fresh valid question on the same topic
  const variant = generateSimilarQuestion(q.templateId);
  assert(variant.unit === q.unit, `Variant for "${q.id}" preserves unit ${q.unit}`);
  assert(variant.options.length === 4, `Variant for "${q.id}" produces 4 options`);
  assert(variant.isDynamic === true, `Variant for "${q.id}" is marked dynamic`);
}

// 25. Remediation Audit, Global Invariants, Schema & 250-Run Generator Fuzzing
console.log('\n--- 25. Remediation Audit, Model Invariants & 250-Run Fuzzing ---');

// 25a. Calibrated Perfect Competition Long-Run Equilibrium
assert(pcLongRun.results.find(r => r.id === 'marketPResult')?.value === '$35.00', 'Perfect Competition LR eq price hits exact $35.00');
const pcLrProfit = Number(String(pcLongRun.results.find(r => r.id === 'firmProfitResult')?.value).replace('$', '').replace('+', ''));
assert(Math.abs(pcLrProfit) < 0.05, `Perfect Competition LR profit hits $0.00 (got ${pcLrProfit})`);

// 25b. Monopolistic Competition Short-Run Loss & Long-Run Tangency
const monoLoss = monopolisticCompModel.calculate({ marketPhase: 'short_run_loss', demandIntercept: 75, demandSlope: 1.0, fixedCost: 500, marginalCostSlope: 0.5 });
const monoLossProfit = Number(String(monoLoss.results.find(r => r.id === 'profitVal')?.value).replace('$', '').replace('+', ''));
assert(monoLossProfit < -100, `Monopolistic competition short-run loss yields substantial loss (got ${monoLossProfit})`);
assert(monoLoss.shadedAreas.some(s => s.id === 'loss-rect' && s.visible && s.points.length === 4), 'Monopolistic competition short-run loss shades 4-point loss rectangle');

const monoTangency = monopolisticCompModel.calculate({ marketPhase: 'long_run_tangency', demandIntercept: 120, demandSlope: 1.0, fixedCost: 500, marginalCostSlope: 0.5 });
const monoTangencyProfit = Number(String(monoTangency.results.find(r => r.id === 'profitVal')?.value).replace('$', '').replace('+', ''));
assert(Math.abs(monoTangencyProfit) < 1, `Monopolistic competition long-run tangency hits zero profit (got ${monoTangencyProfit})`);

// 25c. LRATC Global Lower Envelope Invariant (SRATC_i(q) >= LRATC(q))
let lratcEnvelopeOk = true;
for (const mes of [25, 40, 55]) {
  for (const dis of [75, 90]) {
    const lratcOut = lratcModel.calculate({ outputQ: mes, mesQuantity: mes, disQuantity: dis, showSRATC: true, showScalePhases: true });
    const lratcCurve = lratcOut.curves.find(c => c.id === 'curve-lratc');
    if (!lratcCurve) {
      lratcEnvelopeOk = false;
      continue;
    }
    const sratcs = lratcOut.curves.filter(c => c.id.startsWith('sratc-'));
    if (sratcs.length !== 4) {
      lratcEnvelopeOk = false;
    }
    const evalLratcAt = (x: number): number | null => {
      for (let i = 0; i < lratcCurve.points.length - 1; i++) {
        const a = lratcCurve.points[i];
        const b = lratcCurve.points[i + 1];
        if (x >= a.x && x <= b.x && b.x > a.x) {
          const t = (x - a.x) / (b.x - a.x);
          return a.y + t * (b.y - a.y);
        }
      }
      return null;
    };
    for (const sCurve of sratcs) {
      let minGap = Infinity;
      for (const sPt of sCurve.points) {
        const lY = evalLratcAt(sPt.x);
        if (lY !== null) {
          const gap = sPt.y - lY;
          if (gap < -0.15) lratcEnvelopeOk = false;
          if (gap < minGap) minGap = gap;
        }
      }
      if (minGap > 0.5) lratcEnvelopeOk = false;
    }
  }
}
assert(lratcEnvelopeOk, 'LRATC forms true global lower envelope (SRATC >= LRATC everywhere with tangency)');

// 25d. Production Function Stage III negative MP below x-axis
const prodStage3Neg = productionFunctionModel.calculate({ labor: 15, capitalScale: 1.0 });
const ptCurrL = prodStage3Neg.points.find(p => p.id === 'pt-current-l');
assert(ptCurrL !== undefined && ptCurrL.y < 0 && prodStage3Neg.axes.yMin < 0, 'Production function Stage III places negative MP point below x-axis');

// 25e. Cost Curves table row deduplication when TFC=40 coincides with sample Q
const costTfc40 = costCurvesModel.calculate({ fixedCost: 40, variableCostMultiplier: 1.0, lumpSumTax: 0, outputQ: 5 });
const costRowIds = (costTfc40.customTable?.rows || []).map(r => r.id);
assert(new Set(costRowIds).size === costRowIds.length, 'Cost curves table rows have strictly unique IDs when fixedCost=40');

// 25f. Utility Maximization dynamic yMax covers high-budget optima
const utilExtreme = utilityMaximizationModel.calculate({ income: 64, priceX: 2, priceY: 2 });
assert(utilExtreme.axes.yMax >= 32, `Utility maximization yMax expands dynamically for high budgets (yMax=${utilExtreme.axes.yMax})`);

// 25g. Market Equilibrium combined intervention DWL + International Trade autarky DWL
for (const cfg of [
  { demandShift: 0, supplyShift: 0, taxPerUnit: 20, subsidyPerUnit: 0, priceControlMode: 'ceiling', controlledPrice: 40, showBaselineComparison: false },
  { demandShift: 0, supplyShift: 0, taxPerUnit: 20, subsidyPerUnit: 0, priceControlMode: 'floor', controlledPrice: 60, showBaselineComparison: false },
  { demandShift: 0, supplyShift: 0, taxPerUnit: 0, subsidyPerUnit: 20, priceControlMode: 'ceiling', controlledPrice: 40, showBaselineComparison: false },
  { demandShift: 0, supplyShift: 0, taxPerUnit: 0, subsidyPerUnit: 20, priceControlMode: 'floor', controlledPrice: 60, showBaselineComparison: false }
]) {
  const res = marketEquilibriumModel.calculate(cfg);
  const dwlArea = res.shadedAreas.find(s => s.id === 'dwl');
  assert(dwlArea !== undefined && dwlArea.visible && dwlArea.points.length === 3, `Combined market intervention (${cfg.taxPerUnit > 0 ? 'tax' : 'subsidy'} + ${cfg.priceControlMode}) emits 3-point DWL triangle`);
}

const autarkyTrade = internationalTradeModel.calculate({ tradePolicy: 'autarky', tariffPerUnit: 0, worldPrice: 20 });
assert(
  autarkyTrade.shadedAreas.some(s => s.id === 'dwlProdArea' && s.visible && s.points.length === 3) &&
  autarkyTrade.shadedAreas.some(s => s.id === 'dwlConsArea' && s.visible && s.points.length === 3),
  'International Trade autarky renders both DWL triangles without tariff revenue'
);

// 25h. Monopsony minimum wage = competitive equilibrium wage ($32.00)
const monoBaseline = factorMarketModel.calculate({ marketStructure: 'monopsony', laborProductPrice: 5, marginalProductBase: 24, mpDiminishingRate: 1.2, laborSupplyBase: 10, laborSupplySlope: 1.5, minWageRate: 0 });
const monoMinWage = factorMarketModel.calculate({ marketStructure: 'monopsony', laborProductPrice: 5, marginalProductBase: 24, mpDiminishingRate: 1.2, laborSupplyBase: 10, laborSupplySlope: 1.5, minWageRate: 32 });
const baseL = parseFloat(String(monoBaseline.results.find(r => r.id === 'actualL')?.value || '0'));
const mwL = parseFloat(String(monoMinWage.results.find(r => r.id === 'actualL')?.value || '0'));
assert(monoMinWage.results.find(r => r.id === 'actualW')?.value === '$32.00/hr' && mwL > baseL, 'Monopsony $32 minimum wage equals competitive wage and expands employment');
assert(monoMinWage.points.some(p => p.id === 'min-wage-outcome'), 'Monopsony minimum wage emits E_min outcome point');

// 25i. Monopoly Fair-Return & Lorenz Zero-Inequality & Game Theory 4-cell matrix
const monoFairReturn = monopolyModel.calculate({ isPriceDiscrimination: false, regulationType: 'fair_return', demandIntercept: 100, demandSlope: 1.0, fixedCost: 500, mcMultiplier: 1.0 });
const fairProfit = Number(String(monoFairReturn.results.find(r => r.id === 'profitResult')?.value).replace('$', '').replace('+', ''));
assert(Math.abs(fairProfit) < 0.05, `Monopoly fair-return solves exact P = ATC ($0 profit, got ${fairProfit})`);

const zeroIneq = lorenzCurveModel.calculate({ inequalityExponent: 1.0, redistributionEffect: 0 });
assert(zeroIneq.results.every(r => !String(r.value).includes('NaN') && !String(r.value).includes('Infinity')), 'Lorenz zero-inequality case produces finite results without div-by-zero');

const gtOut = gameTheoryModel.calculate({ tl1: 10, tl2: 10, tr1: 50, tr2: 50, bl1: 5, bl2: 50, br1: 20, br2: 20 });
assert(gtOut.customTable !== undefined && gtOut.customTable.rows.length > 0, 'Game theory computes matrix outcomes with asymmetric TR/BL controls');

// 25j. All 19 Unique Economic Models: Preset & Extreme Slider Invariant Sweep
const uniqueModels = Array.from(new Map(Object.values(ECONOMIC_MODELS).map(m => [m.id, m])).values());
let allModelsSweepOk = true;
for (const model of uniqueModels) {
  const paramSets: Array<Record<string, any>> = [model.defaultParams];
  for (const preset of model.presets || []) {
    paramSets.push({ ...model.defaultParams, ...preset.params });
  }
  const minParams = { ...model.defaultParams };
  const maxParams = { ...model.defaultParams };
  for (const ctrl of model.controls) {
    if (ctrl.type === 'slider' && ctrl.min !== undefined && ctrl.max !== undefined) {
      minParams[ctrl.id] = ctrl.min;
      maxParams[ctrl.id] = ctrl.max;
    }
  }
  paramSets.push(minParams, maxParams);

  for (const pSet of paramSets) {
    const out = model.calculate(pSet);
    if (!out || out.curves.length === 0 || !out.explanation.en || !out.explanation.zh) {
      console.error(`Model invariant failed (empty output) for ${model.id}`);
      allModelsSweepOk = false;
    }
    const allGraphs = [out, ...(out.secondaryGraph ? [out.secondaryGraph] : [])];
    for (const g of allGraphs) {
      if (!Number.isFinite(g.axes.xMin) || !Number.isFinite(g.axes.xMax) || !Number.isFinite(g.axes.yMin) || !Number.isFinite(g.axes.yMax)) {
        console.error(`Non-finite axis bounds in ${model.id}`);
        allModelsSweepOk = false;
      }
      for (const c of g.curves) {
        if (c.points.some(pt => !Number.isFinite(pt.x) || !Number.isFinite(pt.y))) {
          console.error(`Non-finite curve point in ${model.id}.${c.id}`);
          allModelsSweepOk = false;
        }
      }
      for (const pt of g.points) {
        if (!Number.isFinite(pt.x) || !Number.isFinite(pt.y)) {
          console.error(`Non-finite key point in ${model.id}.${pt.id}`);
          allModelsSweepOk = false;
        }
      }
      for (const area of g.shadedAreas || []) {
        if (area.points.some(pt => !Number.isFinite(pt.x) || !Number.isFinite(pt.y))) {
          console.error(`Non-finite polygon vertex in ${model.id}.${area.id}`);
          allModelsSweepOk = false;
        }
      }
    }
    if (out.customTable) {
      const rIds = out.customTable.rows.map(r => r.id);
      if (new Set(rIds).size !== rIds.length) {
        console.error(`Duplicate customTable row IDs in ${model.id}`);
        allModelsSweepOk = false;
      }
    }
  }
}
assert(allModelsSweepOk, `All ${uniqueModels.length} unique economic models pass preset & extreme-slider finite/uniqueness sweep`);

// 25k. TOPIC_INITIAL_PARAMS Schema & Runtime Sweep
let topicSchemaOk = true;
for (const [topicId, overrideParams] of Object.entries(TOPIC_INITIAL_PARAMS)) {
  const topic = AP_TOPICS.find(t => t.id === topicId);
  const model = getModelById(topicId);
  if (!topic || !model) {
    console.error(`TOPIC_INITIAL_PARAMS entry "${topicId}" missing topic or model`);
    topicSchemaOk = false;
    continue;
  }
  const defaultKeys = new Set(Object.keys(model.defaultParams));
  for (const k of Object.keys(overrideParams)) {
    if (!defaultKeys.has(k)) {
      console.error(`TOPIC_INITIAL_PARAMS["${topicId}"] sets unknown key "${k}"`);
      topicSchemaOk = false;
    }
  }
  const out = model.calculate({ ...model.defaultParams, ...overrideParams });
  if (!out || out.curves.length === 0) {
    topicSchemaOk = false;
  }
}
assert(topicSchemaOk, `All ${Object.keys(TOPIC_INITIAL_PARAMS).length} TOPIC_INITIAL_PARAMS presets match model schemas and compute valid curves`);

const shutdownPresetModel = getModelById('shutdown-rule')!;
const shutdownPresetOut = shutdownPresetModel.calculate({ ...shutdownPresetModel.defaultParams, ...TOPIC_INITIAL_PARAMS['shutdown-rule'] });
assert(String(shutdownPresetOut.results.find(r => r.id === 'firmQResult')?.value).includes('SHUTDOWN'), 'TOPIC_INITIAL_PARAMS["shutdown-rule"] triggers SHUTDOWN state in Perfect Competition');

// 25l. Learning Activity Monopsony Consistency
const monoActivity = LEARNING_ACTIVITIES.find(a => a.id === 'learn-monopsony-minimum-wage');
assert(
  monoActivity !== undefined &&
  monoActivity.graphTargetParams.minWageRate === 32 &&
  monoActivity.scenario.en.includes('12.2') &&
  monoActivity.scenario.en.includes('28.33') &&
  monoActivity.options.some(o => o.isCorrect && o.label.en.includes('14.7')),
  'Learning activity "learn-monopsony-minimum-wage" numbers match factorMarketModel math (12.2 -> 14.7, $28.33 -> $32)'
);

// 25m. 250-Run Fuzz Test Across All 31 Dynamic Generators
let fuzzOk = true;
for (const tmpl of DYNAMIC_QUESTION_TEMPLATES) {
  for (let iter = 0; iter < 250; iter++) {
    const q = tmpl.generate();
    const enSet = new Set(q.options.map(o => o.text.en.trim()));
    const zhSet = new Set(q.options.map(o => o.text.zh.trim()));
    if (enSet.size !== 4 || zhSet.size !== 4) {
      console.error(`Colliding options in ${tmpl.templateId}:`, q.options.map(o => o.text.en));
      fuzzOk = false;
      break;
    }
    const allText = [q.prompt.en, q.prompt.zh, q.overallExplanation.en, q.overallExplanation.zh, ...q.options.flatMap(o => [o.text.en, o.text.zh, o.explanation.en, o.explanation.zh])].join(' | ');
    if (/\b(NaN|undefined|Infinity)\b|(\b[123]th\b)|\bWhea\b|0000000/.test(allText)) {
      console.error(`Bad string artifact in ${tmpl.templateId}: ${allText}`);
      fuzzOk = false;
      break;
    }
    if (tmpl.templateId === 'dyn-cross-income-elasticity') {
      const mPct = q.prompt.en.match(/rises by (\d+)%[^.]*?changes by (-?\d+)%/);
      if (mPct) {
        const denom = Number(mPct[1]);
        const numer = Number(mPct[2]);
        const ratio = (numer / denom).toFixed(2);
        const corrOpt = q.options.find(o => o.id === q.correctOptionId)!;
        if (!corrOpt.text.en.includes(ratio.replace('-', '')) && !corrOpt.text.en.includes(ratio)) {
          console.error(`Elasticity arithmetic mismatch in ${tmpl.templateId}: ${numer}/${denom}=${ratio}, opt=${corrOpt.text.en}`);
          fuzzOk = false;
          break;
        }
      }
    }
  }
}
assert(fuzzOk, `250-run fuzz audit passes across all ${DYNAMIC_QUESTION_TEMPLATES.length} dynamic question generators (zero collisions, zero NaN/typo/arithmetic bugs)`);

// 26. Graph Content Visibility & Axis Expansion Audit (adapted from origin/main 04cf726)
console.log('\n--- 26. Graph Content Visibility & Axis Expansion Audit ---');

const graphVisibilityErrors: string[] = [];
const auditGraphVisibility = (
  modelId: string,
  caseName: string,
  graphName: string,
  graph: GraphCalculationOutput | SecondaryGraphSpec
) => {
  const graphAreas = graph.shadedAreas || [];
  const domain = resolveGraphDomain({
    axes: graph.axes,
    curves: graph.curves,
    points: graph.points,
    shadedAreas: graphAreas
  }).axes;
  const tolerance = 1e-7;
  const inDomain = (x: number, y: number) =>
    Number.isFinite(x) &&
    Number.isFinite(y) &&
    x >= domain.xMin - tolerance &&
    x <= domain.xMax + tolerance &&
    y >= domain.yMin - tolerance &&
    y <= domain.yMax + tolerance;

  for (const pt of graph.points) {
    if (!inDomain(pt.x, pt.y)) {
      graphVisibilityErrors.push(`${modelId}/${caseName}/${graphName}/point:${pt.id}: (${pt.x}, ${pt.y}) outside resolved domain`);
    }
  }
  for (const area of graphAreas.filter((a) => a.visible)) {
    area.points.forEach((pt, idx) => {
      if (!inDomain(pt.x, pt.y)) {
        graphVisibilityErrors.push(`${modelId}/${caseName}/${graphName}/area:${area.id}[${idx}]: (${pt.x}, ${pt.y}) outside resolved domain`);
      }
    });
  }
  for (const curve of graph.curves.filter((c) => c.visible && c.points.length > 0)) {
    const hasVisiblePortion = curve.points.some((pt) => inDomain(pt.x, pt.y));
    if (!hasVisiblePortion) {
      graphVisibilityErrors.push(`${modelId}/${caseName}/${graphName}/curve:${curve.id}: completely outside resolved domain`);
    }
  }
};

for (const model of uniqueModels) {
  const cases: Array<{ name: string; params: Record<string, any> }> = [
    { name: 'defaults', params: { ...model.defaultParams } },
    ...(model.presets || []).map((preset) => ({
      name: `preset:${preset.id}`,
      params: { ...model.defaultParams, ...preset.params }
    }))
  ];

  for (const control of model.controls) {
    if (control.type === 'slider') {
      cases.push(
        { name: `${control.id}:min`, params: { ...model.defaultParams, [control.id]: control.min } },
        { name: `${control.id}:max`, params: { ...model.defaultParams, [control.id]: control.max } }
      );
    } else if (control.type === 'select' && control.options) {
      for (const option of control.options) {
        cases.push({ name: `${control.id}:${option.id}`, params: { ...model.defaultParams, [control.id]: option.id } });
      }
    } else if (control.type === 'toggle') {
      cases.push(
        { name: `${control.id}:off`, params: { ...model.defaultParams, [control.id]: false } },
        { name: `${control.id}:on`, params: { ...model.defaultParams, [control.id]: true } }
      );
    }
  }

  for (const testCase of cases) {
    try {
      const output = model.calculate(testCase.params);
      auditGraphVisibility(model.id, testCase.name, 'primary', output);
      if (output.secondaryGraph) auditGraphVisibility(model.id, testCase.name, 'secondary', output.secondaryGraph);
    } catch (error) {
      graphVisibilityErrors.push(`${model.id}/${testCase.name}: calculation threw ${String(error)}`);
    }
  }
}

assert(
  graphVisibilityErrors.length === 0,
  graphVisibilityErrors.length === 0
    ? `All ${uniqueModels.length} models keep key points, shaded areas, and visible curves inside resolved axes across defaults, presets, and control boundaries`
    : `Graph visibility audit found ${graphVisibilityErrors.length} issues:\n${graphVisibilityErrors.slice(0, 12).join('\n')}`
);

console.log('\n==============================================');
if (failedTests === 0) {
  console.log('🎉 ALL 26 AUDIT SUITES PASSED WITH 0 FAILURES!');
  console.log('💎 100% COMPLETE AP MICROECONOMICS GRAPH, 31-TEMPLATE DYNAMIC PRACTICE & ANTI-COLLISION ENGINE VERIFIED!');
} else {
  console.error(`💥 AUDIT FAILED WITH ${failedTests} FAILURES`);
  process.exit(1);
}
console.log('==============================================\n');
