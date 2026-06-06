import type { PageServerLoad } from './$types';
import { config } from '$lib/config-server';

export const load: PageServerLoad = ({ locals }) => {
	// First product in POLAR_PRO_PRODUCT_IDS is used as the Pro plan CTA target.
	const proProductId = config.polarProProductIds[0] ?? null;
	return { user: locals.user, proProductId };
};
