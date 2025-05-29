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
   * 初始化数据获取
   */
  const fetchData = async () => {
    try {
      const res = await ExpenseAPI.getExpenses()
      if (res.error) throw new Error(res.error)
      expenses.value = res.data
      calculateCategoryStats()
    } catch (error) {
      console.error('获取消费数据失败:', error.message || error);
      error.value = error.message || error
      // 保持图表数据结构避免组件报错
      chartData.value = {
        labels: [],
        datasets: [{
          label: t('expense.chart.trendLabel'),
          data: [],
          borderColor: '#4BC0C0',
          tension: 0.1
        }]
      }
    }
  }

  /**
   * 计算分类消费统计
   */
  const calculateCategoryStats = () => {
    const stats = {}
    expenses.value.forEach(expense => {
      if (!stats[expense.type]) stats[expense.type] = 0
      stats[expense.type] += expense.amount
    })
    categoryStats.value = stats
  }

  let checkInterval = null;

  // 初始化数据获取并设置定时检查
  onMounted(() => {
    fetchData();
    // 每15秒检查一次远端数据更新
    checkInterval = setInterval(fetchData, 15000);
  });

  // 组件卸载时清除定时器
  onUnmounted(() => {
    if (checkInterval) clearInterval(checkInterval);
  });

  // 生成图表数据（包含labels和datasets）
  const chartData = ref({ labels: [], datasets: [{ label: t('expense.chart.trendLabel'), data: [], borderColor: '#4BC0C0', tension: 0.1 }] })

  // 更新图表数据
  const updateChartData = () => {
    chartData.value.labels = expenses.value.map(e => e.time?.slice(0,10) || '')
    chartData.value.datasets = [{
      label: t('expense.chart.trendLabel'),
      data: expenses.value.map(e => e.amount) || [],
      borderColor: '#4BC0C0',
      tension: 0.1
    }]
  }

  // 在数据更新时同步更新图表数据
  watch(expenses, () => {
    updateChartData()
  }, { immediate: true })

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