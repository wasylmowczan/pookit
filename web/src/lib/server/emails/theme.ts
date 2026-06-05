/**
 * Email theme tokens — hex equivalents of app.css CSS variables.
 *
 * Email clients don't support oklch() or CSS variables, so we maintain
 * email-safe hex values here. When you update colours in app.css, update
 * the corresponding hex below.
 *
 * app.css variable              oklch value                      hex
 * --primary                     oklch(0.6489 0.237 26.9728)   →  #e05a38
 * --secondary                   oklch(0.968  0.211 109.7692)  →  #e5f542
 * --background                  oklch(1 0 0)                  →  #ffffff
 * --foreground                  oklch(0 0 0)                  →  #000000
 * --muted                       oklch(0.9551 0 0)             →  #f4f4f5
 * --muted-foreground            oklch(0.3211 0 0)             →  #52525b
 * --border                      oklch(0 0 0)                  →  #000000
 */
export const emailTheme = {
	primary: '#e05a38',
	secondary: '#e5f542',
	bg: '#ffffff',
	fg: '#000000',
	muted: '#f4f4f5',
	mutedFg: '#52525b',
	border: '#000000',
	fontSans: 'Arial, Helvetica, sans-serif'
} as const;
