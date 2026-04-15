// src/utils/rngSoal.js

/**
 * Fisher-Yates Shuffle — mengacak array secara merata
 */
function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Acak soal sesuai konfigurasi subtes UTBK
 * @param {Array}  soalBank  - semua soal yang tersedia
 * @param {Object} config    - { subtes: { PU: 30, PPU: 20, PBM: 20, PM: 20, LBInd: 25, LBIng: 20 } }
 */
export function generateSoalRNG(soalBank, config) {
  const grouped = {}

  // Kelompokkan soal berdasarkan subtes
  soalBank.forEach(soal => {
    if (!grouped[soal.subtes]) grouped[soal.subtes] = []
    grouped[soal.subtes].push(soal)
  })

  const hasil = []

  Object.entries(config.subtes).forEach(([subtes, jumlah]) => {
    const pool    = grouped[subtes] || []
    const shuffled = shuffle(pool)
    const selected = shuffled.slice(0, jumlah)

    // Acak juga urutan opsi jawaban setiap soal
    selected.forEach(soal => {
      hasil.push({
        ...soal,
        opsi: shuffle(soal.opsi)
      })
    })
  })

  return hasil
}