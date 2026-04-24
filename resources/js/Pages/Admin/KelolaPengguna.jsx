import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function KelolaPengguna({ auth }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            // header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Manajemen Pengguna</h2>}
        >
            <Head title="Kelola Pengguna" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg border border-gray-100">
                        <h3 className="text-lg font-medium mb-4">Data Siswa Terdaftar</h3>
                        
                        {/* Contoh Tampilan List Sederhana */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-bold">Contoh Siswa</p>
                                    <p className="text-sm text-gray-500">siswa@example.com</p>
                                </div>
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Aktif</span>
                            </div>
                            <p className="text-center text-gray-400 py-4 italic">Gunakan bagian ini untuk memantau pendaftar baru.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}