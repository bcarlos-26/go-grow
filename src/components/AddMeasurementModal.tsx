import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Modal from "./Modal";
import type { Kid, Measurement, Units } from "../types";
import { getSeason, seasonLabel } from "../utils/seasons";
import { SEASONS, T } from "../constants";
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
  const { emoji, color: seasonColor, bgTint } = SEASONS[season];

  function validate(): number | null {
    let cm: number;
    if (units.height === "cm") {
      cm = parseFloat(heightCm);
      if (isNaN(cm) || cm < 30 || cm > 250) { setError("Height must be between 30 and 250 cm."); return null; }
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      if (ft === 0 && inches === 0) { setError("Height is required."); return null; }
      cm = cmFromInput("", units, heightFt, heightIn);
      if (cm < 30 || cm > 250) { setError("Height must be between 1′ and 8′."); return null; }
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
    setDate(today); setHeightCm(""); setHeightFt(""); setHeightIn(""); setWeight("");
    onClose();
  }

  const inputStyle: React.CSSProperties = {
    background: T.surface,
    border: `1px solid ${T.borderMd}`,
    borderRadius: 10,
    padding: "11px 14px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 15,
    color: T.text,
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 500,
    color: T.textMd,
    marginBottom: 7,
  };

  return (
    <Modal open={open} onClose={onClose} title="Add measurement">
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Season pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: bgTint,
            border: `1px solid ${seasonColor}40`,
            borderRadius: 10,
            padding: "8px 14px",
            alignSelf: "flex-start",
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: seasonColor }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: seasonColor }}>
            {emoji} {seasonLabel(date || today)}
          </span>
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
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="number"
                placeholder="e.g. 95"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
                inputMode="decimal"
              />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.textSm }}>cm</span>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="number" placeholder="ft" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} style={{ ...inputStyle, width: 72 }} inputMode="numeric" />
              <span style={{ color: T.textSm }}>′</span>
              <input type="number" placeholder="in" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} style={{ ...inputStyle, width: 72 }} inputMode="decimal" />
              <span style={{ color: T.textSm }}>″</span>
            </div>
          )}
        </div>

        {/* Weight */}
        <div>
          <label style={labelStyle}>
            Weight <span style={{ color: T.textSm, fontWeight: 400 }}>(optional)</span>
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="number"
              placeholder={units.weight === "kg" ? "e.g. 15.2" : "e.g. 33.5"}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
              inputMode="decimal"
            />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.textSm }}>{units.weight}</span>
          </div>
        </div>

        {error && (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#C2410C", margin: 0 }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            background: kid.color,
            color: "#fff",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            borderRadius: 12,
            padding: "14px 0",
            border: "none",
            cursor: "pointer",
          }}
        >
          Save mark
        </button>
      </div>
    </Modal>
  );
}
