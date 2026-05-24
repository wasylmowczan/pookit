import { z } from 'zod';

export const LoginUserSchema = z.object({
	login: z
		.string({ error: 'Username or email is required' })
		.min(1, { message: 'Username or email is required' }),
	password: z.string({ error: 'Password is required' })
});

export const RegisterUserSchema = z
	.object({
		email: z
			.string({ error: 'Email is required' })
			.email({ message: 'Email must be a valid email' }),
		password: z
			.string({ error: 'Password is required' })
			.min(8, { message: 'Password must be at least 8 characters long' }),
		passwordConfirm: z
			.string({ error: 'Confirm Password is required' })
			.min(8, { message: 'Password must be at least 8 characters long' })
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: "Passwords don't match",
		path: ['passwordConfirm']
	});

export const RequestVerificationSchema = z.object({
	email: z.string({ error: 'Email is required' }).email({ message: 'Email must be a valid email' })
});

export const ForgotPasswordSchema = z.object({
	email: z.string({ error: 'Email is required' }).email({ message: 'Email must be a valid email' })
});

export const UpdateAvatarSchema = z.object({
	avatar: z.union([z.instanceof(File), z.string(), z.null()]).optional()
});

export const UpdateEmailSchema = z.object({
	email: z.string({ error: 'Email is required' }).email({ message: 'Email must be a valid email' })
});

export const UpdateNameSchema = z.object({
	name: z.string({ error: 'Name is required' })
});

export const UpdatePasswordSchema = z
	.object({
		oldPassword: z
			.string({ error: 'Old password is required' })
			.min(8, { message: 'Password must be at least 8 characters long' }),
		password: z
			.string({ error: 'Password is required' })
			.min(8, { message: 'Password must be at least 8 characters long' }),
		passwordConfirm: z
			.string({ error: 'Confirm Password is required' })
			.min(8, { message: 'Password must be at least 8 characters long' })
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: "Passwords don't match",
		path: ['passwordConfirm']
	});

export const DeleteUserSchema = z.object({
	word: z.string().refine((data) => data === 'DELETE', { message: 'Word must be "DELETE"' })
});

export const feedbackSchema = z.object({
	name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
	email: z.string().email('Invalid email address'),
	feedback: z.string().min(3, { message: 'Feedback must be at least 3 characters' })
});
