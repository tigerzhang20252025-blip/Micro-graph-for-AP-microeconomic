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
  },
  // ==========================================
  // EXPANDED UNIT 1: Basic Economic Principles & Decision Rules
  // ==========================================
  {
    id: 'term-ceteris-paribus',
    abbreviation: 'Ceteris Paribus',
    aliases: ['Other things being equal', '其他条件不变', 'All else equal'],
    en: 'Ceteris Paribus',
    zh: '其他条件不变（假定）',
    unit: 1,
    topicCode: '1.1',
    category: 'general',
    definition: {
      en: 'A foundational Latin assumption meaning "all other things held constant". In economic models, it isolates the independent effect of a single explanatory variable on an outcome without confounding interference.',
      zh: '意为“在其他条件保持不变的前提下”的经济学核心假设。通过将除所研究变量以外的所有其他潜在影响因素冻结为常数，从而分离出单一变量对经济结果的因果影响。'
    },
    formula: 'ΔY = f(ΔX) holding Z_1, Z_2, ..., Z_n constant',
    example: {
      en: 'When analyzing how a price hike impacts the quantity demanded of apples, ceteris paribus assumes consumer income, tastes, and the prices of oranges remain strictly unchanged.',
      zh: '在分析苹果价格上涨对苹果需求量的影响时，“其他条件不变”假定消费者的收入水平、偏好习惯以及橙子的售价完全保持不变。'
    },
    examTip: {
      en: 'A movement along a demand/supply curve occurs strictly due to the goods own price changing (ceteris paribus holds). If a non-price determinant changes, ceteris paribus is violated, causing the entire curve to shift.',
      zh: '沿需求/供给曲线的点移动严格由于该商品自身价格变动（其他条件保持不变）；一旦非价格决定因素变动，即打破该假定，导致整条曲线发生移动。'
    },
    keyCharacteristics: [
      { en: 'Crucial for establishing direct causality in microeconomic models', zh: '建立微观经济学因果推论的基础假定' },
      { en: 'Distinguishes curve shifts from movements along a curve', zh: '严格区分整条曲线平移与沿曲线的点移动' }
    ],
    relatedConcepts: [
      { termId: 'term-demand', labelEn: 'Demand Curve', labelZh: '需求曲线', relationEn: 'Constructed under ceteris paribus assumption', relationZh: '在其他条件不变假定下构建的需求轨迹' },
      { termId: 'term-supply', labelEn: 'Supply Curve', labelZh: '供给曲线', relationEn: 'Isolates price-quantity supplied relationship', relationZh: '分离自身价格与供给量对应关系的分析前提' }
    ]
  },
  {
    id: 'term-positive-normative',
    abbreviation: 'Positive / Normative',
    aliases: ['Positive Economics', 'Normative Economics', '实证经济学', '规范经济学'],
    en: 'Positive vs Normative Economics',
    zh: '实证经济学与规范经济学',
    unit: 1,
    topicCode: '1.1',
    category: 'general',
    definition: {
      en: 'Positive economics deals with objective, fact-based statements describing "what is" or "what will happen" that can be tested against real empirical data. Normative economics incorporates subjective value judgments and prescriptive opinions about "what ought to be" or "what should be".',
      zh: '实证经济学关注客观陈述“是什么”或“将会怎样”，可以用现实数据检验真伪；规范经济学则包含主观价值判断与伦理主张，探讨“应当怎样”或“最好如何”，无法仅凭数据证伪。'
    },
    formula: 'Positive = Fact / Empirical Prediction; Normative = Value Judgment ("Should" / "Ought")',
    example: {
      en: 'Positive: "Raising the minimum wage to $15 will decrease teenage employment by 3%." Normative: "The government should raise the minimum wage to ensure all workers earn a living wage."',
      zh: '实证陈述：“将最低时薪提高到 15 美元会使青少年就业率下降 3%。”规范陈述：“政府应当提高最低工资以保障所有劳动者的尊严生活。”'
    },
    examTip: {
      en: 'Look for words like "should", "ought to", "fair", "unfair", or "equitable" on multiple-choice questions—these are classic dead giveaways of normative economic statements.',
      zh: '在选择题中寻找 "should"、"ought to"、"fair"（公平）、"unfair" 等主观修饰词，这些是典型的规范经济学标志。'
    },
    keyCharacteristics: [
      { en: 'Positive statements can be verified, proved, or disproved by evidence', zh: '实证论断可以通过现实统计数据予以检验与证实/证伪' },
      { en: 'Normative statements represent prescriptive policy opinions', zh: '规范论断代表带有价值取向的政策主张' }
    ],
    relatedConcepts: [
      { termId: 'term-opportunity-cost', labelEn: 'Opportunity Cost', labelZh: '机会成本', relationEn: 'Positive measurement of real forgone benefits', relationZh: '对放弃真实回报的客观度量' }
    ]
  },
  {
    id: 'term-factors-of-production',
    abbreviation: 'FOP',
    aliases: ['Factors of Production', 'Economic Resources', '生产要素', 'Land Labor Capital Entrepreneurship'],
    en: 'Factors of Production (FOP)',
    zh: '生产要素（四要素）',
    unit: 1,
    topicCode: '1.1',
    category: 'general',
    definition: {
      en: 'The four fundamental economic resource inputs used to produce all goods and services in an economy: Land (natural resources), Labor (human physical and mental effort), Capital (manufactured tools, machinery, and structures), and Entrepreneurship (risk-taking innovation and resource combination).',
      zh: '生产经济中所有商品与服务所需的四种基本资源要素：土地（自然资源与矿产）、劳动力（人类体力与智力劳动）、资本（制造出的机器工具厂房）和企业家才能（承担风险的创新与要素整合）。'
    },
    formula: 'Inputs = Land (Rent) + Labor (Wages) + Capital (Interest) + Entrepreneurship (Profit)',
    example: {
      en: 'In a modern bakery, the wheat field and storefront lot are Land, the baker is Labor, the commercial convection oven is Physical Capital, and the bakery owner who started the venture is Entrepreneurship.',
      zh: '在一家烘焙店中，种植小麦的土地与店面地皮属于土地，面包师属于劳动，商用热风烤箱属于实物资本，而创办这家店铺承担盈亏的店主属于企业家才能。'
    },
    examTip: {
      en: 'AP trap: Money, stocks, and bonds are FINANCIAL capital, NOT economic capital! Economic capital refers exclusively to manufactured physical equipment and tools used in the actual production process.',
      zh: 'AP 经典陷阱：货币、股票和债券属于金融资产，绝非经济学意义上的生产要素“资本”！经济学中的资本专指投入实际生产制造的机器、厂房和工具。'
    },
    keyCharacteristics: [
      { en: 'Land earns rent; Labor earns wages; Capital earns interest; Entrepreneurship earns profit', zh: '土地赚取地租，劳动赚取工资，资本赚取利息，企业家才能赚取利润' },
      { en: 'Capital refers to manufactured tools that enhance future productivity', zh: '资本指提高未来生产率的制造工具与装备' }
    ],
    relatedConcepts: [
      { termId: 'term-ppc', labelEn: 'Production Possibilities Curve (PPC)', labelZh: '生产可能性边界', relationEn: 'PPC frontier is determined by available quantity and quality of FOP', relationZh: 'PPC 边界外推取决于四大生产要素的数量与生产率' },
      { termId: 'term-derived-demand', labelEn: 'Derived Demand', labelZh: '派生需求', relationEn: 'Demand for FOP is derived from consumer demand for final output', relationZh: '对生产要素的需求源自最终消费品的需求' }
    ]
  },
  {
    id: 'term-capital-vs-consumer-goods',
    abbreviation: 'Capital vs Consumer',
    aliases: ['Capital Goods', 'Consumer Goods', '资本品与消费品', 'Future Growth'],
    en: 'Capital Goods vs Consumer Goods',
    zh: '资本品与消费品（未来增长权衡）',
    unit: 1,
    topicCode: '1.2',
    category: 'general',
    definition: {
      en: 'Consumer goods are final products purchased directly by households for immediate personal utility and satisfaction. Capital goods are manufactured physical tools, machinery, and infrastructure used to produce other goods and services, driving future long-run economic growth.',
      zh: '消费品是家庭或个人购买用于直接满足当前生活消费的最终产品；资本品则是制造用于生产其他商品和服务的机器、厂房与基础设施，能提升未来生产潜能并推动长期经济增长。'
    },
    formula: 'More Capital Goods Today -> Larger Outward Shift of Future PPC (Faster Economic Growth)',
    example: {
      en: 'A pair of designer sneakers is a consumer good providing immediate utility. An industrial robotic assembly line is a capital good that enables a factory to manufacture thousands of products over the next 15 years.',
      zh: '一双时装运动鞋是提供即时生活体验的消费品；而一条工业自动化机器人装配线则是资本品，帮助工厂在未来 15 年内持续制造数以万计的产出。'
    },
    examTip: {
      en: 'On PPC exam questions: An economy that allocates a greater share of resources to producing capital goods today will experience significantly greater outward expansion of its PPC in future years than an economy prioritizing consumer goods.',
      zh: 'PPC 经典考点：当前将更大比例资源配置于制造资本品（投资未来）的经济体，其未来的生产可能性边界（PPC）向外扩张幅度将显著大于沉溺于消费品的经济体。'
    },
    keyCharacteristics: [
      { en: 'Consumer goods provide immediate consumption utility today', zh: '消费品提供当下即时效用满足' },
      { en: 'Capital goods represent investment in expanded future productive capacity', zh: '资本品代表对未来生产能力的资本积累与投资' }
    ],
    relatedConcepts: [
      { termId: 'term-ppc', labelEn: 'Production Possibilities Curve (PPC)', labelZh: '生产可能性边界', relationEn: 'Tradeoff between current consumption and future growth frontier', relationZh: '当下消费品产出与未来生产力扩张之间的权衡' }
    ],
    linkedModelId: 'ppc-model'
  },
  {
    id: 'term-output-method-ooo',
    abbreviation: 'OOO Rule',
    aliases: ['Output Method', 'Output Other Over', '产出法', '比较优势计算公式'],
    en: "Output Method ('OOO' Rule)",
    zh: "产出法比较优势判定（'OOO' 法则）",
    unit: 1,
    topicCode: '1.3',
    category: 'general',
    definition: {
      en: 'A standardized AP rule for calculating per-unit opportunity cost when economic data measures variable OUTPUT produced from a fixed amount of resources or time. The mnemonic "OOO" stands for "Output: Other Over".',
      zh: '在固定资源或时间内衡量产出数量时，用于计算单件商品机会成本的 AP 经典速算法。记忆口诀 "OOO" 即 "Output: Other Over"（产出法：求谁放分母，另一项放分子）。'
    },
    formula: 'Opportunity Cost of 1 Unit of Good A = (Units of Good B produced) / (Units of Good A produced)',
    example: {
      en: 'In 1 hour, Alice can produce 10 Pizzas or 40 Salads. Since this is output data: Opportunity cost of 1 Pizza = 40/10 = 4 Salads. Opportunity cost of 1 Salad = 10/40 = 0.25 Pizzas.',
      zh: '在 1 小时内，爱丽丝能制作 10 份披萨或 40 份沙拉。此为产出数据：制作 1 份披萨的机会成本 = 40/10 = 4 份沙拉；制作 1 份沙拉的机会成本 = 10/40 = 0.25 份披萨。'
    },
    examTip: {
      en: 'First determine if the table shows OUTPUT (bushels, cars, widgets produced) or INPUT (hours, acres, workers needed). If it is output, immediately use OOO (Other Over). The lower opportunity cost producer holds comparative advantage.',
      zh: '审题第一步：判定表格给出的是产出数据（件数、产量）还是投入数据（工时、土地面积）。产出数据立即使用 OOO（求谁谁放分母，另一项放分子）。机会成本较低者享有比较优势。'
    },
    keyCharacteristics: [
      { en: 'Applies when numbers represent units of finished products created', zh: '适用于表格数据为最终完工产品数量的情境' },
      { en: 'The entity with the smaller opportunity cost ratio specializes in that good', zh: '单件机会成本较低者应集中专业化生产该商品' }
    ],
    relatedConcepts: [
      { termId: 'term-comparative-advantage', labelEn: 'Comparative Advantage (CA)', labelZh: '比较优势', relationEn: 'Direct application for calculating comparative advantage from output tables', relationZh: '利用产出表计算比较优势的核心法则' },
      { termId: 'term-input-method-iou', labelEn: "Input Method ('IOU' Rule)", labelZh: '投入法比较优势判定', relationEn: 'The opposite counterpart method for input time/labor tables', relationZh: '针对工时投入数据的相反对应计算法则' }
    ],
    linkedModelId: 'comparative-advantage'
  },
  {
    id: 'term-input-method-iou',
    abbreviation: 'IOU Rule',
    aliases: ['Input Method', 'Input Other Under', '投入法', '工时成本比较优势'],
    en: "Input Method ('IOU' Rule)",
    zh: "投入法比较优势判定（'IOU' 法则）",
    unit: 1,
    topicCode: '1.3',
    category: 'general',
    definition: {
      en: 'A standardized AP rule for calculating per-unit opportunity cost when economic data measures variable INPUTS (such as hours, days, or worker resources) required to produce one single unit of output. The mnemonic "IOU" stands for "Input: Other Under".',
      zh: '在衡量制造单件商品所需消耗的变动投入（如工时、天数、工人量）时，用于计算机会成本的 AP 经典速算法。记忆口诀 "IOU" 即 "Input: Other Under"（投入法：求谁放分子，另一项放分母）。'
    },
    formula: 'Opportunity Cost of 1 Unit of Good A = (Inputs needed for Good A) / (Inputs needed for Good B)',
    example: {
      en: 'Bob requires 2 hours to build a Chair and 6 hours to build a Table. Since this is input data: Opportunity cost of 1 Chair = 2/6 = 0.33 Tables. Opportunity cost of 1 Table = 6/2 = 3 Chairs.',
      zh: '鲍勃制作 1 把椅子需要 2 小时，制作 1 张桌子需要 6 小时。此为投入工时数据：制作 1 把椅子的机会成本 = 2/6 = 0.33 张桌子；制作 1 张桌子的机会成本 = 6/2 = 3 把椅子。'
    },
    examTip: {
      en: 'Absolute advantage on an INPUT problem goes to the producer using the FEWEST hours/resources (the most efficient). Comparative advantage still goes to whoever gives up the least.',
      zh: '在投入工时题型中：绝对优势归属于消耗工时最少（最快完成）的一方；比较优势依然归属于所牺牲比率最低的一方。'
    },
    keyCharacteristics: [
      { en: 'Applies when numbers represent hours, minutes, or labor units required per good', zh: '适用于表格数据为生产单件所需工时或资源的情境' },
      { en: 'Opposite arithmetic structure from output questions', zh: '算式结构与产出题恰好相反（求谁谁放分子）' }
    ],
    relatedConcepts: [
      { termId: 'term-output-method-ooo', labelEn: "Output Method ('OOO' Rule)", labelZh: '产出法比较优势判定', relationEn: 'Counterpart formula used when data displays output quantities', relationZh: '当数据为产出数量时的相反公式' },
      { termId: 'term-comparative-advantage', labelEn: 'Comparative Advantage (CA)', labelZh: '比较优势', relationEn: 'Identifies the lower opportunity cost producer from input schedules', relationZh: '从工时表中锁定低机会成本专业化生产者' }
    ],
    linkedModelId: 'comparative-advantage'
  },
  {
    id: 'term-terms-of-trade',
    abbreviation: 'TOT',
    aliases: ['Terms of Trade', 'Gains from Trade', '贸易条件', '互利贸易价格区间'],
    en: 'Terms of Trade (TOT)',
    zh: '互利贸易条件区间（TOT）',
    unit: 1,
    topicCode: '1.3',
    category: 'general',
    definition: {
      en: 'The exchange rate or relative price ratio at which two countries or trading partners agree to trade goods. For trade to be mutually beneficial, the terms of trade must fall strictly between the domestic per-unit opportunity costs of the two trading partners.',
      zh: '两国或交易双方达成贸易交换的相对价格比率。若要实现互利共赢的自愿贸易，双方议定的贸易条件价格比必须严格介于两国各自国内的机会成本之间。'
    },
    formula: 'Country A Opportunity Cost < Mutually Beneficial Terms of Trade < Country B Opportunity Cost',
    example: {
      en: 'Country A gives up 1 Wheat to make 1 Car. Country B gives up 3 Wheat to make 1 Car. Any exchange rate between 1 and 3 Wheat per Car (e.g., 1 Car for 2 Wheat) benefits BOTH countries.',
      zh: 'A 国制造 1 辆汽车的机会成本是 1 吨小麦；B 国制造 1 辆汽车的机会成本是 3 吨小麦。任何介于 1 到 3 吨小麦/辆汽车之间的比率（如 1 辆车换 2 吨小麦），均能让两国同时获益。'
    },
    examTip: {
      en: 'On AP FRQs: A proposed terms of trade that is equal to or outside the domestic opportunity cost of either country will be rejected, because that country could produce the good cheaper on its own.',
      zh: 'AP 大题必考：若提议的贸易条件等于或超出某国的国内自身机会成本，该国必将拒绝贸易，因为其自行生产反而代价更低。'
    },
    keyCharacteristics: [
      { en: 'Allows both nations to consume outside their individual domestic PPC frontiers', zh: '使贸易双方均能在各自本国 PPC 边界之外进行消费' },
      { en: 'Mutually agreeable rate must lie strictly within the opportunity cost spread', zh: '互利价格比必须严格落在两国机会成本价差区间内' }
    ],
    relatedConcepts: [
      { termId: 'term-comparative-advantage', labelEn: 'Comparative Advantage (CA)', labelZh: '比较优势', relationEn: 'Determines the upper and lower bounds of the terms of trade', relationZh: '决定贸易条件上下限区间的唯一基准' },
      { termId: 'term-ppc', labelEn: 'Production Possibilities Curve (PPC)', labelZh: '生产可能性边界', relationEn: 'Trade expands consumption possibilities beyond the PPC', relationZh: '贸易将消费可能性拓展至 PPC 曲线之外' }
    ],
    linkedModelId: 'comparative-advantage'
  },
  {
    id: 'term-law-diminishing-marginal-utility',
    abbreviation: 'Diminishing MU',
    aliases: ['Law of Diminishing Marginal Utility', '边际效用递减规律', 'Diminishing Utility'],
    en: 'Law of Diminishing Marginal Utility',
    zh: '边际效用递减规律',
    unit: 1,
    topicCode: '1.4',
    category: 'general',
    definition: {
      en: 'A psychological and economic law stating that as a consumer purchases and consumes successive additional units of a specific good within a given period, the extra satisfaction (marginal utility) derived from each additional unit decreases.',
      zh: '经济学基本心理规律：在特定时期内，随着消费者对某一商品的连续消费数量不断增加，每额外消费一个单位所获得的新增满足感（边际效用 MU）呈递减趋势。'
    },
    formula: 'As Q increases -> MU = ΔTU / ΔQ decreases (MU slope is negative)',
    example: {
      en: 'The first slice of pizza consumed when ravenously hungry provides 50 utils of satisfaction. The second slice adds 30 utils, the third slice adds 10 utils, and the fourth slice adds 0 utils (Total Utility reaches maximum).',
      zh: '极度饥饿时吃第一块披萨带来 50 效用点；第二块新增 30 效用点；第三块仅新增 10 效用点；吃到第四块时边际效用降为 0（此时总效用达到顶峰）。'
    },
    examTip: {
      en: 'This law explains WHY individual demand curves are downward-sloping! Since consumers gain less marginal utility from additional units, they are only willing to buy more if the market price drops.',
      zh: '这一规律从微观底层直接解释了为什么个人需求曲线向右下方倾斜！正因为追加商品的边际效用越来越低，消费者只有在价格下降时才愿意追加购买。'
    },
    keyCharacteristics: [
      { en: 'Total utility increases as long as marginal utility remains positive', zh: '只要边际效用为正，总效用就持续增加' },
      { en: 'Total utility is maximized when marginal utility equals zero', zh: '当边际效用降至零时，总效用达到极大值' }
    ],
    relatedConcepts: [
      { termId: 'term-marginal-utility', labelEn: 'Marginal Utility (MU)', labelZh: '边际效用', relationEn: 'The metric that diminishes per additional unit consumed', relationZh: '随连续消费而递减的核心效用指标' },
      { termId: 'term-utility-max-rule', labelEn: 'Utility-Maximizing Rule', labelZh: '效用最大化法则', relationEn: 'Equi-marginal spending condition: MU_X / P_X = MU_Y / P_Y', relationZh: '等边际支出法则：MU_X / P_X = MU_Y / P_Y' },
      { termId: 'term-demand', labelEn: 'Demand Curve', labelZh: '需求曲线', relationEn: 'Direct theoretical foundation of downward-sloping demand curve', relationZh: '需求曲线向右下方倾斜的根本微观理论基石' }
    ],
    linkedModelId: 'marginal-analysis-utility'
  },
  // ==========================================
  // EXPANDED UNIT 2: Supply, Demand, Elasticity & Market Dynamics
  // ==========================================
  {
    id: 'term-law-of-demand',
    abbreviation: 'Law of Demand',
    aliases: ['Demand Law', '需求定理', 'Inverse P-Q Relationship'],
    en: 'Law of Demand',
    zh: '需求定理',
    unit: 2,
    topicCode: '2.1',
    category: 'elasticity',
    definition: {
      en: 'A core microeconomic law stating that, ceteris paribus, there is an INVERSE (negative) relationship between the price of a good and the quantity demanded of that good. As price rises, quantity demanded falls; as price falls, quantity demanded rises.',
      zh: '在其他条件不变的前提下，某一商品的价格与其需求量之间存在反向（负相关）变动关系的经济学铁律。价格上涨，需求量下降；价格下跌，需求量上升。'
    },
    formula: 'P ↑ -> Q_D ↓ ; P ↓ -> Q_D ↑ (holding non-price determinants constant)',
    example: {
      en: 'When a cinema raises weekend movie ticket prices from $12 to $18, student ticket sales drop from 500 tickets to 320 tickets.',
      zh: '当电影院将周末电影票从 12 美元提价至 18 美元时，学生观众的购票量从 500 张萎缩至 320 张。'
    },
    examTip: {
      en: 'Three core reasons explain why the demand curve slopes downward: (1) Substitution Effect, (2) Income Effect, and (3) Law of Diminishing Marginal Utility. Do not confuse a change in QUANTITY demanded (movement along curve) with a change in DEMAND (shift of the curve).',
      zh: '需求曲线向右下方倾斜的 3 大根本原因：（1）替代效应，（2）收入效应，（3）边际效用递减规律。切记区分“需求量的变动”（点移动）与“需求的变动”（曲线整体平移）。'
    },
    keyCharacteristics: [
      { en: 'Reflects consumer willingness and ability to purchase at various prices', zh: '反映消费者在不同价格下的购买意愿与支付能力' },
      { en: 'Operates along a stationary demand curve', zh: '表现为在固定需求曲线上的沿线点移动' }
    ],
    relatedConcepts: [
      { termId: 'term-income-substitution-effects', labelEn: 'Income & Substitution Effects', labelZh: '收入效应与替代效应', relationEn: 'Microeconomic drivers underlying the downward slope of demand', relationZh: '支撑需求曲线负斜率的两大微观驱动机制' },
      { termId: 'term-ped', labelEn: 'Price Elasticity of Demand (PED)', labelZh: '需求价格弹性', relationEn: 'Quantifies consumer price sensitivity along the demand curve', relationZh: '量化衡量沿需求曲线的价格敏感程度' }
    ],
    linkedModelId: 'market-equilibrium-welfare'
  },
  {
    id: 'term-law-of-supply',
    abbreviation: 'Law of Supply',
    aliases: ['Supply Law', '供给定理', 'Positive P-Q Relationship'],
    en: 'Law of Supply',
    zh: '供给定理',
    unit: 2,
    topicCode: '2.2',
    category: 'general',
    definition: {
      en: 'A core microeconomic law stating that, ceteris paribus, there is a DIRECT (positive) relationship between the price of a good and the quantity supplied of that good. As market price rises, profit-maximizing firms are willing to supply more output.',
      zh: '在其他条件不变的前提下，某一商品的价格与其供给量之间存在同向（正相关）变动关系的经济学规律。市场售价上涨，厂商供给量增加；售价下跌，供给量减少。'
    },
    formula: 'P ↑ -> Q_S ↑ ; P ↓ -> Q_S ↑ (holding production technology and input costs constant)',
    example: {
      en: 'When market crude oil prices surge from $60 to $110 per barrel, oil drilling companies activate higher-cost shale oil wells, increasing production from 10 million to 13 million barrels per day.',
      zh: '当国际原油价格从每桶 60 美元飙升至 110 美元时，采油企业纷纷重启高成本页岩油井，使日产量从 1000 万桶增加至 1300 万桶。'
    },
    examTip: {
      en: 'The supply curve slopes upward because existing firms experience increasing marginal costs in the short run (due to diminishing marginal returns), requiring higher prices to justify expanding output.',
      zh: '供给曲线向右上方倾斜的经济学本质：由于边际报酬递减，厂商在短期内追加产量的边际成本（MC）持续递增，只有更高的市场价格才能弥补更高的边际生产成本。'
    },
    keyCharacteristics: [
      { en: 'Directly linked to a competitive firms rising Marginal Cost (MC) curve', zh: '与完全竞争厂商向上倾斜的边际成本（MC）曲线直接等同' },
      { en: 'Movement along supply is triggered solely by the goods own market price', zh: '仅由商品自身市场价格诱发的沿曲线移动' }
    ],
    relatedConcepts: [
      { termId: 'term-marginal-cost', labelEn: 'Marginal Cost (MC)', labelZh: '边际成本', relationEn: 'The portion of MC above AVC is the competitive firms short-run supply', relationZh: 'MC 曲线位于 AVC 之上的部分即为厂商短期供给曲线' },
      { termId: 'term-pes', labelEn: 'Price Elasticity of Supply (PES)', labelZh: '供给价格弹性', relationEn: 'Measures producer output responsiveness to price changes', relationZh: '度量厂商产量对价格变动的反应敏感度' }
    ],
    linkedModelId: 'market-equilibrium-welfare'
  },
  {
    id: 'term-normal-inferior-goods',
    abbreviation: 'Normal vs Inferior',
    aliases: ['Normal Good', 'Inferior Good', '正常品与劣等品', 'YED Sign'],
    en: 'Normal vs Inferior Goods',
    zh: '正常品与劣等品',
    unit: 2,
    topicCode: '2.4',
    category: 'elasticity',
    definition: {
      en: 'Classification of goods based on consumer demand responsiveness to changes in income. For a Normal Good, demand moves in the SAME direction as income (YED > 0). For an Inferior Good, demand moves in the OPPOSITE direction of income (YED < 0).',
      zh: '依据消费者收入变动对商品需求影响方向而划分的物品属性。正常品的需求随收入增加而增加（收入弹性 YED > 0）；劣等品的需求则随收入增加而减少（收入弹性 YED < 0）。'
    },
    formula: 'Normal: Income ↑ -> Demand ↑ (YED > 0) ; Inferior: Income ↑ -> Demand ↓ (YED < 0)',
    example: {
      en: 'When a college student graduates and secures a high-paying software job, their demand for dining at fine steakhouses surges (Normal Good), while their demand for instant ramen noodles plunges (Inferior Good).',
      zh: '当大学生毕业并拿到高薪软件工程师职位后，他们对高档西餐厅牛排的需求激增（正常品），而对方便面速食的需求则大幅萎缩（劣等品）。'
    },
    examTip: {
      en: 'AP Multiple Choice: If consumer income rises during an economic boom, the demand curve for an inferior good shifts to the LEFT, decreasing its equilibrium price and quantity.',
      zh: 'AP 选择题必考点：经济繁荣消费者收入上升时，劣等品的需求曲线向“左”平移，导致其均衡价格和均衡交易量双双下降。'
    },
    keyCharacteristics: [
      { en: 'Determined strictly by the algebraic sign of Income Elasticity of Demand (YED)', zh: '严格取决于需求收入弹性（YED）的正负正号' },
      { en: 'Inferiority reflects budget constraints, not defective product quality', zh: '劣等品反映的是消费者预算约束下的消费替代，而非产品质量残次' }
    ],
    relatedConcepts: [
      { termId: 'term-yed', labelEn: 'Income Elasticity of Demand (YED)', labelZh: '需求收入弹性', relationEn: 'Positive for normal goods, negative for inferior goods', relationZh: '正常品为正值，劣等品为负值' },
      { termId: 'term-substitute-complements', labelEn: 'Substitute vs Complementary Goods', labelZh: '替代品与互补品', relationEn: 'Contrast with cross-price elasticity (XED) classifications', relationZh: '与交叉价格弹性（XED）相对应的另一大分类体系' }
    ]
  },
  {
    id: 'term-substitute-complements',
    abbreviation: 'Substitutes / Complements',
    aliases: ['Substitute Goods', 'Complementary Goods', '替代品与互补品', 'Cross Price Elasticity'],
    en: 'Substitute vs Complementary Goods',
    zh: '替代品与互补品',
    unit: 2,
    topicCode: '2.4',
    category: 'elasticity',
    definition: {
      en: 'Classification of paired goods based on Cross-Price Elasticity (XED). Substitutes are competing goods where a price hike in Good A INCREASES demand for Good B (XED > 0). Complements are goods consumed together where a price hike in Good A DECREASES demand for Good B (XED < 0).',
      zh: '基于交叉价格弹性（XED）界定的关联商品类别。替代品指可相互替代的竞争品，商品 A 涨价会导致商品 B 需求增加（XED > 0）；互补品指搭配消费的组合品，商品 A 涨价会导致商品 B 需求减少（XED < 0）。'
    },
    formula: 'Substitutes: P_A ↑ -> D_B ↑ (XED > 0) ; Complements: P_A ↑ -> D_B ↓ (XED < 0)',
    example: {
      en: 'Coke and Pepsi are substitutes: a rise in Coke price shifts demand for Pepsi rightward. Coffee and coffee creamer are complements: a spike in coffee price shifts demand for creamer leftward.',
      zh: '可口可乐与百事可乐是替代品：可口可乐提价会使百事可乐需求曲线右移。咖啡与咖啡伴侣是互补品：咖啡价格暴涨会导致伴侣需求曲线左移。'
    },
    examTip: {
      en: 'Be careful on cause and effect: Price of Good A changes first (movement along A), which then causes the ENTIRE demand curve for Good B to shift right or left.',
      zh: '注意因果逻辑：首先是商品 A 的价格变动（引起 A 自身需求量的点移动），进而导致商品 B 的整条需求曲线发生平移。'
    },
    keyCharacteristics: [
      { en: 'Substitutes compete for the same consumer spending', zh: '替代品竞争争夺同类消费预算' },
      { en: 'Complements enhance joint consumption satisfaction', zh: '互补品联合消费以达到整体效用满足' }
    ],
    relatedConcepts: [
      { termId: 'term-xed', labelEn: 'Cross-Price Elasticity of Demand (XED)', labelZh: '需求交叉价格弹性', relationEn: 'Mathematical measure: positive for substitutes, negative for complements', relationZh: '数学衡量指标：替代品为正，互补品为负' },
      { termId: 'term-normal-inferior-goods', labelEn: 'Normal vs Inferior Goods', labelZh: '正常品与劣等品', relationEn: 'Income elasticity counterpart concept', relationZh: '收入弹性对应维度的分类概念' }
    ]
  },
  {
    id: 'term-income-substitution-effects',
    abbreviation: 'Income & Sub Effects',
    aliases: ['Income Effect', 'Substitution Effect', '收入效应与替代效应', 'Demand Slope Reasons'],
    en: 'Income Effect & Substitution Effect',
    zh: '收入效应与替代效应',
    unit: 2,
    topicCode: '2.1',
    category: 'elasticity',
    definition: {
      en: 'The two economic mechanisms that jointly explain why consumers buy more when a goods price drops. The Substitution Effect states that buyers substitute toward the now relatively cheaper good. The Income Effect states that the price drop increases the consumers real purchasing power, enabling them to buy more normal goods.',
      zh: '共同解释价格下降导致购买量增加的两大微观驱动机制。替代效应：由于该商品相对变便宜，消费者减少其他相对昂贵品的消费而转向购买该商品；收入效应：价格下降提升了消费者的实际购买力（实际收入），从而能够购买更多正常品。'
    },
    formula: 'Total Price Effect on Quantity Demanded = Substitution Effect + Income Effect',
    example: {
      en: 'When beef price drops from $10 to $6/lb: Substitution Effect: Beef is cheaper than chicken, so shoppers buy beef instead of chicken. Income Effect: Shoppers save $4/lb, effectively feeling richer and buying more beef overall.',
      zh: '当牛肉从每磅 10 美元降至 6 美元时：替代效应：牛肉比鸡肉相对更便宜，顾客少买鸡肉改买牛肉；收入效应：每磅节省 4 美元使实际购买力提升，能买得起更多牛肉。'
    },
    examTip: {
      en: 'For normal goods, substitution and income effects reinforce each other in the same direction. For inferior goods, the income effect works in the OPPOSITE direction of the substitution effect.',
      zh: '对于正常品，替代效应与收入效应方向相同、彼此强化；对于劣等品，收入效应与替代效应的作用方向则恰好相反。'
    },
    keyCharacteristics: [
      { en: 'Substitution effect ALWAYS moves inversely to price changes', zh: '替代效应的作用方向始终与自身价格变动呈反向' },
      { en: 'Explains the downward slope of individual consumer demand', zh: '解释个人需求曲线负斜率的两大根本微观基石之一' }
    ],
    relatedConcepts: [
      { termId: 'term-law-of-demand', labelEn: 'Law of Demand', labelZh: '需求定理', relationEn: 'Theoretical components proving the inverse price-quantity relationship', relationZh: '支撑价格与需求量反向变动的底层微观推导' }
    ]
  },
  {
    id: 'term-determinants-of-demand',
    abbreviation: 'TIMER Shift',
    aliases: ['Determinants of Demand', 'Demand Shifters', '需求移动因素', 'TIMER'],
    en: 'Determinants of Demand (TIMER)',
    zh: '需求变动的决定因素（TIMER 法则）',
    unit: 2,
    topicCode: '2.1',
    category: 'elasticity',
    definition: {
      en: 'The non-price factors that shift the ENTIRE demand curve rightward (increase) or leftward (decrease). Standardized AP mnemonic "TIMER": T = Tastes & Preferences, I = Income, M = Market size (number of buyers), E = Expectations of future price/income, R = Related goods prices (substitutes/complements).',
      zh: '导致整条需求曲线向右（需求增加）或向左（需求减少）平移的非价格决定因素。AP 标准记忆口诀 "TIMER"：T = 消费者偏好，I = 收入，M = 市场买家规模，E = 对未来价格/收入的预期，R = 相关商品价格（替代品与互补品）。'
    },
    formula: 'Right Shift: T ↑, Income ↑ (Normal), Buyers ↑, P_Future Expectation ↑, P_Substitute ↑, P_Complement ↓',
    example: {
      en: 'A medical study announces that eating avocados daily reduces heart disease (Tastes ↑). The demand curve for avocados immediately shifts to the right, raising both equilibrium price and quantity.',
      zh: '医学权威期刊发布牛油果可显著降低心脏病风险（消费者偏好提升），牛油果的需求曲线瞬间向右平移，推高市场均衡价格与均衡交易量。'
    },
    examTip: {
      en: 'A change in the goods OWN PRICE NEVER shifts demand! It only causes a movement along the fixed curve (change in quantity demanded). Non-price shifters (TIMER) shift the whole curve.',
      zh: '商品自身价格变动绝不平移需求曲线！自身价格变动只导致沿现有曲线的“点移动”（需求量变动）。只有 TIMER 因素才会平移整条曲线。'
    },
    keyCharacteristics: [
      { en: 'Shifts the entire schedule of willingness-to-pay at every price level', zh: '在每一个价格水平上整体重塑消费者的支付意愿' },
      { en: 'Distinguishes demand shifts from movements along the demand curve', zh: '彻底廓清整条需求曲线平移与沿曲线点移动的界限' }
    ],
    relatedConcepts: [
      { termId: 'term-determinants-of-supply', labelEn: 'Determinants of Supply (ROTTEN)', labelZh: '供给变动的决定因素', relationEn: 'Corresponding non-price shifters for the supply curve', relationZh: '供给曲线对应的非价格平移决定因素' },
      { termId: 'term-demand', labelEn: 'Demand Curve', labelZh: '需求曲线', relationEn: 'The schedule shifted by TIMER determinants', relationZh: '受 TIMER 因素影响而整体平移的曲线' }
    ],
    linkedModelId: 'market-equilibrium-welfare'
  },
  {
    id: 'term-determinants-of-supply',
    abbreviation: 'ROTTEN Shift',
    aliases: ['Determinants of Supply', 'Supply Shifters', '供给移动因素', 'ROTTEN'],
    en: 'Determinants of Supply (ROTTEN)',
    zh: '供给变动的决定因素（ROTTEN 法则）',
    unit: 2,
    topicCode: '2.2',
    category: 'general',
    definition: {
      en: 'The non-price factors that shift the ENTIRE supply curve rightward (increase) or leftward (decrease). Standardized AP mnemonic "ROTTEN": R = Resource costs (input prices), O = Other goods prices (production substitutes), T = Technology, T = Taxes & Subsidies, E = Expectations of future price, N = Number of sellers.',
      zh: '导致整条供给曲线向右（供给增加）或向左（供给减少）平移的非价格决定因素。AP 标准记忆口诀 "ROTTEN"：R = 资源与原材料成本，O = 其他可转产商品价格，T = 生产技术，T = 政府税收与补贴，E = 厂商对未来价格预期，N = 市场卖家数量。'
    },
    formula: 'Right Shift: Input Costs ↓, Technology Improvement ↑, Subsidies ↑, Per-unit Taxes ↓, Number of Sellers ↑',
    example: {
      en: 'Advances in solar panel automated manufacturing slash silicon wafer processing costs by 40% (Technology ↑). The supply curve for solar panels shifts rightward, lowering equilibrium price and boosting quantity.',
      zh: '光伏电池制造自动化技术突破使晶圆加工成本锐减 40%（技术进步），太阳能板供给曲线向右大幅平移，压低市场均衡售价并推升装机规模。'
    },
    examTip: {
      en: 'A per-unit tax shifts supply vertically UPWARD by the exact amount of the tax (supply decreases). A per-unit subsidy shifts supply vertically DOWNWARD (supply increases).',
      zh: '从量税使供给曲线垂直向上平移税额同等距离（供给减少）；从量补贴使供给曲线垂直向下平移补贴额同等距离（供给增加）。'
    },
    keyCharacteristics: [
      { en: 'Directly reflects changes in underlying marginal production costs', zh: '直接反映厂商底层边际生产成本的变动' },
      { en: 'Shifts the minimum acceptable supply price schedule', zh: '平移厂商在各产量下愿意接受的最低边际保底要价' }
    ],
    relatedConcepts: [
      { termId: 'term-determinants-of-demand', labelEn: 'Determinants of Demand (TIMER)', labelZh: '需求变动的决定因素', relationEn: 'Counterpart shifters for market demand', relationZh: '市场需求对应的非价格平移法则' },
      { termId: 'term-supply', labelEn: 'Supply Curve', labelZh: '供给曲线', relationEn: 'The schedule shifted by ROTTEN determinants', relationZh: '受 ROTTEN 因素推动发生平移的供给轨迹' }
    ],
    linkedModelId: 'market-equilibrium-welfare'
  },
  {
    id: 'term-total-revenue-test',
    abbreviation: 'TRPE / TR Test',
    aliases: ['Total Revenue Test', '总收益弹性检验', 'TR Test for Elasticity'],
    en: 'Total Revenue Test for Elasticity (TRPE)',
    zh: '总收益弹性检验法则（TRPE）',
    unit: 2,
    topicCode: '2.5',
    category: 'elasticity',
    definition: {
      en: 'A fast diagnostic method to determine price elasticity of demand (|PED|) by observing the direction Total Revenue (TR = P × Q) moves when price changes. If P and TR move in OPPOSITE directions, demand is Elastic (|PED| > 1). If P and TR move in the SAME direction, demand is Inelastic (|PED| < 1). If TR stays unchanged, demand is Unitary (|PED| = 1).',
      zh: '通过观察价格变动时总收益（TR = P × Q）的变动方向来快速判定需求价格弹性（|PED|）的经典法则。若价格与总收益反向变动，需求富有弹性（|PED| > 1）；若价格与总收益同向变动，需求缺乏弹性（|PED| < 1）；若价格变动但总收益保持不变，需求为单位弹性（|PED| = 1）。'
    },
    formula: 'Elastic: P ↑ -> TR ↓ (or P ↓ -> TR ↑); Inelastic: P ↑ -> TR ↑ (or P ↓ -> TR ↓); Unitary: P ↑ or ↓ -> TR constant',
    example: {
      en: 'A stadium raises concert ticket price from $50 to $60 (+20%). Attendance drops from 10,000 to 7,000 (-30%). TR falls from $500,000 to $420,000. Since P rose but TR fell, demand is Elastic.',
      zh: '某场馆将演唱会门票由 50 美元提至 60 美元（+20%），入场人数由 10000 锐减至 7000 人（-30%）。总收益由 50 万降至 42 万。价格上涨而总收益下滑，判定需求富有弹性。'
    },
    examTip: {
      en: 'A monopolist will NEVER operate in the inelastic region of its demand curve, because raising price in the inelastic zone increases Total Revenue while cutting output and Total Cost, guaranteeing higher economic profit!',
      zh: '垄断厂商绝不会在需求缺乏弹性的区间生产！因为在缺乏弹性区间提价，总收益会上升，而减产使总成本下降，必然能获得更高的经济利润！'
    },
    keyCharacteristics: [
      { en: 'Only applies to Price Elasticity of Demand (PED), never to supply', zh: '仅适用于需求价格弹性判定，绝不能套用至供给弹性' },
      { en: 'Total revenue reaches its absolute mathematical peak where PED = 1', zh: '总收益在 PED = 1（单位弹性）的最高峰顶点达到最大化' }
    ],
    relatedConcepts: [
      { termId: 'term-ped', labelEn: 'Price Elasticity of Demand (PED)', labelZh: '需求价格弹性', relationEn: 'Directly diagnosed by observing the direction of TR change', relationZh: '通过总收益变动方向可直接推断出的弹性状态' },
      { termId: 'term-total-revenue', labelEn: 'Total Revenue (TR)', labelZh: '总收益', relationEn: 'Revenue metric evaluated in the test (TR = P × Q)', relationZh: '检验法则中考察的核心收益指标（TR = P × Q）' }
    ],
    linkedModelId: 'price-elasticity-demand'
  },
  {
    id: 'term-unitary-elasticity',
    abbreviation: 'Unitary Elastic',
    aliases: ['Unit Elasticity', 'Unitary Elastic Demand', '单位弹性', 'PED = 1'],
    en: 'Unitary Elastic Demand',
    zh: '单位需求弹性（PED = 1）',
    unit: 2,
    topicCode: '2.5',
    category: 'elasticity',
    definition: {
      en: 'A special elasticity condition where the percentage change in quantity demanded exactly equals the percentage change in price (|PED| = 1.0). At this point, marginal revenue equals zero (MR = 0), and Total Revenue reaches its absolute maximum.',
      zh: '需求量变动百分比恰好等于价格变动百分比的临界弹性状态（|PED| = 1.0）。在此点处，边际收益恰好为零（MR = 0），厂商的总收益（TR）达到数学最高峰值。'
    },
    formula: '|PED| = %ΔQ_D / %ΔP = 1.0 ; MR = 0 ; TR is Maximized',
    example: {
      en: 'When a subway authority lowers transit fares by 5%, ridership expands by exactly 5%. Total revenue collected remains precisely identical before and after the fare adjustment.',
      zh: '当地铁票价下调 5% 时，乘客客运量恰好增加 5%，票务总收入在调价前后完全保持恒定不变。'
    },
    examTip: {
      en: 'On a linear downward-sloping demand curve, elasticity is NOT constant: it is elastic at the top left, unitary at the midpoint, and inelastic at the bottom right. Total revenue peaks at the exact midpoint.',
      zh: '在线性需求曲线上，弹性并非恒定常数：左上半段富有弹性，正中点为单位弹性，右下半段缺乏弹性。总收益抛物线在正中点达到最高峰。'
    },
    keyCharacteristics: [
      { en: 'Percentage change in quantity exactly mirrors percentage change in price', zh: '数量变动百分比与价格变动百分比完全 1:1 对等' },
      { en: 'Corresponds to the intersection where Marginal Revenue curve hits the quantity axis (MR = 0)', zh: '对应边际收益（MR）曲线穿过横轴交点（MR = 0）' }
    ],
    relatedConcepts: [
      { termId: 'term-ped', labelEn: 'Price Elasticity of Demand (PED)', labelZh: '需求价格弹性', relationEn: 'Midpoint benchmark dividing elastic from inelastic portions', relationZh: '划分需求富有弹性与缺乏弹性的正中分水岭' },
      { termId: 'term-total-revenue-test', labelEn: 'Total Revenue Test for Elasticity (TRPE)', labelZh: '总收益弹性检验法则', relationEn: 'At unitary elasticity, price adjustments leave TR unchanged', relationZh: '在单位弹性点调价不改变总收益水平' }
    ],
    linkedModelId: 'price-elasticity-demand'
  },
  {
    id: 'term-perfectly-elastic-inelastic',
    abbreviation: 'Perfect Elastic / Inelastic',
    aliases: ['Perfectly Inelastic', 'Perfectly Elastic', '完全有弹性与完全无弹性'],
    en: 'Perfect Elasticity vs Perfect Inelasticity',
    zh: '完全有弹性与完全无弹性（极端弹性形态）',
    unit: 2,
    topicCode: '2.5',
    category: 'elasticity',
    definition: {
      en: 'The two theoretical boundary cases of price elasticity. Perfectly Inelastic (|PED| = 0) is a completely vertical curve where quantity demanded is 100% unresponsive to price. Perfectly Elastic (|PED| = ∞) is a completely horizontal curve where buyers will only purchase at one exact market price.',
      zh: '价格弹性的两个极端边界形态。完全无弹性（|PED| = 0）表现为一条垂直竖直线，无论价格如何暴涨，需求量均完全不变；完全有弹性（|PED| = ∞）表现为一条水平平直线，买方仅接受这一个固定市场价格。'
    },
    formula: 'Perfect Inelastic: PED = 0 (Vertical, | ); Perfect Elastic: PED = ∞ (Horizontal, — )',
    example: {
      en: 'Insulin for a diabetic without substitutes has virtually perfectly inelastic demand (vertical). A single wheat farmer in perfect competition faces perfectly elastic demand for their crop at the market price (horizontal).',
      zh: '糖尿病患者赖以生存的胰岛素需求几乎完全无弹性（垂直曲线）；完全竞争市场中的单个麦农在既定市价上面临完全有弹性的需求曲线（水平线）。'
    },
    examTip: {
      en: 'Visual memory trick: Inelastic looks like the vertical bar in an "I" (Vertical = Inelastic). Perfectly elastic demand is flat and horizontal (Horizontal = Elastic).',
      zh: '图形速记口诀：字母 "I" 的竖杠代表 Inelastic（垂直线 = 完全无弹性）；完全弹性的水平线如字母 "E" 的横梁。完全无弹性商品征税时，买方全额承担税负且无死重损失！'
    },
    keyCharacteristics: [
      { en: 'Vertical curve (PED = 0): Consumers bear 100% of any excise tax with zero deadweight loss', zh: '垂直曲线（PED = 0）：消费者承担全部税负，且无任何无谓损失' },
      { en: 'Horizontal curve (PED = ∞): Individual competitive firm is a pure price taker', zh: '水平曲线（PED = ∞）：完全竞争厂商是纯粹的价格接受者' }
    ],
    relatedConcepts: [
      { termId: 'term-ped', labelEn: 'Price Elasticity of Demand (PED)', labelZh: '需求价格弹性', relationEn: 'Boundary extreme values 0 and infinity', relationZh: '弹性系数的极限边界值（0 与无穷大）' },
      { termId: 'term-mr-darp', labelEn: 'Mr. DARP', labelZh: 'Mr. DARP 恒等线', relationEn: 'Horizontal perfectly elastic demand facing a competitive firm', relationZh: '完全竞争个体厂商所面临的水平完全弹性需求线' }
    ],
    linkedModelId: 'price-elasticity-demand'
  },
  {
    id: 'term-per-unit-tax-incidence',
    abbreviation: 'Tax Incidence',
    aliases: ['Tax Incidence', '税收归宿', 'Tax Burden Distribution', 'Elasticity and Tax Incidence'],
    en: 'Tax Incidence & Elasticity Principle',
    zh: '税收归宿与弹性分担原则',
    unit: 2,
    topicCode: '2.8',
    category: 'welfare',
    definition: {
      en: 'The economic analysis of who truly bears the financial burden of an excise tax between buyers and sellers, regardless of who legally writes the check to the government. The economic principle states: whichever side of the market is MORE INELASTIC (less responsive to price changes) bears the LARGER share of the tax burden.',
      zh: '分析从量税最终由买方还是卖方实际承担的福利经济学法则，与法律规定由谁开支票纳税无关。核心原则：买卖双方中相对更缺乏弹性（对价格变动反应迟钝、难以逃避）的一方，必须承担更大份额的税收重负。'
    },
    formula: 'Buyer Share / Seller Share = Elasticity of Supply / Elasticity of Demand (|PES| / |PED|)',
    example: {
      en: 'Cigarettes have highly inelastic demand (addiction) and elastic supply. When government levies a $2 per-pack tax on cigarette manufacturers, retail prices rise by $1.80. Smokers bear 90% ($1.80) of the tax, and tobacco firms bear 10% ($0.20).',
      zh: '香烟需求极度缺乏弹性（成瘾性），而供给相对富有弹性。政府向烟厂每包征税 2 美元，零售价立即跳涨 1.80 美元。吸烟者承担了 90%（1.80 美元）的税负，烟厂仅承担 10%（0.20 美元）。'
    },
    examTip: {
      en: 'If Demand is completely inelastic (vertical), buyers bear 100% of the tax burden and DWL = 0. If Demand is completely elastic (horizontal), sellers bear 100% of the tax burden.',
      zh: '若需求完全无弹性（垂直线），买方承担 100% 税负且无死重损失；若需求完全有弹性（水平线），卖方承担 100% 税负。'
    },
    keyCharacteristics: [
      { en: 'Legal assignment of tax has zero impact on economic incidence', zh: '法律规定向买方还是卖方征收，完全不影响最终经济税负分担' },
      { en: 'Inelasticity equals vulnerability to tax shifting', zh: '弹性越小意味着转嫁与规避税负的能力越弱' }
    ],
    relatedConcepts: [
      { termId: 'term-deadweight-loss', labelEn: 'Deadweight Loss (DWL)', labelZh: '无谓损失', relationEn: 'Tax wedges cause reduction in total market surplus', relationZh: '税收楔子导致社会总剩余缩水产生无谓损失' },
      { termId: 'term-ped', labelEn: 'Price Elasticity of Demand (PED)', labelZh: '需求价格弹性', relationEn: 'Key determinant of consumer tax burden share', relationZh: '决定消费者税负分担比例的核心指标' }
    ],
    linkedModelId: 'gov-intervention-taxes-deadweight'
  },
  // ==========================================
  // EXPANDED UNIT 3: Production Functions, Cost Curves & Scale
  // ==========================================
  {
    id: 'term-law-diminishing-returns',
    abbreviation: 'Diminishing Returns',
    aliases: ['Law of Diminishing Marginal Returns', '边际报酬递减规律', 'Diminishing MP'],
    en: 'Law of Diminishing Marginal Returns',
    zh: '边际报酬递减规律',
    unit: 3,
    topicCode: '3.1',
    category: 'cost',
    definition: {
      en: 'A foundational short-run production law stating that as additional units of a variable input (e.g., labor) are added to a fixed amount of fixed inputs (e.g., capital/plant space), the resulting addition to total output (Marginal Product) eventually declines.',
      zh: '短期生产核心规律：在厂房厂区、机器设备等固定要素投入数量保持不变的前提下，若连续追加变动要素（如劳动力工人数），每额外增加一单位变动要素所带来的新增产出（边际产出 MP）最终必然趋于递减。'
    },
    formula: 'Short Run (Fixed K, Variable L) -> As L increases -> MP_L eventually falls',
    example: {
      en: 'In a pizzeria with only 2 pizza ovens, hiring the 1st baker produces 20 pizzas (MP=20). The 2nd baker specializes, producing 30 more (MP=30). But hiring the 5th baker results in workers bumping into each other and waiting for oven space, adding only 6 pizzas (MP=6).',
      zh: '在只有 2 台烤炉的披萨店中，雇佣第 1 位面点师产出 20 份披萨；第 2 位分工协作新增 30 份；但雇到第 5 位厨师时，厨房拥挤不堪且需排队等烤炉，该厨师仅能新增 6 份披萨（MP 骤降）。'
    },
    examTip: {
      en: 'Diminishing marginal returns is strictly a SHORT-RUN phenomenon because it requires at least one FIXED input. It is the direct mathematical reason why the short-run Marginal Cost (MC) curve eventually slopes upward!',
      zh: '边际报酬递减纯属“短期”经济现象，其先决条件是至少存在一种“固定要素”。正是边际产出递减，才在数学上直接导致短期边际成本（MC）曲线必然向上扬起！'
    },
    keyCharacteristics: [
      { en: 'Requires a fixed input (short run only)', zh: '必须以存在固定生产要素为前提（仅在短期有效）' },
      { en: 'Inverse mirror of Marginal Cost: When MP reaches maximum, MC reaches minimum', zh: '与边际成本呈镜像反比关系：当 MP 达到最高峰时，MC 恰好触及最低谷' }
    ],
    relatedConcepts: [
      { termId: 'term-marginal-product', labelEn: 'Marginal Product (MP)', labelZh: '边际产量', relationEn: 'The variable output metric that declines due to fixed capital crowding', relationZh: '因固定资本拥挤而最终递减的产出指标' },
      { termId: 'term-marginal-cost', labelEn: 'Marginal Cost (MC)', labelZh: '边际成本', relationEn: 'MC is the reciprocal mirror image of MP: MC = Wage / MP_L', relationZh: 'MC 是 MP 的倒数镜像：MC = 工资率 / MP_L' }
    ],
    linkedModelId: 'production-function-tp-mp-ap'
  },
  {
    id: 'term-total-product',
    abbreviation: 'TP / TPL',
    aliases: ['Total Product', 'Total Output', '总产量', 'TPL'],
    en: 'Total Product of Labor (TP / TPL)',
    zh: '劳动力总产出（TP / TPL）',
    unit: 3,
    topicCode: '3.1',
    category: 'cost',
    definition: {
      en: 'The total cumulative quantity of output produced by a firm using a given quantity of labor inputs combined with fixed capital in the short run. TP reaches its peak when Marginal Product of Labor equals zero (MP_L = 0).',
      zh: '厂商在短期内利用既定固定资本与一定数量的劳动力投入所生产出的全部最终产出总量。当劳动力的边际产出降至零（MP_L = 0）时，总产出达到最高峰。'
    },
    formula: 'TP = Q = Σ MP_L ; Max TP occurs where MP_L = 0',
    example: {
      en: 'A custom bicycle workshop employing 4 workers produces a total of 28 bicycles per week. When a 5th worker is added with an MP of 4 bicycles, TP rises to 32 bicycles.',
      zh: '一家手工自行车工坊雇佣 4 名技师时每周总产出 28 辆自行车。当新增第 5 名技师（边际产出为 4 辆）时，总产出 TP 攀升至 32 辆。'
    },
    examTip: {
      en: 'If hiring an extra worker causes Marginal Product to become NEGATIVE, Total Product will actually DECLINE. A rational profit-maximizing firm will NEVER hire in the negative MP stage.',
      zh: '若追加雇佣工人导致边际产出 MP 变为“负数”，总产出 TP 将不升反降。任何理性的厂商都绝不会在 MP 为负的生产第三阶段进行生产。'
    },
    keyCharacteristics: [
      { en: 'S-shaped curve: increases at increasing rate, then at decreasing rate, then peaks', zh: '典型 S 型曲线：先以递增速率上升，后以递减速率上升，触顶后回落' },
      { en: 'Slope of TP at any point equals the Marginal Product (MP) of that input unit', zh: 'TP 曲线在任意点处的切线斜率即为该点的边际产出（MP）' }
    ],
    relatedConcepts: [
      { termId: 'term-marginal-product-labor', labelEn: 'Marginal Product of Labor (MPL)', labelZh: '劳动力边际产出', relationEn: 'Derivative slope of the Total Product curve', relationZh: '总产出曲线的一阶导数切线斜率' },
      { termId: 'term-average-product', labelEn: 'Average Product of Labor (APL)', labelZh: '劳动力平均产出', relationEn: 'Ray from origin to any point on Total Product curve (TP / L)', relationZh: '原点连接总产出曲线上任一点的割线斜率（TP / L）' }
    ],
    linkedModelId: 'production-function-tp-mp-ap'
  },
  {
    id: 'term-average-product',
    abbreviation: 'AP / APL',
    aliases: ['Average Product', 'Labor Productivity', '平均产量', 'APL'],
    en: 'Average Product of Labor (AP / APL)',
    zh: '劳动力平均产出（AP / APL）',
    unit: 3,
    topicCode: '3.1',
    category: 'cost',
    definition: {
      en: 'The average output produced per unit of variable labor input employed (AP_L = Total Product / Labor). The Average Product curve rises as long as Marginal Product is above it, reaches its maximum at the exact point where MP = AP, and declines when MP falls below it.',
      zh: '平均每单位劳动力要素所创造的产出量（AP_L = 总产出 TP / 劳动量 L）。只要边际产出 MP 高于平均产出，AP 就会被拉升；当 MP 与 AP 相交时，AP 达到最大值；一旦 MP 低于 AP，AP 就会被拉低。'
    },
    formula: 'AP_L = TP / L = Q / L ; AP reaches maximum when MP_L = AP_L',
    example: {
      en: 'If 5 farmhands produce a total of 500 bushels of wheat, Average Product is 500 / 5 = 100 bushels per worker. If a 6th hand with MP = 130 is hired, new AP rises to 630 / 6 = 105 bushels.',
      zh: '若 5 名农工总共收获 500 蒲式耳小麦，平均产出为 500 / 5 = 100 蒲式耳/人。若雇佣第 6 名农工（其 MP 为 130），新平均产出被拉高至 630 / 6 = 105 蒲式耳。'
    },
    examTip: {
      en: 'Think of AP and MP like GPA and semester grades: If your current semester grade (MP) is higher than your cumulative GPA (AP), it pulls your cumulative GPA up! MP always crosses AP at APs highest point.',
      zh: '将 AP 与 MP 的关系想象成总平均成绩（GPA）与单门课成绩：只要你本学期成绩（MP）高于累计平均分（AP），平均分就会被拉高！MP 必然在 AP 的最高点从上方穿过 AP。'
    },
    keyCharacteristics: [
      { en: 'Inverse mirror of Average Variable Cost (AVC = Wage / AP_L)', zh: '平均可变成本的倒数镜像（AVC = 工资 / AP_L）' },
      { en: 'When AP is at maximum, AVC is at its minimum point', zh: '当 AP 达到最高峰时，AVC 恰好处于最低点' }
    ],
    relatedConcepts: [
      { termId: 'term-total-product', labelEn: 'Total Product of Labor (TP / TPL)', labelZh: '劳动力总产出', relationEn: 'Numerator in AP calculation (TP / L)', relationZh: 'AP 计算公式中的分子（TP / L）' },
      { termId: 'term-avc', labelEn: 'Average Variable Cost (AVC)', labelZh: '平均可变成本', relationEn: 'Direct cost reciprocal of Average Product', relationZh: '平均产出的直接成本端倒数镜像' }
    ],
    linkedModelId: 'production-function-tp-mp-ap'
  },
  {
    id: 'term-marginal-product-labor',
    abbreviation: 'MP / MPL',
    aliases: ['Marginal Product of Labor', 'MPL', '边际产量', 'Marginal Physical Product'],
    en: 'Marginal Product of Labor (MP / MPL)',
    zh: '劳动力边际产出（MP / MPL）',
    unit: 3,
    topicCode: '3.1',
    category: 'cost',
    definition: {
      en: 'The additional output generated by adding one more unit of labor input, holding all other capital and land inputs constant (MP_L = ΔTotal Product / ΔLabor). It first rises due to specialization, then declines due to diminishing marginal returns.',
      zh: '在其他资本与厂房投入固定不变的前提下，额外追加雇佣一单位劳动力所带来的新增总产出（MP_L = ΔTP / ΔL）。其数值在初期因分工协作而上升，随后受边际报酬递减影响而持续下行。'
    },
    formula: 'MP_L = ΔTP / ΔL = ΔQ / ΔL',
    example: {
      en: 'A software company with 3 developers finishes 15 sprint features per month. Hiring a 4th developer raises sprint output to 22 features. The Marginal Product of the 4th developer is 22 - 15 = 7 features.',
      zh: '拥有 3 名程序员的软件团队每月交付 15 个功能模块。聘用第 4 名程序员后交付量增至 22 个模块，该第 4 位工程师的边际产出为 22 - 15 = 7 个功能。'
    },
    examTip: {
      en: 'On Factor Market exams, Marginal Product of Labor (MPL) is multiplied by product price (P) to derive Marginal Revenue Product (MRP_L = MPL × P), which forms the firms labor demand curve!',
      zh: '要素市场必考：将劳动边际产出（MPL）乘以最终产品价格（P），即可求得边际收益产品（MRP_L = MPL × P），这正是厂商对劳动力的需求曲线！'
    },
    keyCharacteristics: [
      { en: 'Initial increasing returns from division of labor and teamwork', zh: '初期分工与专业化协作带来边际产出递增' },
      { en: 'Subsequent diminishing returns from overcrowding fixed capital', zh: '中后期固定资本拥挤必然诱发边际产出递减' }
    ],
    relatedConcepts: [
      { termId: 'term-mrp', labelEn: 'Marginal Revenue Product (MRP)', labelZh: '边际收益产品', relationEn: 'Value derived by multiplying MP_L by output price', relationZh: '由 MP_L 乘以产品单价所计算出的劳动力货币价值' },
      { termId: 'term-marginal-cost', labelEn: 'Marginal Cost (MC)', labelZh: '边际成本', relationEn: 'Inversely related: MC = Wage / MP_L', relationZh: '呈反比联动关系：MC = 劳动工资 / MP_L' }
    ],
    linkedModelId: 'production-function-tp-mp-ap'
  },
  {
    id: 'term-explicit-implicit-costs',
    abbreviation: 'Explicit vs Implicit',
    aliases: ['Explicit Costs', 'Implicit Costs', '显性成本与隐性成本', 'Accounting vs Opportunity Costs'],
    en: 'Explicit vs Implicit Costs',
    zh: '显性成本与隐性成本',
    unit: 3,
    topicCode: '3.2',
    category: 'cost',
    definition: {
      en: 'The two components of total economic cost. Explicit costs are direct, tangible, out-of-pocket cash payments made to outsiders for resource inputs (e.g., wages, rent, raw materials). Implicit costs are the opportunity costs of utilizing self-owned, self-employed resources (e.g., forgone salary, forgone rental income on owned property, interest on invested savings).',
      zh: '构成经济学总成本的两大组成部分。显性成本指必须直接开具支票或支付现金给外部资源所有者的硬性账面开支（如工资、店租、原料）；隐性成本则是使用自身所拥有的资源而牺牲的机会成本（如放弃的原高薪年薪、自有门面的租金收益、自有投资款的利息）。'
    },
    formula: 'Economic Cost = Explicit Costs + Implicit Costs ; Accounting Cost = Explicit Costs ONLY',
    example: {
      en: 'To start a boutique cafe, Sarah spends $40,000 on beans, milk, and rent (Explicit Cost). She also quits her $80,000 corporate analyst job and uses $20,000 of her own savings that was earning 5% ($1,000) interest (Implicit Costs = $81,000). Total Economic Cost is $121,000.',
      zh: '莎拉开办咖啡馆，支付了 4 万美元的咖啡豆、牛奶和房租（显性成本）；同时她辞去了年薪 8 万美元的分析师工作，并挪用了原本年收益 5%（1000 美元）的自有存款（隐性成本 = 8.1 万）。其经济总成本为 12.1 万美元。'
    },
    examTip: {
      en: 'Economists ALWAYS count BOTH explicit and implicit costs, while accountants only count explicit ledger payments. Therefore, Economic Profit is ALWAYS STRICTLY LESS than Accounting Profit!',
      zh: '经济学家始终同时计算显性成本与隐性成本，而会计师仅记录显性流水。因此，经济利润在数值上永远严格小于会计利润！'
    },
    keyCharacteristics: [
      { en: 'Explicit involves an actual monetary transaction and ledger receipt', zh: '显性成本涉及实际货币流出并留存账簿凭证' },
      { en: 'Implicit represents forgone alternative income earned elsewhere', zh: '隐性成本代表本可在别处赚取的放弃收益' }
    ],
    relatedConcepts: [
      { termId: 'term-accounting-vs-economic-profit', labelEn: 'Accounting vs Economic Profit', labelZh: '会计利润与经济利润', relationEn: 'Differentiated strictly by the inclusion of implicit opportunity costs', relationZh: '因是否扣除隐性机会成本而严格区分的两大指标' },
      { termId: 'term-opportunity-cost', labelEn: 'Opportunity Cost', labelZh: '机会成本', relationEn: 'Core economic definition embodied in implicit costs', relationZh: '隐性成本所体现的核心经济学机会成本内涵' }
    ]
  },
  {
    id: 'term-accounting-vs-economic-profit',
    abbreviation: 'Accounting vs Econ Profit',
    aliases: ['Accounting Profit', 'Economic Profit', '会计利润与经济利润'],
    en: 'Accounting Profit vs Economic Profit',
    zh: '会计利润与经济利润',
    unit: 3,
    topicCode: '3.2',
    category: 'revenue',
    definition: {
      en: 'Accounting Profit equals Total Revenue minus explicit cash costs only. Economic Profit equals Total Revenue minus ALL economic costs (both explicit cash payments and implicit opportunity costs). Economic profit signals whether resources are deployed in their highest-valued economic use.',
      zh: '会计利润仅等于总收益减去显性账面开支；经济利润则等于总收益扣除全部经济成本（既扣显性账面现金，又扣除所有隐性机会成本）。经济利润是衡量资源配置是否达到社会最优回报的关键风向标。'
    },
    formula: 'Accounting Profit = TR - Explicit Costs ; Economic Profit = TR - (Explicit + Implicit Costs)',
    example: {
      en: 'A bakery brings in $200,000 in revenue, pays $120,000 in explicit ingredient/rent costs, and the baker forgos a $60,000 salary elsewhere. Accounting Profit = $200,000 - $120,000 = $80,000. Economic Profit = $200,000 - ($120,000 + $60,000) = $20,000.',
      zh: '一家面包房总收入 20 万美元，显性原料与房租开销 12 万，店主放弃了在其他公司 6 万的年薪。会计利润 = 20 - 12 = 8 万美元；经济利润 = 20 - (12 + 6) = 2 万美元。'
    },
    examTip: {
      en: 'A firm can have a positive Accounting Profit (e.g. +$50,000) while simultaneously suffering an Economic LOSS (e.g. -$10,000). In this case, the owner should shut down long-term and switch to their next best alternative!',
      zh: '极其高频考点：一家公司完全可以在账面上实现盈利（会计利润为正，如 +5 万），但在经济学上却陷入严重亏损（经济利润为负，如 -1 万）。此时长期看店主理应关门转投次优行业！'
    },
    keyCharacteristics: [
      { en: 'Economic Profit = 0 means Normal Profit (the entrepreneur covers all opportunity costs)', zh: '经济利润为 0 意味着正常利润（企业家刚好收回全部机会成本）' },
      { en: 'Positive economic profit attracts new entrant firms in competitive markets', zh: '正经济利润会吸引外部新厂商大举涌入完全竞争市场' }
    ],
    relatedConcepts: [
      { termId: 'term-normal-profit', labelEn: 'Normal Profit', labelZh: '正常利润', relationEn: 'The benchmark condition where Economic Profit equals precisely zero', relationZh: '经济利润恰好等于零时的长期基准均衡状态' },
      { termId: 'term-explicit-implicit-costs', labelEn: 'Explicit vs Implicit Costs', labelZh: '显性成本与隐性成本', relationEn: 'The exact cost categories determining the difference between the two profits', relationZh: '造成两大口径利润产生差额的本质成本分类' }
    ],
    linkedModelId: 'cost-curves-short-run'
  },
  {
    id: 'term-normal-profit',
    abbreviation: 'Normal Profit',
    aliases: ['Zero Economic Profit', '正常利润', 'Zero Economic Profit Condition', 'Breakeven'],
    en: 'Normal Profit (Zero Economic Profit)',
    zh: '正常利润（零经济利润）',
    unit: 3,
    topicCode: '3.2',
    category: 'revenue',
    definition: {
      en: 'An economic state where a firms Total Revenue exactly equals its Total Economic Costs (Explicit + Implicit Costs), yielding an Economic Profit of precisely ZERO. Under normal profit, the business owner earns just enough accounting profit to fully cover their best forgone alternative earnings, making them indifferent between staying in this business or switching.',
      zh: '厂商的总收益恰好等于其全部经济成本（显性成本 + 隐性机会成本），即经济利润精确等于零的平衡状态。此时企业实现的账面会计利润刚好足以弥补店主的所有机会成本，既无超额暴利吸引新厂商进入，也无亏损促使既有厂商退出。'
    },
    formula: 'Economic Profit = 0 -> TR = Total Economic Cost -> Accounting Profit = Implicit Opportunity Cost',
    example: {
      en: 'A freelance consultant earns $110,000 in revenue and incurs $30,000 in explicit software/office costs. The consultant gave up an $80,000 corporate salary. Accounting profit is $80,000, exactly matching implicit opportunity cost. Economic Profit is $0 (Normal Profit).',
      zh: '独立咨询顾问年收入 11 万美元，显性办公支出 3 万。该顾问此前在企业任职年薪恰为 8 万美元。会计利润 8 万恰好全额覆盖其放弃薪资（隐性成本），经济利润为 0，处于正常利润状态。'
    },
    examTip: {
      en: 'Do not confuse "Zero Economic Profit" with "Going Bankrupt"! A firm earning zero economic profit is healthy, thriving, and covering all explicit and implicit costs. It is the permanent LONG-RUN equilibrium in perfect competition (P = min ATC).',
      zh: '切勿将“零经济利润”误解为“濒临破产”！零经济利润意味着企业运转良好，能全额拿回应得的合理机会回报。这正是完全竞争市场在长期均衡时的稳态（P = min ATC）。'
    },
    keyCharacteristics: [
      { en: 'Occurs in perfect competition long run at P = min ATC', zh: '在完全竞争长期均衡中出现于价格等于最低 ATC 之处' },
      { en: 'Provides zero incentive for firms to enter or exit the industry', zh: '行业外部厂商无进入动力，内部既有厂商亦无退出动机' }
    ],
    relatedConcepts: [
      { termId: 'term-accounting-vs-economic-profit', labelEn: 'Accounting vs Economic Profit', labelZh: '会计利润与经济利润', relationEn: 'Normal profit means accounting profit exactly equals implicit costs', relationZh: '正常利润意味着会计利润恰好等于隐性机会成本' },
      { termId: 'term-perfect-competition-side-by-side', labelEn: 'Perfect Competition', labelZh: '完全竞争市场', relationEn: 'Long-run equilibrium condition where every firm earns normal profit', relationZh: '完全竞争各厂商在长期均衡中只能获取正常利润' }
    ],
    linkedModelId: 'perfect-competition-side-by-side'
  },
  {
    id: 'term-sunk-cost',
    abbreviation: 'Sunk Cost',
    aliases: ['Sunk Cost Fallacy', '沉没成本', 'Sunk Costs Irrelevance', 'Unrecoverable Cost'],
    en: 'Sunk Cost & Sunk Cost Fallacy',
    zh: '沉没成本与沉没成本谬误',
    unit: 3,
    topicCode: '3.2',
    category: 'cost',
    definition: {
      en: 'A cost that has already been incurred in the past and CANNOT be recovered or refunded regardless of any future actions. Rational economic decision-makers IGNORE sunk costs completely, basing forward-looking decisions strictly on future marginal benefits versus future marginal costs.',
      zh: '已经发生且无论今后做出何种决策都无法收回、无法退费的既往历史支出。理性的经济决策者必须彻底忽略沉没成本，仅根据未来的边际收益与未来的边际成本进行向前看的权衡。'
    },
    formula: 'Decision Rule: Ignore Sunk Costs! Undertake action if and only if Future Marginal Benefit > Future Marginal Cost',
    example: {
      en: 'A pharma company spends $50 million researching a drug. Clinical trials then reveal the drug only generates $10 million in future revenue while requiring $20 million in packaging costs. Continuing the project to "recoup the $50M" is the Sunk Cost Fallacy; the project should be abandoned immediately.',
      zh: '药企前期已投入 5000 万美元研发新药。临床试验表明该药未来仅能产生 1000 万收益，但后续包装审批还需追加 2000 万边际成本。为“不浪费已花掉的 5000 万”而强行上马即是沉没成本谬误；理性决策应立即止损下马。'
    },
    examTip: {
      en: 'On the AP exam, FIXED COSTS (TFC) in the short run are sunk costs! In the short-run shutdown decision, fixed costs must be completely ignored because the firm must pay them whether it produces or shuts down.',
      zh: 'AP 核心考点：短期内的固定成本（TFC）本质上属于沉没成本！在短期停产决策中，必须完全忽略固定成本，因为无论生产还是停产，这笔固定账单都必须照付不误。'
    },
    keyCharacteristics: [
      { en: 'Irrelevant to forward-looking rational decision making', zh: '对理性向前看的未来决策完全不具有参考相关性' },
      { en: 'Fixed costs in the short run are unrecoverable sunk commitments', zh: '短期固定成本是不可撤回的既成沉没开销' }
    ],
    relatedConcepts: [
      { termId: 'term-tfc', labelEn: 'Total Fixed Cost (TFC)', labelZh: '总固定成本', relationEn: 'Short-run fixed commitments that act as sunk costs in shutdown decisions', relationZh: '在短期停产决策中视同沉没成本的固定开支' },
      { termId: 'term-shutdown-rule', labelEn: 'Shutdown Rule', labelZh: '停产法则', relationEn: 'Demonstrates why fixed costs are ignored in short-run operations', relationZh: '展现短期经营为何彻底忽略固定成本的经典决策规则' }
    ]
  },
  {
    id: 'term-per-unit-tax-cost-shift',
    abbreviation: 'Per-Unit Tax Shift',
    aliases: ['Per-Unit Tax on Cost Curves', '从量税对成本曲线的影响', 'Excise Tax Cost Shift'],
    en: 'Per-Unit Tax Impact on Cost Curves',
    zh: '从量税对成本曲线的平移影响',
    unit: 3,
    topicCode: '3.3',
    category: 'cost',
    definition: {
      en: 'The impact of an excise per-unit tax (e.g., $5 tax per unit produced) on a firms short-run cost curves. Because every additional unit produced incurs the tax, Variable Costs and Marginal Costs increase. Therefore, the Marginal Cost (MC), Average Variable Cost (AVC), and Average Total Cost (ATC) curves ALL shift vertically UPWARD by the exact tax amount. Total Fixed Cost (TFC) and AFC remain unchanged.',
      zh: '对生产厂商征收的每件从量税（如每产出一件征收 5 美元）对成本曲线体系的影响。由于每追加生产一件均需缴纳税款，变动成本与边际成本同步递增。因此，边际成本（MC）、平均可变成本（AVC）和平均总成本（ATC）全部垂直向上平移税额同等距离；而总固定成本（TFC）与平均固定成本（AFC）完全不受影响。'
    },
    formula: 'New MC = MC + Tax ; New AVC = AVC + Tax ; New ATC = ATC + Tax ; (AFC and TFC unchanged)',
    example: {
      en: 'A $4 per-unit tax is levied on battery manufacturers. Each factorys MC, AVC, and ATC curves immediately shift upward by $4. Since MC shifts up, the firm sets new MR = MC at a LOWER output quantity q.',
      zh: '政府对电池制造厂按每块电池征收 4 美元从量税。每家电池厂的 MC、AVC 和 ATC 曲线立即垂直上移 4 美元。由于 MC 上移，厂商按照新 MR = MC 规则将主动缩减单厂生产规模 q。'
    },
    examTip: {
      en: 'AP Gold Standard Comparison: A PER-UNIT tax increases MC, thereby reducing the profit-maximizing output quantity (q* decreases). A LUMP-SUM tax has ZERO effect on MC, leaving output quantity q* completely unchanged in the short run!',
      zh: 'AP 极高频必考对比：从量税（Per-Unit Tax）推高 MC，必将导致利润最大化产量下降（q* 减小）；而定额税（Lump-Sum Tax）对 MC 毫无影响，短期产量 q* 绝对不变！'
    },
    keyCharacteristics: [
      { en: 'Shifts MC, AVC, and ATC vertically upward', zh: '使 MC、AVC 与 ATC 曲线垂直向上平移' },
      { en: 'Directly alters short-run profit-maximizing output (q decreases)', zh: '直接改变短期利润最大化生产决策（产量 q 下调）' }
    ],
    relatedConcepts: [
      { termId: 'term-lump-sum-tax-cost-shift', labelEn: 'Lump-Sum Tax Impact on Cost Curves', labelZh: '定额税对成本曲线的影响', relationEn: 'Contrasting tax structure that leaves MC and output unchanged', relationZh: '不影响边际成本与短期产量的对比性税种' },
      { termId: 'term-marginal-cost', labelEn: 'Marginal Cost (MC)', labelZh: '边际成本', relationEn: 'Primary curve shifted by per-unit taxes', relationZh: '受从量税直接推升平移的核心曲线' }
    ],
    linkedModelId: 'cost-curves-short-run'
  },
  {
    id: 'term-lump-sum-tax-cost-shift',
    abbreviation: 'Lump-Sum Tax Shift',
    aliases: ['Lump-Sum Tax on Cost Curves', '定额税对成本曲线的影响', 'Fixed License Fee'],
    en: 'Lump-Sum Tax Impact on Cost Curves',
    zh: '定额税对成本曲线的平移影响',
    unit: 3,
    topicCode: '3.3',
    category: 'cost',
    definition: {
      en: 'The impact of a fixed, one-time lump-sum tax or operating license fee (e.g., $10,000 flat annual fee) on a firms cost curves. Because this tax does not vary with output volume, it behaves strictly as an increase in Fixed Costs. Therefore, Average Fixed Cost (AFC) and Average Total Cost (ATC) shift UPWARD, while Marginal Cost (MC) and Average Variable Cost (AVC) remain COMPLETELY UNCHANGED.',
      zh: '向企业开征固定总额税收或年审营业执照费（如每年固定缴纳 1 万美元）对成本曲线的影响。由于无论生产多少件税额均保持不变，该税项纯属固定成本的增加。因此，平均固定成本（AFC）和平均总成本（ATC）垂直向上平移，而边际成本（MC）与平均可变成本（AVC）完全保持不变。'
    },
    formula: 'New ATC = ATC + (Tax / Q) ; New AFC = AFC + (Tax / Q) ; MC and AVC remain UNCHANGED (ΔMC = 0)',
    example: {
      en: 'The city levies a $10,000 annual franchise fee on all coffee shops. Each shops AFC and ATC curves shift upward, cutting economic profit. However, since producing one more cup of coffee costs nothing in additional tax, MC is unaffected, and the profit-maximizing daily cup volume q remains unchanged.',
      zh: '市政对每家咖啡店征收 1 万美元年度特许经营费。每家店的 AFC 和 ATC 上移，利润缩水。但由于多卖一杯咖啡无需追加一分钱税费，边际成本 MC 纹丝不动，每日最优售卖杯数 q 完全不变。'
    },
    examTip: {
      en: 'Because MC does NOT shift under a lump-sum tax, the profit-maximizing output rule MR = MC yields the EXACT SAME quantity q*! The firm does not change its price or output in the short run—it simply suffers reduced economic profit.',
      zh: '由于定额税对 MC 毫无影响，按 MR = MC 规则决定的最优单店产量 q* 保持绝对不变！厂商在短期内绝不调价也不减产，只是自己默默承担利润下降。'
    },
    keyCharacteristics: [
      { en: 'Shifts only AFC and ATC curves upward', zh: '仅导致 AFC 与 ATC 曲线垂直向上平移' },
      { en: 'Leaves MC and AVC totally unaffected; output q remains unchanged', zh: 'MC 与 AVC 完全不变，短期最优产量 q 保持恒定' }
    ],
    relatedConcepts: [
      { termId: 'term-per-unit-tax-cost-shift', labelEn: 'Per-Unit Tax Impact on Cost Curves', labelZh: '从量税对成本曲线的影响', relationEn: 'Contrast with per-unit tax which alters MC and shrinks output', relationZh: '与推高边际成本、迫使产量缩减的从量税形成鲜明反差' },
      { termId: 'term-tfc', labelEn: 'Total Fixed Cost (TFC)', labelZh: '总固定成本', relationEn: 'Cost category where lump-sum taxes are accounted', relationZh: '定额税在会计分类上归属的总固定成本' }
    ],
    linkedModelId: 'cost-curves-short-run'
  },
  {
    id: 'term-economies-of-scale',
    abbreviation: 'Economies of Scale',
    aliases: ['Increasing Returns to Scale', '规模经济', 'LRATC Downward Slope'],
    en: 'Economies of Scale',
    zh: '规模经济（规模收益递增）',
    unit: 3,
    topicCode: '3.4',
    category: 'cost',
    definition: {
      en: 'A long-run production condition where a firm expands all inputs and factory plant sizes, causing Long-Run Average Total Cost (LRATC) to DECLINE as output expands. Drivers include specialized division of labor, bulk input purchasing discounts, and utilization of high-capacity mass-production machinery.',
      zh: '厂商在长期内按比例扩大所有要素投入与厂房生产规模，导致长期平均总成本（LRATC）随产量扩张而持续下降的良性经济状态。驱动因素包括深度专业化劳动力分工、原材料大宗采购折扣以及大规模高效自动化流水线的充分利用。'
    },
    formula: 'Long Run: %ΔOutput > %ΔInputs -> LRATC falls as Q expands (Downward-sloping LRATC)',
    example: {
      en: 'An electric vehicle startup producing 5,000 cars/year has an LRATC of $65,000/car. By building a gigafactory producing 500,000 cars/year, specialized stamping presses and robotic welders drive LRATC down to $28,000/car.',
      zh: '年产 5000 辆的新势力车企单车 LRATC 高达 6.5 万美元。当投资建设年产 50 万辆的超级工厂后，巨型一体化压铸机和机器人流水线将单车平均成本大幅摊薄至 2.8 万美元。'
    },
    examTip: {
      en: 'Do not confuse Economies of Scale (LONG RUN: all inputs variable, plant size expands) with Diminishing Marginal Returns (SHORT RUN: fixed inputs exist, fixed plant becomes crowded)!',
      zh: '切勿混淆“规模经济”（长期概念：所有要素皆可变，建更大的工厂）与“边际报酬递减”（短期概念：厂房设备固定，工人拥挤）！'
    },
    keyCharacteristics: [
      { en: 'Downward-sloping left portion of the envelope LRATC curve', zh: '包络型 LRATC 曲线向右下方倾斜的左半段' },
      { en: 'Creates natural monopoly barriers to entry if scale spans the entire market', zh: '若规模经济跨越整个市场需求，将形成坚固的自然垄断壁垒' }
    ],
    relatedConcepts: [
      { termId: 'term-lratc', labelEn: 'Long-Run Average Total Cost (LRATC)', labelZh: '长期平均总成本', relationEn: 'The long-run envelope curve whose downward slope defines economies of scale', relationZh: '其向右下方倾斜形态所定义的规模经济曲线' },
      { termId: 'term-mes', labelEn: 'Minimum Efficient Scale (MES)', labelZh: '最小有效规模', relationEn: 'The lowest output level where economies of scale are fully exhausted', relationZh: '规模经济潜力全部被释放完毕的最低生产规模' },
      { termId: 'term-diseconomies-of-scale', labelEn: 'Diseconomies of Scale', labelZh: '规模不经济', relationEn: 'The opposite rightward upward-sloping portion of LRATC', relationZh: 'LRATC 曲线右侧向上扬起的相反阶段' }
    ],
    linkedModelId: 'lratc-economies-of-scale'
  },
  {
    id: 'term-constant-returns-to-scale',
    abbreviation: 'CRS',
    aliases: ['Constant Returns to Scale', '规模报酬不变', 'Flat LRATC'],
    en: 'Constant Returns to Scale (CRS)',
    zh: '规模报酬不变（CRS）',
    unit: 3,
    topicCode: '3.4',
    category: 'cost',
    definition: {
      en: 'A long-run production range where doubling all resource inputs results in an exact doubling of total output, causing Long-Run Average Total Cost (LRATC) to remain FLAT and CONSTANT as output expands.',
      zh: '长期生产中将所有生产要素翻倍投入恰好使总产出同比例翻倍，导致长期平均总成本（LRATC）随产量扩张保持水平平坦、恒定不变的稳定区间。'
    },
    formula: 'Long Run: %ΔOutput = %ΔInputs -> LRATC is constant (flat horizontal line)',
    example: {
      en: 'A fast-food franchise opens 10 identical hamburger locations. Because each store operates with identical modular efficiency and corporate management scales linearly, average cost per burger remains constant at $2.50 across all 10 branches.',
      zh: '某连锁汉堡品牌开设了 10 家完全同质的标准化门店。由于每家门店模块化运作且管理成本线性分摊，无论开 1 家还是 10 家，单只汉堡的平均总成本均稳定在 2.50 美元。'
    },
    examTip: {
      en: 'On graphs, Constant Returns to Scale is the flat, bottom trough of the U-shaped LRATC curve, situated directly between the economies of scale region and the diseconomies of scale region.',
      zh: '在图表中，规模报酬不变处于 U 型 LRATC 曲线的正中平底槽区域，恰好介于左侧规模经济与右侧规模不经济之间。'
    },
    keyCharacteristics: [
      { en: 'Flat bottom portion of the LRATC curve', zh: 'LRATC 曲线平坦的底部平底槽' },
      { en: 'Proportional expansion yields identical per-unit production costs', zh: '成比例扩建各要素投入不会改变单位产品生产成本' }
    ],
    relatedConcepts: [
      { termId: 'term-economies-of-scale', labelEn: 'Economies of Scale', labelZh: '规模经济', relationEn: 'The preceding downward-sloping stage of production', relationZh: '在此之前发生的成本下行生产阶段' },
      { termId: 'term-diseconomies-of-scale', labelEn: 'Diseconomies of Scale', labelZh: '规模不经济', relationEn: 'The succeeding upward-sloping stage of production', relationZh: '在此之后出现的成本上扬生产阶段' }
    ],
    linkedModelId: 'lratc-economies-of-scale'
  },
  {
    id: 'term-diseconomies-of-scale',
    abbreviation: 'Diseconomies of Scale',
    aliases: ['Decreasing Returns to Scale', '规模不经济', 'LRATC Upward Slope'],
    en: 'Diseconomies of Scale',
    zh: '规模不经济（规模收益递减）',
    unit: 3,
    topicCode: '3.4',
    category: 'cost',
    definition: {
      en: 'A long-run production condition where a firm grows so excessively large that Long-Run Average Total Cost (LRATC) INCREASES as output expands. Driven by organizational bureaucracy, communication breakdowns, management coordination difficulties, and worker alienation in massive conglomerates.',
      zh: '厂商在长期内盲目过度扩张，导致长期平均总成本（LRATC）随产量增加反而节节攀升的不利状态。主要根源在于科层官僚化臃肿、内部信息沟通链条断裂、跨部门协调协调困难以及庞大体制下的员工摸鱼怠工。'
    },
    formula: 'Long Run: %ΔOutput < %ΔInputs -> LRATC rises as Q expands (Upward-sloping LRATC)',
    example: {
      en: 'A global mega-corporation expands to 200,000 employees across 40 countries. Layers of executive red tape require 12 approvals to purchase office supplies. Delays, bloated overhead, and communication friction drive average cost per unit up by 25%.',
      zh: '某跨国巨头扩张至 40 个国家 20 万员工。官僚科层导致采购办公设备需要 12 道签字审批。决策拖延、管理层臃肿使得单件产品的平均制造与管理成本攀升了 25%。'
    },
    examTip: {
      en: 'Remember: Diseconomies of scale is a LONG-RUN managerial/coordination problem where ALL inputs are variable. Do not confuse it with short-run diminishing returns caused by crowded fixed capital!',
      zh: '切记：规模不经济纯属“长期”的管理协调与组织官僚化困境（所有要素皆可变）。千万不可与短期内厂房固定造成的边际报酬递减相混淆！'
    },
    keyCharacteristics: [
      { en: 'Upward-sloping right portion of the LRATC curve', zh: 'LRATC 曲线向右上方倾斜的右半段' },
      { en: 'Sets natural upper boundaries on efficient corporation size', zh: '为有效企业组织规模设立了客观自然上限' }
    ],
    relatedConcepts: [
      { termId: 'term-economies-of-scale', labelEn: 'Economies of Scale', labelZh: '规模经济', relationEn: 'The opposite cost-saving stage occurring at smaller production scales', relationZh: '在较小生产规模下出现的相反成本节约阶段' },
      { termId: 'term-lratc', labelEn: 'Long-Run Average Total Cost (LRATC)', labelZh: '长期平均总成本', relationEn: 'Envelope curve reflecting diseconomies on its upward branch', relationZh: '在其右侧上行分支中体现规模不经济的长期包络曲线' }
    ],
    linkedModelId: 'lratc-economies-of-scale'
  },
  {
    id: 'term-short-run-vs-long-run',
    abbreviation: 'Short Run vs Long Run',
    aliases: ['Short Run', 'Long Run', '短期与长期生产决策', 'Fixed vs Variable Horizon'],
    en: 'Short Run vs Long Run Production',
    zh: '短期与长期生产决策（要素可变性分界）',
    unit: 3,
    topicCode: '3.1',
    category: 'cost',
    definition: {
      en: 'The microeconomic planning horizons defined by input flexibility, NOT by calendar time. In the SHORT RUN, at least one production input is FIXED (e.g., plant capacity or machinery), and firms can only vary labor. In the LONG RUN, ALL inputs, technologies, and plant sizes are fully VARIABLE, and firms can freely enter or exit the industry.',
      zh: '由生产要素调整灵活性严格界定的经济决策跨度，而非日历上的钟表时间。短期指至少有一种要素是固定不可调整的（如厂房面积或大型重资产），企业只能增减雇工；长期指所有生产要素、设备技术与厂房规模皆可自由调整，外部厂商亦可自由进出该行业。'
    },
    formula: 'Short Run: Fixed Inputs > 0 (TFC > 0) ; Long Run: All Inputs Variable (TFC = 0, all costs are variable)',
    example: {
      en: 'A Boeing airliner plant requires 4 years to construct. Within the 6-month short run, Boeing can only alter overtime worker shifts. Over a 5-year long run, Boeing can construct 3 new factory assembly halls and add robotics.',
      zh: '波音扩建客机总装厂需要 4 年时间。在 6 个月的短期内，波音只能通过安排现有工人加班倒班来增产；而在 5 年的长期跨度内，波音可以扩建 3 座全新装配大厅并引入自动化流水线。'
    },
    examTip: {
      en: 'In the short run, a firm with losses will continue producing if Price covers AVC (P >= AVC). In the long run, if price remains below ATC (P < ATC), the firm exits the industry entirely!',
      zh: '短期与长期决策分水岭：短期亏损时，只要价格能覆盖平均可变成本（P >= AVC）厂商就会咬牙坚持生产；长期亏损时（P < ATC），厂商必然彻底清盘离场退出行业！'
    },
    keyCharacteristics: [
      { en: 'Short run contains fixed costs; long run has zero fixed costs', zh: '短期必然存在固定成本；长期中一切成本皆为可变成本' },
      { en: 'Free entry and exit can only happen in the long run', zh: '厂商的自由进入与彻底退出只能在长期发生' }
    ],
    relatedConcepts: [
      { termId: 'term-shutdown-rule', labelEn: 'Shutdown Rule', labelZh: '停产法则', relationEn: 'Short-run operational rule comparing Price with AVC', relationZh: '短期内比较单价与 AVC 的经营决策法则' },
      { termId: 'term-lratc', labelEn: 'Long-Run Average Total Cost (LRATC)', labelZh: '长期平均总成本', relationEn: 'Envelope curve encompassing all short-run SRATC curves', relationZh: '包裹包络所有短期 SRATC 曲线的长期总成本规划边界' }
    ],
    linkedModelId: 'cost-curves-short-run'
  },
  // ==========================================
  // EXPANDED UNIT 4: Imperfect Competition, Monopoly Regulation & Game Theory
  // ==========================================
  {
    id: 'term-barriers-to-entry',
    abbreviation: 'Barriers to Entry',
    aliases: ['Entry Barriers', '进入壁垒', 'Monopoly Power Sources'],
    en: 'Barriers to Entry',
    zh: '市场进入壁垒',
    unit: 4,
    topicCode: '4.1',
    category: 'structure',
    definition: {
      en: 'Economic, legal, or institutional obstacles that prevent or deter potential competitor firms from entering an industry, enabling incumbent monopolies or oligopolies to sustain positive economic profits in the long run. Major types include economies of scale (natural monopolies), legal restrictions (patents/copyrights), exclusive ownership of key natural resources, and network externalities.',
      zh: '阻碍或威慑潜在竞争对手进入某一行业的经济、法律或制度性壁垒，是垄断或寡头企业得以在长期维持超额正经济利润的根本保障。四大主要壁垒包括：大规模规模经济（自然垄断）、政府法定特许或专利产权保护、对核心原材料资源的独家垄断控制、以及先发网络外部性。'
    },
    formula: 'High Barriers to Entry -> Zero New Entrants -> Long-Run Economic Profit > 0 is Sustainable',
    example: {
      en: 'A pharmaceutical firm patents a groundbreaking cancer medication for 20 years. Because competitors are legally barred from manufacturing the generic drug, the firm charges monopoly prices and earns high economic profit.',
      zh: '某药企为一款抗癌靶向新药申请了为期 20 年的专利保护。因法律严禁任何竞争者仿制生产该药，该药企在此期间充分享有排他性垄断定价权与超额经济利润。'
    },
    examTip: {
      en: 'In Perfect Competition and Monopolistic Competition, barriers to entry are LOW or ZERO, driving economic profit to zero in the long run. In Monopoly and Oligopoly, barriers are HIGH, preserving long-run economic profits.',
      zh: '完全竞争与垄断竞争由于进入壁垒为零或极低，长期利润必定被新进入者稀释为零；而垄断与寡头因筑有坚固的高进入壁垒，得以在长期牢牢锁住正经济利润。'
    },
    keyCharacteristics: [
      { en: 'Precondition for long-run monopoly economic profits', zh: '垄断企业长期维系超额经济利润的绝对先决条件' },
      { en: 'Determines whether an industry is competitive or concentrated', zh: '决定行业走向分散竞争还是寡头集中的制度分水岭' }
    ],
    relatedConcepts: [
      { termId: 'term-natural-monopoly', labelEn: 'Natural Monopoly', labelZh: '自然垄断', relationEn: 'Entry barrier created purely by extreme economies of scale', relationZh: '完全由极端巨幅规模经济所天然筑就的进入壁垒' },
      { termId: 'term-monopoly-single-price', labelEn: 'Single-Price Monopoly', labelZh: '单一定价垄断', relationEn: 'Market structure sustained by high barriers to entry', relationZh: '依靠高进入壁垒得以长期维持的市场竞争形态' }
    ],
    linkedModelId: 'monopoly-single-price'
  },
  {
    id: 'term-fair-return-price',
    abbreviation: 'Fair-Return (P=ATC)',
    aliases: ['Fair-Return Price', '公平回报定价', 'Average Cost Pricing', 'Zero Profit Regulation'],
    en: 'Fair-Return Price Regulation (P = ATC)',
    zh: '公平回报规制定价（P = ATC 法则）',
    unit: 4,
    topicCode: '4.2',
    category: 'structure',
    definition: {
      en: 'A government regulatory pricing rule imposed on natural monopolies setting price equal to Average Total Cost (P = ATC). At this regulated price, the monopoly expands output, eliminates deadweight loss partially, and earns exactly ZERO economic profit (normal profit), allowing the utility to remain financially solvent without taxpayer subsidies.',
      zh: '政府反垄断机构对自然垄断公用事业实施的经典规制定价方案：强制令销售价格等于平均总成本（P = ATC）。在此受控价格下，厂商被迫扩大供水供电产能、大幅削减无谓损失，且获得恰好为零的经济利润（正常利润），既不赚取垄断暴利，也无需政府财政额外掏钱补贴。'
    },
    formula: 'Regulated Price P = ATC ; Output set where Demand intersects ATC ; Economic Profit = 0 ; Subsidy needed = $0',
    example: {
      en: 'A municipal water utility has an unregulated monopoly price of $8/thousand gallons. Regulators enforce the Fair-Return rule where Demand intersects ATC at $3.50. The utility supplies 5 million gallons, breaks even on economic profit, and requires zero municipal subsidies.',
      zh: '某市立自来水公司若放任垄断定价将索要每千加仑 8 美元。市政公用监管委员会按 P = ATC 公平回报规则将其水价强制压低至 3.50 美元，供水量扩张至 500 万加仑，企业自负盈亏不赚暴利，政府补贴支出为零。'
    },
    examTip: {
      en: 'AP Exam Comparison: Socially Optimal (P = MC) achieves 100% allocative efficiency but forces the natural monopoly to operate at a LOSS (requires government subsidy). Fair-Return (P = ATC) avoids subsidies but leaves a small remaining deadweight loss.',
      zh: 'AP 极高频大题必考对比：社会最优定价（P = MC）实现社会配置最有效，但会使自然垄断陷入巨额亏损（必须政府财政倒贴兜底）；公平回报定价（P = ATC）无需政府掏一分钱补贴，但会留下一小块无谓损失残余。'
    },
    keyCharacteristics: [
      { en: 'Eliminates monopoly economic profits while guaranteeing zero bankruptcies', zh: '根除垄断超额暴利，同时保证企业财务自负盈亏不破产' },
      { en: 'Does not achieve full allocative efficiency (P > MC still holds)', zh: '未能彻底实现资源最优配置（P 依然略高于 MC）' }
    ],
    relatedConcepts: [
      { termId: 'term-socially-optimal-price', labelEn: 'Socially Optimal Price (P = MC)', labelZh: '社会最优规制定价', relationEn: 'Alternative regulatory price achieving full allocative efficiency', relationZh: '实现彻底资源配置最优但会导致企业亏损的对立规制方案' },
      { termId: 'term-natural-monopoly', labelEn: 'Natural Monopoly', labelZh: '自然垄断', relationEn: 'Market structure where Fair-Return regulation is applied', relationZh: '适用公平回报规制定价的核心目标市场结构' }
    ],
    linkedModelId: 'monopoly-single-price'
  },
  {
    id: 'term-socially-optimal-price',
    abbreviation: 'Socially Optimal (P=MC)',
    aliases: ['Socially Optimal Price', '社会最优定价', 'Marginal Cost Pricing', 'Allocative Efficient Price'],
    en: 'Socially Optimal Price Regulation (P = MC)',
    zh: '社会最优规制定价（P = MC 法则）',
    unit: 4,
    topicCode: '4.2',
    category: 'structure',
    definition: {
      en: 'A regulatory price ceiling set where the market Demand curve intersects the Marginal Cost curve (P = MC). This achieves complete ALLOCATIVE EFFICIENCY, maximizing total consumer and producer surplus and driving deadweight loss to zero (DWL = 0). For a natural monopoly, because MC lies below ATC over the relevant output range, this rule forces the firm to suffer an economic loss, requiring a government lump-sum subsidy.',
      zh: '政府监管机构依据市场需求曲线与边际成本曲线交点（P = MC）所强制设定的法定最高限价。该定价达到完全的“配置效率”（Allocative Efficiency），使全社会总福利达到最大化，无谓损失彻底归零（DWL = 0）。但对自然垄断而言，因其在生产区间 MC 始终处于 ATC 下方，P = MC 定价必然导致企业亏损，政府必须给予财政直接补贴。'
    },
    formula: 'Regulated Price P = MC ; Q set where Demand intersects MC ; DWL = 0 ; Economic Profit < 0 (Loss = ATC - P per unit)',
    example: {
      en: 'A high-speed rail network is regulated at Socially Optimal price P = MC = $20 per ticket. Millions ride efficiently and DWL is eliminated. However, because building tracks created massive fixed costs, ATC is $35. The government must provide a $15/passenger subsidy to keep trains running.',
      zh: '某城际高铁网络按社会最优价格 P = MC 统一定价每张车票 20 美元，全社会出行福利最大化且无无谓损失。然而修建铁轨的巨额固定投资摊薄后每位乘客 ATC 仍为 35 美元，列车开一趟亏一趟，政府必须对每张票财政补贴 15 美元以防停运。'
    },
    examTip: {
      en: 'Whenever an AP question asks: "What price and quantity achieve allocative efficiency?" or "What price eliminates all deadweight loss?" the answer is ALWAYS where Demand = MC (P = MC)!',
      zh: '凡是 AP 考题提问：“何种价格和产量能够达到资源配置效率（Allocative Efficiency）？”或“何种管制能够彻底消除无谓损失？”答案永远是 Demand = MC（P = MC）的交点！'
    },
    keyCharacteristics: [
      { en: '100% allocative efficiency: Price equals marginal cost of production', zh: '100% 达成资源配置最优：社会边际支付意愿恰等于边际生产成本' },
      { en: 'Requires taxpayer lump-sum subsidy to keep natural monopolies solvent', zh: '维持自然垄断持续运营必须由纳税人税收予以补贴兜底' }
    ],
    relatedConcepts: [
      { termId: 'term-fair-return-price', labelEn: 'Fair-Return Price (P = ATC)', labelZh: '公平回报规制定价', relationEn: 'Alternative regulatory compromise that avoids public subsidies', relationZh: '无需财政掏钱倒贴的折中监管方案' },
      { termId: 'term-allocative-efficiency', labelEn: 'Allocative Efficiency', labelZh: '配置效率', relationEn: 'Economic condition directly satisfied by P = MC', relationZh: '由 P = MC 直接满足的帕累托最优配置状态' }
    ],
    linkedModelId: 'monopoly-single-price'
  },
  {
    id: 'term-first-degree-price-discrimination',
    abbreviation: '1st Degree PD',
    aliases: ['First-Degree Price Discrimination', 'Perfect Price Discrimination', '完全价格歧视', '一级价格歧视'],
    en: 'First-Degree Price Discrimination (Perfect)',
    zh: '完全/一级价格歧视（完美价格歧视）',
    unit: 4,
    topicCode: '4.3',
    category: 'structure',
    definition: {
      en: 'A theoretical monopoly pricing strategy where the seller charges every individual consumer the exact maximum price they are willing to pay for each unit (their reservation price). Under perfect price discrimination, Consumer Surplus is completely reduced to ZERO (CS = 0), Deadweight Loss is ZERO (DWL = 0), output expands to the allocatively efficient level, and the Marginal Revenue (MR) curve becomes IDENTICAL to the Demand curve.',
      zh: '垄断厂商掌握每个买家的精准心理底线，对每一位消费者按其所愿支付的最高保留价格（Reservation Price）逐一单独定价售卖。在完全价格歧视下，消费者剩余被全额榨取榨干变为零（CS = 0），社会无谓损失亦彻底归零（DWL = 0），产量扩张至社会最优配置水平，此时边际收益（MR）曲线与需求（Demand）曲线完全重合。'
    },
    formula: 'Every Buyer pays Reservation Price ; CS = 0 ; DWL = 0 ; MR curve = Demand curve ; Profit = Entire Surplus',
    example: {
      en: 'A high-end private bespoke jeweler interviews buyers and knows their exact budgets. Buyer 1 pays $10,000, Buyer 2 pays $7,000, and Buyer 3 pays $4,000 for identical custom rings. The jeweler captures 100% of the economic surplus as producer profit.',
      zh: '私人高定珠宝商洞悉每位富豪买家的心理支付极限。同款定制钻戒向客户甲收 1 万美元、向客户乙收 7000 美元、向客户丙收 4000 美元，将全部经济剩余榨取为企业利润。'
    },
    examTip: {
      en: 'AP Exam High-Frequency Trap: A perfectly price-discriminating monopoly produces MORE output than a single-price monopoly, achieves allocative efficiency (P=MC at the last unit), and creates ZERO deadweight loss!',
      zh: 'AP 超高频考点：完全价格歧视垄断的产量显著“高于”单一定价垄断，且最后一单位正好满足 P = MC，因而完美达成资源配置效率，无谓损失为零！'
    },
    keyCharacteristics: [
      { en: 'Consumer Surplus is entirely converted into Producer Surplus (CS = 0)', zh: '全部消费者剩余完全转化为厂商超额垄断利润' },
      { en: 'MR curve coincides with the market Demand curve (no downward price concessions on earlier units)', zh: 'MR 曲线与需求曲线重合（追加销售不再牺牲已售单元价格）' }
    ],
    relatedConcepts: [
      { termId: 'term-monopoly-price-discrimination', labelEn: 'Price Discrimination Model', labelZh: '价格歧视模型', relationEn: 'Interactive model demonstrating the conversion of CS and DWL into profit', relationZh: '演示 CS 与 DWL 被全额转化为利润的图像模型' },
      { termId: 'term-deadweight-loss', labelEn: 'Deadweight Loss (DWL)', labelZh: '无谓损失', relationEn: 'Completely eliminated under first-degree price discrimination', relationZh: '在完全价格歧视下被彻底消除为零' }
    ],
    linkedModelId: 'monopoly-price-discrimination'
  },
  {
    id: 'term-third-degree-price-discrimination',
    abbreviation: '3rd Degree PD',
    aliases: ['Third-Degree Price Discrimination', 'Market Segmentation Pricing', '三级价格歧视', 'Student Discount'],
    en: 'Third-Degree Price Discrimination (Market Segmentation)',
    zh: '三级价格歧视（市场分割定价）',
    unit: 4,
    topicCode: '4.3',
    category: 'structure',
    definition: {
      en: 'The common real-world practice of charging different prices to distinct consumer groups for the exact same good or service based on differences in their Price Elasticity of Demand (PED). Buyers with more INELASTIC demand (e.g., business travelers, adults) are charged HIGHER prices; buyers with more ELASTIC demand (e.g., students, senior citizens) are charged LOWER prices.',
      zh: '现实中最为普遍的价格歧视模式：厂商依据不同消费群体的需求价格弹性（PED）差异，将整个市场有效分割为若干子市场并分别索取不同价格。需求越缺乏弹性（刚需强、反应迟钝）的群体被索取更高价格；需求越富有弹性（价格敏感、预算有限）的群体则享受折扣低价。'
    },
    formula: 'Condition: Segmented Groups with Different |PED| + Prevention of Resale (Arbitrage)',
    example: {
      en: 'A movie theater charges $15 for adult tickets (inelastic demand) and $8 for student tickets with student ID (highly elastic demand). Requiring student IDs at the door prevents adults from buying cheaper tickets or students from scalping.',
      zh: '电影院向全价成年人收取 15 美元门票（需求较缺乏弹性），向持学生证的学生收取 8 美元特惠票（需求富有弹性）。检票口核验学生证严密杜绝了黄牛转手倒卖与跨群套利。'
    },
    examTip: {
      en: 'Two non-negotiable conditions must be met for third-degree price discrimination to succeed: (1) The firm must have market power to segment buyers by elasticity, and (2) The firm must be able to PREVENT RESALE (arbitrage) between groups.',
      zh: '三级价格歧视成功的两大不可或缺前提：（1）企业必须拥有市场势力以按弹性分割客群；（2）企业必须能够有效杜绝二手转售套利（Prevent Resale）。'
    },
    keyCharacteristics: [
      { en: 'Inelastic consumers pay higher price; elastic consumers pay discounted price', zh: '缺乏弹性客群支付高价，富有弹性客群享受折扣' },
      { en: 'Expands firm total profits compared to charging a single uniform price', zh: '相比于单一统一定价，显著扩增了厂商的总利润池' }
    ],
    relatedConcepts: [
      { termId: 'term-ped', labelEn: 'Price Elasticity of Demand (PED)', labelZh: '需求价格弹性', relationEn: 'The core metric by which consumer segments are separated and priced', relationZh: '划分客群并实施差别定价的最核心弹性指标' },
      { termId: 'term-first-degree-price-discrimination', labelEn: 'First-Degree Price Discrimination', labelZh: '完全价格歧视', relationEn: 'The theoretical extreme where market segmentation reaches individual consumer level', relationZh: '当市场分割细化至个人单位时的极端极限状态' }
    ],
    linkedModelId: 'monopoly-price-discrimination'
  },
  {
    id: 'term-collusion-cartel',
    abbreviation: 'Collusion / Cartel',
    aliases: ['Collusion', 'Cartel', 'Oligopoly Cartel', '合谋与卡特尔', 'OPEC'],
    en: 'Collusion & Cartels',
    zh: '合谋与卡特尔（寡头垄断联盟）',
    unit: 4,
    topicCode: '4.4',
    category: 'structure',
    definition: {
      en: 'An agreement—either formal and overt (a Cartel) or informal and secret (Collusion)—among competing oligopolistic firms to coordinate actions, restrict total market production, and fix prices high, effectively acting together as a joint monopoly. Cartels are unstable over time because each individual member faces a strong financial incentive to CHEAT on the agreement by secretly cutting price or expanding output.',
      zh: '寡头垄断市场中的竞争对手之间达成正式公开协议（卡特尔 Cartel）或秘密非正式默契（合谋 Collusion），通过联合限产、人为抬高市价，协同行使相当于单一垄断者的暴利定价权。卡特尔在长期具有内在的不稳定性，因为每个成员国或成员厂商都面临巨大的背叛诱惑（偷偷降价或超额开采偷跑以独揽销量）。'
    },
    formula: 'Cartel Joint Profit Maximization: Set Industry MR = Industry MC ; Individual Incentive: Cheat to expand Q',
    example: {
      en: 'OPEC oil ministers agree to cut daily crude production quotas to push oil to $100/barrel. However, individual member countries face immense temptation to secretly pump beyond their quota to collect massive windfalls.',
      zh: '欧佩克（OPEC）产油国达成限产配额协议以推高油价至 100 美元/桶。然而各成员国私下均面临强烈的偷跑诱惑，偷偷超配额开采以获取巨额额外原油外汇。'
    },
    examTip: {
      en: 'Game theory directly explains why cartels collapse: Both firms prefer the collusive monopoly profit, but Defecting (cheating) is a DOMINANT STRATEGY for each firm, leading directly to the non-cooperative Nash equilibrium.',
      zh: '博弈论极其精辟地解释了卡特尔瓦解机制：尽管双方都垂涎垄断暴利，但“背叛偷跑（Defect）”是每个寡头的“占优策略”，最终不可避免地滑向囚徒困境纳什均衡。'
    },
    keyCharacteristics: [
      { en: 'Firms jointly replicate single-price monopoly output and deadweight loss', zh: '寡头合谋在总体上制造了单一定价垄断的产量与无谓损失' },
      { en: 'Inherently unstable due to dominant strategy incentives to cheat', zh: '由于背叛占优策略的诱惑而具备天然内在不稳定性' }
    ],
    relatedConcepts: [
      { termId: 'term-prisoners-dilemma', labelEn: "Prisoner's Dilemma", labelZh: '囚徒困境', relationEn: 'Game theoretic structure explaining why collusive cartels collapse', relationZh: '解释卡特尔合谋为何必然走向背叛破裂的博弈结构' },
      { termId: 'term-dominant-strategy', labelEn: 'Dominant Strategy', labelZh: '占优策略', relationEn: 'The rational cheating strategy that ruins cartel cooperation', relationZh: '瓦解卡特尔合作同盟的理性背叛策略' }
    ],
    linkedModelId: 'oligopoly-game-theory'
  },
  {
    id: 'term-tacit-collusion-price-leadership',
    abbreviation: 'Tacit Collusion',
    aliases: ['Tacit Collusion', 'Price Leadership', '默契合谋与价格领导', 'Informal Coordination'],
    en: 'Tacit Collusion & Price Leadership',
    zh: '默契合谋与价格领导制',
    unit: 4,
    topicCode: '4.4',
    category: 'structure',
    definition: {
      en: 'An unwritten, unspoken coordination among oligopoly firms where they informally avoid price wars and maintain high prices without explicit verbal or written communication (which is illegal under antitrust laws). In Price Leadership, the largest or most dominant firm initiates price adjustments, and all other rival firms tacitly follow suit.',
      zh: '寡头垄断企业之间无需任何明文合同或私下碰头协议（规避反垄断法的非法合谋指控），心照不宣地避免价格恶性竞争、共同维持高价的默契状态。在价格领导制中，行业内规模最大、最具影响力的龙头巨头率先宣布调价，其他竞争对手心领神会地同步跟进。'
    },
    formula: 'Dominant Firm sets Price -> Follower Firms match Price -> High Industry Profits without formal meetings',
    example: {
      en: 'Major commercial airlines rarely announce price wars. When Delta introduces a $30 checked-bag fee, American and United silently match the exact same fee within 48 hours without any direct phone calls.',
      zh: '各大主流航空公司极少公开打价格战。当达美航空宣布托运首件行李收取 30 美元时，美联航与美航在 48 小时内默契地同步执行同等收费，无需任何内部串通电话。'
    },
    examTip: {
      en: 'Tacit collusion does not require illegal backroom meetings. It relies on repeated interactions (repeated games) where firms know price cuts will trigger immediate destructive retaliation.',
      zh: '默契合谋无需任何非法的暗室碰头密谋。它建立在博弈论的“重复博弈”机制上——任何率先降价挑衅的行为都会招致对手更猛烈的毁灭性报复，因此大家选择默契维稳。'
    },
    keyCharacteristics: [
      { en: 'Maintains high oligopoly prices without formal illegal cartel agreements', zh: '在没有违法明文卡特尔协议的前提下维系高寡头价格' },
      { en: 'Supported by credible threats of tit-for-tat price matching retaliation', zh: '依靠针锋相对价格战报复威胁作为隐性纪律约束' }
    ],
    relatedConcepts: [
      { termId: 'term-collusion-cartel', labelEn: 'Collusion & Cartels', labelZh: '合谋与卡特尔', relationEn: 'Formal illegal counterpart to tacit coordination', relationZh: '默契配合所对应的法定非法公开合谋形态' },
      { termId: 'term-oligopoly-game-theory', labelEn: 'Oligopoly & Game Theory', labelZh: '寡头与博弈论', relationEn: 'Repeated game context where tacit cooperation is sustained', relationZh: '维持默契合作长期稳定的重复博弈模型' }
    ],
    linkedModelId: 'oligopoly-game-theory'
  },
  {
    id: 'term-payoff-matrix',
    abbreviation: 'Payoff Matrix',
    aliases: ['Game Theory Matrix', '博弈论支付矩阵', '2x2 Matrix', 'Strategic Normal Form'],
    en: 'Payoff Matrix (Game Theory)',
    zh: '博弈论支付矩阵（2×2 策略表）',
    unit: 4,
    topicCode: '4.5',
    category: 'structure',
    definition: {
      en: 'A standard visual grid displaying the strategic interactions and resulting payoffs (profits, losses, or utilities) for two interdependent decision-makers (e.g., Firm 1 and Firm 2). Convention: in each cell, the FIRST number belongs to the ROW player (Firm 1 on the left), and the SECOND number belongs to the COLUMN player (Firm 2 at the top).',
      zh: '用以展示两个相互依存的决策主体（如厂商 1 与厂商 2）在不同策略组合下所获收益（利润、损失或效用）的标准 2×2 矩阵表格。通用排版惯例：每个单元格内的“第一个数字”归属于左侧“行玩家”（Firm 1），“第二个数字”归属于上方“列玩家”（Firm 2）。'
    },
    formula: 'Cell (Row i, Col j) = [Payoff to Player 1, Payoff to Player 2]',
    example: {
      en: 'If Firm 1 advertises and Firm 2 advertises, the top-left cell shows ($50M, $50M). If Firm 1 advertises but Firm 2 does not, top-right shows ($90M, $10M). Player 1 evaluates row choices against Player 2 columns.',
      zh: '若厂商 1 投放广告且厂商 2 亦投放，左上单元格显示（5000 万，5000 万）；若厂商 1 投放但厂商 2 不投放，右上格显示（9000 万，1000 万）。行玩家根据列玩家的选择逐一判定自己最佳回应。'
    },
    examTip: {
      en: 'AP Exam Rule: Always write out: "If Firm 2 chooses Left, Firm 1 should choose X because [Payoff A] > [Payoff B]." Showing explicit numerical comparisons is required for full FRQ credit!',
      zh: 'AP 大题得分法则：必须书写完整推导句式：“若厂商 2 选择策略 A，厂商 1 应选择策略 B，因为收益 [数值 1] > [数值 2]。”给出明确的数值比对是 FRQ 拿满分的硬性规定！'
    },
    keyCharacteristics: [
      { en: 'Captures mutual economic interdependence in oligopoly structures', zh: '直观刻画寡头市场相互依存的核心决策特征' },
      { en: 'Used to identify dominant strategies and locate Nash equilibria', zh: '用于系统排查占优策略并精准定位纳什均衡点' }
    ],
    relatedConcepts: [
      { termId: 'term-dominant-strategy', labelEn: 'Dominant Strategy', labelZh: '占优策略', relationEn: 'Strategy evaluated directly from the payoff matrix columns and rows', relationZh: '直接在矩阵行列中检验判定的最优行动策略' },
      { termId: 'term-nash-equilibrium', labelEn: 'Nash Equilibrium (NE)', labelZh: '纳什均衡', relationEn: 'Cell where neither player has incentive to deviate unilaterally', relationZh: '双方均无动力单方面背离的最佳回应重合单元格' }
    ],
    linkedModelId: 'oligopoly-game-theory'
  },
  {
    id: 'term-prisoners-dilemma',
    abbreviation: 'Prisoner Dilemma',
    aliases: ['Prisoners Dilemma', '囚徒困境', 'Non-Cooperative Game', 'Suboptimal Equilibrium'],
    en: "Prisoner's Dilemma",
    zh: '囚徒困境（非合作博弈典型）',
    unit: 4,
    topicCode: '4.5',
    category: 'structure',
    definition: {
      en: 'A canonical game theory situation where both players possess a dominant strategy to defect (cheat/confess), leading to a non-cooperative Nash equilibrium where BOTH players end up significantly worse off than if they had successfully cooperated.',
      zh: '博弈论中最为著名的经典场景：两位博弈方各自均拥有单方面的占优策略去选择背叛（招供/降价），其博弈结果必然导向一个非合作纳什均衡，而该均衡状态下双方的收益显著劣于双方如果能精诚合作所能获得的收益。'
    },
    formula: 'Nash Equilibrium Payoff (Defect, Defect) < Collusive Cooperative Payoff (Cooperate, Cooperate)',
    example: {
      en: 'Two gas stations on opposite corners both charge high prices and earn $10,000/day. However, slashing price to low steals all customers ($15,000). Both stations slash price; both earn only $4,000/day. Defecting is dominant, trapping both in low profits.',
      zh: '十字路口对面的两家加油站原本都定高油价，各自每日赚 1 万美元。但只要有一家率先降价偷跑就能抢走全部客流赚 1.5 万。结果两家都降价，每天各自仅赚 4000 美元，双双落入低利陷阱。'
    },
    examTip: {
      en: 'To prove a game is a Prisoners Dilemma on the AP exam: (1) Both players must have a dominant strategy to defect, (2) The resulting Nash equilibrium is strictly worse for both than the collusive cooperative outcome.',
      zh: '在 AP 考卷中证明某矩阵为“囚徒困境”的必备两步：（1）双方各自拥有背叛偷跑的绝对占优策略；（2）所得的纳什均衡收益双双差于双方携手合作的收益。'
    },
    keyCharacteristics: [
      { en: 'Individual rationality leads directly to collective irrationality', zh: '个体理性追求利益最大化导致了集体非理性的悲剧下场' },
      { en: 'Illustrates why cartels collapse without enforceable punishment mechanisms', zh: '深刻解释了缺乏强力惩罚机制时行业合谋为何必然破裂' }
    ],
    relatedConcepts: [
      { termId: 'term-nash-equilibrium', labelEn: 'Nash Equilibrium (NE)', labelZh: '纳什均衡', relationEn: 'The suboptimal outcome produced by the dilemma', relationZh: '囚徒困境所不可避免滑向的次优博弈落脚点' },
      { termId: 'term-dominant-strategy', labelEn: 'Dominant Strategy', labelZh: '占优策略', relationEn: 'The defecting strategy that creates the dilemma', relationZh: '导致困境产生的根源性单方理性背叛策略' }
    ],
    linkedModelId: 'oligopoly-game-theory'
  },
  {
    id: 'term-herfindahl-index',
    abbreviation: 'HHI',
    aliases: ['Herfindahl-Hirschman Index', 'HHI', '赫芬达尔指数', 'Market Concentration HHI'],
    en: 'Herfindahl-Hirschman Index (HHI)',
    zh: '赫芬达尔-赫希曼指数（HHI）',
    unit: 4,
    topicCode: '4.4',
    category: 'structure',
    definition: {
      en: 'A standard regulatory measure of market concentration and industry competitiveness, calculated by squaring the individual percentage market share of every firm in the market and summing the squares. Values range from near 0 (perfect competition) to 10,000 (pure single-firm monopoly). Regulatory authorities (FTC/DOJ) scrutinize mergers that cause significant HHI increases.',
      zh: '司法反垄断机构与监管部门用于度量行业市场集中度与垄断强度的权威指标。计算方法为：将行业内所有企业的百分比市场份额各自平方后累加求和。数值范围介于接近 0（完全竞争）至 10000（独家纯垄断，100^2）。反垄断法严密审查会引发 HHI 剧烈跃升的企业兼并案。'
    },
    formula: 'HHI = s_1^2 + s_2^2 + s_3^2 + ... + s_n^2 (where s_i is percentage market share, e.g. 40% -> 40^2 = 1600)',
    example: {
      en: 'An industry has 4 firms with market shares of 40%, 30%, 20%, and 10%. HHI = 40^2 + 30^2 + 20^2 + 10^2 = 1600 + 900 + 400 + 100 = 3,000 (Highly Concentrated).',
      zh: '某行业共有 4 家厂商，份额分别为 40%、30%、20% 和 10%。HHI = 40^2 + 30^2 + 20^2 + 10^2 = 1600 + 900 + 400 + 100 = 3000（属于高度集中垄断型行业）。'
    },
    examTip: {
      en: 'Notice that HHI uses SQUARES of market share, which heavily penalizes large dominant firms. Standard antitrust guidelines: HHI < 1,500 is unconcentrated/competitive; 1,500 to 2,500 is moderately concentrated; HHI > 2,500 is highly concentrated.',
      zh: '注意 HHI 采用市场份额的“平方”，这意味着巨无霸龙头厂商的权重会被极度放大。标准划分：HHI < 1500 为充分竞争；1500~2500 为中度集中；HHI > 2500 为高度集中寡头。'
    },
    keyCharacteristics: [
      { en: 'Pure monopoly has a maximum possible HHI score of 10,000 (100^2)', zh: '纯独家垄断的理论最高 HHI 极限满分为 10000（100^2）' },
      { en: 'More sensitive to market dominance than simple four-firm concentration ratios', zh: '相比简单的四厂商集中度，对巨头支配地位具备更高的加权敏感度' }
    ],
    relatedConcepts: [
      { termId: 'term-concentration-ratio', labelEn: 'Four-Firm Concentration Ratio (CR4)', labelZh: '四厂商集中度', relationEn: 'Simpler cumulative concentration metric alongside HHI', relationZh: '与 HHI 并列使用的更简易累加型市场集中度指标' },
      { termId: 'term-monopoly-single-price', labelEn: 'Single-Price Monopoly', labelZh: '单一定价垄断', relationEn: 'Market structure corresponding to HHI = 10,000', relationZh: '对应 HHI = 10000 极值上限的单一垄断结构' }
    ]
  },
  {
    id: 'term-concentration-ratio',
    abbreviation: 'CR4 / CR8',
    aliases: ['Four-Firm Concentration Ratio', 'CR4', '四厂商集中度', 'CR8'],
    en: 'Four-Firm Concentration Ratio (CR4)',
    zh: '四厂商行业集中度（CR4）',
    unit: 4,
    topicCode: '4.4',
    category: 'structure',
    definition: {
      en: 'The fraction of total industry sales or market share accounted for by the four largest firms in that industry. Expressed as a percentage from 0% to 100%. An industry with a CR4 above 40% is generally classified as an Oligopoly; below 40% typically indicates Monopolistic Competition or Perfect Competition.',
      zh: '某行业中排名前四位的最大厂商所共同占有的市场总销售额或市场份额百分比总和。取值范围为 0% 至 100%。经济学通常以 CR4 超过 40% 作为判断该行业是否属于寡头垄断（Oligopoly）的核心分水岭指标。'
    },
    formula: 'CR4 = Share_1 + Share_2 + Share_3 + Share_4',
    example: {
      en: 'In the domestic breakfast cereal industry, Kellogg, General Mills, Post, and Quaker hold 30%, 28%, 18%, and 12% of sales. CR4 = 30 + 28 + 18 + 12 = 88%, confirming a tightly concentrated Oligopoly.',
      zh: '在早餐即食麦片行业中，家乐氏、通用磨坊、宝氏和桂格分别占据 30%、28%、18% 和 12% 份额。CR4 = 30 + 28 + 18 + 12 = 88%，确认为高度集中的寡头市场。'
    },
    examTip: {
      en: 'CR4 weakness on exams: It ignores the distribution among the top four (e.g. 70%, 1%, 1%, 1% gives the same CR4 of 73% as 18%, 18%, 18%, 19%). This is why economists prefer the HHI for merger analysis.',
      zh: 'CR4 的缺陷考点：它忽略了前四强内部的分布结构（例如 70%, 1%, 1%, 1% 与 18%, 18%, 18%, 19% 的 CR4 都是 73%）。这也是反垄断机构更倾向使用 HHI 指数的原因。'
    },
    keyCharacteristics: [
      { en: 'CR4 > 40% signals an Oligopoly with significant market interdependence', zh: 'CR4 > 40% 是判定寡头垄断及决策相互依存的重要风向标' },
      { en: 'CR4 near 0% reflects highly fragmented competitive market structures', zh: 'CR4 接近 0% 反映高度分散竞争的市场形态' }
    ],
    relatedConcepts: [
      { termId: 'term-herfindahl-index', labelEn: 'Herfindahl-Hirschman Index (HHI)', labelZh: '赫芬达尔指数', relationEn: 'Squared concentration metric resolving CR4 distribution weaknesses', relationZh: '弥补了 CR4 结构分布缺陷的加权平方集中度指标' },
      { termId: 'term-oligopoly-game-theory', labelEn: 'Oligopoly & Game Theory', labelZh: '寡头与博弈论', relationEn: 'Market structure identified when CR4 exceeds 40%', relationZh: '当 CR4 超过 40% 时所对应的核心博弈市场形态' }
    ],
    linkedModelId: 'oligopoly-game-theory'
  },
  // ==========================================
  // EXPANDED UNIT 5: Factor Markets & Resource Employment Rules
  // ==========================================
  {
    id: 'term-derived-demand',
    abbreviation: 'Derived Demand',
    aliases: ['Derived Factor Demand', '派生需求', 'Indirect Factor Demand'],
    en: 'Derived Demand for Factors',
    zh: '要素的派生需求（引致需求）',
    unit: 5,
    topicCode: '5.1',
    category: 'factor',
    definition: {
      en: 'The economic principle that the demand for any factor of production (e.g., labor, capital, raw materials) is not desired for its own sake, but is directly DERIVED from consumer demand for the final goods and services that the factor helps produce.',
      zh: '要素市场核心规律：对任何生产要素（劳动力、资本、原材料）的市场需求并非来自要素自身的直接消费，而是完全由下游终端消费者对该要素所制造出的最终产品与服务的市场需求所“派生”推导出来的。'
    },
    formula: 'Consumer Demand for Output Q ↑ -> Product Price P ↑ -> MRP_L (MP_L × P) ↑ -> Firm Demand for Labor Shifts Right',
    example: {
      en: 'A sudden nationwide boom in electric vehicles (EVs) causes the market demand for lithium-ion battery chemical engineers to skyrocket. Engineering firms raise wage offers and hire aggressively.',
      zh: '全国新能源汽车（EV）消费出现爆发式增长，直接推升了市场对锂电池研发工程师的劳动力派生需求，各大车企纷纷开出高薪抢夺电池技术人才。'
    },
    examTip: {
      en: 'If consumer demand for a final product drops, the product price P falls, which causes Marginal Revenue Product (MRP = MP × P) to fall, shifting the firm demand curve for labor to the LEFT!',
      zh: '如果最终消费品需求遇冷，产品单价 P 下跌，将直接导致边际收益产品（MRP = MP × P）缩水，进而使厂商对劳动力的需求曲线向“左”平移！'
    },
    keyCharacteristics: [
      { en: 'Direct causal link: Final product market directly dictates factor employment demand', zh: '因果链条：最终商品市场的冷暖直接左右要素市场的雇用需求' },
      { en: 'Firms factor demand curve is its Marginal Revenue Product (MRP) curve', zh: '厂商对生产要素的需求曲线即为其边际收益产品（MRP）曲线' }
    ],
    relatedConcepts: [
      { termId: 'term-mrp', labelEn: 'Marginal Revenue Product (MRP)', labelZh: '边际收益产品', relationEn: 'The mathematical expression of derived factor demand: MRP = MP × MR', relationZh: '派生需求的直接数学量化曲线：MRP = MP × MR' },
      { termId: 'term-factors-of-production', labelEn: 'Factors of Production (FOP)', labelZh: '生产要素', relationEn: 'Inputs whose market demand is governed by the derived demand principle', relationZh: '其需求受派生需求规律支配的生产要素' }
    ],
    linkedModelId: 'factor-market-competitive'
  },
  {
    id: 'term-mrc',
    abbreviation: 'MRC / MFC',
    aliases: ['Marginal Resource Cost', 'MRC', '边际资源成本', 'MFC'],
    en: 'Marginal Resource Cost (MRC)',
    zh: '边际资源成本（MRC / MFC）',
    unit: 5,
    topicCode: '5.1',
    category: 'factor',
    definition: {
      en: 'The additional cost incurred by a firm when hiring or employing one more unit of a variable productive resource (e.g., labor). An interchangeable AP term for Marginal Factor Cost (MFC). In a perfectly competitive labor market, the firm is a wage-taker, so MRC = MFC = Market Wage (horizontal line).',
      zh: '厂商每额外多雇佣或采购一单位变动生产要素（如工人）所招致的新增总成本开销。在 AP 微观经济学考纲中与边际要素成本（MFC）完全等价互用。在完全竞争劳动力市场中，厂商是工资的被动接受者，故 MRC = MFC = 市场固定工资率 W（水平线）。'
    },
    formula: 'MRC = ΔTotal Resource Cost / ΔQuantity of Resource = ΔTRC / ΔL',
    example: {
      en: 'In a competitive city labor market where the going market wage for warehouse workers is $20/hour, every additional worker hired adds exactly $20/hour to firm payroll. MRC is flat at $20.',
      zh: '在某完全竞争城市劳务市场上，仓储搬运工的市场通行时薪为 20 美元。物流公司每多招录一名搬运工，其时薪账单恰好新增 20 美元，MRC 是一条 20 美元的平直水平线。'
    },
    examTip: {
      en: 'Do not confuse MRC with MC! MC is the marginal cost of producing one more unit of OUTPUT (goods). MRC (or MFC) is the marginal cost of employing one more unit of INPUT (workers).',
      zh: '切勿混淆 MRC 与 MC！MC 是多制造一单位“最终产出（商品）”的边际成本；而 MRC（或 MFC）是多雇用一单位“生产要素（工人）”所增加的边际要素开支。'
    },
    keyCharacteristics: [
      { en: 'Identical to Marginal Factor Cost (MFC) across all AP scoring rubrics', zh: '在所有 AP 官方评分标准中与 MFC 完全等价互换' },
      { en: 'Horizontal in competitive labor markets; upward-sloping and steeper than supply in monopsonies', zh: '在完全竞争中为水平线；在买方垄断中向右上方倾斜且陡峭于劳动供给线' }
    ],
    relatedConcepts: [
      { termId: 'term-mfc', labelEn: 'Marginal Factor Cost (MFC)', labelZh: '边际要素成本', relationEn: 'Direct equivalent synonym in factor market theory', relationZh: '要素市场理论中的完全同义词' },
      { termId: 'term-mrp', labelEn: 'Marginal Revenue Product (MRP)', labelZh: '边际收益产品', relationEn: 'Equated with MRC (MRP = MRC) to determine profit-maximizing hiring', relationZh: '与 MRC 相交以决定厂商利润最大化雇佣人数' }
    ],
    linkedModelId: 'factor-market-competitive'
  },
  {
    id: 'term-vmp',
    abbreviation: 'VMP / VMPL',
    aliases: ['Value of Marginal Product', 'VMP', '边际产出价值', 'VMPL'],
    en: 'Value of Marginal Product of Labor (VMP / VMPL)',
    zh: '边际产出价值（VMP / VMPL）',
    unit: 5,
    topicCode: '5.2',
    category: 'factor',
    definition: {
      en: 'The dollar market value of the additional physical output produced by hiring one more worker, calculated as Marginal Product multiplied by product Price (VMP = MP_L × P). In perfectly competitive output markets (where P = MR), VMP is IDENTICAL to MRP. In imperfect output markets (where P > MR), VMP is GREATER than MRP.',
      zh: '额外追加雇佣一名工人所带来的新增实物产出在市场上的实际货币公允价值，计算方法为劳动边际产出乘以产品市价（VMP = MP_L × P）。在完全竞争产品市场中（P = MR），VMP 与 MRP 完全等同重合；在不完全竞争（垄断/寡头）产品市场中（P > MR），VMP 严格大于 MRP。'
    },
    formula: 'VMP_L = MP_L × Price ; In Perfect Comp: VMP = MRP ; In Imperfect Comp: VMP > MRP',
    example: {
      en: 'An extra worker picks 10 boxes of strawberries per hour (MP=10), selling at $4/box. VMP is 10 × $4 = $40/hour. If the farm is a price-taker, MRP is also $40/hour.',
      zh: '某草莓采摘工每小时多采摘 10 盒草莓（MP = 10），草莓市价 4 美元/盒。该工人的边际产出价值 VMP = 10 × 4 = 40 美元/小时。若草莓园处于完全竞争，其 MRP 亦恰好为 40 美元/小时。'
    },
    examTip: {
      en: 'AP Exam Distinction: When a monopoly hires workers, MRP falls faster than VMP because the monopoly must lower product price on all previous units to sell additional output (MR < P). Thus, monopolies hire fewer workers than is socially optimal.',
      zh: 'AP 高阶考点：垄断厂商雇用员工时，MRP 下跌速度快于 VMP，因为垄断厂商多卖产品必须整体降价（MR < P）。因此垄断企业雇用的工人数量往往少于社会最优水平。'
    },
    keyCharacteristics: [
      { en: 'Measures the social value of the workers output to consumers', zh: '衡量该工人所制造的产出对全社会消费者的真实价值' },
      { en: 'Identical to MRP under perfectly competitive product market assumptions', zh: '在产品市场完全竞争假定下与 MRP 完全重合' }
    ],
    relatedConcepts: [
      { termId: 'term-mrp', labelEn: 'Marginal Revenue Product (MRP)', labelZh: '边际收益产品', relationEn: 'Private revenue benefit to firm (MRP = MP × MR), compared to social value VMP', relationZh: '厂商私有收益指标（MRP = MP × MR），与社会价值 VMP 相对照' },
      { termId: 'term-marginal-product-labor', labelEn: 'Marginal Product of Labor (MP / MPL)', labelZh: '劳动力边际产出', relationEn: 'Physical productivity component in VMP calculation', relationZh: 'VMP 计算中表征实际实物生产率的核心分量' }
    ],
    linkedModelId: 'factor-market-competitive'
  },
  {
    id: 'term-mpp',
    abbreviation: 'MPP',
    aliases: ['Marginal Physical Product', 'MPP', '边际实物产出', 'Physical Product'],
    en: 'Marginal Physical Product (MPP)',
    zh: '边际实物产出（MPP）',
    unit: 5,
    topicCode: '5.1',
    category: 'factor',
    definition: {
      en: 'An alternative formal AP economic term for Marginal Product (MP). It measures the additional physical units of tangible goods or service transactions produced by adding one more unit of an input, before converting the output into monetary revenue.',
      zh: '在 AP 考纲中与边际产出（MP）完全等义的正式术语。专门强调在尚未将其换算为货币收入之前，每多投入一单位生产要素所实际多生产出的实物件数、吨数或服务频次。'
    },
    formula: 'MPP_L = ΔTotal Physical Output / ΔLabor = MP_L',
    example: {
      en: 'A textile mill adds one loom operator, increasing denim production from 500 meters to 650 meters per shift. The MPP of that operator is 150 physical meters of denim.',
      zh: '纺织厂增加一名织机操作工，使每班牛仔布产量由 500 米跃升至 650 米。该名工人的边际实物产出 MPP 即为 150 米牛仔布。'
    },
    examTip: {
      en: 'Whenever you see "MPP" on an AP exam question, read it as "MP". Multiply MPP by the product price (P) to get VMP, or by marginal revenue (MR) to get MRP.',
      zh: '在 AP 试卷中看到 "MPP"，直接将其视作 "MP" 即可。将 MPP 乘以产品单价即得 VMP，乘以边际收益即得 MRP。'
    },
    keyCharacteristics: [
      { en: 'Measured strictly in physical output units (bushels, widgets, hours), not dollars', zh: '严格以实物计量单位（件、吨、箱）计量，而非货币美元' },
      { en: 'Exhibits diminishing returns due to fixed capital constraints', zh: '受固定资本约束同样服从边际报酬递减规律' }
    ],
    relatedConcepts: [
      { termId: 'term-marginal-product-labor', labelEn: 'Marginal Product of Labor (MP / MPL)', labelZh: '劳动力边际产出', relationEn: 'Equivalent standard terminology in AP Microeconomics', relationZh: 'AP 微观经济学中的等同标准术语' },
      { termId: 'term-vmp', labelEn: 'Value of Marginal Product of Labor (VMP)', labelZh: '边际产出价值', relationEn: 'Monetary value derived by multiplying MPP by product price', relationZh: '将 MPP 乘以产品价格所得出的货币价值' }
    ],
    linkedModelId: 'production-function-tp-mp-ap'
  },
  {
    id: 'term-least-cost-rule',
    abbreviation: 'Least-Cost Rule',
    aliases: ['Cost Minimization Rule', '成本最小化要素组合', 'Least Cost Combination', 'Input Rule'],
    en: 'Least-Cost Rule / Cost-Minimization',
    zh: '成本最小化要素组合法则（等边际要素法则）',
    unit: 5,
    topicCode: '5.3',
    category: 'factor',
    definition: {
      en: 'The decision rule that dictates the cost-minimizing combination of productive inputs (such as Labor L and Capital K) for producing any chosen output level. The rule states: the marginal product per dollar spent must be equalized across all resource inputs: MP_L / P_L = MP_K / P_K.',
      zh: '指导厂商在生产既定产出水平时达成总成本最小化的最佳要素投入配比法则。法则规定：花费在每一种生产要素上的最后一美元所换取的边际产出必须全部相等，即：MP_L / P_L = MP_K / P_K（每美元劳动力边际产出 = 每美元资本边际产出）。'
    },
    formula: 'Cost-Minimizing Condition: (MP_Labor / Wage) = (MP_Capital / Rental Rate of Capital)',
    example: {
      en: 'A factory has MP_L = 20 with Wage = $10 (MP_L / P_L = 2). MP_K = 50 with Capital Rent = $50 (MP_K / P_K = 1). Since Labor gives 2 units/dollar and Capital gives only 1 unit/dollar, the firm should hire MORE Labor and LESS Capital until ratios equalize.',
      zh: '某工厂雇工 MP_L = 20，时薪 10 美元（每美元产出 = 2）；租用机器 MP_K = 50，租金 50 美元（每美元产出 = 1）。劳动力性价比显著高于机器，企业应多雇工人、少租机器，直至二者比值平衡相等。'
    },
    examTip: {
      en: 'If (MP_L / P_L) > (MP_K / P_K), the firm gets "more bang for the buck" from labor. It must hire MORE labor and LESS capital. As labor expands, MP_L falls (diminishing returns), restoring equilibrium equality!',
      zh: '若 (MP_L / P_L) > (MP_K / P_K)，说明劳动力更划算。企业必须增加用工并缩减机器租用。随着工人增多，根据边际报酬递减 MP_L 会回落，促使两边比率重归对等！'
    },
    keyCharacteristics: [
      { en: 'Direct analog of consumer utility-maximization rule (MU_X / P_X = MU_Y / P_Y)', zh: '消费者效用最大化等边际法则在生产端的完全对偶映射' },
      { en: 'Applies to any target output level to guarantee minimal total cost', zh: '适用于任何既定产出目标，确保达成生产成本底线' }
    ],
    relatedConcepts: [
      { termId: 'term-profit-max-input-rule', labelEn: 'Profit-Maximizing Input Employment Rule', labelZh: '要素利润最大化雇用原则', relationEn: 'More stringent condition requiring MP_L/P_L = MP_K/P_K = 1/MR', relationZh: '更为严苛的要素终极雇佣条件（不仅成本最小化，且产量最优）' },
      { termId: 'term-utility-max-rule', labelEn: 'Utility-Maximizing Rule', labelZh: '效用最大化法则', relationEn: 'Consumer theory identical mathematical counterpart', relationZh: '消费者效用理论在数学结构上的完全一致对应法则' }
    ]
  },
  {
    id: 'term-profit-max-input-rule',
    abbreviation: 'Profit-Max Input Rule',
    aliases: ['MRP = MFC Rule', '要素利润最大化雇用原则', 'Optimal Hiring Condition', 'MRP = MRC'],
    en: 'Profit-Maximizing Input Employment Rule',
    zh: '要素利润最大化雇用原则（MRP = MFC / MRC）',
    unit: 5,
    topicCode: '5.3',
    category: 'factor',
    definition: {
      en: 'The universal golden rule for hiring resource inputs to maximize firm economic profit: employ additional units of an input up to the exact point where its Marginal Revenue Product equals its Marginal Factor Cost (MRP = MFC, or MRP = MRC). Simultaneously for all inputs: (MRP_L / P_L) = (MRP_K / P_K) = 1.0.',
      zh: '指导企业雇佣生产要素以实现最终利润最大化的黄金准则：持续追加雇佣要素，直至该要素带来的边际收益产品恰好等于其边际要素成本（MRP = MFC，或 MRP = MRC）。同时对所有要素而言：(MRP_L / P_L) = (MRP_K / P_K) = 1.0。'
    },
    formula: 'Hire Labor until: MRP_L = MFC_L (or MRC_L) ; General Condition: (MRP_L / P_L) = (MRP_K / P_K) = 1',
    example: {
      en: 'A firm hires call center reps at a market wage of $18/hour (MFC = $18). The 4th rep generates $25/hour in added revenue (MRP=$25). The firm hires rep 4. The 5th rep generates $18/hour (MRP=$18). The firm stops at 5 reps.',
      zh: '某客服中心按市场时薪 18 美元招聘坐席（MFC = 18）。第 4 名客服每小时多创收 25 美元（MRP = 25，盈利可雇）；第 5 名客服每小时创收 18 美元（MRP = 18 = MFC），公司精准将编制锁定在 5 人。'
    },
    examTip: {
      en: 'AP Crucial Logic: Profit-maximization GUARANTEES cost-minimization! However, cost-minimization alone does NOT guarantee profit-maximization (a firm could be producing the wrong output level at lowest cost).',
      zh: 'AP 极高频逻辑考题：实现要素“利润最大化”必然自动满足“成本最小化”！但反过来，仅仅满足“成本最小化”绝不等于达成了“利润最大化”（可能在以极低成本生产错误的亏损产量）。'
    },
    keyCharacteristics: [
      { en: 'Determines the exact profit-maximizing number of workers hired', zh: '精准决定企业在劳动力市场上的最优招聘人数' },
      { en: 'If MRP > MFC, firm increases hiring; if MRP < MFC, firm cuts workers', zh: '若 MRP > MFC 则扩招；若 MRP < MFC 则必须裁员' }
    ],
    relatedConcepts: [
      { termId: 'term-mrp', labelEn: 'Marginal Revenue Product (MRP)', labelZh: '边际收益产品', relationEn: 'Benefit side of the hiring decision', relationZh: '要素雇佣决策中的边际收益端' },
      { termId: 'term-mfc', labelEn: 'Marginal Factor Cost (MFC)', labelZh: '边际要素成本', relationEn: 'Cost side of the hiring decision', relationZh: '要素雇佣决策中的边际成本端' },
      { termId: 'term-least-cost-rule', labelEn: 'Least-Cost Rule', labelZh: '成本最小化要素组合法则', relationEn: 'Necessary baseline condition subsumed within profit-maximization', relationZh: '包含在利润最大化准则之内的基础必要条件' }
    ],
    linkedModelId: 'factor-market-competitive'
  },
  {
    id: 'term-minimum-wage-monopsony',
    abbreviation: 'Min Wage in Monopsony',
    aliases: ['Minimum Wage Monopsony', '买方垄断下的最低工资', 'Monopsony Wage Regulation'],
    en: 'Minimum Wage Impact in Monopsony',
    zh: '买方垄断下的最低工资反常效应',
    unit: 5,
    topicCode: '5.2',
    category: 'factor',
    definition: {
      en: 'A striking microeconomic exception to standard competitive market predictions. In a monopsonistic labor market (single employer), establishing a binding minimum wage ABOVE the monopsony wage can SIMULTANEOUSLY INCREASE the wage rate AND INCREASE TOTAL EMPLOYMENT. The legal minimum wage turns the employer into a wage-taker up to the supply curve, eliminating the rising marginal factor cost penalty.',
      zh: '微观经济学中打破常规竞争预测的著名反直觉现象。在买方垄断（单一雇主）劳动力市场中，设定高于垄断剥削工资的法定最低工资，不仅能提高工人的到手薪资，还能同时反常地“增加”总就业人数！原因在于法定最低工资在劳动供给曲线左侧将边际要素成本（MFC）削平为一条水平线，消除了雇主因涨薪追加用工的惩罚性连带成本。'
    },
    formula: 'Set W_min between Monopsony Wage W_m and Competitive Wage W_c -> Wage ↑ AND Employment Q_L ↑',
    example: {
      en: 'A remote mining town has only 1 mine employing 300 miners at $12/hour. The state enacts an $18/hour minimum wage. Because MFC is flattened at $18, the mine expands employment from 300 to 450 miners, boosting both wages and jobs.',
      zh: '偏远矿业小镇只有 1 家独家矿企，以 12 美元低薪剥削雇佣 300 名矿工。州政府出台 18 美元法定最低工资。由于 MFC 被拉平在 18 美元水平线，矿企反常扩招至 450 人，工资与就业双双激增。'
    },
    examTip: {
      en: 'AP Exam Contrast: In a COMPETITIVE labor market, a minimum wage causes unemployment (surplus of labor). In a MONOPSONY labor market, an appropriately set minimum wage INCREASES employment and moves the market closer to allocative efficiency!',
      zh: 'AP 极经典反差考题：在“完全竞争”劳动力市场中，最低工资会导致失业增加；但在“买方垄断”市场中，适当设定的最低工资反而能“扩大就业”，使要素配置更接近社会最优！'
    },
    keyCharacteristics: [
      { en: 'Transforms upward-sloping MFC into a flat horizontal segment at the minimum wage', zh: '将原先陡峭上扬的 MFC 在最低工资水平处拉平成一段水平线' },
      { en: 'Removes the monopsonistic exploitation deadweight loss', zh: '显著消除买方垄断低薪少雇所造成的社会福利无谓损失' }
    ],
    relatedConcepts: [
      { termId: 'term-monopsony', labelEn: 'Monopsony in Factor Markets', labelZh: '要素市场的买方垄断', relationEn: 'Market structure where minimum wage exhibits employment-expanding properties', relationZh: '最低工资展现扩增就业特性的唯一垄断市场形态' },
      { termId: 'term-mfc', labelEn: 'Marginal Factor Cost (MFC)', labelZh: '边际要素成本', relationEn: 'Curve flattened by the statutory minimum wage', relationZh: '被法定最低工资切平消除陡峭惩罚的边际成本线' }
    ],
    linkedModelId: 'monopsony-factor-market'
  },
  // ==========================================
  // EXPANDED UNIT 6: Market Failure, Property Rights & Public Policy
  // ==========================================
  {
    id: 'term-rivalry-excludability',
    abbreviation: 'Rivalry & Excludability',
    aliases: ['Four Types of Goods', '四类物品划分矩阵', 'Excludability Matrix', 'Goods Classification'],
    en: 'Rivalry & Excludability Classification',
    zh: '物品的竞争性与排他性分类（四大物品矩阵）',
    unit: 6,
    topicCode: '6.1',
    category: 'externality',
    definition: {
      en: 'The standard two-dimensional economic matrix classifying all goods into four categories based on two characteristics: Excludability (can people be prevented from using the good without paying?) and Rivalry (does one persons consumption reduce the amount available for others?). Yields: (1) Private Goods, (2) Public Goods, (3) Common Resources, and (4) Club Goods.',
      zh: '经济学根据“排他性”（是否能够阻止未付费者使用）与“竞争性”（某人的使用是否会削减其他人可享用的数量）两大维度将世间一切物品划分为四大类别的权威矩阵：（1）私人物品，（2）纯公共物品，（3）共有资源，（4）俱乐部物品/人为稀缺品。'
    },
    formula: 'Matrix: [Excludable + Rival = Private] ; [Non-Excludable + Non-Rival = Public] ; [Non-Excludable + Rival = Common Resource] ; [Excludable + Non-Rival = Club Good]',
    example: {
      en: 'A slice of pizza is Excludable and Rival (Private Good). National defense is Non-excludable and Non-rival (Public Good). Ocean fish are Non-excludable and Rival (Common Resource). Netflix streaming is Excludable and Non-rival (Club Good).',
      zh: '披萨既排他又有竞争性（私人物品）；国防既非排他且非竞争（公共品）；公海野生金枪鱼非排他但具竞争性（共有资源）；奈飞流媒体订阅具排他性但非竞争（俱乐部物品）。'
    },
    examTip: {
      en: 'AP Exam Classic Matrix: Memorize all 4 quadrants! If a good is Non-Rival and Non-Excludable, it is a PUBLIC GOOD and requires vertical summation of individual demand curves (MSB).',
      zh: 'AP 必考分类矩阵：熟练背诵四象限！非排他且非竞争者为“纯公共物品”，其社会需求曲线（MSB）通过个人需求曲线的“垂直相加”得到。'
    },
    keyCharacteristics: [
      { en: 'Defines the structural boundary of market failure', zh: '界定自由市场机制能够有效配置资源的制度边界' },
      { en: 'Directly dictates whether private markets, government taxes, or public funding are required', zh: '直接决定该物品应依靠私有市场交易、政府税收补贴还是财政直接出资' }
    ],
    relatedConcepts: [
      { termId: 'term-public-goods', labelEn: 'Public Goods', labelZh: '公共物品', relationEn: 'Non-excludable and non-rival quadrant', relationZh: '非排他且非竞争的第一象限纯公共品' },
      { termId: 'term-common-resources', labelEn: 'Common Resources', labelZh: '共有资源', relationEn: 'Non-excludable and rival quadrant suffering from overuse', relationZh: '非排他但具竞争性、极易被过度消耗的象限' }
    ],
    linkedModelId: 'public-goods-provision'
  },
  {
    id: 'term-private-goods',
    abbreviation: 'Private Goods',
    aliases: ['Private Goods', '私人物品', 'Excludable and Rival'],
    en: 'Private Goods',
    zh: '私人物品（竞争且排他）',
    unit: 6,
    topicCode: '6.1',
    category: 'externality',
    definition: {
      en: 'Goods that are BOTH excludable and rival in consumption. Excludable: sellers can prevent people from consuming the good unless they pay the market price. Rival: one persons consumption of the good directly diminishes or precludes another persons ability to consume the exact same physical unit.',
      zh: '在消费上同时具备“排他性”与“竞争性”的绝大多数常规商品。排他性：卖家可以合法阻止任何未足额支付市价的人消费该商品；竞争性：某人对该具体实物的一旦消费，即直接消耗殆尽或剥夺了其他人消费该同一件实物的可能性。'
    },
    formula: 'Private Good = Excludable (price barrier) + Rivalrous (limited physical quantity)',
    example: {
      en: 'A winter jacket purchased at a department store: The cashier will not let you leave without paying (Excludable). Once you wear it, no one else can wear that exact same jacket at the same moment (Rival).',
      zh: '在商场专柜购买的羽绒服：收银台不付款绝不让你带走（排他性）；你一旦穿上走在街头，其他人绝不可能在同一瞬间穿上该同一件羽绒服（竞争性）。'
    },
    examTip: {
      en: 'Private goods are efficiently allocated by competitive private markets through price mechanisms (P = MC). Market failures arise primarily when goods deviate into non-excludability or non-rivalry.',
      zh: '私人物品可以通过完全竞争私有市场的价格机制（P = MC）自发实现最高效配置。市场失灵主要是由商品脱离了排他性或竞争性所引发的。'
    },
    keyCharacteristics: [
      { en: 'Price mechanism coordinates production and consumption efficiently', zh: '价格机制能够极其高效地自动协调生产与消费' },
      { en: 'Horizontal summation of individual demand curves forms market demand', zh: '个人需求曲线的水平加总构成整个市场的总需求曲线' }
    ],
    relatedConcepts: [
      { termId: 'term-public-goods', labelEn: 'Public Goods', labelZh: '公共物品', relationEn: 'The diametric opposite quadrant (non-excludable and non-rival)', relationZh: '处于对角线完全相反象限的公共品' },
      { termId: 'term-rivalry-excludability', labelEn: 'Rivalry & Excludability Classification', labelZh: '物品分类矩阵', relationEn: 'Matrix position defining private goods', relationZh: '界定私人物品的矩阵坐标象限' }
    ]
  },
  {
    id: 'term-common-resources',
    abbreviation: 'Common Resources',
    aliases: ['Common Pool Resources', '共有资源', 'Tragedy of Commons Goods', 'Rival Non-Excludable'],
    en: 'Common Resources & Common Pool Goods',
    zh: '共有资源（竞争但非排他）',
    unit: 6,
    topicCode: '6.1',
    category: 'externality',
    definition: {
      en: 'Goods that are RIVAL in consumption but NON-EXCLUDABLE. Rival: every unit harvested by one person reduces the amount left for everyone else. Non-Excludable: it is prohibitively costly or physically impossible to stop individuals from taking and consuming the resource for free. This combination inexorably causes overconsumption, leading to the Tragedy of the Commons.',
      zh: '在消费上具备“竞争性”但却“缺乏排他性”的自然生态资源。竞争性：任何一个人多打捞、多开采一单位，其他人可享用的储量就减少一分；非排他性：从技术或制度成本上几乎无法阻止外部人员免费进入掠夺。该特性必然诱发过度挥霍与枯竭，导向公地悲剧。'
    },
    formula: 'Common Resource = Rival (depletable) + Non-Excludable (open access) -> Overconsumption / Depletion',
    example: {
      en: 'Open international ocean fishing waters: Anyone with a boat can fish freely without paying a toll (Non-excludable). But every cod caught by one trawler is a cod another trawler cannot catch (Rival). Without quotas, fisheries collapse.',
      zh: '公海深海渔场：任何渔船均可公海航行下网且无需向任何人交费（非排他）；但一艘拖网渔船每捕捞一吨鳕鱼，其他渔船就少捕一吨（竞争性）。若无强制捕捞配额，渔业资源必遭毁灭性枯竭。'
    },
    examTip: {
      en: 'Because common resources are free to use (P = 0), private users ignore the marginal external cost they impose on future users. The free market oversupplies access and overdepletes the resource!',
      zh: '由于共有资源无门槛免费使用（私人成本为零），掠夺者完全无视自己给生态和后代强加的边际外部成本，导致自由市场放任其被严重过度消耗！'
    },
    keyCharacteristics: [
      { en: 'Susceptible to resource exhaustion without government property rights or tradable quotas', zh: '若无政府确权、排污权交易或捕捞限额配额，必将遭遇资源毁灭' },
      { en: 'Imposes negative consumption externalities on all fellow citizens', zh: '个人的开采行为向全体社会强加了负外部性' }
    ],
    relatedConcepts: [
      { termId: 'term-tragedy-of-the-commons', labelEn: 'Tragedy of the Commons', labelZh: '公地悲剧', relationEn: 'Direct market failure consequence of common pool resources', relationZh: '共有资源缺乏产权约束所必然遭遇的生态灾难' },
      { termId: 'term-rivalry-excludability', labelEn: 'Rivalry & Excludability Classification', labelZh: '物品分类矩阵', relationEn: 'Matrix quadrant where common resources reside', relationZh: '共有资源所归属的属性象限' }
    ]
  },
  {
    id: 'term-club-goods',
    abbreviation: 'Club Goods',
    aliases: ['Artificially Scarce Goods', '俱乐部物品', 'Toll Goods', 'Excludable Non-Rival'],
    en: 'Club Goods / Artificially Scarce Goods',
    zh: '俱乐部物品 / 人为稀缺品（排他但非竞争）',
    unit: 6,
    topicCode: '6.1',
    category: 'externality',
    definition: {
      en: 'Goods that are EXCLUDABLE but NON-RIVAL in consumption (up to the point of capacity congestion). Excludable: access can be blocked by paywalls, passwords, membership dues, or ticket turnstiles. Non-Rival: one person enjoying the service costs virtually zero in marginal cost and does not diminish anothers enjoyment.',
      zh: '在消费上具备“排他性”但“无竞争性”（在未达到拥堵极限之前）的特许服务。排他性：可以通过账号密码、付费墙、会员年费或闸机将未付款者拒之门外；非竞争性：在未满载时，多增加一人在线收看或通行所带来的边际成本几乎为零，且丝毫不影响现有用户的体验。'
    },
    formula: 'Club Good = Excludable (paywall / toll) + Non-Rival (MC ≈ 0 for extra user)',
    example: {
      en: 'A private satellite TV broadcast or subscription gym: Scrambled signals block non-subscribers (Excludable). But your watching the broadcast at home does not degrade your neighbors picture quality (Non-Rival).',
      zh: '付费卫星电视频道或会员制健身房：加密机顶盒阻断非付费用户（排他性）；你在家看球赛丝毫不会削弱隔壁邻居所接收到的超清画质（非竞争性）。'
    },
    examTip: {
      en: 'Because the marginal cost of an additional user is zero (MC = 0), charging any positive subscription price (P > 0) creates an "artificial scarcity" and causes deadweight loss (underconsumption by people who value it above MC but below price).',
      zh: '由于额外服务一名用户的边际成本为零（MC = 0），收取任何正会员价（P > 0）实际上都制造了“人为稀缺”，导致无谓损失（那些愿意支付大于零但小于会费的人被无端阻拦在外）。'
    },
    keyCharacteristics: [
      { en: 'Characterized by high fixed development costs and zero marginal distribution costs', zh: '前期固定搭建成本极高，而后续边际分发成本接近于零' },
      { en: 'Often regulated or provided as natural monopolies (e.g. cable networks)', zh: '常以自然垄断或公用管网形式存在（各有线宽带网络）' }
    ],
    relatedConcepts: [
      { termId: 'term-natural-monopoly', labelEn: 'Natural Monopoly', labelZh: '自然垄断', relationEn: 'Market structure that frequently produces and sells club goods', relationZh: '最常负责运营与分销俱乐部物品的市场结构' },
      { termId: 'term-rivalry-excludability', labelEn: 'Rivalry & Excludability Classification', labelZh: '物品分类矩阵', relationEn: 'Matrix quadrant for excludable non-rival assets', relationZh: '排他但非竞争资产所在的分类象限' }
    ]
  },
  {
    id: 'term-tragedy-of-the-commons',
    abbreviation: 'Tragedy of Commons',
    aliases: ['Tragedy of the Commons', '公地悲剧', 'Common Pool Depletion'],
    en: 'Tragedy of the Commons',
    zh: '公地悲剧（公共资源枯竭困境）',
    unit: 6,
    topicCode: '6.1',
    category: 'externality',
    definition: {
      en: 'A socio-economic dilemma where individual users, acting independently and rationally according to their own self-interest, behave contrary to the common good of all users by collectively depleting or spoiling a shared common-pool resource. The absence of well-defined property rights leads to catastrophic market failure.',
      zh: '个体自利行为导致集体毁灭的经典困境：当面临无产权边界的开放公共资源时，每个个体出于自身利益最大化的理性驱动竞相超额掠夺，最终不可避免地导致整个公共资源耗尽、损毁或彻底枯竭。缺乏清晰界定的法定私有产权是这一市场失灵的根源。'
    },
    formula: 'Open Access (Zero Price) -> Private Marginal Cost < Social Marginal Cost -> Severe Overuse / Extinction',
    example: {
      en: 'In medieval villages, shared common pasture was open to all herders for free. Each herder added cows to maximize individual milk sales. Overgrazing quickly stripped the pasture down to mud, starving all village cattle.',
      zh: '在中世纪英国乡村，公共草场向全体村民无偿开放放牧。每户牧民都尽可能多赶自家的牛去吃草以图自肥。结果草场迅速被啃成泥潭不毛之地，全村牛群集体饿死。'
    },
    examTip: {
      en: 'Three standard solutions to the Tragedy of the Commons on AP exams: (1) Assign private property rights, (2) Enforce tradable individual quotas (cap-and-trade), and (3) Levy Pigouvian user fees or taxes.',
      zh: 'AP 应对公地悲剧的 3 大标准政策解决方案：（1）确立明确的私有产权；（2）推行可交易的捕捞/开采配额制（限额与交易制度）；（3）开征庇古资源使用税。'
    },
    keyCharacteristics: [
      { en: 'Individual incentives are completely misaligned with social preservation', zh: '个体追逐私利的短期动力与全社会长期资源保护完全背道而驰' },
      { en: 'Direct consequence of missing property rights in common resources', zh: '共有资源缺乏产权界定所引发的必然灾难性恶果' }
    ],
    relatedConcepts: [
      { termId: 'term-common-resources', labelEn: 'Common Resources', labelZh: '共有资源', relationEn: 'The category of goods subject to this tragedy', relationZh: '遭受公地悲剧折磨的商品属性门类' },
      { termId: 'term-negative-externalities', labelEn: 'Negative Externalities', labelZh: '负外部性', relationEn: 'Each users overuse imposes negative external costs on everyone else', relationZh: '每个使用者的过度开采都向全社会强加了沉重的负外部性' }
    ],
    linkedModelId: 'negative-externalities'
  },
  {
    id: 'term-free-rider-problem',
    abbreviation: 'Free-Rider Problem',
    aliases: ['Free Rider', '搭便车难题', 'Free Riding Market Failure'],
    en: 'Free-Rider Problem',
    zh: '搭便车难题（公共品供给困境）',
    unit: 6,
    topicCode: '6.1',
    category: 'externality',
    definition: {
      en: 'A market failure that occurs when individuals enjoy the full benefits of a non-excludable good or public service without contributing their fair share to pay for its production. Because people realize they cannot be excluded once the good is provided, they withhold voluntary payments, causing private markets to severely UNDERPRODUCE or fail to produce public goods altogether.',
      zh: '纯公共物品非排他性所诱发的经典市场失灵难题：一旦某项公共设施被提供出来，非付费者在物理上无法被排除在外，所有人均可坐享其成。理性的个人因此隐藏其真实支付意愿、坐等他人出资而自己“搭便车”，导致若仅靠私有市场自愿众筹，公共物品将严重供给不足甚至彻底无人生产。'
    },
    formula: 'Non-Excludability -> Voluntary Payment = $0 -> Private Market Output Q = 0 -> Requires Government Tax Provision',
    example: {
      en: 'A private business attempts to build an ocean lighthouse by soliciting donations from cargo ships. Shipping lines refuse to pay, knowing the beacon light shines into the fog for everyone. The lighthouse cannot be financed privately and requires government tax funding.',
      zh: '商业机构试图靠向过往货轮募捐来修建海面灯塔。船东们心知肚明无论自己掏不掏钱灯塔的光芒都会刺破大雾普照海面，纷纷拒绝捐款。灯塔无法通过私有市场募资建成，只能由政府动用税收财政出资。'
    },
    examTip: {
      en: 'Why do governments use mandatory taxation to finance public goods? Because the free-rider problem prevents voluntary private markets from collecting adequate revenue to fund allocatively efficient provision!',
      zh: '为什么政府必须动用强制税收来出资建设纯公共物品？因为搭便车难题使得自愿私有市场根本无法筹集足额资金以达到社会最优的配置规模！'
    },
    keyCharacteristics: [
      { en: 'Direct symptom of the non-excludability characteristic', zh: '纯公共物品非排他性特征所引发的直接病灶' },
      { en: 'Justifies government intervention and compulsory taxation for public goods', zh: '为政府介入经济并以强制税收供给公共品提供了最强有力的经济学法理依据' }
    ],
    relatedConcepts: [
      { termId: 'term-public-goods', labelEn: 'Public Goods', labelZh: '公共物品', relationEn: 'The core asset class plagued by the free-rider market failure', relationZh: '受搭便车难题困扰最深的核心公共资产类别' },
      { termId: 'term-positive-externalities', labelEn: 'Positive Externalities', labelZh: '正外部性', relationEn: 'Free riding is an extreme case of massive uncompensated external benefits', relationZh: '搭便车本质上是极端巨幅未受补偿正外部性的集中体现' }
    ],
    linkedModelId: 'public-goods-provision'
  },
  {
    id: 'term-pigouvian-tax',
    abbreviation: 'Pigouvian Tax',
    aliases: ['Corrective Tax', '庇古税', 'Effluent Fee', 'Carbon Tax'],
    en: 'Pigouvian Tax',
    zh: '庇古税（矫正性税收）',
    unit: 6,
    topicCode: '6.2',
    category: 'welfare',
    definition: {
      en: 'A per-unit corrective tax levied on market activities that generate negative externalities (such as industrial carbon emissions or chemical pollution). To achieve full allocative efficiency, the per-unit tax must be set EXACTLY EQUAL to the Marginal External Cost (MEC) at the socially optimal output level, internalizing the externality and eliminating deadweight loss.',
      zh: '政府针对产生负外部性（如碳排放、工业排污、噪音污染）的市场活动所征收的每单位“矫正性税收”。若要达成完全的社会资源最优配置，每单位庇古税额必须“精确等于”社会最优产量处的边际外部成本（MEC），使私人边际成本上升并与边际社会成本重合（MPC + Tax = MSC），彻底消除死重损失。'
    },
    formula: 'Optimal Pigouvian Tax per Unit = Marginal External Cost (MEC) = MSC - MPC at Q_Social',
    example: {
      en: 'A coal power plant emits sulfur dioxide imposing $30/MWh in respiratory illness damages on nearby towns (MEC=$30). The state levies an exact $30/MWh pollution tax. The plant raises power prices, cuts output to socially optimal Q_social, and cleans emissions.',
      zh: '燃煤电厂每发 1 兆瓦时电即排放二氧化硫，给周边居民强加了 30 美元的呼吸道疾病医疗负担（MEC = 30）。政府对其精准开征每兆瓦时 30 美元庇古排污税，电厂电价上调、发电量收缩至社会最优规模，死重损失归零。'
    },
    examTip: {
      en: 'Crucial Difference from standard taxes: A standard tax on a competitive market CREATES deadweight loss. A Pigouvian tax on a negative externality ELIMINATES deadweight loss and restores allocative efficiency!',
      zh: '极核心对比考点：常规市场征税会“制造”无谓损失（扭曲正常交易）；但对负外部性开征庇古税却能“消除”无谓损失，使扭曲的市场回归资源配置最优！'
    },
    keyCharacteristics: [
      { en: 'Internalizes the external cost directly into the polluters private marginal cost ledger', zh: '将外部污染成本直接内部化到排污者的私人账面边际成本中' },
      { en: 'Raises government tax revenue while simultaneously enhancing total economic welfare', zh: '在增加政府财政税收的同时同步提升全社会总经济福利' }
    ],
    relatedConcepts: [
      { termId: 'term-negative-externalities', labelEn: 'Negative Externalities', labelZh: '负外部性', relationEn: 'Market failure remediated by the Pigouvian tax', relationZh: '由庇古税予以纠正与根治的负外部性市场失灵' },
      { termId: 'term-pigouvian-subsidy', labelEn: 'Pigouvian Subsidy', labelZh: '庇古补贴', relationEn: 'Counterpart corrective policy instrument for positive externalities', relationZh: '针对正外部性所设立的相反对应纠正政策工具' }
    ],
    linkedModelId: 'negative-externalities'
  },
  {
    id: 'term-pigouvian-subsidy',
    abbreviation: 'Pigouvian Subsidy',
    aliases: ['Corrective Subsidy', '庇古补贴', 'Positive Externality Subsidy'],
    en: 'Pigouvian Subsidy',
    zh: '庇古补贴（矫正性补贴）',
    unit: 6,
    topicCode: '6.2',
    category: 'welfare',
    definition: {
      en: 'A per-unit corrective payment provided by the government to buyers or sellers of goods that generate positive externalities (such as vaccinations, basic research, or education). To achieve allocative efficiency, the per-unit subsidy must be set EXACTLY EQUAL to the Marginal External Benefit (MEB) at the socially optimal output level, internalizing the positive spillover and expanding consumption to Q_Social.',
      zh: '政府向产生显著正外部性（如疫苗接种、高等教育、基础前沿科学研发）的商品买卖双方所发放的每单位“矫正性财政补贴”。为达到资源配置最优，单位补贴额必须“精确等于”社会最优产量处的边际外部收益（MEB），从而把未受补偿的外部社会溢出收益内部化，促使消费规模由私有市场的萎缩状态扩张至社会最优规模。'
    },
    formula: 'Optimal Pigouvian Subsidy per Unit = Marginal External Benefit (MEB) = MSB - MPB at Q_Social',
    example: {
      en: 'A flu shot costs $40 and provides $25 in herd immunity benefits to fellow coworkers (MEB=$25). The state subsidizes $25 per shot. Flu vaccine consumption expands from underproduced market Q_m to socially optimal Q_social.',
      zh: '流感疫苗每剂成本 40 美元，但接种后为周围同事筑起了价值 25 美元的群体免疫屏障（MEB = 25）。卫生部门每剂精准补贴 25 美元，疫苗接种率立即从市场自发萎缩规模跳升至社会最优规模。'
    },
    examTip: {
      en: 'Without a subsidy, goods with positive externalities are strictly UNDERPRODUCED by private markets (Q_Market < Q_Social). A Pigouvian subsidy shifts supply down (or demand up) to eliminate the deadweight loss of underproduction.',
      zh: '若无财政补贴，具备正外部性的商品在私有市场上必然“供给不足”（Q_Market < Q_Social）。庇古补贴通过压低供给曲线（或托高需求）彻底根除由于产出过少所造成的社会无谓损失。'
    },
    keyCharacteristics: [
      { en: 'Expands consumption of underprovided merit goods', zh: '扩增私有市场供应不足的优效品的消费与生产' },
      { en: 'Brings private market output up to the socially efficient benchmark', zh: '将市场自发交易量拉升至社会有效基准水平' }
    ],
    relatedConcepts: [
      { termId: 'term-positive-externalities', labelEn: 'Positive Externalities', labelZh: '正外部性', relationEn: 'Market failure corrected by Pigouvian subsidies', relationZh: '由庇古补贴予以纠偏与促进的正外部性市场失灵' },
      { termId: 'term-pigouvian-tax', labelEn: 'Pigouvian Tax', labelZh: '庇古税', relationEn: 'Opposite policy instrument for negative external spillovers', relationZh: '针对负向外部溢出成本所设立的相反政策工具' }
    ],
    linkedModelId: 'positive-externalities'
  },
  {
    id: 'term-coase-theorem',
    abbreviation: 'Coase Theorem',
    aliases: ['Coase Theorem', '科斯定理', 'Property Rights Bargaining', 'Private Externality Solution'],
    en: 'Coase Theorem',
    zh: '科斯定理（私人产权协商解）',
    unit: 6,
    topicCode: '6.2',
    category: 'externality',
    definition: {
      en: 'A foundational economic theorem developed by Nobel laureate Ronald Coase stating that private economic parties can negotiate and solve externality problems efficiently on their own WITHOUT direct government regulation or taxes, provided two strict preconditions are met: (1) Property rights are clearly assigned and legally enforced, and (2) Transaction costs of bargaining are negligible or zero.',
      zh: '诺贝尔经济学奖得主罗纳德·科斯创立的基石定理：在满足以下两大严苛先决条件的前提下，受外部性影响的私人当事方完全可以通过自愿协商达成帕累托最优配置，而“无需”任何政府行政干预、管制定价或额外征税：（1）法定产权界定清晰且受到严格法律保护；（2）各方谈判沟通的交易成本极低或接近于零。'
    },
    formula: 'Preconditions: Clear Property Rights + Zero/Low Transaction Costs -> Private Bargaining achieves Allocative Efficiency',
    example: {
      en: 'A chemical plant pollutes a lake owned by a resort hotel. If the hotel owns the lake, the plant pays the hotel $5,000 to accept treated runoff (compensating damages). If the plant owns the right to dump, the hotel pays the plant $5,000 to install filters. In both cases, the exact same efficient pollution level is reached!',
      zh: '化工厂向度假酒店所有的人工湖排污。若湖泊产权归酒店，化工厂出资 5000 美元向酒店购买排污容忍许可；若排污权归化工厂，酒店出资 5000 美元资助化工厂加装净化滤网。无论产权最初判给谁，最终达成的净化与排污规模完全相同且达社会最优！'
    },
    examTip: {
      en: 'AP Exam Nuance: While the initial assignment of property rights does NOT affect the final allocative efficiency outcome, it DOES dramatically affect the DISTRIBUTION OF INCOME and wealth between the parties!',
      zh: 'AP 极高频深度考点：尽管初始产权的归属裁决“不会影响最终资源配置效率”（效率中性），但它却会深刻改变博弈双方之间的“收入与财富分配格局”（拿产权者大赚，无产权者掏钱补偿）！'
    },
    keyCharacteristics: [
      { en: 'Initial property rights assignment has zero impact on the final efficient outcome', zh: '初始产权归属对最终达成社会有效规模毫无干扰' },
      { en: 'Breaks down when bargaining involves hundreds of scattered parties (high transaction costs)', zh: '当涉及成千上万受害者时（如跨国雾霾），因交易谈判成本过高而宣告失效' }
    ],
    relatedConcepts: [
      { termId: 'term-negative-externalities', labelEn: 'Negative Externalities', labelZh: '负外部性', relationEn: 'The market failure problem Coasean bargaining aims to solve privately', relationZh: '科斯私人协商旨在解决的典型负外部性市场失灵' },
      { termId: 'term-pigouvian-tax', labelEn: 'Pigouvian Tax', labelZh: '庇古税', relationEn: 'Government regulatory alternative when transaction costs preclude private bargaining', relationZh: '当交易成本过高无法私人谈判时政府出手的替代性税收方案' }
    ],
    linkedModelId: 'negative-externalities'
  },
  {
    id: 'term-tax-structures',
    abbreviation: 'Tax Structures',
    aliases: ['Progressive Tax', 'Proportional Tax', 'Regressive Tax', '税制结构', '累进税比例税累退税'],
    en: 'Progressive, Proportional & Regressive Taxes',
    zh: '累进税、比例税与累退税（三大税制结构）',
    unit: 6,
    topicCode: '6.4',
    category: 'welfare',
    definition: {
      en: 'The three fundamental classifications of tax equity based on how the Average Tax Rate (ATR = Total Taxes Paid / Total Income) behaves as taxpayer income rises. Progressive Tax: ATR increases as income rises (wealthy pay a higher percentage). Proportional Tax (Flat Tax): ATR remains constant across all income levels. Regressive Tax: ATR decreases as income rises (lower-income households pay a higher percentage of their total earnings).',
      zh: '财政学根据平均税率（ATR = 缴纳税额 / 个人总收入）随纳税人收入攀升时的变化轨迹而划分的三大税制。累进税：平均税率随收入增加而递增（富人缴纳更高百分比，如个人所得税阶梯税率）；比例税（平税）：平均税率在所有收入阶层恒定统一（如统一 15%）；累退税：平均税率随收入增加反而递减（低收入者所缴税款占其全部收入的比例显著更高，如销售税）。'
    },
    formula: 'Progressive: Income ↑ -> ATR ↑ ; Proportional: Income ↑ -> ATR constant ; Regressive: Income ↑ -> ATR ↓',
    example: {
      en: 'A retail sales tax of 8% on groceries is Regressive: A low-income family earning $20,000 spends 30% of income on food (pays $480 tax = 2.4% of income). A wealthy executive earning $500,000 spends 2% on food (pays $800 tax = 0.16% of income).',
      zh: '8% 的日常日用品销售税属于典型“累退税”：年入 2 万美元贫困家庭将 30% 收入用于糊口（缴税 480 美元，占其年收入 2.4%）；而年入 50 万美元高管仅花 2% 买日用品（缴税 800 美元，仅占其总收入 0.16%）。'
    },
    examTip: {
      en: 'Common Multiple Choice Trap: A flat sales tax of $1.00 per gallon of gasoline is REGRESSIVE because lower-income earners spend a much larger share of their total budget on fuel than billionaires.',
      zh: 'AP 选择题最经典的陷阱：每加仑汽油征收 1 美元的固定从量税是“累退税”！因为这 1 美元占贫困通勤者收入的比例，远远高于它占亿万富豪收入的比例。'
    },
    keyCharacteristics: [
      { en: 'Progressive taxation narrows income inequality and shifts the Lorenz curve inward', zh: '累进税能够平抑贫富分化、缩小基尼系数并将洛伦兹曲线推向平等线' },
      { en: 'Determined strictly by the trajectory of the AVERAGE tax rate, not total dollar amounts', zh: '判定依据严格取决于“平均税率”的百分比走势，绝非缴税的绝对美元总数' }
    ],
    relatedConcepts: [
      { termId: 'term-marginal-vs-average-tax-rate', labelEn: 'Marginal vs Average Tax Rate (MTR & ATR)', labelZh: '边际税率与平均税率', relationEn: 'The technical rate metrics used to define progressive tax brackets', relationZh: '用于精确界定累进税阶梯区间的技术性税率指标' },
      { termId: 'term-lorenz', labelEn: 'Lorenz Curve', labelZh: '洛伦兹曲线', relationEn: 'Curve shifted toward 45-degree line by progressive income redistribution', relationZh: '通过累进税二次分配被推向 45 度均等线的收入分布曲线' }
    ],
    linkedModelId: 'lorenz-curve-gini'
  },
  {
    id: 'term-marginal-vs-average-tax-rate',
    abbreviation: 'MTR & ATR',
    aliases: ['Marginal Tax Rate', 'Average Tax Rate', '边际税率与平均税率', 'MTR', 'ATR'],
    en: 'Marginal vs Average Tax Rate (MTR & ATR)',
    zh: '边际税率与平均税率（MTR 与 ATR）',
    unit: 6,
    topicCode: '6.4',
    category: 'welfare',
    definition: {
      en: 'The two critical metrics evaluating progressive income taxation. The Marginal Tax Rate (MTR) is the tax percentage applied strictly to the NEXT additional dollar of income earned (MTR = ΔTax / ΔIncome). The Average Tax Rate (ATR) is the total aggregate taxes paid divided by total taxable income earned (ATR = Total Tax / Total Income).',
      zh: '个人所得税与财政税制分析中不可混淆的两大关键度量指标。边际税率（MTR）专指纳税人每额外新多赚取的一美元收入所适用的最高跳档税率（MTR = Δ税额 / Δ收入）；平均税率（ATR）则是纳税人全年累计缴纳的税款总额除以其应纳税总收入（ATR = 总税额 / 总收入）。'
    },
    formula: 'MTR = ΔTaxes Paid / ΔTaxable Income ; ATR = Total Taxes Paid / Total Taxable Income ; In Progressive: MTR > ATR',
    example: {
      en: 'Tax brackets: 10% on first $50,000; 30% on income above $50,000. An earner making $70,000 pays: $5,000 (first bracket) + $6,000 (30% of $20,000) = $11,000 total tax. MTR is 30% (tax on next dollar). ATR is $11,000 / $70,000 = 15.7%.',
      zh: '阶梯税率：前 5 万美元按 10% 征税；超出部分按 30% 征税。年薪 7 万美元员工缴税：前段 5000 + 超额段 6000（2万×30%）= 11000 美元总税额。其边际税率 MTR 为 30%（下一块钱的税率）；而平均税率 ATR 仅为 11000 / 70000 = 15.7%。'
    },
    examTip: {
      en: 'In any progressive income tax bracket system, the Marginal Tax Rate (MTR) is ALWAYS GREATER than the Average Tax Rate (ATR) for all incomes above the initial bracket base! MTR dictates the economic incentive to work additional hours.',
      zh: '在任何累进阶梯税制中，超出首档起征点后，边际税率（MTR）永远“严格大于”平均税率（ATR）！真正左右劳动者是否愿意加班多干活的，是边际税率 MTR！'
    },
    keyCharacteristics: [
      { en: 'MTR governs marginal work-leisure tradeoffs and investment incentives', zh: 'MTR 直接决定劳动者加班还是休假的边际权衡与投资积极性' },
      { en: 'ATR determines the overall percentage tax burden on household income', zh: 'ATR 决定了该家庭被政府抽走财富的整体宏观税负比例' }
    ],
    relatedConcepts: [
      { termId: 'term-tax-structures', labelEn: 'Tax Structures', labelZh: '税制结构', relationEn: 'Classifications evaluated directly by the trend in Average Tax Rate', relationZh: '以平均税率演变趋势为核心裁决依据的税制大类' },
      { termId: 'term-gini', labelEn: 'Gini Coefficient', labelZh: '基尼系数', relationEn: 'Inequality index compressed when high MTR redistributes income', relationZh: '高边际税率推行转移支付后被显著压低平抑的基尼系数' }
    ],
    linkedModelId: 'lorenz-curve-gini'
  },
  {
    id: 'term-adverse-selection',
    abbreviation: 'Adverse Selection',
    aliases: ['Adverse Selection', '逆向选择', 'Lemons Problem', 'Hidden Characteristics'],
    en: 'Adverse Selection (Asymmetric Information)',
    zh: '逆向选择（事前信息不对称与劣币驱逐良币）',
    unit: 6,
    topicCode: '6.5',
    category: 'welfare',
    definition: {
      en: 'A market failure caused by asymmetric information existing BEFORE a transaction occurs (hidden characteristics). One party possesses private knowledge about product quality or risk that the other lacks. This information gap leads to an unrepresentative selection of poor-quality goods or high-risk participants dominating the market, potentially causing entire markets to collapse (the "Lemons Problem").',
      zh: '由交易发生“之前”存在的信息不对称（隐藏属性/隐藏信息）所诱发的恶性市场失灵。买卖某一方掌握着对方无法轻易查明的私有核心质量或健康隐患信息。这一信息差导致市场上聚集了不成比例的次品或最高风险人群，甚至导致良性参与者集体撤出而使整个市场崩溃瓦解（经典的“柠檬车/二手车次品市场”难题）。'
    },
    formula: 'Pre-contract Asymmetric Information -> High-risk buyers self-select -> Premiums spike -> Low-risk buyers exit -> Market unravels',
    example: {
      en: 'In private health insurance: Unhealthy individuals with hidden chronic illnesses aggressively buy comprehensive insurance, while healthy youths opt out. Insurers suffer heavy losses, hike premiums, driving away more healthy people until the risk pool collapses.',
      zh: '在商业医疗保险市场中：身患隐藏慢性疾病的极高危人群争先恐后购买重疾险，而身体强健的年轻人觉得不划算纷纷退保。险企赔付穿底被迫暴涨保费，逼走更多健康人，最终导致整个风险资金池彻底瓦解。'
    },
    examTip: {
      en: 'Time Sequence Distinction on Exams: Adverse Selection occurs BEFORE the contract is signed (hidden type/risk). Moral Hazard occurs AFTER the contract is signed (hidden action/behavior change)!',
      zh: 'AP 极关键时间序列考点：逆向选择发生在合同签订“之前”（隐藏类型/事前隐瞒风险）；道德风险发生在合同签订“之后”（隐藏行动/事后行为变懒变松懈）！'
    },
    keyCharacteristics: [
      { en: 'Pre-contractual hidden information problem', zh: '交易达成前的隐藏信息与事前筛选失真困境' },
      { en: 'Mitigated by mandatory universal coverage, medical screenings, and warranties', zh: '依靠强制全民全民医保、深度婚检体检以及质保条款予以化解' }
    ],
    relatedConcepts: [
      { termId: 'term-moral-hazard', labelEn: 'Moral Hazard', labelZh: '道德风险', relationEn: 'The post-contractual counterpart to adverse selection', relationZh: '发生在合同签订之后的对应姐妹信息不对称问题' },
      { termId: 'term-allocative-efficiency', labelEn: 'Allocative Efficiency', labelZh: '配置效率', relationEn: 'Market failure that destroys allocative efficiency in insurance markets', relationZh: '在信贷与保险市场中彻底摧毁资源最优配置的市场失灵' }
    ]
  },
  {
    id: 'term-moral-hazard',
    abbreviation: 'Moral Hazard',
    aliases: ['Moral Hazard', '道德风险', 'Hidden Actions', 'Post-Contract Risk'],
    en: 'Moral Hazard (Asymmetric Information)',
    zh: '道德风险（事后信息不对称与行为变异）',
    unit: 6,
    topicCode: '6.5',
    category: 'welfare',
    definition: {
      en: 'A market failure caused by asymmetric information existing AFTER a transaction occurs (hidden actions). Once an individual is protected from financial risk (e.g., through insurance, government bailouts, or contracts), they alter their behavior to take on GREATER RISKS or exercise LESS CAUTION, knowing the resulting costs will be borne by someone else.',
      zh: '由交易达成“之后”发生的信息不对称（隐藏行为/行为变异）所引发的市场失灵。一旦个体被免除了自身行为的财务风险敞口（如购买了全额盗抢险、或金融机构确信自己享有“大而不能倒”的政府财政兜底），其行为方式会发生剧烈恶化，变得更加肆无忌惮、冒险激进，因为闯祸的经济代价全由别人买单。'
    },
    formula: 'Post-contract Protection -> Marginal Cost of Careless Behavior Drops to Zero -> Risky/Careless Actions Increase',
    example: {
      en: 'A driver who purchases 100% zero-deductible comprehensive auto insurance parks carelessly in high-crime alleys and drives recklessly in blizzards, knowing the insurance company will pay 100% of any repair bill.',
      zh: '某车主购买了零免赔额的“全额全险”后，开始随意将车停放在治安恶劣的偏僻小巷，雨雪天肆意超速危险驾驶，因为反正是保险公司全额赔付维修账单。'
    },
    examTip: {
      en: 'How do insurance companies solve Moral Hazard? By using DEDUCTIBLES (copays) and coinsurance! Requiring the insured party to pay the first $500 out-of-pocket restores financial skin in the game and encourages caution.',
      zh: '保险公司如何破解道德风险？通过设置“自付额（Deductibles）”与共付比例！要求车主出险时必须自费承担前 500 美元维修费，重新迫使当事人拥有切身利益风险（Skin in the game），促使其谨慎防范。'
    },
    keyCharacteristics: [
      { en: 'Post-contractual hidden behavior problem', zh: '交易达成之后的隐藏行为与事后风险激增困境' },
      { en: 'Requires deductibles, copayments, and monitoring to align incentives', zh: '需要设置免赔额、自付比例和日常监督机制以对齐各方利益' }
    ],
    relatedConcepts: [
      { termId: 'term-adverse-selection', labelEn: 'Adverse Selection', labelZh: '逆向选择', relationEn: 'Pre-contractual counterpart to post-contractual moral hazard', relationZh: '与事后道德风险相对照的事前逆向选择' },
      { termId: 'term-allocative-efficiency', labelEn: 'Allocative Efficiency', labelZh: '配置效率', relationEn: 'Causes socially excessive resource allocation to reckless activities', relationZh: '导致社会过量稀缺资源被错误浪费在轻率冒险活动中' }
    ]
  },
  {
    id: 'term-network-externalities',
    abbreviation: 'Network Externality',
    aliases: ['Network Effects', '网络外部性', 'Network Goods', 'Demand-Side Economies of Scale'],
    en: 'Network Externalities',
    zh: '网络外部性（网络效应与平台规模效应）',
    unit: 6,
    topicCode: '6.2',
    category: 'structure',
    definition: {
      en: 'A positive consumption externality where the value, utility, or satisfaction that a consumer derives from using a good or platform INCREASES as the total number of other people using the same good expands. Generates strong self-reinforcing positive feedback loops and serves as a massive barrier to entry in tech and software industries.',
      zh: '一种强大的正向消费外部性现象：消费者从使用某一商品、通讯网络或平台软件中所获得的效用与满足感，直接随着使用该同一商品的其他用户总人数的扩张而呈指数级“倍增”。这一效应产生强烈的自我强化正向正反馈循环，是现代高科技与社交平台领域最坚不可摧的市场进入壁垒。'
    },
    formula: 'Utility to User_i = f(Product Quality) + g(Total User Base N) ; Value expands as N increases',
    example: {
      en: 'A social messaging app (e.g. WhatsApp, WeChat): If you are the only user in the world, the app is worth $0. If 2 billion people use it, the apps utility and value to you is enormous, making it virtually impossible for a new rival app to lure you away.',
      zh: '即时通讯社交软件（如微信、WhatsApp）：如果全世界只有你一人注册，该软件毫无价值（效用为零）；但若全网有 20 亿人在线，它对你的沟通价值巨大，新兴竞品哪怕技术再优秀也极难撼动这一网络生态。'
    },
    examTip: {
      en: 'Network externalities create "Winner-Take-All" markets. The firm that builds the initial critical mass of users establishes an insurmountable entry barrier, naturally resulting in an Oligopoly or pure Monopoly.',
      zh: '网络外部性极易催生“赢家通吃”（Winner-Take-All）格局。率先跨越临界用户规模的企业将筑起令后来者绝望的进入壁垒，往往直接演变为平台寡头或纯粹的自然网络垄断。'
    },
    keyCharacteristics: [
      { en: 'Positive consumption spillover benefits all other network participants', zh: '正向消费溢出使整个网络内的所有现有参与者共同获益' },
      { en: 'Forms a formidable demand-side barrier to entry for digital monopolies', zh: '构成现代数字与软件垄断企业在需求侧最坚实的高维进入壁垒' }
    ],
    relatedConcepts: [
      { termId: 'term-barriers-to-entry', labelEn: 'Barriers to Entry', labelZh: '市场进入壁垒', relationEn: 'Network effects are a primary structural entry barrier in modern technology', relationZh: '现代数字科技领域最主要的结构性高维进入壁垒' },
      { termId: 'term-positive-externalities', labelEn: 'Positive Externalities', labelZh: '正外部性', relationEn: 'Direct theoretical foundation of expanding network value', relationZh: '网络价值随用户数扩张而倍增的直接外部性理论基础' }
    ]
  },
  // ==========================================
  // FOUNDATIONAL MARKET STRUCTURES & EXTERNALITY ANCHORS
  // ==========================================
  {
    id: 'term-perfect-competition-side-by-side',
    abbreviation: 'Perfect Comp',
    aliases: ['Perfect Competition', '完全竞争市场', 'Price Taker Firm', 'Mr. DARP Market'],
    en: 'Perfect Competition (Market & Firm)',
    zh: '完全竞争市场（市场与单厂商并排模型）',
    unit: 3,
    topicCode: '3.7',
    category: 'structure',
    definition: {
      en: 'A theoretical market structure characterized by a very large number of small price-taking firms selling identical (standardized) products, completely free entry and exit in the long run, and perfect consumer information. The industry supply and demand intersection establishes the market equilibrium price, which the individual firm must accept as a flat, horizontal, perfectly elastic demand curve (P = MR = AR = D). In the long run, economic profit is driven to zero (P = min ATC), simultaneously achieving both productive and allocative efficiency.',
      zh: '由极大量规模微小的价格接受者厂商组成的基准竞争市场结构。特征包括：产品完全同质标准化、长期完全自由进出无壁垒、且信息完全对称。整个行业的供求曲线交点决定统一市场市价，单个厂商无定价权，只能被动接受一条完全水平的水平需求线（P = MR = AR = D）。在长期均衡中，新厂商自由进出迫使超额经济利润归零（P = min ATC），同时实现生产效率与配置效率。'
    },
    formula: 'Short Run: MR = MC ; Long Run Equilibrium: P = MR = MC = min ATC ; Economic Profit = 0',
    example: {
      en: 'Thousands of independent commercial wheat growers selling standardized Grade 1 hard red winter wheat on commodity exchanges: No single farmer can influence the market price by $0.01.',
      zh: '在农产品现货交易所交易标准化冬小麦的成千上万独立农户：没有任一农户具有影响哪怕 1 美分市价的能力，只能按大宗期货牌价接单。'
    },
    examTip: {
      en: 'Side-by-side graphs on AP FRQs: If market demand shifts right, price rises in the market, shifting the individual firms Mr. DARP line upward. Existing firms earn short-run economic profits, which attracts new firms to enter, shifting market supply right until price returns to min ATC!',
      zh: 'AP 大题必考并排图：若行业需求右移推高市价，单厂商水平需求线 Mr. DARP 上移获得短期超额利润；利润诱惑外部新厂商涌入，使行业供给右移，将市价重新打压回 min ATC，重归零经济利润长期均衡！'
    },
    keyCharacteristics: [
      { en: 'Only market structure achieving both productive efficiency (P = min ATC) and allocative efficiency (P = MC)', zh: '唯一同时达成生产效率（P = min ATC）与配置效率（P = MC）的理想市场形态' },
      { en: 'Individual firm is a pure price taker facing horizontal demand', zh: '单个厂商是纯粹的价格接受者，面临水平平直需求线' }
    ],
    relatedConcepts: [
      { termId: 'term-mr-darp', labelEn: 'Mr. DARP', labelZh: 'Mr. DARP 恒等线', relationEn: 'Horizontal demand identity curve facing a competitive firm', relationZh: '完全竞争个体厂商所面对的四合一水平需求恒等线' },
      { termId: 'term-allocative-efficiency', labelEn: 'Allocative Efficiency', labelZh: '配置效率', relationEn: 'Achieved in both short run and long run at P = MC', relationZh: '在短期与长期皆能于 P = MC 处达成的资源配置最优' }
    ],
    linkedModelId: 'perfect-competition-side-by-side'
  },
  {
    id: 'term-monopoly-single-price',
    abbreviation: 'Monopoly',
    aliases: ['Single-Price Monopoly', 'Pure Monopoly', '单一定价垄断', '独家垄断'],
    en: 'Single-Price Monopoly',
    zh: '单一定价纯垄断',
    unit: 4,
    topicCode: '4.2',
    category: 'structure',
    definition: {
      en: 'An imperfect market structure consisting of a single seller producing a unique product with no close substitutes, shielded by insurmountable barriers to entry. Because the monopoly is the entire industry, it faces the downward-sloping market demand curve. To sell more output, it must lower price on all units sold, causing its Marginal Revenue curve to lie strictly BELOW the Demand curve (MR < P). It maximizes profit where MR = MC, charges a markup price from the Demand curve (P > MC), underproduces, and creates deadweight loss.',
      zh: '由唯一一家独家销售无任何相近替代品商品的厂商所组成的不完全竞争市场形态，受坚不可摧的高进入壁垒严密保护。由于该单一厂商即代表整个行业，其直接面临向右下方倾斜的市场需求曲线。由于多售一件必须对所有在售单元降价，其边际收益曲线始终严格位于需求曲线下方（MR < P）。厂商依 MR = MC 确定产量，向需求曲线索取垄断高价（P > MC），产生人为限产与死重损失。'
    },
    formula: 'Output where MR = MC ; Price P read from Demand at Q_m ; P > MC (Allocative Inefficiency) ; P > min ATC',
    example: {
      en: 'A regional electric power utility with sole transmission grid ownership in a province: Consumers cannot switch to another grid provider and must pay the monopoly tariff or go without electricity.',
      zh: '在某省份独家拥有特高压输电管网的地方电力公司：居民无法切换至其他竞品电网，只能接受其垄断电价或选择断电。'
    },
    examTip: {
      en: 'AP Exam Rule: Never price at MR = MC! Read the output Q where MR = MC, then go straight UP to the Demand curve to find the monopoly price P. Monopolies produce less output and charge higher prices than competitive markets, creating DWL.',
      zh: 'AP 阅卷第一原则：绝不要在 MR = MC 处横向定价！在 MR = MC 处确定垄断产量 Q 后，必须笔直向上垂直投影至“需求曲线（Demand）”上读出垄断售价 P！垄断导致减产抬价与死重损失。'
    },
    keyCharacteristics: [
      { en: 'Single seller with complete market pricing power', zh: '市场上唯一的独家供给者，握有完全的自主定价权' },
      { en: 'Marginal revenue curve lies strictly below downward-sloping demand (MR < P)', zh: '边际收益曲线始终严格位于向右下方倾斜的需求曲线下方（MR < P）' }
    ],
    relatedConcepts: [
      { termId: 'term-barriers-to-entry', labelEn: 'Barriers to Entry', labelZh: '市场进入壁垒', relationEn: 'Shield that preserves monopoly power in the long run', relationZh: '长期守护独家垄断势力不被侵蚀的防护壁垒' },
      { termId: 'term-fair-return-price', labelEn: 'Fair-Return Price (P = ATC)', labelZh: '公平回报规制定价', relationEn: 'Regulatory ceiling used to control single-price monopolies', relationZh: '反垄断监管部门用于规制单一定价垄断的法定价格上限' }
    ],
    linkedModelId: 'monopoly-single-price'
  },
  {
    id: 'term-monopoly-price-discrimination',
    abbreviation: 'Price Discrimination Model',
    aliases: ['Price Discrimination', '价格歧视模型', 'Monopoly Price Discrimination', 'CS Conversion'],
    en: 'Price-Discriminating Monopoly',
    zh: '实行价格歧视的垄断模型',
    unit: 4,
    topicCode: '4.3',
    category: 'structure',
    definition: {
      en: 'The economic model of a monopoly firm that sells identical goods to different buyers at different prices when price differences are not driven by cost differences. When a monopoly can perfectly discriminate (first-degree), it sells every unit for each buyers maximum willingness to pay: the Marginal Revenue curve merges into the Demand curve, Consumer Surplus becomes zero, economic profit equals total market surplus, and output expands to the competitive allocatively efficient level with zero deadweight loss.',
      zh: '垄断厂商在商品生产成本完全相同的条件下，对不同消费者或不同购买量索取不同价格的经济学模型。当厂商能够实施完全价格歧视（一级歧视）时，其按每位买家的保留价格逐一收费：边际收益曲线与需求曲线合二为一，消费者剩余被完全吞并为零，全部社会福利化为厂商超额利润，且产量扩张至与完全竞争相等的社会最优规模，死重损失降为零。'
    },
    formula: 'Perfect Discrimination: MR = Demand ; Output where Demand = MC ; CS = 0 ; DWL = 0 ; Profit = Total Surplus',
    example: {
      en: 'An airline utilizing dynamic algorithmic pricing: Business travelers booking 2 days prior pay $900; vacationers booking 3 months ahead pay $220 for identical economy seats, capturing almost all consumer surplus.',
      zh: '采用大数据动态调价算法的航空公司：提前 2 天紧急出差的商务客全价支付 900 美元；提前 3 个月度假的大学生支付 220 美元乘坐同排经济舱，几乎将全舱消费者剩余吃干抹净。'
    },
    examTip: {
      en: 'Key AP Insight: Price discrimination is bad for consumers (consumer surplus is wiped out), but GOOD for total economic efficiency (output expands and deadweight loss is eliminated)!',
      zh: 'AP 核心洞察：价格歧视对消费者而言极度不利（消费者剩余被搜刮一空），但对社会整体配置效率而言却是“有益的”（产量扩大且消除了无谓损失）！'
    },
    keyCharacteristics: [
      { en: 'Converts consumer surplus into economic profit', zh: '将原属消费者的剩余彻底转化为厂商的暴利' },
      { en: 'Expands output beyond single-price monopoly production', zh: '打破单一定价垄断的限产约束，推动产量大幅扩张' }
    ],
    relatedConcepts: [
      { termId: 'term-first-degree-price-discrimination', labelEn: 'First-Degree Price Discrimination', labelZh: '完全价格歧视', relationEn: 'Theoretical foundation of the perfectly discriminating model', relationZh: '完全价格歧视模型的理论微观基石' },
      { termId: 'term-monopoly-single-price', labelEn: 'Single-Price Monopoly', labelZh: '单一定价纯垄断', relationEn: 'Baseline non-discriminating monopoly benchmark', relationZh: '不实施价格歧视的基准单一定价垄断形态' }
    ],
    linkedModelId: 'monopoly-price-discrimination'
  },
  {
    id: 'term-monopolistic-competition',
    abbreviation: 'Monopolistic Comp',
    aliases: ['Monopolistic Competition', '垄断竞争市场', 'Differentiated Products', 'Excess Capacity Market'],
    en: 'Monopolistic Competition',
    zh: '垄断竞争市场（差异化产品竞争）',
    unit: 4,
    topicCode: '4.6',
    category: 'structure',
    definition: {
      en: 'A highly common real-world market structure combining elements of both monopoly and perfect competition: a large number of independent small-to-medium sellers, completely free entry and exit in the long run, and DIFFERENTIATED products (via branding, design, quality, or customer service). Because products are non-identical, each firm faces a downward-sloping demand curve and has slight pricing power. In the long run, entry of new brand rivals shifts demand leftward until it is tangent to ATC, yielding zero economic profit and permanent Excess Capacity.',
      zh: '兼具垄断与完全竞争特性的极常见现代市场形态：存在大量中小独立厂商、长期自由进出无壁垒、且各厂商销售的商品存在“差异化”（通过品牌形象、外观设计、包装品质或售后服务实现差异）。因产品各具特色，单个厂商面临向右下方微斜的需求线并享有微弱定价权。在长期均衡中，新品牌竞争者涌入使既有厂商需求左移直至与 ATC 曲线相切，超额利润归零且长期遗留“超额生产能力（Excess Capacity）”。'
    },
    formula: 'Short Run: MR = MC (Profit or Loss) ; Long Run: Demand Tangent to ATC ; P = ATC ; Economic Profit = 0 ; P > min ATC (Excess Capacity)',
    example: {
      en: 'Local neighborhood coffee shops and casual dining bistros: Starbucks, local roasters, and Italian cafes all sell coffee, but each differentiates by roast flavor, interior ambience, and loyalty apps.',
      zh: '城市街角的精品咖啡馆与轻食餐馆：星巴克、本土烘焙小店与意式餐厅都卖咖啡，但各自依靠特色烘焙风味、店面装潢情调与会员权益吸引差异化拥趸。'
    },
    examTip: {
      en: 'Why is monopolistic competition NOT productively efficient in the long run? Because the downward-sloping demand curve touches ATC on its DOWNWARD-SLOPING segment, to the left of minimum ATC! The gap between actual output and min ATC output is EXCESS CAPACITY.',
      zh: '为什么垄断竞争在长期达不到生产效率？因为向右下方倾斜的需求线只能与 ATC 的“下行段”相切，永远处于最低 ATC 的左侧！实际产量与最低 ATC 对应产量之间的产能缺口，即为“超额生产能力（Excess Capacity）”。'
    },
    keyCharacteristics: [
      { en: 'Relies heavily on non-price competition (advertising, branding, packaging)', zh: '极度倚重广告宣传、品牌包装等非价格竞争手段' },
      { en: 'Long-run zero economic profit but persistent excess capacity', zh: '长期实现零经济利润，但伴生永久性的超额生产能力闲置' }
    ],
    relatedConcepts: [
      { termId: 'term-excess-capacity', labelEn: 'Excess Capacity', labelZh: '超额生产能力', relationEn: 'Defining long-run structural inefficiency of monopolistic competition', relationZh: '垄断竞争长期均衡中标志性的结构性产能富余与无效率' },
      { termId: 'term-perfect-competition-side-by-side', labelEn: 'Perfect Competition', labelZh: '完全竞争市场', relationEn: 'Contrast benchmark where products are identical and excess capacity is zero', relationZh: '产品完全同质、超额生产能力为零的完全竞争对比基准' }
    ],
    linkedModelId: 'monopolistic-competition'
  },
  {
    id: 'term-oligopoly-game-theory',
    abbreviation: 'Oligopoly',
    aliases: ['Oligopoly', '寡头垄断市场', 'Mutual Interdependence', 'Few Dominant Firms'],
    en: 'Oligopoly & Strategic Interdependence',
    zh: '寡头垄断与策略相互依存（寡头市场）',
    unit: 4,
    topicCode: '4.4',
    category: 'structure',
    definition: {
      en: 'A concentrated market structure dominated by a small handful of large, powerful firms (e.g., 2 to 5 dominant sellers), protected by substantial barriers to entry, producing either standardized commodities (steel, oil) or differentiated consumer goods (automobiles, smartphones). The defining hallmark of oligopoly is STRATEGIC INTERDEPENDENCE: each firms optimal pricing, marketing, and output decisions depend explicitly on the anticipated reactions and countermoves of its rival competitors, best analyzed through Game Theory.',
      zh: '由少数几家巨头厂商（如 2 到 5 家大企业）支配整个行业命脉的高集中度市场形态。受坚固的进入壁垒严密保护，既可生产标准化大宗商品（钢铁、原油），亦可生产差异化消费品（智能手机、汽车）。寡头垄断最根本的灵魂特征是“策略相互依存性（Strategic Interdependence）”：任何一家厂商的调价、广告与排产决策，都极端依赖于对其竞争对手反制措施的预判，必须借助“博弈论（Game Theory）”进行分析。'
    },
    formula: 'Few Large Sellers + High Barriers + Strategic Interdependence -> Best Analyzed via Game Theory Payoff Matrix',
    example: {
      en: 'The commercial aviation manufacturing duopoly (Boeing vs. Airbus) or mobile smartphone operating systems (Apple iOS vs. Google Android): Every product launch, pricing tiers, and R&D budget directly counters the other.',
      zh: '全球大型民用客机制造双寡头（波音 vs 空客）或手机操作系统（苹果 iOS vs 谷歌安卓）：任一方的新机研发、航程定价与更新换代都在严密针对对手的出招进行针锋相对的反制。'
    },
    examTip: {
      en: 'Whenever you see the words "few large dominant sellers" or "interdependent firms" on the AP exam, the answer is ALWAYS OLIGOPOLY! Oligopolies are analyzed using 2x2 game theory payoff matrices.',
      zh: '凡是在 AP 考题中看到“少数几家大企业主导（Few large dominant sellers）”或“决策相互依存（Interdependent）”，答案 100% 毫无悬念是“寡头垄断（Oligopoly）”！其必考分析工具是 2×2 博弈收益矩阵。'
    },
    keyCharacteristics: [
      { en: 'Strategic interdependence: Firm A profit depends on Firm B choices', zh: '策略相互依存：厂商 A 的收益直接取决于厂商 B 的抉择' },
      { en: 'Susceptible to collusive cartels, price leadership, and price wars', zh: '极易衍生出卡特尔合谋、价格领导制或毁灭性恶性价格战' }
    ],
    relatedConcepts: [
      { termId: 'term-payoff-matrix', labelEn: 'Payoff Matrix (Game Theory)', labelZh: '博弈论支付矩阵', relationEn: 'Core analytic matrix tool used to model oligopoly interactions', relationZh: '用于模拟寡头博弈决策互动的核心矩阵工具' },
      { termId: 'term-collusion-cartel', labelEn: 'Collusion & Cartels', labelZh: '合谋与卡特尔', relationEn: 'Cooperative joint monopoly strategy attempted by oligopolists', relationZh: '寡头试图通过串通达成联合垄断的合作策略' }
    ],
    linkedModelId: 'oligopoly-game-theory'
  },
  {
    id: 'term-negative-externalities',
    abbreviation: 'Negative Externalities',
    aliases: ['Negative Externality', '负外部性', 'Spillover Costs', 'External Costs'],
    en: 'Negative Externalities & External Costs',
    zh: '负外部性与外部社会成本（市场过量生产）',
    unit: 6,
    topicCode: '6.2',
    category: 'externality',
    definition: {
      en: 'A market failure that occurs when the production or consumption of a good imposes uncompensated costs, damages, or health burdens onto third-party bystanders who are not involved in the market transaction. Because producers ignore these spillover costs, Marginal Social Cost exceeds Marginal Private Cost (MSC > MPC). Unregulated free markets OVERPRODUCE the good relative to the socially optimal quantity (Q_Market > Q_Social), generating deadweight loss.',
      zh: '在商品生产或消费过程中，向完全未参与该笔交易的第三方无辜公众强加了未受补偿的损害、环境污染或健康负担的市场失灵现象。由于排污制造者只承担私人账面开销，边际社会成本严格大于私人边际成本（MSC > MPC）。不受管制的自由市场必然“过量生产”该有害商品（Q_Market > Q_Social），制造严重的社会净福利无谓损失。'
    },
    formula: 'MSC = MPC + Marginal External Cost (MEC) ; Free Market: Q_Market where MPC = MPB ; Social Optimum: Q_Social where MSC = MSB ; Q_Market > Q_Social',
    example: {
      en: 'A chemical manufacturing facility dumping industrial heavy metal effluent into a river to cut disposal costs: Downstream municipal water purification costs and cancer hospitalizations surge, paid by residents rather than the factory.',
      zh: '化工厂为压缩处理开支直接向公用河流排放重金属废液：下游市政水厂自来水净化成本激增、沿岸居民癌症高发，这些巨额医疗与环保代价全被转嫁由无辜百姓买单。'
    },
    examTip: {
      en: 'AP Deadweight Loss Arrow: On a negative externality graph, the deadweight loss triangle ALWAYS points to the left, like an arrowhead pointing toward the socially optimal output Q_social!',
      zh: 'AP 死重损失箭头记忆法：在负外部性图表中，无谓损失（DWL）三角形的尖角永远向“左”指，如同一支箭头精准指向社会最优产量 Q_social！'
    },
    keyCharacteristics: [
      { en: 'Free market overproduces: Q_Market > Q_Social', zh: '自由市场放任过量生产：市场产量大于社会有效最优规模' },
      { en: 'Corrected by per-unit Pigouvian tax equal to Marginal External Cost (MEC)', zh: '通过征收等于边际外部成本（MEC）的从量庇古税予以化解纠正' }
    ],
    relatedConcepts: [
      { termId: 'term-pigouvian-tax', labelEn: 'Pigouvian Tax', labelZh: '庇古税', relationEn: 'Tax instrument designed to internalize negative external costs', relationZh: '旨在将负外部性外部成本内部化的矫正性税收' },
      { termId: 'term-msc', labelEn: 'Marginal Social Cost (MSC)', labelZh: '边际社会成本', relationEn: 'Curve incorporating private costs plus external damages', relationZh: '全额包含私人成本与外部损害的综合社会成本曲线' }
    ],
    linkedModelId: 'negative-externalities'
  },
  {
    id: 'term-positive-externalities',
    abbreviation: 'Positive Externalities',
    aliases: ['Positive Externality', '正外部性', 'Spillover Benefits', 'External Benefits'],
    en: 'Positive Externalities & External Benefits',
    zh: '正外部性与外部社会收益（市场生产不足）',
    unit: 6,
    topicCode: '6.2',
    category: 'externality',
    definition: {
      en: 'A market failure that occurs when the production or consumption of a good confers uncompensated benefits onto third-party bystanders who did not pay for the good. Because private consumers consider only their own private utility, Marginal Social Benefit exceeds Marginal Private Benefit (MSB > MPB). Unregulated free markets UNDERPRODUCE the good relative to the socially optimal quantity (Q_Market < Q_Social), creating deadweight loss from missed opportunities.',
      zh: '在商品生产或消费过程中，向完全未付费的第三方无辜公众输送了未受经济补偿的良好溢出收益（如传染病免疫防护、知识普及）。由于私人买家在做决策时仅计入私人享受，边际社会收益严格大于私人边际收益（MSB > MPB）。不受管制的自由市场必然“供给不足/生产不足”（Q_Market < Q_Social），从而产生错失社会福利的死重损失。'
    },
    formula: 'MSB = MPB + Marginal External Benefit (MEB) ; Free Market: Q_Market where MPB = MPC ; Social Optimum: Q_Social where MSB = MSC ; Q_Market < Q_Social',
    example: {
      en: 'College higher education and basic cancer vaccine research: An educated researcher invents new clean energy technologies that benefit millions of strangers who never paid a dime for the researchers tuition.',
      zh: '高等科研教育与癌症疫苗基础攻关：受高等教育的青年科学家研发出全新绿色清洁能源技术，使数以千万计从未资助过其学费的陌生公众终身获益。'
    },
    examTip: {
      en: 'AP Deadweight Loss Arrow: On a positive externality graph, the deadweight loss triangle ALWAYS points to the right, pointing toward the underproduced socially optimal output Q_social!',
      zh: 'AP 死重损失箭头记忆法：在正外部性图表中，无谓损失（DWL）三角形的尖角永远向“右”指，精准指向由于供应不足而未能达成的社会最优产量 Q_social！'
    },
    keyCharacteristics: [
      { en: 'Free market underproduces: Q_Market < Q_Social', zh: '自由市场自发供给不足：市场实际产量小于社会最优有效规模' },
      { en: 'Corrected by per-unit Pigouvian subsidy equal to Marginal External Benefit (MEB)', zh: '通过发放等于边际外部收益（MEB）的从量庇古补贴予以激励纠偏' }
    ],
    relatedConcepts: [
      { termId: 'term-pigouvian-subsidy', labelEn: 'Pigouvian Subsidy', labelZh: '庇古补贴', relationEn: 'Subsidy instrument designed to internalize positive external benefits', relationZh: '旨在将正外部溢出收益充分内部化的矫正性财政补贴' },
      { termId: 'term-msb', labelEn: 'Marginal Social Benefit (MSB)', labelZh: '边际社会收益', relationEn: 'Curve encompassing private utility plus external societal spillovers', relationZh: '全额涵盖私人效用与外部社会溢出红利的综合收益曲线' }
    ],
    linkedModelId: 'positive-externalities'
  }
];
