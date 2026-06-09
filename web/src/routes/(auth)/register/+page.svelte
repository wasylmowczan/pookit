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
	import { Seo, FullscreenLoader } from '$lib/components/modules';
	import { config } from '$lib/config-client';
	import posthog from 'posthog-js';
	import PocketBase from 'pocketbase';
	import Google from '$lib/components/icons/brands/Google.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
	const redirectTo = $derived(data?.redirectTo ?? '/dashboard');
	const loginHref = $derived(
		redirectTo && redirectTo !== '/dashboard'
			? `/login?redirect=${encodeURIComponent(redirectTo)}`
			: '/login'
	);

	let loading = $state(false);
	let googleLoading = $state(false);
	let redirecting = $state(false);
	let lastAuthMethod = $state<string | null>(null);

	onMount(() => {
		lastAuthMethod = localStorage.getItem('lastAuthMethod');
	});

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
				posthog.identify($formData.email, { email: $formData.email });
			} else {
				toast.error('Failed to register.');
			}
		}
	});

	const { form: formData, enhance } = form;

	const steps = [
		{ label: 'Sign up to your account' },
		{ label: 'Add your name' },
		{ label: 'Add your photo' },
		{ label: 'Get Pro access' }
	];

	function handleGoogleLogin() {
		// Open popup synchronously in the click handler so browsers treat it as
		// user-initiated (prevents it from opening as a new tab instead of a popup).
		const w = 600,
			h = 700;
		const left = Math.round(window.screenX + (window.outerWidth - w) / 2);
		const top = Math.round(window.screenY + (window.outerHeight - h) / 2);
		const popup = window.open(
			'',
			'google-auth',
			`width=${w},height=${h},top=${top},left=${left},resizable,menubar=no`
		);

		googleLoading = true;
		const pb = new PocketBase(config.pbUrl);
		pb.collection('users')
			.authWithOAuth2({
				provider: 'google',
				urlCallback(url) {
					if (popup) {
						popup.location.href = url;
					} else {
						window.open(
							url,
							'google-auth',
							`width=${w},height=${h},top=${top},left=${left},resizable,menubar=no`
						);
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
					toast.success('Signed in with Google.');
					localStorage.setItem('lastAuthMethod', 'google');
					redirecting = true;
					window.location.href = redirectTo;
				} else {
					toast.error('Google sign-in failed.');
					googleLoading = false;
				}
			})
			.catch(() => {
				toast.error('Google sign-in failed.');
				googleLoading = false;
			});
	}
</script>

<Seo
	title={`Register - ${config.appName}`}
	description={`Register to ${config.appName}`}
	keywords="register, register to ai image generator"
/>

{#if redirecting}
	<FullscreenLoader message="Signing you in…" />
{/if}

<div class="min-h-screen grid lg:grid-cols-2">
	<!-- Left: Form -->
	<div class="flex items-center justify-center p-8">
		<div class="w-full max-w-sm flex flex-col gap-4">
			<Card class="w-full shadow-sm">
				<CardHeader>
					<CardTitle class="text-2xl">Register</CardTitle>
				</CardHeader>
				<CardContent>
					<form action="?/register" method="POST" use:enhance>
						{#if redirectTo && redirectTo !== '/dashboard'}
							<input type="hidden" name="redirect" value={redirectTo} />
						{/if}
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
						<div class="relative my-4">
							<div class="absolute inset-0 flex items-center">
								<span class="w-full border-t"></span>
							</div>
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
								<span
									class="ml-auto text-[10px] font-medium bg-primary/10 text-primary rounded-full px-1.5 py-0.5 leading-none"
									>Last used</span
								>
							{/if}
						</Button>
						<div class="mt-4 text-sm text-center">
							Already have an account? <a href={loginHref} class="underline">Login</a>
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
	<div class="hidden lg:flex flex-col relative overflow-hidden rounded-l-2xl">
		<img
			src="/login.jpg"
			alt="Register visual"
			class="absolute inset-0 h-full w-full object-cover"
		/>
		<div class="absolute inset-0 bg-black/30"></div>

		<!-- Step cards -->
		<div class="absolute top-8 left-4 right-4 grid grid-cols-4 gap-2">
			{#each steps as { label }, i}
				<div class="flex flex-col items-center gap-3 p-4 backdrop-blur-md rounded-xl border text-center
					{i === 0 ? 'bg-white/20 border-white/25' : 'bg-white/10 border-white/20'}">
					<div class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
						{i === 0 ? 'bg-primary/80 text-white' : 'bg-white/20 text-white/70'}">
						{i + 1}
					</div>
					<p class="text-xs font-medium leading-snug {i === 0 ? 'text-white' : 'text-white/60'}">{label}</p>
				</div>
			{/each}
		</div>
	</div>
</div>
