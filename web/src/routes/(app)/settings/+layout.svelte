<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import BookImageIcon from '$lib/components/icons/common/book-image.svelte';
	import MailCheckIcon from '$lib/components/icons/common/mail-check.svelte';
	import UserRoundPenIcon from '$lib/components/icons/common/user-round-pen.svelte';
	import KeyboardIcon from '$lib/components/icons/common/keyboard.svelte';
	import TrashIcon from '$lib/components/icons/common/trash-2.svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const navigation = [
		{
			title: 'Avatar',
			href: '/settings/avatar',
			icon: BookImageIcon
		},
		{
			title: 'Email',
			href: '/settings/email',
			icon: MailCheckIcon
		},
		{
			title: 'Your Name',
			href: '/settings/username',
			icon: UserRoundPenIcon
		},
		{
			title: 'Password',
			href: '/settings/password',
			icon: KeyboardIcon
		},
		{
			title: 'Delete Account',
			href: '/settings/delete-account',
			icon: TrashIcon,
			danger: true
		}
	];
</script>

<div
	class="grid w-full items-start gap-12 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr] px-8 pt-8"
>
	<nav class="grid items-start text-sm font-medium gap-4">
		{#each navigation as { title, href, icon, danger }}
			{@const isActive = $page.url.pathname.endsWith(href)}

			<a
				{href}
				class={cn(
					isActive && 'bg-muted-foreground/5',
					danger
						? 'flex items-center gap-3 rounded-lg px-3 py-2 text-destructive transition-all hover:text-destructive/80'
						: 'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
				)}
			>
				{#if icon}
					{@const Icon = icon}
					<Icon />
				{/if}
				{title}
			</a>
		{/each}
	</nav>
	<div class="grid gap-6 max-w-2xl">
		{@render children?.()}
	</div>
</div>
