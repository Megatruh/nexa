import React from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Target, Star, BookOpen, FileCheck2, ChevronRight, Rocket, Zap } from "lucide-react";

// Mengarah ke folder _components dan _constants yang baru kamu buat
import { PageWrapper } from "../_components/layout/PageWrapper";
import { Button } from "../_components/ui/Button";

const FITUR = [
  {
    icon: Target,
    judul: "Kesesuaian Jurusan",
    deskripsi: "Temukan jurusan yang paling sesuai dengan minat dan bakatmu melalui survei interaktif.",
    url: 'login', // Nanti bisa disesuaikan dengan route('...')
    warna: "#a78bfa",
  },
  {
    icon: Star,
    judul: "Ulasan Prodi",
    deskripsi: "Cari tahu pengalaman mahasiswa di berbagai program studi pilihanmu.",
    url: 'login',
    warna: "#818cf8",
  },
  {
    icon: BookOpen,
    judul: "Belajar",
    deskripsi: "Akses materi pembelajaran lengkap untuk persiapan UTBK-SNBT.",
    url: 'subtests.index',
    warna: "#7c3aed",
  },
  {
    icon: FileCheck2,
    judul: "Try Out",
    deskripsi: "Uji kemampuanmu dengan simulasi ujian yang realistis dan akurat.",
    url: 'tryout.index',
    warna: "#6d28d9",
  },
];

export default function Dashboard({ auth }) {
  return (
    <AuthenticatedLayout>
      <Head title="NEXA - Dashboard" />

        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center text-center px-4 pt-16 pb-20">
        {/* Dekotatif Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
             style={{ background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)", filter: "blur(40px)" }} />

        <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl tracking-wider mb-5 text-white">
          NEXA
        </h1>

        <h2 className="text-xl md:text-2xl font-bold text-white font-syne mb-4">
          Selamat Datang, {auth.user?.name || 'User'}!
        </h2>

          <p className="text-sm md:text-base text-purple-300 font-syne max-w-xl leading-relaxed mb-10">
            Siap untuk memulai simulasi UTBK hari ini? Persiapkan dirimu dengan materi lengkap dan analisis akurat.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href={route('tryout.index')} className="nexa-btn-primary px-8 py-3 text-base flex items-center gap-2 bg-purple-600 rounded-lg text-white font-bold">
              <Rocket size={18} />
              Mulai Try Out
            </Link>
            <Link href={route('subtests.index')} className="nexa-btn-secondary px-8 py-3 text-base flex items-center gap-2 border border-purple-400 rounded-lg text-purple-200">
              <Target size={18} />
              Mulai Belajar
            </Link>
          </div>
        </section>

        {/* Fitur Cards */}
        <section className="max-w-6xl mx-auto px-4 md:px-6 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FITUR.map((fitur, idx) => {
              const Icon = fitur.icon;
              return (
                <Link key={idx} href={route(fitur.url)} className="nexa-card p-5 cursor-pointer group bg-space-mid/50 border border-white/10 rounded-2xl block">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${fitur.warna}20`, border: `1px solid ${fitur.warna}40` }}>
                    <Icon size={20} style={{ color: fitur.warna }} />
                  </div>
                  <h3 className="font-bold text-white font-syne mb-2 group-hover:text-purple-200 transition-colors">
                    {fitur.judul}
                  </h3>
                  <p className="text-xs text-purple-400 font-syne leading-relaxed">
                    {fitur.deskripsi}
                  </p>
                  <div className="flex items-center gap-1 mt-4 text-purple-400 group-hover:text-purple-200 transition-colors">
                    <span className="text-xs font-syne font-semibold">Selengkapnya</span>
                    <ChevronRight size={14} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
    </AuthenticatedLayout>
  );
}