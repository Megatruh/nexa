/**
 * LatihanSoal - Halaman pilih subtes latihan soal
 * Mirip MateriList tapi untuk latihan soal (mirip screenshot page-belajar-latihansoal)
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { PenLine } from "lucide-react";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { SUBTES_LIST } from "../../constants/subtesTryOut";

export default function LatihanSoal() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white font-syne mb-2">
          Latihan Soal
        </h1>
        <p className="text-purple-300 font-syne text-sm">
          Pilih subtes untuk berlatih soal-soal UTBK-SNBT.
        </p>
      </div>

      {/* Grid subtes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUBTES_LIST.map((subtes) => (
          <button
            key={subtes.id}
            onClick={() => navigate(`/belajar/latihan-soal/${subtes.id}`)}
            className="subtest-card text-left p-5 group"
          >
            <div
              className="absolute inset-0 rounded-xl opacity-30"
              style={{
                background:
                  "linear-gradient(135deg, rgba(109,40,217,0.4) 0%, rgba(76,29,149,0.2) 60%, transparent 100%)",
              }}
            />
            <div className="relative z-10">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: "rgba(167,139,250,0.15)",
                  border: "1px solid rgba(167,139,250,0.25)",
                }}
              >
                <PenLine size={18} className="text-purple-300" />
              </div>
              <h3 className="font-bold text-white font-syne text-sm leading-snug mb-1 group-hover:text-purple-200 transition-colors">
                {subtes.nama}
              </h3>
              <p className="text-xs text-purple-400 font-syne">
                {subtes.paketLatihan} Paket Latihan
              </p>
            </div>
          </button>
        ))}
      </div>
    </PageWrapper>
  );
}
