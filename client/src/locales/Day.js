// 在语言切换逻辑中（例如在语言切换组件）
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

// 切换语言时更新 Day.js
const switchLanguage = (lang) => {
  locale.value = lang
  dayjs.locale(lang) // 强制更新 Day.js 语言
}