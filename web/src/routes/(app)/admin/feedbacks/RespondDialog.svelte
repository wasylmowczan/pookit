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
	import { Textarea } from '$lib/components/ui/textarea';
	import ReplyIcon from '@lucide/svelte/icons/reply';

	let {
		open = $bindable(false),
		feedback
	}: {
		open: boolean;
		feedback: { id: string; name: string; email: string; feedback: string } | null;
	} = $props();

	let responseMessage = $state('');
	let submitting = $state(false);
	let errorMsg = $state('');

	$effect(() => {
		if (!open) {
			responseMessage = '';
			errorMsg = '';
		}
	});
</script>

<Dialog bind:open>
	<DialogContent class="sm:max-w-lg">
		<DialogHeader>
			<DialogTitle class="flex items-center gap-2 text-foreground">
				<ReplyIcon class="h-5 w-5" />
				Respond to Feedback
			</DialogTitle>
			<DialogDescription class="text-muted-foreground/70">
				Send a reply to <span class="font-medium text-foreground">{feedback?.name}</span> at
				<span class="font-medium text-foreground">{feedback?.email}</span>.
			</DialogDescription>
		</DialogHeader>

		{#if feedback}
			<div class="rounded-md border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
				<p class="line-clamp-3">{feedback.feedback}</p>
			</div>

			<form
				action="/admin/feedbacks?/respond"
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
				<input type="hidden" name="feedbackId" value={feedback.id} />

				<div class="space-y-2">
					<Label for="response-message">
						Your response <span class="text-destructive">*</span>
					</Label>
					<Textarea
						id="response-message"
						name="responseMessage"
						bind:value={responseMessage}
						placeholder="Write your response to the user's feedback…"
						rows={5}
						required
						class="placeholder:text-gray-400"
					/>
				</div>

				{#if errorMsg}
					<p class="text-sm text-destructive">{errorMsg}</p>
				{/if}

				<DialogFooter>
					<Button type="button" variant="outline" onclick={() => (open = false)}>Cancel</Button>
					<Button type="submit" disabled={!responseMessage.trim() || submitting}>
						{#if submitting}<Loader variant="bars" size="sm" class="mr-2" />{/if}
						{submitting ? 'Sending…' : 'Send response'}
					</Button>
				</DialogFooter>
			</form>
		{/if}
	</DialogContent>
</Dialog>
