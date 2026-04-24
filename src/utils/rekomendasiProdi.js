/**
 * Algoritma Rekomendasi Program Studi
 * Berdasarkan skor Try Out dan minat dari Kesesuaian Jurusan
 */

import { DATA_PRODI } from "../constants/kategoriProdi";

/**
 * Hitung kemungkinan lolos ke suatu prodi berdasarkan skor
 * @param {number} skorUser - skor UTBK user
 * @param {number} passingGrade - passing grade prodi
 * @returns {Object} { persentase, label, warna }
 */
export function hitungPeluangLolos(skorUser, passingGrade) {
  // Konversi skor 200-800 ke persentase 0-100
  const skorPersen = ((skorUser - 200) / 600) * 100;
  const selisih = skorPersen - passingGrade;

  let persentase, label, warna;

  if (selisih >= 10) {
    persentase = Math.min(95, 80 + selisih);
    label = "Peluang Tinggi";
    warna = "#10b981"; // hijau
  } else if (selisih >= 0) {
    persentase = 60 + selisih * 2;
    label = "Peluang Sedang";
    warna = "#f59e0b"; // kuning
  } else if (selisih >= -10) {
    persentase = Math.max(20, 50 + selisih * 3);
    label = "Peluang Rendah";
    warna = "#f97316"; // orange
  } else {
    persentase = Math.max(5, 20 + selisih);
    label = "Kurang Sesuai";
    warna = "#ef4444"; // merah
  }

  return {
    persentase: Math.round(Math.min(95, Math.max(5, persentase))),
    label,
    warna,
  };
}

/**
 * Rekomendasikan prodi berdasarkan skor dan preferensi
 * @param {number} skorTotal - skor total UTBK
 * @param {Array} kategoriDiminati - kategori prodi yang diminati
 * @param {number} maxRekomendasi - jumlah rekomendasi maksimal
 * @returns {Array} list prodi rekomendasi dengan peluang
 */
export function rekomendasikanProdi(
  skorTotal,
  kategoriDiminati = [],
  maxRekomendasi = 5
) {
  // Konversi skor ke persentase untuk dibandingkan dengan passing grade
  const skorPersen = ((skorTotal - 200) / 600) * 100;

  let prodiCocok = DATA_PRODI.map((prodi) => {
    const peluang = hitungPeluangLolos(skorTotal, prodi.passing_grade);

    // Boost skor jika kategori diminati
    const isMinat = kategoriDiminati.includes(prodi.kategori);
    const skorRelevansI = peluang.persentase + (isMinat ? 15 : 0);

    return {
      ...prodi,
      peluang,
      skorRelevansi: Math.min(100, skorRelevansI),
      isRekomendasi: peluang.persentase >= 40,
    };
  });

  // Sort berdasarkan relevansi
  prodiCocok.sort((a, b) => b.skorRelevansi - a.skorRelevansi);

  return prodiCocok.slice(0, maxRekomendasi);
}

/**
 * Analisis kekuatan & kelemahan dari hasil Try Out
 * @param {Object} skorPerSubtes
 * @returns {Object} { kekuatan, kelemahan, saran }
 */
export function analisisHasilTryOut(skorPerSubtes) {
  const entries = Object.entries(skorPerSubtes);
  const sorted = entries.sort((a, b) => b[1].persentase - a[1].persentase);

  const kekuatan = sorted.slice(0, 2).map(([id]) => id);
  const kelemahan = sorted.slice(-2).map(([id]) => id);

  const saran = kelemahan.map((id) => ({
    subtesId: id,
    pesan: `Fokus berlatih lebih banyak soal ${id.toUpperCase()} untuk meningkatkan skor.`,
  }));

  return { kekuatan, kelemahan, saran };
}
