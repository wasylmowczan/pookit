<script lang="ts">
	import { config } from '$lib/config-client';

	const appName = config.appName;
	const appUrl = config.baseUrl;

	const faqs = [
		{
			question: `What is ${appName}?`,
			answer: `${appName} is a SvelteKit + PocketBase SaaS boilerplate to help you ship your product faster.`
		},
		{
			question: 'What technologies does it use?',
			answer:
				'It is built with SvelteKit for the frontend, PocketBase as the backend and database, Tailwind CSS for styling, and Stripe for payments.'
		},
		{
			question: 'Do I need to set up my own server?',
			answer:
				'PocketBase is a single binary that you can run anywhere. You can self-host it on any VPS or cloud provider in minutes.'
		},
		{
			question: 'Does it include authentication?',
			answer:
				'Yes, authentication is handled out of the box by PocketBase, including email/password, OAuth providers, and email verification flows.'
		},
		{
			question: 'Does it include payments?',
			answer: 'Yes, Stripe subscriptions and one-time payments are pre-configured and ready to use.'
		},
		{
			question: 'Can I customize it?',
			answer:
				'Absolutely. The boilerplate is designed to be a starting point — every part of the codebase can be modified to fit your product.'
		}
	];

	let mappedFaqs = faqs
		.map((faq) => {
			return `{
            "@type": "Question",
            "name": "${faq.question}",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "${faq.answer}"
            }
        }`;
		})
		.join(',');
</script>

<!-- Organization Schema -->
{@html `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "url": "${appUrl}",
      "name": "${appName}",
      "description": "${appName} is a SvelteKit + PocketBase SaaS boilerplate to help you ship your product faster.",
      "logo": "${appUrl}/favicon.svg"
    }
</script>`}

<!-- FAQ Schema -->
{@html `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [${mappedFaqs}]
    }
</script>`}

<!-- WebSite Schema -->
{@html `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": "${appUrl}",
      "name": "${appName}",
      "description": "${appName} is a SvelteKit + PocketBase SaaS boilerplate to help you ship your product faster.",
      "image": "${appUrl}/seo-image.png"
    }
</script>`}

<!-- Breadcrumb Schema -->
{@html `<script type="application/ld+json">
    {
      "@context": "http://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": "1",
          "name": "Home",
          "item": "${appUrl}"
        },
        {
          "@type": "ListItem",
          "position": "4",
          "name": "FAQ",
          "item": "${appUrl}/#faq"
        }
      ]
    }
</script>`}
