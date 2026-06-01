<script lang="ts">
	import { onMount } from 'svelte';
	import svelteLogo from '$lib/assets/svelte_logo.svg';

	// Unique suffix per instance to avoid duplicate SVG IDs when logo appears multiple times
	const uid = Math.random().toString(36).slice(2, 7);

	let mouseX = $state(0);
	let mouseY = $state(0);

	let eye1El: SVGSVGElement | null = $state(null);
	let eye2El: SVGSVGElement | null = $state(null);

	// SVG viewBox is 20×20 (rounded oval). Returns pupil center in SVG coords, clamped within iris.
	function getPupilPos(eyeEl: SVGSVGElement | null) {
		if (!eyeEl) return { x: 10, y: 10 };
		const rect = eyeEl.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		const dxSvg = ((mouseX - cx) / rect.width) * 20;
		const dySvg = ((mouseY - cy) / rect.height) * 20;
		const dist = Math.sqrt(dxSvg * dxSvg + dySvg * dySvg);
		const maxDist = 3;
		if (dist === 0) return { x: 10, y: 10 };
		const scale = Math.min(dist, maxDist) / dist;
		return { x: 10 + dxSvg * scale, y: 10 + dySvg * scale };
	}

	let pupil1 = $derived(getPupilPos(eye1El));
	let pupil2 = $derived(getPupilPos(eye2El));

	onMount(() => {
		mouseX = window.innerWidth / 2;
		mouseY = window.innerHeight / 2;
		const onMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};
		window.addEventListener('mousemove', onMove);
		return () => window.removeEventListener('mousemove', onMove);
	});
</script>

{#snippet eye(
	bindFn: (el: SVGSVGElement) => void,
	pupil: { x: number; y: number },
	clipId: string,
	style: string
)}
	<svg
		use:bindFn
		viewBox="0 0 20 20"
		xmlns="http://www.w3.org/2000/svg"
		{style}
		aria-hidden="true"
	>
		<defs>
			<clipPath id={clipId}>
				<ellipse cx="10" cy="10" rx="7.5" ry="9.2" />
			</clipPath>
		</defs>
		<!-- Sclera -->
		<ellipse cx="10" cy="10" rx="7.5" ry="9.2" fill="#f8f7f2" />
		<!-- Pupil -->
		<circle cx={pupil.x} cy={pupil.y} r="3.8" fill="#0f0f0f" clip-path="url(#{clipId})" />
		<!-- Catchlight highlight -->
		<circle cx={pupil.x + 1.3} cy={pupil.y - 1.4} r="1.2" fill="white" opacity="0.88" clip-path="url(#{clipId})" />
		<!-- Eye outline -->
		<ellipse cx="10" cy="10" rx="7.5" ry="9.2" fill="none" stroke="#1a1a1a" stroke-width="1.0" />
	</svg>
{/snippet}

<a href="/" class="flex items-center justify-center gap-2">
	<img src={svelteLogo} alt="Logo" class="w-auto shrink-0" style="height: 2rem;" />
	<span class="font-semibold text-lg flex items-center leading-none">
		<span>P</span>
		{@render eye((el) => (eye1El = el), pupil1, `ec1-${uid}`, 'width: 1.1em; height: 1.1em; vertical-align: -0.15em; display: inline-block; margin-right: -0.1em;')}
		{@render eye((el) => (eye2El = el), pupil2, `ec2-${uid}`, 'width: 1.1em; height: 1.1em; vertical-align: -0.15em; display: inline-block; margin-left: -0.1em;')}
		<span>kit</span>
	</span>
</a>
