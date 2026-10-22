import { BilingualText } from '../types/registry';

export interface LearningPredictionOption {
  id: string;
  label: BilingualText;
  isCorrect: boolean;
  feedback: BilingualText;
}

export interface LearningActivity {
  id: string;
  topicId: string;
  modelId: string;
  unit: number;
  title: BilingualText;
  scenario: BilingualText;
  graphInitialParams: Record<string, any>;
  graphTargetParams: Record<string, any>;
  predictionPrompt: BilingualText;
  options: LearningPredictionOption[];
  hint: BilingualText;
  stepByStepExplanation: BilingualText[];
  keyTakeaway: BilingualText;
}

export const LEARNING_ACTIVITIES: LearningActivity[] = [
  {
    id: 'learn-ppc-capital-growth',
    topicId: 'ppc-model',
    modelId: 'ppc-model',
    unit: 1,
    title: {
      en: 'PPC Asymmetric Growth: Capital Goods Automation',
      zh: 'PPC 非对称技术突破：资本品自动化变革'
    },
    scenario: {
      en: 'Engineers develop an AI robotics breakthrough that exclusively enhances the efficiency of producing Capital Goods (machines, factories). Production techniques for Consumer Goods (food, clothing) remain completely unchanged.',
      zh: '科技团队开发出革命性 AI 工业机器人，使资本品（机器设备、厂房）的生产效率获得极大提升；但消费品（食物、服饰）的生产技术未发生任何改变。'
    },
    graphInitialParams: {
      costShape: 'bowed',
      techCapitalGoods: 100,
      techConsumerGoods: 100,
      productionX: 55,
      showGrowthShift: false
    },
    graphTargetParams: {
      costShape: 'bowed',
      techCapitalGoods: 150,
      techConsumerGoods: 100,
      productionX: 55,
      showGrowthShift: true
    },
    predictionPrompt: {
      en: 'What will happen to the Production Possibilities Curve and the maximum possible output of Consumer Goods if all resources were allocated to them?',
      zh: '生产可能性曲线（PPC）将如何移动？如果全社会将所有生产资源都投入到消费品生产，消费品的最大极限产量会改变吗？'
    },
    options: [
      {
        id: 'opt-a',
        label: {
          en: 'The PPC rotates outward along the Capital Goods axis; the maximum Consumer Goods intercept remains completely unchanged.',
          zh: 'PPC 仅沿着资本品坐标轴向外非对称旋转延伸；消费品坐标轴的截距完全保持不变。'
        },
        isCorrect: true,
        feedback: {
          en: 'Spot on! Because the technological improvement only applies to capital goods, the economy can produce more capital goods at any level of consumer goods, but if zero capital goods are made, consumer goods output is unchanged.',
          zh: '回答完全正确！由于技术突破仅发生于资本品领域，经济体在任意消费品生产水平下均能获得更多资本品；但若资本品产量为零，消费品的最大产出极限保持不变。'
        }
      },
      {
        id: 'opt-b',
        label: {
          en: 'The entire PPC shifts outward in a parallel fashion, increasing both maximum intercepts equally.',
          zh: '整条 PPC 曲线平行向外整体平移，两种商品的最大极限产量均同比例同幅度增加。'
        },
        isCorrect: false,
        feedback: {
          en: 'Not quite. A parallel outward shift only occurs when an economy experiences overall labor force growth, general resource discovery, or economy-wide technological progress.',
          zh: '答案不准确。只有当全社会总劳动力人口增长、通用资源勘探发现或全行业通用技术进步时，PPC 才会发生平行外移。'
        }
      },
      {
        id: 'opt-c',
        label: {
          en: 'The PPC shifts inward because resources are diverted away from consumer goods.',
          zh: 'PPC 将向内收缩，因为社会资源被抽调走，导致消费品产能缩水。'
        },
        isCorrect: false,
        feedback: {
          en: 'Incorrect. Technological progress expands production possibilities (the boundary of what can potentially be produced); it never shrinks the PPC boundary.',
          zh: '错误。技术进步扩大了潜在生产能力的边界（即 PPC 曲线本身）；它绝不会导致潜在生产可能性向内萎缩。'
        }
      }
    ],
    hint: {
      en: 'Think about what happens at the extreme point on the vertical axis where Capital Goods = 0.',
      zh: '思考位于纵轴上的极端点：当全社会生产 0 单位资本品时，消费品的最大产出量会受技术变化影响吗？'
    },
    stepByStepExplanation: [
      {
        en: 'Step 1: The PPC boundary defines the maximum combinations of two goods that can be produced using all available resources efficiently.',
        zh: '第一步：PPC 曲线定义了在充分利用现有资源和技术的条件下，全社会所能生产的两种商品的最大组合极限。'
      },
      {
        en: 'Step 2: When technology advances for Good A only, the intercept for Good A extends outward, while the intercept for Good B remains pinned.',
        zh: '第二步：当技术创新仅有利于某种商品（资本品）时，该商品的坐标轴截距显著外扩，而另一种商品（消费品）的截距保持不动。'
      },
      {
        en: 'Step 3: Future Economic Growth Insight: Producing more capital goods today allows an even larger overall shift of the PPC in the future!',
        zh: '第三步：未来经济增长核心考点：今天选择多生产资本品而非当前消费品，将在未来积累更多机械厂房，从而在未来促成整条 PPC 的全面向外平移！'
      }
    ],
    keyTakeaway: {
      en: 'Biased technological progress causes a rotational expansion of the PPC along the affected good\'s axis.',
      zh: '偏向性技术进步导致 PPC 沿着受影响商品的单轴方向发生非对称旋转外展。'
    }
  },
  {
    id: 'learn-simultaneous-shifts',
    topicId: 'market-equilibrium-welfare',
    modelId: 'market-equilibrium-welfare',
    unit: 2,
    title: {
      en: 'Simultaneous Market Shifts: Popular Demand Surge Meets Severe Drought',
      zh: '供求双重平移定律：健康风潮需求暴增遭遇严重干旱减产'
    },
    scenario: {
      en: 'A medical study confirms daily avocado consumption triples cognitive performance (Demand increases sharply). Simultaneously, an unprecedented drought devastates avocado groves across the Americas (Supply decreases sharply).',
      zh: '权威医学期刊证实牛油果对大脑有奇效，引发消费者狂热抢购（需求大幅增加）；与此同时，主产区遭遇历史罕见的严重旱灾导致果园大面积减产（供给大幅减少）。'
    },
    graphInitialParams: {
      demandShift: 0,
      supplyShift: 0,
      taxPerUnit: 0,
      subsidyPerUnit: 0,
      priceControlMode: 'none',
      controlledPrice: 50,
      showBaselineComparison: true
    },
    graphTargetParams: {
      demandShift: 20,
      supplyShift: -20,
      taxPerUnit: 0,
      subsidyPerUnit: 0,
      priceControlMode: 'none',
      controlledPrice: 50,
      showBaselineComparison: true
    },
    predictionPrompt: {
      en: 'According to AP Microeconomics simultaneous shift theory, what are the unambiguous and indeterminate effects on Equilibrium Price (P*) and Equilibrium Quantity (Q*)?',
      zh: '根据 AP 微观经济学双重移动理论，新的均衡价格（P*）与均衡数量（Q*）的变化规律分别是什么？'
    },
    options: [
      {
        id: 'opt-a',
        label: {
          en: 'Price unambiguously INCREASES (P* ↑); Quantity is INDETERMINATE (Q* ?).',
          zh: '均衡价格必然上涨（P* ↑）；均衡数量不确定（Q* 属于 Indeterminate）。'
        },
        isCorrect: true,
        feedback: {
          en: 'Correct! Demand ↑ drives P ↑ and Q ↑; Supply ↓ drives P ↑ and Q ↓. Both shifts push Price up (unambiguous increase), but their effects on Quantity oppose each other, making Q* indeterminate without knowing shift magnitudes.',
          zh: '完全正确！D↑ 推动 P↑ 且 Q↑；S↓ 推动 P↑ 且 Q↓。两者的价格效应同向（必然推升价格 P*↑），但对数量的作用方向完全相抵，因此均衡数量 Q* 属于不确定（Indeterminate）。'
        }
      },
      {
        id: 'opt-b',
        label: {
          en: 'Quantity unambiguously INCREASES (Q* ↑); Price is INDETERMINATE (P* ?).',
          zh: '均衡数量必然增加（Q* ↑）；均衡价格不确定（P* 属于 Indeterminate）。'
        },
        isCorrect: false,
        feedback: {
          en: 'Incorrect. If Demand increases (Q ↑) and Supply decreases (Q ↓), the quantity forces work in opposite directions, so Quantity cannot be unambiguously increasing.',
          zh: '错误。需求增加促使数量上升（Q↑），但供给减少促使数量下降（Q↓），二者对数量的作用力互相反向，数量绝不可能确定增加。'
        }
      },
      {
        id: 'opt-c',
        label: {
          en: 'Both Equilibrium Price and Equilibrium Quantity unambiguously increase.',
          zh: '均衡价格与均衡数量必然同时确定上升。'
        },
        isCorrect: false,
        feedback: {
          en: 'Incorrect. Both P and Q only unambiguously increase when Demand increases while Supply remains unchanged.',
          zh: '错误。只有在“单纯需求增加、供给保持不变”的单一平移情境下，P* 与 Q* 才会同时确定增加。'
        }
      }
    ],
    hint: {
      en: 'Break down each shift into separate directional arrows: (D ↑: P ↑, Q ↑) and (S ↓: P ↑, Q ↓). Look for which arrow points the same way and which arrows clash.',
      zh: '将每次平移拆分为单独的箭头规律：(D↑: P↑, Q↑) 与 (S↓: P↑, Q↓)。观察哪个变量箭头方向一致，哪个变量相互冲突抵消。'
    },
    stepByStepExplanation: [
      {
        en: 'Step 1: Analyze Demand increase (D ↑): Buyers compete aggressively for limited goods, driving Price UP (P ↑) and expanding Quantity (Q ↑).',
        zh: '第一步：分析需求增加（D↑）：买方竞相竞价，推高均衡价格（P↑）并扩大均衡数量（Q↑）。'
      },
      {
        en: 'Step 2: Analyze Supply decrease (S ↓): Rising production scarcity drives Price UP (P ↑) but shrinks available Quantity (Q ↓).',
        zh: '第二步：分析供给减少（S↓）：产品因干旱变得稀缺，同样推高均衡价格（P↑），但压缩了交易数量（Q↓）。'
      },
      {
        en: 'Step 3: Synthesize outcomes: Price changes reinforce each other (P* definitively increases). Quantity changes clash (+ΔQ from demand vs -ΔQ from supply), rendering Q* indeterminate!',
        zh: '第三步：综合研判：价格效应相互加强（P* 确定暴涨）；数量效应相互对冲（需求想买更多，但供给因灾减产），数量变动取决于哪一方平移幅度更大，因此理论上属于不确定（Indeterminate）！'
      }
    ],
    keyTakeaway: {
      en: 'In simultaneous shifts, one variable (P or Q) is always unambiguously determined, while the other variable is strictly INDETERMINATE.',
      zh: '在供求双重移动中，必然有一个经济变量（P 或 Q）确定变动，而另一个变量在未知具体幅度时严格属于“不确定（Indeterminate）”。'
    }
  },
  {
    id: 'learn-binding-price-ceiling',
    topicId: 'price-controls-ceilings-floors',
    modelId: 'market-equilibrium-welfare',
    unit: 2,
    title: {
      en: 'Price Controls: The Consequences of a Binding Price Ceiling',
      zh: '价格管控：有约束力最高限价（Price Ceiling）的福利后果'
    },
    scenario: {
      en: 'The competitive market clearing price of basic bread is $50. In response to inflation, the government decrees a statutory legal maximum price of $35 per loaf to help low-income families.',
      zh: '完全竞争市场上面包的自然出清均衡价格为 $50。为平抑物价，政府通过紧急法案，强制规定每条面包的法定最高售价不得超过 $35。'
    },
    graphInitialParams: {
      demandShift: 0,
      supplyShift: 0,
      taxPerUnit: 0,
      subsidyPerUnit: 0,
      priceControlMode: 'none',
      controlledPrice: 50,
      showBaselineComparison: false
    },
    graphTargetParams: {
      demandShift: 0,
      supplyShift: 0,
      taxPerUnit: 0,
      subsidyPerUnit: 0,
      priceControlMode: 'ceiling',
      controlledPrice: 35,
      showBaselineComparison: true
    },
    predictionPrompt: {
      en: 'What market imbalance develops, what quantity is actually transacted, and what happens to allocative efficiency?',
      zh: '市场上会出现短缺还是过剩？实际买卖交易量由谁决定？全社会的总福利（配置效率）会发生什么变化？'
    },
    options: [
      {
        id: 'opt-a',
        label: {
          en: 'A persistent shortage (Qd > Qs) emerges; actual transactions drop to Qs, generating deadweight loss.',
          zh: '市场出现持续性短缺（Qd > Qs）；实际交易量被供给端 Qs 限制而骤降，产生社会净无谓损失（DWL）。'
        },
        isCorrect: true,
        feedback: {
          en: 'Spot on! At the lower controlled price ($35), quantity demanded expands while quantity supplied contracts. Because voluntary exchange requires willing sellers, actual quantity transacted is restricted to Qs, reducing total surplus and creating deadweight loss.',
          zh: '完全正确！在低限价（$35）下，消费者需求量急剧扩张，但面包店因利润微薄而削减供应。在自愿交易市场中，交易量只能以较小的一方（即供给量 Qs）为准，产出被强制压低，造成配置低效率与无谓损失。'
        }
      },
      {
        id: 'opt-b',
        label: {
          en: 'A surplus of bread develops because producers want to sell more at lower prices.',
          zh: '市场上出现面包过剩，因为生产者希望在低价下薄利多销。'
        },
        isCorrect: false,
        feedback: {
          en: 'Incorrect. Lower prices reduce producer incentives to supply according to the Law of Supply. Surpluses occur under price FLOORS set above equilibrium.',
          zh: '错误。根据供给定理，降价只会打击生产者的供应动力。产品过剩只会在高于均衡价格的“价格下限（Price Floor）”管制下出现。'
        }
      },
      {
        id: 'opt-c',
        label: {
          en: 'Total economic surplus increases because poor consumers get cheaper bread with zero efficiency loss.',
          zh: '社会总福利显著上升，因为低收入家庭享受到了低价食品，且完全没有任何效率损失。'
        },
        isCorrect: false,
        feedback: {
          en: 'Incorrect. While lucky consumers who actually secure bread gain, many consumers leave empty-handed due to shortages, and producers suffer severe losses, causing a net deadweight loss to society.',
          zh: '错误。尽管极少数买到低价面包的幸运儿确实受益，但大量排队家庭空手而归，生产商利润暴跌，社会总剩余净缩水，产生不可逆的无谓损失。'
        }
      }
    ],
    hint: {
      en: 'A price ceiling is a maximum legal price. If the ceiling is placed BELOW the equilibrium price ($35 < $50), it is "binding" and prevents the price from reaching equilibrium.',
      zh: '价格上限是法律允许的最高价。当设在均衡价格下方（$35 < $50）时，该管制是有约束力的（Binding），它强行阻碍了市场自发出清。'
    },
    stepByStepExplanation: [
      {
        en: 'Step 1: Check binding condition: Price ceiling of $35 < Equilibrium price of $50, so the ceiling is BINDING (effective).',
        zh: '第一步：判断管制是否有效：法定最高限价 $35 < 市场自发均衡价 $50，因此该上限具有法律约束力（Binding）。'
      },
      {
        en: 'Step 2: Compare quantities: Lower price encourages consumers (Qd expands to 65), but discourages suppliers (Qs contracts to 35).',
        zh: '第二步：比较供求数量：低价刺激了需求量（Qd 增至 65），但重挫了供应量（Qs 骤降至 35）。'
      },
      {
        en: 'Step 3: Actual volume & DWL: Market transactions equal min(Qd, Qs) = 35. Mutually beneficial trades between Q = 35 and Q = 50 are destroyed, creating deadweight loss.',
        zh: '第三步：实际成交量与 DWL：实际成交量取决于短板 min(Qd, Qs) = 35。原先在 35 到 50 之间原本能够互利双赢的交易被硬生生阻断，形成了无谓损失三角形。'
      }
    ],
    keyTakeaway: {
      en: 'Binding price ceilings set below equilibrium cause shortages, non-price rationing queues, black markets, and deadweight loss.',
      zh: '低于均衡价格的有约束力价格上限必然引发商品短缺、排队配给、黑市交易与社会无谓损失。'
    }
  },
  {
    id: 'learn-lump-sum-vs-per-unit',
    topicId: 'cost-curves-short-run',
    modelId: 'cost-curves-short-run',
    unit: 3,
    title: {
      en: 'Cost Curves: Lump-Sum Tax vs Per-Unit Tax Behavior',
      zh: '短期成本曲线：一次性定额税与从量单位税的本质区别'
    },
    scenario: {
      en: 'A manufacturing firm produces at current cost curves. The city government decides to double the annual fixed facility licensing fee from $120 to $220 as a lump-sum levy, regardless of how many units the firm produces.',
      zh: '一家制造企业正在运营。市政府决定将企业的年度营业执照固定规费由 $120 翻倍上调至 $220。该税费为一次性定额征收（Lump-Sum），与企业的实际产量完全无关。'
    },
    graphInitialParams: {
      fixedCost: 120,
      perUnitTax: 0,
      chosenQuantity: 24,
      showAFC: true,
      showAVC: true,
      showATC: true,
      showMC: true
    },
    graphTargetParams: {
      fixedCost: 220,
      perUnitTax: 0,
      chosenQuantity: 24,
      showAFC: true,
      showAVC: true,
      showATC: true,
      showMC: true
    },
    predictionPrompt: {
      en: 'Which cost curves will shift upward, and what happens to the firm\'s profit-maximizing output level in the short run?',
      zh: '哪几条成本曲线会向上平移？企业在短期内的利润最大化最优产量（Q*）会发生什么改变？'
    },
    options: [
      {
        id: 'opt-a',
        label: {
          en: 'Only AFC and ATC shift upward; MC and AVC remain completely unchanged. The firm\'s profit-maximizing output does NOT change in the short run!',
          zh: '仅有 AFC 和 ATC 向上垂直平移；MC 与 AVC 完全保持不变。企业短期利润最大化产量（Q*）完全不发生改变！'
        },
        isCorrect: true,
        feedback: {
          en: 'Brilliant! A lump-sum tax increases Total Fixed Cost (TFC). Because fixed costs do not vary with output, Marginal Cost (ΔTC/ΔQ) and AVC are unaffected. Since profit maximization is governed by MR = MC, output remains unchanged in the short run!',
          zh: '完全正确！定额税增加的是总固定成本（TFC）。由于固定成本不随产量变化而变动，其导数边际成本 MC（ΔTC/ΔQ）和平均可变成本 AVC 完全不受影响。企业依然按 MR = MC 生产，因此短期最优产量岿然不动！'
        }
      },
      {
        id: 'opt-b',
        label: {
          en: 'All four curves (MC, ATC, AVC, AFC) shift upward, causing the firm to immediately cut output.',
          zh: '四条曲线（MC、ATC、AVC、AFC）同时向上平移，促使企业立即削减生产规模。'
        },
        isCorrect: false,
        feedback: {
          en: 'Incorrect. This describes a PER-UNIT tax (excise tax), not a lump-sum tax. Per-unit taxes increase variable cost and shift MC.',
          zh: '错误。这描述的是“从量单位税（Per-Unit Tax）”的特征，而非定额税。从量税增加的是可变成本，因此才会使 MC 平移。'
        }
      },
      {
        id: 'opt-c',
        label: {
          en: 'Only Marginal Cost (MC) shifts upward, so the firm produces less output.',
          zh: '仅有边际成本（MC）向上移动，导致企业减产。'
        },
        isCorrect: false,
        feedback: {
          en: 'Incorrect. Fixed costs do not affect Marginal Cost. d(Fixed Cost)/dQ is always zero!',
          zh: '错误。固定成本决不会影响边际成本。固定成本对产量的导数 d(FC)/dQ 恒等于零！'
        }
      }
    ],
    hint: {
      en: 'Remember the economic definition of Marginal Cost: MC = ΔVariable Cost / ΔQ. Does an annual licensing fee change when you make 1 extra unit of output?',
      zh: '牢记边际成本的定义：MC = Δ总成本 / ΔQ = Δ可变成本 / ΔQ。多生产 1 件产品，需要多缴年度执照费吗？显然不需要！'
    },
    stepByStepExplanation: [
      {
        en: 'Step 1: Identify the nature of the cost: An annual fixed fee is a Fixed Cost (TFC). It does not change with output Q.',
        zh: '第一步：辨析成本性质：营业执照规费属于固定成本（TFC），不随产量的增减而变动。'
      },
      {
        en: 'Step 2: Check Average curves: AFC = TFC/Q rises, and ATC = AFC + AVC rises by the exact same vertical distance.',
        zh: '第二步：检查平均成本：AFC = TFC/Q 上升，ATC = AFC + AVC 向上平移相同的垂直距离。'
      },
      {
        en: 'Step 3: Check Marginal curves: MC measures the additional cost of producing ONE more unit. Since the fee does not change with an extra unit, ΔTFC/ΔQ = 0. MC and AVC are unaffected. Since MR = MC determines output, Q* remains identical!',
        zh: '第三步：检查边际成本：MC 衡量多产一单位增加的成本。由于多产一件规费不增加，边际成本 MC 和 AVC 纹丝不动。MR = MC 的交点不变，短期最优产量完全不变！'
      }
    ],
    keyTakeaway: {
      en: 'Lump-sum taxes affect AFC, ATC, and profit, but NEVER affect MC, AVC, or short-run output. Per-unit taxes affect MC, AVC, ATC, and reduce output.',
      zh: '一次性定额税改变 AFC、ATC 和净利润，但绝不改变 MC、AVC 或短期产量。从量单位税改变 MC、AVC、ATC，并必然导致减产。'
    }
  },
  {
    id: 'learn-monopoly-first-degree',
    topicId: 'monopoly-price-discrimination',
    modelId: 'monopoly-single-price',
    unit: 4,
    title: {
      en: 'Price Discrimination: What Happens When Monopoly Perfectly Price Discriminates?',
      zh: '价格歧视：当垄断企业实施完全一级价格歧视时会发生什么？'
    },
    scenario: {
      en: 'An unregulated single-price monopoly currently restricts output to Qm = 36 and charges Pm = $64, generating deadweight loss. Using advanced big-data algorithms, the monopolist now charges each consumer their exact willingness to pay.',
      zh: '一家单一定价垄断企业目前限制产量在 Qm = 36，并索取高价 Pm = $64，产生显著无谓损失。利用大数据算法，该垄断厂商现在对每位消费者按其最大心理支付意愿逐一单独定价。'
    },
    graphInitialParams: {
      demandIntercept: 100,
      demandSlope: -1.0,
      mcSlope: 0.5,
      fixedCost: 180,
      isPriceDiscrimination: false,
      regulationType: 'none'
    },
    graphTargetParams: {
      demandIntercept: 100,
      demandSlope: -1.0,
      mcSlope: 0.5,
      fixedCost: 180,
      isPriceDiscrimination: true,
      regulationType: 'none'
    },
    predictionPrompt: {
      en: 'What will happen to the Marginal Revenue curve, Consumer Surplus, and Deadweight Loss under perfect (first-degree) price discrimination?',
      zh: '在完全（一级）价格歧视下，边际收益（MR）曲线、消费者剩余（CS）以及社会无谓损失（DWL）将分别发生什么改变？'
    },
    options: [
      {
        id: 'opt-a',
        label: {
          en: 'MR curve becomes identical to the Demand curve; Consumer Surplus drops to $0 (all converted to monopoly profit); Deadweight Loss is eliminated (DWL = $0)!',
          zh: 'MR 曲线与需求曲线 D 完全重合；消费者剩余归零（全部被掠夺转化为垄断利润）；无谓损失完全消除（DWL = $0）！'
        },
        isCorrect: true,
        feedback: {
          en: 'Spot on! Because the firm can charge each customer their exact willingness to pay without cutting price on previous units, MR = Price = Demand. The firm produces up to MR = MC, which is also P = MC (allocative efficiency, DWL = 0), capturing all surplus as profit.',
          zh: '完全正确！由于厂商按每位买家的最高意愿单独收费且无需为增产而对之前客户降价，MR 与需求曲线 D 完全重合。厂商生产直至 MR = MC，此时恰好也是 P = MC（达到配置效率，DWL 归零），但全社会的所有剩余全部被厂商化为利润。'
        }
      },
      {
        id: 'opt-b',
        label: {
          en: 'Consumer Surplus increases because more consumers are able to buy the good.',
          zh: '消费者剩余大幅上升，因为更多消费者能够买到该商品。'
        },
        isCorrect: false,
        feedback: {
          en: 'Incorrect. Although more consumers receive the good, every single buyer pays their absolute maximum willingness to pay, leaving Consumer Surplus = $0.',
          zh: '错误。虽然买到商品的消费者人数确实变多了，但每位买家都付出了其最高心理价位（支付意愿减去售价 = 0），消费者剩余完全归零。'
        }
      },
      {
        id: 'opt-c',
        label: {
          en: 'Deadweight loss doubles because the monopoly exercises even more market power.',
          zh: '无谓损失翻倍增加，因为垄断企业的市场操纵力量变得更加极端。'
        },
        isCorrect: false,
        feedback: {
          en: 'Counter-intuitive but false! Because output expands all the way to where willingness to pay equals marginal cost, no mutually beneficial trades are left unexploited, so DWL is ZERO.',
          zh: '反直觉但错误！因为产量一路扩张到了支付意愿等于边际成本处，所有具有社会价值的互利交易全部被生产并成交，因此社会无谓损失为零。'
        }
      }
    ],
    hint: {
      en: 'Does the monopolist have to lower the price on previously sold units to sell an extra unit under first-degree price discrimination? No! Each unit is sold at its own price.',
      zh: '在一级价格歧视下，垄断者为了多卖 1 件产品，需要对之前买入的客户降价吗？不需要！每件产品都按其独立价位成交。'
    },
    stepByStepExplanation: [
      {
        en: 'Step 1: In single-price monopoly, MR lies below Demand because to sell more, price must be lowered on ALL units.',
        zh: '第一步：在单一定价垄断中，MR 位于需求线下方，因为若要多卖产品，必须对所有已售单位统一降价。'
      },
      {
        en: 'Step 2: Under perfect price discrimination, the firm charges each buyer their exact willingness to pay. Hence, MR = Demand.',
        zh: '第二步：在完全价格歧视下，每位买家都被索取最大支付意愿，厂商多卖一件得到的收益就是该件的售价，因此 MR 与 Demand 完全重合。'
      },
      {
        en: 'Step 3: Profit maximization rule MR = MC leads to producing Q = 60 (where Demand cuts MC). All consumer surplus is transformed into monopoly profit, but DWL disappears.',
        zh: '第三步：按 MR = MC 生产导致产量扩张至 60（需求曲线与 MC 相交处）。全社会消费者剩余被全部抽干转化为垄断利润，但社会净死重损失彻底消失。'
      }
    ],
    keyTakeaway: {
      en: 'Perfect price discrimination eliminates deadweight loss and achieves allocative efficiency (P = MC), but transfers 100% of consumer surplus into producer surplus.',
      zh: '完全价格歧视消除了无谓损失并达成了配置效率（P = MC），但将全社会的消费者剩余 100% 剥夺并转化为生产者超额利润。'
    }
  },
  {
    id: 'learn-monopsony-minimum-wage',
    topicId: 'monopsony-factor-market',
    modelId: 'monopsony-factor-market',
    unit: 5,
    title: {
      en: 'Monopsony: The Unique Power of Minimum Wage to EXPAND Employment',
      zh: '买方垄断：最低工资政策神奇“增加就业人数”的经济学反常'
    },
    scenario: {
      en: 'A massive mining firm is the sole employer in an isolated mountain town. Currently, it hires where MRP = MFC (7.8 workers) and pays a depressed wage of $21.70/hr. The government imposes a binding minimum wage of $37/hr.',
      zh: '某偏远矿区仅有一家大型采矿集团（劳动力市场的买方垄断者）。目前其按 MRP = MFC 仅雇佣 7.8 名矿工，并压低工资至 $21.70/小时。政府强制出台法定最低工资 $37/小时。'
    },
    graphInitialParams: {
      marketStructure: 'monopsony',
      laborProductPrice: 5,
      marginalProductBase: 24,
      mpDiminishingRate: 1.2,
      minWageRate: 0
    },
    graphTargetParams: {
      marketStructure: 'monopsony',
      laborProductPrice: 5,
      marginalProductBase: 24,
      mpDiminishingRate: 1.2,
      minWageRate: 37
    },
    predictionPrompt: {
      en: 'Unlike in a competitive labor market where minimum wage causes unemployment, what happens to employment (L) in this monopsony when the minimum wage is set equal to the competitive wage?',
      zh: '与完全竞争市场中最低工资必然造成失业完全相反，当买方垄断市场设立等于竞争工资的法定最低工资时，雇佣人数（L）会发生什么变化？'
    },
    options: [
      {
        id: 'opt-a',
        label: {
          en: 'Employment INCREASES (from 7.8 to 18 workers) and wages rise simultaneously!',
          zh: '雇佣人数显著增加（从 7.8 人增加到 18 人），工人工资同时大幅上升！'
        },
        isCorrect: true,
        feedback: {
          en: 'Correct! In monopsony, the employer kept hiring low because adding a worker previously forced higher wages for all existing workers (making MFC > Wage). A minimum wage makes MFC perfectly flat at $37, removing the disincentive to hire and expanding employment to the competitive level!',
          zh: '完全正确！在买方垄断中，雇主之前故意压制招工，是因为每多雇一人就必须给现有全员加薪（导致 MFC 陡峭高于工资）。法定最低工资强制将受控区间的边际要素成本线削平在 $37，消除了雇主压低产量的动力，使就业人数激增至社会有效水平！'
        }
      },
      {
        id: 'opt-b',
        label: {
          en: 'Employment drops drastically because the firm can no longer afford the higher wage bill.',
          zh: '雇佣人数大幅暴跌，因为企业无法承受高昂的工资支出。'
        },
        isCorrect: false,
        feedback: {
          en: 'Incorrect. This only happens in competitive labor markets. In monopsony, a well-chosen minimum wage actually expands employment.',
          zh: '错误。这只有在“完全竞争劳动力市场”中才会发生。在买方垄断市场中，适度的最低工资反而会反常地扩大就业。'
        }
      },
      {
        id: 'opt-c',
        label: {
          en: 'Employment remains unchanged because monopsonies never alter hiring decisions.',
          zh: '雇佣人数完全不变，因为垄断买家从不改变其雇佣决策。'
        },
        isCorrect: false,
        feedback: {
          en: 'Incorrect. The minimum wage fundamentally alters the slope and shape of the Marginal Factor Cost (MFC) curve facing the firm.',
          zh: '错误。最低工资彻底重构了雇主面对的边际要素成本（MFC）曲线的形态与水平，必然改变雇佣决策。'
        }
      }
    ],
    hint: {
      en: 'Why did the monopsonist restrict hiring originally? Because MFC was much higher than the wage. What happens to MFC when the government dictates that the wage is fixed at $37 regardless of how many people are hired?',
      zh: '买方垄断最初为何故意少招人？因为 MFC 远远高于工资。当政府硬性规定招多少人工资都统一为 $37 时，增聘工人的额外成本（MFC）会变成怎样？变平成水平线！'
    },
    stepByStepExplanation: [
      {
        en: 'Step 1: The unregulated monopsonist faces an upward-sloping Labor Supply curve, so MFC > S_L. It restricts hiring to 7.8 workers to keep wages at $21.70.',
        zh: '第一步：未管制的买方垄断面对向上倾斜的劳动供给线，增聘需加薪导致 MFC > 劳动供给线。它刻意将雇工压制在 7.8 人以将工资打压至 $21.70。'
      },
      {
        en: 'Step 2: Imposing a minimum wage of $37 means the firm can hire up to 18 workers at exactly $37 each without raising wages on previous workers. MFC becomes horizontal at $37.',
        zh: '第二步：设定 $37 的法定最低工资意味着在该工资水平下，企业招募多达 18 名工人的每人成本恒为 $37，无需额外加薪。受控区间内 MFC 变为平直水平线。'
      },
      {
        en: 'Step 3: The firm hires where MRP = MFC ($37), expanding employment from 7.8 to 18 workers, achieving allocative efficiency in factor markets!',
        zh: '第三步：企业在 MRP = MFC（$37）处雇佣，就业人数从 7.8 人激增至 18 人，神奇达成了要素市场的配置最优！'
      }
    ],
    keyTakeaway: {
      en: 'AP Exam Classic: A binding minimum wage causes unemployment in competitive markets, but can INCREASE both wages and employment in a monopsony.',
      zh: 'AP 考试必考经典反差：有约束力的最低工资在竞争性劳动力市场造成失业，但在买方垄断市场中却能“同时提高工资与增进就业”！'
    }
  },
  {
    id: 'learn-negative-externality-tax',
    topicId: 'negative-externalities',
    modelId: 'negative-externalities',
    unit: 6,
    title: {
      en: 'Market Failure: Restoring Efficiency via Pigouvian Pollution Tax',
      zh: '市场失灵：利用庇古单位税完美消除污染外部性死重损失'
    },
    scenario: {
      en: 'A chemical plant produces fertilizers. The production process releases toxic effluents into a communal river, imposing a Marginal External Cost (MEC) of $24 per unit on downstream communities. The unregulated free market overproduces at Qm = 40.',
      zh: '一家化工厂生产化肥。生产过程中向公共河流排放有毒污水，给下游居民造成每单位产品 $24 的边际外部损害成本（MEC）。未经管制的自由市场过度生产至 Qm = 40。'
    },
    graphInitialParams: {
      externalityType: 'negative_production',
      externalityMagnitude: 24,
      correctivePolicyActive: false
    },
    graphTargetParams: {
      externalityType: 'negative_production',
      externalityMagnitude: 24,
      correctivePolicyActive: true
    },
    predictionPrompt: {
      en: 'To achieve the socially optimal output (Q_opt = 28) and eliminate the deadweight loss triangle, what type and magnitude of government tax should be enacted?',
      zh: '为了使产量压缩至社会最优配置水平（Q_opt = 28）并消除无谓损失三角形，政府应实施何种类型与额度的税收干预？'
    },
    options: [
      {
        id: 'opt-a',
        label: {
          en: 'A per-unit Pigouvian tax equal to Marginal External Cost (T = MEC = $24), shifting private supply MPC upward to coincide with MSC.',
          zh: '征收精确等于边际外部成本的单位庇古税（T = MEC = $24），推动私人边际成本 MPC 向上平移并与社会边际成本 MSC 重合。'
        },
        isCorrect: true,
        feedback: {
          en: 'Correct! A per-unit tax of $24 forces the polluter to internalize the full social damage of its production. The effective supply curve shifts up by $24 to MSC, output contracts to the socially efficient quantity (28 units), and deadweight loss becomes $0.',
          zh: '完全正确！每单位 $24 的从量税迫使排污企业将外部社会成本完全内部化。有效供给线向上平移 $24 与 MSC 重合，产量被压缩至社会最优水平（28 单位），死重损失降为 $0。'
        }
      },
      {
        id: 'opt-b',
        label: {
          en: 'An annual lump-sum tax of $24,000 on the factory.',
          zh: '对化工厂征收每年 $24,000 的一次性定额环境规费。'
        },
        isCorrect: false,
        feedback: {
          en: 'Incorrect. As learned in Unit 3, lump-sum taxes do not change Marginal Cost (MC), so they do not reduce pollution or output in the short run.',
          zh: '错误。正如第三单元所学，定额税绝不改变边际成本（MC），因此无法在短期内迫使企业削减产量或减少排污。'
        }
      },
      {
        id: 'opt-c',
        label: {
          en: 'A per-unit subsidy of $24 paid to consumers.',
          zh: '向购买化肥的农民消费者发放每单位 $24 的财政补贴。'
        },
        isCorrect: false,
        feedback: {
          en: 'Incorrect. Subsidizing a good with negative externalities would expand demand and worsen overproduction and pollution!',
          zh: '错误。补贴具有负外部性的商品会刺激消费需求，导致过度生产和污染进一步恶化！'
        }
      }
    ],
    hint: {
      en: 'The goal of corrective environmental policy is to internalize the externality so that Private Cost + Tax = Social Cost.',
      zh: '纠正性环境政策的终极目标是将外部性“内部化”，使得：私人成本 + 单位税 = 社会真实总成本。'
    },
    stepByStepExplanation: [
      {
        en: 'Step 1: Free market produces where Marginal Private Benefit (MPB) equals Marginal Private Cost (MPC) at Qm = 40.',
        zh: '第一步：自由市场在私人边际收益（MPB）等于私人边际成本（MPC）处生产，产生 Qm = 40。'
      },
      {
        en: 'Step 2: Social efficiency requires Marginal Social Benefit (MSB) = Marginal Social Cost (MSC), yielding Q_opt = 28. Overproduction of 12 units creates DWL.',
        zh: '第二步：社会有效配置要求社会收益（MSB）等于社会成本（MSC），即 Q_opt = 28。自由市场过度生产了 12 个单位，造成死重损失。'
      },
      {
        en: 'Step 3: Setting a per-unit Pigouvian tax T = MEC = $24 shifts the firm\'s MPC upward by $24. The new market equilibrium lands exactly at Q_opt = 28, completely erasing the deadweight loss!',
        zh: '第三步：征收 T = MEC = $24 的庇古从量税，使私人供给线向上平移 $24。新的市场均衡恰好落在 Q_opt = 28 处，彻底消除了全部无谓损失！'
      }
    ],
    keyTakeaway: {
      en: 'Pigouvian Prescription: Negative externalities require a per-unit corrective TAX equal to MEC; positive externalities require a per-unit corrective SUBSIDY equal to MEB.',
      zh: '庇古处方定量黄金定律：负面外部性必须征收等于 MEC 的“单位纠正税”；正面外部性必须发放等于 MEB 的“单位纠正补贴”。'
    }
  }
];
