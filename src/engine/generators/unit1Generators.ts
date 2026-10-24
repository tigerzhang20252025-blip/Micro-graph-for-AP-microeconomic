import { PracticeQuestion } from '../../data/practiceQuestions';
import { randomInt, randomChoice, buildFourOptions } from './helper';

export function generatePpcOppCostQuestion(): PracticeQuestion {
  const goodPairs = [
    { goodXEn: 'Drones', goodXZh: '无人机', goodYEn: 'Electric Vehicles', goodYZh: '电动汽车' },
    { goodXEn: 'Solar Panels', goodXZh: '太阳能板', goodYEn: 'Wind Turbines', goodYZh: '风力发电机' },
    { goodXEn: 'Wheat', goodXZh: '小麦', goodYEn: 'Corn', goodYZh: '玉米' },
    { goodXEn: 'Robots', goodXZh: '工业机器人', goodYEn: 'Medical Devices', goodYZh: '医疗设备' }
  ];
  const pair = randomChoice(goodPairs);

  const x1 = randomInt(5, 15);
  const dx = randomChoice([5, 10, 20]);
  const x2 = x1 + dx;

  // Opportunity cost ratio: e.g. 1.5, 2.0, 2.5, 0.5, 3.0
  const oppRatio = randomChoice([0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 4.0]);
  const dy = dx * oppRatio;
  const y1 = dy + randomInt(20, 60);
  const y2 = y1 - dy;

  const correctText = `${oppRatio} ${pair.goodYEn}`;
  const correctTextZh = `${oppRatio} 单位${pair.goodYZh}`;
  const invertedRatio = Number((1 / oppRatio).toFixed(2));

  const { options, correctOptionId } = buildFourOptions(
    {
      text: { en: correctText, zh: correctTextZh },
      explanation: {
        en: `Correct! Producing ${dx} more ${pair.goodXEn} (${x2} - ${x1}) requires giving up ${dy} ${pair.goodYEn} (${y1} - ${y2}). Per-unit opportunity cost = ${dy} / ${dx} = ${oppRatio} ${pair.goodYEn}.`,
        zh: `回答正确！增产 ${dx} 单位${pair.goodXZh}（${x2} - ${x1}）需要牺牲放弃 ${dy} 单位${pair.goodYZh}（${y1} - ${y2}）。单位机会成本 = ${dy} / ${dx} = ${oppRatio} 单位${pair.goodYZh}。`
      }
    },
    [
      {
        text: { en: `${invertedRatio} ${pair.goodYEn}`, zh: `${invertedRatio} 单位${pair.goodYZh}` },
        explanation: {
          en: `Incorrect. ${dx} / ${dy} = ${invertedRatio} inverts the ratio (calculating the opportunity cost of Good Y instead of Good X).`,
          zh: `错误。${dx} / ${dy} = ${invertedRatio} 颠倒了分子分母（算出的是生产每单位${pair.goodYZh}的机会成本，而非${pair.goodXZh}）。`
        }
      },
      {
        text: { en: `${dy} ${pair.goodYEn}`, zh: `${dy} 单位${pair.goodYZh}` },
        explanation: {
          en: `Incorrect. ${dy} is the TOTAL opportunity cost for all ${dx} units gained, not the per-unit opportunity cost.`,
          zh: `错误。${dy} 是增产这 ${dx} 个单位的总机会成本，并非每单位额外机会成本。`
        }
      },
      {
        text: { en: `${y2} ${pair.goodYEn}`, zh: `${y2} 单位${pair.goodYZh}` },
        explanation: {
          en: `Incorrect. ${y2} is merely the remaining production level of ${pair.goodYEn}, not the forgone amount.`,
          zh: `错误。${y2} 仅仅是生产点变化后${pair.goodYZh}的剩余生产量，并非牺牲放弃的量。`
        }
      }
    ]
  );

  return {
    id: `dyn-ppc-${Date.now()}-${randomInt(100, 999)}`,
    unit: 1,
    topicCode: '1.3',
    topicId: 'ppc-model',
    isDynamic: true,
    templateId: 'dyn-ppc-opp-cost',
    prompt: {
      en: `An economy produces only two goods: ${pair.goodXEn} and ${pair.goodYEn}. Moving from combination (${x1} ${pair.goodXEn}, ${y1} ${pair.goodYEn}) to (${x2} ${pair.goodXEn}, ${y2} ${pair.goodYEn}), what is the opportunity cost per additional ${pair.goodXEn.slice(0, -1)} produced?`,
      zh: `某经济体仅生产两种物品：${pair.goodXZh}与${pair.goodYZh}。当生产组合由（${x1} 单位${pair.goodXZh}，${y1} 单位${pair.goodYZh}）变为（${x2} 单位${pair.goodXZh}，${y2} 单位${pair.goodYZh}）时，每多生产 1 单位${pair.goodXZh}的机会成本是多少？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `Per-Unit Opportunity Cost = Quantity of Good Given Up / Quantity of Good Gained. Here: Δ${pair.goodYEn} / Δ${pair.goodXEn} = ${dy} / ${dx} = ${oppRatio} ${pair.goodYEn}.`,
      zh: `单位机会成本计算公式 = 牺牲放弃的物品数量 / 增加获得的物品数量。在本题中：Δ${pair.goodYZh} / Δ${pair.goodXZh} = ${dy} / ${dx} = ${oppRatio} 单位${pair.goodYZh}。`
    },
    commonMistakeAlert: {
      en: 'Always double-check whether the question asks for per-unit opportunity cost or total opportunity cost!',
      zh: '务必仔细审题是询问“每单位额外机会成本”还是“总放弃成本”！'
    }
  };
}

export function generateComparativeAdvantageQuestion(): PracticeQuestion {
  const nations = [
    { n1En: 'Alpha', n1Zh: '阿尔法国', n2En: 'Beta', n2Zh: '贝塔国' },
    { n1En: 'Elysium', n1Zh: '极乐国', n2En: 'Atlantis', n2Zh: '亚特兰蒂斯国' },
    { n1En: 'Country X', n1Zh: 'X 国', n2En: 'Country Y', n2Zh: 'Y 国' }
  ];
  const nation = randomChoice(nations);

  const goods = [
    { g1En: 'Car', g1Zh: '汽车', g2En: 'tons of Wheat', g2Zh: '吨小麦' },
    { g1En: 'Computer', g1Zh: '电脑', g2En: 'barrels of Oil', g2Zh: '桶石油' },
    { g1En: 'Airplane', g1Zh: '飞机', g2En: 'bales of Cotton', g2Zh: '包棉花' }
  ];
  const g = randomChoice(goods);

  // Country 1 cost for 1 G1: opp1 (e.g. 2 G2)
  // Country 2 cost for 1 G1: opp2 (e.g. 5 G2)
  const opp1 = randomChoice([1, 2, 3]);
  const opp2 = opp1 + randomChoice([2, 3, 4]);

  // Alpha produces 1 G1 or opp1 G2; Beta produces 1 G1 or opp2 G2.
  // Alpha has comparative advantage in G1 (opp1 < opp2).
  // Terms of trade for 1 G1 must be strictly between opp1 and opp2.
  const validTerms = Number(((opp1 + opp2) / 2).toFixed(1));
  const tooLowTerms = opp1 - 0.5;
  const tooHighTerms = opp2 + 1.0;

  const { options, correctOptionId } = buildFourOptions(
    {
      text: {
        en: `1 ${g.g1En} for ${validTerms} ${g.g2En}`,
        zh: `1 单位${g.g1Zh}换 ${validTerms} ${g.g2Zh}`
      },
      explanation: {
        en: `Correct! ${nation.n1En}'s opportunity cost for 1 ${g.g1En} is ${opp1} ${g.g2En}, and ${nation.n2En}'s cost is ${opp2} ${g.g2En}. Any terms of trade strictly between ${opp1} and ${opp2} ${g.g2En} will benefit both countries.`,
        zh: `回答正确！${nation.n1Zh}生产 1 单位${g.g1Zh}的成本是 ${opp1} ${g.g2Zh}，${nation.n2Zh}的成本是 ${opp2} ${g.g2Zh}。互利贸易条件必须严格落在两国国内机会成本区间之间（${opp1} 到 ${opp2} 之间），因此 ${validTerms} 符合要求。`
      }
    },
    [
      {
        text: {
          en: `1 ${g.g1En} for ${tooLowTerms} ${g.g2En}`,
          zh: `1 单位${g.g1Zh}换 ${tooLowTerms} ${g.g2Zh}`
        },
        explanation: {
          en: `Incorrect. At ${tooLowTerms} ${g.g2En}, ${nation.n1En} will refuse to export ${g.g1En} because it sacrifices ${opp1} ${g.g2En} domestically to produce it.`,
          zh: `错误。在 ${tooLowTerms} 的比率下，${nation.n1Zh}绝不会出口${g.g1Zh}，因为其国内生产成本高达 ${opp1} ${g.g2Zh}，出口会蒙受净亏损。`
        }
      },
      {
        text: {
          en: `1 ${g.g1En} for ${tooHighTerms} ${g.g2En}`,
          zh: `1 单位${g.g1Zh}换 ${tooHighTerms} ${g.g2Zh}`
        },
        explanation: {
          en: `Incorrect. At ${tooHighTerms} ${g.g2En}, ${nation.n2En} will refuse to import ${g.g1En} because it can produce it domestically for only ${opp2} ${g.g2En}.`,
          zh: `错误。在 ${tooHighTerms} 的比率下，${nation.n2Zh}绝不会进口${g.g1Zh}，因为其自己在国内生产 1 单位只需牺牲 ${opp2} ${g.g2Zh}。`
        }
      },
      {
        text: {
          en: `1 ${g.g1En} for ${opp1} ${g.g2En}`,
          zh: `1 单位${g.g1Zh}换 ${opp1} ${g.g2Zh}`
        },
        explanation: {
          en: `Incorrect. At exactly ${opp1} ${g.g2En}, ${nation.n1En} gains zero benefit from trade and has no economic incentive to participate.`,
          zh: `错误。若恰好等于边界值 ${opp1}，${nation.n1Zh}通过贸易无法获得任何额外净收益，缺乏参与贸易的经济动力。`
        }
      }
    ]
  );

  return {
    id: `dyn-comp-adv-${Date.now()}-${randomInt(100, 999)}`,
    unit: 1,
    topicCode: '1.4',
    topicId: 'comparative-advantage',
    isDynamic: true,
    templateId: 'dyn-comparative-trade',
    prompt: {
      en: `With 1 unit of resources, ${nation.n1En} can produce 1 ${g.g1En} or ${opp1} ${g.g2En}, while ${nation.n2En} can produce 1 ${g.g1En} or ${opp2} ${g.g2En}. Which terms of trade will be mutually beneficial to both nations?`,
      zh: `投入 1 单位资源，${nation.n1Zh}可生产 1 单位${g.g1Zh}或 ${opp1} ${g.g2Zh}；而${nation.n2Zh}可生产 1 单位${g.g1Zh}或 ${opp2} ${g.g2Zh}。下列哪一个贸易条件（交换比率）能够使两国互利共赢？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `Mutually beneficial terms of trade must lie strictly between the domestic opportunity costs of the two trading partners: ${opp1} < Terms of Trade < ${opp2} ${g.g2En} per ${g.g1En}.`,
      zh: `互利共赢的贸易条件必须严格落在两国国内机会成本之间：${opp1} < 贸易比率 < ${opp2} ${g.g2Zh}/每单位${g.g1Zh}。`
    }
  };
}

