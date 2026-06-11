<script lang="ts">
	import altAvatar from '$lib/assets/alt-avatar.svg';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { Seo, ThemeSwitcher } from '$lib/components/modules';
	import { Command } from '@lucide/svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import RoadmapIcon from '$lib/components/icons/common/plain.svelte';
	import SpeechIcon from '$lib/components/icons/common/speech.svelte';
	import UsersIcon from '$lib/components/icons/common/users.svelte';
	import DashboardIcon from '$lib/components/icons/common/dashboard.svelte';
	import MailCheckIcon from '$lib/components/icons/common/mail-check.svelte';
	import { config } from '$lib/config-client';
	import { posthog } from 'posthog-js';
	import BanIcon from '@lucide/svelte/icons/ban';

	let { data, children } = $props();

	const currentAvatarUrl = $derived(
		data.user?.avatar
			? `${config.pbUrl}/api/files/${data.user.collectionId}/${data.user.id}/${data.user.avatar}`
			: altAvatar
	);

	let showNavAdmin = $derived(data.isAdmin);

	const menu = $derived({
		navMain: {
			label: 'User Panel',
			items: [
				{
					title: 'Dashboard',
					url: '/dashboard',
					icon: DashboardIcon,
					isActive: true
				}
			]
		},
		navAdmin: {
			label: 'Admin Panel',
			items: [
				{
					name: 'Users',
					url: '/admin/users',
					icon: UsersIcon
				},
				{
					name: 'Feedbacks',
					url: '/admin/feedbacks',
					icon: SpeechIcon
				},
				{
					name: 'Email Events',
					url: '/admin/email-events',
					icon: MailCheckIcon
				}
			]
		},
		navSecondary: [
			{
				title: 'Feedback',
				url: '/feedback',
				icon: SpeechIcon
			},
			{
				title: 'Roadmap',
				url: '/roadmap',
				icon: RoadmapIcon
			}
		],
		user: {
			name: data.user?.name || data.user?.username,
			email: data.user?.email,
			avatar: currentAvatarUrl
		}
	});

	$effect(() => {
		posthog.identify(data.user?.email, {
			email: data.user?.email,
			name: data.user?.name
		});
	});
</script>

<Seo />

{#if data.activeBan}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-background p-6">
		<!-- subtle radial glow behind the card -->
		<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
			<div class="h-[480px] w-[480px] rounded-full bg-destructive/5 blur-3xl"></div>
		</div>

		<div class="relative flex w-full max-w-sm flex-col items-center gap-8 text-center">
			<!-- icon -->
			<div class="relative">
				<div class="absolute inset-0 rounded-full bg-destructive/20 blur-xl"></div>
				<div
					class="relative flex h-20 w-20 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10 shadow-sm"
				>
					<BanIcon class="h-9 w-9 text-destructive" strokeWidth={1.5} />
				</div>
			</div>

			<!-- heading -->
			<div class="space-y-2">
				<h1 class="text-3xl font-bold tracking-tight">Account Suspended</h1>
				<p class="text-sm text-muted-foreground leading-relaxed">
					Your access to this application has been revoked by an administrator.
				</p>
			</div>

			<!-- details card -->
			<div class="w-full overflow-hidden rounded-xl border bg-card shadow-sm">
				<div class="border-b px-5 py-4">
					<p class="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
						Reason
					</p>
					<p class="mt-1.5 text-sm font-medium">{data.activeBan.reason}</p>
				</div>
				<div class="px-5 py-4">
					<p class="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
						{data.activeBan.expires ? 'Expires' : 'Duration'}
					</p>
					<p class="mt-1.5 text-sm font-medium">
						{#if data.activeBan.expires}
							{new Date(data.activeBan.expires).toLocaleString(undefined, {
								dateStyle: 'medium',
								timeStyle: 'short'
							})}
						{:else}
							Permanent
						{/if}
					</p>
				</div>
			</div>

			<!-- footer -->
			<div class="flex flex-col items-center gap-3">
				<p class="text-xs text-muted-foreground">
					If you believe this is a mistake, reach out to us at
					<a
						href="mailto:mowczanwasyl@gmail.com"
						class="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80 transition-colors"
					>
						mowczanwasyl@gmail.com
					</a>
					and we'll review your case.
				</p>
				<button
					class="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
					onclick={async () => {
						await fetch('/api/logout');
						window.location.href = '/';
					}}
				>
					Sign out
				</button>
			</div>
		</div>
	</div>
{:else}
	{#if data.isImpersonating}
		<div
			class="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 bg-amber-400 px-4 py-2 text-sm font-medium text-amber-950"
		>
			<span>Impersonating <strong>{data.user?.email}</strong></span>
			<a
				href="/api/impersonate-exit"
				class="rounded-md bg-amber-950/10 px-3 py-1 text-xs font-semibold transition-colors hover:bg-amber-950/20"
			>
				Exit impersonation
			</a>
		</div>
	{/if}
	<Sidebar.Provider class={data.isImpersonating ? 'pt-9' : ''}>
		<AppSidebar {menu} {showNavAdmin} user={data.user} />
		<Sidebar.Inset>
			<header class="flex h-16 shrink-0 items-center justify-between gap-2">
				<div class="flex items-center gap-2 px-4">
					<Sidebar.Trigger class="-ml-1" />
					<Separator orientation="vertical" class="mr-2 h-6" />
					<Command size={16} /> + B
				</div>
				<div class="flex items-center gap-4 px-4">
					<ThemeSwitcher />
				</div>
			</header>
			{@render children?.()}
		</Sidebar.Inset>
	</Sidebar.Provider>
{/if}
