import api from './api'

export const authorService = {
  async getAuthors() {
    const response = await api.get('/authors')
    return response.data?.data || []
  },

  async getAuthorById(id) {
    const response = await api.get(`/authors/${id}`)
    return response.data?.data || null
  },

  async createAuthor(payload) {
    const response = await api.post('/authors', payload)
    return response.data
  },
}

export default authorService

