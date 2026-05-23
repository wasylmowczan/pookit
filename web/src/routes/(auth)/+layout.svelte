<script lang="ts">
	import Logo from '$lib/components/layouts/LandingLayout/components/Logo.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="relative">
	<div class="absolute top-4 left-4 z-10">
		<Logo />
	</div>
	{@render children?.()}
</div>
