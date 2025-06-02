import { defineStore } from 'pinia';

// 定义主题存储
export const useThemeStore = defineStore('theme', {
  // 初始化主题（在Pinia安装后调用）
  onActivated() {
    this.initTheme();
  },
  state: () => ({ currentTheme: 'light' }),
  actions: {
    setTheme(theme) {
      this.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
    },
    initTheme() {
      // 初始检测系统主题
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.currentTheme = mediaQuery.matches ? 'dark' : 'light';
      // 监听系统主题变化
      mediaQuery.addEventListener('change', (e) => {
        this.setTheme(e.matches ? 'dark' : 'light');
      });
    }
  }
});

// 导出初始化函数供外部调用
import { watchEffect } from 'vue';
export function initializeTheme() {
  watchEffect(() => {
    const themeStore = useThemeStore();
    themeStore.initTheme();
  });
}