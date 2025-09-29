'use client';

import { createFormComponent } from '@/utils';

import type { ForwardRefExoticComponent, InputHTMLAttributes, RefAttributes } from 'react';

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
	className?: string;
};

export const FormInput = createFormComponent<HTMLInputElement>(
	'input',
	'FormInput w-full',
	'FormInput'
) as ForwardRefExoticComponent<FormInputProps & RefAttributes<HTMLInputElement>>;
