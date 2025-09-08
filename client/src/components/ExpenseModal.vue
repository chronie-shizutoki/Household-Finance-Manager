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
            <CustomDropdown
              v-model="newExpense.type"
              :options="expenseTypesArray"
              :placeholder="$t('expense.labels.selectType')"
              required
            />
          </div>
          <div class="form-group">
            <label>{{ $t('expense.labels.amount') }}：</label>
            <input type="number" 
       v-model.number="newExpense.amount"
       min="0"
       step="0.01"
       required>
       <p class="error" v-if="amountError">{{ amountError }}</p>
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
import { useI18n } from 'vue-i18n'
import CustomDropdown from './CustomDropdown.vue'
const { t } = useI18n()
// 定义支出类型（使用 home.type 命名空间）
const expenseTypes = {
  food: 'home.type.food',
  shopping: 'home.type.shopping',
  entertainment: 'home.type.entertainment',
  transport: 'home.type.transport',
  communication: 'home.type.communication',
  housing: 'home.type.housing',
  travel: 'home.type.travel',
  fitness: 'home.type.fitness',
  beauty: 'home.type.beauty',
  pet: 'home.type.pet',
  books: 'home.type.books',
  digital: 'home.type.digital',
  home: 'home.type.home',
  gift: 'home.type.gift',
  office: 'home.type.office',
  sports: 'home.type.sports',
  repair: 'home.type.repair',
  medical: 'home.type.medical',
  education: 'home.type.education',
  utility: 'home.type.utility',
  other: 'home.type.other'
};

const expenseTypesArray = computed(() => {
  return Object.entries(expenseTypes).map(([typeKey, typeName]) => ({
    value: typeKey,
    label: t(typeName)
  }))
})

// 调试：输出当前获取的类型数据
watch(expenseTypesArray, (val) => {
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
const timeError = ref('')
const amountError = ref('')

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
// 金额验证逻辑
const validateAmount = () => {
  if (isNaN(newExpense.value.amount)) {
    amountError.value = t('error.invalidNumber');
  // 允许金额为0，移除正数限制
}
watch(() => props.newExpense.amount, (newVal) => {
  if (typeof newVal === 'number' && newVal % 1 === 0) {
    // 整数转换为两位小数格式（如33 → 33.00）
    props.newExpense.amount = Number(newVal.toFixed(2))
  }
}, { immediate: true })}
</script>

<style scoped>
/* 导入公共样式 */
@import '@/styles/common.css';

@import '@/styles/expense-modal.css';
</style>