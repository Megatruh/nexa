/**
 * ProgressBar - Bar progress animasi NEXA
 */

import React from "react";

export function ProgressBar({
  value = 0,       // 0-100
  max = 100,
  color,
  showLabel = false,
  label,
  height = "h-2",
  className = "",
  animated = true,
}) {
  const persen = Math.min(100, Math.max(0, (value / max) * 100));

  // Warna berdasarkan persentase jika tidak ditentukan
  const autoColor = color || (
    persen >= 70 ? "#10b981" :
    persen >= 40 ? "#f59e0b" :
    "#ef4444"
  );

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-purple-300 font-syne">{label}</span>
          <span className="text-xs font-bold font-mono" style={{ color: autoColor }}>
            {Math.round(persen)}%
          </span>
        </div>
      )}
      <div className={`w-full ${height} bg-purple-900/40 rounded-full overflow-hidden`}>
        <div
          className={`
            h-full rounded-full transition-all duration-700 ease-out
            ${animated ? "animate-progress-fill" : ""}
          `}
          style={{
            width: `${persen}%`,
            background: `linear-gradient(90deg, ${autoColor}cc, ${autoColor})`,
            boxShadow: `0 0 8px ${autoColor}60`,
          }}
        />
      </div>
    </div>
  );
}
