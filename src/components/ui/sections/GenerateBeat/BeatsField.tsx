'use client';

import { FormField, FormLabel } from '../../forms';
import { useFormStore } from '@/stores/form-store';

type BeatsFieldProps = {
	form: any; // Tanstack Form
};

export function BeatsField({ form }: BeatsFieldProps) {
	const { setFormValues } = useFormStore();

	return (
		<form.Field
			name='beats'
			children={(field: any) => (
				<FormField className='flex-1'>
					<FormLabel htmlFor='beats'>Beats</FormLabel>
					<input
						type='number'
						className='w-full'
						value={field.state.value}
						min='1'
						max='16'
						onChange={e => {
							const newValue = parseInt(e.target.value) || 4;
							field.handleChange(newValue);
							setFormValues({ beats: newValue });
						}}
						id='beats'
					/>
				</FormField>
			)}
		/>
	);
}
