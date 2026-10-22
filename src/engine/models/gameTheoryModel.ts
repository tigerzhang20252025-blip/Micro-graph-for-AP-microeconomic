import { EconomicModel, GraphCalculationOutput, ScenarioPreset, CurveSpec, KeyPointSpec, ShadedAreaSpec } from '../../types/graph';
import { solve2x2Game, PayoffMatrix2x2 } from '../economicMath';

export interface GameTheoryParams {
  presetScenario: 'prisoners_dilemma' | 'advertising_war' | 'coordination_game' | 'no_dominant_strategy';
  tl1: number; tl2: number; // Top-Left (Cooperate, Cooperate)
  tr1: number; tr2: number; // Top-Right (Cooperate, Cheat)
  bl1: number; bl2: number; // Bottom-Left (Cheat, Cooperate)
  br1: number; br2: number; // Bottom-Right (Cheat, Cheat / Nash)
}

const defaultParams: GameTheoryParams = {
  presetScenario: 'prisoners_dilemma',
  tl1: 50, tl2: 50,  // Collusion / High Price: ($50, $50)
  tr1: 10, tr2: 80,  // Firm 1 High, Firm 2 Low: ($10, $80)
  bl1: 80, bl2: 10,  // Firm 1 Low, Firm 2 High: ($80, $10)
  br1: 25, br2: 25   // Both Low Price / Cheat (Nash): ($25, $25)
};

const presets: ScenarioPreset[] = [
  {
    id: 'prisoners_dilemma',
    name: {
      en: 'Classic Oligopoly Prisoner’s Dilemma (Pricing War)',
      zh: '经典寡头“囚徒困境”（价格战博弈）'
    },
    description: {
      en: 'Both firms have a dominant strategy to set a Low Price. The non-cooperative Nash equilibrium ($25, $25) yields strictly lower profits than collusion ($50, $50).',
      zh: '两家厂商均享有选择“低价（降价促销）”的严格占优策略。非合作纳什均衡（$25, $25）的整体收益严格劣于双方互信合谋高价（$50, $50）。'
    },
    params: {
      presetScenario: 'prisoners_dilemma',
      tl1: 50, tl2: 50,
      tr1: 10, tr2: 80,
      bl1: 80, bl2: 10,
      br1: 25, br2: 25
    }
  },
  {
    id: 'advertising_war',
    name: {
      en: 'Advertising War (Duopoly Marketing)',
      zh: '双头广告战（营销争夺博弈）'
    },
    description: {
      en: 'Both firms advertise to defend market share. Advertising cancels out each other’s advantage, burning profits ($40, $40 vs $70, $70).',
      zh: '双方均选择投入巨额广告以捍卫市场份额。双方广告互相抵消，最终陷入利润消耗战（$40, $40 劣于双方均不打广告的 $70, $70）。'
    },
    params: {
      presetScenario: 'advertising_war',
      tl1: 70, tl2: 70, // Neither Advertises
      tr1: 20, tr2: 90, // Firm 1 No Ad, Firm 2 Advertises
      bl1: 90, bl2: 20, // Firm 1 Advertises, Firm 2 No Ad
      br1: 40, br2: 40  // Both Advertise (Nash)
    }
  },
  {
    id: 'no_dominant_strategy',
    name: {
      en: 'Game with Only ONE Dominant Strategy',
      zh: '仅单方具有占优策略博弈（AP 高频难题）'
    },
    description: {
      en: 'Firm 1 has no dominant strategy on its own, but can rationally predict Firm 2’s dominant move to choose its best response, finding a unique Nash equilibrium.',
      zh: '厂商 1 本身无占优策略，但能理性预判厂商 2 必然采取其占优策略，从而做出最佳应对，求得唯一纳什均衡。'
    },
    params: {
      presetScenario: 'no_dominant_strategy',
      tl1: 50, tl2: 60,
      tr1: 20, tr2: 40,
      bl1: 40, bl2: 70,
      br1: 80, br2: 50
    }
  }
];

