import api from './api'

export const startInterview = (interviewType) => api.post('/interviews/start/', { interview_type: interviewType })
export const submitResponse = (interviewId, data) => api.post(`/interviews/${interviewId}/respond/`, data)
export const completeInterview = (interviewId, data) => api.post(`/interviews/${interviewId}/complete/`, data)
export const getInterview = (interviewId) => api.get(`/interviews/${interviewId}/`)
export const getMyInterviews = () => api.get('/interviews/my-interviews/')
