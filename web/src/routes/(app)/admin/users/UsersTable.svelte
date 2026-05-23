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
	import { cn } from '$lib/utils';
	import altAvatar from '$lib/assets/alt-avatar.svg';
	import { config } from '$lib/config-client';

	// Props
	let { data, searchQuery }: { data: any; searchQuery: string } = $props();

	// Filtered users based on search query
	let filteredUsers = $derived(
		data.data.filter((user: any) => {
			const terms = searchQuery?.toLowerCase().trim().split(/\s+/) || []; // Ensure searchQuery is defined
			const fullName = user.name?.toLowerCase().trim().split(/\s+/) || []; // Ensure user.name is defined
			const emailParts = user.email?.toLowerCase().trim().split(/[@.]/) || []; // Ensure user.email is defined

			// Check if every search term exists in any part of the full name or email
			return terms.every(
				(term) =>
					fullName.some((part: string | string[]) => part.includes(term)) || // Match against name parts
					emailParts.some((part: string | string[]) => part.includes(term)) // Match against email parts
			);
		})
	);
</script>

<div class="rounded-md border dark:border-primary">
	<Table class="dark:border-primary">
		<TableHeader class="dark:border-primary">
			<TableRow class="dark:border-primary">
				<TableHead>User</TableHead>
				<TableHead>Id</TableHead>
				<TableHead>Username</TableHead>
				<TableHead>Email</TableHead>
				<TableHead>Status</TableHead>
				<TableHead>Created</TableHead>
				<TableHead>Updated</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each filteredUsers as user}
				<TableRow class="dark:border-primary">
					<TableCell class="dark:border-primary">
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
					<TableCell>{user.id || 'N/A'}</TableCell>
					<TableCell>{user.name || 'N/A'}</TableCell>
					<TableCell>{user.email || 'N/A'}</TableCell>
					<TableCell>
						<Badge
							class={cn(
								user.verified === true && 'bg-emerald-500',
								user.verified === false && 'bg-gray-500'
							)}
						>
							{user.verified ? 'Verified' : 'Unverified'}
						</Badge>
					</TableCell>
					<TableCell>{user.created || 'N/A'}</TableCell>
					<TableCell>{user.updated || 'N/A'}</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>
