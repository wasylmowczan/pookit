<script lang="ts">
	import { deserialize } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { Eye, EyeOff } from '@lucide/svelte';
	import { config } from '$lib/config-client';
	import Google from '$lib/components/icons/brands/Google.svelte';
	import { FullscreenLoader, Seo } from '$lib/components/modules';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import { FormControl, FormField } from '$lib/components/ui/form';
	import FormFieldErrors from '$lib/components/ui/form/form-field-errors.svelte';
	import FormLabel from '$lib/components/ui/form/form-label.svelte';
	import { Input } from '$lib/components/ui/input';
	import { LoginUserSchema } from '$lib/schemas.js';
	import { onMount } from 'svelte';
	import posthog from 'posthog-js';
	import PocketBase from 'pocketbase';
	import { toast } from 'svelte-sonner';
	import { zod4 as zod } from 'sveltekit-superforms/adapters';
	import { defaultValues, superForm } from 'sveltekit-superforms';
	let { data } = $props();
	const redirectTo = $derived(data?.redirectTo ?? '/dashboard');
	const registerHref = $derived(
		redirectTo && redirectTo !== '/dashboard'
			? `/register?redirect=${encodeURIComponent(redirectTo)}`
			: '/register'
	);
	// ── auth mode ────────────────────────────────────────────────────────────
	type AuthMode = 'password' | 'otp';
	let authMode = $state<AuthMode>('password');

	// ── shared ───────────────────────────────────────────────────────────────
	let loading = $state(false);
	let googleLoading = $state(false);
	let redirecting = $state(false);
	let showVerificationPrompt = $state(false);
	let lastAuthMethod = $state<string | null>(null);
	let showPassword = $state(false);

	// ── OTP state ─────────────────────────────────────────────────────────────
	let otpEmail = $state('');
	let otpId = $state<string | null>(null);
	let otpCode = $state('');
	let otpStep = $state<'email' | 'code'>('email');
	let otpRequestLoading = $state(false);
	let otpLoginLoading = $state(false);
	let resendCountdown = $state(0);
	let resendTimer: ReturnType<typeof setInterval> | null = null;

	onMount(() => {
		const stored = localStorage.getItem('lastAuthMethod');
		lastAuthMethod = stored;
		if (stored === 'otp') authMode = 'otp';

		return () => {
			if (resendTimer) clearInterval(resendTimer);
		};
	});

	// ── password form ─────────────────────────────────────────────────────────
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
				localStorage.setItem('lastAuthMethod', 'password');
			}
			if (result.type === 'failure') {
				if (result.data?.form?.errors?.login?.[0] === 'Please verify your email address.') {
					showVerificationPrompt = true;
					toast.error('Please verify your email address.');
				} else {
					toast.error('Failed to login.');
				}
			}
		}
	});

	const { form: formData, enhance } = form;

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	// ── tab switch ────────────────────────────────────────────────────────────
	function setMode(mode: AuthMode) {
		authMode = mode;
		if (mode === 'otp') {
			otpEmail = $formData.login?.trim() ?? '';
		}
	}

	// ── OTP helpers ───────────────────────────────────────────────────────────
	function startResendCountdown() {
		resendCountdown = 60;
		if (resendTimer) clearInterval(resendTimer);
		resendTimer = setInterval(() => {
			resendCountdown -= 1;
			if (resendCountdown <= 0) {
				resendCountdown = 0;
				if (resendTimer) clearInterval(resendTimer);
			}
		}, 1000);
	}

	function resetOtp() {
		otpId = null;
		otpCode = '';
		otpStep = 'email';
		resendCountdown = 0;
		if (resendTimer) clearInterval(resendTimer);
	}

	async function postAction(action: string, data: FormData) {
		const res = await fetch(action, {
			method: 'POST',
			body: data,
			headers: { 'x-sveltekit-action': 'true' }
		});
		return deserialize(await res.text()) as ActionResult;
	}

	function actionError(result: ActionResult): string | null {
		if (result.type !== 'failure' || !result.data) return null;
		return (result.data as { error?: string }).error ?? null;
	}

	async function handleSendOtp() {
		const email = otpEmail.trim();
		if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
			toast.error('Enter a valid email address.');
			return;
		}

		otpRequestLoading = true;
		const fd = new FormData();
		fd.append('email', email);

		try {
			const result = await postAction('?/requestOtp', fd);
			if (result.type === 'success') {
				const data = result.data as { otpId?: string; email?: string };
				if (!data.otpId) {
					toast.error('Could not start OTP login. Try again.');
					return;
				}
				otpId = data.otpId;
				otpEmail = data.email ?? email;
				otpStep = 'code';
				startResendCountdown();
				toast.success('If this email is registered, a code has been sent.');
				return;
			}
			toast.error(actionError(result) ?? 'Failed to send code.');
		} catch {
			toast.error('Failed to send code.');
		} finally {
			otpRequestLoading = false;
		}
	}

	async function handleVerifyOtp() {
		if (!otpId) {
			toast.error('Request a code first.');
			return;
		}
		if (otpCode.trim().length < 6) {
			toast.error('Enter the 6-digit code.');
			return;
		}

		otpLoginLoading = true;
		const fd = new FormData();
		fd.append('otpId', otpId);
		fd.append('code', otpCode.trim());
		fd.append('email', otpEmail);

		try {
			const result = await postAction('?/loginWithOtp', fd);
			if (result.type === 'success') {
				posthog.identify(otpEmail, { email: otpEmail });
				localStorage.setItem('lastAuthMethod', 'otp');
				toast.success('Logged in successfully.');
				redirecting = true;
				window.location.href = redirectTo;
				return;
			}
			toast.error(actionError(result) ?? 'OTP login failed.');
		} catch {
			toast.error('OTP login failed.');
		} finally {
			otpLoginLoading = false;
		}
	}

	// ── Google ────────────────────────────────────────────────────────────────
	function handleGoogleLogin() {
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
					if (popup) popup.location.href = url;
					else
						window.open(
							url,
							'google-auth',
							`width=${w},height=${h},top=${top},left=${left},resizable,menubar=no`
						);
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
					window.location.href = redirectTo;
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
	keywords="login, sign in"
/>

{#if redirecting}
	<FullscreenLoader message="Signing you in…" />
{/if}

<div class="min-h-screen grid lg:grid-cols-2">
	<!-- Left: Form -->
	<div class="flex flex-col items-center justify-center p-8 gap-3">
		<Card class="w-full max-w-sm relative z-20">
			<CardHeader class="pb-2">
				<CardTitle class="text-2xl">Welcome Back</CardTitle>
				<p class="text-sm text-muted-foreground">Choose your preferred login method</p>
			</CardHeader>
			<CardContent>
				<!-- Tab switcher -->
				<div class="flex border border-border bg-muted p-1 mb-6">
					<button
						type="button"
						onclick={() => setMode('password')}
						class="flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all
							{authMode === 'password'
							? 'bg-background shadow-sm text-foreground'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						Email &amp; Password
					</button>
					<button
						type="button"
						onclick={() => setMode('otp')}
						class="flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all
							{authMode === 'otp'
							? 'bg-background shadow-sm text-foreground'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						One-Time Passcode
						{#if lastAuthMethod === 'otp'}
							<span
								class="ml-1 text-[10px] font-medium bg-primary/10 text-primary rounded-full px-1.5 py-0.5 leading-none"
								>Last used</span
							>
						{/if}
					</button>
				</div>

				{#if authMode === 'password'}
					<!-- ── Password tab ──────────────────────────────────── -->
					<form action="?/login" method="POST" use:enhance class="grid gap-4">
						<div class="grid gap-2">
							<FormField {form} name="login">
								<FormControl>
									{#snippet children({ props })}
										<FormLabel>Email Address</FormLabel>
										<Input {...props} bind:value={$formData.login} placeholder="you@example.com" />
									{/snippet}
								</FormControl>
								{#if showVerificationPrompt}
									<div class="text-sm mt-1 text-destructive">
										<a href="/request-verification" class="underline">Resend verification email</a>
									</div>
								{/if}
								<FormFieldErrors />
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
												{#if showPassword}<EyeOff class="h-4 w-4" />{:else}<Eye
														class="h-4 w-4"
													/>{/if}
												<span class="sr-only">{showPassword ? 'Hide' : 'Show'} password</span>
											</Button>
										</div>
									{/snippet}
								</FormControl>
								<FormFieldErrors />
								<a href="/forgot-password" class="text-sm text-muted-foreground underline">
									Forgot Your Password?
								</a>
							</FormField>
						</div>
						<Button disabled={loading} type="submit" class="w-full">
							{loading ? 'Logging in…' : 'Login'}
						</Button>

						<div class="relative my-1">
							<div class="absolute inset-0 flex items-center">
								<span class="w-full border-t"></span>
							</div>
							<div class="relative flex justify-center text-xs uppercase">
								<span class="bg-card px-2 text-muted-foreground">or continue with</span>
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
							{googleLoading ? 'Connecting…' : 'Google'}
							{#if lastAuthMethod === 'google'}
								<span
									class="ml-auto text-[10px] font-medium bg-primary/10 text-primary rounded-full px-1.5 py-0.5 leading-none"
									>Last used</span
								>
							{/if}
						</Button>

						<p class="text-sm text-center text-muted-foreground">
							Don't have an account? <a href={registerHref} class="underline text-foreground"
								>Register</a
							>
						</p>
					</form>
				{:else}
					<!-- ── OTP tab ────────────────────────────────────────── -->
					<div class="grid gap-4">
						{#if otpStep === 'email'}
							<p class="text-sm text-muted-foreground">
								One-time codes can only be sent to existing accounts.
							</p>
							<div class="grid gap-2">
								<label for="otp-email-input" class="text-sm font-medium leading-none">Email Address</label>
								<Input
									id="otp-email-input"
									type="email"
									placeholder="you@example.com"
									bind:value={otpEmail}
									autocomplete="email"
								/>
							</div>
							<Button
								type="button"
								class="w-full"
								disabled={otpRequestLoading}
								onclick={handleSendOtp}
							>
								{otpRequestLoading ? 'Sending…' : 'Send OTP'}
							</Button>
						{:else}
							<div class="grid gap-1">
								<p class="text-sm text-muted-foreground">
									If <span class="font-semibold text-foreground">{otpEmail}</span> is registered, a 6-digit
									code was sent.
								</p>
							</div>

							<div class="grid gap-2">
								<label for="otp-input" class="text-sm font-medium leading-none">Enter OTP</label>
								<Input
									id="otp-input"
									placeholder="000000"
									maxlength={6}
									bind:value={otpCode}
									autocomplete="one-time-code"
									inputmode="numeric"
									class="tracking-[0.5em] text-center text-lg font-mono"
								/>
							</div>

							<Button
								type="button"
								class="w-full"
								disabled={otpLoginLoading}
								onclick={handleVerifyOtp}
							>
								{otpLoginLoading ? 'Verifying…' : 'Verify OTP'}
							</Button>

							<div class="flex items-center justify-between text-sm">
								<button
									type="button"
									class="text-primary underline-offset-4 hover:underline"
									onclick={resetOtp}
								>
									Change Email
								</button>
								{#if resendCountdown > 0}
									<span class="text-primary">Resend in {resendCountdown}s</span>
								{:else}
									<button
										type="button"
										class="text-primary underline-offset-4 hover:underline"
										disabled={otpRequestLoading}
										onclick={handleSendOtp}
									>
										{otpRequestLoading ? 'Sending…' : 'Resend code'}
									</button>
								{/if}
							</div>
						{/if}

						<div class="relative my-1">
							<div class="absolute inset-0 flex items-center">
								<span class="w-full border-t"></span>
							</div>
							<div class="relative flex justify-center text-xs uppercase">
								<span class="bg-card px-2 text-muted-foreground">or continue with</span>
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
							{googleLoading ? 'Connecting…' : 'Google'}
							{#if lastAuthMethod === 'google'}
								<span
									class="ml-auto text-[10px] font-medium bg-primary/10 text-primary rounded-full px-1.5 py-0.5 leading-none"
									>Last used</span
								>
							{/if}
						</Button>

						<p class="text-sm text-center text-muted-foreground">
							Don't have an account? <a href={registerHref} class="underline text-foreground"
								>Register</a
							>
						</p>
					</div>
				{/if}
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
