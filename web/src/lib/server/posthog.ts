import { PostHog } from 'posthog-node';
import { config } from '$lib/config-server';

let posthogClient: PostHog | null = null;

export function getPostHogClient() {
	if (!posthogClient) {
		posthogClient = new PostHog(config.posthogApiKey, {
			host: config.posthogApiHost,
			flushAt: 1,
			flushInterval: 0
		});
	}
	return posthogClient;
}
