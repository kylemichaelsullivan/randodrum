import { memo } from 'react';
import type { ComponentProps, ComponentType, MemoExoticComponent } from 'react';

/**
 * Creates a memoized component with consistent displayName pattern
 */
export const createMemoizedComponent = <T extends ComponentType<Record<string, unknown>>>(
	Component: T,
	displayName: string
): MemoExoticComponent<T> => {
	const MemoizedComponent = memo(Component);
	MemoizedComponent.displayName = displayName;
	return MemoizedComponent;
};

/**
 * Automatically sets displayName for a memoized component
 * This utility eliminates the need to manually set displayName after memo()
 */
export const withDisplayName = <T extends ComponentType<any>>(
	Component: T,
	displayName: string
): T => {
	Component.displayName = displayName;
	return Component;
};

/**
 * Creates a memoized component with automatic displayName setting
 * This is the recommended pattern for all memoized components
 */
export const createMemoizedComponentWithDisplayName = <T extends ComponentType<any>>(
	Component: T,
	displayName: string
): MemoExoticComponent<T> => {
	const MemoizedComponent = memo(Component);
	MemoizedComponent.displayName = displayName;
	return MemoizedComponent;
};

/**
 * Creates a memoized component with custom comparison function
 */
export const createMemoizedComponentWithComparison = <
	T extends ComponentType<Record<string, unknown>>,
>(
	Component: T,
	displayName: string,
	comparisonFn?: (
		prevProps: Readonly<ComponentProps<T>>,
		nextProps: Readonly<ComponentProps<T>>
	) => boolean
): MemoExoticComponent<T> => {
	const MemoizedComponent = memo(Component, comparisonFn);
	MemoizedComponent.displayName = displayName;
	return MemoizedComponent;
};

/**
 * Standard memoization patterns for common component types
 */
export const MEMOIZATION_PATTERNS = {
	/**
	 * For components with stable props (most UI components)
	 */
	stable: <T extends ComponentType<Record<string, unknown>>>(
		Component: T,
		displayName: string
	): MemoExoticComponent<T> => createMemoizedComponent(Component, displayName),

	/**
	 * For components that need custom comparison (complex data)
	 */
	custom: <T extends ComponentType<Record<string, unknown>>>(
		Component: T,
		displayName: string,
		comparisonFn: (
			prevProps: Readonly<ComponentProps<T>>,
			nextProps: Readonly<ComponentProps<T>>
		) => boolean
	): MemoExoticComponent<T> =>
		createMemoizedComponentWithComparison(Component, displayName, comparisonFn),

	/**
	 * For components that should never re-render unless props change
	 */
	strict: <T extends ComponentType<Record<string, unknown>>>(
		Component: T,
		displayName: string
	): MemoExoticComponent<T> =>
		createMemoizedComponentWithComparison(Component, displayName, (prevProps, nextProps) => {
			// Strict comparison - only re-render if props are different
			return JSON.stringify(prevProps) === JSON.stringify(nextProps);
		}),
} as const;
