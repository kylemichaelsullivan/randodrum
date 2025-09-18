'use client';

import { memo, useEffect, useState, type ReactNode } from 'react';

type HydrationBoundaryProps = {
	children: ReactNode;
	fallback?: ReactNode;
};

/**
 * HydrationBoundary prevents hydration mismatches by ensuring
 * client-side rendering matches server-side rendering
 */
function HydrationBoundaryComponent({ children, fallback = null }: HydrationBoundaryProps) {
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	if (!isHydrated) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}

export const HydrationBoundary = memo(HydrationBoundaryComponent);

HydrationBoundary.displayName = 'HydrationBoundary';

/**
 * ClientOnly ensures a component only renders on the client side
 * Useful for components that depend on browser APIs or localStorage
 */
function ClientOnlyComponent({ children, fallback = null }: HydrationBoundaryProps) {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}

export const ClientOnly = memo(ClientOnlyComponent);

ClientOnly.displayName = 'ClientOnly';
