/**
 * LeetCode API Client
 * Connects to JAGD API Server for LeetCode data
 */

/**
 * API Base URL - Points to the backend server
 * Production: Uses Vercel deployment
 * Development: Can override with VITE_API_BASE_URL env var for local testing
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://jagdnotionapiserver.vercel.app/api';

export interface LeetCodeSubmission {
  date: string;
  count: number;
}

export interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  recentSubmissions: LeetCodeSubmission[];
}

/**
 * Test LeetCode API connection
 * @returns Promise with success status and message
 */
export async function testLeetCodeConnection(): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    const response = await fetch(`${API_BASE}/leetcode/test`);
    const data = await response.json();

    return {
      success: data.success,
      message: data.message,
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Connection failed: ${error.message}`,
    };
  }
}

/**
 * Fetch LeetCode stats for a specific user
 * @param username - LeetCode username (e.g., 'giuseppi', 'LupusOW')
 * @returns LeetCode statistics and submission history
 */
export async function fetchLeetCodeStats(username: string): Promise<LeetCodeStats | null> {
  if (!username) {
    console.warn('⚠️  No LeetCode username provided');
    return null;
  }

  try {
    const url = `${API_BASE}/leetcode/stats?username=${encodeURIComponent(username)}`;
    console.log(`📡 Fetching LeetCode stats from: ${url}`);

    const response = await fetch(url);
    const result = await response.json();

    console.log(`📥 Response:`, result);

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch LeetCode stats');
    }

    return result.data;
  } catch (error: any) {
    console.error(`❌ Error fetching LeetCode stats for ${username}:`, error);
    // Return null instead of throwing - LeetCode is optional
    return null;
  }
}
