/**
 * EXAMPLE FILE: How to integrate Notion roadmap data with your projects
 * 
 * This file demonstrates how to fetch roadmap items from Notion
 * and merge them with your existing project data in projects.ts
 */

import { fetchProjectRoadmap, NotionRoadmapItem } from './notion';
import { ProjectPhase } from '@/data/projects';

/**
 * Convert Notion roadmap items to ProjectPhase format
 * @param notionItems - Array of items from Notion
 * @param projectSlug - The project slug to organize items by phase
 * @returns Array of ProjectPhase objects
 */
export function convertNotionToProjectPhases(
  notionItems: NotionRoadmapItem[],
  projectSlug: string
): ProjectPhase[] {
  // Group items by their name (assuming phases are named like "Phase 1: ...", "Phase 2: ...", etc.)
  const phaseMap = new Map<string, NotionRoadmapItem[]>();

  notionItems.forEach(item => {
    const phaseName = item.name;
    if (!phaseMap.has(phaseName)) {
      phaseMap.set(phaseName, []);
    }
    phaseMap.get(phaseName)!.push(item);
  });

  // Convert to ProjectPhase format
  const phases: ProjectPhase[] = Array.from(phaseMap.entries()).map(([phaseName, items], index) => {
    // Extract status from the first item (or determine based on all items)
    const status = items[0]?.status === 'completed' 
      ? 'completed' 
      : items[0]?.status === 'in-progress' 
      ? 'in-progress' 
      : 'planned';

    return {
      id: `${projectSlug}-phase-${index + 1}`,
      name: phaseName,
      status,
      date: '', // You'll need to add a date field in Notion or calculate it
      items: items.map(item => item.summary),
    };
  });

  return phases;
}

/**
 * Fetch and format roadmap for a specific project
 * @param projectSlug - The slug of the project (e.g., "scholarlens-ai")
 * @returns Promise with array of ProjectPhase objects
 */
export async function getProjectRoadmapFromNotion(
  projectSlug: string
): Promise<ProjectPhase[]> {
  try {
    const notionItems = await fetchProjectRoadmap(projectSlug);
    return convertNotionToProjectPhases(notionItems, projectSlug);
  } catch (error) {
    console.error(`Error fetching roadmap for ${projectSlug}:`, error);
    return [];
  }
}

/**
 * EXAMPLE USAGE IN A REACT COMPONENT:
 * 
 * import { useEffect, useState } from 'react';
 * import { getProjectRoadmapFromNotion } from '@/lib/notionProjectIntegration.example';
 * import { ProjectPhase } from '@/data/projects';
 * 
 * function ProjectRoadmap({ projectSlug }: { projectSlug: string }) {
 *   const [roadmap, setRoadmap] = useState<ProjectPhase[]>([]);
 *   const [loading, setLoading] = useState(true);
 * 
 *   useEffect(() => {
 *     async function loadRoadmap() {
 *       try {
 *         const data = await getProjectRoadmapFromNotion(projectSlug);
 *         setRoadmap(data);
 *       } catch (error) {
 *         console.error('Failed to load roadmap:', error);
 *       } finally {
 *         setLoading(false);
 *       }
 *     }
 * 
 *     loadRoadmap();
 *   }, [projectSlug]);
 * 
 *   if (loading) return <div>Loading roadmap...</div>;
 * 
 *   return (
 *     <div>
 *       {roadmap.map(phase => (
 *         <div key={phase.id}>
 *           <h3>{phase.name}</h3>
 *           <span>{phase.status}</span>
 *           <ul>
 *             {phase.items.map((item, idx) => (
 *               <li key={idx}>{item}</li>
 *             ))}
 *           </ul>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 */

/**
 * EXAMPLE: Fetch roadmap on server/build time and merge with static data
 * 
 * This approach is useful if you want to keep some data static and only
 * fetch specific parts from Notion.
 */
export async function enrichProjectWithNotionData<T extends { id: string }>(
  project: T,
  notionSlug: string
): Promise<T & { roadmap: ProjectPhase[] }> {
  const roadmap = await getProjectRoadmapFromNotion(notionSlug);
  
  return {
    ...project,
    roadmap,
  };
}

