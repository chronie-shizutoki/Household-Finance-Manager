<template>
  <div class="container fade">
    <h1 class="title">{{ TextConfig.form.title }}</h1>
    
    <form @submit.prevent="addExpense" class="form-card scale-in">
      <div class="skeleton-loader" v-if="loading.form"></div>
      <div v-else class="form-content">
        <!-- 原有表单结构 -->
      </div>
    </form>

    <div class="chart-container shimmer-load" v-if="loading.chart">
      <div class="skeleton-chart"></div>
    </div>
    <div v-else class="chart-loaded">
      <!-- 消费占比图表 -->
      <div class="chart-section">
        <h2>{{ TextConfig.chart.title }}</h2>
        <canvas ref="ratioChart" width="400" height="300"></canvas>
      </div>
      
      <!-- 消费趋势图表 -->
      <div class="chart-section">
        <h2>{{ TextConfig.chart.trendTitle }}</h2>
        <canvas ref="trendChart" width="400" height="300"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { createTextConfig } from '@/config/textConfig';
import { ExpenseAPI } from '@/api/expenses';
import { Chart, ArcElement, Tooltip, Legend, LineController, LinearScale, CategoryScale, PointElement, LineElement } from 'chart.js';
import axios from 'axios';
import FileSaver from 'file-saver';
import { useI18n } from 'vue-i18n';

Chart.register(ArcElement, Tooltip, Legend, LineController, LinearScale, CategoryScale, PointElement, LineElement);

export default {
  data() {
    const { t } = useI18n();
    return {
      t,
      TextConfig: createTextConfig(t),
      loading: {
        form: false,
        chart: false
      },
      expenseTypes: [t('expense.type.food'), t('expense.type.shopping'), t('expense.type.transport'), t('expense.type.entertainment'), t('expense.type.other')],  // 可扩展的支出类型
      newExpense: {
        type: t('expense.type.food'),
        remark: '',
        amount: 0,
        time: new Date().toISOString().slice(0, 16)
      },
      expenses: [],
      chartInstance: null,
      trendChartInstance: null
    };
  },
  async mounted() {
    try {
      console.log('Record组件挂载，开始加载数据和图表');
      await this.loadExpenses();
      await this.updateChart();
    } catch (error) {
      console.error('Record组件初始化失败:', error);
    }
  },
  // 添加清理函数
  beforeUnmount() {
    console.log('Record组件卸载，清理图表实例');
    this.destroyCharts();
  },
  methods: {
    // 单独的图表销毁方法
    destroyCharts() {
      if (this.chartInstance) {
        console.log('销毁饼图实例');
        this.chartInstance.destroy();
        this.chartInstance = null;
      }
      if (this.trendChartInstance) {
        console.log('销毁折线图实例');
        this.trendChartInstance.destroy();
        this.trendChartInstance = null;
      }
    },
    async addExpense() {
      try {
        console.log('添加消费记录:', this.newExpense);
        this.loading.form = true;
        await ExpenseAPI.addExpense(this.newExpense);
        this.newExpense = { 
          ...this.newExpense, 
          remark: '', 
          amount: 0 
        };
        await this.loadExpenses();
        await this.updateChart();
      } catch (error) {
        console.error('添加记录失败:', error);
      } finally {
        this.loading.form = false;
      }
    },
    async loadExpenses() {
      this.loading.form = true;
      try {
        console.log('加载消费数据');
        const response = await ExpenseAPI.getExpenses();
        if (response.error) {
          throw new Error(response.error);
        }
        this.expenses = response.data || [];
        console.log('消费数据加载成功，记录数:', this.expenses.length);
      } catch (error) {
        console.error('获取消费数据失败:', error);
        this.expenses = [];
      } finally {
        this.loading.form = false;
      }
    },
    async updateChart() {
      console.log('更新图表开始');
      this.loading.chart = true;
      try {
        // 首先销毁所有图表实例
        this.destroyCharts();
        
        const response = await ExpenseAPI.getStatistics();
        const statistics = response.data || [];
        
        // 确保DOM元素存在
        if (!this.$refs.ratioChart) {
          console.error('饼图DOM元素不存在');
          return;
        }
        
        if (!this.$refs.trendChart) {
          console.error('趋势图DOM元素不存在');
          return;
        }
        
        console.log('开始创建饼图');
        this.chartInstance = new Chart(this.$refs.ratioChart, {
          type: 'doughnut',
          data: {
            labels: (statistics || []).map(s => s.type),
            datasets: [{
              data: statistics.map(s => s.ratio),
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: this.TextConfig.chart.title }
            },
            // 防止图表调整大小触发重绘
            maintainAspectRatio: false
          }
        });
        console.log('饼图创建成功');
    
        console.log('开始创建折线图');
        this.trendChartInstance = new Chart(this.$refs.trendChart, {
          type: 'line',
          data: {
            labels: (this.expenses || []).map(e => e.time?.slice(0,10) || ''),
            datasets: [{
              label: this.t('expense.chart.trendLabel'),
              data: this.expenses.map(e => e.amount),
              borderColor: '#4BC0C0',
              tension: 0.1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: this.TextConfig.chart.trendTitle
              }
            },
            // 防止图表调整大小触发重绘
            maintainAspectRatio: false
          }
        });
        console.log('折线图创建成功');
      } catch (error) {
        console.error('图表更新失败:', error);
        // 确保在错误情况下也能重置加载状态
        this.loading.chart = false;
        // 销毁可能部分创建的图表实例
        this.destroyCharts();
      } finally {
        this.loading.chart = false;
        console.log('图表更新完成');
      }
    }
  }
};

</script>