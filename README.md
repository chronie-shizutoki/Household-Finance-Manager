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
```

## Usage Guide
1. **Add records**: Click "Log Expense" > Fill form > Submit
2. **Switch languages**: Use dropdown at top-right
3. **View charts**: See spending breakdowns (pie chart) and trends (line graph)

## Tech Stack
- Frontend: Vue 3 + Chart.js + Vue I18n
- Backend: Express + Papa Parse (CSV)
- Storage: CSV files (DB-ready architecture)

---
> 🔍 Browse in other languages:  
[简体中文](#zh-CN) | [日本語](#ja-JP) | [Français](#fr-FR) | [繁體中文(香港)](#zh-HK) | [繁體中文(台灣)](#zh-TW) |  
[简体中文(新加坡)](#zh-SG) | [Español](#es-ES) | [한국어](#ko-KR) | [Bahasa Melayu](#ms-MY) | [Tiếng Việt](#vi-VN)

<a id="zh-CN"></a>
# 家庭财务管理系统 (简体中文)

## 项目概述
家庭财务管理系统是一款支持多语言界面的财务管理工具，旨在帮助用户便捷记录家庭收支、统计消费数据并进行多维度分析，提升家庭财务透明度和管理效率。

## 核心功能
- **11种语言支持**：自动适配界面文本与日期格式（英语、中文、日语、法语等）
- **消费记录管理**：新增/查看消费记录（类型、金额、日期、备注），数据自动同步至CSV文件
- **数据导出**：生成CSV报表（路径：`server/exports/expenses_initial.csv`）
- **智能统计分析**：
  - 消费分类占比（餐饮、购物、交通等）
  - 交互式消费趋势图表
  - 15秒数据自动刷新（通过`useExpenseData.js`实现）
- **全栈架构**：Vue.js前端 + Node.js/Express后端（通过`npm run dev`一键启动）

## 支持语言
| 代码    | 语言               | "新增记录"文本     | 图表标题           | 导出文件名示例       |
|---------|--------------------|--------------------|--------------------|----------------------|
| [en-US](#en-US) | 英语（美国）       | Log Expense        | Spending Trends    | Expenses_Mar_2024   |
| zh-CN   | 简体中文（中国大陆）| 新增记录           | 消费趋势分析       | 开支记录_2024-03    |
| [ja-JP](#ja-JP) | 日语               | 入出金登録         | 資産管理           | 家計簿_令和6年3月期 |
| [fr-FR](#fr-FR) | 法语               | Nouvelle Opération | Suivi Budgétaire   | Releve_03_2024      |
| [zh-HK](#zh-HK) | 繁体中文（香港）   | 記低使咗幾多       | 每日使錢走勢       | 使錢記錄_2024-03    |
| [zh-TW](#zh-TW) | 繁体中文（台湾）   | 新增紀錄           | 每日消費趨勢圖     | 消費紀錄_2024-03    |
| [zh-SG](#zh-SG) | 简体中文（新加坡） | 添加记录           | 每日开支走势       | 开支记录_2024-03    |
| [es-ES](#es-ES) | 西班牙语           | Nuevo Gasto        | Evolución de Gastos| Gastos_Mar_2024     |
| [ko-KR](#ko-KR) | 韩语               | 소비 기록          | 지출 패턴          | 가계부_내역_2024-03 |
| [ms-MY](#ms-MY) | 马来语             | Catat Perbelanjaan | Corak Perbelanjaan | Rekod_Perbelanjaan  |
| [vi-VN](#vi-VN) | 越南语             | Thêm Giao Dịch     | Biểu Đồ Chi Tiêu   | GiaoDich_Thang3_2024|

## 安装与使用
### 环境要求
- Node.js ≥ 14.0.0（推荐18.x版本）
- npm ≥ 6.0.0

### 快速开始
```bash
git clone https://github.com/your-username/Household-Finance-Manager.git
cd Household-Finance-Manager
npm install
cd client && npm install
cd ../server && npm install
npm run dev  # 同时启动前端（http://localhost:5173）和后端（http://localhost:3000）
```

## 使用指南
1. **添加记录**：点击"新增记录" > 填写表单 > 提交
2. **切换语言**：使用右上角下拉菜单
3. **查看图表**：首页查看消费分类占比（饼图）和消费趋势（折线图）
4. **导出数据**：通过"导出CSV"功能下载完整消费记录

## 技术架构
- 前端：Vue 3 + Chart.js + Vue I18n
- 后端：Express + Papa Parse（CSV处理）
- 存储：CSV文件（支持扩展为数据库）

---
> 🔍 选择其他语言版本：  
[English](#en-US) | [日本語](#ja-JP) | [Français](#fr-FR) | [繁體中文(香港)](#zh-HK) | [繁體中文(台灣)](#zh-TW) |  
[简体中文(新加坡)](#zh-SG) | [Español](#es-ES) | [한국어](#ko-KR) | [Bahasa Melayu](#ms-MY) | [Tiếng Việt](#vi-VN)