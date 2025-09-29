'use client';

import { useCallback, useMemo } from 'react';

import { createMemoizedComponent } from '@/utils';
import { FormField, FormLabel, FormSelect } from '@/components';
import { useFormStore } from '@/stores';

import type { ChangeEvent, ReactNode } from 'react';
import type { BeatFormData } from '@/types';

type SelectFieldProps = {
	form: {
		Field: (props: {
			name: keyof BeatFormData;
			children: (field: {
				state: { value: BeatFormData[keyof BeatFormData] };
				handleChange: (value: BeatFormData[keyof BeatFormData]) => void;
			}) => ReactNode;
		}) => ReactNode;
	};
	name: keyof BeatFormData;
	label: string;
	options: readonly string[];
	className?: string;
	helpButton?: ReactNode;
	defaultValue?: string;
};

function SelectFieldComponent({
	form,
	name,
	label,
	options,
	className = 'flex-1',
	helpButton,
	defaultValue: _defaultValue,
}: SelectFieldProps) {
	const { setFormValues } = useFormStore();

	const memoizedOptions = useMemo(() => options, [options]);

	const handleChange = useCallback(
		(
			e: ChangeEvent<HTMLSelectElement>,
			field: { handleChange: (value: BeatFormData[keyof BeatFormData]) => void }
		) => {
			const newValue = e.target.value as BeatFormData[keyof BeatFormData];
			field.handleChange(newValue);
			setFormValues({ [name]: newValue } as Partial<BeatFormData>);
		},
		[setFormValues, name]
	);

	return form.Field({
		name,
		children: field => (
			<FormField className={`${className} relative`}>
				<div className='flex gap-1 items-center justify-start'>
					<FormLabel htmlFor={name}>{label}</FormLabel>
					{helpButton}
				</div>
				<FormSelect
					className='p-1'
					value={field.state.value}
					onChange={e => handleChange(e, field)}
					id={name}
				>
					{memoizedOptions.map(option => (
						<option value={option} key={option}>
							{option}
						</option>
					))}
				</FormSelect>
			</FormField>
		),
	});
}

export const SelectField = createMemoizedComponent(SelectFieldComponent, 'SelectField');
