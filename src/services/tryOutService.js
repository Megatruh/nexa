import api from "./api";

export const getSemuaPaketTryOut = () => api.get('/tryout/paket').then (r => r.data)
export const getPaketTryOut = () => api.get('/tryout/paket').then(r => r.data)
export const getSoalByPaket = (paketId) => api.get(`/tryout/paket/${paketId}/soal`).then(r => r.data)
export const submitJawaban = (paketId, data) => api.get(`/tryout/paket/${paketId}/submit`, data).then(r => r.data)
export const getHasilTryOut = (paketId) => api.get(`/tryout/paket/${paketId}/hasil`).then(r => r.data)
