'use client';

import { forwardRef } from 'react';

import { clsx } from 'clsx';

import type { SelectHTMLAttributes, ReactNode } from 'react';

type FormSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
	children: ReactNode;
	className?: string;
};

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
	({ children, className = '', ...props }, ref) => {
		return (
			<select className={clsx('FormSelect w-full', className)} {...props} ref={ref}>
				{children}
			</select>
		);
	}
);

FormSelect.displayName = 'FormSelect';
