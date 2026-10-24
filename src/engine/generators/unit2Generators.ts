import { PracticeQuestion } from '../../data/practiceQuestions';
import { randomInt, randomChoice, buildFourOptions } from './helper';

export function generateMarketEquilibriumSurplusQuestion(): PracticeQuestion {
  // P = a - b*Q and P = c + d*Q
  const a = randomChoice([80, 100, 120]);
  const c = randomChoice([10, 20]);
  const d = 1;

  // Q* = (a - c) / (b + d) = (a - c) / 2
  const qStar = (a - c) / 2;
  const pStar = c + d * qStar;

  // Consumer Surplus = (a - P*) * Q* / 2
  const cs = ((a - pStar) * qStar) / 2;
  // Producer Surplus = (P* - c) * Q* / 2
  const ps = ((pStar - c) * qStar) / 2;

  // Ask for Consumer Surplus or Producer Surplus
  const askCS = Math.random() > 0.5;
  const targetNameEn = askCS ? 'Consumer Surplus' : 'Producer Surplus';
  const targetNameZh = askCS ? '消费者剩余（CS）' : '生产者剩余（PS）';
  const targetVal = askCS ? cs : ps;

  const noHalfDistractor = targetVal * 2; // forget 1/2
  const revenueDistractor = pStar * qStar; // P* x Q*
  const wrongHalfDistractor = targetVal + 100;

  const { options, correctOptionId } = buildFourOptions(
    {
      text: { en: `$${targetVal.toLocaleString()}`, zh: `$${targetVal.toLocaleString()}` },
      explanation: {
        en: `Correct! Equilibrium occurs where Demand equals Supply: ${a} - Q = ${c} + Q => Q* = ${qStar}, P* = $${pStar}. ${targetNameEn} = 1/2 * base * height = 1/2 * ${qStar} * ${askCS ? a - pStar : pStar - c} = $${targetVal}.`,
        zh: `回答正确！市场供求平衡：${a} - Q = ${c} + Q => Q* = ${qStar}，P* = $${pStar}。${targetNameZh} = 1/2 * 底 * 高 = 1/2 * ${qStar} * ${askCS ? a - pStar : pStar - c} = $${targetVal}。`
      }
    },
    [
      {
        text: { en: `$${noHalfDistractor.toLocaleString()}`, zh: `$${noHalfDistractor.toLocaleString()}` },
        explanation: {
          en: `Incorrect. This forgets the 1/2 factor in the area of the surplus triangle (base * height).`,
          zh: `错误。遗漏了三角形面积公式中的 1/2 系数（底 × 高 ÷ 2）。`
        }
      },
      {
        text: { en: `$${revenueDistractor.toLocaleString()}`, zh: `$${revenueDistractor.toLocaleString()}` },
        explanation: {
          en: `Incorrect. $${revenueDistractor} is the Total Market Revenue (P* * Q*), not the surplus area.`,
          zh: `错误。$${revenueDistractor} 是市场总收入（P* × Q*），而非经济剩余面积。`
        }
      },
      {
        text: { en: `$${wrongHalfDistractor.toLocaleString()}`, zh: `$${wrongHalfDistractor.toLocaleString()}` },
        explanation: {
          en: `Incorrect. Review the equilibrium price and choke price intercept difference.`,
          zh: `错误。请重新核算截距与均衡价格的垂直距离。`
        }
      }
    ]
  );

  return {
    id: `dyn-mkt-eq-${Date.now()}-${randomInt(100, 999)}`,
    unit: 2,
    topicCode: '2.6',
    topicId: 'market-equilibrium-welfare',
    isDynamic: true,
    templateId: 'dyn-eq-surplus',
    prompt: {
      en: `A competitive market has Demand: P = ${a} - Q and Supply: P = ${c} + Q (where P is in dollars and Q is in units). At market equilibrium, what is the total ${targetNameEn}?`,
      zh: `某完全竞争市场的需求方程为 P = ${a} - Q，供给方程为 P = ${c} + Q（P 为美元单价，Q 为数量）。在市场自由竞争均衡点上，全市场的${targetNameZh}是多少？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `Equilibrium: ${a} - Q = ${c} + Q => 2Q = ${a - c} => Q* = ${qStar}, P* = $${pStar}. Consumer Surplus is the triangle below Demand and above P*: CS = 1/2 * (${a} - ${pStar}) * ${qStar} = $${cs}. Producer Surplus is below P* and above Supply: PS = 1/2 * (${pStar} - ${c}) * ${qStar} = $${ps}.`,
      zh: `求解均衡：${a} - Q = ${c} + Q => 2Q = ${a - c} => Q* = ${qStar}，P* = $${pStar}。消费者剩余为需求线下方、价格线上方的三角形：1/2 × (${a} - ${pStar}) × ${qStar} = $${cs}。生产者剩余为价格线下方、供给线上方的三角形：1/2 × (${pStar} - ${c}) × ${qStar} = $${ps}。`
    }
  };
}

export function generateElasticityTotalRevenueQuestion(): PracticeQuestion {
  const p1 = randomChoice([10, 20]);
  const p2 = p1 * 2; // price doubles
  const isElastic = Math.random() > 0.5;

  // If elastic: quantity drops by more than price increases (e.g. from 100 to 30) -> TR drops
  // If inelastic: quantity drops by less than price increases (e.g. from 100 to 80) -> TR rises
  const q1 = 100;
  const q2 = isElastic ? 30 : 80;

  const tr1 = p1 * q1;
  const tr2 = p2 * q2;
  const trChangeEn = tr2 > tr1 ? 'increase' : 'decrease';
  const trChangeZh = tr2 > tr1 ? '增加' : '减少';

  const { options, correctOptionId } = buildFourOptions(
    {
      text: {
        en: `Demand is ${isElastic ? 'price elastic' : 'price inelastic'}, so total revenue will ${trChangeEn}`,
        zh: `需求处于${isElastic ? '富有价格弹性' : '缺乏价格弹性'}区间，因此厂商总收益将${trChangeZh}`
      },
      explanation: {
        en: `Correct! Initial TR = $${p1} * ${q1} = $${tr1}. New TR = $${p2} * ${q2} = $${tr2}. Total revenue ${trChangeEn}d when price rose, which mathematically proves demand is ${isElastic ? 'elastic (|PED| > 1)' : 'inelastic (|PED| < 1)'}.`,
        zh: `回答正确！初总收益 = $${p1} × ${q1} = $${tr1}；提价后总收益 = $${p2} × ${q2} = $${tr2}。价格上涨导致总收益${trChangeZh}，由总收益测试（Total Revenue Test）严格证明需求处于${isElastic ? '富有弹性（|PED| > 1）' : '缺乏弹性（|PED| < 1）'}区间。`
      }
    },
    [
      {
        text: {
          en: `Demand is ${isElastic ? 'price inelastic' : 'price elastic'}, so total revenue will ${trChangeEn}`,
          zh: `需求处于${isElastic ? '缺乏价格弹性' : '富有价格弹性'}区间，因此厂商总收益将${trChangeZh}`
        },
        explanation: {
          en: `Incorrect. The direction of total revenue change contradicts this elasticity classification under the Total Revenue Test.`,
          zh: `错误。总收益的增减方向与该弹性分类在总收益测试中的对应关系相反。`
        }
      },
      {
        text: {
          en: `Demand is unit elastic, so total revenue will remain completely unchanged`,
          zh: `需求处于单位弹性区间，因此厂商总收益将保持恒定不变`
        },
        explanation: {
          en: `Incorrect. Unit elasticity requires TR1 = TR2, but here TR changed from $${tr1} to $${tr2}.`,
          zh: `错误。单位弹性要求前后总收益绝对相等，但本题中总收益从 $${tr1} 变为了 $${tr2}。`
        }
      },
      {
        text: {
          en: `Demand is perfectly inelastic, so quantity demanded will not change at all`,
          zh: `需求完全无弹性，因此需求量绝不会发生任何改变`
        },
        explanation: {
          en: `Incorrect. Quantity demanded fell from ${q1} to ${q2}, so it is not perfectly inelastic.`,
          zh: `错误。数量从 ${q1} 下降至 ${q2}，显然不是完全缺乏弹性的垂直线。`
        }
      }
    ]
  );

  return {
    id: `dyn-ped-tr-${Date.now()}-${randomInt(100, 999)}`,
    unit: 2,
    topicCode: '2.3',
    topicId: 'price-elasticity-demand',
    isDynamic: true,
    templateId: 'dyn-ped-tr-test',
    prompt: {
      en: `When the price of a ticket increases from $${p1} to $${p2}, the quantity demanded decreases from ${q1} to ${q2} tickets per day. According to the Total Revenue Test, what can be concluded about the price elasticity of demand?`,
      zh: `当门票价格从 $${p1} 上调至 $${p2} 时，每天的售票需求量从 ${q1} 张缩减至 ${q2} 张。根据总收益测试法（Total Revenue Test），对该商品的需求价格弹性可以得出什么结论？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `Total Revenue Test: When Price rises, if Total Revenue falls, Demand is Elastic (Quantity effect dominates). If Total Revenue rises, Demand is Inelastic (Price effect dominates). Here: TR1 = $${tr1}, TR2 = $${tr2} => TR ${trChangeEn}d => Demand is ${isElastic ? 'Elastic' : 'Inelastic'}.`,
      zh: `总收益测试规律：价格上涨时，若总收益下降，则需求富有弹性（数量效应主导）；若总收益上升，则需求缺乏弹性（价格效应主导）。本题中：TR1 = $${tr1}，TR2 = $${tr2} => 总收益${trChangeZh} => 需求${isElastic ? '富有弹性' : '缺乏弹性'}。`
    }
  };
}

