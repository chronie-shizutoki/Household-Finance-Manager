const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 获取数据库路径
const dbPath = path.resolve(__dirname, '../data/expenses.db');

// 确保数据库文件存在
if (!fs.existsSync(dbPath)) {
  console.error('错误: 数据库文件不存在');
  process.exit(1);
}

// 创建临时备份文件路径
const backupPath = path.resolve(__dirname, `../data/expenses_backup_${Date.now()}.db`);

// 备份数据库
function backupDatabase() {
  return new Promise((resolve, reject) => {
    fs.copyFile(dbPath, backupPath, (err) => {
      if (err) {
        reject(new Error('备份数据库失败: ' + err.message));
      } else {
        console.log(`数据库备份成功: ${backupPath}`);
        resolve();
      }
    });
  });
}

// 修复数据库 - 将id字段按照time字段排序
async function fixDatabaseIdsByTime() {
  try {
    // 先备份数据库
    await backupDatabase();

    // 创建数据库连接
    const db = new sqlite3.Database(dbPath);
    
    // 转换为Promise风格的API
    const runAsync = (sql, params = []) => {
      return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this);
          }
        });
      });
    };

    const allAsync = (sql, params = []) => {
      return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    };

    // 开始事务
    await runAsync('BEGIN TRANSACTION');

    // 1. 查询所有数据并按time排序
    console.log('正在获取所有数据并按时间排序...');
    const sortedExpenses = await allAsync('SELECT type, remark, amount, time FROM expenses ORDER BY time ASC');
    
    console.log(`共找到 ${sortedExpenses.length} 条记录`);

    // 2. 创建临时表
    console.log('创建临时表...');
    await runAsync(`
      CREATE TABLE IF NOT EXISTS expenses_temp (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        remark TEXT,
        amount REAL NOT NULL,
        time TEXT NOT NULL
      )
    `);

    // 3. 将排序后的数据插入临时表
    console.log('正在将排序后的数据插入临时表...');
    const insertStmt = await new Promise((resolve, reject) => {
      const stmt = db.prepare('INSERT INTO expenses_temp (type, remark, amount, time) VALUES (?, ?, ?, ?)');
      if (!stmt) {
        reject(new Error('准备插入语句失败'));
        return;
      }
      resolve(stmt);
    });

    // 批量插入数据
    for (let i = 0; i < sortedExpenses.length; i++) {
      const expense = sortedExpenses[i];
      await new Promise((resolve, reject) => {
        insertStmt.run(expense.type, expense.remark, expense.amount, expense.time, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      
      // 显示进度
      if ((i + 1) % 100 === 0 || i + 1 === sortedExpenses.length) {
        console.log(`已插入 ${i + 1}/${sortedExpenses.length} 条记录`);
      }
    }
    
    // 完成插入
    insertStmt.finalize();

    // 4. 删除原表并重命名临时表
    console.log('重建原表...');
    await runAsync('DROP TABLE expenses');
    await runAsync('ALTER TABLE expenses_temp RENAME TO expenses');

    // 5. 重置自增ID序列
    console.log('重置ID序列...');
    await runAsync('DELETE FROM sqlite_sequence WHERE name="expenses"');
    await runAsync('INSERT INTO sqlite_sequence (name, seq) VALUES ("expenses", ?)', [sortedExpenses.length]);

    // 提交事务
    await runAsync('COMMIT TRANSACTION');

    // 关闭数据库连接
    db.close();

    console.log('数据库修复成功！所有记录已按照时间顺序重新排序，ID已重置。');
    console.log(`修复前的数据库备份已保存至：${backupPath}`);
    console.log('如果需要恢复原始数据，可以使用备份文件替换当前数据库文件。');
    
  } catch (error) {
    console.error('修复数据库时发生错误:', error);
    process.exit(1);
  }
}

// 执行修复
console.log('开始修复数据库...');
console.log('此操作会将所有记录按照时间顺序重新排序，并重置ID');
fixDatabaseIdsByTime();