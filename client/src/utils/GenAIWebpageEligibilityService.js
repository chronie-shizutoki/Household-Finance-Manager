import CacheStore from './CacheStore'; 

class GenAIWebpageEligibilityService { 
  constructor() { 
    this.blockListCache = new CacheStore('genai-blocklist'); 
    this.fallbackBlockList = []; 
  } 

  async getExplicitBlockList() { 
    try { 
      // 尝试从缓存获取 
      const cachedItem = await this.blockListCache.get('blocklist');
      const ttl = 24 * 60 * 60 * 1000; // 24小时
      const isExpired = cachedItem?.timestamp && (Date.now() - cachedItem.timestamp > ttl);
      const cachedList = !isExpired ? cachedItem?.value : null; 
      if (cachedList) return cachedList; 
      
      // 缓存未命中则从API获取 
      const response = await fetch('/api/blocklist'); 
      const blockList = await response.json(); 
      
      // 存储到缓存 
      await this.blockListCache.set('blocklist', { 
        value: blockList, 
        timestamp: Date.now() 
      }); 
      
      return blockList; 
    } catch (error) { 
      console.error('Failed to get blocklist from cache or API:', error); 
      return this.fallbackBlockList; 
    } 
  } 

  async _shouldShowTouchpoints() { 
    try { 
      const blockList = await this.getExplicitBlockList(); 
      // 使用blockList进行逻辑判断... 
    } catch (error) { 
      console.error('Error in _shouldShowTouchpoints:', error); 
      return false; // 默认不显示 
    } 
  } 

  async shouldShowTouchpoints() { 
    try { 
      return await this._shouldShowTouchpoints(); 
    } catch (error) { 
      console.error('Error in shouldShowTouchpoints:', error); 
      return false; 
    } 
  } 
} 

export default GenAIWebpageEligibilityService;