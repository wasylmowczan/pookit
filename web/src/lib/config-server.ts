import { env } from '$env/dynamic/private';

export const config = {
	pocketbaseUrl: env.POCKETBASE_URL,
	pocketbaseAdminEmail: env.POCKETBASE_ADMIN_EMAIL,
	pocketbaseAdminPassword: env.POCKETBASE_ADMIN_PASSWORD,
	posthogApiKey: env.PRIVATE_POSTHOG_PROJECT_API_KEY,
	posthogApiHost: env.PRIVATE_POSTHOG_API_HOST
};
