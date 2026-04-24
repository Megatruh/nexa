/**
 * Algoritma Pengacakan Soal (RNG) NEXA
 * Setiap pengguna mendapat urutan soal yang berbeda secara otomatis
 * menggunakan Fisher-Yates shuffle dengan seed unik per sesi
 */

/**
 * Fisher-Yates shuffle - algoritma acak yang merata
 * @param {Array} array - array soal yang akan diacak
 * @returns {Array} array soal teracak
 */
export function fisherYatesShuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate seed unik berbasis waktu + user ID
 * @param {string} userId - ID pengguna
 * @returns {number} seed unik
 */
export function generateSeed(userId = "guest") {
  const timestamp = Date.now();
  const userHash = userId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return (timestamp * userHash) % 999999;
}

/**
 * Acak soal dengan opsi jawaban
 * Mengacak urutan opsi jawaban agar tidak selalu sama
 * @param {Array} soalList - list soal
 * @returns {Array} soal dengan opsi teracak
 */
export function acakSoalDenganOpsi(soalList) {
  const soalTeracak = fisherYatesShuffle(soalList);
  return soalTeracak.map((soal) => ({
    ...soal,
    opsi: fisherYatesShuffle(soal.opsi || []),
  }));
}

/**
 * Pilih sejumlah soal acak dari bank soal
 * @param {Array} bankSoal - semua soal yang tersedia
 * @param {number} jumlah - jumlah soal yang diambil
 * @returns {Array} soal terpilih
 */
export function pilihSoalAcak(bankSoal, jumlah) {
  const shuffled = fisherYatesShuffle(bankSoal);
  return shuffled.slice(0, Math.min(jumlah, shuffled.length));
}

/**
 * Buat set soal Try Out lengkap dari semua subtes
 * @param {Object} bankSoalPerSubtes - { subtes_id: [soal...] }
 * @param {Object} konfigurasi - { subtes_id: jumlahSoal }
 * @returns {Array} soal lengkap terurut per subtes tapi diacak dalam tiap subtes
 */
export function buatSetSoalTryOut(bankSoalPerSubtes, konfigurasi) {
  const result = [];
  Object.entries(konfigurasi).forEach(([subtesId, jumlah]) => {
    const bankSubtes = bankSoalPerSubtes[subtesId] || [];
    const soalTerpilih = pilihSoalAcak(bankSubtes, jumlah);
    result.push(
      ...soalTerpilih.map((s) => ({ ...s, subtesId }))
    );
  });
  return result;
}
