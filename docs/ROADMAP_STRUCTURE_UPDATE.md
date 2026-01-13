# Roadmap Structure Update - Sprint/Epic/Ticket Hierarchy

**Date**: January 12, 2026  
**Type**: Feature Enhancement

---

## Overview

Updated the roadmap system to support a new 3-level hierarchy structure to better align with agile sprint planning methodology. The frontend now fully supports Sprint → Epic → Ticket organization with collapsible epics for better navigation.

---

## Changes Summary

### 1. New Data Structure

**Previous Structure:**
- Phase → Items (2 levels)

**New Structure:**
- Sprint → Epic → Ticket (3 levels)

### 2. Files Modified

#### `src/data/projects.ts`
- **Added** new TypeScript interfaces:
  - `Ticket` - Individual tasks with assignee, story points, status, description
  - `Epic` - Groups of related tickets with priority and status
  - `Sprint` - Sprint weeks containing epics with date ranges and sprint numbers
- **Updated** `Project` interface to use `Sprint[]` instead of `ProjectPhase[]`
- **Kept** old `RoadmapItem` and `ProjectPhase` interfaces for backward compatibility (marked as DEPRECATED)

#### `src/hooks/useProjectRoadmap.ts`
- Changed return type from `ProjectPhase[]` to `Sprint[]`
- Added explicit type annotation for API response data
- Updated JSDoc comments to reflect sprints terminology

#### `src/lib/api/notion.ts`
- Updated all function signatures to use `Sprint` type instead of `ProjectPhase`
- Modified `fetchProjectRoadmap()` return type to `Promise<Sprint[]>`
- Modified `fetchAllRoadmaps()` return type to `Promise<Record<string, Sprint[]>>`
- Updated JSDoc documentation

#### `src/components/ProjectDetails.tsx`
- **Updated** import to use `Sprint` instead of `ProjectPhase`
- **Added** helper functions:
  - `getStatusIcon()` - Returns appropriate icon for status (completed/in-progress/not-started)
  - `getStatusBadgeClass()` - Returns Tailwind classes for status badges
  - `calculateSprintProgress()` - Calculates completion percentage based on tickets
- **Completely rewrote** `RoadmapTab` component with new features:
  - Sprint-level display with date ranges
  - Progress bars showing completion percentage
  - **Collapsible Epics** using Accordion component
  - Nested ticket display under each epic
  - Status indicators for sprints, epics, and tickets
  - Priority badges for epics
  - Story points display for tickets
  - Assignee display for tickets
  - Empty state handling for sprints with no epics/tickets

---

## New TypeScript Interfaces

### Ticket Interface
```typescript
interface Ticket {
  id: string;
  name: string;
  status: 'not-started' | 'in-progress' | 'completed';
  description: string;
  assignee: string | null;
  storyPoints: number | null;
}
```

### Epic Interface
```typescript
interface Epic {
  id: string;
  name: string;
  status: 'not-started' | 'in-progress' | 'completed';
  description: string;
  priority: string | null;
  tickets: Ticket[];
}
```

### Sprint Interface
```typescript
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

---

## Expected API Response Format

The backend API at `/api/notion/roadmap` should return:

```json
{
  "success": true,
  "data": [
    {
      "id": "sprint-uuid",
      "name": "Sprint 1: Setting Up Environment",
      "sprintNumber": 1,
      "startDate": "2026-01-12",
      "endDate": "2026-01-18",
      "status": "in-progress",
      "epics": [
        {
          "id": "epic-uuid",
          "name": "CI/CD & Operations",
          "status": "in-progress",
          "description": "Set up continuous integration pipeline",
          "priority": "High",
          "tickets": [
            {
              "id": "ticket-uuid",
              "name": "Configure GitHub Actions",
              "status": "completed",
              "description": "Set up automated testing pipeline",
              "assignee": "John Doe",
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

## UI Features

### Sprint Display
- **Header**: Sprint name with status badge
- **Date Range**: Start and end dates formatted as "Jan 12 - Jan 18, 2026"
- **Progress Bar**: Calculated based on completed tickets vs total tickets
- **Status Badge**: Color-coded (green=completed, yellow=in-progress, muted=not-started)

### Collapsible Epics
- **Accordion Component**: Each epic can be expanded/collapsed independently
- **Epic Header**:
  - Status icon (checkmark/clock/circle)
  - Epic name (strikethrough if completed)
  - Priority badge (if specified)
  - Task counter (e.g., "3/5 tasks")
- **Epic Content**: List of tickets displayed when expanded

### Ticket Display
- **Status Icon**: Visual indicator of ticket status
- **Ticket Name**: Strikethrough if completed
- **Story Points Badge**: Shows effort estimate
- **Assignee Badge**: Shows who's responsible
- **Description**: Optional detail text in muted color
- **Hover Effect**: Subtle background highlight on hover

---

## Progress Calculation

Sprint progress is automatically calculated:

```typescript
calculateSprintProgress(sprint) {
  - Collects all tickets from all epics
  - Counts completed tickets
  - Returns percentage: (completed / total) * 100
}
```

---

## Backward Compatibility

- Old `ProjectPhase` and `RoadmapItem` interfaces kept in `projects.ts` (marked DEPRECATED)
- If backend returns empty `epics` array, UI displays "No epics defined for this sprint"
- If epic has empty `tickets` array, UI displays "No tickets yet"
- All fields handle null values gracefully (sprint dates, assignees, story points, etc.)

---

## Testing Checklist

- [ ] Verify sprints display correctly with date ranges
- [ ] Test collapsible epics (expand/collapse functionality)
- [ ] Verify progress bar calculation is accurate
- [ ] Check status icons display correctly for all statuses
- [ ] Test empty states (no sprints, no epics, no tickets)
- [ ] Verify responsive layout on mobile devices
- [ ] Test with incomplete data (null fields, missing names, etc.)
- [ ] Verify status badges have correct colors
- [ ] Check ticket story points and assignees display
- [ ] Test hover effects on epics and tickets

---

## Known Limitations

1. **Backend Not Fully Populated**: Current JSON may have empty names/descriptions - this is expected during development
2. **Multiple "New Sprint" entries**: Backend may return duplicate/placeholder sprints - handle gracefully
3. **No sorting logic**: Sprints displayed in API response order - may want to add sorting by startDate in future

---

## Next Steps

1. **Backend**: Ensure Notion API returns fully populated Sprint/Epic/Ticket data
2. **Sorting**: Consider adding sprint sorting by date (most recent first)
3. **Filtering**: Add ability to filter by status (show only in-progress, etc.)
4. **Search**: Add search functionality to find specific epics/tickets
5. **Animations**: Consider adding smoother transitions when expanding/collapsing epics
6. **Mobile Optimization**: Test and optimize layout for smaller screens

---

## Related Files

- `src/data/projects.ts` - Type definitions
- `src/hooks/useProjectRoadmap.ts` - Data fetching hook
- `src/lib/api/notion.ts` - API client
- `src/components/ProjectDetails.tsx` - Roadmap UI component
- `api/notion/roadmap.js` - Backend API endpoint (not modified)

---

## Questions?

If you encounter any issues or need clarification on the new structure, please refer to this document or check the inline JSDoc comments in the source code.
