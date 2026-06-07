<script lang="ts">
	import { Dialog as SheetPrimitive } from 'bits-ui';

	interface Props {
		children?: import('svelte').Snippet;
		[key: string]: any;
	}

	let { children, ...rest }: Props = $props();
</script>

<SheetPrimitive.Portal {...rest}>
	{@render children?.()}
</SheetPrimitive.Portal>
