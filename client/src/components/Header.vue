<template>
  <div :class="['header', currentTheme]">
    <h1>{{ title }}</h1>

    <div class="language-selector">
      <CustomDropdown
        v-model="currentLanguage"
        :options="languageOptions"
        :placeholder="t('language.select')"
        aria-label="切换语言"
        @change="handleLanguageChange"
      />
    </div>
  </div>
</template>

<script setup>
// 恢复导入你原有的 useLanguageSwitch composable
import { useLanguageSwitch } from '@/composables/useLanguageSwitch';
import { computed } from 'vue';
import { useThemeStore } from '@/stores/theme'; // 导入主题存储
import CustomDropdown from './CustomDropdown.vue';

// 定义组件接收的 props
const props = defineProps({ 
  title: String // 接收一个字符串类型的标题
});

// 导入国际化
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// 调用 useLanguageSwitch 获取语言切换函数
const { currentLanguage, switchLanguage } = useLanguageSwitch();
const themeStore = useThemeStore();
const currentTheme = computed(() => themeStore.currentTheme); // 响应式获取当前主题

// 定义支持的语言列表
const languages = [
  { code: 'en-US', label: 'English (United States)' },
  { code: 'es-ES', label: 'Español (España)' },
  { code: 'fr-FR', label: 'Français (France)' },
  { code: 'ja-JP', label: '日本語 (日本)' },
  { code: 'kanji-JP', label: '偽中国語 (日本)' },
  { code: 'kanji-KR', label: '韓國語 (大韓民國)' },
  { code: 'ko-KR', label: '한국어 (대한민국)' },
  { code: 'ms-MY', label: 'Bahasa Melayu (Malaysia)' },
  { code: 'vi-VN', label: 'Tiếng Việt (Việt Nam)' },
  { code: 'zh-Classical', label: '文言 (中國)' },
  { code: 'zh-CN', label: '简体中文 (中国大陆)' },
  { code: 'zh-HK', label: '繁體中文 (香港特別行政區)' },
  { code: 'zh-SG', label: '华语 (新加坡)' },
  { code: 'zh-TW', label: '繁體中文 (台灣)' },
];

// 计算语言选项
const languageOptions = computed(() => {
  return languages.map(lang => ({
    value: lang.code,
    label: lang.label
  }))
})

// 处理语言变化
const handleLanguageChange = (newLanguage) => {
  switchLanguage(newLanguage)
}
</script>

<style scoped>
/* 已迁移至common.css，仅保留作用域标识 */

/* 语言选择器样式 */
.language-selector {
  position: relative;
}
</style>

