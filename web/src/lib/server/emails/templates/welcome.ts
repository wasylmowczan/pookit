import { baseLayout, button, heading, para, divider } from '../base';

export type WelcomeEmailData = {
	name?: string;
};

export function welcomeEmail(data: WelcomeEmailData): { subject: string; html: string } {
	const greeting = data.name ? `Hey ${data.name},` : 'Hey there,';

	const content = `
    ${heading('Welcome to Pookit 👋')}
    ${para(greeting)}
    ${para("We're really glad you're here. Your account is set up and ready to go.")}
    ${para('Head to your dashboard to get started.')}
    <div style="margin:32px 0;">
      ${button('Go to dashboard', 'https://pookit.dev/dashboard')}
    </div>
    ${divider()}
    ${para('If you have any questions, just reply to this email — we read every message.', true)}
  `;

	return {
		subject: 'Welcome to Pookit!',
		html: baseLayout(content, 'Your account is ready. Head to your dashboard to get started.')
	};
}
