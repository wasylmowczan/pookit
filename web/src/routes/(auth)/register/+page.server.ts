import { fail, redirect, type Actions } from '@sveltejs/kit';
import { RegisterUserSchema } from '$lib/schemas';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { ClientResponseError } from 'pocketbase';
import { getPostHogClient } from '$lib/server/posthog';
import type { User } from '$lib/types';

export const actions: Actions = {
	register: async ({ locals, request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(RegisterUserSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			formData.set('emailVisibility', 'true');
			await locals.pb.collection('users').create(formData);
			await locals.pb.collection('users').requestVerification(form.data.email);

			const posthog = getPostHogClient();
			posthog.capture({
				distinctId: form.data.email,
				event: 'user_signed_up',
				properties: { email: form.data.email }
			});
		} catch (err) {
			if (err instanceof ClientResponseError) {
				// eslint-disable-next-line no-console
				console.error('PB error: ', err);
				if (err.response.data.email) {
					setError(form, 'email', err.response.data.email.message);
				}
			} else {
				// eslint-disable-next-line no-console
				console.error('Unexpected error:', err);
			}

			return fail(400, { form });
		}

		redirect(303, `/login`);
	},

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
