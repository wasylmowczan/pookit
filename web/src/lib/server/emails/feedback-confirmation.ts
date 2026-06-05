import { baseLayout, heading, para, divider, tokens } from './base';

export type FeedbackConfirmationEmailData = {
	name: string;
	feedbackSnippet?: string;
};

export function feedbackConfirmationEmail(data: FeedbackConfirmationEmailData): {
	subject: string;
	html: string;
} {
	const snippet = data.feedbackSnippet
		? `<blockquote style="margin:16px 0;padding:12px 16px;border-left:4px solid ${tokens.border};background-color:${tokens.muted};font-family:${tokens.fontSans};font-size:14px;color:${tokens.mutedFg};line-height:1.6;">${data.feedbackSnippet}</blockquote>`
		: '';

	const content = `
    ${heading('Thanks for your feedback!')}
    ${para(`Hi ${data.name},`)}
    ${para("We've received your message and really appreciate you taking the time to share it.")}
    ${snippet}
    ${para("We read all feedback carefully and use it to make Pookit better. We'll follow up if we have questions.")}
    ${divider()}
    ${para('In the meantime, feel free to keep exploring the app.', true)}
  `;

	return {
		subject: 'We got your feedback — thanks!',
		html: baseLayout(
			content,
			"Thanks for reaching out — we've received your feedback and will review it shortly."
		)
	};
}