export function generateExciseTaxDwlQuestion(): PracticeQuestion {
  const tax = randomChoice([10, 16, 20]);
  const qReduction = randomChoice([4, 6, 8, 10]);
  const dwl = (tax * qReduction) / 2;
  const qStar = randomInt(40, 60);
  const qTax = qStar - qReduction;
  const govRevenue = tax * qTax;

  const { options, correctOptionId } = buildFourOptions(
    {
      text: { en: `$${dwl.toFixed(0)}`, zh: `$${dwl.toFixed(0)}` },
      explanation: {
        en: `Correct! Deadweight Loss (DWL) triangle = 1/2 * Tax * (Q* - Qt) = 1/2 * $${tax} * ${qReduction} = $${dwl.toFixed(0)}.`,
        zh: `回答正确！无谓损失（DWL）三角形面积 = 1/2 × 税额 × (Q* - Qt) = 1/2 × $${tax} × ${qReduction} = $${dwl.toFixed(0)}。`
      }
    },
    [
      {
        text: { en: `$${(dwl * 2).toFixed(0)}`, zh: `$${(dwl * 2).toFixed(0)}` },
        explanation: {
          en: `Incorrect. This calculates Tax * ΔQ without multiplying by 1/2 for the triangle area.`,
          zh: `错误。遗漏了三角形面积的 1/2 系数，直接计算了长方形 Tax × ΔQ。`
        }
      },
      {
        text: { en: `$${govRevenue.toFixed(0)}`, zh: `$${govRevenue.toFixed(0)}` },
        explanation: {
          en: `Incorrect. $${govRevenue} is the Government Tax Revenue (Tax * Qt), not the Deadweight Loss.`,
          zh: `错误。$${govRevenue} 是政府收取的税收总额（Tax × Qt），而非社会无谓损失。`
        }
      },
      {
        text: { en: `$${(govRevenue + dwl).toFixed(0)}`, zh: `$${(govRevenue + dwl).toFixed(0)}` },
        explanation: {
          en: `Incorrect. This represents the total reduction in Consumer and Producer Surplus, not the net deadweight loss.`,
          zh: `错误。该数值代表买家与卖家失去的全部经济剩余总和，而非无法回收的净无谓损失。`
        }
      }
    ]
  );

  return {
    id: `dyn-tax-dwl-${Date.now()}-${randomInt(100, 999)}`,
    unit: 2,
    topicCode: '2.8',
    topicId: 'gov-intervention-taxes-deadweight',
    isDynamic: true,
    templateId: 'dyn-tax-dwl-calculation',
    prompt: {
      en: `A per-unit excise tax of $${tax} is imposed on a competitive market. As a result, the market quantity produced and consumed drops from Q* = ${qStar} units to Qt = ${qTax} units. What is the Deadweight Loss (DWL) generated by this tax?`,
      zh: `政府在某完全竞争市场上对每单位商品征收 $${tax} 的从量消费税。结果使该商品的市场产销量由原本的 Q* = ${qStar} 降低至 Qt = ${qTax}。该税收所造成的社会净无谓损失（DWL）是多少？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `Deadweight Loss of a tax = 1/2 * Tax Wedge * (Q* - Qt). Here: 1/2 * $${tax} * (${qStar} - ${qTax}) = 1/2 * $${tax} * ${qReduction} = $${dwl.toFixed(0)}.`,
      zh: `消费税无谓损失计算公式 = 1/2 × 税收楔子 × (Q* - Qt)。本题中：1/2 × $${tax} × (${qStar} - ${qTax}) = 1/2 × $${tax} × ${qReduction} = $${dwl.toFixed(0)}。`
    }
  };
}

export function generatePriceControlQuestion(): PracticeQuestion {
  const isCeiling = Math.random() > 0.5;
  const pStar = 50;
  const pControl = isCeiling ? 35 : 65; // binding
  const qD = isCeiling ? 70 : 30;
  const qS = isCeiling ? 30 : 70;
  const diff = Math.abs(qD - qS); // 40 units

  const resultTypeEn = isCeiling ? 'shortage' : 'surplus';
  const resultTypeZh = isCeiling ? '短缺' : '过剩';

  const { options, correctOptionId } = buildFourOptions(
    {
      text: {
        en: `A binding price ${isCeiling ? 'ceiling' : 'floor'} creating a ${resultTypeEn} of ${diff} units`,
        zh: `一个有约束力的价格${isCeiling ? '上限' : '下限'}，造成 ${diff} 单位的产品${resultTypeZh}`
      },
      explanation: {
        en: `Correct! Because the price ${isCeiling ? 'ceiling ($35) is set BELOW' : 'floor ($65) is set ABOVE'} equilibrium ($50), it is binding. At this price, ${isCeiling ? 'Qd (70) > Qs (30)' : 'Qs (70) > Qd (30)'}, creating a ${resultTypeEn} of ${diff} units.`,
        zh: `回答正确！因为价格${isCeiling ? '上限（$35）设定在均衡价（$50）下方' : '下限（$65）设定在均衡价（$50）上方'}，因此具备法定约束力。在该价格下，${isCeiling ? '需求量（70）大于供给量（30）' : '供给量（70）大于需求量（30）'}，造成 ${diff} 单位的${resultTypeZh}。`
      }
    },
    [
      {
        text: {
          en: `A non-binding price ${isCeiling ? 'ceiling' : 'floor'} with no effect on market equilibrium`,
          zh: `一个无约束力的价格${isCeiling ? '上限' : '下限'}，对市场自由均衡无任何影响`
        },
        explanation: {
          en: `Incorrect. A price ${isCeiling ? 'ceiling below' : 'floor above'} equilibrium is legally binding and prevents the market from reaching P*.`,
          zh: `错误。低于均衡价的价格上限（或高于均衡价的价格下限）具有强制约束力，会阻止市场回到均衡点。`
        }
      },
      {
        text: {
          en: `A binding price ${isCeiling ? 'floor' : 'ceiling'} creating a ${isCeiling ? 'surplus' : 'shortage'} of ${diff} units`,
          zh: `一个有约束力的价格${isCeiling ? '下限' : '上限'}，造成 ${diff} 单位的产品${isCeiling ? '过剩' : '短缺'}`
        },
        explanation: {
          en: `Incorrect. Ceilings set maximum legal prices (causing shortages), while floors set minimum legal prices (causing surpluses).`,
          zh: `错误。上限（Ceiling）是法定最高限价（造成短缺），下限（Floor）是法定最低限价（造成过剩），不要混淆两者。`
        }
      },
      {
        text: {
          en: `A binding price control where market quantity traded expands to 70 units`,
          zh: `一个有约束力的价格管制，使实际市场交易量扩大到 70 单位`
        },
        explanation: {
          en: `Incorrect. Transactions require voluntary trade; actual quantity traded is limited by the shorter side of the market (30 units).`,
          zh: `错误。市场自愿交易量受制于供求较少的一方（Short side of market），实际交易量仅为 30 单位。`
        }
      }
    ]
  );

  return {
    id: `dyn-price-control-${Date.now()}-${randomInt(100, 999)}`,
    unit: 2,
    topicCode: '2.8',
    topicId: 'price-controls-ceilings-floors',
    isDynamic: true,
    templateId: 'dyn-price-controls-binding',
    prompt: {
      en: `In a market with equilibrium price P* = $${pStar}, the government enacts a legal maximum price of $${pControl} (if ceiling) or legal minimum price of $${pControl} (if floor). At $${pControl}, Quantity Demanded is ${qD} units and Quantity Supplied is ${qS} units. What is the market outcome?`,
      zh: `在均衡价格为 P* = $${pStar} 的市场上，政府颁布了法定管制价格 $${pControl}。在 $${pControl} 下，消费者的需求量为 ${qD} 单位，生产者的供给量为 ${qS} 单位。该政策的市场结果是什么？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `Binding Price Ceiling: Set below P*, causes Shortage (Qd > Qs). Binding Price Floor: Set above P*, causes Surplus (Qs > Qd).`,
      zh: `有约束力价格上限：低于均衡价，引发市场短缺（Qd > Qs）。有约束力价格下限：高于均衡价，引发产品过剩（Qs > Qd）。`
    }
  };
}

