'use client';

import { NumberField } from '@/components';

import type { FormInputProps } from '@/types';

export function BeatsField({ form }: FormInputProps) {
	return (
		<NumberField
			form={form}
			componentName='BeatsField'
			name='beats'
			label='Beats'
			max={16}
			title='Number of Beats Per Measure'
		/>
	);
}
