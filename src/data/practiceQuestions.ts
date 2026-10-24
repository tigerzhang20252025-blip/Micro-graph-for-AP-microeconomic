import { BilingualText } from '../types/registry';

export interface PracticeOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: BilingualText;
  explanation: BilingualText;
}

export interface PracticeQuestion {
  id: string;
  unit: number;
  topicCode: string;
  topicId: string;
  prompt: BilingualText;
  scenario?: BilingualText;
  options: PracticeOption[];
  correctOptionId: 'A' | 'B' | 'C' | 'D';
  overallExplanation: BilingualText;
  commonMistakeAlert?: BilingualText;
  examTip?: BilingualText;
  isDynamic?: boolean;
  templateId?: string;
}

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // ==========================================
  // UNIT 1: Basic Economic Concepts
  // ==========================================
  {
    id: 'mcq-1-ppc-opp-cost',
    unit: 1,
    topicCode: '1.3',
    topicId: 'ppc-model',
    prompt: {
      en: 'An economy produces only two goods: Solar Panels and Wind Turbines. Moving from production combination (10 Solar Panels, 50 Wind Turbines) to (20 Solar Panels, 35 Wind Turbines), what is the opportunity cost per additional Solar Panel produced?',
      zh: '某经济体仅生产两种物品：太阳能板与风力发电机。当生产组合由（10 块太阳能板，50 台风机）变为（20 块太阳能板，35 台风机）时，每多生产 1 块太阳能板的机会成本是多少？'
    },
    options: [
      {
        id: 'A',
        text: { en: '1.5 Wind Turbines', zh: '1.5 台风力发电机' },
        explanation: {
          en: 'Correct! Producing 10 more Solar Panels (20 - 10) requires giving up 15 Wind Turbines (50 - 35). The per-unit opportunity cost is 15 / 10 = 1.5 Wind Turbines.',
          zh: '回答正确！增产 10 块太阳能板（20 - 10）必须放弃 15 台风机（50 - 35）。单位机会成本为 15 / 10 = 1.5 台风机。'
        }
      },
      {
        id: 'B',
        text: { en: '0.67 Wind Turbines', zh: '0.67 台风力发电机' },
        explanation: {
          en: 'Incorrect. 10 / 15 = 0.67 is the opportunity cost of producing 1 Wind Turbine, which inverts the ratio.',
          zh: '错误。10 / 15 = 0.67 是多生产 1 台风机的机会成本，将分子分母颠倒了。'
        }
      },
      {
        id: 'C',
        text: { en: '15 Wind Turbines', zh: '15 台风力发电机' },
        explanation: {
          en: 'Incorrect. 15 is the TOTAL opportunity cost for all 10 solar panels, not the per-unit cost.',
          zh: '错误。15 是增产 10 块太阳能板的总机会成本，并非每单位额外机会成本。'
        }
      },
      {
        id: 'D',
        text: { en: '35 Wind Turbines', zh: '35 台风力发电机' },
        explanation: {
          en: 'Incorrect. 35 is the remaining quantity of wind turbines produced, not the forgone amount.',
          zh: '错误。35 是剩余的风机产量，而非牺牲放弃的产量。'
        }
      }
    ],
    correctOptionId: 'A',
    overallExplanation: {
      en: 'Opportunity Cost = What is Given Up / What is Gained. Here: ΔWind Turbines / ΔSolar Panels = 15 / 10 = 1.5 Wind Turbines per Solar Panel.',
      zh: '机会成本公式 = 牺牲放弃的产量 / 增加获得的产量。本题为：Δ风机 / Δ太阳能板 = 15 / 10 = 1.5 台风机/板。'
    },
    commonMistakeAlert: {
      en: 'Always read whether the question asks for TOTAL opportunity cost or PER-UNIT opportunity cost!',
      zh: '务必仔细审题是询问“总机会成本”还是“每单位额外机会成本”！'
    }
  },
  {
    id: 'mcq-1-comparative-trade',
    unit: 1,
    topicCode: '1.4',
    topicId: 'comparative-advantage',
    prompt: {
      en: 'Country Alpha can produce 1 Car or 2 tons of Grain with one unit of labor. Country Beta can produce 1 Car or 4 tons of Grain with one unit of labor. Which of the following terms of trade will be mutually beneficial to both nations?',
      zh: '阿尔法国家投入 1 单位劳动力可生产 1 辆汽车或 2 吨粮食；贝塔国家投入 1 单位劳动力可生产 1 辆汽车或 4 吨粮食。下列哪一项贸易比率能够使两国互利共赢？'
    },
    options: [
      {
        id: 'A',
        text: { en: '1 Car for 1.5 tons of Grain', zh: '1 辆汽车换 1.5 吨粮食' },
        explanation: {
          en: 'Incorrect. Alpha will not trade because it can already produce 2 tons of Grain per Car domestically (1.5 < 2).',
          zh: '错误。阿尔法国内生产 1 辆车的成本即为 2 吨粮食，接受 1.5 吨粮食会蒙受净亏损。'
        }
      },
      {
        id: 'B',
        text: { en: '1 Car for 3.0 tons of Grain', zh: '1 辆汽车换 3.0 吨粮食' },
        explanation: {
          en: 'Correct! The mutually beneficial terms of trade must lie strictly between the two domestic opportunity costs: 2 Grains < 1 Car < 4 Grains. At 3.0 Grains, Alpha gains +1 Grain and Beta saves 1 Grain!',
          zh: '回答正确！互利贸易条件必须严格介于两国的国内机会成本之间：2 吨粮食 < 1 辆汽车 < 4 吨粮食。在 1 车换 3 吨粮食的比率下，阿尔法多赚 1 吨，贝塔节省 1 吨！'
        }
      },
      {
        id: 'C',
        text: { en: '1 Car for 5.0 tons of Grain', zh: '1 辆汽车换 5.0 吨粮食' },
        explanation: {
          en: 'Incorrect. Beta will refuse this trade because it can produce 1 Car domestically for only 4 tons of Grain (5 > 4).',
          zh: '错误。贝塔国家将拒绝该贸易，因为其国内自主生产 1 辆车只需消耗 4 吨粮食成本。'
        }
      },
      {
        id: 'D',
        text: { en: '1 Car for 2.0 tons of Grain', zh: '1 辆汽车换 2.0 吨粮食' },
        explanation: {
          en: 'Incorrect. At the domestic opportunity cost boundary, Alpha enjoys zero gains from trade.',
          zh: '错误。恰好处于边界时，阿尔法国家未获得任何额外贸易分工增益。'
        }
      }
    ],
    correctOptionId: 'B',
    overallExplanation: {
      en: 'The Terms of Trade for 1 unit of Good X must lie strictly between the opportunity costs of the exporter and the importer: 2 Grains < Terms of Trade < 4 Grains.',
      zh: '互利贸易条件必须严格介于出口国与进口国各自的国内机会成本之间：2 吨粮食 < 贸易比价 < 4 吨粮食。'
    }
  },
  {
    id: 'mcq-1-utility-equi-marginal',
    unit: 1,
    topicCode: '1.6',
    topicId: 'marginal-analysis-utility',
    prompt: {
      en: 'A student has a fixed budget to spend on Tacos (Price = $3) and Smoothies (Price = $6). At the current consumption bundle, the marginal utility of the last Taco is 15 utils, and the marginal utility of the last Smoothie is 24 utils. To maximize total utility, how should the student adjust consumption?',
      zh: '某学生有固定预算购买卷饼（单价 $3）与果昔（单价 $6）。在当前消费组合下，最后一件卷饼的边际效用为 15 效用，最后一件果昔的边际效用为 24 效用。为实现总效用最大化，该学生应如何调整消费？'
    },
    options: [
      {
        id: 'A',
        text: { en: 'Consume more Tacos and fewer Smoothies.', zh: '增加购买卷饼，减少购买果昔。' },
        explanation: {
          en: 'Correct! Calculate MU/P: For Tacos, MU/P = 15 / 3 = 5 utils/$. For Smoothies, MU/P = 24 / 6 = 4 utils/$. Because Tacos provide higher utility per dollar (5 > 4), shifting spending toward Tacos increases total satisfaction.',
          zh: '回答正确！计算每美元边际效用 MU/P：卷饼 MU/P = 15 / 3 = 5 效用/美元；果昔 MU/P = 24 / 6 = 4 效用/美元。因为花在卷饼上的最后一美元更划算（5 > 4），增购卷饼减购果昔必能提升总效用。'
        }
      },
      {
        id: 'B',
        text: { en: 'Consume more Smoothies and fewer Tacos.', zh: '增加购买果昔，减少购买卷饼。' },
        explanation: {
          en: 'Incorrect. Although Smoothies have a higher raw MU (24 > 15), their higher price ($6 vs $3) makes their utility per dollar lower (4 < 5).',
          zh: '错误。尽管果昔的原始绝对边际效用更高（24 > 15），但其单价更贵（$6），导致每美元性价比更低（4 < 5）。'
        }
      },
      {
        id: 'C',
        text: { en: 'Maintain the current bundle because total utility is already maximized.', zh: '保持当前组合不变，因为总效用已最大化。' },
        explanation: {
          en: 'Incorrect. Total utility is maximized only when MU_T / P_T = MU_S / P_S. Here 5 ≠ 4, so reallocating spending increases utility.',
          zh: '错误。效用最大化必须满足 MU_T / P_T = MU_S / P_S。当前 5 ≠ 4，重新调整分配必然增进福利。'
        }
      },
      {
        id: 'D',
        text: { en: 'Spend the entire budget exclusively on Smoothies.', zh: '将全部预算毫无保留全部购买果昔。' },
        explanation: {
          en: 'Incorrect. Diminishing marginal utility would cause MU of Smoothies to fall even further.',
          zh: '错误。随着购买增加，边际效用递减规律会使果昔的边际效用进一步暴跌。'
        }
      }
    ],
    correctOptionId: 'A',
    overallExplanation: {
      en: 'The Equi-Marginal Rule dictates: If MU_x / P_x > MU_y / P_y, the consumer should increase consumption of Good X and decrease consumption of Good Y until ratios equalize.',
      zh: '等边际法则黄金定律：若 MU_x / P_x > MU_y / P_y，消费者应多买 X、少买 Y，直至两者的每美元边际效用相等。'
    }
  },

  // ==========================================
  // UNIT 2: Supply and Demand
  // ==========================================
  {
    id: 'mcq-2-ped-tr-test',
    unit: 2,
    topicCode: '2.3',
    topicId: 'price-elasticity-demand',
    prompt: {
      en: 'If a coffee shop owner cuts the price of iced lattes by 10% and finds that Total Revenue from iced lattes increases by 15%, what can be concluded about the demand for iced lattes over this price range?',
      zh: '如果一家咖啡店将冰拿铁的售价下调 10%，结果发现冰拿铁的总销售额（总收益 TR）增加了 15%，那么在这一价格区间内，对冰拿铁的需求具有什么特征？'
    },
    options: [
      {
        id: 'A',
        text: { en: 'Demand is price elastic (|PED| > 1).', zh: '需求富有价格弹性（|PED| > 1）。' },
        explanation: {
          en: 'Correct! By the Total Revenue Test, when Price falls (P ↓) and Total Revenue rises (TR ↑), the percentage quantity gain outweighs the price cut (%ΔQ > %ΔP), proving demand is elastic.',
          zh: '回答正确！根据总收益测试法（Total Revenue Test）：当价格下降（P↓）而总收益增加（TR↑）时，说明数量扩张的百分比大于降价的百分比（%ΔQ > %ΔP），需求富有弹性。'
        }
      },
      {
        id: 'B',
        text: { en: 'Demand is price inelastic (|PED| < 1).', zh: '需求缺乏价格弹性（|PED| < 1）。' },
        explanation: {
          en: 'Incorrect. If demand were inelastic, a price cut would cause Total Revenue to fall.',
          zh: '错误。若需求缺乏弹性，降价会导致总收益同向下降。'
        }
      },
      {
        id: 'C',
        text: { en: 'Demand is unit elastic (|PED| = 1).', zh: '需求为单位弹性（|PED| = 1）。' },
        explanation: {
          en: 'Incorrect. Under unit elastic demand, price cuts leave Total Revenue completely unchanged.',
          zh: '错误。在单位弹性下，价格变动完全不改变总收益（TR 保持不变）。'
        }
      },
      {
        id: 'D',
        text: { en: 'Cross-price elasticity is negative.', zh: '交叉价格弹性为负。' },
        explanation: {
          en: 'Incorrect. The question concerns own-price elasticity of demand, not cross-price responses to other goods.',
          zh: '错误。本题考察自身价格弹性，与其它商品的交叉价格弹性无关。'
        }
      }
    ],
    correctOptionId: 'A',
    overallExplanation: {
      en: 'Total Revenue Test Rule: In the elastic region (|PED| > 1), Price and Total Revenue move in OPPOSITE directions. In the inelastic region (|PED| < 1), Price and Total Revenue move in the SAME direction.',
      zh: '总收益测试黄金法则：富有弹性区间（|PED| > 1），P 与 TR 反向变动；缺乏弹性区间（|PED| < 1），P 与 TR 同向变动。'
    }
  },
  {
    id: 'mcq-2-tax-incidence-elasticity',
    unit: 2,
    topicCode: '2.8',
    topicId: 'gov-intervention-taxes-deadweight',
    prompt: {
      en: 'Suppose the demand for insulin is perfectly inelastic with respect to price, while the supply of insulin is upward-sloping. If a per-unit excise tax of $10 is placed on the sellers of insulin, what is the economic burden (incidence) of the tax?',
      zh: '假定胰岛素的需求价格弹性为完全缺乏弹性（垂直线），而胰岛素的供给曲线向右上倾斜。如果政府对胰岛素销售商征收每单位 $10 的消费税，该税收的实际经济负担（税负归宿）将如何分配？'
    },
    options: [
      {
        id: 'A',
        text: { en: 'Buyers bear 100% of the tax burden; market price rises by the full $10.', zh: '买方承担 100% 全部税负；市场售价恰好完整上涨 $10。' },
        explanation: {
          en: 'Correct! When demand is perfectly inelastic (|PED| = 0), buyers are entirely unresponsive to price changes. Sellers pass the entire $10 tax forward to consumers with zero quantity contraction and zero deadweight loss!',
          zh: '回答正确！当需求完全缺乏弹性（|PED| = 0）时，买方对价格变化完全无法做出替代规避。销售方能够将 $10 税款完全转嫁给消费者，销售量不缩水且无死重损失！'
        }
      },
      {
        id: 'B',
        text: { en: 'Sellers bear 100% of the tax burden because the statutory tax is placed on them.', zh: '卖方承担 100% 全部税负，因为法定纳税人是销售方。' },
        explanation: {
          en: 'Incorrect. Statutory incidence (who writes the check to the government) NEVER determines economic tax incidence (who actually pays after price adjustments).',
          zh: '错误。法定纳税人（谁向国税局汇款）绝不决定经济上的实质税负归宿（税后价格调整后的实际负担）。'
        }
      },
      {
        id: 'C',
        text: { en: 'Buyers and sellers split the $10 tax evenly ($5 each).', zh: '买卖双方各自分摊 $5 对半均分。' },
        explanation: {
          en: 'Incorrect. Taxes are only split evenly if the price elasticity of demand equals the price elasticity of supply.',
          zh: '错误。只有在供求双方价格弹性完全相等的巧合下，税负才会各自分摊一半。'
        }
      },
      {
        id: 'D',
        text: { en: 'Deadweight loss is maximized because the tax is large.', zh: '因为税额巨大，造成的无谓损失达到最大化。' },
        explanation: {
          en: 'Incorrect. Because quantity traded does NOT change when demand is perfectly inelastic (ΔQ = 0), deadweight loss is actually ZERO!',
          zh: '错误。由于完全缺乏弹性下交易量完全不缩水（ΔQ = 0），此时的无谓损失实际为零（DWL = $0）！'
        }
      }
    ],
    correctOptionId: 'A',
    overallExplanation: {
      en: 'Tax Incidence Rule: The more inelastic side of the market always bears the larger burden of an excise tax. When demand is perfectly inelastic, consumers bear 100% of the tax.',
      zh: '税负归宿黄金法则：市场上弹性越小（越缺乏弹性、替代手段越少）的一方，承担的实质税收负担比例越大。完全无弹性方承担 100% 税负。'
    }
  },
  {
    id: 'mcq-2-international-tariff-dwl',
    unit: 2,
    topicCode: '2.9',
    topicId: 'international-trade-tariffs',
    prompt: {
      en: 'A country imposes a protective import tariff on imported steel. Which of the following correctly describes the welfare impact of this tariff compared to free trade?',
      zh: '某国对进口钢铁征收保护性关税。与自由贸易相比，下列哪一项正确描述了该关税的社会福利影响？'
    },
    options: [
      {
        id: 'A',
        text: {
          en: 'Domestic producer surplus increases, government collects tariff revenue, but domestic consumer surplus drops by more, creating two deadweight loss triangles.',
          zh: '国内生产者剩余增加，政府获得关税财政收入，但国内消费者剩余蒙受更大损失，产生两个死重损失三角形。'
        },
        explanation: {
          en: 'Correct! The tariff raises domestic price to Pw + Tariff. Domestic producers expand and gain surplus; government gains rectangular tariff revenue; but consumers lose surplus equal to all gains plus production distortion and consumption distortion DWL triangles.',
          zh: '回答正确！关税使国内钢价涨至 Pw + 关税。国内钢厂增产使生产者剩余增加；政府获得关税矩形税收；但消费者的福利损失显著大于上述两项收益之和，产生生产扭曲与消费扭曲两个经典的 DWL 三角形。'
        }
      },
      {
        id: 'B',
        text: { en: 'Domestic consumer surplus increases because domestic steel industry jobs are saved.', zh: '国内消费者剩余增加，因为保护了本土钢铁工人的就业岗位。' },
        explanation: {
          en: 'Incorrect. Domestic consumers are strictly harmed by the tariff because they must pay higher prices for all steel.',
          zh: '错误。国内消费者是关税的绝对受害者，因为他们必须为所有钢铁支付更高售价。'
        }
      },
      {
        id: 'C',
        text: { en: 'Total domestic surplus increases because imports are replaced by domestic output.', zh: '国内总福利增加，因为进口被本国自主产出所取代。' },
        explanation: {
          en: 'Incorrect. Replacing low-cost foreign steel with higher-cost domestic steel represents an inefficient misallocation of resources.',
          zh: '错误。用国内高成本生产替代国外低价进口属于效率倒退的资源错配。'
        }
      },
      {
        id: 'D',
        text: { en: 'Government tariff revenue is always equal to the total loss in consumer surplus.', zh: '政府获得的关税收入永远等于消费者的总福利损失。' },
        explanation: {
          en: 'Incorrect. Tariff revenue is only one portion (the central rectangle) of the total loss in consumer surplus.',
          zh: '错误。关税税收仅是消费者福利损失的其中一部分（中间的矩形），其余部分转化为生产者剩余及死重损失。'
        }
      }
    ],
    correctOptionId: 'A',
    overallExplanation: {
      en: 'Tariffs create TWO deadweight loss triangles: (1) Production Inefficiency (subsidizing high-cost domestic production) and (2) Consumption Inefficiency (pricing consumers out of beneficial purchases).',
      zh: '关税必然产生双重死重损失三角形：（1）生产低效扭曲（以高于世界价格的成本生产）；（2）消费低效扭曲（消费者因高价被迫缩减消费）。'
    }
  },

  // ==========================================
  // UNIT 3: Production, Cost & Perfect Competition
  // ==========================================
  {
    id: 'mcq-3-shutdown-rule',
    unit: 3,
    topicCode: '3.6',
    topicId: 'shutdown-rule',
    prompt: {
      en: 'A perfectly competitive firm operates in the short run with a market price of P = $18. At its profit-maximizing output where MR = MC, the firm has Average Total Cost (ATC) = $22 and Average Variable Cost (AVC) = $15. What decision should the firm make in the short run?',
      zh: '某完全竞争企业在短期内运营，市场价格为 P = $18。在 MR = MC 的最优产量处，企业的平均总成本 ATC = $22，平均可变成本 AVC = $15。在短期内，该企业应做出什么决策？'
    },
    options: [
      {
        id: 'A',
        text: { en: 'Continue producing in the short run to minimize economic losses.', zh: '在短期内继续生产，以实现损失最小化。' },
        explanation: {
          en: 'Correct! Because Price ($18) is greater than AVC ($15), the firm earns operating revenue that fully covers all variable costs and contributes $3 per unit toward paying its unavoidable fixed costs. Shutting down would result in losing all fixed costs!',
          zh: '回答正确！因为售价（$18）高于平均可变成本（$15），企业获得的销售收入不仅能完全覆盖所有可变成本，还能每件额外拿出 $3 冲抵不可避免的固定成本。若停产则需承担全部固定成本亏损！'
        }
      },
      {
        id: 'B',
        text: { en: 'Shut down immediately because the firm is earning negative economic profit.', zh: '立即停产关闭，因为企业目前处于经济亏损状态。' },
        explanation: {
          en: 'Incorrect. Experiencing an economic loss (P < ATC) does not imply shutting down. The firm shuts down only if P < AVC.',
          zh: '错误。亏损（P < ATC）绝不等于立即停产。只有在 P < AVC（无法覆盖可变成本）时才应当立即停产。'
        }
      },
      {
        id: 'C',
        text: { en: 'Raise its product price to $22 to eliminate losses.', zh: '将产品售价提高至 $22，以彻底消除亏损。' },
        explanation: {
          en: 'Incorrect. A perfectly competitive firm is a price taker; raising its price would drop its sales to zero immediately.',
          zh: '错误。完全竞争厂商是价格接受者，单方面涨价会导致顾客瞬间全部流失，销量归零。'
        }
      },
      {
        id: 'D',
        text: { en: 'Increase output until ATC drops to $18.', zh: '继续盲目扩大产量，直到 ATC 降到 $18 为止。' },
        explanation: {
          en: 'Incorrect. Producing beyond MR = MC would mean MC > MR, which would increase total losses.',
          zh: '错误。超越 MR = MC 继续增产会导致边际成本高于边际收益（MC > MR），使亏损进一步扩大。'
        }
      }
    ],
    correctOptionId: 'A',
    overallExplanation: {
      en: 'The Short-Run Shutdown Rule: If P ≥ AVC, produce where MR = MC (Loss Minimization). If P < AVC, shut down immediately (Q = 0, Loss = Total Fixed Cost).',
      zh: '短期停产法则：若 P ≥ AVC，在 MR = MC 处继续生产（亏损最小化）；若 P < AVC，必须立即停产（Q = 0，亏损限定为固定成本）。'
    }
  },
  {
    id: 'mcq-3-pc-long-run-adjustment',
    unit: 3,
    topicCode: '3.7',
    topicId: 'perfect-competition-side-by-side',
    prompt: {
      en: 'Firms in a constant-cost perfectly competitive market are currently earning positive economic profits in the short run. Which of the following describes the long-run transition to equilibrium?',
      zh: '在成本不变的完全竞争行业中，现有企业在短期内普遍赚取正超额经济利润。下列哪一项正确描述了向长期均衡过渡的动态调整过程？'
    },
    options: [
      {
        id: 'A',
        text: {
          en: 'New firms enter the market, shifting market supply rightward, driving price down until firms earn zero economic profit (P = min ATC).',
          zh: '新企业受利润吸引相继涌入，市场供给曲线向右平移，拉低市场价格直至所有企业经济利润归零（P = min ATC）。'
        },
        explanation: {
          en: 'Correct! Free entry allows new competitors to enter whenever P > ATC. Industry supply expands rightward, depressing market price until economic profit is eliminated.',
          zh: '回答正确！完全竞争市场的自由进入壁垒为零。超额利润吸引新企业进入，全行业供给曲线右移，压低市场出清价格直至经济利润归零。'
        }
      },
      {
        id: 'B',
        text: { en: 'Existing firms exit the market, shifting market demand leftward.', zh: '现有企业退出市场，导致市场需求曲线向左平移。' },
        explanation: {
          en: 'Incorrect. Positive profits induce entry, not exit. Furthermore, firm entry shifts market supply, not market demand.',
          zh: '错误。正利润诱导进入而非退出。此外，厂商进入改变的是市场供给线，而非需求线。'
        }
      },
      {
        id: 'C',
        text: { en: 'Firms form a cartel to maintain high prices permanently.', zh: '所有企业联合组建卡特尔组织，以永久维持高价。' },
        explanation: {
          en: 'Incorrect. Perfect competition assumes numerous small firms and free entry, making collusion impossible.',
          zh: '错误。完全竞争市场拥有成千上万家小企业且自由进出，在制度上绝不可能维持合谋。'
        }
      },
      {
        id: 'D',
        text: { en: 'Market price rises further as industry output expands.', zh: '随着行业产量扩张，市场价格进一步上涨。' },
        explanation: {
          en: 'Incorrect. An increase in market supply lowers the equilibrium price.',
          zh: '错误。市场供给增加必然压低均衡价格。'
        }
      }
    ],
    correctOptionId: 'A',
    overallExplanation: {
      en: 'Long-Run Perfect Competition Rule: Free entry and exit guarantee that all firms earn zero economic profit (Normal Profit) in the long run where P = MR = MC = min ATC.',
      zh: '完全竞争长期均衡铁律：自由进出机制确保所有企业在长期只能赚取零经济利润（正常利润），均衡点满足 P = MR = MC = min ATC。'
    }
  },

  // ==========================================
  // UNIT 4: Imperfect Competition
  // ==========================================
  {
    id: 'mcq-4-monopoly-pricing',
    unit: 4,
    topicCode: '4.2',
    topicId: 'monopoly-single-price',
    prompt: {
      en: 'A pure monopolist produces with downward-sloping demand and positive marginal cost. At its current output, Marginal Revenue is $20 and Marginal Cost is $12. To maximize profit, how should the monopolist adjust output and price?',
      zh: '某纯粹垄断厂商面对向下倾斜的需求曲线与正边际成本。在当前产量水平下，边际收益 MR = $20，边际成本 MC = $12。为实现利润最大化，该垄断企业应如何调整产量与售价？'
    },
    options: [
      {
        id: 'A',
        text: { en: 'Increase output and lower the price.', zh: '增加产量，并降低销售价格。' },
        explanation: {
          en: 'Correct! Because MR > MC ($20 > $12), producing an additional unit adds more to revenue than to cost, increasing total profit. To sell a higher quantity on a downward-sloping demand curve, the firm must lower its price.',
          zh: '回答正确！因为 MR > MC（$20 > $12），增产多卖能增加净利润。在向下倾斜的需求曲线上，为了多卖产品，厂商必须顺着需求线下调售价。'
        }
      },
      {
        id: 'B',
        text: { en: 'Decrease output and raise the price.', zh: '减少产量，并提高销售价格。' },
        explanation: {
          en: 'Incorrect. Decreasing output is appropriate when MC > MR, not when MR > MC.',
          zh: '错误。只有在边际成本高于边际收益（MC > MR）时才应减产。'
        }
      },
      {
        id: 'C',
        text: { en: 'Keep output unchanged because MR is positive.', zh: '保持产量不变，因为边际收益依然为正。' },
        explanation: {
          en: 'Incorrect. Maximum profit requires MR = MC, not simply MR > 0.',
          zh: '错误。最大化利润要求 MR = MC，而不是单纯 MR > 0。'
        }
      },
      {
        id: 'D',
        text: { en: 'Set price equal to Marginal Cost ($12).', zh: '将售价直接设定为边际成本（$12）。' },
        explanation: {
          en: 'Incorrect. P = MC is the allocatively efficient competitive benchmark, not the profit-maximizing choice of an unregulated monopolist.',
          zh: '错误。P = MC 是完全竞争或社会最优价格管制的基准，绝非不受监管垄断者的利润最大化定价。'
        }
      }
    ],
    correctOptionId: 'A',
    overallExplanation: {
      en: 'The Golden Rule of Profit Maximization: If MR > MC, expand output. If MR < MC, cut output. The monopolist stops where MR = MC, then projects vertically up to the Demand curve to set price.',
      zh: '利润最大化黄金法则：若 MR > MC，扩大产量；若 MR < MC，收缩产量。在 MR = MC 处锁定最优产量后，向上投影至需求曲线（Demand）确定售价。'
    }
  },
  {
    id: 'mcq-4-game-theory-nash',
    unit: 4,
    topicCode: '4.5',
    topicId: 'oligopoly-game-theory',
    prompt: {
      en: 'In a duopoly game, Firm A and Firm B simultaneously choose between High Price and Low Price. Low Price is a strictly dominant strategy for both firms. The payoff matrix shows each firm earns $25 under (Low, Low) but could earn $50 under (High, High). What is the Nash Equilibrium and why is this a Prisoner\'s Dilemma?',
      zh: '在双头博弈中，A 公司与 B 公司同时在高价与低价之间做出抉择。“低价”是两家公司的严格占优策略。支付矩阵显示若双方都选低价各自获得 $25，若双方都选高价各自可获得 $50。该博弈的纳什均衡是什么？为什么它被称为囚徒困境？'
    },
    options: [
      {
        id: 'A',
        text: {
          en: 'Nash Equilibrium is (Low, Low); it is a Prisoner\'s Dilemma because individual rational self-interest leads to an outcome that is worse for both than mutual cooperation.',
          zh: '纳什均衡是（低价，低价）；之所以是囚徒困境，是因为双方个体理性的占优选择导致了整体收益劣于互信合作的非最优结果。'
        },
        explanation: {
          en: 'Correct! Because Low Price dominates for both, neither firm can unilaterally improve by switching. The Nash equilibrium is (Low, Low) with payoffs ($25, $25), which is strictly inferior to collusive (High, High) payoffs ($50, $50).',
          zh: '回答正确！由于低价是双方的占优策略，任何一方单方面改选都不会变好。纳什均衡点为（低价，低价，各赚 $25），严格劣于双方互信合谋的（高价，高价，各赚 $50）。'
        }
      },
      {
        id: 'B',
        text: { en: 'Nash Equilibrium is (High, High) because firms always maximize collective profits.', zh: '纳什均衡是（高价，高价），因为企业永远以追求集体总利润最大为目标。' },
        explanation: {
          en: 'Incorrect. Without binding legal contracts, each firm has a profitable incentive to cheat by slashing prices to steal the market.',
          zh: '错误。在缺乏强制约束协议下，任何一家企业都有单方面降价抢占市场的强烈背叛冲动。'
        }
      },
      {
        id: 'C',
        text: { en: 'There is no Nash Equilibrium because payoff matrices cannot be solved simultaneously.', zh: '不存在纳什均衡，因为同时博弈收益矩阵无法求解。' },
        explanation: {
          en: 'Incorrect. A dominant strategy equilibrium is always a pure Nash Equilibrium.',
          zh: '错误。由占优策略组成的决策组合必然是纯策略纳什均衡。'
        }
      },
      {
        id: 'D',
        text: { en: 'Firm A chooses High Price while Firm B chooses Low Price.', zh: 'A 公司选择高价，B 公司选择低价。' },
        explanation: {
          en: 'Incorrect. If Firm B chooses Low Price, Firm A earns more by also choosing Low Price.',
          zh: '错误。若 B 公司选低价，A 公司也选低价的收益严格大于选高价。'
        }
      }
    ],
    correctOptionId: 'A',
    overallExplanation: {
      en: 'A Prisoner\'s Dilemma occurs when dominant strategies compel both players to an uncooperative Nash Equilibrium that leaves both worse off than if they cooperated.',
      zh: '囚徒困境的本质：占优策略驱使双方走向非合作纳什均衡，导致双输结局（严格劣于双方互利合谋的福利水平）。'
    }
  },

  // ==========================================
  // UNIT 5: Factor Markets
  // ==========================================
  {
    id: 'mcq-5-mrp-hiring',
    unit: 5,
    topicCode: '5.3',
    topicId: 'factor-market-competitive',
    prompt: {
      en: 'A firm sells its product in a competitive output market for $5 per unit. The marginal product of the 4th worker is 6 units, and the competitive market wage is $20 per hour. Should the firm hire the 4th worker?',
      zh: '某企业在完全竞争产品市场上以每件 $5 的价格销售产品。第 4 位工人的边际产量为 6 件，市场竞争性工资为 $20/小时。该企业是否应当雇佣第 4 位工人？'
    },
    options: [
      {
        id: 'A',
        text: { en: 'Yes, because Marginal Revenue Product ($30) exceeds the wage ($20).', zh: '应当雇佣，因为该工人的边际收益产品 MRP（$30）高于其工资（$20）。' },
        explanation: {
          en: 'Correct! Marginal Revenue Product (MRP) = MP × P = 6 × $5 = $30. Because hiring this worker adds $30 in revenue but only $20 in Marginal Factor Cost (Wage), net profit increases by $10!',
          zh: '回答正确！边际收益产品 MRP = MP × P = 6 × $5 = $30。由于雇佣该工人增加 $30 收益而仅耗费 $20 工资成本（MRP > W），企业净利润增加 $10！'
        }
      },
      {
        id: 'B',
        text: { en: 'No, because the wage ($20) is greater than product price ($5).', zh: '不应雇佣，因为工人的工资（$20）高于产品单价（$5）。' },
        explanation: {
          en: 'Incorrect. Wage must be compared to MRP (which accounts for total output produced), not to the price of a single unit of output.',
          zh: '错误。工资必须与工人的边际收益产品（MRP）对比，而不是与单件产品的单价对比。'
        }
      },
      {
        id: 'C',
        text: { en: 'No, because marginal productivity is diminishing.', zh: '不应雇佣，因为边际收益递减规律正在生效。' },
        explanation: {
          en: 'Incorrect. Diminishing returns is normal; firms continue hiring as long as MRP ≥ MFC.',
          zh: '错误。边际产出递减是正常生产现象；只要 MRP ≥ MFC，理性厂商就应继续雇佣。'
        }
      },
      {
        id: 'D',
        text: { en: 'Only if the firm can price discriminate in the labor market.', zh: '只有在企业能在劳动力市场实施价格歧视时才应雇佣。' },
        explanation: {
          en: 'Incorrect. A wage taker in a competitive factor market can hire all workers at the going wage rate.',
          zh: '错误。完全竞争要素市场中的厂商是工资接受者，无需也不可能实行工资歧视。'
        }
      }
    ],
    correctOptionId: 'A',
    overallExplanation: {
      en: 'Profit-Maximizing Hiring Rule: Hire additional labor up to the point where MRP_L = MFC (or Wage). If MRP > Wage, hiring increases profits.',
      zh: '要素雇佣利润最大化铁律：雇佣工人直至 MRP_L = MFC（在竞争性市场即为工资 W）。只要 MRP > W，增雇工人必然增加利润。'
    }
  },

  // ==========================================
  // UNIT 6: Market Failure & Role of Government
  // ==========================================
  {
    id: 'mcq-6-negative-externality-dwl',
    unit: 6,
    topicCode: '6.2',
    topicId: 'negative-externalities',
    prompt: {
      en: 'In an unregulated market for electricity generated from coal, which of the following is true regarding market equilibrium output and social allocative efficiency?',
      zh: '在不受管制的燃煤发电市场上，关于自由市场均衡产出与社会配置效率的关系，下列哪一项叙述是正确的？'
    },
    options: [
      {
        id: 'A',
        text: {
          en: 'The market overproduces electricity because Marginal Social Cost exceeds Marginal Private Cost (MSC > MPC).',
          zh: '自由市场过度生产电力，因为边际社会成本超过了边际私人成本（MSC > MPC）。'
        },
        explanation: {
          en: 'Correct! Burning coal generates pollution (negative production externality). Because polluters ignore the external damage inflicted on society, MSC > MPC, leading the free market to overproduce relative to the socially optimal quantity (Q_m > Q_opt).',
          zh: '回答正确！燃煤排放废气属于生产负外部性。由于企业无需承担污染损害赔偿，导致社会边际成本大于私人边际成本（MSC > MPC），自由市场过度生产（Qm > Q_opt）。'
        }
      },
      {
        id: 'B',
        text: { en: 'The market underproduces electricity because marginal private benefit exceeds marginal social benefit.', zh: '自由市场电力生产不足，因为私人收益大于社会收益。' },
        explanation: {
          en: 'Incorrect. Underproduction characterizes positive externalities, not negative externalities.',
          zh: '错误。生产不足是正面外部性的特征，负外部性表现为过度生产。'
        }
      },
      {
        id: 'C',
        text: { en: 'The deadweight loss triangle points toward the market equilibrium quantity.', zh: '死重损失三角形的尖端笔直指向自由市场均衡产量。' },
        explanation: {
          en: 'Incorrect. In AP Microeconomics, the deadweight loss triangle ALWAYS points toward the socially optimal quantity (Q_opt).',
          zh: '错误。在 AP 微观经济学中，死重损失三角形的尖端永远像箭头一样笔直指向社会最优产量（Q_opt）。'
        }
      },
      {
        id: 'D',
        text: { en: 'Allocative efficiency can be restored by granting a per-unit subsidy to power producers.', zh: '通过向发电厂发放从量单位财政补贴，能够恢复社会配置效率。' },
        explanation: {
          en: 'Incorrect. Subsidizing a polluting firm would lower its costs further, worsening overproduction and environmental damage.',
          zh: '错误。补贴污染企业会进一步压低其成本，使过度生产和环境破坏变本加厉。'
        }
      }
    ],
    correctOptionId: 'A',
    overallExplanation: {
      en: 'Negative Externalities Summary: MSC = MPC + MEC. Because MSC > MPC, the free market overproduces (Qm > Q_opt), creating a DWL triangle pointing left toward Q_opt. Corrective remedy is a Pigouvian tax: T = MEC.',
      zh: '负外部性核心总结：MSC = MPC + MEC。因 MSC > MPC，自由市场必定过度生产（Qm > Q_opt），DWL 三角形尖端向左指向社会最优量。纠正药方为征收庇古税：T = MEC。'
    }
  },
  {
    id: 'mcq-6-gini-lorenz-redistribution',
    unit: 6,
    topicCode: '6.5',
    topicId: 'lorenz-curve-gini',
    prompt: {
      en: 'A government implements a more progressive income tax alongside expanded cash welfare transfers to low-income families. How will this policy affect the nation\'s Lorenz curve and Gini coefficient?',
      zh: '某国政府实施了累进性更强的个人所得税，同时大幅扩大了针对低收入家庭的现金转移支付。这项政策将如何改变该国的洛伦兹曲线与基尼系数？'
    },
    options: [
      {
        id: 'A',
        text: {
          en: 'The Lorenz curve bows closer toward the 45-degree line of perfect equality, and the Gini coefficient decreases.',
          zh: '洛伦兹曲线向 45 度完全平等线靠拢内收，基尼系数显著下降。'
        },
        explanation: {
          en: 'Correct! Progressive taxation and transfers compress income inequality. The Lorenz curve moves inward closer to the 45° diagonal line, shrinking Area A and reducing the Gini ratio A / (A + B).',
          zh: '回答正确！累进税收与转移支付缩小了贫富收入差距。洛伦兹曲线向 45 度绝对平等对角线内收，面积 A 缩小，基尼系数 A / (A + B) 随之下降。'
        }
      },
      {
        id: 'B',
        text: { en: 'The Lorenz curve sags further away from the 45-degree line, and the Gini coefficient increases.', zh: '洛伦兹曲线向右下更深凹陷远离 45 度线，基尼系数上升。' },
        explanation: {
          en: 'Incorrect. A higher Gini indicates greater inequality, which is the opposite of what progressive redistribution achieves.',
          zh: '错误。基尼系数上升意味着收入不平等加剧，与累进再分配政策的效果截然相反。'
        }
      },
      {
        id: 'C',
        text: { en: 'The 45-degree line of equality shifts downward.', zh: '45 度完全平等线本身发生向下平移。' },
        explanation: {
          en: 'Incorrect. The 45-degree line represents mathematical identity (Y = X) and can never move.',
          zh: '错误。45 度平等线代表数学恒等基准（Y = X），其几何位置永不发生改变。'
        }
      },
      {
        id: 'D',
        text: { en: 'The Gini coefficient approaches 1.0.', zh: '基尼系数向 1.0 极限逼近。' },
        explanation: {
          en: 'Incorrect. A Gini of 1.0 indicates maximum possible inequality (one person owns all income).',
          zh: '错误。基尼系数为 1.0 代表绝对不平等（一人独吞全社会所有收入）。'
        }
      }
    ],
    correctOptionId: 'A',
    overallExplanation: {
      en: 'Gini Coefficient Rule: Gini = Area A / 0.5. Policies that equalize income shift the Lorenz curve closer to the 45° line, reducing Area A and driving the Gini coefficient toward 0.',
      zh: '基尼系数法则：基尼系数 = 面积 A / 0.5。促使收入均等化的政策推动洛伦兹曲线贴近 45 度线，使面积 A 缩小，将基尼系数拉向 0。'
    }
  }
];
