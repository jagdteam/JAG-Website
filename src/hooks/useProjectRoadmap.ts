import type { Project, Sprint } from '@/data/projects';
import { fetchProjectRoadmap } from '@/lib/api/notion';
import { useEffect, useState } from 'react';

/**
 * Hook to fetch and manage roadmap data from Notion for a specific project
 * @param project - The project object containing id and optional notionProjectSlug
 * @returns Object containing roadmap data (sprints), loading state, and error
 */
export function useProjectRoadmap(project: Project) {
  const [roadmap, setRoadmap] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadRoadmap() {
      try {
        setLoading(true);
        setError(null);

        // Use notionProjectSlug if provided, otherwise fall back to id
        const slug = project.notionProjectSlug || project.id;
        console.log(`🔍 Fetching roadmap for project: ${project.id} (Notion slug: ${slug})`);
        const data: Sprint[] = await fetchProjectRoadmap(slug);
        console.log(`✅ Received roadmap data:`, data);

        if (mounted) {
          setRoadmap(data);
        }
      } catch (err) {
        console.error(`❌ Error loading roadmap for ${project.id}:`, err);
        if (mounted) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load roadmap';
          setError(errorMessage);
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
  }, [project.id, project.notionProjectSlug]);

  return { roadmap, loading, error };
}
