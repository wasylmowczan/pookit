import { env } from '$env/dynamic/public';

export const config = {
	baseUrl: env.PUBLIC_BASE_URL,
	pbUrl: env.PUBLIC_PB_URL,
	appName: 'Pookit',
	posthogKey: env.PUBLIC_POSTHOG_KEY,
	posthogHost: env.PUBLIC_POSTHOG_HOST
};
