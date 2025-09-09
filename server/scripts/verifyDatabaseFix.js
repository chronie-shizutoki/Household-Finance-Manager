const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 获取数据库路径
const dbPath = path.resolve(__dirname, '../data/expenses.db');

// 验证数据是否按时间顺序排序
function verifyDatabaseFix() {
  const db = new sqlite3.Database(dbPath);
  
  console.log('开始验证数据库修复结果...');
  
  // 查询前10条记录，按ID排序，检查时间是否也按顺序排列
  db.all('SELECT id, time FROM expenses ORDER BY id LIMIT 10', [], (err, rows) => {
    if (err) {
      console.error('查询数据库失败:', err);
      db.close();
      return;
    }
    
    console.log('前10条记录（按ID排序）:');
    rows.forEach(row => {
      console.log(`ID: ${row.id}, Time: ${row.time}`);
    });
    
    // 检查是否按时间顺序排列
    let isSorted = true;
    let previousTime = null;
    
    for (const row of rows) {
      if (previousTime && new Date(row.time) < new Date(previousTime)) {
        isSorted = false;
        break;
      }
      previousTime = row.time;
    }
    
    if (isSorted) {
      console.log('验证结果: 通过！前10条记录的时间顺序与ID顺序一致。');
    } else {
      console.log('验证结果: 失败！前10条记录的时间顺序与ID顺序不一致。');
    }
    
    // 查询后10条记录进行验证
    db.all('SELECT id, time FROM expenses ORDER BY id DESC LIMIT 10', [], (err, lastRows) => {
      if (err) {
        console.error('查询数据库失败:', err);
        db.close();
        return;
      }
      
      console.log('\n后10条记录（按ID倒序）:');
      lastRows.forEach(row => {
        console.log(`ID: ${row.id}, Time: ${row.time}`);
      });
      
      // 再次检查整体排序情况
      db.all('SELECT id, time FROM expenses ORDER BY time', [], (err, timeSortedRows) => {
        if (err) {
          console.error('查询数据库失败:', err);
          db.close();
          return;
        }
        
        let allSorted = true;
        for (let i = 0; i < timeSortedRows.length; i++) {
          if (timeSortedRows[i].id !== i + 1) {
            allSorted = false;
            break;
          }
        }
        
        console.log('\n总体验证结果:');
        if (allSorted) {
          console.log('✅ 完全成功！所有记录的ID顺序与时间顺序完全一致。');
        } else {
          console.log('⚠️ 部分成功，但不完全一致。');
        }
        
        console.log(`\n数据库中共有 ${timeSortedRows.length} 条记录。`);
        console.log('验证完成。');
        db.close();
      });
    });
  });
}

// 执行验证
verifyDatabaseFix();