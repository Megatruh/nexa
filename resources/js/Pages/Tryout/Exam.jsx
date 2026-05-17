import React, { useEffect, useCallback, useRef, useState } from 'react';
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

// ─── OPTION BUTTON — dark theme ───────────────────────────────────────────────

const OptionButton = ({ letter, text, isSelected, isSaved, onClick }) => {
    const base = 'w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-150 group cursor-pointer';
    
    let stateStyles = 'border-white/10 bg-white/5 hover:border-indigo-400/40 hover:bg-white/10'; // unselected
    let badgeStyles = 'bg-white/10 text-white/60 group-hover:bg-indigo-500/30 group-hover:text-indigo-300';

    if (isSaved) {
        // Tampilan hijau ketika jawaban sudah disimpan
        stateStyles = 'border-emerald-400/70 bg-emerald-500/20 shadow-lg shadow-emerald-900/20';
        badgeStyles = 'bg-emerald-500 text-white';
    } else if (isSelected) {
        // Tampilan biru/ungu ketika dipilih tapi belum disimpan
        stateStyles = 'border-indigo-400/70 bg-indigo-500/20 shadow-lg shadow-indigo-900/20';
        badgeStyles = 'bg-indigo-500 text-white';
    }

    return (
        <button type="button" onClick={onClick} className={`${base} ${stateStyles}`}>
            <span className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                transition-colors duration-150
                ${badgeStyles}
            `}>
                {letter}
            </span>
            <span className={`pt-1 text-sm leading-relaxed ${isSelected || isSaved ? 'text-white font-medium' : 'text-white/80'}`}>
                <Latex>{text || ''}</Latex>
            </span>
        </button>
    );
};

// ─── NOMOR SOAL BUTTON — dark theme ──────────────────────────────────────────

const NomorSoal = ({ nomor, status, onClick }) => {
    const styles = {
        aktif:   'bg-indigo-500 text-white ring-2 ring-indigo-300/50 ring-offset-1 ring-offset-transparent',
        dijawab: 'bg-emerald-500/80 text-white',
        ragu:    'bg-amber-400/80 text-white',
        belum:   'bg-white/10 text-white/60 hover:bg-white/20',
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
        ${hasPending ? 'opacity-100 text-amber-400' : 'opacity-60 text-emerald-400'}
    `}>
        <span className={`w-1.5 h-1.5 rounded-full ${hasPending ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
        {hasPending ? 'Menyimpan...' : 'Tersimpan'}
    </span>
);

// ─── QUESTION TEXT RENDERER ──────────────────────────────────────────────────
// Splits stimulus text (before \n\n) from the actual question, rendering each
// part with LaTeX support and inserting a visual separator between them.

const QuestionRenderer = ({ text }) => {
    if (!text) return null;

    // Teks bacaan dipisahkan dari pertanyaan oleh \n\n
    const parts = text.split('\n\n');

    if (parts.length < 2) {
        // Tidak ada pemisah — render sebagai teks tunggal
        return (
            <div className="text-white/90 leading-relaxed text-[15px]">
                <Latex>{text}</Latex>
            </div>
        );
    }

    const stimulus = parts.slice(0, parts.length - 1).join('\n\n');
    const question = parts[parts.length - 1];

    return (
        <div>
            {/* Teks bacaan / stimulus */}
            <div className="text-white/80 leading-relaxed text-[14px] bg-white/5 border border-white/10 rounded-xl p-4 whitespace-pre-line">
                <Latex>{stimulus}</Latex>
            </div>

            {/* Pemisah */}
            <hr className="my-4 border-white/10" />

            {/* Pertanyaan */}
            <div className="text-white/90 leading-relaxed text-[15px] font-medium">
                <Latex>{question}</Latex>
            </div>
        </div>
    );
};

// ─── MAIN EXAM COMPONENT ──────────────────────────────────────────────────────

export default function Exam({
    auth,
    session,
    subtest,
    sessionSubtest,
    questions,
    savedAnswer,
    allQuestionIds,
    allAnswers,
    allDoubtful,
    sisaWaktu,
    isLastSubtest,
}) {
    const question = questions?.data?.[0];

    // State lokal untuk opsi yang sedang diklik user tapi belum disimpan
    const [opsiSementara, setOpsiSementara] = useState(null);

    // ─── Zustand store ────────────────────────────────────────────────────────
    const {
        initSesi,
        startTimer,
        stopTimer,
        simpanJawabanServer, // Update state lokal & kirim ke server seketika
        hapusJawaban,        // Menghapus state lokal & kirim jawaban kosong
        toggleFlag,
        flushPendingSync,
        jawaban,
        flagged,
        sisaWaktu: waktuStore,
        _pendingSync,
    } = useTryoutStore();

    const hasPendingSync = Object.keys(_pendingSync ?? {}).length > 0;
    const getFormattedTime = () => {
        const mins = Math.floor(waktuStore / 60);
        const secs = waktuStore % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const isFinishing = useRef(false);

    // ─── Callback waktu habis ─────────────────────────────────────────────────
    const handleTimeUp = useCallback(() => {
        handleFinishSubtest(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionSubtest.id]);

    // ─── Init store & Timer Reset on Subtest Change ───────────────────────────
    useEffect(() => {
        // Merge allDoubtful ke flagged di store
        const doubtfulSet = new Set(allDoubtful ?? []);

        initSesi({
            soalList:    questions.data,
            allAnswers:  allAnswers ?? {},
            sisaWaktu,
            halamanAktif: questions.current_page,
            onTimeUp:    handleTimeUp,
            sessionId:   session.id,
        });

        // Set flagged dari server setelah init
        if (doubtfulSet.size > 0) {
            useTryoutStore.setState({ flagged: doubtfulSet });
        }

        startTimer();

        return () => stopTimer();
        // Dependency array mengandung subtest.id agar timer mereset secara instan
        // ketika user pindah ke subtes baru tanpa freeze/nyangkut ke sisa waktu lama.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subtest.id]);

    // Sinkronkan state opsiSementara saat pindah soal (berdasarkan jawaban dari store/server)
    useEffect(() => {
        if (question) {
            setOpsiSementara(jawaban[question.id] ?? null);
        }
    }, [question?.id, jawaban]);

    // ─── Sinkron jawaban dari server ke store ─────────────────────────────────
    useEffect(() => {
        if (savedAnswer?.answer && question?.id) {
            const jawabanLokal = useTryoutStore.getState().jawaban[question.id];
            if (!jawabanLokal) {
                // Saat render awal, kita simpan secara lokal agar tidak nge-trigger sync axios
                useTryoutStore.setState(state => ({
                    jawaban: { ...state.jawaban, [question.id]: savedAnswer.answer }
                }));
            }
        }
    }, [savedAnswer, question?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    // ─── Navigasi ─────────────────────────────────────────────────────────────
    const goToPage = (page) => {
        router.get(
            route('tryout.subtest.show', {
                tryout_id:  session.tryout_id,
                subtest_id: subtest.id,
            }),
            { page },
            { preserveScroll: true, preserveState: false }
        );
    };

    // ─── Memilih opsi tanpa langsung menyimpan ke server ───────────────────────
    const handleSelectOption = (choice) => {
        setOpsiSementara(choice);
    };

    // ─── Aksi: Simpan Jawaban ──────────────────────────────────────────────────
    const handleSaveOption = async () => {
        if (!question || !opsiSementara) return;
        await simpanJawabanServer(question.id, opsiSementara);
    };

    // ─── Aksi: Batalkan Jawaban ────────────────────────────────────────────────
    const handleClearOption = async () => {
        if (!question) return;
        setOpsiSementara(null);
        await hapusJawaban(question.id);
    };

    // ─── Selesaikan subtes (dengan validasi ragu-ragu) ────────────────────────
    const handleFinishSubtest = async (isAuto = false) => {
        if (isFinishing.current) return;

        if (!isAuto) {
            // ── Validasi ragu-ragu ─────────────────────────────────────────
            const { flagged: currentFlagged } = useTryoutStore.getState();
            const doubtfulIds = [...currentFlagged].filter(id =>
                allQuestionIds.includes(id)
            );

            if (doubtfulIds.length > 0) {
                // Cari nomor soal pertama yang masih ragu-ragu
                const firstDoubtfulIndex = allQuestionIds.indexOf(doubtfulIds[0]);
                const firstDoubtfulPage  = firstDoubtfulIndex + 1;

                const goNow = window.confirm(
                    `⚠️ Masih ada ${doubtfulIds.length} jawaban yang ragu-ragu.\n\n` +
                    `Klik OK untuk langsung menuju soal ragu-ragu pertama (No. ${firstDoubtfulPage}), ` +
                    `atau Batal untuk tetap di halaman ini.`
                );

                if (goNow) {
                    goToPage(firstDoubtfulPage);
                }
                return; // Batalkan proses submit
            }

            const confirmed = window.confirm(
                isLastSubtest
                ? 'Ini adalah subtes terakhir. Yakin ingin MENGAKHIRI SELURUH TRYOUT? Soal yang belum dijawab tidak akan dinilai.'
                : 'Yakin ingin mengakhiri subtes ini? Soal yang belum dijawab tidak akan dinilai.'
            );
            if (!confirmed) return;
        }

        isFinishing.current = true;
        stopTimer();

        try {
            await flushPendingSync();
        } catch (err) {
            console.error('[Exam] flushPendingSync error:', err);
        }

        // Jika ini adalah subtes paling akhir dari rangkaian tryout, eksekusi submitExam langsung
        if (isLastSubtest && !isAuto) {
            router.post(
                route('tryout.exam.submit', { session_id: session.id }),
                {},
                {
                    onError: () => {
                        isFinishing.current = false;
                        alert('Terjadi kesalahan saat submit tryout. Silakan coba lagi.');
                    },
                }
            );
        } else {
            // Lanjut ke subtes selanjutnya
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
        }
    };

    // ─── Guard ────────────────────────────────────────────────────────────────
    if (!question) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-space-dark">
                <p className="text-white/40 italic">Soal tidak ditemukan.</p>
            </div>
        );
    }

    // ─── Helpers UI ──────────────────────────────────────────────────────────
    const jawabanSoalIni = jawaban[question.id] ?? null;
    const isFlagged      = flagged.has(question.id);
    const terjawab       = Object.values(jawaban).filter(Boolean).length;
    const raguragu       = [...flagged].filter(id => allQuestionIds.includes(id)).length;
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
            <div className="sticky top-0 z-30 bg-space-dark/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">

                    {/* Nama Subtes + Security Badge */}
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="hidden sm:block w-2 h-5 bg-indigo-500 rounded-full flex-shrink-0" />
                        <h1 className="font-bold text-white truncate text-sm sm:text-base">
                            {subtest.name}
                        </h1>
                        <span title="Waktu diverifikasi oleh server" className="hidden sm:flex items-center gap-1 text-[10px] text-white/30">
                            <ShieldCheckIcon className="w-3 h-3 text-emerald-400" />
                        </span>
                    </div>

                    {/* Progress + Sync */}
                    <div className="hidden md:flex items-center gap-3 text-xs text-white/50">
                        <SyncIndicator hasPending={pendingSync} />
                        <span>
                            <span className="font-semibold text-emerald-400">{terjawab}</span>
                            {' / '}{allQuestionIds.length} dijawab
                        </span>
                        {raguragu > 0 && (
                            <span className="text-amber-400 font-semibold">
                                {raguragu} ragu-ragu
                            </span>
                        )}
                    </div>

                    {/* Timer */}
                    <div className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-sm flex-shrink-0
                        border transition-colors duration-300
                        ${warningTimer
                            ? 'border-red-500/50 bg-red-500/20 text-red-400 animate-pulse'
                            : 'border-white/10 bg-white/5 text-white/80'}
                    `}>
                        <ClockIcon className="w-4 h-4" />
                        {formattedTime}
                    </div>
                </div>
            </div>

            {/* ─── MAIN LAYOUT ─────────────────────────────────────────── */}
            <div className="min-h-[calc(100vh-3.5rem)] py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-5">

                    {/* ══ PANEL SOAL (kiri) ══════════════════════════════ */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">

                            {/* Header nomor soal */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                                <div className="flex items-center gap-2">
                                    <span className="w-8 h-8 bg-indigo-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                                        {questions.current_page}
                                    </span>
                                    <span className="text-sm text-white/50">
                                        dari <span className="font-semibold text-white/80">{questions.total}</span> soal
                                    </span>
                                </div>
                            </div>

                            {/* Gambar soal (opsional) */}
                            {question.question_image && (
                                <div className="px-6 pt-6">
                                    <div className="rounded-xl overflow-hidden border border-white/10">
                                        <img
                                            src={`/storage/${question.question_image}`}
                                            alt="Gambar Soal"
                                            className="max-w-full h-auto"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Teks soal — dengan pemisah stimulus + LaTeX */}
                            <div className="px-6 pt-5 pb-4">
                                <QuestionRenderer text={question.question_text} />
                            </div>

                            {/* Pilihan jawaban */}
                            <div className="px-6 pb-6 space-y-3">
                                {opsiList.map((letter) => {
                                    const ltr = letter.toUpperCase();
                                    return (
                                        <OptionButton
                                            key={letter}
                                            letter={ltr}
                                            text={question[`option_${letter}`]}
                                            isSelected={opsiSementara === ltr && jawabanSoalIni !== ltr}
                                            isSaved={jawabanSoalIni === ltr}
                                            onClick={() => handleSelectOption(ltr)}
                                        />
                                    )
                                })}
                            </div>

                            {/* Navigasi prev / next dan aksi jawaban */}
                            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-white/10 bg-white/5 gap-4">
                                
                                {/* 1. Tombol Sebelumnya */}
                                <button
                                    type="button"
                                    onClick={() => questions.prev_page_url && goToPage(questions.current_page - 1)}
                                    disabled={!questions.prev_page_url}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                                        bg-white/5 border border-white/10 text-white/70
                                        hover:bg-white/10 hover:border-white/20 transition-colors
                                        disabled:opacity-30 disabled:cursor-not-allowed w-full sm:w-auto justify-center flex-shrink-0"
                                >
                                    <ChevronLeft /> Sebelumnya
                                </button>

                                {/* 2. Barisan Tombol Aksi (Simpan, Ragu, Batal) */}
                                <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:flex-1">
                                    <button
                                        type="button"
                                        onClick={handleSaveOption}
                                        disabled={!opsiSementara || jawabanSoalIni === opsiSementara}
                                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        Simpan
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => toggleFlag(question.id)}
                                        className={`
                                            flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors
                                            ${isFlagged
                                                ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
                                                : 'bg-white/5 border-white/10 text-white/70 hover:bg-amber-400/10 hover:border-amber-400/30 hover:text-amber-300'}
                                        `}
                                    >
                                        <FlagIcon filled={isFlagged} className="w-3.5 h-3.5" />
                                        {isFlagged ? 'Ragu-ragu' : 'Tandai Ragu'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleClearOption}
                                        disabled={!opsiSementara && !jawabanSoalIni}
                                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-rose-500/20 border border-rose-500/50 text-rose-300 hover:bg-rose-500/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        Batalkan Pilihan
                                    </button>
                                </div>

                                {/* 3. Tombol Selanjutnya / Selesai */}
                                {questions.current_page === questions.total ? (
                                    <button
                                        type="button"
                                        onClick={() => handleFinishSubtest(false)}
                                        disabled={isFinishing.current}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                                            bg-indigo-500/80 border border-indigo-400/40 text-white
                                            hover:bg-indigo-500 transition-colors w-full sm:w-auto justify-center flex-shrink-0"
                                    >
                                        Selesai Subtes <ChevronRight />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => questions.next_page_url && goToPage(questions.current_page + 1)}
                                        disabled={!questions.next_page_url}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                                            bg-indigo-500/80 border border-indigo-400/40 text-white
                                            hover:bg-indigo-500 transition-colors
                                            disabled:opacity-30 disabled:cursor-not-allowed w-full sm:w-auto justify-center flex-shrink-0"
                                    >
                                        Selanjutnya <ChevronRight />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ══ PANEL SAMPING (kanan) ══════════════════════════ */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 sticky top-20">

                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-4">
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
                            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-white/40 mb-5 pb-5 border-b border-white/10">
                                {[
                                    { color: 'bg-indigo-500',   label: 'Aktif' },
                                    { color: 'bg-emerald-500',  label: 'Dijawab' },
                                    { color: 'bg-amber-400',    label: 'Ragu-ragu' },
                                    { color: 'bg-white/20',     label: 'Belum' },
                                ].map(({ color, label }) => (
                                    <span key={label} className="flex items-center gap-1">
                                        <span className={`w-2.5 h-2.5 rounded-sm ${color}`} />
                                        {label}
                                    </span>
                                ))}
                            </div>

                            {/* Ringkasan */}
                            <div className="mb-5 space-y-1.5 text-sm">
                                <div className="flex justify-between text-white/50">
                                    <span>Dijawab</span>
                                    <span className="font-semibold text-emerald-400">
                                        {terjawab} / {allQuestionIds.length}
                                    </span>
                                </div>
                                <div className="flex justify-between text-white/50">
                                    <span>Belum dijawab</span>
                                    <span className="font-semibold text-white/70">
                                        {allQuestionIds.length - terjawab}
                                    </span>
                                </div>
                                {raguragu > 0 && (
                                    <div className="flex justify-between text-white/50">
                                        <span>Ragu-ragu</span>
                                        <span className="font-semibold text-amber-400">{raguragu}</span>
                                    </div>
                                )}
                                {/* Mobile sync indicator */}
                                <div className="md:hidden pt-1">
                                    <SyncIndicator hasPending={pendingSync} />
                                </div>
                            </div>

                            {/* Peringatan ragu-ragu */}
                            {raguragu > 0 && (
                                <div className="mb-4 p-3 rounded-xl bg-amber-400/10 border border-amber-400/30">
                                    <p className="text-[11px] text-amber-300 font-medium">
                                        ⚠️ {raguragu} soal masih ragu-ragu. Selesaikan sebelum submit!
                                    </p>
                                </div>
                            )}

                            {/* Tombol selesai */}
                            <button
                                type="button"
                                onClick={() => handleFinishSubtest(false)}
                                disabled={isFinishing.current}
                                className="w-full py-3 rounded-xl text-sm font-bold
                                    bg-rose-500/20 border border-rose-500/40 text-rose-300
                                    hover:bg-rose-500/30 hover:border-rose-400/60
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