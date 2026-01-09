#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manually load .env file
const envPath = path.resolve(__dirname, '..', '.env');
try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log(`📄 .env file found at: ${envPath}`);

  // Parse all environment variables from .env
  const envLines = envContent.split('\n');
  let tokenCount = 0;

  for (const line of envLines) {
    const match = line.match(/^([A-Z_]+)=(.+)$/);
    if (match) {
      const [, key, value] = match;
      process.env[key] = value.trim();
      if (key.includes('GITHUB_TOKEN')) {
        tokenCount++;
      }
    }
  }

  console.log(`✓ Loaded ${tokenCount} GitHub token(s) from .env`);
} catch (e) {
  console.warn('⚠️  Could not load .env file:', envPath);
  console.error('Error details:', e);
}

// Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const FIVE_MONTHS_AGO = new Date();
FIVE_MONTHS_AGO.setMonth(FIVE_MONTHS_AGO.getMonth() - 5);

// Team member configuration
interface TeamMemberConfig {
  name: string;
  github: string;
  leetcode: string;
  githubToken?: string; // Optional: personal token to show private contributions
}

// Optional: Add individual tokens for each member to show private contributions
// Add tokens to .env: ANDREW_GITHUB_TOKEN, GIUSEPPI_GITHUB_TOKEN, etc.
const teamMembers: TeamMemberConfig[] = [
  { name: 'Andrew Espinosa', github: 'adespinosa14', leetcode: 'adespinosa2002', githubToken: process.env.ANDREW_GITHUB_TOKEN },
  { name: 'Giuseppi Pelayo', github: 'giuseppi', leetcode: 'giuseppi', githubToken: process.env.GIUSEPPI_GITHUB_TOKEN },
  { name: 'Johnny Fok', github: 'JohnFok119', leetcode: 'LupusOW', githubToken: process.env.JOHNNY_GITHUB_TOKEN },
  { name: 'Dylan Nguyen', github: 'DylanN143', leetcode: '', githubToken: process.env.DYLAN_GITHUB_TOKEN },
];

// Project configuration
const projects = [
  { id: 'scholarlens-ai', repo: 'jagdteam/Education-Project', isPrivate: true }, // Private repo
  { id: 'clicr-cli', repo: 'jagdteam/clicr' },
  { id: 'codelens', repo: 'jagdteam/CodeLens' },
  { id: 'clutch', repo: 'jagdteam/Clutch', isPrivate: true }, // Private repo (in planning)
];

interface GitHubContribution {
  date: string;
  count: number;
}

interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  recentSubmissions: Array<{ date: string; count: number }>;
}

interface DevLogEntry {
  id: string;
  date: string;
  week: string;
  type: 'feature' | 'fix' | 'design' | 'infra';
  content: string;
  assignee: string;
  assigneeImg?: string;
}

