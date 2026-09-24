import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let refreshQueue = []

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(error)
      }
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push(() => resolve(api(originalRequest)))
        })
      }
      originalRequest._retry = true
      isRefreshing = true
      try {
        const res = await axios.post('/api/auth/token/refresh/', { refresh: refreshToken })
        localStorage.setItem('access_token', res.data.access)
        isRefreshing = false
        refreshQueue.forEach((cb) => cb())
        refreshQueue = []
        return api(originalRequest)
      } catch (err) {
        isRefreshing = false
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(err)
      }
    }
    return Promise.reject(error)
  }
)

export default api
