<script lang="ts">
	interface Props {
		url: string;
		imageLight?: string;
		imageDark?: string;
		video?: string;
		poster?: string;
		alt?: string;
	}

	let { url, imageLight, imageDark, video, poster, alt = 'Preview' }: Props = $props();

	let videoEl = $state<HTMLVideoElement>();

	// Lazy-load videos: defer the download and only play while in view.
	$effect(() => {
		const el = videoEl;
		if (!el || !video) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						if (!el.src) el.src = video; // fetch the file only once, on first reveal
						el.play().catch(() => {}); // ignore autoplay rejections
					} else {
						el.pause();
					}
				}
			},
			{ rootMargin: '200px', threshold: 0.1 }
		);

		observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<div class="overflow-hidden border border-border bg-card shadow-md">
	<div class="flex items-center gap-2 border-b border-border bg-muted px-4 py-3">
		<div class="size-3 rounded-full border border-border bg-primary"></div>
		<div class="size-3 rounded-full border border-border bg-secondary"></div>
		<div class="size-3 rounded-full border border-border bg-accent"></div>
		<div class="ml-3 flex-1 border border-border bg-background px-3 py-1 font-mono text-xs text-muted-foreground">
			{url}
		</div>
	</div>
	<div class="relative aspect-video overflow-hidden">
		{#if video}
			<video
				bind:this={videoEl}
				{poster}
				class="h-full w-full object-cover object-top"
				preload="none"
				muted
				loop
				playsinline
				aria-label={alt}
			></video>
		{:else}
			<img src={imageLight} {alt} class="h-full w-full object-cover object-top dark:hidden" />
			<img src={imageDark} {alt} class="hidden h-full w-full object-cover object-top dark:block" />
		{/if}
	</div>
</div>
