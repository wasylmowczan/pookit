import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Returns a same-origin path safe to use in `redirect(303, ...)` after auth.
// Rejects external URLs, protocol-relative paths and anything not starting with `/`.
export function safeRedirect(value: string | null | undefined, fallback = '/dashboard'): string {
	if (!value) return fallback;
	if (!value.startsWith('/')) return fallback;
	if (value.startsWith('//') || value.startsWith('/\\')) return fallback;
	return value;
}
