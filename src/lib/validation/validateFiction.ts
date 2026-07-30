import type { CreateFictionInput, UpdateFictionInput } from '$lib/models/Fiction';

const MAX_TITLE_LENGTH = 200;
const VALID_STATUSES = ['Draft', 'Ongoing', 'Complete'];

export function validateCreateFiction(input: CreateFictionInput): string[] {
	const errors: string[] = [];

	if (!input.title || input.title.trim().length === 0) {
		errors.push('Title is required.');
	} else if (input.title.length > MAX_TITLE_LENGTH) {
		errors.push(`Title must be ${MAX_TITLE_LENGTH} characters or fewer.`);
	}

	if (input.status && !VALID_STATUSES.includes(input.status)) {
		errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}.`);
	}

	return errors;
}

export function validateUpdateFiction(input: UpdateFictionInput): string[] {
	const errors: string[] = [];

	if (input.title !== undefined) {
		if (input.title.trim().length === 0) {
			errors.push('Title cannot be empty.');
		} else if (input.title.length > MAX_TITLE_LENGTH) {
			errors.push(`Title must be ${MAX_TITLE_LENGTH} characters or fewer.`);
		}
	}

	if (input.status && !VALID_STATUSES.includes(input.status)) {
		errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}.`);
	}

	return errors;
}
