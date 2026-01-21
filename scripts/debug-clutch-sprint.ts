#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manually load .env file
const envPath = path.resolve(__dirname, '..', '.env');
try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');

  for (const line of envLines) {
    const match = line.match(/^([A-Z_]+)=(.+)$/);
    if (match) {
      const [, key, value] = match;
      process.env[key] = value.trim();
    }
  }
} catch (e) {
  console.error('⚠️  Could not load .env file:', envPath);
}

const NOTION_API_KEY = process.env.NOTION_API_KEY || '';
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
  console.error('❌ Missing NOTION_API_KEY or NOTION_DATABASE_ID in .env');
  process.exit(1);
}

// Helper: Fetch epics for a sprint
async function fetchSprintEpics(sprintId: string) {
  try {
    const response = await fetch(`https://api.notion.com/v1/blocks/${sprintId}/children?page_size=100`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
      },
    });

    if (!response.ok) {
      console.warn(`    ⚠️  Could not fetch children for sprint ${sprintId}`);
      return [];
    }

    const data = await response.json();
    const blocks = data.results || [];

    console.log(`    Found ${blocks.length} child blocks for sprint`);

    const epics = [];
    for (const block of blocks) {
      if (block.type === 'child_page') {
        const epicId = block.id;
        const epicName = block.child_page?.title || 'Unnamed Epic';

        console.log(`      📋 Epic: "${epicName}" (${epicId})`);

        // Fetch tickets for this epic
        const tickets = await fetchEpicTickets(epicId);
        console.log(`         → ${tickets.length} tickets found`);

        epics.push({
          id: epicId,
          name: epicName,
          tickets,
        });
      } else {
        console.log(`      🔹 Block type: ${block.type}`);
      }
    }

    return epics;
  } catch (error) {
    console.error(`    ❌ Error fetching epics:`, error);
    return [];
  }
}

// Helper: Fetch tickets for an epic
async function fetchEpicTickets(epicId: string) {
  try {
    const response = await fetch(`https://api.notion.com/v1/blocks/${epicId}/children?page_size=100`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const blocks = data.results || [];

    const tickets = [];
    for (const block of blocks) {
      if (block.type === 'to_do') {
        const name = block.to_do?.rich_text?.[0]?.plain_text || 'Unnamed Ticket';
        const isChecked = block.to_do?.checked || false;

        console.log(`           ✓ Ticket: "${name}" - ${isChecked ? '✅ completed' : '⬜ not started'}`);

        tickets.push({
          id: block.id,
          name,
          status: isChecked ? 'completed' : 'not-started',
        });
      }
    }

    return tickets;
  } catch (error) {
    console.error(`    ❌ Error fetching tickets:`, error);
    return [];
  }
}

// Main debug function
async function debugClutchSprint() {
  console.log('🔍 Debugging Clutch Sprint Status...\n');
  console.log(`📂 Database ID: ${NOTION_DATABASE_ID}\n`);

  try {
    // Fetch all sprints from Notion database
    const response = await fetch('https://api.notion.com/v1/databases/' + NOTION_DATABASE_ID + '/query', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_size: 100,
      }),
    });

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const pages = data.results || [];

    console.log(`📊 Found ${pages.length} total sprints in database\n`);

    // Filter for Clutch sprints
    const clutchSprints = pages.filter((page) => {
      const projectProp = page.properties?.Project;
      const projectSlug = projectProp?.select?.name || null;
      return projectSlug === 'Clutch';
    });

    console.log(`🎯 Found ${clutchSprints.length} Clutch sprint(s)\n`);

    if (clutchSprints.length === 0) {
      console.log('❌ No Clutch sprints found in Notion database!');
      console.log('\n💡 Make sure:');
      console.log('  1. The sprint page exists in Notion');
      console.log('  2. The "Project" select property is set to "Clutch"');
      console.log('  3. The Notion integration has access to the page');
      return;
    }

    // Analyze each Clutch sprint
    for (const page of clutchSprints) {
      const nameProp = page.properties?.Name || page.properties?.title;
      const sprintName = nameProp?.title?.[0]?.plain_text || 'Unnamed Sprint';

      const sprintNumberProp = page.properties?.['Sprint Number'];
      const sprintNumber = sprintNumberProp?.number || null;

      console.log(`\n${'='.repeat(60)}`);
      console.log(`📝 Sprint: ${sprintName} (Sprint #${sprintNumber})`);
      console.log(`   ID: ${page.id}`);
      console.log(`${'='.repeat(60)}\n`);

      // Fetch epics and tickets
      console.log('  📋 Fetching epics and tickets...\n');
      const epics = await fetchSprintEpics(page.id);

      console.log(`\n  📊 Summary:`);
      console.log(`     Total Epics: ${epics.length}`);

      const allTickets = epics.flatMap((epic) => epic.tickets);
      const completedTickets = allTickets.filter((t) => t.status === 'completed').length;

      console.log(`     Total Tickets: ${allTickets.length}`);
      console.log(`     Completed: ${completedTickets}`);
      console.log(`     Remaining: ${allTickets.length - completedTickets}`);

      // Calculate status (same logic as sync-data.ts)
      let status = 'not-started';
      if (allTickets.length === 0) {
        status = 'not-started';
        console.log(`\n  ⚠️  STATUS: not-started (no tickets found)`);
        console.log(`\n  💡 To fix this:`);
        console.log(`     1. Open the sprint page in Notion`);
        console.log(`     2. Add child pages (these become Epics)`);
        console.log(`     3. Inside each child page, add to-do items (these become Tickets)`);
      } else if (completedTickets === allTickets.length) {
        status = 'completed';
        console.log(`\n  ✅ STATUS: completed (all tickets done)`);
      } else if (completedTickets > 0) {
        status = 'in-progress';
        console.log(`\n  🔄 STATUS: in-progress (some tickets completed)`);
      } else {
        status = 'not-started';
        console.log(`\n  ⏳ STATUS: not-started (no tickets completed yet)`);
      }
    }

    console.log(`\n${'='.repeat(60)}\n`);
    console.log('✅ Debug complete!\n');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the debug
debugClutchSprint().catch(console.error);
