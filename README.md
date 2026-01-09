# JAGD Company Website

Official company website with Notion-powered project roadmaps.

## Project info

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <https://github.com/jagdteam/JAGD-Company-Website.git>

# Step 2: Navigate to the project directory.
cd <JAGD-Company-Website>

# Step 3: Install the necessary dependencies.
npm install

# Step 4: Create .env.local file with your Notion credentials
# See NOTION_INTEGRATION_GUIDE.md for details

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## 📋 Notion Integration

This project uses Notion as a CMS for project roadmap data. See **[NOTION_INTEGRATION_GUIDE.md](./NOTION_INTEGRATION_GUIDE.md)** for complete setup instructions.

### Quick Start

1. Set up your Notion database (see guide)
2. Add environment variables to `.env.local`
3. Run local backend: `npm run notion-server`
4. Run frontend: `npm run dev`

### Test Files

All Notion-related test files are in the `notion-test/` folder:
- `test-notion-connection.js` - Test Notion API connection
- `local-server.cjs` - Local development backend server

Run tests: `npm run test-notion`
```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
