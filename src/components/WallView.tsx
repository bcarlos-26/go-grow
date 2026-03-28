import { useMemo } from "react";
import type { Kid, Measurement, Units } from "../types";
import { getSeason } from "../utils/seasons";
import { SEASONS, T } from "../constants";
import { fmtHeight } from "../utils/units";

type Props = {
  kid: Kid;
  measurements: Measurement[];
  units: Units;
  onAddMeasurement: () => void;
};

// ─── Layout ──────────────────────────────────────────────────────────────────
const SVG_W    = 320;
const RULER_W  = 56;
const WALL_X   = RULER_W;
const PX_PER_CM = 6;
const MARK_X1  = RULER_W + 4;
const MARK_X2  = SVG_W - 6;
const COL_A_X  = RULER_W + 10;
const COL_B_X  = RULER_W + 144;
const TICK_LABEL_X = RULER_W - 8; // right-aligned inside ruler

// ─── Helpers ─────────────────────────────────────────────────────────────────
function computeRange(ms: Measurement[]): [number, number] {
  if (ms.length === 0) return [60, 150];
  const heights = ms.map((m) => m.heightCm);
  const lo = Math.min(...heights);
  const hi = Math.max(...heights);
  const pad = ms.length === 1 ? 32 : 26;
  const dMin = Math.max(20, Math.floor((lo - pad) / 10) * 10);
  const dMax = Math.ceil((hi + pad) / 10) * 10;
  return [dMin, dMax];
}

function cmToY(cm: number, dMin: number, dMax: number, svgH: number): number {
  return ((dMax - cm) / (dMax - dMin)) * svgH;
}

function tickLabel(cm: number, units: Units): string {
  if (units.height === "cm") return `${cm}`;
  const totalIn = cm / 2.54;
  const ft = Math.floor(totalIn / 12);
  const inches = Math.round(totalIn % 12);
  if (ft === 0) return `${Math.round(totalIn)}″`;
  if (inches === 0) return `${ft}′`;
  return `${ft}′${inches}″`;
}

