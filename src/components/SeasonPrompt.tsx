import { Kid, Measurement } from "../types";
import { getCurrentSeason, getSeason } from "../utils/seasons";
import { SEASONS } from "../constants";

type Props = {
  kids: Kid[];
  measurements: Measurement[];
  onAddMeasurement: (kid: Kid) => void;
};

export default function SeasonPrompt({ kids, measurements, onAddMeasurement }: Props) {
  const currentSeason = getCurrentSeason();
  const currentYear = new Date().getFullYear();
  const { emoji, label, color, bgTint } = SEASONS[currentSeason];

  const kidsNeedingMeasurement = kids.filter((kid) => {
    const latest = measurements
      .filter((m) => m.kidId === kid.id)
      .sort((a, b) => b.date.localeCompare(a.date))[0];
    if (!latest) return true;
    const s = getSeason(latest.date);
    const y = new Date(latest.date).getFullYear();
    return s !== currentSeason || y !== currentYear;
  });

  if (kidsNeedingMeasurement.length === 0) return null;

  return (
    <div
      className="rounded-xl px-4 py-3 mb-4"
      style={{ background: bgTint, border: `1px solid ${color}30` }}
    >
      <p className="text-sm font-medium mb-2" style={{ color, fontFamily: "'Lora', serif" }}>
        {emoji} {label} measurements
      </p>
      <div className="flex flex-wrap gap-2">
        {kidsNeedingMeasurement.map((kid) => (
          <button
            key={kid.id}
            onClick={() => onAddMeasurement(kid)}
            className="px-3 py-1 rounded-full text-sm transition-opacity hover:opacity-80"
            style={{ background: kid.color, color: "#fff", fontFamily: "'Lora', serif" }}
          >
            + {kid.name}
          </button>
        ))}
      </div>
    </div>
  );
}
