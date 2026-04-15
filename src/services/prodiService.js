import api from './api'

export const getSemuaProdi = () => 
  api.get('/prodi').then(r => Array.isArray(r.data?.data) ? r.data.data : r.data)

export const getProdiBySlug = (slug) => 
  api.get(`/prodi/${slug}`).then(r => r.data?.data || r.data)

export const getProdiByKategori = (kategori) => 
  api.get(`/prodi?kategori=${kategori}`).then(r => Array.isArray(r.data?.data) ? r.data.data : r.data)