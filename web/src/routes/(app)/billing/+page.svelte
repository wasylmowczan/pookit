<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import Check from '@lucide/svelte/icons/check';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';

	let { data } = $props();

	const sub = $derived(data.activeSubscription as Record<string, unknown> | undefined);
	const order = $derived(data.latestPaidOrder as Record<string, unknown> | null);
	const purchasedIds = $derived(new Set(data.purchasedProductIds));

	// For display: subscription takes priority over one-time order.
	const activePlan = $derived(sub ?? order ?? null);
	const isSubscription = $derived(!!sub);

	const activeProductId = $derived(
		sub ? String(sub.product_id ?? '') : order ? String(order.product_id ?? '') : null
	);

	function formatAmount(amount: unknown, currency: unknown): string {
		const n = typeof amount === 'number' ? amount : Number(amount ?? 0);
		const cur = typeof currency === 'string' && currency ? currency.toUpperCase() : 'USD';
		if (!Number.isFinite(n)) return '—';
		try {
			return new Intl.NumberFormat(undefined, { style: 'currency', currency: cur }).format(n / 100);
		} catch {
			return `${(n / 100).toFixed(2)} ${cur}`;
		}
	}

	function formatDate(value: unknown): string {
		if (!value) return '—';
		const d = new Date(value as string);
		return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
	}

	// Try to parse a multi-line description into a feature list.
	// Recognises markdown-style bullets ("- foo", "* foo") and falls back to
	// non-empty lines when no bullets are present.
	function descriptionToFeatures(desc: string | null | undefined): string[] {
		if (!desc) return [];
		const lines = desc
			.split(/\r?\n/)
			.map((l) => l.trim())
			.filter(Boolean);
		const bulletLines = lines
			.filter((l) => /^[-*•]\s+/.test(l))
			.map((l) => l.replace(/^[-*•]\s+/, ''));
		if (bulletLines.length > 0) return bulletLines;
		// If no bullets, only treat as a feature list when there are short, distinct lines.
		if (lines.length > 1 && lines.every((l) => l.length < 80)) return lines;
		return [];
	}

	const productCount = $derived(data.products.length);
	const isSingle = $derived(productCount === 1);
</script>

