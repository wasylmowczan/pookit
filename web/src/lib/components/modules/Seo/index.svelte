<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { config } from '$lib/config-client';

	interface Props {
		title?: any;
		description?: any;
		keywords?: string;
		image?: string;
		isProtected?: boolean;
	}

	// TODO : [SEO] Change data for SEO
	let {
		title = `${config.appName} - SaaS Starter Kit, built with SvelteKit & PocketBase.`,
		description = `${config.appName} is a modern SaaS template/boilerplate built with SvelteKit, Pocketbase and shadcn-svelte. Includes auth, user & admin dashboard, user settings, and more..`,
		keywords = 'SaaS, SvelteKit, PocketBase, shadcn-svelte, Starter Kit, Modern SaaS, Template, Boilerplate, Auth, User Dashboard, Admin Dashboard, User Settings',
		image = 'https://svelte.rocks/seo-image.png',
		isProtected = false
	}: Props = $props();

	let baseUrl = $derived(
		config.baseUrl || (browser ? window.location.origin : 'https://svelte.rocks/')
	);
	let path = $derived(page.url.pathname);
	let fullUrl = $derived(`${baseUrl}${path}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />

	{#if isProtected}
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		<!-- Open Graph / Facebook -->
		<meta property="og:type" content="website" />
		<meta property="og:url" content={fullUrl} />
		<meta property="og:title" content={title} />
		<meta property="og:description" content={description} />
		<meta property="og:image" content={image} />

		<!-- Twitter -->
		<meta property="twitter:card" content={image} />
		<meta property="twitter:url" content={fullUrl} />
		<meta property="twitter:title" content={title} />
		<meta property="twitter:description" content={description} />
		<meta property="twitter:image" content={image} />
	{/if}

	<!-- Canonical URL -->
	<link rel="canonical" href={fullUrl} />
</svelte:head>
