import api from './api'

export const getSemuaMateri =() => api.get('/materi').then(r=>r.data)
export const getMateriById =(materiId) => api.get(`/materi/${materiId}`).then(r => r.data)