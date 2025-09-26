'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { createMemoizedComponentWithDisplayName } from '@/utils';

type HydrationSafeProps = {
	children: ReactNode;
	className?: string;
	fallback?: ReactNode;
};

/**
 * HydrationSafe ensures that content only renders after hydration is complete.
 * This prevents hydration mismatches by showing a fallback during SSR and initial hydration.
 */
function HydrationSafeComponent({ children, fallback = null, className }: HydrationSafeProps) {
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	if (!isHydrated) {
		return fallback ? <div className={className}>{fallback}</div> : null;
	}

	return <div className={className}>{children}</div>;
}

export const HydrationSafe = createMemoizedComponentWithDisplayName(
	HydrationSafeComponent,
	'HydrationSafe'
);
