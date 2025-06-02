import dayjs from 'dayjs';
import { solarToLunar, Solar } from 'lunar-javascript'; // 从lunar-javascript库导入Solar类和solarToLunar方法

// 阿拉伯数字转汉字数字（简体）
export const numberToChinese = (num) => {
  const digits = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  return num.toString().split('').map(d => digits[parseInt(d, 10)]).join('');
};

// 古风月份名称 (周礼·月令)
const CLASSICAL_MONTHS = [
  '孟春', '仲春', '季春',
  '孟夏', '仲夏', '季夏',
  '孟秋', '仲秋', '季秋',
  '孟冬', '仲冬', '季冬'
];

// 获取古风日期信息
export const toClassicalDate = (date) => {
  const solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const lunar = solar.getLunar(); // ✅ 取得 Lunar 实例

  return {
    classicalMonth: CLASSICAL_MONTHS[date.getMonth()],
    ganZhiYear: lunar.getYearInGanZhi(),       // ✅ 改为函数调用
    lunarDayStr: lunar.getDayInChinese()     // ✅ 改为函数调用
  };
};

// 获取台湾民国纪年
export const getTaiwanYear = (year) => {
  return year >= 1912 ? year - 1911 : `民前${1911 - year}`;
};

// 获取日本年号
export const getJapaneseEra = (year, month, day) => {
  const date = new Date(year, month, day);
  if (date >= new Date(2019, 4, 1)) {
    return { era: '令和', year: year - 2018 };
  } else if (date >= new Date(1989, 0, 8)) {
    return { era: '平成', year: year - 1988 };
  } else if (date >= new Date(1926, 11, 25)) {
    return { era: '昭和', year: year - 1925 };
  } else if (date >= new Date(1912, 6, 30)) {
    return { era: '大正', year: year - 1911 };
  } else {
    return { era: '明治', year: year - 1867 };
  }
};

// 获取月份名称
const monthNames = {
  'fr-FR': ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
            'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  'en-US': ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'],
  'es-ES': ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  'ms-MY': ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
            'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember']
};

// 根据语言格式化日期
export const formatDateByLocale = (date, locale) => {
  const d = dayjs(date);
  if (!d.isValid()) return '';

  const year = d.year();
  const month = d.month() + 1;
  const day = d.date();

  switch (locale) {
    case 'zh-TW':
      return `民國${getTaiwanYear(year)}年${month}月${day}日`;
    case 'ja-JP':
      const jpEra = getJapaneseEra(year, d.month(), day);
      return `${jpEra.era}${jpEra.year}年${month}月${day}日`;
    case 'fr-FR':
    case 'en-US':
    case 'es-ES':
    case 'ms-MY':
      const names = monthNames[locale];
      if (!names) return d.format('YYYY-MM-DD');
      if (locale === 'en-US') return `${names[month - 1]} ${day}, ${year}`;
      if (locale === 'es-ES') return `${day} de ${names[month - 1]} de ${year}`;
      return `${day} ${names[month - 1]} ${year}`;
    case 'zh-CN':
    case 'zh-SG':
    case 'zh-HK':
      return `${year}年${month}月${day}日`;
    case 'ko-KR':
      return `${year}년 ${month}월 ${day}일`;
    case 'vi-VN':
      return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    case 'kanji-JP':
    case 'kanji-KR':
      return `${numberToChinese(year)}年${numberToChinese(month)}月${numberToChinese(day)}日`;
    case 'zh-Classical':
      const classical = toClassicalDate(d.toDate());
      return `${classical.ganZhiYear}年${classical.classicalMonth}${classical.lunarDayStr}`;
    default:
      return d.format('YYYY-MM-DD');
  }
};

// 根据语言格式化月份标签
export const formatMonthLabelByLocale = (yearMonth, locale) => {
  const d = dayjs(yearMonth);
  if (!d.isValid()) return '';
  console.log('locale',locale);
  const year = d.year();
  const month = d.month() + 1;
  switch (locale) {
    case 'zh-TW':
      return `民國${getTaiwanYear(year)}年${month}月`;
    case 'ja-JP':
      const jpEra = getJapaneseEra(year, d.month(), 1);
      return `${jpEra.era}${jpEra.year}年${month}月`;
    case 'fr-FR':
    case 'en-US':
    case 'es-ES':
    case 'ms-MY':
      const names = monthNames[locale];
      if (!names) return d.format('YYYY-MM');
      if (locale === 'es-ES') return `${names[month - 1]} de ${year}`;
      return `${names[month - 1]} ${year}`;
    case 'zh-CN':
    case 'zh-SG':
    case 'zh-HK':
      return `${year}年${month}月`;
    case 'ko-KR':
      return `${year}년 ${month}월`;
    case 'vi-VN':
      return `${month.toString().padStart(2, '0')}/${year}`;
    case 'kanji-JP':
    case 'kanji-KR':
      return `${numberToChinese(year)}年${numberToChinese(month)}月`;
    case 'zh-Classical':
      const classical = toClassicalDate(d.toDate());
      return `${classical.ganZhiYear}年${classical.classicalMonth}`;
    default:
      return d.format('YYYY-MM');
  }
};

export default {
  formatDateByLocale,
  formatMonthLabelByLocale,
  getTaiwanYear,
  getJapaneseEra,
  numberToChinese,
  toClassicalDate
};