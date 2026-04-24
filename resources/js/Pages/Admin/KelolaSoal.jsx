import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function KelolaSoal({ auth }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            // header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Manajemen Bank Soal</h2>}
        >
            <Head title="Kelola Soal" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium">Daftar Soal UTBK</h3>
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                                + Tambah Soal Baru
                            </button>
                        </div>

                        {/* Placeholder Tabel */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="p-3">No</th>
                                        <th className="p-3">Materi</th>
                                        <th className="p-3">Tingkat Kesulitan</th>
                                        <th className="p-3 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="p-3 border-b" colSpan="4 text-center">Belum ada data soal.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}