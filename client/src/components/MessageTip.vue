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
/* 消息提示的基础样式 */
.message-tip {
  position: fixed; /* 固定定位，使其浮动在页面上方 */
  top: 20px; /* 距离顶部 20px */
  left: 50%; /* 水平居中 */
  transform: translateX(-50%); /* 精确水平居中 */
  padding: 12px 20px; /* 内边距 */
  border-radius: 8px; /* 圆角 */
  font-size: 16px; /* 字体大小 */
  font-weight: 500; /* 字体粗细 */
  z-index: 9999; /* 层级，确保在所有其他内容之上 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  transition: all 0.3s ease-in-out; /* 所有属性的过渡效果 */
  text-align: center; /* 文本居中 */
  max-width: 90vw; /* 最大宽度为视口宽度的90%，防止溢出 */
  min-width: 200px; /* 最小宽度 */
  box-sizing: border-box; /* 边框盒模型，确保padding和border包含在宽度内 */
  word-wrap: break-word; /* 允许长单词或URL地址在必要时换行 */
}

/* 浅色模式成功消息样式 */
.message-tip.light.success {
  background-color: #e6f7d9; /* 浅绿色背景 */
  color: #389e0d; /* 深绿色文本 */
  border: 1px solid #b7eb8f; /* 绿色边框 */
}

/* 浅色模式错误消息样式 */
.message-tip.light.error {
  background-color: #fff1f0; /* 浅红色背景 */
  color: #cf1322; /* 深红色文本 */
  border: 1px solid #ffa39e; /* 红色边框 */
}

/* 深色模式成功消息样式 */
.message-tip.dark.success {
  background-color: #333333; /* 灰黑色背景 */
  color: #95de64; /* 亮绿色文本 */
  border: 1px solid #52c41a; /* 绿色边框 */
}

/* 深色模式错误消息样式 */
.message-tip.dark.error {
  background-color: #333333; /* 灰黑色背景 */
  color: #ff7875; /* 亮红色文本 */
  border: 1px solid #f5222d; /* 红色边框 */
}

/* 过渡效果的进入和离开动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s, transform 0.5s; /* 透明度和位移的过渡 */
}

/* 进入前和离开后的状态 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0; /* 完全透明 */
  transform: translateX(-50%) translateY(-20px); /* 向上移动 20px */
}

/* 进入后和离开前的状态 */
.fade-enter-to,
.fade-leave-from {
  opacity: 1; /* 完全不透明 */
  transform: translateX(-50%) translateY(0); /* 恢复到原位 */
}
</style>

