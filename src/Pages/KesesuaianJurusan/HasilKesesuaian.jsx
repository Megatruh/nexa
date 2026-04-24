/**
 * HasilKesesuaian - Hasil analisis kesesuaian jurusan
 * Menampilkan rekomendasi prodi berdasarkan jawaban survei
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { Target, ChevronRight, RotateCcw, TrendingUp } from "lucide-react";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { ProdiCard } from "../../components/shared/ProdiCard";
import { Badge } from "../../components/ui/Badge";
import { useProdiStore } from "../../store/prodiStore";
import { DATA_PRODI, KATEGORI_PRODI } from "../../constants/kategoriProdi";
import { ROUTES } from "../../constants/routes";

const LABEL_KATEGORI = KATEGORI_PRODI.reduce((acc, k) => {
  acc[k.id] = k.label;
  return acc;
}, {});

export default function HasilKesesuaian() {
  const navigate = useNavigate();
  const { hasilKesesuaian, resetSurvei } = useProdiStore();

  if (!hasilKesesuaian) {
    navigate(ROUTES.KESESUAIAN);
    return null;
  }

  const { kategoriUtama, kategoriLainnya, skorKategori } = hasilKesesuaian;

  // Filter prodi sesuai kategori utama
  const prodiRekomendasi = DATA_PRODI.filter(
    (p) => p.kategori === kategoriUtama
  ).slice(0, 3);

  const prodiTambahan = DATA_PRODI.filter(
    (p) => kategoriLainnya.includes(p.kategori) && p.kategori !== kategoriUtama
  ).slice(0, 3);

  const ulangiSurvei = () => {
    resetSurvei();
    navigate(ROUTES.KESESUAIAN);
  };

  return (
    <PageWrapper>
      {/* Header hasil */}
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
          style={{
            background: "rgba(124,58,237,0.2)",
            border: "1px solid rgba(167,139,250,0.3)",
          }}
        >
          <Target size={32} className="text-purple-300" />
        </div>
        <h1 className="text-3xl font-bold text-white font-syne mb-3">
          Hasil Analisis Jurusan
        </h1>
        <p className="text-purple-300 font-syne">
          Berdasarkan survei, profil minatmu paling cocok dengan bidang:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <Badge variant="default" className="text-sm px-4 py-1">
            🎯 {LABEL_KATEGORI[kategoriUtama] || kategoriUtama}
          </Badge>
          {kategoriLainnya.map((k) => (
            <Badge key={k} variant="info" className="text-sm px-3 py-1">
              {LABEL_KATEGORI[k] || k}
            </Badge>
          ))}
        </div>
      </div>

      {/* Skor kategori */}
      <div
        className="nexa-card p-6 mb-10"
        style={{ maxWidth: 600, margin: "0 auto 2.5rem" }}
      >
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={18} className="text-purple-400" />
          <h3 className="font-bold text-white font-syne">Profil Minat</h3>
        </div>
        <div className="space-y-3">
          {Object.entries(skorKategori)
            .sort((a, b) => b[1] - a[1])
            .map(([kat, skor]) => {
              const max = Math.max(...Object.values(skorKategori));
              const persen = (skor / max) * 100;
              return (
                <div key={kat}>
                  <div className="flex justify-between text-xs text-purple-300 font-syne mb-1">
                    <span>{LABEL_KATEGORI[kat] || kat}</span>
                    <span className="font-mono font-bold">{Math.round(persen)}%</span>
                  </div>
                  <div className="h-1.5 bg-purple-900/40 rounded-full">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${persen}%`,
                        background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Rekomendasi prodi utama */}
      {prodiRekomendasi.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white font-syne mb-5">
            Rekomendasi Prodi Untukmu
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {prodiRekomendasi.map((prodi) => (
              <ProdiCard key={prodi.id} prodi={prodi} />
            ))}
          </div>
        </section>
      )}

      {/* Prodi tambahan */}
      {prodiTambahan.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white font-syne mb-5">
            Pertimbangan Lainnya
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {prodiTambahan.map((prodi) => (
              <ProdiCard key={prodi.id} prodi={prodi} />
            ))}
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
        <button
          onClick={() => navigate(ROUTES.ULASAN_PRODI)}
          className="nexa-btn-primary flex items-center gap-2"
        >
          Jelajahi Semua Prodi
          <ChevronRight size={16} />
        </button>
        <button
          onClick={ulangiSurvei}
          className="nexa-btn-secondary flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Ulangi Survei
        </button>
      </div>
    </PageWrapper>
  );
}
