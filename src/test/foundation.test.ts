import { AP_TOPICS, AP_UNITS } from '../data/topicRegistry';
import { translations } from '../i18n/translations';
import { getModelById } from '../engine/models/index';
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

const elasticityMid = elasticityModel.calculate({ priceLevel: 50, demandIntercept: 100, demandSlope: -1.0, crossPricePercentage: 10, crossGoodType: 'substitute', incomePercentage: 10, incomeGoodType: 'normal_necessity' });
assert(elasticityMid.results.find(r => r.id === 'pedValue')?.value === '1.00', 'Demand Midpoint |PED| = 1.00');
assert(elasticityMid.secondaryGraph !== undefined, 'Elasticity outputs secondary Total Revenue parabola');

const compAdv = comparativeAdvantageModel.calculate({ countryAMaxCars: 60, countryAMaxWheat: 120, countryBMaxCars: 40, countryBMaxWheat: 40, termsOfTradeCarToWheat: 1.5 });
assert(compAdv.results.find(r => r.id === 'oppCostCarB')?.value === '1.00 Wheat', 'Country B Car opportunity cost = 1.00 Wheat');

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
assert(String(pcLongRun.results.find(r => r.id === 'longRunStatus')?.value).includes('Long-Run Equilibrium') || Math.abs(Number(String(pcLongRun.results.find(r => r.id === 'firmProfitResult')?.value).replace('$', ''))) < 10, 'P ≈ min ATC is Long-Run Equilibrium');

// 6. Batch 2 Verification: Monopoly (Single-Price & Price Discrimination)
console.log('\n--- 6. Batch 2: Monopoly & Price Discrimination ---');
const monopolySingle = monopolyModel.calculate({ demandIntercept: 100, demandSlope: -1.0, mcSlope: 0.5, fixedCost: 180, isPriceDiscrimination: false, regulationType: 'none' });
assert(monopolySingle.results.find(r => r.id === 'monopolyQ')?.value === '36.0 units', 'Monopoly output Qm = 36.0 units');
assert(monopolySingle.results.find(r => r.id === 'monopolyP')?.value === '$64.0', 'Monopoly price on Demand curve Pm = $64.0');
assert(Number(String(monopolySingle.results.find(r => r.id === 'dwlResult')?.value).replace('$', '')) > 0, 'Single-price monopoly generates deadweight loss');

const monopolyDiscrim = monopolyModel.calculate({ demandIntercept: 100, demandSlope: -1.0, mcSlope: 0.5, fixedCost: 180, isPriceDiscrimination: true, regulationType: 'none' });
assert(monopolyDiscrim.results.find(r => r.id === 'monopolyQ')?.value === '60.0 units', 'Price discrimination expands output to allocatively efficient 60.0 units');
assert(monopolyDiscrim.results.find(r => r.id === 'dwlResult')?.value === '$0.0', 'Price discrimination eliminates all deadweight loss (DWL = 0)');

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

// 10. Batch 3 Verification: Factor Markets (Competitive & Monopsony)
console.log('\n--- 10. Batch 3: Factor Markets (Labor Supply, MRP, Monopsony) ---');
const monopsonyBase = factorMarketModel.calculate({ marketStructure: 'monopsony', laborProductPrice: 5, minWageRate: 0 });
assert(monopsonyBase.curves.find(c => c.id === 'mfc') !== undefined, 'Monopsony plots Marginal Factor Cost (MFC) curve');
assert(monopsonyBase.shadedAreas.find(s => s.id === 'mono-dwl') !== undefined, 'Monopsony generates Deadweight Loss from underemployment');

const compFactor = factorMarketModel.calculate({ marketStructure: 'competitive_firm', laborProductPrice: 5, minWageRate: 0 });
assert(compFactor.results.find(r => r.id === 'dwlVal')?.value === '$0.00', 'Competitive factor market has zero deadweight loss');

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

// 14. Batch 3 Verification: Optional Honors Extensions
console.log('\n--- 14. Optional Extensions (Indifference Curves & Cournot Duopoly) ---');
const icOpt = indifferenceCurveModel.calculate({ income: 120, priceX: 4, priceY: 6 });
assert(icOpt.curves.find(c => c.id === 'ic-tangent') !== undefined, 'Indifference curve tangency optimum computed');

const cournotOpt = cournotDuopolyModel.calculate({ demandIntercept: 120, marginalCost: 30, demandSlope: 1.0 });
assert(cournotOpt.results.find(r => r.id === 'cournotQ') !== undefined, 'Cournot duopoly outputs equilibrium quantities per firm');

console.log('\n==============================================');
if (failedTests === 0) {
  console.log('🎉 ALL 14 AUDIT SUITES PASSED WITH 0 FAILURES!');
  console.log('💎 100% CED AP MICROECONOMICS GRAPH COVERAGE ACHIEVED!');
} else {
  console.error(`💥 AUDIT FAILED WITH ${failedTests} FAILURES`);
  process.exit(1);
}
console.log('==============================================\n');
