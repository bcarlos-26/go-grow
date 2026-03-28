import { useMemo } from "react";
import { Kid, Measurement, Units } from "../types";
import { getSeason } from "../utils/seasons";
import { SEASONS } from "../constants";
import { fmtHeight } from "../utils/units";

type Props = {
  kid: Kid;
  measurements: Measurement[];
  units: Units;
  onAddMeasurement: () => void;
};

// ─── SVG layout constants ────────────────────────────────────────────────────
const SVG_W = 320;
const WOOD_W = 52;          // width of doorframe trim panel
const WALL_X = WOOD_W;      // where the wall begins
const PX_PER_CM = 6;        // vertical scale
const MARK_X1 = WALL_X + 8; // mark line start (leaves a small gap after notch)
const MARK_X2 = SVG_W - 8;  // mark line end
const COL_A_X = WALL_X + 12;  // label column A (left)
const COL_B_X = WALL_X + 142; // label column B (right)
const TICK_MAJOR_X = 34;    // major tick left edge
const TICK_MINOR_X = 42;    // minor tick left edge
const TICK_LABEL_X = 31;    // tick labels right edge (textAnchor=end)

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

// ─── Component ───────────────────────────────────────────────────────────────
export default function WallView({ kid, measurements, units, onAddMeasurement }: Props) {
  const sorted = useMemo(
    () => [...measurements].sort((a, b) => a.date.localeCompare(b.date)),
    [measurements]
  );

  const [dMin, dMax] = useMemo(() => computeRange(sorted), [sorted]);
  const svgH = (dMax - dMin) * PX_PER_CM;

  // Assign label columns based on height-sort index so adjacent marks
  // alternate columns, minimising vertical overlap.
  const colMap = useMemo(() => {
    const byHeight = [...sorted].sort((a, b) => a.heightCm - b.heightCm);
    return new Map<string, "A" | "B">(
      byHeight.map((m, i) => [m.id, i % 2 === 0 ? "A" : "B"])
    );
  }, [sorted]);

  const latestId = sorted.length > 0 ? sorted[sorted.length - 1].id : null;

  // Tick marks: minor every 5cm, major every 10cm
  const ticks = useMemo(() => {
    const out: { cm: number; y: number; major: boolean }[] = [];
    for (let cm = dMin; cm <= dMax; cm += 5) {
      out.push({ cm, y: cmToY(cm, dMin, dMax, svgH), major: cm % 10 === 0 });
    }
    return out;
  }, [dMin, dMax, svgH]);

  // ── Empty state ──────────────────────────────────────────────────────────
  if (sorted.length === 0) {
    const ghostSvgH = (150 - 60) * PX_PER_CM; // 90cm range, 540px
    const ghostY = cmToY(105, 60, 150, ghostSvgH);
    return (
      <div style={{ margin: "0 -20px", position: "relative" }}>
        <svg
          viewBox={`0 0 ${SVG_W} ${ghostSvgH}`}
          width="100%"
          style={{ display: "block", opacity: 0.35 }}
        >
          <WoodPanel svgH={ghostSvgH} />
          <WallPanel svgH={ghostSvgH} />
          <TickLines ticks={[
            ...Array.from({ length: 10 }, (_, i) => {
              const cm = 60 + i * 10;
              return { cm, y: cmToY(cm, 60, 150, ghostSvgH), major: true };
            }),
          ]} units={units} />
          {/* Ghost dashed mark */}
          <line
            x1={MARK_X1} y1={ghostY} x2={MARK_X2} y2={ghostY}
            stroke={kid.color} strokeWidth={2} strokeDasharray="6 4" strokeOpacity={0.6}
          />
        </svg>
        {/* Overlay prompt */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: `${WOOD_W + 16}px`,
            paddingRight: "16px",
          }}
        >
          <div className="text-center">
            <p
              className="text-sm mb-3"
              style={{ color: "#9B7A5A", fontFamily: "'Lora', serif", lineHeight: "1.6" }}
            >
              Add {kid.name}'s first mark — and watch the wall come to life.
            </p>
            <button
              onClick={onAddMeasurement}
              className="px-5 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: kid.color, color: "#fff", fontFamily: "'Lora', serif" }}
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
        <defs>
          <linearGradient id="woodGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#251005" />
            <stop offset="55%"  stopColor="#3D1E0C" />
            <stop offset="100%" stopColor="#4D2810" />
          </linearGradient>
          <linearGradient id="shadowGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#1A0A04" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#1A0A04" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wallGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#EDE0C0" />
            <stop offset="100%" stopColor="#F5EDD8" />
          </linearGradient>
        </defs>

        <WallPanel svgH={svgH} gradient />
        <WoodPanel svgH={svgH} />

        {/* Shadow from trim onto wall */}
        <rect x={WALL_X} y={0} width={22} height={svgH} fill="url(#shadowGrad)" />

        {/* Trim edge */}
        <line x1={WALL_X} y1={0} x2={WALL_X} y2={svgH} stroke="#1A0A04" strokeWidth="2" />

        <TickLines ticks={ticks} units={units} />

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
              {/* Notch triangle on trim edge */}
              <polygon
                points={`${WALL_X},${y - 5} ${WALL_X + 7},${y} ${WALL_X},${y + 5}`}
                fill={kid.color}
                opacity={isLatest ? 1 : 0.55}
              />

              {/* Mark line */}
              <line
                x1={MARK_X1}
                y1={y}
                x2={MARK_X2}
                y2={y}
                stroke={kid.color}
                strokeWidth={isLatest ? 2.5 : 1.5}
                strokeOpacity={isLatest ? 1 : 0.5}
              />

              {/* ↑ Name callout — latest only */}
              {isLatest && (
                <>
                  <text
                    x={labelX}
                    y={y - 18}
                    fontSize={9}
                    fontFamily="Lora, serif"
                    fontWeight="600"
                    fill={kid.color}
                  >
                    ↑ {kid.name}
                  </text>
                  {/* underline accent under callout */}
                  <line
                    x1={labelX}
                    y1={y - 14}
                    x2={labelX + kid.name.length * 5.5 + 14}
                    y2={y - 14}
                    stroke={kid.color}
                    strokeWidth={1}
                    strokeOpacity={0.4}
                  />
                </>
              )}

              {/* Season label */}
              <text
                x={labelX}
                y={y + 10}
                fontSize={8.5}
                fontFamily="Lora, serif"
                fill={sColor}
              >
                {emoji} {sLabel} {year}
              </text>

              {/* Height label */}
              <text
                x={labelX}
                y={y + 21}
                fontSize={isLatest ? 11 : 10}
                fontFamily="Playfair Display, serif"
                fontWeight={isLatest ? "700" : "500"}
                fill="#2C1810"
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

function WallPanel({ svgH, gradient = false }: { svgH: number; gradient?: boolean }) {
  return (
    <rect
      x={WALL_X}
      y={0}
      width={SVG_W - WALL_X}
      height={svgH}
      fill={gradient ? "url(#wallGrad)" : "#F5EDD8"}
    />
  );
}

function WoodPanel({ svgH }: { svgH: number }) {
  return (
    <g>
      {/* Base panel */}
      <rect x={0} y={0} width={WOOD_W} height={svgH} fill="url(#woodGrad)" />
      {/* Grain lines */}
      <line x1={9}  y1={0} x2={9}  y2={svgH} stroke="#6A3010" strokeWidth={1}   strokeOpacity={0.2} />
      <line x1={20} y1={0} x2={20} y2={svgH} stroke="#7A4018" strokeWidth={0.7} strokeOpacity={0.15} />
      <line x1={32} y1={0} x2={32} y2={svgH} stroke="#5A2808" strokeWidth={1}   strokeOpacity={0.18} />
      <line x1={43} y1={0} x2={43} y2={svgH} stroke="#6A3010" strokeWidth={0.7} strokeOpacity={0.12} />
      {/* Right-edge highlight */}
      <line x1={WOOD_W - 2} y1={0} x2={WOOD_W - 2} y2={svgH} stroke="#7A4820" strokeWidth={1} strokeOpacity={0.3} />
    </g>
  );
}

function TickLines({
  ticks,
  units,
}: {
  ticks: { cm: number; y: number; major: boolean }[];
  units: Units;
}) {
  return (
    <g>
      {ticks.map(({ cm, y, major }) => (
        <g key={cm}>
          <line
            x1={major ? TICK_MAJOR_X : TICK_MINOR_X}
            y1={y}
            x2={WALL_X}
            y2={y}
            stroke={major ? "#C8A878" : "#C8A878"}
            strokeWidth={major ? 1.2 : 0.7}
            strokeOpacity={major ? 0.9 : 0.55}
          />
          {major && (
            <text
              x={TICK_LABEL_X}
              y={y + 3.5}
              fontSize={8.5}
              fontFamily="Lora, serif"
              fill="#D4A870"
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
