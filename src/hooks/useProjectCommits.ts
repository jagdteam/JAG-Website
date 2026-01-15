import { useEffect, useState } from 'react';
import { fetchRepoCommits, type GitHubCommit } from '@/lib/api/github';

/**
 * Hook to fetch and manage commits for a specific project repository
 * @param repo - Repository in format 'owner/repo' (e.g., 'jagdteam/Education-Project')
 * @returns Object containing commits data, loading state, and error
 */
export function useProjectCommits(repo: string | undefined) {
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadCommits() {
      try {
        setLoading(true);
        setError(null);

        if (!repo) {
          if (import.meta.env.DEV) {
            console.log('⚠️  No repository provided, skipping commits fetch');
          }
          if (mounted) {
            setCommits([]);
            setLoading(false);
          }
          return;
        }

        if (import.meta.env.DEV) {
          console.log(`🔍 Fetching commits for repo: ${repo}`);
        }
        const data = await fetchRepoCommits(repo);
        if (import.meta.env.DEV) {
          console.log(`✅ Received ${data.length} commits`);
        }

        if (mounted) {
          setCommits(data);
        }
      } catch (err: any) {
        if (import.meta.env.DEV) {
          console.error(`❌ Error loading commits for ${repo}:`, err);
        }
        if (mounted) {
          setError(err.message || 'Failed to load project commits');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadCommits();

    return () => {
      mounted = false;
    };
  }, [repo]);

  return { commits, loading, error };
}
