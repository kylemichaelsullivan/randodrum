'use client';

import { useLayoutEffect } from 'react';

// Extend the Window interface to include our custom property
declare global {
	interface Window {
		__czAttributeRemoved?: boolean;
	}
}

export function HydrationFix() {
	useLayoutEffect(() => {
		// Check if the attribute exists and remove it before hydration
		const body = document.body;
		if (body) {
			const hadCzAttribute = body.hasAttribute('cz-shortcut-listen');
			if (hadCzAttribute) {
				body.removeAttribute('cz-shortcut-listen');
				// Store that we removed it
				window.__czAttributeRemoved = true;
			}
		}

		// Add it back only if we removed it
		const handleLoad = () => {
			if (window.__czAttributeRemoved && document.body) {
				document.body.setAttribute('cz-shortcut-listen', 'true');
				delete window.__czAttributeRemoved;
			}
		};

		window.addEventListener('load', handleLoad);

		// Cleanup
		return () => {
			window.removeEventListener('load', handleLoad);
		};
	}, []);

	return null;
}
