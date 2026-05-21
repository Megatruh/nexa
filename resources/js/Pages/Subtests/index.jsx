import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Modal from '@/Components/Modal'; // Menggunakan komponen Modal bawaan Laravel Breeze

export default function Index({ subtests }) {
    // State untuk menyimpan subtes mana yang sedang di-klik tombol "Mulai Belajar"-nya
    const [selectedSubtest, setSelectedSubtest] = useState(null);

    // Fungsi untuk menutup Modal
    const closeModal = () => {
        setSelectedSubtest(null);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Subtest" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subtests.map((subtest) => (
                            <div
                                key={subtest.id}
                                className="overflow-hidden bg-white shadow-sm sm:rounded-lg border border-gray-200 hover:border-indigo-300 transition-all flex flex-col"
                            >
                                {/* BAGIAN ATAS CARD */}
                                <div className="p-6 text-gray-900 flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-bold text-indigo-600 ">
                                            {subtest.name}
                                        </h3>
                                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                            {subtest.questions_count} Soal
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                                        {subtest.description || 'Belum ada deskripsi untuk subtes ini.'}
                                    </p>
                                </div>

                                {/* BAGIAN BAWAH CARD (TOMBOL) */}
                                <div className="p-6 pt-0 mt-auto bg-white border-t border-gray-50">
                                    <div className="flex items-center justify-between pt-4">
                                        <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                                            {subtest.learning_materials_count} Materi
                                        </div>
                                        <button
                                            // Saat diklik, simpan data subtest ini ke state
                                            onClick={() => setSelectedSubtest(subtest)}
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 transition ease-in-out duration-150 shadow-sm hover:shadow cursor-pointer"
                                        >
                                            Mulai Belajar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* MODAL POP-UP UNTUK MENAMPILKAN MATERI */}
            <Modal show={selectedSubtest !== null} onClose={closeModal}>
                {selectedSubtest && (
                    <div className="p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                            Materi Belajar: {selectedSubtest.name}
                        </h2>

                        {/* Cek apakah ada materinya */}
                        {selectedSubtest.learning_materials && selectedSubtest.learning_materials.length > 0 ? (
                            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-2">
                                {selectedSubtest.learning_materials.map((material) => (
                                    <a
                                        key={material.id}
                                        href={`/storage/${material.file_path}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="group flex items-center p-4 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 shadow-sm"
                                    >
                                        <svg
                                            className="w-8 h-8 text-red-500 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">
                                                {material.title}
                                            </span>
                                            <span className="text-xs text-gray-500 mt-0.5">
                                                Klik untuk membuka atau mengunduh PDF
                                            </span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            // Jika belum ada materi sama sekali
                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <p>Belum ada materi yang tersedia untuk subtes ini.</p>
                            </div>
                        )}

                        {/* Tombol Tutup Modal */}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-semibold hover:bg-gray-300 transition-colors cursor-pointer"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}