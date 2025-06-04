<!--
 * @file ExpenseList.vue
 * @package 家庭记账本
 * @module 公共组件
 * @description 消费记录列表展示组件
 * @author 开发者
 * @version 1.0
-->
<template>
  <div class="data-section">

    <div class="search-container" style="display: flex; gap: 1rem; flex-wrap: wrap;">
    <input type="month" v-model="selectedMonth" :placeholder="$t('expense.search.monthPlaceholder')">
    <select v-model="selectedType">
      <option value="">{{ $t('expense.search.allType') }}</option>
      <option v-for="type in uniqueTypes" :key="type" :value="type">{{ type }}</option>
    </select>
    <select v-model="sortOption">
      <option value="dateAsc">{{ $t('expense.sort.dateAsc') }}</option>
      <option value="dateDesc">{{ $t('expense.sort.dateDesc') }}</option>
      <option value="amountAsc">{{ $t('expense.sort.amountAsc') }}</option>
      <option value="amountDesc">{{ $t('expense.sort.amountDesc') }}</option>
    </select>
    <input type="number" v-model="minAmount" :placeholder="$t('expense.search.minAmountPlaceholder')">
    <span style="align-self: center;">~</span>
    <input type="number" v-model="maxAmount" :placeholder="$t('expense.search.maxAmountPlaceholder')">
    <input type="text" v-model="searchKeyword" :placeholder="$t('expense.search.keywordPlaceholder')">
  </div>
  <table>
    <thead>
      <tr>
        <th>{{ $t('expense.date') }}</th>
        <th>{{ $t('expense.type.type') }}</th>
        <th>{{ $t('expense.amount') }}</th>
        <th>{{ $t('expense.remark') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="expense in filteredExpenses" :key="expense.id"> <!-- 使用唯一id作为key优化渲染性能 -->
        <td>{{ expense.time }}</td>
        <td>{{ expense.type }}</td>
        <td>¥{{ expense.amount }}</td>
        <td>{{ expense.remark || '-' }}</td>
      </tr>
    </tbody>
  </table>
  </div>
</template>

<script setup>

import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
// 系统主题状态跟踪
let systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

const updateSystemTheme = (e) => {
  systemDarkMode = e.matches
  forceStyleUpdate()
}

// 强制样式更新
const forceStyleUpdate = () => {
  const html = document.documentElement
  if (!html.hasAttribute('data-theme')) {
    html.style.setProperty('--container-bg', systemDarkMode ? '#1a1a1a' : '#f9fafb', 'important')
    html.style.setProperty('--text-primary', systemDarkMode ? '#e0e0e0' : '#333', 'important')
  }
}

onMounted(() => {
  mediaQuery.addEventListener('change', updateSystemTheme)
  forceStyleUpdate() // 初始化执行
})

onBeforeUnmount(() => {
  mediaQuery.removeEventListener('change', updateSystemTheme)
})
/**
 * 组件属性定义
 * @typedef {Object} ExpenseListProps
 * @property {Array} expenses - 消费记录数组
 * @property {string} title - 列表标题
 */
const searchKeyword = ref('')
const selectedType = ref('')
const selectedMonth = ref('') // 格式：YYYY-MM
const minAmount = ref('') // 最小金额
const maxAmount = ref('') // 最大金额
const uniqueTypes = computed(() => {
  return [...new Set(props.expenses.map(expense => expense.type))]
})
const sortOption = ref('dateAsc') // 默认日期升序
const filteredExpenses = computed(() => {
  let filtered = props.expenses.slice() // 避免修改原数组
  // 原有筛选逻辑...
  // 新增排序逻辑
  switch (sortOption.value) {
    case 'dateAsc':
      filtered.sort((a, b) => new Date(a.time) - new Date(b.time));
      break;
    case 'dateDesc':
      filtered.sort((a, b) => new Date(b.time) - new Date(a.time));
      break;
    case 'amountAsc':
      filtered.sort((a, b) => a.amount - b.amount);
      break;
    case 'amountDesc':
      filtered.sort((a, b) => b.amount - a.amount);
      break;
  }
  // 类型筛选
  if (selectedType.value) {
    filtered = filtered.filter(expense => expense.type === selectedType.value)
  }
  // 月份筛选（提取时间的年月部分匹配）
  if (selectedMonth.value) {
    filtered = filtered.filter(expense => expense.time?.slice(0,7) === selectedMonth.value)
  }
  // 金额范围筛选
  if (minAmount.value) {
    filtered = filtered.filter(expense => expense.amount >= Number(minAmount.value))
  }
  if (maxAmount.value) {
    filtered = filtered.filter(expense => expense.amount <= Number(maxAmount.value))
  }
  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(expense => {
      return expense.time.toLowerCase().includes(keyword) || 
             expense.type.toLowerCase().includes(keyword) || 
             expense.remark.toLowerCase().includes(keyword)
    })
  }
  return filtered
})

const props = defineProps({  expenses: Array,  title: String })
</script>

<style scoped>
/* 基础输入组件样式 */
.search-container > input,
.search-container > select {
  background: var(--input-bg);
  border-color: var(--border-color);
  color: var(--text-primary);
  padding: 0.5rem 0rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--input-bg);
  color: var(--text-primary);
  transition: all 0.3s ease;
  flex-shrink: 1;
  margin-left: 1rem;
}

