/**
 * Central place for database naming and versioning.
 * Never scatter these as magic strings/numbers elsewhere (ARCHITECTURE.md §19).
 */

export const DATABASE_NAME = 'webnovel_library';

/**
 * Bump this whenever schema.ts changes, and add a corresponding
 * migration in migrations.ts. Never delete past migrations
 * (DATABASE_SCHEMA.md §17).
 */
export const DATABASE_VERSION = 1;

export const TABLES = {
	FICTION: 'fiction',
	DRAFT: 'draft',
	CHAPTER: 'chapter',
	NOTE: 'note',
	TAG: 'tag',
	FICTION_TAG: 'fictionTag',
	READING_STATE: 'readingState',
	FAVORITE: 'favorite',
	RECENT_PROJECT: 'recentProject',
	SETTINGS: 'settings',
	APP_METADATA: 'appMetadata'
} as const;
