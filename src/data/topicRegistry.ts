import { APTopic, APUnitMeta } from '../types/registry';

export const AP_UNITS: APUnitMeta[] = [
  {
    unit: 1,
    title: {
      en: 'Unit 1: Basic Economic Concepts',
      zh: '第一单元：基本经济学概念'
    },
    examWeight: '12–15%',
    description: {
      en: 'Scarcity, opportunity cost, Production Possibilities Curve (PPC), comparative advantage, and marginal analysis.',
      zh: '稀缺性、机会成本、生产可能性曲线（PPC）、比较优势以及边际分析法。'
    }
  },
  {
    unit: 2,
    title: {
      en: 'Unit 2: Supply and Demand',
      zh: '第二单元：供给与需求'
    },
    examWeight: '20–25%',
    description: {
      en: 'Market equilibrium, price elasticity, consumer and producer surplus, excise taxes, tariffs, and price controls.',
      zh: '市场均衡、价格弹性、消费者与生产者剩余、消费税、关税以及价格管控。'
    }
  },
  {
    unit: 3,
    title: {
      en: 'Unit 3: Production, Cost, and Perfect Competition',
      zh: '第三单元：生产、成本与完全竞争模型'
    },
    examWeight: '22–25%',
    description: {
      en: 'Short-run and long-run cost curves (MC, ATC, AVC, AFC), profit maximization (MR=MC), shutdown rule, and side-by-side market/firm graphs.',
      zh: '短期与长期成本曲线（MC、ATC、AVC、AFC）、利润最大化（MR=MC）、停产法则以及市场与厂商并排图。'
    }
  },
  {
    unit: 4,
    title: {
      en: 'Unit 4: Imperfect Competition',
      zh: '第四单元：不完全竞争市场'
    },
    examWeight: '15–22%',
    description: {
      en: 'Monopoly, natural monopoly regulation, price discrimination, monopolistic competition, and oligopoly game theory.',
      zh: '垄断、自然垄断监管、价格歧视、垄断竞争以及寡头博弈论矩阵。'
    }
  },
  {
    unit: 5,
    title: {
      en: 'Unit 5: Factor Markets',
      zh: '第五单元：要素市场'
    },
    examWeight: '10–13%',
    description: {
      en: 'Derived demand, Marginal Revenue Product (MRP), Marginal Factor Cost (MFC), labor market equilibrium, and monopsony.',
      zh: '派生需求、边际收益产品（MRP）、边际要素成本（MFC）、劳动力市场均衡及买方垄断。'
    }
  },
  {
    unit: 6,
    title: {
      en: 'Unit 6: Market Failure & Role of Government',
      zh: '第六单元：市场失灵与政府职能'
    },
    examWeight: '8–12%',
    description: {
      en: 'Negative/positive externalities (MPC, MSC, MPB, MSB), public goods, remedies (Pigouvian taxes/subsidies), and the Lorenz curve / Gini coefficient.',
      zh: '负面与正面外部性（MPC、MSC、MPB、MSB）、公共物品、纠正性税收与补贴、洛伦兹曲线与基尼系数。'
    }
  }
];

