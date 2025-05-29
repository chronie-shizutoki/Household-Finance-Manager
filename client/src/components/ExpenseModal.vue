<!--
 * @file ExpenseModal.vue
 * @package 家庭记账本
 * @module 公共组件
 * @description 消费记录添加模态弹窗组件
 * @author 开发者
 * @version 1.0
-->
<template>
  <Transition name="modal-fade" >
    <div v-if="show" class="modal-overlay" @click.stop>
      <div class="modal-content glass-effect" @click.stop>
        <h2>{{ $t('app.addRecord') }}</h2>
        <button class="modal-close" @click="handleClose">×</button>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>{{ $t('expense.labels.date') }}：</label>
            <input type="date" v-model="newExpense.time" required>
          </div>
          <div class="form-group">
            <label>{{ $t('expense.labels.type') }}：</label>
            <select v-model="newExpense.type" required>
              <option v-for="(typeName, typeKey) in expenseTypes" :key="typeKey">{{ typeName }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>{{ $t('expense.labels.amount') }}：</label>
            <input type="number" v-model.number="newExpense.amount" min="0.1" max="99999" step="0.01" required>
          </div>
          <div class="form-group">
            <label>{{ $t('expense.labels.remark') }}：</label>
            <textarea v-model="newExpense.remark"></textarea>
          </div>
          <button type="submit">{{ $t('expense.buttons.submit') }}</button>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, computed } from 'vue'
// 直接定义20个消费类型键值对（硬编码防止i18n访问错误）
const expenseTypeOptions = {
      "food": "餐饮",
      "shopping": "购物",
      "entertainment": "娱乐",
      "transport": "交通出行",
      "communication": "通讯费用",
      "housing": "房租/房贷",
      "travel": "旅行度假",
      "fitness": "健身运动",
      "beauty": "美容护理",
      "pet": "宠物相关",
      "books": "书籍学习",
      "digital": "数码产品",
      "home": "家居用品",
      "gift": "礼物人情",
      "office": "办公用品",
      "sports": "体育用品",
      "repair": "维修保养",
      "medical": "医疗健康",
      "education": "教育培训",
      "utility": "水电燃气",
      "other": "其他支出"
};

const expenseTypes = computed(() => expenseTypeOptions);

// 调试：输出当前获取的类型数据
watch(expenseTypes, (val) => {
  console.log('ExpenseModal 类型数据调试：', val);
}, { immediate: true });

/**
 * 组件属性定义
 * @typedef {Object} ExpenseModalProps
 * @property {boolean} show - 控制弹窗显示状态
 * @property {Object} newExpense - 新消费记录数据
 */
const props = defineProps({ show: Boolean, newExpense: Object })

// 监听show属性变化，控制页面滚动

  // 监听show属性变化，控制页面滚动
watch(() => props.show, (newVal) => {
  console.log('ExpenseModal接收到的show状态：', newVal);
  // 显示时锁定页面滚动
  document.body.style.overflow = newVal ? 'hidden' : '';
  // 防止滚动条消失导致内容抖动
  document.body.style.paddingRight = newVal ? 'calc(100vw - 100%)' : '';
})

// 声明重置事件
const emit = defineEmits(['submit-expense', 'update:show', 'reset-expense'])

/**
 * 关闭弹窗处理函数
 */
const handleClose = () => { emit('update:show', false) }

/**
 * 提交表单处理函数
 */
const handleSubmit = () => {
  emit('submit-expense', props.newExpense)
  // 通知父组件重置数据（不再直接修改props）
  emit('reset-expense')
}

// 监听金额变化，处理整数补两位小数逻辑
watch(() => props.newExpense.amount, (newVal) => {
  if (typeof newVal === 'number' && newVal % 1 === 0) {
    // 整数转换为两位小数格式（如33 → 33.00）
    props.newExpense.amount = Number(newVal.toFixed(2))
  }
}, { immediate: true })
</script>

<style scoped>
/* 导入公共样式 */
@import '@/styles/common.css';


/* 模态框覆盖层样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: slide var(--transition-time) ease;
  /* 确保内容垂直居中于视口 */
  overflow-y: auto;
  padding: 20px 0; /* 上下预留空间防止被浏览器工具栏遮挡 */
}

/* 模态框根容器样式（覆盖全屏） */
.modal {
  position: absolute; /* 固定定位覆盖整个屏幕 */
  top: 0;
  left: 0; 
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 玻璃效果内容区域样式 */
.modal-content {
  position: absolute; /* 基于视口定位 */
  left: 50%; /* 水平居中基准点 */
  top: calc(50vh); /* 基于视口高度50%计算顶部位置 */
  transform: translate(-50%, -50%); /* 调整自身偏移实现居中 */
  display: flex;
  flex-direction: column;
  width: 60%; /* 调整为屏幕宽度的60% */
  max-width: 600px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--border-radius);
  padding: 2rem;
  visibility: visible;
  opacity: 1;
  max-height: 90vh;
  overflow-y: auto;
  margin: unset;
  align-self: unset;
}
.glass-effect {
  background: rgba(255, 255, 255, 0.95);
  padding: 1.2rem;
  @media (max-width: 320px) {
    padding: 0.6rem;
  }
  border-radius: var(--border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
  /* 移除错误的max-width限制 */
  max-width: unset;
}

/* 表单样式优化 */
.form-group {
  margin-bottom: 1.2rem; /* 减少表单元素垂直间距 */
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  max-width: 100%; /* 防止内容溢出 */
  box-sizing: border-box; /* 包含内边距和边框 */
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;
}

.form-group textarea {
  min-height: 80px;
}

form button[type="submit"] {
  width: 100%;
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background var(--transition-time) ease;
}

form button[type="submit"]:hover {
  background: #256029;
}
</style>