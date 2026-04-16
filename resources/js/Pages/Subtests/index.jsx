import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ subtests }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Daftar Subtes UTBK
                </h2>
            }
        >
            <Head title="Subtest" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subtests.map((subtest) => (
                            <div 
                                key={subtest.id} 
                                className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-all cursor-pointer"
                            >
                                <div className="p-6 text-gray-900 dark:text-gray-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                            {subtest.name}
                                        </h3>
                                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">
                                            {subtest.questions_count} Soal
                                        </span>
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">
                                        {subtest.description || 'Belum ada deskripsi untuk subtes ini.'}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="text-xs text-gray-500">
                                            {subtest.learning_materials_count} Materi Pembelajaran
                                        </div>
                                        <button className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 transition ease-in-out duration-150">
                                            Mulai Belajar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// export default function Index({ subtests }) {
//     return (
//         <div className="p-10">
//             <h1>Halo Han! Datanya ada {subtests.length}</h1>
//         </div>
//     );
// }