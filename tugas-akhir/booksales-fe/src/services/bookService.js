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
}

export default bookService

