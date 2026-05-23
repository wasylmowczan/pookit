import { env } from '$env/dynamic/public';

export const config = {
	baseUrl: env.PUBLIC_BASE_URL,
	pbUrl: env.PUBLIC_PB_URL,
	appName: 'SvelteRocks'
};
