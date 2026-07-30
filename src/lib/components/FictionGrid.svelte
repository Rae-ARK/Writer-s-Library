<script lang="ts">
	import type { Fiction } from '$lib/models/Fiction';
	import FictionCard from './FictionCard.svelte';

	let {
		fictions,
		onOpen,
		onDelete
	}: {
		fictions: Fiction[];
		onOpen: (fiction: Fiction) => void;
		onDelete: (fiction: Fiction) => void;
	} = $props();
</script>

{#if fictions.length === 0}
	<p class="empty">No fictions yet. Create your first one to get started.</p>
{:else}
	<div class="grid">
		{#each fictions as fiction (fiction.id)}
			<FictionCard {fiction} {onOpen} {onDelete} />
		{/each}
	</div>
{/if}

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 1rem;
	}
	.empty {
		opacity: 0.6;
		text-align: center;
		padding: 3rem 1rem;
	}
</style>
