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
        @reset-expense="resetNewExpense"
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
        :chart-options="computedChartOptions"
        :key="`chart1-${chartUpdateKey}`"
      />
      <ConsumptionChart
        v-else-if="chartType===2 && chart2Data.labels.length > 0"
        :chart-data="chart2Data"
        :chart-options="computedChartOptions"
        :key="`chart2-${chartUpdateKey}`"
      />
      <div v-else class="no-data">{{ t('home.noData') }}</div>
    </Transition>

    <Transition name="button">
      <ExportButton v-if="csvExpenses.length > 0" @export-excel="() => exportToExcel(csvExpenses)" />
      <div v-else class="no-data">{{ t('home.noDataForExport') }}</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import Papa from 'papaparse'
import dayjs from 'dayjs'
import { formatMonthLabelByLocale } from '@/utils/dateFormatter'
import MessageTip from '@/components/MessageTip.vue'
import Header from '@/components/Header.vue'
import ActionButtons from '@/components/ActionButtons.vue'
import ExpenseModal from '@/components/ExpenseModal.vue'
import ExpenseList from '@/components/ExpenseList.vue'
import ConsumptionChart from '@/components/ConsumptionChart.vue' // 确保路径正确
import ExportButton from '@/components/ExportButton.vue'
import { useExpenseData } from '@/composables/useExpenseData'
import { ExpenseAPI } from '@/api/expenses'
import { useExcelExport } from '@/composables/useExcelExport'
import CacheStore from '@/utils/CacheStore'
import GenAIWebpageEligibilityService from '@/utils/GenAIWebpageEligibilityService'
import { safeShouldShowTouchpoints, initContentScript } from '@/utils/content-script-utils'

// 响应式数据：所有费用记录
let csvExpenses = ref([])

// 添加图表更新键，用于强制重新渲染图表组件
const chartUpdateKey = ref(0)

// Excel 导出功能
const { exportToExcel } = useExcelExport()
const eligibilityService = new GenAIWebpageEligibilityService()

