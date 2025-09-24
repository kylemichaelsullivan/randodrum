'use client';

import { memo, useCallback } from 'react';
import { FormField, FormLabel } from '@/components';
import { useFormStore } from '@/stores';

import type { ChangeEvent } from 'react';
import type { MeasuresFieldProps } from '@/types';

function MeasuresFieldComponent({ form }: MeasuresFieldProps) {
	const { setFormValues } = useFormStore();

	const handleChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>, field: { handleChange: (value: number) => void }) => {
			const newValue = parseInt(e.target.value) || 4;
			field.handleChange(newValue);
			setFormValues({ measures: newValue });
		},
		[setFormValues]
	);

	return form.Field({
		name: 'measures',
		children: field => (
			<FormField className='flex-1'>
				<FormLabel htmlFor='measures'>Measures</FormLabel>
				<input
					type='number'
					className='w-full'
					value={field.state.value}
					min='1'
					max='32'
					onChange={e => handleChange(e, field)}
					id='measures'
				/>
			</FormField>
		),
	});
}

export const MeasuresField = memo(MeasuresFieldComponent);
