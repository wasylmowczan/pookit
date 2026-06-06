import { emailTheme as t } from './theme';

// Re-export so templates that need raw token values can import from one place
export { emailTheme as tokens } from './theme';

export function baseLayout(content: string, previewText = ''): string {
	return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Pookit</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
x§    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; display: block; }
    * { box-sizing: border-box; }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${t.muted};font-family:${t.fontSans};">
  ${previewText ? `<div style="display:none;overflow:hidden;max-height:0;max-width:0;opacity:0;">${previewText}&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;</div>` : ''}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${t.muted};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <!-- Email card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="background-color:${t.fg};padding:16px 24px;">
              <a href="https://pookit.dev" style="text-decoration:none;">
                <span style="font-family:${t.fontSans};font-size:20px;font-weight:700;color:${t.bg};letter-spacing:-0.5px;">Pookit</span>
              </a>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:${t.bg};border:2px solid ${t.border};border-top:none;padding:40px 32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0;text-align:center;">
              <p style="margin:0;font-family:${t.fontSans};font-size:12px;color:${t.mutedFg};line-height:1.5;">
                You received this email because you have an account at
                <a href="https://pookit.dev" style="color:${t.mutedFg};">pookit.dev</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Reusable primary CTA button */
export function button(label: string, href: string): string {
	return `<a href="${href}" style="display:inline-block;background-color:${t.primary};color:${t.bg};font-family:${t.fontSans};font-size:14px;font-weight:700;text-decoration:none;padding:12px 24px;border:2px solid ${t.border};box-shadow:4px 4px 0 ${t.border};margin-top:8px;">${label}</a>`;
}

/** Reusable section heading */
export function heading(text: string): string {
	return `<h1 style="margin:0 0 16px;font-family:${t.fontSans};font-size:24px;font-weight:700;color:${t.fg};line-height:1.2;">${text}</h1>`;
}

/** Reusable paragraph */
export function para(text: string, muted = false): string {
	return `<p style="margin:0 0 16px;font-family:${t.fontSans};font-size:15px;color:${muted ? t.mutedFg : t.fg};line-height:1.6;">${text}</p>`;
}

/** Horizontal divider */
export function divider(): string {
	return `<hr style="border:none;border-top:2px solid ${t.border};margin:24px 0;" />`;
}
