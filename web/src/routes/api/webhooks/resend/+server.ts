import { Resend } from 'resend';
import { config } from '$lib/config-server';
import { getSuperuserClient } from '$lib/server/pocketbase-superuser';
import type { RequestHandler } from '@sveltejs/kit';

async function saveEmailEvent(
	eventType: string,
	emailId: string,
	to: string | string[],
	subject?: string
) {
	try {
		const pb = await getSuperuserClient();
		const toStr = Array.isArray(to) ? to.join(', ') : to;
		await pb
			.collection('email_events')
			.create({ event_type: eventType, email_id: emailId, to: toStr, subject: subject ?? '' });
	} catch (err) {
		console.error('[resend] Failed to save email event to PocketBase:', err);
	}
}

export const POST: RequestHandler = async ({ request }) => {
	const resend = new Resend(config.resendApiKey);
	// Must use raw text — parsing JSON breaks signature verification
	const payload = await request.text();

	const svixId = request.headers.get('svix-id');
	const svixTimestamp = request.headers.get('svix-timestamp');
	const svixSignature = request.headers.get('svix-signature');

	if (!svixId || !svixTimestamp || !svixSignature) {
		return new Response('Missing webhook headers', { status: 400 });
	}

	if (!config.resendWebhookSecret) {
		console.error('RESEND_WEBHOOK_SECRET is not set');
		return new Response('Webhook secret not configured', { status: 500 });
	}

	let event: ReturnType<typeof resend.webhooks.verify>;

	try {
		event = resend.webhooks.verify({
			payload,
			headers: {
				id: svixId,
				timestamp: svixTimestamp,
				signature: svixSignature
			},
			webhookSecret: config.resendWebhookSecret
		});
	} catch {
		return new Response('Invalid signature', { status: 400 });
	}

	switch (event.type) {
		case 'email.bounced':
		case 'email.complained':
		case 'email.delivered':
			await saveEmailEvent(event.type, event.data.email_id, event.data.to, event.data.subject);
			break;
		default:
			break;
	}

	// Always return 200 quickly to acknowledge receipt
	return new Response('OK', { status: 200 });
};
