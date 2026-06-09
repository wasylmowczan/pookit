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
	import { Checkbox } from '$lib/components/ui/checkbox';
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
	import { cn } from '$lib/utils';
	import altAvatar from '$lib/assets/alt-avatar.svg';
	import { config } from '$lib/config-client';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ChevronsLeft from '@lucide/svelte/icons/chevrons-left';
	import ChevronsRight from '@lucide/svelte/icons/chevrons-right';
	import BanDialog from './BanDialog.svelte';

	let { data, searchQuery }: { data: any; searchQuery: string } = $props();

	let currentPage = $state(1);
	let rowsPerPage = $state(10);
	let selectedRows = $state<Set<string>>(new Set());

	// Ban dialog state
	let banDialogOpen = $state(false);
	let banTarget = $state<{ id: string; name?: string; username?: string; email: string } | null>(null);

	let filteredUsers = $derived(
		data.data.filter((user: any) => {
			const terms = searchQuery?.toLowerCase().trim().split(/\s+/) || [];
			const fullName = user.name?.toLowerCase().trim().split(/\s+/) || [];
			const emailParts = user.email?.toLowerCase().trim().split(/[@.]/) || [];
			return terms.every(
				(term: string) =>
					fullName.some((part: string) => part.includes(term)) ||
					emailParts.some((part: string) => part.includes(term))
			);
		})
	);

	$effect(() => {
		void searchQuery;
		currentPage = 1;
		selectedRows = new Set();
	});

	let totalPages = $derived(Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage)));

	let paginatedUsers = $derived(
		filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
	);

	let allPageSelected = $derived(
		paginatedUsers.length > 0 && paginatedUsers.every((u: any) => selectedRows.has(u.id))
	);

	let somePageSelected = $derived(
		paginatedUsers.some((u: any) => selectedRows.has(u.id)) && !allPageSelected
	);

	function toggleAll(checked: boolean | 'indeterminate') {
		const next = new Set(selectedRows);
		for (const u of paginatedUsers) {
			if (checked === true) next.add(u.id);
			else next.delete(u.id);
		}
		selectedRows = next;
	}

	function toggleRow(id: string) {
		const next = new Set(selectedRows);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		selectedRows = next;
	}

	function goToPage(page: number) {
		currentPage = Math.max(1, Math.min(page, totalPages));
	}

	function handleRowsPerPageChange(e: Event) {
		rowsPerPage = parseInt((e.target as HTMLSelectElement).value);
		currentPage = 1;
		selectedRows = new Set();
	}

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
	}

	function openBanDialog(user: any) {
		banTarget = { id: user.id, name: user.name, username: user.username, email: user.email };
		banDialogOpen = true;
	}

	function isActiveBan(user: any): boolean {
		if (!user.banned) return false;
		if (!user.ban_expires) return true;
		return new Date(user.ban_expires) > new Date();
	}
</script>

<BanDialog bind:open={banDialogOpen} user={banTarget} />

<div>
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead class="w-10">
					<Checkbox
						checked={allPageSelected}
						indeterminate={somePageSelected}
						onCheckedChange={toggleAll}
						aria-label="Select all"
					/>
				</TableHead>
				<TableHead>User</TableHead>
				<TableHead>Id</TableHead>
				<TableHead>Username</TableHead>
				<TableHead>Email</TableHead>
				<TableHead>Status</TableHead>
				<TableHead>Created</TableHead>
				<TableHead>Updated</TableHead>
				<TableHead class="w-10"></TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#if paginatedUsers.length === 0}
				<TableRow>
					<TableCell colspan={9} class="h-24 text-center text-muted-foreground">
						No users found.
					</TableCell>
				</TableRow>
			{/if}
			{#each paginatedUsers as user}
				{@const banned = isActiveBan(user)}
				<TableRow
					data-state={selectedRows.has(user.id) ? 'selected' : undefined}
					class={cn(banned && 'opacity-60')}
				>
					<TableCell>
						<Checkbox
							checked={selectedRows.has(user.id)}
							onCheckedChange={() => toggleRow(user.id)}
							aria-label="Select row"
						/>
					</TableCell>
					<TableCell>
						<div class="flex items-center gap-3">
							{#if user.avatar}
								<img
									src={`${config.pbUrl}/api/files/_pb_users_auth_/${user.id}/${user.avatar}`}
									alt={user.name}
									class="h-8 w-8 rounded-full"
								/>
							{:else}
								<img src={altAvatar} alt={user.name} class="h-8 w-8 rounded-full" />
							{/if}
							<div>
								<p class="font-medium">{user.name || user.username || 'N/A'}</p>
								<p class="text-sm text-muted-foreground">{user.email || 'N/A'}</p>
							</div>
						</div>
					</TableCell>
					<TableCell class="font-mono text-xs">{user.id || 'N/A'}</TableCell>
					<TableCell>{user.name || 'N/A'}</TableCell>
					<TableCell>{user.email || 'N/A'}</TableCell>
					<TableCell>
						<div class="flex flex-wrap gap-1">
							{#if banned}
								<Badge class="bg-red-600 text-white">Banned</Badge>
							{/if}
							<Badge
								class={cn(
									user.verified === true && 'bg-emerald-500',
									user.verified === false && 'bg-gray-500'
								)}
							>
								{user.verified ? 'Verified' : 'Unverified'}
							</Badge>
						</div>
					</TableCell>
					<TableCell>{user.created || 'N/A'}</TableCell>
					<TableCell>{user.updated || 'N/A'}</TableCell>
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
								<DropdownMenuItem onclick={() => copyToClipboard(user.id)}>
									Copy ID
								</DropdownMenuItem>
								<DropdownMenuItem onclick={() => copyToClipboard(user.email)}>
									Copy email
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								{#if banned}
									<form
										action="/admin/users?/liftBan"
										method="POST"
										use:enhance={() => async ({ result, update }) => {
											if (result.type === 'success') {
												await invalidateAll();
											} else {
												await update();
											}
										}}
									>
										<input type="hidden" name="userId" value={user.id} />
										<DropdownMenuItem
											class="cursor-pointer text-emerald-600 focus:text-emerald-600"
											onclick={(e) => (e.currentTarget.closest('form') as HTMLFormElement)?.requestSubmit()}
										>
											Lift ban
										</DropdownMenuItem>
									</form>
								{:else}
									<DropdownMenuItem
										class="text-destructive focus:text-destructive"
										onclick={() => openBanDialog(user)}
									>
										Ban user
									</DropdownMenuItem>
								{/if}
								<DropdownMenuSeparator />
								<DropdownMenuItem class="text-destructive focus:text-destructive">
									Delete user
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>

	<!-- Pagination footer -->
	<div class="flex items-center justify-between px-4 py-3 text-sm text-muted-foreground">
		<span>{selectedRows.size} of {filteredUsers.length} row(s) selected.</span>

		<div class="flex items-center gap-6">
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
</div>
