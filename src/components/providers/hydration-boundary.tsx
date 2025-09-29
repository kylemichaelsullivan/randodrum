'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { createMemoizedComponent } from '@/utils';

type ClientOnlyProps = {
	children: ReactNode;
	fallback?: ReactNode;
};

/**
 * ClientOnly ensures a component only renders on the client side
 * Useful for components that depend on browser APIs or localStorage
 */
function ClientOnlyComponent({ children, fallback = null }: ClientOnlyProps) {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}

export const ClientOnly = createMemoizedComponent(ClientOnlyComponent, 'ClientOnly');
