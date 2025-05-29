// 缓存存储工具类，封装浏览器Cache API操作

// 检测运行环境：浏览器环境且支持Cache API
// 严格检测浏览器环境且支持Cache API（避免SSR等伪浏览器环境）
  const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
  const isCacheSupported = isBrowser && typeof caches !== 'undefined' && typeof caches.open === 'function';

// 降级存储：内存缓存（适用于非浏览器环境）
const memoryCache = new Map();

export default class CacheStore {
  constructor(cacheName = 'home-money-cache') {
    this.cacheName = cacheName;
    this.isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
    this.isCacheSupported = this.isBrowser && typeof caches !== 'undefined' && typeof caches.open === 'function';
    // 初始化内存缓存（当Cache API不可用时使用）
    this.memoryCache = new Map();
  }

  /**
   * 获取缓存项（自动选择存储方案）
   * @param {string} key 缓存键
   * @returns {Promise<any>}
   */
  async get(key) {
    if (!this.isCacheSupported) {
      // 使用内存缓存
      return this.memoryCache.get(key) || null;
    }
    
    try {
      const cache = await caches.open(this.cacheName);
      const response = await cache.match(key);
      return response ? await response.json() : null;
    } catch (error) {
      console.error('Cache get failed:', error);
      // 异常时回退到内存缓存
      return this.memoryCache.get(key) || null;
    }
  }

  /**
   * 设置缓存项（自动选择存储方案）
   * @param {string} key 缓存键
   * @param {any} value 缓存值
   * @param {number} ttl 过期时间（毫秒，可选）
   */
  async set(key, value, ttl) {
    if (!this.isCacheSupported) {
      // 使用内存缓存
      this.memoryCache.set(key, {
        value,
        expires: ttl ? Date.now() + ttl : Infinity
      });
      return;
    }
    
    try {
      const cache = await caches.open(this.cacheName);
      const response = new Response(JSON.stringify({ value, timestamp: Date.now(), ttl }));
      await cache.put(key, response);
      // 同步更新内存缓存
      this.memoryCache.set(key, {
        value,
        expires: ttl ? Date.now() + ttl : Infinity
      });
    } catch (error) {
      console.error('Cache set failed:', error);
      // 异常时使用内存缓存
      this.memoryCache.set(key, {
        value,
        expires: ttl ? Date.now() + ttl : Infinity
      });
    }
  }

  /**
   * 移除缓存项（自动选择存储方案）
   * @param {string} key 缓存键
   */
  async remove(key) {
    if (this.isCacheSupported) {
      // 使用浏览器Cache API
      const cache = await caches.open(this.cacheName);
      await cache.delete(key);
    } else {
      // 使用内存缓存
      this.memoryCache.delete(key);
    }
  }

  /**
   * 清理过期缓存（自动处理不同存储方案）
   */
  async cleanup() {
    if (this.isCacheSupported) {
      // 清理浏览器Cache API
      const cache = await caches.open(this.cacheName);
      const keys = await cache.keys();
      for (const key of keys) {
        const response = await cache.match(key);
        const { timestamp, ttl } = await response.json();
        if (ttl && Date.now() - timestamp > ttl) {
          await cache.delete(key);
        }
      }
    } else {
      // 清理内存缓存
      const now = Date.now();
      this.memoryCache.forEach((value, key) => {
        if (value.expires < now) {
          this.memoryCache.delete(key);
        }
      });
    }
  }
}