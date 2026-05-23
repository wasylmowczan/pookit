import { browser } from '$app/environment';
import { posthog } from 'posthog-js';

export const load = async ({ data }) => {
	if (browser) {
		posthog.init(data.posthogApiKey, {
			api_host: data.posthogApiHost,
			capture_pageview: false,
			capture_pageleave: false
		});
	}
	return;
};
