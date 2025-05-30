/**
 * 日期格式化工具
 * 支持多语言日期格式化，包括特殊格式如台湾民国纪年、日本年号等
 */

import dayjs from 'dayjs';

/**
 * 获取台湾民国纪年
 * @param {number} year - 公历年份
 * @returns {number} 民国年份
 */
export const getTaiwanYear = (year) => {
  // 民国元年为公元1912年
  return year - 1911;
};

/**
 * 获取日本年号
 * @param {number} year - 公历年份
 * @param {number} month - 月份(0-11)
 * @param {number} day - 日期
 * @returns {object} 包含年号和对应年份的对象
 */
export const getJapaneseEra = (year, month, day) => {
  // 令和: 2019年5月1日至今
  if (year > 2019 || (year === 2019 && month >= 4 && day >= 1)) {
    return { era: '令和', year: year - 2019 + 1 };
  }
  // 平成: 1989年1月8日至2019年4月30日
  else if (year > 1989 || (year === 1989 && ((month > 0) || (month === 0 && day >= 8)))) {
    return { era: '平成', year: year - 1989 + 1 };
  }
  // 昭和: 1926年12月25日至1989年1月7日
  else if (year > 1926 || (year === 1926 && month === 11 && day >= 25)) {
    return { era: '昭和', year: year - 1926 + 1 };
  }
  // 大正: 1912年7月30日至1926年12月24日
  else if (year > 1912 || (year === 1912 && ((month > 6) || (month === 6 && day >= 30)))) {
    return { era: '大正', year: year - 1912 + 1 };
  }
  // 明治: 1868年1月25日至1912年7月29日 (简化处理)
  else {
    return { era: '明治', year: year - 1868 + 1 };
  }
};

/**
 * 获取法语月份名称
 * @param {number} month - 月份(1-12)
 * @returns {string} 法语月份名称
 */
export const getFrenchMonthName = (month) => {
  const monthNames = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];
  return monthNames[month - 1];
};

/**
 * 获取英语月份名称
 * @param {number} month - 月份(1-12)
 * @returns {string} 英语月份名称
 */
export const getEnglishMonthName = (month) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[month - 1];
};

/**
 * 获取西班牙语月份名称
 * @param {number} month - 月份(1-12)
 * @returns {string} 西班牙语月份名称
 */
export const getSpanishMonthName = (month) => {
  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  return monthNames[month - 1];
};

/**
 * 根据语言格式化日期
 * @param {string|Date} date - 日期对象或日期字符串
 * @param {string} locale - 语言代码
 * @returns {string} 格式化后的日期字符串
 */
export const formatDateByLocale = (date, locale) => {
  const d = dayjs(date);
  const year = d.year();
  const month = d.month() + 1; // dayjs月份从0开始
  const day = d.date();

  switch (locale) {
    case 'zh-TW':
      // 台湾民国纪年: 民国xxx年x月x日
      const rocYear = getTaiwanYear(year);
      return `民國${rocYear}年${month}月${day}日`;
    
    case 'ja-JP':
      // 日本年号: 令和x年x月x日
      const japaneseDate = getJapaneseEra(year, d.month(), day);
      return `${japaneseDate.era}${japaneseDate.year}年${month}月${day}日`;
    
    case 'fr-FR':
      // 法语日期: 15 avril 2024
      return `${day} ${getFrenchMonthName(month)} ${year}`;
    
    case 'en-US':
      // 英语日期: April 15, 2024
      return `${getEnglishMonthName(month)} ${day}, ${year}`;
    
    case 'es-ES':
      // 西班牙语日期: 15 de abril de 2024
      return `${day} de ${getSpanishMonthName(month)} de ${year}`;
    
    case 'zh-CN':
    case 'zh-SG':
      // 简体中文日期: 2024年4月15日
      return `${year}年${month}月${day}日`;
    
    case 'zh-HK':
      // 香港繁体日期: 2024年4月15日
      return `${year}年${month}月${day}日`;
    
    case 'ko-KR':
      // 韩语日期: 2024년 4월 15일
      return `${year}년 ${month}월 ${day}일`;
    
    case 'vi-VN':
      // 越南语日期: 15/04/2024
      return `${day}/${month.toString().padStart(2, '0')}/${year}`;
    
    case 'ms-MY':
      // 马来语日期: 15 Mac 2024
      const malayMonths = [
        'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
        'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
      ];
      return `${day} ${malayMonths[month - 1]} ${year}`;
    
    default:
      // 默认格式: YYYY-MM-DD
      return d.format('YYYY-MM-DD');
  }
};

/**
 * 根据语言格式化月份标签
 * @param {string} yearMonth - 年月字符串 (YYYY-MM)
 * @param {string} locale - 语言代码
 * @returns {string} 格式化后的月份标签
 */
export const formatMonthLabelByLocale = (yearMonth, locale) => {
  const d = dayjs(yearMonth);
  const year = d.year();
  const month = d.month() + 1; // dayjs月份从0开始

  switch (locale) {
    case 'zh-TW':
      // 台湾民国纪年: 民国xxx年x月
      const rocYear = getTaiwanYear(year);
      return `民國${rocYear}年${month}月`;
    
    case 'ja-JP':
      // 日本年号: 令和x年x月
      const japaneseDate = getJapaneseEra(year, d.month(), 1);
      return `${japaneseDate.era}${japaneseDate.year}年${month}月`;
    
    case 'fr-FR':
      // 法语月份: avril 2024
      return `${getFrenchMonthName(month)} ${year}`;
    
    case 'en-US':
      // 英语月份: April 2024
      return `${getEnglishMonthName(month)} ${year}`;
    
    case 'es-ES':
      // 西班牙语月份: abril de 2024
      return `${getSpanishMonthName(month)} de ${year}`;
    
    case 'zh-CN':
    case 'zh-SG':
      // 简体中文月份: 2024年4月
      return `${year}年${month}月`;
    
    case 'zh-HK':
      // 香港繁体月份: 2024年4月
      return `${year}年${month}月`;
    
    case 'ko-KR':
      // 韩语月份: 2024년 4월
      return `${year}년 ${month}월`;
    
    case 'vi-VN':
      // 越南语月份: 04/2024
      return `${month.toString().padStart(2, '0')}/${year}`;
    
    case 'ms-MY':
      // 马来语月份: Mac 2024
      const malayMonths = [
        'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
        'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
      ];
      return `${malayMonths[month - 1]} ${year}`;
    
    default:
      // 默认格式: YYYY-MM
      return d.format('YYYY-MM');
  }
};

export default {
  formatDateByLocale,
  formatMonthLabelByLocale,
  getTaiwanYear,
  getJapaneseEra,
  getFrenchMonthName,
  getEnglishMonthName,
  getSpanishMonthName
};
