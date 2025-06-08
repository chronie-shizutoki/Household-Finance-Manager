// src/composables/useExpenseData.js
import { ref, computed } from 'vue';
import { ExpenseAPI } from '@/api/expenses';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { useChartData } from './useChartData'; // Import the updated composition function

/**
 * A simple deep equality comparison function
 * Used to check if data fetched from the API has actually changed
 * @param {any} a - The first value to compare
 * @param {any} b - The second value to compare
 * @returns {boolean} Returns true if the two values are deeply equal, otherwise false
 */
const deepEqual = (a, b) => {
  if (a === b) return true; // If it's the same reference or primitive types are equal

  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
};

/**
 * Composition function for handling expense data fetching, management, and statistics.
 * @returns {Object} An object containing expense data, statistics, chart data, loading status, and error information.
 */
export function useExpenseData() {
  const { t, locale } = useI18n(); // Destructure locale from useI18n

  const expenses = ref([]); // All expense records
  const isLoading = ref(false);
  const error = ref(null);
  const errorMessage = ref('');
  const successMessage = ref('');
  const lastUpdateTime = ref(null);

  // Initialize chartCurrentMonth ref. This will be passed to useChartData.
  // It's crucial that this ref's value is updated only when necessary (e.g., via UI interaction).
  const chartCurrentMonth = ref(dayjs().format('YYYY-MM'));

  // Use the useChartData composition function to handle chart data and month filtering
  // Pass expenses ref, chartCurrentMonth ref, and locale ref
  const {
    chart1Data,
    chart2Data,
    currentMonth, // This is the currentMonth managed by useChartData
    monthLabel,
    prevMonth,
    nextMonth,
    setChartType,
    chartType
  } = useChartData(expenses, chartCurrentMonth, locale); // Pass locale here

  // Computed property: Expense statistics by category
  const categoryStats = computed(() => {
    const stats = {};
    expenses.value.forEach(expense => {
      const type = t(`expense.type.${expense.type}`) || expense.type; // Use translation
      if (!stats[type]) {
        stats[type] = 0;
      }
      stats[type] += expense.amount;
    });
    return Object.entries(stats).map(([type, amount]) => ({ type, amount }));
  });

  // Fetch data from the backend
  const fetchData = async (forceRefresh = false) => {
    console.log('useExpenseData: fetchData called.');
    if (isLoading.value && !forceRefresh) {
      console.log('useExpenseData: Already loading and not forced refresh, skipping.');
      return;
    }
    isLoading.value = true;
    error.value = null;
    errorMessage.value = '';

    try {
      const newData = await ExpenseAPI.getExpenses();
      
      // Only update the ref if the content of the new data is different from the current data
      if (!deepEqual(expenses.value, newData)) {
        console.log('useExpenseData: expenses ref changed, updating chart data.');
        expenses.value = newData;
        lastUpdateTime.value = new Date();
      } else {
        console.log('useExpenseData: expenses.value content is identical, no update needed.');
      }
    } catch (err) {
      console.error('Failed to fetch expense data:', err);
      error.value = err;
      errorMessage.value = t('error.fetchExpensesFailed', { error: err.message });
    } finally {
      isLoading.value = false;
    }
  };

  return {
    expenses,
    categoryStats,
    chart1Data,       // Expose chart1Data and chart2Data
    chart2Data,
    currentMonth,     // Expose currentMonth and its navigation methods
    monthLabel,
    prevMonth,
    nextMonth,
    setChartType,
    chartType,
    fetchData,
    isLoading,
    error,
    errorMessage,
    successMessage,
    lastUpdateTime,
  };
}

