<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { User } from '$lib/types';

	let { user }: { user: User | null | undefined } = $props();

	const allSteps = [
		{ label: 'Upload a photo', key: 'avatar' },
		{ label: 'Add your name', key: 'name' }
	];

	const steps = $derived(
		allSteps.map((step) => ({
			...step,
			done: step.key === 'avatar' ? !!user?.avatar : !!user?.name,
			href: '/settings/profile'
		}))
	);

	const completedCount = $derived(steps.filter((s) => s.done).length);
	const totalCount = allSteps.length;
	const progressPercent = $derived(Math.round((completedCount / totalCount) * 100));
	const isVisible = $derived(completedCount < totalCount);
</script>

{#if isVisible}
	<Sidebar.Group>
		<Sidebar.GroupContent class="px-1">
			<div
				class="rounded-lg px-3 py-2.5"
				style="background-color: color-mix(in srgb, #FF3E00 12%, transparent);"
			>
				<div class="mb-2 flex items-center justify-between">
					<p
						class="text-[11px] font-semibold uppercase tracking-wider"
						style="color: #FF3E00;"
					>
						Complete your profile
					</p>
					<span
						class="text-[11px] font-medium tabular-nums"
						style="color: color-mix(in srgb, #FF3E00 55%, white);"
					>
						{completedCount}/{totalCount}
					</span>
				</div>

				<div
					class="mb-2.5 h-1 overflow-hidden rounded-full"
					style="background-color: color-mix(in srgb, #FF3E00 20%, transparent);"
				>
					<div
						class="h-full rounded-full transition-all duration-500"
						style="width: {progressPercent}%; background-color: #FF3E00;"
					></div>
				</div>

				<div class="flex flex-col gap-0.5">
					{#each steps as step}
						{#if step.done}
							<div class="flex items-center gap-2 px-2 py-1.5 text-xs">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="size-3.5 shrink-0"
									viewBox="0 0 24 24"
									fill="none"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									style="stroke: #FF3E00;"
								>
									<circle cx="12" cy="12" r="10" style="fill: color-mix(in srgb, #FF3E00 25%, transparent); stroke: #FF3E00;" />
									<path d="M9 12l2 2 4-4" />
								</svg>
								<span class="line-through" style="color: color-mix(in srgb, #FF3E00 45%, white);">
									{step.label}
								</span>
							</div>
						{:else}
							<a
								href={step.href}
								class="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors"
								style="color: color-mix(in srgb, #FF3E00 70%, white);"
								onmouseenter={(e) =>
									(e.currentTarget.style.backgroundColor =
										'color-mix(in srgb, #FF3E00 18%, transparent)')}
								onmouseleave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="size-3.5 shrink-0 opacity-50"
									viewBox="0 0 24 24"
									fill="none"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									style="stroke: currentColor;"
								>
									<circle cx="12" cy="12" r="10" />
								</svg>
								<span>{step.label}</span>
							</a>
						{/if}
					{/each}
				</div>
			</div>
		</Sidebar.GroupContent>
	</Sidebar.Group>
{/if}
