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
