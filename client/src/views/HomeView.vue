<template>
  <div class="container">
    <div v-if="error" class="error-alert">{{ error }}</div>
    <MessageTip v-model:message="successMessage" type="success" />
    <MessageTip v-model:message="errorMessage" type="error" />
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

    <div :class="['header', currentTheme]">
    </div>
    
    <ChartControls
  @set-chart-type="setChartType"
  :current-month="currentMonth"
  :month-label="monthLabel"
  :chart-type="chartType"
  @prev-month="prevMonth"
  @next-month="nextMonth"
/>

    <Transition name="chart">
      <ConsumptionChart
        v-if="chartType===1 && chart1Data.labels.length > 0"
        :chart-data="chart1Data"
        :chart-options="computedChartOptions"
      />
      <ConsumptionChart
        v-else-if="chartType===2 && chart2Data.labels.length > 0"
        :chart-data="chart2Data"
        :chart-options="computedChartOptions"
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
import { useThemeStore } from '@/stores/theme';
import ChartControls from '@/components/ChartControls.vue'
import { useChartData } from '@/composables/useChartData'

// 国际化
const { t, locale } = useI18n()

// 响应式数据：所有费用记录
let csvExpenses = ref([])

const { chart1Data, chart2Data, currentMonth, monthLabel, prevMonth, nextMonth, setChartType, chartType } = useChartData(csvExpenses, locale);
const themeStore = useThemeStore();
const currentTheme = computed(() => themeStore.currentTheme);

// Excel 导出功能
const { exportToExcel } = useExcelExport()



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
    let newData = [];
    try {
      console.log('loadCsvExpenses: Fetching from API.');
      const data = await ExpenseAPI.getExpenses();
      newData = Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('获取消费数据失败:', err);
      errorMessage.value = t('error.fetchExpensesFailed', { error: err.message });
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

// 当前月份（已通过useChartData导入）
  // 图表类型 (1: 每日趋势, 2: 每日降序)

// 计算属性：当前月份的显示标签


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

// 监听金额变化，处理整数补两位小数逻辑 (注意：直接修改 props.newExpense.amount 不推荐，但为了保持原有功能，暂时保留)
watch(() => newExpense.value.amount, (newVal) => {
  if (typeof newVal === 'number' && newVal % 1 === 0) {
    newExpense.value.amount = Number(newVal.toFixed(2));
  }
}, { immediate: true });

</script>

<style scoped>
@import '@/styles/home.css';
</style>
