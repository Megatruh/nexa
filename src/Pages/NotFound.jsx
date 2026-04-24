/**
 * NotFound - Halaman 404
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { ROUTES } from "../constants/routes";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center p-6"
      style={{ background: "linear-gradient(135deg, #0d0820, #1a1040, #2d1b69)" }}
    >
      <div
        className="text-[10rem] font-black font-display leading-none mb-4"
        style={{
          background: "linear-gradient(135deg, rgba(167,139,250,0.3), rgba(91,33,182,0.15))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        404
      </div>
      <h1 className="text-2xl font-bold text-white font-syne mb-3">Halaman Tidak Ditemukan</h1>
      <p className="text-purple-400 font-syne text-sm mb-8 max-w-sm">
        Halaman yang kamu cari mungkin sudah dipindahkan atau tidak tersedia.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="nexa-btn-secondary flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Kembali
        </button>
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="nexa-btn-primary flex items-center gap-2"
        >
          <Home size={16} /> Beranda
        </button>
      </div>
    </div>
  );
}
