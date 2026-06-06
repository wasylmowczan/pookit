import { Webhooks } from '@polar-sh/sveltekit';
import { config } from '$lib/config-server';
import { getSuperuserClient } from '$lib/server/pocketbase-superuser';

// Polar webhook handler. Verifies the Standard Webhooks signature via the
// adapter, then upserts subscriptions/orders into PocketBase and caches the
// polar_customer_id on the user record so the portal route can find them.
//
// NOTE: Webhook payloads from Polar use snake_case keys at the API level, but
// the SDK normalises them to camelCase for TS callers.

type WithExternalId = { externalId?: string | null; external_id?: string | null };

async function findUserId(
	pb: Awaited<ReturnType<typeof getSuperuserClient>>,
	customer: (WithExternalId & { id?: string }) | null | undefined
): Promise<string | null> {
	if (!customer) return null;
	const externalId = customer.externalId ?? customer.external_id ?? null;
	if (externalId) return externalId;

	// Fallback: look up by polar_customer_id we may have cached previously.
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

async function upsertByPolarId(
	pb: Awaited<ReturnType<typeof getSuperuserClient>>,
	collection: 'subscriptions' | 'orders',
	polarId: string,
	data: Record<string, unknown>
) {
	try {
		const existing = await pb.collection(collection).getFirstListItem(`polar_id = "${polarId}"`);
		await pb.collection(collection).update(existing.id, data);
	} catch {
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

export const POST = Webhooks({
	webhookSecret: config.polarWebhookSecret ?? '',

	onSubscriptionCreated: async (payload) => {
		const sub = payload.data;
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
		const pb = await getSuperuserClient();
		await upsertByPolarId(pb, 'subscriptions', sub.id, {
			status: sub.status,
			cancel_at_period_end: Boolean(sub.cancelAtPeriodEnd)
		});
	},

	onSubscriptionRevoked: async (payload) => {
		const sub = payload.data;
		const pb = await getSuperuserClient();
		await upsertByPolarId(pb, 'subscriptions', sub.id, { status: sub.status });
	},

	onOrderPaid: async (payload) => {
		const order = payload.data;
		const pb = await getSuperuserClient();
		const userId = await findUserId(pb, order.customer);
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
	},

	onOrderRefunded: async (payload) => {
		const order = payload.data;
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
		const externalId = customer.externalId;
		if (!externalId) return;
		const pb = await getSuperuserClient();
		await cachePolarCustomerOnUser(pb, externalId, customer.id);
	},

	onCustomerUpdated: async (payload) => {
		const customer = payload.data;
		const externalId = customer.externalId;
		if (!externalId) return;
		const pb = await getSuperuserClient();
		await cachePolarCustomerOnUser(pb, externalId, customer.id);
	}
});
