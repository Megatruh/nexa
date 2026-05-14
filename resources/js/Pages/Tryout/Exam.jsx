import React, { useEffect, useCallback } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useTryoutStore } from '@/_store/tryOutStore';

// ─── ICON HELPERS ────────────────────────────────────────────────────────────

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

// ─── OPTION BUTTON ───────────────────────────────────────────────────────────

const OptionButton = ({ letter, text, isSelected, onClick }) => {
    const base = 'w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150 group';
    const selected = 'border-blue-500 bg-blue-50 shadow-sm shadow-blue-100';
    const unselected = 'border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50/40';

    return (
        <button onClick={onClick} className={`${base} ${isSelected ? selected : unselected}`}>
            <span className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                transition-colors duration-150
                ${isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'}
            `}>
                {letter}
            </span>
            <span className={`pt-1 text-sm leading-relaxed ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>
                {text}
            </span>
        </button>
    );
};

// ─── NOMOR SOAL BUTTON ───────────────────────────────────────────────────────

const NomorSoal = ({ nomor, status, onClick }) => {
    // status: 'aktif' | 'dijawab' | 'ragu' | 'belum'
    const styles = {
        aktif:   'bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-1',
        dijawab: 'bg-emerald-500 text-white',
        ragu:    'bg-amber-400 text-white',
        belum:   'bg-gray-100 text-gray-500 hover:bg-gray-200',
    };

    return (
        <button
            onClick={onClick}
            className={`w-9 h-9 rounded-lg text-xs font-bold transition-all duration-100 ${styles[status]}`}
        >
            {nomor}
        </button>
    );
};

// ─── MAIN EXAM COMPONENT ─────────────────────────────────────────────────────

export default function Exam({
    auth,
    session,
    subtest,
    sessionSubtest,
    questions,       // LengthAwarePaginator dari Laravel (1 soal per page)
    savedAnswer,     // Jawaban tersimpan untuk soal halaman ini
    allQuestionIds,  // Semua ID soal untuk navigasi nomor
    allAnswers,      // { [questionId]: answer } — semua jawaban user di subtes ini
    sisaWaktu,       // Sisa waktu (detik) dari server
}) {
    const question = questions?.data?.[0];

    // ─── Zustand store ───
    const {
        initSesi,
        startTimer,
        stopTimer,
        simpanJawaban,
        toggleFlag,
        jawaban,
        flagged,
        currentIndex,
        goToSoal,
        getFormattedTime,
        sisaWaktu: waktuStore,
        getSoalAktif,
    } = useTryoutStore();

    // ─── Callback waktu habis ───
    const handleTimeUp = useCallback(() => {
        router.post(route('tryout.subtest.finish', { session_subtest_id: sessionSubtest.id }));
    }, [sessionSubtest.id]);

    // ─── Init store saat mount / ganti halaman ───
    useEffect(() => {
        initSesi({
            soalList:     questions.data,
            allAnswers:   allAnswers ?? {},
            sisaWaktu,
            halamanAktif: questions.current_page,
            onTimeUp:     handleTimeUp,
        });
        startTimer();

        return () => stopTimer();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    // NB: dependency kosong agar timer tidak restart saat Inertia partial reload

    // Sinkronkan jawaban tersimpan dari server ke store
    useEffect(() => {
        if (savedAnswer?.answer && question?.id) {
            simpanJawaban(question.id, savedAnswer.answer);
        }
    }, [savedAnswer, question?.id]);

    // ─── Navigasi ke halaman soal tertentu (via Inertia) ───
    const goToPage = (page) => {
        router.get(
            route('tryout.subtest.show', { tryout_id: session.tryout_id, subtest_id: subtest.id }),
            { page },
            { preserveScroll: true, preserveState: false }
        );
    };

    // ─── Simpan jawaban (store + server) ───
    const handleAnswer = (choice) => {
        if (!question) return;
        simpanJawaban(question.id, choice);
        router.post(
            route('tryout.answer.store'),
            {
                tryout_session_id:  session.id,
                tryout_question_id: question.id,
                answer:             choice,
            },
            { preserveScroll: true, preserveState: true }
        );
    };

    // ─── Selesaikan subtes ───
    const handleFinishSubtest = (isAuto = false) => {
        if (!isAuto && !window.confirm('Yakin ingin mengakhiri subtes ini? Soal yang belum dijawab tidak akan dinilai.')) return;
        stopTimer();
        router.post(route('tryout.subtest.finish', { session_subtest_id: sessionSubtest.id }));
    };

    if (!question) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p className="text-gray-400 italic">Soal tidak ditemukan.</p>
            </div>
        );
    }

    // ─── Helpers UI ───
    const jawabanSoalIni = jawaban[question.id] ?? null;
    const isFlagged      = flagged.has(question.id);
    const terjawab       = Object.values(jawaban).filter(Boolean).length;
    const warningTimer   = waktuStore < 60;
    const formattedTime  = getFormattedTime();

    const getNomorStatus = (id, idx) => {
        if (questions.current_page === idx + 1) return 'aktif';
        if (flagged.has(id)) return 'ragu';
        if (jawaban[id]) return 'dijawab';
        return 'belum';
    };

    const opsiList = ['a', 'b', 'c', 'd', 'e'];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Ujian — ${subtest.name}`} />

            {/* ─── TOP BAR ─────────────────────────────────────────────── */}
            <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
                    {/* Nama Subtes */}
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="hidden sm:block w-2 h-5 bg-blue-500 rounded-full flex-shrink-0" />
                        <h1 className="font-bold text-gray-800 truncate text-sm sm:text-base">{subtest.name}</h1>
                    </div>

                    {/* Progress */}
                    <div className="hidden md:flex items-center gap-1 text-xs text-gray-500">
                        <span className="font-semibold text-emerald-600">{terjawab}</span>
                        <span>/</span>
                        <span>{allQuestionIds.length} dijawab</span>
                    </div>

                    {/* Timer */}
                    <div className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-sm flex-shrink-0
                        transition-colors duration-300
                        ${warningTimer ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-gray-50 text-gray-700'}
                    `}>
                        <ClockIcon className="w-4 h-4" />
                        {formattedTime}
                    </div>
                </div>
            </div>

            {/* ─── MAIN LAYOUT ──────────────────────────────────────────── */}
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

                            {/* Teks soal */}
                            <div className="px-6 pt-6 pb-4">
                                {question.question_image && (
                                    <div className="mb-5 rounded-xl overflow-hidden border border-gray-100">
                                        <img
                                            src={`/storage/${question.question_image}`}
                                            alt="Gambar Soal"
                                            className="max-w-full h-auto"
                                        />
                                    </div>
                                )}
                                <p className="text-gray-800 leading-relaxed text-[15px]">
                                    {question.question_text}
                                </p>
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

                            {/* Judul navigasi */}
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
                                    { color: 'bg-blue-600', label: 'Aktif' },
                                    { color: 'bg-emerald-500', label: 'Dijawab' },
                                    { color: 'bg-amber-400', label: 'Ragu-ragu' },
                                    { color: 'bg-gray-200', label: 'Belum' },
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
                            </div>

                            {/* Tombol selesai */}
                            <button
                                onClick={() => handleFinishSubtest(false)}
                                className="w-full py-3 rounded-xl text-sm font-bold
                                    bg-red-50 text-red-600 border border-red-100
                                    hover:bg-red-100 hover:border-red-200
                                    active:scale-[0.98] transition-all duration-150"
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