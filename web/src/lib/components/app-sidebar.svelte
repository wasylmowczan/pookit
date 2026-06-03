<script lang="ts">
	import NavMain from '$lib/components/nav-main.svelte';
	import NavAdmin from '$lib/components/nav-admin.svelte';
	import NavSecondary from '$lib/components/nav-secondary.svelte';
	import NavUser from '$lib/components/nav-user.svelte';
	import OnboardingWidget from '$lib/components/onboarding-widget.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import Logo from './layouts/LandingLayout/components/Logo.svelte';
	import type { User } from '$lib/types';

	let {
		menu,
		ref = $bindable(null),
		showNavAdmin,
		user,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & { menu: any; showNavAdmin?: boolean; user?: User | null } = $props();
</script>

<Sidebar.Root bind:ref variant="inset" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg" class="justify-center">
					<Logo />
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain navMain={menu.navMain} />
		{#if showNavAdmin}
			<NavAdmin navAdmin={menu.navAdmin} />
		{/if}
		<div class="mt-auto">
			<OnboardingWidget {user} />
			<NavSecondary items={menu.navSecondary} />
		</div>
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={menu.user} />
	</Sidebar.Footer>
</Sidebar.Root>