// 节流函数优化（使用时间戳+定时器）
const throttle = (func, delay) => {
  let lastTime = 0;
  let timeoutId = null;
 
  return function(...args) {
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

// 使用 useExpenseData 组合式函数管理费用数据
const {
  expenses,
  chartData,
  fetchData: originalFetchData, // 重命名原始 fetchData
  errorMessage,
  lastUpdateTime,
  error,
  successMessage
} = useExpenseData()

// 包装 fetchData，确保在数据刷新后也加载 CSV 费用
const fetchData = async (forceRefresh = false) => {
  console.log('fetchData called, forceRefresh:', forceRefresh);
  await originalFetchData(forceRefresh);
  await loadCsvExpenses();
}

// 国际化
const { t, locale } = useI18n()

// 新增消费记录的响应式数据
const newExpense = ref({
  time: '',
  type: '',
  amount: 0,
  remark: '' // 确保 remark 字段存在
});

// 初始化 newExpense 的 type 字段
watchEffect(() => {
  newExpense.value.type = t('expense.type.food');
});

// 重置 newExpense 数据
const resetNewExpense = () => {
  newExpense.value = {
    time: '',
    type: t('expense.type.food'),
    amount: 0,
    remark: ''
  };
};

// 模态弹窗显示状态
const showModal = ref(false)

// 从后端获取数据并赋值给csvExpenses
const isLoadingCsv = ref(false);
const loadCsvExpenses = async () => {
  if (isLoadingCsv.value) {
    console.log('loadCsvExpenses: Already loading, skipping.');
    return;
  }
  isLoadingCsv.value = true;
  console.log('loadCsvExpenses: Starting data fetch.');
 
  try {
    const cacheStore = new CacheStore();
    const cacheKey = 'expensesData';
    const cachedData = await cacheStore.get(cacheKey);

    let newData = [];
    if (cachedData && Date.now() - cachedData.timestamp < 3600 * 1000) {
      console.log('loadCsvExpenses: Loading from cache.');
      newData = cachedData.data;
    } else {
      console.log('loadCsvExpenses: Cache expired or not found, fetching from API.');
      const data = await ExpenseAPI.getExpenses();
      newData = Array.isArray(data) ? data : [];
      await cacheStore.set(cacheKey, { data: newData, timestamp: Date.now() }, 3600 * 1000);
    }

    // 关键优化：只有当数据实际发生变化时才更新 csvExpenses.value
    // 使用 JSON.stringify 进行深层比较，确保数据内容一致时不会触发不必要的更新
    if (JSON.stringify(csvExpenses.value) !== JSON.stringify(newData)) {
      console.log('loadCsvExpenses: csvExpenses.value updated (content changed).');
      csvExpenses.value = newData;
    } else {
      console.log('loadCsvExpenses: csvExpenses.value content is identical, no update needed.');
    }

  } catch (err) {
    console.error('获取消费数据失败:', err);
    errorMessage.value = t('error.fetchExpensesFailed', { error: err.message });
  } finally {
    isLoadingCsv.value = false;
    console.log('loadCsvExpenses: Data fetch finished.');
  }
}

// 当前月份
const currentMonth = ref(dayjs().format('YYYY-MM'))
// 图表类型 (1: 每日趋势, 2: 每日降序)
const chartType = ref(1)

// 计算属性：当前月份的显示标签
const monthLabel = computed(() => {
  return formatMonthLabelByLocale(currentMonth.value, locale.value);
})

// 方法
const toggleModal = () => showModal.value = !showModal.value

const submitExpense = async () => {
  try {
    await ExpenseAPI.addExpense(newExpense.value)
    successMessage.value = t('expense.addSuccess')
    await fetchData() // 提交后重新获取数据
    toggleModal() // 关闭模态框
    resetNewExpense() // 重置表单数据
  } catch (err) {
    errorMessage.value = t('expense.addFailed', { error: err.message })
  }
}

// 图表数据计算函数：每日趋势
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
      fill: true, // 需要 Filler 插件
      pointRadius: 5, // 显示数据点
      pointHoverRadius: 7,
      pointBackgroundColor: '#4BC0C0',
      pointBorderColor: '#fff',
      pointHoverBorderColor: '#fff'
    }]
  };
};

// 图表数据计算函数：每日降序
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
      fill: true, // 需要 Filler 插件
      pointRadius: 5, // 显示数据点
      pointHoverRadius: 7,
      pointBackgroundColor: '#FF6384',
      pointBorderColor: '#fff',
      pointHoverBorderColor: '#fff'
    }]
  };
};

// 图表数据缓存
const chart1Cache = ref(null);
const chart2Cache = ref(null);

// 图表更新控制
let chartUpdateTimer = ref(null);
const isChartUpdating = ref(false);

