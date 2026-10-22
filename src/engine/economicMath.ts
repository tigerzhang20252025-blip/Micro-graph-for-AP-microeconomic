import { Point2D } from '../types/graph';

/**
 * Core mathematical and economic utilities for microeconomic analysis.
 * Kept completely decoupled from UI and chart rendering.
 */

export interface LinearCurveParams {
  intercept: number; // Vertical intercept (P when Q=0)
  slope: number;     // dP/dQ (negative for demand, positive for supply)
}

/**
 * Evaluates Price given Quantity for linear equation: P = intercept + slope * Q
 */
export function evaluateLinearPrice(params: LinearCurveParams, q: number): number {
  return params.intercept + params.slope * q;
}

/**
 * Evaluates Quantity given Price for linear equation: Q = (P - intercept) / slope
 */
export function evaluateLinearQuantity(params: LinearCurveParams, p: number): number {
  if (Math.abs(params.slope) < 1e-9) return 0;
  return (p - params.intercept) / params.slope;
}

/**
 * Finds intersection point between two linear curves:
 * Curve 1: P = a1 + b1 * Q
 * Curve 2: P = a2 + b2 * Q
 */
export function findLinearIntersection(
  curve1: LinearCurveParams,
  curve2: LinearCurveParams
): Point2D | null {
  const denominator = curve1.slope - curve2.slope;
  if (Math.abs(denominator) < 1e-9) {
    return null; // Parallel lines
  }
  const q = (curve2.intercept - curve1.intercept) / denominator;
  const p = evaluateLinearPrice(curve1, q);
  return { x: q, y: p };
}

/**
 * Calculates point price elasticity of linear demand: | (1/slope) * (P / Q) |
 */
export function calculatePointElasticity(demandSlope: number, p: number, q: number): number {
  if (q <= 0 || Math.abs(demandSlope) < 1e-9) return 0;
  const dQdP = 1 / demandSlope;
  return Math.abs(dQdP * (p / q));
}

/**
 * Computes triangle area given base and height
 */
export function calculateTriangleArea(base: number, height: number): number {
  return 0.5 * Math.max(0, base) * Math.max(0, height);
}

/**
 * Computes polygon area using the Shoelace (Gauss) formula
 */
export function calculatePolygonArea(points: Point2D[]): number {
  let area = 0;
  const n = points.length;
  if (n < 3) return 0;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area) / 2;
}

/**
 * Generates an array of sample points for a parabolic curve (e.g. Total Revenue: TR = a*Q - b*Q^2)
 */
export function generateParabolicPoints(
  a: number,
  b: number,
  xMin: number,
  xMax: number,
  steps: number = 40
): Point2D[] {
  const points: Point2D[] = [];
  const dx = (xMax - xMin) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    const y = Math.max(0, a * x - b * x * x);
    points.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
  }
  return points;
}

/**
 * Calculates simultaneous shift outcome for Supply and Demand
 */
export interface SimultaneousShiftAnalysis {
  priceDirection: 'increase' | 'decrease' | 'indeterminate';
  quantityDirection: 'increase' | 'decrease' | 'indeterminate';
  explanationEn: string;
  explanationZh: string;
}

