import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ auth }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            // header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Cek Kesesuaian Jurusan</h2>}
        >
            <Head title="Kesesuaian Jurusan" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="text-center py-10">
                            <div className="mb-4 inline-flex p-3 rounded-full bg-indigo-100 text-indigo-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Temukan Jurusan Impianmu</h3>
                            <p className="mt-2 text-gray-600">Analisis nilai tryout dan minatmu untuk melihat kecocokan dengan program studi di UNSIL.</p>
                            <button className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                                Mulai Analisis
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}