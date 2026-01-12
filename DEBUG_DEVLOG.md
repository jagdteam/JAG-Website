# 🐛 Dev Log Debugging Guide

## ✅ Issue Fixed

**Problem:** Projects didn't have the `github` field populated, so `repoSlug` was `undefined` and no commits were fetched.

**Solution:** Added GitHub repository URLs to all projects in `src/data/projects.ts`:

```typescript
// ScholarLens
github: 'https://github.com/jagdteam/Education-Project'

// CliCR
github: 'https://github.com/jagdteam/clicr'

// CodeLens
github: 'https://github.com/jagdteam/CodeLens'

// Clutch
github: 'https://github.com/jagdteam/Clutch'
```

---

## 🧪 Test It Now

### **1. Open Browser Console**

Press **F12** → **Console** tab, then paste:

```javascript
// Test Dev Log API for Education-Project
async function testDevLog() {
  const repo = 'jagdteam/Education-Project';
  const apiBase = 'https://jagdnotionapiserver.vercel.app/api';
  const url = `${apiBase}/github/commits?repo=${repo}`;

  console.log('🧪 Testing Dev Log API...\n');
  console.log('📡 Fetching from:', url);

  try {
    const response = await fetch(url);
    const result = await response.json();

    console.log('📥 Raw Response:', result);

    if (result.success) {
      const commits = result.data;

      // Group by week
      const byWeek = {};
      commits.forEach(c => {
        if (!byWeek[c.week]) byWeek[c.week] = [];
        byWeek[c.week].push(c);
      });

      console.log('\n✅ SUCCESS!');
      console.log('━'.repeat(60));
      console.log(`📊 Total Commits: ${commits.length}`);
      console.log('\n📅 Breakdown by Week:');
      console.log('━'.repeat(60));

      Object.entries(byWeek)
        .sort(([a], [b]) => b.localeCompare(a)) // Week 4 -> Week 1
        .forEach(([week, weekCommits]) => {
          const types = weekCommits.reduce((acc, c) => {
            acc[c.type] = (acc[c.type] || 0) + 1;
            return acc;
          }, {});

          console.log(`\n${week} (${weekCommits.length} commits):`);
          console.log(`  Types: ${JSON.stringify(types)}`);
          weekCommits.slice(0, 3).forEach(c => {
            console.log(`    - [${c.type}] ${c.content.substring(0, 60)}... (${c.assignee})`);
          });
        });

      console.log('\n━'.repeat(60));

    } else {
      console.error('❌ API Error:', result.error);
    }

  } catch (error) {
    console.error('❌ Fetch Error:', error);
  }
}

// Run the test
testDevLog();
```

---

## 📋 Expected Output

### **If Working:**

