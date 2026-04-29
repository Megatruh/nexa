/**
 * useProdiFilter - Custom hook untuk filter & search program studi
 */

import { useState, useMemo, useCallback } from "react";
import { DATA_PRODI } from "../constants/kategoriProdi";

export function useProdiFilter(initialData = DATA_PRODI) {
  const [query, setQuery] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("semua");
  const [sortBy, setSortBy] = useState("passing_grade"); // passing_grade | rating | peminat
  const [sortOrder, setSortOrder] = useState("desc");

  const filtered = useMemo(() => {
    let result = [...initialData];

    // Filter kategori
    if (kategoriAktif !== "semua") {
      result = result.filter((p) => p.kategori === kategoriAktif);
    }

    // Filter search query
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.nama.toLowerCase().includes(q) ||
          p.universitas.toLowerCase().includes(q) ||
          p.akronim.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      const va = a[sortBy] ?? 0;
      const vb = b[sortBy] ?? 0;
      return sortOrder === "desc" ? vb - va : va - vb;
    });

    return result;
  }, [initialData, query, kategoriAktif, sortBy, sortOrder]);

  const resetFilter = useCallback(() => {
    setQuery("");
    setKategoriAktif("semua");
    setSortBy("passing_grade");
    setSortOrder("desc");
  }, []);

  return {
    query,
    setQuery,
    kategoriAktif,
    setKategoriAktif,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filtered,
    total: filtered.length,
    resetFilter,
  };
}
