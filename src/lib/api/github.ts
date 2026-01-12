/**
 * GitHub API Client
 * Connects to JAGD API Server for GitHub data
 */

/**
 * API Base URL - Points to the backend server
 * Production: Uses Vercel deployment
 * Development: Can override with VITE_API_BASE_URL env var for local testing
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://jagdnotionapiserver.vercel.app/api';

export interface GitHubContribution {
  date: string;
  count: number;
}

export interface GitHubContributionCalendar {
  totalContributions: number;
  weeks: Array<{
    contributionDays: GitHubContribution[];
  }>;
}

export interface GitHubCommit {
  id: string;
  date: string;
  week: string;
  type: 'feature' | 'fix' | 'design' | 'infra';
  content: string;
  assignee: string;
  assigneeImg?: string;
}

/**
 * Test GitHub API connection
 * @returns Promise with success status and message
 */
export async function testGitHubConnection(): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    const response = await fetch(`${API_BASE}/github/test`);
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
 * Fetch GitHub contributions for a specific user
 * @param username - GitHub username (e.g., 'giuseppi', 'JohnFok119')
 * @returns Contribution calendar data
 */
export async function fetchGitHubContributions(username: string): Promise<GitHubContribution[]> {
  try {
    const url = `${API_BASE}/github/contributions?username=${encodeURIComponent(username)}`;
    console.log(`📡 Fetching GitHub contributions from: ${url}`);

    const response = await fetch(url);
    const result = await response.json();

    console.log(`📥 Response:`, result);

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch GitHub contributions');
    }

    return result.data;
  } catch (error: any) {
    console.error(`❌ Error fetching GitHub contributions for ${username}:`, error);
    throw error;
  }
}

/**
 * Fetch commits for a specific repository
 * @param repo - Repository in format 'owner/repo' (e.g., 'jagdteam/Education-Project')
 * @returns Array of filtered and processed commits
 */
export async function fetchRepoCommits(repo: string): Promise<GitHubCommit[]> {
  try {
    const url = `${API_BASE}/github/commits?repo=${encodeURIComponent(repo)}`;
    console.log(`📡 Fetching commits from: ${url}`);

    const response = await fetch(url);
    const result = await response.json();

    console.log(`📥 Response:`, result);

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch repository commits');
    }

    return result.data;
  } catch (error: any) {
    console.error(`❌ Error fetching commits for repo ${repo}:`, error);
    throw error;
  }
}
