import { forwardRef, memo, createElement } from 'react';

import { clsx } from 'clsx';

import type { HTMLAttributes, JSX, ReactNode } from 'react';

/**
 * Creates a standardized form component with consistent patterns
 */
export const createFormComponent = <T extends HTMLElement>(
	element: keyof JSX.IntrinsicElements,
	baseClassName: string,
	displayName: string
) => {
	const Component = forwardRef<T, HTMLAttributes<T> & { className?: string; children?: ReactNode }>(
		({ className, children, ...props }, ref) => {
			return createElement(
				element,
				{
					...props,
					className: clsx(baseClassName, className),
					ref,
				},
				children
			);
		}
	);

	Component.displayName = displayName;
	return Component;
};

/**
 * Creates a memoized form component with consistent patterns
 */
export const createMemoizedFormComponent = <T extends HTMLElement>(
	element: keyof JSX.IntrinsicElements,
	baseClassName: string,
	displayName: string
) => {
	const Component = createFormComponent<T>(element, baseClassName, displayName);
	return memo(Component);
};

/**
 * Standard form component configurations
 */
export const FORM_COMPONENTS = {
	field: {
		element: 'div' as const,
		className: 'flex flex-col gap-1',
		displayName: 'FormField',
	},
	input: {
		element: 'input' as const,
		className: 'w-full',
		displayName: 'FormInput',
	},
	select: {
		element: 'select' as const,
		className: 'w-full',
		displayName: 'FormSelect',
	},
	label: {
		element: 'label' as const,
		className: 'table text-sm font-medium',
		displayName: 'FormLabel',
	},
	form: {
		element: 'form' as const,
		className: '',
		displayName: 'Form',
	},
} as const;
