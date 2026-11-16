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
 * Expands configured axes when key points, visible shaded areas, or an entire
 * visible curve would otherwise fall outside the plot window. Asymptotic tails
 * of curves that cross the plot window remain clipped at the border via
 * Liang-Barsky clipping so vertical asymptotes (e.g. AFC/ATC near Q=0) do not
 * distort standard textbook proportions.
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

  for (const point of input.points) addPoint(point.x, point.y);
  for (const area of input.shadedAreas || []) {
    if (!area.visible) continue;
    for (const point of area.points) addPoint(point.x, point.y);
  }

  const { xMin, xMax, yMin, yMax } = input.axes;
  for (const curve of input.curves) {
    if (!curve.visible || curve.points.length === 0) continue;
    const hasPointInBaseDomain = curve.points.some(
      (pt) => finite(pt.x) && finite(pt.y) && pt.x >= xMin && pt.x <= xMax && pt.y >= yMin && pt.y <= yMax
    );
    if (!hasPointInBaseDomain) {
      for (const point of curve.points) addPoint(point.x, point.y);
    }
  }

  const x = expandDimension(xMin, xMax, xValues);
  const y = expandDimension(yMin, yMax, yValues);
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
