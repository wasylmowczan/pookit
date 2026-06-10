import { env } from '$env/dynamic/private';

export const config = {
	posthogApiKey: env.PRIVATE_POSTHOG_PROJECT_API_KEY ?? '',
	posthogApiHost: env.PRIVATE_POSTHOG_API_HOST ?? '',
	superAdminEmail: env.PRIVATE_PB_ADMIN_EMAIL,
	superAdminPassword: env.PRIVATE_PB_ADMIN_PASSWORD,
	resendApiKey: env.RESEND_API_KEY,
	resendFromAddress: env.RESEND_FROM_ADDRESS,
	resendWebhookSecret: env.RESEND_WEBHOOK_SECRET,
	polarAccessToken: env.POLAR_ACCESS_TOKEN,
	polarWebhookSecret: env.POLAR_WEBHOOK_SECRET,
	// 'sandbox' | 'production'
	polarServer: (env.POLAR_SERVER ?? 'production') as 'sandbox' | 'production'
};
