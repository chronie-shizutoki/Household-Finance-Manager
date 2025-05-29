<template>
  <div class="container">
    <div v-if="error" class="error-alert">{{ error }}</div>
    <MessageTip v-model:message="successMessage" type="success" />
    <MessageTip v-model:message="errorMessage" type="error" />

    <Header :title="$t('app.title')" />
    
    <ActionButtons
      :on-refresh="() => fetchData(true)"
      :on-add="toggleModal"
    />

    <Transition name="modal-fade">
      <ExpenseModal
        v-model:show="showModal"
        :new-expense="newExpense"
        @submit-expense="submitExpense"
        @close="showModal = false"
      />
    </Transition>

    <ExpenseList :expenses="csvExpenses" />

    <div class="chart-controls">
      <div class="month-control">
        <button class="btn btn-scale prev-btn" @click="prevMonth">&lt;</button>
        <span class="month-label">{{ monthLabel }}</span>
        <button class="btn btn-scale next-btn" @click="nextMonth">&gt;</button>
      </div>
      <div class="chart-toggle">
        <button 
          class="btn btn-scale chart-btn" 
          :class="{active: chartType===1}" 
          @click="setChartType(1)"
        >
          {{ t('home.dailyTrend') }}
        </button>
        <button 
          class="btn btn-scale chart-btn" 
          :class="{active: chartType===2}" 
          @click="setChartType(2)"
        >
          {{ t('home.dailyDescending') }}
        </button>
      </div>
    </div>

    <Transition name="chart">
      <ConsumptionChart
        v-if="chartType===1 && chart1Data.labels.length > 0"
        :chart-data="chart1Data"
        :chart-options="chartOptions"
      />
      <ConsumptionChart
        v-else-if="chartType===2 && chart2Data.labels.length > 0"
        :chart-data="chart2Data"
        :chart-options="chartOptions"
      />
      <div v-else class="no-data">{{ t('home.noData') }}</div>
    </Transition>

    <Transition name="button">
      <ExportButton v-if="csvExpenses.length > 0" @export-excel="() => exportExcel(csvExpenses)" />
<template v-else><div class="no-data">请等待数据加载完成后再导出</div></template>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount, watchEffect } from 'vue'

// 最顶部声明csvExpenses确保初始化优先
let csvExpenses = ref([])

import { useI18n } from 'vue-i18n'
import Papa from 'papaparse'
import dayjs from 'dayjs'
import MessageTip from '@/components/MessageTip.vue'
import Header from '@/components/Header.vue'
import ActionButtons from '@/components/ActionButtons.vue'
import ExpenseModal from '@/components/ExpenseModal.vue'
import ExpenseList from '@/components/ExpenseList.vue'
import ConsumptionChart from '@/components/ConsumptionChart.vue'
import ExportButton from '@/components/ExportButton.vue'
import { useExpenseData } from '@/composables/useExpenseData'
import { ExpenseAPI } from '@/api/expenses'
import { useExcelExport } from '@/composables/useExcelExport'
import CacheStore from '@/utils/CacheStore'
import GenAIWebpageEligibilityService from '@/utils/GenAIWebpageEligibilityService'
import { safeShouldShowTouchpoints, initContentScript } from '@/utils/content-script-utils'

let { exportToExcel: exportExcel } = useExcelExport()
const eligibilityService = new GenAIWebpageEligibilityService();

// 确保导出数据与表格数据同步
watch(csvExpenses, (newExpenses) => {
  exportExcel = () => useExcelExport().exportToExcel(newExpenses);
})
import { API_BASE } from '@/api/expenses'

// 节流函数优化（使用时间戳+定时器）
let throttle = (func, delay) => {
  let lastTime = 0;
  let timeoutId = null;
  
  return (...args) => {
    const now = Date.now();
    const remaining = delay - (now - lastTime);
    
    clearTimeout(timeoutId);
    
    if (remaining <= 0) {
      lastTime = now;
      func.apply(this, args);
    } else {
      timeoutId = setTimeout(() => {
        lastTime = Date.now();
        func.apply(this, args);
      }, remaining);
    }
  }
}

// 数据管理
let {
  expenses, 
  chartData, 
  fetchData, 
  errorMessage, 
  lastUpdateTime, 
  error, 
  successMessage 
} = useExpenseData()

// 刷新时同步更新csvExpenses
let originalFetchData = fetchData;
fetchData = async (forceRefresh = false) => {
  await originalFetchData(forceRefresh);
  await loadCsvExpenses();
}

let { t, locale } = useI18n()
// 响应式数据
let newExpense = ref({ 
  time: '', 
  type: '', 
  amount: 0, 
  itemName: '' 
});

newExpense.value.type = t('expense.type.food')
let showModal = ref(false)

