'use client';

import { memo, useCallback, useMemo } from 'react';
import { FormField, FormLabel, FormSelect, HelpButton } from '@/components';
import { getDifficultyOptions } from '@/utils';
import { useFormStore } from '@/stores';

import type { ChangeEvent } from 'react';
import type { BeatFormData, DifficultyFieldProps, DifficultyLevel } from '@/types';

function DifficultyFieldComponent({ form }: DifficultyFieldProps) {
	const { setFormValues } = useFormStore();

	const difficultyOptions = useMemo(() => getDifficultyOptions(), []);

	const handleChange = useCallback(
		(
			e: ChangeEvent<HTMLSelectElement>,
			field: { handleChange: (value: DifficultyLevel) => void }
		) => {
			const newValue = e.target.value as BeatFormData['difficulty'];
			field.handleChange(newValue);
			setFormValues({ difficulty: newValue });
		},
		[setFormValues]
	);

	return form.Field({
		name: 'difficulty',
		children: field => (
			<FormField className='flex-1 relative'>
				<div className='flex gap-1 items-center justify-start'>
					<FormLabel htmlFor='difficulty'>Difficulty</FormLabel>
					<HelpButton />
				</div>
				<FormSelect
					className='p-1'
					value={field.state.value}
					onChange={e => handleChange(e, field)}
					id='difficulty'
				>
					{difficultyOptions.map(option => (
						<option value={option} key={option}>
							{option}
						</option>
					))}
				</FormSelect>
			</FormField>
		),
	});
}

export const DifficultyField = memo(DifficultyFieldComponent);
