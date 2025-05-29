<a id="en-US"></a>
# Household Finance Manager (English)

## Project Overview
The Household Finance Manager is a multilingual financial management tool designed to help users easily track income/expenses, analyze spending patterns, and improve financial transparency. Supports real-time data sync and cross-device access.

## Key Features
- **11 Language Support**: Auto-adapting UI text & date formats (English, Chinese, Japanese, French, etc.)
- **Expense Tracking**: Add/view records (type, amount, date, notes) with CSV auto-sync
- **Data Export**: Generate CSV reports (`server/exports/expenses_initial.csv`)
- **Smart Analytics**:
  - Category breakdowns (food, shopping, transport)
  - Interactive spending trend charts
  - 15-sec data auto-refresh (via `useExpenseData.js`)
- **Full-Stack Architecture**: Vue.js frontend + Node.js/Express backend (run via `npm run dev`)

## Supported Languages
| Code    | Language             | "Add Record" Text    | Chart Title          | Export Filename        |
|---------|----------------------|----------------------|----------------------|------------------------|
| en-US   | English (US)         | Log Expense          | Spending Trends      | Expenses_Mar_2024      |
| [zh-CN](#zh-CN) | Simplified Chinese   | 新增记录             | 消费趋势分析         | 开支记录_2024-03       |
| [ja-JP](#ja-JP) | Japanese             | 入出金登録           | 資産管理             | 家計簿_令和6年3月期     |
| [fr-FR](#fr-FR) | French               | Nouvelle Opération   | Suivi Budgétaire     | Releve_03_2024         |
| [zh-HK](#zh-HK) | Chinese (Hong Kong)  | 記低使咗幾多         | 每日使錢走勢         | 使錢記錄_2024-03       |
| [zh-TW](#zh-TW) | Chinese (Taiwan)     | 新增紀錄             | 每日消費趨勢圖       | 消費紀錄_2024-03       |
| [zh-SG](#zh-SG) | Chinese (Singapore)  | 添加记录             | 每日开支走势         | 开支记录_2024-03       |
| [es-ES](#es-ES) | Spanish              | Nuevo Gasto          | Evolución de Gastos  | Gastos_Mar_2024        |
| [ko-KR](#ko-KR) | Korean               | 소비 기록            | 지출 패턴            | 가계부_내역_2024-03    |
| [ms-MY](#ms-MY) | Malay                | Catat Perbelanjaan   | Corak Perbelanjaan   | Rekod_Perbelanjaan_2024|
| [vi-VN](#vi-VN) | Vietnamese           | Thêm Giao Dịch       | Biểu Đồ Chi Tiêu     | GiaoDich_Thang3_2024   |

## Setup & Usage
### Requirements
- Node.js ≥ 14.0.0 (18.x recommended)
- npm ≥ 6.0.0

### Quick Start
```bash
git clone https://github.com/your-username/Household-Finance-Manager.git
cd Household-Finance-Manager
npm install
cd client && npm install
cd ../server && npm install
npm run dev  # Start both frontend (http://localhost:5173) and backend (http://localhost:3000)