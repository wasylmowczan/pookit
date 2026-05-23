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
	title={`Terms of Service - ${config.appName}`}
	description={`Terms of Service for ${config.appName}`}
	keywords="terms, of, service, terms of service"
/>

<section class="mb-12 p-6 dark:bg-gray-800 rounded-lg">
	<h2 class="text-2xl font-semibold mb-4 text-center">Terms & Conditions 📜</h2>
	<div class="space-y-4">
		<div>
			<h3 class="text-xl font-medium">Acceptance of Terms</h3>
			<p class="text-muted-foreground">
				By accessing or using this service, you agree to be bound by these Terms of Service. If you
				do not agree to these terms, please do not use the service. We reserve the right to change
				these terms at any time and will notify you of significant changes via email or through the
				platform.
			</p>
		</div>
		<div>
			<h3 class="text-xl font-medium">User Accounts</h3>
			<p class="text-muted-foreground">
				Some features require an account. You are responsible for keeping your account credentials
				confidential and for all activity that occurs under your account. Providing false
				information or abusing the platform may result in account termination.
			</p>
		</div>
		<div>
			<h3 class="text-xl font-medium">Acceptable Use</h3>
			<p class="text-muted-foreground">
				You agree to use the service only for lawful purposes and in a way that does not infringe
				the rights of others or restrict their use of the service. Prohibited conduct includes but
				is not limited to: distributing harmful content, attempting to gain unauthorized access, or
				using the service to transmit spam or malicious code.
			</p>
		</div>
		<div>
			<h3 class="text-xl font-medium">Subscription Plans</h3>
			<p class="text-muted-foreground">
				Certain features may require a paid subscription. Subscription fees are billed in advance
				and are non-refundable except as required by law. You may cancel your subscription at any
				time; cancellation takes effect at the end of the current billing period.
			</p>
		</div>
		<div>
			<h3 class="text-xl font-medium">Intellectual Property</h3>
			<p class="text-muted-foreground">
				The service and its original content, features, and functionality are owned by the operators
				and are protected by applicable intellectual property laws. You retain ownership of any
				content you submit, but grant us a license to use it to operate and improve the service.
			</p>
		</div>
		<div>
			<h3 class="text-xl font-medium">Limitation of Liability</h3>
			<p class="text-muted-foreground">
				To the fullest extent permitted by law, we shall not be liable for any indirect, incidental,
				special, consequential, or punitive damages arising from your use of or inability to use the
				service. Our total liability for any claim shall not exceed the amount you paid us in the
				twelve months preceding the claim.
			</p>
		</div>
		<div>
			<h3 class="text-xl font-medium">Disclaimer of Warranties</h3>
			<p class="text-muted-foreground">
				The service is provided on an "as is" and "as available" basis without warranties of any
				kind, either express or implied. We do not warrant that the service will be uninterrupted,
				error-free, or free of harmful components.
			</p>
		</div>
		<div>
			<h3 class="text-xl font-medium">Termination</h3>
			<p class="text-muted-foreground">
				We reserve the right to suspend or terminate your access to the service at our sole
				discretion, without notice, for conduct that we believe violates these terms or is harmful
				to other users, us, or third parties.
			</p>
		</div>
		<div>
			<h3 class="text-xl font-medium">Updates to Terms</h3>
			<p class="text-muted-foreground">
				We reserve the right to update these terms at any time. Continued use of the service after
				changes are posted constitutes your acceptance of the revised terms.
			</p>
		</div>
		<div>
			<h3 class="text-xl font-medium">Contact Information</h3>
			<p class="text-muted-foreground">
				If you have questions about these terms, please contact us through our support channels.
			</p>
		</div>
	</div>
	<p class="mt-4 text-sm text-muted-foreground font-bold">Last Updated: {lastUpdated}</p>
</section>
