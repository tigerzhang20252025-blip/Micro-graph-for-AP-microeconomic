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
