<script lang="ts">
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';

	let { data }: { data: any } = $props();
</script>

<div class="rounded-md border dark:border-primary">
	<Table class="dark:border-primary">
		<TableHeader class="dark:border-primary">
			<TableRow class="dark:border-primary">
				<TableHead>User</TableHead>
				<TableHead>Feedback</TableHead>
				<TableHead>Created</TableHead>
				<TableHead>Updated</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each data.data as row}
				<TableRow>
					<TableCell class="font-medium">{row.name}</TableCell>
					<TableCell>{row.feedback}</TableCell>
					<TableCell>{row.created}</TableCell>
					<TableCell>{row.updated}</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>
