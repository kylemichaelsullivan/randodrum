'use client';

import { createFormComponent } from '@/utils';

import type { ForwardRefExoticComponent, HTMLAttributes, ReactNode, RefAttributes } from 'react';

type FormFieldProps = HTMLAttributes<HTMLDivElement> & {
	children: ReactNode;
	className?: string;
};

export const FormField = createFormComponent<HTMLDivElement>(
	'div',
	'FormField flex flex-col gap-1',
	'FormField'
) as ForwardRefExoticComponent<FormFieldProps & RefAttributes<HTMLDivElement>>;
