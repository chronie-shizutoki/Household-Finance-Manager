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

    <!-- 直接使用 useExpenseData 提供的 expenses -->
    <ExpenseList :expenses="expenses" />

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
      <!-- 直接使用 useExpenseData 提供的 expenses -->
      <ExportButton v-if="expenses.length > 0" @export-excel="() => exportToExcel(expenses)" />
      <div v-else class="no-data">{{ t('home.noDataForExport') }}</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { formatMonthLabelByLocale } from '@/utils/dateFormatter'
import MessageTip from '@/components/MessageTip.vue'
import Header from '@/components/Header.vue'
import ActionButtons from '@/components/ActionButtons.vue'
import ExpenseModal from '@/components/ExpenseModal.vue'
import ExpenseList from '@/components/ExpenseList.vue'
import ConsumptionChart from '@/components/ConsumptionChart.vue'
import ExportButton from '@/components/ExportButton.vue'
import { useExpenseData } from '@/composables/useExpenseData' // 导入 useExpenseData
import { ExpenseAPI } from '@/api/expenses' // ExpenseAPI 仍可能在 ExpenseModal 中使用
import { useExcelExport } from '@/composables/useExcelExport'
import { useThemeStore } from '@/stores/theme';
import ChartControls from '@/components/ChartControls.vue'

// 国际化
const { t, locale } = useI18n()

// 使用 useExpenseData 组合式函数管理费用数据
const {
  expenses, // 直接使用 useExpenseData 提供的 expenses
  fetchData, // useExpenseData 提供的 fetchData
  errorMessage,
  error,
  successMessage,
  chart1Data, // 使用 useExpenseData 内部调用 useChartData 返回的图表数据
  chart2Data,
  currentMonth,
  monthLabel,
  prevMonth,
  nextMonth,
  setChartType,
  chartType
} = useExpenseData()
const themeStore = useThemeStore();
const currentTheme = computed(() => themeStore.currentTheme);

// Excel 导出功能
const { exportToExcel } = useExcelExport()

// 新增消费记录的响应式数据
const newExpense = ref({
  time: '',
  type: '',
  amount: 0,
  remark: ''
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

// 移除 loadCsvExpenses 函数，数据获取和稳定性由 useExpenseData 统一管理
// const isLoadingCsv = ref(false);
// const loadCsvExpenses = async () => { /* ... 移除此函数 ... */ }

// 方法
const toggleModal = () => showModal.value = !showModal.value

const submitExpense = async () => {
  try {
    await ExpenseAPI.addExpense(newExpense.value)
    successMessage.value = t('expense.addSuccess')
    await fetchData(true) // 提交后强制刷新数据，确保数据最新
    toggleModal() // 关闭模态框
    resetNewExpense() // 重置表单数据
  } catch (err) {
    errorMessage.value = t('expense.addFailed', { error: err.message })
  }
}

// 深色模式状态
const systemDarkMode = ref(false);

// 使用计算属性而不是响应式引用，避免不必要的重新渲染
const chartOptions = computed(() => {
  const getCssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  const textColor = getCssVar('--text-primary');
  const secondaryTextColor = getCssVar('--text-secondary');
  const borderColor = getCssVar('--border-primary');
  const bgColor = getCssVar('--bg-primary');

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0 // 禁用动画以提高性能
    },
    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      },
      tooltip: {
        backgroundColor: bgColor,
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: borderColor,
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
      datalabels: {
        color: secondaryTextColor,
        anchor: 'end',
        align: 'top',
        formatter: (value) => {
          return value.toFixed(2);
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
          color: borderColor
        },
        ticks: {
          color: secondaryTextColor
        }
      },
      y: {
        grid: {
          color: borderColor
        },
        ticks: {
          color: secondaryTextColor,
          callback: (value) => `¥${value}`
        }
      }
    }
  };
});

// 应用主题
const applyTheme = () => {
  const currentThemeDataset = document.documentElement.dataset.theme;
  if (!currentThemeDataset) {
    document.documentElement.dataset.theme = systemDarkMode.value ? 'dark' : 'light';
  }
};

// 更新系统主题
const updateSystemTheme = (event) => {
  systemDarkMode.value = event.matches;
  applyTheme();
};

// 生命周期钩子
onMounted(() => {
  // 初始加载费用数据现在直接调用 useExpenseData 提供的 fetchData
  fetchData(false); // 初始获取数据
  
  // 深色模式监听
  const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');
  systemDarkMode.value = darkModeMedia.matches;
  darkModeMedia.addEventListener('change', updateSystemTheme);
  applyTheme(); // 应用初始主题
});

onBeforeUnmount(() => {
  // 移除深色模式监听器
  const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeMedia.removeEventListener('change', updateSystemTheme);
});

watch(() => newExpense.value.amount, (newVal) => {
  if (typeof newVal === 'number' && newVal % 1 === 0) {
    newExpense.value.amount = Number(newVal.toFixed(2));
  }
}, { immediate: true });

</script>

<style scoped>
@import '@/styles/home.css';
</style>

