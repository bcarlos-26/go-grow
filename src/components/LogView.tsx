import { useState } from "react";
import { Kid, Measurement, Units } from "../types";
import { fmtHeight, fmtWeight } from "../utils/units";
import { getSeason, seasonLabel } from "../utils/seasons";
import { ageAt } from "../utils/age";
import { SEASONS } from "../constants";

type Props = {
  kid: Kid;
  measurements: Measurement[];
  units: Units;
  onDelete: (id: string) => void;
  onAddMeasurement: () => void;
};

export default function LogView({ kid, measurements, units, onDelete, onAddMeasurement }: Props) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const sorted = [...measurements].sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-6">
        <div className="text-4xl mb-3">📏</div>
        <p className="text-sm" style={{ color: "#9B7A5A", fontFamily: "'Lora', serif", lineHeight: "1.6" }}>
          No measurements yet. Add the first mark for {kid.name}.
        </p>
        <button
          onClick={onAddMeasurement}
          className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: kid.color, color: "#fff", fontFamily: "'Lora', serif" }}
        >
          + Add measurement
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 pb-6">
      {sorted.map((m) => {
        const season = getSeason(m.date);
        const { emoji, color, bgTint } = SEASONS[season];
        const isConfirming = confirmId === m.id;

        return (
          <div
            key={m.id}
            className="rounded-2xl px-4 py-3"
            style={{ background: bgTint, border: `1px solid ${color}25` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color, fontFamily: "'Lora', serif" }}>
                  {emoji} {seasonLabel(m.date)}
                </p>
                <p className="text-xl font-bold mt-0.5" style={{ color: "#2C1810", fontFamily: "'Playfair Display', serif" }}>
                  {fmtHeight(m.heightCm, units)}
                </p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  {m.weightKg !== null && (
                    <span className="text-sm" style={{ color: "#9B7A5A", fontFamily: "'Lora', serif" }}>
                      {fmtWeight(m.weightKg, units)}
                    </span>
                  )}
                  {kid.birthday && (
                    <span className="text-sm" style={{ color: "#9B7A5A", fontFamily: "'Lora', serif" }}>
                      {ageAt(kid.birthday, m.date)} old
                    </span>
                  )}
                </div>
              </div>

              {/* Delete */}
              <div className="flex-shrink-0 flex items-center pt-0.5">
                {isConfirming ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { onDelete(m.id); setConfirmId(null); }}
                      className="text-xs px-3 py-1 rounded-full"
                      style={{ background: "#B85020", color: "#fff", fontFamily: "'Lora', serif" }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="text-xs px-3 py-1 rounded-full"
                      style={{ background: "#E5D9BC", color: "#9B7A5A", fontFamily: "'Lora', serif" }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmId(m.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm leading-none transition-colors hover:bg-red-50"
                    style={{ color: "#9B7A5A", background: "#E5D9BC" }}
                    aria-label="Delete measurement"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
