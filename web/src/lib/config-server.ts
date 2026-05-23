import { env } from '$env/dynamic/private';

export const config = {
	posthogApiKey: env.PRIVATE_POSTHOG_PROJECT_API_KEY,
	posthogApiHost: env.PRIVATE_POSTHOG_API_HOST
};
