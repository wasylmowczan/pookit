<script lang="ts">
	import UserSettingsIcon from '$lib/components/icons/common/user-settings.svelte';
	import UserRoundPenIcon from '$lib/components/icons/common/user-round-pen.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { User } from '$lib/types';

	let { user }: { user: User | null | undefined } = $props();

	const missingName = $derived(!user?.name);
	const missingAvatar = $derived(!user?.avatar);
	const isVisible = $derived(missingName || missingAvatar);

	const steps = $derived(
		[
			missingAvatar && {
				label: 'Upload a photo',
				href: '/settings/profile',
				icon: UserSettingsIcon
			},
			missingName && { label: 'Add your name', href: '/settings/profile', icon: UserRoundPenIcon }
		].filter(Boolean) as { label: string; href: string; icon: any }[]
	);
</script>

{#if isVisible}
	<Sidebar.Group>
		<Sidebar.GroupContent class="px-1">
			<div
				class="rounded-lg px-3 py-2.5"
				style="background-color: color-mix(in srgb, #FF3E00 12%, transparent);"
			>
				<p
					class="mb-2.5 text-[11px] font-semibold uppercase tracking-wider"
					style="color: #FF3E00;"
				>
					Complete your profile
				</p>
				<div class="flex flex-col gap-1">
					{#each steps as step}
						<a
							href={step.href}
							class="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors"
							style="color: color-mix(in srgb, #FF3E00 70%, white);"
							onmouseenter={(e) =>
								(e.currentTarget.style.backgroundColor =
									'color-mix(in srgb, #FF3E00 18%, transparent)')}
							onmouseleave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
						>
							<step.icon class="size-3.5 shrink-0" />
							<span>{step.label}</span>
						</a>
					{/each}
				</div>
			</div>
		</Sidebar.GroupContent>
	</Sidebar.Group>
{/if}
