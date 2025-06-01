const fs = require('fs/promises');
const path = require('path');
const csvPath = path.join(__dirname, '../exports/expenses_initial.csv');

// 测试ExpenseBuilder校验逻辑
describe('ExpenseBuilder', () => {
  test('缺少类型应抛出错误', () => {
    expect(() => new ExpenseBuilder().setremark('午餐').setAmount(20).setTime('2024-01-01').build()).toThrow('消费类型不能为空');
  });

  test('无效金额（负数）应抛出错误', () => {
    expect(() => new ExpenseBuilder().setType('餐饮').setremark('午餐').setAmount(-10).setTime('2024-01-01').build()).toThrow('消费金额必须为正数');
  });

  test('无效时间格式应抛出错误', () => {
    expect(() => new ExpenseBuilder().setType('餐饮').setremark('午餐').setAmount(20).setTime('无效时间').build()).toThrow('时间格式无效');
  });

  test('构建有效对象应成功', () => {
    const expense = new ExpenseBuilder()
      .setType('餐饮')
      .setremark('午餐')
      .setAmount(20)
      .setTime('2024-01-01')
      .build();
    expect(expense).toEqual({
      type: '餐饮',
      remark: '午餐',
      amount: 20,
      time: '2024-01-01'
    });
  });

  test('插入空消费记录应失败', async () => {
    await expect(addExpense({})).rejects.toThrow();
  });
});

// 测试addExpense函数
describe('addExpense', () => {
  test('插入有效消费记录应成功', async () => {
    const expense = new ExpenseBuilder()
      .setType('餐饮')
      .setremark('午餐')
      .setAmount(20)
      .setTime('2024-01-01')
      .build();
    await addExpense(expense);
    // 读取CSV文件验证内容
    const csvContent = await fs.readFile(csvPath, 'utf-8');
    expect(csvContent).toContain('餐饮,午餐,20,2024-01-01');
  });

  
});