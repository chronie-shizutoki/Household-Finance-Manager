const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const csvPath = path.join(__dirname, '../exports/expenses_initial.csv');

class ExpenseBuilder {
    constructor() {
      this.expense = {};
    }

    setType(type) {
      if (!type) throw new Error('消费类型不能为空');
      this.expense.type = type;
      return this;
    }

    setRemark(remark) {
      // 使用remark替代itemName，不再强制验证
      this.expense.remark = remark || '';
      return this;
    }

    setAmount(amount) {
      if (typeof amount !== 'number' || isNaN(amount)) throw new Error('消费金额必须为有效的数字');
      this.expense.amount = amount;
      return this;
    }

    setTime(time) {
      if (!time || isNaN(Date.parse(time))) throw new Error('时间格式无效');
      this.expense.time = time;
      return this;
    }

    build() {
      if (!this.expense.type) throw new Error('消费类型不能为空');
      if (typeof this.expense.amount !== 'number' || isNaN(this.expense.amount)) throw new Error('消费金额必须为有效的数字');
      if (!this.expense.time || isNaN(Date.parse(this.expense.time))) throw new Error('时间格式无效');
      return this.expense;
    }
  }



  async function addExpense(expense) {
  // 为CSV字段添加双引号以处理包含逗号等特殊字符的情况
    // 转义字段中的双引号
      const escapeQuotes = (str) => String(str).replace(/"/g, '""');
      const csvLine = `"${escapeQuotes(expense.type)}","${escapeQuotes(expense.remark)}","${escapeQuotes(expense.amount)}","${escapeQuotes(expense.time)}"\n`;
  try {
      console.log('开始写入CSV文件:', csvPath);
      // 检查文件是否存在
      // 确保导出目录存在
      const exportDir = path.dirname(csvPath);
      console.log('CSV导出目录:', exportDir);
      try {
        await fs.access(exportDir);
        console.log('导出目录已存在');
      } catch {
        console.log('导出目录不存在，创建目录:', exportDir);
        await fs.mkdir(exportDir, { recursive: true });
      }
      
      // 检查文件是否存在
      // 使用existsSync进行更可靠的文件存在性检查
      const fileExists = fsSync.existsSync(csvPath);
      console.log('CSV文件存在性:', fileExists);
      if (!fileExists) {
        // 头部字段添加双引号，与数据行格式保持一致
        console.log('创建新CSV文件并写入头部');
        await fs.writeFile(csvPath, '"类型","备注","金额","日期"\n');
      }
      console.log('准备追加CSV数据行:', csvLine);
      await fs.appendFile(csvPath, csvLine + '\n');
      console.log('CSV数据行追加成功');
      return { success: true, message: '数据已成功追加到CSV文件' };
    } catch (err) {
      console.error('CSV文件操作失败:', err);
      throw new Error(`写入CSV文件失败: ${err.message} (路径: ${csvPath})`);
    }
}
  module.exports = {
    addExpense,
    ExpenseBuilder
  };

