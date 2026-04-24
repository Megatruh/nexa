/**
 * TryOut/index.jsx - Halaman pilih paket Try Out
 * Menampilkan paket TO yang tersedia beserta info detail
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock, FileText, Zap, ChevronRight, AlertCircle, X,
} from "lucide-react";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { Badge } from "../../components/ui/Badge";
import { PAKET_TRYOUT, SUBTES_LIST } from "../../constants/subtesTryOut";
import { formatDurasi } from "../../utils/formatters";

// Dialog konfirmasi sebelum mulai TO
function KonfirmasiDialog({ paket, onMulai, onBatal }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onBatal} />
      <div
        className="relative max-w-md w-full rounded-2xl p-6 animate-slide-up"
        style={{
          background: "linear-gradient(135deg, #1a1040, #0d0820)",
          border: "1px solid rgba(167,139,250,0.3)",
          boxShadow: "0 24px 64px rgba(91,33,182,0.4)",
        }}
      >
        <button
          onClick={onBatal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-purple-400 hover:text-white hover:bg-purple-500/20 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(167,139,250,0.3)" }}
          >
            <Zap size={20} className="text-purple-300" />
          </div>
          <div>
            <h3 className="font-bold text-white font-syne">Siap Memulai?</h3>
            <p className="text-xs text-purple-400 font-syne">{paket.nama}</p>
          </div>
        </div>

        <div className="space-y-2 mb-5">
          {[
            { label: "Total Soal", nilai: `${paket.totalSoal} soal` },
            { label: "Durasi", nilai: formatDurasi(paket.totalWaktu) },
            { label: "Tingkat Kesulitan", nilai: paket.tingkatKesulitan },
          ].map((item) => (
            <div key={item.label} className="flex justify-between text-sm font-syne">
              <span className="text-purple-400">{item.label}</span>
              <span className="text-white font-semibold">{item.nilai}</span>
            </div>
          ))}
        </div>

        <div
          className="flex items-start gap-2 p-3 rounded-xl mb-5"
          style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}
        >
          <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300 font-syne leading-relaxed">
            Timer akan berjalan otomatis. Soal diacak khusus untuk sesi ini. Pastikan koneksi internet stabil.
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={onBatal} className="nexa-btn-secondary flex-1">
            Batal
          </button>
          <button onClick={onMulai} className="nexa-btn-primary flex-1">
            Mulai Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TryOut() {
  const navigate = useNavigate();
  const [paketDipilih, setPaketDipilih] = useState(null);

  const tingkatVariant = {
    Mudah: "success",
    Sedang: "warning",
    Sulit: "danger",
  };

  const badgeVariant = {
    Populer: "gold",
    Baru: "info",
  };

  const mulaiTryOut = () => {
    if (paketDipilih) {
      navigate(`/try-out/${paketDipilih.id}/soal`);
    }
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white font-syne mb-2">
          Simulasi Try Out UTBK
        </h1>
        <p className="text-purple-300 font-syne text-sm">
          Pilih paket Try Out. Setiap sesi menggunakan urutan soal yang berbeda secara otomatis.
        </p>
      </div>

      {/* Info subtes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 p-4 rounded-2xl"
        style={{
          background: "rgba(45,27,105,0.25)",
          border: "1px solid rgba(167,139,250,0.15)",
        }}
      >
        {SUBTES_LIST.slice(0, 4).map((s) => (
          <div key={s.id} className="text-center p-2">
            <p className="text-xs font-bold text-purple-300 font-mono">{s.singkatan}</p>
            <p className="text-xs text-purple-500 font-syne mt-0.5">{s.jumlahSoal} soal</p>
          </div>
        ))}
      </div>

      {/* Paket TO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PAKET_TRYOUT.map((paket) => (
          <div
            key={paket.id}
            className="nexa-card p-6 cursor-pointer group flex flex-col"
            onClick={() => setPaketDipilih(paket)}
          >
            {/* Badges */}
            <div className="flex items-center gap-2 mb-4">
              <Badge variant={tingkatVariant[paket.tingkatKesulitan] || "default"}>
                {paket.tingkatKesulitan}
              </Badge>
              {paket.badge && (
                <Badge variant={badgeVariant[paket.badge] || "default"}>
                  {paket.badge}
                </Badge>
              )}
            </div>

            <h3 className="font-bold text-white font-syne text-lg mb-2 group-hover:text-purple-200 transition-colors">
              {paket.nama}
            </h3>
            <p className="text-xs text-purple-400 font-syne leading-relaxed mb-5 flex-1">
              {paket.deskripsi}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div
                className="p-3 rounded-xl text-center"
                style={{ background: "rgba(91,33,182,0.2)", border: "1px solid rgba(167,139,250,0.15)" }}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <FileText size={13} className="text-purple-400" />
                  <span className="text-xs text-purple-400 font-syne">Total Soal</span>
                </div>
                <p className="text-base font-bold text-white font-mono">{paket.totalSoal}</p>
              </div>
              <div
                className="p-3 rounded-xl text-center"
                style={{ background: "rgba(91,33,182,0.2)", border: "1px solid rgba(167,139,250,0.15)" }}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock size={13} className="text-purple-400" />
                  <span className="text-xs text-purple-400 font-syne">Durasi</span>
                </div>
                <p className="text-base font-bold text-white font-mono">
                  {paket.totalWaktu}m
                </p>
              </div>
            </div>

            {/* CTA */}
            <button
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold font-syne transition-all duration-300"
              style={{
                background: "rgba(124,58,237,0.2)",
                border: "1px solid rgba(167,139,250,0.3)",
                color: "#c4b5fd",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(124,58,237,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(124,58,237,0.2)";
              }}
            >
              Pilih Paket
              <ChevronRight size={15} />
            </button>
          </div>
        ))}
      </div>

      {/* Dialog konfirmasi */}
      {paketDipilih && (
        <KonfirmasiDialog
          paket={paketDipilih}
          onMulai={mulaiTryOut}
          onBatal={() => setPaketDipilih(null)}
        />
      )}
    </PageWrapper>
  );
}
