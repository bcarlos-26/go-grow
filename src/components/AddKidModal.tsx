import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Modal from "./Modal";
import type { Kid } from "../types";
import { KID_COLORS, T } from "../constants";

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (kid: Kid) => void;
};

export default function AddKidModal({ open, onClose, onAdd }: Props) {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [color, setColor] = useState(KID_COLORS[0]);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const minBirthday = new Date();
  minBirthday.setFullYear(minBirthday.getFullYear() - 20);
  const minBirthdayStr = minBirthday.toISOString().split("T")[0];

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) { setError("Name is required."); return; }
    if (birthday && (birthday > today || birthday < minBirthdayStr)) {
      setError("Birthday must be within the last 20 years.");
      return;
    }
    setError("");
    onAdd({
      id: uuidv4(),
      name: trimmed,
      birthday: birthday || null,
      color,
      createdAt: new Date().toISOString(),
    });
    setName(""); setBirthday(""); setColor(KID_COLORS[0]);
    onClose();
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
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
    <Modal open={open} onClose={onClose} title="Add a child">
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label style={labelStyle}>Name</label>
          <input
            type="text"
            placeholder="e.g. Sofia"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
            autoFocus
          />
        </div>

        <div>
          <label style={labelStyle}>Birthday <span style={{ color: T.textSm, fontWeight: 400 }}>(optional)</span></label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            max={today}
            min={minBirthdayStr}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Colour</label>
          <div style={{ display: "flex", gap: 12 }}>
            {KID_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: c,
                  border: "none",
                  cursor: "pointer",
                  outline: color === c ? `3px solid ${c}` : "none",
                  outlineOffset: 2,
                  transform: color === c ? "scale(1.15)" : "scale(1)",
                  transition: "transform 0.15s",
                }}
              />
            ))}
          </div>
        </div>

        {error && (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#C2410C", margin: 0 }}>
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            background: T.text,
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
          Add {name.trim() || "child"}
        </button>
      </div>
    </Modal>
  );
}
