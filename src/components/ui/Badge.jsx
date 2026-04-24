/**
 * Badge - Label status/kategori
 */

import React from "react";

const variantStyles = {
  default: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  success: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  warning: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  danger: "bg-red-500/20 text-red-300 border border-red-500/30",
  info: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  gold: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
};

export function Badge({ children, variant = "default", className = "" }) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-syne
        ${variantStyles[variant] || variantStyles.default}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
