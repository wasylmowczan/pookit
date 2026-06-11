import posthog from 'posthog-js';
import { config } from './lib/config-client';
import type { HandleClientError } from '@sveltejs/kit';

export async function init() {
	if (!config.posthogKey) return;

	posthog.init(config.posthogKey, {
		api_host: '/ingest',
		ui_host: config.posthogHost,
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
