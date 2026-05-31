import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getSuperuserClient, isAdminUser } from '$lib/server/pocketbase-superuser';

export const load: PageServerLoad = async ({ locals }) => {
	if (!isAdminUser(locals.user)) {
		throw error(403, 'Forbidden');
	}

	const superuserPb = await getSuperuserClient();

	const data =
		(await superuserPb.collection('users').getFullList({
			sort: '-created'
		})) || [];

	return {
		data
	};
};
