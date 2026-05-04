import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    ChevronLeft, Star, Users, Award, 
    BookOpen, Briefcase, Wallet, Target, Info 
} from 'lucide-react';

export default function Show({ auth, prodi }) {
    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`Detail ${prodi.name}`}/>

            <div className="py-12 min-h-screen text-white">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    
                    {/* Tombol Kembali */}
                    <Link 
                        href={route('prodi.index')}
                        className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-8 font-syne group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Daftar Prodi
                    </Link>

                    {/* HERO SECTION DETAIL */}
                    <div className="nexa-card bg-space-mid/40 border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-md relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
                        
                        <div className="relative z-10">
                            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                                <div>
                                    <h1 className="text-3xl md:text-5xl font-syne font-bold text- bg-clip-text bg-gradient-to-r from-white to-purple-300 mb-2">
                                        {prodi.name}
                                    </h1>
                                    <p className="text-purple-400 flex items-center gap-2 font-syne">
                                        <BookOpen size={18} /> Universitas Siliwangi
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1.5 rounded-full font-bold">
                                        <Star size={16} fill="currentColor" />
                                        {prodi.rating || '4.5'}
                                    </div>
                                    <span className="bg-purple-500/10 text-purple-300 border border-purple-500/20 text-sm px-4 py-1 rounded-full font-bold font-syne">
                                        Akreditasi: {prodi.accreditation}
                                    </span>
                                </div>
                            </div>

                            {/* Statistik Singkat */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                                <div>
                                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-syne">Daya Tampung</p>
                                    <p className="text-xl font-mono font-bold text-white flex items-center gap-2">
                                        <Users size={18} className="text-purple-400" /> {prodi.capacity}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-syne">Peminat 2025</p>
                                    <p className="text-xl font-mono font-bold text-white flex items-center gap-2">
                                        <Target size={18} className="text-pink-400" /> {prodi.enthusiasts}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-syne">Passing Grade</p>
                                    <p className="text-xl font-mono font-bold text-white flex items-center gap-2">
                                        <Award size={18} className="text-blue-400" /> {prodi.passing_grade}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-syne">Range UKT</p>
                                    <p className="text-sm font-syne font-bold text-white flex items-center gap-2 mt-1">
                                        <Wallet size={18} className="text-green-400" /> {prodi.ukt_range}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CONTENT GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        {/* Kolom Kiri: Deskripsi & Prospek */}
                        <div className="md:col-span-2 space-y-8">
                            {/* Deskripsi */}
                            <section>
                                <h3 className="text-xl font-syne font-bold mb-4 flex items-center gap-2">
                                    <Info className="text-purple-400" /> Tentang Program Studi
                                </h3>
                                <div className="bg-space-mid/30 border border-white/5 rounded-2xl p-6 text-purple-100/90 leading-relaxed font-syne shadow-inner">
                                    {prodi.description}
                                </div>
                            </section>

                            {/* Prospek Kerja */}
                            <section>
                                <h3 className="text-xl font-syne font-bold mb-4 flex items-center gap-2">
                                    <Briefcase className="text-purple-400" /> Prospek Karir
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {prodi.career_prospects.split(',').map((job, idx) => (
                                        <div key={idx} className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-3 font-syne text-sm group hover:bg-purple-500/10 transition-colors">
                                            <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
                                            {job.trim()}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Kolom Kanan: Detail Tambahan */}
                        <div className="space-y-6">
                            <div className="nexa-card bg-gradient-to-b from-purple-900/20 to-space-mid/40 border border-purple-500/20 rounded-2xl p-6">
                                <h4 className="font-syne font-bold text-purple-300 mb-4 uppercase text-xs tracking-widest">
                                    Mata Pelajaran Terkait
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {prodi.related_subjects.split(',').map((sub, idx) => (
                                        <span key={idx} className="bg-space-dark/60 border border-white/10 px-3 py-1 rounded-lg text-xs font-syne">
                                            {sub.trim()}
                                        </span>
                                    ))}
                                </div>
                                
                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <div className="bg-purple-600/20 border border-purple-500/30 rounded-xl p-4">
                                        <p className="text-xs text-purple-200 font-syne leading-relaxed italic">
                                            "Program studi ini sangat cocok bagi kamu yang memiliki minat kuat pada {prodi.related_subjects.split(',')[0]}."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}