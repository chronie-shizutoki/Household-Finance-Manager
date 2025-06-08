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
@import '../styles/expense-list.css';
</style>

