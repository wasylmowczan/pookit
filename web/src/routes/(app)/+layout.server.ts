import { redirect } from '@sveltejs/kit';
import { isAdminUser } from '$lib/server/pocketbase-superuser';

export const load = async ({ locals }) => {
	if (!locals.pb.authStore.isValid || !locals.user) {
		redirect(303, '/login');
	}

	return {
		user: locals.user,
		isAdmin: isAdminUser(locals.user)
	};
};
