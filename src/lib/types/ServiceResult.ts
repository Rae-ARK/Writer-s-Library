/**
 * Structured result type for services. Expected failures (validation,
 * not-found, etc.) return this instead of throwing — exceptions are
 * reserved for truly unexpected failures (ARCHITECTURE.md §13).
 */
export interface ServiceResult<T> {
	success: boolean;
	data?: T;
	errors: string[];
}

export function ok<T>(data: T): ServiceResult<T> {
	return { success: true, data, errors: [] };
}

export function fail<T>(errors: string[]): ServiceResult<T> {
	return { success: false, errors };
}
