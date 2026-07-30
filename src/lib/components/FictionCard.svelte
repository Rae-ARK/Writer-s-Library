<script lang="ts">
	import type { Fiction } from '$lib/models/Fiction';

	let {
		fiction,
		onOpen,
		onDelete
	}: {
		fiction: Fiction;
		onOpen: (fiction: Fiction) => void;
		onDelete: (fiction: Fiction) => void;
	} = $props();
</script>

<div class="fiction-card">
	<button class="fiction-card__body" onclick={() => onOpen(fiction)}>
		<div class="fiction-card__cover" aria-hidden="true">
			{#if fiction.coverPath}
				<img src={fiction.coverPath} alt="" />
			{:else}
				<span class="fiction-card__placeholder">{fiction.title.charAt(0).toUpperCase()}</span>
			{/if}
		</div>
		<div class="fiction-card__info">
			<h3>{fiction.title}</h3>
			{#if fiction.author}<p class="fiction-card__author">{fiction.author}</p>{/if}
			<span class="fiction-card__status">{fiction.status}</span>
		</div>
	</button>
	<button class="fiction-card__delete" onclick={() => onDelete(fiction)} aria-label={`Delete ${fiction.title}`}>
		✕
	</button>
</div>

<style>
	.fiction-card {
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		background: var(--surface, #1c1c1e);
	}
	.fiction-card__body {
		display: flex;
		flex-direction: column;
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		color: inherit;
	}
	.fiction-card__cover {
		aspect-ratio: 2 / 3;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--surface-muted, #2c2c2e);
	}
	.fiction-card__cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.fiction-card__placeholder {
		font-size: 2rem;
		font-weight: 600;
		opacity: 0.6;
	}
	.fiction-card__info {
		padding: 0.75rem;
	}
	.fiction-card__info h3 {
		margin: 0 0 0.25rem;
		font-size: 0.95rem;
	}
	.fiction-card__author {
		margin: 0 0 0.25rem;
		font-size: 0.8rem;
		opacity: 0.7;
	}
	.fiction-card__status {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		opacity: 0.6;
	}
	.fiction-card__delete {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: 50%;
		border: none;
		background: rgba(0, 0, 0, 0.5);
		color: white;
		cursor: pointer;
	}
</style>