/* 金额输入框缩小 */
.search-container > input[type="number"] {
  max-width: 60px;
}

.search-container > input[type="text"] {
  max-width: 100px;
}
.search-container > input[type="month"]{
  max-width: 80px;
}

.search-container > select:first-of-type{
  max-width: 80px;
}
.search-container > select:last-of-type {
  max-width: 80px
};
/* 聚焦动画 */
.search-container > input:focus,
.search-container > select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.15);
}

/* 分隔符样式 */
.search-container > span {
  align-self: center;
  color: var(--text-secondary);
  padding: auto auto rem;
}

/* 深色模式适配 */
[data-theme="dark"] {
  --input-bg: #363636;
  --border-color: #4a4a4a;
  --primary-color: #79bbff;
  --primary-rgb: 121, 187, 255;
  --text-primary: #e0e0e0;
  --text-secondary: #a2a2a2;
  --select-bg: #363636; /* 下拉框背景 */
  --select-border: #4a4a4a; /* 下拉框边框 */
}

[data-theme="light"] {
  --input-bg: #ffffff;
  --border-color: #e4e7ed;
  --primary-color: #409eff;
  --primary-rgb: 64, 158, 255;
  --text-primary: #303133;
  --text-secondary: #606266;
}
/* 深色模式变量体系 */
:root {
  /* 浅色默认值 */
  /* 增加 !important 保证优先级 */
  --container-bg: #f9fafb !important;
  --data-section-bg: var(--container-bg); /* 新增容器专用背景变量（浅色模式与container-bg同步） */
  --table-bg: white;
  --th-bg: #f3f6fa;
  --text-primary: #333;
  --text-secondary: #444;
  --border-color: #f0f0f0;
  --hover-bg: #eaf6ff;
  --shadow-base: 0 4px 24px 
    rgba(0,0,0,0.08); /* 降低浅色模式阴影强度 */
  --shadow-hover: 0 8px 32px rgba(0,0,0,0.13);
  --shadow-table: 0 2px 8px rgba(0,0,0,0.04);
  --scroll-mask: linear-gradient(
    to right,
    transparent,
    #f9fafb 20px,
    #f9fafb calc(100% - 20px),
    transparent
  );
}

/* 系统级深色模式 */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --container-bg: #6b6b6b; /* 保留原容器变量 */
    --data-section-bg: #424141; /* 新增容器专用背景变量（深色模式调浅） */
    --table-bg: #555555; /* 再次调浅深色模式表格背景 */
    --th-bg: #4f4f4f;
    --text-primary: #e0e0e0;
    --text-secondary: #a2a2a2;
    --border-color: #454545;
    --hover-bg: #545556;
    --shadow-base: 0 4px 24px rgba(0,0,0,0.4);  /* 加深阴影透明度 */
    --shadow-hover: 0 8px 32px rgba(0,0,0,0.5);
    --shadow-table: 0 2px 8px rgba(255,255,255,0.03);
    --scroll-mask: linear-gradient(
      to right,
      transparent,
      #393939 20px,
      #424242 calc(100% - 20px),
      transparent
    );
    --input-bg: #363636;
    --select-bg: #363636;
    --select-border: #4a4a4a;
  }
}

