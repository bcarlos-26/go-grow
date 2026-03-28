import { SEASONS } from "../constants"
import type { Season } from "../constants";

export function getSeason(isoDate: string): Season {
  const month = new Date(isoDate).getMonth(); // 0-indexed
  if ([2, 3, 4].includes(month)) return "spring";
  if ([5, 6, 7].includes(month)) return "summer";
  if ([8, 9, 10].includes(month)) return "fall";
  return "winter";
}

export function getCurrentSeason(): Season {
  return getSeason(new Date().toISOString());
}

export function seasonLabel(isoDate: string): string {
  const s = getSeason(isoDate);
  const year = new Date(isoDate).getFullYear();
  return `${SEASONS[s].emoji} ${SEASONS[s].label} ${year}`;
}
