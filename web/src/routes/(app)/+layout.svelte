<script lang="ts">
	import altAvatar from '$lib/assets/alt-avatar.svg';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { Seo, ThemeSwitcher } from '$lib/components/modules';
	import { Command } from '@lucide/svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import RoadmapIcon from '$lib/components/icons/common/plain.svelte';
	import SpeechIcon from '$lib/components/icons/common/speech.svelte';
	import UsersIcon from '$lib/components/icons/common/users.svelte';
	import TextIcon from '$lib/components/icons/common/text.svelte';
	import { config } from '$lib/config-client';
	import { posthog } from 'posthog-js';

	let { data, children } = $props();

	const currentAvatarUrl = data.user?.avatar
		? `${config.pbUrl}/api/files/${data.user.collectionId}/${data.user.id}/${data.user.avatar}`
		: altAvatar;

	let showNavAdmin = data.user?.name?.includes('superadmin');

	const menu = {
		navMain: {
			label: 'User Panel',
			items: [
				{
					title: 'Dashboard',
					url: '/dashboard',
					icon: TextIcon,
					isActive: true
				}
			]
		},
		navAdmin: {
			label: 'Admin Panel',
			items: [
				{
					name: 'Users',
					url: '/admin/users',
					icon: UsersIcon
				},
				{
					name: 'Feedbacks',
					url: '/admin/feedbacks',
					icon: SpeechIcon
				}
			]
		},
		navSecondary: [
			{
				title: 'Feedback',
				url: '/feedback',
				icon: SpeechIcon
			},
			{
				title: 'Roadmap',
				url: '/roadmap',
				icon: RoadmapIcon
			}
		],
		user: {
			name: data.user?.name || data.user?.username,
			email: data.user?.email,
			avatar: currentAvatarUrl
		}
	};

	posthog.identify(data.user?.email, {
		email: data.user?.email,
		name: data.user?.name
	});
</script>

<Seo />
<Sidebar.Provider>
	<AppSidebar {menu} {showNavAdmin} />
	<Sidebar.Inset>
		<header class="flex h-16 shrink-0 items-center justify-between gap-2">
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 h-6" />
				<Command size={16} /> + B
			</div>
			<div class="flex items-center gap-4 px-4">
				<ThemeSwitcher />
			</div>
		</header>
		{@render children?.()}
	</Sidebar.Inset>
</Sidebar.Provider>
