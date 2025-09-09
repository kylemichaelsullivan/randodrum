'use client';

import { forwardRef } from 'react';

import { clsx } from 'clsx';

import type { FormHTMLAttributes, ReactNode } from 'react';

type FormProps = FormHTMLAttributes<HTMLFormElement> & {
	children: ReactNode;
	className?: string;
};

export const Form = forwardRef<HTMLFormElement, FormProps>(
	({ children, className = '', ...props }, ref) => {
		return (
			<form ref={ref} className={clsx('Form', className)} {...props}>
				{children}
			</form>
		);
	}
);

Form.displayName = 'Form';
