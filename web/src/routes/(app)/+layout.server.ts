import { redirect } from '@sveltejs/kit';
import { isAdminUser } from '$lib/server/pocketbase-superuser';

export const load = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		redirect(303, `/login`);
	}

	if (locals.user) {
		return {
			user: locals.user,
			isAdmin: isAdminUser(locals.user)
		};
	}
	return {
		user: undefined,
		isAdmin: false
	};
};
