<template>
  <div class="chart-controls">
    <div class="month-control">
      <button class="btn btn-scale prev-btn" @click="$emit('prev-month')">&lt;</button>
      <span class="month-label">{{ monthLabel }}</span>
      <button class="btn btn-scale next-btn" @click="$emit('next-month')">&gt;</button>
    </div>
    <div class="chart-toggle">
      <button
        class="btn btn-scale chart-btn"
        :class="{active: chartType===1}"
        @click="$emit('set-chart-type', 1)"
      >
        {{ $t('home.dailyTrend') }}
      </button>
      <button
        class="btn btn-scale chart-btn"
        :class="{active: chartType===2}"
        @click="$emit('set-chart-type', 2)"
      >
        {{ $t('home.dailyDescending') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  currentMonth: String,
  monthLabel: String,
  chartType: Number
})
</script>

<style scoped>
@import '@/styles/home.css';
</style>