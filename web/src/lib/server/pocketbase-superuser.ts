import { error } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { config as configClient } from '$lib/config-client';
import { config as configServer } from '$lib/config-server';
import type { User } from '$lib/types';

export const isAdminUser = (user: User | null | undefined): boolean => {
	if (!user) return false;
	return Boolean(configServer.superAdminEmail) && user.email === configServer.superAdminEmail;
};

let _superuserPb: PocketBase | null = null;

export const getSuperuserClient = async (): Promise<PocketBase> => {
	if (!configServer.superAdminEmail || !configServer.superAdminPassword) {
		throw error(500, 'PocketBase superuser credentials are not configured.');
	}

	if (_superuserPb?.authStore.isValid) {
		return _superuserPb;
	}

	_superuserPb = new PocketBase(configClient.pbUrl);

	await _superuserPb
		.collection('_superusers')
		.authWithPassword(configServer.superAdminEmail, configServer.superAdminPassword);

	return _superuserPb;
};

export const requireSuperuserClient = async (
	user: User | null | undefined
): Promise<PocketBase> => {
	if (!isAdminUser(user)) {
		throw error(403, 'Forbidden');
	}

	return getSuperuserClient();
};
