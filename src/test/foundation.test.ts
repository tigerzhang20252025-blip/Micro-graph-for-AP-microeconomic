import { AP_TOPICS, AP_UNITS } from '../data/topicRegistry';
import { translations } from '../i18n/translations';
import { marketEquilibriumModel } from '../engine/models/marketEquilibriumModel';
import { ppcModel } from '../engine/models/ppcModel';

console.log('==============================================');
console.log('🧪 AP MICROECONOMICS GRAPH LAB: PART 1 AUDIT');
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

// 1. Topic Registry Verification
console.log('--- 1. CED Topic Registry & Scope Classification ---');
assert(AP_UNITS.length === 6, 'All 6 official AP Microeconomics units registered');
assert(AP_TOPICS.length >= 18, `Topic registry contains ${AP_TOPICS.length} topics (>= 18)`);

const coreTopics = AP_TOPICS.filter(t => t.scope === 'core');
const extensionTopics = AP_TOPICS.filter(t => t.scope === 'extension');
const excludedTopics = AP_TOPICS.filter(t => t.scope === 'excluded');

assert(coreTopics.length >= 14, `Core AP Content classified: ${coreTopics.length} topics`);
assert(extensionTopics.length >= 2, `Optional Extensions classified: ${extensionTopics.length} topics`);
assert(excludedTopics.length >= 2, `Not in Current AP Exam Scope classified: ${excludedTopics.length} topics`);

AP_TOPICS.forEach(topic => {
  const hasEnTitle = topic.title.en && topic.title.en.trim().length > 0;
  const hasZhTitle = topic.title.zh && topic.title.zh.trim().length > 0;
  const hasRef = topic.officialRef && topic.officialRef.trim().length > 0;
  if (!hasEnTitle || !hasZhTitle || !hasRef) {
    console.error(`Topic missing fields: ${topic.id}`);
    failedTests++;
  }
});
assert(true, 'All topics have valid English and Simplified Chinese titles and official references');

// 2. Translation Parity & Completeness
console.log('\n--- 2. Translation Parity & Terminology Check ---');
const enKeys = Object.keys(translations.en) as (keyof typeof translations.en)[];
const zhKeys = Object.keys(translations.zh) as (keyof typeof translations.zh)[];

assert(enKeys.length === zhKeys.length, `Translation key parity: EN has ${enKeys.length}, ZH has ${zhKeys.length}`);

const missingZh = enKeys.filter(k => !translations.zh[k] || translations.zh[k].trim() === '');
const missingEn = zhKeys.filter(k => !translations.en[k] || translations.en[k].trim() === '');

assert(missingZh.length === 0, `All ${enKeys.length} keys translated to Chinese (missing: ${missingZh.length})`);
assert(missingEn.length === 0, `All ${zhKeys.length} keys translated to English (missing: ${missingEn.length})`);

// Check critical button toggles
assert(translations.en.langSwitchButton === '中文', 'English view toggle button displays "中文"');
assert(translations.zh.langSwitchButton === 'English', 'Chinese view toggle button displays "English"');

// Check key AP terms
assert(translations.en.consumerSurplus.includes('Consumer Surplus') && translations.zh.consumerSurplus.includes('消费者剩余'), 'Consumer Surplus properly translated');
assert(translations.en.deadweightLoss.includes('Deadweight Loss') && translations.zh.deadweightLoss.includes('无谓损失'), 'Deadweight Loss properly translated');
assert(translations.en.marginalCost.includes('Marginal Cost') && translations.zh.marginalCost.includes('边际成本'), 'Marginal Cost properly translated');

// 3. Mathematical & Economic Engine Tests
console.log('\n--- 3. Economic Calculation Engine Accuracy ---');
const baseEqOutput = marketEquilibriumModel.calculate({ demandShift: 0, supplyShift: 0, taxPerUnit: 0, priceControlMode: 'none', controlledPrice: 50 });
const pMetric = baseEqOutput.results.find(r => r.id === 'eqPrice');
const qMetric = baseEqOutput.results.find(r => r.id === 'eqQuantity');
const dwlMetric = baseEqOutput.results.find(r => r.id === 'dwl');

assert(pMetric?.value === '$50.00', `Equilibrium price correctly computed as $50.00 (got ${pMetric?.value})`);
assert(qMetric?.value === '50.00 units', `Equilibrium quantity correctly computed as 50.00 units (got ${qMetric?.value})`);
assert(dwlMetric?.value === '$0.00', `Deadweight loss is $0.00 at competitive equilibrium`);

// Tax with DWL
const taxedOutput = marketEquilibriumModel.calculate({ demandShift: 0, supplyShift: 0, taxPerUnit: 16, priceControlMode: 'none', controlledPrice: 50 });
const taxedDwl = taxedOutput.results.find(r => r.id === 'dwl');
const taxedRev = taxedOutput.results.find(r => r.id === 'taxRev');

assert(taxedDwl?.value === '$80.00', `Excise tax DWL exactly $80.00 (got ${taxedDwl?.value})`);
assert(taxedRev?.value === '$640.00', `Excise tax revenue exactly $640.00 (40 units * $16/unit, got ${taxedRev?.value})`);

// PPC Model
const ppcLinear = ppcModel.calculate({ costShape: 'linear', techConsumerGoods: 100, techCapitalGoods: 100, productionX: 50, showGrowthShift: false });
const ppcBowed = ppcModel.calculate({ costShape: 'bowed', techConsumerGoods: 100, techCapitalGoods: 100, productionX: 60, showGrowthShift: false });

assert(ppcLinear.curves[0].points.length > 20, 'PPC generates smooth curve points');
assert(ppcBowed.points.find(p => p.shortLabel === 'A')?.x === 60, 'Production choice point correctly located at X=60');

// 4. Accessibility & Visual Language
console.log('\n--- 4. Graph Accessibility & Visual Distinctions ---');
assert(baseEqOutput.curves.every(c => c.strokeDasharray !== undefined && c.color), 'All curves have strokeDasharray and color defined');
assert(baseEqOutput.shadedAreas.every(a => a.pattern !== undefined && a.fill), 'All shaded areas have accessible pattern overlays');

console.log('\n==============================================');
if (failedTests === 0) {
  console.log('🎉 ALL FOUNDATION AUDIT TESTS PASSED (0 FAILURES)');
} else {
  console.error(`💥 AUDIT FAILED WITH ${failedTests} FAILURES`);
  process.exit(1);
}
console.log('==============================================\n');
