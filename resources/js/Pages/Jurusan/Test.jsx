// // resources/js/Pages/Jurusan/Test.jsx

// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// import { Head, useForm } from '@inertiajs/react';

// export default function Test({ auth, questions }) {
//     // Setup form Inertia untuk menyimpan jawaban
//     const { data, setData, post, processing } = useForm({
//         answers: {},
//     });

//     // Handle submit form
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         post(route('jurusan.test.submit'));
//     };

//     return (
//         <AuthenticatedLayout
//             auth={auth}
//             // header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Tes Kesesuaian Jurusan (DAT)</h2>}
//         >
//             {/* <Head title="Mulai Tes DAT" /> */}

//             <div className="py-12">
//                 <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
//                     <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                        
//                         <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700">
//                             <p className="font-bold">Instruksi Pengerjaan:</p>
//                             <p className="text-sm">Jawablah pertanyaan di bawah ini dengan memilih satu jawaban yang paling tepat. Hasil tes akan menentukan persentase kecocokanmu dengan program studi di UNSIL.</p>
//                         </div>

//                         <form onSubmit={handleSubmit} className="space-y-8">
//                             {questions && questions.map((q, index) => (
//                                 <div key={q.id} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
//                                     <p className="font-bold text-lg mb-4">
//                                         <span className="text-indigo-600 mr-2">{index + 1}.</span> 
//                                         {q.question}
//                                     </p>
                                    
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         {['a', 'b', 'c', 'd'].map((opt) => (
//                                             <label 
//                                                 key={opt} 
//                                                 className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
//                                                     data.answers[q.id] === opt.toUpperCase() 
//                                                     ? 'bg-indigo-100 border-indigo-500 shadow-sm' 
//                                                     : 'bg-white hover:bg-gray-100'
//                                                 }`}
//                                             >
//                                                 <input 
//                                                     type="radio" 
//                                                     name={`q-${q.id}`} 
//                                                     value={opt.toUpperCase()}
//                                                     className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 mr-3"
//                                                     onChange={(e) => setData('answers', { ...data.answers, [q.id]: e.target.value })}
//                                                     required
//                                                 />
//                                                 <span className="uppercase font-bold text-gray-700 mr-2">{opt}.</span> 
//                                                 <span className="text-gray-800">{q[`option_${opt}`]}</span>
//                                             </label>
//                                         ))}
//                                     </div>
//                                 </div>
//                             ))}

//                             <div className="flex justify-end pt-6 border-t border-gray-200">
//                                 <button 
//                                     type="submit"
//                                     disabled={processing}
//                                     className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg disabled:opacity-50"
//                                 >
//                                     {processing ? 'Menyimpan Jawaban...' : 'Selesai & Lihat Hasil'}
//                                 </button>
//                             </div>
//                         </form>

//                     </div>
//                 </div>
//             </div>
//         </AuthenticatedLayout>
//     );
// }

import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function Test({ auth, questions }) {
    // 1. Setup Form Inertia (Logika Asli Kamu)
    const { data, setData, post, processing } = useForm({
        answers: {},
    });

    // 2. Setup State Navigasi (Gaya Hapis)
    const [currentStep, setCurrentStep] = useState(0);
    const [isSelecting, setIsSelecting] = useState(false);

    // Keamanan jika pertanyaan kosong
    if (!questions || questions.length === 0) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <div className="text-white text-center pt-24">Memuat soal...</div>
            </AuthenticatedLayout>
        );
    }

    const currentQuestion = questions[currentStep];
    const total = questions.length;
    const progress = (currentStep / total) * 100;
    const isLast = currentStep === total - 1;

    // 3. Handle Pilihan dengan Animasi Transisi
    const handleSelect = (opt) => {
        // Cegah klik ganda saat transisi atau saat submit
        if (isSelecting || processing) return;
        setIsSelecting(true);

        const val = opt.toUpperCase();
        
        // Simpan jawaban ke state Inertia
        setData('answers', { ...data.answers, [currentQuestion.id]: val });

        // Beri jeda animasi sebelum pindah soal
        setTimeout(() => {
            if (isLast) {
                // Submit otomatis kalau sudah di soal terakhir
                post(route('jurusan.test.submit'));
            } else {
                // Lanjut soal berikutnya
                setCurrentStep((prev) => prev + 1);
                setIsSelecting(false);
            }
        }, 350);
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
            setIsSelecting(false);
        }
    };

    // Array opsi untuk me-loop data dari database (a, b, c, d)
    const optionKeys = ['a', 'b', 'c', 'd'];

    return (
        <AuthenticatedLayout>
            <Head title="NEXA - Tes Kesesuaian Jurusan" />

            <div className="py-12 pt-24 px-4">
                <div className="max-w-2xl mx-auto">
                    
                    {/* Progress Bar (Gaya Hapis) */}
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-purple-400 font-syne font-semibold">
                            Pertanyaan {currentStep + 1}/{total}
                        </span>
                        <span className="text-xs text-purple-500 font-mono">
                            {Math.round(progress)}%
                        </span>
                    </div>
                    <div className="h-1 w-full bg-purple-900/40 rounded-full mb-8">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${progress}%`,
                                background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
                            }}
                        />
                    </div>

                    {/* Card Pertanyaan (Gaya Hapis) */}
                    <div
                        className="rounded-2xl p-8 animate-fade-in"
                        style={{
                            background: "linear-gradient(135deg, rgba(45,27,105,0.5) 0%, rgba(26,16,64,0.7) 100%)",
                            border: "1px solid rgba(167,139,250,0.25)",
                            boxShadow: "0 8px 40px rgba(91,33,182,0.2), inset 0 0 80px rgba(124,58,237,0.05)",
                        }}
                    >
                        {/* Menampilkan Soal dari Database */}
                        <h2 className="text-xl md:text-2xl font-bold text-white font-syne mb-8 leading-snug">
                            {currentQuestion.question}
                        </h2>

                        {/* Menampilkan Opsi A, B, C, D */}
                        <div className="space-y-3">
                            {optionKeys.map((opt) => {
                                // Cek apakah opsi ini sudah dipilih sebelumnya
                                const isSelected = data.answers[currentQuestion.id] === opt.toUpperCase();
                                
                                return (
                                    <button
                                        key={opt}
                                        onClick={() => handleSelect(opt)}
                                        disabled={processing}
                                        className={`
                                            w-full flex items-center justify-between
                                            px-5 py-4 rounded-xl text-left
                                            transition-all duration-300
                                            font-syne text-sm font-medium
                                            ${isSelected
                                                ? "bg-purple-600/30 border border-purple-400/50 text-white"
                                                : "bg-purple-900/20 border border-purple-500/20 text-purple-200 hover:bg-purple-800/20 hover:border-purple-400/30 hover:text-white"
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="uppercase font-bold opacity-60 w-5">{opt}.</span>
                                            {/* Ambil teks opsi dari database, misal: q.option_a */}
                                            <span>{currentQuestion[`option_${opt}`]}</span>
                                        </div>
                                        <ChevronRight
                                            size={16}
                                            className={`flex-shrink-0 transition-colors ${isSelected ? "text-purple-300" : "text-purple-600"}`}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tombol Bawah */}
                    <div className="mt-5 flex items-center justify-between">
                        {currentStep > 0 ? (
                            <button
                                onClick={handleBack}
                                disabled={processing}
                                className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-200 transition-colors font-syne disabled:opacity-50"
                            >
                                <ChevronLeft size={16} />
                                Kembali
                            </button>
                        ) : (
                            <div /> // Spacer agar progress teks di kanan tetap pas
                        )}

                        {/* Indikator Submit saat berada di soal terakhir */}
                        {processing && (
                            <span className="text-sm font-syne text-purple-300 animate-pulse">
                                Menyimpan & Menganalisis...
                            </span>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}