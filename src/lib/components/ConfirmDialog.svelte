<script lang="ts">
	let {
		open,
		title,
		message,
		confirmLabel = 'Confirm',
		cancelLabel = 'Cancel',
		onConfirm,
		onCancel
	}: {
		open: boolean;
		title: string;
		message: string;
		confirmLabel?: string;
		cancelLabel?: string;
		onConfirm: () => void;
		onCancel: () => void;
	} = $props();
</script>

{#if open}
	<div class="overlay" role="presentation" onclick={onCancel}>
		<div class="dialog" role="dialog" aria-modal="true" onclick={(e) => e.stopPropagation()}>
			<h2>{title}</h2>
			<p>{message}</p>
			<div class="actions">
				<button class="secondary" onclick={onCancel}>{cancelLabel}</button>
				<button class="danger" onclick={onConfirm}>{confirmLabel}</button>
			</div>
		</div>
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
		max-width: 320px;
		width: 90%;
	}
	.dialog h2 {
		margin-top: 0;
	}
	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 1.5rem;
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
	.danger {
		background: #d64545;
		color: white;
	}
</style>
