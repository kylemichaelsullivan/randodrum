'use client';

import { NumberField } from '@/components';

import type { FormInputProps } from '@/types';

export function MeasuresField({ form }: FormInputProps) {
	return (
		<NumberField
			form={form}
			componentName='MeasuresField'
			name='measures'
			label='Measures'
			max={32}
			title='Number of Measures (Total)'
		/>
	);
}
