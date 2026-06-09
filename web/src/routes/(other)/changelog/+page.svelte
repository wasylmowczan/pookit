<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Seo } from '$lib/components/modules';
	import { config } from '$lib/config-client';

	const LogType = {
		NewFeature: 'New Feature',
		Maintenance: 'Maintenance',
		Bugs: 'Bugs',
		Start: 'Start',
		Improvement: 'Improvement'
	} as const;

	interface Log {
		type: (typeof LogType)[keyof typeof LogType];
		items: string[];
	}

	interface ChangelogEntry {
		date: string;
		logs: Log[];
	}

	const changelog: ChangelogEntry[] = [
		{
			date: '2026-06-09',
			logs: [
				{
					type: LogType.NewFeature,
					items: [
						'Admin panel: users table now supports pagination, row selection with checkboxes, and a three-dot actions menu per row.',
						'Admin panel: admins can ban users with a reason and optional expiry date. Banned users are blocked from accessing the app and shown an Account Suspended screen.',
						'Admin panel: admins can lift bans at any time. Expired bans are automatically lifted on next login.',
						'Admin panel: admins can permanently delete users with a confirmation dialog.'
					]
				}
			]
		},
		{
			date: '2026-06-07',
			logs: [
				{
					type: LogType.NewFeature,
					items: [
						'Added Polar integration. Now users can have subscriptions and one-time purchases. Added Billing page where users can see their active plan and purchase history.'
					]
				}
			]
		},
		{
			date: '2026-06-06',
			logs: [
				{
					type: LogType.NewFeature,
					items: [
						'Added full email integration. Admin panel now shows email events like deliveries, bounces, and complaints.'
					]
				}
			]
		},
		{
			date: '2026-06-05',
			logs: [
				{
					type: LogType.Improvement,
					items: ['Added AI skills docs for Pocketbase, Svelte and Shadcn UI.']
				}
			]
		},
		{
			date: '2026-06-03',
			logs: [
				{
					type: LogType.Improvement,
					items: ['Added onboarding widget encouraging users to complete their profile.']
				}
			]
		},
		{
			date: '2026-06-02',
			logs: [
				{
					type: LogType.Improvement,
					items: ['Added possibility to login using one-time code sent to email.']
				}
			]
		},
		{
			date: '2026-06-01',
			logs: [
				{
					type: LogType.Improvement,
					items: ['Added script to start PocketBase and SvelteKit dev servers concurrently.']
				},
				{
					type: LogType.NewFeature,
					items: ['Added posibility to register and login with Google account.']
				}
			]
		},
		{
			date: '2026-05-20',
			logs: [
				{
					type: LogType.Start,
					items: ['Initial start of the project.']
				}
			]
		},
		{
			date: '2026-05-24',
			logs: [
				{
					type: LogType.NewFeature,
					items: ['Added PostHog integration. ']
				}
			]
		}
	];

	function getTimeAgo(dateString: string): string {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.max(0, now.getTime() - date.getTime());
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		const diffMonths = Math.floor(diffDays / 30);
		const diffYears = Math.floor(diffDays / 365);

		if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
		if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
		if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
		return 'Today';
	}

	const logTypeIcons: Record<(typeof LogType)[keyof typeof LogType], string> = {
		[LogType.NewFeature]: '🔥',
		[LogType.Maintenance]: '🔧',
		[LogType.Bugs]: '🐛',
		[LogType.Start]: '📄',
		[LogType.Improvement]: '🔨'
	};

	function getLogTypeIcon(type: (typeof LogType)[keyof typeof LogType]) {
		return logTypeIcons[type] || '📄';
	}
</script>

<Seo
	title={`Changelog - ${config.appName}`}
	description={`Changelog for ${config.appName}`}
	keywords="changelog"
/>

<section class="mb-12 p-6">
	<div class="container relative mx-auto overflow-hidden py-8 h-full max-w-3xl">
		<h1 class="mb-8 text-3xl font-bold text-center">Changelog 📄</h1>
		{#each changelog as entry}
			<Card class="mb-8 border shadow-sm">
				<CardHeader>
					<CardTitle class="flex items-center gap-2">
						<Badge variant="outline">
							{new Date(entry.date).toLocaleDateString('pl-PL', {
								year: 'numeric',
								month: 'numeric',
								day: 'numeric'
							})}
						</Badge>
						<span class="text-sm text-muted-foreground">
							{getTimeAgo(entry.date)}
						</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					{#each entry.logs as log}
						<div class="mb-4">
							<h3 class="mb-2 flex items-center gap-2 text-lg font-semibold">
								{getLogTypeIcon(log.type)}
								{log.type}
							</h3>
							<ul class="list-inside list-disc pl-4">
								{#each log.items as item}
									<li class="text-sm text-muted-foreground">{item}</li>
								{/each}
							</ul>
						</div>
					{/each}
				</CardContent>
			</Card>
		{/each}
	</div>
</section>
