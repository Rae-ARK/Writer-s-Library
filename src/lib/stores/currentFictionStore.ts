import { writable } from 'svelte/store';
import type { Fiction } from '$lib/models/Fiction';

/**
 * Working state only — SQLite remains the source of truth
 * (ENGINEERING_PRINCIPLES.md Principle 3). These stores are populated
 * by explicit calls to FictionService, never written to directly by
 * repositories or by mutating state ad hoc from components.
 */
export const fictionsStore = writable<Fiction[]>([]);
export const currentFictionStore = writable<Fiction | null>(null);
