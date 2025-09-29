'use client';

import { useCallback } from 'react';

import { createMemoizedComponent } from '@/utils';
import { FormField, FormLabel } from '@/components';
import { useFormStore } from '@/stores';

import type { ChangeEvent, ReactNode } from 'react';
import type { BeatFormData } from '@/types';

type NumberFieldProps = {
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
	className?: string;
	min?: number;
	max?: number;
	defaultValue?: number;
};

function NumberFieldComponent({
	form,
	name,
	label,
	className = 'flex-1',
	min = 1,
	max = 16,
	defaultValue = 4,
}: NumberFieldProps) {
	const { setFormValues } = useFormStore();

	const handleChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>, field: { handleChange: (value: number) => void }) => {
			const newValue = parseInt(e.target.value) || defaultValue;
			field.handleChange(newValue);
			setFormValues({ [name]: newValue } as Partial<BeatFormData>);
		},
		[setFormValues, name, defaultValue]
	);

	return form.Field({
		name,
		children: field => (
			<FormField className={className}>
				<FormLabel htmlFor={name}>{label}</FormLabel>
				<input
					type='number'
					className='w-full'
					value={field.state.value}
					min={min}
					max={max}
					onChange={e => handleChange(e, field)}
					id={name}
				/>
			</FormField>
		),
	});
}

export const NumberField = createMemoizedComponent(NumberFieldComponent, 'NumberField');
