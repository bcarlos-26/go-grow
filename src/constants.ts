export const STORAGE_KEY = "go-grow-v1";

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
  spring: { label: "Spring", emoji: "🌸", color: "#2D8653", bgTint: "#EBF7F0" },
  summer: { label: "Summer", emoji: "☀️", color: "#D97706", bgTint: "#FEF3C7" },
  fall:   { label: "Fall",   emoji: "🍂", color: "#C2410C", bgTint: "#FEE8DF" },
  winter: { label: "Winter", emoji: "❄️", color: "#2563EB", bgTint: "#EFF6FF" },
};

export const T = {
  bg:       "#FAFAFA",
  surface:  "#FFFFFF",
  border:   "#EBEBEB",
  borderMd: "#E0E0E0",
  text:     "#111111",
  textMd:   "#555555",
  textSm:   "#999999",
};
