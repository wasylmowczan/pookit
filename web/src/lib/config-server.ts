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
	polarServer: (env.POLAR_SERVER ?? 'production') as 'sandbox' | 'production',
	// Comma-separated Polar product IDs that should be treated as "Pro" plan products.
	// Used to flag the user as Pro when an active subscription matches one of these.
	polarProProductIds: (env.POLAR_PRO_PRODUCT_IDS ?? '')
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean)
};
