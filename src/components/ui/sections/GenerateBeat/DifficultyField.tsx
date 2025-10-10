'use client';

import { useMemo } from 'react';

import { SelectField, HelpButton } from '@/components';
import { getDifficultyOptions } from '@/utils';

import type { FormSelectProps } from '@/types';

export function DifficultyField({ form }: FormSelectProps) {
	const difficultyOptions = useMemo(() => getDifficultyOptions(), []);

	return (
		<SelectField
			form={form}
			name='difficulty'
			label='Difficulty'
			options={difficultyOptions}
			helpButton={<HelpButton />}
		/>
	);
}
