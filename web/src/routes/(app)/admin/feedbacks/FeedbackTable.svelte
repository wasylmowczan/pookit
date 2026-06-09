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
	import { Button } from '$lib/components/ui/button';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import RespondDialog from './RespondDialog.svelte';
	import DeleteFeedbackDialog from './DeleteFeedbackDialog.svelte';

	let { data }: { data: any } = $props();

	let respondDialogOpen = $state(false);
	let respondTarget = $state<{ id: string; name: string; email: string; feedback: string } | null>(
		null
	);

	let deleteDialogOpen = $state(false);
	let deleteTarget = $state<{ id: string; name: string; email: string } | null>(null);

	function openRespondDialog(row: any) {
		respondTarget = { id: row.id, name: row.name, email: row.email, feedback: row.feedback };
		respondDialogOpen = true;
	}

	function openDeleteDialog(row: any) {
		deleteTarget = { id: row.id, name: row.name, email: row.email };
		deleteDialogOpen = true;
	}
</script>

<RespondDialog bind:open={respondDialogOpen} feedback={respondTarget} />
<DeleteFeedbackDialog bind:open={deleteDialogOpen} feedback={deleteTarget} />

<div>
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>ID</TableHead>
				<TableHead>Name</TableHead>
				<TableHead>Email</TableHead>
				<TableHead>Feedback</TableHead>
				<TableHead>Status</TableHead>
				<TableHead>Created</TableHead>
				<TableHead class="w-10"></TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#if data.data.length === 0}
				<TableRow>
					<TableCell colspan={7} class="h-24 text-center text-muted-foreground">
						No records yet.
					</TableCell>
				</TableRow>
			{/if}
			{#each data.data as row}
				<TableRow>
					<TableCell class="font-mono text-xs">{row.id}</TableCell>
					<TableCell class="font-medium">{row.name}</TableCell>
					<TableCell>{row.email}</TableCell>
					<TableCell class="max-w-xs truncate">{row.feedback}</TableCell>
					<TableCell>
						{#if row.responded}
							<Badge class="bg-emerald-500 text-white">Responded</Badge>
						{:else}
							<Badge variant="outline">Pending</Badge>
						{/if}
					</TableCell>
					<TableCell>{row.created}</TableCell>
					<TableCell>
						<DropdownMenu>
							<DropdownMenuTrigger>
								{#snippet child({ props })}
									<Button variant="ghost" size="icon" class="h-8 w-8" {...props}>
										<MoreHorizontal class="h-4 w-4" />
										<span class="sr-only">Open menu</span>
									</Button>
								{/snippet}
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onclick={() => openRespondDialog(row)}>
									Respond
								</DropdownMenuItem>
								<form
									action="/admin/feedbacks?/markResponded"
									method="POST"
									use:enhance={() =>
										async ({ result, update }) => {
											if (result.type === 'success') {
												await invalidateAll();
											} else {
												await update();
											}
										}}
								>
									<input type="hidden" name="feedbackId" value={row.id} />
									<input type="hidden" name="value" value={row.responded ? 'false' : 'true'} />
									<DropdownMenuItem
										onclick={(e) =>
											(e.currentTarget.closest('form') as HTMLFormElement)?.requestSubmit()}
									>
										{row.responded ? 'Mark as not responded' : 'Mark as responded'}
									</DropdownMenuItem>
								</form>
								<DropdownMenuSeparator />
								<DropdownMenuItem variant="destructive" onclick={() => openDeleteDialog(row)}>
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>
