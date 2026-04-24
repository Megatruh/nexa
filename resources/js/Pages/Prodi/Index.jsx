import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ auth }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            // header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Ulasan Program Studi</h2>}
        >
            <Head title="Ulasan Prodi" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Placeholder pencarian */}
                        <div className="md:col-span-3 bg-white p-4 rounded-lg shadow-sm">
                            <input 
                                type="text" 
                                placeholder="Cari prodi (misal: Informatika)..." 
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Contoh Card Prodi */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition border border-gray-100">
                                <h4 className="font-bold text-lg text-indigo-600">Informatika</h4>
                                <p className="text-sm text-gray-500">Universitas Siliwangi</p>
                                <div className="mt-4 flex justify-between text-sm">
                                    <span>Daya Tampung: 120</span>
                                    <span className="text-orange-500 font-medium">Keketatan Tinggi</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}