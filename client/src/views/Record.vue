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
      <!-- 原有图表结构 -->
    </div>
  </div>
</template>

<script>
import { TextConfig } from '@/config/textConfig';
import { addExpenseApi, getExpensesApi, getStatisticsApi } from '@/api/expense';
import { Chart, ArcElement, Tooltip, Legend, LineController, LinearScale, CategoryScale, PointElement, LineElement } from 'chart.js';
import axios from 'axios';
import FileSaver from 'file-saver';

Chart.register(ArcElement, Tooltip, Legend, LineController, LinearScale, CategoryScale, PointElement, LineElement);

export default {
  data() {
    return {
      TextConfig,
      expenseTypes: [i18n.t('expense.type.food'), i18n.t('expense.type.shopping'), i18n.t('expense.type.transport'), i18n.t('expense.type.entertainment'), i18n.t('expense.type.other')],  // 可扩展的支出类型
      newExpense: {
        type: i18n.t('expense.type.food'),
        itemName: '',
        amount: 0,
        time: new Date().toISOString().slice(0, 16)
      },
      expenses: [],
      chartInstance: null,
      trendChartInstance: null
    };
  },
  async mounted() {
    await this.loadExpenses();
    await this.updateChart();
  },
  methods: {
    async mounted() {
      this.Chart = (await import('chart.js/auto')).default;
      await this.loadExpenses();
      await this.updateChart();
    },
    async addExpense() {
      await addExpenseApi(this.newExpense);
      this.newExpense = { ...this.newExpense, itemName: '', amount: 0 };
      await this.loadExpenses();
      await this.updateChart();
    },
    async loadExpenses() {
      this.loading.form = true;
      try {
        this.expenses = await getExpensesApi();
      } finally {
        this.loading.form = false;
      }
    },
    async updateChart() {
      this.loading.chart = true;
      try {
        const statistics = await getStatisticsApi();
        
        // 销毁旧图表实例
        if (this.chartInstance) this.chartInstance.destroy();
        
        // 初始化消费占比图表
        // 销毁所有图表实例
        if (this.chartInstance) this.chartInstance.destroy();
        if (this.trendChartInstance) this.trendChartInstance.destroy();
        
        this.chartInstance = new this.Chart(this.$refs.ratioChart, {
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
            }
          }
        });
    
        // 初始化消费趋势折线图
        this.trendChartInstance = new Chart(this.$refs.trendChart, {
          type: 'line',
          data: {
            labels: (this.expenses || []).map(e => e.time?.slice(0,10) || ''),
            datasets: [{
              label: i18n.t('expense.chart.trendLabel'),
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
            }
          }
        });
      } finally {
        this.loading.chart = false;
      }
    }
  }
};

</script>