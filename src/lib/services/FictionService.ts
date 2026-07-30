import { getDatabase } from '$lib/db/database';
import { FictionRepository } from '$lib/repositories/FictionRepository';
import type { Fiction, CreateFictionInput, UpdateFictionInput } from '$lib/models/Fiction';
import { validateCreateFiction, validateUpdateFiction } from '$lib/validation/validateFiction';
import { type ServiceResult, ok, fail } from '$lib/types/ServiceResult';

async function getRepository(): Promise<FictionRepository> {
	const db = await getDatabase();
	return new FictionRepository(db);
}

export async function createFiction(input: CreateFictionInput): Promise<ServiceResult<Fiction>> {
	const errors = validateCreateFiction(input);
	if (errors.length > 0) return fail(errors);

	try {
		const repo = await getRepository();
		const fiction = await repo.create(input);
		console.log('[FictionService] Fiction created', { id: fiction.id });
		return ok(fiction);
	} catch (error) {
		console.error('[FictionService] createFiction failed', error);
		return fail(['An unexpected error occurred while creating the fiction.']);
	}
}

export async function getAllFictions(): Promise<Fiction[]> {
	const repo = await getRepository();
	return repo.findAll();
}

export async function getFictionById(id: number): Promise<Fiction | null> {
	const repo = await getRepository();
	return repo.findById(id);
}

export async function updateFiction(id: number, input: UpdateFictionInput): Promise<ServiceResult<Fiction>> {
	const errors = validateUpdateFiction(input);
	if (errors.length > 0) return fail(errors);

	try {
		const repo = await getRepository();
		await repo.update(id, input);
		const updated = await repo.findById(id);
		if (!updated) return fail(['Fiction not found after update.']);
		console.log('[FictionService] Fiction updated', { id });
		return ok(updated);
	} catch (error) {
		console.error('[FictionService] updateFiction failed', error);
		return fail(['An unexpected error occurred while updating the fiction.']);
	}
}

export async function deleteFiction(id: number): Promise<ServiceResult<void>> {
	try {
		const repo = await getRepository();
		await repo.delete(id);
		console.log('[FictionService] Fiction deleted', { id });
		return ok(undefined);
	} catch (error) {
		console.error('[FictionService] deleteFiction failed', error);
		return fail(['An unexpected error occurred while deleting the fiction.']);
	}
}
