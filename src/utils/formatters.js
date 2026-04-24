/**
 * Fungsi utilitas formatting
 */

/**
 * Format angka dengan pemisah ribuan
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
  return new Intl.NumberFormat("id-ID").format(num);
}

/**
 * Format rupiah
 * @param {number} amount
 * @returns {string}
 */
export function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format durasi menit ke jam:menit
 * @param {number} menit
 * @returns {string}
 */
export function formatDurasi(menit) {
  const jam = Math.floor(menit / 60);
  const sisaMenit = menit % 60;
  if (jam === 0) return `${sisaMenit} menit`;
  if (sisaMenit === 0) return `${jam} jam`;
  return `${jam} jam ${sisaMenit} menit`;
}

/**
 * Format countdown timer
 * @param {number} detik - sisa waktu dalam detik
 * @returns {string} "MM:SS"
 */
export function formatTimer(detik) {
  const m = Math.floor(detik / 60);
  const s = detik % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Format tanggal ke bahasa Indonesia
 * @param {Date|string} date
 * @returns {string}
 */
export function formatTanggal(date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Singkat nama panjang
 * @param {string} nama
 * @param {number} maxLength
 * @returns {string}
 */
export function singkatNama(nama, maxLength = 30) {
  if (nama.length <= maxLength) return nama;
  return nama.slice(0, maxLength - 3) + "...";
}

/**
 * Warna berdasarkan persentase
 * @param {number} persen - 0-100
 * @returns {string} hex color
 */
export function warnaPersentase(persen) {
  if (persen >= 80) return "#10b981";
  if (persen >= 60) return "#f59e0b";
  if (persen >= 40) return "#f97316";
  return "#ef4444";
}
