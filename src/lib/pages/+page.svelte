<script lang="ts">
	import { onMount } from 'svelte';
	import { fictionsStore, currentFictionStore } from '$lib/stores/currentFictionStore';
	import * as fictionService from '$lib/services/FictionService';
	import FictionGrid from '$lib/components/FictionGrid.svelte';
	import CreateFictionDialog from '$lib/components/CreateFictionDialog.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import type { Fiction, CreateFictionInput } from '$lib/models/Fiction';

	let showCreateDialog = $state(false);
	let createErrors = $state<string[]>([]);
	let fictionPendingDelete = $state<Fiction | null>(null);

	async function loadFictions() {
		const fictions = await fictionService.getAllFictions();
		fictionsStore.set(fictions);
	}

	onMount(loadFictions);

	async function handleCreate(input: CreateFictionInput) {
		const result = await fictionService.createFiction(input);
		if (!result.success) {
			createErrors = result.errors;
			return;
		}
		createErrors = [];
		showCreateDialog = false;
		await loadFictions();
	}

	function handleOpen(fiction: Fiction) {
		currentFictionStore.set(fiction);
		// Navigation to the fiction detail route gets wired in during the Draft slice.
	}

	function requestDelete(fiction: Fiction) {
		fictionPendingDelete = fiction;
	}

	async function confirmDelete() {
		if (!fictionPendingDelete) return;
		await fictionService.deleteFiction(fictionPendingDelete.id);
		fictionPendingDelete = null;
		await loadFictions();
	}
</script>

<main>
	<header>
		<h1>My Library</h1>
		<button class="primary" onclick={() => (showCreateDialog = true)}>+ New Fiction</button>
	</header>

	<FictionGrid fictions={$fictionsStore} onOpen={handleOpen} onDelete={requestDelete} />
</main>

<CreateFictionDialog
	open={showCreateDialog}
	errors={createErrors}
	onCreate={handleCreate}
	onCancel={() => {
		showCreateDialog = false;
		createErrors = [];
	}}
/>

<ConfirmDialog
	open={fictionPendingDelete !== null}
	title="Delete fiction?"
	message={fictionPendingDelete
		? `"${fictionPendingDelete.title}" and all its drafts and chapters will be permanently deleted.`
		: ''}
	confirmLabel="Delete"
	onConfirm={confirmDelete}
	onCancel={() => (fictionPendingDelete = null)}
/>

<style>
	main {
		padding: 1rem;
	}
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}
	h1 {
		margin: 0;
	}
	.primary {
		background: #4a7dfc;
		color: white;
		border: none;
		border-radius: 8px;
		padding: 0.5rem 1rem;
		cursor: pointer;
	}
</style>
