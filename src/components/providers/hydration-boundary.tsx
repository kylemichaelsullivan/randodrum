'use client';

import { useEffect, useState, type ReactNode } from 'react';

type HydrationBoundaryProps = {
	children: ReactNode;
	fallback?: ReactNode;
};

/**
 * HydrationBoundary prevents hydration mismatches by ensuring
 * client-side rendering matches server-side rendering
 */
export function HydrationBoundary({ children, fallback = null }: HydrationBoundaryProps) {
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	if (!isHydrated) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}

/**
 * ClientOnly ensures a component only renders on the client side
 * Useful for components that depend on browser APIs or localStorage
 */
export function ClientOnly({ children, fallback = null }: HydrationBoundaryProps) {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}
