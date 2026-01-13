import type { Sprint } from '@/data/projects';

/**
 * Notion API Base URL
 * Points to the backend server that handles Notion API calls
 * 
 * Production: Uses Vercel deployment
 * Development: Can override with VITE_NOTION_API_URL env var for local testing
 */
const NOTION_API_BASE = import.meta.env.VITE_NOTION_API_URL || 'https://jagdnotionapiserver.vercel.app/api/notion';

/**
 * Test Notion API connection
 * @returns Promise with success status and message
 */
export async function testNotionConnection(): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    const response = await fetch(`${NOTION_API_BASE}/test`);
    const data = await response.json();
    
    return {
      success: data.success,
      message: data.message,
      data: data.count,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Connection failed: ${error.message}. Make sure the backend server is running on port 3001.`,
    };
  }
}

/**
 * Fetch roadmap data for all projects from Notion
 * @returns Object mapping project slugs to their roadmap sprints
 */
export async function fetchAllRoadmaps(): Promise<Record<string, Sprint[]>> {
  try {
    const response = await fetch(`${NOTION_API_BASE}/roadmap`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch roadmap');
    }

    return result.data;
  } catch (error: any) {
    console.error('Error fetching Notion roadmap:', error);
    throw error;
  }
}

/**
 * Fetch roadmap sprints for a specific project by slug
 * @param projectSlug - The project slug to filter by (e.g., 'scholarlens-ai')
 * @returns Array of Sprint objects for the project
 */
export async function fetchProjectRoadmap(projectSlug: string): Promise<Sprint[]> {
  try {
    const url = `${NOTION_API_BASE}/roadmap?projectSlug=${encodeURIComponent(projectSlug)}`;
    console.log(`📡 Fetching from: ${url}`);
    
    const response = await fetch(url);
    const result = await response.json();
    
    console.log(`📥 Response:`, result);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch project roadmap');
    }

    // Return the roadmap for the specific project (now returns Sprint[] with epics and tickets)
    const roadmapData: Sprint[] = result.data[projectSlug] || result.data || [];
    console.log(`🗺️ Extracted roadmap for ${projectSlug}:`, roadmapData);
    
    return roadmapData;
  } catch (error: any) {
    console.error(`❌ Error fetching roadmap for project ${projectSlug}:`, error);
    throw error;
  }
}

