'use client';

import { useCallback, useMemo } from 'react';

import { createMemoizedComponent } from '@/utils';
import { FormField, FormLabel, FormSelect } from '@/components';
import { useFormStore } from '@/stores';

import type { ChangeEvent, ReactNode } from 'react';
import type { BeatFormData, FormSelectProps } from '@/types';

type SelectFieldProps = FormSelectProps & {
	name: keyof BeatFormData;
	label: string;
	options: readonly string[];
	className?: string;
	componentName?: string;
	helpButton?: ReactNode;
	title?: string;
};

function SelectFieldComponent({
	form,
	name,
	label,
	className = 'flex-1',
	componentName = 'SelectField',
	helpButton,
	options,
	title,
}: SelectFieldProps) {
	const { formValues, setFormValues } = useFormStore();

	const memoizedOptions = useMemo(() => options, [options]);

	const handleChange = useCallback(
		(
			e: ChangeEvent<HTMLSelectElement>,
			field: {
				handleChange: (value: BeatFormData[keyof BeatFormData]) => void;
			},
		) => {
			const newValue = e.target.value as BeatFormData[keyof BeatFormData];
			field.handleChange(newValue);
			setFormValues({ [name]: newValue } as Partial<BeatFormData>);
		},
		[setFormValues, name],
	);

	const selectFieldName = componentName ? `${componentName}` : name;

	return form.Field({
		name,
		children: (field) => {
			// Initialize store value if field value is empty/null/undefined
			// Use setTimeout to avoid state updates during render
			const currentValue = field.state.value;
			const storeValue = formValues[name] as string;
			if (
				storeValue &&
				(currentValue === null ||
					currentValue === undefined ||
					(currentValue as string) === '') &&
				memoizedOptions.includes(storeValue) &&
				currentValue !== storeValue
			) {
				setTimeout(() => {
					field.handleChange(storeValue as BeatFormData[keyof BeatFormData]);
					setFormValues({
						[name]: storeValue,
					} as Partial<BeatFormData>);
				}, 0);
			}

			return (
				<FormField className={`${className} relative`} title={title}>
					<FormLabel htmlFor={name} className='pr-8'>
						{label}
					</FormLabel>
					<FormSelect
						className='p-1'
						componentName={selectFieldName}
						value={
							field.state.value === null ||
							field.state.value === undefined ||
							(field.state.value as string) === ''
								? (formValues[name] as string) || ''
								: field.state.value
						}
						onChange={(e) => handleChange(e, field)}
						id={name}
					>
						{memoizedOptions.map((option) => (
							<option value={option} key={option}>
								{option}
							</option>
						))}
					</FormSelect>
					{helpButton}
				</FormField>
			);
		},
	});
}

export const SelectField = createMemoizedComponent(
	SelectFieldComponent,
	'SelectField',
);
