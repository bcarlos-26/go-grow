import { useState, useMemo } from "react";
import type { AppState, Kid, Measurement } from "../types";
import { fmtHeight } from "../utils/units";
import AddMeasurementModal from "../components/AddMeasurementModal";
import LogView from "../components/LogView";
import WallView from "../components/WallView";
import GrowthChart from "../components/GrowthChart";
import { T } from "../constants";

type Tab = "wall" | "growth" | "log";

type Props = {
  kid: Kid;
  state: AppState;
  onStateChange: (s: AppState) => void;
  onBack: () => void;
  autoOpenAdd?: boolean;
};

export default function KidScreen({ kid, state, onStateChange, onBack, autoOpenAdd = false }: Props) {
  const [tab, setTab] = useState<Tab>("wall");
  const [addOpen, setAddOpen] = useState(autoOpenAdd);

  const kidMeasurements = state.measurements.filter((m) => m.kidId === kid.id);

  const sorted = useMemo(
    () => [...kidMeasurements].sort((a, b) => a.date.localeCompare(b.date)),
    [kidMeasurements]
  );

  const latest = sorted[sorted.length - 1] ?? null;
  const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null;

  const delta = previous && latest ? latest.heightCm - previous.heightCm : null;
  const deltaFmt = delta !== null
    ? state.units.height === "cm"
      ? `+${Math.round(delta)} cm`
      : `+${(delta / 2.54).toFixed(1)}″`
    : null;

  function handleAdd(m: Measurement) {
    onStateChange({ ...state, measurements: [...state.measurements, m] });
  }

  function handleDelete(id: string) {
    onStateChange({ ...state, measurements: state.measurements.filter((m) => m.id !== id) });
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "wall", label: "Wall" },
    { id: "growth", label: "Growth" },
    { id: "log", label: "Log" },
  ];

  return (
    <div style={{ background: T.bg, minHeight: "100svh", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ paddingTop: 52, paddingLeft: 20, paddingRight: 20, background: T.bg }}>
        {/* Back */}
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.textSm, cursor: "pointer", padding: "0 0 18px", display: "flex", alignItems: "center", gap: 4 }}
        >
          ← All children
        </button>

        {/* Kid row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: kid.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            {kid.name[0].toUpperCase()}
          </div>
          <div>
            <h1
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 600,
                fontSize: 30,
                color: T.text,
                margin: "0 0 4px",
                lineHeight: 1,
              }}
            >
              {kid.name}
            </h1>
            {latest && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: T.textMd }}>
                  {fmtHeight(latest.heightCm, state.units)}
                </span>
                {deltaFmt && (
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#2D8653",
                      background: "#EBF7F0",
                      borderRadius: 6,
                      padding: "2px 8px",
                    }}
                  >
                    {deltaFmt}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            marginLeft: -20,
            marginRight: -20,
            paddingLeft: 20,
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: "none",
                border: "none",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: tab === t.id ? 600 : 400,
                color: tab === t.id ? T.text : T.textSm,
                padding: "10px 16px",
                cursor: "pointer",
                position: "relative",
              }}
            >
              {t.label}
              {tab === t.id && (
                <span
                  style={{
                    position: "absolute",
                    bottom: -1,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: kid.color,
                    borderRadius: 2,
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          ...(tab === "wall"
            ? { paddingBottom: 100 }
            : { padding: "20px 20px 100px" }
          ),
        }}
      >
        {tab === "wall" && (
          <WallView
            kid={kid}
            measurements={kidMeasurements}
            units={state.units}
            onAddMeasurement={() => setAddOpen(true)}
          />
        )}
        {tab === "growth" && (
          <GrowthChart
            kid={kid}
            measurements={sorted}
            units={state.units}
          />
        )}
        {tab === "log" && (
          <LogView
            kid={kid}
            measurements={kidMeasurements}
            units={state.units}
            onDelete={handleDelete}
            onAddMeasurement={() => setAddOpen(true)}
          />
        )}
      </div>

      {/* Fixed bottom measure button */}
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
          onClick={() => setAddOpen(true)}
          style={{
            pointerEvents: "auto",
            width: "100%",
            background: kid.color,
            color: "#fff",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            borderRadius: 14,
            padding: "14px 0",
            border: "none",
            cursor: "pointer",
            boxShadow: `0 4px 20px ${kid.color}50`,
          }}
        >
          Measure {kid.name}
        </button>
      </div>

      <AddMeasurementModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        kid={kid}
        units={state.units}
        onAdd={handleAdd}
      />
    </div>
  );
}
