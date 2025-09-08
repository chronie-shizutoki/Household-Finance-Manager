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
    <LineChart :chart-data="chartData" :chart-options="chartOptions" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import LineChart from './charts/LineChart.vue'

const { t } = useI18n()

/**
* 组件属性定义
* @typedef {Object} ConsumptionChartProps
* @property {Object} chartData - 图表数据（包含labels和datasets，必填）
* @property {Object} [chartOptions] - 图表配置项（可选）
* @property {boolean} [showTitle] - 是否显示标题（默认true，兼容原Consumption场景）
* @property {boolean} [showSceneStyle] - 是否应用场景化样式（默认true，兼容原悬停效果）
*/
const props = defineProps({
  chartData: {
    type: Object,
    required: true,
    validator: (value) => {
      if (!value?.labels || !value?.datasets) {
        console.error('chartData必须包含labels（数组）和datasets（数组）字段')
        return false
      }
      return true
    }
  },
  chartOptions: {
    type: Object,
    default: () => ({}) // 默认值为空对象，避免未定义
  },
  showTitle: {
    type: Boolean,
    default: true
  },
  showSceneStyle: {
    type : Boolean,
    default: true
  }
})

// 注意：此组件不再包含深色模式检测逻辑和内部 chartOptions。
// 所有的图表配置（包括颜色和数据标签）都将从父组件 homeview.vue 通过 chartOptions prop 传递。
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
