import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { DATABASE_VERSION } from '$lib/constants/dbConstants';

interface Migration {
	version: number;
	up: (db: SQLiteDBConnection) => Promise<void>;
}

/**
 * Append new migrations here as the schema evolves. Never edit or remove
 * a past entry once shipped (DATABASE_SCHEMA.md §17 — migrations must
 * never delete user data, and should be reversible whenever practical).
 */
const migrations: Migration[] = [
	// Example for the future:
	// {
	//   version: 2,
	//   up: async (db) => {
	//     await db.execute('ALTER TABLE fiction ADD COLUMN wordGoal INTEGER;');
	//   }
	// }
];

/**
 * Seeds appMetadata on first run, then applies any pending migrations
 * in order. Table creation itself (schema.ts) is idempotent via
 * CREATE TABLE IF NOT EXISTS, so this only handles version tracking
 * and incremental changes beyond the initial schema.
 */
export async function runMigrations(db: SQLiteDBConnection): Promise<void> {
	const result = await db.query('SELECT databaseVersion FROM appMetadata LIMIT 1;');
	const now = Date.now();

	if (!result.values || result.values.length === 0) {
		await db.run('INSERT INTO appMetadata (databaseVersion, createdAt, updatedAt) VALUES (?, ?, ?);', [
			DATABASE_VERSION,
			now,
			now
		]);
		return;
	}

	let currentVersion = result.values[0].databaseVersion as number;

	const pending = migrations.filter((m) => m.version > currentVersion).sort((a, b) => a.version - b.version);

	for (const migration of pending) {
		await migration.up(db);
		currentVersion = migration.version;
		await db.run('UPDATE appMetadata SET databaseVersion = ?, updatedAt = ?;', [currentVersion, Date.now()]);
	}
}
