<!--
 * @file ConsumptionChart.vue
 * @package 家庭记账本
 * @module 公共组件
 * @description 消费趋势图表组件
 * @author 开发者
 * @version 1.0
-->
<template>
  <div :class="['chart-container', { 'scene-style': showSceneStyle }]">
    <h2 v-if="showTitle">{{ $t('app.consumptionTrend') }}</h2>
    <LineChart :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Line as LineChart } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, CategoryScale, PointElement } from 'chart.js'
import { defineComponent } from 'vue'

// 注册图表核心模块（合并通用逻辑）
ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, CategoryScale, PointElement)

/**
 * 组件属性定义（兼容原两个组件的参数）
 * @typedef {Object} ConsumptionChartProps
 * @property {Object} chartData - 图表数据（包含labels和datasets，必填）
 * @property {Object} [chartOptions] - 图表配置项（可选）
 * @property {boolean} [showTitle] - 是否显示标题（默认true，兼容原Consumption场景）
 * @property {boolean} [showSceneStyle] - 是否应用场景化样式（默认true，兼容原悬停效果）
 */
const props = defineProps({  chartData: {
    type: Object,
    required: true,
    validator: (value) => {
      if (!value?.labels || !value?.datasets) {
        console.error('chartData必须包含labels（数组）和datasets（数组）字段')
        return false
      }
      return true
    }
  },  chartOptions: Object,  showTitle: { type: Boolean, default: true },  showSceneStyle: { type: Boolean, default: true }})

/**
 * 图表渲染错误处理（来自原ChartComponent的优化）
 */
const LineChartWrapper = defineComponent({  extends: LineChart,  mounted() {    try {
      // 验证chartData结构
      if (!this.chartData?.labels || !this.chartData?.datasets) {
        console.error('图表数据不完整，需包含labels和datasets字段')
        return
      }
      this.renderChart(this.chartData, this.chartOptions)    } catch (error) {      console.error('图表渲染失败:', error)    }  }})
// 新增深色模式检测逻辑
import { watchEffect, ref, onMounted, onBeforeUnmount } from 'vue'

const isDark = ref(false)


// 图表颜色配置生成器
const getChartColors = () => ({
  textColor: isDark.value ? '#e0e0e0' : '#333',
  gridColor: isDark.value ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  pointBackgroundColor: isDark.value ? '#4f9cf1' : '#1a73e8',
  borderColor: isDark.value ? '#4f9cf1' : '#1a73e8',
  backgroundColor: isDark.value ? 'rgba(79,156,241,0.2)' : 'rgba(26,115,232,0.2)'
})

// 动态图表配置
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: getChartColors().textColor // 图例文字颜色
      }
    },
    tooltip: {
      backgroundColor: isDark.value ? '#3a3a3a' : '#ffffff',
      titleColor: getChartColors().textColor,
      bodyColor: getChartColors().textColor,
      borderColor: 'rgba(0,0,0,0.1)'
    }
  },
  scales: {
    x: {
      grid: {
        color: getChartColors().gridColor // X轴网格线
      },
      ticks: {
        color: getChartColors().textColor // X轴文字
      }
    },
    y: {
      grid: {
        color: getChartColors().gridColor // Y轴网格线
      },
      ticks: {
        color: getChartColors().textColor // Y轴文字
      }
    }
  }
})

// 监听主题变化
const updateTheme = () => {
  const html = document.documentElement
  isDark.value = html.dataset.theme === 'dark' || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches && !html.dataset.theme)
  
  // 动态更新图表配置
  chartOptions.value = {
    ...chartOptions.value,
    plugins: {
      ...chartOptions.value.plugins,
      legend: {
        labels: {
          color: getChartColors().textColor
        }
      },
      tooltip: {
        backgroundColor: isDark.value ? '#3a3a3a' : '#ffffff',
        titleColor: getChartColors().textColor,
        bodyColor: getChartColors().textColor
      }
    },
    scales: {
      x: {
        grid: { color: getChartColors().gridColor },
        ticks: { color: getChartColors().textColor }
      },
      y: {
        grid: { color: getChartColors().gridColor },
        ticks: { color: getChartColors().textColor }
      }
    }
  }
}

// 生命周期钩子
onMounted(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const themeObserver = new MutationObserver(updateTheme)
  
  mediaQuery.addEventListener('change', updateTheme)
  themeObserver.observe(document.documentElement, { 
    attributes: true,
    attributeFilter: ['data-theme']
  })
})

onBeforeUnmount(() => {
  mediaQuery.removeEventListener('change', updateTheme)
  themeObserver.disconnect()
})

// 初始化数据集颜色（在传入chartData时处理）
watchEffect(() => {
  if (props.chartData?.datasets) {
    const colors = getChartColors()
    props.chartData.datasets = props.chartData.datasets.map(dataset => ({
      ...dataset,
      borderColor: colors.borderColor,
      pointBackgroundColor: colors.pointBackgroundColor,
      backgroundColor: colors.backgroundColor
    }))
  }
})
</script>

<style scoped>
/* 在全局或组件样式中定义 */
:root {
  /* 浅色模式默认值 */
  --text-primary: #333333;
  --text-secondary: #666666;
  --bg-primary: #ffffff;
  --border-primary: #e0e0e0;
}

/* 系统级深色模式 */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --text-primary: #ffffff;
    --text-secondary: #b0b0b0;
    --bg-primary: #1a1a1a;
    --border-primary: #404040;
  }
}

/* 手动深色模式 */
[data-theme="dark"] {
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --bg-primary: #1a1a1a;
  --border-primary: #404040;
}
/* 新增图表专用CSS变量 */
:root {
  --chart-container-bg: white;
  --chart-shadow: 0 4px 12px rgba(0,0,0,0.08);
  --chart-hover-shadow: 0 8px 20px rgba(0,0,0,0.12);
  --chart-text-primary: #333;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --chart-container-bg: #2d2d2d;
    --chart-shadow: 0 4px 12px rgba(255,255,255,0.08);
    --chart-hover-shadow: 0 8px 20px rgba(255,255,255,0.12);
    --chart-text-primary: #e0e0e0;
  }
}

[data-theme="dark"] {
  --chart-container-bg: #2d2d2d;
  --chart-shadow: 0 4px 12px rgba(255,255,255,0.08);
  --chart-hover-shadow: 0 8px 20px rgba(255,255,255,0.12);
  --chart-text-primary: #e0e0e0;
}

.chart-container {
  width: 100%;
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  background: var(--chart-container-bg);
  border-radius: 12px;
  box-shadow: var(--chart-shadow);
  transition: all 0.3s ease;
  color: var(--chart-text-primary);
}

.chart-container.scene-style:hover {
  transform: translateY(-4px);
  box-shadow: var(--chart-hover-shadow);
}

/* 图表标题颜色适配 */
h2 {
  color: var(--chart-text-primary);
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--chart-text-primary);
}
</style>
