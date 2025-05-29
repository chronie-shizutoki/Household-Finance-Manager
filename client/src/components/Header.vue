<!-- 头部组件 - 包含标题和语言切换功能 -->
<template>
  <div class="header">
    <h1>{{ title }}</h1>
    <ElDropdown>
      <span class="earth-icon">🌍</span>
      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem 
            v-for="lang in languages" 
            :key="lang.code" 
            @click="switchLanguage(lang.code)"
          >
            {{ lang.label }}
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </div>
</template>

<script setup>
import { useLanguageSwitch } from '@/composables/useLanguageSwitch'
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'

const props = defineProps({ title: String })
const { switchLanguage } = useLanguageSwitch()
const languages = [
  { code: 'zh-CN', label: '简体中文 (中国大陆)' },
  { code: 'zh-HK', label: '繁體中文 (香港特別行政區)' },
  { code: 'zh-TW', label: '繁體中文 (台灣地區)' },
  { code: 'zh-SG', label: '简体中文 (新加坡)' },
  { code: 'en-US', label: 'English (United States)' },
  { code: 'ja-JP', label: '日本語 (日本)' },
  { code: 'ko-KR', label: '한국어 (대한민국)' },
  { code: 'ms-MY', label: 'Bahasa Melayu (Malaysia)' },
  { code: 'vi-VN', label: 'Tiếng Việt (Việt Nam)' },
  { code: 'es-ES', label: 'Español (España)' },
  { code: 'fr-FR', label: 'Français (France)' },
]
</script>

<style scoped>
/* 基础样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
}

.earth-icon {
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--primary-color, #4CAF50);
  
  &:hover {
    color: var(--primary-hover-color, #2E7D32);
    transform: scale(1.1);
  }
}

/* 下拉菜单核心样式 */
.header :deep(.el-dropdown__popper) {
  /* 明亮模式默认值 */
  --dropdown-bg: var(--el-bg-color-overlay, #ffffff);
  --dropdown-text: var(--el-text-color-regular, #606266);
  --dropdown-hover-bg: var(--el-fill-color-light, #f5f5f5);
  --dropdown-border: var(--el-border-color-light, #e4e7ed);
  
  background: var(--dropdown-bg) !important;
  border: 1px solid var(--dropdown-border) !important;
  border-radius: var(--el-border-radius-base, 4px) !important;
  box-shadow: var(--el-box-shadow-light, 0 12px 32px 4px rgba(0, 0, 0, 0.04)) !important;
  padding: 4px 0 !important;

  .el-dropdown-menu__item {
    padding: 8px 16px !important;
    color: var(--dropdown-text) !important;
    transition: all 0.2s ease;
    font-size: var(--el-font-size-base, 14px);
    line-height: 22px;

    &:hover {
      background: var(--dropdown-hover-bg) !important;
      color: var(--el-color-primary) !important;
      transform: translateX(4px);
    }
  }
}

/* 强制深色模式适配 */
:root.dark {
  .header :deep(.el-dropdown__popper) {
    --dropdown-bg: var(--el-bg-color-overlay, #1f1f1f);
    --dropdown-text: var(--el-text-color-regular, rgba(255,255,255,0.8));
    --dropdown-hover-bg: var(--el-fill-color-light, rgba(255,255,255,0.1));
    --dropdown-border: var(--el-border-color-light, rgba(255,255,255,0.1));
    
    /* 覆盖Element Plus深色阴影 */
    box-shadow: var(--el-box-shadow-dark, 0 12px 32px 4px rgba(0, 0, 0, 0.36)) !important;
  }
}

/* 动画效果 */
.header :deep(.el-dropdown-menu) {
  transform: translateY(-10px);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;

  &.el-dropdown-menu--show {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>