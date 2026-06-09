import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, cookies }) => {
	const backup = cookies.get('pb_admin_backup');

	if (backup) {
		try {
			const { token, record } = JSON.parse(backup);
			locals.pb.authStore.save(token, record);
		} catch {
			locals.pb.authStore.clear();
		}
		cookies.delete('pb_admin_backup', { path: '/' });
	} else {
		locals.pb.authStore.clear();
	}

	return new Response(null, {
		status: 303,
		headers: { Location: '/admin/users' }
	});
};
