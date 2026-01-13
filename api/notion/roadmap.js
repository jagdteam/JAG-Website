/**
 * Vercel Serverless Function - Fetch Roadmap Data (Sprint/Epic/Ticket Structure)
 * Endpoint: /api/notion/roadmap
 */

const { Client } = require('@notionhq/client');

/**
 * Helper function to safely extract text from Notion property
 */
function getTextProperty(props, propertyName) {
  const property = props[propertyName];
  if (property?.type === 'title' && property.title?.[0]?.plain_text) {
    return property.title[0].plain_text;
  }
  if (property?.type === 'rich_text' && property.rich_text?.[0]?.plain_text) {
    return property.rich_text[0].plain_text;
  }
  return '';
}

/**
 * Helper function to extract select/status property
 */
function getSelectProperty(props, propertyName) {
  return props[propertyName]?.select?.name || null;
}

/**
 * Helper function to extract number property
 */
function getNumberProperty(props, propertyName) {
  return props[propertyName]?.number || null;
}

/**
 * Helper function to extract date property
 */
function getDateProperty(props, propertyName) {
  return props[propertyName]?.date?.start || null;
}

/**
 * Helper function to extract multi-select property (returns array of strings)
 */
function getMultiSelectProperty(props, propertyName) {
  const property = props[propertyName];
  if (property?.type === 'multi_select' && Array.isArray(property.multi_select)) {
    return property.multi_select.map(item => item.name);
  }
  return [];
}

/**
 * Helper function to extract people property (returns array of names)
 */
function getPeopleProperty(props, propertyName) {
  const property = props[propertyName];
  if (property?.type === 'people' && Array.isArray(property.people)) {
    return property.people.map(person => person.name || person.id);
  }
  return [];
}

/**
 * Map Notion status to our standard format
 */
function mapStatus(notionStatus) {
  if (!notionStatus) return 'not-started';
  const status = notionStatus.toLowerCase();
  if (status.includes('progress') || status.includes('doing')) {
    return 'in-progress';
  } else if (status.includes('complete') || status.includes('done')) {
    return 'completed';
  }
  return 'not-started';
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { projectSlug } = req.query;
    const DATABASE_ID = process.env.VITE_NOTION_DATABASE_ID;

    if (!DATABASE_ID) {
      return res.status(500).json({
        success: false,
        error: 'Database ID not configured',
      });
    }

    // Initialize Notion client
    const notion = new Client({
      auth: process.env.VITE_NOTION_API_KEY,
    });

    // Query all pages from the database
    const queryOptions = {
      database_id: DATABASE_ID,
    };

    // Add project filter if provided
    if (projectSlug) {
      queryOptions.filter = {
        property: 'Project',
        rich_text: {
          equals: projectSlug,
        },
      };
    }

    const response = await notion.databases.query(queryOptions);

    console.log(`📊 Fetched ${response.results.length} pages from Notion`);

    // Parse pages and organize into Sprint → Epic → Ticket hierarchy
    const sprintsMap = new Map();
    const epicsMap = new Map();
    const ticketsMap = new Map();

    // First pass: categorize pages by type
    response.results.forEach((page) => {
      const props = page.properties;
      const pageType = getSelectProperty(props, 'Type') || 'Sprint'; // Default to Sprint for backward compatibility
      const id = page.id;

      if (pageType === 'Sprint') {
        sprintsMap.set(id, {
          id,
          name: getTextProperty(props, 'Name') || 'Untitled Sprint',
          sprintNumber: getNumberProperty(props, 'Sprint Number'),
          startDate: getDateProperty(props, 'Start Date'),
          endDate: getDateProperty(props, 'End Date'),
          status: mapStatus(getSelectProperty(props, 'Status')),
          epics: [],
        });
      } else if (pageType === 'Epic') {
        epicsMap.set(id, {
          id,
          name: getTextProperty(props, 'Name') || 'Untitled Epic',
          status: mapStatus(getSelectProperty(props, 'Status')),
          description: getTextProperty(props, 'Description'),
          priority: getSelectProperty(props, 'Priority'),
          parentSprintId: props.Sprint?.relation?.[0]?.id || null,
          tickets: [],
        });
      } else if (pageType === 'Ticket') {
        // Try both "Assignees" (plural) and "Assignee" (singular) for flexibility
        const assignees = getMultiSelectProperty(props, 'Assignees') || 
                         getPeopleProperty(props, 'Assignees') ||
                         getMultiSelectProperty(props, 'Assignee') ||
                         getPeopleProperty(props, 'Assignee') ||
                         [];
        
        ticketsMap.set(id, {
          id,
          name: getTextProperty(props, 'Name') || 'Untitled Ticket',
          status: mapStatus(getSelectProperty(props, 'Status')),
          description: getTextProperty(props, 'Description'),
          assignees: assignees,
          storyPoints: getNumberProperty(props, 'Story Points'),
          parentEpicId: props.Epic?.relation?.[0]?.id || null,
        });
      }
    });

    console.log(`📦 Parsed: ${sprintsMap.size} sprints, ${epicsMap.size} epics, ${ticketsMap.size} tickets`);

    // Second pass: build hierarchy
    // Attach tickets to epics
    ticketsMap.forEach((ticket) => {
      if (ticket.parentEpicId && epicsMap.has(ticket.parentEpicId)) {
        const epic = epicsMap.get(ticket.parentEpicId);
        epic.tickets.push({
          id: ticket.id,
          name: ticket.name,
          status: ticket.status,
          description: ticket.description,
          assignees: ticket.assignees,
          storyPoints: ticket.storyPoints,
        });
      }
    });

    // Attach epics to sprints
    epicsMap.forEach((epic) => {
      if (epic.parentSprintId && sprintsMap.has(epic.parentSprintId)) {
        const sprint = sprintsMap.get(epic.parentSprintId);
        sprint.epics.push({
          id: epic.id,
          name: epic.name,
          status: epic.status,
          description: epic.description,
          priority: epic.priority,
          tickets: epic.tickets,
        });
      }
    });

    // Convert to array and sort by sprint number or start date
    const sprints = Array.from(sprintsMap.values()).sort((a, b) => {
      // Sort by sprint number first
      if (a.sprintNumber !== null && b.sprintNumber !== null) {
        return a.sprintNumber - b.sprintNumber;
      }
      // Then by start date
      if (a.startDate && b.startDate) {
        return new Date(a.startDate) - new Date(b.startDate);
      }
      // Put sprints without dates at the end
      if (a.startDate && !b.startDate) return -1;
      if (!a.startDate && b.startDate) return 1;
      return 0;
    });

    console.log(`✅ Returning ${sprints.length} sprints with nested epics and tickets`);

    res.status(200).json({
      success: true,
      data: sprints,
    });
  } catch (error) {
    console.error('❌ Notion API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

