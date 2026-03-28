import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Modal from "./Modal";
import type { Kid } from "../types";
import { KID_COLORS } from "../constants";

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
    setName("");
    setBirthday("");
    setColor(KID_COLORS[0]);
    onClose();
  }

  const inputStyle = {
    background: "#FFFFFF",
    border: "1px solid #D5C5A0",
    borderRadius: "10px",
    padding: "10px 14px",
    fontFamily: "'Lora', serif",
    color: "#2C1810",
    width: "100%",
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
    <Modal open={open} onClose={onClose} title="Add a child">
      <div className="flex flex-col gap-5">
        {/* Name */}
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

        {/* Birthday */}
        <div>
          <label style={labelStyle}>Birthday (optional)</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            max={today}
            min={minBirthdayStr}
            style={inputStyle}
          />
        </div>

        {/* Color */}
        <div>
          <label style={labelStyle}>Colour</label>
          <div className="flex gap-3">
            {KID_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-9 h-9 rounded-full transition-transform"
                style={{
                  background: c,
                  outline: color === c ? `3px solid ${c}` : "none",
                  outlineOffset: "2px",
                  transform: color === c ? "scale(1.1)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm" style={{ color: "#B85020", fontFamily: "'Lora', serif" }}>
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl font-semibold text-base transition-opacity hover:opacity-90"
          style={{ background: "#2C1810", color: "#F9F3E8", fontFamily: "'Playfair Display', serif" }}
        >
          Add {name.trim() || "child"}
        </button>
      </div>
    </Modal>
  );
}
