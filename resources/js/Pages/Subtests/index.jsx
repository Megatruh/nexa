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

            <div className="min-h-screen bg-[#0f0826] py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subtests.map((subtest) => (
                            <div
                                key={subtest.id}
                                className="overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 sm:rounded-lg hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 flex flex-col shadow-sm"
                            >
                                {/* BAGIAN ATAS CARD */}
                                <div className="p-6 text-white flex-grow">
                                    <div className="flex justify-between gap-4 items-start mb-4">
                                        <h3 className="text-lg font-bold text-white">
                                            {subtest.name}
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                    </div>
                                </div>

                                {/* BAGIAN BAWAH CARD (TOMBOL) */}
                                <div className="p-6 pt-0 mt-auto bg-white/5 border-t border-white/10">
                                    <div className="flex items-center justify-between pt-4">
                                        <div className="text-xs font-medium text-gray-300 bg-white/10 border border-white/10 px-2.5 py-1 rounded-md">
                                            {subtest.learning_materials_count} File Materi
                                        </div>
                                        <button
                                            // Saat diklik, simpan data subtest ini ke state
                                            onClick={() => setSelectedSubtest(subtest)}
                                            className="inline-flex items-center px-4 py-2 bg-purple-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-purple-700 focus:bg-purple-700 active:bg-purple-900 transition ease-in-out duration-150 shadow-lg shadow-purple-500/20 hover:shadow-lg cursor-pointer"
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
            <Modal show={selectedSubtest !== null} onClose={closeModal} maxWidth="2xl">
                {selectedSubtest && (
                    <div className="p-6 bg-[#150d33]/90 backdrop-blur-xl border border-white/15 text-white rounded-xl">
                        <h2 className="text-2xl font-bold text-purple-300 mb-4 border-b border-white/10 pb-2">
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
                                        className="group flex items-center p-4 text-sm text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200 shadow-sm"
                                    >
                                        <svg
                                            className="w-8 h-8 text-purple-400 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform"
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
                                            <span className="font-bold text-white group-hover:text-purple-300 transition-colors">
                                                {material.title}
                                            </span>
                                            <span className="text-xs text-gray-400 mt-0.5">
                                                Klik untuk membuka atau mengunduh PDF
                                            </span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            // Jika belum ada materi sama sekali
                            <div className="text-center py-8 text-gray-400 bg-white/5 rounded-lg border border-dashed border-white/20">
                                <p>Belum ada materi yang tersedia untuk subtes ini.</p>
                            </div>
                        )}

                        {/* Tombol Tutup Modal */}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-white/10 text-white rounded-md text-sm font-semibold hover:bg-white/20 border border-white/10 transition-colors cursor-pointer"
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