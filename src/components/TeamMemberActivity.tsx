/**
 * TeamMemberActivity Component
 * Displays GitHub and LeetCode activity graphs for a team member
 * Uses hooks to fetch data dynamically from backend API
 */

import { useGitHubContributions } from '@/hooks/useGitHubContributions';
import { useLeetCodeStats } from '@/hooks/useLeetCodeStats';

interface TeamMemberActivityProps {
  memberName: string;
  github: string;
  leetcode?: string;
}

export const TeamMemberActivity = ({ memberName, github, leetcode }: TeamMemberActivityProps) => {
  // Fetch data using hooks
  const { contributions: githubContributions, loading: githubLoading } = useGitHubContributions(github);
  const { stats: leetcodeStats, loading: leetcodeLoading } = useLeetCodeStats(leetcode || '');

  const renderContributionGraph = (type: 'github' | 'leetcode') => {
    const data = type === 'github' ? githubContributions : leetcodeStats?.recentSubmissions || [];
    const loading = type === 'github' ? githubLoading : leetcodeLoading;

    if (loading) {
      return (
        <div className="mt-6 flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (data.length === 0) return null;

    // Calculate max value for scaling
    const maxCount = Math.max(...data.map((d) => d.count), 1);

    // Color themes - match GitHub/LeetCode exactly
    const colors =
      type === 'github'
        ? ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'] // GitHub green
        : ['#1a1a1a', '#0e4429', '#006d32', '#26a641', '#39d353']; // LeetCode uses same green!

    const getColor = (count: number) => {
      if (count === 0) return colors[0];
      const intensity = Math.ceil((count / maxCount) * 4);
      return colors[intensity];
    };

    // Define exact 5-month range
    const today = new Date();
    const endDate = new Date(today);
    const startDate = new Date(today);
    startDate.setMonth(startDate.getMonth() - 4);
    startDate.setDate(1); // Start from beginning of that month

    // Create data map for quick lookup
    const dataMap = new Map(data.map((d) => [d.date, d.count]));

    // Create a full calendar grid (weeks × 7 days) - ONLY 5 months
    const weeks: Array<Array<{ date: string; count: number } | null>> = [];

    // Get to the start of the week (Sunday) for the start date
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());

    let currentWeek: Array<{ date: string; count: number } | null> = [];

    // Only iterate through exactly 5 months
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = dataMap.get(dateStr) || 0;

      currentWeek.push({ date: dateStr, count });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    // Calculate month spans with start and end week indices for centered labels
    const monthSpans: Array<{ month: string; startWeek: number; endWeek: number }> = [];
    let currentMonthStart = 0;
    let lastMonth = -1;

    weeks.forEach((week, idx) => {
      const firstDay = week.find((d) => d !== null);
      if (firstDay) {
        const date = new Date(firstDay.date);
        const currentMonth = date.getMonth();

        if (lastMonth !== -1 && currentMonth !== lastMonth) {
          // Close previous month span
          const monthDate = new Date(weeks[currentMonthStart].find((d) => d !== null)!.date);
          monthSpans.push({
            month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
            startWeek: currentMonthStart,
            endWeek: idx - 1,
          });
          currentMonthStart = idx;
        }
        lastMonth = currentMonth;
      }
    });

    // Add final month
    if (lastMonth !== -1 && weeks[currentMonthStart]) {
      const firstDay = weeks[currentMonthStart].find((d) => d !== null);
      if (firstDay) {
        const monthDate = new Date(firstDay.date);
        monthSpans.push({
          month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
          startWeek: currentMonthStart,
          endWeek: weeks.length - 1,
        });
      }
    }

    // Calculate pixel positions - each week is 10px wide + 3px gap = 13px per week
    const weekWidth = 13;

    return (
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          {type === 'github' ? (
            <svg
              className="w-4 h-4"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"></path>
            </svg>
          )}
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {type === 'github' ? 'GitHub Activity (5 months)' : 'LeetCode Activity (5 months)'}
          </span>
        </div>

        {/* LeetCode Stats Summary */}
        {type === 'leetcode' && leetcodeStats && (
          <div className="mb-4 p-4 rounded-lg bg-background/50 border border-border/30">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {leetcodeStats.totalSolved}
                  <span className="text-sm text-muted-foreground ml-1">Solved</span>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-green-400">Easy </span>
                  <span className="text-foreground font-medium">{leetcodeStats.easySolved}</span>
                </div>
                <div>
                  <span className="text-yellow-400">Med. </span>
                  <span className="text-foreground font-medium">{leetcodeStats.mediumSolved}</span>
                </div>
                <div>
                  <span className="text-red-400">Hard </span>
                  <span className="text-foreground font-medium">{leetcodeStats.hardSolved}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          {/* Month labels - positioned at center of each month's span */}
          <div className="flex gap-1 mb-1">
            {/* Spacer matching day labels width */}
            <div className="flex flex-col gap-[3px] justify-start text-[10px] pr-1 invisible">
              <div style={{ height: '10px' }}>Mon</div>
            </div>
            {/* Month labels container */}
            <div
              className="relative"
              style={{ width: `${weeks.length * weekWidth - 3}px`, height: '14px' }}
            >
              {monthSpans.map((span, idx) => {
                // Calculate center position of the month span
                const centerWeek = (span.startWeek + span.endWeek) / 2;
                const leftPosition = centerWeek * weekWidth + 5; // +5 to center within week cell

                return (
                  <span
                    key={idx}
                    className="text-[10px] text-muted-foreground absolute whitespace-nowrap"
                    style={{
                      left: `${leftPosition}px`,
                      transform: 'translateX(-50%)',
                    }}
                  >
                    {span.month}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Day labels + Grid */}
          <div className="flex gap-1 mt-4">
            {/* Day of week labels */}
            <div className="flex flex-col gap-[3px] justify-start text-[10px] text-muted-foreground pr-1">
              <div style={{ height: '10px' }}></div>
              <div style={{ height: '10px' }}>Mon</div>
              <div style={{ height: '10px' }}></div>
              <div style={{ height: '10px' }}>Wed</div>
              <div style={{ height: '10px' }}></div>
              <div style={{ height: '10px' }}>Fri</div>
              <div style={{ height: '10px' }}></div>
            </div>

            {/* Contribution grid */}
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIdx) => (
                <div
                  key={weekIdx}
                  className="flex flex-col gap-[3px]"
                >
                  {week.map((day, dayIdx) => (
                    <div
                      key={dayIdx}
                      className="w-[10px] h-[10px] rounded-sm hover:ring-1 hover:ring-primary/50 transition-all cursor-pointer"
                      style={{
                        backgroundColor: day ? getColor(day.count) : 'transparent',
                        opacity: day ? 1 : 0,
                      }}
                      title={day ? `${day.date}: ${day.count} ${type === 'github' ? 'contributions' : 'problems'}` : ''}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* GitHub Activity */}
      {renderContributionGraph('github')}

      {/* LeetCode Activity - only if username provided */}
      {leetcode && renderContributionGraph('leetcode')}
    </>
  );
};
