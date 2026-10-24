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
