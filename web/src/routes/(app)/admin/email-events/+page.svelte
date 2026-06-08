<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import EmailEventStats from './EmailEventStats.svelte';
	import EmailEventTable from './EmailEventTable.svelte';
	import { RotateCw as RefreshIcon } from '@lucide/svelte';

	let { data }: { data: any } = $props();

	function refreshData(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		event.preventDefault();
		event.stopPropagation();
		window.location.reload();
	}
</script>

<main class="min-h-screen w-full p-6">
	<div class="space-y-6">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Email Events</h1>
			<p>Delivery status, bounces, and spam complaints from Resend.</p>
		</div>

		<EmailEventStats {data} />

		<Card class="shadow-sm">
			<CardHeader>
				<div class="flex items-center justify-between">
					<CardTitle>
						All Events
						<button onclick={refreshData}>
							<RefreshIcon class="h-4 w-4" />
						</button>
					</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<EmailEventTable {data} />
			</CardContent>
		</Card>
	</div>
</main>