export function analyzeSimultaneousShifts(
  demandShift: number, // >0 is right (increase), <0 is left (decrease)
  supplyShift: number  // >0 is right (increase), <0 is left (decrease)
): SimultaneousShiftAnalysis {
  if (demandShift === 0 && supplyShift === 0) {
    return {
      priceDirection: 'indeterminate',
      quantityDirection: 'indeterminate',
      explanationEn: 'Both curves remain in their baseline equilibrium positions.',
      explanationZh: '供求曲线均保持在基准均衡位置，无外生平移。'
    };
  }

  if (demandShift > 0 && supplyShift > 0) {
    // Both increase: Q unambiguously increases, P is indeterminate
    const pTendency = demandShift > supplyShift ? 'rose' : demandShift < supplyShift ? 'fell' : 'stayed constant';
    const pTendencyZh = demandShift > supplyShift ? '上涨' : demandShift < supplyShift ? '下跌' : '基本持平';
    return {
      priceDirection: 'indeterminate',
      quantityDirection: 'increase',
      explanationEn: `Demand ↑ and Supply ↑: Equilibrium Quantity unequivocally INCREASES. Equilibrium Price is INDETERMINATE (here P ${pTendency} because the ${demandShift >= supplyShift ? 'demand' : 'supply'} shift magnitude is larger).`,
      explanationZh: `需求增加（D↑）且供给增加（S↑）：均衡数量确定增加（Q↑）。均衡价格不确定（Indeterminate，此处因${demandShift >= supplyShift ? '需求' : '供给'}平移幅度更大，价格总体${pTendencyZh}）。`
    };
  }

  if (demandShift < 0 && supplyShift < 0) {
    // Both decrease: Q unambiguously decreases, P is indeterminate
    const pTendency = Math.abs(demandShift) > Math.abs(supplyShift) ? 'fell' : Math.abs(demandShift) < Math.abs(supplyShift) ? 'rose' : 'stayed constant';
    const pTendencyZh = Math.abs(demandShift) > Math.abs(supplyShift) ? '下跌' : Math.abs(demandShift) < Math.abs(supplyShift) ? '上涨' : '基本持平';
    return {
      priceDirection: 'indeterminate',
      quantityDirection: 'decrease',
      explanationEn: `Demand ↓ and Supply ↓: Equilibrium Quantity unequivocally DECREASES. Equilibrium Price is INDETERMINATE (here P ${pTendency} based on relative shift sizes).`,
      explanationZh: `需求减少（D↓）且供给减少（S↓）：均衡数量确定减少（Q↓）。均衡价格不确定（Indeterminate，此处价格${pTendencyZh}）。`
    };
  }

  if (demandShift > 0 && supplyShift < 0) {
    // Demand increases, Supply decreases: P unambiguously increases, Q is indeterminate
    const qTendency = demandShift > Math.abs(supplyShift) ? 'increased' : demandShift < Math.abs(supplyShift) ? 'decreased' : 'stayed constant';
    const qTendencyZh = demandShift > Math.abs(supplyShift) ? '增加' : demandShift < Math.abs(supplyShift) ? '减少' : '基本持平';
    return {
      priceDirection: 'increase',
      quantityDirection: 'indeterminate',
      explanationEn: `Demand ↑ and Supply ↓: Equilibrium Price unequivocally INCREASES. Equilibrium Quantity is INDETERMINATE (here Q ${qTendency} because the ${demandShift >= Math.abs(supplyShift) ? 'demand' : 'supply'} shift dominates).`,
      explanationZh: `需求增加（D↑）且供给减少（S↓）：均衡价格确定上涨（P↑）。均衡数量不确定（Indeterminate，此处数量${qTendencyZh}）。`
    };
  }

  // demandShift < 0 && supplyShift > 0
  // Demand decreases, Supply increases: P unambiguously decreases, Q is indeterminate
  const qTendency = Math.abs(demandShift) < supplyShift ? 'increased' : Math.abs(demandShift) > supplyShift ? 'decreased' : 'stayed constant';
  const qTendencyZh = Math.abs(demandShift) < supplyShift ? '增加' : Math.abs(demandShift) > supplyShift ? '减少' : '基本持平';
  return {
    priceDirection: 'decrease',
    quantityDirection: 'indeterminate',
    explanationEn: `Demand ↓ and Supply ↑: Equilibrium Price unequivocally DECREASES. Equilibrium Quantity is INDETERMINATE (here Q ${qTendency} based on relative shift sizes).`,
    explanationZh: `需求减少（D↓）且供给增加（S↑）：均衡价格确定下跌（P↓）。均衡数量不确定（Indeterminate，此处数量${qTendencyZh}）。`
  };
}

/**
 * Generates an array of sample points for a linear curve between xMin and xMax
 */
