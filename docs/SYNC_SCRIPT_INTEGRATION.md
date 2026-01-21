# Sync Script Integration - Notion + GitHub + LeetCode

## Overview

All data sources (GitHub, LeetCode, and Notion) are now integrated into a unified daily sync workflow using GitHub Actions.

## What Was Changed

### 1. GitHub Actions Workflow Fixed (`.github/workflows/sync-data.yml`)

**Problem:** The workflow was failing with a 403 error when trying to push commits.

**Solution:**
- ✅ Changed checkout to use `GH_PAT` (Personal Access Token) instead of default `GITHUB_TOKEN`
- ✅ Added `permissions: contents: write` to the job
- ✅ Added Notion environment variables (`NOTION_API_KEY`, `NOTION_DATABASE_ID`)
- ✅ Updated commit step to include `roadmaps.ts` file

**Required GitHub Secrets:**
- `GH_PAT` - Personal access token with repo write permissions
- `NOTION_API_KEY` - Notion integration token
- `NOTION_DATABASE_ID` - Notion database ID for roadmaps
- `ANDREW_GITHUB_TOKEN`, `GIUSEPPI_GITHUB_TOKEN`, `JOHNNY_GITHUB_TOKEN`, `DYLAN_GITHUB_TOKEN` - Individual member tokens

### 2. Notion Integration Added (`scripts/sync-data.ts`)

**New Functions:**
- `fetchNotionRoadmaps()` - Fetches all roadmaps from Notion database
- `fetchSprintEpics()` - Fetches child pages (epics) from a sprint
- `fetchEpicTasks()` - Fetches to-do blocks (tasks) from an epic page
- `calculateSprintStatus()` - Calculates sprint status from task completion
- `mapNotionStatus()` - Maps Notion status strings to standard format

**New Interfaces:**
```typescript
interface Epic {
  id: string;
  name: string;
  description: string | null;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  status: 'not-started' | 'in-progress' | 'completed';
  assignees: string[];
  dueDate: string | null;
  description: string | null;
}

interface Sprint {
  id: string;
  name: string;
  sprintNumber: number | null;
  startDate: string | null;
  endDate: string | null;
  status: 'not-started' | 'in-progress' | 'completed';
  epics: Epic[];
}
```

### 3. New Static Data File (`src/data/roadmaps.ts`)

**Purpose:** Store pre-fetched Notion roadmap data (same pattern as `teamStats.ts`)

**Structure:**
```typescript
export const roadmaps: Record<string, Sprint[]> = {
  "scholarlens-ai": [...],
  "clicr-cli": [...],
  // etc.
};
```

## Data Flow (Updated)

### Before (Notion Only)
```
User visits page → Component fetches from Notion API → localStorage cache (24h)
```

### After (All Data Sources)
```
GitHub Actions (daily @ 2 AM UTC)
  ├─ Fetch GitHub contributions (all members)
  ├─ Fetch LeetCode stats (all members)
  ├─ Fetch Notion roadmaps (all projects)
  ├─ Write to static files:
  │   ├─ src/data/teamStats.ts
  │   ├─ src/data/projects.ts (dev logs)
  │   └─ src/data/roadmaps.ts (NEW)
  └─ Commit & push to repo

User visits page → Read from static files (instant, no API calls)
```

## Benefits

1. **Consistency** - All data sources follow the same pattern
2. **Performance** - No runtime API calls, instant page loads
3. **Reliability** - Data is always available (no API downtime)
4. **Rate Limits** - No client-side API rate limiting issues
5. **Caching** - Browser caches static files automatically
6. **Version Control** - Data changes are tracked in git

## Notion Database Requirements

### Sprint Pages (Top-level)

The script expects Notion pages with these properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `Project` | Select | Yes | Project slug (e.g., "scholarlens-ai") |
| `Name` | Title | Yes | Sprint name |
| `Sprint Number` | Number | No | Sprint sequence number |
| `Start Date` | Date | No | Sprint start date |
| `End Date` | Date | No | Sprint end date |

**Note:** Sprint status is NOT read from Notion properties. It's calculated from task completion (see below).

### Epic Pages (Child pages of Sprints)

- Each sprint can contain **child pages** representing epics
- Epic name comes from the child page title
- Epic status and progress are calculated from tasks

### Tasks (To-do blocks within Epic pages)

- Tasks are represented as **to-do blocks** within epic pages
- Task status: checked = "completed", unchecked = "not-started"
- Task title comes from the to-do block text

### Status Calculation Logic

Sprint status is automatically calculated based on task completion:

1. **not-started**: No tasks exist, or all tasks are not started
2. **in-progress**: Any tasks are in progress or completed (but not all)
3. **completed**: ALL tasks are completed

```typescript
// Example:
Sprint with 10 tasks:
- 0 completed → "not-started"
- 1-9 completed → "in-progress"
- 10 completed → "completed"
```

## Completed Enhancements

1. ✅ **Epic/Ticket Fetching** - Fetches child pages as epics and to-do blocks as tickets
2. ✅ **Status Calculation** - Sprint status automatically calculated from ticket completion
3. ✅ **Static Data Architecture** - All APIs now read from static files (no runtime API calls!)
4. ✅ **Removed Client-Side Caching** - No more localStorage, data updates daily via GitHub Actions
5. ✅ **Unified Data Pattern** - GitHub, LeetCode, and Notion all use the same architecture

See `docs/STATIC_DATA_ARCHITECTURE.md` for complete details on the new architecture.

## Testing

### Manual Trigger
```bash
# In GitHub Actions UI: Run workflow manually
# Or via CLI:
gh workflow run "Sync Team & Project Data"
```

### Local Testing
```bash
# Add to .env:
# NOTION_API_KEY=secret_xxx
# NOTION_DATABASE_ID=xxx

# Run script:
npx tsx scripts/sync-data.ts
```

### Expected Output
```
🔄 Starting data sync...

📊 Fetching team member stats...
  - Andrew Espinosa
    ✓ Andrew: 150 total contributions...
  ...

📝 Fetching project commits...
  - scholarlens-ai (jagdteam/Education-Project)
  ...

🗓️  Fetching Notion roadmaps...
    Fetching roadmaps from Notion...
    ✓ Fetched roadmaps for 2 project(s): scholarlens-ai (3 sprints), clicr-cli (2 sprints)

✅ Team stats written to .../teamStats.ts
✅ Project dev logs updated in .../projects.ts
✅ Roadmaps written to .../roadmaps.ts

✨ Data sync complete!
```

## Troubleshooting

### 403 Error on Push
- Ensure `GH_PAT` secret is set and has `repo` scope
- Check that the token hasn't expired

### Notion API Errors
- Verify `NOTION_API_KEY` is valid
- Ensure database is shared with integration
- Check database ID is correct

### Missing Data
- Verify Notion pages have required properties
- Check property names match exactly (case-sensitive)
- Review sync script logs for warnings
