'use client';

import { forwardRef } from 'react';

import { clsx } from 'clsx';

import type { HTMLAttributes, ReactNode } from 'react';

type FormFieldProps = HTMLAttributes<HTMLDivElement> & {
	children: ReactNode;
	className?: string;
};

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
	({ children, className = '', ...props }, ref) => {
		return (
			<div className={clsx('FormField flex flex-col gap-1', className)} {...props} ref={ref}>
				{children}
			</div>
		);
	}
);

FormField.displayName = 'FormField';
