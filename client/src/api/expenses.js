import axios from 'axios';

export const API_BASE = 'http://localhost:3001/api'; // 修正为后端服务端口

export const ExpenseAPI = {
  async getExpenses() {
    try {
      return await axios.get(`${API_BASE}/expenses`)
    } catch (error) {
      return { error: error.message }
    }
  },
  async addExpense(data) {
    try {
      return await axios.post(`${API_BASE}/expenses`, data)
    } catch (error) {
      return { error: error.message }
    }
  },
  async getStatistics() {
    try {
      return await axios.get(`${API_BASE}/expenses/statistics`)
    } catch (error) {
      return { error: error.message }
    }
  }
}