export function generateUtilityMaximizationQuestion(): PracticeQuestion {
  const px = randomChoice([2, 4, 5]);
  const py = randomChoice([3, 6, 10]);
  const muPerDollar = randomChoice([4, 5, 6, 8]);
  const mux = px * muPerDollar;
  const muy = py * muPerDollar;

  const { options, correctOptionId } = buildFourOptions(
    {
      text: {
        en: `Equalize marginal utility per dollar: MUx / Px = MUy / Py`,
        zh: `均衡每美元的边际效用：MUx / Px = MUy / Py`
      },
      explanation: {
        en: `Correct! Consumer utility is maximized when the marginal utility per dollar spent is equal across all goods: MUx / Px = ${mux}/${px} = ${muPerDollar} = ${muy}/${py} = MUy / Py.`,
        zh: `回答正确！消费者效用最大化的等边际法则要求花在每种物品上的最后一美元带来的边际效用相等：MUx / Px = ${mux}/${px} = ${muPerDollar} = ${muy}/${py} = MUy / Py。`
      }
    },
    [
      {
        text: {
          en: `Equalize total utility: TUx = TUy`,
          zh: `使两种物品的总效用相等：TUx = TUy`
        },
        explanation: {
          en: `Incorrect. Utility maximization is determined at the margin (MU), not by equating total utility.`,
          zh: `错误。效用最大化是在边际（MU）上做决策，绝非强行令两者的总效用（TU）相等。`
        }
      },
      {
        text: {
          en: `Equalize raw marginal utilities: MUx = MUy regardless of price`,
          zh: `使原始边际效用直接相等：MUx = MUy（不考虑价格差异）`
        },
        explanation: {
          en: `Incorrect. Ignoring price differences fails to account for purchasing power and opportunity cost.`,
          zh: `错误。若忽略商品价格差异，就无法衡量每花一美元实际换得的效用回报。`
        }
      },
      {
        text: {
          en: `Spend entire income exclusively on the good with the lowest price`,
          zh: `将所有收入全部用来购买单价最低的商品`
        },
        explanation: {
          en: `Incorrect. Due to diminishing marginal utility, consuming only one good yields rapidly declining satisfaction.`,
          zh: `错误。由于边际效用递减规律，只消费单一商品会导致其边际效用极速衰减，并非最优策略。`
        }
      }
    ]
  );

  return {
    id: `dyn-utility-max-${Date.now()}-${randomInt(100, 999)}`,
    unit: 1,
    topicCode: '1.6',
    topicId: 'marginal-analysis-utility',
    isDynamic: true,
    templateId: 'dyn-utility-equi-marginal',
    prompt: {
      en: `A consumer with a fixed income purchases Good X (Px = $${px}) and Good Y (Py = $${py}). At the optimal consumption bundle, if MUx = ${mux} utils, what economic condition must hold for utility maximization?`,
      zh: `某消费者用固定收入购买物品 X（Px = $${px}）和物品 Y（Py = $${py}）。在最优消费组合点上，已知 MUx = ${mux} 效用单位。为实现效用最大化，必须满足下列哪项经济学条件？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `Utility Maximization Rule (Equi-Marginal Principle): MUx / Px = MUy / Py. With Px = $${px} and MUx = ${mux}, MUx/Px = ${muPerDollar}. Therefore, MUy/Py must also equal ${muPerDollar}.`,
      zh: `等边际效用法则：MUx / Px = MUy / Py。由于 Px = $${px} 且 MUx = ${mux}，每美元带来的边际效用为 ${muPerDollar}。因此物品 Y 的 MUy/Py 也必须严格等于 ${muPerDollar}。`
    }
  };
}

/**
 * Capital Goods vs Consumer Goods & Long-Run Economic Growth (Topic 1.2 / 1.3)
 */
export function generateScarcitySystemsQuestion(): PracticeQuestion {
  const nations = [
    { nameA: 'Econia', nameB: 'Prospera' },
    { nameA: 'Atlantis', nameB: 'Pacifica' },
    { nameA: 'Nordia', nameB: 'Solaria' }
  ];
  const nation = randomChoice(nations);

  const capitalShareA = randomChoice([60, 65, 70, 75]);
  const capitalShareB = 100 - capitalShareA;

  const { options, correctOptionId } = buildFourOptions(
    {
      text: {
        en: `${nation.nameA} will experience greater long-run economic growth (larger outward shift of its PPC), but sacrifices current living standards (fewer consumer goods today).`,
        zh: `${nation.nameA} 将实现更大的长期经济增长（PPC 曲线向外扩张幅度更大），但代价是必须牺牲当前的即期消费水平（短期内消费品更少）。`
      },
      explanation: {
        en: `Correct! Capital goods (machinery, infrastructure, R&D) expand future productive capacity, shifting the PPC outward in the future. The opportunity cost of producing more capital goods today is giving up current consumer goods.`,
        zh: `回答正确！生产资本品（机器设备、基础设施、技术研发）能够提升未来的生产能力，促使未来的 PPC 曲线向外平移扩展。当前多生产资本品的机会成本正是牺牲当前的即期消费品。`
      }
    },
    [
      {
        text: {
          en: `${nation.nameB} will achieve faster economic growth because consumer goods generate immediate spending and GDP growth.`,
          zh: `${nation.nameB} 将获得更快的经济增长，因为消费品能产生即时支出并拉动当前的 GDP。`
        },
        explanation: {
          en: `Incorrect. Consumer goods provide immediate satisfaction today but do not expand future production capacity or shift the PPC outward.`,
          zh: `错误。消费品虽然满足当前即时效用，但不能转化为未来的资本存量，无法推动 PPC 生产可能性边界向外扩张。`
        }
      },
      {
        text: {
          en: `Both countries will experience identical long-run economic growth because points on the PPC are always equally efficient.`,
          zh: `两国未来的长期经济增长将完全相同，因为 PPC 曲线上的所有点在生产效率上是等同的。`
        },
        explanation: {
          en: `Incorrect. While all points on the PPC are productively efficient, the composition of output (capital vs consumer goods) determines future growth trajectory.`,
          zh: `错误。尽管 PPC 曲线上的每一点都达到了当期的生产效率，但产出的结构配置（资本品 vs 消费品）直接决定了未来的增长轨迹。`
        }
      },
      {
        text: {
          en: `${nation.nameA}'s current PPC will immediately shift inward due to excessive sacrifice of consumer goods.`,
          zh: `${nation.nameA} 当前的 PPC 将立即向内收缩，因为过度牺牲了消费品。`
        },
        explanation: {
          en: `Incorrect. Choosing a point with high capital goods is a movement ALONG the existing PPC, not an inward shift.`,
          zh: `错误。选择偏向资本品的生产点属于沿着现有 PPC 曲线的“点在曲线上移动”，绝不会导致曲线本身向内收缩。`
        }
      }
    ]
  );

  return {
    id: `dyn-scarcity-growth-${Date.now()}-${randomInt(100, 999)}`,
    unit: 1,
    topicCode: '1.3',
    topicId: 'ppc-model',
    isDynamic: true,
    templateId: 'dyn-scarcity-systems',
    prompt: {
      en: `Two economies with identical resources and technologies, ${nation.nameA} and ${nation.nameB}, operate on identical Production Possibilities Curves. ${nation.nameA} allocates ${capitalShareA}% of its resources to Capital Goods and ${100 - capitalShareA}% to Consumer Goods, while ${nation.nameB} allocates ${capitalShareB}% to Capital Goods and ${capitalShareA}% to Consumer Goods. What is the expected long-run consequence?`,
      zh: `拥有相同资源与技术水平的两个经济体 ${nation.nameA} 和 ${nation.nameB} 均在相同的生产可能性边界（PPC）上满负荷生产。${nation.nameA} 将其 ${capitalShareA}% 的资源配置于“资本品”，${100 - capitalShareA}% 配置于“消费品”；而 ${nation.nameB} 仅将 ${capitalShareB}% 的资源投入“资本品”，${capitalShareA}% 投入“消费品”。由此可预期的长期经济后果是：`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `Capital accumulation shifts the PPC outward over time. Nations that sacrifice current consumption to invest more in capital goods accumulate productive capacity and achieve faster economic growth.`,
      zh: `资本积累是推动 PPC 长期向外扩张的核心驱动力。牺牲即期消费、将更高比例资源投入资本品生产的国家，未来生产潜能提升更显著。`
    }
  };
}

