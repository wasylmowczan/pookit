<script lang="ts">
	import { Card, CardDescription } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { FormControl, FormField } from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { zod4 as zod } from 'sveltekit-superforms/adapters';
	import { UpdatePasswordSchema } from '$lib/schemas.js';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import FormLabel from '$lib/components/ui/form/form-label.svelte';
	import FormFieldErrors from '$lib/components/ui/form/form-field-errors.svelte';
	import CardFooter from '$lib/components/ui/card/card-footer.svelte';

	let { data } = $props();

	let loading = $state(false);

	const form = superForm(data.form, {
		validators: zod(UpdatePasswordSchema),
		onSubmit: () => {
			loading = true;
		},
		onResult: ({ result }) => {
			loading = false;
			if (result.type === 'success') {
				toast.success('Password updated');
			} else {
				toast.error('Failed to update password');
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<Card class="dark:border-primary">
	<form action="?/updatePassword" method="POST" use:enhance>
		<CardHeader>
			<CardTitle>Change Password</CardTitle>
			<CardDescription>You will be logged out after changing your password.</CardDescription>
		</CardHeader>
		<CardContent>
			<FormField {form} name="oldPassword">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel>Old Password</FormLabel>
						<Input
							autofocus
							{...props}
							bind:value={$formData.oldPassword}
							type="password"
							disabled={loading}
						/>
					{/snippet}
				</FormControl>
				<FormFieldErrors />
			</FormField>
			<FormField {form} name="password">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel>New Password</FormLabel>
						<Input {...props} bind:value={$formData.password} type="password" disabled={loading} />
					{/snippet}
				</FormControl>
				<FormFieldErrors />
			</FormField>
			<FormField {form} name="passwordConfirm">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel>Confirm New Password</FormLabel>
						<Input
							{...props}
							bind:value={$formData.passwordConfirm}
							type="password"
							disabled={loading}
						/>
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
