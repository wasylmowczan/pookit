<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogDescription,
		DialogFooter
	} from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';

	let {
		open = $bindable(false),
		user
	}: {
		open: boolean;
		user: { id: string; name?: string; username?: string; email: string } | null;
	} = $props();

	let submitting = $state(false);
	let errorMsg = $state('');

	$effect(() => {
		if (!open) errorMsg = '';
	});

	const displayName = $derived(user?.name || user?.username || user?.email || '');
</script>

<Dialog bind:open>
	<DialogContent class="sm:max-w-md">
		<DialogHeader>
			<DialogTitle class="flex items-center gap-2 text-foreground">
				<TriangleAlert class="h-5 w-5 text-destructive" />
				Delete User
			</DialogTitle>
			<DialogDescription class="text-muted-foreground/70">
				This will permanently delete
				<span class="font-medium text-foreground">{displayName}</span>
				and all associated data. This action cannot be undone.
			</DialogDescription>
		</DialogHeader>

		{#if user}
			<form
				action="/admin/users?/deleteUser"
				method="POST"
				use:enhance={() => {
					submitting = true;
					errorMsg = '';
					return async ({ result, update }) => {
						submitting = false;
						if (result.type === 'success') {
							open = false;
							await invalidateAll();
						} else if (result.type === 'failure') {
							errorMsg = (result.data as any)?.message ?? 'Something went wrong.';
							await update({ reset: false });
						}
					};
				}}
			>
				<input type="hidden" name="userId" value={user.id} />

				{#if errorMsg}
					<p class="mb-4 text-sm text-destructive">{errorMsg}</p>
				{/if}

				<DialogFooter>
					<Button type="button" variant="outline" onclick={() => (open = false)}>Cancel</Button>
					<Button type="submit" variant="destructive" disabled={submitting}>
						{submitting ? 'Deleting…' : 'Delete user'}
					</Button>
				</DialogFooter>
			</form>
		{/if}
	</DialogContent>
</Dialog>
