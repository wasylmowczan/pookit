<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Check from '@lucide/svelte/icons/check';

	let { pricingList } = $props();
</script>

<section class="py-16 md:py-32">
	<div class="mx-auto max-w-5xl px-6">
		<div class="mx-auto max-w-2xl space-y-6 text-center">
			<h1 class="text-center text-4xl font-semibold lg:text-5xl">Pricing that Scales with You</h1>
			<p>
				Remember, basic boilerplate is totally free. Only if you need more advanced features, you
				can choose to upgrade to Pro plan.
			</p>
		</div>

		<div class="mt-8 grid gap-6 md:mt-20 md:grid-cols-5 md:gap-0">
			<div
				class="flex flex-col justify-between space-y-8 rounded-(--radius) border p-6 md:col-span-2 md:my-2 md:rounded-r-none md:border-r-0 lg:p-10"
			>
				<div class="space-y-4">
					<div>
						<h2 class="font-medium">Free</h2>
						<span class="my-3 block text-2xl font-semibold">$0</span>
						<p class="text-sm text-muted-foreground">Try it out and share your opinion.</p>
					</div>

					<Button href="/" variant="outline" class="w-full">Get Started</Button>

					<hr class="border-dashed" />

					<ul class="list-outside space-y-3 text-sm">
						{#each pricingList.free as item}
							<li class="flex items-center gap-2">
								<Check class="size-3" />
								{item}
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<div
				class="rounded-(--radius) border p-6 shadow-lg shadow-gray-950/5 md:col-span-3 lg:p-10 dark:bg-muted dark:[--color-muted:var(--color-zinc-900)]"
			>
				<div class="grid gap-6 sm:grid-cols-2">
					<div class="space-y-4">
						<div>
							<h2 class="font-medium">Pro</h2>
							<span class="my-3 block text-2xl font-semibold">$99</span>
							<p class="text-sm text-muted-foreground">Perfect for Indie Hackers.</p>
						</div>

						<Button href="/" class="w-full">Get Started</Button>
					</div>

					<div>
						<div class="text-sm font-medium">Everything in free plus :</div>

						<ul class="mt-4 list-outside space-y-3 text-sm">
							{#each pricingList.pro as item}
								<li class="flex items-center gap-2">
									<Check class="size-3" />
									{item}
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
