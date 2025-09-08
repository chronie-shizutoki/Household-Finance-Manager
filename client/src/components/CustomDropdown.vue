<!--
 * @file CustomDropdown.vue
 * @package 家庭记账本
 * @module 公共组件
 * @description 自定义下拉菜单选择器组件
 * @author 开发者
 * @version 1.0
-->
<template>
  <div class="custom-dropdown" @click.stop>
    <div 
      class="dropdown-toggle"
      :class="{ 'active': isOpen }"
      @click="toggleDropdown"
      :aria-expanded="isOpen"
      aria-haspopup="true"
    >
      <span class="dropdown-value">{{ selectedLabel || placeholder }}</span>
      <span class="dropdown-icon">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </div>
    
    <Transition name="dropdown-fade">
      <div 
        v-if="isOpen"
        class="dropdown-menu"
        ref="dropdownMenu"
        :style="{ maxHeight: menuMaxHeight + 'px' }"
      >
        <div v-if="allowSearch" class="dropdown-search">
          <input 
            type="text" 
            v-model="searchTerm"
            placeholder="搜索..."
            class="search-input"
            @keydown.stop
            @focus="handleSearchFocus"
          />
        </div>
        
        <div class="dropdown-items">
          <div 
            v-for="option in filteredOptions"
            :key="option.value"
            class="dropdown-item"
            :class="{ 'selected': option.value === selectedValue, 'hover': hoveredOption === option.value }"
            @click="selectOption(option)"
            @mouseenter="hoveredOption = option.value"
            @mouseleave="hoveredOption = null"
            role="option"
            :aria-selected="option.value === selectedValue"
          >
            {{ option.label }}
          </div>
          
          <div v-if="!filteredOptions.length" class="dropdown-empty">
            {{ searchTerm ? '没有找到匹配的选项' : '暂无选项' }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

// 组件属性定义
const props = defineProps({
  options: {
    type: Array,
    required: true,
    validator: (value) => {
      return Array.isArray(value) && value.every(option => 
        option && typeof option.value !== 'undefined' && typeof option.label !== 'undefined'
      )
    }
  },
  modelValue: {
    type: [String, Number, Boolean, Object],
    default: null
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  allowSearch: {
    type: Boolean,
    default: false
  },
  maxHeight: {
    type: Number,
    default: 300
  }
})

// 组件事件定义
const emit = defineEmits(['update:modelValue', 'change'])

// 响应式数据
const isOpen = ref(false)
const hoveredOption = ref(null)
const searchTerm = ref('')
const menuMaxHeight = ref(props.maxHeight)
const dropdownMenu = ref(null)

// 计算属性
const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  }
})

const selectedLabel = computed(() => {
  if (selectedValue.value === null || selectedValue.value === undefined || selectedValue.value === '') {
    return ''
  }
  
  const selectedOption = props.options.find(option => option.value === selectedValue.value)
  return selectedOption ? selectedOption.label : ''
})

const filteredOptions = computed(() => {
  if (!props.allowSearch || !searchTerm.value) {
    return props.options
  }
  
  const term = searchTerm.value.toLowerCase()
  return props.options.filter(option => 
    option.label.toLowerCase().includes(term) || 
    String(option.value).toLowerCase().includes(term)
  )
})

// 方法
const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  
  if (isOpen.value) {
    searchTerm.value = ''
    setTimeout(() => {
      const searchInput = dropdownMenu.value?.querySelector('.search-input')
      if (searchInput) {
        searchInput.focus()
      }
    }, 100)
  }
}

const selectOption = (option) => {
  selectedValue.value = option.value
  isOpen.value = false
  searchTerm.value = ''
}

const handleSearchFocus = (e) => {
  e.stopPropagation()
}

const closeDropdown = () => {
  isOpen.value = false
  hoveredOption.value = null
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.custom-dropdown') && isOpen.value) {
    closeDropdown()
  }
}

