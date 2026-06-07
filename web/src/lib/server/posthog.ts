import { PostHog } from 'posthog-node';
import { config } from '$lib/config-server';

const posthogClient = new PostHog(config.posthogApiKey || 'no-key', {
	host: config.posthogApiHost || 'https://eu.i.posthog.com',
	flushAt: 1,
	flushInterval: 0,
	disabled: !config.posthogApiKey
});

export function getPostHogClient(): PostHog {
	return posthogClient;
}
