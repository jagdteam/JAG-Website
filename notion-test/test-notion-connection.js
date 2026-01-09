/**
 * Simple Notion Connection Test Script
 * Run with: node test-notion-connection.js
 * 
 * This is a standalone script to test your Notion API credentials
 * No server needed - just run it once to verify everything works!
 */

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const API_KEY = process.env.VITE_NOTION_API_KEY;
const DATABASE_ID = process.env.VITE_NOTION_DATABASE_ID;

console.log('🔍 Testing Notion API Connection...\n');

// Check if credentials are set
if (!API_KEY) {
  console.error('❌ ERROR: VITE_NOTION_API_KEY not found in .env.local');
  console.log('   Please add: VITE_NOTION_API_KEY=secret_your_token_here');
  process.exit(1);
}

if (!DATABASE_ID) {
  console.error('❌ ERROR: VITE_NOTION_DATABASE_ID not found in .env.local');
  console.log('   Please add: VITE_NOTION_DATABASE_ID=your_database_id_here');
  process.exit(1);
}

console.log('✅ API Key found:', API_KEY.substring(0, 10) + '...');
console.log('✅ Database ID found:', DATABASE_ID.substring(0, 10) + '...\n');

// Initialize Notion client
const notion = new Client({ auth: API_KEY });

console.log('📡 Attempting to connect to Notion...\n');

// Use async IIFE to handle await
(async () => {
  try {
    // Try to query the database
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
    });

  console.log('✅ SUCCESS! Connected to Notion!\n');
  console.log(`📊 Found ${response.results.length} items in your database\n`);

  if (response.results.length > 0) {
    console.log('📋 Your Roadmap Items:\n');
    console.log('─'.repeat(60));
    
    response.results.forEach((page, index) => {
      const props = page.properties;
      const name = props.Name?.title?.[0]?.plain_text || 'Untitled';
      const status = props.Status?.select?.name || 'No status';
      const summary = props.Summary?.rich_text?.[0]?.plain_text || 'No summary';
      const slug = props.Slug?.rich_text?.[0]?.plain_text || 'No slug';
      
      console.log(`\n${index + 1}. ${name}`);
      console.log(`   Status: ${status}`);
      console.log(`   Slug: ${slug}`);
      console.log(`   Summary: ${summary.substring(0, 50)}${summary.length > 50 ? '...' : ''}`);
    });
    
    console.log('\n' + '─'.repeat(60));
  } else {
    console.log('⚠️  Your database is empty. Add some items in Notion first!');
  }

    console.log('\n🎉 Your Notion API integration is working perfectly!');
    console.log('\n💡 Next step: Run the servers to use it in your React app:');
    console.log('   Terminal 1: npm run notion-server');
    console.log('   Terminal 2: npm run dev\n');

  } catch (error) {
  console.error('❌ FAILED to connect to Notion\n');
  console.error('Error:', error.message);
  
  if (error.code === 'unauthorized') {
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check your API key is correct');
    console.log('   2. Make sure it starts with "secret_"');
  } else if (error.code === 'object_not_found') {
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check your Database ID is correct');
    console.log('   2. Make sure you shared the database with your integration');
    console.log('   3. In Notion: Click "..." → "Add connections" → Select your integration');
  } else {
      console.log('\n💡 Full error details:', error);
    }
    
    process.exit(1);
  }
})();

