
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.resolve(__dirname, "../data/expenses.db");

let db;

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("Could not connect to database", err);
        reject(err);
      } else {
        console.log("Connected to SQLite database");
        db.run(
          `CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            remark TEXT,
            amount REAL NOT NULL,
            time TEXT NOT NULL
          )`,
          (createErr) => {
            if (createErr) {
              console.error("Could not create table", createErr);
              reject(createErr);
            } else {
              console.log("Table 'expenses' ensured to exist");
              resolve();
            }
          }
        );
      }
    });
  });
}

class ExpenseBuilder {
  constructor() {
    this.expense = {};
  }

  setType(type) {
    if (!type) throw new Error("消费类型不能为空");
    this.expense.type = type;
    return this;
  }

  setRemark(remark) {
    this.expense.remark = remark || "";
    return this;
  }

  setAmount(amount) {
    if (typeof amount !== "number" || isNaN(amount)) throw new Error("消费金额必须为有效的数字");
    this.expense.amount = amount;
    return this;
  }

  setTime(time) {
    if (!time || isNaN(Date.parse(time))) throw new Error("时间格式无效");
    this.expense.time = time;
    return this;
  }

  build() {
    if (!this.expense.type) throw new Error("消费类型不能为空");
    if (typeof this.expense.amount !== "number" || isNaN(this.expense.amount)) throw new Error("消费金额必须为有效的数字");
    if (!this.expense.time || isNaN(Date.parse(this.expense.time))) throw new Error("时间格式无效");
    return this.expense;
  }
}

async function addExpense(expense) {
  return new Promise((resolve, reject) => {
    const { type, remark, amount, time } = expense;
    db.run(
      "INSERT INTO expenses (type, remark, amount, time) VALUES (?, ?, ?, ?)",
      [type, remark, amount, time],
      function (err) {
        if (err) {
          console.error("Error inserting expense", err);
          reject(err);
        } else {
          console.log(`A row has been inserted with rowid ${this.lastID}`);
          resolve({ success: true, message: "数据已成功添加到SQLite数据库" });
        }
      }
    );
  });
}

async function getAllExpenses() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM expenses", [], (err, rows) => {
      if (err) {
        console.error("Error retrieving expenses", err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  initializeDatabase,
  addExpense,
  getAllExpenses,
  ExpenseBuilder,
};


