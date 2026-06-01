<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { FormControl, FormField } from '$lib/components/ui/form';
	import { toast } from 'svelte-sonner';
	import { defaultValues, superForm } from 'sveltekit-superforms';
	import { zod4 as zod } from 'sveltekit-superforms/adapters';
	import { LoginUserSchema } from '$lib/schemas.js';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import FormLabel from '$lib/components/ui/form/form-label.svelte';
	import FormFieldErrors from '$lib/components/ui/form/form-field-errors.svelte';
	import { Seo, FullscreenLoader } from '$lib/components/modules';
	import { config } from '$lib/config-client';
	import { EyeOff, Eye } from '@lucide/svelte';
	import posthog from 'posthog-js';
	import PocketBase from 'pocketbase';
	import Google from '$lib/components/icons/brands/Google.svelte';
	import { onMount } from 'svelte';

	let loading = $state(false);
	let googleLoading = $state(false);
	let redirecting = $state(false);
	let showVerificationPrompt = $state(false);
	let lastAuthMethod = $state<string | null>(null);

	onMount(() => {
		lastAuthMethod = localStorage.getItem('lastAuthMethod');
	});

	const form = superForm(defaultValues(zod(LoginUserSchema)), {
		validators: zod(LoginUserSchema),
		onSubmit: () => {
			loading = true;
		},
		onResult: ({ result }) => {
			loading = false;
			if (result.type === 'success') {
				toast.success('Logged in successfully.');
				posthog.identify($formData.login, { email: $formData.login });
			}

			if (result.type === 'failure') {
				if (result.data?.form?.errors?.login[0] === 'Please verify your email address.') {
					showVerificationPrompt = true;
					toast.error('Please verify your email address.');
				} else {
					toast.error('Failed to login.');
				}
			}
		}
	});

	let showPassword = $state(false);

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	const { form: formData, enhance } = form;

	function handleGoogleLogin() {
		// Open popup synchronously in the click handler so browsers treat it as
		// user-initiated (prevents it from opening as a new tab instead of a popup).
		const w = 600, h = 700;
		const left = Math.round(window.screenX + (window.outerWidth - w) / 2);
		const top = Math.round(window.screenY + (window.outerHeight - h) / 2);
		const popup = window.open('', 'google-auth', `width=${w},height=${h},top=${top},left=${left},resizable,menubar=no`);

		googleLoading = true;
		const pb = new PocketBase(config.pbUrl);
		pb.collection('users')
			.authWithOAuth2({
				provider: 'google',
				urlCallback(url) {
					if (popup) {
						popup.location.href = url;
					} else {
						window.open(url, 'google-auth', `width=${w},height=${h},top=${top},left=${left},resizable,menubar=no`);
					}
				}
			})
			.then(async (authData) => {
				const fd = new FormData();
				fd.append('token', authData.token);
				fd.append('record', JSON.stringify(authData.record));

				const res = await fetch('?/loginWithGoogle', { method: 'POST', body: fd });

				if (res.ok) {
					posthog.identify(authData.record.email, { email: authData.record.email });
					toast.success('Logged in successfully.');
					localStorage.setItem('lastAuthMethod', 'google');
					redirecting = true;
					window.location.href = '/dashboard';
				} else {
					toast.error('Google login failed.');
					googleLoading = false;
				}
			})
			.catch(() => {
				toast.error('Google login failed.');
				googleLoading = false;
			});
	}
</script>

<Seo
	title={`Login - ${config.appName}`}
	description={`Login to ${config.appName}`}
	keywords="login, login for ai image generator"
/>

{#if redirecting}
	<FullscreenLoader message="Signing you in…" />
{/if}

<div class="min-h-screen grid lg:grid-cols-2">
	<!-- Left: Form -->
	<div class="flex items-center justify-center p-8">
		<Card class="w-full max-w-sm">
			<CardHeader>
				<CardTitle class="text-2xl">Login</CardTitle>
			</CardHeader>
			<CardContent>
				<form action="?/login" method="POST" use:enhance>
					<div class="grid gap-4">
						<div class="grid gap-2">
							<FormField {form} name="login">
								<FormControl>
									{#snippet children({ props })}
										<FormLabel>Email</FormLabel>
										<Input {...props} bind:value={$formData.login} />
									{/snippet}
								</FormControl>
								{#if showVerificationPrompt}
									<div class="text-sm mt-2 text-destructive">
										<a href="/request-verification" class="underlined">Resend verification email</a>
									</div>
								{/if}
							</FormField>
						</div>
						<div class="grid gap-2">
							<FormField {form} name="password">
								<FormControl>
									{#snippet children({ props })}
										<FormLabel>Password</FormLabel>
										<div class="relative">
											<Input
												{...props}
												bind:value={$formData.password}
												type={showPassword ? 'text' : 'password'}
											/>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
												onclick={togglePasswordVisibility}
											>
												{#if showPassword}
													<EyeOff class="h-4 w-4" />
												{:else}
													<Eye class="h-4 w-4" />
												{/if}
												<span class="sr-only">
													{showPassword ? 'Hide password' : 'Show password'}
												</span>
											</Button>
										</div>
									{/snippet}
								</FormControl>
								<FormFieldErrors />
								<div class="flex flex-col">
									<a href="/forgot-password" class="text-sm text-muted-foreground underline">
										Forgot Your Password?
									</a>
								</div>
							</FormField>
						</div>
						<Button disabled={loading} type="submit" class="w-full">Login</Button>
					</div>				<div class="relative my-4">
					<div class="absolute inset-0 flex items-center"><span class="w-full border-t"></span></div>
					<div class="relative flex justify-center text-xs uppercase">
						<span class="bg-card px-2 text-muted-foreground">Or continue with</span>
					</div>
				</div>
				<Button
					type="button"
					variant="outline"
					class="w-full"
					disabled={googleLoading}
					onclick={handleGoogleLogin}
				>
					<Google class="mr-2 h-4 w-4" />
					{googleLoading ? 'Connecting...' : 'Google'}
					{#if lastAuthMethod === 'google'}
						<span class="ml-auto text-[10px] font-medium bg-primary/10 text-primary rounded-full px-1.5 py-0.5 leading-none">Last used</span>
					{/if}
				</Button>					<div class="mt-4 text-sm text-center">
						Don't have an account?
						<a href="/register" class="underline">Register</a>
					</div>
				</form>
			</CardContent>
		</Card>
	</div>

	<!-- Right: Image -->
	<div class="hidden lg:block relative overflow-hidden bg-muted rounded-l-2xl">
		<img
			src="/login.jpg"
			alt="Login placeholder"
			class="absolute inset-0 h-full w-full object-cover"
		/>
		<div class="absolute inset-0 bg-black/30"></div>
	</div>
</div>
