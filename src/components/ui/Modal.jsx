/**
 * Modal - Dialog overlay NEXA
 */

import React, { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({ isOpen, onClose, title, children, size = "md" }) {
  // Tutup dengan ESC
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (isOpen) {
      document.addEventListener("keydown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  }[size] || "max-w-lg";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`
          relative ${sizeClass} w-full
          bg-gradient-to-br from-[#1a1040] to-[#0d0820]
          border border-purple-500/30 rounded-2xl
          shadow-2xl shadow-purple-900/50
          animate-slide-up
        `}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-purple-500/20">
            <h3 className="text-lg font-bold text-white font-syne">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-purple-400 hover:text-white hover:bg-purple-500/20 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
