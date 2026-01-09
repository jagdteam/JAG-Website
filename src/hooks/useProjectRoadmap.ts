import { useEffect, useState } from 'react';
import { fetchProjectRoadmap } from '@/lib/notion';
import type { ProjectPhase } from '@/data/projects';

/**
 * Hook to fetch and manage roadmap data from Notion for a specific project
 * @param projectId - The project ID/slug (e.g., 'scholarlens-ai')
 * @returns Object containing roadmap data, loading state, and error
 */
export function useProjectRoadmap(projectId: string) {
  const [roadmap, setRoadmap] = useState<ProjectPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadRoadmap() {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`🔍 Fetching roadmap for project: ${projectId}`);
        const data = await fetchProjectRoadmap(projectId);
        console.log(`✅ Received roadmap data:`, data);
        
        if (mounted) {
          setRoadmap(data);
        }
      } catch (err: any) {
        console.error(`❌ Error loading roadmap for ${projectId}:`, err);
        if (mounted) {
          setError(err.message || 'Failed to load roadmap');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadRoadmap();

    return () => {
      mounted = false;
    };
  }, [projectId]);

  return { roadmap, loading, error };
}

