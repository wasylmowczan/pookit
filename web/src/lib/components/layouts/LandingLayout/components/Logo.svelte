<script lang="ts">
	import svelteLogo from '$lib/assets/svelte_logo.svg';
	import { config } from '$lib/config-client';
</script>

<a href="/" class="flex items-center justify-center gap-2">
	<img src={svelteLogo} alt="Logo" class="w-auto shrink-0" style="height: 2rem;" />
	<span class="font-semibold text-lg">{config.appName}</span>
</a>
