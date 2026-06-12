<script lang="ts">
	import { SectionContainer } from '..';

	const colors = [
		'bg-orange-700/80 text-white border-orange-700',
		'bg-cyan-700/80 text-white border-cyan-700',
		'bg-violet-700/80 text-white border-violet-700',
		'bg-green-700/80 text-white border-green-700',
		'bg-yellow-700/80 text-white border-yellow-700',
		'bg-pink-700/80 text-white border-pink-700',
		'bg-blue-700/80 text-white border-blue-700',
		'bg-red-700/80 text-white border-red-700',
		'bg-teal-700/80 text-white border-teal-700',
		'bg-amber-700/80 text-white border-amber-700',
		'bg-indigo-700/80 text-white border-indigo-700',
		'bg-rose-700/80 text-white border-rose-700'
	];

	const tags = [
		'SvelteKit',
		'Svelte 5 Runes',
		'Tailwind CSS v4',
		'TypeScript',
		'PocketBase',
		'bits-ui',
		'Lucide Icons',
		'Valibot',
		'Zod',
		'Cloudflare Pages',
		'Cloudflare Workers',
		'Polar.sh',
		'Resend',
		'PostHog',
		'Dark Mode',
		'Mobile Friendly',
		'sveltekit-superforms',
		'formsnap',
		'svelte-motion',
		'svelte-sonner',
		'tailwind-variants',
		'mode-watcher',
		'ogl',
		'svelte-inview',
		'Email Verification',
		'Google OAuth',
		'Forgot Password',
		'User Dashboard',
		'Billing Page',
		'User Feedback',
		'Profile Settings',
		'Admin Panel',
		'User Impersonation',
		'Ban / Lift Ban',
		'Email Events',
		'Changelog',
		'Roadmap',
		'Pricing Page',
		'Welcome Email',
		'Sitemap'
	];

	const FLEE_RADIUS = 110;
	const FLEE_STRENGTH = 70;

	let tagEls: HTMLSpanElement[] = [];

	function onMouseMove(e: MouseEvent) {
		const mouseX = e.clientX;
		const mouseY = e.clientY;

		for (const tag of tagEls) {
			if (!tag) continue;
			const rect = tag.getBoundingClientRect();
			const cx = rect.left + rect.width / 2;
			const cy = rect.top + rect.height / 2;
			const dx = cx - mouseX;
			const dy = cy - mouseY;
			const dist = Math.sqrt(dx * dx + dy * dy);

			if (dist < FLEE_RADIUS) {
				const force = (FLEE_RADIUS - dist) / FLEE_RADIUS;
				const mx = (dx / dist) * FLEE_STRENGTH * force;
				const my = (dy / dist) * FLEE_STRENGTH * force;
				tag.style.transform = `translate(${mx}px, ${my}px)`;
			} else {
				tag.style.transform = '';
			}
		}
	}

	function onMouseLeave() {
		for (const tag of tagEls) {
			if (tag) tag.style.transform = '';
		}
	}
</script>

<SectionContainer
	title="Not enough for you?"
	subtitle="Even though we have a lot of features, we are still working on more. Here are some of the features that we are currently working on and will be available soon."
	contentClass="w-full"
>
	<div
		role="presentation"
		onmousemove={onMouseMove}
		onmouseleave={onMouseLeave}
		class="flex flex-wrap justify-center gap-3"
	>
		{#each tags as tag, i}
			<span
				bind:this={tagEls[i]}
				class="rounded-xl border px-4 py-2 text-sm font-medium transition-transform duration-200 ease-out {colors[
					i % colors.length
				]}"
			>
				{tag}
			</span>
		{/each}
	</div>
</SectionContainer>
