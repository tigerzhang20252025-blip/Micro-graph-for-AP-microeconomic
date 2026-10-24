import { PracticeQuestion } from '../../data/practiceQuestions';
import { randomInt, randomChoice, buildFourOptions } from './helper';

export function generateProductionStagesQuestion(): PracticeQuestion {
  // Stages:
  // L = 1 to 8: Stage I (MP > AP, AP rising)
  // L = 9: MP cuts AP at AP's maximum
  // L = 10 to 11: Stage II (Rational operating zone, MP < AP, MP > 0, TP rising)
  // L = 12: MP = 0 (TP is maximized)
  // L >= 13: Stage III (MP < 0, TP falling)

  const scenarios = [
    {
      lVal: randomInt(3, 7),
      correctStage: 'Stage I (Increasing Returns)',
      correctStageZh: '第一阶段（边际报酬递增与专业化分工）',
      explanationEn: 'In Stage I, Marginal Product (MP) exceeds Average Product (AP), so Average Product is rising due to specialization.',
      explanationZh: '在第一阶段，边际产量 MP 高于平均产量 AP，因此平均产量持续上升，处于分工收益递增阶段。'
    },
    {
      lVal: randomInt(10, 11),
      correctStage: 'Stage II (Rational Operating Range)',
      correctStageZh: '第二阶段（理性生产区间，报酬递减但为正）',
      explanationEn: 'In Stage II, MP is below AP (so AP is falling) but MP is still positive (so TP is still rising). Rational firms always operate in Stage II.',
      explanationZh: '在第二阶段，MP 低于 AP（AP 下降），但 MP 仍为正数（总产量 TP 仍在增长）。追求利润最大化的理性厂商必定在第二阶段生产。'
    },
    {
      lVal: randomInt(13, 14),
      correctStage: 'Stage III (Negative Marginal Returns)',
      correctStageZh: '第三阶段（负边际报酬，固定设备过度拥挤）',
      explanationEn: 'In Stage III, overcrowding causes Marginal Product to become negative (MP < 0), meaning each additional worker reduces total output.',
      explanationZh: '在第三阶段，厂房设备过度拥挤导致边际产量 MP 小于 0，多雇佣一名工人反而使总产量净减少。'
    }
  ];

  const sc = randomChoice(scenarios);

  const { options, correctOptionId } = buildFourOptions(
    {
      text: { en: sc.correctStage, zh: sc.correctStageZh },
      explanation: { en: sc.explanationEn, zh: sc.explanationZh }
    },
    [
      {
        text: { en: 'Stage I (where MP cuts AP at max AP)', zh: '第一阶段（MP 与 AP 在 AP 最低点相交）' },
        explanation: {
          en: 'Incorrect. MP intersects AP at AP\'s MAXIMUM point, not minimum point.',
          zh: '错误。MP 穿过的是 AP 的极大值点（最高点），而非最低点。'
        }
      },
      {
        text: { en: 'Stage III (where Total Product reaches its peak)', zh: '第三阶段（总产量 TP 达到最大值）' },
        explanation: {
          en: 'Incorrect. Total Product reaches its peak at the end of Stage II (where MP = 0), before Stage III begins.',
          zh: '错误。总产量在第二阶段末尾（MP = 0 处）达到最大值，进入第三阶段后 TP 会开始下滑。'
        }
      },
      {
        text: { en: 'Stage II (where Average Fixed Cost is maximized)', zh: '第二阶段（平均固定成本 AFC 达到极大值）' },
        explanation: {
          en: 'Incorrect. AFC = TFC / Q continuously declines as output expands; it never reaches a maximum in Stage II.',
          zh: '错误。平均固定成本 AFC 随产量增加一直单调递减，绝不可能在第二阶段出现极大值。'
        }
      }
    ]
  );

  return {
    id: `dyn-prod-stage-${Date.now()}-${randomInt(100, 999)}`,
    unit: 3,
    topicCode: '3.1',
    topicId: 'production-function-tp-mp-ap',
    isDynamic: true,
    templateId: 'dyn-production-stages',
    prompt: {
      en: `A manufacturing plant employs ${sc.lVal} workers. If diminishing marginal returns set in when MP begins falling, and MP crosses AP at L = 9, in which stage of production is the firm operating at L = ${sc.lVal}?`,
      zh: `某制造厂当前雇佣了 ${sc.lVal} 名工人。已知边际产量 MP 在其最高点之后开始递减，并在 L = 9 处穿过平均产量 AP 的最高点。当 L = ${sc.lVal} 时，该企业处于哪一个生产阶段？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `Production Stages: Stage I ends where MP = AP (AP maximum, L = 9). Stage II ends where MP = 0 (TP maximum, L = 12). Stage III occurs where MP < 0 (TP falling, L > 12).`,
      zh: `生产三阶段划分标准：第一阶段结束于 MP = AP（即 AP 达到最高点，L = 9）；第二阶段结束于 MP = 0（即总产量 TP 达到最高点，L = 12）；第三阶段为 MP < 0（总产量下降，L > 12）。`
    }
  };
}

export function generateCostTaxShiftQuestion(): PracticeQuestion {
  const isLumpSum = Math.random() > 0.5;

  const { options, correctOptionId } = buildFourOptions(
    {
      text: {
        en: isLumpSum
          ? 'ATC and AFC shift upward; MC and AVC remain completely unchanged'
          : 'MC, AVC, and ATC shift upward; AFC remains completely unchanged',
        zh: isLumpSum
          ? '仅 ATC 与 AFC 向上平移；MC 与 AVC 完全保持不变'
          : 'MC、AVC 与 ATC 同时向上平移；AFC 完全保持不变'
      },
      explanation: {
        en: isLumpSum
          ? 'Correct! A lump-sum tax acts as an increase in Total Fixed Cost (TFC). Since marginal cost depends only on variable costs (dTC/dQ = dTVC/dQ), MC and AVC are unaffected.'
          : 'Correct! A per-unit tax increases the cost of producing each additional unit, increasing variable cost. Thus MC, AVC, and ATC all shift up by the exact tax amount, while fixed costs (and AFC) are unaffected.',
        zh: isLumpSum
          ? '回答正确！一次性定额税（Lump-sum tax）只增加企业的总固定成本（TFC）。因为边际成本只取决于可变成本（dTC/dQ = dTVC/dQ），所以 MC 与 AVC 绝不受定额税影响！'
          : '回答正确！从量单位税（Per-unit tax）增加每一件额外产品的生产成本，属于可变成本。因此 MC、AVC 与 ATC 均向上平移该税额，而固定成本与 AFC 保持不变。'
      }
    },
    [
      {
        text: {
          en: isLumpSum
            ? 'MC, AVC, and ATC all shift upward'
            : 'Only AFC shifts upward, while MC remains unchanged',
          zh: isLumpSum
            ? 'MC、AVC 与 ATC 全部向上平移'
            : '仅 AFC 向上平移，而 MC 保持不变'
        },
        explanation: {
          en: 'Incorrect. Make sure to distinguish between fixed cost shocks (lump-sum) and variable cost shocks (per-unit).',
          zh: '错误。必须严格区分固定成本冲击（定额税）与可变成本冲击（从量税）的不同影响对象。'
        }
      },
      {
        text: {
          en: 'All cost curves (MC, ATC, AVC, AFC) shift upward by the exact same dollar amount',
          zh: '所有成本曲线（MC、ATC、AVC、AFC）同时向上平移相同金额'
        },
        explanation: {
          en: 'Incorrect. Fixed costs never shift variable cost curves, and variable costs never shift fixed cost curves.',
          zh: '错误。固定成本绝不会影响可变成本曲线，可变成本也绝不会影响固定成本曲线。'
        }
      },
      {
        text: {
          en: isLumpSum
            ? 'Only MC shifts upward, leaving ATC unchanged'
            : 'Only AVC shifts upward, leaving MC unchanged',
          zh: isLumpSum
            ? '仅 MC 向上平移，ATC 保持不变'
            : '仅 AVC 向上平移，MC 保持不变'
        },
        explanation: {
          en: 'Incorrect. Recall the relationship between total cost components and marginal cost.',
          zh: '错误。请复习成本分解公式以及边际成本的导数定义。'
        }
      }
    ]
  );

  return {
    id: `dyn-cost-shift-${Date.now()}-${randomInt(100, 999)}`,
    unit: 3,
    topicCode: '3.2',
    topicId: 'cost-curves-short-run',
    isDynamic: true,
    templateId: 'dyn-cost-curve-shifts',
    prompt: {
      en: `The government levies a ${isLumpSum ? 'lump-sum annual license fee (tax)' : 'per-unit excise tax on each item produced'} on a manufacturing firm. How will the firm's short-run cost curves shift?`,
      zh: `政府对某制造企业征收一项${isLumpSum ? '每年一次性支付的营业执照费（定额税 Lump-sum tax）' : '每生产一单位产品必须缴纳的从量消费税（Per-unit tax）'}。该企业的短期成本曲线将如何发生变动？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `AP Micro Essential Trap: Lump-sum tax = Fixed Cost increase (only ATC & AFC shift up; MC & AVC do NOT move). Per-unit tax = Variable Cost increase (MC, AVC, & ATC shift up by tax amount; AFC does NOT move).`,
      zh: `AP 必考高频易错点：定额税 = 增加固定成本（仅 ATC 与 AFC 上移；MC 与 AVC 完全不动）。从量税 = 增加可变成本（MC、AVC 与 ATC 同步上移；AFC 完全不动）。`
    }
  };
}

export function generateShutdownDecisionQuestion(): PracticeQuestion {
  const minAtc = randomChoice([30, 40, 50]);
  const minAvc = minAtc - randomChoice([10, 15]);

  // Scenario 1: P < minAVC -> Shut down in short run
  // Scenario 2: minAVC <= P < minATC -> Produce where P = MC to minimize losses
  // Scenario 3: P > minATC -> Produce where P = MC and earn economic profit
  const scenarioType = randomChoice(['shutdown', 'produce_loss', 'produce_profit']);

  let price = 0;
  let correctTextEn = '';
  let correctTextZh = '';
  let explanationEn = '';
  let explanationZh = '';

  if (scenarioType === 'shutdown') {
    price = minAvc - 5;
    correctTextEn = 'Shut down immediately in the short run to minimize losses (loss = TFC)';
    correctTextZh = '在短期内应立即停产（产出为 0），将损失限制在总固定成本（TFC）内';
    explanationEn = `Correct! Because P ($${price}) < min AVC ($${minAvc}), the firm cannot even cover its variable operating costs. Producing would add variable losses on top of fixed costs, so the optimal decision is q = 0.`;
    explanationZh = `回答正确！因为市场价格 P（$${price}）低于平均可变成本最低点 AVC（$${minAvc}），企业连工人的基本可变成本都无法弥补。继续开工只会亏得更多，因此最优短期决策为停产（q = 0）。`;
  } else if (scenarioType === 'produce_loss') {
    price = minAvc + 4;
    correctTextEn = 'Continue producing in the short run where P = MC (loss is smaller than TFC)';
    correctTextZh = '在短期内应继续生产并满足 P = MC，以此最小化亏损（亏损额小于 TFC）';
    explanationEn = `Correct! Because min AVC ($${minAvc}) <= P ($${price}) < min ATC ($${minAtc}), the firm covers all variable costs and has residual revenue to offset a portion of fixed costs. Producing loses less than shutting down.`;
    explanationZh = `回答正确！因为价格高于平均可变成本（P >= min AVC），生产收入在完全覆盖可变成本后，还能弥补一部分固定成本。继续开工比彻底停产蒙受的损失更小。`;
  } else {
    price = minAtc + 10;
    correctTextEn = 'Continue producing where P = MC and earn positive economic profits';
    correctTextZh = '继续按 P = MC 组织生产，并获得大于零的超额经济利润';
    explanationEn = `Correct! Since P ($${price}) > min ATC ($${minAtc}), the firm earns economic profit in the short run, attracting new firms to enter the industry in the long run.`;
    explanationZh = `回答正确！因为价格 P（$${price}）高于平均总成本最低点 ATC（$${minAtc}），企业在短期内实现超额经济利润。`;
  }

  const { options, correctOptionId } = buildFourOptions(
    {
      text: { en: correctTextEn, zh: correctTextZh },
      explanation: { en: explanationEn, zh: explanationZh }
    },
    [
      {
        text: {
          en: 'Shut down immediately whenever economic profit is less than or equal to zero',
          zh: '只要经济利润小于或等于零，企业就必须立即停产'
        },
        explanation: {
          en: 'Incorrect. As long as P >= AVC, a loss-making firm should continue producing in the short run to pay down fixed costs.',
          zh: '错误。只要价格能弥补可变成本（P >= AVC），亏损企业在短期内就应继续生产以分摊固定开支。'
        }
      },
      {
        text: {
          en: 'Exit the industry immediately in the short run by selling all fixed capital equipment',
          zh: '在短期内立即变卖所有厂房设备彻底退出该行业'
        },
        explanation: {
          en: 'Incorrect. Capital equipment is fixed in the short run; exit and entry decisions occur only in the LONG run.',
          zh: '错误。在短期内资本设备是固定不可变的，彻底变卖设备退出行业属于“长期调整决策”。'
        }
      },
      {
        text: {
          en: 'Lower the price below market equilibrium to gain market share',
          zh: '单方面主动降价到市场均衡价以下，以争夺更多市场份额'
        },
        explanation: {
          en: 'Incorrect. A perfectly competitive firm is a price taker facing a horizontal demand curve; it has no incentive or ability to lower its price.',
          zh: '错误。完全竞争厂商是价格接受者（Price Taker），面对水平的需求线，主动降价只会无端损失收益。'
        }
      }
    ]
  );

  return {
    id: `dyn-shutdown-${Date.now()}-${randomInt(100, 999)}`,
    unit: 3,
    topicCode: '3.6',
    topicId: 'shutdown-rule',
    isDynamic: true,
    templateId: 'dyn-shutdown-decision',
    prompt: {
      en: `A perfectly competitive firm faces a market price of P = $${price}. Its cost structure shows min ATC = $${minAtc} and min AVC = $${minAvc}. What is the firm's optimal short-run decision?`,
      zh: `某处于完全竞争行业中的企业面对的市场价格为 P = $${price}。其成本结构显示平均总成本最低点 min ATC = $${minAtc}，平均可变成本最低点 min AVC = $${minAvc}。该企业在短期内的最优决策是什么？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `Short-Run Decision Rule: If P < min AVC => Shut down (q = 0, Loss = TFC). If min AVC <= P < min ATC => Produce where P = MC (Loss < TFC). If P >= min ATC => Produce where P = MC (Economic Profit >= 0).`,
      zh: `短期停产法则：若 P < min AVC => 立即停产（产出为 0，亏损 = TFC）；若 min AVC <= P < min ATC => 继续生产（亏损 < TFC）；若 P >= min ATC => 盈利生产（超额经济利润 >= 0）。`
    }
  };
}

/**
 * Economies of Scale & LRATC Curve (Topic 3.3)
 */
export function generateLratcScaleQuestion(): PracticeQuestion {
  const regions = [
    {
      type: 'economies',
      en: 'Economies of Scale (Increasing Returns to Scale)',
      zh: '规模经济（规模报酬递增）',
      conditionEn: 'Long-Run Average Total Cost (LRATC) declines as output expands.',
      conditionZh: '随着企业生产规模扩大，长期平均总成本（LRATC）持续下降。',
      causeEn: 'labor specialization, bulk purchasing discounts, and efficient utilization of large-scale capital machinery',
      causeZh: '劳动专业化分工、原材料大宗采购折扣以及大型自动化设备的充分利用'
    },
    {
      type: 'diseconomies',
      en: 'Diseconomies of Scale (Decreasing Returns to Scale)',
      zh: '规模不经济（规模报酬递减）',
      conditionEn: 'Long-Run Average Total Cost (LRATC) rises as output expands.',
      conditionZh: '随着企业生产规模继续盲目膨胀，长期平均总成本（LRATC）反而上升。',
      causeEn: 'management coordination breakdown, bureaucracy, communication bottlenecks, and worker alienation',
      causeZh: '管理协调链条过长、官僚主义、沟通瓶颈与员工疏离感'
    },
    {
      type: 'mes',
      en: 'Minimum Efficient Scale (MES)',
      zh: '最小有效规模（MES）',
      conditionEn: 'The lowest level of output at which a firm can minimize long-run average total cost.',
      conditionZh: '企业能够将长期平均总成本降至最低水平所对应的最小产出规模。',
      causeEn: 'the point where economies of scale are fully exhausted',
      causeZh: '规模经济潜力被完全释放的临界点'
    }
  ];

  const region = randomChoice(regions);

  const { options, correctOptionId } = buildFourOptions(
    {
      text: {
        en: `${region.en}: characterized by ${region.conditionEn}`,
        zh: `${region.zh}：其核心特征为“${region.conditionZh}”`
      },
      explanation: {
        en: `Correct! ${region.en} occurs when ${region.conditionEn} A major underlying economic cause is ${region.causeEn}.`,
        zh: `回答正确！${region.zh}正是指${region.conditionZh}其主要的经济成因包括${region.causeZh}。`
      }
    },
    [
      {
        text: {
          en: `Law of Diminishing Marginal Returns: short-run marginal product declines because labor is fixed.`,
          zh: `边际报酬递减规律：短期内由于劳动力固定导致边际产量下降。`
        },
        explanation: {
          en: `Incorrect. The Law of Diminishing Marginal Returns applies strictly to the SHORT RUN where at least one factor is fixed; Economies of scale is a LONG-RUN concept where all inputs are variable.`,
          zh: `错误。边际报酬递减规律属于短期成本范畴（存在固定投入要素）；而规模经济属于长期（所有要素皆可调整）概念，不要混淆。`
        }
      },
      {
        text: {
          en: `Constant returns to scale: Total Revenue equals Total Cost in both short run and long run.`,
          zh: `规模报酬不变：无论短期还是长期，总收益必定等于总成本。`
        },
        explanation: {
          en: `Incorrect. Constant returns to scale means LRATC remains flat as output changes, not that revenue equals cost.`,
          zh: `错误。规模报酬不变指的是产量扩张时 LRATC 保持平直不变，并不等同于收益等于成本。`
        }
      },
      {
        text: {
          en: `Shutdown rule: Average Fixed Cost exceeds Marginal Revenue.`,
          zh: `停产规则：平均固定成本超过了边际收益。`
        },
        explanation: {
          en: `Incorrect. Shutdown decisions depend on Price vs AVC in the short run, not AFC.`,
          zh: `错误。停产决策取决于价格与 AVC 的比较，与 AFC 无关。`
        }
      }
    ]
  );

  return {
    id: `dyn-lratc-${Date.now()}-${randomInt(100, 999)}`,
    unit: 3,
    topicCode: '3.3',
    topicId: 'lratc-economies-of-scale',
    isDynamic: true,
    templateId: 'dyn-lratc-scale-economies',
    prompt: {
      en: `A manufacturing firm plans to build a new factory. Over the long-run planning horizon where all inputs are variable, economists observe the phenomenon of "${region.en}". How is this long-run cost behavior correctly defined?`,
      zh: `某制造企业正规划新建生产基地。在所有要素均可调整的长期规划视界内，经济学家观察到了“${region.zh}”现象。关于该长期成本特征的正确经济学表述是：`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `In the long run, firms experience: 1) Economies of scale (downward-sloping LRATC); 2) Minimum Efficient Scale (MES, lowest output where min LRATC is reached); 3) Constant returns to scale (flat LRATC); 4) Diseconomies of scale (upward-sloping LRATC due to managerial coordination failure).`,
      zh: `长期平均成本曲线（LRATC）三大阶段：1) 规模经济阶段（LRATC 单调下降）；2) 最小有效规模 MES（达到最低单位成本的最早产量）；3) 规模报酬不变阶段（LRATC 平直）；4) 规模不经济阶段（组织协调低效导致 LRATC 上扬）。`
    }
  };
}

/**
 * Discrete Cost Schedule Table Calculations (MC, ATC, AVC, TFC) (Topic 3.2)
 */
export function generateDiscreteCostScheduleQuestion(): PracticeQuestion {
  const tfc = randomChoice([30, 40, 50, 60]);
  const mc1 = randomChoice([10, 15, 20]);
  const mc2 = mc1 - randomChoice([2, 4]); // diminishing returns starts after unit 2
  const mc3 = mc2 + randomChoice([5, 8]);
  const mc4 = mc3 + randomChoice([8, 12]);

  const tc0 = tfc;
  const tc1 = tc0 + mc1;
  const tc2 = tc1 + mc2;
  const tc3 = tc2 + mc3;
  const tc4 = tc3 + mc4;

  const targetQ = randomChoice([2, 3, 4]);
  let targetMC = 0;
  let targetATC = 0;
  let prevTC = 0;
  let currTC = 0;

  if (targetQ === 2) {
    targetMC = mc2;
    currTC = tc2;
    prevTC = tc1;
    targetATC = Number((tc2 / 2).toFixed(1));
  } else if (targetQ === 3) {
    targetMC = mc3;
    currTC = tc3;
    prevTC = tc2;
    targetATC = Number((tc3 / 3).toFixed(1));
  } else {
    targetMC = mc4;
    currTC = tc4;
    prevTC = tc3;
    targetATC = Number((tc4 / 4).toFixed(1));
  }

  const { options, correctOptionId } = buildFourOptions(
    {
      text: {
        en: `Marginal Cost (MC) = $${targetMC}; Average Total Cost (ATC) = $${targetATC}`,
        zh: `边际成本 MC = $${targetMC}；平均总成本 ATC = $${targetATC}`
      },
      explanation: {
        en: `Correct! MC at Q=${targetQ} is ΔTC/ΔQ = ($${currTC} - $${prevTC}) / 1 = $${targetMC}. ATC at Q=${targetQ} is TC/Q = $${currTC} / ${targetQ} = $${targetATC}.`,
        zh: `回答正确！第 ${targetQ} 件的 MC = ΔTC / ΔQ = ($${currTC} - $${prevTC}) / 1 = $${targetMC}。该产量下的 ATC = TC / Q = $${currTC} / ${targetQ} = $${targetATC}。`
      }
    },
    [
      {
        text: {
          en: `Marginal Cost (MC) = $${targetATC}; Average Total Cost (ATC) = $${targetMC}`,
          zh: `边际成本 MC = $${targetATC}；平均总成本 ATC = $${targetMC}`
        },
        explanation: {
          en: `Incorrect. Inverted the definitions of MC (incremental cost) and ATC (average cost per unit).`,
          zh: `错误。颠倒了边际成本（增量）与平均总成本（总额除以产量）的概念。`
        }
      },
      {
        text: {
          en: `Marginal Cost (MC) = $${currTC}; Average Total Cost (ATC) = $${tfc}`,
          zh: `边际成本 MC = $${currTC}；平均总成本 ATC = $${tfc}`
        },
        explanation: {
          en: `Incorrect. Confused total cost with marginal cost, and fixed cost with average total cost.`,
          zh: `错误。把总成本直接当成了边际成本，把固定成本当成了平均总成本。`
        }
      },
      {
        text: {
          en: `Marginal Cost (MC) = $${targetMC}; Average Variable Cost (AVC) = $${targetATC}`,
          zh: `边际成本 MC = $${targetMC}；平均可变成本 AVC = $${targetATC}`
        },
        explanation: {
          en: `Incorrect. $${targetATC} is ATC, which includes fixed costs. AVC is (TC - TFC) / Q, which is strictly lower than ATC.`,
          zh: `错误。$${targetATC} 包含固定成本属于 ATC。AVC 必须剔除固定成本，数值必然小于 ATC。`
        }
      }
    ]
  );

  return {
    id: `dyn-discrete-cost-${Date.now()}-${randomInt(100, 999)}`,
    unit: 3,
    topicCode: '3.2',
    topicId: 'cost-curves-short-run',
    isDynamic: true,
    templateId: 'dyn-discrete-cost-schedule',
    prompt: {
      en: `A firm's short-run cost schedule is: Q=0: TC=$${tc0}; Q=1: TC=$${tc1}; Q=2: TC=$${tc2}; Q=3: TC=$${tc3}; Q=4: TC=$${tc4}. What is the Marginal Cost (MC) and Average Total Cost (ATC) of producing the ${targetQ}th unit?`,
      zh: `某企业的短期总成本序列为：Q=0: TC=$${tc0}；Q=1: TC=$${tc1}；Q=2: TC=$${tc2}；Q=3: TC=$${tc3}；Q=4: TC=$${tc4}。求生产第 ${targetQ} 个单位产品时的边际成本（MC）以及该产量下的平均总成本（ATC）：`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `Formulas: MC = ΔTC / ΔQ. ATC = TC / Q. Notice that at Q=0, TC = TFC = $${tfc}.`,
      zh: `公式解析：MC = ΔTC / ΔQ。ATC = TC / Q。注意当 Q=0 时，全部成本为固定成本 TFC = $${tfc}。`
    }
  };
}

