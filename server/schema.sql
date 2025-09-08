CREATE TABLE expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    remark TEXT,
    amount REAL NOT NULL,
    time TEXT NOT NULL
);

