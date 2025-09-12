'use client';

import { FormField, FormLabel } from '../../forms';
import { useFormStore } from '@/stores/form-store';

type MeasuresFieldProps = {
	form: any; // TanStack Form instance
};

export function MeasuresField({ form }: MeasuresFieldProps) {
	const { setFormValues } = useFormStore();

	return (
		<form.Field
			name='measures'
			children={(field: any) => (
				<FormField className='flex-1'>
					<FormLabel htmlFor='measures'>Measures</FormLabel>
					<input
						type='number'
						className='w-full'
						value={field.state.value}
						min='1'
						max='32'
						onChange={e => {
							const newValue = parseInt(e.target.value) || 4;
							field.handleChange(newValue);
							setFormValues({ measures: newValue });
						}}
						id='measures'
					/>
				</FormField>
			)}
		/>
	);
}
