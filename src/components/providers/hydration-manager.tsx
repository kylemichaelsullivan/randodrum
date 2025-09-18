'use client';

import { useEffect, useState, type ReactNode } from 'react';

/**
 * HydrationManager handles browser extension interference and provides
 * a clean way to manage hydration without suppressHydrationWarning
 */
export function HydrationManager({ children }: { children: ReactNode }) {
	const [isHydrated, setIsHydrated] = useState(false);
	const [, setHasExtensionInterference] = useState(false);

	useEffect(() => {
		// Check for browser extension interference
		const checkForExtensions = () => {
			const body = document.body;
			const extensionAttributes = [
				'cz-shortcut-listen',
				'data-1password-root',
				'data-bitwarden-watching',
				'data-dashlane-id',
				'data-grammarly-shadow-root',
				'data-lastpass-icon-root',
			];

			const hasExtensions = extensionAttributes.some(attr => body.hasAttribute(attr));
			setHasExtensionInterference(hasExtensions);
		};

		setIsHydrated(true);
		checkForExtensions();

		// Set up observer for dynamic extension attributes
		const observer = new MutationObserver(() => {
			checkForExtensions();
		});

		observer.observe(document.body, {
			attributes: true,
			attributeFilter: ['cz-shortcut-listen', 'data-lastpass-icon-root', 'data-1password-root'],
		});

		return () => observer.disconnect();
	}, []);

	// Show loading state until hydrated
	if (!isHydrated) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='animate-pulse text-gray'>Loading…</div>
			</div>
		);
	}

	return <>{children}</>;
}
