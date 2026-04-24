/**
 * TryOut/Soal.jsx - Halaman pengerjaan soal Try Out
 * Fitur:
 * - Countdown timer per subtes
 * - Soal diacak dengan RNG (Fisher-Yates)
 * - Navigasi antar soal (prev/next/goto)
 * - Flag soal untuk review
 * - Panel navigasi soal
 * - Auto-submit saat waktu habis
 */

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Flag, ChevronLeft, ChevronRight, Send, X, AlertTriangle,
} from "lucide-react";
import { TryOutWrapper } from "../../components/layout/PageWrapper";
import { useSoalRNG } from "../../hooks/useSoalRNG";
import { useTimer } from "../../hooks/useTimer";
import { SUBTES_LIST, PAKET_TRYOUT } from "../../constants/subtesTryOut";
import { acakSoalDenganOpsi } from "../../utils/rngSoal";
import { hitungSkorTotal } from "../../utils/hitungSkor";
import { useTryoutStore } from "../../store/tryoutStore";

// Generate bank soal dummy untuk demo
function buatSoalDummy(subtesId, jumlah) {
  return Array.from({ length: jumlah }, (_, i) => ({
    id: `${subtesId}-${i + 1}`,
    teks: `[${subtesId.toUpperCase()}] Soal nomor ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pilihan mana yang paling tepat berdasarkan informasi yang diberikan?`,
    opsi: [
      { id: "A", teks: "Pilihan A - jawaban pertama yang bisa dipilih" },
      { id: "B", teks: "Pilihan B - jawaban kedua yang bisa dipilih" },
      { id: "C", teks: "Pilihan C - jawaban ketiga yang bisa dipilih" },
      { id: "D", teks: "Pilihan D - jawaban keempat yang bisa dipilih" },
      { id: "E", teks: "Pilihan E - jawaban kelima yang bisa dipilih" },
    ],
    kunciJawaban: "A",
    subtesId,
  }));
}

