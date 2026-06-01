<script lang="ts">
	import { fade } from 'svelte/transition';
	import Google from '$lib/components/icons/brands/Google.svelte';

	let { message = 'Signing in…' }: { message?: string } = $props();
</script>

<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
	transition:fade={{ duration: 150 }}
>
	<div class="flex flex-col items-center gap-4">
		<div class="relative flex items-center justify-center">
			<svg class="animate-spin h-14 w-14 text-primary/20" viewBox="0 0 56 56" fill="none">
				<circle cx="28" cy="28" r="24" stroke="currentColor" stroke-width="4" />
				<path
					d="M52 28a24 24 0 0 0-24-24"
					stroke="hsl(var(--primary))"
					stroke-width="4"
					stroke-linecap="round"
				/>
			</svg>
			<span class="absolute h-6 w-6">
				<Google />
			</span>
		</div>
		<p class="text-sm text-muted-foreground">{message}</p>
	</div>
</div>
