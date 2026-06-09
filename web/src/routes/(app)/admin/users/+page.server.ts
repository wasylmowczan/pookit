import type { PageServerLoad } from './$types';
import { requireSuperuserClient } from '$lib/server/pocketbase-superuser';
import { ClientResponseError } from 'pocketbase';
import { error, fail, type Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	try {
		const superuserPb = await requireSuperuserClient(locals.user);
		const data = await superuserPb.collection('users').getFullList({
			sort: '-created'
		});
		return { data };
	} catch (err) {
		if (err instanceof ClientResponseError) {
			throw error(err.status || 500, err.message);
		}
		throw err;
	}
};

export const actions: Actions = {
	banUser: async ({ request, locals }) => {
		const superuserPb = await requireSuperuserClient(locals.user);
		const formData = await request.formData();
		const userId = formData.get('userId') as string;
		const reason = formData.get('reason') as string;
		const expiresAtRaw = ((formData.get('expiresAt') as string) ?? '').trim();

		if (!userId || !reason?.trim()) {
			return fail(400, { message: 'User ID and reason are required' });
		}

		// datetime-local gives "YYYY-MM-DDTHH:MM"; PocketBase needs "YYYY-MM-DD HH:MM:SS.sssZ"
		let banExpires: string | null = null;
		if (expiresAtRaw) {
			banExpires = expiresAtRaw.replace('T', ' ') + ':00.000Z';
		}

		try {
			await superuserPb.collection('users').update(userId, {
				banned: true,
				ban_reason: reason.trim(),
				ban_expires: banExpires
			});
			return { success: true };
		} catch (err) {
			if (err instanceof ClientResponseError) {
				return fail(err.status || 500, { message: err.message });
			}
			return fail(500, { message: 'Failed to ban user' });
		}
	},

	deleteUser: async ({ request, locals }) => {
		const superuserPb = await requireSuperuserClient(locals.user);
		const formData = await request.formData();
		const userId = formData.get('userId') as string;

		if (!userId) {
			return fail(400, { message: 'User ID is required' });
		}

		try {
			await superuserPb.collection('users').delete(userId);
			return { success: true };
		} catch (err) {
			if (err instanceof ClientResponseError) {
				return fail(err.status || 500, { message: err.message });
			}
			return fail(500, { message: 'Failed to delete user' });
		}
	},

	liftBan: async ({ request, locals }) => {
		const superuserPb = await requireSuperuserClient(locals.user);
		const formData = await request.formData();
		const userId = formData.get('userId') as string;

		if (!userId) {
			return fail(400, { message: 'User ID is required' });
		}

		try {
			await superuserPb.collection('users').update(userId, {
				banned: false,
				ban_reason: '',
				ban_expires: null
			});
			return { success: true };
		} catch (err) {
			if (err instanceof ClientResponseError) {
				return fail(err.status || 500, { message: err.message });
			}
			return fail(500, { message: 'Failed to lift ban' });
		}
	}
};