<div class="w-full px-6 py-8 space-y-10">
	<header class="space-y-1">
		<h1 class="text-2xl font-semibold tracking-tight">Billing</h1>
		<p class="text-sm text-muted-foreground">Manage your subscription and billing information.</p>
	</header>

	<hr class="border-border" />

	<!-- Current plan summary -->
	<section class="space-y-3">
		<h2 class="text-base font-semibold">Current plan</h2>
		<Card>
			<CardContent class="py-4">
				{#if activePlan}
					<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
						<div class="space-y-3">
							<div class="flex items-center gap-2">
								<span class="font-semibold">{activePlan.product_name || 'Pro'}</span>
								{#if isSubscription}
									<Badge variant="default">{String(sub!.status)}</Badge>
									{#if sub!.cancel_at_period_end}
										<Badge variant="outline">Cancels at period end</Badge>
									{/if}
								{:else}
									<Badge variant="default">Purchased</Badge>
								{/if}
							</div>

							{#if isSubscription}
								<dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
									<dt class="text-muted-foreground">Price</dt>
									<dd class="font-medium">
										{formatAmount(sub!.amount, sub!.currency)} / {String(sub!.recurring_interval ?? 'month')}
									</dd>

									{#if sub!.current_period_start || sub!.current_period_end}
										<dt class="text-muted-foreground">Current period</dt>
										<dd class="font-medium">
											{#if sub!.current_period_start}
												{formatDate(sub!.current_period_start)} →
											{/if}
											{#if sub!.current_period_end}
												{formatDate(sub!.current_period_end)}
											{/if}
										</dd>
									{/if}

									{#if sub!.current_period_end && !sub!.cancel_at_period_end}
										<dt class="text-muted-foreground">Next payment</dt>
										<dd class="font-medium">
											{formatAmount(sub!.amount, sub!.currency)} on {formatDate(sub!.current_period_end)}
										</dd>
									{/if}
								</dl>
							{:else}
								<p class="text-sm text-muted-foreground">
									{formatAmount(order!.amount, order!.currency)} · One-time purchase
								</p>
							{/if}
						</div>
						<Button href="/api/portal" variant="outline" class="shrink-0">Manage billing</Button>
					</div>
				{:else}
					<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<div class="font-semibold">No active plan</div>
							<p class="text-sm text-muted-foreground">
								You're on the free tier — upgrade any time below.
							</p>
						</div>
					</div>
				{/if}
			</CardContent>
		</Card>
	</section>

	<!-- Available plans -->
	<section class="space-y-3">
		<div class="flex items-end justify-between gap-4">
			<div>
				<h2 class="text-base font-semibold">Available plans</h2>
				<p class="text-sm text-muted-foreground">Pick the plan that fits your needs.</p>
			</div>
		</div>

		{#if productCount === 0}
			<Card>
				<CardContent class="py-6 text-sm text-muted-foreground">
					No products found. Create products in your <a
						href="https://polar.sh"
						class="underline"
						target="_blank"
						rel="noreferrer">Polar dashboard</a
					>
					and make sure <code>POLAR_ACCESS_TOKEN</code> is set.
				</CardContent>
			</Card>
		{:else if isSingle}
			<!-- Hero card for a single product -->
			{@const product = data.products[0]}
			{@const isCurrent = activeProductId === product.id || purchasedIds.has(product.id)}
			{@const features = descriptionToFeatures(product.description)}
			{@const checkoutHref = `/api/checkout?product=${encodeURIComponent(product.id)}`}

			<div class="w-full max-w-2xl">
				<Card class="relative overflow-hidden">
					<!-- Decorative gradient blob -->
					<div
						class="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
						aria-hidden="true"
					></div>

					<CardHeader class="relative">
						<div class="flex items-start justify-between gap-4">
							<div class="space-y-2">
								<div class="flex items-center gap-2">
									<Sparkles class="size-4 text-primary" />
									<span class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
										{product.recurringInterval ? 'Subscription' : 'One-time'}
									</span>
								</div>
								<CardTitle class="text-2xl">{product.name}</CardTitle>
							</div>
							{#if isCurrent}
								<Badge variant="default">Current plan</Badge>
							{/if}
						</div>

						<div class="flex items-baseline gap-2 pt-4">
							{#if product.priceAmount != null}
								<span class="text-5xl font-bold tracking-tight">
									{formatAmount(product.priceAmount, product.priceCurrency)}
								</span>
								{#if product.recurringInterval}
									<span class="text-base text-muted-foreground">/ {product.recurringInterval}</span>
								{/if}
							{:else}
								<span class="text-3xl font-bold tracking-tight">{product.priceLabel}</span>
							{/if}
						</div>
					</CardHeader>

					<CardContent class="relative space-y-6">
						{#if features.length > 0}
							<ul class="grid gap-3 sm:grid-cols-2">
								{#each features as feature}
									<li class="flex items-start gap-2 text-sm">
										<Check class="mt-0.5 size-4 shrink-0 text-primary" />
										<span>{feature}</span>
									</li>
								{/each}
							</ul>
						{:else if product.description}
							<p class="text-sm text-muted-foreground whitespace-pre-line">
								{product.description}
							</p>
						{/if}

						{#if isCurrent}
							<Button class="w-full" size="lg" disabled>You're on this plan</Button>
						{:else if sub && product.recurringInterval}
							<Button class="w-full" size="lg" href="/api/portal" variant="outline">
								Switch plan
							</Button>
						{:else if product.isCustom}
							<Button class="w-full" size="lg" href={checkoutHref}>
								Choose amount
								<ArrowRight class="ml-2 size-4" />
							</Button>
						{:else if product.isFree}
							<Button class="w-full" size="lg" disabled>Default plan</Button>
						{:else}
							<Button class="w-full" size="lg" href={checkoutHref}>
								Get {product.name}
								<ArrowRight class="ml-2 size-4" />
							</Button>
						{/if}

						<p class="text-center text-xs text-muted-foreground">
							Secure checkout powered by Polar · Cancel any time
						</p>
					</CardContent>
				</Card>
			</div>
		{:else}
			<!-- Multi-product grid -->
			<div
				class="grid gap-4 pt-4"
				class:md:grid-cols-2={productCount === 2}
				class:lg:grid-cols-3={productCount >= 3}
			>
				{#each data.products as product, i (product.id)}
					{@const isCurrent = activeProductId === product.id || purchasedIds.has(product.id)}
					{@const features = descriptionToFeatures(product.description)}
					{@const checkoutHref = `/api/checkout?product=${encodeURIComponent(product.id)}`}
					{@const isHighlighted = !isCurrent && productCount >= 2 && i === productCount - 1}

					<Card class={isHighlighted ? 'border-primary shadow-lg relative overflow-visible' : 'relative'}>
						{#if isHighlighted}
							<div class="absolute -top-3 left-1/2 -translate-x-1/2">
								<Badge variant="default" class="px-3 py-0.5 text-xs shadow-sm">Most popular</Badge>
							</div>
						{/if}

						<CardHeader>
							<CardTitle class="flex items-center justify-between gap-2">
								<span>{product.name}</span>
								{#if isCurrent}
									<Badge variant="default">Current</Badge>
								{/if}
							</CardTitle>
							<div class="flex items-baseline gap-1 pt-2">
								{#if product.priceAmount != null}
									<span class="text-4xl font-bold tracking-tight">
										{formatAmount(product.priceAmount, product.priceCurrency)}
									</span>
									{#if product.recurringInterval}
										<span class="text-sm text-muted-foreground">/ {product.recurringInterval}</span>
									{/if}
								{:else}
									<span class="text-3xl font-bold tracking-tight">{product.priceLabel}</span>
								{/if}
							</div>
						</CardHeader>

						<CardContent class="space-y-5">
							{#if features.length > 0}
								<ul class="space-y-2">
									{#each features as feature}
										<li class="flex items-start gap-2 text-sm">
											<Check class="mt-0.5 size-4 shrink-0 text-primary" />
											<span>{feature}</span>
										</li>
									{/each}
								</ul>
							{:else if product.description}
								<p class="text-sm text-muted-foreground whitespace-pre-line">
									{product.description}
								</p>
							{/if}

							{#if isCurrent}
								<Button class="w-full" disabled>Current plan</Button>
							{:else if sub && product.recurringInterval}
								<Button class="w-full" href="/api/portal" variant="outline">Switch plan</Button>
							{:else if product.isCustom}
								<Button class="w-full" href={checkoutHref}>Choose amount</Button>
							{:else if product.isFree}
								<Button class="w-full" disabled>Default</Button>
							{:else}
								<Button
									class="w-full"
									href={checkoutHref}
									variant={isHighlighted ? 'default' : 'outline'}
								>
									{product.recurringInterval ? 'Subscribe' : 'Get ' + product.name}
								</Button>
							{/if}
						</CardContent>
					</Card>
				{/each}
			</div>
		{/if}
	</section>

	{#if data.orders.length > 0}
		<section class="space-y-3">
			<h2 class="text-base font-semibold">Order history</h2>
			<Card>
				<CardContent class="py-0">
					<ul class="divide-y">
						{#each data.orders as order (order.id)}
							<li class="py-3 flex items-center justify-between text-sm">
								<div>
									<div class="font-medium">{order.product_name || 'Order'}</div>
									<div class="text-muted-foreground text-xs">{formatDate(order.created)}</div>
								</div>
								<div class="flex items-center gap-3">
									<span>{formatAmount(order.amount, order.currency)}</span>
									<Badge variant={order.status === 'paid' ? 'default' : 'outline'}>
										{String(order.status)}
									</Badge>
								</div>
							</li>
						{/each}
					</ul>
				</CardContent>
			</Card>
		</section>
	{/if}
</div>