export function generateLinearPoints(
  params: LinearCurveParams,
  xMin: number,
  xMax: number,
  steps: number = 20,
  yMin: number = 0,
  yMax: number = 100
): Point2D[] {
  const points: Point2D[] = [];
  const dx = (xMax - xMin) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    const y = evaluateLinearPrice(params, x);
    if (y >= yMin - 1 && y <= yMax + 1) {
      points.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
    }
  }
  return points;
}

/**
 * Cost curve calculation utilities
 */
export interface CostFunctionParams {
  fixedCost: number;       // TFC
  m0: number;              // intercept for MC
  m1: number;              // linear coefficient for MC
  m2: number;              // quadratic coefficient for MC
  perUnitTax?: number;     // shifts MC, AVC, ATC vertically
}

export function evaluateMC(p: CostFunctionParams, q: number): number {
  const tax = p.perUnitTax || 0;
  return p.m0 - p.m1 * q + p.m2 * q * q + tax;
}

export function evaluateAVC(p: CostFunctionParams, q: number): number {
  if (q <= 0) return p.m0;
  const tax = p.perUnitTax || 0;
  return p.m0 - (p.m1 / 2) * q + (p.m2 / 3) * q * q + tax;
}

export function evaluateATC(p: CostFunctionParams, q: number): number {
  if (q <= 0) return 999;
  return evaluateAVC(p, q) + p.fixedCost / q;
}

export function evaluateAFC(p: CostFunctionParams, q: number): number {
  if (q <= 0) return 999;
  return p.fixedCost / q;
}

/**
 * 2x2 Game Theory Payoff Matrix Solver
 */
export interface PayoffCell {
  p1: number;
  p2: number;
}

export interface PayoffMatrix2x2 {
  TL: PayoffCell; // Top-Left
  TR: PayoffCell; // Top-Right
  BL: PayoffCell; // Bottom-Left
  BR: PayoffCell; // Bottom-Right
}

export interface GameTheorySolution {
  p1DominantStrategy: 'Top' | 'Bottom' | 'None';
  p2DominantStrategy: 'Left' | 'Right' | 'None';
  nashEquilibria: ('TL' | 'TR' | 'BL' | 'BR')[];
  isPrisonersDilemma: boolean;
  explanationEn: string;
  explanationZh: string;
}

