import { Webhooks } from '@polar-sh/sveltekit';
import type { RequestHandler } from './$types';
import { config } from '$lib/config-server';
import { getSuperuserClient } from '$lib/server/pocketbase-superuser';
import { ClientResponseError } from 'pocketbase';

// CF Workers does not ship Buffer unless nodejs_compat is enabled.
// The Polar SDK's validateEvent needs only Buffer.from(str,"utf-8").toString("base64"),
// so this minimal shim is enough.
if (typeof globalThis.Buffer === 'undefined') {
	Object.assign(globalThis, {
		Buffer: {
			from: (input: string, _enc?: string) => ({
				toString: (enc?: string) => {
					if (enc !== 'base64') return input;
					const bytes = new TextEncoder().encode(input);
					let bin = '';
					bytes.forEach((b) => (bin += String.fromCharCode(b)));
					return btoa(bin);
				}
			})
		}
	});
}

type WithExternalId = { externalId?: string | null; external_id?: string | null };

async function findUserId(
	pb: Awaited<ReturnType<typeof getSuperuserClient>>,
	customer: (WithExternalId & { id?: string }) | null | undefined
): Promise<string | null> {
	if (!customer) return null;
	const externalId = customer.externalId ?? customer.external_id ?? null;
	if (externalId) return externalId;

	if (customer.id) {
		try {
			const record = await pb
				.collection('users')
				.getFirstListItem(`polar_customer_id = "${customer.id}"`);
			return record.id;
		} catch {
			return null;
		}
	}

	return null;
}

// Upsert by polar_id: tries to find and update, falls back to create only on 404.
async function upsertByPolarId(
	pb: Awaited<ReturnType<typeof getSuperuserClient>>,
	collection: 'subscriptions' | 'orders',
	polarId: string,
	data: Record<string, unknown>
) {
	let existingId: string | null = null;
	try {
		const existing = await pb.collection(collection).getFirstListItem(`polar_id = "${polarId}"`);
		existingId = existing.id;
	} catch (err) {
		if (err instanceof ClientResponseError && err.status === 404) {
			existingId = null;
		} else {
			throw err;
		}
	}

	if (existingId) {
		await pb.collection(collection).update(existingId, data);
	} else {
		await pb.collection(collection).create({ polar_id: polarId, ...data });
	}
}

async function cachePolarCustomerOnUser(
	pb: Awaited<ReturnType<typeof getSuperuserClient>>,
	userId: string,
	polarCustomerId: string
) {
	try {
		await pb.collection('users').update(userId, { polar_customer_id: polarCustomerId });
	} catch (err) {
		console.error('[polar] Failed to cache polar_customer_id on user:', err);
	}
}

function toIsoDate(value: unknown): string | undefined {
	if (!value) return undefined;
	if (value instanceof Date) return value.toISOString();
	if (typeof value === 'string' || typeof value === 'number') {
		const d = new Date(value);
		return isNaN(d.getTime()) ? undefined : d.toISOString();
	}
	return undefined;
}

const HANDLED_EVENT_TYPES = new Set([
	'subscription.created',
	'subscription.updated',
	'subscription.canceled',
	'subscription.revoked',
	'order.paid',
	'order.refunded',
	'customer.created',
	'customer.updated'
]);

