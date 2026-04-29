/**
 * ProdiCard - Kartu program studi
 * Menampilkan info singkat prodi: nama, universitas, passing grade, rating
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, Users, TrendingUp, MapPin, Award } from "lucide-react";
import { Badge } from "../ui/Badge";
import { formatNumber } from "../../utils/formatters";

export function ProdiCard({ prodi }) {
  const navigate = useNavigate();

  const keketatanVariant = {
    "Sangat Ketat": "danger",
    "Ketat": "warning",
    "Sedang": "info",
    "Mudah": "success",
  }[prodi.keketatan] || "default";

  return (
    <div
      className="nexa-card p-5 cursor-pointer group"
      onClick={() => navigate(`/ulasan-prodi/${prodi.slug}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white font-syne text-sm leading-snug group-hover:text-purple-200 transition-colors">
            {prodi.nama}
          </h3>
          <p className="text-xs text-purple-400 font-syne mt-0.5 flex items-center gap-1">
            <span className="font-semibold text-purple-300">{prodi.akronim}</span>
            <span>·</span>
            {prodi.universitas.split("(")[0].trim()}
          </p>
        </div>
        <Badge variant={keketatanVariant} className="ml-2 flex-shrink-0 text-xs">
          {prodi.keketatan}
        </Badge>
      </div>

      {/* Akreditasi */}
      <div className="flex items-center gap-1.5 mb-3">
        <Award size={12} className="text-yellow-400" />
        <span className="text-xs text-yellow-300 font-syne">{prodi.akreditasi}</span>
        <span className="text-purple-600 mx-1">·</span>
        <MapPin size={12} className="text-purple-400" />
        <span className="text-xs text-purple-400 font-syne">{prodi.lokasi}</span>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-3 gap-3 mt-3">
        <div className="text-center">
          <p className="text-xs text-purple-400 font-syne mb-0.5">Passing Grade</p>
          <p className="text-sm font-bold text-white font-mono">{prodi.passing_grade}%</p>
        </div>
        <div className="text-center border-x border-purple-500/20">
          <p className="text-xs text-purple-400 font-syne mb-0.5">Peminat</p>
          <p className="text-sm font-bold text-white font-mono">{formatNumber(prodi.peminat)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-purple-400 font-syne mb-0.5">Daya Tampung</p>
          <p className="text-sm font-bold text-white font-mono">{prodi.daya_tampung}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-purple-500/20">
        <Star size={12} className="text-yellow-400 fill-yellow-400" />
        <span className="text-xs font-bold text-yellow-300 font-syne">{prodi.rating}</span>
        <span className="text-xs text-purple-500 font-syne">({formatNumber(prodi.ulasan)} ulasan)</span>
      </div>
    </div>
  );
}
