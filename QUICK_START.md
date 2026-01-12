# 🚀 Quick Start - Serverless Backend Implementation

## TL;DR

Your **frontend is done** ✅. Now implement the backend by copying code from `BACKEND_IMPLEMENTATION_PROMPTS.md` into your `JAGD-Notion-API-Server` repo.

---

## 📝 Step-by-Step

### 1. Go to Your Backend Repo

```bash
cd ~/path/to/JAGD-Notion-API-Server
```

### 2. Open the Prompts Document

Open `BACKEND_IMPLEMENTATION_PROMPTS.md` from this repository (the frontend repo).

### 3. Copy Files One-by-One

Create these files by copying the **exact code** from the prompts document:

```
/api/github/test.js
/api/github/contributions.js
/api/github/commits.js
/api/leetcode/test.js
/api/leetcode/stats.js
```

Update this file with caching:
```
/api/notion/roadmap.js
```

### 4. Install Dependencies

```bash
npm install @octokit/rest node-fetch
```

### 5. Add Environment Variables to `.env.local`

```bash
# GitHub Tokens
GITHUB_API_TOKEN=your_main_org_token
GIUSEPPI_GITHUB_TOKEN=your_token
JOHNNY_GITHUB_TOKEN=johnny_classic_token  # ⚠️ Must be Classic PAT, not fine-grained
ANDREW_GITHUB_TOKEN=andrew_token
DYLAN_GITHUB_TOKEN=dylan_token

# Notion (already have this)
NOTION_TOKEN=your_notion_token
```

### 6. Test Locally (Optional)

```bash
vercel dev
```

Then in another terminal:
```bash
npm run test:github
npm run test:leetcode
```

### 7. Deploy to Vercel

```bash
git add .
git commit -m "feat: Add GitHub/LeetCode APIs with midnight PST caching"
git push
```

Vercel auto-deploys! ✅

### 8. Add Environment Variables to Vercel Dashboard

1. Go to https://vercel.com/your-team/your-project/settings/environment-variables
2. Add all tokens (same as `.env.local`)
3. Click **"Redeploy"** to apply

### 9. Test Production

```bash
curl https://jagdnotionapiserver.vercel.app/api/github/test
curl https://jagdnotionapiserver.vercel.app/api/github/contributions?username=giuseppi
curl https://jagdnotionapiserver.vercel.app/api/leetcode/stats?username=giuseppi
```

Should all return `{ "success": true, ... }`

### 10. Deploy Frontend (If Needed)

Your frontend repo is already set up. If using Lovable, just push your changes. If using Vercel:

```bash
cd ~/path/to/JAGD-Company-Website
git add .
git commit -m "refactor: Migrate to serverless backend for GitHub/LeetCode data"
git push
```

### 11. Test Live Website

- Open your website
- Click a team member → Activity graphs should load 🎉
- Go to Projects → Dev logs should populate 🎉

---

## ⚠️ Important Notes

1. **Johnny's Token Must Be Classic PAT**
   - Fine-grained tokens don't work with GraphQL API
   - Generate at: https://github.com/settings/tokens
   - Select scopes: `repo`, `read:org`

2. **Cache Timing**
   - Data caches until **midnight PST**
   - First visitor after midnight triggers fresh fetch
   - Everyone else gets cached data

3. **API Rate Limits**
   - GitHub: 5,000 requests/hour (with token)
   - LeetCode: No official limit (public API)
   - Caching ensures you stay well under limits

---

## 🐛 Common Issues

### "GitHub API returned 401"
**Fix:** Check token in Vercel environment variables

### "Johnny's contributions not showing"
**Fix:** Replace fine-grained token with Classic PAT

### "CORS error"
**Fix:** Check CORS headers in backend files (should already be correct)

### "Data is stale"
**Fix:** Wait until midnight PST for cache refresh

---

## 📚 Full Documentation

- `BACKEND_IMPLEMENTATION_PROMPTS.md` - Complete backend code (copy-paste ready)
- `FRONTEND_SERVERLESS_MIGRATION.md` - Detailed explanation of all changes
- `DATA_SYNC_ARCHITECTURE.md` - Original architecture (now deprecated)

---

## ✅ Checklist

Frontend:
- [x] API clients created
- [x] React hooks created
- [x] Components updated
- [x] Data files cleaned up

Backend:
- [ ] Files created in `JAGD-Notion-API-Server` repo
- [ ] Dependencies installed
- [ ] Environment variables added to `.env.local`
- [ ] Tested locally (optional)
- [ ] Committed and pushed to GitHub
- [ ] Environment variables added to Vercel dashboard
- [ ] Redeployed on Vercel
- [ ] Tested production endpoints
- [ ] Tested live website

---

**Need help?** Re-read `BACKEND_IMPLEMENTATION_PROMPTS.md` - everything is in there! 🚀
