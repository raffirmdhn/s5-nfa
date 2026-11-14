import api from './api'

export const genreService = {
  async getGenres() {
    const response = await api.get('/genres')
    return response.data?.data || []
  },

  async getGenreById(id) {
    const response = await api.get(`/genres/${id}`)
    return response.data?.data || null
  },

  async createGenre(payload) {
    const response = await api.post('/genres', payload)
    return response.data
  },

  async updateGenre(id, payload) {
    const response = await api.put(`/genres/${id}`, payload)
    return response.data
  },

  async deleteGenre(id) {
    const response = await api.delete(`/genres/${id}`)
    return response.data
  },
}

export default genreService
