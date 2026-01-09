# 🎯 Complete Notion Integration Guide

This guide covers everything you need to know about the Notion API integration for roadmap data.

---

## 📚 Table of Contents

1. [Quick Setup](#quick-setup)
2. [Notion Database Schema](#notion-database-schema)
3. [Local Development](#local-development)
4. [Deployment](#deployment)
5. [How It Works](#how-it-works)
6. [Troubleshooting](#troubleshooting)

---

## Quick Setup

### What's Changed

✅ **Roadmap data now comes from Notion instead of being hardcoded!**

### Step 1: Set Up Your Notion Database

Create a Notion database with these **7 columns**:

| # | Column Name | Type | Values/Format |
|---|-------------|------|---------------|
| 1 | **Name** | Title | Name of the roadmap item |
| 2 | **Status** | Select | "Not Started", "In Progress", "Completed" |
| 3 | **Description** | Text | What this item involves |
| 4 | **Project** | Text | "scholarlens-ai", "clicr-cli", "codelens", or "clutch" |
| 5 | **Phase** | Select | "Phase 1", "Phase 2", "Phase 3", etc. |
| 6 | **Phase Name** | Text | "Phase 1: Core Engine", "Phase 2: Grading UI", etc. |
| 7 | **Date** | Text | "Oct 2024", "Nov 2024", etc. |

**Example Row:**

| Name | Status | Description | Project | Phase | Phase Name | Date |
|------|--------|-------------|---------|-------|------------|------|
| PDF parsing & text extraction | Completed | Implemented PDF upload endpoint | scholarlens-ai | Phase 1 | Phase 1: Core Engine | Oct 2024 |

### Step 2: Share Database with Integration

1. Open your Notion database
2. Click the **"..."** menu (top right)
3. Click **"+ Add connections"**
4. Select your integration
5. Click **"Confirm"**

### Step 3: Add Environment Variables

Create a `.env.local` file in your project root:

```bash
VITE_NOTION_API_KEY=secret_your_notion_integration_token
VITE_NOTION_DATABASE_ID=your_database_id
```

---

## Notion Database Schema

### Required Columns

| Column Name | Type | Options/Format | Description |
|-------------|------|----------------|-------------|
| **Name** | Title | - | The name of the roadmap item (e.g., "PDF parsing & text extraction") |
| **Status** | Select | "Not Started", "In Progress", "Completed" | Current status of the item |
| **Description** | Text | - | Description of what this item involves |
| **Project** | Text | - | Project slug (e.g., "scholarlens-ai", "clicr-cli", "codelens", "clutch") |
| **Phase** | Select | "Phase 1", "Phase 2", "Phase 3", etc. | Which phase this item belongs to |
| **Phase Name** | Text | - | Full phase name (e.g., "Phase 1: Core Engine") |
| **Date** | Text | - | When this phase is/was worked on (e.g., "Oct 2024") |

### Status Values Mapping

The backend will automatically convert:
- "Not Started" → `not-started`
- "In Progress" → `in-progress`
- "Completed" → `completed`

### Project Slugs to Use

- `scholarlens-ai` - For ScholarLens project
- `clicr-cli` - For CliCR project
- `codelens` - For CodeLens project
- `clutch` - For Clutch project

### Phase Format

**Phase Column (Select type):**
- "Phase 1"
- "Phase 2"
- "Phase 3"
- etc.

**Phase Name Column (Text type):**
- "Phase 1: Core Engine"
- "Phase 2: Grading UI"
- "Phase 3: Analytics"

### Example Complete Database

| Name | Status | Description | Project | Phase | Phase Name | Date |
|------|--------|-------------|---------|-------|------------|------|
| PDF parsing & text extraction | Completed | Implemented PDF upload endpoint with PyPDF | scholarlens-ai | Phase 1 | Phase 1: Core Engine | Oct 2024 |
| Vector DB setup | Completed | Configured vector database for embeddings | scholarlens-ai | Phase 1 | Phase 1: Core Engine | Oct 2024 |
| Teacher dashboard | In Progress | Building interactive dashboard with KPIs | scholarlens-ai | Phase 2 | Phase 2: Grading UI | Nov 2024 |
| Rubric builder | Not Started | Tool for creating custom rubrics | scholarlens-ai | Phase 2 | Phase 2: Grading UI | Nov 2024 |

---

## Local Development

### Running the Servers

**Terminal 1 - Backend Server:**
```bash
npm run notion-server
```

Wait for:
```
✅ Notion API server running on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Wait for:
```
➜  Local:   http://localhost:8080/
```

### Testing the Backend

**Test the connection:**
```bash
npm run test-notion
```

**Test the roadmap endpoint:**

Visit in browser:
```
http://localhost:3001/api/notion/roadmap?projectSlug=scholarlens-ai
```

You should see JSON with your roadmap data.

### Using in Your Components

**Import the Hook:**
```typescript
import { useProjectRoadmap } from '@/hooks/useProjectRoadmap';
```

**Use in Your Component:**
```typescript
function ProjectRoadmap({ projectId }: { projectId: string }) {
  const { roadmap, loading, error } = useProjectRoadmap(projectId);

  if (loading) {
    return <div>Loading roadmap...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {roadmap?.map((phase) => (
        <div key={phase.id}>
          <h3>{phase.name}</h3>
          <p>Status: {phase.status}</p>
          <p>Date: {phase.date}</p>
          
          <ul>
            {phase.items.map((item, idx) => (
              <li key={idx}>
                <strong>{item.name}</strong> - {item.status}
                {item.description && <p>{item.description}</p>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

---

## Deployment

### Production Setup

Your deployment is split into two parts:

1. **Backend** (Notion API): Deployed on Vercel
2. **Frontend** (Website): Deployed on Loveable

### Backend Deployment (Vercel)

The backend API files are located in the `api/` folder:
- `api/notion/test.js` - Test endpoint
- `api/notion/roadmap.js` - Roadmap endpoint

**To deploy:**

1. Go to https://vercel.com/new
2. Import your backend repository (if separate) or this repo
3. Deploy
4. Add environment variables in Vercel:
   - `VITE_NOTION_API_KEY`
   - `VITE_NOTION_DATABASE_ID`
5. Redeploy

You'll get: `https://your-backend.vercel.app`

**Test it:**
```
https://your-backend.vercel.app/api/notion/test
```

Should return:
```json
{"success": true, "message": "Successfully connected!..."}
```

### Frontend Deployment (Loveable)

In your Loveable deployment:

1. Add environment variable:
   ```
   VITE_NOTION_API_URL=https://your-backend.vercel.app/api/notion
   ```
2. Redeploy

The frontend will automatically use the Vercel backend in production and `localhost:3001` in development.

---

## How It Works

### Data Flow

```
Notion Database
      ↓
Backend Server (port 3001 local, Vercel in production)
  - Fetches data from Notion
  - Groups items by project & phase
  - Calculates phase status
  - Sorts phases in order
  - Returns structured JSON
      ↓
Frontend Hook (useProjectRoadmap)
  - Fetches data for specific project
  - Manages loading/error states
  - Returns ProjectPhase[]
      ↓
Your React Component
  - Displays the roadmap with status colors
```

### Backend API Response Format

When you call `/api/notion/roadmap?projectSlug=scholarlens-ai`, you get:

```json
{
  "success": true,
  "data": {
    "scholarlens-ai": [
      {
        "id": "scholarlens-ai-phase-1",
        "name": "Phase 1: Core Engine",
        "status": "completed",
        "date": "Oct 2024",
        "items": [
          {
            "name": "PDF parsing & text extraction",
            "status": "completed",
            "description": "Implemented PDF upload endpoint"
          },
          {
            "name": "Vector DB setup",
            "status": "completed",
            "description": "Configured vector database"
          }
        ]
      },
      {
        "id": "scholarlens-ai-phase-2",
        "name": "Phase 2: Grading UI",
        "status": "in-progress",
        "date": "Nov 2024",
        "items": [
          {
            "name": "Teacher dashboard",
            "status": "in-progress",
            "description": "Building interactive dashboard"
          }
        ]
      }
    ]
  }
}
```

### Phase Status Calculation

The backend automatically determines phase status based on items:
- **All items completed** → Phase is `completed`
- **Some items in progress or completed** → Phase is `in-progress`
- **No items started** → Phase is `planned`

### Phase Sorting

Phases are automatically sorted in ascending order (Phase 1, Phase 2, Phase 3, etc.) based on the phase number in the ID.

---

## Troubleshooting

### "Failed to fetch roadmap" or CORS Error

**Problem:** Backend server not running or not accessible.

**Fix:**
- Local: Run `npm run notion-server` in Terminal 1
- Production: Check your Vercel deployment is live

### "Empty roadmap array"

**Problem:** No Notion entries match the project slug.

**Fix:**
- Check your Notion database has entries with the correct `Project` value
- Project slugs must match exactly: "scholarlens-ai", "clicr-cli", "codelens", or "clutch"

### "Status not showing correctly"

**Problem:** Status column not configured correctly.

**Fix:**
- Status column must be a **Select** type (not Text)
- Must have exact values: "Not Started", "In Progress", "Completed"

### "Phase not grouping correctly" or "Empty phase value"

**Problem:** Phase column not configured correctly.

**Fix:**
- Phase column must be a **Select** type (not Text)
- Each item must have a phase selected from dropdown
- Don't type "Phase 1" - select it from the dropdown

### "Connection failed: notion.databases.query is not a function"

**Problem:** Wrong Notion client version.

**Fix:**
- We use `@notionhq/client@2.2.15` (not the latest version)
- Version 5.x removed the `databases.query()` method
- Run: `npm install @notionhq/client@2.2.15`

### "Could not find database"

**Problem:** Database not shared with integration.

**Fix:**
1. Open your Notion database
2. Click "..." menu (top right)
3. Click "+ Add connections"
4. Select your integration
5. Click "Confirm"

### Phases appear out of order

**Problem:** Old code or cached data.

**Fix:**
- Latest code includes phase sorting
- Restart the backend server: `npm run notion-server`
- Clear browser cache and refresh

---

## File Structure

### Test Files (`notion-test/` folder)

- `test-notion-connection.js` - Standalone test script
- `local-server.cjs` - Local development backend server
- `notion-api.js` - Alternative server implementation

**Run tests:**
```bash
npm run test-notion
```

**Run local server:**
```bash
npm run notion-server
```

### Backend Files (`api/` folder)

- `api/notion/test.js` - Vercel serverless function for testing
- `api/notion/roadmap.js` - Vercel serverless function for roadmap data

### Frontend Files

- `src/lib/notion.ts` - API client functions
- `src/hooks/useProjectRoadmap.ts` - React hook for fetching roadmap
- `src/data/projects.ts` - Project metadata (roadmap removed)
- `src/components/ProjectDetails.tsx` - Displays roadmap with Notion data

---

## Summary

**Before:** Roadmap data was hardcoded in `projects.ts`  
**After:** Roadmap data comes from Notion in real-time!

**To update roadmap:** Just edit your Notion database  
**To see changes:** Refresh your React app

No code changes needed to update content! 🚀

---

## Quick Reference

### Environment Variables

**Local (`.env.local`):**
```bash
VITE_NOTION_API_KEY=secret_your_token
VITE_NOTION_DATABASE_ID=your_db_id
```

**Production:**
- **Vercel Backend**: Add both above variables
- **Loveable Frontend**: Add `VITE_NOTION_API_URL=https://your-backend.vercel.app/api/notion`

### Test Endpoints

**Local:**
- Test: `http://localhost:3001/api/notion/test`
- Roadmap: `http://localhost:3001/api/notion/roadmap?projectSlug=scholarlens-ai`

**Production:**
- Test: `https://your-backend.vercel.app/api/notion/test`
- Roadmap: `https://your-backend.vercel.app/api/notion/roadmap?projectSlug=scholarlens-ai`

### Common Commands

```bash
npm run test-notion      # Test Notion connection
npm run notion-server    # Run local backend
npm run dev              # Run frontend
```

---

**Total Setup Time:** ~15-20 minutes  
**Questions?** Check the troubleshooting section above!

🎉 **That's it! Your roadmap is now powered by Notion!**

