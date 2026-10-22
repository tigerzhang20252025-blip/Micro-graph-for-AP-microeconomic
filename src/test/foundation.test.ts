import { AP_TOPICS, AP_UNITS } from '../data/topicRegistry';
import { translations } from '../i18n/translations';
import { marketEquilibriumModel } from '../engine/models/marketEquilibriumModel';
import { ppcModel } from '../engine/models/ppcModel';
import { comparativeAdvantageModel } from '../engine/models/comparativeAdvantageModel';
import { elasticityModel } from '../engine/models/elasticityModel';
import { costCurvesModel } from '../engine/models/costCurvesModel';
import { perfectCompetitionModel } from '../engine/models/perfectCompetitionModel';
import { monopolyModel } from '../engine/models/monopolyModel';
import { gameTheoryModel } from '../engine/models/gameTheoryModel';

console.log('==============================================');
console.log('🧪 AP MICROECONOMICS GRAPH LAB: BATCH 1 & 2 AUDIT');
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
assert(readyTopics.length >= 10, `Active Interactive Models in Registry: ${readyTopics.length} topics`);

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
// Unregulated Monopoly: Demand P = 100 - Q, MC = 10 + 0.5Q
// MR = 100 - 2Q. MR = MC => 100 - 2Q = 10 + 0.5Q => 2.5Q = 90 => Qm = 36. Pm = 100 - 36 = 64.
const monopolySingle = monopolyModel.calculate({ demandIntercept: 100, demandSlope: -1.0, mcSlope: 0.5, fixedCost: 180, isPriceDiscrimination: false, regulationType: 'none' });
assert(monopolySingle.results.find(r => r.id === 'monopolyQ')?.value === '36.0 units', 'Monopoly output Qm = 36.0 units');
assert(monopolySingle.results.find(r => r.id === 'monopolyP')?.value === '$64.0', 'Monopoly price on Demand curve Pm = $64.0');
assert(Number(String(monopolySingle.results.find(r => r.id === 'dwlResult')?.value).replace('$', '')) > 0, 'Single-price monopoly generates deadweight loss');

// Perfect Price Discrimination: Q expands to Q_so = 60, DWL = 0
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

console.log('\n==============================================');
if (failedTests === 0) {
  console.log('🎉 ALL BATCH 1 & BATCH 2 AUDIT TESTS PASSED (0 FAILURES)');
} else {
  console.error(`💥 AUDIT FAILED WITH ${failedTests} FAILURES`);
  process.exit(1);
}
console.log('==============================================\n');
