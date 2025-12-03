import { useCallback } from "react";

// Cache global para evitar llamadas duplicadas
const planCache = new Map<
  string,
  {
    data: any;
    timestamp: number;
    weekPlan: any;
  }
>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const usePlannerCache = () => {
  const clearCache = useCallback(() => {
    planCache.clear();
  }, []);

  const clearCacheForUser = useCallback((userId: string) => {
    const keys = Array.from(planCache.keys());
    const userKeys = keys.filter((key) => key.includes(userId));
    userKeys.forEach((key) => planCache.delete(key));
  }, []);

  const getCachedPlan = useCallback((requestId: string) => {
    const cachedData = planCache.get(requestId);
    const now = Date.now();

    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      return cachedData;
    }
    return null;
  }, []);

  const setCachedPlan = useCallback(
    (requestId: string, data: any, weekPlan: any) => {
      planCache.set(requestId, {
        data,
        timestamp: Date.now(),
        weekPlan,
      });
    },
    [],
  );

  const invalidateCache = useCallback(
    (pattern?: string) => {
      if (!pattern) {
        clearCache();
        return;
      }

      const keys = Array.from(planCache.keys());
      const keysToDelete = keys.filter((key) => key.includes(pattern));
      keysToDelete.forEach((key) => planCache.delete(key));
    },
    [clearCache],
  );

  return {
    clearCache,
    clearCacheForUser,
    getCachedPlan,
    setCachedPlan,
    invalidateCache,
  };
};

