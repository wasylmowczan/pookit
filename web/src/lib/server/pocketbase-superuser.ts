import { error } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { config as configClient } from '$lib/config-client';
import { config as configServer } from '$lib/config-server';
import type { User } from '$lib/types';

export const isAdminUser = (user: User | null | undefined): boolean => {
	if (!user) {
		return false;
	}

	const isConfiguredAdmin =
		Boolean(configServer.superAdminEmail) && user.email === configServer.superAdminEmail;
	const hasAdminName = user.name?.toLowerCase().includes('superadmin') ?? false;

	return isConfiguredAdmin || hasAdminName;
};

export const getSuperuserClient = async (): Promise<PocketBase> => {
	if (!configServer.superAdminEmail || !configServer.superAdminPassword) {
		throw error(500, 'PocketBase superuser credentials are not configured.');
	}

	const pb = new PocketBase(configClient.pbUrl);

	await pb
		.collection('_superusers')
		.authWithPassword(configServer.superAdminEmail, configServer.superAdminPassword);

	return pb;
};
