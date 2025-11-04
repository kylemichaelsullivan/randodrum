'use client';

import clsx from 'clsx';
import { createMemoizedComponent } from '@/utils';
import { FormField, FormLabel } from '@/components';
import { defaultFormValues, useFormStore } from '@/stores';

import type { BeatFormData, FormInputProps } from '@/types';

type NumberFieldProps = FormInputProps & {
	name: keyof BeatFormData;
	label: string;
	className?: string;
	componentName?: string;
	min?: number;
	max?: number;
	title?: string;
};

function NumberFieldComponent({
	form,
	name,
	label,
	className = 'flex-1',
	componentName = 'NumberField',
	min = 1,
	max = 16,
	title,
}: NumberFieldProps) {
	const { formValues, setFormValues } = useFormStore();

	return form.Field({
		name,
		children: (field) => {
			const handleChange = (value: string) => {
				// Allow empty values during typing
				const numValue =
					value === '' ? ('' as unknown as number) : parseInt(value, 10);
				field.handleChange(numValue);
				setFormValues({ [name]: numValue } as Partial<BeatFormData>);
			};

			const handleBlur = () => {
				const currentValue = field.state.value;
				let validatedValue: number;

				if (
					currentValue === ('' as unknown as number) ||
					currentValue === null ||
					currentValue === undefined ||
					isNaN(Number(currentValue))
				) {
					// Use default value as fallback
					const defaultValue = defaultFormValues[name] as number;
					validatedValue = isNaN(Number(defaultValue)) ? min : defaultValue;
				} else {
					// Clamp value to min/max
					validatedValue = Math.max(min, Math.min(max, Number(currentValue)));
				}

				if (validatedValue !== currentValue) {
					field.handleChange(validatedValue);
					setFormValues({ [name]: validatedValue } as Partial<BeatFormData>);
				}
				field.handleBlur();
			};

			const numberFieldName = componentName ? `${componentName}` : name;

			return (
				<FormField className={className} title={title}>
					<FormLabel htmlFor={name}>{label}</FormLabel>
					<input
						type='number'
						className={clsx(numberFieldName, 'w-full')}
						value={
							field.state.value === null ||
							field.state.value === undefined ||
							isNaN(Number(field.state.value))
								? (formValues[name] as number) || min
								: field.state.value
						}
						min={min}
						max={max}
						onChange={(e) => handleChange(e.target.value)}
						onBlur={handleBlur}
						id={name}
					/>
				</FormField>
			);
		},
	});
}

export const NumberField = createMemoizedComponent(
	NumberFieldComponent,
	'NumberField',
);