/**
 * Cross-Price Elasticity & Income Elasticity (Topic 2.4 / 2.5)
 */
export function generateCrossIncomeElasticityQuestion(): PracticeQuestion {
  const isCross = Math.random() > 0.5;

  if (isCross) {
    // Cross-Price Elasticity: XED = %ΔQ_A / %ΔP_B
    const goodPairs = [
      {
        goodA: { en: 'Coffee', zh: '咖啡' },
        goodB: { en: 'Tea', zh: '茶叶' },
        relation: 'substitute',
        relEn: 'substitutes (positive XED)',
        relZh: '替代品（XED 为正）'
      },
      {
        goodA: { en: 'Hot Dogs', zh: '热狗' },
        goodB: { en: 'Hot Dog Buns', zh: '热狗面包' },
        relation: 'complement',
        relEn: 'complements (negative XED)',
        relZh: '互补品（XED 为负）'
      },
      {
        goodA: { en: 'Printers', zh: '打印机' },
        goodB: { en: 'Ink Cartridges', zh: '墨盒' },
        relation: 'complement',
        relEn: 'complements (negative XED)',
        relZh: '互补品（XED 为负）'
      },
      {
        goodA: { en: 'Movie Tickets', zh: '电影票' },
        goodB: { en: 'Streaming Subscriptions', zh: '流媒体会员' },
        relation: 'substitute',
        relEn: 'substitutes (positive XED)',
        relZh: '替代品（XED 为正）'
      }
    ];
    const pair = randomChoice(goodPairs);
    const deltaPB = randomChoice([10, 15, 20]);
    // If substitute: +deltaPB causes +deltaQA; if complement: +deltaPB causes -deltaQA
    const xedCoeff = pair.relation === 'substitute' ? randomChoice([0.5, 0.8, 1.2, 1.5]) : -randomChoice([0.5, 0.8, 1.2, 1.5]);
    const deltaQA = Math.round(deltaPB * xedCoeff);

    const { options, correctOptionId } = buildFourOptions(
      {
        text: {
          en: `XED = ${xedCoeff > 0 ? '+' : ''}${xedCoeff.toFixed(2)}; the goods are ${pair.relEn}.`,
          zh: `交叉价格弹性 XED = ${xedCoeff > 0 ? '+' : ''}${xedCoeff.toFixed(2)}；两种物品属于${pair.relZh}。`
        },
        explanation: {
          en: `Correct! XED = %ΔQuantity demanded of Good A / %ΔPrice of Good B = (${deltaQA}%) / (+${deltaPB}%) = ${xedCoeff.toFixed(2)}. Positive XED indicates substitutes; negative XED indicates complements.`,
          zh: `回答正确！交叉弹性公式 XED = %ΔQ_A / %ΔP_B = (${deltaQA}%) / (+${deltaPB}%) = ${xedCoeff.toFixed(2)}。XED > 0 为替代品，XED < 0 为互补品。`
        }
      },
      [
        {
          text: {
            en: `XED = ${(-xedCoeff).toFixed(2)}; the goods are ${pair.relation === 'substitute' ? 'complements' : 'substitutes'}.`,
            zh: `交叉价格弹性 XED = ${(-xedCoeff).toFixed(2)}；两种物品属于${pair.relation === 'substitute' ? '互补品' : '替代品'}。`
          },
          explanation: {
            en: `Incorrect. The sign of the elasticity was reversed.`,
            zh: `错误。弹性的正负符号计算颠倒了。`
          }
        },
        {
          text: {
            en: `XED = ${Number((1 / xedCoeff).toFixed(2))}; the goods are normal goods.`,
            zh: `交叉价格弹性 XED = ${Number((1 / xedCoeff).toFixed(2))}；两种物品属于正常品。`
          },
          explanation: {
            en: `Incorrect. Inverted the ratio (%ΔP / %ΔQ) and confused cross-price elasticity with income elasticity.`,
            zh: `错误。颠倒了分子与分母（算成了 %ΔP / %ΔQ），并将交叉弹性混淆为了收入弹性概念。`
          }
        },
        {
          text: {
            en: `XED = 0; the goods are unrelated independent goods.`,
            zh: `交叉价格弹性 XED = 0；两种物品完全独立无关。`
          },
          explanation: {
            en: `Incorrect. A non-zero change in demand in response to price implies they are economically related.`,
            zh: `错误。商品 B 价格变动明显引起了商品 A 需求量的变化，两者绝非无关独立品。`
          }
        }
      ]
    );

    return {
      id: `dyn-xed-${Date.now()}-${randomInt(100, 999)}`,
      unit: 2,
      topicCode: '2.4',
      topicId: 'price-elasticity-demand',
      isDynamic: true,
      templateId: 'dyn-elasticity-cross-income',
      prompt: {
        en: `When the price of ${pair.goodB.en} increases by ${deltaPB}%, the quantity demanded of ${pair.goodA.en} changes by ${deltaQA > 0 ? '+' : ''}${deltaQA}%. What is the cross-price elasticity of demand (XED), and what is the relationship between the two goods?`,
        zh: `当${pair.goodB.zh}的价格上涨 ${deltaPB}% 时，消费者对${pair.goodA.zh}的需求量变动了 ${deltaQA > 0 ? '+' : ''}${deltaQA}%。求该交叉价格弹性（XED），并判断两种商品之间的经济关系：`
      },
      options,
      correctOptionId,
      overallExplanation: {
        en: `Cross-Price Elasticity of Demand: XED = (%ΔQ_A) / (%ΔP_B). Positive XED indicates substitutes (price of one good and demand for another move in the same direction). Negative XED indicates complements.`,
        zh: `需求交叉价格弹性 XED = (%ΔQ_A) / (%ΔP_B)。XED 为正表示两者为替代品（同向变动）；XED 为负表示两者为互补品（反向变动）。`
      }
    };
  } else {
    // Income Elasticity: YED = %ΔQ / %ΔIncome
    const deltaI = randomChoice([5, 10, 15, 20]);
    const isNormal = Math.random() > 0.4;
    const yed = isNormal ? randomChoice([0.5, 0.8, 1.2, 1.8]) : -randomChoice([0.4, 0.7, 1.2]);
    const deltaQ = Math.round(deltaI * yed);

    const goodName = isNormal
      ? (yed > 1 ? { en: 'Fine Dining', zh: '高档精致餐饮' } : { en: 'Fresh Produce', zh: '生鲜水果' })
      : { en: 'Instant Noodles', zh: '平价方便面' };

    const { options, correctOptionId } = buildFourOptions(
      {
        text: {
          en: `YED = ${yed > 0 ? '+' : ''}${yed.toFixed(2)}; the good is ${isNormal ? (yed > 1 ? 'a luxury normal good' : 'a normal necessity') : 'an inferior good'}.`,
          zh: `收入弹性 YED = ${yed > 0 ? '+' : ''}${yed.toFixed(2)}；该物品属于${isNormal ? (yed > 1 ? '奢侈正常品' : '必需正常品') : '劣等品（低档品）'}。`
        },
        explanation: {
          en: `Correct! YED = %ΔQ / %ΔIncome = (${deltaQ}%) / (+${deltaI}%) = ${yed.toFixed(2)}. YED > 0 defines a normal good; YED < 0 defines an inferior good.`,
          zh: `回答正确！收入弹性 YED = %ΔQ / %Δ收入 = (${deltaQ}%) / (+${deltaI}%) = ${yed.toFixed(2)}。YED > 0 为正常品，YED < 0 为劣等品。`
        }
      },
      [
        {
          text: {
            en: `YED = ${(-yed).toFixed(2)}; the good is ${isNormal ? 'an inferior good' : 'a normal good'}.`,
            zh: `收入弹性 YED = ${(-yed).toFixed(2)}；该物品属于${isNormal ? '劣等品' : '正常品'}。`
          },
          explanation: {
            en: `Incorrect. Inverted the positive/negative sign of the calculation.`,
            zh: `错误。正负符号计算反了。`
          }
        },
        {
          text: {
            en: `YED = ${Number((1 / yed).toFixed(2))}; the good has elastic supply.`,
            zh: `收入弹性 YED = ${Number((1 / yed).toFixed(2))}；该物品供给富有弹性。`
          },
          explanation: {
            en: `Incorrect. Inverted the formula (%ΔIncome / %ΔQ) and confused income elasticity with supply elasticity.`,
            zh: `错误。颠倒了公式且将消费者收入弹性混淆成了供给弹性。`
          }
        },
        {
          text: {
            en: `YED = 1.0; the good is perfectly price elastic.`,
            zh: `收入弹性 YED = 1.0；该物品具有完全价格弹性。`
          },
          explanation: {
            en: `Incorrect. This confuses income elasticity with price elasticity of demand.`,
            zh: `错误。将需求收入弹性与需求价格弹性混淆。`
          }
        }
      ]
    );

    return {
      id: `dyn-yed-${Date.now()}-${randomInt(100, 999)}`,
      unit: 2,
      topicCode: '2.5',
      topicId: 'price-elasticity-demand',
      isDynamic: true,
      templateId: 'dyn-elasticity-cross-income',
      prompt: {
        en: `Consumer household incomes increase across an economy by ${deltaI}%. In response, total purchases of ${goodName.en} change by ${deltaQ > 0 ? '+' : ''}${deltaQ}%. What is the income elasticity of demand (YED) and classification of this good?`,
        zh: `某国居民家庭可支配收入普遍上涨了 ${deltaI}%。随之而来的是消费者对${goodName.zh}的总购买量变动了 ${deltaQ > 0 ? '+' : ''}${deltaQ}%。求需求收入弹性（YED）及该物品的属性类别：`
      },
      options,
      correctOptionId,
      overallExplanation: {
        en: `Income Elasticity of Demand: YED = (%ΔQuantity Demanded) / (%ΔIncome). If YED > 0, it is a normal good. If YED < 0, it is an inferior good.`,
        zh: `需求收入弹性公式：YED = (%ΔQ) / (%ΔIncome)。YED > 0 为正常品；YED < 0 为劣等品（随收入增长而购买量减少）。`
      }
    };
  }
}

