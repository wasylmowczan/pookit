<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { untrack } from 'svelte';
	import { zod4Client as zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Form from '$lib/components/ui/form/index.js';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { feedbackSchema } from '$lib/schemas.js';
	import { Input } from '$lib/components/ui/input/index.js';

	let { data } = $props();

	const form = superForm(
		untrack(() => data.form),
		{
			validators: zodClient(feedbackSchema),
			onResult: async ({ result }) => {
				if (result.type === 'success') {
					toast.success('Feedback submitted successfully');
				} else {
					toast.error('Failed to submit feedback');
				}
			}
		}
	);

	const { form: formData, enhance } = form;
</script>

<div
	class="w-full min-h-[calc(100vh-10rem)] bg-background text-foreground flex items-center justify-center p-4"
>
	<Card class="w-full max-w-2xl dark:border-primary">
		<CardHeader>
			<CardTitle>Feedback</CardTitle>
			<CardDescription>We value your feedback to improve our services</CardDescription>
		</CardHeader>
		<CardContent>
			<form action="?/submit" method="POST" class="space-y-4" use:enhance>
				<div class="space-y-3">
					<div class="flex flex-col">
						<label for="name" class="text-sm font-medium mb-1.5">Name</label>
						<Input
							type="text"
							name="name"
							bind:value={$formData.name}
							placeholder={data.user?.name || data.user?.username}
							required
						/>
					</div>
					<div class="flex flex-col">
						<label for="email" class="text-sm font-medium mb-1.5">Email</label>
						<Input
							type="email"
							name="email"
							bind:value={$formData.email}
							placeholder={data.user?.email}
							required
						/>
					</div>
				</div>
				<!-- Feedback Section -->
				<Form.Field {form} name="feedback">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Feedback</Form.Label>
							<Textarea
								{...props}
								bind:value={$formData.feedback}
								placeholder="Please share your thoughts..."
								required
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Button>Submit</Form.Button>
			</form>
		</CardContent>
	</Card>
</div>
