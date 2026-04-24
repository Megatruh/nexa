import api from "./api";

export const prodiService = {
  // Ambil semua prodi dengan filter
  getAll: (params) => api.get("/prodi", { params }).then((r) => r.data),

  // Ambil detail prodi by slug
  getDetail: (slug) => api.get(`/prodi/${slug}`).then((r) => r.data),

  // Ambil ulasan prodi
  getUlasan: (slug, page = 1) =>
    api.get(`/prodi/${slug}/ulasan`, { params: { page } }).then((r) => r.data),

  // Submit ulasan
  submitUlasan: (slug, ulasan) =>
    api.post(`/prodi/${slug}/ulasan`, ulasan).then((r) => r.data),

  // Analisis kesesuaian berdasarkan jawaban survei
  analisaKesesuaian: (jawabanSurvei) =>
    api.post("/prodi/kesesuaian", { jawaban: jawabanSurvei }).then((r) => r.data),
};