/**
 * International Trade & Tariffs Welfare Deadweight Loss (Topic 2.9)
 */
export function generateTariffWelfareQuestion(): PracticeQuestion {
  const worldP = randomInt(20, 40);
  const tariff = randomChoice([5, 10, 15]);
  const domesticP = worldP + tariff;

  // Free trade quantities: Qd_free > Qs_free
  const qsFree = randomInt(10, 30);
  const qdFree = qsFree + randomChoice([50, 60, 80]);
  const importsFree = qdFree - qsFree;

  // With tariff: supply expands by dQs, demand shrinks by dQd
  const dQs = randomChoice([10, 15]);
  const dQd = randomChoice([10, 15]);
  const qsTariff = qsFree + dQs;
  const qdTariff = qdFree - dQd;
  const importsTariff = qdTariff - qsTariff;

  // Deadweight loss = 1/2 * tariff * (dQs + dQd)
  const dwl = 0.5 * tariff * (dQs + dQd);
  const tariffRevenue = tariff * importsTariff;

  const { options, correctOptionId } = buildFourOptions(
    {
      text: {
        en: `Imports decrease from ${importsFree} to ${importsTariff} units; Government Tariff Revenue is $${tariffRevenue}; Deadweight Loss is $${dwl}.`,
        zh: `进口量由 ${importsFree} 减少至 ${importsTariff} 单位；政府关税收入为 $${tariffRevenue}；社会无谓损失为 $${dwl}。`
      },
      explanation: {
        en: `Correct! Imports under tariff = ${qdTariff} - ${qsTariff} = ${importsTariff}. Tariff Revenue = Tariff ($${tariff}) × Imports (${importsTariff}) = $${tariffRevenue}. Deadweight Loss = 1/2 × Tariff × (production distortion ${dQs} + consumption distortion ${dQd}) = 0.5 × ${tariff} × ${dQs + dQd} = $${dwl}.`,
        zh: `回答正确！关税下进口量 = ${qdTariff} - ${qsTariff} = ${importsTariff}。政府关税收入 = 单位关税（$${tariff}）× 进口量（${importsTariff}）= $${tariffRevenue}。无谓损失 = 两个三角形面积之和 = 0.5 × ${tariff} × (${dQs} + ${dQd}) = $${dwl}。`
      }
    },
    [
      {
        text: {
          en: `Imports decrease to ${importsTariff} units, but there is zero deadweight loss because domestic producers gained surplus.`,
          zh: `进口量降至 ${importsTariff} 单位，但无谓损失为零，因为国内生产者获得了更多剩余。`
        },
        explanation: {
          en: `Incorrect. The expansion of domestic producer surplus does not offset the net loss in consumer surplus and efficiency distortions.`,
          zh: `错误。虽然国内厂商剩余增加，但消费者剩余的大幅萎缩与生产消费双重扭曲依然会造成两块净无谓损失三角形。`
        }
      },
      {
        text: {
          en: `Government Tariff Revenue is $${tariff * importsFree}; Deadweight Loss is $${dwl * 2}.`,
          zh: `政府关税收入为 $${tariff * importsFree}；无谓损失为 $${dwl * 2}。`
        },
        explanation: {
          en: `Incorrect. Tariff revenue is collected only on actual imported units after the tariff (${importsTariff}), not the free-trade volume.`,
          zh: `错误。政府关税收入只能基于征税后实际发生的进口量（${importsTariff}）计收，而非自由贸易时的进口量。`
        }
      },
      {
        text: {
          en: `Domestic consumer surplus increases because domestic manufacturers employ more workers.`,
          zh: `国内消费者剩余增加，因为国内制造业雇佣了更多工人。`
        },
        explanation: {
          en: `Incorrect. Higher domestic prices ($${domesticP} vs $${worldP}) strictly reduce consumer surplus.`,
          zh: `错误。国内购买价格上涨（由 $${worldP} 升至 $${domesticP}），消费者剩余必然减少。`
        }
      }
    ]
  );

  return {
    id: `dyn-tariff-${Date.now()}-${randomInt(100, 999)}`,
    unit: 2,
    topicCode: '2.9',
    topicId: 'international-trade-tariffs',
    isDynamic: true,
    templateId: 'dyn-tariff-welfare-calculation',
    prompt: {
      en: `A small open economy faces a world price of $${worldP} for steel. At $${worldP}, domestic producers supply ${qsFree} tons and domestic buyers demand ${qdFree} tons. The government imposes a $${tariff} per-ton tariff, raising the domestic price to $${domesticP}. At $${domesticP}, domestic supply expands to ${qsTariff} tons and domestic demand drops to ${qdTariff} tons. What are the welfare effects of this tariff?`,
      zh: `某国作为小型开放经济体，面临的世界钢材售价为每吨 $${worldP}。在 $${worldP} 下，国内钢厂仅供给 ${qsFree} 吨，而国内总需求达 ${qdFree} 吨。政府随后开征每吨 $${tariff} 的进口关税，国内售价涨至 $${domesticP}。在 $${domesticP} 下，国内钢厂增产至 ${qsTariff} 吨，国内需求压缩至 ${qdTariff} 吨。该关税政策的福利效应为：`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `A tariff raises domestic price above world price, reducing imports to (Qd - Qs). It generates government tariff revenue (Tariff × Imports) and creates two deadweight loss triangles: production inefficiency and consumption distortion.`,
      zh: `关税将国内价格抬高至世界价格之上，使进口量萎缩至 (Qd - Qs)。关税产生政府财政收入（单位关税 × 进口量），并产生两个无谓损失三角形（生产低效扭曲与消费抑制扭曲）。`
    }
  };
}

