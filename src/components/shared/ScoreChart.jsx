/**
 * ScoreChart - Chart radar/bar untuk visualisasi skor UTBK
 */

import React from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip
} from "recharts";
import { SUBTES_LIST } from "../../constants/subtesTryOut";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded-lg text-xs font-syne"
        style={{
          background: "rgba(26,16,64,0.95)",
          border: "1px solid rgba(167,139,250,0.3)",
        }}
      >
        <p className="font-bold text-white">{payload[0].name}</p>
        <p className="text-purple-300">Skor: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

/**
 * BarChart skor per subtes
 */
export function SkorBarChart({ skorPerSubtes }) {
  const data = SUBTES_LIST.map((s) => ({
    name: s.singkatan,
    skor: skorPerSubtes[s.id]?.skor || 0,
    namaLengkap: s.nama,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <XAxis
          dataKey="name"
          tick={{ fill: "#a78bfa", fontSize: 11, fontFamily: "Syne" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[200, 800]}
          tick={{ fill: "#7c3aed", fontSize: 10, fontFamily: "JetBrains Mono" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="skor"
          name="Skor"
          radius={[4, 4, 0, 0]}
          fill="url(#barGradient)"
        />
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#5b21b6" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
}

/**
 * Radar chart skor per subtes
 */
export function SkorRadarChart({ skorPerSubtes }) {
  const data = SUBTES_LIST.map((s) => ({
    subject: s.singkatan,
    skor: ((skorPerSubtes[s.id]?.skor || 200) - 200) / 6, // normalisasi 0-100
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(167,139,250,0.2)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "#a78bfa", fontSize: 11, fontFamily: "Syne" }}
        />
        <Radar
          name="Skor"
          dataKey="skor"
          stroke="#a78bfa"
          fill="#7c3aed"
          fillOpacity={0.3}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
