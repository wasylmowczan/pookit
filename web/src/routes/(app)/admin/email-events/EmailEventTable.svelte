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
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ChevronsLeft from '@lucide/svelte/icons/chevrons-left';
	import ChevronsRight from '@lucide/svelte/icons/chevrons-right';

	let { data }: { data: any } = $props();

	let currentPage = $state(1);
	let rowsPerPage = $state(10);

	let totalPages = $derived(Math.max(1, Math.ceil(data.data.length / rowsPerPage)));
	let paginated = $derived(
		data.data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
	);

	function goToPage(page: number) {
		currentPage = Math.max(1, Math.min(page, totalPages));
	}

	function handleRowsPerPageChange(e: Event) {
		rowsPerPage = parseInt((e.target as HTMLSelectElement).value);
		currentPage = 1;
	}

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
			</TableRow>
		</TableHeader>
		<TableBody>
			{#if paginated.length === 0}
				<TableRow>
					<TableCell colspan={4} class="h-24 text-center text-muted-foreground">
						No records yet.
					</TableCell>
				</TableRow>
			{/if}
			{#each paginated as row}
				<TableRow>
					<TableCell>
						<Badge variant={badgeVariant(row.event_type)}>
							{eventLabel(row.event_type)}
						</Badge>
					</TableCell>
					<TableCell class="font-medium">{row.to}</TableCell>
					<TableCell class="max-w-xs truncate">{row.subject}</TableCell>
					<TableCell class="font-mono text-xs text-muted-foreground">{row.email_id}</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>

	<div class="flex items-center justify-end gap-6 px-4 py-3 text-sm text-muted-foreground">
		<div class="flex items-center gap-2">
			<span>Rows per page</span>
			<select
				value={rowsPerPage}
				onchange={handleRowsPerPageChange}
				class="h-8 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
			>
				<option value={10}>10</option>
				<option value={20}>20</option>
				<option value={50}>50</option>
				<option value={100}>100</option>
			</select>
		</div>

		<span>Page {currentPage} of {totalPages}</span>

		<div class="flex items-center gap-1">
			<Button
				variant="outline"
				size="icon"
				class="h-8 w-8"
				onclick={() => goToPage(1)}
				disabled={currentPage === 1}
			>
				<ChevronsLeft class="h-4 w-4" />
			</Button>
			<Button
				variant="outline"
				size="icon"
				class="h-8 w-8"
				onclick={() => goToPage(currentPage - 1)}
				disabled={currentPage === 1}
			>
				<ChevronLeft class="h-4 w-4" />
			</Button>
			<Button
				variant="outline"
				size="icon"
				class="h-8 w-8"
				onclick={() => goToPage(currentPage + 1)}
				disabled={currentPage === totalPages}
			>
				<ChevronRight class="h-4 w-4" />
			</Button>
			<Button
				variant="outline"
				size="icon"
				class="h-8 w-8"
				onclick={() => goToPage(totalPages)}
				disabled={currentPage === totalPages}
			>
				<ChevronsRight class="h-4 w-4" />
			</Button>
		</div>
	</div>
</div>
