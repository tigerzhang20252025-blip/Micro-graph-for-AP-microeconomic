import React, { useId, useState } from 'react';
import { GraphCalculationOutput, Point2D, KeyPointSpec } from '../../types/graph';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAppState } from '../../context/AppStateContext';

interface GraphContainerProps {
  data: GraphCalculationOutput;
  title: string;
  visibilityScope: string;
}

export const GraphContainer: React.FC<GraphContainerProps> = ({ data, title, visibilityScope }) => {
  const { tr } = useLanguage();
  const { layerVisibility, hiddenCurveIds } = useAppState();
  const clipId = `plot-clip-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  // SVG dimensions & padding (Standard 4:3 high-res responsive viewBox)
  const svgWidth = 640;
  const svgHeight = 480;
  const padding = { top: 40, right: 75, bottom: 62, left: 70 };

  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const { axes, curves, points, shadedAreas } = data;
  const hiddenForThisGraph = hiddenCurveIds[visibilityScope] || [];
  const visibleCurves = curves.filter((c) => c.visible && !hiddenForThisGraph.includes(c.id));
  const visiblePoints = points.filter((pt) =>
    pt.x >= axes.xMin && pt.x <= axes.xMax && pt.y >= axes.yMin && pt.y <= axes.yMax
  );

  // Coordinate transforms: Economic Space -> SVG Space
  const scaleX = (x: number): number => {
    const range = axes.xMax - axes.xMin;
    if (range === 0) return padding.left;
    return padding.left + ((x - axes.xMin) / range) * plotWidth;
  };

  const scaleY = (y: number): number => {
    const range = axes.yMax - axes.yMin;
    if (range === 0) return svgHeight - padding.bottom;
    // Invert Y for SVG coordinates
    return svgHeight - padding.bottom - ((y - axes.yMin) / range) * plotHeight;
  };

  // Convert economic points array to SVG path 'd' string
  const pointsToSvgPath = (pts: Point2D[]): string => {
    if (pts.length === 0) return '';
    return pts.reduce((acc, pt, idx) => {
      const sx = scaleX(pt.x);
      const sy = scaleY(pt.y);
      return idx === 0 ? `M ${sx} ${sy}` : `${acc} L ${sx} ${sy}`;
    }, '');
  };

  // Generate tick steps
  const xTicks: number[] = [];
  const xStep = axes.xStep || (axes.xMax - axes.xMin) / 5;
  for (let val = axes.xMin; val <= axes.xMax; val += xStep) {
    xTicks.push(Number(val.toFixed(1)));
  }
  const xTickLabelStride = xTicks.length > 7 ? Math.ceil((xTicks.length - 1) / 6) : 1;

  const yTicks: number[] = [];
  const yStep = axes.yStep || (axes.yMax - axes.yMin) / 5;
  for (let val = axes.yMin; val <= axes.yMax; val += yStep) {
    yTicks.push(Number(val.toFixed(1)));
  }

  // Interactive mouse tracking
  const [hoverCoord, setHoverCoord] = useState<{ xVal: number; yVal: number; px: number; py: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const scaleFactorX = svgWidth / rect.width;
    const scaleFactorY = svgHeight / rect.height;
    const svgX = clientX * scaleFactorX;
    const svgY = clientY * scaleFactorY;

    if (
      svgX >= padding.left &&
      svgX <= svgWidth - padding.right &&
      svgY >= padding.top &&
      svgY <= svgHeight - padding.bottom
    ) {
      const xRange = axes.xMax - axes.xMin;
      const yRange = axes.yMax - axes.yMin;
      const xVal = axes.xMin + ((svgX - padding.left) / plotWidth) * xRange;
      const yVal = axes.yMin + ((svgHeight - padding.bottom - svgY) / plotHeight) * yRange;
      setHoverCoord({ xVal, yVal, px: svgX, py: svgY });
    } else {
      setHoverCoord(null);
    }
  };

  // ---------------------------------------------------------------------------
  // ANTI-COLLISION ENGINE 1: 8-Direction Radial Placement for Key Point Badges
  // ---------------------------------------------------------------------------
  interface PointBadgeLayout {
    pt: KeyPointSpec;
    sx: number;
    sy: number;
    tx: number;
    ty: number;
    anchor: 'start' | 'end' | 'middle';
    badgeWidth: number;
    badgeHeight: number;
    rectX: number;
    rectY: number;
  }

  const CANDIDATE_OFFSETS: Array<{ dx: number; dy: number; anchor: 'start' | 'end' | 'middle' }> = [
    { dx: 11, dy: -9, anchor: 'start' },    // Top-Right (default preference)
    { dx: -11, dy: -9, anchor: 'end' },     // Top-Left
    { dx: 11, dy: 13, anchor: 'start' },    // Bottom-Right
    { dx: -11, dy: 13, anchor: 'end' },     // Bottom-Left
    { dx: 0, dy: -18, anchor: 'middle' },   // Top-Center
    { dx: 0, dy: 20, anchor: 'middle' },    // Bottom-Center
    { dx: 14, dy: 2, anchor: 'start' },     // Direct Right
    { dx: -14, dy: 2, anchor: 'end' }       // Direct Left
  ];

  const pointLayouts: PointBadgeLayout[] = [];

  visiblePoints.forEach((pt) => {
    const sx = scaleX(pt.x);
    const sy = scaleY(pt.y);
    const textLen = pt.shortLabel.length;
    const badgeWidth = Math.max(34, textLen * 7.8 + 12);
    const badgeHeight = 18;

    let bestScore = -999999;
    let bestLayout = {
      tx: sx + 10,
      ty: sy - 8,
      anchor: 'start' as 'start' | 'end' | 'middle',
      rectX: sx + 6,
      rectY: sy - 21
    };

    for (const cand of CANDIDATE_OFFSETS) {
      const tx = sx + cand.dx;
      const ty = sy + cand.dy;
      const rectX = cand.anchor === 'end' ? tx - badgeWidth + 2 : cand.anchor === 'middle' ? tx - badgeWidth / 2 : tx - 4;
      const rectY = ty - 13;

      let penalty = 0;

      // 1. Boundary Penalties
      if (rectX < padding.left + 2) penalty += 2000;
      if (rectX + badgeWidth > svgWidth - padding.right - 2) penalty += 2000;
      if (rectY < padding.top + 2) penalty += 2000;
      if (rectY + badgeHeight > svgHeight - padding.bottom - 4) penalty += 2000;

      // 2. Collision with previously placed badges (AABB overlap)
      for (const placed of pointLayouts) {
        const overlapX = Math.max(0, Math.min(rectX + badgeWidth, placed.rectX + placed.badgeWidth) - Math.max(rectX, placed.rectX));
        const overlapY = Math.max(0, Math.min(rectY + badgeHeight, placed.rectY + placed.badgeHeight) - Math.max(rectY, placed.rectY));
        if (overlapX > 0 && overlapY > 0) {
          penalty += 5000 + (overlapX * overlapY * 10);
        }
      }

      // 3. Collision with other point core dots
      for (const other of points) {
        if (other.id === pt.id) continue;
        const osx = scaleX(other.x);
        const osy = scaleY(other.y);
        if (osx >= rectX - 5 && osx <= rectX + badgeWidth + 5 && osy >= rectY - 5 && osy <= rectY + badgeHeight + 5) {
          penalty += 1500;
        }
      }

      // Bias slightly toward top-right default
      const candidateScore = -penalty - Math.abs(cand.dx - 11) - Math.abs(cand.dy + 9);

      if (candidateScore > bestScore) {
        bestScore = candidateScore;
        bestLayout = { tx, ty, anchor: cand.anchor, rectX, rectY };
      }
    }

    pointLayouts.push({
      pt,
      sx,
      sy,
      tx: bestLayout.tx,
      ty: bestLayout.ty,
      anchor: bestLayout.anchor,
      badgeWidth,
      badgeHeight,
      rectX: bestLayout.rectX,
      rectY: bestLayout.rectY
    });
  });

  // ---------------------------------------------------------------------------
  // ANTI-COLLISION ENGINE 2: Drop-Line Badges & Standard Tick Collision Tracking
  // ---------------------------------------------------------------------------
  const visibleDropX = visiblePoints.filter((p) => p.showDropLines && p.xLabel);
  const sortedDropX = [...visibleDropX].sort((a, b) => scaleX(a.x) - scaleX(b.x));
  const dropXConfig: Record<string, { tier: number; yPos: number; sx: number }> = {};
  let lastSx = -999;
  let curTier = 0;

  sortedDropX.forEach((pt) => {
    const sx = scaleX(pt.x);
    if (sx - lastSx < 42) {
      curTier = curTier === 0 ? 1 : 0;
    } else {
      curTier = 0;
    }
    lastSx = sx;
    dropXConfig[pt.id] = {
      tier: curTier,
      yPos: svgHeight - padding.bottom + (curTier === 0 ? 16 : 29),
      sx
    };
  });

  // Active Drop Coordinates for Standard Tick Suppression
  const activeDropXCoords = sortedDropX.map((p) => scaleX(p.x));

  const visibleDropY = visiblePoints.filter((p) => p.showDropLines && p.yLabel);
  const sortedDropY = [...visibleDropY].sort((a, b) => scaleY(a.y) - scaleY(b.y));
  const dropYConfig: Record<string, { yShift: number; sy: number }> = {};
  let lastSy = -999;
  let yShift = 0;

  sortedDropY.forEach((pt) => {
    const sy = scaleY(pt.y);
    if (sy - lastSy < 18) {
      yShift = yShift === 0 ? -9 : yShift === -9 ? 9 : 0;
    } else {
      yShift = 0;
    }
    lastSy = sy;
    dropYConfig[pt.id] = { yShift, sy };
  });

  const activeDropYCoords = sortedDropY.map((p) => scaleY(p.y));

  // ---------------------------------------------------------------------------
  // ANTI-COLLISION ENGINE 3: Bounded Multi-Tier Curve End Labels
  // ---------------------------------------------------------------------------
  interface CurveLabelLayout {
    curveId: string;
    color: string;
    shortLabel: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }

  const rawCurveLabels: CurveLabelLayout[] = visibleCurves
    .filter((c) => c.points.length > 0)
    .map((curve) => {
      const lastPt = curve.points[curve.points.length - 1];
      const rawX = scaleX(lastPt.x);
      const rawY = scaleY(lastPt.y);
      const width = Math.max(30, curve.shortLabel.length * 8.5 + 12);
      const height = 18;

      // Clamp within viewport
      const clampedX = Math.min(rawX + 8, svgWidth - width - 6);
      const clampedY = Math.max(padding.top + 10, Math.min(svgHeight - padding.bottom - 16, rawY + 4));

      return {
        curveId: curve.id,
        color: curve.color,
        shortLabel: curve.shortLabel,
        x: clampedX,
        y: clampedY,
        width,
        height
      };
    });

  // Separate curve labels vertically & horizontally if congested
  const curveLabels = [...rawCurveLabels].sort((a, b) => a.y - b.y);
  for (let i = 1; i < curveLabels.length; i++) {
    const prev = curveLabels[i - 1];
    const curr = curveLabels[i];
    if (Math.abs(curr.x - prev.x) < 48 && curr.y - prev.y < 21) {
      // If pushing down exceeds bottom bounds, push previous up or shift horizontally
      if (prev.y + 21 > svgHeight - padding.bottom - 16) {
        prev.y = Math.max(padding.top + 10, prev.y - 12);
        curr.y = Math.min(svgHeight - padding.bottom - 16, prev.y + 21);
        curr.x = Math.max(padding.left + 10, curr.x - 36); // Horizontal stagger tier
      } else {
        curr.y = prev.y + 21;
      }
    }
  }

  return (
    <div className="relative w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-3 sm:p-4">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800 text-sm sm:text-base flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
          {title}
        </h3>
        {hoverCoord && (
          <div className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
            {tr(axes.xLabel)}: {axes.xPrefix || ''}{hoverCoord.xVal.toFixed(1)}{axes.xSuffix || ''}
            {' | '}
            {tr(axes.yLabel)}: {axes.yPrefix || ''}{hoverCoord.yVal.toFixed(1)}{axes.ySuffix || ''}
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="w-full aspect-[4/3] max-h-[520px]">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverCoord(null)}
          role="img"
          aria-label={title}
        >
          <defs>
            {/* Arrowhead marker for axes */}
            <marker
              id="axis-arrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#64748b" />
            </marker>

            {/* Accessibility Patterns for Welfare Areas */}
            <pattern id="pat-diagonal-left" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#d97706" strokeWidth="2" opacity="0.45" />
            </pattern>
            <pattern id="pat-diagonal-right" width="8" height="8" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#2563eb" strokeWidth="2" opacity="0.4" />
            </pattern>
            <pattern id="pat-cross" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 0 0 L 10 10 M 10 0 L 0 10" stroke="#ef4444" strokeWidth="1.5" opacity="0.5" />
            </pattern>
            <pattern id="pat-dots" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="1.5" fill="#8b5cf6" opacity="0.6" />
            </pattern>
            <clipPath id={clipId}>
              <rect x={padding.left} y={padding.top} width={plotWidth} height={plotHeight} />
            </clipPath>
          </defs>

          {/* Grid Lines */}
          {layerVisibility.showGrid && (
            <g className="grid-lines" opacity="0.32">
              {xTicks.map((x) => (
                <line
                  key={`grid-x-${x}`}
                  x1={scaleX(x)}
                  y1={padding.top}
                  x2={scaleX(x)}
                  y2={svgHeight - padding.bottom}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
              ))}
              {yTicks.map((y) => (
                <line
                  key={`grid-y-${y}`}
                  x1={padding.left}
                  y1={scaleY(y)}
                  x2={svgWidth - padding.right}
                  y2={scaleY(y)}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
              ))}
            </g>
          )}

          {/* Shaded Welfare Areas (Surpluses, DWL, Tax Revenue) */}
          {layerVisibility.showSurplus && (
            <g className="welfare-areas" clipPath={`url(#${clipId})`}>
              {shadedAreas.map((area) => {
                if (!area.visible || area.points.length === 0) return null;
                const pathString = pointsToSvgPath(area.points) + ' Z';
                let patternUrl = undefined;
                if (area.pattern === 'diagonal-left') patternUrl = 'url(#pat-diagonal-left)';
                else if (area.pattern === 'diagonal-right') patternUrl = 'url(#pat-diagonal-right)';
                else if (area.pattern === 'cross') patternUrl = 'url(#pat-cross)';
                else if (area.pattern === 'dots') patternUrl = 'url(#pat-dots)';

                return (
                  <g key={`area-${area.id}`}>
                    <path
                      d={pathString}
                      fill={area.fill}
                      fillOpacity={area.opacity || 0.25}
                      stroke={area.fill}
                      strokeWidth="1"
                      strokeOpacity="0.6"
                    />
                    {patternUrl && (
                      <path
                        d={pathString}
                        fill={patternUrl}
                        pointerEvents="none"
                      />
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* Equilibrium Drop Lines & Anti-Collision Axis Badges */}
          {layerVisibility.showDropLines && (
            <g className="drop-lines">
              {visiblePoints.map((pt) => {
                if (!pt.showDropLines) return null;
                const sx = scaleX(pt.x);
                const sy = scaleY(pt.y);
                const axisY = svgHeight - padding.bottom;
                const axisX = padding.left;

                const xCfg = dropXConfig[pt.id] || { tier: 0, yPos: axisY + 16, sx };
                const yShiftOffset = dropYConfig[pt.id]?.yShift || 0;

                return (
                  <g key={`dropline-${pt.id}`} opacity="0.85">
                    {/* Vertical drop line to X-axis */}
                    <line
                      x1={sx}
                      y1={sy}
                      x2={sx}
                      y2={axisY}
                      stroke={pt.color || '#64748b'}
                      strokeWidth="1.5"
                      strokeDasharray="4,4"
                    />
                    {/* Horizontal drop line to Y-axis */}
                    <line
                      x1={sx}
                      y1={sy}
                      x2={axisX}
                      y2={sy}
                      stroke={pt.color || '#64748b'}
                      strokeWidth="1.5"
                      strokeDasharray="4,4"
                    />

                    {/* Tier connector tick if staggered below */}
                    {xCfg.tier === 1 && (
                      <line
                        x1={sx}
                        y1={axisY + 4}
                        x2={sx}
                        y2={xCfg.yPos - 11}
                        stroke={pt.color || '#64748b'}
                        strokeWidth="1"
                        strokeDasharray="2,2"
                      />
                    )}

                    {/* Anti-collision value badge on X-axis */}
                    {pt.xLabel && (
                      <g transform={`translate(${sx}, ${xCfg.yPos})`}>
                        <rect
                          x={-(pt.xLabel.length * 6.5) / 2 - 4}
                          y="-11"
                          width={pt.xLabel.length * 6.5 + 8}
                          height="15"
                          rx="3"
                          fill="#f8fafc"
                          stroke="#cbd5e1"
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="1"
                          textAnchor="middle"
                          className="text-[10.5px] font-mono font-semibold fill-slate-800"
                        >
                          {pt.xLabel}
                        </text>
                      </g>
                    )}

                    {/* Anti-collision value badge on Y-axis */}
                    {pt.yLabel && (
                      <g transform={`translate(${axisX - 8}, ${sy + 4 + yShiftOffset})`}>
                        <rect
                          x={-(pt.yLabel.length * 6.5) - 6}
                          y="-11"
                          width={pt.yLabel.length * 6.5 + 6}
                          height="15"
                          rx="3"
                          fill="#f8fafc"
                          stroke="#cbd5e1"
                          strokeWidth="1"
                        />
                        <text
                          x="-3"
                          y="1"
                          textAnchor="end"
                          className="text-[10.5px] font-mono font-semibold fill-slate-800"
                        >
                          {pt.yLabel}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* Economic Curves */}
          <g className="economic-curves" clipPath={`url(#${clipId})`}>
            {visibleCurves.map((curve) => {
              const pathD = pointsToSvgPath(curve.points);

              return (
                <path
                  key={`curve-${curve.id}`}
                  d={pathD}
                  fill="none"
                  stroke={curve.color}
                  strokeWidth={curve.strokeWidth || 3}
                  strokeDasharray={curve.strokeDasharray || 'none'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}

          </g>

          {/* Anti-collision clamped Curve End Labels */}
          <g className="curve-labels">
            {curveLabels.map((lbl) => (
              <g
                key={`curve-label-${lbl.curveId}`}
                transform={`translate(${lbl.x}, ${lbl.y})`}
                className="cursor-default"
              >
                <rect
                  x="-2"
                  y="-12"
                  width={lbl.width}
                  height={lbl.height}
                  rx="4"
                  fill="#ffffff"
                  fillOpacity="0.94"
                  stroke={lbl.color}
                  strokeWidth="1.2"
                />
                <text
                  x="4"
                  y="1"
                  className="text-[11px] font-bold"
                  fill={lbl.color}
                >
                  {lbl.shortLabel}
                </text>
              </g>
            ))}
          </g>

          {/* Key Coordinate Points (Equilibria, Intersections) - ZERO FLICKER & NO TEXT COLLISION */}
          <g className="key-points">
            {pointLayouts.map((item) => (
              <g key={`pt-${item.pt.id}`} className="cursor-pointer">
                {/* Static Outer Halo (Zero Flicker / No Pulse) */}
                <circle
                  cx={item.sx}
                  cy={item.sy}
                  r="7.5"
                  fill={item.pt.color || '#059669'}
                  fillOpacity="0.16"
                  stroke={item.pt.color || '#059669'}
                  strokeWidth="1"
                  strokeOpacity="0.45"
                />
                {/* Core Crisp Dot */}
                <circle
                  cx={item.sx}
                  cy={item.sy}
                  r="4.2"
                  fill={item.pt.color || '#059669'}
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Point Label with Clean Background Pill Badge */}
                <g className="point-badge">
                  <rect
                    x={item.rectX}
                    y={item.rectY}
                    width={item.badgeWidth}
                    height={item.badgeHeight}
                    rx="4"
                    fill="#ffffff"
                    fillOpacity="0.92"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                  <text
                    x={item.tx}
                    y={item.ty}
                    textAnchor={item.anchor}
                    className="text-[11.5px] font-bold fill-slate-800 select-none"
                  >
                    {item.pt.shortLabel}
                  </text>
                </g>
              </g>
            ))}
          </g>

          {/* Main X and Y Axes */}
          <g className="axes">
            {/* Y Axis line with arrow */}
            <line
              x1={padding.left}
              y1={svgHeight - padding.bottom}
              x2={padding.left}
              y2={padding.top - 12}
              stroke="#334155"
              strokeWidth="2"
              markerEnd="url(#axis-arrow)"
            />
            {/* X Axis line with arrow */}
            <line
              x1={padding.left}
              y1={svgHeight - padding.bottom}
              x2={svgWidth - padding.right + 18}
              y2={svgHeight - padding.bottom}
              stroke="#334155"
              strokeWidth="2"
              markerEnd="url(#axis-arrow)"
            />

            {/* Y Axis Tick Marks & Numbers (with collision suppression) */}
            {yTicks.map((y) => {
              const sy = scaleY(y);
              const isSuppressedY =
                layerVisibility.showDropLines && activeDropYCoords.some((by) => Math.abs(by - sy) < 18);
              return (
                <g key={`tick-y-${y}`} transform={`translate(${padding.left}, ${sy})`}>
                  <line x1="-5" y1="0" x2="0" y2="0" stroke="#334155" strokeWidth="1.5" />
                  {!isSuppressedY && (
                    <text
                      x="-8"
                      y="4"
                      textAnchor="end"
                      className="text-[10px] font-mono fill-slate-500"
                    >
                      {axes.yPrefix || ''}{y}{axes.ySuffix || ''}
                    </text>
                  )}
                </g>
              );
            })}

            {/* X Axis Tick Marks & Numbers (with collision suppression) */}
            {xTicks.map((x, index) => {
              const sx = scaleX(x);
              const isSuppressedX =
                layerVisibility.showDropLines && activeDropXCoords.some((bx) => Math.abs(bx - sx) < 24);
              return (
                <g key={`tick-x-${x}`} transform={`translate(${sx}, ${svgHeight - padding.bottom})`}>
                  <line x1="0" y1="0" x2="0" y2="5" stroke="#334155" strokeWidth="1.5" />
                  {!isSuppressedX && (index % xTickLabelStride === 0 || index === xTicks.length - 1) && (
                    <text
                      x="0"
                      y="18"
                      textAnchor="middle"
                      className="text-[10px] font-mono fill-slate-500"
                    >
                      {axes.xPrefix || ''}{x}{axes.xSuffix || ''}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Y Axis Title (Elevated and offset from arrow tip) */}
            <text
              x={padding.left + 12}
              y={padding.top - 16}
              textAnchor="start"
              className="text-xs font-semibold fill-slate-800"
            >
              {tr(axes.yLabel)}
            </text>

            {/* X Axis Title (Positioned cleanly above the horizontal arrow) */}
            <text
              x={svgWidth - padding.right + 20}
              y={svgHeight - padding.bottom - 6}
              textAnchor="start"
              className="text-xs font-semibold fill-slate-800"
            >
              {tr(axes.xLabel)}
            </text>
          </g>

          {/* Mouse Crosshair when hovering */}
          {hoverCoord && (
            <g pointerEvents="none" opacity="0.6">
              <line
                x1={hoverCoord.px}
                y1={padding.top}
                x2={hoverCoord.px}
                y2={svgHeight - padding.bottom}
                stroke="#0284c7"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              <line
                x1={padding.left}
                y1={hoverCoord.py}
                x2={svgWidth - padding.right}
                y2={hoverCoord.py}
                stroke="#0284c7"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              <circle cx={hoverCoord.px} cy={hoverCoord.py} r="3" fill="#0284c7" />
            </g>
          )}
        </svg>
      </div>

      {/* Accessible Curve & Area Legend */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">Legend:</span>
        {visibleCurves.map((curve) => (
          <div key={`legend-curve-${curve.id}`} className="flex items-center gap-1.5">
            <span
              className="w-4 h-0.5 inline-block"
              style={{
                backgroundColor: curve.color,
                borderTop: curve.strokeDasharray && curve.strokeDasharray !== 'none' ? '2px dashed' : 'none',
                borderColor: curve.color
              }}
            ></span>
            <span className="text-slate-700 font-medium">{tr(curve.name)}</span>
          </div>
        ))}
        {layerVisibility.showSurplus && shadedAreas.map((area) => (
          <div key={`legend-area-${area.id}`} className="flex items-center gap-1.5">
            <span
              className="w-3.5 h-3.5 rounded border inline-block"
              style={{ backgroundColor: area.fill, borderColor: area.fill, opacity: 0.7 }}
            ></span>
            <span className="text-slate-700 font-medium">
              {tr(area.label)}
              {area.value !== undefined ? ` (${area.valuePrefix || ''}${area.value}${area.valueSuffix || ''})` : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
