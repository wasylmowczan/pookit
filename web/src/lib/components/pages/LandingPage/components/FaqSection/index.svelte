<script lang="ts">
	import { SectionContainer } from '..';
	import * as Accordion from '$lib/components/ui/accordion';

	const faqs = [
		{
			question: 'What is Pookit?',
			answer:
				'Pookit is a SvelteKit SaaS starter kit that gives you everything you need to launch your product fast — auth, billing, admin panel, emails, and more, all pre-wired and ready to go.'
		},
		{
			question: 'Is it free or paid?',
			answer:
				'Most of the code is open source and available on GitHub. The paid version gives you extra features and my private support to help you get your project off the ground quickly. It’s a one-time purchase with no recurring fees.'
		},
		{
			question: "What's included in the license?",
			answer:
				'The license includes the complete source code, documentation, and lifetime access to updates. You can use it for multiple client or commercial projects. However, you cannot redistribute, resell, or use it for open-source projects. The license is non-transferable and non-refundable.'
		},
		{
			question: "What's the tech stack?",
			answer:
				'Pookit is built with SvelteKit, Svelte 5 Runes, Tailwind CSS v4, TypeScript, PocketBase, Polar.sh for billing, Resend for email, and PostHog for analytics.'
		},
		{
			question: 'What happens after I purchase?',
			answer:
				'You get immediate access to the private GitHub repository. You can clone it and start building right away.'
		},
		{
			question: 'Do you offer refunds?',
			answer:
				'Due to the digital nature of the product, refunds are not offered once you have accessed the repository. Please review this demo app and documentation before buying.'
		},
		{
			question: 'Can I modify the code?',
			answer:
				'Absolutely. The source code is yours to modify, extend, and build upon however you need for your projects.'
		},
		{
			question: 'What kind of support do you provide?',
			answer:
				'You get access to documentation, and you can reach out via email for help. Community support is also available through GitHub discussions.'
		},
		{
			question: 'How do I deploy the application?',
			answer:
				'Pookit is optimized for Cloudflare Pages (frontend) and PocketHost (backend), but can be deployed to any platform that supports SvelteKit and PocketBase.'
		},
		{
			question: 'Can I use Pookit for client projects?',
			answer: 'Yes, the license permits use in client projects without any additional fees.'
		},
		{
			question: 'Can I use Pookit for commercial projects?',
			answer:
				'Yes, you can build and sell commercial products built on top of Pookit under the included license.'
		},
		{
			question: 'What about security updates?',
			answer:
				'Security patches and dependency updates are pushed regularly. As a lifetime license holder you receive all updates automatically.'
		}
	];
</script>

<SectionContainer
	title="Got questions?"
	subtitle="I have tried my best to cover all the questions in the docs. If you have any other questions, feel free to reach out — I'm happy to help!"
	contentClass="max-w-3xl w-full mx-auto"
>
	<Accordion.Root type="single" class="w-full">
		{#each faqs as faq, i}
			<Accordion.Item value="item-{i}">
				<Accordion.Trigger class="text-left text-base font-medium">
					{faq.question}
				</Accordion.Trigger>
				<Accordion.Content class="text-muted-foreground">
					{faq.answer}
				</Accordion.Content>
			</Accordion.Item>
		{/each}
	</Accordion.Root>
</SectionContainer>
