import type { PageServerLoad } from './$types';
import { config } from '$lib/config-server';
import { getPolarClient } from '$lib/server/polar';

export type ProPlan = {
	id: string;
	name: string;
	priceLabel: string;
	description: string | null;
	recurringInterval: string | null;
};

function buildPriceLabel(
	amount: number | null,
	currency: string | null,
	interval: string | null
): string {
	if (amount == null) return '—';
	const cur = (currency ?? 'USD').toUpperCase();
	let priceText: string;
	try {
		priceText = new Intl.NumberFormat(undefined, { style: 'currency', currency: cur }).format(
			amount / 100
		);
	} catch {
		priceText = `${(amount / 100).toFixed(2)} ${cur}`;
	}
	return interval ? `${priceText} / ${interval}` : priceText;
}

async function fetchAllProPlans(): Promise<ProPlan[]> {
	if (!config.polarAccessToken) return [];
	try {
		const polar = getPolarClient();
		const result = await polar.products.list({ isArchived: false });

		const plans: ProPlan[] = [];
		for await (const page of result) {
			for (const p of page.result.items) {
				const firstPrice = p.prices?.[0];
				const amountType = (firstPrice as { amountType?: string } | undefined)?.amountType;
				if (amountType === 'free') continue; // skip free products — we show the free tier manually

				const priceAmount =
					amountType === 'fixed'
						? ((firstPrice as { priceAmount?: number }).priceAmount ?? null)
						: null;
				const priceCurrency =
					(firstPrice as { priceCurrency?: string } | undefined)?.priceCurrency ?? null;

				let priceLabel: string;
				if (amountType === 'custom') priceLabel = 'Pay what you want';
				else priceLabel = buildPriceLabel(priceAmount, priceCurrency, p.recurringInterval ?? null);

				plans.push({
					id: p.id,
					name: p.name,
					priceLabel,
					description: p.description ?? null,
					recurringInterval: p.recurringInterval ?? null
				});
			}
		}

		// Sort: subscriptions first (ascending price), then one-time purchases (ascending price)
		plans.sort((a, b) => {
			const aIsRecurring = !!a.recurringInterval;
			const bIsRecurring = !!b.recurringInterval;
			if (aIsRecurring !== bIsRecurring) return aIsRecurring ? -1 : 1;
			return a.priceLabel.localeCompare(b.priceLabel);
		});

		return plans;
	} catch (err) {
		console.error('[polar] Failed to load products for pricing page:', err);
		return [];
	}
}

export const load: PageServerLoad = async ({ locals }) => {
	const proPlans = await fetchAllProPlans();
	return { user: locals.user, proPlans };
};
