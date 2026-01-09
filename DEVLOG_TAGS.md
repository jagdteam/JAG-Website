# DevLog Tagging System

This document explains how commit messages are automatically categorized into different tags (types) for the project devLog.

## 🏷️ Available Tags

The sync script automatically assigns one of these four tags to each commit based on the commit message:

| Tag | Color | Purpose |
|-----|-------|---------|
| `feature` | 🟢 Green | New functionality, features, or additions |
| `fix` | 🔴 Red | Bug fixes, error corrections, issue resolutions |
| `design` | 🎨 Purple | UI/UX changes, styling, visual updates |
| `infra` | 🔵 Blue | Infrastructure, refactoring, dependencies, docs (default) |

---

## 📋 Tagging Rules

The script analyzes your commit message and assigns a tag based on these rules (checked in this order):

### 1. **`fix`** - Bug Fixes
Assigned when the commit message:
- Starts with `fix:` (Conventional Commits format)
- Contains the word `fix`
- Contains the word `bug`

**Examples:**
```bash
git commit -m "fix: resolve login timeout issue"
git commit -m "Fixed navigation bug on mobile"
git commit -m "Bug fix for API rate limiting"
```

### 2. **`feature`** - New Features
Assigned when the commit message:
- Starts with `feat:` (Conventional Commits format)
- Contains the word `feature`
- Contains the word `add` (as in "added", "adding")

**Examples:**
```bash
git commit -m "feat: add dark mode toggle"
git commit -m "Added user authentication feature"
git commit -m "Feature: implement real-time notifications"
```

### 3. **`design`** - UI/UX Changes
Assigned when the commit message:
- Contains the word `design`
- Contains the word `ui`
- Contains the word `style`

**Examples:**
```bash
git commit -m "design: update homepage layout"
git commit -m "UI improvements for dashboard"
git commit -m "Style refactor for mobile responsiveness"
```

### 4. **`infra`** - Infrastructure (Default)
Assigned to everything else that doesn't match above rules.

**Examples:**
```bash
git commit -m "Update dependencies"
git commit -m "Refactor database queries"
git commit -m "Update README documentation"
git commit -m "Merge pull request #123"
```

---

## 🎯 Best Practices

### Use Conventional Commits
For the most accurate tagging, use the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>: <description>

[optional body]
```

**Examples:**
```bash
feat: add user profile page
fix: resolve memory leak in cache
design: update button styles
docs: update API documentation
chore: update dependencies
```

### Be Descriptive
Clear commit messages help both humans and the tagging system:

✅ **Good:**
```bash
git commit -m "feat: add password reset functionality"
git commit -m "fix: resolve race condition in auth flow"
git commit -m "design: improve mobile navigation UX"
```

❌ **Avoid:**
```bash
git commit -m "stuff"
git commit -m "updates"
git commit -m "wip"
```

---

## 🔧 Customizing the Tagging Rules

To modify or add new tagging rules, edit the logic in `scripts/sync-data.ts`:

### Current Implementation
Located at approximately **line 265-273**:

```typescript
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
```

### To Add a New Tag

1. **Update the TypeScript interface** in `scripts/sync-data.ts`:
```typescript
interface DevLogEntry {
  id: string;
  date: string;
  week: string;
  type: 'feature' | 'fix' | 'design' | 'infra' | 'performance'; // Add your new type
  content: string;
  assignee: string;
  assigneeImg?: string;
}
```

2. **Add the detection logic**:
```typescript
let type: DevLogEntry['type'] = 'infra';
const lowerMessage = message.toLowerCase();

if (lowerMessage.startsWith('fix:') || lowerMessage.includes('fix') || lowerMessage.includes('bug')) {
  type = 'fix';
} else if (lowerMessage.startsWith('feat:') || lowerMessage.includes('feature') || lowerMessage.includes('add')) {
  type = 'feature';
} else if (lowerMessage.includes('design') || lowerMessage.includes('ui') || lowerMessage.includes('style')) {
  type = 'design';
} else if (lowerMessage.startsWith('perf:') || lowerMessage.includes('performance') || lowerMessage.includes('optimize')) {
  type = 'performance'; // Your new type
}
```

3. **Update the display styling** in `src/components/ProjectDetails.tsx` to show the new tag with appropriate colors.

4. **Run the sync** to apply changes:
```bash
npm run sync-data
```

### Common Customizations

**Example: Add a "Security" tag**
```typescript
} else if (lowerMessage.startsWith('security:') || lowerMessage.includes('security') || lowerMessage.includes('vulnerability')) {
  type = 'security';
```

**Example: Add a "Documentation" tag**
```typescript
} else if (lowerMessage.startsWith('docs:') || lowerMessage.includes('documentation') || lowerMessage.includes('readme')) {
  type = 'docs';
```

**Example: Add a "Testing" tag**
```typescript
} else if (lowerMessage.startsWith('test:') || lowerMessage.includes('test') || lowerMessage.includes('spec')) {
  type = 'test';
```

---

## 🔄 Sync Workflow

1. **Team members commit** with descriptive messages
2. **Sync script runs** (manually via `npm run sync-data` or automatically daily at 2 AM UTC)
3. **Script analyzes** the last 100 commits from each repo
4. **Filters** to only show commits from your 4 team members
5. **Assigns tags** based on commit message keywords
6. **Updates** `src/data/projects.ts` with the 15 most recent team commits per project

---

## 📊 Viewing DevLogs

DevLogs are displayed on your website's **Projects page** under each project's details section. Each entry shows:
- 📅 Date and week
- 🏷️ Tag (color-coded badge)
- 📝 Commit message
- 👤 Team member (with profile picture)

---

## 🤝 Team Convention

For consistency across the team, consider adopting these commit message conventions:

| Prefix | Use For | Example |
|--------|---------|---------|
| `feat:` | New features | `feat: add user dashboard` |
| `fix:` | Bug fixes | `fix: resolve login issue` |
| `design:` | UI/UX changes | `design: update color scheme` |
| `refactor:` | Code refactoring | `refactor: simplify auth logic` |
| `docs:` | Documentation | `docs: update API guide` |
| `test:` | Tests | `test: add unit tests for auth` |
| `chore:` | Maintenance | `chore: update dependencies` |

---

## 📝 Notes

- **Order matters**: The script checks conditions in order (fix → feature → design → infra), so the first match wins
- **Case insensitive**: All message matching is case-insensitive
- **Partial matching**: Words can appear anywhere in the message (e.g., "Fixed" matches "fix")
- **Default fallback**: Any commit that doesn't match a rule becomes `infra`
- **Team member filtering**: Only commits from your 4 team members appear in devLogs

---

**Last Updated:** January 2026
**Maintained by:** JAGD Team