export const gameTheoryModel: EconomicModel = {
  id: 'oligopoly-game-theory',
  topicId: 'oligopoly-game-theory',
  name: {
    en: 'Oligopoly, Payoff Matrix & Nash Equilibrium',
    zh: '寡头垄断、博弈支付矩阵与纳什均衡计算'
  },
  description: {
    en: 'Real-time 2x2 game theory solver. Dynamically calculates dominant strategies for both players, identifies Nash equilibria, and proves the Prisoner’s Dilemma.',
    zh: '实时 2x2 博弈论计算与可视化引擎。动态求解双方的占优策略、识别全部纳什均衡点，并解析寡头合谋卡特尔瓦解机制。'
  },
  defaultParams,
  presets,
  controls: [
    {
      type: 'slider',
      id: 'tl1',
      label: {
        en: 'Firm 1 Payoff (Top, Left) - Cooperate',
        zh: '厂商 1 收益（上，左）- 合作合谋'
      },
      min: 0,
      max: 100,
      step: 5,
      unit: '$'
    },
    {
      type: 'slider',
      id: 'tl2',
      label: {
        en: 'Firm 2 Payoff (Top, Left) - Cooperate',
        zh: '厂商 2 收益（上，左）- 合作合谋'
      },
      min: 0,
      max: 100,
      step: 5,
      unit: '$'
    },
    {
      type: 'slider',
      id: 'bl1',
      label: {
        en: 'Firm 1 Payoff (Bottom, Left) - Cheat Advantage',
        zh: '厂商 1 收益（下，左）- 单方背叛获利'
      },
      min: 0,
      max: 120,
      step: 5,
      unit: '$'
    },
    {
      type: 'slider',
      id: 'tr2',
      label: {
        en: 'Firm 2 Payoff (Top, Right) - Cheat Advantage',
        zh: '厂商 2 收益（上，右）- 单方背叛获利'
      },
      min: 0,
      max: 120,
      step: 5,
      unit: '$'
    },
    {
      type: 'slider',
      id: 'br1',
      label: {
        en: 'Firm 1 Payoff (Bottom, Right) - Mutual Defection',
        zh: '厂商 1 收益（下，右）- 相互背叛纳什'
      },
      min: 0,
      max: 80,
      step: 5,
      unit: '$'
    },
    {
      type: 'slider',
      id: 'br2',
      label: {
        en: 'Firm 2 Payoff (Bottom, Right) - Mutual Defection',
        zh: '厂商 2 收益（下，右）- 相互背叛纳什'
      },
      min: 0,
      max: 80,
      step: 5,
      unit: '$'
    }
  ],
  calculate(rawParams: Record<string, any>): GraphCalculationOutput {
    const params: GameTheoryParams = { ...defaultParams, ...rawParams };

    const matrix: PayoffMatrix2x2 = {
      TL: { p1: params.tl1, p2: params.tl2 },
      TR: { p1: params.tr1, p2: params.tr2 },
      BL: { p1: params.bl1, p2: params.bl2 },
      BR: { p1: params.br1, p2: params.br2 }
    };

    const action1Names: [string, string] = ['High Price / Cooperate', 'Low Price / Cheat'];
    const action2Names: [string, string] = ['High Price / Cooperate', 'Low Price / Cheat'];

    // Solve game dynamically
    const solution = solve2x2Game(matrix, action1Names, action2Names);

    // Coordinate mapping for 2x2 Matrix Graphic on SVG (Domain 0 to 100 x 0 to 100)
    // Top-Left: x in [0, 50], y in [50, 100]
    // Top-Right: x in [50, 100], y in [50, 100]
    // Bottom-Left: x in [0, 50], y in [0, 50]
    // Bottom-Right: x in [50, 100], y in [0, 50]

    const gridLines: CurveSpec[] = [
      // Vertical divider
      {
        id: 'vertDiv',
        name: { en: 'Vertical Cell Boundary', zh: '矩阵垂直分界线' },
        shortLabel: 'Div',
        points: [{ x: 50, y: 0 }, { x: 50, y: 100 }],
        color: '#475569',
        strokeWidth: 2,
        strokeDasharray: 'none',
        visible: true
      },
      // Horizontal divider
      {
        id: 'horizDiv',
        name: { en: 'Horizontal Cell Boundary', zh: '矩阵水平分界线' },
        shortLabel: 'Div',
        points: [{ x: 0, y: 50 }, { x: 100, y: 50 }],
        color: '#475569',
        strokeWidth: 2,
        strokeDasharray: 'none',
        visible: true
      }
    ];

    // Shaded areas for the 4 quadrants, highlighting Nash Equilibrium
    const shadedAreas: ShadedAreaSpec[] = [
      {
        id: 'tlArea',
        label: { en: `Top-Left Cell ($${matrix.TL.p1}, $${matrix.TL.p2})`, zh: `左上象限（$${matrix.TL.p1}, $${matrix.TL.p2}）` },
        points: [{ x: 0, y: 50 }, { x: 50, y: 50 }, { x: 50, y: 100 }, { x: 0, y: 100 }],
        fill: solution.nashEquilibria.includes('TL') ? '#10b981' : '#3b82f6',
        opacity: solution.nashEquilibria.includes('TL') ? 0.35 : 0.08,
        pattern: solution.nashEquilibria.includes('TL') ? 'dots' : 'solid',
        visible: true
      },
      {
        id: 'trArea',
        label: { en: `Top-Right Cell ($${matrix.TR.p1}, $${matrix.TR.p2})`, zh: `右上象限（$${matrix.TR.p1}, $${matrix.TR.p2}）` },
        points: [{ x: 50, y: 50 }, { x: 100, y: 50 }, { x: 100, y: 100 }, { x: 50, y: 100 }],
        fill: solution.nashEquilibria.includes('TR') ? '#10b981' : '#f59e0b',
        opacity: solution.nashEquilibria.includes('TR') ? 0.35 : 0.08,
        pattern: solution.nashEquilibria.includes('TR') ? 'dots' : 'solid',
        visible: true
      },
      {
        id: 'blArea',
        label: { en: `Bottom-Left Cell ($${matrix.BL.p1}, $${matrix.BL.p2})`, zh: `左下象限（$${matrix.BL.p1}, $${matrix.BL.p2}）` },
        points: [{ x: 0, y: 0 }, { x: 50, y: 0 }, { x: 50, y: 50 }, { x: 0, y: 50 }],
        fill: solution.nashEquilibria.includes('BL') ? '#10b981' : '#8b5cf6',
        opacity: solution.nashEquilibria.includes('BL') ? 0.35 : 0.08,
        pattern: solution.nashEquilibria.includes('BL') ? 'dots' : 'solid',
        visible: true
      },
      {
        id: 'brArea',
        label: { en: `Bottom-Right Cell ($${matrix.BR.p1}, $${matrix.BR.p2})`, zh: `右下象限（$${matrix.BR.p1}, $${matrix.BR.p2}）` },
        points: [{ x: 50, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 50 }, { x: 50, y: 50 }],
        fill: solution.nashEquilibria.includes('BR') ? '#10b981' : '#ef4444',
        opacity: solution.nashEquilibria.includes('BR') ? 0.35 : 0.08,
        pattern: solution.nashEquilibria.includes('BR') ? 'dots' : 'solid',
        visible: true
      }
    ];

    // Key points to display payoff numbers clearly inside each quadrant
    const points: KeyPointSpec[] = [
      {
        id: 'ptTL',
        label: { en: `(Cooperate, Cooperate): Firm 1=$${matrix.TL.p1}, Firm 2=$${matrix.TL.p2}`, zh: `（合作，合作）：厂商1=$${matrix.TL.p1}，厂商2=$${matrix.TL.p2}` },
        shortLabel: solution.nashEquilibria.includes('TL') ? `★ NASH ($${matrix.TL.p1}, $${matrix.TL.p2})` : `($${matrix.TL.p1}, $${matrix.TL.p2})`,
        x: 25,
        y: 75,
        color: solution.nashEquilibria.includes('TL') ? '#059669' : '#1e293b',
        showDropLines: false
      },
      {
        id: 'ptTR',
        label: { en: `(Cooperate, Cheat): Firm 1=$${matrix.TR.p1}, Firm 2=$${matrix.TR.p2}`, zh: `（合作，背叛）：厂商1=$${matrix.TR.p1}，厂商2=$${matrix.TR.p2}` },
        shortLabel: solution.nashEquilibria.includes('TR') ? `★ NASH ($${matrix.TR.p1}, $${matrix.TR.p2})` : `($${matrix.TR.p1}, $${matrix.TR.p2})`,
        x: 75,
        y: 75,
        color: solution.nashEquilibria.includes('TR') ? '#059669' : '#1e293b',
        showDropLines: false
      },
      {
        id: 'ptBL',
        label: { en: `(Cheat, Cooperate): Firm 1=$${matrix.BL.p1}, Firm 2=$${matrix.BL.p2}`, zh: `（背叛，合作）：厂商1=$${matrix.BL.p1}，厂商2=$${matrix.BL.p2}` },
        shortLabel: solution.nashEquilibria.includes('BL') ? `★ NASH ($${matrix.BL.p1}, $${matrix.BL.p2})` : `($${matrix.BL.p1}, $${matrix.BL.p2})`,
        x: 25,
        y: 25,
        color: solution.nashEquilibria.includes('BL') ? '#059669' : '#1e293b',
        showDropLines: false
      },
      {
        id: 'ptBR',
        label: { en: `(Cheat, Cheat): Firm 1=$${matrix.BR.p1}, Firm 2=$${matrix.BR.p2}`, zh: `（背叛，背叛）：厂商1=$${matrix.BR.p1}，厂商2=$${matrix.BR.p2}` },
        shortLabel: solution.nashEquilibria.includes('BR') ? `★ NASH ($${matrix.BR.p1}, $${matrix.BR.p2})` : `($${matrix.BR.p1}, $${matrix.BR.p2})`,
        x: 75,
        y: 25,
        color: solution.nashEquilibria.includes('BR') ? '#059669' : '#1e293b',
        showDropLines: false
      }
    ];

    // Custom Interactive Payoff Schedule Table
    const customTable = {
      title: { en: 'Full 2x2 Oligopoly Payoff Matrix & Strategy Breakdown', zh: '2x2 寡头博弈完整收益矩阵与占优策略推导表' },
      subtitle: { en: 'Player 1 (Row, Blue Payoff) vs. Player 2 (Column, Red Payoff)', zh: '厂商 1（行玩家，蓝色数字）vs. 厂商 2（列玩家，红色数字）' },
      headers: [
        { en: 'Firm 1 Action \\ Firm 2 Action', zh: '厂商 1 策略 \\ 厂商 2 策略' },
        { en: 'Firm 2: High Price (Cooperate)', zh: '厂商 2：高价（合作合谋）' },
        { en: 'Firm 2: Low Price (Cheat)', zh: '厂商 2：低价（削价背叛）' },
        { en: 'Firm 1 Dominant Check', zh: '厂商 1 占优策略对比' }
      ],
      rows: [
        {
          id: 'row-firm1-top',
          label: { en: 'Firm 1: High Price (Cooperate)', zh: '厂商 1：高价（合作合谋）' },
          values: [
            `($${matrix.TL.p1}, $${matrix.TL.p2})`,
            `($${matrix.TR.p1}, $${matrix.TR.p2})`,
            matrix.TL.p1 > matrix.BL.p1 && matrix.TR.p1 > matrix.BR.p1 ? 'Dominates' : 'Does not strictly dominate'
          ],
          highlight: solution.p1DominantStrategy === 'Top'
        },
        {
          id: 'row-firm1-bottom',
          label: { en: 'Firm 1: Low Price (Cheat)', zh: '厂商 1：低价（削价背叛）' },
          values: [
            `($${matrix.BL.p1}, $${matrix.BL.p2})`,
            `($${matrix.BR.p1}, $${matrix.BR.p2}) ${solution.nashEquilibria.includes('BR') ? '★ NASH' : ''}`,
            matrix.BL.p1 > matrix.TL.p1 && matrix.BR.p1 > matrix.TR.p1 ? 'Dominates' : 'Does not strictly dominate'
          ],
          highlight: solution.p1DominantStrategy === 'Bottom'
        }
      ]
    };

    const results = [
      {
        id: 'p1DomResult',
        label: { en: 'Firm 1 Dominant Strategy', zh: '厂商 1 占优策略' },
        value: solution.p1DominantStrategy === 'Top' ? 'High Price (Cooperate)' : solution.p1DominantStrategy === 'Bottom' ? 'Low Price (Cheat / Defect)' : 'No Dominant Strategy',
        color: '#2563eb'
      },
      {
        id: 'p2DomResult',
        label: { en: 'Firm 2 Dominant Strategy', zh: '厂商 2 占优策略' },
        value: solution.p2DominantStrategy === 'Left' ? 'High Price (Cooperate)' : solution.p2DominantStrategy === 'Right' ? 'Low Price (Cheat / Defect)' : 'No Dominant Strategy',
        color: '#d97706'
      },
      {
        id: 'nashResult',
        label: { en: 'Nash Equilibrium (Cells)', zh: '纳什均衡点（坐标）' },
        value: solution.nashEquilibria.length > 0 ? solution.nashEquilibria.join(', ') : 'None in pure strategies',
        color: '#059669'
      },
      {
        id: 'dilemmaResult',
        label: { en: 'Prisoner’s Dilemma', zh: '是否构成囚徒困境' },
        value: solution.isPrisonersDilemma ? 'YES (Collusion Defeated)' : 'NO (Harmonious / Standard)',
        color: solution.isPrisonersDilemma ? '#ef4444' : '#059669'
      },
      {
        id: 'cartelJointProfit',
        label: { en: 'Cartel Collusion vs Nash Joint Profit', zh: '合谋联合利润 vs 纳什联合利润' },
        value: `$${matrix.TL.p1 + matrix.TL.p2} vs $${matrix.BR.p1 + matrix.BR.p2}`,
        color: '#7c3aed'
      }
    ];

    const explanation = {
      en: solution.explanationEn,
      zh: solution.explanationZh
    };

    const analysisPoints = [
      {
        en: 'Dominant Strategy Definition: A strategy that yields a strictly higher payoff for a player REGARDLESS of the action chosen by the other player.',
        zh: '占优策略定义：无论竞争对手采取何种策略，该策略带给本玩家的收益都严格大于其他所有备选策略。'
      },
      {
        en: 'Nash Equilibrium Definition: A set of actions where neither firm has an incentive to unilaterally deviate given the other firm’s chosen strategy.',
        zh: '纳什均衡定义：在该策略组合下，给定对手的决策不变，任何一方单方面改变策略都无法获得更高的收益（无单方面偏离动机）。'
      },
      {
        en: 'Cartel Instability: Cartels (formal collusion) are notoriously unstable because each individual member always has a powerful incentive to secretly cheat and lower prices to capture outsized market share!',
        zh: '卡特尔合谋天然脆弱性：寡头卡特尔协议天然极易破裂，因为只要对方坚守高价，任何成员单方面偷偷降价背叛均能掠夺绝大多数市场份额，赚取远超合谋的暴利！'
      }
    ];

    return {
      axes: {
        xLabel: { en: 'Firm 2 Strategy: Left = High Price | Right = Low Price', zh: '厂商 2 策略轴：左侧 = 高价合作 | 右侧 = 低价背叛' },
        yLabel: { en: 'Firm 1 Strategy: Top = High Price | Bottom = Low Price', zh: '厂商 1 策略轴：上方 = 高价合作 | 下方 = 低价背叛' },
        xMin: 0,
        xMax: 100,
        yMin: 0,
        yMax: 100,
        xStep: 50,
        yStep: 50,
        xSuffix: '',
        yPrefix: ''
      },
      curves: gridLines,
      points,
      shadedAreas,
      results,
      customTable,
      explanation,
      analysisPoints
    };
  }
};
