export const STORAGE_KEY = "growthbook-v1";

export const KID_COLORS = [
  "#E07B6A", // terracotta
  "#5A9E5A", // sage green
  "#3A78C2", // slate blue
  "#CC8800", // amber
  "#8B6BAE", // dusty violet
  "#C45C8A", // rose
];

export type Season = "spring" | "summer" | "fall" | "winter";

export const SEASONS: Record<
  Season,
  { label: string; emoji: string; color: string; bgTint: string }
> = {
  spring: { label: "Spring", emoji: "🌸", color: "#5A9E5A", bgTint: "#EFF8EF" },
  summer: { label: "Summer", emoji: "☀️", color: "#CC8800", bgTint: "#FEF8EC" },
  fall:   { label: "Fall",   emoji: "🍂", color: "#B85020", bgTint: "#FDF0E8" },
  winter: { label: "Winter", emoji: "❄️", color: "#3A78C2", bgTint: "#EDF3FC" },
};

export const PALETTE = {
  bg: "#F9F3E8",
  surface: "#FFFFFF",
  border: "#E5D9BC",
  borderStrong: "#D5C5A0",
  textPrimary: "#2C1810",
  textSecondary: "#9B7A5A",
};
