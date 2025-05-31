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
      if (cachedList) {
        console.log('GenAIWebpageEligibilityService: Blocklist loaded from cache.');
        return cachedList;
      }
     
      // 缓存未命中则从API获取
      console.log('GenAIWebpageEligibilityService: Fetching blocklist from API...');
      const response = await fetch('/api/blocklist');
     
      // 检查响应是否成功
      if (!response.ok) {
        const errorText = await response.text(); // 尝试获取非JSON的错误文本
        throw new Error(`API responded with status ${response.status}: ${errorText}`);
      }

      // 检查Content-Type是否为JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        throw new Error(`API response is not JSON. Content-Type: ${contentType}. Response: ${errorText}`);
      }

      const blockList = await response.json();
     
      // 存储到缓存
      await this.blockListCache.set('blocklist', {
        value: blockList,
        timestamp: Date.now()
      });
     
      console.log('GenAIWebpageEligibilityService: Blocklist fetched and cached successfully.');
      return blockList;
    } catch (error) {
      console.error('GenAIWebpageEligibilityService: Failed to get blocklist from cache or API:', error);
      return this.fallbackBlockList;
    }
  }

  async _shouldShowTouchpoints() {
    try {
      const blockList = await this.getExplicitBlockList();
      // 使用blockList进行逻辑判断...
      // 您的原始逻辑在这里，例如：
      // return !blockList.includes(window.location.hostname);
      console.log('GenAIWebpageEligibilityService: Blocklist received for touchpoints logic.');
      return true; // 临时返回 true，直到您添加实际的判断逻辑
    } catch (error) {
      console.error('GenAIWebpageEligibilityService: Error in _shouldShowTouchpoints:', error);
      return false; // 默认不显示
    }
  }

  async shouldShowTouchpoints() {
    try {
      return await this._shouldShowTouchpoints();
    } catch (error) {
      console.error('GenAIWebpageEligibilityService: Error in shouldShowTouchpoints:', error);
      return false;
    }
  }
}

export default GenAIWebpageEligibilityService;
