<!--
* @file LineChart.vue
* @package 家庭记账本
* @module 图表组件
* @description 折线图组件，基于BaseChart和vue-chartjs实现
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
      <Line
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
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler } from 'chart.js';
import { useI18n } from 'vue-i18n';
import BaseChart from './BaseChart.vue';

// 注册Chart.js组件
ChartJS.register(
  LineElement, 
  PointElement, 
  LinearScale, 
  CategoryScale, 
  Title, 
  Tooltip, 
  Legend, 
  Filler
);

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
   * 是否显示工具提示
   * @type {Boolean}
   */
  showTooltip: {
    type: Boolean,
    default: true
  },
  
  /**
   * 是否填充曲线下方区域
   * @type {Boolean}
   */
  fill: {
    type: Boolean,
    default: false
  },
  
  /**
   * 线条平滑度(0-1)
   * @type {Number}
   */
  tension: {
    type: Number,
    default: 0.1,
    validator: (value) => value >= 0 && value <= 1
  },
  
  /**
   * 是否显示网格线
   * @type {Boolean}
   */
  showGrid: {
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
  
  // 为数据集添加默认配置（如果没有指定）
  data.datasets.forEach((dataset, index) => {
    if (!dataset.borderColor) {
      // 提供默认的线条颜色
      const defaultColors = ['#4BC0C0', '#FF6384', '#36A2EB', '#FFCE56', '#9966FF'];
      dataset.borderColor = defaultColors[index % defaultColors.length];
    }
    
    if (!dataset.backgroundColor && props.fill) {
      // 如果需要填充，生成半透明的填充色
      dataset.backgroundColor = dataset.borderColor + '33'; // 33 表示 20% 透明度
    }
    
    if (dataset.fill === undefined) {
      dataset.fill = props.fill;
    }
    
    if (dataset.tension === undefined) {
      dataset.tension = props.tension;
    }
    
    // 设置点的默认样式
    if (!dataset.pointBackgroundColor) {
      dataset.pointBackgroundColor = dataset.borderColor;
    }
    
    if (!dataset.pointBorderColor) {
      dataset.pointBorderColor = '#ffffff';
    }
    
    if (!dataset.pointBorderWidth) {
      dataset.pointBorderWidth = 2;
    }
    
    if (!dataset.pointRadius) {
      dataset.pointRadius = 5;
    }
    
    if (!dataset.pointHoverRadius) {
      dataset.pointHoverRadius = 7;
    }
  });
  
  return data;
});

/**
 * 计算属性：处理后的图表配置
 */
const processedChartOptions = computed(() => {
  // 获取主题颜色变量
  const rootStyles = getComputedStyle(document.documentElement);
  const textColor = rootStyles.getPropertyValue('--chart-text-primary') || '#333333';
  const secondaryTextColor = rootStyles.getPropertyValue('--chart-text-secondary') || '#666666';
  const borderColor = rootStyles.getPropertyValue('--chart-border-color') || '#e0e0e0';
  
  // 基础配置
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: props.showLegend,
        position: 'top',
        labels: {
          color: textColor,
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
            let label = context.dataset.label || '';
            let value = context.parsed.y || 0;
            
            // 格式化数值为货币格式
            const formattedValue = new Intl.NumberFormat('zh-CN', {
              style: 'currency',
              currency: 'CNY',
              minimumFractionDigits: 2
            }).format(value);
            
            return `${label}: ${formattedValue}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: props.showGrid,
          color: borderColor
        },
        ticks: {
          color: secondaryTextColor,
          font: {
            size: 11
          },
          maxRotation: 45,
          minRotation: 0
        }
      },
      y: {
        display: true,
        grid: {
          display: props.showGrid,
          color: borderColor
        },
        ticks: {
          color: secondaryTextColor,
          font: {
            size: 11
          },
          callback: function(value) {
            // 格式化y轴数值为货币格式
            return new Intl.NumberFormat('zh-CN', {
              style: 'currency',
              currency: 'CNY',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(value);
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
 * 处理图表创建事件
 * @param {Object} instance - 图表实例
 */
const handleChartCreated = (instance) => {
  chartInstance.value = instance;
  if (baseChartRef.value) {
    baseChartRef.value.setChartInstance(instance);
  }
  console.log('LineChart created');
};

/**
 * 处理图表更新事件
 * @param {Object} instance - 图表实例
 */
const handleChartUpdate = (instance) => {
  chartInstance.value = instance;
  console.log('LineChart updated');
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
  console.log('LineChart mounted');
});

/**
 * 生命周期：组件卸载前
 */
onBeforeUnmount(() => {
  console.log('LineChart beforeUnmount, destroying chart');
  destroyChart();
});
</script>

<style scoped>
/* 折线图特定样式可以在这里添加 */
</style>