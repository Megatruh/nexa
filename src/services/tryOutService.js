import api from "./api";

export const tryoutService = {
  // Ambil daftar paket Try Out
  getPaket: () => api.get("/tryout/paket").then((r) => r.data),

  // Ambil bank soal untuk paket tertentu (akan diacak di sisi client dengan RNG)
  getBankSoal: (paketId, subtesId) =>
    api.get(`/tryout/soal/${paketId}/${subtesId}`).then((r) => r.data),

  // Kirim hasil Try Out ke server
  submitHasil: (paketId, payload) =>
    api.post(`/tryout/${paketId}/submit`, payload).then((r) => r.data),

  // Ambil riwayat Try Out pengguna
  getRiwayat: () => api.get("/tryout/riwayat").then((r) => r.data),

  // Ambil detail hasil Try Out
  getHasil: (hasilId) =>
    api.get(`/tryout/hasil/${hasilId}`).then((r) => r.data),
};
