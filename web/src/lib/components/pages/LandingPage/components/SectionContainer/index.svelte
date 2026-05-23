<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		id?: string;
		title?: string;
		subtitle?: string;
		titleClass?: string;
		subtitleClass?: string;
		sectionClass?: string;
		contentClass?: string;
		children?: import('svelte').Snippet;
	}

	let {
		id = '',
		title = '',
		subtitle = '',
		titleClass = '',
		subtitleClass = '',
		sectionClass = '',
		contentClass = '',
		children
	}: Props = $props();
</script>

<section {id} class={cn('mx-auto w-full px-4 py-12 pt-20', sectionClass)}>
	<div class={cn('mx-auto', contentClass)}>
		{#if title}
			<h2 class={cn('text-center text-4xl font-bold mb-2', titleClass)}>
				{title}
			</h2>
		{/if}
		{#if subtitle}
			<p class={cn('text-center text-xl text-muted-foreground mb-8', subtitleClass)}>
				{subtitle}
			</p>
		{/if}
		{@render children?.()}
	</div>
</section>