// Dialog konfirmasi submit
function DialogSubmit({ onSubmit, onBatal, jumlahBelum }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative max-w-sm w-full rounded-2xl p-6"
        style={{
          background: "linear-gradient(135deg, #1a1040, #0d0820)",
          border: "1px solid rgba(167,139,250,0.3)",
        }}
      >
        <div className="text-center mb-5">
          <AlertTriangle size={40} className="text-amber-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white font-syne">Selesaikan Try Out?</h3>
          {jumlahBelum > 0 && (
            <p className="text-sm text-amber-300 font-syne mt-2">
              Masih ada {jumlahBelum} soal yang belum dijawab.
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button onClick={onBatal} className="nexa-btn-secondary flex-1">Kembali</button>
          <button onClick={onSubmit} className="nexa-btn-primary flex-1">Submit</button>
        </div>
      </div>
    </div>
  );
}

export default function TryOutSoal() {
  const { paketId } = useParams();
  const navigate = useNavigate();
  const { selesaikanTryOut } = useTryoutStore();

  const paket = PAKET_TRYOUT.find((p) => p.id === paketId);

  // Buat semua soal dari semua subtes, diacak per subtes
  const semuaSoal = useMemo(() => {
    if (!paket) return [];
    let hasil = [];
    paket.subtes.forEach((subtesId) => {
      const subtes = SUBTES_LIST.find((s) => s.id === subtesId);
      if (!subtes) return;
      const soal = buatSoalDummy(subtesId, subtes.jumlahSoal);
      hasil = [...hasil, ...acakSoalDenganOpsi(soal)];
    });
    return hasil;
  }, [paket]);

  const {
    soalSaat, indexSaat, jawaban, flagged,
    totalSoal, jumlahDijawab, jumlahBelumDijawab,
    jawabSoal, next, prev, goTo, toggleFlag,
    jawabanSoalSaat, isFlagged,
  } = useSoalRNG(semuaSoal);

  const [showSubmit, setShowSubmit] = useState(false);
  const [showNav, setShowNav] = useState(false);

  // Timer
  const handleTimeout = () => setShowSubmit(true);
  const { display: timerDisplay, warnaTimer, persenSisa } = useTimer(
    paket?.totalWaktu || 205,
    handleTimeout
  );

  // ✅ Start timer on mount
  const { mulai } = useTimer(paket?.totalWaktu || 205, handleTimeout);
  useEffect(() => { mulai(); }, []);

  if (!paket || semuaSoal.length === 0) {
    return (
      <TryOutWrapper>
        <div className="flex items-center justify-center h-screen">
          <p className="text-purple-400 font-syne">Paket tidak ditemukan</p>
        </div>
      </TryOutWrapper>
    );
  }

  const submitTryOut = () => {
    // Hitung skor per subtes
    const skorPerSubtes = {};
    SUBTES_LIST.forEach((s) => {
      const soalSubtes = semuaSoal.filter((q) => q.subtesId === s.id);
      let benar = 0;
      soalSubtes.forEach((soal, i) => {
        const globalIdx = semuaSoal.indexOf(soal);
        if (jawaban[globalIdx] === soal.kunciJawaban) benar++;
      });
      skorPerSubtes[s.id] = { benar, total: soalSubtes.length };
    });

    const hasil = hitungSkorTotal(skorPerSubtes);
    selesaikanTryOut({ ...hasil, paketId });
    navigate(`/try-out/${paketId}/hasil`);
  };

  const subtesIndikator = SUBTES_LIST.map((s) => {
    const soalSubtes = semuaSoal
      .map((q, i) => ({ ...q, globalIdx: i }))
      .filter((q) => q.subtesId === s.id);
    const dijawab = soalSubtes.filter((q) => jawaban[q.globalIdx] !== undefined).length;
    return { ...s, total: soalSubtes.length, dijawab };
  });

  return (
    <TryOutWrapper>
      <div className="flex h-screen overflow-hidden">
        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header bar */}
          <div
            className="flex items-center justify-between px-5 py-3 flex-shrink-0"
            style={{
              background: "rgba(26,16,64,0.9)",
              borderBottom: "1px solid rgba(167,139,250,0.15)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Logo */}
            <span
              className="font-display font-bold text-base tracking-widest"
              style={{
                background: "linear-gradient(135deg, #c4b5fd, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              NEXA
            </span>

            {/* Timer */}
            <div className="flex items-center gap-2">
              <div
                className="px-4 py-1.5 rounded-xl font-mono font-bold text-lg"
                style={{
                  color: warnaTimer,
                  background: `${warnaTimer}15`,
                  border: `1px solid ${warnaTimer}40`,
                }}
              >
                {timerDisplay}
              </div>
            </div>

            {/* Progress + submit */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-purple-400 font-syne">
                {jumlahDijawab}/{totalSoal}
              </span>
              <button
                onClick={() => setShowNav((v) => !v)}
                className="text-xs px-3 py-1.5 rounded-lg font-syne font-semibold text-purple-300 hover:text-white transition-colors"
                style={{ border: "1px solid rgba(167,139,250,0.25)" }}
              >
                Navigasi
              </button>
              <button
                onClick={() => setShowSubmit(true)}
                className="flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-lg font-syne font-semibold text-purple-200"
                style={{
                  background: "rgba(124,58,237,0.3)",
                  border: "1px solid rgba(167,139,250,0.4)",
                }}
              >
                <Send size={13} /> Selesai
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-0.5 bg-purple-900/40">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${((indexSaat + 1) / totalSoal) * 100}%`,
                background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
              }}
            />
          </div>

          {/* Soal area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto">
              {/* Info soal */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs text-purple-400 font-syne font-semibold">
                  Soal {indexSaat + 1} dari {totalSoal}
                  <span className="ml-2 text-purple-600">
                    [{soalSaat?.subtesId?.toUpperCase()}]
                  </span>
                </span>
                <button
                  onClick={toggleFlag}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-syne transition-all ${
                    isFlagged
                      ? "text-amber-300 bg-amber-500/15 border border-amber-500/30"
                      : "text-purple-400 hover:text-amber-300 border border-purple-500/20"
                  }`}
                >
                  <Flag size={13} />
                  {isFlagged ? "Ditandai" : "Tandai"}
                </button>
              </div>

              {/* Teks soal */}
              <div
                className="p-6 rounded-2xl mb-6"
                style={{
                  background: "rgba(45,27,105,0.4)",
                  border: "1px solid rgba(167,139,250,0.2)",
                }}
              >
                <p className="text-white font-syne text-sm leading-relaxed">
                  {soalSaat?.teks}
                </p>
              </div>

              {/* Opsi jawaban */}
              <div className="space-y-3">
                {soalSaat?.opsi?.map((opsi) => {
                  const dipilih = jawabanSoalSaat === opsi.id;
                  return (
                    <button
                      key={opsi.id}
                      onClick={() => jawabSoal(opsi.id)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200"
                      style={{
                        background: dipilih
                          ? "rgba(124,58,237,0.3)"
                          : "rgba(45,27,105,0.25)",
                        border: dipilih
                          ? "1px solid rgba(167,139,250,0.5)"
                          : "1px solid rgba(167,139,250,0.12)",
                      }}
                    >
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 transition-all"
                        style={{
                          background: dipilih ? "rgba(167,139,250,0.3)" : "rgba(91,33,182,0.2)",
                          border: dipilih ? "1px solid #a78bfa" : "1px solid rgba(167,139,250,0.2)",
                          color: dipilih ? "#e8e0ff" : "#a78bfa",
                        }}
                      >
                        {opsi.id}
                      </span>
                      <span
                        className="text-sm font-syne"
                        style={{ color: dipilih ? "#f5f3ff" : "#c4b5fd" }}
                      >
                        {opsi.teks}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Prev/Next navigation */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={prev}
                  disabled={indexSaat === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold font-syne disabled:opacity-30 disabled:cursor-not-allowed text-purple-300 hover:text-white transition-colors"
                  style={{ border: "1px solid rgba(167,139,250,0.2)" }}
                >
                  <ChevronLeft size={16} /> Sebelumnya
                </button>
                <button
                  onClick={next}
                  disabled={indexSaat === totalSoal - 1}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold font-syne disabled:opacity-30 disabled:cursor-not-allowed text-purple-300 hover:text-white transition-colors"
                  style={{ border: "1px solid rgba(167,139,250,0.2)" }}
                >
                  Berikutnya <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Panel navigasi soal */}
        {showNav && (
          <div
            className="w-72 flex-shrink-0 overflow-y-auto flex flex-col"
            style={{
              background: "rgba(13,8,32,0.95)",
              borderLeft: "1px solid rgba(167,139,250,0.15)",
            }}
          >
            <div className="flex items-center justify-between p-4 border-b border-purple-500/15">
              <span className="text-sm font-bold text-white font-syne">Navigasi Soal</span>
              <button
                onClick={() => setShowNav(false)}
                className="p-1 rounded text-purple-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Progress per subtes */}
            <div className="p-4 border-b border-purple-500/15 space-y-3">
              {subtesIndikator.map((s) => (
                <div key={s.id}>
                  <div className="flex justify-between text-xs text-purple-400 font-syne mb-1">
                    <span>{s.singkatan}</span>
                    <span className="font-mono">{s.dijawab}/{s.total}</span>
                  </div>
                  <div className="h-1 bg-purple-900/40 rounded-full">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${s.total > 0 ? (s.dijawab / s.total) * 100 : 0}%`,
                        background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Grid nomor soal */}
            <div className="p-4 flex-1">
              <p className="text-xs text-purple-500 font-syne mb-3">
                <span className="inline-block w-3 h-3 rounded bg-purple-600/40 mr-1.5" />Dijawab
                <span className="inline-block w-3 h-3 rounded bg-amber-500/40 ml-3 mr-1.5" />Ditandai
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {semuaSoal.map((_, i) => {
                  const isDijawab = jawaban[i] !== undefined;
                  const isFlagged = flagged.has(i);
                  const isAktif = indexSaat === i;
                  return (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className="w-full aspect-square rounded-lg text-xs font-mono font-bold transition-all"
                      style={{
                        background: isAktif
                          ? "rgba(167,139,250,0.4)"
                          : isFlagged
                          ? "rgba(245,158,11,0.25)"
                          : isDijawab
                          ? "rgba(91,33,182,0.4)"
                          : "rgba(45,27,105,0.3)",
                        border: isAktif
                          ? "1px solid #a78bfa"
                          : isFlagged
                          ? "1px solid rgba(245,158,11,0.4)"
                          : "1px solid rgba(167,139,250,0.1)",
                        color: isAktif ? "#fff" : isFlagged ? "#fcd34d" : isDijawab ? "#c4b5fd" : "#6d28d9",
                      }}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dialog submit */}
      {showSubmit && (
        <DialogSubmit
          jumlahBelum={totalSoal - jumlahDijawab}
          onSubmit={submitTryOut}
          onBatal={() => setShowSubmit(false)}
        />
      )}
    </TryOutWrapper>
  );
}
