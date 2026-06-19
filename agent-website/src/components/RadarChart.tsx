"use client";

type RadarPoint = {
  label: string;
  letter: string;
  score: number; // raw score
  industryAvg: number;
  max: number;
};

type RadarChartProps = {
  points: RadarPoint[];
  size?: number;
};

/**
 * Custom SVG radar chart — designed to match the elegant minimal
 * aesthetic. Grid is concentric polygons with thin grey borders, the
 * user's score is filled with the accent red, industry average is
 * dashed grey for comparison.
 */
export function RadarChart({ points, size = 360 }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.36; // leave room for labels
  const levels = 4; // 4 grid rings
  const numAxes = points.length;
  const angleStep = (Math.PI * 2) / numAxes;
  // Start from top (12 o'clock)
  const startAngle = -Math.PI / 2;

  function pointFor(value: number, max: number, axisIndex: number) {
    const r = (value / max) * radius;
    const angle = startAngle + axisIndex * angleStep;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  }

  function axisEnd(axisIndex: number, scale = 1) {
    const angle = startAngle + axisIndex * angleStep;
    return {
      x: cx + radius * scale * Math.cos(angle),
      y: cy + radius * scale * Math.sin(angle),
    };
  }

  function labelPos(axisIndex: number) {
    const angle = startAngle + axisIndex * angleStep;
    const r = radius + 28;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  }

  function polygonPath(values: number[], maxes: number[]) {
    const pts = values.map((v, i) => pointFor(v, maxes[i], i));
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
  }

  const userValues = points.map((p) => p.score);
  const peerValues = points.map((p) => p.industryAvg);
  const maxes = points.map((p) => p.max);

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-auto w-full"
        role="img"
        aria-label="TEAM framework radar chart"
      >
        {/* Concentric grid polygons */}
        {Array.from({ length: levels }).map((_, levelIdx) => {
          const ringFraction = (levelIdx + 1) / levels;
          const ringValues = points.map((p) => p.max * ringFraction);
          return (
            <path
              key={`ring-${levelIdx}`}
              d={polygonPath(ringValues, maxes)}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth={levelIdx === levels - 1 ? 1 : 0.5}
            />
          );
        })}

        {/* Axis spokes */}
        {points.map((_, i) => {
          const end = axisEnd(i);
          return (
            <line
              key={`axis-${i}`}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="#E5E7EB"
              strokeWidth={0.5}
            />
          );
        })}

        {/* Industry average — dashed grey */}
        <path
          d={polygonPath(peerValues, maxes)}
          fill="#9CA3AF"
          fillOpacity={0.08}
          stroke="#9CA3AF"
          strokeWidth={1}
          strokeDasharray="4 3"
        />

        {/* User score — accent red filled polygon */}
        <path
          d={polygonPath(userValues, maxes)}
          fill="#C22C2F"
          fillOpacity={0.12}
          stroke="#C22C2F"
          strokeWidth={1.5}
          className="radar-poly"
        />

        {/* User score points */}
        {userValues.map((v, i) => {
          const p = pointFor(v, maxes[i], i);
          return (
            <circle
              key={`pt-${i}`}
              cx={p.x}
              cy={p.y}
              r={3.5}
              fill="#C22C2F"
              stroke="#FFFFFF"
              strokeWidth={1.5}
              className="radar-dot"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          );
        })}

        {/* Axis labels */}
        {points.map((p, i) => {
          const pos = labelPos(i);
          return (
            <g key={`label-${i}`}>
              <text
                x={pos.x}
                y={pos.y - 6}
                textAnchor="middle"
                className="fill-text font-mono"
                style={{ fontSize: "11px", fontWeight: 600 }}
              >
                {p.letter} — {p.label}
              </text>
              <text
                x={pos.x}
                y={pos.y + 8}
                textAnchor="middle"
                className="fill-text-muted font-mono"
                style={{ fontSize: "10px" }}
              >
                {p.score}/{p.max}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-center gap-5 text-[11px] text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="h-0.5 w-5 bg-accent" />
          <span>Your score</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="h-0.5 w-5"
            style={{
              background:
                "repeating-linear-gradient(90deg, #9CA3AF 0 3px, transparent 3px 6px)",
            }}
          />
          <span>Industry average</span>
        </div>
      </div>
    </div>
  );
}
