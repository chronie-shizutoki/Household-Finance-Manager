<template>
  <Transition name="fade">
    <div v-if="message" :class="['message-tip', type, theme]">
      {{ message }}
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, onUnmounted } from 'vue';

// 使用 defineProps 声明组件接收的属性
const props = defineProps({
  // 消息内容，字符串类型
  message: String,
  // 消息类型，可以是 'success' 或 'error'，默认为 'success'
  type: {
    type: String,
    default: 'success',
    validator: val => ['success', 'error'].includes(val)
  },
  // 主题类型，可以是 'light' 或 'dark'，默认跟随父组件主题（强制浅色）
  theme: {
    type: String,
    default: 'light', // 明确设置默认值为浅色，避免父组件未传递时使用其他值
    validator: val => ['light', 'dark'].includes(val)
  }
});

// 使用 defineEmits 声明组件可以发出的事件
// 'update:message' 事件用于通知父组件更新 message 属性
const emit = defineEmits(['update:message']);

// 用于存储定时器 ID
let timer = null;

// 监听 props.message 的变化
watch(() => props.message, (newVal) => {
  // 如果有新消息内容
  if (newVal) {
    // 如果存在旧的定时器，先清除它，避免重复触发
    if (timer) {
      clearTimeout(timer);
    }
    // 设置新的定时器，3秒后清空消息
    timer = setTimeout(() => {
      // 触发 'update:message' 事件，将消息内容设置为空字符串
      emit('update:message', '');
      // 定时器触发后，将 timer 重置为 null
      timer = null;
    }, 3000);
  } else {
    // 如果 message 变为空，立即清除任何正在运行的定时器
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }
}, { immediate: true }); // immediate: true 确保在组件初始化时如果 message 已经有值，也会立即执行一次 watch

// 组件卸载时清除定时器，防止内存泄漏
onUnmounted(() => {
  if (timer) {
    clearTimeout(timer);
  }
});
</script>

<style scoped>
@import '../styles/message-tip.css';
</style>

