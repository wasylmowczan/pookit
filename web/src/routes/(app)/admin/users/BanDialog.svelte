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
	import Loader from '$lib/components/loader.svelte';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import BanIcon from '@lucide/svelte/icons/ban';

	let {
		open = $bindable(false),
		user
	}: {
		open: boolean;
		user: { id: string; name?: string; username?: string; email: string } | null;
	} = $props();

	let reason = $state('');
	let expiresAt = $state('');
	let submitting = $state(false);
	let errorMsg = $state('');

	$effect(() => {
		if (!open) {
			reason = '';
			expiresAt = '';
			errorMsg = '';
		}
	});

	const displayName = $derived(user?.name || user?.username || user?.email || '');
	const minDateTime = $derived(new Date().toISOString().slice(0, 16));
</script>

<Dialog bind:open>
	<DialogContent class="sm:max-w-md">
		<DialogHeader>
			<DialogTitle class="flex items-center gap-2 text-foreground">
				<BanIcon class="h-5 w-5 text-destructive" />
				Ban User
			</DialogTitle>
			<DialogDescription class="text-muted-foreground/70">
				Ban <span class="font-medium text-foreground">{displayName}</span> from accessing the application.
			</DialogDescription>
		</DialogHeader>

		{#if user}
			<form
				action="/admin/users?/banUser"
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
				class="space-y-4"
			>
				<input type="hidden" name="userId" value={user.id} />

				<div class="space-y-2">
					<Label for="ban-reason">
						Reason <span class="text-destructive">*</span>
					</Label>
					<Textarea
						id="ban-reason"
						name="reason"
						bind:value={reason}
						placeholder="Explain why this user is being banned…"
						rows={3}
						required
						class="placeholder:text-gray-400"
					/>
				</div>

				<div class="space-y-2">
					<Label for="ban-expires"
						>Expires at <span class="text-muted-foreground">(optional)</span></Label
					>
					<Input
						id="ban-expires"
						name="expiresAt"
						type="datetime-local"
						bind:value={expiresAt}
						min={minDateTime}
						class="placeholder:text-gray-400"
					/>
					<p class="text-xs text-muted-foreground">Leave empty for a permanent ban.</p>
				</div>

				{#if errorMsg}
					<p class="text-sm text-destructive">{errorMsg}</p>
				{/if}

				<DialogFooter>
					<Button type="button" variant="outline" onclick={() => (open = false)}>Cancel</Button>
					<Button type="submit" variant="destructive" disabled={!reason.trim() || submitting}>
						{#if submitting}<Loader variant="bars" size="sm" class="mr-2" />{/if}
						{submitting ? 'Banning…' : 'Ban user'}
					</Button>
				</DialogFooter>
			</form>
		{/if}
	</DialogContent>
</Dialog>
