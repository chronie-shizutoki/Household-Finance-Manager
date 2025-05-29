/**
 * 导出功能路由配置
 * @module routes/exportRoutes
 * @desc 定义消费记录导出相关API端点（CSV/Excel）
 */
const express = require('express');
const router = express.Router();
const ExportService = require('../utils/export');

const exportService = new ExportService();

/**
 * @api {get} /api/export/csv 导出CSV文件
 * @apiName ExportCSV
 * @apiGroup Export
 * @apiSuccess {file} CSV文件 消费记录的CSV文件
 */
router.get('/api/export/csv', async (req, res) => {
  try {
    const filePath = exportService.generateCSV();
    res.download(filePath);
  } catch (error) {
    res.status(500).send('生成CSV失败');
  }
});

/**
 * @api {get} /api/export/excel 导出Excel文件
 * @apiName ExportExcel
 * @apiGroup Export
 * @apiSuccess {file} Excel文件 消费记录的Excel文件
 */
router.get('/api/export/excel', async (req, res) => {
  try {
    const filePath = exportService.generateExcel();
    res.download(filePath);
  } catch (error) {
    res.status(500).send('生成Excel失败');
  }
});

module.exports = router;