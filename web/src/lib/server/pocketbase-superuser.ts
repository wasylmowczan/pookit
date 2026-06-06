import { error } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { config as configClient } from '$lib/config-client';
import { config as configServer } from '$lib/config-server';
import type { User } from '$lib/types';

export const isAdminUser = (user: User | null | undefined): boolean => {
	if (!user) return false;
	return Boolean(configServer.superAdminEmail) && user.email === configServer.superAdminEmail;
};

// Cached superuser client — reused across requests until token expires.
// _pendingAuth deduplicates concurrent re-auth attempts (prevents 429 on rapid navigation).
let _superuserClient: PocketBase | null = null;
let _pendingAuth: Promise<PocketBase> | null = null;

export const getSuperuserClient = async (): Promise<PocketBase> => {
	if (!configServer.superAdminEmail || !configServer.superAdminPassword) {
		throw error(500, 'PocketBase superuser credentials are not configured.');
	}

	if (_superuserClient?.authStore.isValid) {
		return _superuserClient;
	}

	// If another request is already authenticating, wait for it instead of making a second call.
	if (_pendingAuth) {
		return _pendingAuth;
	}

	_pendingAuth = (async () => {
		try {
			const pb = new PocketBase(configClient.pbUrl);
			await pb
				.collection('_superusers')
				.authWithPassword(configServer.superAdminEmail!, configServer.superAdminPassword!);
			_superuserClient = pb;
			return pb;
		} catch (err) {
			console.error('[getSuperuserClient] re-auth failed:', err);
			throw err;
		} finally {
			_pendingAuth = null;
		}
	})();

	return _pendingAuth;
};

export const requireSuperuserClient = async (
	user: User | null | undefined
): Promise<PocketBase> => {
	if (!isAdminUser(user)) {
		throw error(403, 'Forbidden');
	}

	return getSuperuserClient();
};