export const AP_TOPICS: APTopic[] = [
  // ==========================================
  // UNIT 1: Basic Economic Concepts
  // ==========================================
  {
    id: 'ppc-model',
    unit: 1,
    topicCode: '1.3',
    title: {
      en: 'Production Possibilities Curve (PPC)',
      zh: '生产可能性曲线（PPC）'
    },
    subtitle: {
      en: 'Opportunity Cost, Productive Efficiency & Economic Growth',
      zh: '机会成本、生产效率与经济增长'
    },
    description: {
      en: 'Illustrates the trade-offs facing an economy producing two goods, showing points of productive efficiency, inefficiency (unemployment), and unattainability under fixed resources.',
      zh: '展示在资源固定条件下经济体生产两种物品所面临的权衡，直观反映生产效率点、低效率（失业）点以及不可企及点。'
    },
    scope: 'core',
    officialRef: 'CED Topic 1.3 / LO 1.3.A (Determine opportunity cost and model economic growth using the PPC)',
    status: 'ready',
    graphModelId: 'ppc-model',
    examWeight: '12–15%',
    keywords: ['PPC', 'PPF', 'Opportunity Cost', 'Productive Efficiency', 'Economic Growth', 'Scarcity'],
    keyTerms: [
      { en: 'Production Possibilities Curve (PPC)', zh: '生产可能性曲线' },
      { en: 'Opportunity Cost', zh: '机会成本' },
      { en: 'Productive Efficiency', zh: '生产效率' },
      { en: 'Economic Growth', zh: '经济增长' },
      { en: 'Increasing Opportunity Cost', zh: '机会成本递增' }
    ],
    primaryCurves: [
      { en: 'PPC Boundary Curve', zh: 'PPC 边界曲线' }
    ]
  },
  {
    id: 'comparative-advantage',
    unit: 1,
    topicCode: '1.4',
    title: {
      en: 'Comparative Advantage & Terms of Trade',
      zh: '比较优势与贸易条件'
    },
    subtitle: {
      en: 'Absolute vs Comparative Advantage & Gains from Specialization',
      zh: '绝对优势与比较优势、专业化分工收益'
    },
    description: {
      en: 'Models per-unit opportunity cost between two trading partners to determine specialization and mutually beneficial terms of trade.',
      zh: '计算两个贸易伙伴的单位机会成本，确定比较优势分工及互利共赢的贸易条件区间。'
    },
    scope: 'core',
    officialRef: 'CED Topic 1.4 / LO 1.4.A (Calculate comparative advantage and identify mutually beneficial terms of trade)',
    status: 'planned',
    examWeight: '12–15%',
    keywords: ['Comparative Advantage', 'Terms of Trade', 'Absolute Advantage', 'Specialization'],
    keyTerms: [
      { en: 'Comparative Advantage', zh: '比较优势' },
      { en: 'Terms of Trade', zh: '贸易条件' },
      { en: 'Specialization', zh: '专业化分工' }
    ],
    primaryCurves: [
      { en: 'Trade Expansion Line', zh: '贸易拓展线' }
    ]
  },
  {
    id: 'marginal-analysis-utility',
    unit: 1,
    topicCode: '1.6',
    title: {
      en: 'Marginal Analysis & Utility Maximization',
      zh: '边际分析与效用最大化'
    },
    subtitle: {
      en: 'Equi-Marginal Rule: MUx / Px = MUy / Py',
      zh: '等边际法则：MUx / Px = MUy / Py'
    },
    description: {
      en: 'Analyzes the consumer utility-maximization condition where the marginal utility per dollar spent is equalized across all consumed goods.',
      zh: '分析消费者效用最大化规则：在既定预算约束下，花在每种商品上的最后一美元带来的边际效用相等。'
    },
    scope: 'core',
    officialRef: 'CED Topic 1.6 / LO 1.6.A (Calculate utility-maximizing consumer choices using marginal analysis)',
    status: 'planned',
    examWeight: '12–15%',
    keywords: ['Marginal Utility', 'Diminishing Marginal Utility', 'Utility Maximization', 'Budget Constraint'],
    keyTerms: [
      { en: 'Marginal Utility (MU)', zh: '边际效用' },
      { en: 'Diminishing Marginal Utility', zh: '边际效用递减' },
      { en: 'Consumer Optimum', zh: '消费者最优决策' }
    ],
    primaryCurves: [
      { en: 'Marginal Utility Curve (MU)', zh: '边际效用曲线' }
    ]
  },

  // ==========================================
  // UNIT 2: Supply and Demand
  // ==========================================
  {
    id: 'market-equilibrium-welfare',
    unit: 2,
    topicCode: '2.6',
    title: {
      en: 'Market Equilibrium, Consumer & Producer Surplus',
      zh: '市场均衡与消费者/生产者剩余'
    },
    subtitle: {
      en: 'Supply and Demand Interaction, Allocative Efficiency & Total Surplus',
      zh: '供求互动、配置效率与总经济剩余'
    },
    description: {
      en: 'The core model of competitive markets. Shows equilibrium price (P*) and quantity (Q*), along with consumer surplus (CS), producer surplus (PS), and total economic welfare.',
      zh: '竞争性市场的核心基石。动态呈现均衡价格（P*）与均衡数量（Q*），以及消费者剩余（CS）、生产者剩余（PS）和总社会福利的最大化。'
    },
    scope: 'core',
    officialRef: 'CED Topic 2.6 / LO 2.6.A & 2.6.B (Calculate and represent consumer and producer surplus at competitive equilibrium)',
    status: 'ready',
    graphModelId: 'market-equilibrium-welfare',
    examWeight: '20–25%',
    keywords: ['Equilibrium', 'Demand', 'Supply', 'Consumer Surplus', 'Producer Surplus', 'Allocative Efficiency'],
    keyTerms: [
      { en: 'Equilibrium Price (P*)', zh: '均衡价格' },
      { en: 'Equilibrium Quantity (Q*)', zh: '均衡数量' },
      { en: 'Consumer Surplus (CS)', zh: '消费者剩余' },
      { en: 'Producer Surplus (PS)', zh: '生产者剩余' },
      { en: 'Allocative Efficiency', zh: '配置效率' }
    ],
    primaryCurves: [
      { en: 'Demand Curve (D)', zh: '需求曲线（D）' },
      { en: 'Supply Curve (S)', zh: '供给曲线（S）' }
    ]
  },
  {
    id: 'price-elasticity-demand',
    unit: 2,
    topicCode: '2.3',
    title: {
      en: 'Price Elasticity of Demand & Total Revenue Test',
      zh: '需求价格弹性与总收益测试'
    },
    subtitle: {
      en: 'Elastic, Unit-Elastic, Inelastic Regions along Linear Demand',
      zh: '线性需求曲线上的富有弹性、单位弹性与缺乏弹性区间'
    },
    description: {
      en: 'Visualizes the percentage responsiveness of quantity demanded to price changes, and connects elasticity regions with the Total Revenue curve.',
      zh: '可视化需求量对价格变动的百分比敏感度，并将不同弹性区间与厂商总收益（TR）曲线的变化紧密对应。'
    },
    scope: 'core',
    officialRef: 'CED Topic 2.3 / LO 2.3.A (Calculate PED and relate it to the Total Revenue Test)',
    status: 'planned',
    examWeight: '20–25%',
    keywords: ['Elasticity', 'PED', 'Total Revenue Test', 'Elastic', 'Inelastic'],
    keyTerms: [
      { en: 'Price Elasticity of Demand (PED)', zh: '需求价格弹性' },
      { en: 'Total Revenue (TR)', zh: '总收益' },
      { en: 'Unit Elastic', zh: '单位弹性' }
    ],
    primaryCurves: [
      { en: 'Demand Curve (D)', zh: '需求曲线' },
      { en: 'Total Revenue Curve (TR)', zh: '总收益曲线' }
    ]
  },
  {
    id: 'gov-intervention-taxes-deadweight',
    unit: 2,
    topicCode: '2.8',
    title: {
      en: 'Excise Taxes, Tax Incidence & Deadweight Loss',
      zh: '消费税、税收归宿与无谓损失'
    },
    subtitle: {
      en: 'Per-Unit Tax Wedge, Consumer vs Producer Burden & Deadweight Loss',
      zh: '单位税收楔子、消费者与生产者税负分担及无谓损失'
    },
    description: {
      en: 'Examines the distortionary impact of per-unit excise taxes: the tax wedge between price paid and price received, tax incidence dictated by relative elasticities, and the creation of deadweight loss (DWL).',
      zh: '剖析每单位消费税带来的扭曲效应：买价与卖价之间的税收楔子、由相对弹性决定的税负归宿分担，以及产生的社会净无谓损失（DWL）。'
    },
    scope: 'core',
    officialRef: 'CED Topic 2.8 / LO 2.8.A (Model deadweight loss and incidence of excise taxes)',
    status: 'ready',
    graphModelId: 'gov-intervention-taxes-deadweight',
    examWeight: '20–25%',
    keywords: ['Excise Tax', 'Tax Incidence', 'Tax Wedge', 'Deadweight Loss', 'DWL'],
    keyTerms: [
      { en: 'Deadweight Loss (DWL)', zh: '无谓损失' },
      { en: 'Tax Incidence', zh: '税负归宿' },
      { en: 'Tax Wedge', zh: '税收楔子' },
      { en: 'Government Revenue', zh: '政府税收收入' }
    ],
    primaryCurves: [
      { en: 'Supply Curve with Tax (S + Tax)', zh: '含税供给曲线' },
      { en: 'Demand Curve (D)', zh: '需求曲线' }
    ]
  },
  {
    id: 'price-controls-ceilings-floors',
    unit: 2,
    topicCode: '2.8',
    title: {
      en: 'Price Ceilings & Price Floors',
      zh: '价格上限与价格下限'
    },
    subtitle: {
      en: 'Binding vs Non-Binding Controls, Shortages, Surpluses & Deadweight Loss',
      zh: '有约束力/无约束力管制、短缺、过剩及无谓损失'
    },
    description: {
      en: 'Models legal maximum and minimum prices. Demonstrates binding price ceilings causing shortages and price floors causing surpluses, alongside welfare redistribution and deadweight loss.',
      zh: '构建法定最高与最低价格模型。展示有约束力的价格上限引发短缺，价格下限导致产品过剩，并揭示福利再分配与无谓损失。'
    },
    scope: 'core',
    officialRef: 'CED Topic 2.8 / LO 2.8.A (Analyze the market effects of binding price ceilings and floors)',
    status: 'planned',
    examWeight: '20–25%',
    keywords: ['Price Ceiling', 'Price Floor', 'Shortage', 'Surplus', 'Binding Control'],
    keyTerms: [
      { en: 'Price Ceiling', zh: '价格上限' },
      { en: 'Price Floor', zh: '价格下限' },
      { en: 'Shortage', zh: '短缺' },
      { en: 'Surplus', zh: '过剩' }
    ],
    primaryCurves: [
      { en: 'Demand (D)', zh: '需求曲线' },
      { en: 'Supply (S)', zh: '供给曲线' },
      { en: 'Controlled Price Line', zh: '管制价格线' }
    ]
  },
  {
    id: 'international-trade-tariffs',
    unit: 2,
    topicCode: '2.9',
    title: {
      en: 'International Trade, World Price & Tariffs / Quotas',
      zh: '国际贸易、世界价格与关税/进口配额'
    },
    subtitle: {
      en: 'Domestic Market with Imports, Tariff Revenue & Deadweight Loss Triangles',
      zh: '含进口的国内市场、关税税收与双重无谓损失三角形'
    },
    description: {
      en: 'Compares free trade at world price (Pw) against a domestic market with import tariffs, showing domestic production expansion, import reductions, tariff revenues, and two deadweight loss triangles.',
      zh: '对比世界价格（Pw）下的自由贸易与征收关税后的市场变化，清晰展示国内生产扩张、进口收缩、政府关税收益以及两个死重损失三角形。'
    },
    scope: 'core',
    officialRef: 'CED Topic 2.9 / LO 2.9.A (Explain effects of tariffs and trade barriers on surplus and efficiency)',
    status: 'planned',
    examWeight: '20–25%',
    keywords: ['International Trade', 'World Price', 'Tariff', 'Quota', 'Import Protection'],
    keyTerms: [
      { en: 'World Price (Pw)', zh: '世界价格' },
      { en: 'Tariff', zh: '关税' },
      { en: 'Domestic Supply', zh: '国内供给' },
      { en: 'Domestic Demand', zh: '国内需求' }
    ],
    primaryCurves: [
      { en: 'Domestic Demand', zh: '国内需求曲线' },
      { en: 'Domestic Supply', zh: '国内供给曲线' },
      { en: 'World Price Line (Pw)', zh: '世界价格线' }
    ]
  },

  // ==========================================
  // UNIT 3: Production, Cost & Perfect Competition
  // ==========================================
  {
    id: 'cost-curves-short-run',
    unit: 3,
    topicCode: '3.2',
    title: {
      en: 'Short-Run Production Costs: MC, ATC, AVC & AFC',
      zh: '短期生产成本：MC、ATC、AVC 与 AFC'
    },
    subtitle: {
      en: 'Diminishing Marginal Returns and Geometric Cost Intersections',
      zh: '边际报酬递减规律与成本曲线几何交点特征'
    },
    description: {
      en: 'The classic U-shaped cost curves. Proves mathematically and graphically why MC cuts ATC and AVC at their minimum points, and why the vertical distance between ATC and AVC equals AFC.',
      zh: '经典的 U 型成本曲线族。严格展示为什么 MC 穿过 ATC 和 AVC 的最低点，以及 ATC 与 AVC 之间的垂直距离恒等于 AFC。'
    },
    scope: 'core',
    officialRef: 'CED Topic 3.2 / LO 3.2.A (Graph and explain short-run cost curves: MC, ATC, AVC, AFC)',
    status: 'planned',
    examWeight: '22–25%',
    keywords: ['Marginal Cost', 'Average Total Cost', 'Average Variable Cost', 'AFC', 'Cost Curves'],
    keyTerms: [
      { en: 'Marginal Cost (MC)', zh: '边际成本' },
      { en: 'Average Total Cost (ATC)', zh: '平均总成本' },
      { en: 'Average Variable Cost (AVC)', zh: '平均可变成本' },
      { en: 'Average Fixed Cost (AFC)', zh: '平均固定成本' }
    ],
    primaryCurves: [
      { en: 'Marginal Cost (MC)', zh: '边际成本（MC）' },
      { en: 'Average Total Cost (ATC)', zh: '平均总成本（ATC）' },
      { en: 'Average Variable Cost (AVC)', zh: '平均可变成本（AVC）' }
    ]
  },
  {
    id: 'perfect-competition-side-by-side',
    unit: 3,
    topicCode: '3.7',
    title: {
      en: 'Perfect Competition: Side-by-Side Market & Firm',
      zh: '完全竞争：市场与厂商并排图'
    },
    subtitle: {
      en: 'Price-Taker Firm (P = MR = D = AR) and Long-Run Zero Economic Profit',
      zh: '价格接受者企业（P = MR = D = AR）与长期零经济利润均衡'
    },
    description: {
      en: 'The signature AP Microeconomics two-panel graph. Shows how market equilibrium sets the perfectly elastic demand curve (Mr. DARP) facing individual price-taking firms, and how entry/exit drives long-run economic profit to zero.',
      zh: 'AP 微观最核心的双图联动模型。左图市场供求决定均衡价格，右图个别价格接受者面对完全水平的需求线（Mr. DARP），展现进入与退出机制驱动长期零经济利润。'
    },
    scope: 'core',
    officialRef: 'CED Topic 3.7 / LO 3.7.A & 3.7.B (Illustrate short-run and long-run adjustments in perfectly competitive markets)',
    status: 'planned',
    examWeight: '22–25%',
    keywords: ['Perfect Competition', 'Side-by-Side', 'Mr DARP', 'Zero Economic Profit', 'Entry and Exit'],
    keyTerms: [
      { en: 'Price Taker', zh: '价格接受者' },
      { en: 'P = MR = AR = D (Mr. DARP)', zh: '价格 = 边际收益 = 平均收益 = 需求' },
      { en: 'Normal Profit (Zero Economic Profit)', zh: '正常利润（零经济利润）' }
    ],
    primaryCurves: [
      { en: 'Market Supply & Demand', zh: '市场供求曲线' },
      { en: 'Firm MC & ATC', zh: '厂商 MC 与 ATC 曲线' },
      { en: 'Firm MR = D', zh: '厂商水平需求线' }
    ]
  },
  {
    id: 'shutdown-rule',
    unit: 3,
    topicCode: '3.6',
    title: {
      en: 'Firm Short-Run Shutdown vs Long-Run Exit',
      zh: '企业短期停产法则与长期退出决策'
    },
    subtitle: {
      en: 'P < AVC Shutdown Condition and the Firm Supply Curve',
      zh: 'P < AVC 停产临界点与完全竞争厂商供给曲线的推导'
    },
    description: {
      en: 'Clarifies when a loss-minimizing firm continues producing (P >= AVC to cover fixed costs) versus shutting down immediately (P < AVC), proving that a competitive firm’s short-run supply curve is MC above AVC.',
      zh: '清晰阐明亏损企业何时继续生产（P >= AVC 分摊固定成本），何时必须立即停产（P < AVC），推导厂商短期供给曲线即为 AVC 最低点之上的 MC 曲线段。'
    },
    scope: 'core',
    officialRef: 'CED Topic 3.6 / LO 3.6.A (Determine whether a firm produces in short run or shuts down)',
    status: 'planned',
    examWeight: '22–25%',
    keywords: ['Shutdown Rule', 'P < AVC', 'Firm Supply Curve', 'Fixed Cost'],
    keyTerms: [
      { en: 'Shutdown Point', zh: '停产点' },
      { en: 'Loss Minimization', zh: '损失最小化' }
    ],
    primaryCurves: [
      { en: 'Marginal Cost (MC)', zh: '边际成本（MC）' },
      { en: 'Average Variable Cost (AVC)', zh: '平均可变成本（AVC）' }
    ]
  },

  // ==========================================
  // UNIT 4: Imperfect Competition
  // ==========================================
  {
    id: 'monopoly-single-price',
    unit: 4,
    topicCode: '4.2',
    title: {
      en: 'Single-Price Monopoly: Price Maker & Inefficiency',
      zh: '单一定价垄断：价格制定者与低效率'
    },
    subtitle: {
      en: 'Downsloping D, MR Below D, Economic Profit & Deadweight Loss',
      zh: '向下倾斜需求曲线、MR 位于 D 下方、超额利润与无谓损失'
    },
    description: {
      en: 'Models a pure monopolist with market power. Solves for MR = MC profit-maximizing output (Qm), finds price on the demand curve (Pm), highlights deadweight loss, and compares with allocative/productive efficiency.',
      zh: '构建拥有市场力量的纯粹垄断模型。求得 MR = MC 利润最大化产量（Qm），在需求线上确定垄断价格（Pm），高亮无谓损失并与社会最优对比。'
    },
    scope: 'core',
    officialRef: 'CED Topic 4.2 / LO 4.2.A (Graph a single-price monopoly, determine price and quantity, and identify deadweight loss)',
    status: 'planned',
    examWeight: '15–22%',
    keywords: ['Monopoly', 'Market Power', 'MR < P', 'Deadweight Loss', 'Barriers to Entry'],
    keyTerms: [
      { en: 'Monopoly', zh: '垄断' },
      { en: 'Marginal Revenue (MR)', zh: '边际收益' },
      { en: 'Monopoly Rent / Profit', zh: '垄断超额利润' },
      { en: 'Deadweight Loss (DWL)', zh: '无谓损失' }
    ],
    primaryCurves: [
      { en: 'Demand (D)', zh: '需求曲线（D）' },
      { en: 'Marginal Revenue (MR)', zh: '边际收益曲线（MR）' },
      { en: 'Marginal Cost (MC)', zh: '边际成本曲线（MC）' },
      { en: 'Average Total Cost (ATC)', zh: '平均总成本曲线（ATC）' }
    ]
  },
  {
    id: 'monopoly-price-discrimination',
    unit: 4,
    topicCode: '4.3',
    title: {
      en: 'Price Discrimination: Perfect (First-Degree)',
      zh: '价格歧视：完全一级价格歧视'
    },
    subtitle: {
      en: 'MR Equals Demand, Zero Consumer Surplus & Zero Deadweight Loss',
      zh: 'MR 与需求曲线重合、消费者剩余归零与无谓损失消除'
    },
    description: {
      en: 'Shows what happens when a monopoly charges each consumer their exact willingness to pay: MR becomes the Demand curve, Consumer Surplus is completely captured as profit, and output reaches allocative efficiency (DWL = 0).',
      zh: '剖析垄断厂商按每位消费者的最大支付意愿逐一收费：MR 与需求曲线完全重合，消费者剩余被完全转化为垄断利润，但产出达到社会有效水平（DWL 降为零）。'
    },
    scope: 'core',
    officialRef: 'CED Topic 4.3 / LO 4.3.A (Analyze the welfare and output effects of perfect price discrimination)',
    status: 'planned',
    examWeight: '15–22%',
    keywords: ['Price Discrimination', 'Willingness to Pay', 'Allocative Efficiency', 'Surplus Transfer'],
    keyTerms: [
      { en: 'Perfect Price Discrimination', zh: '完全价格歧视' },
      { en: 'Capturing Consumer Surplus', zh: '掠夺全部消费者剩余' }
    ],
    primaryCurves: [
      { en: 'Demand = MR', zh: '需求曲线即 MR 曲线' },
      { en: 'Marginal Cost (MC)', zh: '边际成本（MC）' }
    ]
  },
  {
    id: 'monopolistic-competition',
    unit: 4,
    topicCode: '4.4',
    title: {
      en: 'Monopolistic Competition: Short Run vs Long Run',
      zh: '垄断竞争：短期超额利润与长期切线零利润'
    },
    subtitle: {
      en: 'Differentiated Products, Tangency Equilibrium & Excess Capacity',
      zh: '差异化产品、ATC 相切均衡与过剩生产能力'
    },
    description: {
      en: 'Examines monopolistic competition with free entry and differentiated goods. Illustrates short-run economic profits attracting new firms, shifting demand leftward until D is tangent to ATC in the long run, leaving excess capacity.',
      zh: '分析自由进出和差异化产品市场。展示短期经济利润吸引新厂商涌入，使个别企业需求线左移至与 ATC 相切，达到长期零利润并产生过剩生产能力。'
    },
    scope: 'core',
    officialRef: 'CED Topic 4.4 / LO 4.4.A (Illustrate short-run and long-run equilibrium and excess capacity in monopolistic competition)',
    status: 'planned',
    examWeight: '15–22%',
    keywords: ['Monopolistic Competition', 'Excess Capacity', 'Tangency', 'Product Differentiation'],
    keyTerms: [
      { en: 'Excess Capacity', zh: '过剩生产能力' },
      { en: 'Product Differentiation', zh: '产品差异化' },
      { en: 'Tangency Condition', zh: '切线均衡条件' }
    ],
    primaryCurves: [
      { en: 'Firm Demand (D)', zh: '厂商需求曲线' },
      { en: 'Marginal Revenue (MR)', zh: '边际收益（MR）' },
      { en: 'Average Total Cost (ATC)', zh: '平均总成本（ATC）' }
    ]
  },
  {
    id: 'oligopoly-game-theory',
    unit: 4,
    topicCode: '4.5',
    title: {
      en: 'Oligopoly, Payoff Matrix & Nash Equilibrium',
      zh: '寡头垄断、博弈支付矩阵与纳什均衡'
    },
    subtitle: {
      en: 'Dominant Strategies, Collusion & Prisoner\'s Dilemma',
      zh: '占优策略、合谋卡特尔与囚徒困境'
    },
    description: {
      en: 'Interactive 2x2 game theory payoff matrix. Calculates dominant strategies for Player 1 and Player 2, identifies Nash Equilibria, and contrasts competitive vs collusive cartel outcomes.',
      zh: '交互式 2x2 经典博弈论收益矩阵。动态计算双方的占优策略、识别纳什均衡点，并对比卡特尔合谋与非合作纳什均衡之间的福利差异。'
    },
    scope: 'core',
    officialRef: 'CED Topic 4.5 / LO 4.5.A (Solve a payoff matrix to identify dominant strategies and Nash equilibria)',
    status: 'planned',
    examWeight: '15–22%',
    keywords: ['Oligopoly', 'Game Theory', 'Nash Equilibrium', 'Dominant Strategy', 'Prisoner Dilemma'],
    keyTerms: [
      { en: 'Nash Equilibrium', zh: '纳什均衡' },
      { en: 'Dominant Strategy', zh: '占优策略' },
      { en: 'Collusion / Cartel', zh: '合谋 / 卡特尔' }
    ],
    primaryCurves: [
      { en: 'Payoff Matrix Visualizer', zh: '支付矩阵可视化' }
    ]
  },

  // ==========================================
  // UNIT 5: Factor Markets
  // ==========================================
  {
    id: 'factor-market-competitive',
    unit: 5,
    topicCode: '5.3',
    title: {
      en: 'Competitive Factor Market: Labor Supply & Demand',
      zh: '完全竞争要素市场：劳动力供求均衡'
    },
    subtitle: {
      en: 'Derived Demand, MRP = MRC Rule & Wage Determination',
      zh: '派生需求、MRP = MRC 雇佣法则与市场工资决定'
    },
    description: {
      en: 'Side-by-side factor market model: the overall market determines the competitive wage (W*), which forms a horizontal Marginal Factor Cost (MFC/MRC) for individual firms, who hire where MRP = MRC.',
      zh: '要素市场双图联动模型：劳动力总市场供求决定均衡工资率（W*），个别企业面对水平的边际要素成本线（MFC/MRC），按照 MRP = MRC 原则确定最优雇佣人数。'
    },
    scope: 'core',
    officialRef: 'CED Topic 5.3 / LO 5.3.A (Determine the profit-maximizing quantity of labor hired by a competitive firm)',
    status: 'planned',
    examWeight: '10–13%',
    keywords: ['Factor Market', 'MRP', 'MFC', 'MRC', 'Derived Demand', 'Labor Market'],
    keyTerms: [
      { en: 'Marginal Revenue Product (MRP)', zh: '边际收益产品（MRP）' },
      { en: 'Marginal Factor Cost (MFC / MRC)', zh: '边际要素成本（MFC / MRC）' },
      { en: 'Derived Demand', zh: '派生需求' }
    ],
    primaryCurves: [
      { en: 'Labor Market Supply & Demand', zh: '劳动力市场供求曲线' },
      { en: 'Firm MRP (Labor Demand)', zh: '厂商 MRP 需求曲线' },
      { en: 'Firm MFC (Wage Taker)', zh: '厂商水平 MFC 供给线' }
    ]
  },
  {
    id: 'monopsony-factor-market',
    unit: 5,
    topicCode: '5.4',
    title: {
      en: 'Monopsony Labor Market',
      zh: '买方垄断劳动力市场'
    },
    subtitle: {
      en: 'MFC Above Labor Supply, Lower Wage (Wm) and Underemployment',
      zh: 'MFC 位于劳动力供给曲线之上、工资被压低与雇佣不足'
    },
    description: {
      en: 'Models a single buyer of labor (monopsony). Because hiring additional workers requires raising wages for all workers, MFC lies above Labor Supply, leading to underemployment (Qm < Qc) and wage exploitation (Wm < Wc).',
      zh: '构建劳动力市场单一买家模型。由于增聘工人必须给现有所有工人加薪，MFC 陡峭地位于劳动供给曲线之上，导致雇佣量与工资率均低于完全竞争水平。'
    },
    scope: 'core',
    officialRef: 'CED Topic 5.4 / LO 5.4.A (Graph a monopsonistic labor market and determine wage and employment)',
    status: 'planned',
    examWeight: '10–13%',
    keywords: ['Monopsony', 'Labor Supply', 'MFC > S', 'Wage Exploitation', 'Underemployment'],
    keyTerms: [
      { en: 'Monopsony', zh: '买方垄断' },
      { en: 'MFC > Labor Supply', zh: 'MFC 位于供给曲线之上' },
      { en: 'Competitive vs Monopsony Wage', zh: '竞争工资对比垄断工资' }
    ],
    primaryCurves: [
      { en: 'Marginal Factor Cost (MFC)', zh: '边际要素成本（MFC）' },
      { en: 'Labor Supply (S_L)', zh: '劳动力供给曲线（S_L）' },
      { en: 'Marginal Revenue Product (MRP)', zh: '边际收益产品（MRP）' }
    ]
  },

  // ==========================================
  // UNIT 6: Market Failure & Role of Government
  // ==========================================
  {
    id: 'negative-externalities',
    unit: 6,
    topicCode: '6.2',
    title: {
      en: 'Negative Externalities & Pigouvian Per-Unit Tax',
      zh: '负面外部性与庇古单位税'
    },
    subtitle: {
      en: 'MSC > MPC, Overproduction & Corrective Tax Remedy',
      zh: 'MSC > MPC、市场过度生产与纠正性税收调节'
    },
    description: {
      en: 'Examines negative production externalities (e.g., pollution) where Marginal Social Cost exceeds Marginal Private Cost. Shows overproduction at market equilibrium and demonstrates how a per-unit Pigouvian tax shifts MPC to MSC, restoring efficiency.',
      zh: '分析负外部性（如污染）：边际社会成本（MSC）超过边际私人成本（MPC）。揭示自由市场过度生产，并演示征收等于边际外部成本的单位庇古税如何恢复配置效率。'
    },
    scope: 'core',
    officialRef: 'CED Topic 6.2 / LO 6.2.A (Graph negative externalities and calculate corrective per-unit taxes)',
    status: 'planned',
    examWeight: '8–12%',
    keywords: ['Negative Externality', 'MSC', 'MPC', 'Pigouvian Tax', 'Deadweight Loss', 'Pollution'],
    keyTerms: [
      { en: 'Marginal Social Cost (MSC)', zh: '边际社会成本（MSC）' },
      { en: 'Marginal Private Cost (MPC)', zh: '边际私人成本（MPC）' },
      { en: 'Marginal External Cost (MEC)', zh: '边际外部成本（MEC）' },
      { en: 'Pigouvian Tax', zh: '庇古税' }
    ],
    primaryCurves: [
      { en: 'Marginal Social Cost (MSC)', zh: '边际社会成本（MSC）' },
      { en: 'Marginal Private Cost (MPC)', zh: '边际私人成本（MPC）' },
      { en: 'Marginal Social Benefit (MSB = MPB)', zh: '边际社会收益（MSB = MPB）' }
    ]
  },
  {
    id: 'positive-externalities',
    unit: 6,
    topicCode: '6.2',
    title: {
      en: 'Positive Externalities & Pigouvian Per-Unit Subsidy',
      zh: '正面外部性与庇古单位补贴'
    },
    subtitle: {
      en: 'MSB > MPB, Underproduction & Corrective Subsidy Remedy',
      zh: 'MSB > MPB、市场生产不足与纠正性补贴调节'
    },
    description: {
      en: 'Examines positive consumption/production externalities (e.g., vaccines, education) where Marginal Social Benefit exceeds Marginal Private Benefit. Illustrates free-market underproduction and corrective per-unit subsidies.',
      zh: '剖析正面外部性（如疫苗接种、教育）：边际社会收益（MSB）高于边际私人收益（MPB）。展示自由市场生产不足的无谓损失，以及政府单位补贴如何消除效率损失。'
    },
    scope: 'core',
    officialRef: 'CED Topic 6.2 / LO 6.2.A (Graph positive externalities and calculate corrective per-unit subsidies)',
    status: 'planned',
    examWeight: '8–12%',
    keywords: ['Positive Externality', 'MSB', 'MPB', 'Pigouvian Subsidy', 'Underproduction'],
    keyTerms: [
      { en: 'Marginal Social Benefit (MSB)', zh: '边际社会收益（MSB）' },
      { en: 'Marginal Private Benefit (MPB)', zh: '边际私人收益（MPB）' },
      { en: 'Per-Unit Subsidy', zh: '每单位补贴' }
    ],
    primaryCurves: [
      { en: 'Marginal Social Benefit (MSB)', zh: '边际社会收益（MSB）' },
      { en: 'Marginal Private Benefit (MPB)', zh: '边际私人收益（MPB）' },
      { en: 'Marginal Cost (MC = MSC)', zh: '边际成本（MC = MSC）' }
    ]
  },
  {
    id: 'lorenz-curve-gini',
    unit: 6,
    topicCode: '6.5',
    title: {
      en: 'Income Inequality: Lorenz Curve & Gini Coefficient',
      zh: '收入不平等：洛伦兹曲线与基尼系数'
    },
    subtitle: {
      en: 'Cumulative Income Distribution and Gini Ratio: A / (A + B)',
      zh: '累积收入分配曲线与基尼系数比率：A / (A + B)'
    },
    description: {
      en: 'Plots cumulative percentage of income against cumulative percentage of population. Area A (between the 45-degree line of perfect equality and the Lorenz curve) divided by (A + B) gives the Gini Coefficient.',
      zh: '绘制人口累计百分比与收入累计百分比。45度完全平等线与洛伦兹曲线之间的面积 A 除以总面积 (A + B) 即为基尼系数，直观展示税收政策对收入差距的调节作用。'
    },
    scope: 'core',
    officialRef: 'CED Topic 6.5 / LO 6.5.A (Interpret the Lorenz curve and explain changes in the Gini coefficient)',
    status: 'planned',
    examWeight: '8–12%',
    keywords: ['Lorenz Curve', 'Gini Coefficient', 'Income Inequality', 'Redistribution'],
    keyTerms: [
      { en: 'Lorenz Curve', zh: '洛伦兹曲线' },
      { en: 'Gini Coefficient', zh: '基尼系数' },
      { en: 'Line of Perfect Equality', zh: '完全平等线（45度线）' }
    ],
    primaryCurves: [
      { en: '45-Degree Perfect Equality Line', zh: '45度完全平等线' },
      { en: 'Lorenz Curve', zh: '洛伦兹曲线' }
    ]
  },

  // ==========================================
  // OPTIONAL EXTENSION TOPICS (Advanced Micro)
  // ==========================================
  {
    id: 'indifference-curves-budget',
    unit: 1,
    topicCode: 'Ext-1',
    title: {
      en: 'Indifference Curves & Budget Constraints',
      zh: '无差异曲线与预算约束线'
    },
    subtitle: {
      en: 'Marginal Rate of Substitution (MRS) & Tangency Optimum',
      zh: '边际替代率（MRS）与切点最优消费者均衡'
    },
    description: {
      en: 'Advanced consumer theory extension: models convex indifference curves tangent to the linear budget line where MRS equals the price ratio (Px/Py). Includes income and substitution effects.',
      zh: '高级微观消费者理论拓展：建模凸向原点的无差异曲线与预算约束线相切的最优点（MRS = Px / Py），直观分解收入效应与替代效应。'
    },
    scope: 'extension',
    officialRef: 'Advanced Microeconomics Extension (Beyond standard AP Micro CED; frequently taught in honors economics)',
    status: 'planned',
    keywords: ['Indifference Curve', 'Budget Constraint', 'MRS', 'Income Effect', 'Substitution Effect'],
    keyTerms: [
      { en: 'Indifference Curve', zh: '无差异曲线' },
      { en: 'Marginal Rate of Substitution (MRS)', zh: '边际替代率' },
      { en: 'Budget Constraint', zh: '预算约束线' }
    ],
    primaryCurves: [
      { en: 'Budget Constraint Line', zh: '预算约束线' },
      { en: 'Indifference Curves (U1, U2, U3)', zh: '无差异曲线族' }
    ]
  },
  {
    id: 'cournot-duopoly',
    unit: 4,
    topicCode: 'Ext-4',
    title: {
      en: 'Cournot Duopoly Reaction Curves',
      zh: '古诺双头垄断反应函数曲线'
    },
    subtitle: {
      en: 'Simultaneous Output Competition & Cournot-Nash Equilibrium',
      zh: '同时产量决策博弈与古诺-纳什均衡点'
    },
    description: {
      en: 'Mathematical oligopoly model where two symmetric firms simultaneously choose quantities. The intersection of their downward-sloping reaction curves yields the Cournot-Nash equilibrium.',
      zh: '两家厂商同时做出产量决策的数理寡头模型。双方向下倾斜的最佳反应函数曲线的交点即为古诺-纳什均衡产出。'
    },
    scope: 'extension',
    officialRef: 'Intermediate Microeconomics Extension (Oligopoly output competition model)',
    status: 'planned',
    keywords: ['Cournot', 'Duopoly', 'Reaction Curve', 'Best Response', 'Simultaneous Game'],
    keyTerms: [
      { en: 'Reaction Curve (Best Response)', zh: '反应曲线（最佳应对函数）' },
      { en: 'Cournot-Nash Equilibrium', zh: '古诺-纳什均衡' }
    ],
    primaryCurves: [
      { en: 'Firm 1 Reaction Curve', zh: '厂商 1 反应曲线' },
      { en: 'Firm 2 Reaction Curve', zh: '厂商 2 反应曲线' }
    ]
  },

  // ==========================================
  // NOT IN CURRENT AP EXAM SCOPE (Clarifications)
  // ==========================================
  {
    id: 'kinked-demand-curve',
    unit: 4,
    topicCode: 'Excl-1',
    title: {
      en: 'Kinked Demand Curve Model (Historical Oligopoly)',
      zh: '折弯需求曲线模型（历史考点，已移出考纲）'
    },
    subtitle: {
      en: 'Sticky Prices via Discontinuous Marginal Revenue',
      zh: '利用不连续边际收益曲线解释价格粘性（CED 已取消考察）'
    },
    description: {
      en: 'Historically used to explain price rigidity in oligopolies based on asymmetric responses to price hikes vs price cuts. The College Board has explicitly removed this model from the required AP Microeconomics syllabus in favor of game theory payoff matrices.',
      zh: '历史上曾用于通过假定对手跟跌不跟涨来解释寡头价格刚性。大学理事会（College Board）在最新 AP 微观考纲中已明确移除了该模型的考查要求，转为全面考查博弈论支付矩阵。'
    },
    scope: 'excluded',
    officialRef: 'College Board AP Microeconomics CED Clarifications (Explicitly removed from required assessable models; replaced by game theory)',
    status: 'reference',
    keywords: ['Kinked Demand', 'Price Rigidity', 'Discontinuous MR', 'Excluded from AP Exam'],
    keyTerms: [
      { en: 'Kinked Demand Curve', zh: '折弯需求曲线' },
      { en: 'Discontinuous Marginal Revenue', zh: '断开的边际收益线' },
      { en: 'Not Tested on AP Exam', zh: '当前 AP 考试不再考查' }
    ],
    primaryCurves: [
      { en: 'Kinked Demand Curve', zh: '折弯需求曲线' },
      { en: 'Discontinuous MR', zh: '断开的 MR 曲线' }
    ]
  },
  {
    id: 'phillips-curve-macro',
    unit: 0,
    topicCode: 'Excl-2',
    title: {
      en: 'Phillips Curve (Inflation vs Unemployment)',
      zh: '菲利普斯曲线（通货膨胀与失业率）'
    },
    subtitle: {
      en: 'Short-Run (SRPC) and Long-Run (LRPC) - AP Macro Topic',
      zh: '短期（SRPC）与长期（LRPC）—— 纯 AP 宏观考点'
    },
    description: {
      en: 'Illustrates the trade-off between inflation and unemployment. This is a foundational macroeconomic model included in the AP Macroeconomics CED (Unit 5), but is NOT tested in AP Microeconomics.',
      zh: '展示通货膨胀与失业率之间的权衡关系。该模型属于《AP 宏观经济学》第五单元的核心内容，绝不会在 AP 微观经济学考试中考查，在此列出以防止学生科目混淆。'
    },
    scope: 'excluded',
    officialRef: 'AP Macroeconomics CED Unit 5 (Strictly excluded from AP Microeconomics scope)',
    status: 'reference',
    keywords: ['Phillips Curve', 'Macroeconomics', 'Inflation', 'Unemployment', 'Excluded from Micro'],
    keyTerms: [
      { en: 'Short-Run Phillips Curve (SRPC)', zh: '短期菲利普斯曲线' },
      { en: 'Long-Run Phillips Curve (LRPC)', zh: '长期菲利普斯曲线' },
      { en: 'Macroeconomics Exclusive', zh: '宏观专属考点' }
    ],
    primaryCurves: [
      { en: 'SRPC Curve', zh: '短期菲利普斯曲线' },
      { en: 'LRPC Vertical Line', zh: '长期菲利普斯垂直线' }
    ]
  }
];
