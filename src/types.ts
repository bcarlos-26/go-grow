export type Kid = {
  id: string;
  name: string;
  birthday: string | null; // ISO date "YYYY-MM-DD"
  color: string; // hex
  createdAt: string; // ISO timestamp
};

export type Measurement = {
  id: string;
  kidId: string;
  date: string; // ISO date "YYYY-MM-DD"
  heightCm: number;
  weightKg: number | null;
  createdAt: string;
};

export type Units = {
  height: "cm" | "in";
  weight: "kg" | "lbs";
};

export type AppState = {
  kids: Kid[];
  measurements: Measurement[];
  units: Units;
};
