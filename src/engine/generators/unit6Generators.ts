import { PracticeQuestion } from '../../data/practiceQuestions';
import { randomInt, randomChoice, buildFourOptions } from './helper';

export function generateExternalitiesQuestion(): PracticeQuestion {
  const isNegative = Math.random() > 0.5;
  const externalAmount = randomChoice([10, 15, 20]);
  const qMarket = randomInt(45, 60);
  const qOpt = isNegative ? qMarket - 15 : qMarket + 15;

  const { options, correctOptionId } = buildFourOptions(
    {
      text: {
        en: isNegative
          ? `Impose a per-unit Pigouvian tax equal to $${externalAmount} (the Marginal External Cost)`
          : `Provide a per-unit Pigouvian subsidy equal to $${externalAmount} (the Marginal External Benefit)`,
        zh: isNegative
          ? `征收等于 $${externalAmount}（边际外部成本 MEC）的每单位庇古税`
          : `发放等于 $${externalAmount}（边际外部收益 MEB）的每单位庇古补贴`
      },
      explanation: {
        en: isNegative
          ? `Correct! A negative production externality means MSC > MPC. To internalize the spillover cost and reduce output from ${qMarket} to the socially optimal ${qOpt}, the government should levy a per-unit tax exactly equal to MEC ($${externalAmount}).`
          : `Correct! A positive externality means MSB > MPB. To internalize the spillover benefit and increase output from ${qMarket} to the socially optimal ${qOpt}, the government should grant a per-unit subsidy equal to MEB ($${externalAmount}).`,
        zh: isNegative
          ? `回答正确！负外部性意味着边际社会成本超过边际私人成本（MSC > MPC）。为了将外部溢出成本内部化，将产量从自由市场的 ${qMarket} 压缩至社会最优的 ${qOpt}，政府应征收严格等于边际外部成本（MEC = $${externalAmount}）的从量庇古税。`
          : `回答正确！正外部性意味着边际社会收益高于私人收益（MSB > MPB）。为了将外部溢出收益内部化，将产量从 ${qMarket} 扩大至社会最优的 ${qOpt}，政府应发放严格等于边际外部收益（MEB = $${externalAmount}）的单位庇古补贴。`
      }
    },
    [
      {
        text: {
          en: isNegative
            ? `Provide a per-unit production subsidy of $${externalAmount}`
            : `Impose a per-unit excise tax of $${externalAmount}`,
          zh: isNegative
            ? `对每单位产品发放 $${externalAmount} 的生产补贴`
            : `对每单位产品征收 $${externalAmount} 的消费税`
        },
        explanation: {
          en: 'Incorrect. This policy moves production in the wrong direction, worsening the market failure and enlarging deadweight loss.',
          zh: '错误。该政策的方向完全相反，只会加剧过度生产或生产不足，使社会无谓损失进一步恶化。'
        }
      },
      {
        text: {
          en: 'Impose a lump-sum tax on fixed assets',
          zh: '对企业的固定资产征收一次性定额税'
        },
        explanation: {
          en: 'Incorrect. Lump-sum taxes do not alter Marginal Cost (MC), and thus do not change the market equilibrium quantity.',
          zh: '错误。一次性定额税不影响边际成本（MC），因此无法调节任何产量。'
        }
      },
      {
        text: {
          en: 'Enact a non-binding price ceiling set above the market price',
          zh: '颁布一个设定在市场价格之上的无约束力价格上限'
        },
        explanation: {
          en: 'Incorrect. A non-binding ceiling has zero effect on market quantity traded.',
          zh: '错误。无约束力的价格上限对市场实际交易量没有任何调节作用。'
        }
      }
    ]
  );

  return {
    id: `dyn-externality-${Date.now()}-${randomInt(100, 999)}`,
    unit: 6,
    topicCode: '6.2',
    topicId: isNegative ? 'negative-externalities' : 'positive-externalities',
    isDynamic: true,
    templateId: 'dyn-externality-pigouvian-policy',
    prompt: {
      en: isNegative
        ? `A chemical plant emits pollution causing an external cost of $${externalAmount}/unit. As a result, market output is ${qMarket} units, whereas the socially optimal output is ${qOpt} units. What government policy will restore allocative efficiency?`
        : `A laboratory develops vaccines generating external public health benefits of $${externalAmount}/dose. Market output is ${qMarket} doses, while the socially optimal output is ${qOpt} doses. What government policy will eliminate this deadweight loss?`,
      zh: isNegative
        ? `某化工厂在生产中排放废气，造成每单位 $${externalAmount} 的外部污染成本。导致自由市场产量为 ${qMarket} 单位，而社会最优产量仅为 ${qOpt} 单位。为恢复资源配置效率，政府最有效的政策干预是什么？`
        : `某实验室研发生产疫苗，每剂给社会带来 $${externalAmount} 的外部公共卫生收益。自由市场产量为 ${qMarket} 剂，而社会最优产量为 ${qOpt} 剂。政府应采取什么政策来消除此处的无谓损失？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `Pigouvian Remedy: For negative externalities (overproduction), levy Per-Unit Tax = Marginal External Cost (MEC). For positive externalities (underproduction), grant Per-Unit Subsidy = Marginal External Benefit (MEB).`,
      zh: `庇古纠正原理：对于负外部性（市场过度生产），征收单位税 = 边际外部成本（MEC）；对于正外部性（市场生产不足），发放单位补贴 = 边际外部收益（MEB）。`
    }
  };
}

export function generatePublicGoodsQuestion(): PracticeQuestion {
  const mb1 = randomChoice([15, 20, 25]);
  const mb2 = randomChoice([25, 30, 35]);
  const msb = mb1 + mb2;
  const mc = msb; // at optimal Q*, MSB = MC

  const { options, correctOptionId } = buildFourOptions(
    {
      text: {
        en: `Sum willingness to pay vertically (MSB = MB₁ + MB₂ = $${msb}), producing where MSB = MC`,
        zh: `在纵轴上垂直加总各人支付意愿（MSB = MB₁ + MB₂ = $${msb}），并在 MSB = MC 处组织提供`
      },
      explanation: {
        en: `Correct! Because public goods are non-rival, both consumers enjoy the same unit simultaneously. Total demand is the vertical summation of individual marginal benefits: MSB = MB₁ + MB₂ = $${mb1} + $${mb2} = $${msb} = MC.`,
        zh: `回答正确！因为公共物品具备非竞争性，两位消费者可以同时享用同一件物品。总需求曲线必须在纵轴上垂直加总各人的边际收益：MSB = MB₁ + MB₂ = $${mb1} + $${mb2} = $${msb} = MC。`
      }
    },
    [
      {
        text: {
          en: `Sum quantities horizontally across individual demand curves as with private goods`,
          zh: `像私人物品一样，在横轴上将两人的需求数量做水平相加`
        },
        explanation: {
          en: `Incorrect. Horizontal summation applies only to rival private goods (where Q_total = Q1 + Q2). Public goods are non-rival, so everyone consumes the same Q.`,
          zh: `错误。水平求和仅适用于具有竞争性的私人物品（Q_total = Q1 + Q2）。公共物品非竞争，所有人共同消费完全相同数量的 Q。`
        }
      },
      {
        text: {
          en: `Rely solely on unregulated private markets, which automatically eliminate free riders`,
          zh: `完全依赖不受管制的自由私人市场，自由市场能自发消除搭便车现象`
        },
        explanation: {
          en: `Incorrect. Non-excludability creates the free-rider problem, causing unregulated private markets to underprovide or completely fail.`,
          zh: `错误。非排他性必然诱发搭便车困境，导致私人市场供给严重不足甚至完全失灵。`
        }
      },
      {
        text: {
          en: `Set production where only Consumer 1's marginal benefit equals Marginal Cost (MB₁ = MC)`,
          zh: `仅按消费者 1 的边际收益等于边际成本（MB₁ = MC）来确定供给量`
        },
        explanation: {
          en: `Incorrect. Ignoring Consumer 2's positive utility leads to underprovision of the public good.`,
          zh: `错误。直接忽略消费者 2 的效用会导致公共物品严重供给不足。`
        }
      }
    ]
  );

  return {
    id: `dyn-public-goods-${Date.now()}-${randomInt(100, 999)}`,
    unit: 6,
    topicCode: '6.3',
    topicId: 'public-goods-provision',
    isDynamic: true,
    templateId: 'dyn-public-goods-vertical-sum',
    prompt: {
      en: `A public good (such as a community lighthouse or national defense) is non-rival and non-excludable. For a given unit, Consumer 1 is willing to pay $${mb1} and Consumer 2 is willing to pay $${mb2}. If the marginal cost of providing this unit is MC = $${mc}, how should society determine the optimal provision of this good?`,
      zh: `某项公共物品（如社区灯塔或国防）具备非竞争性与非排他性。对于某一单位该物品，消费者 1 愿意支付 $${mb1}，消费者 2 愿意支付 $${mb2}。若提供该单位的边际成本为 MC = $${mc}，全社会应当如何确定该公共物品的最优提供量？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `Public Goods Demand: Derived via VERTICAL summation because non-rivalry means everyone consumes the same output. MSB(Q) = MB₁(Q) + MB₂(Q). The socially optimal provision occurs where MSB = MC.`,
      zh: `公共物品需求曲线推导：必须通过【垂直求和】得出，因为非竞争性意味着所有人共享完全相同的产出。MSB(Q) = MB₁(Q) + MB₂(Q)。社会最优提供量位于 MSB = MC 处。`
    }
  };
}

/**
 * Lorenz Curve, Gini Coefficient & Income Redistribution (Topic 6.5)
 */
export function generateLorenzGiniQuestion(): PracticeQuestion {
  const gini1 = randomChoice([0.28, 0.32, 0.35]);
  const gini2 = randomChoice([0.45, 0.48, 0.52]);

  const { options, correctOptionId } = buildFourOptions(
    {
      text: {
        en: `Country 1 (Gini = ${gini1}) has a MORE equal income distribution than Country 2 (Gini = ${gini2}). Implementing progressive income taxes and transfer payments will shift the Lorenz curve closer to the 45-degree line, decreasing the Gini coefficient.`,
        zh: `国家 1（基尼系数 = ${gini1}）的收入分配比国家 2（基尼系数 = ${gini2}）更为均等。实行累进个人所得税与针对低收入群体的转移支付，将使洛伦兹曲线向 45 度完全平等线贴近，从而降低基尼系数。`
      },
      explanation: {
        en: `Correct! Gini = 0 represents perfect income equality, while Gini = 1 represents total inequality. A lower Gini coefficient (${gini1} < ${gini2}) indicates greater income equality. Progressive taxes and social safety nets reduce post-tax income disparity, moving the Lorenz curve closer to the diagonal.`,
        zh: `回答正确！基尼系数为 0 代表绝对平均，为 1 代表极端不平等。基尼系数越低（${gini1} < ${gini2}），表明国民收入分配越均等。累进所得税与转移支付能缩小税后收入差距，促使洛伦兹曲线向 45 度对角线靠拢。`
      }
    },
    [
      {
        text: {
          en: `Country 2 has a more equal income distribution because a higher Gini coefficient represents greater wealth creation.`,
          zh: `国家 2 的收入分配更均等，因为更高的基尼系数代表财富创造更活跃。`
        },
        explanation: {
          en: `Incorrect. Higher Gini coefficients indicate GREATER income inequality, not equality.`,
          zh: `错误。基尼系数越高说明贫富差距和收入不平等程度越严重。`
        }
      },
      {
        text: {
          en: `Both countries have identical income distributions because both Lorenz curves connect (0,0) and (100,100).`,
          zh: `两国的收入分配完全相同，因为两条洛伦兹曲线都连接着 (0,0) 与 (100,100)。`
        },
        explanation: {
          en: `Incorrect. All Lorenz curves connect the origin and (100,100); what matters is the curvature and area between the curve and the 45-degree line.`,
          zh: `错误。所有洛伦兹曲线都必然穿过起点和终点；关键在于曲线向下弯曲凹陷的弧度以及与 45 度线围成的面积 A。`
        }
      },
      {
        text: {
          en: `A sales tax on basic food items will decrease the Gini coefficient because everyone pays the same rate.`,
          zh: `对基础食品征收消费税会降低基尼系数，因为每个人缴纳的税率相同。`
        },
        explanation: {
          en: `Incorrect. General sales taxes on necessities are regressive (take a higher percentage of poor households' income), which increases income inequality.`,
          zh: `错误。基础生活必需品消费税属于累退税（穷人税收支出占其收入比重更高），反而会加剧收入分配不公。`
        }
      }
    ]
  );

  return {
    id: `dyn-gini-${Date.now()}-${randomInt(100, 999)}`,
    unit: 6,
    topicCode: '6.5',
    topicId: 'lorenz-curve-gini',
    isDynamic: true,
    templateId: 'dyn-lorenz-gini-calculation',
    prompt: {
      en: `Economists calculate income inequality for two nations: Country 1 has a Gini coefficient of ${gini1}, while Country 2 has a Gini coefficient of ${gini2}. How should policymakers interpret these coefficients, and what effect would progressive taxation have?`,
      zh: `经济学家测算了两个国家的收入差距指标：国家 1 的基尼系数为 ${gini1}，国家 2 的基尼系数为 ${gini2}。政策制定者应当如何解读该统计指标？若实行累进所得税政策将对洛伦兹曲线产生何种影响？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `Gini Coefficient = Area A / (Area A + Area B) = 2 × Area A. Range: 0 (perfect equality, Lorenz curve on 45° line) to 1 (total inequality). Progressive income taxes flatten post-tax income disparities, lowering the Gini coefficient.`,
      zh: `基尼系数公式：Gini = 面积 A / (面积 A + 面积 B) = 2 × 面积 A。取值介于 0（绝对平均）到 1（绝对不平等）之间。累进税制与转移支付政策可使基尼系数有效下降。`
    }
  };
}

/**
 * Coase Theorem & Private Bargaining for Externalities (Topic 6.2)
 */
export function generateCoaseTheoremQuestion(): PracticeQuestion {
  const damageCost = randomChoice([8000, 10000, 12000]);
  const filterCost = randomChoice([3000, 4000, 5000]);

  const { options, correctOptionId } = buildFourOptions(
    {
      text: {
        en: `Under the Coase Theorem: As long as property rights are clearly assigned and transaction costs are negligible, the two parties will privately negotiate to install the filter (cost $${filterCost} < damage $${damageCost}), reaching the socially efficient outcome regardless of who owns the water rights.`,
        zh: `根据科斯定理（Coase Theorem）：只要产权明晰且交易成本可忽略不计，双方将通过私人自愿协商安装过滤器（成本 $${filterCost} < 损害 $${damageCost}），无论水权最初归属于哪一方，都能达成社会最优效率结果。`
      },
      explanation: {
        en: `Correct! The Coase Theorem states that if property rights are well-defined and transaction/bargaining costs are low, private parties will bargain to the efficient outcome. Installing the filter saves $${damageCost} for only $${filterCost}, yielding a net social surplus of $${damageCost - filterCost}.`,
        zh: `回答正确！科斯定理核心精髓：只要产权明确界定且谈判交易成本低，当事人总能通过协商消除外部性。安装过滤器成本仅需 $${filterCost}，却能避免 $${damageCost} 的损失，创造 $${damageCost - filterCost} 的净社会收益。`
      }
    },
    [
      {
        text: {
          en: `Private negotiation will always fail because externalities require government command-and-control regulation.`,
          zh: `私人协商必然失败，因为所有外部性都必须依靠政府的行政指令和强制管制。`
        },
        explanation: {
          en: `Incorrect. Ronald Coase demonstrated that market bargaining can internalize externalities efficiently without government intervention under low transaction costs.`,
          zh: `错误。罗纳德·科斯证明了在低交易成本下，市场协商本身就能自发化解外部性，无需政府强制介入。`
        }
      },
      {
        text: {
          en: `The factory must completely shut down to eliminate all pollution, regardless of the filter cost.`,
          zh: `化工厂必须彻底永久关闭停产以消除所有排污，无论过滤器成本是多少。`
        },
        explanation: {
          en: `Incorrect. Shutting down the factory eliminates the entire economic surplus of production when a cheap filter ($${filterCost}) could solve the problem.`,
          zh: `错误。直接强令关停化工厂会抹杀全部生产盈余，既然只需廉价的过滤器即可消除危害，停产不是最优解。`
        }
      },
      {
        text: {
          en: `An efficient outcome is achievable only if the downstream resort owns the rights; if the factory owns the rights, excessive pollution is inevitable.`,
          zh: `只有在下游度假村拥有水权时才能实现有效配置；若化工厂拥有水权，排污泛滥将无法避免。`
        },
        explanation: {
          en: `Incorrect. Coase Theorem specifically proves that the ALLOCATION of property rights affects distribution of wealth, but NOT the final efficient resource allocation (the filter will be installed in either case).`,
          zh: `错误。科斯定理最精彩的洞见恰恰在于：产权归属仅影响财富在双方间的分配，但绝不影响最终的效率结果（无论水权归谁，最终都会安装过滤器）。`
        }
      }
    ]
  );

  return {
    id: `dyn-coase-${Date.now()}-${randomInt(100, 999)}`,
    unit: 6,
    topicCode: '6.2',
    topicId: 'negative-externalities',
    isDynamic: true,
    templateId: 'dyn-coase-theorem-property-rights',
    prompt: {
      en: `A chemical plant upstream pollutes a river, causing $${damageCost} in damages to a downstream trout resort. The chemical plant can eliminate all emissions by installing an industrial wastewater filter for $${filterCost}. According to the Coase Theorem, what will happen if transaction costs are zero?`,
      zh: `一家上游化工厂向河流排污，给下游的鳟鱼度假度假村造成了价值 $${damageCost} 的水质破坏。该化工厂只需花费 $${filterCost} 安装一套工业污水净化过滤器即可完全消除污染。根据科斯定理（Coase Theorem），在交易成本为零的前提下，将会出现何种结果？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `Coase Theorem Principle: When property rights are clearly defined and transaction costs are zero, private bargaining achieves the socially efficient resource allocation (installing the filter for $${filterCost} to save $${damageCost}), independent of the initial assignment of property rights.`,
      zh: `科斯定理核心结论：只要产权界定清晰且交易成本为零，私人谈判就能实现社会最优的资源配置（花费 $${filterCost} 避免 $${damageCost} 损失），其效率结果与产权最初赋权给谁完全无关。`
    }
  };
}
