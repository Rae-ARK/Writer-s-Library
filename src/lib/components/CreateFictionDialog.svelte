<script lang="ts">
	import type { CreateFictionInput } from '$lib/models/Fiction';

	let {
		open,
		onCreate,
		onCancel,
		errors = []
	}: {
		open: boolean;
		onCreate: (input: CreateFictionInput) => void;
		onCancel: () => void;
		errors?: string[];
	} = $props();

	let title = $state('');
	let author = $state('');
	let genre = $state('');

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		onCreate({ title, author: author || undefined, genre: genre || undefined });
	}

	function handleCancel() {
		title = '';
		author = '';
		genre = '';
		onCancel();
	}
</script>

{#if open}
	<div class="overlay" role="presentation" onclick={handleCancel}>
		<form class="dialog" onclick={(e) => e.stopPropagation()} onsubmit={handleSubmit}>
			<h2>New Fiction</h2>

			{#if errors.length > 0}
				<ul class="errors">
					{#each errors as error}<li>{error}</li>{/each}
				</ul>
			{/if}

			<label>
				Title
				<input type="text" bind:value={title} required maxlength="200" autofocus />
			</label>

			<label>
				Author (optional)
				<input type="text" bind:value={author} />
			</label>

			<label>
				Genre (optional)
				<input type="text" bind:value={genre} />
			</label>

			<div class="actions">
				<button type="button" class="secondary" onclick={handleCancel}>Cancel</button>
				<button type="submit" class="primary">Create</button>
			</div>
		</form>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}
	.dialog {
		background: var(--surface, #1c1c1e);
		border-radius: 12px;
		padding: 1.5rem;
		max-width: 360px;
		width: 90%;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.dialog h2 {
		margin: 0 0 0.5rem;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.85rem;
	}
	input {
		padding: 0.5rem;
		border-radius: 6px;
		border: 1px solid var(--surface-muted, #3a3a3c);
		background: transparent;
		color: inherit;
	}
	.errors {
		color: #d64545;
		font-size: 0.8rem;
		margin: 0;
		padding-left: 1rem;
	}
	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}
	button {
		border: none;
		border-radius: 8px;
		padding: 0.5rem 1rem;
		cursor: pointer;
	}
	.secondary {
		background: var(--surface-muted, #2c2c2e);
		color: inherit;
	}
	.primary {
		background: #4a7dfc;
		color: white;
	}
</style>
