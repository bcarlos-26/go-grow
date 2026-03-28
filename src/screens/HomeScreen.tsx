import { useState } from "react";
import type { AppState, Kid } from "../types";
import { getCurrentSeason, getSeason } from "../utils/seasons";
import { SEASONS, T } from "../constants";
import { fmtHeight } from "../utils/units";
import AddKidModal from "../components/AddKidModal";

const TITLE_LETTERS = [
  { char: "G", color: "#F5A623" },
  { char: "o", color: "#E91E63" },
  { char: " ", color: "transparent" },
  { char: "G", color: "#2196F3" },
  { char: "r", color: "#4CAF50" },
  { char: "o", color: "#FF5722" },
  { char: "w", color: "#9C27B0" },
];

type Props = {
  state: AppState;
  onStateChange: (s: AppState) => void;
  onSelectKid: (kid: Kid) => void;
  onAddMeasurementForKid: (kid: Kid) => void;
};

export default function HomeScreen({ state, onStateChange, onSelectKid, onAddMeasurementForKid }: Props) {
  const [addKidOpen, setAddKidOpen] = useState(false);

  const currentSeason = getCurrentSeason();
  const currentYear = new Date().getFullYear();
  const { emoji, color: sColor, bgTint } = SEASONS[currentSeason];

  const kidsNeedingMeasurement = state.kids.filter((kid) => {
    const latest = state.measurements
      .filter((m) => m.kidId === kid.id)
      .sort((a, b) => b.date.localeCompare(a.date))[0];
    if (!latest) return true;
    return getSeason(latest.date) !== currentSeason || new Date(latest.date).getFullYear() !== currentYear;
  });

  function handleAddKid(kid: Kid) {
    onStateChange({ ...state, kids: [...state.kids, kid] });
  }

  return (
    <div style={{ background: T.bg, minHeight: "100svh", paddingBottom: 100 }}>
      {/* Title area */}
      <div style={{ paddingTop: "25vh", paddingLeft: 24, paddingRight: 24 }}>
        {/* Go Grow title */}
        <div style={{ display: "flex", alignItems: "baseline", flexWrap: "nowrap", whiteSpace: "nowrap", marginBottom: 8 }}>
          {TITLE_LETTERS.map((l, i) =>
            l.char === " " ? (
              <span key={i} style={{ width: 14, display: "inline-block" }} />
            ) : (
              <span
                key={i}
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                  fontWeight: 600,
                  fontSize: "min(72px, 18vw)",
                  color: l.color,
                  lineHeight: 1,
                }}
              >
                {l.char}
              </span>
            )
          )}
        </div>

        {/* Subtitle */}
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 17, color: T.textMd, margin: "0 0 32px" }}>
          Record your child's growth over time
        </p>

        {/* Season nudge pills */}
        {kidsNeedingMeasurement.length > 0 && (
          <div style={{ marginBottom: 28, display: "flex", flexDirection: "column", gap: 8 }}>
            {kidsNeedingMeasurement.map((kid) => (
              <button
                key={kid.id}
                onClick={() => onAddMeasurementForKid(kid)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: bgTint,
                  border: `1px solid ${sColor}40`,
                  borderRadius: 10,
                  padding: "10px 14px",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: sColor, flexShrink: 0, display: "inline-block" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: sColor, fontWeight: 500 }}>
                  {emoji} Time to measure {kid.name}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Children list */}
        {state.kids.length > 0 && (
          <div style={{ borderTop: `1px solid ${T.border}` }}>
            {state.kids.map((kid) => {
              const kidMs = state.measurements
                .filter((m) => m.kidId === kid.id)
                .sort((a, b) => b.date.localeCompare(a.date));
              const latest = kidMs[0];
              const needsMeasure = kidsNeedingMeasurement.some((k) => k.id === kid.id);

              return (
                <button
                  key={kid.id}
                  onClick={() => onSelectKid(kid)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 0",
                    borderBottom: `1px solid ${T.border}`,
                    background: "transparent",
                    border: "none",
                    borderBottomColor: T.border,
                    borderBottomWidth: 1,
                    borderBottomStyle: "solid",
                    width: "100%",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 11,
                      background: kid.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: 18,
                      color: "#fff",
                    }}
                  >
                    {kid.name[0].toUpperCase()}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, color: T.text }}>
                        {kid.name}
                      </span>
                      {needsMeasure && (
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, color: sColor, background: bgTint, border: `1px solid ${sColor}40`, borderRadius: 6, padding: "2px 7px" }}>
                          measure now
                        </span>
                      )}
                    </div>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.textSm }}>
                      {kidMs.length} {kidMs.length === 1 ? "mark" : "marks"}
                      {latest ? ` · ${fmtHeight(latest.heightCm, state.units)}` : ""}
                    </span>
                  </div>

                  <span style={{ color: T.textSm, fontSize: 20, lineHeight: 1 }}>›</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Fixed bottom CTA */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 480,
          background: `linear-gradient(to top, ${T.bg} 60%, transparent)`,
          paddingTop: 24,
          paddingBottom: 24,
          paddingLeft: 20,
          paddingRight: 20,
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <button
          onClick={() => setAddKidOpen(true)}
          style={{
            pointerEvents: "auto",
            width: "100%",
            background: "#2196F3",
            color: "#fff",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            borderRadius: 14,
            padding: "14px 0",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add Your Child
        </button>
      </div>

      <AddKidModal open={addKidOpen} onClose={() => setAddKidOpen(false)} onAdd={handleAddKid} />
    </div>
  );
}
