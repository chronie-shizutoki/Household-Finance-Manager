const express = require('express');
const router = express.Router();
const { getExpenses } = require("../controllers/expenses");

// 消费数据获取接口
router.get('/', async (req, res) => {
  try {
    const expenses = await getExpenses();
    
    // 添加CORS头，确保跨域请求可以正常工作
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    // 确保返回的是数组格式
    if (!Array.isArray(expenses)) {
      console.warn('警告: expenses不是数组格式，进行转换');
      res.json(Array.isArray(expenses.data) ? expenses.data : []);
    } else {
      res.json(expenses);
    }
  } catch (error) {
    console.error('获取消费数据失败:', error);
    res.status(500).json({ error: '获取消费数据失败', message: error.message });
  }
});

module.exports = router;