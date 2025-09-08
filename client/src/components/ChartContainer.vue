<template>
  <div class="chart-container">
    <ChartControls
      @set-chart-type="handleSetChartType"
      :current-month="currentMonth"
      :month-label="monthLabel"
      :chart-type="chartType"
      @prev-month="handlePrevMonth"
      @next-month="handleNextMonth"
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
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ChartControls from './ChartControls.vue'
import ConsumptionChart from './ConsumptionChart.vue'

// 定义props
const props = defineProps({
  chart1Data: {
    type: Object,
    required: true
  },
  chart2Data: {
    type: Object,
    required: true
  },
  currentMonth: {
    type: String,
    required: true
  },
  monthLabel: {
    type: String,
    required: true
  },
  chartType: {
    type: Number,
    required: true
  }
})

// 定义emits
const emit = defineEmits(['set-chart-type', 'prev-month', 'next-month'])

// 国际化
const { t } = useI18n()

// 事件处理函数
const handleSetChartType = (type) => {
  emit('set-chart-type', type)
}

const handlePrevMonth = () => {
  emit('prev-month')
}

const handleNextMonth = () => {
  emit('next-month')
}

// 缓存变量，用于避免不必要的chartOptions对象创建
const cachedThemeValues = ref({
  textColor: '',
  secondaryTextColor: '',
  borderColor: '',
  bgColor: '',
  options: null
});

// 图表配置计算属性 - 添加缓存机制以避免无限渲染
const chartOptions = computed(() => {
  const getCssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  // 获取当前CSS变量值
  const textColor = getCssVar('--text-primary');
  const secondaryTextColor = getCssVar('--text-secondary');
  const borderColor = getCssVar('--border-primary');
  const bgColor = getCssVar('--bg-primary');

  // 检查CSS变量值是否有变化
  const themeValuesChanged = 
    textColor !== cachedThemeValues.value.textColor ||
    secondaryTextColor !== cachedThemeValues.value.secondaryTextColor ||
    borderColor !== cachedThemeValues.value.borderColor ||
    bgColor !== cachedThemeValues.value.bgColor;

  // 如果没有变化且已有缓存的配置，则返回缓存的配置对象
  if (!themeValuesChanged && cachedThemeValues.value.options) {
    return cachedThemeValues.value.options;
  }

  // 只有当主题值变化时才创建新的配置对象
  const options = {
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

  // 更新缓存
  cachedThemeValues.value = {
    textColor,
    secondaryTextColor,
    borderColor,
    bgColor,
    options
  };

  return options;
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  margin: 20px 0;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}
</style>