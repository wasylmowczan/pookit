<script lang="ts">
	import { Menu, X } from '@lucide/svelte/icons';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ThemeSwitcher } from '$lib/components/modules/index';
	import { cn } from '$lib/utils';
	import Logo from '../Logo.svelte';

	interface Props {
		menuItems: {
			name: string;
			href: string;
		}[];
	}

	let { menuItems }: Props = $props();

	let isScrolled = $state(false);
	let menuState = $state(false);

	$effect(() => {
		const onScroll = () => {
			isScrolled = window.scrollY > 20;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<header>
	<nav class="fixed z-20 w-full">
		<div
			class={cn(
				'w-full bg-muted px-6 transition-all duration-300 lg:px-12',
				isScrolled && 'border-b'
			)}
		>
			<div class="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
				<div class="flex w-full justify-between lg:w-auto">
					<a href="/" aria-label="home" class="flex items-center space-x-2">
						<Logo />
					</a>
					<button
						onclick={() => (menuState = !menuState)}
						aria-label={menuState ? 'Close Menu' : 'Open Menu'}
						class="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
					>
						<Menu
							class={cn(
								'm-auto size-6 duration-200',
								menuState && 'scale-0 rotate-180 opacity-0'
							)}
						/>
						<X
							class={cn(
								'absolute inset-0 m-auto size-6 scale-0 -rotate-180 opacity-0 duration-200',
								menuState && 'scale-100 rotate-0 opacity-100'
							)}
						/>
					</button>
				</div>

				<div class="absolute inset-0 m-auto hidden size-fit lg:block">
					<ul class="flex gap-8 text-sm">
						{#each menuItems as item}
							<li>
								<a
									href={item.href}
									class="block text-muted-foreground duration-150 hover:text-foreground"
								>
									{item.name}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<div
					class={cn(
						'mb-6 w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border bg-background p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent',
						menuState ? 'block lg:flex' : 'hidden lg:flex'
					)}
				>
					<div class="lg:hidden">
						<ul class="space-y-6 text-base">
							{#each menuItems as item}
								<li>
									<a
										href={item.href}
										class="block text-muted-foreground duration-150 hover:text-foreground"
									>
										{item.name}
									</a>
								</li>
							{/each}
						</ul>
					</div>

					<div class="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit items-center">
						<ThemeSwitcher />
						<Button size="sm" href="/login">Get Started</Button>
					</div>
				</div>
			</div>
		</div>
	</nav>
</header>