/**
 * Simultaneous Shifts in Demand and Supply (Topic 2.7)
 */
export function generateSimultaneousShiftsQuestion(): PracticeQuestion {
  const shiftScenarios = [
    {
      shiftEn: 'Demand increases (shifts right) and Supply decreases (shifts left)',
      shiftZh: '需求增加（需求曲线右移），同时供给减少（供给曲线左移）',
      resultEn: 'Equilibrium Price unambiguously INCREASES; Equilibrium Quantity is INDETERMINATE (ambiguous).',
      resultZh: '均衡价格必然上涨（P* 上涨）；均衡数量变动不确定（Q* 无法仅凭方向判定）。',
      distractor1En: 'Equilibrium Quantity increases; Equilibrium Price is indeterminate.',
      distractor1Zh: '均衡数量必然增加；均衡价格变动不确定。',
      distractor2En: 'Both Equilibrium Price and Equilibrium Quantity increase unambiguously.',
      distractor2Zh: '均衡价格与均衡数量均必然同时增加。'
    },
    {
      shiftEn: 'Demand decreases (shifts left) and Supply increases (shifts right)',
      shiftZh: '需求减少（需求曲线左移），同时供给增加（供给曲线右移）',
      resultEn: 'Equilibrium Price unambiguously DECREASES; Equilibrium Quantity is INDETERMINATE (ambiguous).',
      resultZh: '均衡价格必然下跌（P* 下跌）；均衡数量变动不确定（Q* 无法仅凭方向判定）。',
      distractor1En: 'Equilibrium Quantity decreases; Equilibrium Price is indeterminate.',
      distractor1Zh: '均衡数量必然减少；均衡价格变动不确定。',
      distractor2En: 'Both Equilibrium Price and Equilibrium Quantity decrease unambiguously.',
      distractor2Zh: '均衡价格与均衡数量均必然同时减少。'
    },
    {
      shiftEn: 'Both Demand and Supply increase simultaneously (both shift right)',
      shiftZh: '需求与供给同时增加（两条曲线均向右平移）',
      resultEn: 'Equilibrium Quantity unambiguously INCREASES; Equilibrium Price is INDETERMINATE (ambiguous).',
      resultZh: '均衡数量必然增加（Q* 增加）；均衡价格变动不确定（P* 无法仅凭方向判定）。',
      distractor1En: 'Equilibrium Price increases; Equilibrium Quantity is indeterminate.',
      distractor1Zh: '均衡价格必然上涨；均衡数量变动不确定。',
      distractor2En: 'Both Equilibrium Price and Equilibrium Quantity increase unambiguously.',
      distractor2Zh: '均衡价格与均衡数量均必然同时增加。'
    },
    {
      shiftEn: 'Both Demand and Supply decrease simultaneously (both shift left)',
      shiftZh: '需求与供给同时减少（两条曲线均向左平移）',
      resultEn: 'Equilibrium Quantity unambiguously DECREASES; Equilibrium Price is INDETERMINATE (ambiguous).',
      resultZh: '均衡数量必然减少（Q* 减少）；均衡价格变动不确定（P* 无法仅凭方向判定）。',
      distractor1En: 'Equilibrium Price decreases; Equilibrium Quantity is indeterminate.',
      distractor1Zh: '均衡价格必然下跌；均衡数量变动不确定。',
      distractor2En: 'Both Equilibrium Price and Equilibrium Quantity decrease unambiguously.',
      distractor2Zh: '均衡价格与均衡数量均必然同时减少。'
    }
  ];

  const scenario = randomChoice(shiftScenarios);
  const market = randomChoice([
    { en: 'Electric Vehicles', zh: '电动汽车' },
    { en: 'Specialty Coffee', zh: '精品咖啡' },
    { en: 'Commercial Airline Flights', zh: '民航客运' }
  ]);

  const { options, correctOptionId } = buildFourOptions(
    {
      text: { en: scenario.resultEn, zh: scenario.resultZh },
      explanation: {
        en: `Correct! With double shifts, one variable (P or Q) moves unambiguously, while the other is indeterminate unless the relative magnitudes of the shifts are specified.`,
        zh: `回答正确！当供求双向平移时，其中一个变量（P 或 Q）的方向必定确定，而另一个变量在未知平移具体幅度时必然是不确定的（Indeterminate）。`
      }
    },
    [
      {
        text: { en: scenario.distractor1En, zh: scenario.distractor1Zh },
        explanation: {
          en: `Incorrect. Inverts which variable is certain versus indeterminate.`,
          zh: `错误。颠倒了确定变动与不确定变动的变量。`
        }
      },
      {
        text: { en: scenario.distractor2En, zh: scenario.distractor2Zh },
        explanation: {
          en: `Incorrect. Assumes both variables can be determined without knowing relative shift magnitudes.`,
          zh: `错误。在未知两条曲线相对平移幅度大小时，不可能同时断定两者的具体增减。`
        }
      },
      {
        text: {
          en: `The market remains in original equilibrium because shifts in demand cancel out shifts in supply.`,
          zh: `市场将保持原均衡不变，因为需求的平移与供给的平移会完全相互抵消。`
        },
        explanation: {
          en: `Incorrect. Shifts do not cancel out; market forces establish a new equilibrium.`,
          zh: `错误。两个外生冲击不会凭空抵消，市场必定会形成新的均衡点。`
        }
      }
    ]
  );

  return {
    id: `dyn-double-shift-${Date.now()}-${randomInt(100, 999)}`,
    unit: 2,
    topicCode: '2.7',
    topicId: 'market-equilibrium-welfare',
    isDynamic: true,
    templateId: 'dyn-simultaneous-shifts',
    prompt: {
      en: `In the market for ${market.en}, suppose ${scenario.shiftEn}. Without knowing the relative magnitude of the two shifts, what can be definitively concluded about the new equilibrium price and quantity?`,
      zh: `在${market.zh}市场上，假定${scenario.shiftZh}。在未知两次平移相对具体幅度大小的前提下，关于新的市场均衡价格（P*）与均衡数量（Q*），可以得出什么确切结论？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `AP Micro Indeterminacy Rule: When D and S shift simultaneously in opposite directions, Price change is certain, Quantity is indeterminate. When D and S shift in the same direction, Quantity change is certain, Price is indeterminate.`,
      zh: `AP 微观双平移定理口诀：同向平移量确定（D与S同增/同减，Q* 必定增加/减少，P* 不确定）；反向平移价确定（D增S减/D减S增，P* 必定上涨/下跌，Q* 不确定）。`
    }
  };
}
