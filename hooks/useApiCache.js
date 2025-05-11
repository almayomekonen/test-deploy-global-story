import { useState, useEffect, useCallback } from "react";
import api from "../config/axios";

const cache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000;

const useApiCache = (url, dependencies = [], options = {}) => {
  const {
    cacheDuration = CACHE_EXPIRY,
    queryParams = {},
    forceRefresh = false,
    initialData = null,
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryString = Object.entries(queryParams)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

  const fullUrl = queryString ? `${url}?${queryString}` : url;
  const cacheKey = fullUrl;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!forceRefresh && cache.has(cacheKey)) {
        const cachedData = cache.get(cacheKey);
        if (Date.now() - cachedData.timestamp < cacheDuration) {
          setData(cachedData.data);
          setLoading(false);
          return;
        }
      }

      const response = await api.get(fullUrl);
      const responseData = response.data;

      setData(responseData);

      cache.set(cacheKey, {
        data: responseData,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error(`Error fetching from ${fullUrl}:`, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fullUrl, cacheDuration, cacheKey, forceRefresh]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (dependencies.length > 0) {
      fetchData();
    }
  }, [dependencies, fetchData]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export const clearCacheItem = (url) => {
  if (cache.has(url)) {
    cache.delete(url);
    return true;
  }
  return false;
};

export const clearCache = () => {
  cache.clear();
};

export default useApiCache;
