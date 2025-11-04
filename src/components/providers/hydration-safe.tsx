'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { createMemoizedComponent } from '@/utils';

type HydrationSafeProps = {
	children: ReactNode;
	fallback?: ReactNode;
};

/**
 * HydrationSafe ensures that content only renders after hydration is complete.
 * This prevents hydration mismatches by showing a fallback during SSR and initial hydration.
 */
function HydrationSafeComponent({
	children,
	fallback = null,
}: HydrationSafeProps) {
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	if (!isHydrated) {
		return fallback ? <>{fallback}</> : null;
	}

	return <>{children}</>;
}

export const HydrationSafe = createMemoizedComponent(
	HydrationSafeComponent,
	'HydrationSafe',
);
