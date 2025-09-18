'use client';

import { memo, useCallback } from 'react';
import { FormField, FormLabel } from '@/components/ui/forms';
import { useFormStore } from '@/stores';
import type { ChangeEvent } from 'react';
import type { BeatsFieldProps } from '@/types';

function BeatsFieldComponent({ form }: BeatsFieldProps) {
	const { setFormValues } = useFormStore();

	const handleChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>, field: { handleChange: (value: number) => void }) => {
			const newValue = parseInt(e.target.value) || 4;
			field.handleChange(newValue);
			setFormValues({ beats: newValue });
		},
		[setFormValues]
	);

	return form.Field({
		name: 'beats',
		children: field => (
			<FormField className='flex-1'>
				<FormLabel htmlFor='beats'>Beats</FormLabel>
				<input
					type='number'
					className='w-full'
					value={field.state.value}
					min='1'
					max='16'
					onChange={e => handleChange(e, field)}
					id='beats'
				/>
			</FormField>
		),
	});
}

export const BeatsField = memo(BeatsFieldComponent);
