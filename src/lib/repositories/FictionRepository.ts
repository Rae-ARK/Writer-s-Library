import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import type { Fiction, CreateFictionInput, UpdateFictionInput } from '$lib/models/Fiction';
import { TABLES } from '$lib/constants/dbConstants';

/**
 * Owns all SQL for the `fiction` table (ARCHITECTURE.md §9 — one
 * repository per table). No business rules live here; that belongs
 * to FictionService.
 */
export class FictionRepository {
	constructor(private db: SQLiteDBConnection) {}

	async create(input: CreateFictionInput): Promise<Fiction> {
		const now = Date.now();
		const result = await this.db.run(
			`INSERT INTO ${TABLES.FICTION}
        (title, author, genre, status, synopsis, description, coverPath, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
			[
				input.title,
				input.author ?? null,
				input.genre ?? null,
				input.status ?? 'Draft',
				input.synopsis ?? null,
				input.description ?? null,
				input.coverPath ?? null,
				now,
				now
			]
		);

		const id = result.changes?.lastId;
		if (id === undefined) {
			throw new Error('FictionRepository.create: insert did not return an id.');
		}

		const created = await this.findById(id);
		if (!created) {
			throw new Error('FictionRepository.create: fiction not found immediately after insert.');
		}
		return created;
	}

	async findAll(): Promise<Fiction[]> {
		const result = await this.db.query(`SELECT * FROM ${TABLES.FICTION} ORDER BY updatedAt DESC;`);
		return (result.values ?? []) as Fiction[];
	}

	async findById(id: number): Promise<Fiction | null> {
		const result = await this.db.query(`SELECT * FROM ${TABLES.FICTION} WHERE id = ?;`, [id]);
		const rows = (result.values ?? []) as Fiction[];
		return rows[0] ?? null;
	}

	async update(id: number, input: UpdateFictionInput): Promise<void> {
		const fields = Object.keys(input) as (keyof UpdateFictionInput)[];
		if (fields.length === 0) return;

		const setClause = fields.map((field) => `${field} = ?`).join(', ');
		const values = fields.map((field) => input[field] ?? null);

		await this.db.run(`UPDATE ${TABLES.FICTION} SET ${setClause}, updatedAt = ? WHERE id = ?;`, [
			...values,
			Date.now(),
			id
		]);
	}

	/**
	 * Deletes only the fiction row itself. Cascading deletes to Draft,
	 * Chapter, Note, Favorite, and RecentProject are enforced at the
	 * schema level via ON DELETE CASCADE (see db/schema.ts), since
	 * foreign_keys is pragma'd ON. Cover image removal from disk is
	 * a filesystem concern and will be wired into FictionService once
	 * the cover-image handling is built.
	 */
	async delete(id: number): Promise<void> {
		await this.db.run(`DELETE FROM ${TABLES.FICTION} WHERE id = ?;`, [id]);
	}
}
