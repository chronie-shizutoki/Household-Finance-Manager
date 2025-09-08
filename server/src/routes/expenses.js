const express = require('express');
const router = express.Router();
const { getExpenses } = require("../controllers/expenses");

// 消费数据获取接口 - use controller directly so req/res are intact
router.get('/', getExpenses);

module.exports = router;