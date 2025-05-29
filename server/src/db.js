const fs = require('fs/promises');
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

    setItemName(itemName) {
      if (!itemName) throw new Error('消费项目名称不能为空');
      this.expense.itemName = itemName;
      return this;
    }

    setAmount(amount) {
      if (typeof amount !== 'number' || amount <= 0) throw new Error('消费金额必须为正数');
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
      if (!this.expense.itemName) throw new Error('消费项目名称不能为空');
      if (typeof this.expense.amount !== 'number' || this.expense.amount <= 0) throw new Error('消费金额必须为正数');
      if (!this.expense.time || isNaN(Date.parse(this.expense.time))) throw new Error('时间格式无效');
      return this.expense;
    }
  }



  async function addExpense(expense) {
    // 构造CSV行（列顺序与现有CSV文件一致）
    const csvLine = `${expense.type},${expense.itemName},${expense.amount},${expense.time}\n`;
    try {
      await fs.appendFile(csvPath, csvLine);
      return { success: true, message: '数据已成功追加到CSV文件' };
    } catch (err) {
      throw new Error(`写入CSV文件失败: ${err.message}`);
    }
  
  }
  module.exports = {
    addExpense,
    ExpenseBuilder
  };

