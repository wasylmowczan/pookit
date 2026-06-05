import { Resend } from 'resend';
import { config } from '$lib/config-server';

let _resend: Resend | null = null;

function getClient(): Resend {
	if (!_resend) {
		if (!config.resendApiKey) {
			throw new Error('RESEND_API_KEY is not set');
		}
		_resend = new Resend(config.resendApiKey);
	}
	return _resend;
}

export type SendEmailOptions = {
	to: string | string[];
	subject: string;
	html: string;
	/** Idempotency key — format: `<event-type>/<entity-id>`, e.g. `welcome-email/user-123` */
	idempotencyKey?: string;
};

export type SendEmailResult = { success: true; id: string } | { success: false; error: string };

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
	const resend = getClient();
	const from = config.resendFromAddress;

	if (!from) {
		return { success: false, error: 'RESEND_FROM_ADDRESS is not set' };
	}

	const sendOptions = {
		from,
		to: options.to,
		subject: options.subject,
		html: options.html
	};

	const { data, error } = await resend.emails.send(
		sendOptions,
		options.idempotencyKey ? { idempotencyKey: options.idempotencyKey } : undefined
	);

	if (error) {
		return { success: false, error: error.message };
	}

	return { success: true, id: data!.id };
}
