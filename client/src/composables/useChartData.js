import { ref, computed, watchEffect, onBeforeUnmount } from 'vue'
import dayjs from 'dayjs'
import CacheStore from '@/utils/CacheStore'
import { formatMonthLabelByLocale } from '@/utils/dateFormatter'

export function useChartData(csvExpenses, locale) {
  const currentMonth = ref(dayjs().format('YYYY-MM'))
  const chartType = ref(1)
  const chart1Cache = ref(null)
  const chart2Cache = ref(null)
  let chartUpdateTimer = ref(null)
  const isChartUpdating = ref(false)

  const monthLabel = computed(() => {
    return formatMonthLabelByLocale(currentMonth.value, locale.value)
  })

  const calculateChart1Data = (expenses) => {
    if (!expenses || expenses.length === 0) return { labels: [], datasets: [] }
    const dailyData = new Map()
    expenses.forEach(expense => {
      const day = dayjs(expense.time).format('YYYY-MM-DD')
      dailyData.set(day, (dailyData.get(day) || 0) + expense.amount)
    })
    const sortedDays = Array.from(dailyData.keys()).sort()
    return {
      labels: sortedDays.map(day => dayjs(day).format('MM-DD')),
      datasets: [{
        label: '每日趋势',
        data: sortedDays.map(day => dailyData.get(day)),
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#4BC0C0',
        pointBorderColor: '#fff',
        pointHoverBorderColor: '#fff'
      }]
    }
  }

  const calculateChart2Data = (expenses) => {
    if (!expenses || expenses.length === 0) return { labels: [], datasets: [] }
    const dailySum = new Map()
    expenses.forEach(expense => {
      const day = dayjs(expense.time).format('YYYY-MM-DD')
      dailySum.set(day, (dailySum.get(day) || 0) + expense.amount)
    })
    const sortedEntries = Array.from(dailySum.entries()).sort((a, b) => b[1] - a[1])
    return {
      labels: sortedEntries.map(([day]) => dayjs(day).format('MM-DD')),
      datasets: [{
        label: '每日降序',
        data: sortedEntries.map(([_, value]) => value),
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#FF6384',
        pointBorderColor: '#fff',
        pointHoverBorderColor: '#fff'
      }]
    }
  }

  const updateCharts = async () => {
    if (isChartUpdating.value) return
    isChartUpdating.value = true
    const cacheKey = `chartData:${currentMonth.value}`
    try {
      const cacheStore = new CacheStore()
      const cachedChartData = await cacheStore.get(cacheKey)
      if (cachedChartData && Date.now() - cachedChartData.timestamp < 1800 * 1000) {
        if (JSON.stringify(chart1Cache.value) !== JSON.stringify(cachedChartData.chart1)) {
          chart1Cache.value = cachedChartData.chart1
        }
        if (JSON.stringify(chart2Cache.value) !== JSON.stringify(cachedChartData.chart2)) {
          chart2Cache.value = cachedChartData.chart2
        }
      } else {
        const monthExpenses = csvExpenses.value.filter(expense =>
          dayjs(expense.time).isSame(currentMonth.value, 'month')
        )
        const newChart1Data = calculateChart1Data(monthExpenses)
        const newChart2Data = calculateChart2Data(monthExpenses)
        if (JSON.stringify(chart1Cache.value) !== JSON.stringify(newChart1Data)) {
          chart1Cache.value = newChart1Data
        }
        if (JSON.stringify(chart2Cache.value) !== JSON.stringify(newChart2Data)) {
          chart2Cache.value = newChart2Data
        }
        await cacheStore.set(cacheKey, {
          chart1: chart1Cache.value,
          chart2: chart2Cache.value,
          timestamp: Date.now()
        }, 1800 * 1000)
      }
    } catch (err) {
      console.error('更新图表缓存失败:', err)
    } finally {
      isChartUpdating.value = false
    }
  }

  watchEffect(() => {
    const dependencies = [csvExpenses.value, currentMonth.value, chartType.value]
    if (chartUpdateTimer.value) clearTimeout(chartUpdateTimer.value)
    chartUpdateTimer.value = setTimeout(updateCharts, 500)
  })

  onBeforeUnmount(() => {
    if (chartUpdateTimer.value) clearTimeout(chartUpdateTimer.value)
  })

  const prevMonth = () => {
    currentMonth.value = dayjs(currentMonth.value).subtract(1, 'month').format('YYYY-MM')
  }

  const nextMonth = () => {
    currentMonth.value = dayjs(currentMonth.value).add(1, 'month').format('YYYY-MM')
  }

  const setChartType = (type) => {
    chartType.value = type
  }

  const chart1Data = computed(() => chart1Cache.value || { labels: [], datasets: [] })
  const chart2Data = computed(() => chart2Cache.value || { labels: [], datasets: [] })

  return {
  chart1Data,
  chart2Data,
  currentMonth,
  monthLabel,
  prevMonth,
  nextMonth,
  setChartType,
  chartType
}
}