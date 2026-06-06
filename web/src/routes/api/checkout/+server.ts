import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getPolarClient } from '$lib/server/polar';
import { config } from '$lib/config-server';

// GET /api/checkout?product=<polar_product_id>
// Creates a Polar Checkout session for the logged-in user and redirects to it.
// Webhook events fired later include `customer.external_id = user.id`, which is
// how we link the resulting subscription/order back to the PocketBase user.
export const GET: RequestHandler = async ({ url, locals }) => {
	const productId = url.searchParams.get('product');

	if (!productId) {
		return new Response('Missing `product` query parameter', { status: 400 });
	}

	if (!locals.user) {
		const next = encodeURIComponent(url.pathname + url.search);
		redirect(303, `/login?redirect=${next}`);
	}

	if (!config.polarAccessToken) {
		console.error('[polar] POLAR_ACCESS_TOKEN is not set');
		return new Response('Polar is not configured', { status: 500 });
	}

	let checkoutUrl: string;
	try {
		const polar = getPolarClient();
		const checkout = await polar.checkouts.create({
			products: [productId],
			successUrl: `${url.origin}/billing?checkout_id={CHECKOUT_ID}`,
			externalCustomerId: locals.user.id,
			customerEmail: locals.user.email,
			customerName: locals.user.name || locals.user.username || undefined
		});
		checkoutUrl = checkout.url;
	} catch (err) {
		console.error('[polar] Failed to create checkout:', err);
		return new Response('Failed to create checkout session', { status: 500 });
	}

	redirect(303, checkoutUrl);
};
