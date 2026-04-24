/**
 * Kalkulasi Skor UTBK-SNBT
 * Formula mengikuti sistem penilaian resmi UTBK
 */

// Bobot masing-masing subtes dalam penilaian akhir
const BOBOT_SUBTES = {
  pu: 0.2,     // Penalaran Umum - 20%
  ppu: 0.15,   // Pengetahuan & Pemahaman Umum - 15%
  pbm: 0.15,   // Pemahaman Bacaan & Menulis - 15%
  pk: 0.15,    // Pengetahuan Kuantitatif - 15%
  lbi: 0.15,   // Literasi Bahasa Indonesia - 15%
  lbing: 0.1,  // Literasi Bahasa Inggris - 10%
  pm: 0.1,     // Penalaran Matematika - 10%
};

/**
 * Hitung skor per subtes (skala 0-1000)
 * @param {number} benar - jumlah jawaban benar
 * @param {number} total - total soal
 * @returns {number} skor skala 0-1000
 */
export function hitungSkorSubtes(benar, total) {
  if (total === 0) return 0;
  const persentase = benar / total;
  // Skala UTBK: 200-800 (skor dasar 200, maks 800)
  return Math.round(200 + persentase * 600);
}

/**
 * Hitung skor total gabungan semua subtes
 * @param {Object} skorPerSubtes - { subtesId: { benar, total } }
 * @returns {Object} { skorTotal, skorPerSubtes, persentaseBenar }
 */
export function hitungSkorTotal(skorPerSubtes) {
  let skorTertimbang = 0;
  let totalBobot = 0;
  const hasil = {};

  Object.entries(skorPerSubtes).forEach(([subtesId, { benar, total }]) => {
    const skor = hitungSkorSubtes(benar, total);
    const bobot = BOBOT_SUBTES[subtesId] || 0;
    skorTertimbang += skor * bobot;
    totalBobot += bobot;
    hasil[subtesId] = {
      skor,
      benar,
      total,
      persentase: total > 0 ? Math.round((benar / total) * 100) : 0,
    };
  });

  const skorTotal = totalBobot > 0 ? Math.round(skorTertimbang / totalBobot) : 0;

  return {
    skorTotal,
    skorPerSubtes: hasil,
    grade: tentukangGrade(skorTotal),
  };
}

/**
 * Tentukan grade berdasarkan skor
 * @param {number} skor
 * @returns {string}
 */
function tentukangGrade(skor) {
  if (skor >= 750) return "A+";
  if (skor >= 700) return "A";
  if (skor >= 650) return "B+";
  if (skor >= 600) return "B";
  if (skor >= 550) return "C+";
  if (skor >= 500) return "C";
  if (skor >= 450) return "D";
  return "E";
}

/**
 * Hitung statistik waktu pengerjaan
 * @param {number} mulai - timestamp mulai (ms)
 * @param {number} selesai - timestamp selesai (ms)
 * @returns {Object}
 */
export function hitungStatistikWaktu(mulai, selesai) {
  const durasiMs = selesai - mulai;
  const detik = Math.floor(durasiMs / 1000);
  const menit = Math.floor(detik / 60);
  const sisaDetik = detik % 60;
  return {
    totalDetik: detik,
    totalMenit: menit,
    display: `${menit}m ${sisaDetik}s`,
  };
}
