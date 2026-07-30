export type FictionStatus = 'Draft' | 'Ongoing' | 'Complete';

/** Plain interface only — no methods, no inheritance (ARCHITECTURE.md §10). */
export interface Fiction {
	id: number;
	title: string;
	author: string | null;
	genre: string | null;
	status: FictionStatus;
	synopsis: string | null;
	description: string | null;
	coverPath: string | null;
	createdAt: number;
	updatedAt: number;
}

export interface CreateFictionInput {
	title: string;
	author?: string;
	genre?: string;
	status?: FictionStatus;
	synopsis?: string;
	description?: string;
	coverPath?: string;
}

export interface UpdateFictionInput {
	title?: string;
	author?: string;
	genre?: string;
	status?: FictionStatus;
	synopsis?: string;
	description?: string;
	coverPath?: string;
}
