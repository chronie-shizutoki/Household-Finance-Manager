<template>
  <div class="cache-control">
    <button @click="clearAllCache">清除所有缓存</button>
    <div v-if="cacheStats" class="stats">
      <p>总缓存项: {{ cacheStats.total }}</p>
      <p>有效缓存: {{ cacheStats.valid }}</p>
      <p>过期缓存: {{ cacheStats.expired }}</p>
    </div>
  </div>
</template>

<script setup>
import CacheStore from '@/utils/CacheStore';
import { ref, onMounted } from 'vue';

const cache = new CacheStore('global-cache');
const cacheStats = ref(null);

const clearAllCache = async () => {
  await cache.clear();
  alert('缓存已全部清除');
  getCacheStats();
};

const getCacheStats = async () => {
  const stats = await cache.getStats();
  cacheStats.value = stats;
};

onMounted(() => {
  getCacheStats();
});
</script>

<style scoped>
.cache-control {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}
button {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #2563eb;
}
.stats {
  margin-top: 1rem;
}
</style>