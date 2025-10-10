'use client';

import { createMemoizedComponent } from '@/utils';
import { FormField, FormLabel } from '@/components';
import { useFormStore } from '@/stores';

import type { BeatFormData, FormInputProps } from '@/types';

type NumberFieldProps = FormInputProps & {
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

	return form.Field({
		name,
		children: field => {
			const handleChange = (value: string) => {
				// Allow empty values during typing
				const numValue = value === '' ? ('' as unknown as number) : parseInt(value, 10);
				field.handleChange(numValue);
				setFormValues({ [name]: numValue } as Partial<BeatFormData>);
			};

			const handleBlur = () => {
				// Replace empty/invalid values with default and clamp to min/max on blur
				const currentValue = field.state.value;
				let validatedValue: number;

				if (
					currentValue === ('' as unknown as number) ||
					currentValue === null ||
					currentValue === undefined ||
					isNaN(Number(currentValue))
				) {
					validatedValue = defaultValue;
				} else {
					validatedValue = Math.max(min, Math.min(max, Number(currentValue)));
				}

				if (validatedValue !== currentValue) {
					field.handleChange(validatedValue);
					setFormValues({ [name]: validatedValue } as Partial<BeatFormData>);
				}
				field.handleBlur();
			};

			return (
				<FormField className={className}>
					<FormLabel htmlFor={name}>{label}</FormLabel>
					<input
						type='number'
						className='w-full'
						value={field.state.value}
						min={min}
						max={max}
						onChange={e => handleChange(e.target.value)}
						onBlur={handleBlur}
						id={name}
					/>
				</FormField>
			);
		},
	});
}

export const NumberField = createMemoizedComponent(NumberFieldComponent, 'NumberField');
