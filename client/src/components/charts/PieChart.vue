<!--
* @file PieChart.vue
* @package 家庭记账本
* @module 图表组件
* @description 饼图组件，基于BaseChart和vue-chartjs实现
* @author 开发者
* @version 1.0
-->
<template>
  <BaseChart
    ref="baseChartRef"
    :chart-data="processedChartData"
    :chart-options="processedChartOptions"
    :title="title"
    :show-title="showTitle"
    :loading="loading"
    :container-class="containerClass"
    :width="width"
    :height="height"
  >
    <template #chart-content>
      <Pie
        v-if="!loading && hasData"
        :data="processedChartData"
        :options="processedChartOptions"
        @chart-created="handleChartCreated"
        @update="handleChartUpdate"
      />
    </template>
  </BaseChart>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useI18n } from 'vue-i18n';
import BaseChart from './BaseChart.vue';

// 注册Chart.js组件
ChartJS.register(ArcElement, Tooltip, Legend);

const { t } = useI18n();
const baseChartRef = ref(null);
const chartInstance = ref(null);

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
      if (!value?.labels || !value?.datasets) {
        console.error('chartData必须包含labels和datasets字段');
        return false;
      }
      return true;
    }
  },
  
  /**
   * 自定义图表配置项
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
   * 容器类名
   * @type {String}
   */
  containerClass: {
    type: String,
    default: ''
  },
  
  /**
   * 宽度
   * @type {String|Number}
   */
  width: {
    type: [String, Number],
    default: '100%'
  },
  
  /**
   * 高度
   * @type {String|Number}
   */
  height: {
    type: [String, Number],
    default: 300
  },
  
  /**
   * 是否显示图例
   * @type {Boolean}
   */
  showLegend: {
    type: Boolean,
    default: true
  },
  
  /**
   * 图例位置
   * @type {String}
   */
  legendPosition: {
    type: String,
    default: 'top',
    validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value)
  },
  
  /**
   * 是否显示工具提示
   * @type {Boolean}
   */
  showTooltip: {
    type: Boolean,
    default: true
  }
});

/**
 * 计算属性：处理后的图表数据
 */
const processedChartData = computed(() => {
  // 如果没有数据，返回空数据结构
  if (!props.chartData || !props.chartData.labels || !props.chartData.datasets) {
    return { labels: [], datasets: [] };
  }
  
  // 深拷贝数据以避免直接修改props
  const data = JSON.parse(JSON.stringify(props.chartData));
  
  // 为数据集添加默认颜色（如果没有指定）
  data.datasets.forEach((dataset, index) => {
    if (!dataset.backgroundColor) {
      dataset.backgroundColor = getDefaultColors(data.labels.length, index);
    }
    
    if (!dataset.borderColor) {
      dataset.borderColor = '#ffffff';
      dataset.borderWidth = 2;
    }
  });
  
  return data;
});

/**
 * 计算属性：处理后的图表配置
 */
const processedChartOptions = computed(() => {
  // 基础配置
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: props.showLegend,
        position: props.legendPosition,
        labels: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--chart-text-primary') || '#333333',
          font: {
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        enabled: props.showTooltip,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            let value = context.parsed || 0;
            
            // 计算百分比
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            
            // 格式化数值为货币格式
            const formattedValue = new Intl.NumberFormat('zh-CN', {
              style: 'currency',
              currency: 'CNY',
              minimumFractionDigits: 2
            }).format(value);
            
            return `${label}: ${formattedValue} (${percentage}%)`;
          }
        }
      }
    },
    // 防止图表调整大小时触发重绘导致的性能问题
    animation: {
      duration: 0
    }
  };
  
  // 合并用户自定义配置
  return { ...baseOptions, ...props.chartOptions };
});

/**
   * 计算属性：是否有数据
   */
const hasData = computed(() => {
  if (!processedChartData.value || !processedChartData.value.labels) {
    return false;
  }
  
  return processedChartData.value.labels.length > 0 &&
    processedChartData.value.datasets.some(dataset => 
      dataset.data && 
      dataset.data.length > 0 && 
      dataset.data.some(value => value !== null && value !== undefined)
    );
});

/**
 * 获取默认颜色数组
 * @param {Number} count - 需要的颜色数量
 * @param {Number} datasetIndex - 数据集索引
 * @returns {Array} 颜色数组
 */
const getDefaultColors = (count, datasetIndex = 0) => {
  const baseColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
    '#C9CBCF', '#4D5360', '#F7464A', '#46BFBD', '#FDB45C', '#949FB1'
  ];
  
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[(datasetIndex * 5 + i) % baseColors.length]);
  }
  
  return colors;
};

/**
 * 处理图表创建事件
 * @param {Object} instance - 图表实例
 */
const handleChartCreated = (instance) => {
  chartInstance.value = instance;
  if (baseChartRef.value) {
    baseChartRef.value.setChartInstance(instance);
  }
  console.log('PieChart created');
};

/**
 * 处理图表更新事件
 * @param {Object} instance - 图表实例
 */
const handleChartUpdate = (instance) => {
  chartInstance.value = instance;
  console.log('PieChart updated');
};

/**
 * 销毁图表实例
 */
const destroyChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }
  
  if (baseChartRef.value) {
    baseChartRef.value.destroyChartInstance();
  }
};

/**
 * 刷新图表
 */
const refreshChart = () => {
  if (chartInstance.value) {
    chartInstance.value.update();
  }
};

/**
 * 导出组件方法
 */
defineExpose({
  chartInstance,
  refreshChart,
  destroyChart
});

/**
 * 生命周期：组件挂载后
 */
onMounted(() => {
  console.log('PieChart mounted');
});

/**
 * 生命周期：组件卸载前
 */
onBeforeUnmount(() => {
  console.log('PieChart beforeUnmount, destroying chart');
  destroyChart();
});
</script>

<style scoped>
/* 饼图特定样式可以在这里添加 */
</style>