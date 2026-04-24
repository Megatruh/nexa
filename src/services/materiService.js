import api from "./api";

export const materiService = {
  // Ambil daftar materi per subtes
  getMateri: (subtesId) =>
    api.get(`/materi/${subtesId}`).then((r) => r.data),

  // Ambil detail materi (termasuk URL PDF)
  getDetailMateri: (subtesId, materiId) =>
    api.get(`/materi/${subtesId}/${materiId}`).then((r) => r.data),

  // Tandai materi sebagai selesai dibaca
  selesaiMateri: (materiId) =>
    api.post(`/materi/${materiId}/selesai`).then((r) => r.data),

  // Ambil daftar latihan soal per subtes
  getLatihanSoal: (subtesId) =>
    api.get(`/latihan/${subtesId}`).then((r) => r.data),

  // Ambil soal latihan (akan diacak di client)
  getSoalLatihan: (subtesId, paketId) =>
    api.get(`/latihan/${subtesId}/${paketId}/soal`).then((r) => r.data),
};