```
🧪 Testing Dev Log API...

📡 Fetching from: https://jagdnotionapiserver.vercel.app/api/github/commits?repo=jagdteam/Education-Project
📥 Raw Response: { success: true, data: [...] }

✅ SUCCESS!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Total Commits: 42

📅 Breakdown by Week:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Week 4 (15 commits):
  Types: {"feature":8,"fix":4,"design":2,"infra":1}
    - [feature] Add student dashboard with grade overview... (Giuseppi Pelayo)
    - [fix] Fix rubric parsing edge case... (Johnny Fok)
    - [design] Update grade distribution chart colors... (Dylan Nguyen)

Week 3 (12 commits):
  Types: {"feature":6,"fix":5,"infra":1}
    - [feature] Implement PDF upload validation... (Andrew Espinosa)
    - [fix] Resolve class analytics calculation bug... (Johnny Fok)
    ...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### **If Backend Issue:**

```
❌ API Error: Failed to fetch repository commits
```

---

## 🔍 Verify in UI

1. **Navigate to Projects Page:**
   - Go to `/projects` or click "Projects" in nav

2. **Click on a Project:**
   - Click on "ScholarLens" card

3. **Check Dev Log Tab:**
   - Should see "Dev Log" tab
   - Click it
   - Should see collapsible weeks (Week 4, Week 3, etc.)
   - Expand Week 4 (most recent)
   - Should see commits grouped by type with badges

4. **Look for Loading States:**
   - If you see a spinner that never stops → API call failing
   - If you see "No dev log entries" → API returning empty array
   - If you see weeks with commits → ✅ Working!

---

## 🐛 Troubleshooting

### **Issue: Spinner Never Stops**

**Cause:** API call is failing or hanging

**Debug:**
1. Check Network tab (F12 → Network)
2. Filter by "commits"
3. Look at the request:
   - **Status 500?** → Backend error
   - **Status 404?** → Endpoint not found
   - **Pending forever?** → Network timeout

**Solution:** Check backend logs in Vercel

---

### **Issue: "No dev log entries" Message**

**Cause:** API returning empty array

**Debug:**
1. Run the test script above
2. Check if `commits.length === 0`
3. Possible reasons:
   - Repository is empty
   - No commits from team members (all commits filtered out)
   - Time range doesn't include any commits

**Solution:**
- Check if the repo actually has commits
- Verify team member filtering logic in backend
- Check date range (should be last ~4-5 months)

---

### **Issue: Wrong Commits Showing**

**Cause:** Filtering not working correctly

**Debug:**
1. Check commit authors in response
2. Verify they match team member list
3. From previous issue: CodeLens was forked, so we filter to only team members

**Solution:** Backend should filter commits by team members:
```javascript
const teamMembers = [
  { name: 'Andrew Espinosa', github: 'adespinosa14' },
  { name: 'Giuseppi Pelayo', github: 'giuseppi' },
  { name: 'Johnny Fok', github: 'JohnFok119' },
  { name: 'Dylan Nguyen', github: 'DylanN143' },
];
```

---

## 🧪 Test All Projects

```javascript
async function testAllProjects() {
  const projects = [
    { name: 'ScholarLens', repo: 'jagdteam/Education-Project' },
    { name: 'CliCR', repo: 'jagdteam/clicr' },
    { name: 'CodeLens', repo: 'jagdteam/CodeLens' },
    { name: 'Clutch', repo: 'jagdteam/Clutch' }
  ];

  for (const project of projects) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`📦 Testing: ${project.name} (${project.repo})`);
    console.log('='.repeat(70));

    const url = `https://jagdnotionapiserver.vercel.app/api/github/commits?repo=${project.repo}`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        const commits = result.data;
        const weeks = [...new Set(commits.map(c => c.week))].length;
        console.log(`✅ ${project.name}: ${commits.length} commits across ${weeks} weeks`);

        // Show commit types breakdown
        const types = commits.reduce((acc, c) => {
          acc[c.type] = (acc[c.type] || 0) + 1;
          return acc;
        }, {});
        console.log(`   Types: ${JSON.stringify(types)}`);
      } else {
        console.error(`❌ ${project.name}: ${result.error}`);
      }
    } catch (error) {
      console.error(`❌ ${project.name}: Fetch failed -`, error.message);
    }

    // Wait 500ms between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// Run for all projects
testAllProjects();
```

---

## 📊 Expected Behavior

### **Data Flow:**

```
1. User clicks project card
   ↓
2. ProjectDetails component renders
   ↓
3. useProjectCommits(repoSlug) hook is called
   ↓
4. Hook extracts repo from project.github URL
   → "https://github.com/jagdteam/Education-Project" → "jagdteam/Education-Project"
   ↓
5. fetchRepoCommits() API client makes request to backend
   → GET https://jagdnotionapiserver.vercel.app/api/github/commits?repo=jagdteam/Education-Project
   ↓
6. Backend fetches commits from GitHub API
   ↓
7. Backend filters commits to team members only
   ↓
8. Backend categorizes commits by type (feat/fix/design/infra)
   ↓
9. Backend groups by week (Week 1-4)
   ↓
10. Frontend receives commits and groups by week
   ↓
11. Accordion renders with Week 4 (most recent) at top
```

---

## ✅ Summary

**What was wrong:**
- Projects were missing the `github` field
- `getRepoSlug()` returned `undefined`
- `useProjectCommits(undefined)` skipped fetching

**What we fixed:**
- Added `github: 'https://github.com/jagdteam/REPO'` to all 4 projects
- Now `repoSlug` extracts correctly
- Hook fetches commits from backend

**How to verify:**
- Run test scripts in browser console
- Navigate to project details page
- Check Dev Log tab for commits grouped by week
