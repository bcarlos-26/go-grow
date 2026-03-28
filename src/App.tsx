import { useState, useEffect } from "react";
import { AppState, Kid } from "./types";
import { loadState, saveState } from "./utils/storage";
import HomeScreen from "./screens/HomeScreen";

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // KidScreen will be wired in Phase 2+
  if (selectedKid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#F9F3E8" }}>
        <div className="text-center px-6">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"
            style={{ background: selectedKid.color, fontFamily: "'Playfair Display', serif" }}
          >
            {selectedKid.name[0].toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold italic mb-2" style={{ color: "#2C1810", fontFamily: "'Playfair Display', serif" }}>
            {selectedKid.name}
          </h1>
          <p className="text-sm mb-6" style={{ color: "#9B7A5A", fontFamily: "'Lora', serif" }}>
            Wall view coming in Phase 3.
          </p>
          <button
            onClick={() => setSelectedKid(null)}
            className="px-5 py-2 rounded-xl text-sm"
            style={{ background: "#2C1810", color: "#F9F3E8", fontFamily: "'Lora', serif" }}
          >
            ← Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <HomeScreen
      state={state}
      onStateChange={setState}
      onSelectKid={setSelectedKid}
    />
  );
}
