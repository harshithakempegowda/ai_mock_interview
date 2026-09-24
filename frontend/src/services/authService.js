import api from './api'

export const signup = (data) => api.post('/auth/signup/', data)
export const login = (data) => api.post('/auth/login/', data)
export const logout = (refresh) => api.post('/auth/logout/', { refresh })
export const getCurrentUser = () => api.get('/auth/me/')
export const requestPasswordReset = (email) => api.post('/auth/forgot-password/', { email })
export const resetPassword = (data) => api.post('/auth/reset-password/', data)
