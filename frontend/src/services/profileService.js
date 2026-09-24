import api from './api'

export const getMyProfile = () => api.get('/profile/me/')
export const updateProfile = (data) => api.patch('/profile/me/', data)
export const uploadProfilePicture = (file) => {
  const formData = new FormData()
  formData.append('profile_picture', file)
  return api.post('/profile/upload-picture/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
