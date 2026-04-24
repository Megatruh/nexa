/**
 * Detail Prodi - Halaman detail program studi
 * Menampilkan: info lengkap, statistik, ulasan, prospek karir
 */

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Star, Users, TrendingUp, MapPin, Award,
  BookOpen, Briefcase, DollarSign, ChevronRight
} from "lucide-react";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { Badge } from "../../components/ui/Badge";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { DATA_PRODI } from "../../constants/kategoriProdi";
import { formatNumber, formatRupiah } from "../../utils/formatters";
import { hitungPeluangLolos } from "../../utils/rekomendasiProdi";
import { useTryoutStore } from "../../store/tryoutStore";

export default function DetailProdi() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { hasilTerakhir } = useTryoutStore();

  const prodi = DATA_PRODI.find((p) => p.slug === slug);

  if (!prodi) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <p className="text-purple-400 font-syne text-xl">Prodi tidak ditemukan</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 nexa-btn-secondary"
          >
            Kembali
          </button>
        </div>
      </PageWrapper>
    );
  }

  // Hitung peluang jika ada hasil try out
  const peluang = hasilTerakhir
    ? hitungPeluangLolos(hasilTerakhir.skorTotal, prodi.passing_grade)
    : null;

  return (
    <PageWrapper>
      {/* Kembali */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-purple-400 hover:text-white transition-colors font-syne mb-6"
      >
        <ArrowLeft size={16} />
        Kembali ke Daftar Prodi
      </button>

      {/* Header Prodi */}
      <div className="nexa-card p-7 mb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="default">{prodi.akreditasi}</Badge>
              <Badge
                variant={prodi.keketatan === "Sangat Ketat" ? "danger" : "warning"}
              >
                {prodi.keketatan}
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white font-syne mb-1">
              {prodi.nama}
            </h1>
            <p className="text-purple-300 font-syne font-semibold">{prodi.universitas}</p>
            <div className="flex items-center gap-1 mt-2 text-purple-400 text-sm font-syne">
              <MapPin size={14} />
              <span>{prodi.lokasi}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="text-center md:text-right">
            <div className="flex items-center gap-1 justify-center md:justify-end mb-1">
              <Star size={20} className="text-yellow-400 fill-yellow-400" />
              <span className="text-2xl font-bold text-white font-syne">{prodi.rating}</span>
            </div>
            <p className="text-xs text-purple-400 font-syne">{formatNumber(prodi.ulasan)} ulasan</p>
          </div>
        </div>

        <p className="text-sm text-purple-300 font-syne mt-4 leading-relaxed">{prodi.deskripsi}</p>
      </div>

      {/* Statistik 3 kolom */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Passing Grade", nilai: `${prodi.passing_grade}%`, icon: TrendingUp },
          { label: "Peminat", nilai: formatNumber(prodi.peminat), icon: Users },
          { label: "Daya Tampung", nilai: prodi.daya_tampung, icon: BookOpen },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="nexa-card p-4 text-center">
              <Icon size={20} className="text-purple-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-white font-mono">{item.nilai}</p>
              <p className="text-xs text-purple-400 font-syne mt-0.5">{item.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peluang lolos (jika ada hasil TO) */}
        {peluang && (
          <div className="nexa-card p-6">
            <h3 className="font-bold text-white font-syne mb-4">
              Estimasi Peluang Lolos (Berdasarkan TO)
            </h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-syne" style={{ color: peluang.warna }}>
                {peluang.label}
              </span>
              <span
                className="text-2xl font-bold font-mono"
                style={{ color: peluang.warna }}
              >
                {peluang.persentase}%
              </span>
            </div>
            <ProgressBar
              value={peluang.persentase}
              color={peluang.warna}
              height="h-3"
            />
            <p className="text-xs text-purple-500 font-syne mt-2">
              *Estimasi berdasarkan skor simulasi, bukan jaminan kelulusan
            </p>
          </div>
        )}

        {/* Prospek Karir */}
        <div className="nexa-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase size={18} className="text-purple-400" />
            <h3 className="font-bold text-white font-syne">Prospek Karir</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {prodi.prospek.map((karir, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-syne font-semibold"
                style={{
                  background: "rgba(124,58,237,0.2)",
                  border: "1px solid rgba(167,139,250,0.25)",
                  color: "#c4b5fd",
                }}
              >
                {karir}
              </span>
            ))}
          </div>
        </div>

        {/* Biaya */}
        <div className="nexa-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={18} className="text-purple-400" />
            <h3 className="font-bold text-white font-syne">Biaya per Semester</h3>
          </div>
          <p className="text-2xl font-bold text-white font-mono">
            {formatRupiah(prodi.biaya)}
          </p>
          <p className="text-xs text-purple-500 font-syne mt-1">
            *Estimasi UKT/SPP, dapat berbeda berdasarkan jalur masuk
          </p>
        </div>

        {/* Kurikulum */}
        <div className="nexa-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-purple-400" />
            <h3 className="font-bold text-white font-syne">Mata Kuliah Unggulan</h3>
          </div>
          <ul className="space-y-2">
            {prodi.kurikulum.map((mk, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-purple-300 font-syne">
                <ChevronRight size={14} className="text-purple-600 flex-shrink-0" />
                {mk}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/try-out")}
          className="nexa-btn-primary px-8"
        >
          Cek Peluangmu dengan Try Out
        </button>
      </div>
    </PageWrapper>
  );
}
