import type { Sprint } from '@/data/projects';

/**
 * Notion API Base URL
 * Points to the backend server that handles Notion API calls
 * 
 * Production: Uses Vercel deployment
 * Development: Can override with VITE_NOTION_API_URL env var for local testing
 */
const NOTION_API_BASE = 'https://jagdnotionapiserver.vercel.app/api/notion';

/**
 * Cache duration in milliseconds (24 hours)
 */
const CACHE_DURATION = 24 * 60 * 60 * 1000;

/**
 * Cache key prefix for localStorage
 */
const CACHE_KEY_PREFIX = 'notion_cache_';

/**
 * Interface for cached data
 */
interface CachedData<T> {
  data: T;
  timestamp: number;
}

/**
 * Get data from cache if valid
 * @param key - Cache key
 * @returns Cached data if valid, null otherwise
 */
function getCachedData<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY_PREFIX + key);
    if (!cached) return null;

    const { data, timestamp }: CachedData<T> = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is still valid (less than 24 hours old)
    if (now - timestamp < CACHE_DURATION) {
      console.log(`✅ Using cached data for: ${key} (age: ${Math.round((now - timestamp) / 1000 / 60)} minutes)`);
      return data;
    }

    // Cache expired, remove it
    console.log(`⏰ Cache expired for: ${key}`);
    localStorage.removeItem(CACHE_KEY_PREFIX + key);
    return null;
  } catch (error) {
    console.warn(`⚠️  Error reading cache for ${key}:`, error);
    return null;
  }
}

/**
 * Store data in cache
 * @param key - Cache key
 * @param data - Data to cache
 */
function setCachedData<T>(key: string, data: T): void {
  try {
    const cached: CachedData<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(cached));
    console.log(`💾 Cached data for: ${key}`);
  } catch (error) {
    console.warn(`⚠️  Error setting cache for ${key}:`, error);
  }
}

/**
 * Clear all Notion cache
 */
export function clearNotionCache(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    console.log(`🗑️  Cleared all Notion cache`);
  } catch (error) {
    console.warn(`⚠️  Error clearing cache:`, error);
  }
}

/**
 * Test Notion API connection
 * @returns Promise with success status and message
 */
export async function testNotionConnection(): Promise<{
  success: boolean;
  message: string;
  data?: unknown;
}> {
  try {
    const response = await fetch(`${NOTION_API_BASE}/test`);
    const data = await response.json();
    
    return {
      success: data.success,
      message: data.message,
      data: data.count,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}. Make sure the backend server is running on port 3001.`,
    };
  }
}

/**
 * Fetch roadmap data for all projects from Notion (with caching)
 * @returns Object mapping project slugs to their roadmap sprints
 */
export async function fetchAllRoadmaps(): Promise<Record<string, Sprint[]>> {
  const cacheKey = 'all_roadmaps';
  
  // Try to get from cache first
  const cached = getCachedData<Record<string, Sprint[]>>(cacheKey);
  if (cached) {
    return cached;
  }

  // Cache miss, fetch from API
  try {
    console.log(`📡 Fetching all roadmaps from API...`);
    const response = await fetch(`${NOTION_API_BASE}/sprints`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch roadmap');
    }

    // Cache the result
    setCachedData(cacheKey, result.data);
    
    return result.data;
  } catch (error: unknown) {
    console.error('Error fetching Notion roadmap:', error);
    throw new Error('Failed to fetch roadmap');
  }
}

/**
 * Fetch roadmap sprints for a specific project by slug (with caching)
 * @param projectSlug - The project slug to filter by (e.g., 'scholarlens-ai')
 * @returns Array of Sprint objects for the project
 */
export async function fetchProjectRoadmap(projectSlug: string): Promise<Sprint[]> {
  const cacheKey = `roadmap_${projectSlug}`;
  
  // Try to get from cache first
  const cached = getCachedData<Sprint[]>(cacheKey);
  if (cached) {
    return cached;
  }

  // Cache miss, fetch from API
  try {
    const url = `${NOTION_API_BASE}/sprints?projectSlug=${encodeURIComponent(projectSlug)}`;
    console.log(`📡 Fetching roadmap from: ${url}`);
    
    const response = await fetch(url);
    const result = await response.json();
    
    console.log(`📥 Response:`, result);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch project roadmap');
    }

    // Backend now returns Sprint[] directly
    const roadmapData: Sprint[] = Array.isArray(result.data) ? result.data : [];
    console.log(`✅ Received ${roadmapData.length} sprints for ${projectSlug}`);
    
    // Cache the result
    setCachedData(cacheKey, roadmapData);
    
    return roadmapData;
  } catch (error: unknown) {
    console.error(`❌ Error fetching roadmap for project ${projectSlug}:`, error);
    throw new Error('Failed to fetch roadmap');
  }
}

