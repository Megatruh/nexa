/**
 * MateriDetail - Halaman detail & viewer materi per subtes
 * Menampilkan daftar materi PDF, user bisa membuka dan membaca
 */

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, FileText, Download, Eye, Clock, CheckCircle, Lock,
} from "lucide-react";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { Badge } from "../../components/ui/Badge";
import { SUBTES_LIST } from "../../constants/subtesTryOut";
import { useAuthStore } from "../../store/authStore";

// Data dummy materi per subtes
const MATERI_DUMMY = [
  { id: "1", judul: "Pengenalan dan Konsep Dasar", halaman: 24, durasi: "30 mnt", gratis: true, selesai: false },
  { id: "2", judul: "Strategi dan Teknik Menjawab", halaman: 18, durasi: "25 mnt", gratis: true, selesai: false },
  { id: "3", judul: "Soal Tipe A: Analogi", halaman: 32, durasi: "40 mnt", gratis: false, selesai: false },
  { id: "4", judul: "Soal Tipe B: Silogisme", halaman: 28, durasi: "35 mnt", gratis: false, selesai: false },
  { id: "5", judul: "Soal Tipe C: Pemecahan Masalah", halaman: 36, durasi: "45 mnt", gratis: false, selesai: false },
  { id: "6", judul: "Pembahasan Soal UTBK 2022", halaman: 44, durasi: "55 mnt", gratis: false, selesai: false },
  { id: "7", judul: "Latihan Komprehensif & Kisi-kisi", halaman: 52, durasi: "60 mnt", gratis: false, selesai: false },
];

export default function MateriDetail() {
  const { subtes: subtesId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const subtes = SUBTES_LIST.find((s) => s.id === subtesId);
  const [materiDibuka, setMateriDibuka] = useState(null);

  if (!subtes) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <p className="text-purple-400 font-syne">Subtes tidak ditemukan</p>
          <button onClick={() => navigate(-1)} className="mt-4 nexa-btn-secondary">
            Kembali
          </button>
        </div>
      </PageWrapper>
    );
  }

  const bukaMateri = (materi) => {
    if (!materi.gratis && !isAuthenticated) {
      navigate("/login");
      return;
    }
    setMateriDibuka(materi);
  };

  // Viewer PDF (placeholder - di implementasi nyata pakai PDF.js atau iframe)
  if (materiDibuka) {
    return (
      <PageWrapper fullWidth>
        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* Toolbar viewer */}
          <div
            className="flex items-center justify-between p-4 rounded-xl mb-4"
            style={{
              background: "rgba(45,27,105,0.5)",
              border: "1px solid rgba(167,139,250,0.2)",
            }}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMateriDibuka(null)}
                className="p-1.5 rounded-lg text-purple-400 hover:text-white hover:bg-purple-500/20 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <p className="text-sm font-bold text-white font-syne">{materiDibuka.judul}</p>
                <p className="text-xs text-purple-400 font-syne">{subtes.nama}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-purple-400 font-syne">
                {materiDibuka.halaman} halaman
              </span>
              <button className="p-2 rounded-lg text-purple-400 hover:text-white hover:bg-purple-500/20 transition-colors">
                <Download size={16} />
              </button>
            </div>
          </div>

          {/* PDF Viewer placeholder */}
          <div
            className="w-full rounded-2xl flex flex-col items-center justify-center"
            style={{
              height: "70vh",
              background: "rgba(26,16,64,0.8)",
              border: "1px solid rgba(167,139,250,0.15)",
            }}
          >
            <FileText size={48} className="text-purple-400 mb-4" />
            <p className="text-white font-syne font-bold text-lg mb-2">{materiDibuka.judul}</p>
            <p className="text-purple-400 font-syne text-sm mb-6 max-w-md text-center">
              PDF viewer akan tampil di sini. Integrasikan dengan PDF.js atau iframe untuk menampilkan
              file PDF dari backend.
            </p>
            <div
              className="px-4 py-2 rounded-lg text-xs text-purple-300 font-mono"
              style={{ background: "rgba(91,33,182,0.2)", border: "1px solid rgba(167,139,250,0.2)" }}
            >
              GET /api/materi/{subtesId}/{materiDibuka.id}/pdf
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Back */}
      <button
        onClick={() => navigate("/belajar/materi")}
        className="flex items-center gap-2 text-sm text-purple-400 hover:text-white transition-colors font-syne mb-6"
      >
        <ArrowLeft size={16} />
        Kembali ke Materi Belajar
      </button>

      {/* Header subtes */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(167,139,250,0.15)",
              border: "1px solid rgba(167,139,250,0.3)",
            }}
          >
            <FileText size={20} className="text-purple-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-syne">{subtes.nama}</h1>
            <p className="text-sm text-purple-400 font-syne">{MATERI_DUMMY.length} materi tersedia</p>
          </div>
        </div>
        <p className="text-sm text-purple-300 font-syne mt-3 leading-relaxed max-w-xl">
          {subtes.deskripsi}
        </p>
      </div>

      {/* Daftar materi */}
      <div className="space-y-3">
        {MATERI_DUMMY.map((materi, idx) => {
          const terkunci = !materi.gratis && !isAuthenticated;
          return (
            <div
              key={materi.id}
              className={`
                flex items-center justify-between p-5 rounded-xl
                transition-all duration-300
                ${terkunci
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer hover:border-purple-400/40"
                }
              `}
              style={{
                background: materi.selesai
                  ? "rgba(16,185,129,0.1)"
                  : "rgba(45,27,105,0.35)",
                border: materi.selesai
                  ? "1px solid rgba(16,185,129,0.25)"
                  : "1px solid rgba(167,139,250,0.15)",
              }}
              onClick={() => !terkunci && bukaMateri(materi)}
            >
              {/* Nomor + info */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono font-bold text-purple-600 w-5 text-center">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white font-syne">{materi.judul}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-purple-400 font-syne flex items-center gap-1">
                      <FileText size={11} /> {materi.halaman} hal
                    </span>
                    <span className="text-xs text-purple-400 font-syne flex items-center gap-1">
                      <Clock size={11} /> {materi.durasi}
                    </span>
                    {materi.gratis && (
                      <Badge variant="success" className="text-xs">Gratis</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Status icon */}
              <div>
                {materi.selesai ? (
                  <CheckCircle size={20} className="text-emerald-400" />
                ) : terkunci ? (
                  <Lock size={18} className="text-purple-600" />
                ) : (
                  <Eye size={18} className="text-purple-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PageWrapper>
  );
}
