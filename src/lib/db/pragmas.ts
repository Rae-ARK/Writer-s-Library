import type { SQLiteDBConnection } from '@capacitor-community/sqlite';

/**
 * Applies non-negotiable pragmas (DATABASE_SCHEMA.md §2, §20).
 * Foreign keys must always be ON — referential integrity depends on it,
 * including the ON DELETE CASCADE rules defined in schema.ts.
 */
export async function applyPragmas(db: SQLiteDBConnection): Promise<void> {
	await db.execute('PRAGMA foreign_keys = ON;');
	await db.execute('PRAGMA journal_mode = WAL;');
}
