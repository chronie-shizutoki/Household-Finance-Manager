/**
 * Vite配置
 * @module vite.config
 * @description 客户端Vite构建配置
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

/**
 * Vite配置对象
 * @type {import('vite').UserConfig}
 */
export default defineConfig({  build: {
    target: 'esnext' // 提升目标环境版本以支持现代CSS特性（如嵌套语法）
  },
  
  base: '/', // 确保构建资源路径为根目录
  assetsDir: 'assets', // 静态资源存放目录（与服务器public目录结构一致）
  server: {
    host: '0.0.0.0', // 监听所有网络接口，支持局域网访问
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://192.168.0.197:3001', // 替换为后端实际局域网IP
        secure: false,
        changeOrigin: true,
      }
    },
    historyApiFallback: true
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // 强制使用本地内存缓存实现，覆盖第三方冲突的CacheStore类
      'CacheStore': path.resolve(__dirname, './src/utils/CacheStore.js')
    }
  }
})