import { baseLayout, heading, para, divider, tokens } from '../base';

export type FeedbackResponseEmailData = {
	name: string;
	responseMessage: string;
	feedbackSnippet?: string;
};

export function feedbackResponseEmail(data: FeedbackResponseEmailData): {
	subject: string;
	html: string;
} {
	const snippet = data.feedbackSnippet
		? `<blockquote style="margin:16px 0;padding:12px 16px;border-left:4px solid ${tokens.border};background-color:${tokens.muted};font-family:${tokens.fontSans};font-size:14px;color:${tokens.mutedFg};line-height:1.6;">${data.feedbackSnippet}</blockquote>`
		: '';

	const content = `
    ${heading('We got back to you!')}
    ${para(`Hi ${data.name},`)}
    ${para("Thanks again for sharing your feedback. We've looked into it and wanted to follow up:")}
    ${snippet}
    ${para(data.responseMessage)}
    ${divider()}
    ${para('Thanks for helping us improve Pookit.', true)}
  `;

	return {
		subject: 'A response to your feedback',
		html: baseLayout(content, 'We have a response to your feedback — come take a look.')
	};
}
