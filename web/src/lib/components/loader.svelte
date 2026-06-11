<script lang="ts">
	type Variant = 'dots' | 'pulse' | 'bars';
	type Size = 'sm' | 'md' | 'lg';

	let {
		variant = 'dots',
		size = 'md',
		label,
		class: className = ''
	}: {
		variant?: Variant;
		size?: Size;
		label?: string;
		class?: string;
	} = $props();

	const sizes = {
		sm: { dot: 'size-1.5', bar: 'w-1 h-3', gap: 'gap-1', text: 'text-xs' },
		md: { dot: 'size-2.5', bar: 'w-1.5 h-5', gap: 'gap-1.5', text: 'text-sm' },
		lg: { dot: 'size-3.5', bar: 'w-2 h-7', gap: 'gap-2', text: 'text-base' }
	};

	const s = $derived(sizes[size]);
</script>

<div
	class="loader-root inline-flex flex-col items-center gap-2 {className}"
	role="status"
	aria-label={label ?? 'Loading'}
>
	{#if variant === 'dots'}
		<div class="flex items-end {s.gap}">
			{#each [0, 1, 2] as i}
				<div
					class="loader-dot {s.dot} bg-primary"
					style="animation-delay: {i * 120}ms"
				></div>
			{/each}
		</div>
	{:else if variant === 'pulse'}
		<div class="relative flex items-center justify-center">
			<div class="loader-pulse-ring absolute {size === 'sm' ? 'size-6' : size === 'md' ? 'size-10' : 'size-14'} border-2 border-primary"></div>
			<div class="loader-pulse-ring-2 absolute {size === 'sm' ? 'size-6' : size === 'md' ? 'size-10' : 'size-14'} border-2 border-primary"></div>
			<div class="{size === 'sm' ? 'size-2' : size === 'md' ? 'size-3.5' : 'size-5'} bg-primary loader-pulse-core"></div>
		</div>
	{:else if variant === 'bars'}
		<div class="flex items-end {s.gap}">
			{#each [0, 1, 2, 3] as i}
				<div
					class="loader-bar {s.bar} bg-primary"
					style="animation-delay: {i * 100}ms"
				></div>
			{/each}
		</div>
	{/if}

	{#if label}
		<span class="font-mono {s.text} text-muted-foreground tracking-tight">{label}</span>
	{/if}
</div>

<style>
	/* Dots: staggered bounce like Claude's thinking indicator */
	.loader-dot {
		animation: dot-bounce 1s ease-in-out infinite;
		transform-origin: bottom;
	}

	@keyframes dot-bounce {
		0%, 60%, 100% {
			transform: translateY(0);
			opacity: 0.4;
		}
		30% {
			transform: translateY(-6px);
			opacity: 1;
		}
	}

	/* Pulse rings */
	.loader-pulse-ring {
		animation: pulse-ring 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
		opacity: 0;
	}

	.loader-pulse-ring-2 {
		animation: pulse-ring 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
		animation-delay: 0.7s;
		opacity: 0;
	}

	.loader-pulse-core {
		animation: pulse-core 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse-ring {
		0% {
			transform: scale(0.6);
			opacity: 0.8;
		}
		100% {
			transform: scale(1.4);
			opacity: 0;
		}
	}

	@keyframes pulse-core {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	/* Bars: wave equalizer */
	.loader-bar {
		animation: bar-wave 0.9s ease-in-out infinite;
		transform-origin: bottom;
	}

	@keyframes bar-wave {
		0%, 100% {
			transform: scaleY(0.4);
			opacity: 0.5;
		}
		50% {
			transform: scaleY(1);
			opacity: 1;
		}
	}
</style>
