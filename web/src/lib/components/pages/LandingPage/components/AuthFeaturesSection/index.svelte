<script lang="ts">
	import Lock from '@lucide/svelte/icons/lock';
	import Link2 from '@lucide/svelte/icons/link-2';
	import Hash from '@lucide/svelte/icons/hash';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import MailCheck from '@lucide/svelte/icons/mail-check';
	import Shield from '@lucide/svelte/icons/shield';
	import KeySquare from '@lucide/svelte/icons/key-square';
	import UserX from '@lucide/svelte/icons/user-x';
	import heroimageLight from '$lib/assets/hero_light.png';
	import heroimageDark from '$lib/assets/hero_dark.png';
	import { FeatureShowcase, BrowserMockup } from '$lib/components/blocks';

	const features = [
		{
			icon: Lock,
			title: 'Email/Password',
			description: 'Classic email and password login & registration.'
		},
		{
			icon: Link2,
			title: 'Social Login',
			description: 'Sign in with Google, GitHub, and other providers via OAuth2.'
		},
		{
			icon: Hash,
			title: 'One Time Passwords',
			description: 'Passwordless login with magic links and one-time passcodes sent via email.'
		},
		{
			icon: RotateCcw,
			title: 'Password Reset',
			description: 'Secure password recovery workflow with link expiration.'
		},
		{
			icon: MailCheck,
			title: 'Email Validation',
			description: 'Automated email validation system with link expiration.'
		},
		{
			icon: KeySquare,
			title: 'Change Password',
			description: 'Allow users to change their password securely in user settings.'
		},
		{
			icon: UserX,
			title: 'Delete Account',
			description: 'Allow users to delete their account securely.'
		},
		{
			icon: Shield,
			title: '2FA',
			description: 'Two-factor authentication via email.',
			badge: 'Coming Soon'
		}
	];
</script>

<FeatureShowcase
	title="Every Authentication Flow You Need"
	description="Pookit gives you a complete authentication system out of the box, with pre-built flows for sign-up, login, password reset, email verification, and more. All powered by PocketBase's flexible auth providers and rules engine."
	{features}
>
	{#snippet mockup()}
		<BrowserMockup
			url="app.pookit.dev/login"
			imageLight={heroimageLight}
			imageDark={heroimageDark}
			alt="Auth flow preview"
		/>
	{/snippet}
</FeatureShowcase>
