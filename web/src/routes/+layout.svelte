<script lang="ts">
	import '../app.postcss';
	import { Toaster } from 'svelte-sonner';
	import Schema from '$lib/components/modules/Seo/schema.svelte';
	import { Seo } from '$lib/components/modules';
	import { ModeWatcher } from 'mode-watcher';
	import { posthog } from 'posthog-js';
	import { browser } from '$app/environment';
	import { beforeNavigate, afterNavigate } from '$app/navigation';

	if (browser) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}

	let { children } = $props();
</script>

<Schema />
<ModeWatcher />
<Seo />
<Toaster richColors />
{@render children?.()}
