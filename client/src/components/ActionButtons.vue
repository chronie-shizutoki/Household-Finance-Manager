<!-- 操作按钮组件 - 包含添加记录按钮 -->
<template>
  <div class="action-buttons">
    <button @click="onAdd" class="btn btn-primary">{{ $t('app.addRecord') }}</button>
  </div>
</template>

<script setup>
const props = defineProps({  onAdd: Function })
</script>

<style scoped>
.action-buttons {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}


</style>