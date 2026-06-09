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
		feedback
	}: {
		open: boolean;
		feedback: { id: string; name: string; email: string } | null;
	} = $props();

	let submitting = $state(false);
	let errorMsg = $state('');

	$effect(() => {
		if (!open) errorMsg = '';
	});
</script>

<Dialog bind:open>
	<DialogContent class="sm:max-w-md">
		<DialogHeader>
			<DialogTitle class="flex items-center gap-2 text-foreground">
				<TriangleAlert class="h-5 w-5 text-destructive" />
				Delete Feedback
			</DialogTitle>
			<DialogDescription class="text-muted-foreground/70">
				This will permanently delete the feedback from
				<span class="font-medium text-foreground">{feedback?.name}</span>. This action cannot be
				undone.
			</DialogDescription>
		</DialogHeader>

		{#if feedback}
			<form
				action="/admin/feedbacks?/deleteFeedback"
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
				<input type="hidden" name="feedbackId" value={feedback.id} />

				{#if errorMsg}
					<p class="mb-4 text-sm text-destructive">{errorMsg}</p>
				{/if}

				<DialogFooter>
					<Button type="button" variant="outline" onclick={() => (open = false)}>Cancel</Button>
					<Button type="submit" variant="destructive" disabled={submitting}>
						{submitting ? 'Deleting…' : 'Delete feedback'}
					</Button>
				</DialogFooter>
			</form>
		{/if}
	</DialogContent>
</Dialog>
