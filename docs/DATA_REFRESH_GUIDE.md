# Data Refresh Guide

## 🏗️ Architecture Overview

Your website now uses a **serverless architecture** where data is fetched dynamically from backend APIs rather than being stored in static files.

```
Frontend (React) → Backend API (Vercel) → External APIs (GitHub/LeetCode/Notion)
                        ↓
                   Cache (24hrs)
```

---

## 🔄 Two Ways to Sync Data

### **Option 1: `npm run refresh-data` (NEW - Recommended for Testing)**

**What it does:**
- Calls your **Vercel backend APIs** with `?refresh=true` parameter
- Backend **skips its cache** and fetches fresh data from source APIs
- Backend sets `Cache-Control: no-cache` headers
- Perfect for **testing Notion changes immediately**

**Backend Support (✅ Implemented):**
- All API endpoints (`/github/commits`, `/notion/sprints`, `/leetcode/stats`) now respect the `refresh` parameter
- When `refresh=true` is present, backend bypasses its 24-hour cache
- Fresh data is fetched directly from GitHub/Notion/LeetCode APIs

**When to use:**
- Testing new Notion sprints/epics/tickets
- Debugging why data isn't showing correctly
- Want to see changes without waiting for cache to expire

**How to run:**
```bash
npm run refresh-data
```

**Output:**
- Shows which endpoints succeeded/failed
- For Clutch, shows sprint details (status, epics, tickets)
- Helps debug Notion structure issues
- Backend logs show "🔄 Refresh requested - skipping cache"

---

### **Option 2: `npm run sync-data` (OLD - DEPRECATED)**

**What it does:**
- Fetches data from APIs **directly** (not through backend)
- Writes data to **static files** in `src/data/`
- This is the **old architecture** before serverless migration

**Status:** ⚠️ **DEPRECATED**
- Still works but doesn't reflect what users see
- Data written to files is **not used** by the website anymore
- Only useful for debugging API responses locally

---

## 🧪 Testing Notion Changes (Your Use Case)

**Steps:**

1. **Make changes in Notion:**
   - Edit sprint epics, tickets, statuses, etc.
   - For Clutch Sprint 1: Add child pages (epics) with to-do items (tickets)

2. **Refresh data:**
   ```bash
   npm run refresh-data
   ```

3. **Check output:**
   - Look for "Clutch Sprint Details" in the output
   - Verify epics and tickets are showing up
   - Confirm sprint status is correct

4. **View on website:**
   - Refresh your browser
   - Navigate to Projects → Clutch
   - Check if roadmap shows the changes

---

## 🎯 Clutch Sprint Status Issue

**Problem:** Clutch Sprint 1 shows "not-started"

**Why:** Sprint has no epics (child pages) or tickets (to-do items)

**Fix:**
1. Open Clutch Sprint 1 page in Notion
2. Add child pages (become "Epics"):
   - Click "+ New page" inside Sprint 1
   - Name it "User Features", "Core Gameplay", etc.
3. Inside each Epic, add to-do items:
   - Type `/todo` in Notion
   - Add tasks like "Shot tracking", "Ranking system", etc.
4. Check some boxes to mark as complete (changes status to "in-progress")
5. Run `npm run refresh-data` to test

**Status Logic:**
- **not-started**: No tickets exist OR no tickets completed
- **in-progress**: Some tickets completed
- **completed**: All tickets completed

---

## 🔧 Backend Cache Management

**Current Cache:** 24 hours, resets at midnight PST

**✅ Implemented: Refresh Parameter**

All backend endpoints now support the `?refresh=true` parameter to bypass cache:

```bash
# Refresh Notion sprints
GET /api/notion/sprints?projectSlug=Clutch&refresh=true

# Refresh GitHub commits
GET /api/github/commits?repo=jagdteam/clicr&refresh=true

# Refresh GitHub contributions
GET /api/github/contributions?username=giuseppi&refresh=true

# Refresh LeetCode stats
GET /api/leetcode/stats?username=giuseppi&refresh=true
```

**How it works:**
1. Script calls API with `?refresh=${Date.now()}`
2. Backend detects `refresh` parameter
3. Backend skips its internal cache
4. Backend sets `Cache-Control: no-cache, no-store, must-revalidate`
5. Fresh data is fetched from source APIs (GitHub/Notion/LeetCode)
6. Response contains freshly fetched data

**Benefits:**
- ✅ No need to delete static files
- ✅ Works in both dev and production
- ✅ Clean, RESTful approach
- ✅ Respects existing cache for normal requests

---

## 🏗️ How Everything Works Together

### **Data Flow:**

```
1. Normal User Visit:
   Frontend → Check static cache (teamStats.ts, roadmaps.ts)
   ├─ ✅ Cache exists? → Use it (fast! ~30ms)
   └─ ❌ No cache? → Call backend API
                      ├─ Backend cache valid? → Return cached (fast)
                      └─ Cache expired? → Fetch fresh from APIs

2. Testing/Refresh (`npm run refresh-data`):
   Frontend Script → Call backend with ?refresh=true
   Backend → Skip cache → Fetch from APIs → Return fresh data

3. Daily Sync (`npm run sync-data` via GitHub Actions):
   Sync Script → Fetch from APIs → Write to static files
   → Commit to repo → Next deployment includes fresh cache
```

### **Cache Layers:**

1. **Static Files** (Frontend) - `src/data/*.ts`
   - Updated by: `sync-data` script (daily via GitHub Actions)
   - Used by: Frontend hybrid cache (tries first)
   - Bypassed by: Deleting files OR backend returning fresh data

2. **Backend Cache** (Vercel Edge)
   - Duration: 24 hours (midnight PST reset)
   - Controlled by: `Cache-Control` headers
   - Bypassed by: `?refresh=true` parameter

3. **Source APIs** (GitHub/Notion/LeetCode)
   - Always fresh
   - Rate limited
   - Called when both caches bypassed

---

## 📝 Summary

| Script | Purpose | Use Case |
|--------|---------|----------|
| `npm run refresh-data` | ✅ Force backend to refetch data | Testing Notion/API changes |
| `npm run sync-data` | ⚠️ OLD: Write to static files | Daily cron job (GitHub Actions) |
| Manual browser refresh | View cached data | Normal browsing |

**For your Notion testing:** Always use `npm run refresh-data` 🎯
