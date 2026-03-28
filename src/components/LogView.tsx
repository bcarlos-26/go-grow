import { useState } from "react";
import type { Kid, Measurement, Units } from "../types";
import { fmtHeight, fmtWeight } from "../utils/units";
import { getSeason, seasonLabel } from "../utils/seasons";
import { ageAt } from "../utils/age";
import { SEASONS, T } from "../constants";

type Props = {
  kid: Kid;
  measurements: Measurement[];
  units: Units;
  onDelete: (id: string) => void;
  onAddMeasurement: () => void;
};

export default function LogView({ kid, measurements, units, onDelete, onAddMeasurement }: Props) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  // Reverse-chron for display; find the earliest ID for the "first" tag
  const sorted = [...measurements].sort((a, b) => b.date.localeCompare(a.date));
  const firstId = sorted.length > 0 ? sorted[sorted.length - 1].id : null;

  if (sorted.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.textMd, lineHeight: 1.6, marginBottom: 16 }}>
          No measurements yet. Add the first mark for {kid.name}.
        </p>
        <button
          onClick={onAddMeasurement}
          style={{ background: kid.color, color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, borderRadius: 10, padding: "10px 20px", border: "none", cursor: "pointer" }}
        >
          + Add measurement
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {sorted.map((m) => {
        const season = getSeason(m.date);
        const { emoji, color: sColor, bgTint } = SEASONS[season];
        const isConfirming = confirmId === m.id;
        const isFirst = m.id === firstId;

        return (
          <div
            key={m.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              padding: "14px 0",
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            {/* Season icon square */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: bgTint,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {emoji}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, color: T.text }}>
                  {fmtHeight(m.heightCm, units)}
                </span>
                {isFirst && (
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, color: sColor, background: bgTint, border: `1px solid ${sColor}40`, borderRadius: 6, padding: "1px 7px" }}>
                    first
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: sColor, fontWeight: 500 }}>
                  {seasonLabel(m.date)}
                </span>
                {m.weightKg !== null && (
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.textSm }}>
                    {fmtWeight(m.weightKg, units)}
                  </span>
                )}
                {kid.birthday && (
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.textSm }}>
                    {ageAt(kid.birthday, m.date)} old
                  </span>
                )}
              </div>
            </div>

            {/* Delete */}
            <div style={{ flexShrink: 0 }}>
              {isConfirming ? (
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => { onDelete(m.id); setConfirmId(null); }}
                    style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: "#fff", background: "#C2410C", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.textMd, background: T.border, border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmId(m.id)}
                  style={{ width: 28, height: 28, borderRadius: "50%", background: T.border, border: "none", color: T.textSm, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  aria-label="Delete measurement"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
