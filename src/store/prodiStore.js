/**
 * Prodi Store - Zustand
 * State global untuk data program studi dan kesesuaian jurusan
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useProdiStore = create(
  persist(
    (set) => ({
      // Hasil survei kesesuaian jurusan
      hasilKesesuaian: null,
      jawabanSurvei: {},

      // Cache prodi yang sudah dimuat
      prodiCache: {},

      // Simpan jawaban survei
      simpanJawabanSurvei: (pertanyaanId, jawaban) =>
        set((state) => ({
          jawabanSurvei: { ...state.jawabanSurvei, [pertanyaanId]: jawaban },
        })),

      // Simpan hasil kesesuaian
      simpanHasilKesesuaian: (hasil) => set({ hasilKesesuaian: hasil }),

      // Reset survei
      resetSurvei: () => set({ jawabanSurvei: {}, hasilKesesuaian: null }),

      // Cache prodi
      cacheProdi: (slug, data) =>
        set((state) => ({
          prodiCache: { ...state.prodiCache, [slug]: data },
        })),
    }),
    {
      name: "nexa-prodi",
      partialize: (state) => ({
        hasilKesesuaian: state.hasilKesesuaian,
        jawabanSurvei: state.jawabanSurvei,
      }),
    }
  )
);
