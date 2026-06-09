import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals, cookies }) => {
	const token = url.searchParams.get('token');
	const record = url.searchParams.get('record');

	if (!token) {
		return new Response('Missing token', { status: 400 });
	}

	// Back up the admin's current session so it can be restored on exit
	if (locals.pb.authStore.isValid) {
		cookies.set(
			'pb_admin_backup',
			JSON.stringify({ token: locals.pb.authStore.token, record: locals.pb.authStore.record }),
			{ path: '/', httpOnly: true, sameSite: 'lax', maxAge: 3600 }
		);
	}

	try {
		locals.pb.authStore.save(token, record ? JSON.parse(record) : undefined);
	} catch {
		return new Response('Invalid token data', { status: 400 });
	}

	return new Response(null, {
		status: 303,
		headers: { Location: '/dashboard' }
	});
};
