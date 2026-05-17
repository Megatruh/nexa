/**
 * tryOutStore.js — Zustand Store untuk NEXA Tryout
 *
 * Mengelola:
 *  - Daftar soal dari Inertia props
 *  - Indeks soal aktif (currentIndex)
 *  - Jawaban sementara + sinkronisasi ke server via axios (debounce 800ms)
 *  - Flag ragu-ragu per soal (sinkron ke server)
 *  - Countdown timer (berbasis sisa waktu dari server)
 *  - Pending sync tracking untuk indikator UI
 */

import { create } from "zustand";
import axios from "axios";

// Debounce timer map untuk setiap questionId
const _debounceTimers = {};

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

    /** ID sesi tryout aktif (untuk request ke server) */
    _sessionId: null,

    /**
     * Jawaban yang belum tersinkron ke server:
     * { [questionId]: { answer, is_doubtful } }
     */
    _pendingSync: {},

    // ─── ACTIONS ─────────────────────────────────────────────

    /**
     * Inisialisasi store saat komponen Exam mount.
     */
    initSesi: ({ soalList, allAnswers = {}, sisaWaktu, halamanAktif = 1, onTimeUp, sessionId }) => {
        // Hentikan timer lama kalau ada
        const { _timerId } = get();
        if (_timerId) clearInterval(_timerId);

        // Bersihkan semua debounce timer yang tersisa
        Object.values(_debounceTimers).forEach(clearTimeout);
        Object.keys(_debounceTimers).forEach(k => delete _debounceTimers[k]);

        set({
            soalList,
            currentIndex: halamanAktif - 1,
            jawaban: { ...allAnswers },
            flagged: new Set(),
            sisaWaktu: Math.floor(sisaWaktu), // Pastikan integer dari awal
            isTimerRunning: false,
            _timerId: null,
            _onTimeUp: onTimeUp ?? null,
            _sessionId: sessionId ?? null,
            _pendingSync: {},
        });
    },

    /**
     * Mulai / resume countdown timer.
     * Timer mengurangi 1 detik tiap interval — selalu integer.
     */
    startTimer: () => {
        const { _timerId, isTimerRunning } = get();
        if (isTimerRunning || _timerId) return;

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
     * Simpan jawaban — update state lokal secara INSTAN lalu
     * sync ke server dengan debounce 800ms untuk menghindari
     * request berlebihan saat user cepat mengganti jawaban.
     *
     * @param {number} questionId
     * @param {string} opsi - 'A' | 'B' | 'C' | 'D' | 'E'
     */
    simpanJawaban: (questionId, opsi) => {
        const { _sessionId, flagged } = get();

        // 1. Update state lokal INSTAN (UI responsif)
        set((state) => ({
            jawaban: { ...state.jawaban, [questionId]: opsi },
            _pendingSync: {
                ...state._pendingSync,
                [questionId]: {
                    answer: opsi,
                    is_doubtful: flagged.has(questionId),
                },
            },
        }));

        // 2. Debounce 800ms — kirim ke server
        if (_debounceTimers[questionId]) {
            clearTimeout(_debounceTimers[questionId]);
        }

        _debounceTimers[questionId] = setTimeout(() => {
            get()._syncToServer(questionId);
            delete _debounceTimers[questionId];
        }, 800);
    },

    /**
     * Simpan jawaban langsung ke server TANPA debounce (dipanggil tombol "Simpan").
     * Cocok untuk aksi eksplisit user — tidak perlu menunggu debounce.
     *
     * @param {number} questionId
     * @param {string} opsi - 'A' | 'B' | 'C' | 'D' | 'E'
     * @returns {Promise<boolean>} - true jika berhasil
     */
    simpanJawabanServer: async (questionId, opsi) => {
        const { _sessionId, flagged } = get();
        if (!_sessionId) return false;

        // Batalkan debounce yang masih berjalan untuk soal ini
        if (_debounceTimers[questionId]) {
            clearTimeout(_debounceTimers[questionId]);
            delete _debounceTimers[questionId];
        }

        // Update state lokal lebih dulu agar UI langsung responsif
        set((state) => ({
            jawaban: { ...state.jawaban, [questionId]: opsi },
        }));

        try {
            await axios.post(route('tryout.answer.store'), {
                tryout_session_id: _sessionId,
                tryout_question_id: questionId,
                answer: opsi,
                is_doubtful: flagged.has(questionId),
            });

            // Hapus dari pending jika ada
            set((state) => {
                const newPending = { ...state._pendingSync };
                delete newPending[questionId];
                return { _pendingSync: newPending };
            });

            return true;
        } catch (err) {
            console.error('[tryOutStore] simpanJawabanServer error:', questionId, err);
            return false;
        }
    },

    /**
     * Hapus (batalkan) jawaban dari state lokal dan kirim null ke server.
     * Dipanggil saat user klik tombol "Batalkan Pilihan".
     *
     * @param {number} questionId
     * @returns {Promise<boolean>} - true jika berhasil
     */
    hapusJawaban: async (questionId) => {
        const { _sessionId } = get();
        if (!_sessionId) return false;

        // Batalkan debounce yang masih berjalan
        if (_debounceTimers[questionId]) {
            clearTimeout(_debounceTimers[questionId]);
            delete _debounceTimers[questionId];
        }

        // Hapus dari state lokal secara INSTAN
        set((state) => {
            const newJawaban = { ...state.jawaban };
            delete newJawaban[questionId]; // Soal jadi berstatus "belum"
            const newPending = { ...state._pendingSync };
            delete newPending[questionId];
            return { jawaban: newJawaban, _pendingSync: newPending };
        });

        try {
            // Kirim answer: null ke server — storeAnswer sudah mendukung nullable
            await axios.post(route('tryout.answer.store'), {
                tryout_session_id: _sessionId,
                tryout_question_id: questionId,
                answer: null,
                is_doubtful: false,
            });
            return true;
        } catch (err) {
            console.error('[tryOutStore] hapusJawaban error:', questionId, err);
            return false;
        }
    },

    /**
     * Toggle flag ragu-ragu. Juga sync ke server jika sudah ada jawaban.
     *
     * @param {number} questionId
     */
    toggleFlag: (questionId) => {
        const { jawaban, _sessionId } = get();

        set((state) => {
            const flagged = new Set(state.flagged);
            const wasFlagged = flagged.has(questionId);
            wasFlagged ? flagged.delete(questionId) : flagged.add(questionId);

            const newIsDoubtful = !wasFlagged;

            // Jika sudah ada jawaban, sync status ragu-ragu ke server
            if (jawaban[questionId] && _sessionId) {
                const updatedPending = {
                    ...state._pendingSync,
                    [questionId]: {
                        answer: jawaban[questionId],
                        is_doubtful: newIsDoubtful,
                    },
                };

                // Langsung sync (tanpa debounce untuk flag toggle)
                setTimeout(() => get()._syncToServer(questionId), 0);

                return { flagged, _pendingSync: updatedPending };
            }

            return { flagged };
        });
    },

    /**
     * Kirim jawaban ke server via axios POST.
     * @param {number} questionId
     * @private
     */
    _syncToServer: async (questionId) => {
        const { _sessionId, _pendingSync } = get();
        const pendingData = _pendingSync[questionId];

        if (!_sessionId || !pendingData) return;

        try {
            await axios.post(route('tryout.answer.store'), {
                tryout_session_id: _sessionId,
                tryout_question_id: questionId,
                answer: pendingData.answer,
                is_doubtful: pendingData.is_doubtful ?? false,
            });

            // Hapus dari pending setelah sukses
            set((state) => {
                const newPending = { ...state._pendingSync };
                delete newPending[questionId];
                return { _pendingSync: newPending };
            });
        } catch (err) {
            console.error('[tryOutStore] sync error for question', questionId, err);
            // Biarkan tetap di pendingSync agar bisa di-retry saat flush
        }
    },

    /**
     * Paksa kirim SEMUA jawaban pending ke server secara berurutan.
     * Dipanggil sebelum finishSubtest untuk memastikan semua jawaban terkirim.
     */
    flushPendingSync: async () => {
        const { _pendingSync, _sessionId } = get();
        const questionIds = Object.keys(_pendingSync);

        if (questionIds.length === 0 || !_sessionId) return;

        // Batalkan semua debounce yang masih menunggu
        Object.values(_debounceTimers).forEach(clearTimeout);
        Object.keys(_debounceTimers).forEach(k => delete _debounceTimers[k]);

        // Kirim semua pending secara parallel
        const promises = questionIds.map((qId) => {
            const data = _pendingSync[qId];
            return axios.post(route('tryout.answer.store'), {
                tryout_session_id: _sessionId,
                tryout_question_id: parseInt(qId),
                answer: data.answer,
                is_doubtful: data.is_doubtful ?? false,
            }).catch(err => {
                console.error('[tryOutStore] flush error for question', qId, err);
            });
        });

        await Promise.allSettled(promises);

        // Bersihkan semua pending
        set({ _pendingSync: {} });
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

    /** Format MM:SS dari sisaWaktu — selalu integer */
    getFormattedTime: () => {
        const { sisaWaktu } = get();
        const totalSeconds = Math.floor(sisaWaktu);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    },

    // ─── RESET ───────────────────────────────────────────────

    resetStore: () => {
        const { _timerId } = get();
        if (_timerId) clearInterval(_timerId);

        // Bersihkan debounce timers
        Object.values(_debounceTimers).forEach(clearTimeout);
        Object.keys(_debounceTimers).forEach(k => delete _debounceTimers[k]);

        set({
            soalList: [],
            currentIndex: 0,
            jawaban: {},
            flagged: new Set(),
            sisaWaktu: 0,
            _timerId: null,
            isTimerRunning: false,
            _onTimeUp: null,
            _sessionId: null,
            _pendingSync: {},
        });
    },
}));