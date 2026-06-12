<script lang="ts">
	import Package from '@lucide/svelte/icons/package';
	import Database from '@lucide/svelte/icons/database';
	import Zap from '@lucide/svelte/icons/zap';
	import HardDrive from '@lucide/svelte/icons/hard-drive';
	import Globe from '@lucide/svelte/icons/globe';
	import Lock from '@lucide/svelte/icons/lock';
	import Server from '@lucide/svelte/icons/server';
	import KeyRound from '@lucide/svelte/icons/key-round';
	import heroimageLight from '$lib/assets/hero_light.png';
	import heroimageDark from '$lib/assets/hero_dark.png';
	import { FeatureShowcase, BrowserMockup } from '$lib/components/blocks';

	const features = [
		{
			icon: Package,
			title: 'Single Executable',
			description: 'The entire backend is one binary. No Docker, no dependencies, no config hell.'
		},
		{
			icon: Database,
			title: 'Collections & Schema',
			description: 'Visual schema builder with relations, field types, and validation rules.'
		},
		{
			icon: Zap,
			title: 'Real-time Subscriptions',
			description: 'Subscribe to collection changes and push live updates to clients instantly.'
		},
		{
			icon: HardDrive,
			title: 'File Storage',
			description:
				'Use as a standalone app OR as a framework, that you can extend via Go and JavaScript hooks to create your own custom portable backend.'
		},
		{
			icon: KeyRound,
			title: 'Auth Providers',
			description: 'Email/password, OAuth2 with 30+ providers, OTP, and passkeys — all built in.'
		},
		{
			icon: Lock,
			title: 'Access Rules',
			description:
				'Fine-grained per-collection access control with a simple rule expression language.'
		},
		{
			icon: Server,
			title: 'Self-Hostable',
			description: 'Deploy on any VPS in minutes, or run locally for development and testing.'
		}
	];
</script>

<FeatureShowcase
	title="One Binary. Full Backend."
	description="PocketBase packs an API server, admin dashboard, auth system, file storage, and SQLite database into a single executable. No Kubernetes, no microservices — just ship."
	{features}
>
	{#snippet mockup()}
		<BrowserMockup
			url="localhost:8090/_/"
			imageLight={heroimageLight}
			imageDark={heroimageDark}
			alt="PocketBase admin UI preview"
		/>
	{/snippet}
</FeatureShowcase>
