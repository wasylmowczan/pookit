import type { PageServerLoad } from './$types';
import { requireSuperuserClient } from '$lib/server/pocketbase-superuser';
import { ClientResponseError } from 'pocketbase';
import { error, fail, type Actions } from '@sveltejs/kit';
import { sendEmail } from '$lib/server/resend';
import { feedbackResponseEmail } from '$lib/server/emails';

export const load: PageServerLoad = async ({ locals }) => {
	try {
		const superuserPb = await requireSuperuserClient(locals.user);
		const data = await superuserPb.collection('feedback').getFullList({
			sort: '-created'
		});
		return { data };
	} catch (err) {
		if (err instanceof ClientResponseError) {
			throw error(err.status || 500, err.message);
		}
		throw err;
	}
};

export const actions: Actions = {
	respond: async ({ request, locals }) => {
		const superuserPb = await requireSuperuserClient(locals.user);

		const formData = await request.formData();
		const feedbackId = formData.get('feedbackId')?.toString().trim();
		const responseMessage = formData.get('responseMessage')?.toString().trim();

		if (!feedbackId || !responseMessage) {
			return fail(400, { message: 'Feedback ID and response message are required.' });
		}

		let feedbackRecord: any;
		try {
			feedbackRecord = await superuserPb.collection('feedback').getOne(feedbackId);
		} catch (err) {
			if (err instanceof ClientResponseError) {
				return fail(err.status || 500, { message: err.message });
			}
			throw err;
		}

		const { subject, html } = feedbackResponseEmail({
			name: feedbackRecord.name,
			responseMessage,
			feedbackSnippet: feedbackRecord.feedback?.slice(0, 200)
		});

		const emailResult = await sendEmail({
			to: feedbackRecord.email,
			subject,
			html
		});

		if (!emailResult.success) {
			return fail(500, { message: `Failed to send email: ${emailResult.error}` });
		}

		try {
			await superuserPb.collection('feedback').update(feedbackId, {
				responded: true,
				responded_at: new Date().toISOString()
			});
		} catch (err) {
			if (err instanceof ClientResponseError) {
				return fail(err.status || 500, { message: err.message });
			}
			throw err;
		}

		return { success: true };
	},

	markResponded: async ({ request, locals }) => {
		const superuserPb = await requireSuperuserClient(locals.user);

		const formData = await request.formData();
		const feedbackId = formData.get('feedbackId')?.toString().trim();
		const value = formData.get('value') === 'true';

		if (!feedbackId) {
			return fail(400, { message: 'Feedback ID is required.' });
		}

		try {
			await superuserPb.collection('feedback').update(feedbackId, {
				responded: value,
				responded_at: value ? new Date().toISOString() : null
			});
		} catch (err) {
			if (err instanceof ClientResponseError) {
				return fail(err.status || 500, { message: err.message });
			}
			throw err;
		}

		return { success: true };
	},

	deleteFeedback: async ({ request, locals }) => {
		const superuserPb = await requireSuperuserClient(locals.user);

		const formData = await request.formData();
		const feedbackId = formData.get('feedbackId')?.toString().trim();

		if (!feedbackId) {
			return fail(400, { message: 'Feedback ID is required.' });
		}

		try {
			await superuserPb.collection('feedback').delete(feedbackId);
		} catch (err) {
			if (err instanceof ClientResponseError) {
				return fail(err.status || 500, { message: err.message });
			}
			throw err;
		}

		return { success: true };
	}
};
