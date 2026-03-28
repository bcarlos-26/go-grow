import { useState, useEffect } from "react";
import { AppState, Kid } from "./types";
import { loadState, saveState } from "./utils/storage";
import HomeScreen from "./screens/HomeScreen";
import KidScreen from "./screens/KidScreen";

type View =
  | { screen: "home" }
  | { screen: "kid"; kid: Kid; openAdd?: boolean };

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [view, setView] = useState<View>({ screen: "home" });

  useEffect(() => {
    saveState(state);
  }, [state]);

  if (view.screen === "kid") {
    return (
      <KidScreen
        kid={view.kid}
        state={state}
        onStateChange={setState}
        onBack={() => setView({ screen: "home" })}
        initialTab={view.openAdd ? "log" : "log"}
      />
    );
  }

  return (
    <HomeScreen
      state={state}
      onStateChange={setState}
      onSelectKid={(kid) => setView({ screen: "kid", kid })}
      onAddMeasurementForKid={(kid) => setView({ screen: "kid", kid, openAdd: true })}
    />
  );
}
