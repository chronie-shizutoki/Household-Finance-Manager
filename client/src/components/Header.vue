<template>
  <div :class="['header', currentTheme]">
    <h1>{{ title }}</h1>

    <ElDropdown trigger="click">
      <span class="earth-icon" role="button" aria-haspopup="true" aria-expanded="false" aria-label="切换语言">🌍</span>
      
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
// 恢复导入你原有的 useLanguageSwitch composable
import { useLanguageSwitch } from '@/composables/useLanguageSwitch';
import { computed } from 'vue';
import { useThemeStore } from '@/stores/theme'; // 导入主题存储
// 导入 Element Plus 的下拉菜单相关组件
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus';

// 定义组件接收的 props
const props = defineProps({ 
  title: String // 接收一个字符串类型的标题
});

// 调用 useLanguageSwitch 获取语言切换函数
const { switchLanguage } = useLanguageSwitch();
const themeStore = useThemeStore();
const currentTheme = computed(() => themeStore.currentTheme); // 响应式获取当前主题

// 定义支持的语言列表
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
];
</script>

<style scoped>
/* 头部容器的基础样式 */
.header {
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: space-between; /* 子元素两端对齐 */
  align-items: center; /* 子元素垂直居中 */
  padding: 1rem; /* 内边距 */
  background-color: var(--el-bg-color-overlay, #ffffff); /* 背景色，适应明亮/深色模式 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* 底部阴影 */
  border-bottom: 1px solid var(--el-border-color-light, #e4e7ed); /* 底部边框 */
  position: sticky; /* 粘性定位，使其在滚动时保持在顶部 */
  top: 0; /* 距离顶部0 */
  z-index: 100; /* 确保在其他内容之上 */
}

/* 标题样式 */
.header h1 {
  font-size: 1.8rem; /* 标题字体大小 */
  color: var(--el-text-color-primary, #303133); /* 标题文本颜色 */
  margin: 0; /* 移除默认外边距 */
  flex-grow: 1; /* 允许标题占据可用空间 */
  text-align: left; /* 文本左对齐 */
}

/* 地球图标样式 */
.earth-icon {
  font-size: 28px; /* 图标字体大小 */
  cursor: pointer; /* 鼠标悬停时显示手型光标 */
  transition: all 0.3s ease; /* 所有属性的过渡效果 */
  color: var(--el-color-primary, #409eff); /* 图标颜色，使用 Element Plus 主题色 */
  margin-left: 1rem; /* 左侧外边距 */
  display: flex; /* 使用 flex 布局确保图标居中 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  width: 40px; /* 固定宽度 */
  height: 40px; /* 固定高度 */
  border-radius: 50%; /* 圆形 */
  background-color: var(--el-fill-color-light, #f5f5f5); /* 背景色 */
}

/* 地球图标悬停效果 */
.earth-icon:hover {
  color: var(--el-color-primary-light-3, #79bbff); /* 悬停时颜色变亮 */
  transform: scale(1.1); /* 悬停时放大 */
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

/* 针对 Element Plus 下拉菜单的样式覆盖 */
/* 使用 :deep() 穿透作用域样式，修改 Element Plus 组件内部样式 */
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
}

.header :deep(.el-dropdown-menu__item) {
  padding: 8px 16px !important;
  color: var(--dropdown-text) !important;
  transition: all 0.2s ease;
  font-size: var(--el-font-size-base, 14px);
  line-height: 22px;
}

.header :deep(.el-dropdown-menu__item:hover) {
  background: var(--dropdown-hover-bg) !important;
  color: var(--el-color-primary) !important;
  transform: translateX(4px);
}

/* 深色模式适配 */
/* 使用 data-theme 属性匹配 */
html[data-theme="dark"] .header {
  background-color: var(--el-bg-color-overlay-dark, #2d2c2c); /* 深色模式下的头部背景 */
  border-bottom-color: var(--el-border-color-dark, #424141); /* 深色模式下的底部边框 */
}

html[data-theme="dark"] .header h1 {
  color: var(--el-text-color-primary-dark, rgba(255, 255, 255, 0.85)); /* 深色模式下的标题文本颜色 */
}

html[data-theme="dark"] .earth-icon {
  background-color: var(--el-fill-color-dark, #363636); /* 深色模式下图标背景 */
  color: var(--el-color-primary-dark, #409eff); /* 深色模式下图标颜色 */
}

html[data-theme="dark"] .earth-icon:hover {
  color: var(--el-color-primary-light-3-dark, #79bbff); /* 深色模式下悬停颜色 */
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.1); /* 深色模式下阴影 */
}

html[data-theme="dark"] .header :deep(.el-dropdown__popper) {
  --dropdown-bg: var(--el-bg-color-overlay-dark, #323232); /* 深色模式下拉菜单背景 */
  --dropdown-text: var(--el-text-color-regular-dark, rgba(255,255,255,0.8)); /* 深色模式下拉菜单文本 */
  --dropdown-hover-bg: var(--el-fill-color-dark, rgba(255,255,255,0.1)); /* 深色模式下拉菜单悬停背景 */
  --dropdown-border: var(--el-border-color-dark, rgba(255,255,255,0.1)); /* 深色模式下拉菜单边框 */
  
  /* 覆盖Element Plus深色阴影 */
  box-shadow: var(--el-box-shadow-dark, 0 12px 32px 4px rgba(0, 0, 0, 0.36)) !important;
}

/* 动画效果 */
/* Element Plus 下拉菜单的默认动画，通常不需要额外修改 */
/* 为了确保动画效果，这里保留了原始的动画相关样式 */
.header :deep(.el-dropdown-menu) {
  transform: translateY(-10px);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.header :deep(.el-dropdown-menu.el-dropdown-menu--show) {
  transform: translateY(0);
  opacity: 1;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .header {
    padding: 0.8rem; /* 减小移动端内边距 */
  }

  .header h1 {
    font-size: 1.5rem; /* 减小移动端标题字体大小 */
  }

  .earth-icon {
    font-size: 24px; /* 减小移动端图标大小 */
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .header h1 {
    font-size: 1.3rem; /* 进一步减小极小屏幕的标题字体大小 */
  }
}
</style>

