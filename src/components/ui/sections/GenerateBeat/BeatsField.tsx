'use client';

import { NumberField } from '@/components';

import type { BeatsFieldProps } from '@/types';

export function BeatsField({ form }: BeatsFieldProps) {
	return <NumberField form={form} name='beats' label='Beats' min={1} max={16} defaultValue={4} />;
}
