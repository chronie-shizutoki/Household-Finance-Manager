<template>
  <div class="container fade">
    <h1 class="title">{{ TextConfig.form.title }}</h1>
    
    <!-- 表单部分 -->
    <form @submit.prevent="addExpense" class="form-card scale-in">
      <div class="skeleton-loader" v-if="loading.form"></div>
      <div v-else class="form-content">
        <div class="form-group">
          <label for="expense-type">{{ TextConfig.form.typeLabel }}</label>
          <select v-model="newExpense.type" id="expense-type" class="form-control">
            <option v-for="type in expenseTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="expense-amount">{{ TextConfig.form.amountLabel }}</label>
          <input 
            type="number" 
            v-model.number="newExpense.amount" 
            id="expense-amount" 
            class="form-control" 
            min="0" 
            step="0.01" 
            placeholder="{{ TextConfig.form.amountPlaceholder }}"
          >
        </div>
        
        <div class="form-group">
          <label for="expense-remark">{{ TextConfig.form.remarkLabel }}</label>
          <input 
            type="text" 
            v-model="newExpense.remark" 
            id="expense-remark" 
            class="form-control" 
            placeholder="{{ TextConfig.form.remarkPlaceholder }}"
          >
        </div>
        
        <div class="form-group">
          <label for="expense-time">{{ TextConfig.form.timeLabel }}</label>
          <input 
            type="datetime-local" 
            v-model="newExpense.time" 
            id="expense-time" 
            class="form-control"
          >
        </div>
        
        <button type="submit" class="btn btn-primary" :disabled="loading.form">
          {{ loading.form ? TextConfig.form.submitting : TextConfig.form.submit }}
        </button>
      </div>
    </form>

    <!-- 图表部分 -->
    <div class="charts-wrapper">
      <!-- 消费占比图表 (饼图) -->
      <PieChart
        :chart-data="pieChartData"
        :title="TextConfig.chart.title"
        :loading="loading.chart"
        :show-legend="true"
        width="100%"
        height="300"
        ref="pieChartRef"
      />
      
      <!-- 消费趋势图表 (折线图) -->
      <LineChart
        :chart-data="lineChartData"
        :title="TextConfig.chart.trendTitle"
        :loading="loading.chart"
        :fill="true"
        :tension="0.4"
        :show-grid="true"
        width="100%"
        height="300"
        ref="lineChartRef"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { createTextConfig } from '@/config/textConfig';
import { ExpenseAPI } from '@/api/expenses';
import { useI18n } from 'vue-i18n';
import PieChart from '@/components/charts/PieChart.vue';
import LineChart from '@/components/charts/LineChart.vue';

export default {
  components: {
    PieChart,
    LineChart
  },
  setup() {
    const { t } = useI18n();
    
    // 响应式数据
    const loading = ref({ form: false, chart: false });
    const expenses = ref([]);
    const statistics = ref([]);
    const TextConfig = ref(createTextConfig(t));
    
    // 图表组件引用
    const pieChartRef = ref(null);
    const lineChartRef = ref(null);
    
    // 表单数据
    const newExpense = ref({
      type: t('expense.type.food'),
      remark: '',
      amount: 0,
      time: new Date().toISOString().slice(0, 16)
    });
    
    const expenseTypes = ref([
      t('expense.type.food'), 
      t('expense.type.shopping'), 
      t('expense.type.transport'), 
      t('expense.type.entertainment'), 
      t('expense.type.other')
    ]);
    
    // 饼图数据
    const pieChartData = computed(() => ({
      labels: statistics.value.map(s => s.type),
      datasets: [{
        label: t('chart.categoryExpense'),
        data: statistics.value.map(s => s.ratio)
      }]
    }));
    
    // 折线图数据
    const lineChartData = computed(() => {
      // 按日期分组并计算每日总金额
      const dailyData = {};
      expenses.value.forEach(expense => {
        if (!expense.time) return;
        
        const date = expense.time.slice(0, 10);
        if (!dailyData[date]) {
          dailyData[date] = 0;
        }
        dailyData[date] += expense.amount;
      });
      
      // 转换为图表数据格式
      const sortedDates = Object.keys(dailyData).sort();
      return {
        labels: sortedDates,
        datasets: [{
          label: t('expense.chart.trendLabel'),
          data: sortedDates.map(date => dailyData[date])
        }]
      };
    });
    
    // 加载消费数据
    const loadExpenses = async () => {
      loading.value.form = true;
      try {
        console.log('加载消费数据');
        const response = await ExpenseAPI.getExpenses();
        if (response.error) {
          throw new Error(response.error);
        }
        expenses.value = response.data || [];
        console.log('消费数据加载成功，记录数:', expenses.value.length);
      } catch (error) {
        console.error('获取消费数据失败:', error);
        expenses.value = [];
      } finally {
        loading.value.form = false;
      }
    };
    
    // 加载统计数据
    const loadStatistics = async () => {
      loading.value.chart = true;
      try {
        console.log('加载统计数据');
        const response = await ExpenseAPI.getStatistics();
        if (response.error) {
          throw new Error(response.error);
        }
        statistics.value = response.data || [];
        console.log('统计数据加载成功');
      } catch (error) {
        console.error('获取统计数据失败:', error);
        statistics.value = [];
      } finally {
        loading.value.chart = false;
      }
    };
    
    // 添加消费记录
    const addExpense = async () => {
      try {
        console.log('添加消费记录:', newExpense.value);
        loading.value.form = true;
        await ExpenseAPI.addExpense(newExpense.value);
        
        // 重置表单
        newExpense.value = {
          ...newExpense.value,
          remark: '',
          amount: 0
        };
        
        // 重新加载数据
        await Promise.all([loadExpenses(), loadStatistics()]);
        
        // 刷新图表
        refreshCharts();
      } catch (error) {
        console.error('添加记录失败:', error);
      } finally {
        loading.value.form = false;
      }
    };
    
    // 刷新图表
    const refreshCharts = () => {
      if (pieChartRef.value) {
        pieChartRef.value.refreshChart();
      }
      if (lineChartRef.value) {
        lineChartRef.value.refreshChart();
      }
    };
    
    // 初始化
    const initialize = async () => {
      try {
        console.log('Record组件挂载，开始加载数据');
        await Promise.all([loadExpenses(), loadStatistics()]);
      } catch (error) {
        console.error('Record组件初始化失败:', error);
      }
    };
    
    // 组件挂载时初始化
    initialize();
    
    return {
      t,
      TextConfig,
      loading,
      newExpense,
      expenseTypes,
      expenses,
      statistics,
      pieChartData,
      lineChartData,
      pieChartRef,
      lineChartRef,
      addExpense,
      loadExpenses,
      loadStatistics,
      refreshCharts
    };
  }
};

</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.form-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-control {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #4BC0C0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #4BC0C0;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #45a8a8;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.charts-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .charts-wrapper {
    grid-template-columns: 1fr;
  }
}

/* 骨架屏样式 */
.skeleton-loader {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.skeleton-loader::before,
.skeleton-loader::after,
.skeleton-loader > div {
  content: '';
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  height: 2rem;
  border-radius: 8px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-in {
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>