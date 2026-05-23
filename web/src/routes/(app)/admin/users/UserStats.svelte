<script lang="ts">
	import { ArrowUpIcon, ArrowDownIcon, Users, UserPlus, UserMinus, Equal } from '@lucide/svelte';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';

	let { data } = $props();

	const totalUsers = data.data.length;

	const getNewUsersCount = () =>
		data.data.filter(
			(user: { created: string }) => Date.parse(user.created) > Date.now() - 1000 * 60 * 60 * 24 * 7
		).length;

	const getUnverifiedUsersCount = () =>
		data.data.filter((user: { verified: boolean }) => !user.verified).length;

	const calculateChange = (current: number, total: number) =>
		total > 0 ? parseFloat(((current / total) * 100).toFixed(1)) : 0;

	let newUsers = getNewUsersCount();
	let unverifiedUsers = getUnverifiedUsersCount();

	// Stats data
	interface StatsItem {
		title: string;
		value: number;
		change: number;
		icon: any;
	}

	let stats: StatsItem[] = [
		{
			title: 'Total Users',
			value: totalUsers,
			change: calculateChange(newUsers, totalUsers),
			icon: Users
		},
		{
			title: 'New Users',
			value: newUsers,
			change: calculateChange(newUsers, totalUsers),
			icon: UserPlus
		},
		{
			title: 'Unverified Users',
			value: unverifiedUsers,
			change: calculateChange(unverifiedUsers, totalUsers),
			icon: UserMinus
		}
	];
</script>

<div class="grid gap-4 md:grid-cols-3">
	{#each stats as stat}
		<Card class="dark:border-primary">
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">{stat.title}</CardTitle>
				{#if stat.icon}
					<stat.icon class="size-6 text-muted-foreground" />
				{/if}
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{stat.value}</div>
				<div class="flex items-center gap-1 text-sm">
					{#if stat.change > 0}
						<ArrowUpIcon class="h-4 w-4 text-emerald-500" />
						<span class="text-emerald-500">+{stat.change}% from last month</span>
					{:else if stat.change < 0}
						<ArrowDownIcon class="h-4 w-4 text-red-500" />
						<span class="text-red-500">-{stat.change}% from last month</span>
					{:else}
						<Equal class="size-4 text-muted-foreground" />
						<span class="text-muted-foreground">from last month</span>
					{/if}
				</div>
			</CardContent>
		</Card>
	{/each}
</div>
