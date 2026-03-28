import type { AppState } from "../types";
import { STORAGE_KEY } from "../constants";

const DEFAULT_STATE: AppState = {
  kids: [],
  measurements: [],
  units: { height: "cm", weight: "kg" },
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
