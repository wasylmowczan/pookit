<script lang="ts">
	// Scroll below for the component code
	import IntegrationCard from './card.svelte';
	import SvelteIcon from '$lib/components/icons/brands/Svelte.svelte';
	import PocketBaseIcon from '$lib/components/icons/brands/PocketBase.svelte';
	import ShadcnUIIcon from '$lib/components/icons/brands/ShadcnUI.svelte';
	import PolarIcon from '$lib/components/icons/brands/Polar.svelte';
	import PostHogIcon from '$lib/components/icons/brands/PostHog.svelte';
	import CloudflareIcon from '$lib/components/icons/brands/Cloudflare.svelte';
</script>

<section>
	<div class="pb-32">
		<div class="mx-auto max-w-7xl px-6">
			<div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
				<IntegrationCard
					title="SvelteKit"
					description="Built on top of Svelte, SvelteKit is a modern full-stack framework designed for speed, simplicity, and great developer experience. It includes routing, server-side rendering, APIs, and deployment tools out of the box, while compiling your app into highly optimized, lightweight JavaScript with minimal overhead."
					link="https://kit.svelte.dev/"
				>
					<SvelteIcon />
				</IntegrationCard>

				<IntegrationCard
					title="PocketBase"
					description="At its core, PocketBase is an open-source backend that simplifies app development. Built with Go, it combines the API server, admin dashboard, and database into a single executable file, making deployment and management fast and simple—without complex setups or multiple services."
					link="https://pocketbase.io/"
				>
					<PocketBaseIcon />
				</IntegrationCard>

				<IntegrationCard
					title="Shadcn UI"
					description="shadcn/ui has quickly become the gold standard for modern frontend UI development. Instead of locking you into a heavy component library, it gives you beautifully designed, accessible, and fully customizable components you own directly in your codebase — making it perfect for building clean, scalable apps without fighting your tools."
					link="https://www.shadcn-svelte.com/"
				>
					<ShadcnUIIcon />
				</IntegrationCard>

				<IntegrationCard
					title="Polar"
					description="Feels like the modern Stripe for indie hackers and open-source founders. It handles subscriptions, payments, licenses, and product delivery in a way that’s actually simple to set up — with a clean API, great DX, and none of the bloated enterprise feeling most billing platforms have."
					link="https://polar.sh/"
				>
					<PolarIcon />
				</IntegrationCard>

				<IntegrationCard
					title="PostHog"
					description="PostHog is the all-in-one analytics platform that a lot of modern startups replaced multiple tools with. Product analytics, session recordings, feature flags, experiments, and error tracking all live in one developer-friendly platform — with powerful self-hosting support and a strong open-source mindset."
					link="https://posthog.com/"
				>
					<PostHogIcon />
				</IntegrationCard>

				<IntegrationCard
					title="Cloudflare"
					description="Hone of the easiest ways to deploy modern web apps. Push to GitHub, and your app is automatically built and distributed across Cloudflare’s global edge network. Fast deployments, built-in CDN, previews for every pull request, and generous free limits make it a favorite among indie developers."
					link="https://www.cloudflare.com/"
				>
					<CloudflareIcon />
				</IntegrationCard>
			</div>
		</div>
	</div>
</section>
