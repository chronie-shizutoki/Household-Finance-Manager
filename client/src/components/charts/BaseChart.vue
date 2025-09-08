<!--
* @file BaseChart.vue
* @package 家庭记账本
* @module 图表组件
* @description 基础图表组件，封装通用的图表功能和生命周期管理
* @author 开发者
* @version 1.0
-->
<template>
  <div class="base-chart-container" :class="containerClass">
    <h2 v-if="showTitle" class="chart-title">{{ title }}</h2>
    <div class="chart-wrapper" :style="chartWrapperStyle">
      <slot name="chart-content">
        <!-- 图表内容将由子组件渲染 -->
      </slot>
    </div>
    <div v-if="loading" class="chart-loading">
      <div class="loading-spinner"></div>
      <span>{{ loadingText }}</span>
    </div>
    <div v-if="!loading && (!chartData || !hasData)" class="no-chart-data">
      {{ noDataText }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

/**
 * 组件属性定义
 */
const props = defineProps({
  /**
   * 图表数据
   * @type {Object}
   * @required
   */
  chartData: {
    type: Object,
    required: true,
    validator: (value) => {
      // 验证数据结构是否符合Chart.js要求
      if (!value?.labels || !value?.datasets) {
        console.error('chartData必须包含labels和datasets字段');
        return false;
      }
      return true;
    }
  },
  
  /**
   * 图表配置项
   * @type {Object}
   */
  chartOptions: {
    type: Object,
    default: () => ({})
  },
  
  /**
   * 图表标题
   * @type {String}
   */
  title: {
    type: String,
    default: ''
  },
  
  /**
   * 是否显示标题
   * @type {Boolean}
   */
  showTitle: {
    type: Boolean,
    default: true
  },
  
  /**
   * 是否加载中
   * @type {Boolean}
   */
  loading: {
    type: Boolean,
    default: false
  },
  
  /**
   * 加载文本
   * @type {String}
   */
  loadingText: {
    type: String,
    default: '加载中...'
  },
  
  /**
   * 无数据文本
   * @type {String}
   */
  noDataText: {
    type: String,
    default: '暂无数据'
  },
  
  /**
   * 图表容器类名
   * @type {String}
   */
  containerClass: {
    type: String,
    default: ''
  },
  
  /**
   * 图表宽度
   * @type {String|Number}
   */
  width: {
    type: [String, Number],
    default: '100%'
  },
  
  /**
   * 图表高度
   * @type {String|Number}
   */
  height: {
    type: [String, Number],
    default: 300
  }
});

/**
 * 计算属性：图表包装器样式
 */
const chartWrapperStyle = computed(() => ({
  width: props.width,
  height: props.height,
  position: 'relative'
}));

/**
 * 计算属性：是否有数据
 */
const hasData = computed(() => {
  if (!props.chartData || !props.chartData.labels || !props.chartData.datasets) {
    return false;
  }
  
  // 检查是否有标签数据
  if (props.chartData.labels.length === 0) {
    return false;
  }
  
  // 检查是否有数据集数据
  return props.chartData.datasets.some(dataset => {
    if (!dataset.data || dataset.data.length === 0) {
      return false;
    }
    // 检查数据集中是否有数据
    return dataset.data.some(value => value !== null && value !== undefined);
  });
});

/**
 * 图表实例引用
 */
const chartInstance = ref(null);

/**
 * 设置图表实例
 */
const setChartInstance = (instance) => {
  chartInstance.value = instance;
};

/**
 * 销毁图表实例
 */
const destroyChartInstance = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }
};

/**
 * 暴露方法给父组件
 */
defineExpose({
  setChartInstance,
  destroyChartInstance,
  chartInstance
});

/**
 * 监听图表数据变化，触发重绘
 */
watch(() => props.chartData, () => {
  // 子类组件可以根据需要处理数据变化
}, { deep: true });

/**
 * 生命周期：组件挂载后
 */
onMounted(() => {
  console.log('BaseChart mounted');
});

/**
 * 生命周期：组件卸载前，确保销毁图表实例
 */
onBeforeUnmount(() => {
  console.log('BaseChart beforeUnmount, destroying chart instance');
  destroyChartInstance();
});
</script>

<style scoped>
.base-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  margin: 0.5rem 0;
  background: var(--chart-container-bg, #ffffff);
  border-radius: 12px;
  box-shadow: var(--chart-shadow, 0 4px 12px rgba(0,0,0,0.08));
  transition: all 0.3s ease;
}

.base-chart-container:hover {
  transform: translateY(-2px);
  box-shadow: var(--chart-hover-shadow, 0 8px 20px rgba(0,0,0,0.12));
}

.chart-title {
  color: var(--chart-text-primary, #333333);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--chart-border-color, #e0e0e0);
  width: 100%;
  text-align: center;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  z-index: 10;
}

.no-chart-data {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: var(--chart-text-secondary, #999999);
  font-size: 1rem;
  text-align: center;
}

/* 加载动画 */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color, #4BC0C0);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 0.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .base-chart-container {
    --chart-container-bg: #2d2d2d;
    --chart-shadow: 0 4px 12px rgba(255,255,255,0.08);
    --chart-hover-shadow: 0 8px 20px rgba(255,255,255,0.12);
    --chart-text-primary: #e0e0e0;
    --chart-border-color: #404040;
    --chart-text-secondary: #b0b0b0;
  }
  
  .chart-loading {
    background: rgba(45, 45, 45, 0.9);
  }
}
</style>