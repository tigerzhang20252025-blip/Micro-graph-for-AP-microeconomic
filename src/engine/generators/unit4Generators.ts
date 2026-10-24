import { PracticeQuestion } from '../../data/practiceQuestions';
import { randomInt, randomChoice, buildFourOptions } from './helper';

export function generateMonopolyPricingQuestion(): PracticeQuestion {
  // Demand: P = a - b*Q => MR = a - 2b*Q
  // MC = c (constant marginal cost)
  const a = randomChoice([100, 120, 140]);
  const c = randomChoice([20, 40]);

  // MR = MC => a - 2Q = c => 2Q = a - c => Qm = (a - c) / 2
  const qm = (a - c) / 2;
  // Pm = a - Qm = a - (a - c)/2 = (a + c) / 2
  const pm = (a + c) / 2;
  const mrAtQm = c; // MR = MC at Qm

  const { options, correctOptionId } = buildFourOptions(
    {
      text: {
        en: `Qm = ${qm} units, Pm = $${pm}`,
        zh: `Qm = ${qm} 单位，Pm = $${pm}`
      },
      explanation: {
        en: `Correct! The profit-maximizing monopolist sets MR = MC: ${a} - 2Q = ${c} => Qm = ${qm}. To find price, plug Qm into the DEMAND curve (not MR curve!): Pm = ${a} - ${qm} = $${pm}.`,
        zh: `回答正确！垄断厂商在 MR = MC 处实现利润最大化：${a} - 2Q = ${c} => Qm = ${qm}。求价格时，必须将 Qm 代入【需求曲线】（绝不能代入 MR 曲线！）：Pm = ${a} - ${qm} = $${pm}。`
      }
    },
    [
      {
        text: {
          en: `Qm = ${qm} units, Pm = $${mrAtQm}`,
          zh: `Qm = ${qm} 单位，Pm = $${mrAtQm}`
        },
        explanation: {
          en: `Incorrect. Classic AP exam trap! $${mrAtQm} is the Marginal Cost and Marginal Revenue at Qm, not the price consumers are willing to pay on the Demand curve.`,
          zh: `错误。极其经典的 AP 考试陷阱！$${mrAtQm} 是在 Qm 处的边际成本和边际收益，垄断者会向上看需求线索取高价，绝不会按 MR 定价。`
        }
      },
      {
        text: {
          en: `Qm = ${a - c} units, Pm = $${c}`,
          zh: `Qm = ${a - c} 单位，Pm = $${c}`
        },
        explanation: {
          en: `Incorrect. This solves P = MC (allocative efficiency / perfect competition), which a profit-maximizing unregulated monopolist will never do.`,
          zh: `错误。这是完全竞争市场或社会最优管制下的结果（P = MC），不受管制的垄断厂商绝不会生产这么多。`
        }
      },
      {
        text: {
          en: `Qm = ${(qm / 2).toFixed(0)} units, Pm = $${(pm + 10).toFixed(0)}`,
          zh: `Qm = ${(qm / 2).toFixed(0)} 单位，Pm = $${(pm + 10).toFixed(0)}`
        },
        explanation: {
          en: `Incorrect. Review the slope relationship: MR has twice the slope of the linear demand curve.`,
          zh: `错误。请复习边际收益与线性需求曲线的斜率双倍推导关系。`
        }
      }
    ]
  );

  return {
    id: `dyn-monopoly-${Date.now()}-${randomInt(100, 999)}`,
    unit: 4,
    topicCode: '4.2',
    topicId: 'monopoly-single-price',
    isDynamic: true,
    templateId: 'dyn-monopoly-output-price',
    prompt: {
      en: `A single-price monopoly faces Market Demand: P = ${a} - Q (with MR = ${a} - 2Q) and constant Marginal Cost MC = $${c}. What are the profit-maximizing quantity (Qm) and price (Pm)?`,
      zh: `某单一定价垄断厂商面对的市场需求方程为 P = ${a} - Q（边际收益 MR = ${a} - 2Q），其恒定边际成本为 MC = $${c}。该垄断厂商利润最大化的产出量（Qm）与索取价格（Pm）分别是多少？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `Step 1: Set MR = MC => ${a} - 2Q = ${c} => Qm = ${qm}. Step 2: Read price off the Demand curve at Qm: Pm = ${a} - ${qm} = $${pm}.`,
      zh: `第一步：令 MR = MC => ${a} - 2Q = ${c} => Qm = ${qm}。第二步：将 Qm 代入需求曲线读取垄断价格：Pm = ${a} - ${qm} = $${pm}。`
    },
    commonMistakeAlert: {
      en: 'Never read price off the MR curve! Always project vertically up to the Demand curve to find the price consumers are willing to pay.',
      zh: '千千万万不要在 MR 曲线上直接读价格！必须垂直向上投射到需求曲线（Demand）上去读取消费者的保留价格。'
    }
  };
}

export function generateGameTheoryPayoffQuestion(): PracticeQuestion {
  const firm1 = 'Firm A';
  const firm2 = 'Firm B';
  const strat1 = 'Advertise';
  const strat2 = 'Do Not Advertise';

  // Construct a clear Prisoner's Dilemma or dominant strategy game:
  // Both Advertise: (10, 10)
  // Firm 1 Advertise, Firm 2 No: (25, 0)
  // Firm 1 No, Firm 2 Advertise: (0, 25)
  // Both No: (20, 20)
  const highReward = randomChoice([25, 30, 40]);
  const coopReward = randomChoice([15, 18, 20]);
  const defectReward = randomChoice([8, 10, 12]);
  const suckerReward = 0;

  const { options, correctOptionId } = buildFourOptions(
    {
      text: {
        en: `Both firms choose "${strat1}", which is a dominant strategy for both players`,
        zh: `两家企业均选择“${strat1}”，且“${strat1}”是两家企业的占优策略`
      },
      explanation: {
        en: `Correct! Regardless of what Firm B chooses, Firm A earns more by Advertising (${highReward} > ${coopReward} and ${defectReward} > ${suckerReward}). By symmetry, Firm B also has a dominant strategy to Advertise. The unique Nash Equilibrium is (${strat1}, ${strat1}).`,
        zh: `回答正确！无论对方选择什么，选择做广告带来的收益都更高（${highReward} > ${coopReward} 且 ${defectReward} > ${suckerReward}）。因此“做广告”是两家企业的绝对占优策略，唯一的纳什均衡点即为双方都选择“${strat1}”。`
      }
    },
    [
      {
        text: {
          en: `Both firms choose "${strat2}", which is the non-cooperative Nash equilibrium`,
          zh: `两家企业均选择“${strat2}”，这是非合作博弈的纳什均衡点`
        },
        explanation: {
          en: `Incorrect. Although (${strat2}, ${strat2}) yields higher joint payoffs ($${coopReward} each), neither firm will maintain it without an enforceable binding cartel because both have an incentive to cheat.`,
          zh: `错误。尽管双方都不做广告总收益更高（各得 $${coopReward}），但在非合作博弈中双方都有背叛诱惑，因此该状态不是纳什均衡。`
        }
      },
      {
        text: {
          en: `Neither firm has a dominant strategy, so no Nash equilibrium exists`,
          zh: `两家企业均没有占优策略，因此本博弈不存在纳什均衡`
        },
        explanation: {
          en: `Incorrect. Compare payoffs row-by-row and column-by-column: Advertising strictly dominates Not Advertising for both players.`,
          zh: `错误。逐行逐列对比收益即可发现：选择做广告在任何情况下收益都更优，存在严格占优策略和纳什均衡。`
        }
      },
      {
        text: {
          en: `Firm A chooses "${strat1}" while Firm B chooses "${strat2}"`,
          zh: `企业 A 选择“${strat1}”，而企业 B 选择“${strat2}”`
        },
        explanation: {
          en: `Incorrect. Firm B will not choose "${strat2}" when Firm A advertises because that yields $${suckerReward} compared to $${defectReward}.`,
          zh: `错误。当企业 A 投放广告时，企业 B 不做广告只能得 $${suckerReward}，而做广告可得 $${defectReward}，其必然选择做广告。`
        }
      }
    ]
  );

  return {
    id: `dyn-game-theory-${Date.now()}-${randomInt(100, 999)}`,
    unit: 4,
    topicCode: '4.5',
    topicId: 'oligopoly-game-theory',
    isDynamic: true,
    templateId: 'dyn-game-theory-nash',
    prompt: {
      en: `Two duopoly firms (${firm1} and ${firm2}) simultaneously decide whether to "${strat1}" or "${strat2}". Payoffs (Firm A, Firm B) are: Both Advertise: ($${defectReward}, $${defectReward}); Firm A Advertises & Firm B Does Not: ($${highReward}, $${suckerReward}); Firm A Does Not & Firm B Advertises: ($${suckerReward}, $${highReward}); Both Do Not Advertise: ($${coopReward}, $${coopReward}). What is the outcome of this non-cooperative game?`,
      zh: `两家寡头企业（企业 A 与 企业 B）同时决策是否“${strat1}”或“${strat2}”。收益矩阵（A 收益, B 收益）如下：双方都做广告：($${defectReward}, $${defectReward})；A 做广告且 B 不做：($${highReward}, $${suckerReward})；A 不做且 B 做广告：($${suckerReward}, $${highReward})；双方都不做广告：($${coopReward}, $${coopReward})。在这场非合作博弈中，最终结果是什么？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `Dominant Strategy Analysis: If Firm B advertises, Firm A compares $${defectReward} vs $${suckerReward} => chooses Advertise. If Firm B does not advertise, Firm A compares $${highReward} vs $${coopReward} => chooses Advertise. Thus, Advertise is a dominant strategy for both players, making (Advertise, Advertise) the unique Nash Equilibrium (Prisoner's Dilemma).`,
      zh: `占优策略划线分析法：若 B 做广告，A 对比 $${defectReward} 与 $${suckerReward} => 选做广告；若 B 不做广告，A 对比 $${highReward} 与 $${coopReward} => 仍选做广告。两家企业均拥有占优策略，纳什均衡为（做广告，做广告），体现经典的囚徒困境。`
    }
  };
}

