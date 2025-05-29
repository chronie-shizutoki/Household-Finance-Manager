/**
 * 基础路由配置
 * @module routes/baseRoutes
 * @desc 定义基础健康检查等通用API端点
 */
const express = require('express');
const router = express.Router();

/**
 * @api {get} /api 基础健康检查
 * @apiName HealthCheck
 * @apiGroup Base
 * @apiSuccess {object} status 服务状态信息
 */
router.get('/api', (req, res) => {
  res.json({
    status: 'success',
    message: '后端服务正常运行',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;