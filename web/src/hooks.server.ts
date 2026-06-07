import type { Handle, HandleServerError } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { config } from '$lib/config-client';
import type { User } from '$lib/types';
import { getPostHogClient } from '$lib/server/posthog';

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	if (pathname.startsWith('/ingest')) {
		const useAssetHost =
			pathname.startsWith('/ingest/static/') || pathname.startsWith('/ingest/array/');
		const hostname = useAssetHost ? 'eu-assets.i.posthog.com' : 'eu.i.posthog.com';

		const url = new URL(event.request.url);
		url.protocol = 'https:';
		url.hostname = hostname;
		url.port = '443';
		url.pathname = pathname.replace(/^\/ingest/, '');

		const headers = new Headers(event.request.headers);
		headers.set('host', hostname);
		headers.set('accept-encoding', '');

		const clientIp = event.request.headers.get('x-forwarded-for') || event.getClientAddress();
		if (clientIp) {
			headers.set('x-forwarded-for', clientIp);
		}

		try {
			const response = await fetch(url.toString(), {
				method: event.request.method,
				headers,
				body: event.request.body,
				// @ts-expect-error - duplex is required for streaming request bodies
				duplex: 'half'
			});
			return response;
		} catch (err) {
			// PostHog endpoint unreachable — don't let tracking failures surface as 500s
			console.error('[ingest proxy] PostHog fetch failed:', err);
			return new Response(null, { status: 204 });
		}
	}

	event.locals.pb = new PocketBase(config.pbUrl);
	try {
		event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
	} catch {
		// malformed cookie — treat as unauthenticated
	}

	if (event.locals.pb.authStore.isValid) {
		try {
			const token = event.locals.pb.authStore.token;
			const payload = JSON.parse(atob(token.split('.')[1]));
			const expiresInMs = payload.exp * 1000 - Date.now();

			if (expiresInMs < 5 * 60 * 1000) {
				await event.locals.pb.collection('users').authRefresh();
			}

			event.locals.user = event.locals.pb.authStore.record as User;
		} catch (error) {
			event.locals.pb.authStore.clear();
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}

	const response = await resolve(event);
	response.headers.set(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({
			secure: false,
			sameSite: 'lax'
		})
	);

	return response;
};

export const handleError: HandleServerError = async ({ error, status, message }) => {
	console.error('[handleError]', status, message, error);

	try {
		const posthog = getPostHogClient();
		posthog.capture({
			distinctId: 'server',
			event: 'server_error',
			properties: {
				error: error instanceof Error ? error.message : String(error),
				status,
				message
			}
		});
	} catch (posthogErr) {
		console.error('[handleError] PostHog capture failed:', posthogErr);
	}

	return {
		message,
		status
	};
};
