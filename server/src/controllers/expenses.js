/**
 * 消费记录控制器
 * @module controllers/expenseController
 * @desc 处理消费记录的业务逻辑（如数据验证、统计计算）
 */
const { ExpenseBuilder } = require('../db');
const ExportService = require('../utils/export');
const fs = require('fs'); // 引入完整fs模块以使用existsSync方法
const path = require('path');

/**
 * 获取所有消费记录
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
const Papa = require('papaparse');
const csvFilePath = path.join(__dirname, '../../exports/expenses_initial.csv');

exports.getExpenses = async () => {
  try {
    if (!fs.existsSync(csvFilePath)) {
      throw new Error('CSV文件尚未生成');
    }
    const csvData = await fs.promises.readFile(csvFilePath, 'utf8'); // 使用promises版本的readFile
    const parsed = Papa.parse(csvData, { header: true });
    console.log('解析到的消费记录行数:', parsed.data.length); // 添加日志记录解析行数
    return parsed.data.map(item => ({
      type: item['类型'],
      remark: item['备注'], // 修正为CSV中的“备注”列
      amount: Number(item['金额']),
      time: item['日期']
    }));
  } catch (error) {
    throw error;
  }
};

/**
 * 添加新消费记录
 * @param {Object} req - Express请求对象（包含newExpense字段）
 * @param {Object} res - Express响应对象
 */
// 修正：使用正确的Promise读取方式
exports.getExpensesCsv = async () => {
  const csvPath = path.join(__dirname, '../../exports/expenses_initial.csv');
  // 确保使用promises版本并正确传递参数
  return await fs.promises.readFile(csvPath, { encoding: 'utf-8' });
};

// 原getCsvPath调整为
exports.getCsvPath = async (req, res) => {
  try {
    const exportService = new ExportService(req.app.locals.db);
    const csvPath = exportService.generateCSV();
    res.json({ path: csvPath });
  } catch (error) {
    res.status(500).json({ error: '生成CSV文件失败' });
  }
};

exports.addExpense = async (req, res) => {
  try {
    // 新增数据预处理
    const processedData = {
      type: String(req.body.type || '').trim(),
      remark: String(req.body.remark || '').trim(), // 使用remark替代itemName
      amount: parseFloat(req.body.amount) || 0,
      time: dayjs(req.body.time).isValid() 
        ? dayjs(req.body.time).format('YYYY-MM-DD')
        : dayjs().format('YYYY-MM-DD')
    };

    // 新增必填字段验证
    if (!processedData.type) {
      throw new Error('消费类型不能为空');
    }

    const expense = new ExpenseBuilder()
      .setType(processedData.type)
      .setRemark(processedData.remark)
      .setAmount(processedData.amount)
      .setTime(processedData.time)
      .build();
    await req.app.locals.db.addExpense(expense);

    // 新增：同步写入CSV并打印日志
    const exportService = new ExportService(req.app.locals.db);
    const data = await exportService.getFullData();
    const csvContent = Papa.unparse(data.map(item => ({
      type: item.type || '未分类',
      remark: item.remark || item.remark || '',
      amount: Number(item.amount || 0).toFixed(2),
      time: item.time ? dayjs(item.time).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
    })), {
      quotes: true,
      header: true,
      skipEmptyLines: true
    });
    const csvFilePath = path.join(__dirname, '../../exports/expenses_initial.csv');
    console.log('写入CSV路径:', csvFilePath);
    console.log('写入CSV内容:', csvContent);
    fs.writeFileSync(csvFilePath, csvContent);
    console.log('CSV写入完成');

    res.status(201).json({ message: '记录添加成功' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
