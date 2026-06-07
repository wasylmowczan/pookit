import { Polar } from '@polar-sh/sdk';
import { config } from '$lib/config-server';

export function buildPriceLabel(
	amount: number | null,
	currency: string | null,
	interval: string | null,
	isFree = false,
	isCustom = false
): string {
	if (isFree) return 'Free';
	if (isCustom) return 'Pay what you want';
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

// Single Polar SDK instance per Worker isolate. Safe — it holds only an access
// token + fetch client (no per-request I/O state).
let _polar: Polar | null = null;

export const getPolarClient = (): Polar => {
	if (!config.polarAccessToken) {
		throw new Error('POLAR_ACCESS_TOKEN is not configured');
	}
	if (!_polar) {
		_polar = new Polar({
			accessToken: config.polarAccessToken,
			server: config.polarServer
		});
	}
	return _polar;
};
