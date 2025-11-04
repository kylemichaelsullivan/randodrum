'use client';

import { forwardRef } from 'react';

import { clsx } from 'clsx';

import type { FormHTMLAttributes, ReactNode } from 'react';

type FormProps = FormHTMLAttributes<HTMLFormElement> & {
	children: ReactNode;
	className?: string;
	componentName?: string;
};

export const Form = forwardRef<HTMLFormElement, FormProps>(
	({ children, className = '', componentName, ...props }, ref) => {
		const formComponentName = componentName ?? 'Form';

		return (
			<form ref={ref} className={clsx(formComponentName, className)} {...props}>
				{children}
			</form>
		);
	},
);

Form.displayName = 'Form';
