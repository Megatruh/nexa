/**
 * Beranda - Halaman utama NEXA
 * Menampilkan hero section, fitur utama, dan CTA
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { Target, Star, BookOpen, FileCheck2, ChevronRight, Rocket, Zap } from "lucide-react";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { Button } from "../../components/ui/Button";
import { ROUTES } from "../../constants/routes";

// Data fitur untuk ditampilkan di bawah hero
const FITUR = [
  {
    icon: Target,
    judul: "Kesesuaian Jurusan",
    deskripsi: "Temukan jurusan yang paling sesuai dengan minat dan bakatmu melalui survei interaktif.",
    route: ROUTES.KESESUAIAN,
    warna: "#a78bfa",
  },
  {
    icon: Star,
    judul: "Ulasan Prodi",
    deskripsi: "Temukan jurusan yang paling sesuai dengan minatdan bakatmu melalui survei interaktif.",
    route: ROUTES.ULASAN_PRODI,
    warna: "#818cf8",
  },
  {
    icon: BookOpen,
    judul: "Belajar",
    deskripsi: "Temukan jurusan yang paling sesuai dengan minatdan bakatmu melalui survei interaktif.",
    route: ROUTES.BELAJAR_MATERI,
    warna: "#7c3aed",
  },
  {
    icon: FileCheck2,
    judul: "Try Out",
    deskripsi: "Temukan jurusan yang paling sesuai dengan minatdan bakatmu melalui survei interaktif.",
    route: ROUTES.TRYOUT,
    warna: "#6d28d9",
  },
];

export default function Beranda() {
  const navigate = useNavigate();

  return (
    <PageWrapper fullWidth>
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-16 pb-20">
        {/* Glow decorative */}
        <div
          className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
          style={{
            background: "rgba(124,58,237,0.15)",
            border: "1px solid rgba(167,139,250,0.3)",
          }}
        >
          <Zap size={12} className="text-purple-300" />
          <span className="text-xs font-semibold text-purple-300 font-syne tracking-wide">
            Simulasi UTBK-SNBT Terpercaya
          </span>
        </div>

        {/* Judul besar */}
        <h1
          className="font-display font-black text-5xl md:text-6xl lg:text-7xl tracking-wider mb-5"
          style={{
            background: "linear-gradient(135deg, #e8e0ff 0%, #c4b5fd 40%, #a78bfa 70%, #7c3aed 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          NEXA
        </h1>

        <h2 className="text-xl md:text-2xl font-bold text-white font-syne mb-4 max-w-2xl">
          Pengembangan Aplikasi Simulasi UTBK-SNBT dan Analisis Peluang Masuk Program Studi
        </h2>

        <p className="text-sm md:text-base text-purple-300 font-syne max-w-xl leading-relaxed mb-10">
          Persiapkan dirimu menghadapi UTBK-SNBT dengan simulasi realistis, materi lengkap, dan analisis
          peluang masuk yang akurat.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => navigate(ROUTES.TRYOUT)}
            className="nexa-btn-primary px-8 py-3 text-base flex items-center gap-2"
          >
            <Rocket size={18} />
            Mulai Try Out
          </button>
          <button
            onClick={() => navigate(ROUTES.KESESUAIAN)}
            className="nexa-btn-secondary px-8 py-3 text-base flex items-center gap-2"
          >
            <Target size={18} />
            Cari Jurusanmu
          </button>
        </div>
      </section>

      {/* Fitur Cards */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FITUR.map((fitur, idx) => {
            const Icon = fitur.icon;
            return (
              <div
                key={idx}
                className="nexa-card p-5 cursor-pointer group"
                style={{ animationDelay: `${idx * 0.1}s` }}
                onClick={() => navigate(fitur.route)}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: `${fitur.warna}20`,
                    border: `1px solid ${fitur.warna}40`,
                  }}
                >
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
              </div>
            );
          })}
        </div>
      </section>
    </PageWrapper>
  );
}
