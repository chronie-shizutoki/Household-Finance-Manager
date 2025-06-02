> 🔍 languages:  
[English（United States）](#en-US) | [简体中文（中国大陆）](#zh-CN) | [日本語（日本）](#ja-JP) |  [偽中国語（日本）](#kanji-JP) | [Français（France）](#fr-FR) | [繁體中文（香港特別行政區）](#zh-HK) | [繁體中文（台灣地區）](#zh-TW) | [简体中文（新加坡）](#zh-SG) | [文言（中國）](#zh-Classical) |  [Español（Spain）](#es-ES) | [한국어（대한민국）](#ko-KR) | [韓國語（大韓民國）](#kanji-KR) | [Bahasa Melayu（Malaysia）](#ms-MY) | [Tiếng Việt（Việt Nam）](#vi-VN)

<a id="en-US"></a>
# Household Finance Manager [English（United States）]

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


<a id="zh-CN"></a>
# 家庭财务管理系统 [简体中文（中国大陆）]

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
<a id="zh-SG"></a>
# 家庭财务管理系统 [简体中文（新加坡）]

## 项目简介
家庭财务管理系统是一款多语言财务管理工具，帮助用户轻松追踪日常收支、分析消费习惯，提升家庭理财效率。系统自动适配新加坡地区语言习惯与日期格式。

## 核心功能
- **多语言界面**：自动匹配新加坡地区语言偏好
- **消费记录**：添加/管理收支记录（类型、金额、日期、备注）
- **CSV数据同步**：所有记录实时保存至CSV文件
- **智能分析**：
  - 消费分类占比分析（餐饮、购物、交通等）
  - 动态开支趋势图表
  - 15秒自动刷新数据
- **跨平台支持**：Vue前端 + Node.js后端架构

## 安装与运行
### 环境要求
- Node.js ≥ 14.0.0（推荐18.x版本）
- npm ≥ 6.0.0

### 启动步骤
```bash
git clone https://github.com/your-username/Household-Finance-Manager.git
cd Household-Finance-Manager
npm install
cd client && npm install
cd ../server && npm install
npm run dev  # 启动前端(http://localhost:5173)与后端(http://localhost:3000)
```

## 使用指南
1. **添加记录**：
   - 点击"添加记录"按钮
   - 填写消费类型、金额、日期等信息
   - 提交后数据自动保存至CSV
   
2. **查看分析**：
   - 首页查看消费分类饼图
   - 查看月度开支趋势折线图
   
3. **导出数据**：
   - 随时导出完整CSV报表
   - 文件路径：`server/exports/expenses_initial.csv`

## 技术架构
- **前端**：Vue 3 + Chart.js
- **后端**：Express + Papa Parse
- **数据处理**：CSV文件存储
- **本地化**：Day.js日期库 + 自定义区域配置

---
<a id="zh-HK"></a>
# 家庭財務管理系統 [繁體中文（香港特別行政區）]

## 項目簡介
呢個家庭理財幫手專為香港家庭設計，幫你輕鬆記錄日常使費、分析消費習慣，等你可以更醒咁管理屋企開支。系統自動配對香港日期格式同埋港幣顯示，仲支援本地化嘅消費分類㗎！

## 主要功能
- **記低使費**：簡單幾步就記低你嘅消費（揀類型、填銀碼、選日期、加備註）
- **自動同步**：所有記錄實時存入CSV檔案，唔怕冇咗
- **智能分析**：
  - 各類使費比例圖（飲茶、買嘢、搭車等）
  - 每月洗錢走勢圖表
  - 15秒自動更新最新數據
- **導出記錄**：一撳就出完整CSV報表

## 安裝方法
### 需要準備
- Node.js ≥ 14.0.0（建議用18.x版）
- npm ≥ 6.0.0

### 點樣開始
```bash
git clone https://github.com/your-username/Household-Finance-Manager.git
cd Household-Finance-Manager
npm install
cd client && npm install
cd ../server && npm install
npm run dev  # 同時開前端(http://localhost:5173)同後端(http://localhost:3000)
```

## 點樣用
1. **記新使費**：
   - 撳"記低使咗幾多"掣
   - 填清楚使咗喺邊（飲食、購物等）、銀碼(HKD)、日期
   - 撳"確認"就自動存檔

2. **睇分析**：
   - 主頁睇到各類使費佔比
   - 追蹤每日洗錢走勢
   - 自動標示洗大咗嘅類別

3. **管理記錄**：
   - 隨時導出CSV備份
   - 檔案位置：`server/exports/expenses_initial.csv`
   - 支援Excel打開慢慢睇

## 技術細節
- **前端**：Vue 3 + Chart.js 整靚啲圖
- **後端**：Node.js + Express 做數據處理
- **本地化**：Day.js香港日期格式 + 港幣符號自動顯示
- **數據**：CSV檔案儲存，簡單易管理

---
<a id="zh-TW"></a>
# 家庭財務管理系統 [繁體中文（台灣地區）]

## 專案介紹
這款家庭理財工具專為台灣用戶設計，提供在地化操作體驗，協助您輕鬆管理家庭收支、分析消費模式，實現更有效的財務規劃。系統自動採用台灣日期格式及新台幣顯示，並支援本地化消費分類。

## 主要功能
- **收支紀錄**：直觀的新增消費功能（類型、金額、日期、備註）
- **即時同步**：所有資料自動儲存至CSV檔案
- **智能分析**：
  - 消費分類圓餅圖（餐飲、購物、交通等）
  - 月度消費趨勢折線圖
  - 每15秒自動更新最新數據
- **資料匯出**：一鍵匯出完整CSV報表

## 安裝指引
### 系統需求
- Node.js ≥ 14.0.0（建議18.x版本）
- npm ≥ 6.0.0

### 快速啟動
```bash
git clone https://github.com/your-username/Household-Finance-Manager.git
cd Household-Finance-Manager
npm install
cd client && npm install
cd ../server && npm install
npm run dev  # 同時啟動前端(http://localhost:5173)與後端(http://localhost:3000)
```

## 使用教學
1. **新增紀錄**：
   - 點擊「新增紀錄」按鈕
   - 填寫消費類型、金額(NT$)、日期等資訊
   - 提交後自動儲存至系統
   
2. **查看分析**：
   - 首頁查看各類消費佔比
   - 追蹤每日消費趨勢變化
   - 自動標示高消費類別

3. **資料管理**：
   - 隨時匯出CSV備份檔案
   - 檔案路徑：`server/exports/expenses_initial.csv`
   - 支援Excel開啟檢視

## 技術架構
- **前端**：Vue 3 + Chart.js 視覺化圖表
- **後端**：Node.js + Express 資料處理
- **在地化**：Day.js台灣日期格式 + 新台幣符號自動顯示
- **資料儲存**：CSV檔案格式，簡潔易管理

## 台灣專屬功能
- 自動轉換國際日期為台灣格式（範例：2024-03-15 → 113年3月15日）
- 支援台灣常見消費分類：餐飲、交通、水電、教育、醫療等
- 新台幣符號(NT$)自動顯示與計算
- 消費備註支援台灣常用詞彙（如：超商、機車加油、夜市小吃等）

---
<a id="zh-Classical"></a>  
# **家計理財簿** [文言（中國）]  

## 綱要  
家計理財簿者，多邦言錢穀之器也。助君錄金帛出入，察用度之跡，使財貨昭明。諸器皆可覽實時數籍，雲端同調。  

## 要術  
- **十一邦言通曉**：文牘自易其字，曆法隨域而遷（英漢、和文等）  
- **錄記出入**：添新籍（類目、銀數、時日、批註），CSV自同契  
- **造冊呈報**：生CSV帳冊（`server/exports/expenses_initial.csv`）  
- **洞明析數**：  
  - 分門別類（庖廚、市易、舟輿）  
  - 用度流變圖（指掌可察）  
  - 瞬息數籍自新（依`useExpenseData.js`）  
- **通體架構**：Vue.js為門面，Node.js/Express為機樞（以`npm run dev`啟之）  

## 啟用法  
**根基要件**  
- Node.js ≥ 十四版（十八版為佳）  
- npm ≥ 六版  

### **速啟訣**  
```bash  
git clone https://github.com/your-username/Household-Finance-Manager.git  
cd Household-Finance-Manager  
npm install  
cd client && npm install  
cd ../server && npm install  
npm run dev  # 門面啟於 http://localhost:5173，機樞啟於 http://localhost:3000  
```  

## 操持指南  
1. **錄新籍**：點「記用度」> 填牘 > 呈契  
2. **易邦言**：右上垂簾擇之  
3. **觀數圖**：用度分剖圖（圓儀），流變圖（線譜）  

## 技藝樞要  
- 門面：Vue 3 + Chart.js + Vue I18n  
- 機樞：Express + Papa Parse (CSV)  
- 儲籍：CSV 帳冊（可易為府庫架構）  

---  
<a id="ja-JP"></a>
# 家計簿管理システム [日本語（日本）]

## プロジェクト概要
この家計簿管理システムは日本のご家庭向けに設計された多言語対応ツールで、収支記録の効率化と支出分析を支援します。和暦表示や円貨記号の自動対応など、日本の利用環境に最適化されています。

## 主な機能
- **収支管理**：直感的な操作で支出記録を追加（種類、金額、日付、メモ）
- **リアルタイム同期**：全データがCSVファイルに自動保存
- **分析機能**：
  - 支出カテゴリ別円グラフ（飲食、買物、交通費など）
  - 月別支出トレンド折れ線グラフ
  - 15秒ごとの自動データ更新
- **データエクスポート**：ワンクリックでCSVレポート出力

## 対応言語設定
| コード  | 言語   | 「追加」ボタン表記 | グラフタイトル | 出力ファイル例          |
|---------|--------|--------------------|----------------|-------------------------|
| ja-JP   | 日本語 | 入出金登録         | 資産管理       | 家計簿_令和6年3月期     |

## インストール手順
### 動作環境
- Node.js ≥ 14.0.0（推奨18.x）
- npm ≥ 6.0.0

### 起動方法
```bash
git clone https://github.com/your-username/Household-Finance-Manager.git
cd Household-Finance-Manager
npm install
cd client && npm install
cd ../server && npm install
npm run dev  # フロントエンド(http://localhost:5173)とバックエンド(http://localhost:3000)を同時起動
```

## 操作ガイド
1. **記録追加**：
   - 「入出金登録」ボタンをクリック
   - 支出種類、金額(¥)、日付などを入力
   - 送信すると自動的に保存

2. **分析確認**：
   - ホーム画面で支出割合を確認
   - 月間支出トレンドを追跡
   - 高支出カテゴリの自動検出

3. **データ管理**：
   - いつでもCSV形式でエクスポート可能
   - 保存先：`server/exports/expenses_initial.csv`
   - Excelでの編集・分析に対応

## 日本向け特化機能
- **和暦自動変換**：2024-03-15 → 令和6年3月15日
- **日本式分類**：食費、光熱費、交通費、教育費、医療費など
- **通貨表示**：円記号(¥)の自動付与
- **消費税対応**：内税/外税選択可能（今後の拡張予定）
- **日本特有の支出項目**：コンビニ、電車定期、習い事など

## 技術構成
- **フロントエンド**：Vue 3 + Chart.js データ可視化
- **バックエンド**：Node.js + Express データ処理
- **ローカライズ**：Day.js 日本語日付フォーマット
- **データ保存**：CSVファイル形式（シンプル管理）

```
支出記録例：
令和6年3月15日, 食費, ¥1,280, コンビニ昼食
令和6年3月16日, 交通費, ¥15,600, 電車定期券更新
```

---
<a id="kanji-JP"></a>
# 家計簿管理装置[偽中国語（日本）]

## 計画概要
此之家計簿管理装置為日本家庭設計之複数言語対応工具。収支記録能率化及支出分析支援為目的。和暦表示並円通貨記号自動対応等、日本利用環境最適化為。

## 主機能
- **収支管理**：直感操作支出記録追加（種類、金額、日付、備忘）
- **同時刻同期**：全自動保存表形式書類
- **分析機能**：
  - 支出分類別円形図（飲食、買物、交通費等）
  - 月別支出傾向折線図
  - 十五秒毎自動更新
- **書類出力**：一回操作表形式報告出力

## 対応言語設定
| 符号      | 言語       | 「追加」操作表記 | 図表題名 | 出力書類例          |
|-----------|------------|------------------|----------|---------------------|
| kanji-JP  | 漢文調日本語 | 入出金登録       | 資産管理 | 家計簿_令和六年三月期 |

## 設置手順
### 動作環境
- Node.js ≥ 十四点零（推奨十八版）
- npm ≥ 六点零

### 起動方法
```bash
git clone https://github.com/your-username/Household-Finance-Manager.git
cd Household-Finance-Manager
npm install
cd client && npm install
cd ../server && npm install
npm run dev  # 前面部分(http://localhost:5173)並後面部分(http://localhost:3000)同時起動
```

## 操作指南
1. **記録追加**：
   - 「入出金登録」操作押下
   - 支出種類、金額(¥)、日付等入力
   - 送信後自動保存

2. **分析確認**：
   - 主画面支出割合確認
   - 月間支出傾向追跡
   - 高支出分類自動検出

3. **書類管理**：
   - 随時表形式出力可能
   - 保存先：`server/exports/expenses_initial.csv`
   - 表計算編集分析対応

## 日本向特化機能
- **和暦自動変換**：2024-03-15 → 令和六年三月十五日
- **日本式分類**：食費、光熱費、交通費、教育費、医療費等
- **通貨表示**：円記号(¥)自動付与
- **消費税対応**：内税/外税選択可能（将来拡張予定）
- **日本特有支出項目**：小売店、電車定期、習事等

## 技術構成
- **前面部分**：Vue 三 + Chart.js 可視化
- **後面部分**：Node.js + Express 処理
- **地域化**：Day.js 日本語日付書式
- **書類保存**：表形式書類（簡易管理）

```
支出記録例：
令和六年三月十五日, 食費, ¥千二百八十, 小売店昼食
令和六年三月十六日, 交通費, ¥万五千六百, 電車定期券更新
```

---
<a id="ko-KR"></a>
# 가정 재정 관리 시스템 [한국어（대한민국）]

## 프로젝트 개요
이 가계부 관리 시스템은 한국 가정을 위해 특별히 설계된 다국어 지원 도구로, 가계 수입과 지출을 체계적으로 기록하고 분석할 수 있도록 도와줍니다. 한국식 날짜 형식과 원화 표시를 자동 지원하며, 현지화된 소비 카테고리를 제공합니다.

## 주요 기능
- **소비 기록**: 직관적인 지출 추가 기능 (유형, 금액, 날짜, 메모)
- **실시간 동기화**: 모든 데이터가 CSV 파일에 자동 저장
- **스마트 분석**:
  - 소비 카테고리별 원형 그래프 (식비, 쇼핑, 교통비 등)
  - 월별 지출 추세 꺾은선 그래프
  - 15초 간격 자동 데이터 업데이트
- **데이터 내보내기**: 원클릭 CSV 보고서 생성

## 설치 가이드
### 시스템 요구사항
- Node.js ≥ 14.0.0 (18.x 버전 권장)
- npm ≥ 6.0.0

### 시작하기
```bash
git clone https://github.com/your-username/Household-Finance-Manager.git
cd Household-Finance-Manager
npm install
cd client && npm install
cd ../server && npm install
npm run dev  # 프론트엔드(http://localhost:5173)와 백엔드(http://localhost:3000) 동시 실행
```

## 사용 방법
1. **기록 추가**:
   - "소비 기록" 버튼 클릭
   - 소비 유형, 금액(₩), 날짜 등 정보 입력
   - 제출 시 자동 저장
   
2. **분석 확인**:
   - 메인 화면에서 소비 비율 확인
   - 일일 지출 추적
   - 고지출 카테고리 자동 표시
   
3. **데이터 관리**:
   - 언제든 CSV 형식으로 내보내기
   - 파일 경로: `server/exports/expenses_initial.csv`
   - 엑셀 호환 가능

## 한국 특화 기능
- **날짜 형식**: 2024-03-15 → 2024년 3월 15일
- **현지화 카테고리**: 식비, 교통비, 통신비, 교육비, 문화생활 등
- **통화 표시**: 원화 기호(₩) 자동 적용
- **한국 특수 지출 항목**: 편의점, 대중교통 카드 충전, 배달 음식 등
- **세금 처리**: 부가세 포함/미포함 옵션 (향후 확장 예정)

## 기술 스택
- **프론트엔드**: Vue 3 + Chart.js 데이터 시각화
- **백엔드**: Node.js + Express 데이터 처리
- **현지화**: Day.js 한국식 날짜 포맷
- **데이터 저장**: CSV 파일 형식 (간편 관리)

```
지출 기록 예시:
2024년 3월 15일, 식비, ₩12,000, 점심 회식
2024년 3월 16일, 교통비, ₩65,000, 주유비
2024년 3월 17일, 쇼핑, ₩89,500, 온라인 쇼핑
```

---
<a id="kanji-KR"></a>
# 家庭 財政 管理 system [韓國語（大韓民國）]

## 計劃 槪要  
이 家計簿 管理 system은 韓國 家庭을 위해 特別히 設計된 多國語 支援 道具로, 家計 收入과 支出을 體系的으로 記錄하고 分析할 수 있도록 돕니다. 韓國式 日期 形式과 圓貨 表示를 自動 支援하며, 現地化된 消費 category를 提供합니다.

## 主要 機能  
- **消費 記錄**: 直觀的인 支出 追加 機能 (類型, 金額, 日期, memo)  
- **實時間 同期化**: 모든 data가 CSV 檔案에 自動 貯藏  
- **smart 分析**:  
  - 消費 category別 圓形 graph (食費, shopping, 交通費 등)  
  - 月別 支出 趨勢 broken line graph  
  - 15秒 間隔 自動 data update  
- **data 持出**: one-click CSV report 生成  

## 設置 guide  
### system 要求事項  
- Node.js ≥ 14.0.0 (18.x 版 勸奬)  
- npm ≥ 6.0.0  

### 始作하기  
```bash  
git clone https://github.com/your-username/Household-Finance-Manager.git  
cd Household-Finance-Manager  
npm install  
cd client && npm install  
cd ../server && npm install  
npm run dev  # frontend(http://localhost:5173)와 backend(http://localhost:3000) 同時 運行  
```  

## 使用 方法  
1. **記錄 追加**:  
   - "消費 記錄" button click  
   - 消費 類型, 金額(₩), 日期 등 情報 入力  
   - 提出 시 自動 貯藏  
   
2. **分析 確認**:  
   - main 畫面에서 消費 比率 確認  
   - 日日 支出 追跡  
   - 高支出 category 自動 表示  
   
3. **data 管理**:  
   - 언제든 CSV 形式으로 持出  
   - 檔案 經路: `server/exports/expenses_initial.csv`  
   - Excel 互換 可能  

## 韓國 特化 機能  
- **日期 形式**: 2024-03-15 → 2024年 3月 15日  
- **現地化 category**: 食費, 交通費, 通信費, 敎育費, 文化生活 등  
- **通貨 表示**: 圓貨 記號(₩) 自動 適用  
- **韓國 特殊 支出 項目**: 便宜店, 大衆交通 card 充塡, 配達 飮食 등  
- **稅金 處理**: 附加稅 包含/未包含 option (後日 擴張 豫定)  

## 技術 stack  
- **frontend**: Vue 3 + Chart.js data 視覺化  
- **backend**: Node.js + Express data 處理  
- **現地化**: Day.js 韓國式 日期 format  
- **data 貯藏**: CSV 檔案 形式 (簡便 管理)  

```  
支出 記錄 例示:  
2024年 3月 15日, 食費, ₩12,000, 午餐 會食  
2024年 3月 16日, 交通費, ₩65,000, 注油費  
2024年 3月 17日, shopping, ₩89,500, online shopping  
```

---
<a id="ms-MY"></a>
# Sistem Pengurusan Kewangan Keluarga [Bahasa Melayu（Malaysia）]

## Gambaran Projek
Sistem Pengurusan Kewangan Keluarga ini direka khusus untuk pengguna Malaysia, membantu keluarga mengurus perbelanjaan harian dengan lebih efektif. Sistem ini menyokong format tarikh tempatan dan simbol mata wang Ringgit secara automatik.

## Ciri Utama
- **Rekod Perbelanjaan**: Tambah catatan perbelanjaan dengan mudah (jenis, jumlah, tarikh, nota)
- **Segerakan Data**: Semua rekod disimpan automatik dalam fail CSV
- **Analisis Pintar**:
  - Carta pai pecahan perbelanjaan (makanan, beli-belah, pengangkutan)
  - Carta trend perbelanjaan bulanan
  - Kemas kini data automatik setiap 15 saat
- **Eksport Data**: Hasilkan laporan CSV dengan satu klik

## Panduan Pemasangan
### Keperluan Sistem
- Node.js ≥ 14.0.0 (versi 18.x disyorkan)
- npm ≥ 6.0.0

### Mulakan
```bash
git clone https://github.com/your-username/Household-Finance-Manager.git
cd Household-Finance-Manager
npm install
cd client && npm install
cd ../server && npm install
npm run dev  # Mulakan frontend(http://localhost:5173) dan backend(http://localhost:3000)
```

## Cara Penggunaan
1. **Tambah Rekod**:
   - Klik butang "Catat Perbelanjaan Baru"
   - Isi jenis perbelanjaan, jumlah(RM), tarikh
   - Hantar untuk simpan automatik
   
2. **Lihat Analisis**:
   - Lihat pecahan perbelanjaan di halaman utama
   - Jejak corak perbelanjaan harian
   - Kategori perbelanjaan tinggi dikesan automatik
   
3. **Urus Data**:
   - Eksport fail CSV bila-bila masa
   - Lokasi fail: `server/exports/expenses_initial.csv`
   - Boleh dibuka dengan Excel

## Ciri Khas Malaysia
- **Format Tarikh**: 2024-03-15 → 15 Mac 2024
- **Kategori Tempatan**: Makan luar, Beli runcit, Tol, Bil utiliti, Duit raya
- **Simbol Mata Wang**: Ringgit (RM) dipaparkan automatik
- **Item Perbelanjaan Unik**: Kedai mamak, Topup Touch 'n Go, Beli di Pasar Malam
- **Cuti Umum**: Sistem kenalpasti hari cuti (akan datang)

## Teknologi Digunakan
- **Frontend**: Vue 3 + Chart.js visualisasi data
- **Backend**: Node.js + Express pemprosesan data
- **Penyetempatan**: Day.js format tarikh Malaysia
- **Penyimpanan**: Fail CSV (pengurusan mudah)

```
Contoh rekod perbelanjaan:
15 Mac 2024, Makanan, RM 25.80, Makan tengah hari di kedai mamak
16 Mac 2024, Pengangkutan, RM 50.00, Topup Touch 'n Go
17 Mac 2024, Beli-belah, RM 120.30, Beli runcit di pasaraya
```

---
<a id="vi-VN"></a>
# Hệ Thống Quản Lý Tài Chính Gia Đình [Tiếng Việt（Việt Nam）](#vi-VN)

## Giới Thiệu Dự Án
Hệ thống Quản Lý Tài Chính Gia Đình được thiết kế dành riêng cho người dùng Việt Nam, hỗ trợ quản lý thu chi hàng ngày một cách hiệu quả. Hệ thống tự động áp dụng định dạng ngày tháng Việt Nam và hiển thị ký hiệu tiền tệ VND.

## Tính Năng Chính
- **Ghi Chép Thu Chi**: Thêm giao dịch dễ dàng (loại, số tiền, ngày, ghi chú)
- **Đồng Bộ Dữ Liệu**: Tự động lưu mọi giao dịch vào file CSV
- **Phân Tích Thông Minh**:
  - Biểu đồ phân loại chi tiêu (ăn uống, mua sắm, đi lại)
  - Theo dõi xu hướng chi tiêu hàng tháng
  - Cập nhật dữ liệu tự động mỗi 15 giây
- **Xuất Dữ Liệu**: Tạo báo cáo CSV chỉ với một cú nhấp chuột

## Hướng Dẫn Cài Đặt
### Yêu Cầu Hệ Thống
- Node.js ≥ 14.0.0 (khuyến nghị phiên bản 18.x)
- npm ≥ 6.0.0

### Bắt Đầu
```bash
git clone https://github.com/your-username/Household-Finance-Manager.git
cd Household-Finance-Manager
npm install
cd client && npm install
cd ../server && npm install
npm run dev  # Khởi động frontend(http://localhost:5173) và backend(http://localhost:3000)
```

## Hướng Dẫn Sử Dụng
1. **Thêm Giao Dịch**:
   - Nhấp nút "Thêm Giao Dịch"
   - Điền loại chi tiêu, số tiền(₫), ngày tháng
   - Gửi để tự động lưu trữ
   
2. **Xem Phân Tích**:
   - Xem tỷ lệ chi tiêu trên trang chủ
   - Theo dõi xu hướng chi tiêu hàng ngày
   - Tự động nhận diện danh mục chi tiêu lớn
   
3. **Quản Lý Dữ Liệu**:
   - Xuất file CSV bất cứ lúc nào
   - Vị trí file: `server/exports/expenses_initial.csv`
   - Mở được bằng Excel

## Tính Năng Đặc Thù Việt Nam
- **Định Dạng Ngày**: 2024-03-15 → 15/03/2024
- **Danh Mục Địa Phương**: Ăn uống, Di chuyển, Hoá đơn, Giáo dục, Chăm sóc sức khoẻ
- **Ký Hiệu Tiền Tệ**: Đồng (₫) hiển thị tự động
- **Giao Dịch Đặc Trưng**: Cà phê, Xe ôm công nghệ, Chợ truyền thống, Tiền lì xì
- **Ngày Lễ Việt**: Tự động nhận diện Tết Nguyên Đán (sắp ra mắt)

## Công Nghệ Sử Dụng
- **Frontend**: Vue 3 + Chart.js hiển thị dữ liệu
- **Backend**: Node.js + Express xử lý dữ liệu
- **Bản Địa Hoá**: Day.js định dạng ngày Việt Nam
- **Lưu Trữ**: File CSV (quản lý đơn giản)

```
Ví dụ giao dịch:
15/03/2024, Ăn uống, ₫75,000, Cà phê sáng
16/03/2024, Di chuyển, ₫35,000, Xe ôm công nghệ
17/03/2024, Mua sắm, ₫250,000, Chợ truyền thống
```

---
<a id="es-ES"></a>
# Gestor de Finanzas Familiares [Español（Spain）]

## Resumen del Proyecto
Este sistema de gestión financiera familiar está diseñado para usuarios españoles, facilitando el control de ingresos y gastos domésticos con soporte multilingüe. Adaptado a formatos locales como DD/MM/AAAA y símbolo del euro (€).

## Características Principales
- **Registro de Gastos**: Añada operaciones fácilmente (tipo, importe, fecha, notas)
- **Sincronización Automática**: Todos los datos se guardan en CSV en tiempo real
- **Análisis Inteligente**:
  - Gráfico circular por categorías (alimentación, compras, transporte)
  - Tendencias de gasto mensuales
  - Actualización automática cada 15 segundos
- **Exportación de Datos**: Genere informes CSV con un clic

## Instalación y Uso
### Requisitos del Sistema
- Node.js ≥ 14.0.0 (versión 18.x recomendada)
- npm ≥ 6.0.0

### Inicio Rápido
```bash
git clone https://github.com/your-username/Household-Finance-Manager.git
cd Household-Finance-Manager
npm install
cd client && npm install
cd ../server && npm install
npm run dev  # Inicia frontend(http://localhost:5173) y backend(http://localhost:3000)
```

## Guía de Uso
1. **Añadir Gasto**:
   - Pulse "Nuevo Gasto"
   - Complete tipo, importe(€), fecha y detalles
   - Envíe para guardar automáticamente

2. **Ver Análisis**:
   - Distribución de gastos en página principal
   - Seguimiento de tendencias diarias
   - Alertas de categorías con alto consumo

3. **Exportar Datos**:
   - Genere CSV en cualquier momento
   - Ruta: `server/exports/expenses_initial.csv`
   - Compatible con Excel

## Funciones Específicas para España
- **Formato Fecha**: 15/03/2024 (DD/MM/AAAA)
- **Categorías Locales**: Supermercado, Ocio, Transporte Público, Suministros
- **Símbolo Monetario**: Euro (€) automático
- **Gastos Típicos**: Tapas, Metro/Bus, Comunidad, Actividades Extraescolares
- **Periodicidad**: Soporte para pagos mensuales/trimestrales

## Tecnología Utilizada
- **Frontend**: Vue 3 + Chart.js visualización
- **Backend**: Node.js + Express procesamiento
- **Localización**: Day.js formato español
- **Almacenamiento**: Archivos CSV (gestión sencilla)

```
Ejemplo de registro:
15/03/2024, Alimentación, €32.50, Compra semanal Mercadona
16/03/2024, Transporte, €40.00, Abono transporte mensual
17/03/2024, Ocio, €65.80, Cena con amigos
```

---
<a id="fr-FR"></a>
# Gestionnaire de Finances Familiales [Français（France）]

## Présentation du Projet
Ce système de gestion financière familiale est spécialement conçu pour les utilisateurs français, facilitant le suivi des dépenses quotidiennes et l'analyse des habitudes de consommation. Adapté aux formats locaux (JJ/MM/AAAA) avec support de l'euro (€).

## Fonctionnalités Clés
- **Suivi des Dépenses**: Ajout intuitif d'opérations (type, montant, date, notes)
- **Synchronisation**: Sauvegarde automatique en CSV en temps réel
- **Analyse Intelligente**:
  - Répartition par catégories (alimentation, shopping, transport)
  - Tendances de dépenses mensuelles
  - Mise à jour automatique toutes les 15 secondes
- **Export de Données**: Génération de rapports CSV en un clic

## Installation et Utilisation
### Prérequis
- Node.js ≥ 14.0.0 (version 18.x recommandée)
- npm ≥ 6.0.0

### Démarrage Rapide
```bash
git clone https://github.com/your-username/Household-Finance-Manager.git
cd Household-Finance-Manager
npm install
cd client && npm install
cd ../server && npm install
npm run dev  # Lance le frontend(http://localhost:5173) et backend(http://localhost:3000)
```

## Guide d'Utilisation
1. **Ajouter une Dépense**:
   - Cliquez sur "Nouvelle Opération"
   - Remplissez type, montant(€), date et détails
   - Soumettez pour sauvegarde automatique
   
2. **Analyser les Données**:
   - Répartition des dépenses sur l'accueil
   - Suivi des tendances quotidiennes
   - Détection automatique des catégories surconsommées
   
3. **Exporter les Données**:
   - Générez un CSV à tout moment
   - Chemin : `server/exports/expenses_initial.csv`
   - Compatible Excel

## Fonctionnalités Spécifiques à la France
- **Format de Date**: 15/03/2024 (JJ/MM/AAAA)
- **Catégories Françaises**: Courses, Loisirs, Transport, Factures, Restaurant
- **Affichage Monétaire**: Euro (€) automatique
- **Dépenses Typiques**: Ticket restaurant, Paiement CB, Abonnements
- **Gestion des Remboursements**: Suivi des remboursements santé (future fonctionnalité)

## Technologies Utilisées
- **Frontend**: Vue 3 + Chart.js visualisation
- **Backend**: Node.js + Express traitement
- **Localisation**: Day.js format français
- **Stockage**: Fichiers CSV (gestion simplifiée)

```
Exemple d'enregistrement :
15/03/2024, Alimentation, €42.30, Courses hebdomadaires Carrefour
16/03/2024, Transport, €75.50, Plein d'essence
17/03/2024, Loisirs, €120.00, Cinéma en famille
```
