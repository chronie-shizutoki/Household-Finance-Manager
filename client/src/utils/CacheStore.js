// 缓存存储工具类，封装浏览器Cache API操作
// 增强版：确保在任何环境下都能安全运行，包括SSR和非浏览器环境

/**
 * 安全检测运行环境
 * 使用try-catch避免任何可能的引用错误
 */
const checkEnvironment = () => {
  try {
    // 检测是否为浏览器环境
    const isBrowser = typeof window !== 'undefined' && 
                     typeof window.document !== 'undefined';
    
    // 仅在确认为浏览器环境后再检测Cache API
    let isCacheSupported = false;
    if (isBrowser) {
      // 安全检测caches对象
      isCacheSupported = typeof window.caches !== 'undefined' && 
                        typeof window.caches.open === 'function';
    }
    
    return { isBrowser, isCacheSupported };
  } catch (e) {
    // 任何错误都视为不支持
    console.warn('环境检测失败，将使用内存缓存:', e);
    return { isBrowser: false, isCacheSupported: false };
  }
};

// 执行环境检测
const { isBrowser, isCacheSupported } = checkEnvironment();

// 降级存储：全局内存缓存（适用于非浏览器环境）
const globalMemoryCache = new Map();

export default class CacheStore {
  constructor(cacheName = 'home-money-cache') {
    this.cacheName = cacheName;
    
    // 使用已检测的环境变量，避免重复检测
    this.isBrowser = isBrowser;
    this.isCacheSupported = isCacheSupported;
    
    // 初始化内存缓存（当Cache API不可用时使用）
    this.memoryCache = new Map();
    
    // 记录初始化状态
    if (!this.isCacheSupported) {
      console.info(`CacheStore: 浏览器缓存API不可用，将使用内存缓存 (${cacheName})`);
    }
  }

  /**
   * 获取缓存项（自动选择存储方案）
   * @param {string} key 缓存键
   * @returns {Promise<any>}
   */
  async get(key) {
    // 首先检查是否支持Cache API
    if (!this.isCacheSupported) {
      // 使用内存缓存
      const item = this.memoryCache.get(key);
      // 检查内存缓存中的项是否过期
      if (item && item.expires !== Infinity && item.expires < Date.now()) {
        this.memoryCache.delete(key);
        return null;
      }
      return item ? item.value : null;
    }
    
    try {
      // 安全访问caches对象
      if (!window || !window.caches) {
        throw new Error('Cache API not available');
      }
      
      const cache = await window.caches.open(this.cacheName);
      const response = await cache.match(key);
      if (!response) return null;
      
      const data = await response.json();
      // 检查是否过期
      if (data.ttl && Date.now() - data.timestamp > data.ttl) {
        await cache.delete(key);
        return null;
      }
      
      return data.value;
    } catch (error) {
      console.error('Cache get failed:', error);
      // 异常时回退到内存缓存
      const item = this.memoryCache.get(key);
      // 检查内存缓存中的项是否过期
      if (item && item.expires !== Infinity && item.expires < Date.now()) {
        this.memoryCache.delete(key);
        return null;
      }
      return item ? item.value : null;
    }
  }

  /**
   * 设置缓存项（自动选择存储方案）
   * @param {string} key 缓存键
   * @param {any} value 缓存值
   * @param {number} ttl 过期时间（毫秒，可选）
   */
  async set(key, value, ttl) {
    // 准备缓存数据
    const cacheData = {
      value,
      expires: ttl ? Date.now() + ttl : Infinity
    };
    
    // 更新内存缓存（无论环境如何，都确保内存缓存更新）
    this.memoryCache.set(key, cacheData);
    
    // 如果不支持Cache API，仅使用内存缓存
    if (!this.isCacheSupported) {
      return;
    }
    
    try {
      // 安全访问caches对象
      if (!window || !window.caches) {
        throw new Error('Cache API not available');
      }
      
      const cache = await window.caches.open(this.cacheName);
      const response = new Response(JSON.stringify({ 
        value, 
        timestamp: Date.now(), 
        ttl 
      }));
      await cache.put(key, response);
    } catch (error) {
      console.error('Cache set failed:', error);
      // 错误已记录，内存缓存已更新，无需额外操作
    }
  }

  /**
   * 移除缓存项（自动选择存储方案）
   * @param {string} key 缓存键
   */
  async remove(key) {
    // 无论环境如何，都清除内存缓存
    this.memoryCache.delete(key);
    
    // 如果支持Cache API，也清除浏览器缓存
    if (this.isCacheSupported) {
      try {
        // 安全访问caches对象
        if (!window || !window.caches) {
          throw new Error('Cache API not available');
        }
        
        const cache = await window.caches.open(this.cacheName);
        await cache.delete(key);
      } catch (error) {
        console.error('Cache remove failed:', error);
        // 错误已记录，内存缓存已清除，无需额外操作
      }
    }
  }

  /**
   * 清理过期缓存（自动处理不同存储方案）
   */
  async cleanup() {
    // 清理内存缓存（无论环境如何）
    const now = Date.now();
    this.memoryCache.forEach((value, key) => {
      if (value.expires < now) {
        this.memoryCache.delete(key);
      }
    });
    
    // 如果支持Cache API，也清理浏览器缓存
    if (this.isCacheSupported) {
      try {
        // 安全访问caches对象
        if (!window || !window.caches) {
          throw new Error('Cache API not available');
        }
        
        const cache = await window.caches.open(this.cacheName);
        const keys = await cache.keys();
        for (const key of keys) {
          try {
            const response = await cache.match(key);
            if (!response) continue;
            
            const data = await response.json();
            if (data.ttl && Date.now() - data.timestamp > data.ttl) {
              await cache.delete(key);
            }
          } catch (err) {
            console.error(`Error processing cache key ${key}:`, err);
            // 出错时删除可能损坏的缓存项
            await cache.delete(key);
          }
        }
      } catch (error) {
        console.error('Cache cleanup failed:', error);
        // 错误已记录，内存缓存已清理，无需额外操作
      }
    }
  }
  
  /**
   * 获取带TTL的缓存项（自动选择存储方案）
   * @param {string} key 缓存键
   * @param {number} defaultTTL 默认TTL（毫秒）
   * @returns {Promise<any>} 缓存值
   */
  async getWithTTL(key, defaultTTL = 3600000) {
    try {
      // 尝试从缓存获取
      const cachedItem = await this.get(key);
      
      // 如果缓存存在且未过期，直接返回
      if (cachedItem && cachedItem.timestamp) {
        const isExpired = Date.now() - cachedItem.timestamp > defaultTTL;
        if (!isExpired) {
          return cachedItem.value || cachedItem;
        }
      }
      
      // 缓存不存在或已过期，返回null
      return null;
    } catch (error) {
      console.error('Cache getWithTTL failed:', error);
      return null;
    }
  }
}