# Private Contributions Guide

## Does the GitHub Activity Graph Include Private Repo Commits?

**Short Answer:** It depends on whose token is being used.

## How It Works

The GitHub GraphQL API has a limitation:
- ✅ **Private contributions ARE included** for the **token owner** (the person who created the token)
- ❌ **Private contributions are NOT included** for other users when querying with someone else's token

This is a GitHub API security feature - you can only see your own private contributions.

## Current Setup

Right now, you're using a **single shared token** (`GITHUB_TOKEN` in `.env`):
- **Token owner's graph**: Shows public + private contributions ✅
- **Other team members' graphs**: Only show public contributions ❌

## Solution: Individual Tokens for Each Team Member

To show private contributions for ALL team members, each person needs to provide their own GitHub token.

### Step 1: Each Team Member Creates a Token

Each team member should:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Click "Generate new token"
3. Configure:
   - **Token name**: `JAGD-Website-Sync-[YourName]`
   - **Expiration**: 1 year (or custom)
   - **Repository access**:
     - Select "All repositories" OR
     - Select specific repositories (jagdteam/Education-Project, jagdteam/Clutch, etc.)
   - **Permissions**:
     - Repository permissions → Contents: **Read-only**
     - Account permissions → (none needed)
4. Click "Generate token"
5. **Copy the token immediately** (you won't see it again!)

### Step 2: Add Tokens to `.env`

Update your `.env` file to include individual tokens:

```bash
# Main token (for repo access and fallback)
GITHUB_TOKEN=ghp_your_main_token_here

# Individual tokens for private contributions (optional)
ANDREW_GITHUB_TOKEN=ghp_andrews_token_here
GIUSEPPI_GITHUB_TOKEN=ghp_giuseppis_token_here
JOHNNY_GITHUB_TOKEN=ghp_johnnys_token_here
DYLAN_GITHUB_TOKEN=ghp_dylans_token_here
```

**Important:**
- Each person's token should be created by THAT person's GitHub account
- If a personal token is not provided, it will fall back to the main `GITHUB_TOKEN`
- The main `GITHUB_TOKEN` is still needed for accessing private repos (Education-Project, Clutch)

### Step 3: Run the Sync Script

```bash
npm run sync-data
```

The script will now use each person's individual token to fetch their contributions, including private repos!

## For GitHub Actions

To enable this in the automated workflow:

1. Go to your GitHub repo → Settings → Secrets and variables → Actions
2. Add each token as a secret:
   - `ANDREW_GITHUB_TOKEN`
   - `GIUSEPPI_GITHUB_TOKEN`
   - `JOHNNY_GITHUB_TOKEN`
   - `DYLAN_GITHUB_TOKEN`

3. Update `.github/workflows/sync-data.yml`:

```yaml
env:
  GITHUB_TOKEN: ${{ secrets.GH_PAT }}
  ANDREW_GITHUB_TOKEN: ${{ secrets.ANDREW_GITHUB_TOKEN }}
  GIUSEPPI_GITHUB_TOKEN: ${{ secrets.GIUSEPPI_GITHUB_TOKEN }}
  JOHNNY_GITHUB_TOKEN: ${{ secrets.JOHNNY_GITHUB_TOKEN }}
  DYLAN_GITHUB_TOKEN: ${{ secrets.DYLAN_GITHUB_TOKEN }}
```

## Verification

After running the sync script, check if private contributions are showing:

1. Look at the activity graph for each team member
2. Compare with their actual GitHub profile (while logged in)
3. Private contributions should now match!

## Troubleshooting

### "No token available for [username]"
- The personal token for that user is not set in `.env`
- It will fall back to the main `GITHUB_TOKEN` (showing only public contributions)

### "Still not seeing private contributions"
- Verify the token was created by the correct GitHub account
- Ensure the token has `repo` scope (or "Contents: Read-only" for fine-grained tokens)
- Check token expiration date

### "Token not loading from .env"
- Make sure there are no leading/trailing spaces
- Format: `ANDREW_GITHUB_TOKEN=ghp_...` (no spaces around `=`)
- Run with: `export GITHUB_TOKEN=$(cat .env | grep "^GITHUB_TOKEN=" | cut -d '=' -f2) && npm run sync-data`

## Privacy Note

Each team member's token should be:
- ✅ Created by their own GitHub account
- ✅ Kept private (never commit to git)
- ✅ Stored securely in `.env` (already in `.gitignore`)
- ✅ Rotated periodically (every 6-12 months)

---

**Last Updated:** January 8, 2026
