'use client';

import { createFormComponent } from '@/utils';

import type {
	ForwardRefExoticComponent,
	ReactNode,
	RefAttributes,
	SelectHTMLAttributes,
} from 'react';

type FormSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
	children: ReactNode;
	className?: string;
};

export const FormSelect = createFormComponent<HTMLSelectElement>(
	'select',
	'FormSelect w-full',
	'FormSelect'
) as ForwardRefExoticComponent<FormSelectProps & RefAttributes<HTMLSelectElement>>;
