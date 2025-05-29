import CacheStore from '@/utils/CacheStore';

export function useCache(namespace = 'default') {
  const cache = new CacheStore(namespace);

  const getCache = async (key) => {
    return await cache.get(key);
  };

  const setCache = async (key, value, ttl) => {
    await cache.set(key, value, ttl);
  };

  return {
    getCache,
    setCache
  };
}