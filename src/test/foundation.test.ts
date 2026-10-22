import { AP_TOPICS, AP_UNITS } from '../data/topicRegistry';
import { translations } from '../i18n/translations';
import { marketEquilibriumModel } from '../engine/models/marketEquilibriumModel';
import { ppcModel } from '../engine/models/ppcModel';
import { comparativeAdvantageModel } from '../engine/models/comparativeAdvantageModel';
import { elasticityModel } from '../engine/models/elasticityModel';

console.log('==============================================');
console.log('🧪 AP MICROECONOMICS GRAPH LAB: BATCH 1 AUDIT');
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
assert(readyTopics.length >= 5, `Active Interactive Models in Registry: ${readyTopics.length} topics`);

// 2. Translation Parity & Completeness
console.log('\n--- 2. Translation Parity & Terminology Check ---');
const enKeys = Object.keys(translations.en) as (keyof typeof translations.en)[];
const zhKeys = Object.keys(translations.zh) as (keyof typeof translations.zh)[];

assert(enKeys.length === zhKeys.length, `Translation key parity: EN has ${enKeys.length}, ZH has ${zhKeys.length}`);

const missingZh = enKeys.filter(k => !translations.zh[k] || translations.zh[k].trim() === '');
const missingEn = zhKeys.filter(k => !translations.en[k] || translations.en[k].trim() === '');

assert(missingZh.length === 0, `All ${enKeys.length} keys translated to Chinese (missing: ${missingZh.length})`);
assert(missingEn.length === 0, `All ${zhKeys.length} keys translated to English (missing: ${missingEn.length})`);

assert(translations.en.langSwitchButton === '中文', 'English view toggle button displays "中文"');
assert(translations.zh.langSwitchButton === 'English', 'Chinese view toggle button displays "English"');

// 3. Batch 1 Mathematical & Economic Engine Tests
console.log('\n--- 3. Batch 1: Market Equilibrium, Taxes, Subsidies & Price Controls ---');
// Baseline Market Equilibrium: P = 90 - 0.8Q, P = 10 + 0.8Q -> Q* = 50, P* = 50
const baseEqOutput = marketEquilibriumModel.calculate({ demandShift: 0, supplyShift: 0, taxPerUnit: 0, subsidyPerUnit: 0, priceControlMode: 'none', controlledPrice: 50, showBaselineComparison: false });
const pMetric = baseEqOutput.results.find(r => r.id === 'eqPrice');
const qMetric = baseEqOutput.results.find(r => r.id === 'eqQuantity');
const dwlMetric = baseEqOutput.results.find(r => r.id === 'dwl');

assert(pMetric?.value === '$50.00', `Equilibrium price correctly computed as $50.00 (got ${pMetric?.value})`);
assert(qMetric?.value === '50.00 units', `Equilibrium quantity correctly computed as 50.00 units (got ${qMetric?.value})`);
assert(dwlMetric?.value === '$0.00', `Deadweight loss is $0.00 at competitive equilibrium`);

// Tax with DWL: Tax = $16 -> Effective supply P = 26 + 0.8Q -> 90 - 0.8Q = 26 + 0.8Q -> 1.6Q = 64 -> Qt = 40. Delta Q = 10. DWL = 0.5 * 16 * 10 = $80.
const taxedOutput = marketEquilibriumModel.calculate({ demandShift: 0, supplyShift: 0, taxPerUnit: 16, subsidyPerUnit: 0, priceControlMode: 'none', controlledPrice: 50, showBaselineComparison: false });
const taxedDwl = taxedOutput.results.find(r => r.id === 'dwl');
const taxedRev = taxedOutput.results.find(r => r.id === 'taxRev');
assert(taxedDwl?.value === '$80.00', `Excise tax DWL exactly $80.00 (got ${taxedDwl?.value})`);
assert(taxedRev?.value === '$640.00', `Excise tax revenue exactly $640.00 (40 units * $16/unit, got ${taxedRev?.value})`);

// Per-unit Subsidy: Subsidy = $16 -> Effective supply P = -6 + 0.8Q -> 90 - 0.8Q = -6 + 0.8Q -> 1.6Q = 96 -> Qsub = 60. Delta Q = 10. DWL = 0.5 * 16 * 10 = $80.
const subsidizedOutput = marketEquilibriumModel.calculate({ demandShift: 0, supplyShift: 0, taxPerUnit: 0, subsidyPerUnit: 16, priceControlMode: 'none', controlledPrice: 50, showBaselineComparison: false });
const subDwl = subsidizedOutput.results.find(r => r.id === 'dwl');
const subCost = subsidizedOutput.results.find(r => r.id === 'subsidyCost');
assert(subDwl?.value === '$80.00', `Subsidy overproduction DWL exactly $80.00 (got ${subDwl?.value})`);
assert(subCost?.value === '$960.00', `Subsidy cost exactly $960.00 (60 units * $16/unit, got ${subCost?.value})`);

// Binding Price Ceiling: Pc = 35 < P* (50) -> Shortage
const ceilingOutput = marketEquilibriumModel.calculate({ demandShift: 0, supplyShift: 0, taxPerUnit: 0, subsidyPerUnit: 0, priceControlMode: 'ceiling', controlledPrice: 35, showBaselineComparison: false });
const shortageMetric = ceilingOutput.results.find(r => r.id === 'discrepancy');
assert(shortageMetric !== undefined, 'Binding price ceiling produces market shortage metric');

