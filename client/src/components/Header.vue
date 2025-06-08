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
  { code: 'en-US', label: 'English (United States)' },
  { code: 'zh-CN', label: '简体中文 (中国大陆)' },
  { code: 'ja-JP', label: '日本語 (日本)' },
  { code: 'kanji-JP', label: '偽中国語 (日本)' },
  { code: 'fr-FR', label: 'Français (France)' },
  { code: 'zh-HK', label: '繁體中文 (香港特別行政區)' },
  { code: 'zh-TW', label: '繁體中文 (台灣地區)' },
  { code: 'zh-SG', label: '简体中文 (新加坡)' },
  { code: 'zh-Classical', label: '文言 (中國)' },
  { code: 'es-ES', label: 'Español (España)' },
  { code: 'ko-KR', label: '한국어 (대한민국)' },
  { code: 'kanji-KR', label: '韓國語 (大韓民國)' },
  { code: 'ms-MY', label: 'Bahasa Melayu (Malaysia)' },
  { code: 'vi-VN', label: 'Tiếng Việt (Việt Nam)' },
];
</script>

<style scoped>
@import '../styles/header.css';
</style>

