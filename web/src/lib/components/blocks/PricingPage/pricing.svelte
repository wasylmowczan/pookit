<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Check from '@lucide/svelte/icons/check';

	type ProPlan = {
		id: string;
		name: string;
		priceLabel: string;
		description: string | null;
		recurringInterval?: string | null;
	};

	let {
		pricingList,
		proPlans = [],
		proCtaLabel = 'Get Started'
	} = $props<{
		pricingList: { free: string[]; pro: string[] };
		proPlans?: ProPlan[];
		proCtaLabel?: string;
	}>();

	const singlePlan = $derived(proPlans.length === 1 ? proPlans[0] : null);
	const multiPlans = $derived(proPlans.length > 1 ? proPlans : null);
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

		{#if multiPlans}
			<!-- Multi-plan: Free + multiple paid cards -->
			<div class="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
				<!-- Free -->
				<div class="flex flex-col justify-between space-y-8 rounded-(--radius) border p-6 lg:p-8">
					<div class="space-y-4">
						<div>
							<h2 class="font-medium">Free</h2>
							<span class="my-3 block text-2xl font-semibold">$0</span>
							<p class="text-sm text-muted-foreground">Try it out and share your opinion.</p>
						</div>

						<Button href="/register" variant="outline" class="w-full">Get Started</Button>

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

				<!-- Paid plans -->
				{#each multiPlans as plan, i}
					{@const isHighlighted = i === multiPlans.length - 1}
					{@const checkoutHref = `/api/checkout?product=${encodeURIComponent(plan.id)}`}
					<div
						class={[
							'relative flex flex-col justify-between space-y-8 rounded-(--radius) border p-6 lg:p-8',
							isHighlighted
								? 'border-primary shadow-lg shadow-gray-950/5 dark:bg-muted dark:[--color-muted:var(--color-zinc-900)]'
								: ''
						].join(' ')}
					>
						{#if isHighlighted}
							<div
								class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground whitespace-nowrap"
							>
								Most popular
							</div>
						{/if}

						<div class="space-y-4">
							<div>
								<div class="flex items-center gap-2">
									<h2 class="font-medium">{plan.name}</h2>
									{#if plan.recurringInterval}
										<span class="text-xs text-muted-foreground rounded-full border px-2 py-0.5">
											{plan.recurringInterval}
										</span>
									{:else}
										<span class="text-xs text-muted-foreground rounded-full border px-2 py-0.5">
											one-time
										</span>
									{/if}
								</div>
								<span class="my-3 block text-2xl font-semibold">{plan.priceLabel}</span>
								<p class="text-sm text-muted-foreground">
									{plan.description ?? 'Perfect for Indie Hackers.'}
								</p>
							</div>

							<Button href={checkoutHref} class="w-full" variant={isHighlighted ? 'default' : 'outline'}>
								{proCtaLabel}
							</Button>

							<hr class="border-dashed" />

							<ul class="list-outside space-y-3 text-sm">
								{#each pricingList.pro as item}
									<li class="flex items-center gap-2">
										<Check class="size-3" />
										{item}
									</li>
								{/each}
							</ul>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<!-- Single plan or no plan: original Free | Pro two-column layout -->
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

						<Button href="/register" variant="outline" class="w-full">Get Started</Button>

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
								<h2 class="font-medium">{singlePlan?.name ?? 'Pro'}</h2>
								<span class="my-3 block text-2xl font-semibold">{singlePlan?.priceLabel ?? '$99'}</span>
								<p class="text-sm text-muted-foreground">
									{singlePlan?.description ?? 'Perfect for Indie Hackers.'}
								</p>
							</div>

							<Button
								href={singlePlan ? `/api/checkout?product=${encodeURIComponent(singlePlan.id)}` : '/register'}
								class="w-full"
							>
								{proCtaLabel}
							</Button>
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
		{/if}
	</div>
</section>