// 从后端获取数据并赋值给csvExpenses
let isLoadingCsv = ref(false);
let loadCsvExpenses = async () => {
  if (isLoadingCsv.value) return;
  isLoadingCsv.value = true;
  
  try {
    // 尝试从缓存获取数据（TTL设置为1小时）
    const cacheStore = new CacheStore();
    const cachedData = await cacheStore.get('expensesData');
    if (cachedData && Date.now() - cachedData.timestamp < 3600 * 1000) {
      csvExpenses.value = cachedData.data;
    } else {
      // 缓存不存在或过期，请求后端数据
      let data = await ExpenseAPI.getExpenses();
      const newData = Array.isArray(data) ? data : [];
      // 更新缓存
      await cacheStore.set('expensesData', { data: newData, timestamp: Date.now() }, 3600 * 1000);
      csvExpenses.value = newData;
    }
  } catch (err) {
    console.error('获取消费数据失败:', err);
  } finally {
    isLoadingCsv.value = false;
  }
}

// 挂载时加载数据及检查触摸点显示
onMounted(() => {
  loadCsvExpenses();
  
  // 检查是否显示触摸点
  eligibilityService.shouldShowTouchpoints().then(shouldShow => {
    // 可添加响应式变量控制UI显示，例如：
    // showTouchpoints.value = shouldShow;
  });
})

let currentMonth = ref(dayjs().format('YYYY-MM'))
let chartType = ref(1)

// 修复后的计算属性
let monthLabel = computed(() => {
  let d = dayjs(currentMonth.value)
  // 确保所有分支都获取基础年份
  let baseYear = d.year()
  let baseMonth = d.month() + 1 // 月份从1开始

  // 统一获取其他语言的年份
  let yearValue = baseYear
  let monthValue

  // 各语言月份格式处理
  switch (locale.value) {
    case 'en-US':
      monthValue = d.format('MMMM') // April
      break
    case 'ko':
      monthValue = `${baseMonth}월` // 4월
      break
    case 'vi':
    case 'ms':
      monthValue = baseMonth; // 数字
      break
    default: // 中文及其他语言
      monthValue = String(baseMonth).padStart(2, '0');
      yearValue = `${baseYear}`;
      break;
  }

  return t(`monthLabel.${locale.value}`, {
    year: yearValue,
    month: monthValue
  })})



// 方法
let toggleModal = () => showModal.value = !showModal.value
let submitExpense = async () => {
  try {
    await ExpenseAPI.addExpense(newExpense.value)
    successMessage.value = t('expense.addSuccess')
    await fetchData()
    toggleModal()
    newExpense.value = { time: '', type: t('expense.type.food'), amount: 0, itemName: '' };
  } catch (err) {
    errorMessage.value = t('expense.addFailed', { error: err.message })
  }
}

// 图表数据计算函数
const calculateChart1Data = (expenses) => {
  if (!expenses || expenses.length === 0) return { labels: [], datasets: [] };
  
  const dailyData = new Map();
  expenses.forEach(expense => {
    const day = dayjs(expense.time).format('YYYY-MM-DD');
    dailyData.set(day, (dailyData.get(day) || 0) + expense.amount);
  });
  
  const sortedDays = Array.from(dailyData.keys()).sort();
  return {
    labels: sortedDays.map(day => dayjs(day).format('MM-DD')),
    datasets: [{
      label: t('home.dailyTrend'),
      data: sortedDays.map(day => dailyData.get(day)),
      borderColor: '#4BC0C0',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.4,
      fill: true
    }]
  };
};

const calculateChart2Data = (expenses) => {
  if (!expenses || expenses.length === 0) return { labels: [], datasets: [] };
  
  const dailySum = new Map();
  expenses.forEach(expense => {
    const day = dayjs(expense.time).format('YYYY-MM-DD');
    dailySum.set(day, (dailySum.get(day) || 0) + expense.amount);
  });
  
  const sortedEntries = Array.from(dailySum.entries()).sort((a, b) => b[1] - a[1]);
  return {
    labels: sortedEntries.map(([day]) => dayjs(day).format('MM-DD')),
    datasets: [{
      label: t('home.dailyDescending'),
      data: sortedEntries.map(([_, value]) => value),
      borderColor: '#FF6384',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      tension: 0.4,
      fill: true
    }]
  };
};

// 图表数据缓存
let chart1Cache = ref(null);
let chart2Cache = ref(null);
let lastDataHash = ref('');

// 图表数据更新控制
let chartUpdateTimer = ref(null);
let isChartUpdating = ref(false);

