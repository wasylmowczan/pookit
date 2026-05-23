<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { toggleMode, mode } from 'mode-watcher';

	const isDark = $derived(mode.current === 'dark');

	function handleToggleMode() {
		if (document.startViewTransition) {
			document.startViewTransition(() => {
				toggleMode();
			});
		} else {
			toggleMode();
		}
	}
</script>

<button
	type="button"
	role="switch"
	aria-checked={isDark}
	onclick={handleToggleMode}
	class="inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background {isDark
		? 'bg-primary'
		: 'bg-input'}"
>
	<span
		class="pointer-events-none flex size-5 items-center justify-center rounded-full bg-background shadow-lg ring-0 transition-transform {isDark
			? 'translate-x-5'
			: 'translate-x-0'}"
	>
		{#if isDark}
			<Moon class="size-3" />
		{:else}
			<Sun class="size-3" />
		{/if}
	</span>
</button>
