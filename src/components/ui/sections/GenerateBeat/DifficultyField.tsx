'use client';

import { FormField, FormLabel, FormSelect } from '../../forms';
import { HelpButton } from '../../buttons';
import { useFormStore } from '@/stores/form-store';

import type { BeatFormData, DifficultyLevel } from '@/types';

type DifficultyFieldProps = {
	form: any; // TanStack Form instance
};

const DIFFICULTY_OPTIONS: DifficultyLevel[] = [
	'I’m Too Young to Drum',
	'Hey, Not Too Rough',
	'Hurt Me Plenty',
	'Ultra-Violence',
	'Drumline!',
];

export function DifficultyField({ form }: DifficultyFieldProps) {
	const { setFormValues } = useFormStore();

	return (
		<form.Field
			name='difficulty'
			children={(field: any) => (
				<FormField className='flex-1 relative'>
					<div className='flex gap-1 items-center justify-start'>
						<FormLabel htmlFor='difficulty'>Difficulty</FormLabel>
						<HelpButton />
					</div>
					<FormSelect
						className='p-1'
						value={field.state.value}
						onChange={e => {
							const newValue = e.target.value as BeatFormData['difficulty'];
							field.handleChange(newValue);
							setFormValues({ difficulty: newValue });
						}}
						id='difficulty'
					>
						{DIFFICULTY_OPTIONS.map(option => (
							<option value={option} key={option}>
								{option.replace("'", '’')}
							</option>
						))}
					</FormSelect>
				</FormField>
			)}
		/>
	);
}
