<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import { Card } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { FormControl, FormField } from '$lib/components/ui/form';
	import { fileProxy, superForm } from 'sveltekit-superforms';
	import { untrack } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { Camera, LoaderCircle, Trash } from '@lucide/svelte';
	import AltAvatar from '$lib/assets/alt-avatar.svg';
	import { zod4 as zod } from 'sveltekit-superforms/adapters';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import FormFieldErrors from '$lib/components/ui/form/form-field-errors.svelte';
	import CardFooter from '$lib/components/ui/card/card-footer.svelte';
	import FormLabel from '$lib/components/ui/form/form-label.svelte';
	import { UpdateProfileSchema } from '$lib/schemas.js';
	import { config } from '$lib/config-client.js';

	let { data } = $props();

	let loading = $state(false);
	let avatarPreview: string | null = $state(null);
	let currentAvatarUrl: string | null = $state(null);

	const form = superForm(
		untrack(() => data.form),
		{
			dataType: 'json',
			validators: zod(UpdateProfileSchema),
			resetForm: false,
			onSubmit: () => {
				loading = true;
			},
			onResult({ result }) {
				loading = false;
				if (result.type === 'success') {
					toast.success('Profile updated.');
				} else {
					toast.error('Failed to update profile.');
				}
			}
		}
	);

	const file = fileProxy(form, 'avatar');
	const { form: formData, enhance } = form;

	const avatarState = writable({
		currentAvatarUrl: untrack(() =>
			data.user?.avatar
				? `${config.pbUrl}/api/files/${data.user.collectionId}/${data.user.id}/${data.user.avatar}`
				: null
		)
	});

	function updateAvatar(url: string | null) {
		avatarState.update((s) => {
			s.currentAvatarUrl = url;
			return s;
		});
	}

	onMount(() => {
		updateAvatar(
			data.user?.avatar
				? `${config.pbUrl}/api/files/${data.user.collectionId}/${data.user.id}/${data.user.avatar}`
				: null
		);
	});

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;

		if (!target.files || target.files.length === 0) {
			console.error('No file selected');
			return;
		}

		const file = target.files[0];
		if (!file) {
			console.error('File is undefined');
			return;
		}

		avatarPreview = URL.createObjectURL(file);
	}

	function deleteAvatar() {
		avatarPreview = null;
		updateAvatar(null);
		formData.update(($formData) => {
			$formData['avatar'] = null;
			return $formData;
		});
	}

	const unsubscribe = avatarState.subscribe((value) => {
		currentAvatarUrl = value.currentAvatarUrl;
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<Card class="shadow-sm">
	<form method="POST" action="?/updateProfile" use:enhance enctype="multipart/form-data">
		<CardHeader>
			<CardTitle>Profile</CardTitle>
			<CardDescription>Update your name and avatar.</CardDescription>
		</CardHeader>
		<CardContent class="flex flex-col gap-6">
			<div>
				<div class="w-32 h-32 mx-auto mb-4">
					{#if avatarPreview || currentAvatarUrl}
						<img
							src={avatarPreview || currentAvatarUrl}
							alt="Avatar"
							class="w-full h-full object-cover rounded-full"
						/>
					{:else}
						<img src={AltAvatar} alt="avatar" />
					{/if}
				</div>
				<div class="flex gap-2">
					<FormField {form} name="avatar" class="w-full">
						<FormControl>
							<Button
								variant="outline"
								class="w-full gap-2"
								onclick={() => document.getElementById('upload')?.click()}
							>
								<Camera />
								Change
							</Button>
							<input
								onchange={handleFileChange}
								id="upload"
								hidden
								type="file"
								name="avatar"
								bind:files={$file}
							/>
						</FormControl>
						<FormFieldErrors />
					</FormField>
					{#if avatarPreview || currentAvatarUrl}
						<FormField {form} name="avatar" class="w-full">
							<FormControl>
								<Button variant="outline" class="w-full gap-2" onclick={deleteAvatar}>
									<Trash />
									Delete
								</Button>
							</FormControl>
							<FormFieldErrors />
						</FormField>
					{/if}
				</div>
			</div>

			<FormField {form} name="name">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel>Name</FormLabel>
						<Input {...props} bind:value={$formData.name} />
					{/snippet}
				</FormControl>
				<FormFieldErrors />
			</FormField>
		</CardContent>
		<CardFooter class="border-t px-6 py-4">
			<Button type="submit" disabled={loading}>
				{#if loading}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Save
			</Button>
		</CardFooter>
	</form>
</Card>
