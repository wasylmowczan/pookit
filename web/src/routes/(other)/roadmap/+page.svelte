<script lang="ts">
	import { Seo } from '$lib/components/modules';
	import { config } from '$lib/config-client';

	type Status = 'Pending' | 'Approved' | 'InProgress' | 'Done';
	type Tag = 'Enhancement' | 'BigFeature' | 'Suggestions';

	interface RoadmapFeature {
		title: string;
		description: string;
		status: Status;
		tags: Tag[];
	}

	interface StatusColumn {
		title: string;
		status: Status;
		icon: string;
	}

	const statusColumns: StatusColumn[] = [
		{ title: 'Pending', status: 'Pending', icon: '👀' },
		{ title: 'Approved', status: 'Approved', icon: '👍' },
		{ title: 'In Progress', status: 'InProgress', icon: '🛠' },
		{ title: 'Done', status: 'Done', icon: '✅' }
	];

	const tagStyles: Record<Tag, { label: string; className: string }> = {
		Enhancement: {
			label: 'Enhancement',
			className: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
		},
		BigFeature: {
			label: 'Big Feature',
			className: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
		},
		Suggestions: {
			label: 'Suggestions',
			className: 'bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100'
		}
	};

	const features: RoadmapFeature[] = [
		{
			title: 'Extra landing pages.',
			description: 'Create extra landing pages for different use cases like SaaS, e-commerce, etc.',
			status: 'Pending',
			tags: ['Suggestions']
		},
		{
			title: 'Released apps',
			description: 'Create page with released apps using Pookit.',
			status: 'Approved',
			tags: ['Suggestions']
		},
		{
			title: 'Google login',
			description: 'Sign in with your Google account — no password needed.',
			status: 'Done',
			tags: ['Enhancement']
		},
		{
			title: 'OTP email login',
			description: 'Passwordless login via a one-time code sent to your email address.',
			status: 'Done',
			tags: ['BigFeature']
		},
		{
			title: 'Polar.sh payments',
			description:
				'Full billing integration with Polar.sh — subscriptions, one-time purchases and webhooks.',
			status: 'Done',
			tags: ['BigFeature']
		},
		{
			title: 'Transactional emails with Resend',
			description:
				'Email delivery for verification, notifications and OTP codes powered by Resend.',
			status: 'Done',
			tags: ['BigFeature']
		},
		{
			title: 'PostHog analytics',
			description:
				'User event tracking and product analytics integrated across auth and key app flows.',
			status: 'Done',
			tags: ['Enhancement']
		}
	];
</script>

<Seo
	title={`Roadmap - ${config.appName}`}
	description={`Roadmap for ${config.appName}`}
	keywords="roadmap, roadmap for ai image generator"
/>
<section class="mb-8 p-6 w-full">
	<div class="container relative mx-auto overflow-hidden py-8">
		<h1 class="mb-12 text-3xl font-bold text-center">Roadmap 🎯</h1>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{#each statusColumns as column}
				<div class="p-4" role="region" aria-labelledby={column.title}>
					<div class="flex items-center gap-2 mb-4">
						<span class="text-lg">{column.icon}</span>
						<h2 class="font-semibold">{column.title}</h2>
					</div>

					<div class="space-y-4">
						{#each features.filter((f) => f.status === column.status) as feature}
							<div class="rounded-lg p-4 shadow-sm border">
								<div class="flex items-start justify-between">
									<div class="flex items-start gap-2">
										<h3 class="font-medium">{feature.title}</h3>
									</div>
								</div>

								<p class="text-sm text-gray-500 mt-2">
									{feature.description}
								</p>

								<div class="flex flex-wrap gap-2 mt-3">
									{#each feature.tags as tag}
										<span
											class="px-2 py-1 text-xs font-semibold rounded-full {tagStyles[tag]
												.className}"
										>
											{tagStyles[tag].label}
										</span>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
