import React, { useEffect, useCallback, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useTryoutStore } from '@/_store/tryOutStore';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

// ─── ICON HELPERS ─────────────────────────────────────────────────────────────

const ClockIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
    </svg>
);

const FlagIcon = ({ filled, className }) => (
    <svg className={className} fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21V5l1-1h10l1 1 3-3 1 1v11l-1 1-3-3-1 1H4" />
    </svg>
);

const ChevronLeft = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRight = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

const ShieldCheckIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

// ─── OPTION BUTTON ────────────────────────────────────────────────────────────

const OptionButton = ({ letter, text, isSelected, onClick }) => {
    const base = 'w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150 group cursor-pointer';
    const selected = 'border-blue-500 bg-blue-50 shadow-sm shadow-blue-100';
    const unselected = 'border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50/40';

    return (
        <button type="button" onClick={onClick} className={`${base} ${isSelected ? selected : unselected}`}>
            <span className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                transition-colors duration-150
                ${isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'}
            `}>
                {letter}
            </span>
            <span
                className={`pt-1 text-sm leading-relaxed ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'}`}
            >
                <Latex>{text || ''}</Latex>
            </span>
        </button>
    );
};

// ─── NOMOR SOAL BUTTON ────────────────────────────────────────────────────────

const NomorSoal = ({ nomor, status, onClick }) => {
    const styles = {
        aktif:   'bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-1',
        dijawab: 'bg-emerald-500 text-white',
        ragu:    'bg-amber-400 text-white',
        belum:   'bg-gray-100 text-gray-500 hover:bg-gray-200',
    };
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-9 h-9 rounded-lg text-xs font-bold transition-all duration-100 ${styles[status]}`}
        >
            {nomor}
        </button>
    );
};

// ─── SYNC INDICATOR ───────────────────────────────────────────────────────────

const SyncIndicator = ({ hasPending }) => (
    <span className={`
        flex items-center gap-1 text-[10px] font-medium transition-opacity duration-300
        ${hasPending ? 'opacity-100 text-amber-500' : 'opacity-50 text-emerald-500'}
    `}>
        <span className={`w-1.5 h-1.5 rounded-full ${hasPending ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
        {hasPending ? 'Menyimpan...' : 'Tersimpan'}
    </span>
);

// ─── MAIN EXAM COMPONENT ──────────────────────────────────────────────────────

/**
 * Exam.jsx — Halaman ujian satu soal per halaman.
 *
 * ARSITEKTUR JAWABAN:
 *  1. Klik opsi → simpanJawaban() → update Zustand state INSTAN (UI responsif)
 *  2. Zustand mengirim ke server via axios debounce 800ms di background
 *  3. Navigasi antar soal via Inertia (ganti halaman) TANPA menunggu server
 *  4. Sebelum finish, flushPendingSync() memastikan semua jawaban terkirim
 *
 * KEAMANAN TIMER:
 *  - Nilai awal sisaWaktu dari server (bukan dari JS Date)
 *  - Server memvalidasi waktu saat storeAnswer & finishSubtest dipanggil
 *  - Memanipulasi JS timer dari DevTools tidak membantu: server tetap reject
 *    jawaban yang dikirim setelah durasi + toleransi 10 detik
 */
export default function Exam({
    auth,
    session,
    subtest,
    sessionSubtest,
    questions,        // LengthAwarePaginator Laravel (1 soal per page)
    savedAnswer,      // Jawaban tersimpan untuk soal ini (dari DB)
    allQuestionIds,   // Semua ID soal untuk navigasi nomor
    allAnswers,       // { [questionId]: answer } — semua jawaban user di subtes ini
    sisaWaktu,        // Sisa waktu (detik) — server-authoritative
}) {
    const question = questions?.data?.[0];

    // ─── Zustand store ────────────────────────────────────────────────────────
    const {
        initSesi,
        startTimer,
        stopTimer,
        simpanJawaban,
        toggleFlag,
        flushPendingSync,
        jawaban,
        flagged,
        sisaWaktu: waktuStore,
        _pendingSync,
    } = useTryoutStore();

    // Derived values dari state reaktif (tidak memanggil fungsi store)
    const hasPendingSync = Object.keys(_pendingSync ?? {}).length > 0;
    const getFormattedTime = () => {
        const mins = Math.floor(waktuStore / 60);
        const secs = waktuStore % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // Ref untuk mencegah double-finish
    const isFinishing = useRef(false);

    // ─── Callback waktu habis ─────────────────────────────────────────────────
    /**
     * Dipanggil oleh timer saat waktu = 0.
     * PENTING: gunakan handleFinishSubtest agar flushPendingSync dipanggil dulu.
     */
    const handleTimeUp = useCallback(() => {
        handleFinishSubtest(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionSubtest.id]);

    // ─── Init store saat pertama mount ────────────────────────────────────────
    /**
     * Dependency sengaja dikosongkan agar store tidak di-reset setiap Inertia
     * partial-reload. Timer hanya dimulai sekali per mount komponen.
     * allAnswers dan savedAnswer di-merge di dalam initSesi.
     */
    useEffect(() => {
        initSesi({
            soalList:    questions.data,
            allAnswers:  allAnswers ?? {},
            sisaWaktu,
            halamanAktif: questions.current_page,
            onTimeUp:    handleTimeUp,
            sessionId:   session.id,
        });
        startTimer();

        return () => stopTimer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ─── Sinkron jawaban dari server ke store saat navigasi ──────────────────
    /**
     * Setiap kali Inertia memuat halaman baru (soal baru), kita merge
     * jawaban dari server ke state Zustand. Ini menjaga konsistensi jika
     * user membuka tab baru atau browser di-refresh.
     */
    useEffect(() => {
        if (savedAnswer?.answer && question?.id) {
            // Hanya isi jika store belum punya jawaban lokal (lokal lebih fresh)
            const jawabanLokal = useTryoutStore.getState().jawaban[question.id];
            if (!jawabanLokal) {
                simpanJawaban(question.id, savedAnswer.answer);
            }
        }
    }, [savedAnswer, question?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    // ─── Navigasi ke halaman soal tertentu ───────────────────────────────────
    const goToPage = (page) => {
        router.get(
            route('tryout.subtest.show', {
                tryout_id:  session.tryout_id,
                subtest_id: subtest.id,
            }),
            { page },
            {
                preserveScroll: true,
                preserveState: false,
                // Tidak perlu menunggu server selesai sebelum navigasi
                // karena jawaban dikirim secara background oleh Zustand
            }
        );
    };

    // ─── Simpan jawaban (lokal instan + background sync) ─────────────────────
    const handleAnswer = (choice) => {
        if (!question) return;
        // Zustand menangani: update state lokal + debounce axios ke server
        simpanJawaban(question.id, choice);
    };

    // ─── Selesaikan subtes dengan aman ───────────────────────────────────────
    /**
     * ALUR:
     *  1. Konfirmasi (jika manual)
     *  2. Hentikan timer agar tidak fire ganda
     *  3. flushPendingSync() — paksa kirim semua jawaban yang pending
     *  4. POST ke server untuk menandai subtes selesai
     *
     * @param {boolean} isAuto - true jika dipanggil oleh timer (waktu habis)
     */
    const handleFinishSubtest = async (isAuto = false) => {
        // Guard: cegah eksekusi ganda
        if (isFinishing.current) return;

        if (!isAuto) {
            const confirmed = window.confirm(
                'Yakin ingin mengakhiri subtes ini? Soal yang belum dijawab tidak akan dinilai.'
            );
            if (!confirmed) return;
        }

        isFinishing.current = true;
        stopTimer();

        try {
            // Flush semua jawaban pending sebelum finish
            // Ini KRITIS: tanpa ini, jawaban terakhir bisa hilang
            await flushPendingSync();
        } catch (err) {
            console.error('[Exam] flushPendingSync error:', err);
            // Tetap lanjut finish agar user tidak terjebak di halaman
        }

        router.post(
            route('tryout.subtest.finish', { session_subtest_id: sessionSubtest.id }),
            {},
            {
                onError: () => {
                    isFinishing.current = false;
                    alert('Terjadi kesalahan. Silakan coba lagi.');
                },
            }
        );
    };

    // ─── Guard: soal tidak ditemukan ─────────────────────────────────────────
    if (!question) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p className="text-gray-400 italic">Soal tidak ditemukan.</p>
            </div>
        );
    }

    // ─── Helpers UI ──────────────────────────────────────────────────────────
    const jawabanSoalIni = jawaban[question.id] ?? null;
    const isFlagged      = flagged.has(question.id);
    const terjawab       = Object.values(jawaban).filter(Boolean).length;
    const warningTimer   = waktuStore < 60;
    const formattedTime  = getFormattedTime();
    const pendingSync    = hasPendingSync;

    const getNomorStatus = (id, idx) => {
        if (questions.current_page === idx + 1) return 'aktif';
        if (flagged.has(id))   return 'ragu';
        if (jawaban[id])       return 'dijawab';
        return 'belum';
    };

    const opsiList = ['a', 'b', 'c', 'd', 'e'];

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Ujian — ${subtest.name}`} />

            {/* ─── TOP BAR ─────────────────────────────────────────────── */}
            <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">

                    {/* Nama Subtes + Security Badge */}
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="hidden sm:block w-2 h-5 bg-blue-500 rounded-full flex-shrink-0" />
                        <h1 className="font-bold text-gray-800 truncate text-sm sm:text-base">
                            {subtest.name}
                        </h1>
                        {/* Indikator bahwa timer diawasi server */}
                        <span title="Waktu diverifikasi oleh server" className="hidden sm:flex items-center gap-1 text-[10px] text-gray-400">
                            <ShieldCheckIcon className="w-3 h-3 text-emerald-400" />
                        </span>
                    </div>

                    {/* Progress + Sync Indicator */}
                    <div className="hidden md:flex items-center gap-3 text-xs text-gray-500">
                        <SyncIndicator hasPending={pendingSync} />
                        <span>
                            <span className="font-semibold text-emerald-600">{terjawab}</span>
                            {' / '}{allQuestionIds.length} dijawab
                        </span>
                    </div>

                    {/* Timer */}
                    <div className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-sm flex-shrink-0
                        transition-colors duration-300
                        ${warningTimer
                            ? 'bg-red-50 text-red-600 animate-pulse'
                            : 'bg-gray-50 text-gray-700'}
                    `}>
                        <ClockIcon className="w-4 h-4" />
                        {formattedTime}
                    </div>
                </div>
            </div>

            {/* ─── MAIN LAYOUT ─────────────────────────────────────────── */}
            <div className="min-h-[calc(100vh-3.5rem)] bg-gray-50 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-5">

                    {/* ══ PANEL SOAL (kiri) ══════════════════════════════ */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                            {/* Header nomor soal */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-gray-50/60">
                                <div className="flex items-center gap-2">
                                    <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                                        {questions.current_page}
                                    </span>
                                    <span className="text-sm text-gray-400">
                                        dari <span className="font-semibold text-gray-600">{questions.total}</span> soal
                                    </span>
                                </div>

                                {/* Tombol ragu-ragu */}
                                <button
                                    type="button"
                                    onClick={() => toggleFlag(question.id)}
                                    className={`
                                        flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                                        transition-colors duration-150
                                        ${isFlagged
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-600'}
                                    `}
                                >
                                    <FlagIcon filled={isFlagged} className="w-3.5 h-3.5" />
                                    {isFlagged ? 'Ragu-ragu' : 'Tandai Ragu'}
                                </button>
                            </div>

                            {/* Gambar soal (opsional) */}
                            {question.question_image && (
                                <div className="px-6 pt-6">
                                    <div className="rounded-xl overflow-hidden border border-gray-100">
                                        <img
                                            src={`/storage/${question.question_image}`}
                                            alt="Gambar Soal"
                                            className="max-w-full h-auto"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Teks soal — dengan dukungan LaTeX */}
                            <div className="px-6 pt-5 pb-4">
                                <div className="text-gray-800 leading-relaxed text-[15px] prose prose-sm max-w-none">
                                    <Latex>{question.question_text || ''}</Latex>
                                </div>
                            </div>

                            {/* Pilihan jawaban */}
                            <div className="px-6 pb-6 space-y-3">
                                {opsiList.map((letter) => (
                                    <OptionButton
                                        key={letter}
                                        letter={letter.toUpperCase()}
                                        text={question[`option_${letter}`]}
                                        isSelected={jawabanSoalIni === letter.toUpperCase()}
                                        onClick={() => handleAnswer(letter.toUpperCase())}
                                    />
                                ))}
                            </div>

                            {/* Navigasi prev / next */}
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50 bg-gray-50/40">
                                <button
                                    type="button"
                                    onClick={() => questions.prev_page_url && goToPage(questions.current_page - 1)}
                                    disabled={!questions.prev_page_url}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                                        bg-white border border-gray-200 text-gray-600
                                        hover:bg-gray-50 hover:border-gray-300 transition-colors
                                        disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft /> Sebelumnya
                                </button>

                                <span className="text-xs text-gray-400 hidden sm:block">
                                    {questions.current_page} / {questions.last_page}
                                </span>

                                <button
                                    type="button"
                                    onClick={() => questions.next_page_url && goToPage(questions.current_page + 1)}
                                    disabled={!questions.next_page_url}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                                        bg-blue-600 text-white
                                        hover:bg-blue-700 transition-colors
                                        disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    Selanjutnya <ChevronRight />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ══ PANEL SAMPING (kanan) ══════════════════════════ */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-20">

                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                                Navigasi Soal
                            </h3>

                            {/* Grid nomor soal */}
                            <div className="grid grid-cols-6 gap-1.5 mb-5">
                                {allQuestionIds.map((id, idx) => (
                                    <NomorSoal
                                        key={id}
                                        nomor={idx + 1}
                                        status={getNomorStatus(id, idx)}
                                        onClick={() => goToPage(idx + 1)}
                                    />
                                ))}
                            </div>

                            {/* Legenda */}
                            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-gray-500 mb-5 pb-5 border-b border-gray-50">
                                {[
                                    { color: 'bg-blue-600',   label: 'Aktif' },
                                    { color: 'bg-emerald-500', label: 'Dijawab' },
                                    { color: 'bg-amber-400',  label: 'Ragu-ragu' },
                                    { color: 'bg-gray-200',   label: 'Belum' },
                                ].map(({ color, label }) => (
                                    <span key={label} className="flex items-center gap-1">
                                        <span className={`w-2.5 h-2.5 rounded-sm ${color}`} />
                                        {label}
                                    </span>
                                ))}
                            </div>

                            {/* Ringkasan */}
                            <div className="mb-5 space-y-1 text-sm">
                                <div className="flex justify-between text-gray-500">
                                    <span>Dijawab</span>
                                    <span className="font-semibold text-emerald-600">
                                        {terjawab} / {allQuestionIds.length}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Belum dijawab</span>
                                    <span className="font-semibold text-gray-700">
                                        {allQuestionIds.length - terjawab}
                                    </span>
                                </div>
                                {flagged.size > 0 && (
                                    <div className="flex justify-between text-gray-500">
                                        <span>Ragu-ragu</span>
                                        <span className="font-semibold text-amber-600">{flagged.size}</span>
                                    </div>
                                )}
                                {/* Mobile sync indicator */}
                                <div className="md:hidden pt-1">
                                    <SyncIndicator hasPending={pendingSync} />
                                </div>
                            </div>

                            {/* Tombol selesai */}
                            <button
                                type="button"
                                onClick={() => handleFinishSubtest(false)}
                                disabled={isFinishing.current}
                                className="w-full py-3 rounded-xl text-sm font-bold
                                    bg-red-50 text-red-600 border border-red-100
                                    hover:bg-red-100 hover:border-red-200
                                    active:scale-[0.98] transition-all duration-150
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Selesai Subtes ›
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}