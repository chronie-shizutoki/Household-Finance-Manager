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
      TextConfig,
      loading: {
        form: false,
        chart: false
      },
      expenseTypes: [t('expense.type.food'), t('expense.type.shopping'), t('expense.type.transport'), t('expense.type.entertainment'), t('expense.type.other')],  // 可扩展的支出类型
      newExpense: {
        type: t('expense.type.food'),
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
    async addExpense() {
      // 表单验证
      if (!this.validateExpenseForm()) {
        return;
      }
      
      try {
        // 格式化数据，确保数值类型正确
        const formattedExpense = {
          ...this.newExpense,
          amount: Number(this.newExpense.amount),
          itemName: this.newExpense.itemName.trim()
        };
        
        const response = await ExpenseAPI.addExpense(formattedExpense);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        // 重置表单
        this.newExpense = { 
          ...this.newExpense, 
          itemName: '', 
          amount: 0 
        };
        
        // 显示成功提示
        this.$notify({
          type: 'success',
          title: '成功',
          message: '记录添加成功'
        });
        
        // 重新加载数据和图表
        await this.loadExpenses();
        await this.updateChart();
      } catch (error) {
        console.error('添加记录失败:', error);
        
        // 显示错误提示
        this.$notify({
          type: 'error',
          title: '添加失败',
          message: `添加记录失败: ${error.message || '请检查输入并重试'}`
        });
      }
    },
    
    // 验证表单
    validateExpenseForm() {
      // 检查金额
      if (!this.newExpense.amount || isNaN(Number(this.newExpense.amount)) || Number(this.newExpense.amount) <= 0) {
        this.$notify({
          type: 'warning',
          title: '验证失败',
          message: '请输入有效的金额（大于0）'
        });
        return false;
      }
      
      // 检查名称
      if (!this.newExpense.itemName || this.newExpense.itemName.trim() === '') {
        this.$notify({
          type: 'warning',
          title: '验证失败',
          message: '请输入消费项目名称'
        });
        return false;
      }
      
      // 检查类型
      if (!this.newExpense.type) {
        this.$notify({
          type: 'warning',
          title: '验证失败',
          message: '请选择消费类型'
        });
        return false;
      }
      
      // 检查日期时间
      if (!this.newExpense.time) {
        this.$notify({
          type: 'warning',
          title: '验证失败',
          message: '请选择消费日期时间'
        });
        return false;
      }
      
      return true;
    },
    async loadExpenses() {
      this.loading.form = true;
      try {
        const response = await ExpenseAPI.getExpenses();
        if (response.error) {
          throw new Error(response.error);
        }
        this.expenses = response.data || [];
      } catch (error) {
        console.error('获取消费数据失败:', error);
        this.expenses = [];
      } finally {
        this.loading.form = false;
      }
    },
    async updateChart() {
      // 防止重复渲染或无限循环
      if (this.loading.chart) {
        console.warn('图表正在加载中，跳过重复渲染');
        return;
      }
      
      this.loading.chart = true;
      try {
        // 获取统计数据
        const response = await ExpenseAPI.getStatistics();
        const statistics = response.data || [];
        
        // 安全销毁旧图表实例，避免重复销毁
        this.safeDestroyCharts();
        
        // 渲染比例图表
        await this.renderRatioChart(statistics);
        
        // 渲染趋势图表
        await this.renderTrendChart();
      } catch (error) {
        console.error('图表渲染失败:', error);
      } finally {
        this.loading.chart = false;
      }
    },
    
    // 安全销毁图表实例
    safeDestroyCharts() {
      if (this.chartInstance) {
        try {
          this.chartInstance.destroy();
        } catch (e) {
          console.warn('销毁比例图表失败:', e);
        }
        this.chartInstance = null;
      }
      
      if (this.trendChartInstance) {
        try {
          this.trendChartInstance.destroy();
        } catch (e) {
          console.warn('销毁趋势图表失败:', e);
        }
        this.trendChartInstance = null;
      }
    },
    
    // 渲染比例图表
    async renderRatioChart(statistics) {
      // 确保DOM元素存在
      if (!this.$refs.ratioChart) {
        console.error('比例图表DOM元素不存在');
        return;
      }
      
      // 确保数据有效
      if (!Array.isArray(statistics) || statistics.length === 0) {
        console.warn('比例图表数据为空或无效');
        return;
      }
      
      // 获取当前主题模式
      const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark' || 
                         (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      // 根据主题调整颜色
      const colors = isDarkMode 
        ? ['#FF7AA2', '#4DB8FF', '#FFE066', '#66D9D9', '#B088FF'] // 暗黑模式下更亮的颜色
        : ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']; // 默认颜色
      
      // 文字颜色
      const textColor = isDarkMode ? '#E0E0E0' : '#333333';
      
      try {
        this.chartInstance = new Chart(this.$refs.ratioChart, {
          type: 'doughnut',
          data: {
            labels: statistics.map(s => s.type),
            datasets: [{
              data: statistics.map(s => s.ratio),
              backgroundColor: colors
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false, // 允许在移动端自适应高度
            plugins: {
              legend: { 
                position: 'top',
                labels: {
                  color: textColor,
                  font: {
                    size: window.innerWidth < 768 ? 10 : 12 // 移动端字体更小
                  }
                }
              },
              title: { 
                display: true, 
                text: this.TextConfig.chart.title,
                color: textColor,
                font: {
                  size: window.innerWidth < 768 ? 14 : 16 // 移动端字体更小
                }
              }
            }
          }
        });
      } catch (error) {
        console.error('渲染比例图表失败:', error);
      }
    },
    
    // 渲染趋势图表
    async renderTrendChart() {
      // 确保DOM元素存在
      if (!this.$refs.trendChart) {
        console.error('趋势图表DOM元素不存在');
        return;
      }
      
      // 确保数据有效
      if (!Array.isArray(this.expenses) || this.expenses.length === 0) {
        console.warn('趋势图表数据为空或无效');
        return;
      }
      
      // 获取当前主题模式
      const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark' || 
                         (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      // 根据主题调整颜色
      const lineColor = isDarkMode ? '#66D9D9' : '#4BC0C0';
      const textColor = isDarkMode ? '#E0E0E0' : '#333333';
      const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      
      try {
        this.trendChartInstance = new Chart(this.$refs.trendChart, {
          type: 'line',
          data: {
            labels: this.expenses.map(e => e.time?.slice(0,10) || ''),
            datasets: [{
              label: this.$t('expense.chart.trendLabel'),
              data: this.expenses.map(e => e.amount),
              borderColor: lineColor,
              backgroundColor: isDarkMode ? 'rgba(75, 192, 192, 0.2)' : 'rgba(75, 192, 192, 0.1)',
              tension: 0.1,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false, // 允许在移动端自适应高度
            plugins: {
              legend: {
                labels: {
                  color: textColor,
                  font: {
                    size: window.innerWidth < 768 ? 10 : 12 // 移动端字体更小
                  }
                }
              },
              title: {
                display: true,
                text: this.TextConfig.chart.trendTitle,
                color: textColor,
                font: {
                  size: window.innerWidth < 768 ? 14 : 16 // 移动端字体更小
                }
              }
            },
            scales: {
              x: {
                ticks: {
                  color: textColor,
                  maxRotation: 45,
                  minRotation: 45,
                  font: {
                    size: window.innerWidth < 768 ? 8 : 10 // 移动端字体更小
                  }
                },
                grid: {
                  color: gridColor
                }
              },
              y: {
                ticks: {
                  color: textColor,
                  font: {
                    size: window.innerWidth < 768 ? 8 : 10 // 移动端字体更小
                  }
                },
                grid: {
                  color: gridColor
                }
              }
            }
          }
        });
      } catch (error) {
        console.error('渲染趋势图表失败:', error);
      }
    }
  }
};

</script>