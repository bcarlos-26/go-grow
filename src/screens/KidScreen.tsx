import { useState } from "react";
import { AppState, Kid, Measurement } from "../types";
import { fmtHeight } from "../utils/units";
import AddMeasurementModal from "../components/AddMeasurementModal";
import LogView from "../components/LogView";
import WallView from "../components/WallView";

type Tab = "wall" | "log";

type Props = {
  kid: Kid;
  state: AppState;
  onStateChange: (s: AppState) => void;
  onBack: () => void;
  initialTab?: Tab;
};

export default function KidScreen({ kid, state, onStateChange, onBack, initialTab = "wall" }: Props) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [addOpen, setAddOpen] = useState(false);

  const kidMeasurements = state.measurements.filter((m) => m.kidId === kid.id);
  const latest = [...kidMeasurements].sort((a, b) => b.date.localeCompare(a.date))[0];

  function handleAddMeasurement(m: Measurement) {
    onStateChange({ ...state, measurements: [...state.measurements, m] });
  }

  function handleDelete(id: string) {
    onStateChange({ ...state, measurements: state.measurements.filter((m) => m.id !== id) });
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "wall", label: "Wall" },
    { id: "log", label: "Log" },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F9F3E8" }}>
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5 flex-shrink-0"
        style={{
          background: "linear-gradient(180deg, #EDE0C4 0%, #F9F3E8 100%)",
          borderBottom: "1px solid #E5D9BC",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-amber-100"
            style={{ background: "#E5D9BC", color: "#2C1810" }}
            aria-label="Back"
          >
            ←
          </button>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold"
            style={{ background: kid.color, fontFamily: "'Playfair Display', serif" }}
          >
            {kid.name[0].toUpperCase()}
          </div>
          <h1
            className="text-2xl font-bold italic flex-1"
            style={{ color: "#2C1810", fontFamily: "'Playfair Display', serif" }}
          >
            {kid.name}
          </h1>
          <button
            onClick={() => setAddOpen(true)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: kid.color, color: "#fff", fontFamily: "'Lora', serif" }}
          >
            + Mark
          </button>
        </div>

        {/* Stats row */}
        {latest && (
          <div className="flex gap-4">
            <div>
              <p className="text-xs" style={{ color: "#9B7A5A", fontFamily: "'Lora', serif" }}>Latest height</p>
              <p className="text-base font-semibold" style={{ color: "#2C1810", fontFamily: "'Playfair Display', serif" }}>
                {fmtHeight(latest.heightCm, state.units)}
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: "#9B7A5A", fontFamily: "'Lora', serif" }}>Marks</p>
              <p className="text-base font-semibold" style={{ color: "#2C1810", fontFamily: "'Playfair Display', serif" }}>
                {kidMeasurements.length}
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mt-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-4 py-2 rounded-full text-sm transition-colors"
              style={{
                background: tab === t.id ? "#2C1810" : "transparent",
                color: tab === t.id ? "#F9F3E8" : "#9B7A5A",
                fontFamily: "'Lora', serif",
                border: tab === t.id ? "none" : "1px solid #D5C5A0",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className={`flex-1 overflow-y-auto ${tab === "wall" ? "pt-4" : "px-5 pt-5"}`}>
        {tab === "wall" && (
          <WallView
            kid={kid}
            measurements={kidMeasurements}
            units={state.units}
            onAddMeasurement={() => setAddOpen(true)}
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

      {/* Add Measurement Modal */}
      <AddMeasurementModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        kid={kid}
        units={state.units}
        onAdd={handleAddMeasurement}
      />
    </div>
  );
}
