import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

// ─── ICONS ───────────────────────────────────────────────────────────────────

const ArrowRightIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const RefreshIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

const XIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────

// Helper function untuk menghitung waktu relatif (diffForHumans)
const diffForHumans = (date) => {
    const now = new Date();
    const pastDate = new Date(date);
    const seconds = Math.floor((now - pastDate) / 1000);

    const intervals = {
        tahun: 31536000,
        bulan: 2592000,
        minggu: 604800,
        hari: 86400,
        jam: 3600,
        menit: 60,
    };

    for (const [key, value] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / value);
        if (interval >= 1) {
            return `${interval} ${key}${interval > 1 ? '' : ''} yang lalu`;
        }
    }

    return 'Baru saja';
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function Index({ auth, activeTryouts, history, studyPrograms }) {
    const [showChoiceModal, setShowChoiceModal] = useState(false);
    const [selectedTryout, setSelectedTryout]   = useState(null);
    const [isRetry, setIsRetry]                 = useState(false);

    const choiceForm = useForm({
        tryout_id:   '',
        choice_1_id: '',
        choice_2_id: '',
    });

    const handleStartTryout = (tryout, retry = false) => {
        setSelectedTryout(tryout);
        setIsRetry(retry);
        choiceForm.setData('tryout_id', tryout.id);
        setShowChoiceModal(true);
    };

    const submitChoices = (e) => {
        e.preventDefault();
        choiceForm.post(route('tryout.choices.store'), {
            onSuccess: () => setShowChoiceModal(false),
        });
    };

    const closeModal = () => {
        setShowChoiceModal(false);
        choiceForm.reset();
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Try Out" />

            <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">

                {/* ── HEADER ─────────────────────────────────────────────── */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-white">Daftar Try Out</h1>
                    <p className="mt-1 text-sm text-white/50">
                        Simulasi UTBK SNBT untuk mengukur kesiapan belajarmu.
                    </p>
                </div>

                {/* ── DAFTAR TRYOUT AKTIF ────────────────────────────────── */}
                <div className="grid gap-5">
                    {activeTryouts.length > 0 ? (
                        activeTryouts.map((tryout) => (
                            <div
                                key={tryout.id}
                                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 sm:p-8 transition-all hover:border-white/20"
                            >
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h2 className="text-xl font-bold text-white">{tryout.name}</h2>
                                            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300">
                                                Batch {tryout.batch || 1}
                                            </span>
                                            {tryout.is_completed_by_user && (
                                                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center gap-1">
                                                    <CheckCircleIcon />
                                                    Sudah Dikerjakan
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-white/60 mb-3 text-sm">
                                            {tryout.description || 'Simulasi persiapan UTBK SNBT'}
                                        </p>
                                        <div className="flex gap-4 text-xs font-medium text-white/50">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {tryout.subtests_count || 0} Subtes
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                Tersedia Sekarang
                                            </span>
                                        </div>
                                    </div>

                                    {/* Tombol Aksi */}
                                    <div className="w-full md:w-auto flex-shrink-0 flex flex-col sm:flex-row md:flex-col gap-2">
                                        {tryout.has_active_session ? (
                                            // Ada sesi yang sedang berlangsung — tombol lanjutkan
                                            <Link
                                                href={route('tryout.choices.store')}
                                                onClick={(e) => { e.preventDefault(); handleStartTryout(tryout); }}
                                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold
                                                    bg-amber-400/20 border border-amber-400/40 text-amber-300
                                                    hover:bg-amber-400/30 hover:border-amber-400/60 transition-all duration-200 active:scale-95"
                                            >
                                                Lanjutkan Ujian <ArrowRightIcon />
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={() => handleStartTryout(tryout, false)}
                                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold
                                                    bg-indigo-500/80 border border-indigo-400/40 text-white
                                                    hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-900/30 transition-all duration-200 active:scale-95"
                                            >
                                                Kerjakan Sekarang <ArrowRightIcon />
                                            </button>
                                        )}

                                        {/* Tombol Kerjakan Ulang jika sudah selesai */}
                                        {tryout.is_completed_by_user && (
                                            <button
                                                onClick={() => handleStartTryout(tryout, true)}
                                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold
                                                    bg-white/5 border border-white/10 text-white/60
                                                    hover:bg-white/10 hover:border-white/20 hover:text-white/80 transition-all duration-200 active:scale-95"
                                            >
                                                <RefreshIcon /> Kerjakan Ulang
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                            <div className="text-4xl mb-3">🎯</div>
                            <p className="text-white/60 font-medium">Belum ada Try Out yang dibuka saat ini.</p>
                            <p className="text-white/30 text-sm mt-1">Pantau terus halaman ini untuk Try Out berikutnya!</p>
                        </div>
                    )}
                </div>

                {/* ── RIWAYAT TRY OUT ──────────────────────────────────── */}
                <div className="mt-12">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="w-1 h-6 bg-indigo-500 rounded-full" />
                        <h2 className="text-lg font-semibold text-white">Riwayat Try Out</h2>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
                        {history.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-white/40">
                                            <th className="px-6 py-4 font-medium">Nama Try Out</th>
                                            <th className="px-6 py-4 font-medium">Pilihan Jurusan</th>
                                            <th className="px-6 py-4 font-medium">Status</th>
                                            <th className="px-6 py-4 font-medium">Skor</th>
                                            <th className="px-6 py-4 font-medium">Hasil</th>
                                            <th className="px-6 py-4 font-medium"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {history.map((session) => (
                                            <tr key={session.id} className="text-white/80 hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-white">
                                                    {session.tryout?.name || '-'}
                                                </td>
                                                {/* KOLOM PILIHAN JURUSAN (sebelumnya: Tanggal) */}
                                                <td className="px-6 py-4 text-white/70">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-bold bg-indigo-500/30 border border-indigo-400/50 text-indigo-300 w-5 h-5 rounded-full flex items-center justify-center">1</span>
                                                            <span className="text-sm font-medium">{session.choice1?.name || '-'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-bold bg-white/10 border border-white/20 text-white/50 w-5 h-5 rounded-full flex items-center justify-center">2</span>
                                                            <span className="text-sm">{session.choice2?.name || '-'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {session.status === 'selesai' ? (
                                                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
                                                            Selesai
                                                        </span>
                                                    ) : (
                                                        <Link
                                                            href={route('tryout.subtest.show', {
                                                                tryout_id:  session.tryout_id,
                                                                subtest_id: session.last_subtest_id || session.tryout?.first_subtest_id || 1,
                                                            })}
                                                            className="text-amber-400 hover:text-amber-300 text-sm font-semibold inline-flex items-center gap-1 transition-colors"
                                                        >
                                                            Lanjutkan
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                            </svg>
                                                        </Link>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {session.status === 'selesai' ? (
                                                        <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 rounded-lg font-bold text-xs">
                                                            {session.total_score ?? '0'}
                                                        </span>
                                                    ) : (
                                                        <span className="text-white/30">-</span>
                                                    )}
                                                </td>
                                                {/* KOLOM HASIL (sebelumnya dengan header) - SEKARANG TANPA HEADER */}
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-2">
                                                        {session.admission_status === 'Lulus' ? (
                                                            <div>
                                                                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center gap-1 w-max">
                                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                    Lulus
                                                                </span>
                                                                {session.admitted_program && (
                                                                    <p className="text-[11px] text-white/40 mt-1.5 font-medium max-w-[150px] leading-tight">
                                                                        {session.admitted_program}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ) : session.admission_status === 'Tidak Lulus' ? (
                                                            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300">
                                                                Tidak Lulus
                                                            </span>
                                                        ) : (
                                                            <span className="text-white/30">-</span>
                                                        )}
                                                        
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {/* TAMPILKAN KAPAN DIKERJAKAN DENGAN diffForHumans */}
                                                        <p className="text-[11px] text-white/40 font-medium mt-1">
                                                            {session.finished_at ? diffForHumans(session.finished_at) : diffForHumans(session.created_at)}
                                                        </p>
                                                    {/* {session.status === 'selesai' ? (
                                                        <Link
                                                            href={route('tryout.result', { session_id: session.id })}
                                                            className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold inline-flex items-center gap-1 transition-colors"
                                                        >
                                                            Lihat Hasil
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </Link>
                                                    ) : (
                                                        <Link
                                                            href={route('tryout.subtest.show', {
                                                                tryout_id:  session.tryout_id,
                                                                subtest_id: session.last_subtest_id || session.tryout?.first_subtest_id || 1,
                                                            })}
                                                            className="text-amber-400 hover:text-amber-300 text-sm font-semibold inline-flex items-center gap-1 transition-colors"
                                                        >
                                                            Lanjutkan
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                            </svg>
                                                        </Link>
                                                    )} */}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="text-5xl mb-4">📝</div>
                                <p className="text-white/50 font-medium">Belum ada riwayat ujian.</p>
                                <p className="text-white/30 text-sm mt-1">
                                    Mulai kerjakan try out di atas!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── MODAL PEMILIHAN JURUSAN ─────────────────────────────── */}
            {showChoiceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-space-dark/80 px-4 py-10 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-space-mid/90 backdrop-blur-md p-6 text-white shadow-2xl">
                        {/* Header modal */}
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    {isRetry ? 'Kerjakan Ulang Try Out' : 'Pilih Program Studi'}
                                </h2>
                                <p className="mt-1 text-sm text-white/50">
                                    {isRetry ? 'Sesi baru akan dibuat. ' : ''}
                                    Simulasi kelulusan passing grade untuk{' '}
                                    <span className="text-white/80 font-semibold">{selectedTryout?.name}</span>.
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-white/40 hover:text-white/80 transition-colors p-1"
                            >
                                <XIcon />
                            </button>
                        </div>

                        <form onSubmit={submitChoices}>
                            <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4">
                                {/* Pilihan 1 */}
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-indigo-500/30 border border-indigo-400/50 text-indigo-300 text-[10px] font-bold">1</span>
                                        Pilihan Utama (Prioritas)
                                    </label>
                                    <select
                                        value={choiceForm.data.choice_1_id}
                                        onChange={(e) => choiceForm.setData('choice_1_id', e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-space-dark/60 px-3 py-2.5 text-sm text-white focus:border-indigo-400 focus:outline-none focus:ring-0"
                                        required
                                    >
                                        <option value="" className="bg-gray-900">-- Pilih Program Studi --</option>
                                        {(studyPrograms ?? []).map((p) => (
                                            <option key={p.id} value={p.id} className="bg-gray-900">
                                                {p.name}{(p.passing_grade_min || p.passing_grade_max) ? ` (PG: ${p.passing_grade_min}–${p.passing_grade_max})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    {choiceForm.errors.choice_1_id && (
                                        <p className="text-rose-400 text-xs mt-1">{choiceForm.errors.choice_1_id}</p>
                                    )}
                                </div>

                                {/* Pilihan 2 */}
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 flex items-center gap-2">
                                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-white/10 border border-white/20 text-white/50 text-[10px] font-bold">2</span>
                                        Pilihan Cadangan
                                    </label>
                                    <select
                                        value={choiceForm.data.choice_2_id}
                                        onChange={(e) => choiceForm.setData('choice_2_id', e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-space-dark/60 px-3 py-2.5 text-sm text-white focus:border-indigo-400 focus:outline-none focus:ring-0"
                                        required
                                    >
                                        <option value="" className="bg-gray-900">-- Pilih Program Studi --</option>
                                        {(studyPrograms ?? [])
                                            .filter((p) => String(p.id) !== String(choiceForm.data.choice_1_id))
                                            .map((p) => (
                                                <option key={p.id} value={p.id} className="bg-gray-900">
                                                    {p.name}{(p.passing_grade_min || p.passing_grade_max) ? ` (PG: ${p.passing_grade_min}–${p.passing_grade_max})` : ''}
                                                </option>
                                            ))}
                                    </select>
                                    {choiceForm.errors.choice_2_id && (
                                        <p className="text-rose-400 text-xs mt-1">{choiceForm.errors.choice_2_id}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-3 rounded-xl text-sm font-bold border border-white/10 text-white/60 hover:bg-white/5 hover:text-white/80 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={choiceForm.processing}
                                    className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-indigo-500/80 border border-indigo-400/40 text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {choiceForm.processing ? 'Memproses...' : (isRetry ? 'Mulai Ulang' : 'Mulai Tryout')}
                                    {!choiceForm.processing && <ArrowRightIcon />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}