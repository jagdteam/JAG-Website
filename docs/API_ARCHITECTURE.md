# API Architecture - Frontend vs Backend

**Date**: January 12, 2026  
**Purpose**: Explain the separation between frontend API clients and backend serverless functions

---

## 🏗️ Architecture Overview

Your application uses a **Backend-for-Frontend (BFF)** pattern with separate frontend and backend code:

```
┌─────────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React App (runs client-side)                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  src/lib/api/notion.ts                          │  │  │
│  │  │  - Frontend API Client                          │  │  │
│  │  │  - NO API keys                                  │  │  │
│  │  │  - Just HTTP calls                              │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS Request
                          ↓
┌─────────────────────────────────────────────────────────────┐
│              VERCEL SERVERLESS FUNCTIONS                    │
│  (jagdnotionapiserver.vercel.app)                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  api/notion/roadmap.js                                │  │
│  │  - Backend Serverless Function                        │  │
│  │  - HAS API keys (env vars)                           │  │
│  │  - Makes authenticated requests to Notion            │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ Authenticated Request
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    NOTION API                               │
│         (api.notion.com)                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 File Locations & Purposes

### **Frontend** - `src/lib/api/`

| File | Purpose | Runs On | Has Keys? |
|------|---------|---------|-----------|
| `src/lib/api/notion.ts` | Client-side code that calls backend endpoints | Browser | ❌ NO |
| `src/lib/api/github.ts` | Client-side code that calls backend endpoints | Browser | ❌ NO |
| `src/lib/api/leetcode.ts` | Client-side code that calls backend endpoints | Browser | ❌ NO |

**What they do:**
```typescript
// Example from notion.ts
export async function fetchProjectRoadmap(projectSlug: string) {
  const url = `https://jagdnotionapiserver.vercel.app/api/notion/roadmap?projectSlug=${projectSlug}`;
  const response = await fetch(url); // Simple HTTP call
  return response.json();
}
```

### **Backend** - `api/`

| File | Purpose | Runs On | Has Keys? |
|------|---------|---------|-----------|
| `api/notion/roadmap.js` | Serverless function with Notion authentication | Vercel Servers | ✅ YES |
| `api/notion/test.js` | Serverless function to test Notion connection | Vercel Servers | ✅ YES |

**What they do:**
```javascript
// Example from roadmap.js
module.exports = async (req, res) => {
  const notion = new Client({
    auth: process.env.VITE_NOTION_API_KEY, // 🔑 API Key here!
  });
  
  const data = await notion.databases.query({ ... });
  res.json({ success: true, data });
};
```

---

## ❌ Why They CAN'T Be Consolidated

### **Security Reasons**

| If we put everything in `src/lib/api/`... | Result |
|-------------------------------------------|--------|
| Frontend code is bundled and sent to browser | Users can see the entire code |
| API keys would be visible in browser DevTools | 🚨 **SECURITY BREACH** |
| Anyone could steal your keys and abuse your API | 💸 **Unlimited costs** |

### **Different Execution Environments**

| Frontend (`src/lib/api/`) | Backend (`api/`) |
|---------------------------|------------------|
| Runs in user's browser | Runs on Vercel servers |
| No access to environment variables | Full access to `process.env` |
| Can't make authenticated requests | Can safely use API keys |
| Must call backend endpoints | Directly calls third-party APIs |

---

## 🎯 Why GitHub & LeetCode Don't Have Backend Files

You mentioned that GitHub and LeetCode are "fully functional and running on the Vercel server." This means:

1. **Backend files DO exist** - they're just in a different repository or deployment
2. **They follow the same pattern** - frontend calls backend endpoints
3. **Your main repo only has frontend clients** - `src/lib/api/github.ts` and `src/lib/api/leetcode.ts`

The backend serverless functions for GitHub and LeetCode are likely in your `jagdnotionapiserver` deployment (the same one hosting your Notion functions).

---

## 📊 Complete Flow Example

```
1. User opens project page in browser
   ↓
2. React component calls: useProjectRoadmap('codelens')
   ↓
3. Hook calls: fetchProjectRoadmap('codelens')
   ↓
4. Frontend client (notion.ts) makes request:
   fetch('https://jagdnotionapiserver.vercel.app/api/notion/roadmap?projectSlug=codelens')
   ↓
5. Vercel routes to: api/notion/roadmap.js
   ↓
6. Backend function:
   - Reads process.env.VITE_NOTION_API_KEY
   - Creates Notion client
   - Queries database with filter: Project = 'codelens'
   - Parses Sprint/Epic/Ticket hierarchy
   ↓
7. Backend returns JSON to frontend
   ↓
8. Frontend displays roadmap in UI
```

---

## 🔧 Environment Variables

### Where They're Stored

```
Frontend (.env file - LOCAL DEVELOPMENT ONLY):
├── VITE_NOTION_API_URL (optional override)
└── ❌ NO API KEYS EVER

Backend (Vercel Dashboard → Environment Variables):
├── VITE_NOTION_API_KEY=secret_xxxxx
└── VITE_NOTION_DATABASE_ID=xxxxx
```

### How Backend Accesses Them

```javascript
// In api/notion/roadmap.js (runs on Vercel servers)
const DATABASE_ID = process.env.VITE_NOTION_DATABASE_ID; // ✅ Secure
const notion = new Client({
  auth: process.env.VITE_NOTION_API_KEY // ✅ Secure
});
```

---

## 🐛 "Database ID not configured" Error

Your error message suggests the backend can't find `process.env.VITE_NOTION_DATABASE_ID`.

### Common Causes:

1. **Environment variable not set in Vercel**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Verify `VITE_NOTION_DATABASE_ID` exists

2. **Typo in variable name**
   - Check exact spelling and case

3. **Deployment not refreshed**
   - After adding env vars, you must redeploy
   - Vercel Dashboard → Deployments → Redeploy

4. **Wrong project slug**
   - Your data has Project = `scholarlens-ai` but you're querying `codelens`
   - Make sure project slug matches exactly (case-sensitive!)

---

## ✅ Correct Architecture Summary

**DO NOT consolidate these files!** They serve different purposes:

| Location | Purpose | Security |
|----------|---------|----------|
| `src/lib/api/*.ts` | Frontend API clients (safe to expose) | Public |
| `api/**/*.js` | Backend serverless functions (keep secret) | Private |

This separation ensures:
- ✅ API keys never exposed to users
- ✅ Secure authentication with third-party APIs
- ✅ Rate limiting controlled on backend
- ✅ Caching can be implemented server-side
- ✅ Users can't abuse your API quotas

---

## 🚀 How to Deploy

1. **Frontend Changes** (`src/lib/api/`)
   - Committed to your main repo
   - Deployed via your main Vercel project

2. **Backend Changes** (`api/`)
   - Committed to your main repo (or separate API repo)
   - Deployed to `jagdnotionapiserver.vercel.app`
   - Vercel automatically detects `/api` folder and creates serverless functions

---

## Questions?

If you're still unclear about the architecture, think of it this way:

- **Frontend** = Waiter at a restaurant (takes your order, brings you food)
- **Backend** = Kitchen (has access to ingredients/secrets, cooks the food)

You can't give customers direct access to the kitchen for security reasons! 🔒
