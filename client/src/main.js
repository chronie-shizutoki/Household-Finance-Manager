import { createApp } from 'vue'
import './styles/common.css' // 导入公共样式文件
import 'element-plus/dist/index.css' // 导入Element Plus基础样式
import App from './App.vue'
import router from './router'
import i18n from './locales/i18n.js'
import 'dayjs/locale/zh-cn' // 简体中文
import 'dayjs/locale/ja'    // 日语
import 'dayjs/locale/ko'    // 韩语
import 'dayjs/locale/fr'    // 法语
import 'dayjs/locale/es'    // 西班牙语
import 'dayjs/locale/zh-hk' // 香港繁体
import 'dayjs/locale/zh-tw' // 台湾繁体
export { i18n }; // 正确命名导出i18n实例供其他模块使用
// 使用locales目录下已配置的i18n实例（包含完整语言包）
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/dark/css-vars.css' // 官方暗黑模式

const app = createApp(App)
app.use(ElementPlus, { 
  zIndex: 3000,
  cssVar: {
    'color-primary': '#4CAF50' // 保持与项目主色一致
  }
})
app.use(router)
app.use(i18n)
app.mount('#app')