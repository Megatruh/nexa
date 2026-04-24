/**
 * TryOut/Hasil.jsx - Halaman hasil Try Out
 * Menampilkan: skor total, skor per subtes, grade, rekomendasi prodi
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, RotateCcw, ChevronRight, TrendingUp, Target } from "lucide-react";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { SkorBarChart } from "../../components/shared/ScoreChart";
import { ProdiCard } from "../../components/shared/ProdiCard";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { useTryoutStore } from "../../store/tryoutStore";
import { SUBTES_LIST } from "../../constants/subtesTryOut";
import { rekomendasikanProdi } from "../../utils/rekomendasiProdi";
import { useProdiStore } from "../../store/prodiStore";
import { ROUTES } from "../../constants/routes";

const GRADE_WARNA = {
  "A+": "#10b981", A: "#34d399", "B+": "#60a5fa", B: "#818cf8",
  "C+": "#f59e0b", C: "#fb923c", D: "#f87171", E: "#ef4444",
};

export default function HasilTryOut() {
  const navigate = useNavigate();
  const { hasilTerakhir, resetSesi } = useTryoutStore();
  const { hasilKesesuaian } = useProdiStore();

  if (!hasilTerakhir) {
    navigate(ROUTES.TRYOUT);
    return null;
  }

  const { skorTotal, skorPerSubtes, grade } = hasilTerakhir;
  const gradeWarna = GRADE_WARNA[grade] || "#a78bfa";

  // Rekomendasi prodi berdasarkan skor + kesesuaian jurusan (jika ada)
  const kategoriMinat = hasilKesesuaian
    ? [hasilKesesuaian.kategoriUtama, ...(hasilKesesuaian.kategoriLainnya || [])]
    : [];
  const rekomendasi = rekomendasikanProdi(skorTotal, kategoriMinat, 3);

  const ulangi = () => {
    resetSesi();
    navigate(ROUTES.TRYOUT);
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5"
          style={{
            background: `${gradeWarna}20`,
            border: `2px solid ${gradeWarna}50`,
          }}
        >
          <Trophy size={40} style={{ color: gradeWarna }} />
        </div>
        <p className="text-purple-400 font-syne text-sm mb-2">Skor Akhir Try Out</p>
        <div
          className="text-7xl font-black font-display mb-2"
          style={{ color: gradeWarna }}
        >
          {skorTotal}
        </div>
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
          style={{
            background: `${gradeWarna}15`,
            border: `1px solid ${gradeWarna}40`,
          }}
        >
          <span className="text-sm font-bold font-syne" style={{ color: gradeWarna }}>
            Grade {grade}
          </span>
        </div>
        <p className="text-purple-400 font-syne text-xs mt-2">Skala 200-800</p>
      </div>

      {/* Skor per subtes */}
      <div className="nexa-card p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={18} className="text-purple-400" />
          <h3 className="font-bold text-white font-syne">Skor per Subtes</h3>
        </div>
        {/* Chart */}
        <SkorBarChart skorPerSubtes={skorPerSubtes || {}} />
        {/* Detail tabel */}
        <div className="mt-5 space-y-3">
          {SUBTES_LIST.map((subtes) => {
            const data = skorPerSubtes?.[subtes.id];
            if (!data) return null;
            return (
              <div key={subtes.id} className="flex items-center gap-3">
                <span className="text-xs font-bold font-mono text-purple-400 w-12 text-right flex-shrink-0">
                  {subtes.singkatan}
                </span>
                <div className="flex-1">
                  <ProgressBar
                    value={data.skor - 200}
                    max={600}
                    height="h-1.5"
                    color={
                      data.persentase >= 70 ? "#10b981" :
                      data.persentase >= 50 ? "#f59e0b" : "#ef4444"
                    }
                  />
                </div>
                <span className="text-xs font-bold font-mono text-white w-10 flex-shrink-0">
                  {data.skor}
                </span>
                <span className="text-xs text-purple-500 font-syne w-16 flex-shrink-0 text-right">
                  {data.benar}/{data.total} benar
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rekomendasi Prodi */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-5">
          <Target size={18} className="text-purple-400" />
          <h3 className="text-xl font-bold text-white font-syne">
            Rekomendasi Prodi Untukmu
          </h3>
        </div>
        <p className="text-sm text-purple-400 font-syne mb-5">
          Berdasarkan skor simulasimu, berikut program studi yang realistis untuk dicapai:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rekomendasi.map((prodi) => (
            <div key={prodi.id} className="relative">
              <ProdiCard prodi={prodi} />
              {/* Peluang badge */}
              <div
                className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold font-mono"
                style={{
                  background: `${prodi.peluang.warna}20`,
                  border: `1px solid ${prodi.peluang.warna}40`,
                  color: prodi.peluang.warna,
                }}
              >
                {prodi.peluang.persentase}%
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => navigate(ROUTES.ULASAN_PRODI)}
          className="nexa-btn-primary flex items-center gap-2"
        >
          Jelajahi Prodi
          <ChevronRight size={16} />
        </button>
        <button
          onClick={ulangi}
          className="nexa-btn-secondary flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Ulangi Try Out
        </button>
      </div>
    </PageWrapper>
  );
}
