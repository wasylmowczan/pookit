import type { PageServerLoad } from './$types';
import { requireSuperuserClient } from '$lib/server/pocketbase-superuser';

export const load: PageServerLoad = async ({ locals }) => {
	const superuserPb = await requireSuperuserClient(locals.user);

	const data = await superuserPb.collection('users').getFullList({
		sort: '-created'
	});

	return { data };
};
