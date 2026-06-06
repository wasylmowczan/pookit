import type { PageServerLoad } from './$types';
import { config } from '$lib/config-server';
import { getPolarClient } from '$lib/server/polar';

export type ProPlan = {
	id: string;
	name: string;
	priceLabel: string;
	description: string | null;
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

async function fetchProPlan(id: string | null): Promise<ProPlan | null> {
	if (!id || !config.polarAccessToken) return null;
	try {
		const polar = getPolarClient();
		const product = await polar.products.get({ id });
		const firstPrice = product.prices?.[0];
		const amountType = (firstPrice as { amountType?: string } | undefined)?.amountType;
		const priceAmount =
			amountType === 'fixed'
				? ((firstPrice as { priceAmount?: number }).priceAmount ?? null)
				: null;
		const priceCurrency =
			(firstPrice as { priceCurrency?: string } | undefined)?.priceCurrency ?? null;

		let priceLabel: string;
		if (amountType === 'free') priceLabel = 'Free';
		else if (amountType === 'custom') priceLabel = 'Pay what you want';
		else
			priceLabel = buildPriceLabel(priceAmount, priceCurrency, product.recurringInterval ?? null);

		return {
			id: product.id,
			name: product.name,
			priceLabel,
			description: product.description ?? null
		};
	} catch (err) {
		console.error('[polar] Failed to load Pro product:', err);
		return null;
	}
}

export const load: PageServerLoad = async ({ locals }) => {
	// First product in POLAR_PRO_PRODUCT_IDS is used as the Pro plan CTA target.
	const proProductId = config.polarProProductIds[0] ?? null;
	const proPlan = await fetchProPlan(proProductId);
	return { user: locals.user, proProductId, proPlan };
};
