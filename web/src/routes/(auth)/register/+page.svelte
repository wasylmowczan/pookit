<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { FormControl, FormField } from '$lib/components/ui/form';
	import { toast } from 'svelte-sonner';
	import { defaultValues, superForm } from 'sveltekit-superforms';
	import { RegisterUserSchema } from '$lib/schemas.js';
	import { zod4 as zod } from 'sveltekit-superforms/adapters';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import FormLabel from '$lib/components/ui/form/form-label.svelte';
	import FormFieldErrors from '$lib/components/ui/form/form-field-errors.svelte';
	import { Seo } from '$lib/components/modules';
	import { config } from '$lib/config-client';

	let loading = $state(false);

	const form = superForm(defaultValues(zod(RegisterUserSchema)), {
		validators: zod(RegisterUserSchema),
		onSubmit: () => {
			loading = true;
		},
		onResult: ({ result }) => {
			loading = false;
			if (result.type === 'redirect') {
				toast.success(
					'Account created successfully. Please check your email for a verification link.'
				);
			} else {
				toast.error('Failed to register.');
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<Seo
	title={`Register - ${config.appName}`}
	description={`Register to ${config.appName}`}
	keywords="register, register to ai image generator"
/>

<div class="min-h-screen grid lg:grid-cols-2">
	<!-- Left: Form -->
	<div class="flex items-center justify-center p-8">
		<div class="w-full max-w-sm flex flex-col gap-4">
			<Card class="w-full dark:border-primary">
				<CardHeader>
					<CardTitle class="text-2xl">Register</CardTitle>
				</CardHeader>
				<CardContent>
					<form action="?/register" method="POST" use:enhance>
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
							<div class="grid gap-2">
								<FormField {form} name="password">
									<FormControl>
										{#snippet children({ props })}
											<FormLabel>Password</FormLabel>
											<Input {...props} bind:value={$formData.password} type="password" />
										{/snippet}
									</FormControl>
									<FormFieldErrors />
								</FormField>
							</div>
							<div class="grid gap-2">
								<FormField {form} name="passwordConfirm">
									<FormControl>
										{#snippet children({ props })}
											<FormLabel>Confirm Password</FormLabel>
											<Input {...props} bind:value={$formData.passwordConfirm} type="password" />
										{/snippet}
									</FormControl>
									<FormFieldErrors />
								</FormField>
							</div>
							<Button disabled={loading} type="submit" class="w-full">Create Account</Button>
						</div>
						<div class="mt-4 text-sm text-center">
							Already have an account? <a href="/login" class="underline">Login</a>
						</div>
					</form>
				</CardContent>
			</Card>
			<p class="text-muted-foreground px-8 text-center text-sm">
				By creating an account, you agree to our
				<a href="/terms-of-service" class="hover:text-primary underline underline-offset-4">
					Terms of Service
				</a>
				and
				<a href="/privacy-policy" class="hover:text-primary underline underline-offset-4">
					Privacy Policy
				</a>
				.
			</p>
		</div>
	</div>

	<!-- Right: Image -->
	<div class="hidden lg:block relative overflow-hidden bg-muted rounded-l-2xl">
		<img
			src="/login.jpg"
			alt="Register visual"
			class="absolute inset-0 h-full w-full object-cover"
		/>
		<div class="absolute inset-0 bg-black/30"></div>
	</div>
</div>
