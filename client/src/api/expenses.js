import axios from 'axios';

// 动态获取API基础URL，支持开发和生产环境
export const API_BASE = (() => {
  // 默认使用后端服务端口3010（已从3001/3002修改）
  const defaultBase = 'http://localhost:3010/api';
  
  // 如果在浏览器环境中，尝试使用当前域名
  if (typeof window !== 'undefined') {
    try {
      const currentHost = window.location.hostname;
      const currentPort = window.location.port;
      
      // 如果是开发环境（localhost或IP地址）
      if (currentHost === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(currentHost)) {
        return `http://${currentHost}:3010/api`;
      }
      
      // 生产环境使用相对路径
      return '/api';
    } catch (e) {
      console.warn('无法确定API基础URL，使用默认值:', e);
      return defaultBase;
    }
  }
  
  return defaultBase;
})();

export const ExpenseAPI = {
  async getExpenses() {
    try {
      const response = await axios.get(`${API_BASE}/expenses`);
      // 确保返回数据是数组
      if (response && response.data) {
        return Array.isArray(response.data) ? response.data : [];
      }
      return [];
    } catch (error) {
      console.error('获取消费数据失败:', error);
      return [];  // 出错时返回空数组而非错误对象，确保前端不会崩溃
    }
  },
  
  async addExpense(data) {
    try {
      return await axios.post(`${API_BASE}/expenses`, data, {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        transformRequest: [(data) => JSON.stringify({
          ...data,
          amount: parseFloat(data.amount),
          // 使用remark字段，不再需要itemName
          remark: data.remark || ''
        })]
      });
    } catch (error) {
      console.error('添加消费数据失败:', error);
      throw error; // 添加操作失败需要向上抛出错误
    }
  },
  
  async getStatistics() {
    try {
      const response = await axios.get(`${API_BASE}/expenses/statistics`);
      return response.data;
    } catch (error) {
      console.error('获取统计数据失败:', error);
      return { error: error.message };
    }
  }
}
