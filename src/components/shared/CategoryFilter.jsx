/**
 * CategoryFilter - Filter kategori prodi dengan pills/chip
 */

import React from "react";
import { KATEGORI_PRODI } from "../../constants/kategoriProdi";

export function CategoryFilter({ aktif, onChange, categories = KATEGORI_PRODI }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((kat) => (
        <button
          key={kat.id}
          onClick={() => onChange(kat.id)}
          className={`
            px-4 py-1.5 rounded-full text-sm font-semibold font-syne
            transition-all duration-200 border
            ${aktif === kat.id
              ? "bg-purple-600/40 border-purple-400/60 text-white"
              : "bg-transparent border-purple-500/20 text-purple-400 hover:border-purple-400/40 hover:text-purple-200"
            }
          `}
        >
          {kat.label}
        </button>
      ))}
    </div>
  );
}
