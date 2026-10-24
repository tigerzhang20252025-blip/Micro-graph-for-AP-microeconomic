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
