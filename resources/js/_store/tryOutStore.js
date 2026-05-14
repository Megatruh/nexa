/**
 * tryOutStore.js — Zustand Store untuk NEXA Tryout
 *
 * Mengelola:
 *  - Daftar soal dari Inertia props
 *  - Indeks soal aktif (currentIndex)
 *  - Jawaban sementara (belum di-submit ke server)
 *  - Flag ragu-ragu per soal
 *  - Countdown timer (berbasis sisa waktu dari server)
 */

import { create } from "zustand";

export const useTryoutStore = create((set, get) => ({
    // ─── STATE ────────────────────────────────────────────────

    /** Array TryoutQuestion yang diterima dari Inertia props */
    soalList: [],

    /** Indeks soal yang sedang ditampilkan (0-based) */
    currentIndex: 0,

    /**
     * Jawaban sementara: { [questionId]: 'A' | 'B' | 'C' | 'D' | 'E' | null }
     * Di-seed dari allAnswers (Inertia prop) saat initSesi dipanggil.
     */
    jawaban: {},

    /**
     * Set ID soal yang ditandai ragu-ragu: Set<number>
     */
    flagged: new Set(),

    /** Sisa waktu dalam detik (server-authoritative value di-set saat init) */
    sisaWaktu: 0,

    /** Referensi interval ID untuk timer */
    _timerId: null,

    /** Apakah timer sedang berjalan */
    isTimerRunning: false,

    /** Callback yang dipanggil saat waktu = 0 (isi dari komponen) */
    _onTimeUp: null,

    // ─── ACTIONS ─────────────────────────────────────────────

    /**
     * Inisialisasi store saat komponen Exam mount.
     *
     * @param {Object} params
     * @param {Array}  params.soalList      - Array soal dari subtest
     * @param {Object} params.allAnswers    - { [questionId]: answer } dari server
     * @param {number} params.sisaWaktu     - Sisa waktu (detik) dari server
     * @param {number} params.halamanAktif  - Halaman pagination saat ini (1-based)
     * @param {Function} params.onTimeUp    - Callback ketika waktu habis
     */
    initSesi: ({ soalList, allAnswers = {}, sisaWaktu, halamanAktif = 1, onTimeUp }) => {
        // Hentikan timer lama kalau ada
        const { _timerId } = get();
        if (_timerId) clearInterval(_timerId);

        set({
            soalList,
            currentIndex: halamanAktif - 1, // konversi ke 0-based
            jawaban: { ...allAnswers },
            flagged: new Set(),
            sisaWaktu,
            isTimerRunning: false,
            _timerId: null,
            _onTimeUp: onTimeUp ?? null,
        });
    },

    /**
     * Mulai / resume countdown timer.
     */
    startTimer: () => {
        const { _timerId, isTimerRunning } = get();
        if (isTimerRunning || _timerId) return; // sudah berjalan

        const id = setInterval(() => {
            const { sisaWaktu, _onTimeUp } = get();

            if (sisaWaktu <= 1) {
                clearInterval(id);
                set({ sisaWaktu: 0, isTimerRunning: false, _timerId: null });
                _onTimeUp?.();
                return;
            }

            set((state) => ({ sisaWaktu: state.sisaWaktu - 1 }));
        }, 1000);

        set({ _timerId: id, isTimerRunning: true });
    },

    /**
     * Hentikan timer (misalnya saat komponen unmount).
     */
    stopTimer: () => {
        const { _timerId } = get();
        if (_timerId) clearInterval(_timerId);
        set({ _timerId: null, isTimerRunning: false });
    },

    /**
     * Pindah ke soal dengan indeks tertentu.
     *
     * @param {number} index - 0-based
     */
    goToSoal: (index) => {
        const { soalList } = get();
        if (index < 0 || index >= soalList.length) return;
        set({ currentIndex: index });
    },

    /** Soal berikutnya */
    nextSoal: () => {
        const { currentIndex, soalList } = get();
        if (currentIndex < soalList.length - 1) {
            set({ currentIndex: currentIndex + 1 });
        }
    },

    /** Soal sebelumnya */
    prevSoal: () => {
        const { currentIndex } = get();
        if (currentIndex > 0) {
            set({ currentIndex: currentIndex - 1 });
        }
    },

    /**
     * Simpan jawaban sementara di store (belum ke server).
     * Server di-update secara terpisah via Inertia router.post.
     *
     * @param {number} questionId
     * @param {string} opsi        - 'A' | 'B' | 'C' | 'D' | 'E'
     */
    simpanJawaban: (questionId, opsi) => {
        set((state) => ({
            jawaban: { ...state.jawaban, [questionId]: opsi },
        }));
    },

    /**
     * Toggle flag ragu-ragu.
     *
     * @param {number} questionId
     */
    toggleFlag: (questionId) => {
        set((state) => {
            const flagged = new Set(state.flagged);
            flagged.has(questionId) ? flagged.delete(questionId) : flagged.add(questionId);
            return { flagged };
        });
    },

    // ─── SELECTORS (computed helpers) ────────────────────────

    /** Soal yang sedang aktif */
    getSoalAktif: () => {
        const { soalList, currentIndex } = get();
        return soalList[currentIndex] ?? null;
    },

    /** Jawaban untuk soal aktif */
    getJawabanAktif: () => {
        const { jawaban, soalList, currentIndex } = get();
        const soal = soalList[currentIndex];
        return soal ? (jawaban[soal.id] ?? null) : null;
    },

    /** Jumlah soal yang sudah dijawab */
    getTerjawab: () => {
        const { jawaban } = get();
        return Object.values(jawaban).filter(Boolean).length;
    },

    /** Format MM:SS dari sisaWaktu */
    getFormattedTime: () => {
        const { sisaWaktu } = get();
        const mins = Math.floor(sisaWaktu / 60);
        const secs = sisaWaktu % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    },

    // ─── RESET ───────────────────────────────────────────────

    resetStore: () => {
        const { _timerId } = get();
        if (_timerId) clearInterval(_timerId);
        set({
            soalList: [],
            currentIndex: 0,
            jawaban: {},
            flagged: new Set(),
            sisaWaktu: 0,
            _timerId: null,
            isTimerRunning: false,
            _onTimeUp: null,
        });
    },
}));