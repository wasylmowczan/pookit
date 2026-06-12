<script lang="ts">
	import { onMount } from 'svelte';
	import { config } from '$lib/config-client';
	import { FullscreenLoader } from '$lib/components/modules';
	import PocketBase from 'pocketbase';
	import posthog from 'posthog-js';
	import { toast } from 'svelte-sonner';

	onMount(async () => {
		const params = new URLSearchParams(window.location.search);
		const code = params.get('code');
		const state = params.get('state');
		const error = params.get('error');

		if (error) {
			toast.error('Google sign-in was cancelled.');
			window.location.href = '/login';
			return;
		}

		if (!code || !state) {
			toast.error('Invalid OAuth callback.');
			window.location.href = '/login';
			return;
		}

		const stored = sessionStorage.getItem('google_oauth');
		if (!stored) {
			toast.error('OAuth session expired. Please try again.');
			window.location.href = '/login';
			return;
		}

		let parsed: { codeVerifier: string; state: string; redirectTo: string };
		try {
			parsed = JSON.parse(stored);
		} catch {
			toast.error('OAuth session invalid. Please try again.');
			window.location.href = '/login';
			return;
		}

		if (state !== parsed.state) {
			toast.error('Sign-in failed. Please try again.');
			window.location.href = '/login';
			return;
		}

		sessionStorage.removeItem('google_oauth');

		try {
			const pb = new PocketBase(config.pbUrl);
			const redirectUrl = `${window.location.origin}/auth/google/callback`;
			const authData = await pb
				.collection('users')
				.authWithOAuth2Code('google', code, parsed.codeVerifier, redirectUrl);

			const fd = new FormData();
			fd.append('token', authData.token);
			fd.append('record', JSON.stringify(authData.record));
			const res = await fetch('?/loginWithGoogle', { method: 'POST', body: fd });

			if (res.ok) {
				posthog.identify(authData.record.email, { email: authData.record.email });
				localStorage.setItem('lastAuthMethod', 'google');
				window.location.href = parsed.redirectTo || '/dashboard';
			} else {
				toast.error('Google sign-in failed.');
				window.location.href = '/login';
			}
		} catch {
			toast.error('Google sign-in failed.');
			window.location.href = '/login';
		}
	});
</script>

<FullscreenLoader message="Signing you in with Google…" />