export const POST: RequestHandler = async (event) => {
	if (!config.polarWebhookSecret) {
		console.error('[polar] POLAR_WEBHOOK_SECRET is not configured');
		return new Response(JSON.stringify({ error: 'webhook_secret_not_configured' }), {
			status: 503,
			headers: { 'content-type': 'application/json' }
		});
	}

	let eventType: string | undefined;
	try {
		const cloned = event.request.clone();
		const json = (await cloned.json()) as { type?: string };
		eventType = json?.type;
	} catch {
		// ignored
	}

	// Build the handler inside the request so $env/dynamic/private is resolved
	// from the Cloudflare Workers request context, not at module init time.
	const polarWebhooks = Webhooks({
		webhookSecret: config.polarWebhookSecret,

		onSubscriptionCreated: async (payload) => {
			const sub = payload.data;
			console.log('[polar] onSubscriptionCreated', sub.id);
			const pb = await getSuperuserClient();
			const userId = await findUserId(pb, sub.customer);
			if (userId && sub.customer?.id) await cachePolarCustomerOnUser(pb, userId, sub.customer.id);

			await upsertByPolarId(pb, 'subscriptions', sub.id, {
				user: userId,
				polar_customer_id: sub.customer?.id ?? '',
				product_id: sub.productId,
				product_name: sub.product?.name ?? '',
				status: sub.status,
				current_period_start: toIsoDate(sub.currentPeriodStart),
				current_period_end: toIsoDate(sub.currentPeriodEnd),
				cancel_at_period_end: Boolean(sub.cancelAtPeriodEnd),
				amount: sub.amount ?? 0,
				currency: sub.currency ?? '',
				recurring_interval: sub.recurringInterval ?? ''
			});
		},

		onSubscriptionUpdated: async (payload) => {
			const sub = payload.data;
			console.log('[polar] onSubscriptionUpdated', sub.id);
			const pb = await getSuperuserClient();
			const userId = await findUserId(pb, sub.customer);
			if (userId && sub.customer?.id) await cachePolarCustomerOnUser(pb, userId, sub.customer.id);

			await upsertByPolarId(pb, 'subscriptions', sub.id, {
				user: userId,
				polar_customer_id: sub.customer?.id ?? '',
				product_id: sub.productId,
				product_name: sub.product?.name ?? '',
				status: sub.status,
				current_period_start: toIsoDate(sub.currentPeriodStart),
				current_period_end: toIsoDate(sub.currentPeriodEnd),
				cancel_at_period_end: Boolean(sub.cancelAtPeriodEnd),
				amount: sub.amount ?? 0,
				currency: sub.currency ?? '',
				recurring_interval: sub.recurringInterval ?? ''
			});
		},

		onSubscriptionCanceled: async (payload) => {
			const sub = payload.data;
			console.log('[polar] onSubscriptionCanceled', sub.id);
			const pb = await getSuperuserClient();
			await upsertByPolarId(pb, 'subscriptions', sub.id, {
				status: sub.status,
				cancel_at_period_end: Boolean(sub.cancelAtPeriodEnd)
			});
		},

		onSubscriptionRevoked: async (payload) => {
			const sub = payload.data;
			console.log('[polar] onSubscriptionRevoked', sub.id);
			const pb = await getSuperuserClient();
			await upsertByPolarId(pb, 'subscriptions', sub.id, { status: sub.status });
		},

		onOrderPaid: async (payload) => {
			const order = payload.data;
			console.log('[polar] onOrderPaid', order.id, 'customer.externalId:', order.customer?.externalId);
			const pb = await getSuperuserClient();
			console.log('[polar] getSuperuserClient ok');
			const userId = await findUserId(pb, order.customer);
			console.log('[polar] userId:', userId);
			if (userId && order.customer?.id) await cachePolarCustomerOnUser(pb, userId, order.customer.id);

			await upsertByPolarId(pb, 'orders', order.id, {
				user: userId,
				polar_customer_id: order.customer?.id ?? '',
				subscription_id: order.subscriptionId ?? '',
				product_id: order.productId,
				product_name: order.product?.name ?? '',
				status: 'paid',
				amount: order.totalAmount ?? 0,
				currency: order.currency ?? '',
				billing_reason: order.billingReason ?? ''
			});
			console.log('[polar] onOrderPaid done', order.id);
		},

		onOrderRefunded: async (payload) => {
			const order = payload.data;
			console.log('[polar] onOrderRefunded', order.id);
			const pb = await getSuperuserClient();
			await upsertByPolarId(pb, 'orders', order.id, {
				status:
					order.refundedAmount && order.totalAmount && order.refundedAmount < order.totalAmount
						? 'partially_refunded'
						: 'refunded'
			});
		},

		onCustomerCreated: async (payload) => {
			const customer = payload.data;
			console.log('[polar] onCustomerCreated', customer.id, 'externalId:', customer.externalId);
			const externalId = customer.externalId;
			if (!externalId) return;
			const pb = await getSuperuserClient();
			await cachePolarCustomerOnUser(pb, externalId, customer.id);
		},

		onCustomerUpdated: async (payload) => {
			const customer = payload.data;
			console.log('[polar] onCustomerUpdated', customer.id, 'externalId:', customer.externalId);
			const externalId = customer.externalId;
			if (!externalId) return;
			const pb = await getSuperuserClient();
			await cachePolarCustomerOnUser(pb, externalId, customer.id);
		}
	});

	try {
		return await polarWebhooks(event);
	} catch (err) {
		if (eventType && !HANDLED_EVENT_TYPES.has(eventType)) {
			console.warn(
				`[polar] Ignored unhandled event "${eventType}":`,
				err instanceof Error ? err.message : err
			);
			return new Response(JSON.stringify({ received: true, ignored: eventType }), {
				status: 200,
				headers: { 'content-type': 'application/json' }
			});
		}
		const errMessage = err instanceof Error ? err.message : String(err);
		const pbDetail =
			err instanceof ClientResponseError
				? { pb_status: err.status, pb_response: err.response }
				: undefined;

		console.error('[polar] Webhook handler error for event:', eventType, errMessage, pbDetail);

		// Return a structured 500 so the Polar dashboard shows the error detail.
		return new Response(
			JSON.stringify({
				error: errMessage,
				event: eventType,
				type: err?.constructor?.name,
				...pbDetail
			}),
			{ status: 500, headers: { 'content-type': 'application/json' } }
		);
	}
};
