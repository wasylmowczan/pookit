<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="h-screen flex flex-col md:flex-row items-center justify-center">
	<div class="text-center md:text-center md:w-1/4">
		<h1 class="text-6xl font-bold">404</h1>
		<p class="text-lg mt-4 p-2">Oops, it looks like the page you're looking for doesn't exist.</p>
		<Button variant="default" href={`/`}>Go to Homepage</Button>
	</div>
</div>
