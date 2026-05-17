import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ auth, activeTryouts, history, studyPrograms }) {
    // State untuk modal pemilihan jurusan
    const [showChoiceModal, setShowChoiceModal] = useState(false);
    const [selectedTryout, setSelectedTryout] = useState(null);

    const choiceForm = useForm({
        tryout_id: '',
        choice_1_id: '',
        choice_2_id: '',
    });

    const handleStartTryout = (tryout) => {
        setSelectedTryout(tryout);
        choiceForm.setData('tryout_id', tryout.id);
        setShowChoiceModal(true);
    };

    const submitChoices = (e) => {
        e.preventDefault();
        choiceForm.post(route('tryout.choices.store'), {
            onSuccess: () => setShowChoiceModal(false),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Try Out" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 px-4 sm:px-0">Daftar Try Out Tersedia</h2>

                    {/* ═══ DAFTAR TRY OUT AKTIF ═══ */}
                    <div className="grid gap-6">
                        {activeTryouts.length > 0 ? (
                            activeTryouts.map((tryout) => (
                                <div key={tryout.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-8">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                            {/* Informasi Try Out di Kiri */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-2xl font-bold text-gray-900">{tryout.name}</h3>
                                                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                                                        Batch {tryout.batch || 1}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mb-3">
                                                    {tryout.description || 'Simulasi persiapan UTBK'}
                                                </p>
                                                <div className="flex gap-4 text-sm font-medium text-emerald-600">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {tryout.subtests_count || 0} Subtes
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                        </svg>
                                                        Tersedia Sekarang
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Tombol Kerjakan di Kanan */}
                                            <div className="w-full md:w-auto flex-shrink-0">
                                                {tryout.is_completed_by_user ? (
                                                    <div className="text-center md:text-right">
                                                        <span className="inline-block px-6 py-3 bg-gray-100 text-gray-500 rounded-lg font-bold text-sm">
                                                            ✓ Sudah Dikerjakan
                                                        </span>
                                                        <p className="text-xs text-gray-400 mt-2">
                                                            Tunggu batch selanjutnya
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleStartTryout(tryout)}
                                                        className="w-full md:w-auto px-8 py-3.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                                                    >
                                                        KERJAKAN SEKARANG
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white p-8 text-center rounded-lg shadow-sm border border-gray-100">
                                <p className="text-gray-500 italic">Belum ada Try Out yang dibuka saat ini.</p>
                            </div>
                        )}
                    </div>

                    {/* ═══ RIWAYAT TRY OUT ═══ */}
                    <div className="mt-12 bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                        <div className="p-8">
                            <h4 className="font-semibold text-lg mb-6 flex items-center gap-2">
                                <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                                Riwayat Try Out Kamu
                            </h4>

                            {history.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-gray-400 text-sm border-b">
                                                <th className="pb-4 font-medium">Nama Try Out</th>
                                                <th className="pb-4 font-medium">Tanggal</th>
                                                <th className="pb-4 font-medium">Status</th>
                                                <th className="pb-4 font-medium">Skor Total</th>
                                                <th className="pb-4 font-medium">Hasil</th>
                                                <th className="pb-4 font-medium">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {history.map((session) => (
                                                <tr key={session.id} className="text-gray-700">
                                                    <td className="py-4 font-semibold">
                                                        {session.tryout?.name || '-'}
                                                    </td>
                                                    <td className="py-4 text-sm">
                                                        {new Date(session.created_at).toLocaleDateString('id-ID')}
                                                    </td>
                                                    <td className="py-4">
                                                        {session.status === 'selesai' ? (
                                                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200">
                                                                Selesai
                                                            </span>
                                                        ) : (
                                                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                                                                Belum Selesai ({session.completed_subtests || 0}/{session.total_subtests || 0})
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-4">
                                                        {session.status === 'selesai' ? (
                                                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-bold border border-blue-100">
                                                                {session.total_score || '0'}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">-</span>
                                                        )}
                                                    </td>
                                                    <td className="py-4">
                                                        {session.admission_status === 'Lulus' ? (
                                                            <div>
                                                                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-max">
                                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                    Lulus
                                                                </span>
                                                                <p className="text-[11px] text-gray-500 mt-1.5 font-medium max-w-[150px] leading-tight">
                                                                    {session.admitted_program}
                                                                </p>
                                                            </div>
                                                        ) : session.admission_status === 'Tidak Lulus' ? (
                                                            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-600 border border-red-200">
                                                                Tidak Lulus
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">-</span>
                                                        )}
                                                    </td>
                                                    <td className="py-4">
                                                        {session.status === 'selesai' ? (
                                                            <Link
                                                                href={route('tryout.result', { session_id: session.id })}
                                                                className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-semibold inline-flex items-center gap-1"
                                                            >
                                                                Lihat Pembahasan
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </Link>
                                                        ) : (
                                                            <Link
                                                                href={route('tryout.subtest.show', {
                                                                    tryout_id: session.tryout_id,
                                                                    subtest_id: session.last_subtest_id || session.tryout?.first_subtest_id || 1,
                                                                })}
                                                                className="text-amber-600 hover:text-amber-800 hover:underline text-sm font-semibold inline-flex items-center gap-1"
                                                            >
                                                                Lanjutkan Ujian
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                                </svg>
                                                            </Link>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-gray-50/50 rounded-xl border border-gray-100 border-dashed">
                                    <div className="text-4xl mb-3">📝</div>
                                    <p className="text-gray-500 font-medium">
                                        Belum ada riwayat ujian yang tercatat.
                                    </p>
                                    <p className="text-gray-400 text-sm mt-1">
                                        Mulai kerjakan try out di atas untuk melihat riwayatmu.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ MODAL PEMILIHAN JURUSAN ═══ */}
            <Modal show={showChoiceModal} onClose={() => setShowChoiceModal(false)} maxWidth="lg">
                <form onSubmit={submitChoices} className="p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Pilih Program Studi
                        </h2>
                        <p className="text-sm text-gray-500">
                            Pilih jurusan untuk simulasi kelulusan passing grade pada ujian{' '}
                            <strong className="text-gray-700">{selectedTryout?.name}</strong>.
                        </p>
                    </div>

                    <div className="space-y-5 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs">1</span>
                                Pilihan Utama (Prioritas)
                            </label>
                            <select
                                value={choiceForm.data.choice_1_id}
                                onChange={(e) => choiceForm.setData('choice_1_id', e.target.value)}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5"
                                required
                            >
                                <option value="">-- Pilih Program Studi --</option>
                                {(studyPrograms ?? []).map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} {(p.passing_grade_min || p.passing_grade_max) ? `(PG: ${p.passing_grade_min} - ${p.passing_grade_max})` : ''}
                                    </option>
                                ))}
                            </select>
                            {choiceForm.errors.choice_1_id && (
                                <p className="text-red-500 text-xs mt-1">{choiceForm.errors.choice_1_id}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs">2</span>
                                Pilihan Cadangan
                            </label>
                            <select
                                value={choiceForm.data.choice_2_id}
                                onChange={(e) => choiceForm.setData('choice_2_id', e.target.value)}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5"
                                required
                            >
                                <option value="">-- Pilih Program Studi --</option>
                                {(studyPrograms ?? []).filter(p => String(p.id) !== String(choiceForm.data.choice_1_id)).map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} {(p.passing_grade_min || p.passing_grade_max) ? `(PG: ${p.passing_grade_min} - ${p.passing_grade_max})` : ''}
                                    </option>
                                ))}
                            </select>
                            {choiceForm.errors.choice_2_id && (
                                <p className="text-red-500 text-xs mt-1">{choiceForm.errors.choice_2_id}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            type="button"
                            onClick={() => setShowChoiceModal(false)}
                            className="px-5 py-3 rounded-xl text-sm font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={choiceForm.processing}
                            className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {choiceForm.processing ? 'Memproses...' : 'Mulai Tryout'}
                            {!choiceForm.processing && (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}