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
		title = `${config.appName} - True indie hacker boilerplate`,
		description = `${config.appName} is a modern SaaS template/boilerplate built with SvelteKit, Pocketbase and shadcn-svelte. Includes auth, user & admin dashboard, user settings, and more.`,
		keywords = 'SaaS, SvelteKit, PocketBase, shadcn-svelte, Starter Kit, Modern SaaS, Template, Boilerplate, Auth, User Dashboard, Admin Dashboard, User Settings',
		image = 'https://pookit.dev/seo-image.png',
		isProtected = false
	}: Props = $props();

	let baseUrl = $derived(
		config.baseUrl || (browser ? window.location.origin : 'https://pookit.dev/')
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
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta property="og:site_name" content={config.appName} />

		<!-- Twitter -->
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:url" content={fullUrl} />
		<meta name="twitter:title" content={title} />
		<meta name="twitter:description" content={description} />
		<meta name="twitter:image" content={image} />
	{/if}

	<!-- Canonical URL -->
	<link rel="canonical" href={fullUrl} />
</svelte:head>
