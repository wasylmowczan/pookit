<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import GitHubIcon from '$lib/components/icons/brands/GitHub.svelte';
</script>

<section class="relative mx-auto w-full overflow-hidden px-4 py-24">
	<!-- Ambient glow blobs -->
	<div
		class="pointer-events-none absolute inset-0 flex items-center justify-center"
		aria-hidden="true"
	>
		<div
			class="h-[500px] w-[700px] rounded-full bg-orange-500/10 blur-[120px] dark:bg-orange-500/15"
		></div>
	</div>
	<div
		class="pointer-events-none absolute -left-20 top-0 h-[300px] w-[300px] rounded-full bg-violet-500/10 blur-[100px] dark:bg-violet-500/15"
		aria-hidden="true"
	></div>
	<div
		class="pointer-events-none absolute -right-20 bottom-0 h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[100px] dark:bg-cyan-500/15"
		aria-hidden="true"
	></div>

	<div
		class="relative mx-auto max-w-5xl border border-border bg-background/60 px-8 py-16 text-center shadow-xl backdrop-blur-sm"
	>
		<h2 class="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
			Start building<br />
			<span
				class="bg-gradient-to-r from-orange-500 via-pink-500 to-violet-500 bg-clip-text text-transparent"
				>for free today</span
			>
		</h2>

		<p class="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
			Grab the open-source base on GitHub and ship your idea in hours, not weeks. Upgrade to Pro
			whenever you're ready.
		</p>

		<div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
			<Button
				size="lg"
				href="https://github.com/wasylmowczan/pookit"
				target="_blank"
				class="gap-2 text-base"
			>
				<GitHubIcon />
				Get free on GitHub
			</Button>

			<Button size="lg" href="/pricing" variant="outline" class="text-base">
				Upgrade to Pro &rarr;
			</Button>
		</div>
	</div>
</section>
