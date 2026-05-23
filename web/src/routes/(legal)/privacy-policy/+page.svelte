<script>
	import { Seo } from '$lib/components/modules';
	import { config } from '$lib/config-client';

	const lastUpdated = new Date(2026, 5, 20).toLocaleDateString('en-GB', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric'
	});
</script>

<Seo
	title={`Privacy Policy - ${config.appName}`}
	description={`Privacy Policy for ${config.appName}`}
	keywords="privacy, policy, privacy policy"
/>

<section class="mb-12 p-6 dark:bg-gray-800 rounded-lg">
	<h2 class="text-2xl font-semibold mb-4 text-center">Privacy Policy 🔒</h2>
	<div class="space-y-4">
		<div>
			<h3 class="text-xl font-medium">Information Collection</h3>
			<p class="text-muted-foreground">
				We collect information you provide directly to us, such as when you create an account, use
				features of the service, or contact us for support. This may include your name, email
				address, and any content you submit through the platform.
			</p>
		</div>
		<div>
			<h3 class="text-xl font-medium">Information Use</h3>
			<p class="text-muted-foreground">
				We use the information we collect to operate and improve the service, process your requests,
				communicate with you, and enhance your overall experience.
			</p>
		</div>
		<div>
			<h3 class="text-xl font-medium">Information Sharing</h3>
			<p class="text-muted-foreground">
				We do not sell or share your personal information with third parties except as described in
				this policy or with your consent. We may share anonymized, aggregated data for analytical
				purposes.
			</p>
		</div>
		<div>
			<h3 class="text-xl font-medium">Information Security</h3>
			<p class="text-muted-foreground">
				We take reasonable measures to protect your information from loss, misuse, and unauthorized
				access, disclosure, alteration, and destruction. However, no method of transmission over the
				internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
			</p>
		</div>
		<div>
			<h3 class="text-xl font-medium">Your Rights</h3>
			<p class="text-muted-foreground">
				Depending on your location, you may have certain rights regarding your personal information,
				such as the right to access, correct, or delete your data. You can exercise these rights by
				contacting us through our support channels.
			</p>
		</div>
		<div>
			<h3 class="text-xl font-medium">Cookies</h3>
			<p class="text-muted-foreground">
				We use cookies and similar tracking technologies to track activity on our service and hold
				certain information. You can control cookies through your browser settings.
			</p>
		</div>
		<div>
			<h3 class="text-xl font-medium">Third-Party Services</h3>
			<p class="text-muted-foreground">
				We may employ third-party companies and individuals to facilitate our service, including for
				hosting and analytics. These third parties have access to your personal information only to
				perform specific tasks on our behalf and are obligated not to disclose or use it for any
				other purpose.
			</p>
		</div>
		<div>
			<h3 class="text-xl font-medium">Data Retention</h3>
			<p class="text-muted-foreground">
				We retain your personal information for as long as your account is active or as needed to
				provide you with the service. You may request deletion of your data at any time by
				contacting us.
			</p>
		</div>
		<div>
			<h3 class="text-xl font-medium">Changes to This Policy</h3>
			<p class="text-muted-foreground">
				We may update this policy to reflect changes in our practices or for other operational,
				legal, or regulatory reasons. We will notify you of any significant changes by posting the
				updated policy on our website or by sending a notification to your email address.
			</p>
		</div>
	</div>
	<p class="mt-4 text-sm text-muted-foreground font-bold">Last Updated: {lastUpdated}</p>
</section>
