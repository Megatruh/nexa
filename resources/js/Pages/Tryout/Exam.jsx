import React, { useState, useEffect } from 'react'; // Tambah useState & useEffect
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Exam({ auth, session, subtest, sessionSubtest, questions, savedAnswer, allQuestionIds }) {
    const question = questions?.data?.[0];

    // --- LOGIKA TIMER ---
    // Durasi dari database biasanya dalam menit, kita ubah ke detik
    const [timeLeft, setTimeLeft] = useState(subtest.duration * 60);

    useEffect(() => {
        // Jika waktu habis, otomatis panggil fungsi selesai
        if (timeLeft <= 0) {
            handleFinishSubtest(true); // Kirim true sebagai penanda waktu habis
            return;
        }

        // Jalankan interval setiap 1 detik
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer); // Bersihkan timer saat pindah halaman
    }, [timeLeft]);

    // Format detik ke MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };
    // ----------------------

    const handleAnswer = (choice) => {
        router.post(route('tryout.answer.store'), {
            tryout_session_id: session.id,
            tryout_question_id: question.id,
            answer: choice,
        }, { preserveScroll: true });
    };

    const handleFinishSubtest = (isAuto = false) => {
        const confirmMsg = "Waktu masih tersedia. Yakin ingin mengakhiri subtes ini?";
        
        // Jika otomatis (waktu habis) atau user klik OK di konfirmasi
        if (isAuto || window.confirm(confirmMsg)) {
            router.post(route('tryout.subtest.finish', { 
                session_subtest_id: sessionSubtest.id 
            }));
        }
    };

    if (!question) return <div className="p-10 text-center">Soal tidak ditemukan.</div>;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Ujian: ${subtest.name}`} />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6">
                    
                    <div className="flex-1 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                        {/* HEADER SOAL */}
                        <div className="flex justify-between items-center mb-6">
                            <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full font-bold text-sm">
                                No. {questions.current_page} dari {questions.total}
                            </span>
                            
                            {/* TAMPILAN TIMER */}
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-xl ${timeLeft < 60 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-700'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formatTime(timeLeft)}
                            </div>
                        </div>

                        {/* ... (Konten Soal & Jawaban sama seperti sebelumnya) ... */}
                        <div className="text-lg mb-10">{question.question_text}</div>
                        
                        <div className="space-y-4">
                            {['a', 'b', 'c', 'd', 'e'].map((letter) => (
                                <button key={letter} onClick={() => handleAnswer(letter.toUpperCase())} className={`w-full text-left p-4 rounded-lg border-2 ${savedAnswer?.answer === letter.toUpperCase() ? 'border-blue-500 bg-blue-50' : 'border-gray-100'}`}>
                                    {letter.toUpperCase()}. {question[`option_${letter}`]}
                                </button>
                            ))}
                        </div>

                        <div className="mt-12 flex justify-between">
                            <button onClick={() => router.get(questions.prev_page_url)} disabled={!questions.prev_page_url} className="px-8 py-2 bg-gray-100 rounded-lg">SEBELUMNYA</button>
                            <button onClick={() => router.get(questions.next_page_url)} disabled={!questions.next_page_url} className="px-8 py-2 bg-blue-600 text-white rounded-lg">SELANJUTNYA</button>
                        </div>
                    </div>

                    {/* NAVIGASI KANAN */}
                    <div className="w-full md:w-72 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit sticky top-6">
                        <h4 className="font-bold mb-4 border-b pb-2 text-center uppercase tracking-wider text-gray-500 text-xs">Navigasi Soal</h4>
                        <div className="grid grid-cols-5 gap-2 mb-6">
                            {allQuestionIds.map((id, index) => (
                                <button key={id} onClick={() => router.get(`${route('tryout.subtest.show', {tryout_id: session.tryout_id, subtest_id: subtest.id})}?page=${index + 1}`)} className={`h-10 rounded font-bold ${questions.current_page === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400 border'}`}>
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                        
                        <button onClick={() => handleFinishSubtest(false)} className="w-full py-3 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition border border-red-100">
                            SELESAI SUBTES
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}