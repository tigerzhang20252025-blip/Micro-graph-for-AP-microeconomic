import { PracticeQuestion } from '../../data/practiceQuestions';
import { randomInt, randomChoice, buildFourOptions } from './helper';

export function generateFactorMarketHiringQuestion(): PracticeQuestion {
  const wage = randomChoice([20, 24, 30, 40]);
  const productPrice = randomChoice([2, 4, 5]);

  // Construct discrete schedule of workers:
  // L = 1: MP = 12 => MRP = 12 * P
  // L = 2: MP = 10 => MRP = 10 * P
  // L = 3: MP = 8  => MRP = 8 * P
  // L = 4: MP = 6  => MRP = 6 * P
  // L = 5: MP = 4  => MRP = 4 * P
  // L = 6: MP = 2  => MRP = 2 * P
  const targetMP = wage / productPrice;
  const adjWorkers = randomChoice([3, 4, 5]);

  const { options, correctOptionId } = buildFourOptions(
    {
      text: {
        en: `Hire ${adjWorkers} workers, because MRP >= MFC (Wage) for the ${adjWorkers}th worker`,
        zh: `雇佣 ${adjWorkers} 名工人，因为第 ${adjWorkers} 名工人的 MRP >= MFC（工资率）`
      },
      explanation: {
        en: `Correct! A profit-maximizing firm hires workers up to the point where Marginal Revenue Product equals Marginal Factor Cost: MRP = P * MP = MFC = Wage ($${wage}). For worker ${adjWorkers}, MRP = $${productPrice} * ${targetMP} = $${wage} = Wage.`,
        zh: `回答正确！利润最大化企业雇佣工人的边际原则为边际收益产品等于边际要素成本：MRP = P × MP = MFC = 工资率（$${wage}）。第 ${adjWorkers} 名工人的 MRP = $${productPrice} × ${targetMP} = $${wage}，恰好能覆盖雇佣工资。`
      }
    },
    [
      {
        text: {
          en: `Hire 1 worker, because the first worker has the highest marginal product`,
          zh: `仅雇佣 1 名工人，因为第 1 名工人的边际产量最高`
        },
        explanation: {
          en: `Incorrect. Although the first worker's MP is highest, subsequent workers still generate MRP greater than the wage, leaving potential profit on the table.`,
          zh: `错误。尽管首名工人边际产出最高，但后续工人创造的边际收益依然大于付给他们的工资，只招 1 人会放弃大量利润。`
        }
      },
      {
        text: {
          en: `Hire 6 workers to maximize the total physical volume of goods produced`,
          zh: `雇佣全部 6 名工人，以追求总产出数量的最大化`
        },
        explanation: {
          en: `Incorrect. For workers beyond ${adjWorkers}, their MRP is less than the wage ($${wage}), which would cause net losses.`,
          zh: `错误。超过第 ${adjWorkers} 名工人之后，新工人创造的收益低于其工资（MRP < Wage），多招会导致利润净亏损。`
        }
      },
      {
        text: {
          en: `Hire 0 workers because diminishing marginal returns make hiring unprofitable`,
          zh: `雇佣 0 名工人，因为边际报酬递减会导致企业亏损`
        },
        explanation: {
          en: `Incorrect. Diminishing returns does not mean negative returns; workers are highly profitable up to worker ${adjWorkers}.`,
          zh: `错误。边际报酬递减并不等于负报酬，在招满 ${adjWorkers} 人之前每一位工人都能为企业赚取正向净收益。`
        }
      }
    ]
  );

  return {
    id: `dyn-factor-hiring-${Date.now()}-${randomInt(100, 999)}`,
    unit: 5,
    topicCode: '5.3',
    topicId: 'factor-market-competitive',
    isDynamic: true,
    templateId: 'dyn-factor-mrp-mfc',
    prompt: {
      en: `A firm operates in a competitive labor market paying a market wage of $${wage}/worker and sells output in a competitive product market at P = $${productPrice}/unit. The ${adjWorkers}th worker has a Marginal Product (MP) of ${targetMP} units, while the ${adjWorkers + 1}th worker has an MP of ${Math.max(1, targetMP - 2)} units. How many workers should the firm hire to maximize profits?`,
      zh: `某企业在完全竞争的劳动力市场中雇工（市场工资为 $${wage}/人），其产品在完全竞争产品市场中以单价 P = $${productPrice} 售出。已知第 ${adjWorkers} 名工人的边际产量（MP）为 ${targetMP} 单位，而第 ${adjWorkers + 1} 名工人的 MP 降为 ${Math.max(1, targetMP - 2)} 单位。该企业应雇佣多少名工人才能实现利润最大化？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `Hiring Rule: Hire as long as MRP >= MFC (Wage). MRP = Product Price * MP. For worker ${adjWorkers}: MRP = $${productPrice} * ${targetMP} = $${wage} >= $${wage} (Hire). For worker ${adjWorkers + 1}: MRP = $${productPrice} * ${Math.max(1, targetMP - 2)} = $${productPrice * Math.max(1, targetMP - 2)} < $${wage} (Do not hire). Optimal employment is ${adjWorkers} workers.`,
      zh: `雇佣决策黄金法则：只要 MRP >= MFC（工资率），就应当雇佣。MRP = 产品价格 × 边际产量。第 ${adjWorkers} 人：MRP = $${productPrice} × ${targetMP} = $${wage} >= $${wage}（雇佣）；第 ${adjWorkers + 1} 人：MRP = $${productPrice} × ${Math.max(1, targetMP - 2)} < $${wage}（停止雇佣）。最优雇佣人数为 ${adjWorkers} 人。`
    }
  };
}

export function generateMonopsonyWageQuestion(): PracticeQuestion {
  const wageCompetitive = randomChoice([30, 40]);
  const wageMonopsony = wageCompetitive - 12;
  const mfcAtQm = wageCompetitive + 10;
  const qMonopsony = 24;
  const qCompetitive = 36;

  const { options, correctOptionId } = buildFourOptions(
    {
      text: {
        en: `Hire ${qMonopsony} workers and pay a wage of $${wageMonopsony} (read from the Labor Supply curve)`,
        zh: `雇佣 ${qMonopsony} 名工人，并支付工资 $${wageMonopsony}（由劳动力供给曲线 S_L 决定）`
      },
      explanation: {
        en: `Correct! The monopsonist finds employment quantity where MFC = MRP (at ${qMonopsony} workers). To determine the wage, it projects DOWN to the Labor Supply curve (paying $${wageMonopsony}, which is the minimum wage workers will accept for that quantity).`,
        zh: `回答正确！买方垄断厂商首先在 MFC = MRP 处确定雇佣人数（${qMonopsony} 人）。在确定实际发放工资时，必须向下投影到【劳动力供给曲线 S_L】上（支付 $${wageMonopsony}，即工人提供该劳动量所要求的最低保留工资）。`
      }
    },
    [
      {
        text: {
          en: `Hire ${qMonopsony} workers and pay a wage of $${mfcAtQm} (read directly from the MFC curve)`,
          zh: `雇佣 ${qMonopsony} 名工人，并支付工资 $${mfcAtQm}（直接按 MFC 曲线的交点高度支付）`
        },
        explanation: {
          en: `Incorrect. Major AP exam trap! $${mfcAtQm} is the Marginal Factor Cost, but the firm exploits its market power and pays only the wage on the Labor Supply curve ($${wageMonopsony}).`,
          zh: `错误。极其高频的 AP 考题陷阱！$${mfcAtQm} 是边际要素成本，但买方垄断厂商拥有压价买方势力，只会向下按劳动供给曲线支付 $${wageMonopsony}。`
        }
      },
      {
        text: {
          en: `Hire ${qCompetitive} workers and pay a wage of $${wageCompetitive}`,
          zh: `雇佣 ${qCompetitive} 名工人，并支付工资 $${wageCompetitive}`
        },
        explanation: {
          en: `Incorrect. This corresponds to the competitive factor market equilibrium (where Supply equals MRP), not the profit-maximizing monopsony outcome.`,
          zh: `错误。这是完全竞争要素市场均衡（供给与 MRP 相交），买方垄断者会限制雇工并压低工资。`
        }
      },
      {
        text: {
          en: `Hire ${qCompetitive} workers and pay a wage of $${wageMonopsony}`,
          zh: `雇佣 ${qCompetitive} 名工人，并支付工资 $${wageMonopsony}`
        },
        explanation: {
          en: `Incorrect. At a wage of $${wageMonopsony}, workers are only willing to supply ${qMonopsony} units of labor on the supply curve.`,
          zh: `错误。在 $${wageMonopsony} 的低工资下，工人只愿意提供 ${qMonopsony} 单位的劳动力。`
        }
      }
    ]
  );

  return {
    id: `dyn-monopsony-${Date.now()}-${randomInt(100, 999)}`,
    unit: 5,
    topicCode: '5.4',
    topicId: 'monopsony-factor-market',
    isDynamic: true,
    templateId: 'dyn-monopsony-wage-reading',
    prompt: {
      en: `A single employer in an isolated mining town is a monopsony hiring labor. Its Marginal Factor Cost (MFC) equals Marginal Revenue Product (MRP) at ${qMonopsony} workers. At this quantity, MFC = $${mfcAtQm}, but the Labor Supply curve shows workers will accept $${wageMonopsony}. What quantity of labor and wage will the monopsonist choose?`,
      zh: `某偏远矿业小镇中仅有一家唯一的雇主（买方垄断雇主）。其边际要素成本（MFC）与边际收益产品（MRP）在雇佣 ${qMonopsony} 名工人时相交。在此雇佣量下，MFC 为 $${mfcAtQm}，而劳动力供给曲线（S_L）显示工人愿意接受的工资为 $${wageMonopsony}。该买方垄断者将选择怎样的雇佣人数与支付工资？`
    },
    options,
    correctOptionId,
    overallExplanation: {
      en: `Monopsony Rule: Step 1: Set MFC = MRP to determine hiring quantity (Qm = ${qMonopsony}). Step 2: Read wage off the Labor Supply curve (Wm = $${wageMonopsony}). Monopsony results in both underemployment (Qm < Qc) and wage markdown (Wm < Wc).`,
      zh: `买方垄断决策规则：第一步在 MFC = MRP 确定最优雇工人数（Qm = ${qMonopsony}）；第二步垂直向下在劳动力供给曲线（S_L）上读取实际支付工资（Wm = $${wageMonopsony}）。买方垄断必然导致雇佣不足（Qm < Qc）与工资被压低（Wm < Wc）。`
    }
  };
}
