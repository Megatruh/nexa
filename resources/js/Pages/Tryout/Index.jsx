import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ auth }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            // header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Pusat Try Out UTBK</h2>}
        >
            <Head title="Try Out" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row items-center justify-between">
                                <div className="mb-6 md:mb-0">
                                    <h3 className="text-2xl font-bold text-gray-900">Simulasi Nasional Batch #1</h3>
                                    <p className="text-gray-600">Waktu: 195 Menit | 7 Subtest</p>
                                </div>
                                <button className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition shadow-lg">
                                    KERJAKAN SEKARANG
                                </button>
                            </div>

                            <div className="mt-8 border-t pt-6">
                                <h4 className="font-semibold mb-4">Riwayat Try Out Kamu:</h4>
                                <p className="text-gray-400 italic text-sm">Belum ada riwayat ujian yang tercatat.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}