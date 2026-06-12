import { fail, type Actions } from '@sveltejs/kit';
import { getPostHogClient } from '$lib/server/posthog';
import type { User } from '$lib/types';

export const actions: Actions = {
	loginWithGoogle: async ({ request, locals }) => {
		const formData = await request.formData();
		const token = formData.get('token')?.toString();
		const recordStr = formData.get('record')?.toString();

		if (!token || !recordStr) {
			return fail(400, { error: 'Missing auth data' });
		}

		try {
			const record = JSON.parse(recordStr) as User;
			locals.pb.authStore.save(token, record);

			if (!locals.pb.authStore.isValid) {
				locals.pb.authStore.clear();
				return fail(400, { error: 'Invalid auth token' });
			}

			const posthog = getPostHogClient();
			posthog.capture({
				distinctId: record.email,
				event: 'user_logged_in',
				properties: { email: record.email, method: 'google' }
			});

			return { success: true };
		} catch (err) {
			if (err instanceof SyntaxError) {
				return fail(400, { error: 'Invalid record data' });
			}
			throw err;
		}
	}
};
