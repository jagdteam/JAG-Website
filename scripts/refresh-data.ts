#!/usr/bin/env npx tsx

/**
 * Manual Data Refresh Script
 *
 * This script calls the backend API endpoints with ?refresh=true to bypass
 * the cache and fetch fresh data from GitHub, LeetCode, and Notion APIs.
 *
 * The backend now respects the 'refresh' query parameter and will:
 * - Skip its internal cache
 * - Set Cache-Control: no-cache headers
 * - Fetch fresh data from source APIs
 *
 * Usage: npm run refresh-data
 */

const API_BASE = process.env.VITE_API_BASE_URL || 'https://jagdnotionapiserver.vercel.app/api';

interface RefreshResult {
  endpoint: string;
  status: 'success' | 'error';
  message: string;
  data?: any;
}

// Team members to refresh
const TEAM_MEMBERS = [
  { name: 'Andrew Espinosa', github: 'adespinosa14', leetcode: 'adespinosa2002' },
  { name: 'Giuseppi Pelayo', github: 'giuseppi', leetcode: 'giuseppi' },
  { name: 'Johnny Fok', github: 'JohnFok119', leetcode: 'LupusOW' },
  { name: 'Dylan Nguyen', github: 'DylanN143', leetcode: '' },
];

// Projects to refresh
const PROJECTS = [
  { name: 'ScholarLens', repo: 'jagdteam/Education-Project', notionSlug: 'ScholarLens' },
  { name: 'CliCR', repo: 'jagdteam/clicr', notionSlug: 'CliCR' },
  { name: 'CodeLens', repo: 'jagdteam/CodeLens', notionSlug: 'CodeLens' },
  { name: 'Clutch', repo: 'jagdteam/Clutch', notionSlug: 'Clutch' },
];

// Fetch with cache bypass
async function fetchAPI(url: string, description: string): Promise<RefreshResult> {
  try {
    console.log(`  ⏳ ${description}...`);

    // Add cache-busting timestamp
    const separator = url.includes('?') ? '&' : '?';
    const urlWithCache = `${url}${separator}refresh=${Date.now()}`;

    const response = await fetch(urlWithCache);

    if (!response.ok) {
      const errorText = await response.text();
      return {
        endpoint: url,
        status: 'error',
        message: `HTTP ${response.status}: ${errorText}`,
      };
    }

    const data = await response.json();

    console.log(`  ✅ ${description} - Success`);

    return {
      endpoint: url,
      status: 'success',
      message: 'Data fetched successfully',
      data,
    };
  } catch (error: any) {
    console.error(`  ❌ ${description} - Failed: ${error.message}`);
    return {
      endpoint: url,
      status: 'error',
      message: error.message,
    };
  }
}

async function refreshAllData() {
  console.log('🔄 Starting data refresh...\n');
  console.log(`📡 API Base: ${API_BASE}\n`);
  console.log('💡 Using ?refresh parameter to bypass backend cache\n');

  const results: RefreshResult[] = [];

  // 1. Refresh GitHub Contributions for all team members
  console.log('👥 Refreshing GitHub Contributions...');
  for (const member of TEAM_MEMBERS) {
    const result = await fetchAPI(
      `${API_BASE}/github/contributions?username=${member.github}`,
      `${member.name} (GitHub)`
    );
    results.push(result);
    await sleep(500); // Rate limiting
  }

  console.log('');

  // 2. Refresh LeetCode Stats for all team members
  console.log('🧩 Refreshing LeetCode Stats...');
  for (const member of TEAM_MEMBERS) {
    if (!member.leetcode) {
      console.log(`  ⏭️  ${member.name} - No LeetCode username`);
      continue;
    }

    const result = await fetchAPI(
      `${API_BASE}/leetcode/stats?username=${member.leetcode}`,
      `${member.name} (LeetCode)`
    );
    results.push(result);
    await sleep(500); // Rate limiting
  }

  console.log('');

  // 3. Refresh Project Commits
  console.log('📝 Refreshing Project Commits...');
  for (const project of PROJECTS) {
    const result = await fetchAPI(
      `${API_BASE}/github/commits?repo=${project.repo}`,
      `${project.name} (Commits)`
    );
    results.push(result);
    await sleep(500); // Rate limiting
  }

  console.log('');

  // 4. Refresh Notion Roadmaps (IMPORTANT for testing Notion changes!)
  console.log('🗓️  Refreshing Notion Roadmaps...');
  for (const project of PROJECTS) {
    const result = await fetchAPI(
      `${API_BASE}/notion/sprints?projectSlug=${project.notionSlug}`,
      `${project.name} (Notion Roadmap)`
    );
    results.push(result);

    // Log sprint details for Clutch specifically
    if (project.name === 'Clutch' && result.status === 'success' && result.data?.data) {
      console.log(`\n  📊 Clutch Sprint Details:`);
      const sprints = result.data.data;
      sprints.forEach((sprint: any) => {
        const totalTickets = sprint.epics?.reduce((sum: number, epic: any) => sum + (epic.tickets?.length || 0), 0) || 0;
        console.log(`     Sprint ${sprint.sprintNumber}: "${sprint.name}"`);
        console.log(`       Status: ${sprint.status}`);
        console.log(`       Epics: ${sprint.epics?.length || 0}`);
        console.log(`       Total Tickets: ${totalTickets}`);
      });
    }

    await sleep(500); // Rate limiting
  }

  console.log('');

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Refresh Summary\n');

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);

  if (errorCount > 0) {
    console.log('\n🔍 Failed Endpoints:');
    results
      .filter(r => r.status === 'error')
      .forEach(r => {
        console.log(`   ${r.endpoint}`);
        console.log(`   → ${r.message}\n`);
      });
  }

  console.log('='.repeat(60));
  console.log('\n✨ Data refresh complete!\n');

  // Exit with error code if any requests failed
  if (errorCount > 0) {
    console.log('⚠️  Some requests failed. Check the output above.');
    process.exit(1);
  }
}

// Helper: Sleep
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the refresh
refreshAllData().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
