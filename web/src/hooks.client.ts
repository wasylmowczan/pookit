import posthog from 'posthog-js';
import { env } from '$env/dynamic/public';
import type { HandleClientError } from '@sveltejs/kit';

export async function init() {
	if (!env.PUBLIC_POSTHOG_KEY) return;

	posthog.init(env.PUBLIC_POSTHOG_KEY, {
		api_host: '/ingest',
		ui_host: env.PUBLIC_POSTHOG_HOST,
		defaults: '2026-01-30',
		capture_pageview: false,
		capture_pageleave: false,
		capture_exceptions: true
	});
}

export const handleError: HandleClientError = async ({ error, status, message }) => {
	posthog.captureException(error);

	return {
		message,
		status
	};
};
