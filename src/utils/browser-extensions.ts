/**
 * Browser extension constants for handling extension interference
 */

// List of known browser extension attributes that cause hydration issues
export const BROWSER_EXTENSION_ATTRIBUTES = [
	'cz-shortcut-listen', // Common password manager extension
	'data-1password-root', // 1Password
	'data-bitwarden-watching', // Bitwarden
	'data-dashlane-id', // Dashlane
	'data-grammarly-ignore', // Grammarly
	'data-grammarly-shadow-root', // Grammarly
	'data-lastpass-icon-root', // LastPass
] as const;

export type BrowserExtensionAttribute = (typeof BROWSER_EXTENSION_ATTRIBUTES)[number];

export const isBrowserExtensionAttribute = (attributeName: string): boolean => {
	return BROWSER_EXTENSION_ATTRIBUTES.some(attr => attributeName.includes(attr));
};
