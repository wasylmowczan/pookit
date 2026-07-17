<script lang="ts">
	import Users from '@lucide/svelte/icons/users';
	import UserSearch from '@lucide/svelte/icons/user-search';
	import UserX from '@lucide/svelte/icons/user-x';
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import Mail from '@lucide/svelte/icons/mail';
	import adminVideo from '$lib/assets/admin.mp4';
	import { FeatureShowcase, BrowserMockup } from '$lib/components/blocks';

	const features = [
		{
			icon: Users,
			title: 'User Management',
			description: 'View all users, inspect their profiles, status, and activity information.'
		},
		{
			icon: UserSearch,
			title: 'Impersonate Users',
			description: 'One-click impersonation to see the app exactly as any user does.'
		},
		{
			icon: UserX,
			title: 'Ban / Lift Ban',
			description: 'Ban users with a date and reason. Lift bans when case is resolved.'
		},
		{
			icon: MessageSquare,
			title: 'User Feedback',
			description: 'Read and respond to in-app feedback submitted by your users.'
		},
		{
			icon: Mail,
			title: 'Email Events',
			description: 'Review email delivery status, bounces, and spam complaints from Resend.'
		}
	];
</script>

<FeatureShowcase
	reverse
	title="Super Admin with Super Powers"
	description="Super Admins get a powerful dashboard with complete control over your application. Manage users, impersonate them, ban/lift bans, delete, and review user feedback - all from a single, powerful interface."
	{features}
>
	{#snippet mockup()}
		<BrowserMockup
			url="https://pookit.dev/admin/users"
			video={adminVideo}
			alt="Admin dashboard preview"
		/>
	{/snippet}
</FeatureShowcase>
