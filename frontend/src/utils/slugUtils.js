/**
 * Slug Utilities for Installation URL Management
 *
 * Handles sanitization, validation, and normalization of installation slugs
 * to ensure consistent URL routing and prevent conflicts.
 */

// Reserved slugs that cannot be used for installations
// These match existing React Router routes
export const RESERVED_SLUGS = [
  'dashboard',
  'login',
  'survey',
  'installation-selection',
  'survey-complete',
  'manage-events',
  'view-users',
  'survey-builder',
  'settings',
  'documentation',
  'asterix',
  'errors',
  'table',
  'events',
  'docs'
];

/**
 * Sanitize a string to create a URL-safe slug
 * @param {string} name - Raw installation name
 * @returns {string} - Sanitized slug (lowercase, alphanumeric + dashes)
 */
export function sanitizeSlug(name) {
  if (!name || typeof name !== 'string') {
    return '';
  }

  return name
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with dashes
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing dashes
    .replace(/^-+|-+$/g, '')
    // Replace multiple consecutive dashes with single dash
    .replace(/-+/g, '-');
}

/**
 * Validate if a slug is allowed (not reserved)
 * @param {string} slug - Slug to validate
 * @returns {boolean} - True if slug is valid, false if reserved
 */
export function isSlugReserved(slug) {
  return RESERVED_SLUGS.includes(slug.toLowerCase());
}

/**
 * Validate slug format (alphanumeric + dashes only)
 * @param {string} slug - Slug to validate
 * @returns {boolean} - True if format is valid
 */
export function isValidSlugFormat(slug) {
  if (!slug || typeof slug !== 'string') {
    return false;
  }

  // Must be lowercase alphanumeric with dashes
  // Cannot start or end with dash
  // Must be between 3 and 50 characters
  const slugRegex = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/;
  return slugRegex.test(slug);
}

/**
 * Normalize slug for comparison (handles case sensitivity)
 * @param {string} slug - Slug to normalize
 * @returns {string} - Normalized slug
 */
export function normalizeSlug(slug) {
  return slug ? slug.toLowerCase().trim() : '';
}

/**
 * Comprehensive slug validation with error messages
 * @param {string} slug - Slug to validate
 * @returns {Object} - { valid: boolean, error: string|null }
 */
export function validateSlug(slug) {
  const normalized = normalizeSlug(slug);

  if (!normalized) {
    return { valid: false, error: 'Slug cannot be empty' };
  }

  if (normalized.length < 3) {
    return { valid: false, error: 'Slug must be at least 3 characters long' };
  }

  if (normalized.length > 50) {
    return { valid: false, error: 'Slug cannot exceed 50 characters' };
  }

  if (!isValidSlugFormat(normalized)) {
    return { valid: false, error: 'Slug can only contain lowercase letters, numbers, and dashes (cannot start/end with dash)' };
  }

  if (isSlugReserved(normalized)) {
    return { valid: false, error: `"${normalized}" is a reserved keyword and cannot be used as a slug` };
  }

  return { valid: true, error: null };
}

/**
 * Generate a unique slug by appending a number if needed
 * @param {string} baseSlug - Base slug to make unique
 * @param {Array<string>} existingSlugs - Array of existing slugs to check against
 * @returns {string} - Unique slug
 */
export function generateUniqueSlug(baseSlug, existingSlugs = []) {
  let slug = sanitizeSlug(baseSlug);
  let counter = 1;

  // If base slug is available, use it
  if (!existingSlugs.includes(slug) && !isSlugReserved(slug)) {
    return slug;
  }

  // Otherwise, append numbers until we find an available slug
  while (existingSlugs.includes(`${slug}-${counter}`) || isSlugReserved(`${slug}-${counter}`)) {
    counter++;
  }

  return `${slug}-${counter}`;
}
