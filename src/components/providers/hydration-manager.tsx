'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { BROWSER_EXTENSION_ATTRIBUTES } from '@/utils/browser-extensions';

/**
 * HydrationManager handles browser extension interference and provides
 * a clean way to manage hydration without suppressHydrationWarning
 */
export function HydrationManager({ children }: { children: ReactNode }) {
	const [isHydrated, setIsHydrated] = useState(false);
	const [, setHasExtensionInterference] = useState(false);

	useEffect(() => {
		const checkForExtensions = () => {
			const body = document.body;
			const hasExtensions = BROWSER_EXTENSION_ATTRIBUTES.some(attr => body.hasAttribute(attr));
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
			attributeFilter: [...BROWSER_EXTENSION_ATTRIBUTES],
		});

		return () => observer.disconnect();
	}, []);

	if (!isHydrated) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='animate-pulse text-gray'>Loading…</div>
			</div>
		);
	}

	return <>{children}</>;
}
