/*
 * @file i18n.js
 * @package 家庭记账本
 * @module 国际化配置
 * @description 多语言支持核心配置文件，初始化i18n实例并加载语言包
 * @author 开发者
 * @version 1.0
*/

import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN.json'
import enUS from './en-US.json'
import jaJP from './ja-JP.json'
import frFR from './fr-FR.json'
import zhHK from './zh-HK.json'
import zhTW from './zh-TW.json'
import zhSG from './zh-SG.json'
import esES from './es-ES.json'
import koKR from './ko-KR.json'
import msMY from './ms-MY.json'
import viVN from './vi-VN.json'
import zhClassical from './zh-Classical.json'
import kanjiJP from './kanji-JP.json'
import kanjiKR from './kanji-KR.json'
import dayjs from 'dayjs';
// 导入语言包
import 'dayjs/locale/zh-cn'; // 中文
import 'dayjs/locale/en'; // 英文
import 'dayjs/locale/ja'; // 日语
import 'dayjs/locale/fr'; // 法语
import 'dayjs/locale/zh-hk'; // 香港繁体
import 'dayjs/locale/zh-tw'; // 台湾繁体
import 'dayjs/locale/es'; // 西班牙语
import 'dayjs/locale/ko'; // 韩语
import 'dayjs/locale/ms-my'; // 马来语
import 'dayjs/locale/vi'; // 越南语
import { computed } from 'vue' // 必须导入 computed

import { solarToLunar } from 'chinese-lunar';
/**
 * 初始化i18n实例
 * @type {import('vue-i18n').I18n}
 */
// 定义支持的语言列表
const supportedLocales = [
  'zh-CN', 'en-US', 'ja-JP', 'fr-FR', 'zh-HK', 'zh-TW', 
  'zh-SG', 'es-ES', 'ko-KR', 'ms-MY', 'vi-VN', 
  'zh-Classical', 'kanji-JP', 'kanji-KR'
];

// 获取浏览器语言并映射到支持的语言
function getBrowserLocale() {
  // 检查是否在浏览器环境中
  if (typeof navigator === 'undefined') {
    return 'en-US'; // 默认返回英文
  }
  
  const browserLocale = navigator.language || navigator.userLanguage;
  
  // 精确匹配
  if (supportedLocales.includes(browserLocale)) {
    return browserLocale;
  }
  
  // 模糊匹配（如 'zh' 匹配 'zh-CN'）
  const lang = browserLocale.split('-')[0];
  for (const locale of supportedLocales) {
    if (locale.startsWith(lang)) {
      return locale;
    }
  }
  
  // 默认返回回退语言
  return 'en-US';
}

const i18n = createI18n({
  legacy: false, // 使用组合式API模式
  locale: getBrowserLocale(), // 根据浏览器语言自动设置
  fallbackLocale: 'en-US', // 回退语言
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
    'ja-JP': jaJP,
    'fr-FR': frFR,
    'zh-HK': zhHK,
    'zh-TW': zhTW,
    'zh-SG': zhSG,
    'es-ES': esES,
    'ko-KR': koKR,
    'ms-MY': msMY,
    'vi-VN': viVN,
    'zh-Classical': zhClassical,
    'kanji-JP': kanjiJP,
    'kanji-KR': kanjiKR
  }
})

// 监听语言切换并更新 Day.js 语言
i18n.global.onLanguageChanged = (locale) => {
  dayjs.locale(locale)
}

const monthLabel = computed(() => {
  const d = dayjs(currentMonth.value)
  return t('monthLabel', {
    year: d.format('YYYY'),
    month: locale.value === 'en-US' ? d.format('MMMM') : d.format('MM')
  })
})

export default i18n