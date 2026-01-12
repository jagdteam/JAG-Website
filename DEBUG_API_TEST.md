# 🧪 API Debugging Script

## Quick Browser Console Test

Open your website (`http://localhost:8080` or `jagd.com`), press **F12** to open Developer Tools, go to **Console** tab, and paste this:

```javascript
// Test GitHub Contributions API for Johnny
async function testJohnnyGitHub() {
  console.log('🧪 Testing Johnny\'s GitHub API...\n');

  const username = 'JohnFok119';
  const apiBase = 'https://jagdnotionapiserver.vercel.app/api';
  const url = `${apiBase}/github/contributions?username=${username}`;

  console.log('📡 Fetching from:', url);

  try {
    const response = await fetch(url);
    const result = await response.json();

    console.log('📥 Raw Response:', result);

    if (result.success) {
      const contributions = result.data;
      const totalDays = contributions.length;
      const activeDays = contributions.filter(d => d.count > 0).length;
      const totalContributions = contributions.reduce((sum, d) => sum + d.count, 0);

      // Group by month
      const byMonth = {};
      contributions.forEach(c => {
        const month = c.date.substring(0, 7); // YYYY-MM
        if (!byMonth[month]) byMonth[month] = { days: 0, count: 0 };
        byMonth[month].days++;
        byMonth[month].count += c.count;
      });

      console.log('\n✅ SUCCESS!');
      console.log('━'.repeat(50));
      console.log(`📊 Total Days:         ${totalDays}`);
      console.log(`🟢 Active Days:        ${activeDays}`);
      console.log(`💚 Total Contributions: ${totalContributions}`);
      console.log('\n📅 Breakdown by Month:');
      console.log('━'.repeat(50));
      Object.entries(byMonth)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([month, stats]) => {
          console.log(`  ${month}:  ${stats.count.toString().padStart(3)} contributions (${stats.days} days)`);
        });
      console.log('━'.repeat(50));

      // Find date range
      const dates = contributions.map(c => c.date).sort();
      console.log(`\n📆 Date Range: ${dates[0]} to ${dates[dates.length - 1]}`);

      // Find most active day
      const mostActive = contributions.reduce((max, d) => d.count > max.count ? d : max, contributions[0]);
      console.log(`🔥 Most Active Day: ${mostActive.date} (${mostActive.count} contributions)`);

    } else {
      console.error('❌ API Error:', result.error);
    }

  } catch (error) {
    console.error('❌ Fetch Error:', error);
  }
}

// Run the test
testJohnnyGitHub();
```

---

## Expected Output

### **If Working Correctly:**
```
🧪 Testing Johnny's GitHub API...

📡 Fetching from: https://jagdnotionapiserver.vercel.app/api/github/contributions?username=JohnFok119
📥 Raw Response: { success: true, data: [...] }

✅ SUCCESS!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Total Days:         150
🟢 Active Days:        45
💚 Total Contributions: 125

📅 Breakdown by Month:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  2024-09:   15 contributions (8 days)
  2024-10:   18 contributions (10 days)
  2024-11:   22 contributions (12 days)
  2024-12:   35 contributions (9 days)
  2025-01:   35 contributions (6 days)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📆 Date Range: 2024-09-01 to 2025-01-12
🔥 Most Active Day: 2024-12-15 (8 contributions)
```

### **If Token Issue:**
```
❌ API Error: Unauthorized or insufficient permissions
```

### **If Backend Down:**
```
❌ Fetch Error: Failed to fetch
```

---

## Compare with GitHub.com

1. Go to: https://github.com/JohnFok119
2. Look at contribution graph
3. Hover over squares to see counts
4. Compare with API output above

**Key Questions:**
- Does the total match?
- Are December 2024 contributions included?
- Are private repo contributions counted?

---

## Test All Team Members

```javascript
async function testAllMembers() {
  const members = [
    { name: 'Andrew', username: 'adespinosa14' },
    { name: 'Giuseppi', username: 'giuseppi' },
    { name: 'Johnny', username: 'JohnFok119' },
    { name: 'Dylan', username: 'DylanN143' }
  ];

  for (const member of members) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`👤 Testing: ${member.name} (@${member.username})`);
    console.log('='.repeat(60));

    const url = `https://jagdnotionapiserver.vercel.app/api/github/contributions?username=${member.username}`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        const total = result.data.reduce((sum, d) => sum + d.count, 0);
        const active = result.data.filter(d => d.count > 0).length;
        console.log(`✅ ${member.name}: ${total} contributions across ${active} active days`);
      } else {
        console.error(`❌ ${member.name}: ${result.error}`);
      }
    } catch (error) {
      console.error(`❌ ${member.name}: Fetch failed -`, error.message);
    }

    // Wait 500ms between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// Run for all members
testAllMembers();
```

---

## Network Tab Inspection

1. Open **Developer Tools** → **Network** tab
2. Filter by "contributions"
3. Reload the page or click on Johnny's profile
4. Look for the API request
5. Click on it to see:
   - **Request Headers** - Is authorization being sent?
   - **Response** - What data is returned?
   - **Timing** - How long is it taking?
   - **Status Code** - 200 OK? 401 Unauthorized? 403 Forbidden?

---

## Backend Direct Test (If You Have Access)

If you can access the Vercel backend logs:

```bash
# View recent function logs
vercel logs --app=jagdnotionapiserver --function=/api/github/contributions

# Or in Vercel Dashboard:
# Project → Deployments → Latest → Functions → /api/github/contributions → View Logs
```

Look for:
- Token validation errors
- Rate limit warnings
- GraphQL query responses
- Cache hit/miss logs
