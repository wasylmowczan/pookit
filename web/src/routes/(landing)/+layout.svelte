<script lang="ts">
	import { LandingLayout } from '$lib/components/layouts';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<LandingLayout>
	{@render children?.()}
</LandingLayout>
