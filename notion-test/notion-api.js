/**
 * Simple Express server to handle Notion API calls
 * Run this with: node server/notion-api.js
 */

const express = require('express');
const cors = require('cors');
const { Client } = require('@notionhq/client');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3001;

// Enable CORS for your frontend
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,
}));

app.use(express.json());

// Initialize Notion client
const notion = new Client({
  auth: process.env.VITE_NOTION_API_KEY,
});

const DATABASE_ID = process.env.VITE_NOTION_DATABASE_ID;

// Test endpoint
app.get('/api/notion/test', async (req, res) => {
  try {
    if (!DATABASE_ID) {
      return res.status(500).json({
        success: false,
        message: 'Database ID not configured',
      });
    }

    const response = await notion.dataSources.query({
      data_source_id: DATABASE_ID,
    });

    res.json({
      success: true,
      message: `Successfully connected! Found ${response.results.length} items in database.`,
      count: response.results.length,
    });
  } catch (error) {
    console.error('Notion API Error:', error);
    res.status(500).json({
      success: false,
      message: `Connection failed: ${error.message}`,
    });
  }
});

// Fetch all roadmap items
app.get('/api/notion/roadmap', async (req, res) => {
  try {
    const { projectSlug } = req.query;

    if (!DATABASE_ID) {
      return res.status(500).json({
        success: false,
        error: 'Database ID not configured',
      });
    }

    const queryOptions = {
      data_source_id: DATABASE_ID,
    };

    // Add filter if projectSlug is provided
    if (projectSlug) {
      queryOptions.filter = {
        property: 'Slug',
        rich_text: {
          equals: projectSlug,
        },
      };
    }

    const response = await notion.dataSources.query(queryOptions);

    // Map Notion data to our format
    const items = response.results.map((page) => {
      const properties = page.properties;
      const notionStatus = properties.Status?.select?.name?.toLowerCase() || 'not started';
      
      let status;
      if (notionStatus.includes('progress')) {
        status = 'in-progress';
      } else if (notionStatus === 'finished' || notionStatus === 'completed') {
        status = 'completed';
      } else if (notionStatus === 'not started') {
        status = 'not-started';
      } else {
        status = 'planned';
      }

      return {
        id: page.id,
        name: properties.Name?.title?.[0]?.plain_text || '',
        status,
        summary: properties.Summary?.rich_text?.[0]?.plain_text || '',
        slug: properties.Slug?.rich_text?.[0]?.plain_text || '',
      };
    });

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error('Notion API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Notion API server running on http://localhost:${PORT}`);
  console.log(`Test it at: http://localhost:${PORT}/api/notion/test`);
});

