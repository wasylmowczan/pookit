<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { FormControl, FormField } from '$lib/components/ui/form';
	import { toast } from 'svelte-sonner';
	import { defaultValues, superForm } from 'sveltekit-superforms';
	import { zod4 as zod } from 'sveltekit-superforms/adapters';
	import { ForgotPasswordSchema } from '$lib/schemas.js';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import FormLabel from '$lib/components/ui/form/form-label.svelte';
	import FormFieldErrors from '$lib/components/ui/form/form-field-errors.svelte';
	import { Seo } from '$lib/components/modules';
	import { config } from '$lib/config-client';

	let loading = $state(false);

	const form = superForm(defaultValues(zod(ForgotPasswordSchema)), {
		validators: zod(ForgotPasswordSchema),
		onSubmit: () => {
			loading = true;
		},
		onResult: ({ result }) => {
			loading = false;
			if (result.type === 'success') {
				toast.success(
					'Password reset instructions have been sent. Please check your inbox and spam folder.'
				);
			} else {
				toast.error('Failed to send password reset instructions.');
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<Seo
	title={`Forgot Password - ${config.appName}`}
	description={`Forgot Password for ${config.appName}`}
	keywords="forgot password, forgot password for ai image generator"
/>

<div class="min-h-screen grid lg:grid-cols-2">
	<!-- Left: Form -->
	<div class="flex items-center justify-center p-8">
		<Card class="w-full max-w-sm dark:border-primary">
			<CardHeader>
				<CardTitle class="text-2xl">Forgot Password</CardTitle>
			</CardHeader>
			<CardContent>
				<form action="?/forgotPassword" method="POST" use:enhance>
					<div class="grid gap-4">
						<div class="grid gap-2">
							<FormField {form} name="email">
								<FormControl>
									{#snippet children({ props })}
										<FormLabel>Email</FormLabel>
										<Input {...props} bind:value={$formData.email} type="email" />
									{/snippet}
								</FormControl>
								<FormFieldErrors />
							</FormField>
						</div>
						<Button disabled={loading} type="submit" class="w-full">Send Email</Button>
					</div>
					<div class="mt-4 text-sm text-center text-muted-foreground">
						Go back to <a href="/login" class="underline text-foreground">Login</a>
					</div>
				</form>
			</CardContent>
		</Card>
	</div>

	<!-- Right: Image -->
	<div class="hidden lg:block relative overflow-hidden bg-muted rounded-l-2xl">
		<img
			src="/login.jpg"
			alt="Forgot password visual"
			class="absolute inset-0 h-full w-full object-cover"
		/>
		<div class="absolute inset-0 bg-black/30"></div>
	</div>
</div>