const updateCharts = async () => {
  if (isChartUpdating.value) {
    console.log('updateCharts: Chart update already in progress, skipping.');
    return;
  }
 
  isChartUpdating.value = true;
  console.log('updateCharts: Starting chart data calculation and cache update.');
 
  // 计算缓存键（基于月份）
  const cacheKey = `chartData:${currentMonth.value}`;
 
  try {
    const cacheStore = new CacheStore();
    const cachedChartData = await cacheStore.get(cacheKey);

    if (cachedChartData && Date.now() - cachedChartData.timestamp < 1800 * 1000) { // 30分钟TTL
      console.log('updateCharts: Loading chart data from cache.');
      // 只有当缓存数据与当前 ref 内容不同时才更新
      if (JSON.stringify(chart1Cache.value) !== JSON.stringify(cachedChartData.chart1)) {
        chart1Cache.value = cachedChartData.chart1;
        console.log('updateCharts: chart1Cache updated from cache (content changed).');
      } else {
        console.log('updateCharts: chart1Cache content from cache is identical, no update needed.');
      }
      if (JSON.stringify(chart2Cache.value) !== JSON.stringify(cachedChartData.chart2)) {
        chart2Cache.value = cachedChartData.chart2;
        console.log('updateCharts: chart2Cache updated from cache (content changed).');
      } else {
        console.log('updateCharts: chart2Cache content from cache is identical, no update needed.');
      }
    } else {
      console.log('updateCharts: Cache expired or not found for chart data, recalculating.');
      const monthExpenses = csvExpenses.value.filter(expense =>
        dayjs(expense.time).isSame(currentMonth.value, 'month')
      );
     
      const newChart1Data = calculateChart1Data(monthExpenses);
      const newChart2Data = calculateChart2Data(monthExpenses);

      // 只有当图表数据实际发生变化时才更新 ref，避免不必要的组件更新
      if (JSON.stringify(chart1Cache.value) !== JSON.stringify(newChart1Data)) {
        chart1Cache.value = newChart1Data;
        console.log('updateCharts: chart1Data updated (content changed).');
      } else {
        console.log('updateCharts: chart1Data content is identical, no update needed.');
      }

      if (JSON.stringify(chart2Cache.value) !== JSON.stringify(newChart2Data)) {
        chart2Cache.value = newChart2Data;
        console.log('updateCharts: chart2Data updated (content changed).');
      } else {
        console.log('updateCharts: chart2Data content is identical, no update needed.');
      }

      await cacheStore.set(cacheKey, {
        chart1: chart1Cache.value,
        chart2: chart2Cache.value,
        timestamp: Date.now()
      }, 1800 * 1000);
    }
    
    // 修复：每次更新图表数据后，增加chartUpdateKey以强制重新渲染图表组件
    chartUpdateKey.value++;
    
  } catch (err) {
    console.error('更新图表缓存失败:', err);
    errorMessage.value = t('error.chartUpdateFailed', { error: err.message });
  } finally {
    isChartUpdating.value = false;
    console.log('updateCharts: Chart data calculation and cache update finished.');
  }
};

// 修复：使用watch替代watchEffect，明确依赖项，避免不必要的重复渲染
watch([() => csvExpenses.value, () => currentMonth.value, () => chartType.value], () => {
  console.log('watch triggered by changes in dependencies.');
  
  if (chartUpdateTimer.value) {
    clearTimeout(chartUpdateTimer.value);
  }
  chartUpdateTimer.value = setTimeout(updateCharts, 500); // 500ms 防抖
}, { deep: false }); // 不使用深度监听，避免不必要的触发

// 清理定时器
onBeforeUnmount(() => {
  if (chartUpdateTimer.value) {
    clearTimeout(chartUpdateTimer.value);
  }
});

// 图表数据引用
const chart1Data = computed(() => chart1Cache.value || { labels: [], datasets: [] });
const chart2Data = computed(() => chart2Cache.value || { labels: [], datasets: [] });

// 月份切换防抖（500ms）
const prevMonth = throttle(() => {
  currentMonth.value = dayjs(currentMonth.value)
    .subtract(1, 'month')
    .format('YYYY-MM')
}, 500)

const nextMonth = throttle(() => {
  currentMonth.value = dayjs(currentMonth.value)
    .add(1, 'month')
    .format('YYYY-MM')
}, 500)

// 图表类型切换
const setChartType = (type) => {
  chartType.value = type
}

// 深色模式状态
const systemDarkMode = ref(false);

// 应用主题
const applyTheme = () => {
  const currentTheme = document.documentElement.dataset.theme;
  if (!currentTheme) { // 如果没有手动设置主题，则根据系统主题设置
    document.documentElement.dataset.theme = systemDarkMode.value ? 'dark' : 'light';
  }
};

// 更新系统主题
const updateSystemTheme = (event) => {
  systemDarkMode.value = event.matches;
  applyTheme();
};

