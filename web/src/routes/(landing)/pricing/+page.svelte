<script lang="ts">
	import type { PageProps } from './$types';
	import { PricingPage } from '$lib/components/blocks';
	let { data }: PageProps = $props();

	const defaultPricingList = {
		free: [
			'Sveltekit Boilerplate',
			'Auth with PocketBase',
			'Polar Payments Integration',
			'PostHog Integration',
			'Admin Panel (Users & Feedback)',
			'SEO optimized pages',
			'Light / Dark Mode',
			'Tailwind CSS 4 + shadcn-svelte',
			'Changelog & Roadmap Pages',
			'Legal Pages (Privacy Policy, ToS)',
			'Cloudflare Deployment Config'
		],
		pro: ['Email integration', 'Extra Landing page templates', 'Priority support']
	};
</script>

<PricingPage pricingList={defaultPricingList} />
