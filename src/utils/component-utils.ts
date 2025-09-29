import { memo } from 'react';
import type { ComponentProps, ComponentType, MemoExoticComponent } from 'react';

/**
 * Creates a memoized component with automatic displayName setting
 * This is the recommended pattern for all memoized components
 */
export const createMemoizedComponent = <T extends ComponentType<P>, P = ComponentProps<T>>(
	Component: T,
	displayName: string
): MemoExoticComponent<T> => {
	const MemoizedComponent = memo(Component);
	MemoizedComponent.displayName = displayName;

	return MemoizedComponent;
};
