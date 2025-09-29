'use client';

import { NumberField } from '@/components';

import type { MeasuresFieldProps } from '@/types';

export function MeasuresField({ form }: MeasuresFieldProps) {
	return (
		<NumberField form={form} name='measures' label='Measures' min={1} max={32} defaultValue={4} />
	);
}