// Binding Price Floor: Pf = 65 > P* (50) -> Surplus
const floorOutput = marketEquilibriumModel.calculate({ demandShift: 0, supplyShift: 0, taxPerUnit: 0, subsidyPerUnit: 0, priceControlMode: 'floor', controlledPrice: 65, showBaselineComparison: false });
const surplusMetric = floorOutput.results.find(r => r.id === 'discrepancy');
assert(surplusMetric !== undefined, 'Binding price floor produces market surplus metric');

// 4. Batch 1: Elasticity & Total Revenue Test
console.log('\n--- 4. Batch 1: Price Elasticity & Total Revenue Test ---');
const elasticityMid = elasticityModel.calculate({ priceLevel: 50, demandIntercept: 100, demandSlope: -1.0, crossPricePercentage: 10, crossGoodType: 'substitute', incomePercentage: 10, incomeGoodType: 'normal_necessity' });
const pedMid = elasticityMid.results.find(r => r.id === 'pedValue');
const trMid = elasticityMid.results.find(r => r.id === 'totalRev');
const mrMid = elasticityMid.results.find(r => r.id === 'marginalRev');

assert(pedMid?.value === '1.00', `Midpoint PED exactly 1.00 (Unit Elastic, got ${pedMid?.value})`);
assert(trMid?.value === '$2500.00', `Midpoint TR is maximized at $2,500.00 (got ${trMid?.value})`);
assert(mrMid?.value === '$0.00', `Midpoint MR is exactly $0.00 (got ${mrMid?.value})`);

const elasticityElastic = elasticityModel.calculate({ priceLevel: 75, demandIntercept: 100, demandSlope: -1.0, crossPricePercentage: 10, crossGoodType: 'substitute', incomePercentage: 10, incomeGoodType: 'normal_necessity' });
const pedElastic = elasticityElastic.results.find(r => r.id === 'pedValue');
assert(pedElastic?.value === '3.00', `P=75 PED is 3.00 (> 1, Elastic, got ${pedElastic?.value})`);

const elasticityInelastic = elasticityModel.calculate({ priceLevel: 25, demandIntercept: 100, demandSlope: -1.0, crossPricePercentage: 10, crossGoodType: 'substitute', incomePercentage: 10, incomeGoodType: 'normal_necessity' });
const pedInelastic = elasticityInelastic.results.find(r => r.id === 'pedValue');
assert(pedInelastic?.value === '0.33', `P=25 PED is 0.33 (< 1, Inelastic, got ${pedInelastic?.value})`);
assert(elasticityMid.secondaryGraph !== undefined, 'Elasticity model outputs secondary Total Revenue parabola graph');
assert(elasticityMid.customTable !== undefined, 'Elasticity model outputs full AP Elasticities Summary Table (PED, XED, YED)');

// 5. Batch 1: Comparative Advantage & Terms of Trade
console.log('\n--- 5. Batch 1: Comparative Advantage & Gains from Trade ---');
const compAdvOutput = comparativeAdvantageModel.calculate({
  countryAMaxCars: 60,
  countryAMaxWheat: 120,
  countryBMaxCars: 40,
  countryBMaxWheat: 40,
  termsOfTradeCarToWheat: 1.5
});

const costCarA = compAdvOutput.results.find(r => r.id === 'oppCostCarA');
const costCarB = compAdvOutput.results.find(r => r.id === 'oppCostCarB');
const tradeRange = compAdvOutput.results.find(r => r.id === 'tradeTermsRange');

assert(costCarA?.value === '2.00 Wheat', `Country A Car opportunity cost is 2.00 Wheat (got ${costCarA?.value})`);
assert(costCarB?.value === '1.00 Wheat', `Country B Car opportunity cost is 1.00 Wheat (got ${costCarB?.value})`);
assert(tradeRange?.value === '1.00 < P < 2.00 Wheat', `Terms of trade range is 1.00 < P < 2.00 Wheat`);
assert(compAdvOutput.secondaryGraph !== undefined, 'Comparative Advantage outputs Country B secondary graph');
assert(compAdvOutput.customTable !== undefined, 'Comparative Advantage outputs CED opportunity cost table');

// 6. Batch 1: Production Possibilities Curve (PPC)
console.log('\n--- 6. Batch 1: Production Possibilities Curve (PPC) ---');
const ppcOutput = ppcModel.calculate({ costShape: 'bowed', techConsumerGoods: 100, techCapitalGoods: 100, productionX: 60, showGrowthShift: false });
assert(ppcOutput.curves.length > 0, 'PPC generates boundary curve');
assert(ppcOutput.points.find(p => p.shortLabel === 'A')?.x === 60, 'Point A matches chosen production parameter');
assert(ppcOutput.customTable !== undefined, 'PPC outputs Production & Efficiency Schedule Table');

console.log('\n==============================================');
if (failedTests === 0) {
  console.log('🎉 ALL BATCH 1 AUDIT TESTS PASSED (0 FAILURES)');
} else {
  console.error(`💥 BATCH 1 AUDIT FAILED WITH ${failedTests} FAILURES`);
  process.exit(1);
}
console.log('==============================================\n');
