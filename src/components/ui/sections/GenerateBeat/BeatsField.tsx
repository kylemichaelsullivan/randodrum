'use client';

import { NumberField } from '@/components';

import type { FormInputProps } from '@/types';

export function BeatsField({ form }: FormInputProps) {
	return <NumberField form={form} name='beats' label='Beats' max={16} defaultValue={4} />;
}
