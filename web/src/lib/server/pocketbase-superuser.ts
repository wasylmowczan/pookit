import { error } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { config as configClient } from '$lib/config-client';
import { config as configServer } from '$lib/config-server';
import type { User } from '$lib/types';

export const isAdminUser = (user: User | null | undefined): boolean => {
	if (!user) return false;
	return Boolean(configServer.superAdminEmail) && user.email === configServer.superAdminEmail;
};

// Cache only the token string — plain value, safe to share across CF Workers requests.
// A full PocketBase instance holds internal I/O refs tied to one request and cannot be reused.
let _cachedToken: string | null = null;
let _pendingAuth: Promise<string> | null = null;

export const getSuperuserClient = async (): Promise<PocketBase> => {
	if (!configServer.superAdminEmail || !configServer.superAdminPassword) {
		throw error(500, 'PocketBase superuser credentials are not configured.');
	}

	// Always create a fresh PocketBase instance per request (CF Workers I/O isolation)
	const pb = new PocketBase(configClient.pbUrl);

	if (_cachedToken) {
		pb.authStore.save(_cachedToken, null);
		if (pb.authStore.isValid) {
			return pb;
		}
		_cachedToken = null;
	}

	// Deduplicate concurrent re-auth attempts
	if (!_pendingAuth) {
		_pendingAuth = (async () => {
			try {
				const authPb = new PocketBase(configClient.pbUrl);
				await authPb
					.collection('_superusers')
					.authWithPassword(configServer.superAdminEmail!, configServer.superAdminPassword!);
				_cachedToken = authPb.authStore.token;
				return _cachedToken;
			} finally {
				_pendingAuth = null;
			}
		})();
	}

	const token = await _pendingAuth;
	pb.authStore.save(token, null);
	return pb;
};

export const requireSuperuserClient = async (
	user: User | null | undefined
): Promise<PocketBase> => {
	if (!isAdminUser(user)) {
		throw error(403, 'Forbidden');
	}

	return getSuperuserClient();
};
