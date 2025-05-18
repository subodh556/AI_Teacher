/**
 * AI Model Caching and Optimization
 * 
 * This file contains utilities for caching AI model responses to improve performance
 * and reduce API calls.
 */

import { createHash } from 'crypto';

// In-memory cache for model responses
const responseCache = new Map<string, {
  response: string;
  timestamp: number;
  ttl: number;
}>();

/**
 * Generates a cache key from the input parameters
 * @param model - The model name
 * @param prompt - The prompt text
 * @param options - Additional options that affect the response
 * @returns A hash string to use as a cache key
 */
function generateCacheKey(model: string, prompt: string, options?: Record<string, any>): string {
  const input = JSON.stringify({
    model,
    prompt,
    options
  });
  
  return createHash('md5').update(input).digest('hex');
}

/**
 * Caches a model response
 * @param model - The model name
 * @param prompt - The prompt text
 * @param response - The model's response
 * @param options - Additional options that affect the response
 * @param ttl - Time to live in milliseconds (default: 1 hour)
 */
export function cacheModelResponse(
  model: string,
  prompt: string,
  response: string,
  options?: Record<string, any>,
  ttl: number = 3600000 // 1 hour default
): void {
  const cacheKey = generateCacheKey(model, prompt, options);
  
  responseCache.set(cacheKey, {
    response,
    timestamp: Date.now(),
    ttl
  });
  
  // Clean up expired cache entries
  cleanExpiredCache();
}

/**
 * Retrieves a cached response if available
 * @param model - The model name
 * @param prompt - The prompt text
 * @param options - Additional options that affect the response
 * @returns The cached response or null if not found or expired
 */
export function getCachedResponse(
  model: string,
  prompt: string,
  options?: Record<string, any>
): string | null {
  const cacheKey = generateCacheKey(model, prompt, options);
  const cachedItem = responseCache.get(cacheKey);
  
  if (!cachedItem) {
    return null;
  }
  
  // Check if the cached item has expired
  if (Date.now() - cachedItem.timestamp > cachedItem.ttl) {
    responseCache.delete(cacheKey);
    return null;
  }
  
  return cachedItem.response;
}

/**
 * Clears all cached responses
 */
export function clearModelCache(): void {
  responseCache.clear();
}

/**
 * Removes expired items from the cache
 */
function cleanExpiredCache(): void {
  const now = Date.now();
  
  for (const [key, value] of responseCache.entries()) {
    if (now - value.timestamp > value.ttl) {
      responseCache.delete(key);
    }
  }
}

/**
 * Gets the current cache size
 * @returns The number of items in the cache
 */
export function getCacheSize(): number {
  return responseCache.size;
}

/**
 * Optimizes a prompt for the AI model
 * @param prompt - The original prompt
 * @returns An optimized prompt
 */
export function optimizePrompt(prompt: string): string {
  // Remove excessive whitespace
  let optimized = prompt.trim().replace(/\s+/g, ' ');
  
  // Ensure the prompt ends with a question mark if it's a question
  if (optimized.match(/^(what|how|why|when|where|who|can|could|would|will|is|are|do|does|did)/i) && !optimized.endsWith('?')) {
    optimized += '?';
  }
  
  return optimized;
}
