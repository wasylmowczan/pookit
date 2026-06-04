<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';

	const errorMessages: Record<number, { title: string; description: string }> = {
		400: {
			title: 'Bad Request',
			description: "The server couldn't understand your request. Please check and try again."
		},
		401: {
			title: 'Unauthorized',
			description: 'You need to be logged in to access this page.'
		},
		403: {
			title: 'Forbidden',
			description: "You don't have permission to access this page."
		},
		404: {
			title: 'Page Not Found',
			description: "Oops, it looks like the page you're looking for doesn't exist."
		},
		429: {
			title: 'Too Many Requests',
			description: "You've made too many requests. Please wait a moment and try again."
		},
		500: {
			title: 'Internal Server Error',
			description: 'Something went wrong on our end. Please try again later.'
		},
		503: {
			title: 'Service Unavailable',
			description: 'The service is temporarily unavailable. Please try again later.'
		}
	};

	const status = $page.status;
	const fallback = {
		title: 'Unexpected Error',
		description: $page.error?.message ?? 'An unexpected error occurred.'
	};
	const { title, description } = errorMessages[status] ?? fallback;
</script>

<div class="flex h-screen flex-col items-center justify-center gap-6 px-4">
	<div class="text-center">
		<p class="text-muted-foreground text-sm font-medium uppercase tracking-widest">Error {status}</p>
		<h1 class="mt-2 text-6xl font-bold">{title}</h1>
		<p class="text-muted-foreground mt-4 max-w-sm text-lg">{description}</p>
	</div>
	<div class="flex gap-3">
		<Button variant="default" href="/">Go to Homepage</Button>
		{#if status >= 500}
			<Button variant="outline" onclick={() => window.location.reload()}>Try Again</Button>
		{/if}
	</div>
</div>
