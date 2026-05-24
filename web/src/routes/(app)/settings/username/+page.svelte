<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { FormControl, FormField } from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms';
	import { untrack } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { LoaderCircle } from '@lucide/svelte';
	import { zod4 as zod } from 'sveltekit-superforms/adapters';
	import { UpdateNameSchema } from '$lib/schemas.js';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import FormLabel from '$lib/components/ui/form/form-label.svelte';
	import FormFieldErrors from '$lib/components/ui/form/form-field-errors.svelte';
	import CardFooter from '$lib/components/ui/card/card-footer.svelte';

	let { data } = $props();
	let loading = $state(false);

	const form = superForm(untrack(() => data.form), {
		validators: zod(UpdateNameSchema),
		resetForm: false,
		onSubmit: () => {
			loading = true;
		},
		onResult: async ({ result }) => {
			loading = false;
			if (result.type === 'success') {
				toast.success('Name updated');
			} else {
				toast.error('Failed to update name');
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<Card class="dark:border-primary">
	<form action="?/updateName" method="POST" use:enhance>
		<CardHeader>
			<CardTitle>Change Name</CardTitle>
		</CardHeader>
		<CardContent>
			<FormField {form} name="name">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel>Name</FormLabel>
						<Input autofocus {...props} bind:value={$formData.name} />
					{/snippet}
				</FormControl>
				<FormFieldErrors />
			</FormField>
		</CardContent>
		<CardFooter class="border-t px-6 py-4 dark:border-primary">
			<Button type="submit" disabled={loading}>
				{#if loading}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Save
			</Button>
		</CardFooter>
	</form>
</Card>
