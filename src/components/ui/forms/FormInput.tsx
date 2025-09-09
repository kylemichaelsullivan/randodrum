'use client';

import { forwardRef } from 'react';

import { clsx } from 'clsx';

import type { InputHTMLAttributes } from 'react';

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
	className?: string;
};

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
	({ className = '', ...props }, ref) => {
		return <input className={clsx('FormInput w-full', className)} {...props} ref={ref} />;
	}
);

FormInput.displayName = 'FormInput';
