// resources/js/Pages/Jurusan/Test.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Test({ auth, questions }) {
    // Setup form Inertia untuk menyimpan jawaban
    const { data, setData, post, processing } = useForm({
        answers: {},
    });

    // Handle submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('jurusan.test.submit'));
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Tes Kesesuaian Jurusan (DAT)</h2>}
        >
            <Head title="Mulai Tes DAT" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                        
                        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700">
                            <p className="font-bold">Instruksi Pengerjaan:</p>
                            <p className="text-sm">Jawablah pertanyaan di bawah ini dengan memilih satu jawaban yang paling tepat. Hasil tes akan menentukan persentase kecocokanmu dengan program studi di UNSIL.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {questions && questions.map((q, index) => (
                                <div key={q.id} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                                    <p className="font-bold text-lg mb-4">
                                        <span className="text-indigo-600 mr-2">{index + 1}.</span> 
                                        {q.question}
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {['a', 'b', 'c', 'd'].map((opt) => (
                                            <label 
                                                key={opt} 
                                                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                                                    data.answers[q.id] === opt.toUpperCase() 
                                                    ? 'bg-indigo-100 border-indigo-500 shadow-sm' 
                                                    : 'bg-white hover:bg-gray-100'
                                                }`}
                                            >
                                                <input 
                                                    type="radio" 
                                                    name={`q-${q.id}`} 
                                                    value={opt.toUpperCase()}
                                                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 mr-3"
                                                    onChange={(e) => setData('answers', { ...data.answers, [q.id]: e.target.value })}
                                                    required
                                                />
                                                <span className="uppercase font-bold text-gray-700 mr-2">{opt}.</span> 
                                                <span className="text-gray-800">{q[`option_${opt}`]}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-end pt-6 border-t border-gray-200">
                                <button 
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan Jawaban...' : 'Selesai & Lihat Hasil'}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}