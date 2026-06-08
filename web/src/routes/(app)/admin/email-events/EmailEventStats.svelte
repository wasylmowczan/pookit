<script lang="ts">
	import {
		TriangleAlert,
		ThumbsDown,
		CircleCheck,
		Mail
	} from '@lucide/svelte';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';

	let { data } = $props();

	const total = $derived(data.data.length);
	const bounced = $derived(data.data.filter((e: { event_type: string }) => e.event_type === 'email.bounced').length);
	const complained = $derived(data.data.filter((e: { event_type: string }) => e.event_type === 'email.complained').length);
	const delivered = $derived(data.data.filter((e: { event_type: string }) => e.event_type === 'email.delivered').length);

	const stats = $derived([
		{ title: 'Total Events', value: total, icon: Mail },
		{ title: 'Delivered', value: delivered, icon: CircleCheck },
		{ title: 'Bounced', value: bounced, icon: TriangleAlert },
		{ title: 'Complained', value: complained, icon: ThumbsDown }
	]);
</script>

<div class="grid gap-4 md:grid-cols-4">
	{#each stats as stat}
		<Card class="shadow-sm">
			<CardHeader class="flex flex-row items-center justify-between pb-2">
				<CardTitle class="text-sm font-medium">{stat.title}</CardTitle>
				<stat.icon class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{stat.value}</div>
			</CardContent>
		</Card>
	{/each}
</div>
