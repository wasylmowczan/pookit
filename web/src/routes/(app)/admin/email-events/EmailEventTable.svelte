<script lang="ts">
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';

	let { data }: { data: any } = $props();

	function badgeVariant(eventType: string) {
		if (eventType === 'email.bounced') return 'destructive';
		if (eventType === 'email.complained') return 'destructive';
		return 'secondary';
	}

	function eventLabel(eventType: string) {
		return eventType.replace('email.', '');
	}
</script>

<div>
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>Event</TableHead>
				<TableHead>To</TableHead>
				<TableHead>Subject</TableHead>
				<TableHead>Email ID</TableHead>
				<TableHead>Date</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each data.data as row}
				<TableRow>
					<TableCell>
						<Badge variant={badgeVariant(row.event_type)}>
							{eventLabel(row.event_type)}
						</Badge>
					</TableCell>
					<TableCell class="font-medium">{row.to}</TableCell>
					<TableCell class="max-w-xs truncate">{row.subject}</TableCell>
					<TableCell class="font-mono text-xs text-muted-foreground">{row.email_id}</TableCell>
					<TableCell>{new Date(row.created).toLocaleString()}</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>
