# Backend Implementation Prompts for JAGD-Notion-API-Server

## Overview

This document contains complete, copy-paste ready code to add GitHub and LeetCode API endpoints to your JAGD-Notion-API-Server repository, following the exact same pattern as your Notion API integration.

---

## Part 1: Environment Variables

### Add to `.env.local`:

```bash
# GitHub - Main organization token
GITHUB_API_TOKEN=ghp_your_main_token_here

# GitHub - Individual member tokens for private contributions
GIUSEPPI_GITHUB_TOKEN=ghp_your_token_here
JOHNNY_GITHUB_TOKEN=ghp_your_token_here
ANDREW_GITHUB_TOKEN=ghp_your_token_here
DYLAN_GITHUB_TOKEN=ghp_your_token_here

# LeetCode - No tokens needed (public API)
```

### Add to Vercel Dashboard (Environment Variables):

Same variables as above, in your Vercel project settings.

---

## Part 2: Create GitHub API Endpoints

### 1. Create `/api/github/test.js`

```javascript
/**
 * Vercel Serverless Function - Test GitHub Connection
 * Endpoint: /api/github/test
 */

const { Octokit } = require('@octokit/rest');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const token = process.env.GITHUB_API_TOKEN;

    if (!token) {
      return res.status(500).json({
        success: false,
        message: 'GitHub token not configured',
      });
    }

    // Initialize Octokit
    const octokit = new Octokit({ auth: token });

    // Test connection
    const { data } = await octokit.rest.users.getAuthenticated();

    res.status(200).json({
      success: true,
      message: `Successfully connected as ${data.login}!`,
      data: {
        username: data.login,
        publicRepos: data.public_repos,
      },
    });
  } catch (error) {
    console.error('GitHub API Error:', error);
    res.status(500).json({
      success: false,
      message: `Connection failed: ${error.message}`,
    });
  }
};
```

### 2. Create `/api/github/contributions.js`

```javascript
/**
 * Vercel Serverless Function - Fetch GitHub Contributions
 * Endpoint: /api/github/contributions?username=giuseppi
 */

const fetch = require('node-fetch');

// Helper to calculate seconds until midnight PST
function getSecondsUntilMidnightPST() {
  const now = new Date();

  // Convert to PST (UTC-8, or UTC-7 during DST)
  const pstOffset = -8 * 60; // PST is UTC-8
  const nowPST = new Date(now.getTime() + (pstOffset + now.getTimezoneOffset()) * 60000);

  // Set to next midnight PST
  const tomorrowPST = new Date(nowPST);
  tomorrowPST.setHours(24, 0, 0, 0);

  return Math.floor((tomorrowPST - nowPST) / 1000);
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username query parameter is required',
      });
    }

    // Get the appropriate token (user-specific or main token)
    const userTokenKey = `${username.toUpperCase()}_GITHUB_TOKEN`;
    const token = process.env[userTokenKey] || process.env.GITHUB_API_TOKEN;

    if (!token) {
      return res.status(500).json({
        success: false,
        error: 'GitHub token not configured',
      });
    }

    console.log(`📊 Fetching GitHub contributions for ${username} using ${process.env[userTokenKey] ? 'personal' : 'org'} token`);

    // Calculate 5 months ago
    const fiveMonthsAgo = new Date();
    fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);

    // GraphQL query
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

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          username,
          from: fiveMonthsAgo.toISOString(),
        },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error('❌ GitHub GraphQL API errors:', data.errors);
      return res.status(500).json({
        success: false,
        error: data.errors[0].message || 'GitHub API error',
      });
    }

    if (!data.data?.user) {
      return res.status(404).json({
        success: false,
        error: `User ${username} not found`,
      });
    }

    const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;
    const contributions = [];

    weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        contributions.push({
          date: day.date,
          count: day.contributionCount,
        });
      });
    });

    const totalContributions = data.data.user.contributionsCollection.contributionCalendar.totalContributions;
    const activeDays = contributions.filter((c) => c.count > 0).length;

    console.log(`✅ ${username}: ${totalContributions} total contributions, ${activeDays} active days`);

    // Cache until midnight PST
    const secondsUntilMidnight = getSecondsUntilMidnightPST();
    res.setHeader('Cache-Control', `s-maxage=${secondsUntilMidnight}, must-revalidate`);

    res.status(200).json({
      success: true,
      data: contributions,
    });
  } catch (error) {
    console.error('GitHub API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
```

### 3. Create `/api/github/commits.js`

