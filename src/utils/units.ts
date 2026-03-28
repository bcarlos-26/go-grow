import type { Units } from "../types";

export function fmtHeight(cm: number, units: Units): string {
  if (units.height === "cm") return `${Math.round(cm)} cm`;
  const inchesTotal = cm / 2.54;
  const feet = Math.floor(inchesTotal / 12);
  const inches = Math.round(inchesTotal % 12);
  if (feet === 0) return `${Math.round(inchesTotal)}″`;
  return `${feet}′ ${inches}″`;
}

export function fmtWeight(kg: number, units: Units): string {
  if (units.weight === "kg") return `${kg.toFixed(1)} kg`;
  return `${(kg * 2.205).toFixed(1)} lbs`;
}

export function cmFromInput(
  value: string,
  units: Units,
  feet?: string,
  inches?: string
): number {
  if (units.height === "cm") return parseFloat(value);
  const f = parseFloat(feet || "0") || 0;
  const i = parseFloat(inches || "0") || 0;
  return (f * 12 + i) * 2.54;
}

export function kgFromInput(value: string, units: Units): number {
  const n = parseFloat(value);
  if (units.weight === "kg") return n;
  return n / 2.205;
}
