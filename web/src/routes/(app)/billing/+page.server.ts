import type { PageServerLoad } from './$types';
import { getPolarClient, buildPriceLabel } from '$lib/server/polar';
import { config } from '$lib/config-server';

export type DisplayProduct = {
	id: string;
	name: string;
	description: string | null;
	priceAmount: number | null; // minor units (cents); null for free/custom
	priceCurrency: string | null;
	recurringInterval: string | null;
	priceLabel: string;
	isFree: boolean;
	isCustom: boolean;
};


async function fetchPolarProducts(): Promise<DisplayProduct[]> {
	if (!config.polarAccessToken) return [];

	try {
		const polar = getPolarClient();
		const result = await polar.products.list({ isArchived: false });

		const products: DisplayProduct[] = [];
		for await (const page of result) {
			for (const p of page.result.items) {
				const firstPrice = p.prices?.[0];
				// Narrow across the price union (fixed | free | custom | metered | seat-based).
				const amountType = (firstPrice as { amountType?: string } | undefined)?.amountType;
				const priceAmount =
					amountType === 'fixed'
						? ((firstPrice as { priceAmount?: number }).priceAmount ?? null)
						: null;
				const priceCurrency =
					(firstPrice as { priceCurrency?: string } | undefined)?.priceCurrency ?? null;
				const isFree = amountType === 'free';
				const isCustom = amountType === 'custom';

				products.push({
					id: p.id,
					name: p.name,
					description: p.description,
					priceAmount,
					priceCurrency,
					recurringInterval: p.recurringInterval ?? null,
					priceLabel: buildPriceLabel(
						priceAmount,
						priceCurrency,
						p.recurringInterval ?? null,
						isFree,
						isCustom
					),
					isFree,
					isCustom
				});
			}
		}

		// Free first, then ascending by price, then alphabetical.
		products.sort((a, b) => {
			if (a.isFree && !b.isFree) return -1;
			if (b.isFree && !a.isFree) return 1;
			const aAmt = a.priceAmount ?? Number.POSITIVE_INFINITY;
			const bAmt = b.priceAmount ?? Number.POSITIVE_INFINITY;
			if (aAmt !== bAmt) return aAmt - bAmt;
			return a.name.localeCompare(b.name);
		});

		return products;
	} catch (err) {
		console.error('[polar] Failed to list products:', err);
		return [];
	}
}

export const load: PageServerLoad = async ({ locals }) => {
	const pb = locals.pb;

	const [subscriptions, orders, products] = await Promise.all([
		pb
			.collection('subscriptions')
			.getFullList({ filter: `user = "${locals.user!.id}"`, sort: '-created' })
			.catch(() => [] as Array<Record<string, unknown>>),
		pb
			.collection('orders')
			.getFullList({ filter: `user = "${locals.user!.id}"`, sort: '-created' })
			.catch(() => [] as Array<Record<string, unknown>>),
		fetchPolarProducts()
	]);

	const activeSubscription = subscriptions.find(
		(s) => s.status === 'active' || s.status === 'trialing'
	);

	// For one-time products there's no subscription — treat the most recent
	// paid order as the active "plan" when no subscription exists.
	// Only consider orders that are NOT subscription renewals (subscription_id is empty).
	const oneTimeOrders = orders.filter((o) => o.status === 'paid' && !o.subscription_id);
	const latestPaidOrder = oneTimeOrders[0] ?? null;

	// Set of product IDs the user has already paid for (one-time purchases only).
	const purchasedProductIds = new Set(oneTimeOrders.map((o) => String(o.product_id)));

	return {
		subscriptions,
		orders,
		activeSubscription,
		latestPaidOrder,
		purchasedProductIds: [...purchasedProductIds],
		products
	};
};
