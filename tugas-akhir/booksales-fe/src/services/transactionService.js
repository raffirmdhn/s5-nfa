import api from './api'

export const transactionService = {
  async getTransactions() {
    const response = await api.get('/transactions')
    return response.data?.data || []
  },

  async getTransactionById(id) {
    const response = await api.get(`/transactions/${id}`)
    return response.data?.data || null
  },

  async createTransaction(payload) {
    const response = await api.post('/transactions', payload)
    return response.data?.data || response.data
  },

  async updateTransactionStatus(id, status) {
    const response = await api.put(`/transactions/${id}`, { status })
    return response.data?.data || response.data
  },

  async deleteTransaction(id) {
    const response = await api.delete(`/transactions/${id}`)
    return response.data
  },
}

export default transactionService