const updateCharts = async () => {
  if (isChartUpdating.value) return;
  
  isChartUpdating.value = true;
  
  // 计算缓存键（基于月份和图表类型）
  const cacheKey = `chartData:${currentMonth.value}:${chartType.value}`;
  
  try {
    // 尝试从缓存获取图表数据（TTL设置为30分钟）
    const cacheStore = new CacheStore();
    const cachedChartData = await cacheStore.get(cacheKey);
    if (cachedChartData && Date.now() - cachedChartData.timestamp < 1800 * 1000) {
      chart1Cache.value = cachedChartData.chart1;
      chart2Cache.value = cachedChartData.chart2;
    } else {
      // 缓存不存在或过期，重新计算
      const monthExpenses = csvExpenses.value.filter(expense => 
        dayjs(expense.time).isSame(currentMonth.value, 'month')
      );
      
      chart1Cache.value = calculateChart1Data(monthExpenses);
      chart2Cache.value = calculateChart2Data(monthExpenses);
      // 更新缓存
      await cacheStore.set(cacheKey, {
        chart1: chart1Cache.value,
        chart2: chart2Cache.value,
        timestamp: Date.now()
      }, 1800 * 1000);
    }
  } catch (err) {
    console.error('更新图表缓存失败:', err);
  }
  
  isChartUpdating.value = false;
};

// 使用watchEffect替代多个watch
watchEffect(() => {
  // 取消之前的定时器
  if (chartUpdateTimer.value) {
    clearTimeout(chartUpdateTimer.value);
  }
  
  // 设置新的定时器（500ms防抖）
  chartUpdateTimer.value = setTimeout(updateCharts, 500);
});

// 清理定时器
onBeforeUnmount(() => {
  if (chartUpdateTimer.value) {
    clearTimeout(chartUpdateTimer.value);
  }
});

// 图表数据引用
let chart1Data = computed(() => chart1Cache.value || { labels: [], datasets: [] });
let chart2Data = computed(() => chart2Cache.value || { labels: [], datasets: [] });

// 月份切换防抖（500ms）
let prevMonth = throttle(() => {
  currentMonth.value = dayjs(currentMonth.value)
    .subtract(1, 'month')
    .format('YYYY-MM')
}, 500)

let nextMonth = throttle(() => {
  currentMonth.value = dayjs(currentMonth.value)
    .add(1, 'month')
    .format('YYYY-MM')
}, 500)

// 图表类型切换
let setChartType = (type) => {
  chartType.value = type
}

// 增强的图表配置
let chartOptions = ref({    responsive: true,    maintainAspectRatio: false,    plugins: {      legend: {        labels: {          color: 'var(--text-primary)'        }      },      tooltip: {        backgroundColor: 'var(--bg-primary)',        titleColor: 'var(--text-primary)',        bodyColor: 'var(--text-primary)',        borderColor: 'var(--border-primary)'      }    },    scales: {      x: {        grid: {          color: 'var(--border-primary)'        },        ticks: {          color: 'var(--text-secondary)'        }      },      y: {        grid: {          color: 'var(--border-primary)'        },        ticks: {          color: 'var(--text-secondary)',          callback: (value) => `¥${value}`        }      }    }  });
</script>

// 生命周期
onMounted(() => {
  let darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)')
  systemDarkMode.value = darkModeMedia.matches
  darkModeMedia.addEventListener('change', updateSystemTheme)
  applyTheme()
  fetchData(false)
})

<style scoped>
:root {
  --text-primary: #333;
  --text-secondary: #666;
  --bg-primary: #fff;
  --border-primary: #e0e0e0;
  --primary-color: #4CAF50;
  --error-bg: #ffebee;
  --error-border: #ffcdd2;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --text-primary: #fff;
    --text-secondary: #b0b0b0;
    --bg-primary: #1a1a1a;
    --border-primary: #404040;
    --primary-color: #81C784;
    --error-bg: #3a1a1a;
    --error-border: #5a2a2a;
  };
}

[data-theme="dark"] {
  --text-primary: #fff;
  --text-secondary: #b0b0b0;
  --bg-primary: #1a1a1a;
  --border-primary: #404040;
  --primary-color: #81C784;
  --error-bg: #3a1a1a;
  --error-border: #5a2a2a;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: var(--text-primary);
  background: var(--bg-primary);
  transition: all 0.3s ease;
}

.error-alert {
  padding: 1rem;
  margin-bottom: 1rem;
  background: var(--error-bg);
  border: 1px solid var(--error-border);
  border-radius: 8px;
  color: #d32f2f;
}

.chart-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin: 2.5rem 0;
}

.month-control {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
}

.month-label {
  font-weight: bold;
  color: var(--text-primary);
}

.chart-toggle {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.prev-btn, .next-btn {
  background: var(--primary-color);
  color: white;
  border: none;
}

.chart-btn {
  background: rgba(76, 175, 80, 0.1);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}

.chart-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: transparent;
}

.no-data {
  text-align: center;
  color: var(--text-secondary);
  padding: 2rem;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .chart-controls {
    margin: 1.5rem 0;
  }

  .month-label {
    font-size: 1rem;
  }

  .btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
}
</style>