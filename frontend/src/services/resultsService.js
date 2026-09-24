import api from './api'

export const getAllResults = () => api.get('/results/')
export const getResultSummary = () => api.get('/results/summary/')
