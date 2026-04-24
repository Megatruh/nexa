/**
 * TryOut Store - Zustand
 * State global untuk sesi Try Out yang sedang berjalan
 */

import { create } from "zustand";

export const useTryoutStore = create((set, get) => ({
  // State sesi aktif
  sesiAktif: null,     // { paketId, mulai, soal: [], jawaban: {} }
  hasilTerakhir: null, // hasil try out terakhir untuk halaman Hasil

  // Mulai sesi baru
  mulaiSesi: (paketId, soal) =>
    set({
      sesiAktif: {
        paketId,
        mulai: Date.now(),
        soal,
        jawaban: {},
        flagged: [],
      },
    }),

  // Simpan jawaban
  simpanJawaban: (soalIndex, opsiId) =>
    set((state) => ({
      sesiAktif: state.sesiAktif
        ? {
            ...state.sesiAktif,
            jawaban: {
              ...state.sesiAktif.jawaban,
              [soalIndex]: opsiId,
            },
          }
        : null,
    })),

  // Toggle flag soal
  toggleFlag: (soalIndex) =>
    set((state) => {
      if (!state.sesiAktif) return {};
      const flagged = state.sesiAktif.flagged.includes(soalIndex)
        ? state.sesiAktif.flagged.filter((i) => i !== soalIndex)
        : [...state.sesiAktif.flagged, soalIndex];
      return { sesiAktif: { ...state.sesiAktif, flagged } };
    }),

  // Selesaikan Try Out dan simpan hasil
  selesaikanTryOut: (hasil) =>
    set({
      hasilTerakhir: {
        ...hasil,
        selesai: Date.now(),
        paketId: get().sesiAktif?.paketId,
      },
      sesiAktif: null,
    }),

  // Reset
  resetSesi: () => set({ sesiAktif: null }),
}));