/**
 * Perfect Competition Long-Run Equilibrium Entry/Exit Adjustment (Topic 3.7)
 */
export function generatePerfectCompLongRunAdjustmentQuestion(): PracticeQuestion {
  const isProfit = Math.random() > 0.5;
  const minAtc = randomInt(20, 35);
  const marketPrice = isProfit ? minAtc + randomChoice([5, 8, 12]) : minAtc - randomChoice([4, 6]);

  const { options, correctOptionId } = buildFourOptions(
    {
      text: {
        en: isProfit
          ? `In the short run, firms earn positive economic profits. In the long run, new firms enter the industry, shifting market supply rightward, driving price down until P = min ATC (zero economic profit).`
          : `In the short run, firms incur economic losses. In the long run, existing firms exit the industry, shifting market supply leftward, driving price up until P = min ATC (zero economic profit).`,
        zh: isProfit
          ? `短期内在位企业赚取超额经济利润。在长期中，新企业不断涌入该行业，导致市场供给曲线右移，迫使市场价格回落直至 P = min ATC（经济利润回归为零/正常利润）。`
          : `短期内企业遭受经济亏损。在长期中，部分企业退出该行业，导致市场供给曲线左移，推动市场价格回升直至 P = min ATC（经济利润回归为零/正常利润）。`
      },
      explanation: {
        en: `Correct! Under free entry and exit in perfect competition, short-run economic profits attract entrants (shifting Supply right, lowering P to min ATC). Short-run losses induce exits (shifting Supply left, raising P to min ATC). Long-run equilibrium guarantees P = MC = min ATC.`,
        zh: `回答正确！完全竞争市场的自由进退机制：短期超额利润吸引新企业进入（市场供给右移，降价至 min ATC）；短期亏损促使在位企业退出（市场供给左移，涨价至 min ATC）。长期必然稳定在零经济利润（P = min ATC）。`
      }
    },
    [
      {
        text: {
          en: isProfit
            ? `Existing firms will raise their prices above $${marketPrice} to maximize profits further.`
            : `Firms will collectively decide to lower supply prices to sell more volume.`,
          zh: isProfit
            ? `在位企业将主动把价格抬高到 $${marketPrice} 之上以追求更大利润。`
            : `在位企业将联合降价以图多销。`
        },
        explanation: {
          en: `Incorrect. Individual firms in perfect competition are price takers with zero market power.`,
          zh: `错误。完全竞争厂商无任何市场定价权，只能被动接受市场价格。`
        }
      },
      {
        text: {
          en: `Economic profits or losses will persist permanently in the long run because existing firms hold patents.`,
          zh: `超额利润或亏损在长期中将永久持续，因为在位企业拥有排他性专利。`
        },
        explanation: {
          en: `Incorrect. Perfect competition assumes identical products and zero barriers to entry/exit.`,
          zh: `错误。完全竞争市场假设商品完全同质且无任何进出壁垒，专利属于垄断特征。`
        }
      },
      {
        text: {
          en: `Long-run market price will permanently fall to zero due to continuous influx of firms.`,
          zh: `长期市场价格将因无限企业进入而最终彻底跌至零。`
        },
        explanation: {
          en: `Incorrect. Entry halts once economic profits hit zero at P = min ATC.`,
          zh: `错误。一旦价格降到 min ATC，经济利润为零，新企业的进入冲动即刻停止。`
        }
      }
    ]
  );

  return {
    id: `dyn-pc-longrun-${Date.now()}-${randomInt(100, 999)}`,
    unit: 3,
    topicCode: '3.7',
    topicId: 'perfect-competition-side-by-side',
    isDynamic: true,
    templateId: 'dyn-perfect-competition-long-run',
    prompt: {
      en: `A constant-cost perfectly competitive industry is composed of identical firms. Each firm has min ATC = $${minAtc}. The current short-run market equilibrium price is P = $${marketPrice}. What process occurs as the industry transitions from the short run to the long-run equilibrium?`,
      zh: `某成本不变的完全竞争行业由众多同质企业构成。每家企业的平均总成本最低点 min ATC = $${minAtc}。当前短期市场均衡售价为 P = $${marketPrice}。从短期向长期均衡的动态调整过程中，会发生什么？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `Long-Run Competitive Equilibrium Condition: P = MR = MC = min ATC. Zero economic profit (normal profit) is achieved, satisfying both Productive Efficiency (P = min ATC) and Allocative Efficiency (P = MC).`,
      zh: `完全竞争长期均衡定理：P = MR = MC = min ATC。此时企业获得正常利润（经济利润为零），同时实现生产效率（P = min ATC）与配置效率（P = MC）。`
    }
  };
}
