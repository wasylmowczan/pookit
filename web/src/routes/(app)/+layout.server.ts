import { redirect } from '@sveltejs/kit';
import { isAdminUser, getSuperuserClient } from '$lib/server/pocketbase-superuser';

export const load = async ({ locals, cookies }) => {
	if (!locals.pb.authStore.isValid || !locals.user) {
		redirect(303, '/login');
	}

	let activeBan: { reason: string; expires: string | null } | null = null;

	// Skip ban check for the superadmin
	if (!isAdminUser(locals.user)) {
		try {
			const superuserPb = await getSuperuserClient();
			const freshUser = await superuserPb.collection('users').getOne(locals.user.id);

			if (freshUser.banned === true) {
				const banExpires = freshUser.ban_expires ? new Date(freshUser.ban_expires) : null;
				const banExpired = banExpires !== null && banExpires < new Date();

				if (banExpired) {
					// Auto-lift expired bans
					await superuserPb.collection('users').update(locals.user.id, {
						banned: false,
						ban_reason: '',
						ban_expires: null
					});
				} else {
					activeBan = {
						reason: freshUser.ban_reason || 'No reason provided.',
						expires: freshUser.ban_expires || null
					};
				}
			}
		} catch {
			// If superuser client is not configured, skip ban check
		}
	}

	return {
		user: locals.user,
		isAdmin: isAdminUser(locals.user),
		activeBan,
		isImpersonating: !!cookies.get('pb_admin_backup')
	};
};
