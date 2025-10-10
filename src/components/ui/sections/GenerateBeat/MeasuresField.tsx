'use client';

import { NumberField } from '@/components';

import type { FormInputProps } from '@/types';

export function MeasuresField({ form }: FormInputProps) {
	return <NumberField form={form} name='measures' label='Measures' max={32} defaultValue={4} />;
}
