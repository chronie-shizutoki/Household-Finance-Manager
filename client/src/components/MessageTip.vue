<!-- 消息提示组件 - 用于统一展示成功/错误提示 -->
<template>
  <Transition name="fade">
    <div v-if="message" :class="['message-tip', type]" class="fade">
      {{ message }}
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

// 正确使用defineProps声明props
const props = defineProps({  message: String,  type: {    type: String,    default: 'success',    validator: val => ['success', 'error'].includes(val)  }})
// 3秒后自动关闭
let timer = null;
watch(() => props.message, (newVal) => {
  console.log('MessageTip 接收到的message值：', newVal);
  if (newVal) {
    console.log('触发新消息，清除旧定时器');
    // 清除之前的定时器，避免重复触发
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      console.log('定时器触发，清空message');
      emit('update:message', '');
      timer = null; // 重置定时器ID
    }, 3000);
    console.log('新定时器已设置，ID：', timer);
  }
});

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) clearTimeout(timer);
})
</script>

<style scoped>
/* 已迁移至common.css，仅保留作用域标识 */
</style>