/**
 * Spinner - Loading indicator NEXA
 */

import React from "react";

export function Spinner({ size = "md", className = "" }) {
  const sizeClass = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
    xl: "w-16 h-16 border-4",
  }[size] || "w-8 h-8 border-2";

  return (
    <div
      className={`
        ${sizeClass}
        rounded-full
        border-purple-500/30
        border-t-purple-400
        animate-spin
        ${className}
      `}
    />
  );
}

export function FullPageLoader({ message = "Memuat..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[#0d0820]/80 backdrop-blur-sm">
      <div className="relative">
        <Spinner size="xl" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-purple-400 font-display text-xs font-bold">N</span>
        </div>
      </div>
      <p className="text-purple-300 font-syne text-sm animate-pulse">{message}</p>
    </div>
  );
}
