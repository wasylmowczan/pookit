<script lang="ts">
	import type { PageProps } from './$types';
	import { PricingPage } from '$lib/components/blocks';
	let { data }: PageProps = $props();

	const defaultPricingList = {
		free: [
			'Authentication with PocketBase',
			'Payments with Polar',
			'PostHog Integration',
			'Admin Panel (Users & Feedback)',
			'SEO optimized pages',
			'Tailwind CSS 4 + shadcn-svelte',
			'Legal Pages (Privacy Policy, ToS)',
			'Cloudflare Deployment Config'
		],
		pro: ['Mails', 'Blog Integration', 'Extra Landing pages', 'AI coding agents support']
	};
</script>

<PricingPage
	pricingList={defaultPricingList}
	proProductId={data.proProductId ?? undefined}
	proPlan={data.proPlan ?? undefined}
/>
