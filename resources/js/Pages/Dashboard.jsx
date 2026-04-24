import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({auth}) {
    return (
        <AuthenticatedLayout
            // header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Beranda Siswa</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Card Utama */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-2xl font-bold mb-4">Selamat Datang di NEXA!</h3>
                            <p className="mb-6">Siap untuk memulai simulasi UTBK hari ini?</p>
                            
                            <div className="flex space-x-4">
                                <Link
                                    href={route('subtests.index')}
                                    className="px-4 py-2 border border-indigo-600 bg-white text-gray-900 rounded-md hover:bg-indigo-700/9 transition"
                                >
                                    Mulai Belajar
                                </Link>

                                <Link
                                    href={auth.user ? route('tryout.index') : route('login')}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                                >
                                    Mulai Try Out
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}