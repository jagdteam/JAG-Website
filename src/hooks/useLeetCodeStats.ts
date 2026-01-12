import { useEffect, useState } from 'react';
import { fetchLeetCodeStats, type LeetCodeStats } from '@/lib/api/leetcode';

/**
 * Hook to fetch and manage LeetCode stats for a specific user
 * @param username - LeetCode username (e.g., 'giuseppi', 'LupusOW')
 * @returns Object containing stats data, loading state, and error
 */
export function useLeetCodeStats(username: string) {
  const [stats, setStats] = useState<LeetCodeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadStats() {
      try {
        setLoading(true);
        setError(null);

        if (!username) {
          console.log('⚠️  No LeetCode username provided, skipping');
          if (mounted) {
            setStats(null);
            setLoading(false);
          }
          return;
        }

        console.log(`🔍 Fetching LeetCode stats for: ${username}`);
        const data = await fetchLeetCodeStats(username);
        console.log(`✅ Received LeetCode stats:`, data);

        if (mounted) {
          setStats(data);
        }
      } catch (err: any) {
        console.error(`❌ Error loading LeetCode stats for ${username}:`, err);
        if (mounted) {
          setError(err.message || 'Failed to load LeetCode stats');
          setStats(null); // LeetCode is optional, so null is okay
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      mounted = false;
    };
  }, [username]);

  return { stats, loading, error };
}
