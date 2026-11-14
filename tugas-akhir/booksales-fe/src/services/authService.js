import api from './api'

export const authService = {
  async login(email, password) {
    const response = await api.post('/login', { email, password })
    return response.data
  },

  async logout() {
    try {
      const response = await api.post('/logout')
      return response.data
    } catch {
      return null
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },

  async getMe() {
    const response = await api.get('/me')
    return response.data
  },
}

export default authService

