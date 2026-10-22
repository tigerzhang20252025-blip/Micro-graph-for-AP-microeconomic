import React, { useState } from 'react';
import { GraphCalculationOutput, Point2D } from '../../types/graph';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAppState } from '../../context/AppStateContext';

interface GraphContainerProps {
  data: GraphCalculationOutput;
  title: string;
}

export const GraphContainer: React.FC<GraphContainerProps> = ({ data, title }) => {
  const { tr } = useLanguage();
  const { layerVisibility } = useAppState();

  // SVG dimensions & padding
  const svgWidth = 640;
  const svgHeight = 480;
  const padding = { top: 35, right: 60, bottom: 55, left: 65 };

  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const { axes, curves, points, shadedAreas } = data;

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
    xTicks.push(val);
  }

  const yTicks: number[] = [];
  const yStep = axes.yStep || (axes.yMax - axes.yMin) / 5;
  for (let val = axes.yMin; val <= axes.yMax; val += yStep) {
    yTicks.push(val);
  }

  // Interactive mouse tracking
  const [hoverCoord, setHoverCoord] = useState<{ xVal: number; yVal: number; px: number; py: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Convert SVG pixel to viewBox scale
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

  return (
    <div className="relative w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-3 sm:p-4">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800 text-sm sm:text-base flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
          {title}
        </h3>
        {hoverCoord && (
          <div className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
            Q: {hoverCoord.xVal.toFixed(1)} | P: ${hoverCoord.yVal.toFixed(1)}
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
          </defs>

          {/* Grid Lines */}
          {layerVisibility.showGrid && (
            <g className="grid-lines" opacity="0.35">
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
            <g className="welfare-areas">
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
                    {/* Base color tint */}
                    <path
                      d={pathString}
                      fill={area.fill}
                      fillOpacity={area.opacity || 0.25}
                      stroke={area.fill}
                      strokeWidth="1"
                      strokeOpacity="0.6"
                    />
                    {/* Pattern overlay for colorblind accessibility */}
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

          {/* Equilibrium Drop Lines */}
          {layerVisibility.showDropLines && (
            <g className="drop-lines">
              {points.map((pt) => {
                if (!pt.showDropLines) return null;
                const sx = scaleX(pt.x);
                const sy = scaleY(pt.y);
                const axisY = svgHeight - padding.bottom;
                const axisX = padding.left;

                return (
                  <g key={`dropline-${pt.id}`} opacity="0.75">
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
                    {/* Value badge on X-axis */}
                    {pt.xLabel && (
                      <text
                        x={sx}
                        y={axisY + 16}
                        textAnchor="middle"
                        className="text-[11px] font-mono font-medium fill-slate-700"
                      >
                        {pt.xLabel}
                      </text>
                    )}
                    {/* Value badge on Y-axis */}
                    {pt.yLabel && (
                      <text
                        x={axisX - 8}
                        y={sy + 4}
                        textAnchor="end"
                        className="text-[11px] font-mono font-medium fill-slate-700"
                      >
                        {pt.yLabel}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* Economic Curves */}
          <g className="economic-curves">
            {curves.map((curve) => {
              if (!curve.visible) return null;
              const pathD = pointsToSvgPath(curve.points);
              const lastPt = curve.points[curve.points.length - 1];

              return (
                <g key={`curve-${curve.id}`}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={curve.color}
                    strokeWidth={curve.strokeWidth || 3}
                    strokeDasharray={curve.strokeDasharray || 'none'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-150"
                  />
                  {/* Curve End Label */}
                  {lastPt && (
                    <g transform={`translate(${scaleX(lastPt.x) + 8}, ${scaleY(lastPt.y) + 4})`}>
                      <rect
                        x="-2"
                        y="-12"
                        width={curve.shortLabel.length * 9 + 8}
                        height="18"
                        rx="4"
                        fill="white"
                        fillOpacity="0.9"
                        stroke={curve.color}
                        strokeWidth="1"
                      />
                      <text
                        x="2"
                        y="1"
                        className="text-[11px] font-bold"
                        fill={curve.color}
                      >
                        {curve.shortLabel}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* Key Coordinate Points (Equilibria, Intersections) */}
          <g className="key-points">
            {points.map((pt) => {
              const sx = scaleX(pt.x);
              const sy = scaleY(pt.y);
              return (
                <g key={`pt-${pt.id}`} className="cursor-pointer group">
                  {/* Outer pulse circle */}
                  <circle
                    cx={sx}
                    cy={sy}
                    r="8"
                    fill={pt.color || '#059669'}
                    fillOpacity="0.2"
                    className="animate-pulse"
                  />
                  {/* Core dot */}
                  <circle
                    cx={sx}
                    cy={sy}
                    r="4.5"
                    fill={pt.color || '#059669'}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  {/* Point Label */}
                  <text
                    x={sx + 8}
                    y={sy - 8}
                    className="text-[12px] font-bold fill-slate-800 select-none filter drop-shadow-sm"
                  >
                    {pt.shortLabel}
                  </text>
                </g>
              );
            })}
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
              x2={svgWidth - padding.right + 16}
              y2={svgHeight - padding.bottom}
              stroke="#334155"
              strokeWidth="2"
              markerEnd="url(#axis-arrow)"
            />

            {/* Y Axis Tick Marks & Numbers */}
            {yTicks.map((y) => (
              <g key={`tick-y-${y}`} transform={`translate(${padding.left}, ${scaleY(y)})`}>
                <line x1="-5" y1="0" x2="0" y2="0" stroke="#334155" strokeWidth="1.5" />
                <text
                  x="-8"
                  y="4"
                  textAnchor="end"
                  className="text-[10px] font-mono fill-slate-500"
                >
                  {axes.yPrefix || ''}{y}{axes.ySuffix || ''}
                </text>
              </g>
            ))}

            {/* X Axis Tick Marks & Numbers */}
            {xTicks.map((x) => (
              <g key={`tick-x-${x}`} transform={`translate(${scaleX(x)}, ${svgHeight - padding.bottom})`}>
                <line x1="0" y1="0" x2="0" y2="5" stroke="#334155" strokeWidth="1.5" />
                <text
                  x="0"
                  y="18"
                  textAnchor="middle"
                  className="text-[10px] font-mono fill-slate-500"
                >
                  {axes.xPrefix || ''}{x}{axes.xSuffix || ''}
                </text>
              </g>
            ))}

            {/* Y Axis Title */}
            <text
              x={padding.left}
              y={padding.top - 20}
              textAnchor="start"
              className="text-xs font-semibold fill-slate-800"
            >
              {tr(axes.yLabel)}
            </text>

            {/* X Axis Title */}
            <text
              x={svgWidth - padding.right + 18}
              y={svgHeight - padding.bottom + 18}
              textAnchor="end"
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
        {curves.map((curve) => (
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
              {area.value !== undefined ? ` (${area.valuePrefix || ''}${area.value})` : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