/* 手动深色模式 */
[data-theme="dark"] {
  --container-bg: #6b6b6b; /* 保留原容器变量 */
    --data-section-bg: #7c7c7c; /* 新增容器专用背景变量（手动深色模式调浅） */
    --table-bg: #555555; /* 再次调浅手动深色模式表格背景 */
    --th-bg: #4f4f4f;
    --text-primary: #e0e0e0;
    --text-secondary: #a2a2a2;
    --border-color: #454545;
    --hover-bg: #545556;
    --shadow-base: 0 4px 24px rgba(0,0,0,0.4);  /* 加深阴影透明度 */
    --shadow-hover: 0 8px 32px rgba(0,0,0,0.5);
    --shadow-table: 0 2px 8px rgba(255,255,255,0.03);
    --scroll-mask: linear-gradient(
      to right,
      transparent,
      #393939 20px,
      #424242 calc(100% - 20px),
      transparent
  );
}

/* 基础容器样式 */
.data-section {
  margin: 0;
  padding: 1.5rem;
  box-sizing: border-box;
  width: max-content; /* 适配表格长度 */
  max-width: 100%; /* 防止溢出屏幕 */
  overflow-x: auto; /* 中间容器铺满屏幕 */
  border-radius: 16px;
  background: var(--data-section-bg); /* 使用专用背景变量 */
  transition: none; /* 移除阴影过渡效果 */
  position: relative; /* 新增定位层 */
  z-index: 1;
}

/* 悬停效果 */
.data-section:hover {
  transform: none; /* 移除悬停变换 */
}

/* 表格系统 */
.data-section table {
  border-collapse: separate;
  border-spacing: 0;
  background: var(--table-bg);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-table);
  min-width: max-content; /* 保留表格内容自适应 */
}

/* 表头样式 */
.data-section th {
  background: var(--th-bg);
  color: var(--text-primary);
  font-weight: 600;
  letter-spacing: 0.5px;
  position: sticky;
  top: 0;
  z-index: 2;
  white-space: nowrap; /* 禁止表头换行 */
}

/* 单元格基础样式 */
.data-section th,
.data-section td {
  padding: 14px 18px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
  font-size: 1rem;
  white-space: nowrap; /* 禁止内容换行 */
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 数据行样式 */
.data-section td {
  color: var(--text-secondary);
  transition: background-color 0.2s;
}

/* 行悬停效果 */
.data-section tr:hover {
  background: var(--hover-bg);
}

/* 移动端适配 (768px以下) */
@media (max-width: 768px) {
  .data-section {
    padding: 1rem 0;
    border-radius: 0;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: 0;
    padding: 1rem 0 !important;
    mask-image: var(--scroll-mask); /* 滚动边缘渐变 */
    background: var(--container-bg) !important;
  }

  /* 调整搜索容器布局 */
  .search-container {
    gap: 0.5rem;
  }
  .search-container > input[type="month"],
  .search-container > select,
  .search-container > select:last-of-type {
    flex-basis: calc(20% - 0.25rem); /* 第一行三个元素（月份、类型、排序）各占33% */
    flex-shrink: 0;
  }
  /* 金额输入框+分隔符组合占半行 */
  .search-container > input[type="number"],
  .search-container > span {
    flex-basis: calc((50% - 1rem) / 2); /* 两个金额框各占(50%-1rem)/2，分隔符占1rem间隔 */
    flex-shrink: 0;
  }
  /* 搜索框占半行 */
  .search-container > input[type="text"] {
    flex-basis: calc(50% - 0.5rem); /* 搜索框占50%宽度，减去右侧间隔 */
    flex-shrink: 0;
  }
  .search-container > span {
    flex-basis: auto; /* 分隔符保持自动宽度 */
  }

  .data-section table {
    width: auto;
    min-width: 100%;
    border-radius: 8px;
    margin-left: 1rem;
    margin-right: 1rem;
    transform: translateX(-1px); /* 微调对齐 */
    box-shadow: none;
  }

  .data-section th,
  .data-section td {
    padding: 12px 14px;
    font-size: 0.9rem;
  }

  /* 首尾列增加内边距 */
  .data-section td:first-child,
  .data-section th:first-child {
    padding-left: 24px;
  }
  .data-section td:last-child,
  .data-section th:last-child {
    padding-right: 24px;
  }
}

/* 中屏适配 (769px-1024px) */
@media (min-width: 769px) and (max-width: 1024px) {
  .data-section {
    padding: 1.25rem;
  }
  
  .data-section th,
  .data-section td {
    padding: 13px 16px;
    font-size: 0.95rem;
  }
}

.data-section h2::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 18px;
  width: 40px;
  height: 2px;
  background: var(--text-primary);
  opacity: 0.2;
}
.data-section {
  transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

</style>