/**
 * Absolute vs Comparative Advantage Distinction (Topic 1.4)
 */
export function generateAbsoluteVsComparativeQuestion(): PracticeQuestion {
  const goodX = randomChoice([
    { en: 'Microchips', zh: '芯片' },
    { en: 'Aircraft', zh: '客机' },
    { en: 'Smartphones', zh: '智能手机' }
  ]);
  const goodY = randomChoice([
    { en: 'Wheat (tons)', zh: '小麦（吨）' },
    { en: 'Soybeans (tons)', zh: '大豆（吨）' },
    { en: 'Cotton (bales)', zh: '棉花（包）' }
  ]);

  // Country A outputs per 100 hours
  const outAX = randomInt(40, 80);
  const outAY = randomInt(20, 50);

  // Country B outputs: make Country A have absolute advantage in Good X, and B in Good Y
  const outBX = randomInt(15, 35);
  const outBY = randomInt(60, 100);

  // Opportunity cost of Good X
  // Country A: 1 Good X costs (outAY / outAX) Good Y
  const ocAX = Number((outAY / outAX).toFixed(2));
  // Country B: 1 Good X costs (outBY / outBX) Good Y
  const ocBX = Number((outBY / outBX).toFixed(2));

  // A has lower opp cost in X, B has lower opp cost in Y
  const targetGood = goodX;
  const advantagedCountry = 'Country A';
  const advantagedCountryZh = 'A 国';

  const { options, correctOptionId } = buildFourOptions(
    {
      text: {
        en: `${advantagedCountry} has comparative advantage in ${targetGood.en} because its opportunity cost (${ocAX} ${goodY.en}) is lower than Country B's (${ocBX} ${goodY.en}).`,
        zh: `${advantagedCountryZh}在${targetGood.zh}上具有比较优势，因为其机会成本（${ocAX} 单位${goodY.zh}）低于 B 国的机会成本（${ocBX} 单位${goodY.zh}）。`
      },
      explanation: {
        en: `Correct! Comparative advantage is determined by LOWER opportunity cost, not absolute productivity. Country A gives up only ${ocAX} ${goodY.en} per ${targetGood.en}, while Country B gives up ${ocBX} ${goodY.en}.`,
        zh: `回答正确！比较优势由更低的机会成本决定，而非绝对产量高低。A 国生产 1 单位${targetGood.zh}仅需放弃 ${ocAX} 单位${goodY.zh}，而 B 国需放弃 ${ocBX} 单位。`
      }
    },
    [
      {
        text: {
          en: `Country B has comparative advantage in ${targetGood.en} because its total output of ${goodY.en} is higher.`,
          zh: `B 国在${targetGood.zh}上具有比较优势，因为其${goodY.zh}的总产量更高。`
        },
        explanation: {
          en: `Incorrect. High absolute production in Good Y does not give Country B comparative advantage in Good X.`,
          zh: `错误。在另一种物品（${goodY.zh}）上的绝对高产量，并不能说明其在${targetGood.zh}上具有比较优势。`
        }
      },
      {
        text: {
          en: `Neither country should trade because Country A produces more ${targetGood.en} while Country B produces more ${goodY.en}.`,
          zh: `两国不应当进行贸易，因为 A 国生产的${targetGood.zh}更多，而 B 国生产的${goodY.zh}更多。`
        },
        explanation: {
          en: `Incorrect. This difference in opportunity costs is precisely the reason mutually beneficial trade gains exist!`,
          zh: `错误。机会成本的差异恰恰是双方通过专业化分工实现互利双赢的根本前提！`
        }
      },
      {
        text: {
          en: `${advantagedCountry} has comparative advantage in BOTH goods because it can produce ${targetGood.en} more efficiently.`,
          zh: `${advantagedCountryZh}在两种商品上均拥有比较优势，因为其制造${targetGood.zh}效率极高。`
        },
        explanation: {
          en: `Incorrect. Mathematically, it is IMPOSSIBLE for one country to have comparative advantage in both goods (the opportunity costs are reciprocals).`,
          zh: `错误。在数理逻辑上，任何一个国家绝不可能在两种商品上同时拥有比较优势（两者的机会成本互为倒数）。`
        }
      }
    ]
  );

  return {
    id: `dyn-abs-vs-ca-${Date.now()}-${randomInt(100, 999)}`,
    unit: 1,
    topicCode: '1.4',
    topicId: 'comparative-advantage',
    isDynamic: true,
    templateId: 'dyn-absolute-vs-comparative',
    prompt: {
      en: `Given 100 hours of labor input: Country A can produce ${outAX} units of ${goodX.en} or ${outAY} units of ${goodY.en}. Country B can produce ${outBX} units of ${goodX.en} or ${outBY} units of ${goodY.en}. Which country has the comparative advantage in ${targetGood.en}?`,
      zh: `假定使用 100 个工时的固定劳动投入：A 国可生产 ${outAX} 单位${goodX.zh}或 ${outAY} 单位${goodY.zh}；B 国可生产 ${outBX} 单位${goodX.zh}或 ${outBY} 单位${goodY.zh}。哪国在${targetGood.zh}生产上拥有比较优势？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `Comparative advantage requires comparing per-unit opportunity cost. Country A OC of ${goodX.en} = ${outAY}/${outAX} = ${ocAX} ${goodY.en}. Country B OC of ${goodX.en} = ${outBY}/${outBX} = ${ocBX} ${goodY.en}. Since ${ocAX} < ${ocBX}, Country A has comparative advantage in ${goodX.en}.`,
      zh: `比较优势的判定核心是机会成本比较：A 国每单位${goodX.zh}的机会成本为 ${outAY}/${outAX} = ${ocAX} 单位${goodY.zh}；B 国为 ${outBY}/${outBX} = ${ocBX} 单位${goodY.zh}。因 ${ocAX} < ${ocBX}，故 A 国拥有比较优势。`
    }
  };
}
