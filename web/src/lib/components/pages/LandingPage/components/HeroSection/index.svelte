<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import heroimageLight from '$lib/assets/hero_light.png';
	import heroimageDark from '$lib/assets/hero_dark.png';
	import { InteractiveGrid } from '$lib/motion-core';
	import type { ComponentProps } from 'svelte';
	import { PointerHighlight } from '$lib/components/magicui';
	import GitHubIcon from '$lib/components/icons/brands/GitHub.svelte';
	import { SectionContainer } from '..';

	type Props = Partial<ComponentProps<typeof InteractiveGrid>>;
	let { grid = 15, mouseSize = 0.15, strength = 0.35, relaxation = 0.9 }: Props = $props();
</script>

<SectionContainer
	// sectionClass="min-h-screen"
	contentClass="flex-1 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20"
>
	<div
		class="flex flex-col items-center text-center lg:items-start lg:text-left gap-8 md:w-1/2 justify-center"
	>
		<h1 class="text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl">
			Ship beautiful projects
		</h1>

		<PointerHighlight
			rectangleClassName="bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
			pointerClassName="text-yellow-500"
		>
			<span class="relative z-10 text-lg md:text-xl lg:text-2xl"
				>Your <span class="font-semibold" style="color: #FF3E00">SvelteKit</span> +
				<span class="font-semibold" style="color: #72b7ca">PocketBase</span> boilerplate for building
				amazing projects.</span
			>
		</PointerHighlight>

		<div class="flex gap-4">
			<Button size="lg" href="/register">Start building</Button>
			<Button size="lg" href="https://github.com" variant="outline" target="_blank">
				<GitHubIcon/> GitHub
			</Button>
		</div>
	</div>
	<div class="flex justify-center items-center md:w-1/2">
		<InteractiveGrid
			image={heroimageLight}
			class="min-h-[500px] w-full dark:hidden"
			{grid}
			{mouseSize}
			{strength}
			{relaxation}
		/>
		<InteractiveGrid
			image={heroimageDark}
			class="min-h-[500px] w-full hidden dark:flex"
			{grid}
			{mouseSize}
			{strength}
			{relaxation}
		/>
	</div>
</SectionContainer>
