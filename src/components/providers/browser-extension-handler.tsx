'use client';

import { useEffect } from 'react';

/**
 * BrowserExtensionHandler manages browser extension interference with hydration
 * by handling common extension attributes that get injected into the DOM
 */
export function BrowserExtensionHandler() {
	useEffect(() => {
		const handleBrowserExtensions = () => {
			const body = document.body;

			// List of known browser extension attributes that cause hydration issues
			const extensionAttributes = [
				'cz-shortcut-listen', // Common password manager extension
				'data-1password-root', // 1Password
				'data-bitwarden-watching', // Bitwarden
				'data-dashlane-id', // Dashlane
				'data-grammarly-ignore', // Grammarly
				'data-grammarly-shadow-root', // Grammarly
				'data-lastpass-icon-root', // LastPass
			];

			// Remove extension attributes that might cause hydration mismatches
			extensionAttributes.forEach(attr => {
				if (body.hasAttribute(attr)) {
					body.removeAttribute(attr);
				}
			});

			// Handle any other dynamically added attributes
			const observer = new MutationObserver(mutations => {
				mutations.forEach(mutation => {
					if (mutation.type === 'attributes' && mutation.target === body) {
						const attributeName = mutation.attributeName;
						if (attributeName && extensionAttributes.some(attr => attributeName.includes(attr))) {
							// Log for debugging but don't remove - extensions might need these
							console.debug('Browser extension attribute detected:', attributeName);
						}
					}
				});
			});

			observer.observe(body, {
				attributes: true,
				attributeFilter: extensionAttributes,
			});

			return () => observer.disconnect();
		};

		// Run after a short delay to allow extensions to load
		const timeoutId = setTimeout(handleBrowserExtensions, 100);

		return () => clearTimeout(timeoutId);
	}, []);

	return null; // This component doesn't render anything
}
