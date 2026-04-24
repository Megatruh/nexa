/**
 * Input - Komponen input field NEXA
 */

import React from "react";

export function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
  icon: Icon,
  className = "",
  ...props
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-purple-300 mb-2 font-syne">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
            <Icon size={16} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            nexa-input
            ${Icon ? "pl-10" : ""}
            ${error ? "border-red-500/50 focus:border-red-500" : ""}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-400 font-syne">{error}</p>
      )}
    </div>
  );
}

export function Textarea({
  label,
  placeholder,
  value,
  onChange,
  error,
  rows = 4,
  className = "",
  ...props
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-purple-300 mb-2 font-syne">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`
          nexa-input resize-none
          ${error ? "border-red-500/50 focus:border-red-500" : ""}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-400 font-syne">{error}</p>
      )}
    </div>
  );
}
