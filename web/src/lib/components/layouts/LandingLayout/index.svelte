<script lang="ts">
	import { Footer, Header } from './components';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const menuItems = [
		{ name: 'Home', href: '/' },
		{ name: 'Pricing', href: '/pricing' }
	];
</script>

<div class="flex min-h-screen w-full flex-col dotted-background">
	<Header {menuItems} />
	<main class="flex-1 flex flex-col">
		{@render children?.()}
	</main>
	<Footer {menuItems} />
</div>

<style>
	.dotted-background {
		background-image: radial-gradient(circle, rgba(0, 0, 0, 0.1) 1%, transparent 15%);
		background-size: 15px 15px; /* Adjust size as needed */
	}
</style>
