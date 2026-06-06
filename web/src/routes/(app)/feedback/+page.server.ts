import type { PageServerLoad } from './$types';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms';
import { error, fail, type Actions } from '@sveltejs/kit';
import { feedbackSchema } from '$lib/schemas';
import { ClientResponseError } from 'pocketbase';
import { getSuperuserClient } from '$lib/server/pocketbase-superuser';
import { getPostHogClient } from '$lib/server/posthog';
import { sendEmail } from '$lib/server/resend';
import { feedbackConfirmationEmail } from '$lib/server/emails';

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
			const superuserPb = await getSuperuserClient();
			const record = await superuserPb.collection('feedback').create({
				name: form.data.name,
				email: form.data.email,
				feedback: form.data.feedback
			});

			const posthog = getPostHogClient();
			posthog.capture({
				distinctId: locals.user.email || locals.user.id,
				event: 'feedback_submitted'
			});

			const { subject, html } = feedbackConfirmationEmail({
				name: form.data.name,
				feedbackSnippet: form.data.feedback.slice(0, 200)
			});
			const emailResult = await sendEmail({
				to: form.data.email,
				subject,
				html,
				idempotencyKey: `feedback-confirmation/${record.id}`
			});
			if (!emailResult.success) {
				// eslint-disable-next-line no-console
				console.error('Failed to send feedback confirmation email:', emailResult.error);
			}

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
