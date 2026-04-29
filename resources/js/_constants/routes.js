// Konstanta path routing aplikasi NEXA
export const ROUTES = {
  HOME: "/",
  LOGIN: "/Login",
  REGISTER: "/Register",

  // Kesesuaian Jurusan
  KESESUAIAN: "/kesesuaian-jurusan",
  HASIL_KESESUAIAN: "/kesesuaian-jurusan/hasil",

  // Ulasan Prodi
  ULASAN_PRODI: "/ulasan-prodi",
  ULASAN_PRODI_DETAIL: "/ulasan-prodi/:slug",

  // Belajar
  BELAJAR_MATERI: "/belajar/materi",
  BELAJAR_LATIHAN: "/belajar/latihan-soal",
  MATERI_DETAIL: "/belajar/materi/:subtes/:id",
  LATIHAN_DETAIL: "/belajar/latihan-soal/:subtes",

  // Try Out
  TRYOUT: "/try-out",
  TRYOUT_SOAL: "/try-out/:paketId/soal",
  TRYOUT_HASIL: "/try-out/:paketId/hasil",

  // 404
  NOT_FOUND: "*",
};
