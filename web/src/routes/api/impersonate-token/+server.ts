import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { requireSuperuserClient } from '$lib/server/pocketbase-superuser';
import { ClientResponseError } from 'pocketbase';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const { userId } = await request.json();
		if (!userId) {
			return json({ error: 'User ID is required' }, { status: 400 });
		}
		const superuserPb = await requireSuperuserClient(locals.user);
		const impersonatedPb = await superuserPb.collection('users').impersonate(userId, 3600);
		return json({
			token: impersonatedPb.authStore.token,
			record: impersonatedPb.authStore.record
		});
	} catch (err) {
		if (err instanceof ClientResponseError) {
			return json({ error: err.message }, { status: err.status || 500 });
		}
		return json({ error: 'Failed to impersonate user' }, { status: 500 });
	}
};