export function solve2x2Game(matrix: PayoffMatrix2x2, p1ActionNames: [string, string] = ['Top', 'Bottom'], p2ActionNames: [string, string] = ['Left', 'Right']): GameTheorySolution {
  const { TL, TR, BL, BR } = matrix;

  // Player 1 Dominant Strategy check:
  // Top is dominant if TL.p1 > BL.p1 AND TR.p1 > BR.p1
  // Bottom is dominant if BL.p1 > TL.p1 AND BR.p1 > TR.p1
  let p1Dominant: 'Top' | 'Bottom' | 'None' = 'None';
  if (TL.p1 > BL.p1 && TR.p1 > BR.p1) {
    p1Dominant = 'Top';
  } else if (BL.p1 > TL.p1 && BR.p1 > TR.p1) {
    p1Dominant = 'Bottom';
  }

  // Player 2 Dominant Strategy check:
  // Left is dominant if TL.p2 > TR.p2 AND BL.p2 > BR.p2
  // Right is dominant if TR.p2 > TL.p2 AND BR.p2 > BL.p2
  let p2Dominant: 'Left' | 'Right' | 'None' = 'None';
  if (TL.p2 > TR.p2 && BL.p2 > BR.p2) {
    p2Dominant = 'Left';
  } else if (TR.p2 > TL.p2 && BR.p2 > BL.p2) {
    p2Dominant = 'Right';
  }

  // Nash Equilibria: Best-response intersection
  const nash: ('TL' | 'TR' | 'BL' | 'BR')[] = [];

  // TL: P1 best response against Left (TL.p1 >= BL.p1) AND P2 best response against Top (TL.p2 >= TR.p2)
  if (TL.p1 >= BL.p1 && TL.p2 >= TR.p2) nash.push('TL');
  // TR: P1 best response against Right (TR.p1 >= BR.p1) AND P2 best response against Top (TR.p2 >= TL.p2)
  if (TR.p1 >= BR.p1 && TR.p2 >= TL.p2) nash.push('TR');
  // BL: P1 best response against Left (BL.p1 >= TL.p1) AND P2 best response against Bottom (BL.p2 >= BR.p2)
  if (BL.p1 >= TL.p1 && BL.p2 >= BR.p2) nash.push('BL');
  // BR: P1 best response against Right (BR.p1 >= TR.p1) AND P2 best response against Bottom (BR.p2 >= BL.p2)
  if (BR.p1 >= TR.p1 && BR.p2 >= BL.p2) nash.push('BR');

  // Prisoner's Dilemma Check:
  // Both have strictly dominant strategies leading to a Nash equilibrium that yields strictly lower payoffs than mutual cooperation.
  let isPrisonersDilemma = false;
  if (p1Dominant !== 'None' && p2Dominant !== 'None' && nash.length === 1) {
    const nashCell = nash[0];
    const nashP1 = matrix[nashCell].p1;
    const nashP2 = matrix[nashCell].p2;
    // Check if there is another cell where BOTH players are strictly better off
    const cells: ('TL' | 'TR' | 'BL' | 'BR')[] = ['TL', 'TR', 'BL', 'BR'];
    const betterCell = cells.find(c => c !== nashCell && matrix[c].p1 > nashP1 && matrix[c].p2 > nashP2);
    if (betterCell) {
      isPrisonersDilemma = true;
    }
  }

  const p1Name = p1Dominant === 'Top' ? p1ActionNames[0] : p1Dominant === 'Bottom' ? p1ActionNames[1] : 'None';
  const p2Name = p2Dominant === 'Left' ? p2ActionNames[0] : p2Dominant === 'Right' ? p2ActionNames[1] : 'None';

  const explanationEn = `Player 1 ${p1Dominant !== 'None' ? 'has a strictly dominant strategy: ' + p1Name : 'has NO dominant strategy'}. Player 2 ${p2Dominant !== 'None' ? 'has a strictly dominant strategy: ' + p2Name : 'has NO dominant strategy'}. Found ${nash.length} pure Nash Equilibrium: [${nash.join(', ')}]. ${isPrisonersDilemma ? "Classic Prisoner's Dilemma detected: non-cooperative Nash equilibrium yields lower collective payoff than mutual cooperation." : ''}`;
  const explanationZh = `玩家 1（行玩家）${p1Dominant !== 'None' ? '具有严格占优策略：【' + p1Name + '】' : '无占优策略'}。玩家 2（列玩家）${p2Dominant !== 'None' ? '具有严格占优策略：【' + p2Name + '】' : '无占优策略'}。共找到 ${nash.length} 个纯策略纳什均衡：【${nash.join(', ')}】。${isPrisonersDilemma ? '检测到经典“囚徒困境”特征：非合作纳什均衡的整体收益严格劣于双方互信合谋的合作结果。' : ''}`;

  return {
    p1DominantStrategy: p1Dominant,
    p2DominantStrategy: p2Dominant,
    nashEquilibria: nash,
    isPrisonersDilemma,
    explanationEn,
    explanationZh
  };
}

/**
 * Generates points for a concave Production Possibilities Curve (PPC):
 * Y = B * (1 - (X/A)^power)^(1/power)
 */
export function generatePPCPoints(
  maxGoodA: number,
  maxGoodB: number,
  power: number = 2, // power = 1 is linear (constant opp cost), power = 2 is bowed-out (increasing opp cost)
  steps: number = 40
): Point2D[] {
  const points: Point2D[] = [];
  const dx = maxGoodA / steps;
  for (let i = 0; i <= steps; i++) {
    const x = i * dx;
    const ratio = Math.min(1, Math.max(0, x / maxGoodA));
    let y = 0;
    if (power === 1) {
      y = maxGoodB * (1 - ratio);
    } else {
      y = maxGoodB * Math.pow(Math.max(0, 1 - Math.pow(ratio, power)), 1 / power);
    }
    points.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
  }
  return points;
}
