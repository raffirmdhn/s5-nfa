import api from './api'

export const bookService = {
  async getBooks() {
    const response = await api.get('/books')
    return response.data?.data || []
  },

  async getBookById(id) {
    const response = await api.get(`/books/${id}`)
    return response.data?.data || null
  },

  async createBook(payload) {
    const response = await api.post('/books', payload)
    return response.data?.data || response.data
  },

  async updateBook(id, payload) {
    const response = await api.put(`/books/${id}`, payload)
    return response.data?.data || response.data
  },

  async deleteBook(id) {
    const response = await api.delete(`/books/${id}`)
    return response.data
  },
}

export default bookService