const handleKeydown = (event) => {
  if (!isOpen.value) return
  
  // Escape key closes the dropdown
  if (event.key === 'Escape') {
    closeDropdown()
    return
  }
  
  // Arrow up/down navigation
  const filtered = filteredOptions.value
  if (filtered.length === 0) return
  
  let currentIndex = filtered.findIndex(opt => opt.value === hoveredOption.value)
  
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    currentIndex = (currentIndex + 1) % filtered.length
    hoveredOption.value = filtered[currentIndex].value
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    currentIndex = (currentIndex - 1 + filtered.length) % filtered.length
    hoveredOption.value = filtered[currentIndex].value
  } else if (event.key === 'Enter' && hoveredOption.value !== null) {
    const selectedOption = filtered.find(opt => opt.value === hoveredOption.value)
    if (selectedOption) {
      selectOption(selectedOption)
    }
  }
}

// 生命周期钩子
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})

// 监听选项变化，如果当前选中的值不在选项中，则清空
watch(() => props.options, (newOptions) => {
  if (selectedValue.value !== null && selectedValue.value !== undefined && selectedValue.value !== '') {
    const hasValue = newOptions.some(option => option.value === selectedValue.value)
    if (!hasValue) {
      selectedValue.value = ''
    }
  }
}, { deep: true })

// 监听禁用状态变化
watch(() => props.disabled, (newDisabled) => {
  if (newDisabled) {
    closeDropdown()
  }
})
</script>

<style scoped>
@import '../styles/components.css';

/* 自定义下拉菜单基础样式 */
.custom-dropdown {
  position: relative;
  width: 100%;
  max-width: 100%;
  font-family: inherit;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius);
  color: var(--text-primary);
  font-size: 1rem;
  cursor: pointer;
  transition: all var(--transition-time) ease;
  user-select: none;
  position: relative;
  overflow: hidden;
}

.dropdown-toggle::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transition: all var(--transition-time) ease;
}

.dropdown-toggle:hover::before {
  left: 0;
}

.dropdown-toggle:hover {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--highlight-color);
}

.dropdown-toggle.active {
  border-color: var(--primary-color);
  background: var(--highlight-color);
}

.dropdown-toggle.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--bg-secondary);
}

.dropdown-toggle.disabled:hover {
  border-color: var(--border-primary);
  box-shadow: none;
}

.dropdown-toggle.disabled::before {
  display: none;
}

.dropdown-value {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-icon {
  flex-shrink: 0;
  margin-left: 0.5rem;
  transition: transform var(--transition-time) ease;
}

.dropdown-toggle.active .dropdown-icon {
  transform: rotate(180deg);
}

/* 下拉菜单样式 */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.25rem;
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  z-index: 1000;
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--transition-time) ease;
}

.dropdown-fade-enter-from, .dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-fade-enter-active, .dropdown-fade-leave-active {
  transition: opacity var(--transition-time) ease, transform var(--transition-time) ease;
}

.dropdown-fade-enter-to, .dropdown-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* 搜索框样式 */
.dropdown-search {
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-primary);
}

.search-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: border-color var(--transition-time) ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--highlight-color);
}

/* 选项列表样式 */
.dropdown-items {
  max-height: calc(var(--menu-max-height) - 5rem);
  overflow-y: auto;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all var(--transition-time) ease;
  color: var(--text-primary);
  font-size: 0.875rem;
  user-select: none;
  position: relative;
  overflow: hidden;
}

.dropdown-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--highlight-color);
  transition: all var(--transition-time) ease;
}

.dropdown-item:hover::before,
.dropdown-item.hover::before {
  left: 0;
}

.dropdown-item:hover,
.dropdown-item.hover {
  background: var(--bg-secondary);
}

.dropdown-item.selected {
  background: var(--highlight-color);
  color: var(--primary-color);
  font-weight: 500;
}

.dropdown-item.selected::before {
  left: 0;
  background: rgba(76, 175, 80, 0.15);
}

.dropdown-empty {
  padding: 1rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.875rem;
}

/* 滚动条样式 */
.dropdown-items::-webkit-scrollbar {
  width: 6px;
}

.dropdown-items::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 3px;
}

.dropdown-items::-webkit-scrollbar-thumb {
  background: var(--border-primary);
  border-radius: 3px;
  transition: background var(--transition-time) ease;
}

.dropdown-items::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .dropdown-toggle::before {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .dropdown-item::before {
    background: rgba(76, 175, 80, 0.1);
  }
}
</style>