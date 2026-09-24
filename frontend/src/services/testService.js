import api from './api'

export const getCategories = () => api.get('/tests/categories/')
export const getQuestions = (categoryName) => api.get(`/tests/questions/${categoryName}/`)
export const submitTest = (data) => api.post('/tests/submit/', data)
export const getMyAttempts = () => api.get('/tests/my-attempts/')
export const getAttemptDetail = (id) => api.get(`/tests/attempt/${id}/`)
