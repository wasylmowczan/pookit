import { fail, type Actions } from '@sveltejs/kit';
import { LoginUserSchema, RequestOtpSchema, LoginWithOtpSchema } from '$lib/schemas';
import { superValidate, setError } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { ClientResponseError } from 'pocketbase';
import { getPostHogClient } from '$lib/server/posthog';
import type { User } from '$lib/types';

export const load = async () => {
	return {
		form: await superValidate(zod(LoginUserSchema))
	};
};

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(LoginUserSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await locals.pb.collection('users').authWithPassword(form.data.login, form.data.password);

			if (!locals.pb.authStore.isValid) {
				locals.pb.authStore.clear();
				setError(form, 'login', 'Please verify your email address.');
				return fail(400, { form });
			}

			const posthog = getPostHogClient();
			posthog.capture({
				distinctId: form.data.login,
				event: 'user_logged_in',
				properties: { email: form.data.login }
			});

			return { form };
		} catch (err) {
			if (err instanceof ClientResponseError) {
				// eslint-disable-next-line no-console
				console.error('PB error: ', err);
				setError(form, 'login', 'Invalid credentials');
				setError(form, 'password', 'Invalid credentials');
			} else {
				// eslint-disable-next-line no-console
				console.error('Unexpected error:', err);
			}

			return fail(400, { form });
		}
	},

	requestOtp: async ({ request, locals }) => {
		const formData = await request.formData();
		const parsed = RequestOtpSchema.safeParse({
			email: formData.get('email')?.toString().trim()
		});

		if (!parsed.success) {
			return fail(400, { error: 'Please enter a valid email address.' });
		}

		try {
			const otpResponse = await locals.pb.collection('users').requestOTP(parsed.data.email);
			return { otpId: otpResponse.otpId, email: parsed.data.email };
		} catch (err) {
			if (err instanceof ClientResponseError) {
				// eslint-disable-next-line no-console
				console.error('PB error: ', err);
			}
			return fail(400, { error: 'If that email is registered, you will receive a one-time code.' });
		}
	},

	loginWithOtp: async ({ request, locals }) => {
		const formData = await request.formData();
		const parsed = LoginWithOtpSchema.safeParse({
			otpId: formData.get('otpId')?.toString().trim(),
			code: formData.get('code')?.toString().trim(),
			email: formData.get('email')?.toString().trim() || undefined
		});

		if (!parsed.success) {
			return fail(400, { error: 'Please enter a valid OTP code.' });
		}

		try {
			await locals.pb.collection('users').authWithOTP(parsed.data.otpId, parsed.data.code);

			if (!locals.pb.authStore.isValid) {
				locals.pb.authStore.clear();
				return fail(400, { error: 'Invalid OTP code.' });
			}

			const email =
				parsed.data.email ||
				((locals.pb.authStore.record as Partial<User> | null)?.email ?? 'unknown');

			const posthog = getPostHogClient();
			posthog.capture({
				distinctId: email,
				event: 'user_logged_in',
				properties: { email, method: 'otp' }
			});

			return { success: true };
		} catch (err) {
			if (err instanceof ClientResponseError) {
				// eslint-disable-next-line no-console
				console.error('PB error: ', err);
			}
			return fail(400, { error: 'OTP login failed. Please check the code and try again.' });
		}
	},

	loginWithGoogle: async ({ request, locals }) => {
		const formData = await request.formData();
		const token = formData.get('token')?.toString();
		const recordStr = formData.get('record')?.toString();

		if (!token || !recordStr) {
			return fail(400, { error: 'Missing auth data' });
		}

		try {
			const record = JSON.parse(recordStr) as User;
			locals.pb.authStore.save(token, record);

			if (!locals.pb.authStore.isValid) {
				locals.pb.authStore.clear();
				return fail(400, { error: 'Invalid auth token' });
			}

			const posthog = getPostHogClient();
			posthog.capture({
				distinctId: record.email,
				event: 'user_logged_in',
				properties: { email: record.email, method: 'google' }
			});

			return { success: true };
		} catch (err) {
			if (err instanceof SyntaxError) {
				return fail(400, { error: 'Invalid record data' });
			}
			throw err;
		}
	}
};
