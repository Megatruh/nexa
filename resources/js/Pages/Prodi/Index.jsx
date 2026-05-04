// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// import { Head } from '@inertiajs/react';

// export default function Index({ auth }) {
//     return (
//         <AuthenticatedLayout
//             auth={auth}
//             // header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Ulasan Program Studi</h2>}
//         >
//             <Head title="Ulasan Prodi" />

//             <div className="py-12">
//                 <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         {/* Placeholder pencarian */}
//                         <div className="md:col-span-3 bg-white p-4 rounded-lg shadow-sm">
//                             <input 
//                                 type="text" 
//                                 placeholder="Cari prodi (misal: Informatika)..." 
//                                 className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                             />
//                         </div>

//                         {/* Contoh Card Prodi */}
//                         {[1, 2, 3].map((i) => (
//                             <div key={i} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition border border-gray-100">
//                                 <h4 className="font-bold text-lg text-indigo-600">Informatika</h4>
//                                 <p className="text-sm text-gray-500">Universitas Siliwangi</p>
//                                 <div className="mt-4 flex justify-between text-sm">
//                                     <span>Daya Tampung: 120</span>
//                                     <span className="text-orange-500 font-medium">Keketatan Tinggi</span>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </AuthenticatedLayout>
//     );
// }

import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Users, Award, MapPin, Target } from 'lucide-react';

export default function Index({ auth, prodis, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        
        router.get(
            route('prodi.index'),
            { search: value },
            { preserveState: true, replace: true }
        );
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Ulasan Prodi" />

            {/* Wrapper utama dengan tema gelap */}
            <div className="py-12 min-h-screen text-white">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* HEADER SECTION */}
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl md:text-4xl font-syne font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-3">
                            Eksplorasi Program Studi
                        </h2>
                        <p className="text-purple-300/80 font-syne max-w-2xl mx-auto text-sm md:text-base">
                            Cari tahu daya tampung, tingkat keketatan, dan prospek masa depan dari program studi impianmu.
                        </p>
                    </div>

                    {/* SEARCH BAR (Tema Nexa) */}
                    <div className="mb-10 max-w-2xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-purple-400/50 group-focus-within:text-purple-400 transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            value={search}
                            onChange={handleSearch}
                            placeholder="Cari prodi (misal: Informatika)..." 
                            className="w-full bg-space-mid/30 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-purple-300/40 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-syne backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                        />
                    </div>

                    {/* LIST CARD PRODI */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {prodis?.data?.length > 0 ? (
                            prodis.data.map((prodi) => (
                                <Link 
                                    href={route('prodi.show', prodi.id)} 
                                    key={prodi.id} 
                                    className="block group nexa-card bg-space-mid/40 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(167,139,250,0.15)] relative overflow-hidden backdrop-blur-md"
                                >
                                    {/* Aksen Gradient Bulat di background card */}
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-bold text-xl font-syne text-white group-hover:text-purple-300 transition-colors">
                                                {prodi.name}
                                            </h4>
                                            {/* Badge Akreditasi */}
                                            <span className="flex items-center gap-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs px-2.5 py-1 rounded-full font-syne font-semibold whitespace-nowrap">
                                                <Award size={12} />
                                                {prodi.accreditation || 'Baik'}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-1.5 text-sm text-purple-400/80 font-syne mb-6">
                                            <MapPin size={14} />
                                            <span>Universitas Siliwangi</span>
                                        </div>
                                        
                                        <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="flex items-center gap-1.5 text-xs text-gray-400 font-syne mb-1">
                                                    <Users size={14} className="text-purple-400" />
                                                    Daya Tampung
                                                </span>
                                                <span className="text-lg font-mono font-bold text-white">
                                                    {prodi.capacity}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="flex items-center gap-1.5 text-xs text-gray-400 font-syne mb-1">
                                                    <Target size={14} className="text-pink-400" />
                                                    Peminat
                                                </span>
                                                <span className="text-lg font-mono font-bold text-white">
                                                    {prodi.enthusiasts}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="md:col-span-2 lg:col-span-3 text-center py-16 bg-space-mid/20 rounded-2xl border border-white/5 backdrop-blur-sm">
                                <Search className="w-12 h-12 text-purple-400/30 mx-auto mb-4" />
                                <p className="text-purple-300/70 font-syne text-lg">Program studi tidak ditemukan.</p>
                            </div>
                        )}
                    </div>

                    {/* PAGINASI (Tema Gelap) */}
                    {prodis?.links?.length > 3 && (
                        <div className="mt-12 flex justify-center gap-2 flex-wrap">
                            {prodis.links.map((link, index) => (
                                link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-4 py-2 rounded-xl border font-syne text-sm transition-all ${
                                            link.active 
                                            ? 'bg-purple-600/80 text-white border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.4)]' 
                                            : 'bg-space-mid/40 text-purple-300 border-white/10 hover:bg-space-light/50 hover:border-purple-400/50'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span 
                                        key={index} 
                                        className="px-4 py-2 rounded-xl border bg-space-dark/50 border-white/5 text-gray-600 cursor-not-allowed font-syne text-sm" 
                                        dangerouslySetInnerHTML={{ __html: link.label }} 
                                    />
                                )
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}