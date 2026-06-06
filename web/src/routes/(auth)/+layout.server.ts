import { redirect } from '@sveltejs/kit';
import { safeRedirect } from '$lib/utils';

export const load = ({ locals, url }) => {
	const target = safeRedirect(url.searchParams.get('redirect'));

	if (locals.pb.authStore.isValid) {
		redirect(303, target);
	}

	// Expose the (sanitised) redirect target to auth pages so they can forward
	// it to login/register actions and inter-page links.
	return { redirectTo: target };
};
