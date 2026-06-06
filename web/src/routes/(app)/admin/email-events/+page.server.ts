import type { PageServerLoad } from './$types';
import { requireSuperuserClient } from '$lib/server/pocketbase-superuser';
import { ClientResponseError } from 'pocketbase';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	try {
		const superuserPb = await requireSuperuserClient(locals.user);
		const data = await superuserPb.collection('email_events').getFullList({
			sort: '-id'
		});
		return { data };
	} catch (err) {
		if (err instanceof ClientResponseError) {
			throw error(err.status || 500, err.message);
		}
		throw err;
	}
};
