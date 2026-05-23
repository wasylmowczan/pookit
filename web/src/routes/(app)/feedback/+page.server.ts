import type { PageServerLoad } from './$types';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms';
import { error, fail, type Actions } from '@sveltejs/kit';
import { feedbackSchema } from '$lib/schemas';
import { ClientResponseError } from 'pocketbase';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		form: await superValidate(zod(feedbackSchema))
	};
};

export const actions: Actions = {
	submit: async ({ request, locals }) => {
		if (!locals.pb.authStore.isValid || !locals.user) {
			throw error(401, 'Unauthorized');
		}
		const formData = await request.formData();
		const form = await superValidate(formData, zod(feedbackSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await locals.pb.collection('feedback').create({
				name: locals.user.id,
				feedback: form.data.feedback + ' - email: ' + form.data.email + ' - name: ' + form.data.name
			});
			return { form };
		} catch (err) {
			if (err instanceof ClientResponseError) {
				// eslint-disable-next-line no-console
				console.error('PB error: ', err);
				if (err.response?.data?.feedback) {
					return setError(form, 'feedback', err.response.data.feedback.message);
				}
			} else {
				// eslint-disable-next-line no-console
				console.error('Unexpected error:', err);
			}
			return fail(400, { form });
		}
	}
};
