import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { UpdateNameSchema } from '$lib/schemas';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms';
import { ClientResponseError } from 'pocketbase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	if (!locals.pb.authStore.isValid) {
		redirect(303, '/login');
	}

	return {
		form: await superValidate(locals.user, zod(UpdateNameSchema))
	};
};

export const actions: Actions = {
	updateName: async ({ request, locals }) => {
		if (!locals.pb.authStore.isValid || !locals.user) {
			throw error(401, 'Unauthorized');
		}

		const formData = await request.formData();
		const form = await superValidate(formData, zod(UpdateNameSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await locals.pb.collection('users').update(locals.user?.id, { name: form.data.name });
			return { form };
		} catch (err) {
			if (err instanceof ClientResponseError) {
				// eslint-disable-next-line no-console
				console.error('PB error: ', err);
				if (err.response.data.name) {
					return setError(form, 'name', err.response.data.name.message);
				}
			} else {
				// eslint-disable-next-line no-console
				console.error('Unexpected error:', err);
			}

			return fail(400, { form });
		}
	}
};
