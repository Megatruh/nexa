/**
 * KesesuaianJurusan - Survei peminatan interaktif
 * Pengguna menjawab 5 pertanyaan untuk menentukan minat dan bakat
 * Setiap jawaban memiliki bobot yang diperhitungkan dalam rekomendasi
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { useProdiStore } from "../../store/prodiStore";
import { ROUTES } from "../../constants/routes";

// Data pertanyaan survei dengan bobot kategori
const PERTANYAAN = [
  {
    id: "q1",
    pertanyaan: "Kegiatan apa yang paling kamu nikmati di waktu luang?",
    opsi: [
      { id: "a", teks: "Membaca buku atau menulis", kategori: ["sosial-humaniora", "pendidikan"] },
      { id: "b", teks: "Mengotak-atik komputer atau gadget", kategori: ["sains-teknologi"] },
      { id: "c", teks: "Bereksperimen di laboratorium", kategori: ["sains-teknologi", "kesehatan"] },
      { id: "d", teks: "Menggambar atau mendesain", kategori: ["seni-desain"] },
    ],
  },
  {
    id: "q2",
    pertanyaan: "Pelajaran apa yang paling mudah kamu pahami di sekolah?",
    opsi: [
      { id: "a", teks: "Matematika dan Fisika", kategori: ["sains-teknologi"] },
      { id: "b", teks: "Biologi dan Kimia", kategori: ["kesehatan", "sains-teknologi"] },
      { id: "c", teks: "Ekonomi dan Akuntansi", kategori: ["ekonomi-bisnis"] },
      { id: "d", teks: "Bahasa dan Sastra", kategori: ["sosial-humaniora", "pendidikan"] },
    ],
  },
  {
    id: "q3",
    pertanyaan: "Karir seperti apa yang kamu impikan di masa depan?",
    opsi: [
      { id: "a", teks: "Dokter, apoteker, atau profesi kesehatan", kategori: ["kesehatan"] },
      { id: "b", teks: "Engineer, programmer, atau ilmuwan", kategori: ["sains-teknologi"] },
      { id: "c", teks: "Pengusaha, bankir, atau konsultan", kategori: ["ekonomi-bisnis"] },
      { id: "d", teks: "Pengacara, diplomat, atau birokrat", kategori: ["hukum", "sosial-humaniora"] },
    ],
  },
  {
    id: "q4",
    pertanyaan: "Apa yang paling mendefinisikan cara kamu belajar?",
    opsi: [
      { id: "a", teks: "Suka analisis angka dan data", kategori: ["sains-teknologi", "ekonomi-bisnis"] },
      { id: "b", teks: "Suka diskusi dan interaksi sosial", kategori: ["sosial-humaniora", "hukum"] },
      { id: "c", teks: "Suka praktik langsung dan eksperimen", kategori: ["kesehatan", "sains-teknologi"] },
      { id: "d", teks: "Suka berkreasi dan berimajinasi", kategori: ["seni-desain"] },
    ],
  },
  {
    id: "q5",
    pertanyaan: "Lingkungan kerja seperti apa yang kamu inginkan?",
    opsi: [
      { id: "a", teks: "Kantor dengan tim dan kolaborasi", kategori: ["ekonomi-bisnis", "sosial-humaniora"] },
      { id: "b", teks: "Rumah sakit atau klinik", kategori: ["kesehatan"] },
      { id: "c", teks: "Lab riset atau perusahaan teknologi", kategori: ["sains-teknologi"] },
      { id: "d", teks: "Studio kreatif atau agensi", kategori: ["seni-desain"] },
    ],
  },
];

export default function KesesuaianJurusan() {
  const navigate = useNavigate();
  const { simpanJawabanSurvei, simpanHasilKesesuaian } = useProdiStore();

  const [indexSaat, setIndexSaat] = useState(0);
  const [jawaban, setJawaban] = useState({});
  const [memilih, setMemilih] = useState(false);

  const pertanyaanSaat = PERTANYAAN[indexSaat];
  const total = PERTANYAAN.length;
  const progress = ((indexSaat) / total) * 100;
  const isLast = indexSaat === total - 1;

  const pilihOpsi = (opsi) => {
    if (memilih) return;
    setMemilih(true);

    const jawabanBaru = { ...jawaban, [pertanyaanSaat.id]: opsi };
    setJawaban(jawabanBaru);
    simpanJawabanSurvei(pertanyaanSaat.id, opsi);

    setTimeout(() => {
      if (isLast) {
        // Hitung hasil berdasarkan bobot kategori
        const skor = {};
        Object.values(jawabanBaru).forEach((o) => {
          o.kategori.forEach((kat) => {
            skor[kat] = (skor[kat] || 0) + 1;
          });
        });
        const sorted = Object.entries(skor).sort((a, b) => b[1] - a[1]);
        simpanHasilKesesuaian({
          skorKategori: skor,
          kategoriUtama: sorted[0]?.[0] || "sains-teknologi",
          kategoriLainnya: sorted.slice(1, 3).map(([k]) => k),
        });
        navigate(ROUTES.HASIL_KESESUAIAN);
      } else {
        setIndexSaat((i) => i + 1);
        setMemilih(false);
      }
    }, 350);
  };

  const kembali = () => {
    if (indexSaat > 0) {
      setIndexSaat((i) => i - 1);
      setMemilih(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto pt-8">
        {/* Progress */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-purple-400 font-syne font-semibold">
            Pertanyaan {indexSaat + 1}/{total}
          </span>
          <span className="text-xs text-purple-500 font-mono">{Math.round(progress)}%</span>
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

        {/* Card pertanyaan */}
        <div
          className="rounded-2xl p-8 animate-fade-in"
          style={{
            background: "linear-gradient(135deg, rgba(45,27,105,0.5) 0%, rgba(26,16,64,0.7) 100%)",
            border: "1px solid rgba(167,139,250,0.25)",
            boxShadow: "0 8px 40px rgba(91,33,182,0.2), inset 0 0 80px rgba(124,58,237,0.05)",
          }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-white font-syne mb-8 leading-snug">
            {pertanyaanSaat.pertanyaan}
          </h2>

          {/* Opsi */}
          <div className="space-y-3">
            {pertanyaanSaat.opsi.map((opsi) => {
              const dipilih = jawaban[pertanyaanSaat.id]?.id === opsi.id;
              return (
                <button
                  key={opsi.id}
                  onClick={() => pilihOpsi(opsi)}
                  className={`
                    w-full flex items-center justify-between
                    px-5 py-4 rounded-xl text-left
                    transition-all duration-300
                    font-syne text-sm font-medium
                    ${dipilih
                      ? "bg-purple-600/30 border border-purple-400/50 text-white"
                      : "bg-purple-900/20 border border-purple-500/20 text-purple-200 hover:bg-purple-800/20 hover:border-purple-400/30 hover:text-white"
                    }
                  `}
                >
                  <span>{opsi.teks}</span>
                  <ChevronRight
                    size={16}
                    className={`flex-shrink-0 transition-colors ${dipilih ? "text-purple-300" : "text-purple-600"}`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Tombol kembali */}
        {indexSaat > 0 && (
          <button
            onClick={kembali}
            className="mt-5 flex items-center gap-2 text-sm text-purple-400 hover:text-purple-200 transition-colors font-syne"
          >
            <ChevronLeft size={16} />
            Kembali
          </button>
        )}
      </div>
    </PageWrapper>
  );
}
