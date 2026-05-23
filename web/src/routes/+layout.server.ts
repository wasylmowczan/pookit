import type { LayoutServerLoad } from './$types';
import { config } from '$lib/config-server';

export const load = (async () => {
	return {
		posthogApiKey: config.posthogApiKey,
		posthogApiHost: config.posthogApiHost
	};
}) satisfies LayoutServerLoad;
