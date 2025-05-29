const express = require('express');
const router = express.Router();
const { getExpensesCsv, getExpenses } = require('../controllers/expenses');

// CSV原始数据导出接口
router.get('/csv/raw', async (req, res) => {
  try {
    const csvData = await getExpensesCsv();
    res.set('Content-Type', 'text/csv');
    res.send(csvData);
  } catch (error) {
    console.error('CSV导出失败:', error);
    res.status(500).json({ error: 'CSV导出失败', message: error.message });
  }
});

// 消费数据获取接口
router.get('/', async (req, res) => {
  try {
    const expenses = await getExpenses();
    res.json(expenses);
  } catch (error) {
    console.error('获取消费数据失败:', error);
    res.status(500).json({ error: '获取消费数据失败', message: error.message });
  }
});

module.exports = router;