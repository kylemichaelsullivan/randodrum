import { useEffect } from 'react';

/**
 * Custom hook that syncs the display size to a CSS custom property.
 * Updates --display-multiplier on the document root when displaySize changes.
 */
export function useDisplayMultiplier(displaySize: number): void {
	useEffect(() => {
		const displayMultiplier = displaySize / 100;
		document.documentElement.style.setProperty(
			'--display-multiplier',
			String(displayMultiplier),
		);
	}, [displaySize]);
}
