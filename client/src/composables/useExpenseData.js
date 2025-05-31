/*
* @file useExpenseData.js
* @package 家庭记账本
* @module 组合式函数
* @description 消费数据管理组合式函数，负责获取和处理消费记录数据
* @author 开发者
* @version 1.0
*/

import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ExpenseAPI } from '@/api/expenses'

/**
* 获取并管理消费数据的组合式函数
* @returns {Object} 包含消费数据和图表数据的响应式对象
*/
export function useExpenseData() {
  const { t } = useI18n()

  /**
   * 消费记录列表（响应式数据）
   * @type {import('vue').Ref<Array>}
   */
  const expenses = ref([])

  /**
   * 分类消费统计数据（响应式数据）
   * @type {import('vue').Ref<Object>}
   */
  const categoryStats = ref({})

  /**
   * 数据获取错误信息（响应式数据）
   * @type {import('vue').Ref<string>}
   */
  const error = ref('')

  /**
   * 操作成功提示信息（响应式数据）
   * @type {import('vue').Ref<string>}
   */
  const successMessage = ref('')

  /**
   * 操作错误提示信息（响应式数据）
   * @type {import('vue').Ref<string>}
   */
  const errorMessage = ref('')

  /**
   * 获取消费数据
   * @param {boolean} forceRefresh - 是否强制刷新数据（目前未在外部使用，但保留）
   */
  const fetchData = async (forceRefresh = false) => {
    console.log('useExpenseData: fetchData called.');
    try {
      const res = await ExpenseAPI.getExpenses();
      // 确保 res.data 是一个数组，即使 API 返回 null 或 undefined
      const newData = Array.isArray(res?.data) ? res.data : [];
     
      // 只有当数据内容实际发生变化时才更新 expenses.value
      // 避免不必要的响应式触发
      if (JSON.stringify(expenses.value) !== JSON.stringify(newData)) {
        expenses.value = newData;
        console.log('useExpenseData: expenses.value updated (content changed).');
      } else {
        console.log('useExpenseData: expenses.value content is identical, no update needed.');
      }
     
      calculateCategoryStats();
      error.value = ''; // 清除之前的错误信息
    } catch (err) {
      console.error('useExpenseData: 获取消费数据失败:', err.message || err);
      error.value = t('error.fetchExpensesFailed', { error: err.message || err });
      // 在错误情况下，确保 expenses 仍然是一个空数组，避免后续操作报错
      if (!Array.isArray(expenses.value)) {
        expenses.value = [];
      }
      calculateCategoryStats(); // 即使出错也尝试计算一次，确保结构完整
    }
  }

  /**
   * 计算分类消费统计
   */
  const calculateCategoryStats = () => {
    const stats = {};
    // 确保 expenses.value 是一个数组
    if (Array.isArray(expenses.value)) {
      expenses.value.forEach(expense => {
        if (expense && typeof expense.type === 'string' && typeof expense.amount === 'number') {
          if (!stats[expense.type]) stats[expense.type] = 0;
          stats[expense.type] += expense.amount;
        } else {
          console.warn('useExpenseData: Skipping invalid expense item:', expense);
        }
      });
    } else {
      console.warn('useExpenseData: expenses.value is not an array, cannot calculate category stats.');
    }
    categoryStats.value = stats;
  }

  // 生成图表数据（包含labels和datasets）
  const chartData = ref({ labels: [], datasets: [{ label: t('expense.chart.trendLabel'), data: [], borderColor: '#4BC0C0', tension: 0.1 }] })

  /**
   * 更新图表数据
   */
  const updateChartData = () => {
    // 确保 expenses.value 是一个数组
    if (Array.isArray(expenses.value)) {
      chartData.value.labels = expenses.value.map(e => e.time?.slice(0,10) || '');
      chartData.value.datasets = [{
        label: t('expense.chart.trendLabel'),
        data: expenses.value.map(e => e.amount) || [],
        borderColor: '#4BC0C0',
        tension: 0.1
      }];
    } else {
      console.warn('useExpenseData: expenses.value is not an array, cannot update chart data.');
      chartData.value = { labels: [], datasets: [{ label: t('expense.chart.trendLabel'), data: [], borderColor: '#4BC0C0', tension: 0.1 }] };
    }
  }

  // 在数据更新时同步更新图表数据
  watch(expenses, () => {
    console.log('useExpenseData: expenses ref changed, updating chart data.');
    updateChartData();
  }, { immediate: true, deep: true }) // deep: true 确保能检测到 expenses 数组内容的深层变化

  // 初始化数据获取 (移除 setInterval)
  onMounted(() => {
    fetchData();
  });

  // 组件卸载时不需要清除定时器，因为已经移除了 setInterval
  onUnmounted(() => {
    // 之前这里有 clearInterval(checkInterval); 现在可以移除
  });

  return {
    expenses,
    categoryStats,
    chartData,
    error,
    fetchData,
    successMessage,
    errorMessage
  }
}
