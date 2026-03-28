import { Units } from "../types";

type Props = {
  units: Units;
  onChange: (units: Units) => void;
};

function Toggle({
  value,
  options,
  onChange,
}: {
  value: string;
  options: [string, string];
  onChange: (v: string) => void;
}) {
  return (
    <div
      className="flex rounded-full overflow-hidden text-sm"
      style={{ border: "1px solid #D5C5A0", background: "#EDE0C4" }}
    >
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className="px-3 py-1 transition-colors"
          style={{
            background: value === opt ? "#2C1810" : "transparent",
            color: value === opt ? "#F9F3E8" : "#9B7A5A",
            fontFamily: "'Lora', serif",
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function UnitToggle({ units, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <Toggle
        value={units.height}
        options={["cm", "in"]}
        onChange={(v) => onChange({ ...units, height: v as "cm" | "in" })}
      />
      <Toggle
        value={units.weight}
        options={["kg", "lbs"]}
        onChange={(v) => onChange({ ...units, weight: v as "kg" | "lbs" })}
      />
    </div>
  );
}
