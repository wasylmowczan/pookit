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
		<div class="mx-auto max-w-5xl px-6">
			<div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
				<IntegrationCard
					title="SvelteKit"
					description="SvelteKit is an app framework that solves the tricky problems of building something production-ready."
					link="https://kit.svelte.dev/"
				>
					<SvelteIcon />
				</IntegrationCard>

				<IntegrationCard
					title="PocketBase"
					description="PocketBase is an open-source backend solution that provides a real-time database, authentication, and file storage for your applications."
					link="https://pocketbase.io/"
				>
					<PocketBaseIcon />
				</IntegrationCard>

				<IntegrationCard
					title="Shadcn UI"
					description="Shadcn UI is a modern UI component library that provides a set of reusable and customizable components for building web applications."
					link="https://www.shadcn-svelte.com/"
				>
					<ShadcnUIIcon />
				</IntegrationCard>

				<IntegrationCard
					title="Polar"
					description="Polar handles your billing and subscription management with ease."
					link="https://polar.sh/"
				>
					<PolarIcon />
				</IntegrationCard>

				<IntegrationCard
					title="PostHog"
					description="PostHog is an open-source product analytics platform that helps you understand user behavior and improve your product."
					link="https://posthog.com/"
				>
					<PostHogIcon />
				</IntegrationCard>

				<IntegrationCard
					title="Cloudflare"
					description="Host your page on Cloudflare Pages and enjoy the benefits of a global CDN, automatic SSL, and seamless integration with your Git workflow."
					link="https://www.cloudflare.com/"
				>
					<CloudflareIcon />
				</IntegrationCard>
			</div>
		</div>
	</div>
</section>
