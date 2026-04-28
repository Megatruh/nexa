import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, activeTryouts, history }) {
    return (
        <AuthenticatedLayout
            auth={auth}
        >
            <Head title="Try Out" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 px-4 sm:px-0">Daftar Try Out Tersedia</h2>
                    
                    {/* Daftar Try Out Aktif */}
                    <div className="grid gap-6">
                        {activeTryouts.length > 0 ? (
                            activeTryouts.map((tryout) => (
                                <div key={tryout.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-8">
                                        <div className="flex flex-col md:flex-row items-center justify-between">
                                            <div className="mb-6 md:mb-0">
                                                <h3 className="text-2xl font-bold text-gray-900">{tryout.name}</h3>
                                                <p className="text-gray-600">
                                                    {tryout.description || 'Simulasi persiapan UTBK'}
                                                </p>
                                                {/* Asumsi kita mengirim jumlah subtest dari backend */}
                                                <div className="flex gap-4 mt-2 text-sm font-medium text-green-600">
                                                    <span>✓ {tryout.subtests_count || 0} Subtes</span>
                                                    <span>• Tersedia Sekarang</span>
                                                </div>
                                            </div>
                                            
                                            {/* Link ini mengarah ke subtes pertama dari Tryout ini */}
                                            <Link 
                                                href={route('tryout.subtest.show', { tryout_id: tryout.id, subtest_id: tryout.first_subtest_id || 1 })}
                                                className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition shadow-lg text-center"
                                            >
                                                KERJAKAN SEKARANG
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white p-8 text-center rounded-lg shadow-sm">
                                <p className="text-gray-500 italic">Belum ada Try Out yang dibuka saat ini.</p>
                            </div>
                        )}
                    </div>

                    {/* Bagian Riwayat */}
                    <div className="mt-12 bg-white overflow-hidden shadow-sm sm:rounded-lg">
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
                                                <th className="pb-4 font-medium">Skor Total</th>
                                                <th className="pb-4 font-medium">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {history.map((session) => (
                                                <tr key={session.id} className="text-gray-700">
                                                    <td className="py-4 font-semibold">{session.tryout.name}</td>
                                                    <td className="py-4 text-sm">
                                                        {new Date(session.created_at).toLocaleDateString('id-ID')}
                                                    </td>
                                                    <td className="py-4">
                                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold">
                                                            {session.total_score || '0'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 text-blue-600 hover:underline cursor-pointer">
                                                        Lihat Pembahasan
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-400 italic text-sm">Belum ada riwayat ujian yang tercatat.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}