```javascript
/**
 * Vercel Serverless Function - Fetch GitHub Repository Commits
 * Endpoint: /api/github/commits?repo=jagdteam/Education-Project
 */

const fetch = require('node-fetch');

// Helper to calculate seconds until midnight PST
function getSecondsUntilMidnightPST() {
  const now = new Date();
  const pstOffset = -8 * 60;
  const nowPST = new Date(now.getTime() + (pstOffset + now.getTimezoneOffset()) * 60000);
  const tomorrowPST = new Date(nowPST);
  tomorrowPST.setHours(24, 0, 0, 0);
  return Math.floor((tomorrowPST - nowPST) / 1000);
}

// Team members configuration
const teamMembers = [
  { name: 'Andrew Espinosa', github: 'adespinosa14' },
  { name: 'Giuseppi Pelayo', github: 'giuseppi' },
  { name: 'Johnny Fok', github: 'JohnFok119' },
  { name: 'Dylan Nguyen', github: 'DylanN143' },
];

// Helper to get team member image
function getTeamMemberImage(name) {
  const imageMap = {
    'Giuseppi Pelayo': '/assets/g_pfp.jpg',
    'Johnny Fok': '/assets/jf_pfp.jpg',
    'Dylan Nguyen': '/assets/dn_pfp.jpg',
    'Andrew Espinosa': '/assets/ade_pfp.jpeg',
  };
  return imageMap[name];
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { repo } = req.query;

    if (!repo) {
      return res.status(400).json({
        success: false,
        error: 'Repo query parameter is required (format: owner/repo)',
      });
    }

    const token = process.env.GITHUB_API_TOKEN;

    if (!token) {
      return res.status(500).json({
        success: false,
        error: 'GitHub token not configured',
      });
    }

    console.log(`📊 Fetching commits for ${repo}`);

    // Fetch commits
    const response = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=100`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'JAGD-API-Server',
      },
    });

    if (!response.ok) {
      if (response.status === 409) {
        // Empty repository
        console.log(`⚠️  Repo ${repo} is empty (no commits yet)`);
        return res.status(200).json({
          success: true,
          data: [],
        });
      }
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const commits = await response.json();

    // Process commits
    const devLog = commits
      .map((commit) => {
        const authorName = commit.commit.author.name;
        const authorEmail = commit.commit.author.email;
        const commitDate = new Date(commit.commit.author.date);
        const message = commit.commit.message.split('\n')[0];

        // Find matching team member
        const teamMember = teamMembers.find(
          (m) =>
            m.name.toLowerCase().includes(authorName.toLowerCase()) ||
            authorName.toLowerCase().includes(m.name.split(' ')[0].toLowerCase()) ||
            authorName.toLowerCase().includes(m.name.split(' ')[1]?.toLowerCase() || '') ||
            (m.github && (authorEmail.toLowerCase().includes(m.github.toLowerCase()) || authorName.toLowerCase().includes(m.github.toLowerCase())))
        );

        if (!teamMember) {
          return null; // Skip non-team commits
        }

        // Infer commit type
        let type = 'infra';
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.startsWith('fix:') || lowerMessage.includes('fix') || lowerMessage.includes('bug')) {
          type = 'fix';
        } else if (lowerMessage.startsWith('feat:') || lowerMessage.includes('feature') || lowerMessage.includes('add')) {
          type = 'feature';
        } else if (lowerMessage.includes('design') || lowerMessage.includes('ui') || lowerMessage.includes('style')) {
          type = 'design';
        }

        // Calculate week (temporary, will be inverted)
        const weekNumber = Math.ceil((Date.now() - commitDate.getTime()) / (7 * 24 * 60 * 60 * 1000));

        return {
          id: commit.sha.substring(0, 8),
          date: commitDate.toISOString().split('T')[0],
          weekNumber,
          type,
          content: message,
          assignee: teamMember.name,
          assigneeImg: getTeamMemberImage(teamMember.name),
        };
      })
      .filter((entry) => entry !== null)
      .slice(0, 50); // Keep only 50 most recent team commits

    // Invert week numbers (Week 4 = most recent)
    const maxWeek = Math.max(...devLog.map((entry) => entry.weekNumber), 0);

    const finalDevLog = devLog.map((entry) => {
      const invertedWeekNumber = maxWeek - entry.weekNumber + 1;
      const week = entry.weekNumber === 0 ? 'This Week' : `Week ${invertedWeekNumber}`;

      const { weekNumber, ...rest } = entry;
      return { ...rest, week };
    });

    console.log(`✅ Processed ${finalDevLog.length} team commits for ${repo}`);

    // Cache until midnight PST
    const secondsUntilMidnight = getSecondsUntilMidnightPST();
    res.setHeader('Cache-Control', `s-maxage=${secondsUntilMidnight}, must-revalidate`);

    res.status(200).json({
      success: true,
      data: finalDevLog,
    });
  } catch (error) {
    console.error('GitHub API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
```

---

## Part 3: Create LeetCode API Endpoints

### 1. Create `/api/leetcode/test.js`

```javascript
/**
 * Vercel Serverless Function - Test LeetCode Connection
 * Endpoint: /api/leetcode/test
 */

const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Test with a known public user
    const testUser = 'giuseppi';

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': `https://leetcode.com/${testUser}/`,
      },
      body: JSON.stringify({
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              username
            }
          }
        `,
        variables: { username: testUser },
      }),
    });

    const data = await response.json();

    if (data.data?.matchedUser) {
      res.status(200).json({
        success: true,
        message: 'Successfully connected to LeetCode API!',
        data: {
          testUser: data.data.matchedUser.username,
        },
      });
    } else {
      throw new Error('Unable to verify connection');
    }
  } catch (error) {
    console.error('LeetCode API Error:', error);
    res.status(500).json({
      success: false,
      message: `Connection failed: ${error.message}`,
    });
  }
};
```

### 2. Create `/api/leetcode/stats.js`

```javascript
/**
 * Vercel Serverless Function - Fetch LeetCode Stats
 * Endpoint: /api/leetcode/stats?username=giuseppi
 */

const fetch = require('node-fetch');

// Helper to calculate seconds until midnight PST
function getSecondsUntilMidnightPST() {
  const now = new Date();
  const pstOffset = -8 * 60;
  const nowPST = new Date(now.getTime() + (pstOffset + now.getTimezoneOffset()) * 60000);
  const tomorrowPST = new Date(nowPST);
  tomorrowPST.setHours(24, 0, 0, 0);
  return Math.floor((tomorrowPST - nowPST) / 1000);
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username query parameter is required',
      });
    }

    console.log(`📊 Fetching LeetCode stats for ${username}`);

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
      console.warn(`⚠️  No LeetCode data found for ${username}`);
      return res.status(404).json({
        success: false,
        error: `User ${username} not found or profile is private`,
      });
    }

    // Parse submission stats
    const stats = user.submitStats.acSubmissionNum;
    const totalSolved = stats.find((s) => s.difficulty === 'All')?.count || 0;
    const easySolved = stats.find((s) => s.difficulty === 'Easy')?.count || 0;
    const mediumSolved = stats.find((s) => s.difficulty === 'Medium')?.count || 0;
    const hardSolved = stats.find((s) => s.difficulty === 'Hard')?.count || 0;

    // Parse calendar data (last 5 months)
    const calendar = JSON.parse(user.userCalendar.submissionCalendar);
    const fiveMonthsAgo = new Date();
    fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);

    const recentSubmissions = [];
    Object.entries(calendar).forEach(([timestamp, count]) => {
      const date = new Date(parseInt(timestamp) * 1000);
      if (date >= fiveMonthsAgo) {
        recentSubmissions.push({
          date: date.toISOString().split('T')[0],
          count: count,
        });
      }
    });

    console.log(`✅ ${username}: ${totalSolved} problems solved, ${recentSubmissions.length} active days`);

    // Cache until midnight PST
    const secondsUntilMidnight = getSecondsUntilMidnightPST();
    res.setHeader('Cache-Control', `s-maxage=${secondsUntilMidnight}, must-revalidate`);

    res.status(200).json({
      success: true,
      data: {
        totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
        recentSubmissions,
      },
    });
  } catch (error) {
    console.error('LeetCode API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
```

---

## Part 4: Update Notion API (Add Caching)

### Update `/api/notion/roadmap.js`

Add the midnight cache helper and cache header at the end, right before `res.status(200).json()`:

```javascript
// Add this function at the top of the file (after requires)
function getSecondsUntilMidnightPST() {
  const now = new Date();
  const pstOffset = -8 * 60;
  const nowPST = new Date(now.getTime() + (pstOffset + now.getTimezoneOffset()) * 60000);
  const tomorrowPST = new Date(nowPST);
  tomorrowPST.setHours(24, 0, 0, 0);
  return Math.floor((tomorrowPST - nowPST) / 1000);
}

// Then, right before res.status(200).json(), add:
const secondsUntilMidnight = getSecondsUntilMidnightPST();
res.setHeader('Cache-Control', `s-maxage=${secondsUntilMidnight}, must-revalidate`);
```

---

## Part 5: Install Dependencies

```bash
npm install @octokit/rest node-fetch
```

---

## Part 6: Test Scripts

### Create `test-github.js`:

```javascript
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing GitHub API Connection...\n');

(async () => {
  try {
    // Test 1: Health check
    console.log('1️⃣  Testing /api/github/test');
    const testRes = await fetch('http://localhost:3000/api/github/test');
    const testData = await testRes.json();
    console.log(testData.success ? '✅ PASS' : '❌ FAIL', testData.message);

    // Test 2: Contributions
    console.log('\n2️⃣  Testing /api/github/contributions');
    const contribRes = await fetch('http://localhost:3000/api/github/contributions?username=giuseppi');
    const contribData = await contribRes.json();
    console.log(contribData.success ? '✅ PASS' : '❌ FAIL');
    if (contribData.success) {
      console.log(`   Found ${contribData.data.length} contribution days`);
    }

    // Test 3: Commits
    console.log('\n3️⃣  Testing /api/github/commits');
    const commitsRes = await fetch('http://localhost:3000/api/github/commits?repo=jagdteam/clicr');
    const commitsData = await commitsRes.json();
    console.log(commitsData.success ? '✅ PASS' : '❌ FAIL');
    if (commitsData.success) {
      console.log(`   Found ${commitsData.data.length} team commits`);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
})();
```

### Create `test-leetcode.js`:

```javascript
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing LeetCode API Connection...\n');

(async () => {
  try {
    // Test 1: Health check
    console.log('1️⃣  Testing /api/leetcode/test');
    const testRes = await fetch('http://localhost:3000/api/leetcode/test');
    const testData = await testRes.json();
    console.log(testData.success ? '✅ PASS' : '❌ FAIL', testData.message);

    // Test 2: Stats
    console.log('\n2️⃣  Testing /api/leetcode/stats');
    const statsRes = await fetch('http://localhost:3000/api/leetcode/stats?username=giuseppi');
    const statsData = await statsRes.json();
    console.log(statsData.success ? '✅ PASS' : '❌ FAIL');
    if (statsData.success) {
      console.log(`   Total solved: ${statsData.data.totalSolved}`);
      console.log(`   Recent submissions: ${statsData.data.recentSubmissions.length} days`);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
})();
```

### Update `package.json`:

```json
{
  "scripts": {
    "test": "node test-connection.js",
    "test:notion": "node test-connection.js",
    "test:github": "node test-github.js",
    "test:leetcode": "node test-leetcode.js"
  }
}
```

---

## Part 7: Deployment Checklist

### Before deploying:

1. ✅ All files created in `/api/github/` and `/api/leetcode/`
2. ✅ Dependencies installed (`@octokit/rest`, `node-fetch`)
3. ✅ Test scripts run successfully locally
4. ✅ Environment variables added to `.env.local`

### Deploy to Vercel:

1. Push changes to GitHub
2. Vercel auto-deploys
3. Add environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all tokens (`GITHUB_API_TOKEN`, `GIUSEPPI_GITHUB_TOKEN`, etc.)
4. Redeploy to apply environment variables
5. Test production endpoints

### Test production:

```bash
# GitHub
curl https://jagdnotionapiserver.vercel.app/api/github/test
curl https://jagdnotionapiserver.vercel.app/api/github/contributions?username=giuseppi
curl https://jagdnotionapiserver.vercel.app/api/github/commits?repo=jagdteam/clicr

# LeetCode
curl https://jagdnotionapiserver.vercel.app/api/leetcode/test
curl https://jagdnotionapiserver.vercel.app/api/leetcode/stats?username=giuseppi
```

---

## Summary

### API Endpoints Created:

| Endpoint                    | Query Params               | Description                           |
| --------------------------- | -------------------------- | ------------------------------------- |
| `/api/github/test`          | -                          | Health check                          |
| `/api/github/contributions` | `username`                 | User contributions (5 months)         |
| `/api/github/commits`       | `repo` (owner/repo format) | Repository commits (filtered to team) |
| `/api/leetcode/test`        | -                          | Health check                          |
| `/api/leetcode/stats`       | `username`                 | User stats + submissions (5 months)   |

### Caching Strategy:

- **All endpoints**: Cache until midnight PST
- **First visitor after midnight**: Triggers fresh API call
- **Everyone else**: Gets cached data (fast!)
- **Notion API**: Also updated with same caching

---

**Ready to implement!** Copy these files into your JAGD-Notion-API-Server repository following the folder structure shown at the top.
