'use client';

import { forwardRef } from 'react';

import { clsx } from 'clsx';

import type { ReactNode, SelectHTMLAttributes } from 'react';

type FormSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
	children: ReactNode;
	className?: string;
	componentName?: string;
};

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
	({ className = '', componentName, ...props }, ref) => {
		const selectComponentName = componentName ?? 'FormSelect';

		return (
			<select
				ref={ref}
				className={clsx(selectComponentName, 'w-full', className)}
				{...props}
			/>
		);
	},
);

FormSelect.displayName = 'FormSelect';
