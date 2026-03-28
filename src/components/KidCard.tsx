import { Kid, Measurement, Units } from "../types";
import { fmtHeight } from "../utils/units";
import { seasonLabel } from "../utils/seasons";

type Props = {
  kid: Kid;
  measurements: Measurement[];
  units: Units;
  onClick: () => void;
};

export default function KidCard({ kid, measurements, units, onClick }: Props) {
  const kidMeasurements = measurements
    .filter((m) => m.kidId === kid.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const latest = kidMeasurements[0];

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl p-4 transition-shadow hover:shadow-md"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E5D9BC",
      }}
    >
      <div className="flex items-center gap-3">
        {/* Color dot */}
        <div
          className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-semibold text-lg"
          style={{ background: kid.color, fontFamily: "'Playfair Display', serif" }}
        >
          {kid.name[0].toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base leading-tight" style={{ color: "#2C1810", fontFamily: "'Playfair Display', serif" }}>
            {kid.name}
          </p>
          {latest ? (
            <p className="text-sm mt-0.5" style={{ color: "#9B7A5A", fontFamily: "'Lora', serif" }}>
              {fmtHeight(latest.heightCm, units)} · {seasonLabel(latest.date)}
            </p>
          ) : (
            <p className="text-sm mt-0.5" style={{ color: "#9B7A5A", fontFamily: "'Lora', serif" }}>
              No measurements yet
            </p>
          )}
        </div>

        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-bold" style={{ color: kid.color, fontFamily: "'Playfair Display', serif" }}>
            {latest ? fmtHeight(latest.heightCm, units) : "—"}
          </p>
          <p className="text-xs" style={{ color: "#9B7A5A", fontFamily: "'Lora', serif" }}>
            {kidMeasurements.length} {kidMeasurements.length === 1 ? "mark" : "marks"}
          </p>
        </div>
      </div>
    </button>
  );
}
