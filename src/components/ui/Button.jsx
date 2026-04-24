/**
 * Button - Komponen tombol reusable NEXA
 * Mendukung variant: primary, secondary, ghost, danger
 */

import React from "react";

const variantStyles = {
  primary: "nexa-btn-primary",
  secondary: "nexa-btn-secondary",
  ghost:
    "bg-transparent border border-transparent text-purple-300 hover:text-white hover:bg-white/5 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 cursor-pointer text-sm",
  danger:
    "bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 hover:border-red-400 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 cursor-pointer text-sm font-syne",
  outline:
    "bg-transparent border border-purple-400/50 text-purple-300 hover:border-purple-300 hover:text-white px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 cursor-pointer text-sm font-syne",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  fullWidth = false,
  ...props
}) {
  const baseClass = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClass}
        ${fullWidth ? "w-full" : ""}
        ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
        inline-flex items-center justify-center gap-2
        font-syne
      `}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
