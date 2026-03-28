import { useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Kid, Measurement, Units } from "../types";
import { getSeason } from "../utils/seasons";
import { SEASONS, T } from "../constants";

type Props = {
  kid: Kid;
  measurements: Measurement[]; // pre-sorted oldest → newest
  units: Units;
};

export default function GrowthChart({ kid, measurements, units }: Props) {
  const heightUnit = units.height === "cm" ? "cm" : "in";
  const weightUnit = units.weight === "kg" ? "kg" : "lbs";

  const chartData = useMemo(() =>
    measurements.map((m) => {
      const { emoji } = SEASONS[getSeason(m.date)];
      const year = new Date(m.date).getFullYear();
      const h = units.height === "cm"
        ? Math.round(m.heightCm)
        : parseFloat((m.heightCm / 2.54).toFixed(1));
      const w = m.weightKg !== null
        ? units.weight === "kg"
          ? parseFloat(m.weightKg.toFixed(1))
          : parseFloat((m.weightKg * 2.205).toFixed(1))
        : null;
      return { label: `${emoji} ${year}`, height: h, weight: w };
    }),
    [measurements, units]
  );

  const weightPoints = chartData.filter((d) => d.weight !== null);
  const showWeight = weightPoints.length >= 2;

  if (measurements.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.textMd, lineHeight: 1.6 }}>
          Add at least one measurement to see the growth chart.
        </p>
      </div>
    );
  }

  const gradId = `h-${kid.id}`;
  const gradWId = `w-${kid.id}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Height chart */}
      <div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, color: T.textMd, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Height ({heightUnit})
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={kid.color} stopOpacity={0.15} />
                <stop offset="95%" stopColor={kid.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={T.border} />
            <XAxis dataKey="label" tick={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fill: T.textSm }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fill: T.textSm }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
            <Tooltip content={<CustomTooltip unit={heightUnit} color={kid.color} />} />
            <Area
              type="monotone"
              dataKey="height"
              stroke={kid.color}
              strokeWidth={2}
              fill={`url(#${gradId})`}
              dot={{ fill: kid.color, strokeWidth: 0, r: 4 }}
              activeDot={{ r: 5, fill: kid.color }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Weight chart */}
      {showWeight && (
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, color: T.textMd, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Weight ({weightUnit})
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData.filter((d) => d.weight !== null)} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id={gradWId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={kid.color} stopOpacity={0.12} />
                  <stop offset="95%" stopColor={kid.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={T.border} />
              <XAxis dataKey="label" tick={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fill: T.textSm }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fill: T.textSm }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
              <Tooltip content={<CustomTooltip unit={weightUnit} color={kid.color} />} />
              <Area
                type="monotone"
                dataKey="weight"
                stroke={kid.color}
                strokeWidth={2}
                fill={`url(#${gradWId})`}
                dot={{ fill: kid.color, strokeWidth: 0, r: 4 }}
                activeDot={{ r: 5, fill: kid.color }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function CustomTooltip({
  active, payload, label, unit, color,
}: { active?: boolean; payload?: { value: number }[]; label?: string; unit: string; color: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 12px", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <p style={{ fontSize: 12, color: T.textSm, margin: "0 0 4px" }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 600, color, margin: 0 }}>
        {payload[0].value} {unit}
      </p>
    </div>
  );
}
