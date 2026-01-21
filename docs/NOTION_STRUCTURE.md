# Notion Structure for JAGD Roadmaps

## Database Hierarchy

```
📊 Notion Database (Sprints)
│
├─ 📄 Sprint 1 (Page)
│  ├─ Properties:
│  │  ├─ Project: "scholarlens-ai"
│  │  ├─ Name: "Sprint 1"
│  │  ├─ Sprint Number: 1
│  │  ├─ Start Date: 2026-01-01
│  │  └─ End Date: 2026-01-15
│  │
│  └─ Child Pages (Epics):
│     ├─ 📑 Epic: "User Authentication"
│     │  └─ To-Do Blocks (Tasks):
│     │     ├─ ☑️ Implement login page (checked)
│     │     ├─ ☑️ Add JWT tokens (checked)
│     │     └─ ☐ Create password reset (unchecked)
│     │
│     └─ 📑 Epic: "Database Setup"
│        └─ To-Do Blocks (Tasks):
│           ├─ ☑️ Design schema (checked)
│           └─ ☐ Implement migrations (unchecked)
│
├─ 📄 Sprint 2 (Page)
│  └─ ... (same structure)
│
└─ 📄 Sprint 3 (Page)
   └─ ... (same structure)
```

## Status Calculation Examples

### Example 1: Sprint Not Started
```
Sprint: "Initial Planning"
├─ Epic: "Requirements"
│  ├─ ☐ Define features
│  └─ ☐ Create wireframes
└─ Epic: "Research"
   └─ ☐ Competitor analysis

Status: not-started (0/3 tasks completed)
```

### Example 2: Sprint In Progress
```
Sprint: "MVP Development"
├─ Epic: "Frontend"
│  ├─ ☑️ Setup React project (done)
│  ├─ ☑️ Create layout (done)
│  └─ ☐ Add routing (pending)
└─ Epic: "Backend"
   ├─ ☑️ Setup Express (done)
   └─ ☐ Create API endpoints (pending)

Status: in-progress (3/5 tasks completed)
```

### Example 3: Sprint Completed
```
Sprint: "Authentication Module"
├─ Epic: "Login System"
│  ├─ ☑️ Login page (done)
│  ├─ ☑️ API integration (done)
│  └─ ☑️ Error handling (done)
└─ Epic: "Security"
   ├─ ☑️ JWT implementation (done)
   └─ ☑️ Password hashing (done)

Status: completed (5/5 tasks completed)
```

## How the Script Works

1. **Fetch Sprints**: Query the Notion database for all sprint pages
2. **For Each Sprint**:
   - Extract properties (project, name, dates)
   - Fetch child pages (epics)
3. **For Each Epic**:
   - Fetch to-do blocks (tasks)
   - Check if tasks are checked or unchecked
4. **Calculate Status**:
   - Count total tasks across all epics
   - Count completed tasks (checked)
   - Apply logic:
     - All done → "completed"
     - Some done → "in-progress"
     - None done → "not-started"
5. **Group by Project**: Organize sprints by project slug
6. **Write to File**: Save to `src/data/roadmaps.ts`

## API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `POST /v1/databases/{db_id}/query` | Fetch all sprint pages |
| `GET /v1/blocks/{block_id}/children` | Fetch child pages (epics) or to-do blocks (tasks) |
| `GET /v1/pages/{page_id}` | Get epic page details |

## Notion Setup Checklist

- [ ] Create a Notion database for sprints
- [ ] Add "Project" select property (values: project slugs)
- [ ] Add "Name" title property
- [ ] Add "Sprint Number" number property (optional)
- [ ] Add "Start Date" and "End Date" date properties (optional)
- [ ] Create sprint pages in the database
- [ ] Add child pages (epics) inside sprint pages
- [ ] Add to-do blocks (tasks) inside epic pages
- [ ] Share database with Notion integration
- [ ] Copy database ID and integration token to GitHub secrets

## Testing Your Structure

Run the sync script locally to test:

```bash
# Add to .env:
NOTION_API_KEY=secret_xxx
NOTION_DATABASE_ID=xxx

# Run:
npx tsx scripts/sync-data.ts
```

Expected output:
```
🗓️  Fetching Notion roadmaps...
    Fetching roadmaps from Notion...
    ✓ Fetched roadmaps for 2 project(s): 
      scholarlens-ai (3 sprints, 15 tasks), 
      clicr-cli (2 sprints, 8 tasks)
```
