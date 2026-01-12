import { useEffect, useState } from 'react';
import { fetchGitHubContributions, type GitHubContribution } from '@/lib/api/github';

/**
 * Hook to fetch and manage GitHub contributions for a specific user
 * @param username - GitHub username (e.g., 'giuseppi', 'JohnFok119')
 * @returns Object containing contributions data, loading state, and error
 */
export function useGitHubContributions(username: string) {
  const [contributions, setContributions] = useState<GitHubContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadContributions() {
      try {
        setLoading(true);
        setError(null);

        console.log(`🔍 Fetching GitHub contributions for: ${username}`);
        const data = await fetchGitHubContributions(username);
        console.log(`✅ Received ${data.length} contribution days`);

        if (mounted) {
          setContributions(data);
        }
      } catch (err: any) {
        console.error(`❌ Error loading GitHub contributions for ${username}:`, err);
        if (mounted) {
          setError(err.message || 'Failed to load GitHub contributions');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (username) {
      loadContributions();
    } else {
      setLoading(false);
      setContributions([]);
    }

    return () => {
      mounted = false;
    };
  }, [username]);

  return { contributions, loading, error };
}
