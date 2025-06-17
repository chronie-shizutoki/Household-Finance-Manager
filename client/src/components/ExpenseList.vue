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

    <div class="stats-container" style="margin-bottom: 1rem; padding: 0 1rem; color: var(--text-primary);">
      <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
        <span>{{ $t('expense.stats.rowCount') }}：{{ filteredExpenses.length }}</span>
        <span>{{ $t('expense.stats.totalAmount') }}：¥{{ totalAmount }}</span>
        <span>{{ $t('expense.stats.averageAmount') }}：¥{{ averageAmount }}</span>
        <span>{{ $t('expense.stats.medianAmount') }}：¥{{ medianAmount }}</span>
        <span>{{ $t('expense.stats.amountRange') }}：¥{{ minAmountVal }}-¥{{ maxAmountVal }}</span>
        <span>{{ $t('expense.stats.typeCount') }}：{{ uniqueTypes.length }}</span>
      </div>
    </div>

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
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>{{ $t('expense.date') }}</th>
          <th>{{ $t('expense.type.type') }}</th>
          <th>{{ $t('expense.amount') }}</th>
          <th>{{ $t('expense.remark') }}</th>
        </tr>
      </thead>
      <transition-group name="list-fade" tag="tbody" mode="out-in" :key="currentPage" appear>
        <tr v-for="(expense, index) in paginatedExpenses" :key="`expense-${currentPage}-${expense.id || index}`"> <!-- 使用唯一id作为key优化渲染性能 -->
          <td>{{ expense.time }}</td>
            <td>{{ expense.type }}</td>
            <td>¥{{ expense.amount }}</td>
            <td>{{ expense.remark || '-' }}</td>
        </tr>
      </transition-group>
    </table>
  </div>
  
  <div class="pagination">
      <button @click="currentPage = 1" :disabled="currentPage === 1" aria-label="首页">
        <<
      </button>
      <button @click="currentPage = Math.max(currentPage - 1, 1)" :disabled="currentPage === 1" aria-label="上一页">
        ←
      </button>
      <span v-for="page in displayedPages" :key="page" class="page-number" @click="handlePageClick(page)" :class="{ 'active': currentPage === page, 'ellipsis': page === '...' }">{{ page }}</span>
      <button @click="currentPage = Math.min(currentPage + 1, totalPages)" :disabled="currentPage === totalPages" aria-label="下一页">
        →
      </button>
      <button @click="currentPage = totalPages" :disabled="currentPage === totalPages || totalPages === 0" aria-label="末页">
        >>
      </button>
    </div>
  </div>
</template>

<script setup>

import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

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
const currentPage = ref(1)
const pageSize = ref(10) // 每页显示10条
const uniqueTypes = computed(() => {
  return [...new Set(props.expenses.map(expense => expense.type))]
})
const sortOption = ref('dateAsc') // 默认日期升序
const totalAmount = computed(() => {
  return filteredExpenses.value.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2);
});

const averageAmount = computed(() => {
  return filteredExpenses.value.length > 0 ? (totalAmount.value / filteredExpenses.value.length).toFixed(2) : '0.00';
});

const sortedAmounts = computed(() => {
  return filteredExpenses.value.map(expense => expense.amount).sort((a, b) => a - b);
});

const medianAmount = computed(() => {
  const amounts = sortedAmounts.value;
  const mid = Math.floor(amounts.length / 2);
  return amounts.length ? (amounts.length % 2 !== 0 ? amounts[mid] : (amounts[mid - 1] + amounts[mid]) / 2).toFixed(2) : '0.00';
});

const minAmountVal = computed(() => {
  return sortedAmounts.value.length > 0 ? sortedAmounts.value[0].toFixed(2) : '0.00';
});

const maxAmountVal = computed(() => {
  return sortedAmounts.value.length > 0 ? sortedAmounts.value[sortedAmounts.value.length - 1].toFixed(2) : '0.00';
});

const totalPages = computed(() => {
  return Math.ceil(filteredExpenses.value.length / pageSize.value);
});

const handlePageClick = (page) => {
  // 只处理数字类型的页码
  if (typeof page === 'number') {
    currentPage.value = page;
  }
};

const displayedPages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  // 总是显示第一页
  if (total >= 1) pages.push(1);

  // 当总页数大于5时显示省略号和中间页
  if (total > 5) {
    // 当前页附近的页码
    if (current > 3) pages.push('...');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push('...');
  } else {
    // 总页数小于等于5时显示所有页码
    for (let i = 2; i < total; i++) pages.push(i);
  }

  // 总是显示最后一页
  if (total > 1) pages.push(total);

  return pages;
});

const paginatedExpenses = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return filteredExpenses.value.slice(startIndex, startIndex + pageSize.value);
});

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
@import '../styles/expense-list.css';

.table-container {
  overflow-x: auto;
  width: 100%;
}
</style>

