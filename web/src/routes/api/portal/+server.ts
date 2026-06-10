import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getPolarClient } from '$lib/server/polar';
import { config } from '$lib/config-server';

// GET /api/portal
// Creates a Polar Customer Portal session keyed by the PocketBase user id
// (passed to Polar as `externalCustomerId` during checkout).
export const GET: RequestHandler = async ({ url, locals }) => {
	if (!locals.user) {
		redirect(303, '/login?redirect=/billing');
	}

	if (!config.polarAccessToken) {
		console.error('[polar] POLAR_ACCESS_TOKEN is not set');
		return new Response('Polar is not configured', { status: 500 });
	}

	let portalUrl: string;
	try {
		const polar = getPolarClient();
		const session = await polar.customerSessions.create({
			externalCustomerId: locals.user.id,
			returnUrl: `${url.origin}/billing`
		});
		portalUrl = session.customerPortalUrl;

		if (session.customerId && !locals.user.polar_customer_id) {
			locals.pb
				.collection('users')
				.update(locals.user.id, { polar_customer_id: session.customerId })
				.catch((err) => console.warn('[polar] Failed to cache polar_customer_id on portal:', err));
		}
	} catch (err) {
		// Most common cause: user hasn't checked out yet, so Polar has no customer for them.
		console.error('[polar] Failed to create customer portal session:', err);
		redirect(303, '/billing?error=no_customer');
	}

	redirect(303, portalUrl);
};
