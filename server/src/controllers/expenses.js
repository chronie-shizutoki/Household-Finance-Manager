/**
 * 消费记录控制器
 * @module controllers/expenseController
 * @desc 处理消费记录的业务逻辑（如数据验证、统计计算）
 */
const { ExpenseBuilder } = require('../db');
const ExportService = require('../utils/export');
const fs = require('fs'); // 引入完整fs模块以使用existsSync方法
const path = require('path');
const dayjs = require('dayjs');

/**
 * 获取所有消费记录
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await req.app.locals.db.getAllExpenses();
    res.json(expenses);
  } catch (error) {
    console.error("获取消费记录失败:", error);
    res.status(500).json({ error: "获取消费记录失败" });
  }
};/**
 * 添加新消费记录
 * @param {Object} req - Express请求对象（包含newExpense字段）
 * @param {Object} res - Express响应对象
 */
// 修正：使用正确的Promise读取方式


exports.addExpense = async (req, res) => {
  try {
      console.log('开始处理新消费记录:', req.body);
      // 新增数据预处理
      const processedData = {
        type: String(req.body.type || '').trim(),
        remark: String(req.body.remark || '').trim(), // 使用remark替代itemName
        amount: parseFloat(req.body.amount) || 0,
        time: dayjs(req.body.time).isValid() 
          ? dayjs(req.body.time).format('YYYY-MM-DD')
          : dayjs().format('YYYY-MM-DD')
      };
      console.log('预处理后的数据:', processedData);

      // 新增必填字段验证
      if (!processedData.type) {
        throw new Error('消费类型不能为空');
      }
      if (isNaN(processedData.amount)) {}
      if (!dayjs(processedData.time).isValid()) {
        throw new Error('时间格式无效');
      }

    const expense = new ExpenseBuilder()
      .setType(processedData.type)
      .setRemark(processedData.remark)
      .setAmount(processedData.amount)
      .setTime(processedData.time)
      .build();
    console.log('准备添加记录到数据库:', expense);
    try {
      await req.app.locals.db.addExpense(expense);
      console.log('记录添加到数据库成功');
      res.status(201).json({ message: '记录添加成功' });
    } catch (dbError) {
      console.error('数据库添加记录失败:', dbError);
      throw new Error(`数据库操作失败: ${dbError.message}`);
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
