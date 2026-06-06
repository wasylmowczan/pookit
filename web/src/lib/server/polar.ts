import { Polar } from '@polar-sh/sdk';
import { config } from '$lib/config-server';

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
