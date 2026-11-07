import { AxisConfig, CurveSpec, KeyPointSpec, ShadedAreaSpec } from '../types/graph';

interface GraphDomainInput {
  axes: AxisConfig;
  curves: CurveSpec[];
  points: KeyPointSpec[];
  shadedAreas?: ShadedAreaSpec[];
}

export interface ResolvedGraphDomain {
  axes: AxisConfig;
  expanded: boolean;
}

const finite = (value: number): boolean => Number.isFinite(value);

function niceStep(range: number, targetTicks = 6): number {
  if (!finite(range) || range <= 0) return 1;
  const raw = range / targetTicks;
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
  const normalized = raw / magnitude;
  const factor = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return factor * magnitude;
}

function expandDimension(
  configuredMin: number,
  configuredMax: number,
  values: number[]
): { min: number; max: number; step: number; expanded: boolean } {
  const valid = values.filter(finite);
  if (valid.length === 0) {
    return {
      min: configuredMin,
      max: configuredMax,
      step: niceStep(configuredMax - configuredMin),
      expanded: false
    };
  }

  const contentMin = Math.min(...valid);
  const contentMax = Math.max(...valid);
  const expandLower = contentMin < configuredMin;
  const expandUpper = contentMax > configuredMax;
  if (!expandLower && !expandUpper) {
    return {
      min: configuredMin,
      max: configuredMax,
      step: niceStep(configuredMax - configuredMin),
      expanded: false
    };
  }

  const rawMin = Math.min(configuredMin, contentMin);
  const rawMax = Math.max(configuredMax, contentMax);
  const rawRange = Math.max(1e-9, rawMax - rawMin);
  const padding = rawRange * 0.08;
  const step = niceStep(rawRange + padding * 2);
  const min = expandLower ? Math.floor((contentMin - padding) / step) * step : configuredMin;
  const max = expandUpper ? Math.ceil((contentMax + padding) / step) * step : configuredMax;

  return { min, max, step, expanded: true };
}

/**
 * Expands configured axes only when visible economic content would otherwise
 * be clipped. Configured domains remain the pedagogical baseline; curves,
 * points and welfare areas are never silently discarded for exceeding it.
 */
export function resolveGraphDomain(input: GraphDomainInput): ResolvedGraphDomain {
  const xValues: number[] = [];
  const yValues: number[] = [];
  const addPoint = (x: number, y: number) => {
    if (finite(x) && finite(y)) {
      xValues.push(x);
      yValues.push(y);
    }
  };

  for (const curve of input.curves) {
    if (!curve.visible) continue;
    for (const point of curve.points) addPoint(point.x, point.y);
  }
  for (const point of input.points) addPoint(point.x, point.y);
  for (const area of input.shadedAreas || []) {
    if (!area.visible) continue;
    for (const point of area.points) addPoint(point.x, point.y);
  }

  const x = expandDimension(input.axes.xMin, input.axes.xMax, xValues);
  const y = expandDimension(input.axes.yMin, input.axes.yMax, yValues);
  const expanded = x.expanded || y.expanded;

  return {
    expanded,
    axes: {
      ...input.axes,
      xMin: x.min,
      xMax: x.max,
      yMin: y.min,
      yMax: y.max,
      xStep: x.expanded ? x.step : input.axes.xStep,
      yStep: y.expanded ? y.step : input.axes.yStep
    }
  };
}
