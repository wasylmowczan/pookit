<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import FeedbackStats from './FeedbackStats.svelte';
	import FeedbackTable from './FeedbackTable.svelte';
	import { RotateCw as RefreshIcon } from '@lucide/svelte';

	let { data }: { data: any } = $props();

	function refreshData(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		event.preventDefault();
		event.stopPropagation();
		window.location.reload();
	}
</script>

<main class="min-h-screen w-full bg-background text-foreground p-6">
	<div class="space-y-6">
		<!-- Header Section -->
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Feedbacks</h1>
			<p class="text-muted-foreground">Overview of your feedbacks and analytics.</p>
		</div>
		<!-- Stats cards -->
		<FeedbackStats {data} />

		<!-- Users table section -->
		<Card class="dark:border-primary">
			<CardHeader>
				<div class="flex items-center justify-between">
					<CardTitle
						>All Feedbacks
						<button onclick={refreshData}>
							<RefreshIcon class="h-4 w-4 text-muted-foreground" />
						</button></CardTitle
					>
				</div>
			</CardHeader>
			<CardContent>
				<FeedbackTable {data} />
			</CardContent>
		</Card>
	</div>
</main>
