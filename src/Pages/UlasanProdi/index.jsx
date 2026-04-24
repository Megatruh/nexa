/**
 * UlasanProdi - Halaman daftar program studi
 * Fitur: pencarian, filter kategori, sorting
 */

import React from "react";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { ProdiCard } from "../../components/shared/ProdiCard";
import { SearchBar } from "../../components/shared/SearchBar";
import { CategoryFilter } from "../../components/shared/CategoryFilter";
import { useProdiFilter } from "../../hooks/useProdiFilter";
import { SlidersHorizontal } from "lucide-react";

export default function UlasanProdi() {
  const {
    query, setQuery,
    kategoriAktif, setKategoriAktif,
    sortBy, setSortBy,
    filtered, total,
  } = useProdiFilter();

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white font-syne mb-2">
          Ulasan Program Studi
        </h1>
        <p className="text-purple-300 font-syne text-sm">
          Temukan dan bandingkan program studi terbaik di Indonesia.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-5">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Cari nama prodi atau universitas..."
          className="flex-1"
        />
        {/* Sort */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-purple-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="nexa-input py-2 text-sm w-auto"
          >
            <option value="passing_grade">Passing Grade</option>
            <option value="rating">Rating</option>
            <option value="peminat">Peminat</option>
            <option value="daya_tampung">Daya Tampung</option>
          </select>
        </div>
      </div>

      {/* Kategori filter */}
      <div className="mb-6">
        <CategoryFilter aktif={kategoriAktif} onChange={setKategoriAktif} />
      </div>

      {/* Jumlah hasil */}
      <p className="text-xs text-purple-500 font-syne mb-5">
        Menampilkan {total} program studi
      </p>

      {/* Grid prodi */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((prodi) => (
            <ProdiCard key={prodi.id} prodi={prodi} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-purple-400 font-syne text-lg mb-2">Prodi tidak ditemukan</p>
          <p className="text-purple-600 font-syne text-sm">
            Coba ubah kata kunci pencarian atau filter kategori
          </p>
        </div>
      )}
    </PageWrapper>
  );
}
