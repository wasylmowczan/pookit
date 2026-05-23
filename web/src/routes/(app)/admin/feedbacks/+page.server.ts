import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const data =
		(await locals.pb.collection('feedback').getFullList({
			sort: '-created'
		})) || [];

	return {
		data
	};
};