/**
 * Natural Monopoly Regulation: Socially Optimal vs Fair-Return (Topic 4.4)
 */
export function generateNaturalMonopolyRegulationQuestion(): PracticeQuestion {
  const mc = randomChoice([10, 15, 20]);
  const pFair = mc + randomChoice([8, 12, 15]);
  const pMonopoly = pFair + randomChoice([15, 20]);

  const qMonopoly = randomInt(20, 30);
  const qFair = qMonopoly + randomChoice([15, 20]);
  const qSocial = qFair + randomChoice([15, 20]);

  const isSocialQuestion = Math.random() > 0.5;

  const { options, correctOptionId } = buildFourOptions(
    {
      text: {
        en: isSocialQuestion
          ? `Socially Optimal Regulation: P = MC = $${mc}, producing ${qSocial} units. Achieves allocative efficiency (DWL = 0), but the firm incurs economic losses (P < ATC) and requires a government subsidy to prevent shutdown.`
          : `Fair-Return Regulation: P = ATC = $${pFair}, producing ${qFair} units. The firm breaks even (zero economic profit/normal profit), requiring zero government subsidy, though a small deadweight loss remains.`,
        zh: isSocialQuestion
          ? `社会最优定价管制：P = MC = $${mc}，生产 ${qSocial} 单位。实现资源配置效率（DWL = 0），但由于售价低于平均总成本（P < ATC），企业将发生亏损，需要政府财政补贴才能维持经营。`
          : `公平回报定价管制：P = ATC = $${pFair}，生产 ${qFair} 单位。企业盈亏平衡（获得正常利润/零经济利润），无需政府财政补贴，但社会仍保留较小的无谓损失。`
      },
      explanation: {
        en: `Correct! Under declining LRATC, MC is strictly below ATC. Marginal Cost Pricing (P = MC) achieves allocative efficiency but results in P < ATC (losses). Average Cost Pricing (P = ATC) covers all costs without subsidies.`,
        zh: `回答正确！自然垄断的长期平均成本递减，边际成本线必定低于平均总成本线（MC < ATC）。P = MC（社会最优）能消除无谓损失，但企业亏损需补贴；P = ATC（公平回报）无需补贴但存在轻微效率损失。`
      }
    },
    [
      {
        text: {
          en: isSocialQuestion
            ? `Socially Optimal Regulation: P = ATC = $${pFair}, producing ${qFair} units with zero economic profit.`
            : `Fair-Return Regulation: P = MC = $${mc}, producing ${qSocial} units with massive economic profits.`,
          zh: isSocialQuestion
            ? `社会最优定价管制：P = ATC = $${pFair}，生产 ${qFair} 单位并获得零经济利润。`
            : `公平回报定价管制：P = MC = $${mc}，生产 ${qSocial} 单位并赚取巨额经济利润。`
        },
        explanation: {
          en: `Incorrect. Confused Socially Optimal Pricing (P = MC) with Fair-Return Pricing (P = ATC).`,
          zh: `错误。混淆了社会最优定价（P = MC）与公平回报定价（P = ATC）的各自定义。`
        }
      },
      {
        text: {
          en: `Both regulations yield identical price and quantity because the monopoly is natural.`,
          zh: `两种管制方案的价格与产量完全相同，因为该垄断是由自然属性决定的。`
        },
        explanation: {
          en: `Incorrect. MC lies below ATC over the entire relevant range, so P = MC and P = ATC yield distinct points.`,
          zh: `错误。在有效产出区间内 MC 严格低于 ATC，两者对应的价格和产量截然不同。`
        }
      },
      {
        text: {
          en: `The government should force the monopoly to produce at Q = ${qMonopoly} to eliminate deadweight loss.`,
          zh: `政府应当强迫该自然垄断厂商在 Q = ${qMonopoly} 处生产以消除无谓损失。`
        },
        explanation: {
          en: `Incorrect. Q = ${qMonopoly} is the unregulated monopoly output, which produces the LARGEST deadweight loss.`,
          zh: `错误。Q = ${qMonopoly} 是不受管制的原垄断产量，恰恰是无谓损失最大的产量点。`
        }
      }
    ]
  );

  return {
    id: `dyn-nat-monopoly-${Date.now()}-${randomInt(100, 999)}`,
    unit: 4,
    topicCode: '4.4',
    topicId: 'monopoly-single-price',
    isDynamic: true,
    templateId: 'dyn-natural-monopoly-regulation',
    prompt: {
      en: `A regulated natural monopoly has cost curves: MC = $${mc}, and at different outputs ATC is: Q=${qMonopoly}: ATC=$${pMonopoly}; Q=${qFair}: ATC=$${pFair}; Q=${qSocial}: ATC=$${mc + 6}. Unregulated monopoly price is $${pMonopoly}. If the government implements "${isSocialQuestion ? 'Socially Optimal (Marginal Cost) Pricing' : 'Fair-Return (Average Cost) Pricing'}", what are the price, output, and regulatory implications?`,
      zh: `某受政府监管的自然垄断企业成本曲线为：MC = $${mc}。在不同产出水平下其 ATC 分别为：Q=${qMonopoly} 时 ATC=$${pMonopoly}；Q=${qFair} 时 ATC=$${pFair}；Q=${qSocial} 时 ATC=$${mc + 6}。原无监管垄断市价为 $${pMonopoly}。若政府实施“${isSocialQuestion ? '社会最优定价管制（边际成本定价）' : '公平回报定价管制（平均成本定价）'}”，其管制价格、产量及政策经济后果是什么？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `Socially Optimal Price: P = MC (allocatively efficient, maximum total surplus, but requires subsidy). Fair-Return Price: P = ATC (normal profit, firm breaks even, no government subsidy required).`,
      zh: `社会最优定价：P = MC（配置效率，社会总剩余最大，但亏损需要财政补贴）。公平回报定价：P = ATC（正常利润，企业收支平衡，无需财政贴补）。`
    }
  };
}

/**
 * Monopolistic Competition & Excess Capacity (Topic 4.3)
 */
export function generateMonopolisticCompExcessCapacityQuestion(): PracticeQuestion {
  const firm = randomChoice([
    { en: 'Artisan Coffee Shop', zh: '精品咖啡馆' },
    { en: 'Hair Styling Salon', zh: '美发造型沙龙' },
    { en: 'Boutique Clothing Store', zh: '独立服装买手店' }
  ]);

  const qActual = randomChoice([40, 50, 60]);
  const excessCapacity = randomChoice([15, 20, 25]);
  const qEfficient = qActual + excessCapacity; // Min ATC output
  const price = randomInt(15, 30);

  const { options, correctOptionId } = buildFourOptions(
    {
      text: {
        en: `The firm earns zero economic profit (P = ATC = $${price}), but produces with Excess Capacity of ${excessCapacity} units (${qEfficient} - ${qActual}) on the downward-sloping segment of its ATC curve.`,
        zh: `该企业获得零超额经济利润（P = ATC = $${price}），但在其向下倾斜的 ATC 区域生产，存在 ${excessCapacity} 单位（${qEfficient} - ${qActual}）的“过剩产能”。`
      },
      explanation: {
        en: `Correct! In monopolistic competition long-run equilibrium: 1) Free entry forces Economic Profit to zero (Demand is tangent to ATC, P = ATC); 2) Because Demand is downward-sloping, tangency occurs to the LEFT of the minimum of ATC, creating Excess Capacity = Q(min ATC) - Q(actual) = ${qEfficient} - ${qActual} = ${excessCapacity}.`,
        zh: `回答正确！垄断竞争长期均衡特征：1) 自由进退导致经济利润为零（需求线切于 ATC，P = ATC）；2) 由于需求线向右下倾斜，切点必然落在 ATC 最低点的左侧，因而产生过剩产能 = Q(min ATC) - Q(actual) = ${qEfficient} - ${qActual} = ${excessCapacity} 单位。`
      }
    },
    [
      {
        text: {
          en: `The firm achieves Productive Efficiency because P = min ATC = $${price}.`,
          zh: `该企业实现了生产效率，因为满足 P = min ATC = $${price}。`
        },
        explanation: {
          en: `Incorrect. Tangency occurs on the downward-sloping portion of ATC, NOT at min ATC. Monopolistic competition fails productive efficiency.`,
          zh: `错误。切点位于 ATC 正在下降的左半段，并非 min ATC 最低点。垄断竞争无法实现生产效率。`
        }
      },
      {
        text: {
          en: `The firm achieves Allocative Efficiency because Price equals Marginal Cost.`,
          zh: `该企业实现了资源配置效率，因为价格等于边际成本。`
        },
        explanation: {
          en: `Incorrect. Because the firm faces a downward-sloping demand curve, P > MR = MC, so it fails allocative efficiency.`,
          zh: `错误。由于需求曲线向下倾斜，P > MR = MC，必然存在价格高于边际成本的加价，无法达成配置效率。`
        }
      },
      {
        text: {
          en: `The firm will be forced to shut down in the short run because of the excess capacity.`,
          zh: `该企业将在短期内被迫停产，因为存在过剩产能。`
        },
        explanation: {
          en: `Incorrect. P = ATC covers all economic costs including opportunity costs of capital and labor; the firm earns a normal profit and stays in business.`,
          zh: `错误。P = ATC 完全覆盖了全部经济成本（包括正常利润回报），企业能够持续稳定经营。`
        }
      }
    ]
  );

  return {
    id: `dyn-mono-comp-${Date.now()}-${randomInt(100, 999)}`,
    unit: 4,
    topicCode: '4.3',
    topicId: 'monopolistic-competition',
    isDynamic: true,
    templateId: 'dyn-monopolistic-competition-excess-capacity',
    prompt: {
      en: `A representative ${firm.en} operates in a monopolistically competitive industry in long-run equilibrium. The firm produces ${qActual} units of service per day where MR = MC, charging P = $${price}. At this output, ATC = $${price}. However, the minimum point on its Average Total Cost curve occurs at ${qEfficient} units. What characterizes this firm's long-run equilibrium?`,
      zh: `一家具有代表性的${firm.zh}处于垄断竞争行业的长期均衡状态中。该店在 MR = MC 处每日提供 ${qActual} 单位服务，索取价格 P = $${price}。在此产出下其 ATC = $${price}。然而其平均总成本 ATC 的最低点位于 ${qEfficient} 单位。关于该企业的长期均衡特征，下列哪项判断正确？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `Monopolistic Competition Long-Run Attributes: P = ATC (Zero Economic Profit / Normal Profit), but P > MC (allocatively inefficient) and Q < Q(min ATC) (productively inefficient, creating Excess Capacity).`,
      zh: `垄断竞争长期均衡核心属性：P = ATC（获得正常利润/零经济利润），但 P > MC（不具备配置效率）且实际产量低于 min ATC 对应产量（不具备生产效率，存在过剩产能）。`
    }
  };
}

/**
 * Price Discrimination & Welfare Efficiency (Topic 4.2)
 */
export function generatePriceDiscriminationEfficiencyQuestion(): PracticeQuestion {
  const monopolyOutput = randomInt(30, 45);
  const compOutput = monopolyOutput + randomChoice([20, 25, 30]);

  const { options, correctOptionId } = buildFourOptions(
    {
      text: {
        en: `Under perfect price discrimination: Output expands from ${monopolyOutput} to ${compOutput} units (equal to the competitive output); Consumer Surplus is converted completely into Producer Surplus; Deadweight Loss is reduced to zero (DWL = 0).`,
        zh: `在完全一级价格歧视下：产出量由单一定价的 ${monopolyOutput} 扩大至 ${compOutput} 单位（达到竞争性产出）；消费者剩余全部转化为生产者剩余；无谓损失降为零（DWL = 0）。`
      },
      explanation: {
        en: `Correct! Because the firm charges each buyer their exact maximum willingness to pay, MR = Demand. The firm produces up to MR = MC (where P = MC), achieving allocative efficiency and zero DWL, while capturing all consumer surplus as profit.`,
        zh: `回答正确！完全价格歧视厂商对每个买家索取保留价格，此时 MR 曲线与需求曲线重合。生产直至 P = MC，消除了全部无谓损失（DWL = 0），并将全部消费者剩余吸纳为利润。`
      }
    },
    [
      {
        text: {
          en: `Consumer surplus expands to its theoretical maximum because more buyers obtain the good.`,
          zh: `消费者剩余扩大到理论最大值，因为更多消费者买到了商品。`
        },
        explanation: {
          en: `Incorrect. Under perfect price discrimination, each consumer pays their exact willingness to pay, leaving Consumer Surplus equal to ZERO.`,
          zh: `错误。在完全一级歧视下，每位买家支付的都是心理最高承受价，消费者剩余被完全剥夺归零。`
        }
      },
      {
        text: {
          en: `Output contracts below ${monopolyOutput} units and deadweight loss doubles.`,
          zh: `产量进一步收缩至 ${monopolyOutput} 单位以下，无谓损失翻倍。`
        },
        explanation: {
          en: `Incorrect. Price discrimination INCREASES total production relative to single-price monopoly.`,
          zh: `错误。价格歧视相比单一定价会显著扩大总产量，直至配置最优水平。`
        }
      },
      {
        text: {
          en: `The firm incurs massive economic losses because it is forced to lower prices for some customers.`,
          zh: `企业发生巨额亏损，因为其被迫为部分顾客降价。`
        },
        explanation: {
          en: `Incorrect. Price discrimination strictly increases or maintains monopoly profit compared to single pricing.`,
          zh: `错误。价格歧视使得厂商利润必定高于或等于单一定价时的利润。`
        }
      }
    ]
  );

  return {
    id: `dyn-price-discrim-${Date.now()}-${randomInt(100, 999)}`,
    unit: 4,
    topicCode: '4.2',
    topicId: 'monopoly-price-discrimination',
    isDynamic: true,
    templateId: 'dyn-price-discrimination-efficiency',
    prompt: {
      en: `A monopoly currently produces ${monopolyOutput} units under single-price monopoly pricing. It develops technology allowing it to practice Perfect (First-Degree) Price Discrimination, charging each customer their reservation price. What happens to output, consumer surplus, and deadweight loss?`,
      zh: `某垄断厂商目前在单一定价下生产 ${monopolyOutput} 单位产品。随后该厂商通过大数据实现了“完全一级价格歧视”，能够对每位顾客索取其心理保留价格。该市场的产出水平、消费者剩余及无谓损失将发生何种变动？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `First-Degree Price Discrimination converts the entire demand curve into Marginal Revenue (MR = D). Output expands until P = MC (${compOutput} units). Although Consumer Surplus = 0, Allocative Efficiency is achieved (DWL = 0).`,
      zh: `完全一级价格歧视使 MR 曲线与需求曲线完全重合。产出扩大直至 P = MC（${compOutput} 单位）。虽然消费者剩余降为零，但达成了配置效率且无谓损失为零（DWL = 0）。`
    }
  };
}
