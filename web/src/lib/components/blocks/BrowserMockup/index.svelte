<script lang="ts">
	interface Props {
		url: string;
		imageLight: string;
		imageDark: string;
		alt?: string;
	}

	let { url, imageLight, imageDark, alt = 'Preview' }: Props = $props();
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
		<img src={imageLight} {alt} class="h-full w-full object-cover object-top dark:hidden" />
		<img src={imageDark} {alt} class="hidden h-full w-full object-cover object-top dark:block" />
	</div>
</div>
