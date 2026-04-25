import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, flash, studyPrograms, existingResults}) {
    // tangkap paket data dari controller
    const testResults = flash?.test_results || existingResults;
    // fungsi hitung kesesuaian jurusan
    const calculateSuitability = (prodi) => {
        if (!testResults) return 0;

        const userN = testResults.n;
        const userV = testResults.v;
        
        const weightN = prodi.weight_num;
        const weightV = prodi.weight_verb;

        const totalScore = (userN * weightN) + (userV * weightV);
        const maxWeight = (100 * weightN) + (100 * weightV);

        return Math.round((totalScore / maxWeight) * 100);
    };

    // 3. Fungsi Penentu Warna Bar
    const getColor = (percent) => {
        if (percent >= 80) return 'bg-green-500';
        if (percent >= 60) return 'bg-blue-500';
        if (percent >= 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };
    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Kesesuaian Jurusan UNSIL</h2>}
        >
            <Head title="Kesesuaian Jurusan" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 md:p-8">
                        
                        {/* LOGIKA CABANG: Jika belum tes, tampilkan tombol. Jika sudah tes, tampilkan hasil */}
                        {!testResults ? (
                            
                            /* --- TAMPILAN JIKA BELUM ADA HASIL TES --- */
                            <div className="text-center py-10">
                                <div className="mb-4 inline-flex p-3 rounded-full bg-indigo-100 text-indigo-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Temukan Jurusan Impianmu</h3>
                                <p className="mt-2 text-gray-600 mb-6">Kerjakan tes DAT untuk melihat kecocokan dengan program studi di UNSIL berdasarkan nilai Numerik dan Verbal kamu.</p>
                                {/* PENTING: Gunakan komponen Link dari Inertia, bukan tag <a> biasa */}
                                <Link href={route('jurusan.test')} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition">
                                    Mulai Analisis Sekarang
                                </Link>
                            </div>

                        ) : (

                            /* --- TAMPILAN JIKA SUDAH ADA HASIL TES --- */
                            <div>
                                <div className="mb-8 p-6 bg-indigo-50 border border-indigo-100 rounded-xl flex flex-col md:flex-row justify-between md:items-center">
                                    <div>
                                        <h3 className="text-lg font-bold text-indigo-900 mb-2">Skor Tes DAT Kamu:</h3>
                                        <div className="flex gap-6">
                                            <div className="bg-white px-4 py-2 rounded shadow-sm border border-indigo-100">
                                                <span className="text-sm text-gray-500 block">Numerik</span>
                                                <span className="text-2xl font-black text-indigo-600">{testResults.n}%</span>
                                            </div>
                                            <div className="bg-white px-4 py-2 rounded shadow-sm border border-indigo-100">
                                                <span className="text-sm text-gray-500 block">Verbal</span>
                                                <span className="text-2xl font-black text-indigo-600">{testResults.v}%</span>
                                            </div>
                                            <div className="bg-white px-4 py-2 rounded shadow-sm border border-indigo-100">
                                                <span className="text-sm text-gray-500 block">Abstrak</span>
                                                <span className="text-2xl font-black text-indigo-600">{testResults.a}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0">
                                        <Link href={route('jurusan.test')} className="text-sm px-4 py-2 bg-white border border-indigo-200 text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition">
                                            Ulangi Tes
                                        </Link>
                                    </div>
                                </div>

                                <h4 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Prediksi Kesesuaian Program Studi:</h4>
                                
                                <div className="space-y-5">
                                    {studyPrograms && studyPrograms
                                        // 1. Hitung dan simpan persentase ke dalam objek prodi
                                        .map((prodi) => ({
                                            ...prodi,
                                            percent: calculateSuitability(prodi)
                                        }))
                                        // 2. Urutkan dari persentase tertinggi (b.percent) ke terendah (a.percent)
                                        .sort((a, b) => b.percent - a.percent)
                                        // 3. Tampilkan datanya
                                        .map((prodi) => (
                                            <div key={prodi.id} className="relative">
                                                <div className="flex justify-between items-end mb-1">
                                                    <span className="text-base font-semibold text-gray-700">
                                                        {prodi.name}
                                                    </span>
                                                    <span className="text-sm font-bold text-gray-900">{prodi.percent}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                    <div 
                                                        className={`${getColor(prodi.percent)} h-full rounded-full transition-all duration-1000 ease-out`}
                                                        style={{ width: `${prodi.percent}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}