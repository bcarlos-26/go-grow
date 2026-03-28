import { useState } from "react";
import { AppState, Kid } from "../types";
import { getCurrentSeason } from "../utils/seasons";
import { SEASONS } from "../constants";
import KidCard from "../components/KidCard";
import UnitToggle from "../components/UnitToggle";
import SeasonPrompt from "../components/SeasonPrompt";
import AddKidModal from "../components/AddKidModal";

type Props = {
  state: AppState;
  onStateChange: (s: AppState) => void;
  onSelectKid: (kid: Kid) => void;
};

export default function HomeScreen({ state, onStateChange, onSelectKid }: Props) {
  const [addKidOpen, setAddKidOpen] = useState(false);
  const [addMeasurementKid, setAddMeasurementKid] = useState<Kid | null>(null);

  const season = getCurrentSeason();
  const { emoji, label } = SEASONS[season];

  function handleAddKid(kid: Kid) {
    onStateChange({ ...state, kids: [...state.kids, kid] });
  }

  return (
    <div className="min-h-screen" style={{ background: "#F9F3E8" }}>
      {/* Header */}
      <div
        className="px-5 pt-12 pb-6"
        style={{
          background: "linear-gradient(180deg, #EDE0C4 0%, #F9F3E8 100%)",
          borderBottom: "1px solid #E5D9BC",
        }}
      >
        <div className="flex items-end justify-between mb-1">
          <h1
            className="text-3xl font-bold italic"
            style={{ color: "#2C1810", fontFamily: "'Playfair Display', serif" }}
          >
            GrowthBook
          </h1>
          <span
            className="text-sm px-3 py-1 rounded-full"
            style={{ background: SEASONS[season].bgTint, color: SEASONS[season].color, fontFamily: "'Lora', serif", border: `1px solid ${SEASONS[season].color}40` }}
          >
            {emoji} {label}
          </span>
        </div>
        <p className="text-sm" style={{ color: "#9B7A5A", fontFamily: "'Lora', serif" }}>
          Like the marks on the doorframe, but on your phone.
        </p>

        {/* Unit toggle */}
        <div className="mt-4">
          <UnitToggle
            units={state.units}
            onChange={(units) => onStateChange({ ...state, units })}
          />
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pt-5 pb-24">
        {/* Season prompt */}
        {state.kids.length > 0 && (
          <SeasonPrompt
            kids={state.kids}
            measurements={state.measurements}
            onAddMeasurement={(kid) => setAddMeasurementKid(kid)}
          />
        )}

        {/* Kids list or empty state */}
        {state.kids.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">📏</div>
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: "#2C1810", fontFamily: "'Playfair Display', serif" }}
            >
              Start tracking
            </h2>
            <p
              className="text-sm max-w-xs"
              style={{ color: "#9B7A5A", fontFamily: "'Lora', serif", lineHeight: "1.6" }}
            >
              Add a child to start recording their height each season. Every mark tells the story.
            </p>
            <button
              onClick={() => setAddKidOpen(true)}
              className="mt-6 px-6 py-3 rounded-xl font-semibold transition-opacity hover:opacity-90"
              style={{ background: "#2C1810", color: "#F9F3E8", fontFamily: "'Playfair Display', serif" }}
            >
              Add your first child
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {state.kids.map((kid) => (
              <KidCard
                key={kid.id}
                kid={kid}
                measurements={state.measurements}
                units={state.units}
                onClick={() => onSelectKid(kid)}
              />
            ))}

            {/* Add child button */}
            <button
              onClick={() => setAddKidOpen(true)}
              className="w-full rounded-2xl py-4 text-center text-sm transition-colors hover:bg-amber-50"
              style={{
                border: "2px dashed #D5C5A0",
                color: "#9B7A5A",
                fontFamily: "'Lora', serif",
              }}
            >
              + Add a child
            </button>
          </div>
        )}
      </div>

      {/* Add Kid Modal */}
      <AddKidModal
        open={addKidOpen}
        onClose={() => setAddKidOpen(false)}
        onAdd={handleAddKid}
      />

      {/* Placeholder — Add Measurement modal attached to season prompt, wired in Phase 2 */}
      {addMeasurementKid && (
        <div
          className="fixed bottom-6 left-5 right-5 rounded-xl px-4 py-3 text-sm text-center"
          style={{ background: addMeasurementKid.color, color: "#fff", fontFamily: "'Lora', serif" }}
        >
          Add measurement for {addMeasurementKid.name} — coming in Phase 2
          <button className="ml-3 underline" onClick={() => setAddMeasurementKid(null)}>dismiss</button>
        </div>
      )}
    </div>
  );
}
