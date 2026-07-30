import { CapacitorSQLite, SQLiteConnection, type SQLiteDBConnection } from '@capacitor-community/sqlite';
import { DATABASE_NAME, DATABASE_VERSION } from '$lib/constants/dbConstants';
import { CREATE_TABLES_SQL } from './schema';
import { applyPragmas } from './pragmas';
import { runMigrations } from './migrations';

const sqliteConnection = new SQLiteConnection(CapacitorSQLite);

let db: SQLiteDBConnection | null = null;
let initPromise: Promise<SQLiteDBConnection> | null = null;

/**
 * Lazily opens (or reuses) the single app-wide SQLite connection.
 * This is the only place that should ever call createConnection/open —
 * every repository gets its db handle through here, never directly
 * through the plugin (ARCHITECTURE.md §8, DatabaseService responsibilities).
 */
export async function getDatabase(): Promise<SQLiteDBConnection> {
	if (db) return db;
	if (initPromise) return initPromise;

	initPromise = (async () => {
		const isConn = (await sqliteConnection.isConnection(DATABASE_NAME, false)).result;

		const connection = isConn
			? await sqliteConnection.retrieveConnection(DATABASE_NAME, false)
			: await sqliteConnection.createConnection(DATABASE_NAME, false, 'no-encryption', DATABASE_VERSION, false);

		await connection.open();
		await applyPragmas(connection);
		await connection.execute(CREATE_TABLES_SQL);
		await runMigrations(connection);

		console.log('[DatabaseService] Database opened and ready', { name: DATABASE_NAME, version: DATABASE_VERSION });

		db = connection;
		return connection;
	})();

	return initPromise;
}

export async function closeDatabase(): Promise<void> {
	if (!db) return;
	await sqliteConnection.closeConnection(DATABASE_NAME, false);
	db = null;
	initPromise = null;
	console.log('[DatabaseService] Database closed');
}

/**
 * Transaction boundary helper (ARCHITECTURE.md §15 — service owns
 * transaction boundaries, repositories never begin nested transactions).
 * Wrap any multi-step destructive operation in this, e.g.:
 *
 *   await runInTransaction(async (db) => {
 *     await fictionRepo.delete(id);
 *     await recentProjectRepo.deleteByFictionId(id);
 *   });
 */
export async function runInTransaction<T>(fn: (db: SQLiteDBConnection) => Promise<T>): Promise<T> {
	const connection = await getDatabase();
	await connection.beginTransaction();

	try {
		const result = await fn(connection);
		await connection.commitTransaction();
		return result;
	} catch (error) {
		await connection.rollbackTransaction();
		throw error;
	}
}
