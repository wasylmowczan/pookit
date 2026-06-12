<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { SectionContainer } from '$lib/components/pages/LandingPage/components';

	interface Feature {
		icon: Component;
		title: string;
		description: string;
		badge?: string;
	}

	interface Props {
		title: string;
		description: string;
		features: Feature[];
		mockup?: Snippet;
		reverse?: boolean;
	}

	let { title, description, features, mockup, reverse = false }: Props = $props();
</script>

<SectionContainer>
	<div class="mx-auto max-w-7xl px-4 lg:px-8">
		<!-- Top: text left + mockup right (or reversed) -->
		<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
			<div class={`flex flex-col gap-6 ${reverse ? 'lg:order-2' : ''}`}>
				<h2 class="text-4xl font-bold leading-tight lg:text-5xl">
					{title}
				</h2>
				<p class="text-lg text-muted-foreground">
					{description}
				</p>
			</div>

			{#if mockup}
				<div class={reverse ? 'lg:order-1' : ''}>
					{@render mockup()}
				</div>
			{/if}
		</div>

		<!-- Feature cards grid -->
		<div class="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each features as feature}
				<div
					class="flex flex-col gap-3 border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
				>
					<div
						class="flex size-10 items-center justify-center border border-border bg-muted text-foreground"
					>
						<feature.icon class="size-5" />
					</div>
					<div>
						<div class="mb-1 flex items-center gap-2">
							<h3 class="text-base font-semibold">{feature.title}</h3>
							{#if feature.badge}
								<Badge variant="secondary" class="text-xs">{feature.badge}</Badge>
							{/if}
						</div>
						<p class="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</SectionContainer>
