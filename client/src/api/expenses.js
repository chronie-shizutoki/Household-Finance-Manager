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
        return { data: Array.isArray(response.data) ? response.data : [] };
      }
      return { data: [] };
    } catch (error) {
      console.error('获取消费数据失败:', error);
      return { data: [], error: error.message };  // 出错时返回空数组和错误信息，确保前端不会崩溃
    }
  },
  
  async addExpense(data) {
    try {
      // 数据预处理和验证
      if (!data || typeof data !== 'object') {
        throw new Error('无效的数据格式');
      }
      
      // 确保金额是数字类型
      const formattedData = {
        ...data,
        amount: Number(data.amount)
      };
      
      // 发送请求
      const response = await axios.post(`${API_BASE}/expenses`, formattedData);
      return response.data || { message: '记录添加成功' };
    } catch (error) {
      console.error('添加消费数据失败:', error);
      // 返回结构化错误对象，便于前端处理
      return { 
        error: error.message || '添加记录失败',
        status: error.response?.status || 500,
        details: error.response?.data || {}
      };
    }
  },
  
  async getStatistics() {
    try {
      const response = await axios.get(`${API_BASE}/expenses/statistics`);
      
      // 确保返回数据格式正确
      if (response && response.data) {
        // 如果返回的不是数组，尝试从response.data中提取数据
        const statistics = Array.isArray(response.data) ? 
          response.data : 
          (response.data.data || []);
          
        return { data: statistics };
      }
      
      return { data: [] };
    } catch (error) {
      console.error('获取统计数据失败:', error);
      return { data: [], error: error.message };
    }
  }
}