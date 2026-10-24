import { BilingualText } from '../types/registry';

export interface RelatedConceptLink {
  termId: string;
  labelEn: string;
  labelZh: string;
  relationEn: string;
  relationZh: string;
}

export interface EconomicTermDefinition {
  id: string;
  abbreviation?: string;
  aliases?: string[];
  en: string;
  zh: string;
  unit: number;
  topicCode: string;
  category: 'cost' | 'revenue' | 'elasticity' | 'welfare' | 'factor' | 'externality' | 'structure' | 'general';
  definition: BilingualText;
  formula?: string;
  unitOfMeasure?: BilingualText;
  example: BilingualText;
  keyCharacteristics?: BilingualText[];
  examTip?: BilingualText;
  relatedConcepts: RelatedConceptLink[];
  linkedModelId?: string;
}

export const ECONOMIC_DICTIONARY: EconomicTermDefinition[] = [
  // ==========================================
  // UNIT 1: Basic Economic Concepts
  // ==========================================
  {
    id: 'term-ppc',
    abbreviation: 'PPC / PPF',
    aliases: ['Production Possibilities Curve', 'Production Possibilities Frontier', '生产可能性边界', '生产可能性曲线'],
    en: 'Production Possibilities Curve (PPC)',
    zh: '生产可能性曲线（PPC / PPF）',
    unit: 1,
    topicCode: '1.3',
    category: 'general',
    definition: {
      en: 'A graphical model depicting the maximum combinations of two goods an economy can produce given fixed resources and technology.',
      zh: '在给定的资源与技术水平约束下，一个经济体能够生产的两种物品的最大可能产出组合轨迹。'
    },
    formula: 'Slope = - ΔGood_Y / ΔGood_X = Per-Unit Opportunity Cost of Good X',
    unitOfMeasure: { en: 'Output combinations of Good X and Good Y', zh: 'X 与 Y 物品的产量组合' },
    example: {
      en: 'If an economy produces 10 cars and 50 tons of grain, shifting resources to produce 11 cars reduces grain to 46 tons. The opportunity cost of the 11th car is 4 tons of grain.',
      zh: '某国生产 10 辆汽车和 50 吨粮食；若将资源重配以生产第 11 辆汽车，粮食减产至 46 吨，则第 11 辆汽车的机会成本为 4 吨粮食。'
    },
    keyCharacteristics: [
      { en: 'Points on the curve are productively efficient.', zh: '边界线上的点代表生产有效率（充分就业）。' },
      { en: 'Points inside the curve indicate inefficient unemployment or underutilized resources.', zh: '边界线内部的点代表存在失业或资源未充分利用。' },
      { en: 'Points outside are currently unattainable without economic growth or international trade.', zh: '边界线外部的点在当前技术和资源下不可企及。' }
    ],
    examTip: {
      en: 'Bowed-out (concave) PPC reflects the Law of Increasing Opportunity Cost (resources are not perfectly adaptable). Straight-line PPC reflects constant opportunity cost.',
      zh: '凸向外部（凹向原点）的 PPC 反映机会成本递增规律（资源不完全适用）；直线型 PPC 反映恒定机会成本。'
    },
    relatedConcepts: [
      { termId: 'term-opportunity-cost', labelEn: 'Opportunity Cost (OC)', labelZh: '机会成本', relationEn: 'Measured by the slope of the PPC', relationZh: 'PPC 切线斜率的绝对值即为机会成本' }
    ],
    linkedModelId: 'ppc-model'
  },
  {
    id: 'term-opportunity-cost',
    abbreviation: 'OC',
    aliases: ['Opportunity Cost', '机会成本', 'Trade-off'],
    en: 'Opportunity Cost',
    zh: '机会成本',
    unit: 1,
    topicCode: '1.2',
    category: 'general',
    definition: {
      en: 'The value of the next best alternative that is forgone when a decision is made.',
      zh: '做出某种经济决策时所放弃的次优备选方案的价值。'
    },
    formula: 'Per-Unit OC of X = Quantity of Y Forgone / Quantity of X Gained',
    unitOfMeasure: { en: 'Units of the forgone good or dollars', zh: '牺牲物品的单位数或货币金额' },
    example: {
      en: 'If spending 2 hours studying economics gives up earning $30 working at a cafe, the opportunity cost of studying is $30 plus the cafe leisure experience.',
      zh: '若花 2 小时复习经济学意味着放弃在咖啡店打工赚取的 $30，则学习经济学的显性/隐性机会成本为 $30 加上休闲体验。'
    },
    relatedConcepts: [
      { termId: 'term-ppc', labelEn: 'PPC', labelZh: '生产可能性曲线', relationEn: 'Represented visually by the PPC slope', relationZh: '在 PPC 上直观表现为两轴产出替代' },
      { termId: 'term-comparative-advantage', labelEn: 'Comparative Advantage (CA)', labelZh: '比较优势', relationEn: 'Defined by having a lower opportunity cost', relationZh: '机会成本较低者拥有比较优势' }
    ],
    linkedModelId: 'ppc-model'
  },
  {
    id: 'term-comparative-advantage',
    abbreviation: 'CA',
    aliases: ['Comparative Advantage', '比较优势', 'Gains from trade', 'Terms of trade'],
    en: 'Comparative Advantage',
    zh: '比较优势',
    unit: 1,
    topicCode: '1.4',
    category: 'general',
    definition: {
      en: 'The ability of an individual or country to produce a good at a lower per-unit opportunity cost than another producer.',
      zh: '一个生产者或国家以低于另一生产者的单位机会成本生产某种产品的能力。'
    },
    formula: 'Country with min(Opportunity Cost) specializes in that good',
    example: {
      en: 'If Country A gives up 2 wheat per car and Country B gives up 4 wheat per car, Country A has a comparative advantage in cars.',
      zh: '若 A 国造 1 辆车需牺牲 2 吨小麦，而 B 国造 1 辆车需牺牲 4 吨小麦，则 A 国在汽车制造上拥有比较优势。'
    },
    examTip: {
      en: 'A country can have an absolute advantage in all goods, but can NEVER have a comparative advantage in all goods (it is mathematically impossible).',
      zh: '一个国家可以在所有商品上都拥有绝对优势，但在数学逻辑上绝不可能在所有商品上都拥有比较优势。'
    },
    relatedConcepts: [
      { termId: 'term-opportunity-cost', labelEn: 'Opportunity Cost', labelZh: '机会成本', relationEn: 'Basis of comparative advantage determination', relationZh: '判定比较优势归属的唯一核心依据' }
    ],
    linkedModelId: 'comparative-advantage'
  },
  {
    id: 'term-marginal-utility',
    abbreviation: 'MU',
    aliases: ['Marginal Utility', '边际效用', 'Diminishing Marginal Utility'],
    en: 'Marginal Utility',
    zh: '边际效用',
    unit: 1,
    topicCode: '1.6',
    category: 'general',
    definition: {
      en: 'The additional satisfaction or utility a consumer derives from consuming one additional unit of a good or service.',
      zh: '消费者每额外增加消费一单位某种商品或劳务所获得的新增效用或满足感。'
    },
    formula: 'MU = ΔTU / ΔQ',
    unitOfMeasure: { en: 'Utils per unit', zh: '效用单位 / 单位物品' },
    example: {
      en: 'If eating 1 slice of pizza gives 20 utils of satisfaction and eating 2 slices gives 35 utils, the MU of the 2nd slice is 15 utils.',
      zh: '吃第 1 块披萨带来 20 点满足感，吃 2 块累计带来 35 点满足感，则第 2 块披萨的边际效用 MU 为 15 点。'
    },
    keyCharacteristics: [
      { en: 'Law of Diminishing Marginal Utility: As consumption increases, MU tends to decline.', zh: '边际效用递减规律：随着消费量增加，边际效用逐步递减。' },
      { en: 'When MU = 0, Total Utility (TU) reaches its absolute maximum.', zh: '当 MU = 0 时，消费者的总效用 TU 达到最高峰。' }
    ],
    examTip: {
      en: 'Utility-maximizing consumer rule: Equi-marginal rule requires MUx / Px = MUy / Py.',
      zh: '消费者效用最大化等边际法则：MUx / Px = MUy / Py。'
    },
    relatedConcepts: [
      { termId: 'term-total-utility', labelEn: 'Total Utility (TU)', labelZh: '总效用', relationEn: 'Sum of all marginal utilities', relationZh: 'TU 是所有单位 MU 的累加' }
    ],
    linkedModelId: 'marginal-analysis-utility'
  },
  {
    id: 'term-total-utility',
    abbreviation: 'TU',
    aliases: ['Total Utility', '总效用'],
    en: 'Total Utility',
    zh: '总效用',
    unit: 1,
    topicCode: '1.6',
    category: 'general',
    definition: {
      en: 'The total overall satisfaction received from consuming a given total quantity of a good.',
      zh: '消费者消费一定数量的某种商品所获得的满足程度总和。'
    },
    formula: 'TU = Σ MU_i',
    example: {
      en: 'If the marginal utilities of the first 3 cups of coffee are 10, 7, and 4 utils, Total Utility is 21 utils.',
      zh: '若喝前 3 杯咖啡的边际效用分别为 10、7、4，则 3 杯咖啡的总效用 TU 为 21。'
    },
    relatedConcepts: [
      { termId: 'term-marginal-utility', labelEn: 'Marginal Utility (MU)', labelZh: '边际效用', relationEn: 'First derivative of TU', relationZh: 'MU 是 TU 的一阶导数（斜率）' }
    ],
    linkedModelId: 'marginal-analysis-utility'
  },

  // ==========================================
  // UNIT 2: Supply and Demand
  // ==========================================
  {
    id: 'term-demand',
    abbreviation: 'D',
    aliases: ['Demand', 'Demand Curve', '需求', '需求曲线'],
    en: 'Demand Curve',
    zh: '需求曲线',
    unit: 2,
    topicCode: '2.1',
    category: 'welfare',
    definition: {
      en: 'A schedule or curve showing the various quantities of a good consumers are willing and able to purchase at various prices, ceteris paribus.',
      zh: '在其他条件不变时，反映消费者在不同价格水平下愿意且有能力购买的物品数量反向关系的曲线。'
    },
    formula: 'Inverse Demand: P = a - b*Q',
    unitOfMeasure: { en: 'Quantity per time period', zh: '单位时间内的需求数量' },
    example: {
      en: 'When the price of bubble tea drops from $5 to $3, quantity demanded increases from 100 to 180 cups.',
      zh: '当奶茶单价从 $5 降至 $3 时，顾客的需求量从 100 杯增加到 180 杯。'
    },
    examTip: {
      en: 'Change in Price leads to movement ALONG the curve (Change in Quantity Demanded). Change in non-price determinants (Income, Tastes, Number of buyers, Prices of substitutes/complements) SHIFTS the entire curve (Change in Demand).',
      zh: '自身价格变动引起【沿曲线移动】（需求量变动）；非价格因素（收入、偏好、买家数量、替代品/互补品价格）引起【整条曲线平移】（需求变动）。'
    },
    relatedConcepts: [
      { termId: 'term-consumer-surplus', labelEn: 'Consumer Surplus (CS)', labelZh: '消费者剩余', relationEn: 'Area beneath Demand and above market price', relationZh: '需求线下方、价格线上方的面积' }
    ],
    linkedModelId: 'market-equilibrium-welfare'
  },
  {
    id: 'term-supply',
    abbreviation: 'S',
    aliases: ['Supply', 'Supply Curve', '供给', '供给曲线'],
    en: 'Supply Curve',
    zh: '供给曲线',
    unit: 2,
    topicCode: '2.2',
    category: 'welfare',
    definition: {
      en: 'A curve showing the various quantities of a good producers are willing and able to offer for sale at various prices, ceteris paribus.',
      zh: '在其他条件不变时，反映生产者在不同价格水平下愿意且能够供给销售的商品数量正向关系的曲线。'
    },
    formula: 'Inverse Supply: P = c + d*Q',
    unitOfMeasure: { en: 'Quantity per time period', zh: '单位时间内的供给数量' },
    example: {
      en: 'When the market price of lithium batteries rises from $50 to $80, manufacturers expand production from 1,000 to 1,600 packs.',
      zh: '当锂电池市场价格从 $50 涨到 $80 时，厂商供给量从 1,000 块增加到 1,600 块。'
    },
    relatedConcepts: [
      { termId: 'term-marginal-cost', labelEn: 'Marginal Cost (MC)', labelZh: '边际成本', relationEn: 'A competitive firm supply curve is MC above AVC', relationZh: '完全竞争厂商的短期供给曲线即为高于 AVC 的 MC 曲线段' }
    ],
    linkedModelId: 'market-equilibrium-welfare'
  },
  {
    id: 'term-consumer-surplus',
    abbreviation: 'CS',
    aliases: ['Consumer Surplus', '消费者剩余'],
    en: 'Consumer Surplus',
    zh: '消费者剩余',
    unit: 2,
    topicCode: '2.6',
    category: 'welfare',
    definition: {
      en: 'The difference between the maximum price a consumer is willing to pay and the market price actually paid.',
      zh: '消费者愿意且能够支付的最高保留价格与其实际支付的市场价格之间的差额总和。'
    },
    formula: 'CS = 1/2 * (Choke Price - P*) * Q*',
    unitOfMeasure: { en: 'Dollars ($)', zh: '美元 ($)' },
    example: {
      en: 'If you are willing to pay $15 for a concert ticket but buy it for $10, your individual consumer surplus is $5.',
      zh: '若你最高愿意为门票付 $15，而实际购票价仅为 $10，则你获得了 $5 的消费者剩余。'
    },
    relatedConcepts: [
      { termId: 'term-producer-surplus', labelEn: 'Producer Surplus (PS)', labelZh: '生产者剩余', relationEn: 'CS + PS = Total Economic Welfare', relationZh: 'CS 与 PS 之和构成全社会总福利' },
      { termId: 'term-deadweight-loss', labelEn: 'Deadweight Loss (DWL)', labelZh: '无谓损失', relationEn: 'Distortions destroy a portion of CS', relationZh: '市场扭曲政策会吞噬一部分 CS 并转化为 DWL' }
    ],
    linkedModelId: 'market-equilibrium-welfare'
  },
  {
    id: 'term-producer-surplus',
    abbreviation: 'PS',
    aliases: ['Producer Surplus', '生产者剩余'],
    en: 'Producer Surplus',
    zh: '生产者剩余',
    unit: 2,
    topicCode: '2.6',
    category: 'welfare',
    definition: {
      en: 'The difference between the actual price a producer receives and the minimum price they would have been willing to accept (marginal cost).',
      zh: '生产者销售某种产品实际收到的市场价格与其愿意接受的最低边际供给成本之间的差额总和。'
    },
    formula: 'PS = 1/2 * (P* - Supply Intercept) * Q*',
    unitOfMeasure: { en: 'Dollars ($)', zh: '美元 ($)' },
    example: {
      en: 'If a farmer is willing to sell a bushel of wheat for $3 (cost) and sells it on the market for $7, individual producer surplus is $4.',
      zh: '若农夫愿意接受的最低成本价为 $3，而市场销售价格为 $7，则该农夫获得了 $4 的生产者剩余。'
    },
    relatedConcepts: [
      { termId: 'term-consumer-surplus', labelEn: 'Consumer Surplus (CS)', labelZh: '消费者剩余', relationEn: 'Forms total economic surplus when combined with PS', relationZh: '与 PS 共同构成社会总剩余' }
    ],
    linkedModelId: 'market-equilibrium-welfare'
  },
  {
    id: 'term-deadweight-loss',
    abbreviation: 'DWL',
    aliases: ['Deadweight Loss', '无谓损失', 'Allocative Inefficiency', '社会净福利损失'],
    en: 'Deadweight Loss',
    zh: '无谓损失',
    unit: 2,
    topicCode: '2.8',
    category: 'welfare',
    definition: {
      en: 'The loss of total economic surplus (CS + PS) that occurs when market output is not allocatively efficient (underproduction or overproduction).',
      zh: '当市场未达到资源配置有效率状态（生产不足或过度生产）时，所造成的无法被任何一方回收的社会净福利损失。'
    },
    formula: 'DWL = 1/2 * Wedge * |Q* - Q_distorted|',
    unitOfMeasure: { en: 'Dollars ($)', zh: '美元 ($)' },
    example: {
      en: 'A $10 excise tax reduces market output from 50 to 40 units. The deadweight loss triangle area is 1/2 * $10 * 10 = $50.',
      zh: '征收 $10 单位消费税使产销量由 50 减至 40，无谓损失三角形面积为 1/2 × $10 × 10 = $50。'
    },
    examTip: {
      en: 'DWL triangles always point toward the socially optimal (allocatively efficient) output quantity on the graph.',
      zh: '在几何图表上，无谓损失（DWL）三角形的锐角尖端永远指向社会最优（配置效率）产量。'
    },
    relatedConcepts: [
      { termId: 'term-consumer-surplus', labelEn: 'Consumer Surplus', labelZh: '消费者剩余', relationEn: 'Lost surplus that goes to neither buyers, sellers, nor government', relationZh: '买卖双方或政府均无法收回的纯效率净损失' }
    ],
    linkedModelId: 'gov-intervention-taxes-deadweight'
  },
  {
    id: 'term-ped',
    abbreviation: 'PED',
    aliases: ['Price Elasticity of Demand', 'PED', 'Ed', '需求价格弹性'],
    en: 'Price Elasticity of Demand',
    zh: '需求价格弹性',
    unit: 2,
    topicCode: '2.3',
    category: 'elasticity',
    definition: {
      en: 'A measure of the responsiveness of the quantity demanded of a good to a change in its price.',
      zh: '衡量某种商品的需求量对其自身价格变动反应敏感程度的度量指标。'
    },
    formula: 'PED = | %ΔQd / %ΔP | = | ((Q2-Q1)/((Q1+Q2)/2)) / ((P2-P1)/((P1+P2)/2)) |',
    example: {
      en: 'If a 10% hike in coffee price causes quantity demanded to drop by 20%, |PED| = 2.0 (Elastic).',
      zh: '若咖啡价格上涨 10% 导致购买量下降 20%，则 |PED| = 20% / 10% = 2.0（富有弹性）。'
    },
    keyCharacteristics: [
      { en: '|PED| > 1: Elastic (Total Revenue moves opposite to Price).', zh: '|PED| > 1：富有弹性（总收益变动方向与价格反向）。' },
      { en: '|PED| = 1: Unit Elastic (Total Revenue is maximized).', zh: '|PED| = 1：单位弹性（总收益达到极大值）。' },
      { en: '|PED| < 1: Inelastic (Total Revenue moves in same direction as Price).', zh: '|PED| < 1：缺乏弹性（总收益变动方向与价格同向）。' }
    ],
    examTip: {
      en: 'Slope is NOT elasticity! Along a linear downward-sloping demand curve, slope is constant, but elasticity declines from elastic at top to inelastic at bottom.',
      zh: '斜率绝不等于弹性！对于线性需求曲线，斜率恒定不变，但弹性从上部的富有弹性逐渐衰减至下部的缺乏弹性。'
    },
    relatedConcepts: [
      { termId: 'term-total-revenue', labelEn: 'Total Revenue (TR)', labelZh: '总收益', relationEn: 'Direction of TR change is dictated by PED', relationZh: '由总收益测试（Total Revenue Test）严格关联' }
    ],
    linkedModelId: 'price-elasticity-demand'
  },
  {
    id: 'term-pes',
    abbreviation: 'PES',
    aliases: ['Price Elasticity of Supply', 'PES', 'Es', '供给价格弹性'],
    en: 'Price Elasticity of Supply',
    zh: '供给价格弹性',
    unit: 2,
    topicCode: '2.4',
    category: 'elasticity',
    definition: {
      en: 'A measure of how responsive producers are to a price change: the percentage change in quantity supplied divided by the percentage change in price.',
      zh: '衡量生产者供给量对商品自身价格变动敏感程度的百分比比率。'
    },
    formula: 'PES = %ΔQs / %ΔP',
    example: {
      en: 'If corn prices increase by 15% and farmers increase production by 30%, PES = 2.0 (Elastic supply).',
      zh: '若玉米市价上涨 15%，农户增产 30%，则 PES = 30% / 15% = 2.0（供给富有弹性）。'
    },
    relatedConcepts: [
      { termId: 'term-ped', labelEn: 'Price Elasticity of Demand', labelZh: '需求价格弹性', relationEn: 'Supply counterpart to demand elasticity', relationZh: '与需求价格弹性镜像对应' }
    ],
    linkedModelId: 'market-equilibrium-welfare'
  },
  {
    id: 'term-xed',
    abbreviation: 'XED',
    aliases: ['Cross-Price Elasticity of Demand', 'XED', '交叉价格弹性'],
    en: 'Cross-Price Elasticity of Demand',
    zh: '需求的交叉价格弹性',
    unit: 2,
    topicCode: '2.5',
    category: 'elasticity',
    definition: {
      en: 'Measures the responsiveness of demand for one good to a percentage change in the price of another good.',
      zh: '衡量一种商品的需求量对另一种商品价格变动的敏感程度。'
    },
    formula: 'XED = %ΔQd_A / %ΔP_B',
    example: {
      en: 'If the price of Pepsi rises by 10% and demand for Coca-Cola rises by 8%, XED = +0.8 (Substitutes).',
      zh: '若百事可乐价格上涨 10% 导致可口可乐需求量增加 8%，则 XED = +0.8（正数，代表两者为替代品）。'
    },
    keyCharacteristics: [
      { en: 'XED > 0: Substitute Goods (e.g. Butter and Margarine).', zh: 'XED > 0：替代品（如黄油与植物人造黄油）。' },
      { en: 'XED < 0: Complementary Goods (e.g. Hot dogs and Buns).', zh: 'XED < 0：互补品（如热狗与热狗面包）。' },
      { en: 'XED = 0: Unrelated Goods.', zh: 'XED = 0：无关独立物品。' }
    ],
    examTip: {
      en: 'Do NOT take the absolute value of XED! The positive or negative sign is essential to determine whether goods are substitutes or complements.',
      zh: '千万不要给 XED 加绝对值！正负号是判定替代品还是互补品的唯一依据。'
    },
    relatedConcepts: [
      { termId: 'term-yed', labelEn: 'Income Elasticity of Demand (YED)', labelZh: '需求收入弹性', relationEn: 'Related elasticity using sign analysis', relationZh: '同为通过正负号断定商品属性的弹性指标' }
    ],
    linkedModelId: 'price-elasticity-demand'
  },
  {
    id: 'term-yed',
    abbreviation: 'YED',
    aliases: ['Income Elasticity of Demand', 'YED', 'Ei', '收入弹性'],
    en: 'Income Elasticity of Demand',
    zh: '需求收入弹性',
    unit: 2,
    topicCode: '2.5',
    category: 'elasticity',
    definition: {
      en: 'Measures the responsiveness of quantity demanded to a percentage change in consumer income.',
      zh: '衡量某种商品的需求量对消费者收入变动的敏感程度。'
    },
    formula: 'YED = %ΔQd / %ΔIncome',
    example: {
      en: 'If consumer income rises by 5% and demand for organic steak rises by 10%, YED = +2.0 (Normal luxury good). If demand for instant noodles drops by 4%, YED = -0.8 (Inferior good).',
      zh: '若收入增加 5% 导致有机牛排需求增加 10%，则 YED = +2.0（正常品/奢侈品）；若方便面需求减少 4%，则 YED = -0.8（劣等品）。'
    },
    keyCharacteristics: [
      { en: 'YED > 0: Normal Good (Income and Demand move in same direction).', zh: 'YED > 0：正常品（收入与需求同向变动）。' },
      { en: 'YED < 0: Inferior Good (Income and Demand move in opposite directions).', zh: 'YED < 0：劣等品（收入增加反而少买）。' }
    ],
    relatedConcepts: [
      { termId: 'term-xed', labelEn: 'Cross-Price Elasticity (XED)', labelZh: '交叉价格弹性', relationEn: 'Sign-dependent elasticity metric', relationZh: '同为依赖正负号判定的弹性指标' }
    ],
    linkedModelId: 'price-elasticity-demand'
  },
  {
    id: 'term-total-revenue',
    abbreviation: 'TR',
    aliases: ['Total Revenue', '总收益', 'P x Q'],
    en: 'Total Revenue',
    zh: '总收益',
    unit: 2,
    topicCode: '2.3',
    category: 'revenue',
    definition: {
      en: 'The total amount of money a firm brings in from the sale of its goods or services: Price multiplied by Quantity.',
      zh: '厂商销售一定数量商品或提供劳务所获得的所有货币收入总额：价格乘以数量。'
    },
    formula: 'TR = Price * Quantity = P * Q',
    unitOfMeasure: { en: 'Dollars ($)', zh: '美元 ($)' },
    example: {
      en: 'Selling 500 bicycles at a price of $200 each generates Total Revenue of $100,000.',
      zh: '以单价 $200 售出 500 辆自行车，实现总收益 $100,000。'
    },
    relatedConcepts: [
      { termId: 'term-marginal-revenue', labelEn: 'Marginal Revenue (MR)', labelZh: '边际收益', relationEn: 'Slope and rate of change of Total Revenue', relationZh: 'MR 是 TR 的一阶导数（瞬时变化率）' }
    ],
    linkedModelId: 'price-elasticity-demand'
  },

  // ==========================================
  // UNIT 3: Production, Cost & Competition
  // ==========================================
  {
    id: 'term-marginal-cost',
    abbreviation: 'MC',
    aliases: ['Marginal Cost', 'MC', '边际成本', 'dTC/dQ'],
    en: 'Marginal Cost',
    zh: '边际成本',
    unit: 3,
    topicCode: '3.2',
    category: 'cost',
    definition: {
      en: 'The additional cost incurred by producing one more unit of output: ΔTC / ΔQ (or dTC/dQ).',
      zh: '每额外增加生产一个单位产品所引致的总成本增量：ΔTC / ΔQ（即总成本函数对产量的一阶导数）。'
    },
    formula: 'MC = ΔTC / ΔQ = ΔTVC / ΔQ = d(TC)/dQ',
    unitOfMeasure: { en: 'Dollars per unit ($/unit)', zh: '美元/单位 ($/单位)' },
    example: {
      en: 'If producing 10 pies costs $100 and producing 11 pies costs $112, the Marginal Cost of the 11th pie is $12.',
      zh: '若生产 10 个苹果派的总成本是 $100，生产 11 个苹果派的总成本是 $112，则第 11 个苹果派的边际成本为 $12。'
    },
    keyCharacteristics: [
      { en: 'MC intersects ATC at the minimum point of ATC.', zh: 'MC 严格穿过 ATC 曲线的最低点。' },
      { en: 'MC intersects AVC at the minimum point of AVC.', zh: 'MC 严格穿过 AVC 曲线的最低点。' },
      { en: 'The U-shape of MC is caused by the Law of Diminishing Marginal Returns (mirror image of MP).', zh: 'MC 呈 U 型是由边际报酬递减规律决定的（与边际产量 MP 互为镜像）。' }
    ],
    examTip: {
      en: 'Lump-sum taxes change Fixed Costs and do NOT shift MC! Per-unit taxes change Variable Costs and shift MC upward by the exact tax amount.',
      zh: '一次性定额税（Lump-sum）属于固定成本，绝不影响 MC！从量单位税属于可变成本，会使 MC 垂直上移该税额。'
    },
    relatedConcepts: [
      { termId: 'term-atc', labelEn: 'Average Total Cost (ATC)', labelZh: '平均总成本', relationEn: 'MC pulls ATC toward itself', relationZh: '当 MC < ATC 时拉低 ATC，MC > ATC 时推高 ATC' },
      { termId: 'term-marginal-product', labelEn: 'Marginal Product (MP)', labelZh: '边际产量', relationEn: 'Inverse mirror image: MC = Wage / MP', relationZh: '镜像反比对应：MC = W / MP' }
    ],
    linkedModelId: 'cost-curves-short-run'
  },
  {
    id: 'term-atc',
    abbreviation: 'ATC',
    aliases: ['Average Total Cost', 'ATC', 'AC', '平均总成本', '单位成本'],
    en: 'Average Total Cost',
    zh: '平均总成本',
    unit: 3,
    topicCode: '3.2',
    category: 'cost',
    definition: {
      en: 'Total cost divided by the quantity of output produced. Represents per-unit production cost.',
      zh: '总生产成本除以总产出数量，代表每单位产品的平均制造成本。'
    },
    formula: 'ATC = TC / Q = AFC + AVC',
    unitOfMeasure: { en: 'Dollars per unit ($/unit)', zh: '美元/单位 ($/单位)' },
    example: {
      en: 'If total cost to build 50 smartphones is $15,000, ATC is $15,000 / 50 = $300 per phone.',
      zh: '若制造 50 台智能手机的总成本为 $15,000，则平均总成本 ATC 为 $15,000 / 50 = $300/台。'
    },
    keyCharacteristics: [
      { en: 'Productive efficiency occurs at minimum ATC.', zh: '在 ATC 的最低点实现生产效率（Productive Efficiency）。' },
      { en: 'The vertical gap between ATC and AVC is equal to AFC (which shrinks as Q increases).', zh: 'ATC 与 AVC 之间的垂直垂直距离恒等于 AFC（随产量增加而逐渐收窄）。' }
    ],
    relatedConcepts: [
      { termId: 'term-marginal-cost', labelEn: 'Marginal Cost (MC)', labelZh: '边际成本', relationEn: 'Intersects ATC at min ATC', relationZh: '在 ATC 最低点处相交' },
      { termId: 'term-avc', labelEn: 'Average Variable Cost (AVC)', labelZh: '平均可变成本', relationEn: 'ATC = AVC + AFC', relationZh: 'ATC 减去 AVC 恒等于 AFC' }
    ],
    linkedModelId: 'cost-curves-short-run'
  },
  {
    id: 'term-avc',
    abbreviation: 'AVC',
    aliases: ['Average Variable Cost', 'AVC', '平均可变成本'],
    en: 'Average Variable Cost',
    zh: '平均可变成本',
    unit: 3,
    topicCode: '3.2',
    category: 'cost',
    definition: {
      en: 'Total variable cost divided by output. Its minimum point is the short-run shutdown point.',
      zh: '总可变成本除以总产出。其最低点是企业短期经营的停产临界点。'
    },
    formula: 'AVC = TVC / Q',
    unitOfMeasure: { en: 'Dollars per unit ($/unit)', zh: '美元/单位 ($/单位)' },
    example: {
      en: 'If producing 200 shirts has variable costs of $1,600 (fabric, hourly labor), AVC is $8 per shirt.',
      zh: '若生产 200 件衬衫的可变成本为 $1,600（布料、计件工人工资），则 AVC 为 $8/件。'
    },
    examTip: {
      en: 'Shutdown Rule: If Market Price P < min AVC, the firm shuts down immediately in the short run (q = 0).',
      zh: '短期停产法则：若市场价格 P < min AVC，企业必须在短期内立即停产（产出为 0）。'
    },
    relatedConcepts: [
      { termId: 'term-atc', labelEn: 'Average Total Cost (ATC)', labelZh: '平均总成本', relationEn: 'Asymptotes toward ATC as AFC drops', relationZh: '随 AFC 递减而逐渐趋近于 ATC' }
    ],
    linkedModelId: 'shutdown-rule'
  },
  {
    id: 'term-afc',
    abbreviation: 'AFC',
    aliases: ['Average Fixed Cost', 'AFC', '平均固定成本'],
    en: 'Average Fixed Cost',
    zh: '平均固定成本',
    unit: 3,
    topicCode: '3.2',
    category: 'cost',
    definition: {
      en: 'Total fixed cost divided by the quantity of output produced. Continually declines as output increases.',
      zh: '总固定成本除以总产出数量。随着产量扩张呈单调持续递减趋势。'
    },
    formula: 'AFC = TFC / Q = ATC - AVC',
    unitOfMeasure: { en: 'Dollars per unit ($/unit)', zh: '美元/单位 ($/单位)' },
    example: {
      en: 'If factory rent is $1,000, producing 10 units gives AFC = $100. Producing 1,000 units gives AFC = $1.',
      zh: '若厂房月租金为 $1,000，生产 10 件产品时 AFC 为 $100；生产 1,000 件时 AFC 摊薄至 $1。'
    },
    relatedConcepts: [
      { termId: 'term-atc', labelEn: 'Average Total Cost', labelZh: '平均总成本', relationEn: 'Equal to vertical distance between ATC and AVC', relationZh: '等于 ATC 与 AVC 之间的垂直间隙' }
    ],
    linkedModelId: 'cost-curves-short-run'
  },
  {
    id: 'term-mr-darp',
    abbreviation: 'Mr. DARP',
    aliases: ['Mr. DARP', 'P = MR = AR = D', 'Price Taker Demand'],
    en: 'P = MR = AR = Demand (Mr. DARP)',
    zh: '价格接受者需求曲线口诀（Mr. DARP）',
    unit: 3,
    topicCode: '3.7',
    category: 'structure',
    definition: {
      en: 'A mnemonic for the perfectly elastic (horizontal) demand curve facing an individual price-taking firm in perfect competition.',
      zh: '完全竞争市场中个别价格接受者厂商所面对的完全水平需求线的经典记忆口诀（价格 = 边际收益 = 平均收益 = 需求）。'
    },
    formula: 'P = MR = AR = Demand (Horizontal Line at Market Price P*)',
    example: {
      en: 'A wheat farmer sells at the market equilibrium price of $6/bushel. For every bushel sold, price is $6, MR is $6, AR is $6, and demand is perfectly elastic at $6.',
      zh: '小麦种植户按市场均衡价 $6/蒲式耳出售小麦。每多卖一蒲式耳，单价是 $6，边际收益是 $6，平均收益是 $6，需求线为 $6 的水平直线。'
    },
    examTip: {
      en: 'Mr. DARP applies ONLY to perfectly competitive individual firms! In monopoly or monopolistic competition, MR lies BELOW Demand.',
      zh: 'Mr. DARP 仅适用于完全竞争个别厂商！在垄断或垄断竞争中，边际收益 MR 必定严格位于需求线下方。'
    },
    relatedConcepts: [
      { termId: 'term-marginal-revenue', labelEn: 'Marginal Revenue (MR)', labelZh: '边际收益', relationEn: 'MR is flat and equals price for competitive firms', relationZh: '竞争厂商的 MR 水平且恒等于价格' }
    ],
    linkedModelId: 'perfect-competition-side-by-side'
  },
  {
    id: 'term-lratc',
    abbreviation: 'LRATC',
    aliases: ['Long-Run Average Total Cost', 'LRATC', 'LRAC', '长期平均总成本', '包络线'],
    en: 'Long-Run Average Total Cost',
    zh: '长期平均总成本（LRATC 包络线）',
    unit: 3,
    topicCode: '3.3',
    category: 'cost',
    definition: {
      en: 'A curve showing the lowest per-unit cost of producing any given level of output when all inputs (including plant size and capital) are variable.',
      zh: '当所有生产要素（包括厂房规模与资本设备）均可自由调整变动时，生产各产量水平所能达到的最低单位成本轨迹包络线。'
    },
    formula: 'Envelope curve tangent to all Short-Run ATC (SRATC) curves',
    example: {
      en: 'An automaker evaluates building a small, medium, or large factory. LRATC reflects the lowest cost per car by selecting the ideal plant size for anticipated demand.',
      zh: '车企在小型、中型与大型工厂之间做决策。LRATC 反映其根据预期产量选用最佳厂房规模所能实现的最低单车造价。'
    },
    keyCharacteristics: [
      { en: 'Economies of scale: LRATC falls as output expands.', zh: '规模经济：产量扩张时 LRATC 持续走低。' },
      { en: 'Constant returns to scale: LRATC remains flat.', zh: '规模报酬不变：LRATC 保持平坦最低水平。' },
      { en: 'Diseconomies of scale: LRATC rises as output expands due to managerial coordination failures.', zh: '规模不经济：企业过度庞大导致协调失灵，LRATC 不降反升。' }
    ],
    relatedConcepts: [
      { termId: 'term-mes', labelEn: 'Minimum Efficient Scale (MES)', labelZh: '最低有效规模', relationEn: 'Lowest output at which LRATC is minimized', relationZh: 'LRATC 降至全行业最低点的最小产出量' }
    ],
    linkedModelId: 'lratc-economies-of-scale'
  },
  {
    id: 'term-mes',
    abbreviation: 'MES',
    aliases: ['Minimum Efficient Scale', 'MES', '最低有效规模'],
    en: 'Minimum Efficient Scale',
    zh: '最低有效规模（MES）',
    unit: 3,
    topicCode: '3.3',
    category: 'cost',
    definition: {
      en: 'The lowest level of output at which a firm can minimize its long-run average total cost (LRATC).',
      zh: '企业能够将长期平均总成本（LRATC）降至最低水平所需的最小产出规模。'
    },
    formula: 'Q at the start of the horizontal minimum range of LRATC',
    example: {
      en: 'If producing 50,000 cars/year brings LRATC down to $18,000 (the minimum), MES is 50,000 units.',
      zh: '若年产 50,000 辆汽车可使单车成本降至最低的 $18,000，则该行业的最低有效规模 MES 为 50,000 辆。'
    },
    examTip: {
      en: 'When MES is very large relative to total market demand, natural monopolies or tight oligopolies naturally arise.',
      zh: '当一个行业的 MES 相对全市场总需求极度庞大时，该行业天然倾向于演变为自然垄断或寡头垄断。'
    },
    relatedConcepts: [
      { termId: 'term-lratc', labelEn: 'Long-Run Average Total Cost', labelZh: '长期平均总成本', relationEn: 'MES marks the end of economies of scale on LRATC', relationZh: '在 LRATC 上标志着规模经济区间的结束' }
    ],
    linkedModelId: 'lratc-economies-of-scale'
  },
  {
    id: 'term-marginal-product',
    abbreviation: 'MP',
    aliases: ['Marginal Product', 'MP', '边际产量', 'Marginal Physical Product'],
    en: 'Marginal Product',
    zh: '边际产量',
    unit: 3,
    topicCode: '3.1',
    category: 'cost',
    definition: {
      en: 'The additional output generated by adding one more unit of a variable input (e.g. labor), holding other inputs fixed.',
      zh: '在其他资本投入保持不变时，每多增加雇佣一单位可变要素（如劳动力）所新增的总物理产出量。'
    },
    formula: 'MP = ΔTP / ΔL',
    unitOfMeasure: { en: 'Units of output per worker', zh: '单位产出/工人' },
    example: {
      en: 'If 4 workers produce 40 units and 5 workers produce 48 units, the Marginal Product of the 5th worker is 8 units.',
      zh: '若 4 名工人总产出为 40 件，5 名工人产出为 48 件，则第 5 名工人的边际产量 MP 为 8 件。'
    },
    keyCharacteristics: [
      { en: 'Diminishing marginal returns: MP eventually falls due to fixed capital constraints.', zh: '边际报酬递减规律：由于固定设备约束，MP 最终必然递减。' },
      { en: 'MP intersects AP at the peak of Average Product (AP).', zh: 'MP 穿过平均产量 AP 的最高点。' },
      { en: 'When MP = 0, Total Product (TP) reaches its maximum.', zh: '当 MP = 0 时，总产量 TP 达到极大值。' }
    ],
    relatedConcepts: [
      { termId: 'term-marginal-cost', labelEn: 'Marginal Cost (MC)', labelZh: '边际成本', relationEn: 'Inverse mirror image: when MP is at max, MC is at min', relationZh: '与 MC 镜像对偶：MP 达极大值时 MC 达极小值' }
    ],
    linkedModelId: 'production-function-tp-mp-ap'
  },

  // ==========================================
  // UNIT 4: Imperfect Competition
  // ==========================================
  {
    id: 'term-marginal-revenue',
    abbreviation: 'MR',
    aliases: ['Marginal Revenue', 'MR', '边际收益', 'dTR/dQ'],
    en: 'Marginal Revenue',
    zh: '边际收益',
    unit: 4,
    topicCode: '4.2',
    category: 'revenue',
    definition: {
      en: 'The change in total revenue from selling one additional unit of output: ΔTR / ΔQ.',
      zh: '厂商每多售出一单位产品所带来的总收益变动额：ΔTR / ΔQ。'
    },
    formula: 'MR = ΔTR / ΔQ = d(TR)/dQ. (For linear demand P = a - b*Q, MR = a - 2b*Q)',
    unitOfMeasure: { en: 'Dollars per unit ($/unit)', zh: '美元/单位 ($/单位)' },
    example: {
      en: 'A monopolist sells 4 units for $10 each (TR=$40). To sell 5 units, it must lower price to $9 for all units (TR=$45). MR of the 5th unit is $45 - $40 = $5 (less than price $9!).',
      zh: '垄断者卖 4 件单价 $10（TR=$40）；要卖 5 件必须全员降价至 $9（TR=$45）。第 5 件的边际收益 MR 为 $45 - $40 = $5（严格小于售价 $9！）。'
    },
    examTip: {
      en: 'Golden Rule of Profit Maximization: ALL firms produce where MR = MC! For monopolists, MR lies below Demand and has twice the slope.',
      zh: '利润最大化黄金法则：所有企业类型都在 MR = MC 处生产！对于垄断者，MR 必定位于需求线下方且斜率加倍。'
    },
    relatedConcepts: [
      { termId: 'term-marginal-cost', labelEn: 'Marginal Cost (MC)', labelZh: '边际成本', relationEn: 'Profit max intersection: MR = MC', relationZh: '在 MR = MC 处实现利润最大化' }
    ],
    linkedModelId: 'monopoly-single-price'
  },
  {
    id: 'term-nash-equilibrium',
    abbreviation: 'NE',
    aliases: ['Nash Equilibrium', '纳什均衡', 'Game Theory', '博弈论'],
    en: 'Nash Equilibrium',
    zh: '纳什均衡',
    unit: 4,
    topicCode: '4.5',
    category: 'structure',
    definition: {
      en: 'A state in game theory where each player chooses their optimal strategy given the strategy chosen by other players, and no player has an incentive to unilaterally deviate.',
      zh: '博弈论中的稳定状态：在其他参与人策略既定的前提下，没有任何一方可以通过单方面改变自己的策略而获得更高收益。'
    },
    formula: 'Best response condition: Payoff_i(s_i*, s_-i*) >= Payoff_i(s_i, s_-i*) for all s_i',
    example: {
      en: 'In the classic Prisoner\'s Dilemma, both suspects confessing is the Nash Equilibrium because neither can improve their outcome by switching to silence unilaterally.',
      zh: '在经典囚徒困境中，双方均选择坦白构成纳什均衡，因为在对方坦白时，单方面翻供只会遭受更重判决。'
    },
    relatedConcepts: [
      { termId: 'term-dominant-strategy', labelEn: 'Dominant Strategy', labelZh: '占优策略', relationEn: 'Nash equilibrium often results from dominant strategies', relationZh: '双方均选择占优策略必然构成纳什均衡' }
    ],
    linkedModelId: 'oligopoly-game-theory'
  },
  {
    id: 'term-dominant-strategy',
    abbreviation: 'DS',
    aliases: ['Dominant Strategy', '占优策略', '优势策略'],
    en: 'Dominant Strategy',
    zh: '占优策略',
    unit: 4,
    topicCode: '4.5',
    category: 'structure',
    definition: {
      en: 'A strategy that results in the highest payoff for a player regardless of what action or strategy the opposing player chooses.',
      zh: '不论对手采取何种策略，该策略带给参与人的收益都严格优于其他备选策略。'
    },
    example: {
      en: 'Firm A earns more profit by advertising if Firm B advertises ($10 vs $0), and also earns more profit by advertising if Firm B does not advertise ($25 vs $20). Advertising is Firm A\'s dominant strategy.',
      zh: '无论 B 是否投放广告，A 选做广告的收益都更高（$10>$0 且 $25>$20），因此投放广告是 A 的绝对占优策略。'
    },
    relatedConcepts: [
      { termId: 'term-nash-equilibrium', labelEn: 'Nash Equilibrium', labelZh: '纳什均衡', relationEn: 'Dominant strategies lead directly to Nash Equilibrium', relationZh: '占优策略交汇点即为纳什均衡' }
    ],
    linkedModelId: 'oligopoly-game-theory'
  },
  {
    id: 'term-excess-capacity',
    aliases: ['Excess Capacity', '过剩生产能力', '过剩产能'],
    en: 'Excess Capacity',
    zh: '过剩生产能力（Excess Capacity）',
    unit: 4,
    topicCode: '4.4',
    category: 'structure',
    definition: {
      en: 'The difference between the profit-maximizing output of a monopolistically competitive firm and the output that minimizes average total cost (productive efficiency).',
      zh: '垄断竞争厂商利润最大化产出量与能使平均总成本降至最低水平（生产效率点）的产出量之间的差额。'
    },
    formula: 'Excess Capacity = Q_MES - Q*',
    example: {
      en: 'A local diner serves 200 meals a day at profit maximization, but its kitchen could operate at minimum average cost at 350 meals a day. Its excess capacity is 150 meals.',
      zh: '餐馆每天供应 200 份快餐实现利润最大化，但其厨房设备在日供 350 份时单位成本最低，则该餐馆存在 150 份的过剩生产能力。'
    },
    relatedConcepts: [
      { termId: 'term-atc', labelEn: 'Average Total Cost', labelZh: '平均总成本', relationEn: 'Firm produces on downward-sloping portion of ATC', relationZh: '厂商停留在 ATC 尚未降到最低的下倾区间' }
    ],
    linkedModelId: 'monopolistic-competition'
  },

  // ==========================================
  // UNIT 5: Factor Markets
  // ==========================================
  {
    id: 'term-mrp',
    abbreviation: 'MRP',
    aliases: ['Marginal Revenue Product', 'MRP', '边际收益产品', 'VMP'],
    en: 'Marginal Revenue Product',
    zh: '边际收益产品（MRP）',
    unit: 5,
    topicCode: '5.3',
    category: 'factor',
    definition: {
      en: 'The additional revenue generated by employing one additional unit of a resource (e.g. labor). Represents the firm\'s labor demand curve.',
      zh: '厂商每额外增加雇佣一单位生产要素（如工人）所引致的总收益增量。代表厂商对该要素的派生需求曲线。'
    },
    formula: 'MRP = MP * MR = ΔTR / ΔL (In competitive product markets, MRP = MP * Price)',
    unitOfMeasure: { en: 'Dollars per worker ($/worker)', zh: '美元/工人' },
    example: {
      en: 'If hiring an extra cook increases pizza production by 5 pizzas per hour (MP=5) and pizzas sell for $12 each in a competitive market, the cook\'s MRP is 5 * $12 = $60/hour.',
      zh: '若增雇一名厨师每小时可多烤 5 张披萨（MP=5），披萨单价为 $12，则该厨师的边际收益产品 MRP 为 5 × $12 = $60/小时。'
    },
    examTip: {
      en: 'A competitive firm\'s demand for labor is its MRP curve. It shifts when product price shifts or worker productivity changes.',
      zh: '完全竞争企业对劳动力的需求曲线就是其 MRP 曲线！产品售价变动或工人生产率提高会使 MRP 发生平移。'
    },
    relatedConcepts: [
      { termId: 'term-mfc', labelEn: 'Marginal Factor Cost (MFC)', labelZh: '边际要素成本', relationEn: 'Hiring rule sets MRP = MFC', relationZh: '最优雇佣条件要求 MRP = MFC' },
      { termId: 'term-marginal-product', labelEn: 'Marginal Product (MP)', labelZh: '边际产量', relationEn: 'MRP = MP * P', relationZh: 'MRP 是 MP 的货币化折算' }
    ],
    linkedModelId: 'factor-market-competitive'
  },
  {
    id: 'term-mfc',
    abbreviation: 'MFC / MRC',
    aliases: ['Marginal Factor Cost', 'Marginal Resource Cost', 'MFC', 'MRC', '边际要素成本'],
    en: 'Marginal Factor Cost',
    zh: '边际要素成本（MFC / MRC）',
    unit: 5,
    topicCode: '5.3',
    category: 'factor',
    definition: {
      en: 'The additional cost incurred by employing one additional unit of a resource (labor).',
      zh: '厂商每额外增加雇佣一单位生产要素所增加的总支出成本。'
    },
    formula: 'MFC = ΔTotal Labor Cost / ΔL',
    unitOfMeasure: { en: 'Dollars per worker ($/worker)', zh: '美元/工人' },
    example: {
      en: 'In a competitive labor market paying a market wage of $15/hr, MFC is constant at $15/hr. In a monopsony, MFC is higher than the wage because hiring more requires raising wages for all current workers.',
      zh: '在竞争性劳动力市场中，工资率为 $15/小时，MFC 恒等于 $15。但在买方垄断中，MFC 严格高于工资，因为增聘新人必须给老员工集体加薪。'
    },
    examTip: {
      en: 'For competitive wage-takers, MFC is horizontal (MFC = Wage). For a monopsony, MFC is upward-sloping and TWICE as steep as Labor Supply.',
      zh: '对于工资接受者，MFC 是水平线（MFC = W）；对于买方垄断，MFC 向上倾斜且斜率是劳动力供给曲线的两倍。'
    },
    relatedConcepts: [
      { termId: 'term-mrp', labelEn: 'Marginal Revenue Product (MRP)', labelZh: '边际收益产品', relationEn: 'Equated with MFC to maximize profit', relationZh: '在 MRP = MFC 处实现利润最大化雇佣' }
    ],
    linkedModelId: 'factor-market-competitive'
  },

  // ==========================================
  // UNIT 6: Market Failure & Role of Government
  // ==========================================
  {
    id: 'term-mpc',
    abbreviation: 'MPC',
    aliases: ['Marginal Private Cost', 'MPC', '边际私人成本'],
    en: 'Marginal Private Cost',
    zh: '边际私人成本（MPC）',
    unit: 6,
    topicCode: '6.2',
    category: 'externality',
    definition: {
      en: 'The direct cost paid exclusively by the producer to produce one additional unit of a good.',
      zh: '生产者为生产额外一单位产品直接承担的内部私人成本。对应自由市场的私人供给曲线。'
    },
    formula: 'MPC = Supply Curve in unregulated competitive market',
    example: {
      en: 'A factory pays $20 in electricity, labor, and materials to produce one tire. MPC is $20.',
      zh: '工厂生产一条轮胎需支付 $20 的电力、工资和橡胶原料费，其边际私人成本为 $20。'
    },
    relatedConcepts: [
      { termId: 'term-msc', labelEn: 'Marginal Social Cost (MSC)', labelZh: '边际社会成本', relationEn: 'MSC = MPC + Marginal External Cost (MEC)', relationZh: 'MSC 等于 MPC 加上边际外部成本' }
    ],
    linkedModelId: 'negative-externalities'
  },
  {
    id: 'term-msc',
    abbreviation: 'MSC',
    aliases: ['Marginal Social Cost', 'MSC', '边际社会成本'],
    en: 'Marginal Social Cost',
    zh: '边际社会成本（MSC）',
    unit: 6,
    topicCode: '6.2',
    category: 'externality',
    definition: {
      en: 'The total cost to society of producing an additional unit of a good, including both private producer costs and negative external spillover costs.',
      zh: '全社会为生产额外一单位产品所承受的总成本，包含生产者的内部私人成本与外部负溢出成本（如污染危害）。'
    },
    formula: 'MSC = MPC + MEC (Marginal External Cost)',
    example: {
      en: 'Producing a tire costs $20 for the factory and generates $8 in smog pollution damage to town residents. MSC is $28.',
      zh: '工厂造一条轮胎成本 $20，但排放烟尘给居民带来 $8 健康损失，因此边际社会成本 MSC 为 $28。'
    },
    examTip: {
      en: 'When negative externalities exist, MSC > MPC. The free market overproduces. Optimal Pigouvian tax = MEC = MSC - MPC.',
      zh: '负外部性存在时 MSC > MPC，自由市场过度生产。最优庇古税额严格等于 MEC = MSC - MPC。'
    },
    relatedConcepts: [
      { termId: 'term-mpc', labelEn: 'Marginal Private Cost (MPC)', labelZh: '边际私人成本', relationEn: 'Differs from MSC by external cost MEC', relationZh: '两者差值即为边际外部成本 MEC' }
    ],
    linkedModelId: 'negative-externalities'
  },
  {
    id: 'term-mpb',
    abbreviation: 'MPB',
    aliases: ['Marginal Private Benefit', 'MPB', '边际私人收益'],
    en: 'Marginal Private Benefit',
    zh: '边际私人收益（MPB）',
    unit: 6,
    topicCode: '6.2',
    category: 'externality',
    definition: {
      en: 'The direct benefit received solely by the consumer from consuming one additional unit of a good. Forms the private demand curve.',
      zh: '消费者个人消费额外一单位产品直接获得的效用增量。对应自由市场的私人需求曲线。'
    },
    formula: 'MPB = Demand Curve in unregulated competitive market',
    example: {
      en: 'A student gets $15 worth of personal satisfaction from getting a flu shot.',
      zh: '一位学生接种流感疫苗给自己带来 $15 的个人防感染健康满足感。'
    },
    relatedConcepts: [
      { termId: 'term-msb', labelEn: 'Marginal Social Benefit (MSB)', labelZh: '边际社会收益', relationEn: 'MSB = MPB + Marginal External Benefit (MEB)', relationZh: 'MSB 等于 MPB 加上边际外部收益' }
    ],
    linkedModelId: 'positive-externalities'
  },
  {
    id: 'term-msb',
    abbreviation: 'MSB',
    aliases: ['Marginal Social Benefit', 'MSB', '边际社会收益'],
    en: 'Marginal Social Benefit',
    zh: '边际社会收益（MSB）',
    unit: 6,
    topicCode: '6.2',
    category: 'externality',
    definition: {
      en: 'The total benefit to society from the consumption of an additional unit of a good, including private benefits and positive spillover benefits.',
      zh: '全社会因消费额外一单位产品所获得的总收益，包含消费者的内部私人收益与对第三方的正面外部溢出收益。'
    },
    formula: 'MSB = MPB + MEB (Marginal External Benefit)',
    example: {
      en: 'A flu shot benefits the student by $15 and prevents flu transmission to classmates, creating $10 in external benefits. MSB is $25.',
      zh: '学生打疫苗获得 $15 私人收益，同时阻断传播保护了周围同学（带来 $10 外部收益），总边际社会收益 MSB 为 $25。'
    },
    examTip: {
      en: 'When positive externalities exist, MSB > MPB. The free market underproduces. Optimal Pigouvian subsidy = MEB = MSB - MPB.',
      zh: '正外部性存在时 MSB > MPB，自由市场生产不足。消除死重损失的最优庇古补贴等于 MEB = MSB - MPB。'
    },
    relatedConcepts: [
      { termId: 'term-mpb', labelEn: 'Marginal Private Benefit (MPB)', labelZh: '边际私人收益', relationEn: 'Differs from MSB by external benefit MEB', relationZh: '两者差值即为外部正收益 MEB' }
    ],
    linkedModelId: 'positive-externalities'
  },
  {
    id: 'term-gini',
    abbreviation: 'Gini',
    aliases: ['Gini Coefficient', 'Gini Index', '基尼系数', 'Lorenz Curve'],
    en: 'Gini Coefficient',
    zh: '基尼系数（Gini Coefficient）',
    unit: 6,
    topicCode: '6.5',
    category: 'general',
    definition: {
      en: 'A statistical measure of income inequality in a population, ranging from 0 (perfect equality) to 1 (perfect inequality).',
      zh: '衡量一国或地区居民收入分配均等化程度的统计指标，取值介于 0（绝对平均）到 1（绝对不平等）之间。'
    },
    formula: 'Gini = Area A / (Area A + Area B) = 2 * Area A',
    example: {
      en: 'If Area A between the 45-degree line and the Lorenz curve is 0.15, the Gini coefficient is 0.15 / 0.5 = 0.30.',
      zh: '若 45 度完全平等线与洛伦兹曲线之间的面积 A 为 0.15，则基尼系数为 0.15 / 0.5 = 0.30。'
    },
    keyCharacteristics: [
      { en: 'Gini = 0: Perfect equality (Lorenz curve is on the 45-degree diagonal).', zh: '基尼系数为 0：绝对平均（洛伦兹曲线与 45 度对角线重合）。' },
      { en: 'Gini = 1: Total inequality (one person has all the income).', zh: '基尼系数为 1：极端不平等（一人独占全部国民收入）。' },
      { en: 'Progressive income taxes and transfer payments shift the Lorenz curve closer to the 45-degree line, decreasing the Gini coefficient.', zh: '累进所得税与转移支付政策使洛伦兹曲线向 45 度线贴近，降低基尼系数。' }
    ],
    relatedConcepts: [
      { termId: 'term-lorenz', labelEn: 'Lorenz Curve', labelZh: '洛伦兹曲线', relationEn: 'Geometrical curve from which Gini is derived', relationZh: '基尼系数由洛伦兹曲线面积直接推导计算' }
    ],
    linkedModelId: 'lorenz-curve-gini'
  },
  {
    id: 'term-lorenz',
    aliases: ['Lorenz Curve', '洛伦兹曲线', 'Cumulative Income'],
    en: 'Lorenz Curve',
    zh: '洛伦兹曲线',
    unit: 6,
    topicCode: '6.5',
    category: 'general',
    definition: {
      en: 'A curve showing the cumulative percentage of national income earned by cumulative percentages of the population.',
      zh: '反映按人口累计百分比排列的群体所占国民总收入累计百分比对应关系的曲线。'
    },
    formula: 'Plots (% Cumulative Population, % Cumulative Income) beneath the 45° line',
    example: {
      en: 'The poorest 20% of households earn 4% of total income, and the poorest 60% earn 32% of total income.',
      zh: '最底层的 20% 家庭占有全社会 4% 的总收入，最底层 60% 家庭占有 32% 的总收入。'
    },
    relatedConcepts: [
      { termId: 'term-gini', labelEn: 'Gini Coefficient', labelZh: '基尼系数', relationEn: 'Ratio of area between 45° line and Lorenz curve to total triangle area', relationZh: '等于 45 度线与洛伦兹曲线间面积与总三角形面积之比' }
    ],
    linkedModelId: 'lorenz-curve-gini'
  },
  // ==========================================
  // ADDITIONAL HIGH-FREQUENCY AP CONCEPTS & ABBREVIATIONS
  // ==========================================
  {
    id: 'term-total-cost',
    abbreviation: 'TC',
    aliases: ['Total Cost', '总成本', 'Economic Cost'],
    en: 'Total Cost (TC)',
    zh: '总成本（TC）',
    unit: 3,
    topicCode: '3.2',
    category: 'cost',
    definition: {
      en: 'The sum of all fixed costs and variable costs incurred by a firm in producing a given level of output.',
      zh: '企业为生产特定数量的产品所发生的全部固定成本与全部可变成本之总和。'
    },
    formula: 'TC = TFC + TVC = ATC × Q',
    unitOfMeasure: { en: 'Dollars ($)', zh: '美元（$）或货币单位' },
    example: {
      en: 'A bakery with $500 monthly rent (TFC) and $300 in flour and labor (TVC) has a Total Cost of $800.',
      zh: '一家面包店每月房租 500 美元（固定成本），面粉和人工支出 300 美元（可变成本），则其总成本为 800 美元。'
    },
    examTip: {
      en: 'Even when output Q = 0, TC = TFC > 0 in the short run. Marginal cost is the slope of the TC curve.',
      zh: '短期内即使产量为 0，TC 依然等于 TFC（大于 0）。边际成本是总成本曲线的切线斜率。'
    },
    relatedConcepts: [
      { termId: 'term-tfc', labelEn: 'Total Fixed Cost (TFC)', labelZh: '总固定成本', relationEn: 'Constant baseline component of TC', relationZh: '构成 TC 中不随产量变化的基准固定部分' },
      { termId: 'term-tvc', labelEn: 'Total Variable Cost (TVC)', labelZh: '总可变成本', relationEn: 'Varying component of TC with output', relationZh: '随产量增减而变动的动态成本部分' },
      { termId: 'term-marginal-cost', labelEn: 'Marginal Cost (MC)', labelZh: '边际成本', relationEn: 'Slope and derivative of TC: d(TC)/dQ', relationZh: 'TC 的切线斜率与导数：d(TC)/dQ' }
    ],
    linkedModelId: 'cost-curves-short-run'
  },
  {
    id: 'term-tfc',
    abbreviation: 'TFC / FC',
    aliases: ['Total Fixed Cost', 'Fixed Cost', '总固定成本', '固定成本', 'Sunk Cost'],
    en: 'Total Fixed Cost (TFC / FC)',
    zh: '总固定成本（TFC / FC）',
    unit: 3,
    topicCode: '3.2',
    category: 'cost',
    definition: {
      en: 'Costs that do not change with the quantity of output produced in the short run (e.g., factory rent, machinery lease).',
      zh: '在短期内不随产品产出数量的变化而变动的支出（例如厂房租金、机器设备租金、固定利息支出）。'
    },
    formula: 'TFC = TC - TVC = AFC × Q',
    unitOfMeasure: { en: 'Dollars ($)', zh: '美元（$）或货币单位' },
    example: {
      en: 'A factory lease of $1,000/month must be paid regardless of whether the factory produces 0 toys or 10,000 toys.',
      zh: '不论工厂本月生产 0 件玩具还是 10,000 件玩具，每月 1,000 美元的厂房租赁费用都必须全额支付。'
    },
    examTip: {
      en: 'TFC is represented as a horizontal flat line on total cost graphs. In the long run, all costs are variable and TFC = 0.',
      zh: '在总额成本坐标系中，TFC 表现为一条完全水平的直线。在长期中所有生产要素皆可调整，因此长期总固定成本为 0。'
    },
    relatedConcepts: [
      { termId: 'term-afc', labelEn: 'Average Fixed Cost (AFC)', labelZh: '平均固定成本', relationEn: 'TFC divided by quantity: AFC = TFC / Q', relationZh: 'TFC 除以产量：AFC = TFC / Q' },
      { termId: 'term-total-cost', labelEn: 'Total Cost (TC)', labelZh: '总成本', relationEn: 'Intercept of TC curve on vertical axis at Q = 0', relationZh: 'Q = 0 时 TC 曲线在纵轴上的截距' }
    ],
    linkedModelId: 'cost-curves-short-run'
  },
  {
    id: 'term-tvc',
    abbreviation: 'TVC / VC',
    aliases: ['Total Variable Cost', 'Variable Cost', '总可变成本', '可变成本'],
    en: 'Total Variable Cost (TVC / VC)',
    zh: '总可变成本（TVC / VC）',
    unit: 3,
    topicCode: '3.2',
    category: 'cost',
    definition: {
      en: 'Costs that change directly in proportion to the quantity of output produced (e.g., raw materials, hourly wages).',
      zh: '随着产出数量的变化而发生同向变动的生产费用（如原材料、计时工资、水电燃料费等）。'
    },
    formula: 'TVC = TC - TFC = AVC × Q',
    unitOfMeasure: { en: 'Dollars ($)', zh: '美元（$）或货币单位' },
    example: {
      en: 'Making each pizza requires $2 in flour and cheese. Producing 100 pizzas generates TVC = $200; producing 200 pizzas generates TVC = $400.',
      zh: '制作每张披萨需要 2 美元的面粉与奶酪。生产 100 张披萨的 TVC 为 200 美元；生产 200 张披萨的 TVC 为 400 美元。'
    },
    examTip: {
      en: 'At Q = 0, TVC = 0. The vertical distance between TC and TVC is always constant and equals TFC.',
      zh: '当产量 Q = 0 时，TVC = 0。TC 与 TVC 之间的垂直间距恒定不变，且正好等于 TFC。'
    },
    relatedConcepts: [
      { termId: 'term-avc', labelEn: 'Average Variable Cost (AVC)', labelZh: '平均可变成本', relationEn: 'TVC divided by output: AVC = TVC / Q', relationZh: 'TVC 除以产量：AVC = TVC / Q' },
      { termId: 'term-marginal-cost', labelEn: 'Marginal Cost (MC)', labelZh: '边际成本', relationEn: 'MC = ΔTVC / ΔQ because TFC does not change', relationZh: '由于 TFC 不变，MC 亦完全等于 ΔTVC / ΔQ' }
    ],
    linkedModelId: 'cost-curves-short-run'
  },
  {
    id: 'term-absolute-advantage',
    abbreviation: 'AA',
    aliases: ['Absolute Advantage', '绝对优势', 'Productivity Advantage'],
    en: 'Absolute Advantage (AA)',
    zh: '绝对优势（AA）',
    unit: 1,
    topicCode: '1.4',
    category: 'general',
    definition: {
      en: 'The ability of an individual, firm, or country to produce more of a good or service using fewer resources (or in less time) than another producer.',
      zh: '一个生产者或国家使用比其他生产者更少的资源（或在相同时间内生产出更多数量）生产某种商品的能力。'
    },
    formula: 'Output Problem: Country with higher output; Input Problem: Country with lower input requirement',
    unitOfMeasure: { en: 'Output per hour or inputs per unit', zh: '每小时产出或单件所需工时' },
    example: {
      en: 'Country A can produce 50 cars per day while Country B can only produce 30 cars per day using the same labor. Country A has absolute advantage in cars.',
      zh: '在相同的劳动力投入下，A 国每天能生产 50 辆汽车，而 B 国仅能生产 30 辆。A 国在汽车生产上拥有绝对优势。'
    },
    examTip: {
      en: 'Do not confuse with Comparative Advantage! Trade is based on Comparative Advantage (lower opportunity cost), NOT Absolute Advantage. A country can gain from trade even if it has no absolute advantage in anything.',
      zh: '切勿与“比较优势”混淆！国际贸易的基础是比较优势（更低的机会成本），而非绝对优势。即便一个国家在所有行业都没有绝对优势，也能通过专业化贸易获益。'
    },
    relatedConcepts: [
      { termId: 'term-comparative-advantage', labelEn: 'Comparative Advantage (CA)', labelZh: '比较优势', relationEn: 'Trade basis determined by lowest opportunity cost', relationZh: '由机会成本决定贸易专业化分工的核心基础' },
      { termId: 'term-opportunity-cost', labelEn: 'Opportunity Cost (OC)', labelZh: '机会成本', relationEn: 'The sacrifice required to evaluate comparative advantage', relationZh: '计算比较优势所必需的机会成本牺牲比率' }
    ],
    linkedModelId: 'comparative-advantage'
  },
  {
    id: 'term-utility-max-rule',
    abbreviation: 'Utility Max Rule',
    aliases: ['Utility Maximizing Rule', 'Equal Marginal Principle', '效用最大化法则', '等边际法则'],
    en: 'Utility-Maximizing Rule',
    zh: '效用最大化法则（等边际法则）',
    unit: 1,
    topicCode: '1.6',
    category: 'general',
    definition: {
      en: 'Consumers maximize total utility within their budget constraint by allocating expenditure such that the marginal utility per dollar spent is equal across all goods.',
      zh: '在有限的预算约束下，消费者应使花费在每种商品上的最后一美元所带来的边际效用均相等，以实现总效用最大化。'
    },
    formula: 'MU_X / P_X = MU_Y / P_Y and (P_X × Q_X) + (P_Y × Q_Y) ≤ Budget',
    unitOfMeasure: { en: 'Utils per dollar', zh: '每美元效用值（Utils/$）' },
    example: {
      en: 'If Good X provides MU = 20 at P = $5 (MU/P = 4) and Good Y provides MU = 15 at P = $3 (MU/P = 5), the consumer should buy more Y and less X to equalize MU/P.',
      zh: '若物品 X 的 MU 为 20、价格 5 美元（MU/P = 4），物品 Y 的 MU 为 15、价格 3 美元（MU/P = 5），消费者应增加购买 Y、减少购买 X 直至比值相等。'
    },
    examTip: {
      en: 'Always test if the selected basket completely exhausts the consumer income. If MU_X / P_X > MU_Y / P_Y, reallocate spending towards Good X.',
      zh: '计算题中必须同时验证是否花光全部预算。若 MU_X / P_X > MU_Y / P_Y，必须向商品 X 转移支出。'
    },
    relatedConcepts: [
      { termId: 'term-marginal-utility', labelEn: 'Marginal Utility (MU)', labelZh: '边际效用', relationEn: 'Numerator of the rule representing extra satisfaction', relationZh: '规则中的分子，代表额外消费一单位带来的满足感增量' },
      { termId: 'term-total-utility', labelEn: 'Total Utility (TU)', labelZh: '总效用', relationEn: 'The objective function being maximized', relationZh: '该法则所追求最大化的目标总满足感' }
    ],
    linkedModelId: 'marginal-analysis-utility'
  },
  {
    id: 'term-profit-max-rule',
    abbreviation: 'MR = MC',
    aliases: ['Profit Maximizing Rule', 'Golden Rule of Profit Maximization', '利润最大化条件', '边际收益等于边际成本'],
    en: 'Profit-Maximizing Rule (MR = MC)',
    zh: '利润最大化条件（MR = MC）',
    unit: 3,
    topicCode: '3.6',
    category: 'structure',
    definition: {
      en: 'All profit-maximizing firms in any market structure produce the quantity of output where Marginal Revenue equals Marginal Cost (MR = MC), provided Price exceeds AVC in the short run.',
      zh: '任何市场结构下的所有营利性企业，其追求利润最大化（或亏损最小化）的最优产量必定位于边际收益等于边际成本（MR = MC）处，前提是短期内价格不低于 AVC。'
    },
    formula: 'MR = MC (if MR > MC, expand output; if MR < MC, cut output)',
    unitOfMeasure: { en: 'Dollars per unit ($/Q)', zh: '美元/单位（$/件）' },
    example: {
      en: 'A firm producing 50 units has MR = $12 and MC = $8 (MR > MC, profit increases by expanding). At 60 units, MR = MC = $10, which maximizes total profit.',
      zh: '产量 50 件时 MR = 12 美元，MC = 8 美元（MR > MC，继续增产可增加总利润）；当产量达到 60 件时 MR = MC = 10 美元，总利润达到峰值。'
    },
    examTip: {
      en: 'Universal rule for Perfect Competition, Monopoly, Monopolistic Competition, and Oligopoly. In Perfect Competition, P = MR, so P = MC.',
      zh: '适用于完全竞争、垄断、垄断竞争及寡头所有市场结构。在完全竞争市场中，由于 P = MR，该法则等价于 P = MC。'
    },
    relatedConcepts: [
      { termId: 'term-marginal-revenue', labelEn: 'Marginal Revenue (MR)', labelZh: '边际收益', relationEn: 'Additional revenue from selling one more unit', relationZh: '额外售出一单位产品所带来的总收益变动' },
      { termId: 'term-marginal-cost', labelEn: 'Marginal Cost (MC)', labelZh: '边际成本', relationEn: 'Additional cost of producing one more unit', relationZh: '额外生产一单位产品所引致的总成本变动' },
      { termId: 'term-shutdown-rule', labelEn: 'Shutdown Rule', labelZh: '停产法则', relationEn: 'Condition required before applying MR = MC', relationZh: '应用 MR = MC 之前必须满足的企业生存前提' }
    ],
    linkedModelId: 'perfect-competition-side-by-side'
  },
  {
    id: 'term-shutdown-rule',
    abbreviation: 'Shutdown Rule',
    aliases: ['Shutdown Decision', '停产法则', '停产临界点', 'Short-run Shutdown'],
    en: 'Shutdown Rule',
    zh: '停产法则（短期停产临界点）',
    unit: 3,
    topicCode: '3.7',
    category: 'structure',
    definition: {
      en: 'In the short run, a firm should continue operating as long as Price covers Average Variable Cost (P ≥ AVC) or Total Revenue covers Total Variable Cost (TR ≥ TVC). If P < min AVC, the firm minimizes losses by shutting down immediately (loss = TFC).',
      zh: '在短期内，只要产品市场价格能够覆盖平均可变成本（P ≥ AVC）或总收益能覆盖总可变成本（TR ≥ TVC），即使处于亏损状态企业也应继续维持生产；若价格跌破 AVC 最低点（P < min AVC），企业应立即停产以将亏损锁定在 TFC。'
    },
    formula: 'Short Run: Shutdown if P < min AVC (or TR < TVC); Long Run: Exit market if P < min ATC (or TR < TC)',
    unitOfMeasure: { en: 'Price vs Cost comparison ($/Q)', zh: '价格与单位成本对比（$/件）' },
    example: {
      en: 'A firm produces at MC = $10 with ATC = $14 and AVC = $9. If market price is $10, P ($10) > AVC ($9): the firm loses $4/unit on fixed costs, but covers variable costs and contributes $1/unit toward fixed costs, so it stays open.',
      zh: '厂商在 MC = 10 美元生产，此时 ATC = 14 美元，AVC = 9 美元。若市价为 10 美元，由于 P (10) > AVC (9)，每售出一件能偿还 1 美元固定成本，比直接停产亏损 5 美元固定成本更划算，故短期坚持营业。'
    },
    examTip: {
      en: 'A firm’s short-run supply curve is its Marginal Cost (MC) curve ABOVE the minimum of the Average Variable Cost (AVC) curve.',
      zh: '完全竞争厂商的短期供给曲线，正是其位于平均可变成本（AVC）最低点之上的边际成本（MC）曲线部分。'
    },
    relatedConcepts: [
      { termId: 'term-avc', labelEn: 'Average Variable Cost (AVC)', labelZh: '平均可变成本', relationEn: 'Benchmark threshold for short-run shutdown', relationZh: '短期停产决策的关键门槛指标' },
      { termId: 'term-atc', labelEn: 'Average Total Cost (ATC)', labelZh: '平均总成本', relationEn: 'Benchmark threshold for long-run exit/entry', relationZh: '长期退出或进入市场的盈亏平衡判断基准' }
    ],
    linkedModelId: 'shutdown-rule'
  },
  {
    id: 'term-allocative-efficiency',
    abbreviation: 'Allocative Efficiency',
    aliases: ['Allocative Efficiency', '配置效率', 'P = MC', 'Socially Optimal Output'],
    en: 'Allocative Efficiency (P = MC)',
    zh: '配置效率（P = MC）',
    unit: 4,
    topicCode: '4.2',
    category: 'welfare',
    definition: {
      en: 'Achieved when goods and services are distributed according to consumer preferences such that Price equals Marginal Cost (P = MC), or Marginal Social Benefit equals Marginal Social Cost (MSB = MSC). At this output, total economic surplus is maximized and DWL is zero.',
      zh: '当社会资源的配置与消费者的偏好完全匹配，使得商品价格等于边际成本（P = MC），或边际社会收益等于边际社会成本（MSB = MSC）时达成的经济效率。此时全社会总福利达到最大，无谓损失为零。'
    },
    formula: 'P = MC or MSB = MSC (Deadweight Loss = 0)',
    unitOfMeasure: { en: 'Efficiency criterion', zh: '资源配置效率标准' },
    example: {
      en: 'Under perfect competition with no externalities, market price $25 reflects marginal social benefit and equals marginal cost $25, achieving allocative efficiency.',
      zh: '在无外部性的完全竞争市场中，25 美元的市场价格准确反映了消费者的边际收益且等于生产者的边际成本 25 美元，实现了配置效率。'
    },
    examTip: {
      en: 'Single-price monopolies fail allocative efficiency because P > MC, resulting in deadweight loss and underproduction.',
      zh: '单一定价垄断厂商由于索取价格高于边际成本（P > MC），导致产量低于社会最优水平并产生无谓损失，因而无法实现配置效率。'
    },
    relatedConcepts: [
      { termId: 'term-productive-efficiency', labelEn: 'Productive Efficiency', labelZh: '生产效率', relationEn: 'Complementary efficiency condition: P = min ATC', relationZh: '效率概念的另一维度：P = min ATC 最低成本生产' },
      { termId: 'term-deadweight-loss', labelEn: 'Deadweight Loss (DWL)', labelZh: '无谓损失', relationEn: 'Surplus lost when allocative efficiency is not met', relationZh: '未达成配置效率时被浪费的社会剩余' }
    ],
    linkedModelId: 'market-equilibrium-welfare'
  },
  {
    id: 'term-productive-efficiency',
    abbreviation: 'Productive Efficiency',
    aliases: ['Productive Efficiency', '生产效率', 'P = min ATC', 'Lowest Cost Output'],
    en: 'Productive Efficiency (P = min ATC)',
    zh: '生产效率（P = min ATC）',
    unit: 4,
    topicCode: '4.2',
    category: 'cost',
    definition: {
      en: 'Achieved when goods are produced at the lowest possible per-unit cost, which occurs where production takes place at the minimum of the Average Total Cost (ATC) curve.',
      zh: '当社会以可能实现的最低单位平均成本制造产品时达成的效率状态。在图表上表现为企业在平均总成本（ATC）曲线的最低点进行生产。'
    },
    formula: 'Production at Min ATC (In competitive long-run equilibrium: P = min ATC)',
    unitOfMeasure: { en: 'Efficiency criterion', zh: '单位生产成本最低标准' },
    example: {
      en: 'In long-run competitive equilibrium, free entry forces firms to produce where price equals the minimum point of ATC ($15), ensuring no waste of scarce resources.',
      zh: '在完全竞争的长期均衡中，自由进退机制迫使厂商在价格等于 ATC 最低点（如 15 美元）处生产，确保稀缺资源没有任何浪费。'
    },
    examTip: {
      en: 'In monopolistic competition long-run equilibrium, firms produce on the downward-sloping portion of ATC (to the left of min ATC), creating Excess Capacity and failing productive efficiency.',
      zh: '垄断竞争长期均衡中，厂商位于向下倾斜的 ATC 区域生产（在 min ATC 左侧），存在“过剩产能”，因而无法实现生产效率。'
    },
    relatedConcepts: [
      { termId: 'term-atc', labelEn: 'Average Total Cost (ATC)', labelZh: '平均总成本', relationEn: 'Curve whose minimum defines productive efficiency', relationZh: '其曲线最低点定义了生产效率' },
      { termId: 'term-excess-capacity', labelEn: 'Excess Capacity', labelZh: '过剩产能', relationEn: 'Difference between actual output and productive efficient output', relationZh: '实际产量与达到生产效率的最优产量之间的产能差额' }
    ],
    linkedModelId: 'perfect-competition-side-by-side'
  },
  {
    id: 'term-monopsony',
    abbreviation: 'Monopsony',
    aliases: ['Monopsony', '买方垄断', 'Labor Monopsony', 'Single Buyer'],
    en: 'Monopsony (Single Buyer of Factor)',
    zh: '买方垄断（要素市场单一买方）',
    unit: 5,
    topicCode: '5.3',
    category: 'factor',
    definition: {
      en: 'A market structure where there is only one buyer (single employer) of a factor of production (e.g. labor in a remote company town). Because hiring additional workers raises the wage for all workers, the Marginal Factor Cost curve lies above the Labor Supply curve (MFC > S_L).',
      zh: '某种生产要素只有唯一一个买方（单一雇主）的市场结构（例如偏远矿区的唯一大型雇主）。因增雇员工必须对全体在职员工加薪，导致边际要素成本曲线高于劳动力供给曲线（MFC > S_L）。'
    },
    formula: 'Hires where MRP = MFC, but pays wage W_M from Supply curve at that quantity (W_M < MRP)',
    unitOfMeasure: { en: 'Labor wage ($/hour) and workers (L)', zh: '工资率与雇佣人数' },
    example: {
      en: 'A mining company sets employment where MRP = MFC = $25/hr. However, looking down to the labor supply curve, workers are willing to work at $16/hr, so the monopsonist pays only $16.',
      zh: '矿业公司在 MRP = MFC = 25 美元/小时处确定雇佣人数。然而根据劳动力供给曲线，工人在该雇佣量下只需 16 美元即可被招募，因此买方垄断者仅支付 16 美元工资。'
    },
    examTip: {
      en: 'Compared to competitive labor markets, a monopsony hires FEWER workers and pays a LOWER wage, generating deadweight loss in factor markets.',
      zh: '与完全竞争要素市场相比，买方垄断雇佣更少的工人并支付更低的工资，在要素市场上造成无谓损失与剥削。'
    },
    relatedConcepts: [
      { termId: 'term-mfc', labelEn: 'Marginal Factor Cost (MFC)', labelZh: '边际要素成本', relationEn: 'The steep curve above labor supply that determines hiring', relationZh: '位于供给曲线上方并决定雇佣数量的陡峭成本曲线' },
      { termId: 'term-mrp', labelEn: 'Marginal Revenue Product (MRP)', labelZh: '边际收益产品', relationEn: 'Labor demand curve equated with MFC', relationZh: '与 MFC 相等以确定雇佣人数的要素需求曲线' }
    ],
    linkedModelId: 'monopsony-factor-market'
  },
  {
    id: 'term-natural-monopoly',
    abbreviation: 'Natural Monopoly',
    aliases: ['Natural Monopoly', '自然垄断', 'Regulated Monopoly'],
    en: 'Natural Monopoly',
    zh: '自然垄断',
    unit: 4,
    topicCode: '4.4',
    category: 'structure',
    definition: {
      en: 'An industry where economies of scale are so pervasive that a single firm can produce total market output at a lower average total cost than two or more competing firms could.',
      zh: '由于规模经济极为显著，由一家单一企业供应整个市场的产出，其平均总成本明显低于由两家或多家相互竞争的企业供应时的行业形态（如城市自来水管网、电网输送）。'
    },
    formula: 'LRATC declines over the entire relevant range of market demand',
    unitOfMeasure: { en: 'Cost ($) vs Market Demand (Q)', zh: '平均成本与市场需求规模对比' },
    example: {
      en: 'A municipal water utility involves massive upfront piping infrastructure. Duplicating water pipes across city streets would drastically increase average cost for everyone.',
      zh: '市政自来水公司具有庞大的地下管网初始固定投资。如果允许多家企业在同一街道重复铺设水管，将导致每个人的平均供水成本大幅暴增。'
    },
    examTip: {
      en: 'Government regulators face two options: 1) Socially Optimal Price (P = MC, allocatively efficient, but firm suffers economic losses); 2) Fair-Return Price (P = ATC, normal profit, no subsidy needed).',
      zh: '政府管制自然垄断面临两种定价：1) 社会最优价格（P = MC，达成配置效率，但企业发生亏损需要补贴）；2) 公平回报价格（P = ATC，零经济利润/正常利润，无需财政补贴）。'
    },
    relatedConcepts: [
      { termId: 'term-lratc', labelEn: 'Long-Run Average Total Cost (LRATC)', labelZh: '长期平均总成本', relationEn: 'Downward-sloping economies of scale curve', relationZh: '在市场需求范围内持续单调下降的规模经济曲线' },
      { termId: 'term-allocative-efficiency', labelEn: 'Socially Optimal Pricing', labelZh: '社会最优定价', relationEn: 'Regulatory target at P = MC', relationZh: '管制机构强制要求的 P = MC 配置效率目标' }
    ],
    linkedModelId: 'monopoly-single-price'
  },
  {
    id: 'term-economic-profit',
    abbreviation: 'Profit (π)',
    aliases: ['Economic Profit', 'Accounting Profit', 'Normal Profit', '经济利润', '会计利润', '正常利润'],
    en: 'Economic Profit vs Accounting Profit',
    zh: '经济利润与会计利润（正常利润）',
    unit: 3,
    topicCode: '3.1',
    category: 'revenue',
    definition: {
      en: 'Accounting Profit equals Total Revenue minus Explicit Costs. Economic Profit equals Total Revenue minus BOTH Explicit and Implicit (Opportunity) Costs. Zero economic profit is called Normal Profit, where resources earn exactly what they could in their next best alternative.',
      zh: '会计利润等于总收益减去显性支出成本；经济利润等于总收益减去显性成本与隐性（机会）成本的总和。零经济利润被称为“正常利润”，表明所有投入要素赚取了与其在次优选择中完全相同的回报。'
    },
    formula: 'Economic Profit = TR - Explicit Costs - Implicit Costs = Accounting Profit - Implicit Costs',
    unitOfMeasure: { en: 'Dollars ($)', zh: '货币金额（$）' },
    example: {
      en: 'An entrepreneur makes $100k revenue, pays $60k in supplies/rent (explicit), and gave up a $30k job elsewhere (implicit). Accounting profit = $40k. Economic profit = $10k.',
      zh: '某创业者年营业收入 10 万美元，原料与房租显性支出 6 万美元，放弃了原先年薪 3 万美元的外企工作（隐性成本）。其会计利润为 4 万美元，但经济利润仅为 1 万美元。'
    },
    examTip: {
      en: 'In long-run competitive equilibrium, Economic Profit = 0 (Normal Profit). This does NOT mean the entrepreneur is starving—they are earning full market return for their time and capital.',
      zh: '在完全竞争长期均衡中，经济利润等于 0（正常利润）。这并不意味着老板破产挨饿，而是其资本和企业家才能获得了充分的市场平均补偿。'
    },
    relatedConcepts: [
      { termId: 'term-total-revenue', labelEn: 'Total Revenue (TR)', labelZh: '总收益', relationEn: 'Top-line inflow of funds', relationZh: '企业全部资金流入总量' },
      { termId: 'term-opportunity-cost', labelEn: 'Opportunity Cost (Implicit Cost)', labelZh: '机会成本与隐性成本', relationEn: 'Deducted in economic profit calculations', relationZh: '计算经济利润时被扣除的次优选择代价' }
    ],
    linkedModelId: 'perfect-competition-side-by-side'
  },
  {
    id: 'term-price-ceiling',
    abbreviation: 'Price Ceiling',
    aliases: ['Price Ceiling', '最高限价', 'Rent Control', 'Shortage'],
    en: 'Price Ceiling',
    zh: '最高限价（价格上限）',
    unit: 2,
    topicCode: '2.8',
    category: 'welfare',
    definition: {
      en: 'A legally established maximum price that sellers are permitted to charge. A price ceiling is only binding (effective) if it is set BELOW the free-market equilibrium price, resulting in a persistent shortage (QD > QS).',
      zh: '由政府法律规定的某种商品或服务的最高法定售价。最高限价仅在设定于自由市场均衡价格之下时才具有实际约束力（Binding），并将引发持续的市场短缺（需求量大于供给量）。'
    },
    formula: 'Binding if P_ceiling < P*; Shortage = Q_D - Q_S',
    unitOfMeasure: { en: 'Dollars per unit ($/Q)', zh: '法定限价（$/件）' },
    example: {
      en: 'If market rent is $1,500/month and government sets a binding rent ceiling at $1,000, landlords supply 800 apartments while tenants demand 1,400, creating a shortage of 600 apartments.',
      zh: '若市场均衡租金为每月 1,500 美元，政府出台 1,000 美元的房租最高限价，房东仅愿提供 800 套住房，而租客需求达到 1,400 套，产生 600 套住房的供不应求短缺。'
    },
    examTip: {
      en: 'A price ceiling set ABOVE equilibrium is non-binding and has no effect on market price or quantity. A binding ceiling reduces producer surplus and creates deadweight loss.',
      zh: '设定在均衡价格之上的最高限价是无约束力的（Non-binding），对市场价格与成交量没有任何影响。有约束力的限价会缩减生产者剩余并造成无谓损失。'
    },
    relatedConcepts: [
      { termId: 'term-price-floor', labelEn: 'Price Floor', labelZh: '最低限价', relationEn: 'Opposite legal regulation set above equilibrium', relationZh: '设定在均衡价格之上的反向法定价格管制' },
      { termId: 'term-deadweight-loss', labelEn: 'Deadweight Loss (DWL)', labelZh: '无谓损失', relationEn: 'Loss of surplus due to reduced transactions Q_S < Q*', relationZh: '因成交量受限 Q_S < Q* 所导致的社会净福利损失' }
    ],
    linkedModelId: 'price-controls-ceilings-floors'
  },
  {
    id: 'term-price-floor',
    abbreviation: 'Price Floor',
    aliases: ['Price Floor', '最低限价', 'Minimum Wage', 'Surplus'],
    en: 'Price Floor',
    zh: '最低限价（价格下限）',
    unit: 2,
    topicCode: '2.8',
    category: 'welfare',
    definition: {
      en: 'A legally established minimum price that buyers must pay. A price floor is only binding (effective) if it is set ABOVE the free-market equilibrium price, resulting in a persistent surplus (QS > QD).',
      zh: '由政府法律规定的某种商品或服务所允许支付的最低法定购买价。最低限价仅在设定于自由市场均衡价格之上时才具有实际约束力（Binding），并将引发持续的产品过剩（供给量大于需求量）。'
    },
    formula: 'Binding if P_floor > P*; Surplus = Q_S - Q_D',
    unitOfMeasure: { en: 'Dollars per unit ($/Q)', zh: '法定保底价（$/件）' },
    example: {
      en: 'If equilibrium wage is $10/hr and minimum wage is set at $15/hr, employers demand 300 workers while 500 workers seek jobs, creating a surplus of 200 unemployed workers.',
      zh: '若非熟练劳动力市场均衡时薪为 10 美元，政府颁布 15 美元的法定最低工资，企业仅雇佣 300 名员工，而有 500 名员工求职，产生 200 人的劳动力过剩（失业）。'
    },
    examTip: {
      en: 'A price floor set BELOW equilibrium is non-binding. Binding agricultural price supports require government to purchase and store the unsold surplus.',
      zh: '设定在均衡价格之下的最低限价是无约束力的。针对农产品的有约束力价格支持政策通常需要政府财政出资收购并仓储滞销的过剩农产品。'
    },
    relatedConcepts: [
      { termId: 'term-price-ceiling', labelEn: 'Price Ceiling', labelZh: '最高限价', relationEn: 'Counterpart legal price control', relationZh: '相对立的法定最高限价机制' },
      { termId: 'term-deadweight-loss', labelEn: 'Deadweight Loss (DWL)', labelZh: '无谓损失', relationEn: 'Deadweight loss caused by reduced trade Q_D < Q*', relationZh: '由于购买量萎缩至 Q_D < Q* 所造成的无谓损失' }
    ],
    linkedModelId: 'price-controls-ceilings-floors'
  },
  {
    id: 'term-public-goods',
    abbreviation: 'Public Goods',
    aliases: ['Public Good', '公共物品', 'Non-rival', 'Non-excludable', 'Free-rider'],
    en: 'Public Goods & Free-Rider Problem',
    zh: '公共物品与搭便车问题',
    unit: 6,
    topicCode: '6.3',
    category: 'externality',
    definition: {
      en: 'Goods that are both non-excludable (people cannot be prevented from using them without paying) and non-rival in consumption (one person’s consumption does not reduce availability to others), such as national defense or flood control lighthouses. Free markets underproduce public goods due to the free-rider problem.',
      zh: '同时具备非排他性（无法阻止未付费者消费享用）与非竞争性（一个人的消费不会减少其他人享用数量）特征的物品（如国防安全、防洪堤坝、灯塔）。由于搭便车问题的普遍存在，自由市场将无法自发提供或严重短缺公共物品。'
    },
    formula: 'Market Demand = Vertical Sum of individual marginal benefit curves (Sum P_i at each Q)',
    unitOfMeasure: { en: 'Marginal social benefit vs cost', zh: '边际社会收益与边际成本对比' },
    example: {
      en: 'A neighborhood fireworks show costs $1,000. Each neighbor enjoys it whether they chip in or not. Because people can free-ride, voluntary funding fails to raise enough money.',
      zh: '社区烟花表演需要花费 1,000 美元。无论居民是否掏钱赞助，抬头都能看见烟花。由于人人都可以“搭便车”，自愿集资往往难以凑足所需费用。'
    },
    examTip: {
      en: 'Do not confuse "public goods" with "goods provided by the government". Postal delivery is provided by the government but is excludable and rival (private good). Public goods require both non-excludable AND non-rival traits.',
      zh: '切勿将“公共物品”等同于“政府提供的物品”。政府运营的邮政包裹快递具有排他性和竞争性，属于私人物品。公共物品必须同时满足“非排他”与“非竞争”两大属性。'
    },
    relatedConcepts: [
      { termId: 'term-msb', labelEn: 'Marginal Social Benefit (MSB)', labelZh: '边际社会收益', relationEn: 'Vertical summation of all citizens willingness to pay', relationZh: '对所有公民边际支付意愿进行垂直加总得到的社会需求曲线' },
      { termId: 'term-msc', labelEn: 'Marginal Social Cost (MSC)', labelZh: '边际社会成本', relationEn: 'Equated with MSB to determine optimal public output', relationZh: '与 MSB 相交以确定公共物品的最优提供量' }
    ],
    linkedModelId: 'public-goods-provision'
  },
  {
    id: 'term-tariff',
    abbreviation: 'Tariff',
    aliases: ['Tariff', '关税', 'Import Quota', 'Protectionism'],
    en: 'Tariffs & Trade Protection',
    zh: '关税与贸易保护',
    unit: 2,
    topicCode: '2.9',
    category: 'welfare',
    definition: {
      en: 'A per-unit excise tax levied by government on imported foreign goods. A tariff raises the domestic price of the imported good above world price (P_W + Tariff), expanding domestic production, shrinking domestic consumption, reducing total imports, and generating government revenue and deadweight loss.',
      zh: '政府对外国进口货物按每单位征收的特定关税。关税将国内销售价格提高至世界价格之上（P_W + 关税），从而刺激国内受保护厂商增产、抑制国内消费总需求、削减进口总量，产生政府关税收入以及两块无谓损失。'
    },
    formula: 'Domestic Price = P_World + Tariff; Imports = Q_D - Q_S',
    unitOfMeasure: { en: 'Dollars per imported unit ($/Q)', zh: '每件进口商品关税额（$/件）' },
    example: {
      en: 'World steel price is $400/ton. A $50 tariff raises domestic price to $450. Domestic producers expand output from 200 to 300 tons, consumer demand drops from 800 to 700 tons, and imports drop from 600 to 400 tons.',
      zh: '世界钢材售价为每吨 400 美元。征收 50 美元关税后国内钢价升至 450 美元。国内钢厂产量由 200 增至 300 吨，消费者需求量由 800 降至 700 吨，进口量由 600 压缩至 400 吨。'
    },
    examTip: {
      en: 'A tariff creates TWO deadweight loss triangles: production inefficiency (domestic producers producing at higher MC than world price) and consumption inefficiency (underconsumption by buyers).',
      zh: '关税会制造两个无谓损失三角形：生产无效率损失（国内低效厂商以高于世界价格的成本生产）与消费无效率损失（国内消费者被迫削减消费）。'
    },
    relatedConcepts: [
      { termId: 'term-deadweight-loss', labelEn: 'Deadweight Loss (DWL)', labelZh: '无谓损失', relationEn: 'Net loss of world surplus from tariff distortions', relationZh: '关税扭曲造成的两块社会净福利损失' },
      { termId: 'term-consumer-surplus', labelEn: 'Consumer Surplus (CS)', labelZh: '消费者剩余', relationEn: 'Surplus transferred to producers, government, and DWL', relationZh: '国内消费者剩余大幅缩水并转移给国内厂商与政府' }
    ],
    linkedModelId: 'international-trade-tariffs'
  }
];