// GitHub API helper
async function fetchGitHub(url: string) {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'JAGD-Website-Sync',
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Fetch GitHub contributions for a user (includes private repos when using personal token)
async function fetchGitHubContributions(username: string, userToken?: string): Promise<GitHubContribution[]> {
  const token = userToken || GITHUB_TOKEN;

  if (!token) {
    console.warn(`⚠️  No token available for ${username}, skipping GitHub contributions`);
    return [];
  }

  try {
    // Use GitHub GraphQL API to get contribution data
    // NOTE: Private contributions are included when:
    // 1. Using a personal access token with 'repo' scope
    // 2. Querying your own contributions (the token owner's username)
    // 3. For organization repos, the token must have access to those repos
    const query = `
      query($username: String!, $from: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      username,
      from: FIVE_MONTHS_AGO.toISOString(),
    };

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error(`❌ GitHub GraphQL API errors for ${username}:`, JSON.stringify(data.errors, null, 2));
      return [];
    }

    if (!data.data) {
      console.error(`❌ No data returned from GitHub API for ${username}`);
      return [];
    }

    const weeks = data.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
    const contributions: GitHubContribution[] = [];

    weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        contributions.push({
          date: day.date,
          count: day.contributionCount,
        });
      });
    });

    return contributions;
  } catch (error) {
    console.error(`Error fetching GitHub contributions for ${username}:`, error);
    return [];
  }
}

// Fetch LeetCode stats (using unofficial API)
async function fetchLeetCodeStats(username: string): Promise<LeetCodeStats | null> {
  if (!username) return null;

  try {
    // LeetCode GraphQL endpoint
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': `https://leetcode.com/${username}/`,
      },
      body: JSON.stringify({
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              submitStats {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
              userCalendar {
                submissionCalendar
              }
            }
          }
        `,
        variables: { username },
      }),
    });

    const data = await response.json();
    const user = data.data?.matchedUser;

    if (!user) {
      console.warn(`No LeetCode data found for ${username}`);
      return null;
    }

    // Parse submission stats
    const stats = user.submitStats.acSubmissionNum;
    const totalSolved = stats.find((s: any) => s.difficulty === 'All')?.count || 0;
    const easySolved = stats.find((s: any) => s.difficulty === 'Easy')?.count || 0;
    const mediumSolved = stats.find((s: any) => s.difficulty === 'Medium')?.count || 0;
    const hardSolved = stats.find((s: any) => s.difficulty === 'Hard')?.count || 0;

    // Parse calendar data
    const calendar = JSON.parse(user.userCalendar.submissionCalendar);
    const recentSubmissions: Array<{ date: string; count: number }> = [];

    Object.entries(calendar).forEach(([timestamp, count]) => {
      const date = new Date(parseInt(timestamp) * 1000);
      if (date >= FIVE_MONTHS_AGO) {
        recentSubmissions.push({
          date: date.toISOString().split('T')[0],
          count: count as number,
        });
      }
    });

    return {
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      recentSubmissions,
    };
  } catch (error) {
    console.error(`Error fetching LeetCode stats for ${username}:`, error);
    return null;
  }
}

// Fetch commits for a repository
async function fetchRepoCommits(repo: string, isPrivate: boolean = false): Promise<DevLogEntry[]> {
  try {
    // Fetch 100 commits to ensure we get enough from team members (filtering out forked repo commits)
    const commits = await fetchGitHub(`https://api.github.com/repos/${repo}/commits?per_page=100`);

    const devLog: DevLogEntry[] = commits
      .map((commit: any, index: number) => {
        const authorName = commit.commit.author.name;
        const authorEmail = commit.commit.author.email;
        const commitDate = new Date(commit.commit.author.date);
        const message = commit.commit.message.split('\n')[0]; // First line only

        // Find matching team member
        const teamMember = teamMembers.find(
          (m) =>
            m.name.toLowerCase().includes(authorName.toLowerCase()) ||
            authorName.toLowerCase().includes(m.name.split(' ')[0].toLowerCase()) ||
            authorName.toLowerCase().includes(m.name.split(' ')[1]?.toLowerCase() || '') ||
            // Also check GitHub username if available
            (m.github && (authorEmail.toLowerCase().includes(m.github.toLowerCase()) || authorName.toLowerCase().includes(m.github.toLowerCase())))
        );

        // Return null if not a team member - we'll filter these out
        if (!teamMember) {
          return null;
        }

        // Infer commit type from message
        let type: DevLogEntry['type'] = 'infra';
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.startsWith('fix:') || lowerMessage.includes('fix') || lowerMessage.includes('bug')) {
          type = 'fix';
        } else if (lowerMessage.startsWith('feat:') || lowerMessage.includes('feature') || lowerMessage.includes('add')) {
          type = 'feature';
        } else if (lowerMessage.includes('design') || lowerMessage.includes('ui') || lowerMessage.includes('style')) {
          type = 'design';
        }

        // Calculate week
        const weekNumber = Math.ceil((Date.now() - commitDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
        const week = weekNumber === 0 ? 'This Week' : `Week ${weekNumber}`;

        return {
          id: commit.sha.substring(0, 8),
          date: commitDate.toISOString().split('T')[0],
          week,
          type,
          content: message,
          assignee: teamMember.name,
          assigneeImg: getTeamMemberImage(teamMember.name),
        };
      })
      .filter((entry): entry is DevLogEntry => entry !== null) // Remove non-team member commits
      .slice(0, 15); // Keep only the 15 most recent team commits

    return devLog;
  } catch (error: any) {
    if (error.message?.includes('409')) {
      console.warn(`⚠️  Repo ${repo} is empty (no commits yet)`);
    } else {
      console.error(`Error fetching commits for ${repo}:`, error);
    }
    return [];
  }
}

// Helper to get team member image path
function getTeamMemberImage(name: string): string | undefined {
  const imageMap: Record<string, string> = {
    'Giuseppi Pelayo': '/assets/g_pfp.jpg',
    'Johnny Fok': '/assets/jf_pfp.jpg',
    'Dylan Nguyen': '/assets/dn_pfp.jpg',
  };
  return imageMap[name];
}

// Main sync function
async function syncData() {
  console.log('🔄 Starting data sync...\n');

  // 1. Sync team stats
  console.log('📊 Fetching team member stats...');
  const teamStats: any[] = [];

  for (const member of teamMembers) {
    console.log(`  - ${member.name}`);

    const githubContributions = await fetchGitHubContributions(member.github, member.githubToken);
    const leetcodeStats = await fetchLeetCodeStats(member.leetcode);

    teamStats.push({
      name: member.name,
      github: {
        username: member.github,
        contributions: githubContributions,
      },
      leetcode: leetcodeStats
        ? {
            username: member.leetcode,
            stats: leetcodeStats,
          }
        : null,
    });

    // Rate limiting delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Write teamStats.ts
  const teamStatsPath = path.join(process.cwd(), 'src', 'data', 'teamStats.ts');
  const teamStatsContent = `// Auto-generated by scripts/sync-data.ts
// Last updated: ${new Date().toISOString()}

export interface TeamMemberStats {
  name: string;
  github: {
    username: string;
    contributions: Array<{ date: string; count: number }>;
  };
  leetcode: {
    username: string;
    stats: {
      totalSolved: number;
      easySolved: number;
      mediumSolved: number;
      hardSolved: number;
      recentSubmissions: Array<{ date: string; count: number }>;
    };
  } | null;
}

export const teamStats: TeamMemberStats[] = ${JSON.stringify(teamStats, null, 2)};
`;

  fs.writeFileSync(teamStatsPath, teamStatsContent, 'utf-8');
  console.log(`✅ Team stats written to ${teamStatsPath}\n`);

  // 2. Sync project dev logs
  console.log('📝 Fetching project commits...');

  // Read existing projects.ts
  const projectsPath = path.join(process.cwd(), 'src', 'data', 'projects.ts');
  let projectsContent = fs.readFileSync(projectsPath, 'utf-8');

  for (const project of projects) {
    console.log(`  - ${project.id} (${project.repo})`);

    const devLog = await fetchRepoCommits(project.repo, project.isPrivate);

    // Update devLog in the file content
    // Format as TypeScript array, not JSON string
    const devLogStr =
      devLog.length === 0
        ? '[]'
        : '[\n' + devLog.map((entry) => '      ' + JSON.stringify(entry, null, 6).replace(/\n/g, '\n      ')).join(',\n') + '\n]';

    // Find and replace the devLog array for this project
    // Use a more robust pattern that handles nested brackets
    const projectPattern = new RegExp(`(id: '${project.id}',[\\s\\S]*?devLog: )\\[[\\s\\S]*?\\](,?\\s*})`, 'g');
    projectsContent = projectsContent.replace(projectPattern, `$1${devLogStr}$2`);

    // Rate limiting delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  fs.writeFileSync(projectsPath, projectsContent, 'utf-8');
  console.log(`✅ Project dev logs updated in ${projectsPath}\n`);

  console.log('✨ Data sync complete!');
}

// Run the sync
syncData().catch(console.error);
