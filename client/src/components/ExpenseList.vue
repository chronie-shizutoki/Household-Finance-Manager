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
    <h2>{{ title }}</h2>
    <table>
      <thead>
        <tr>
          <th>日期</th>
          <th>类型</th>
          <th>金额</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="expense in expenses" :key="expense.id"> <!-- 使用唯一id作为key优化渲染性能 -->
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

import { onMounted, onBeforeUnmount } from 'vue'

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
const props = defineProps({  expenses: Array,  title: String })
</script>

<style>
/* 深色模式变量体系 */
:root {
  /* 浅色默认值 */
  /* 增加 !important 保证优先级 */
  --container-bg: #f9fafb !important;
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
    --container-bg: #3b3b3b;
    --table-bg: #2a2929;
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
}

/* 手动深色模式 */
[data-theme="dark"] {
  /* 修正颜色值为纯黑色 */
  --container-bg: #404040 !important;
  --table-bg: #1a1a1a;
  --th-bg: #484848;
  --text-primary: #e0e0e0;
  --text-secondary: #b0b0b0;
  --border-color: #404040;
  --hover-bg: #3a4d5c;
  --shadow-base: 0 4px 24px 
  --shadow-base: 0 4px 24px rgba(0,0,0,0.4);
  --shadow-hover: 0 8px 32px rgba(0,0,0,0.5);
  --shadow-table: 0 2px 8px rgba(255,255,255,0.03);
  --scroll-mask: linear-gradient(
    to right,
    transparent,
    #4d4c4c 20px,
    #2d2d2d calc(100% - 20px),
    transparent
  );
}

/* 基础容器样式 */
.data-section {
  margin: 0;
  padding: 1.5rem;
  box-sizing: border-box;
  max-width: 100%;
  border-radius: 16px;
  background: var(--container-bg);
  box-shadow: var(--shadow-base);
  transition: box-shadow 0.3s, transform 0.3s;
  box-shadow: var(--shadow-base);
  position: relative; /* 新增定位层 */
  z-index: 1;
}

/* 悬停效果 */
.data-section:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: var(--shadow-hover);
}

/* 表格系统 */
.data-section table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: var(--table-bg);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-table);
  min-width: 600px; /* 保证表格最小宽度 */
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
  max-width: 220px;
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

  .data-section table {
    width: auto;
    min-width: 100%;
    border-radius: 8px;
    margin-left: 1rem;
    margin-right: 1rem;
    transform: translateX(-1px); /* 微调对齐 */
    box-shadow: none;
    td:first-child, th:first-child {
    padding-left: 1.5rem !important;
  }
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


/* 标题样式 */
.data-section h2 {
  color: var(--text-primary);
  margin: 0 0 1.5rem;
  font-size: 1.3rem;
  padding: 0 18px;
  position: relative;
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
.data-section::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 16px;
  box-shadow: inset 0 0 12px rgba(255,255,255,0.05);
  pointer-events: none;
  display: none;
}
[data-theme="dark"] .data-section::after {
  display: block;
}

@media (prefers-color-scheme: dark) {
  .data-section::after {
    display: block;
  }
}
</style>

