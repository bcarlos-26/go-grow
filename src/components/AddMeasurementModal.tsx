import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Modal from "./Modal";
import type { Kid, Measurement, Units } from "../types";
import { getSeason, seasonLabel } from "../utils/seasons";
import { SEASONS } from "../constants";
import { cmFromInput, kgFromInput } from "../utils/units";

type Props = {
  open: boolean;
  onClose: () => void;
  kid: Kid;
  units: Units;
  onAdd: (m: Measurement) => void;
};

export default function AddMeasurementModal({ open, onClose, kid, units, onAdd }: Props) {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");

  const season = getSeason(date || today);
  const { emoji, color, bgTint } = SEASONS[season];

  function validate(): number | null {
    let cm: number;
    if (units.height === "cm") {
      cm = parseFloat(heightCm);
      if (isNaN(cm) || cm < 30 || cm > 250) {
        setError("Height must be between 30 and 250 cm.");
        return null;
      }
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      if (ft === 0 && inches === 0) { setError("Height is required."); return null; }
      cm = cmFromInput("", units, heightFt, heightIn);
      if (cm < 30 || cm > 250) {
        setError("Height must be between 1′ and 8′.");
        return null;
      }
    }
    return cm;
  }

  function handleSubmit() {
    if (!date || date > today) { setError("Date cannot be in the future."); return; }
    const cm = validate();
    if (cm === null) return;

    let weightKg: number | null = null;
    if (weight.trim()) {
      const w = parseFloat(weight);
      if (isNaN(w) || w <= 0) { setError("Enter a valid weight."); return; }
      weightKg = units.weight === "kg" ? w : kgFromInput(weight, units);
      if (weightKg < 0.5 || weightKg > 300) { setError("Weight is out of a plausible range."); return; }
    }

    setError("");
    onAdd({
      id: uuidv4(),
      kidId: kid.id,
      date,
      heightCm: Math.round(cm * 10) / 10,
      weightKg,
      createdAt: new Date().toISOString(),
    });

    // Reset
    setDate(today);
    setHeightCm("");
    setHeightFt("");
    setHeightIn("");
    setWeight("");
    onClose();
  }

  const inputStyle = {
    background: "#FFFFFF",
    border: "1px solid #D5C5A0",
    borderRadius: "10px",
    padding: "10px 14px",
    fontFamily: "'Lora', serif",
    color: "#2C1810",
    fontSize: "16px",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontFamily: "'Lora', serif",
    color: "#9B7A5A",
    marginBottom: "6px",
  };

  return (
    <Modal open={open} onClose={onClose} title={`Add measurement`} accentColor={color} accentBg={bgTint}>
      <div className="flex flex-col gap-5">
        {/* Kid + season badge */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold"
            style={{ background: kid.color, fontFamily: "'Playfair Display', serif" }}
          >
            {kid.name[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: "#2C1810", fontFamily: "'Playfair Display', serif" }}>{kid.name}</p>
            <p className="text-xs" style={{ color, fontFamily: "'Lora', serif" }}>{emoji} {seasonLabel(date || today)}</p>
          </div>
        </div>

        {/* Date */}
        <div>
          <label style={labelStyle}>Date</label>
          <input
            type="date"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
            style={{ ...inputStyle, width: "100%" }}
          />
        </div>

        {/* Height */}
        <div>
          <label style={labelStyle}>Height</label>
          {units.height === "cm" ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="e.g. 95"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
                inputMode="decimal"
              />
              <span style={{ color: "#9B7A5A", fontFamily: "'Lora', serif", fontSize: "14px" }}>cm</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="ft"
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
                style={{ ...inputStyle, width: "80px" }}
                inputMode="numeric"
              />
              <span style={{ color: "#9B7A5A", fontFamily: "'Lora', serif" }}>′</span>
              <input
                type="number"
                placeholder="in"
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
                style={{ ...inputStyle, width: "80px" }}
                inputMode="decimal"
              />
              <span style={{ color: "#9B7A5A", fontFamily: "'Lora', serif" }}>″</span>
            </div>
          )}
        </div>

        {/* Weight (optional) */}
        <div>
          <label style={labelStyle}>Weight <span style={{ opacity: 0.6 }}>(optional)</span></label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder={units.weight === "kg" ? "e.g. 15.2" : "e.g. 33.5"}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
              inputMode="decimal"
            />
            <span style={{ color: "#9B7A5A", fontFamily: "'Lora', serif", fontSize: "14px" }}>{units.weight}</span>
          </div>
        </div>

        {error && (
          <p className="text-sm" style={{ color: "#B85020", fontFamily: "'Lora', serif" }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl font-semibold text-base transition-opacity hover:opacity-90"
          style={{ background: kid.color, color: "#fff", fontFamily: "'Playfair Display', serif" }}
        >
          Save mark
        </button>
      </div>
    </Modal>
  );
}
