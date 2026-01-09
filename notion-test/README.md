# Notion Test Files

This folder contains all Notion-related test and development files.

## Files

### `test-notion-connection.js`
Standalone Node.js script to test your Notion API connection.

**Usage:**
```bash
npm run test-notion
```

**What it does:**
- Verifies your `.env.local` credentials are correct
- Tests connection to your Notion database
- Displays sample data from your database

### `local-server.cjs`
Local development backend server for testing the Notion API integration.

**Usage:**
```bash
npm run notion-server
```

**What it does:**
- Runs an Express server on `http://localhost:3001`
- Provides `/api/notion/test` endpoint for testing
- Provides `/api/notion/roadmap` endpoint for fetching roadmap data
- Mirrors the production Vercel serverless functions

**Endpoints:**
- Test: `http://localhost:3001/api/notion/test`
- Roadmap: `http://localhost:3001/api/notion/roadmap?projectSlug=scholarlens-ai`

### `notion-api.js`
Alternative implementation of the backend server (ES Modules version).

## Quick Start

1. **Test your Notion connection:**
   ```bash
   npm run test-notion
   ```

2. **Run the local backend:**
   ```bash
   npm run notion-server
   ```

3. **In another terminal, run the frontend:**
   ```bash
   npm run dev
   ```

## Environment Variables

Make sure you have `.env.local` in your project root with:

```bash
VITE_NOTION_API_KEY=secret_your_notion_token
VITE_NOTION_DATABASE_ID=your_database_id
```

## Troubleshooting

See the main **[NOTION_INTEGRATION_GUIDE.md](../NOTION_INTEGRATION_GUIDE.md)** for detailed troubleshooting steps.

## Production

These files are for **local development only**. In production:
- Backend is deployed as Vercel serverless functions (`api/notion/`)
- Frontend points to the Vercel backend URL via `VITE_NOTION_API_URL`

