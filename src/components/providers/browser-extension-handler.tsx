'use client';

import { useEffect } from 'react';

import {
	BROWSER_EXTENSION_ATTRIBUTES,
	isBrowserExtensionAttribute,
} from '@/utils/browser-extensions';

/**
 * BrowserExtensionHandler manages browser extension interference with hydration
 * by handling common extension attributes that get injected into the DOM
 */
export function BrowserExtensionHandler() {
	useEffect(() => {
		const handleBrowserExtensions = () => {
			const body = document.body;

			// Remove extension attributes that might cause hydration mismatches
			BROWSER_EXTENSION_ATTRIBUTES.forEach(attr => {
				if (body.hasAttribute(attr)) {
					body.removeAttribute(attr);
				}
			});

			// Handle any other dynamically added attributes
			const observer = new MutationObserver(mutations => {
				mutations.forEach(mutation => {
					if (mutation.type === 'attributes' && mutation.target === body) {
						const attributeName = mutation.attributeName;
						if (attributeName && isBrowserExtensionAttribute(attributeName)) {
							// Log for debugging but don't remove - extensions might need these
							console.debug('Browser extension attribute detected:', attributeName);
						}
					}
				});
			});

			observer.observe(body, {
				attributes: true,
				attributeFilter: [...BROWSER_EXTENSION_ATTRIBUTES],
			});

			return () => observer.disconnect();
		};

		// Run after a short delay to allow extensions to load
		const timeoutId = setTimeout(handleBrowserExtensions, 100);

		return () => clearTimeout(timeoutId);
	}, []);

	return null; // This component doesn't render anything
}
