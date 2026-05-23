<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { FormControl, FormField } from '$lib/components/ui/form';
	import { defaultValues, superForm } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { DeleteUserSchema } from '$lib/schemas.js';
	import { zod4 as zod } from 'sveltekit-superforms/adapters';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardFooter from '$lib/components/ui/card/card-footer.svelte';
	import FormLabel from '$lib/components/ui/form/form-label.svelte';
	import FormFieldErrors from '$lib/components/ui/form/form-field-errors.svelte';

	let loading = $state(false);

	const form = superForm(defaultValues(zod(DeleteUserSchema)), {
		validators: zod(DeleteUserSchema),
		onSubmit: () => {
			loading = true;
		},
		onResult: () => {
			loading = false;
			toast.info('Redirecting to login page...');
			window.location.reload();
		}
	});

	const { form: formData, enhance } = form;
</script>

<Card class="dark:border-primary">
	<form action="?/deleteAccount" method="POST" use:enhance>
		<CardHeader>
			<CardTitle>Delete Account</CardTitle>
		</CardHeader>
		<CardContent>
			<FormField {form} name="word">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel>Type DELETE to confirm</FormLabel>
						<Input {...props} autofocus bind:value={$formData.word} disabled={loading} />
					{/snippet}
				</FormControl>
				<FormFieldErrors />
			</FormField>
		</CardContent>
		<CardFooter class="border-t px-6 py-4 dark:border-primary">
			<Button
				type="submit"
				onclick={(e) => !confirm('Are you sure?') && e.preventDefault()}
				disabled={loading || $formData.word !== 'DELETE'}
			>
				{#if loading}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Delete
			</Button>
		</CardFooter>
	</form>
</Card>
