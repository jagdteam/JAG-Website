# Notion Database Structure for Roadmap

**Date**: January 12, 2026  
**Purpose**: Define the required Notion database schema for Sprint/Epic/Ticket roadmap

---

## Database Properties Required

Your Notion database needs the following properties to work with the updated API:

### Core Properties (All Page Types)

| Property Name | Type | Required | Description |
|--------------|------|----------|-------------|
| **Name** | Title | ✅ Yes | Name of the Sprint/Epic/Ticket |
| **Type** | Select | ✅ Yes | Options: `Sprint`, `Epic`, `Ticket` |
| **Status** | Select | ✅ Yes | Options: `Not Started`, `In Progress`, `Completed` |
| **Project** | Rich Text | ✅ Yes | Project slug (e.g., `scholarlens-ai`, `clicr-cli`) |
| **Description** | Rich Text | ⚪ Optional | Detailed description |

### Sprint-Specific Properties

| Property Name | Type | Required | Description |
|--------------|------|----------|-------------|
| **Sprint Number** | Number | ⚪ Optional | Sprint iteration number (1, 2, 3, etc.) |
| **Start Date** | Date | ⚪ Optional | Sprint start date |
| **End Date** | Date | ⚪ Optional | Sprint end date |

### Epic-Specific Properties

| Property Name | Type | Required | Description |
|--------------|------|----------|-------------|
| **Priority** | Select | ⚪ Optional | Options: `High`, `Medium`, `Low` |
| **Sprint** | Relation | ✅ Yes | Link to parent Sprint page |

### Ticket-Specific Properties

| Property Name | Type | Required | Description |
|--------------|------|----------|-------------|
| **Assignees** | Multi-select or People | ⚪ Optional | Names of people assigned (can be multiple) |
| **Story Points** | Number | ⚪ Optional | Effort estimate (1-13) |
| **Epic** | Relation | ✅ Yes | Link to parent Epic page |

---

## Database Relationships

The database uses **Relations** to create the hierarchy:

```
Sprint (Type: Sprint)
  ├── Sprint Relation Property (used by Epics to link up)
  │
  └── Epic (Type: Epic)
        ├── Sprint: [Relation to parent Sprint]
        ├── Epic Relation Property (used by Tickets to link up)
        │
        └── Ticket (Type: Ticket)
              └── Epic: [Relation to parent Epic]
```

---

## Example Pages

### Sprint Page Example
```
Name: Sprint 1: Setting Up Environment
Type: Sprint
Status: In Progress
Project: scholarlens-ai
Sprint Number: 1
Start Date: 2026-01-12
End Date: 2026-01-18
Description: Initial setup and infrastructure
```

### Epic Page Example
```
Name: CI/CD & Operations
Type: Epic
Status: In Progress
Project: scholarlens-ai
Priority: High
Sprint: [Relation to "Sprint 1: Setting Up Environment"]
Description: Set up continuous integration pipeline
```

### Ticket Page Example
```
Name: Configure GitHub Actions
Type: Ticket
Status: Completed
Project: scholarlens-ai
Assignees: [John Doe, Jane Smith]  (Multi-select or People field)
Story Points: 5
Epic: [Relation to "CI/CD & Operations"]
Description: Set up automated testing pipeline
```

---

## API Response Format

When you call `/api/notion/roadmap?projectSlug=scholarlens-ai`, the backend returns:

```json
{
  "success": true,
  "data": [
    {
      "id": "sprint-page-id",
      "name": "Sprint 1: Setting Up Environment",
      "sprintNumber": 1,
      "startDate": "2026-01-12",
      "endDate": "2026-01-18",
      "status": "in-progress",
      "epics": [
        {
          "id": "epic-page-id",
          "name": "CI/CD & Operations",
          "status": "in-progress",
          "description": "Set up continuous integration pipeline",
          "priority": "High",
          "tickets": [
            {
              "id": "ticket-page-id",
              "name": "Configure GitHub Actions",
              "status": "completed",
              "description": "Set up automated testing pipeline",
              "assignees": ["John Doe", "Jane Smith"],
              "storyPoints": 5
            }
          ]
        }
      ]
    }
  ]
}
```

---

## Setup Steps

1. **Create/Update Notion Database**
   - Add all required properties listed above
   - Create two **Relation** properties:
     - `Sprint` (for Epics to link to Sprints)
     - `Epic` (for Tickets to link to Epics)

2. **Create Sprint Pages**
   - Set `Type` = `Sprint`
   - Fill in name, dates, project slug

3. **Create Epic Pages**
   - Set `Type` = `Epic`
   - Link to parent Sprint using `Sprint` relation
   - Add same `Project` value as Sprint

4. **Create Ticket Pages**
   - Set `Type` = `Ticket`
   - Link to parent Epic using `Epic` relation
   - Add same `Project` value as Epic

5. **Deploy to Vercel**
   - Push the updated `api/notion/roadmap.js` to your repo
   - Vercel will automatically redeploy
   - Test the endpoint: `https://jagdnotionapiserver.vercel.app/api/notion/roadmap?projectSlug=scholarlens-ai`

---

## Status Mapping

The backend automatically maps Notion status values:

| Notion Status | Maps To |
|--------------|---------|
| `Not Started` | `not-started` |
| `In Progress`, `Doing` | `in-progress` |
| `Completed`, `Done` | `completed` |

---

## Environment Variables

Ensure these are set in Vercel:

```bash
VITE_NOTION_API_KEY=secret_xxxxxxxxxxxxx
VITE_NOTION_DATABASE_ID=xxxxxxxxxxxxx
```

---

## Testing

After setting up your database:

1. **Test the API directly**:
   ```bash
   curl "https://jagdnotionapiserver.vercel.app/api/notion/roadmap?projectSlug=scholarlens-ai"
   ```

2. **Check browser console** on your website:
   - Look for `📡 Fetching roadmap from:` logs
   - Verify `✅ Received X sprints` message

3. **Verify UI**:
   - Navigate to project page
   - Click "Roadmap" tab
   - Expand epics to see tickets

---

## Troubleshooting

**Empty data returned?**
- Check that `Project` field matches exactly (case-sensitive)
- Verify `Type` select is set correctly on all pages
- Ensure Relations are properly linked

**Missing epics/tickets?**
- Verify Epic has `Sprint` relation filled
- Verify Ticket has `Epic` relation filled
- Check that all items have the same `Project` value

**Backend errors?**
- Check Vercel function logs
- Verify environment variables are set
- Ensure Notion integration has database access

---

## Questions?

If you need help setting up your Notion database, refer to this structure or check the inline comments in `api/notion/roadmap.js`.
