<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import UsersStats from './UserStats.svelte';
	import UsersTable from './UsersTable.svelte';
	import { Search } from '@lucide/svelte';
	import { Input } from '$lib/components/ui/input';
	import { RotateCw as RefreshIcon } from '@lucide/svelte';

	// Search query for filtering users
	let searchQuery: string = $state('');
	let { data } = $props();

	function refreshData(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		event.preventDefault();
		event.stopPropagation();
		window.location.reload();
	}
</script>

<main class="min-h-screen w-full p-6">
	<div class="space-y-6">
		<!-- Header Section -->
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Users Dashboard</h1>
			<p>Overview of your users and analytics.</p>
		</div>
		<!-- Stats cards -->
		<UsersStats {data} />

		<!-- Users table section -->
		<Card>
			<CardHeader>
				<div class="flex items-center justify-between">
					<CardTitle
						>All Users
						<button onclick={refreshData}>
							<RefreshIcon class="h-4 w-4" />
						</button></CardTitle
					>
					<div class="relative w-full max-w-sm">
						<Search class="absolute left-2 top-2.5 h-4 w-4" />
						<Input bind:value={searchQuery} placeholder="Search users..." class="pl-8" />
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<UsersTable {data} {searchQuery} />
			</CardContent>
		</Card>
	</div>
</main>
