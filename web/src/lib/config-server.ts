import { env } from '$env/dynamic/private';

export const config = {
	posthogApiKey: env.PRIVATE_POSTHOG_PROJECT_API_KEY,
	posthogApiHost: env.PRIVATE_POSTHOG_API_HOST,
	superAdminEmail: env.PRIVATE_PB_ADMIN_EMAIL,
	superAdminPassword: env.PRIVATE_PB_ADMIN_PASSWORD
};
