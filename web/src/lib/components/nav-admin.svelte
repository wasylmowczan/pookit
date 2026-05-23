<script lang="ts">
	import { page } from '$app/stores';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	let {
		navAdmin
	}: {
		navAdmin: {
			label: string;
			items: {
				name: string;
				url: string;
				// This should be `Component` after lucide-svelte updates types
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				icon: any;
			}[];
		};
	} = $props();
</script>

<Sidebar.Group class="group-data-[collapsible=icon]:hidden">
	<Sidebar.GroupLabel>{navAdmin.label}</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each navAdmin.items as item (item.name)}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton isActive={$page.url.pathname.endsWith(item.url)}>
					{#snippet child({ props })}
						<a href={item.url} {...props}>
							<item.icon />
							<span>{item.name}</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
