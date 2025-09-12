'use client';

import { forwardRef } from 'react';

import { clsx } from 'clsx';

import type { LabelHTMLAttributes, ReactNode } from 'react';

type FormLabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
	children: ReactNode;
	className?: string;
};

export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
	({ children, className = '', ...props }, ref) => {
		return (
			<label
				className={clsx('FormLabel table text-sm font-medium', className)}
				{...props}
				ref={ref}
			>
				{children}
			</label>
		);
	}
);

FormLabel.displayName = 'FormLabel';
