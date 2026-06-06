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

<div>
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>ID</TableHead>
				<TableHead>Name</TableHead>
				<TableHead>Email</TableHead>
				<TableHead>Feedback</TableHead>
				<TableHead>Created</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each data.data as row}
				<TableRow>
					<TableCell class="font-mono text-xs">{row.id}</TableCell>
					<TableCell class="font-medium">{row.name}</TableCell>
					<TableCell>{row.email}</TableCell>
					<TableCell>{row.feedback}</TableCell>
					<TableCell>{row.created}</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>