// Rounded-left rect path (top-left + bottom-left corners only)
function rulerPath(w: number, h: number, r: number): string {
  return `M${r},0 L${w},0 L${w},${h} L${r},${h} Q0,${h} 0,${h - r} L0,${r} Q0,0 ${r},0 Z`;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function WallView({ kid, measurements, units, onAddMeasurement }: Props) {
  const sorted = useMemo(
    () => [...measurements].sort((a, b) => a.date.localeCompare(b.date)),
    [measurements]
  );

  const [dMin, dMax] = useMemo(() => computeRange(sorted), [sorted]);
  const svgH = (dMax - dMin) * PX_PER_CM;

  // Column assignment: adjacent heights alternate columns
  const colMap = useMemo(() => {
    const byHeight = [...sorted].sort((a, b) => a.heightCm - b.heightCm);
    return new Map<string, "A" | "B">(
      byHeight.map((m, i) => [m.id, i % 2 === 0 ? "A" : "B"])
    );
  }, [sorted]);

  const latestId = sorted.length > 0 ? sorted[sorted.length - 1].id : null;

  const ticks = useMemo(() => {
    const out: { cm: number; y: number; major: boolean }[] = [];
    for (let cm = dMin; cm <= dMax; cm += 5) {
      out.push({ cm, y: cmToY(cm, dMin, dMax, svgH), major: cm % 10 === 0 });
    }
    return out;
  }, [dMin, dMax, svgH]);

  const unitLabel = units.height === "cm" ? "cm" : "in";

  // ── Empty state ──────────────────────────────────────────────────────────
  if (sorted.length === 0) {
    const ghostH = 90 * PX_PER_CM;
    const ghostY = cmToY(105, 60, 150, ghostH);
    const ghostTicks = Array.from({ length: 10 }, (_, i) => ({
      cm: 60 + i * 10,
      y: cmToY(60 + i * 10, 60, 150, ghostH),
      major: true,
    }));
    return (
      <div style={{ margin: "0 -20px", position: "relative" }}>
        <svg viewBox={`0 0 ${SVG_W} ${ghostH}`} width="100%" style={{ display: "block", opacity: 0.22 }}>
          <RulerCol svgH={ghostH} ticks={ghostTicks} units={units} />
          <WallSurface svgH={ghostH} ticks={ghostTicks} />
          <line x1={MARK_X1} y1={ghostY} x2={MARK_X2} y2={ghostY} stroke={kid.color} strokeWidth={2} strokeDasharray="6 4" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: RULER_W + 16, paddingRight: 16 }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.textMd, lineHeight: 1.6, marginBottom: 14 }}>
              Add {kid.name}'s first mark and watch the wall come to life.
            </p>
            <button
              onClick={onAddMeasurement}
              style={{ background: kid.color, color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, borderRadius: 10, padding: "10px 20px", border: "none", cursor: "pointer" }}
            >
              + Add first mark
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Full wall ────────────────────────────────────────────────────────────
  return (
    <div className="wall-fade-in" style={{ margin: "0 -20px" }}>
      <svg
        viewBox={`0 0 ${SVG_W} ${svgH}`}
        width="100%"
        style={{ display: "block" }}
        aria-label={`Height wall for ${kid.name}`}
      >
        <WallSurface svgH={svgH} ticks={ticks} />
        <RulerCol svgH={svgH} ticks={ticks} units={units} />

        {/* Unit label at bottom of ruler */}
        <text x={RULER_W / 2} y={svgH - 8} fontSize={8} fontFamily="DM Sans, sans-serif" fill="#888" textAnchor="middle">
          {unitLabel}
        </text>

        {/* Measurement marks */}
        {sorted.map((m) => {
          const y = cmToY(m.heightCm, dMin, dMax, svgH);
          const isLatest = m.id === latestId;
          const col = colMap.get(m.id) ?? "A";
          const labelX = col === "A" ? COL_A_X : COL_B_X;
          const season = getSeason(m.date);
          const { emoji, color: sColor, label: sLabel } = SEASONS[season];
          const year = new Date(m.date).getFullYear();

          return (
            <g key={m.id}>
              {/* Notch cut into ruler right edge */}
              <polygon
                points={`${RULER_W},${y - 5} ${RULER_W - 9},${y} ${RULER_W},${y + 5}`}
                fill={sColor}
              />

              {/* Mark line across wall */}
              <line
                x1={MARK_X1}
                y1={y}
                x2={MARK_X2}
                y2={y}
                stroke={sColor}
                strokeWidth={isLatest ? 2.5 : 1.5}
                strokeOpacity={isLatest ? 1 : 0.6}
              />

              {/* ↑ Name — latest only */}
              {isLatest && (
                <text
                  x={labelX}
                  y={y - 18}
                  fontSize={9}
                  fontFamily="DM Sans, sans-serif"
                  fontWeight="600"
                  fill={sColor}
                >
                  ↑ {kid.name}
                </text>
              )}

              {/* Season label */}
              <text
                x={labelX}
                y={y + 10}
                fontSize={8.5}
                fontFamily="DM Sans, sans-serif"
                fill={sColor}
              >
                {emoji} {sLabel} {year}
              </text>

              {/* Height value */}
              <text
                x={labelX}
                y={y + 21}
                fontSize={isLatest ? 11 : 10}
                fontFamily="DM Sans, sans-serif"
                fontWeight={isLatest ? "700" : "500"}
                fill="#111"
              >
                {fmtHeight(m.heightCm, units)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function WallSurface({
  svgH,
  ticks,
}: {
  svgH: number;
  ticks: { cm: number; y: number; major: boolean }[];
}) {
  return (
    <g>
      {/* White wall */}
      <rect x={WALL_X} y={0} width={SVG_W - WALL_X} height={svgH} fill="#FFFFFF" />
      {/* Faint grid lines at major ticks */}
      {ticks
        .filter((t) => t.major)
        .map(({ cm, y }) => (
          <line key={cm} x1={WALL_X} y1={y} x2={SVG_W} y2={y} stroke="#EBEBEB" strokeWidth={0.6} />
        ))}
    </g>
  );
}

function RulerCol({
  svgH,
  ticks,
  units,
}: {
  svgH: number;
  ticks: { cm: number; y: number; major: boolean }[];
  units: Units;
}) {
  return (
    <g>
      {/* Black ruler with rounded left corners */}
      <path d={rulerPath(RULER_W, svgH, 10)} fill="#111111" />

      {/* Tick marks */}
      {ticks.map(({ cm, y, major }) => (
        <g key={cm}>
          <line
            x1={major ? RULER_W - 14 : RULER_W - 7}
            y1={y}
            x2={RULER_W}
            y2={y}
            stroke="#FFFFFF"
            strokeWidth={major ? 1.2 : 0.7}
            strokeOpacity={major ? 0.8 : 0.4}
          />
          {major && (
            <text
              x={TICK_LABEL_X - 2}
              y={y + 3.5}
              fontSize={8}
              fontFamily="DM Sans, sans-serif"
              fill="#FFFFFF"
              fillOpacity={0.75}
              textAnchor="end"
            >
              {tickLabel(cm, units)}
            </text>
          )}
        </g>
      ))}
    </g>
  );
}
