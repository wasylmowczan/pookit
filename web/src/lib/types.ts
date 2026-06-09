import type { RecordModel } from 'pocketbase';

export interface User extends RecordModel {
	id: string;
	username: string;
	email: string;
	name?: string;
	avatar?: string;
	polar_customer_id?: string;
	banned?: boolean;
	ban_reason?: string;
	ban_expires?: string;
}

export type SubscriptionStatus =
	| 'incomplete'
	| 'incomplete_expired'
	| 'trialing'
	| 'active'
	| 'past_due'
	| 'canceled'
	| 'unpaid';

export interface Subscription extends RecordModel {
	polar_id: string;
	user: string;
	polar_customer_id: string;
	product_id: string;
	product_name?: string;
	status: SubscriptionStatus;
	current_period_start?: string;
	current_period_end?: string;
	cancel_at_period_end?: boolean;
	amount?: number;
	currency?: string;
	recurring_interval?: string;
}

export type OrderStatus = 'pending' | 'paid' | 'refunded' | 'partially_refunded';

export interface Order extends RecordModel {
	polar_id: string;
	user: string;
	polar_customer_id: string;
	subscription_id?: string;
	product_id: string;
	product_name?: string;
	status: OrderStatus;
	amount?: number;
	currency?: string;
	billing_reason?: string;
}
