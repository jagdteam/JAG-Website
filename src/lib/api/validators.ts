/**
 * Input validation utilities for API parameters
 * Follows the pattern from notion.ts isValidProjectSlug()
 */

/**
 * Validate GitHub username format
 * GitHub usernames: alphanumeric with hyphens, 1-39 characters
 * Cannot start or end with hyphen, no consecutive hyphens
 */
export function validateGitHubUsername(username: string): boolean {
  if (!username || typeof username !== 'string') return false;
  return /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(username) || /^[a-zA-Z0-9]$/.test(username);
}

/**
 * Validate GitHub repository format
 * Format: owner/repo with alphanumeric, hyphens, underscores, and dots
 */
export function validateRepoFormat(repo: string): boolean {
  if (!repo || typeof repo !== 'string') return false;
  return /^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/.test(repo);
}

/**
 * Validate LeetCode username format
 * LeetCode usernames: alphanumeric with underscores and hyphens, 1-100 characters
 */
export function validateLeetCodeUsername(username: string): boolean {
  if (!username || typeof username !== 'string') return false;
  return username.length > 0 && username.length <= 100 && /^[a-zA-Z0-9_-]+$/.test(username);
}
