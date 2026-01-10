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

    const response = await notion.databases.query({
      database_id: DATABASE_ID,
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

// Fetch roadmap items grouped by project and phase
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
      database_id: DATABASE_ID,
    };

    // Add filter if projectSlug is provided
    if (projectSlug) {
      queryOptions.filter = {
        property: 'Project',
        rich_text: {
          equals: projectSlug,
        },
      };
    }

    const response = await notion.databases.query(queryOptions);

    console.log(`\n📊 Fetched ${response.results.length} items from Notion`);
    if (projectSlug) {
      console.log(`🔍 Filtered by project: ${projectSlug}`);
    }

    // Group items by project and phase
    const projectsMap = {};

    response.results.forEach((page) => {
      const props = page.properties;
      
      const project = props.Project?.rich_text?.[0]?.plain_text || '';
      const phaseName = props['Phase Name']?.rich_text?.[0]?.plain_text || '';
      const phase = props.Phase?.select?.name || '';
      const date = props.Date?.rich_text?.[0]?.plain_text || '';
      const notionStatus = props.Status?.select?.name?.toLowerCase() || 'not started';
      
      // Map Notion status to our format
      let status;
      if (notionStatus.includes('progress')) {
        status = 'in-progress';
      } else if (notionStatus === 'completed') {
        status = 'completed';
      } else {
        status = 'not-started';
      }

      const item = {
        name: props.Name?.title?.[0]?.plain_text || '',
        status,
        description: props.Description?.rich_text?.[0]?.plain_text || '',
      };

      // Log each item being processed
      console.log(`  ✓ ${item.name} [${status}] → Project: "${project}" / Phase: "${phase}" / Phase Name: "${phaseName}"`);

      // Initialize project if doesn't exist
      if (!projectsMap[project]) {
        projectsMap[project] = {};
      }

      // Initialize phase if doesn't exist
      if (!projectsMap[project][phase]) {
        projectsMap[project][phase] = {
          id: `${project}-${phase.toLowerCase().replace(/\s+/g, '-')}`,
          name: phaseName,
          phaseKey: phase, // Store the original Phase column value for sorting
          date: date,
          items: [],
        };
      }

      // Add item to phase
      projectsMap[project][phase].items.push(item);
    });

    // Convert to array format and sort phases
    // Define explicit phase order (Phase 1 FIRST, then Phase 2, etc.)
    const phaseOrder = ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5', 'Phase 6', 'Phase 7', 'Phase 8', 'Phase 9', 'Phase 10'];
    
    const result = {};
    Object.entries(projectsMap).forEach(([project, phases]) => {
      // Convert to array
      const phasesArray = Object.values(phases);
      
      console.log(`\n🔍 Before sorting ${project}:`, phasesArray.map(p => `${p.name} (phaseKey: ${p.phaseKey})`));
      
      // Sort phases by their position in the phaseOrder array
      const sortedPhases = phasesArray.sort((a, b) => {
        // Get index in phaseOrder array (if not found, put at end)
        const indexA = phaseOrder.indexOf(a.phaseKey) !== -1 ? phaseOrder.indexOf(a.phaseKey) : 999;
        const indexB = phaseOrder.indexOf(b.phaseKey) !== -1 ? phaseOrder.indexOf(b.phaseKey) : 999;
        
        console.log(`  Comparing: "${a.phaseKey}" (index ${indexA}) vs "${b.phaseKey}" (index ${indexB}) → ${indexA - indexB}`);
        
        return indexA - indexB;
      });
      
      console.log(`✅ After sorting ${project}:`, sortedPhases.map(p => p.name));
      
      // Clean up phaseKey before returning (not needed in frontend)
      sortedPhases.forEach(phase => delete phase.phaseKey);
      
      result[project] = sortedPhases;
      
      console.log(`\n📦 Project: ${project} → ${Object.keys(phases).length} phases`);
    });

    console.log(`✅ Returning grouped roadmap data\n`);

    res.json({
      success: true,
      data: result,
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