// 计算属性：图表配置，根据深色模式动态调整颜色
const computedChartOptions = computed(() => {
  // 获取当前生效的 CSS 变量值
  const getCssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  const textColor = getCssVar('--text-primary');
  const secondaryTextColor = getCssVar('--text-secondary');
  const borderColor = getCssVar('--border-primary');
  const bgColor = getCssVar('--bg-primary');

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: textColor // 图例文字颜色
        }
      },
      tooltip: {
        backgroundColor: bgColor, // 工具提示背景色
        titleColor: textColor, // 工具提示标题颜色
        bodyColor: textColor, // 工具提示内容颜色
        borderColor: borderColor, // 工具提示边框颜色
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
      datalabels: { // 配置 chartjs-plugin-datalabels
        color: secondaryTextColor, // 数据标签颜色
        anchor: 'end',
        align: 'top',
        formatter: (value) => {
          return value.toFixed(2); // 显示两位小数
        },
        font: {
          size: 10,
          weight: 'bold'
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: borderColor // X轴网格线颜色
        },
        ticks: {
          color: secondaryTextColor // X轴刻度文字颜色
        }
      },
      y: {
        grid: {
          color: borderColor // Y轴网格线颜色
        },
        ticks: {
          color: secondaryTextColor, // Y轴刻度文字颜色
          callback: (value) => `¥${value}`
        }
      }
    }
  };
});

// 生命周期钩子
onMounted(() => {
  loadCsvExpenses(); // 初始加载费用数据
 
  // 检查是否显示触摸点
  eligibilityService.shouldShowTouchpoints().then(shouldShow => {
    // 可添加响应式变量控制UI显示，例如：
    // showTouchpoints.value = shouldShow;
  });

  // 深色模式监听
  const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');
  systemDarkMode.value = darkModeMedia.matches;
  darkModeMedia.addEventListener('change', updateSystemTheme);
  applyTheme(); // 应用初始主题
  fetchData(false); // 初始获取数据
});

onBeforeUnmount(() => {
  // 移除深色模式监听器
  const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeMedia.removeEventListener('change', updateSystemTheme);
});

// 监听金额变化，处理整数补两
watch(() => newExpense.value.amount, (newVal) => {
  if (typeof newVal === 'string') {
    // 如果输入的是字符串，尝试转换为数字
    const numVal = parseFloat(newVal);
    if (!isNaN(numVal)) {
      newExpense.value.amount = numVal;
    }
  }
});
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.error-alert {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
  border-radius: 0.25rem;
}

.chart-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
  flex-wrap: wrap;
  gap: 1rem;
}

.month-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.month-label {
  min-width: 100px;
  text-align: center;
  font-weight: bold;
}

.chart-toggle {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #f0f0f0;
  transition: all 0.2s ease;
}

.btn:hover {
  background-color: #e0e0e0;
}

.btn.active {
  background-color: #4BC0C0;
  color: white;
}

.btn-scale:active {
  transform: scale(0.95);
}

.no-data {
  text-align: center;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin: 1rem 0;
  color: #666;
}

/* 过渡动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.chart-enter-active,
.chart-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.chart-enter-from,
.chart-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.button-enter-active,
.button-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.button-enter-from,
.button-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 深色模式适配 */
:root {
  --text-primary: #333333;
  --text-secondary: #666666;
  --bg-primary: #ffffff;
  --border-primary: #e0e0e0;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --text-primary: #ffffff;
    --text-secondary: #b0b0b0;
    --bg-primary: #1a1a1a;
    --border-primary: #404040;
  }
}

[data-theme="dark"] {
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --bg-primary: #1a1a1a;
  --border-primary: #404040;
}

.container {
  color: var(--text-primary);
  background-color: var(--bg-primary);
}

.btn {
  background-color: var(--border-primary);
  color: var(--text-primary);
}

.btn:hover {
  background-color: var(--text-secondary);
}

.no-data {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
}
</style>
