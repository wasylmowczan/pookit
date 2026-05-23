<script lang="ts">
	import XIcon from '$lib/components/icons/brands/X.svelte';
	import InstagramIcon from '$lib/components/icons/brands/Instagram.svelte';
	import BlueSkyIcon from '$lib/components/icons/brands/BlueSky.svelte';

	import { config } from '$lib/config-client';

	interface Props {
		menuItems: {
			name: string;
			href: string;
		}[];
	}

	let { menuItems }: Props = $props();

	let socialLinks = [
		{ name: 'X', href: 'https://x.com/xxx', icon: XIcon },
		{
			name: 'BlueSky',
			href: 'https://bsky.app/profile/xxx.bsky.social',
			icon: BlueSkyIcon
		},
		{ name: 'Instagram', href: 'https://www.instagram.com/xxx', icon: InstagramIcon }
	];

	const legal = [
		{ name: 'Privacy Policy', href: '/privacy-policy' },
		{ name: 'Terms of Service', href: '/terms-of-service' }
	];

	const other = [
		{ name: 'Changelog', href: '/changelog' },
		{ name: 'Roadmap', href: '/roadmap' }
	];
</script>

<footer class="bg-muted rounded-tl-3xl rounded-tr-3xl">
	<div class="max-w-7xl mx-auto pt-12 px-4 sm:px-6 lg:py-24 lg:px-8 pb-24">
		<div class="grid md:grid-cols-4 gap-8">
			<!-- 1 column -->
			<div class="space-y-8">
				<p>A Modern SaaS foundation powered by SvelteKit and PocketBase.</p>
				<div class="flex space-x-6">
					{#each socialLinks as { name, href, icon }}
						{@const SvelteComponent = icon}
						<a {href} target="_blank">
							<span class="sr-only">{name}</span>
							<SvelteComponent customClass="w-6 h-6" />
						</a>
					{/each}
				</div>
			</div>
			<!-- 2 column -->
			<div>
				<h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-6">Product</h3>
				<ul class="space-y-4">
					{#each menuItems as { name, href }}
						<li>
							<a {href}>
								{name}
							</a>
						</li>
					{/each}
				</ul>
			</div>
			<!-- 3 column -->
			<div>
				<h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-6">Legal</h3>
				<ul class="space-y-4">
					{#each legal as { name, href }}
						<li>
							<a {href}>
								{name}
							</a>
						</li>
					{/each}
				</ul>
			</div>
			<!-- 4 column -->
			<div>
				<h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-6">Other</h3>
				<ul class="space-y-4">
					{#each other as { name, href }}
						<li>
							<a {href}>
								{name}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
	<!-- Footer Copyright -->
	<div class="mb-8 border-t dark:border-primary pt-8">
		<p class="text-gray-400 text-center">
			&copy; {new Date().getFullYear()}
			{config.appName}. All rights reserved
		</p>
	</div>
</footer>
