import { ref, computed, watch, onBeforeUnmount, toRaw } from 'vue'
import dayjs from 'dayjs'
import { formatMonthLabelByLocale } from '@/utils/dateFormatter'

/**
 * 健壮的深层相等比较函数
 * 适用于原始类型、数组和普通对象。
 * 在比较前，可以使用Vue的`toRaw`来获取原始对象，以避免响应式代理的影响。
 * @param {any} a - 第一个要比较的值
 * @param {any} b - 第二个要比较的值
 * @returns {boolean} 如果两个值深层相等则返回 true，否则返回 false
 */
const deepEqual = (a, b) => {
  // 对比原始值或同一个引用
  if (a === b) return true;

  // 检查 null 或非对象类型
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }

  // 确保比较的是原始对象，剥离Vue的响应式代理
  const rawA = toRaw(a);
  const rawB = toRaw(b);

  if (rawA === rawB) return true; // 再次检查是否在剥离代理后变为同一引用

  // 比较日期对象
  if (rawA instanceof Date && rawB instanceof Date) {
    return rawA.getTime() === rawB.getTime();
  }

  // 比较数组
  if (Array.isArray(rawA)) {
    if (!Array.isArray(rawB) || rawA.length !== rawB.length) return false;
    for (let i = 0; i < rawA.length; i++) {
      if (!deepEqual(rawA[i], rawB[i])) return false;
    }
    return true;
  }

  // 比较 Map/Set
  if (rawA instanceof Map && rawB instanceof Map) {
    if (rawA.size !== rawB.size) return false;
    for (let [key, valA] of rawA) {
      if (!rawB.has(key) || !deepEqual(valA, rawB.get(key))) return false;
    }
    return true;
  }
  if (rawA instanceof Set && rawB instanceof Set) {
    if (rawA.size !== rawB.size) return false;
    for (let valA of rawA) {
      if (!rawB.has(valA)) return false;
    }
    return true;
  }

  // 比较普通对象
  const keysA = Object.keys(rawA);
  const keysB = Object.keys(rawB);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(rawB, key) || !deepEqual(rawA[key], rawB[key])) {
      return false;
    }
  }

  return true;
};


export function useChartData(expenses, locale) {
  const currentMonth = ref(dayjs().format('YYYY-MM'))
  const chartType = ref(1)

  const monthLabel = computed(() => {
    return formatMonthLabelByLocale(currentMonth.value, locale.value)
  })

  const filteredMonthExpenses = ref([]);
  const chart1Data = ref({ labels: [], datasets: [] });
  const chart2Data = ref({ labels: [], datasets: [] });

  const calculateChart1Data = (data) => {
    if (!data || data.length === 0) return { labels: [], datasets: [] }
    const dailyData = new Map()
    data.forEach(expense => {
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

  const calculateChart2Data = (data) => {
    if (!data || data.length === 0) return { labels: [], datasets: [] }
    const dailySum = new Map()
    data.forEach(expense => {
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

  watch([expenses, currentMonth], ([newExpenses, newMonth]) => {
    console.log('useChartData Debug: watch([expenses, currentMonth]) triggered.');
    const newFiltered = (newExpenses || []).filter(expense =>
      dayjs(expense.time).isSame(newMonth, 'month')
    );

    // 获取原始数据进行比较，避免响应式代理影响
    const currentFilteredRaw = toRaw(filteredMonthExpenses.value);
    const newFilteredRaw = toRaw(newFiltered);

    // 打印出完整的字符串化内容，以便我们对比差异
    console.log("useChartData Debug: OLD FILTERED RAW:", JSON.stringify(currentFilteredRaw));
    console.log("useChartData Debug: NEW FILTERED RAW:", JSON.stringify(newFilteredRaw));


    if (!deepEqual(currentFilteredRaw, newFilteredRaw)) {
      console.log('useChartData Debug: filteredMonthExpenses content changed, updating ref.');
      filteredMonthExpenses.value = newFiltered; // 更新 ref，触发下游 watch
    } else {
      console.log('useChartData Debug: filteredMonthExpenses content identical, keeping same ref.');
    }
  }, { immediate: true, deep: true });

  watch(filteredMonthExpenses, (newFilteredExpenses, oldFilteredExpenses) => {
    const newRef = newFilteredExpenses === oldFilteredExpenses ? 'SAME_REF' : 'DIFFERENT_REF';
    const contentChanged = !deepEqual(toRaw(newFilteredExpenses), toRaw(oldFilteredExpenses)); // 确保比较原始数据

    console.log(`useChartData Debug: filteredMonthExpenses changed. Ref: ${newRef}, Content Changed: ${contentChanged}.`);

    const newChart1CalculatedData = calculateChart1Data(newFilteredExpenses);
    const newChart2CalculatedData = calculateChart2Data(newFilteredExpenses);

    if (!deepEqual(toRaw(chart1Data.value), toRaw(newChart1CalculatedData))) { // 确保比较原始数据
      console.log('useChartData Debug: chart1Data content changed, updating ref.');
      chart1Data.value = newChart1CalculatedData;
    } else {
      console.log('useChartData Debug: chart1Data content identical, keeping same ref.');
    }

    if (!deepEqual(toRaw(chart2Data.value), toRaw(newChart2CalculatedData))) { // 确保比较原始数据
      console.log('useChartData Debug: chart2Data content changed, updating ref.');
      chart2Data.value = newChart2CalculatedData;
    } else {
      console.log('useChartData Debug: chart2Data content identical, keeping same ref.');
    }
  });

  watch(chart1Data, (newVal, oldVal) => {
    const newRef = newVal === oldVal ? 'SAME_REF' : 'DIFFERENT_REF';
    const contentChanged = !deepEqual(toRaw(newVal), toRaw(oldVal)); // 确保比较原始数据
    console.log(`useChartData Debug: chart1Data ref changed. Ref: ${newRef}, Content Changed: ${contentChanged}.`);
  }, { deep: true });


  onBeforeUnmount(() => {
    // 清理工作
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

