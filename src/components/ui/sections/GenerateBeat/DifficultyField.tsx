'use client';

import { useMemo } from 'react';

import { SelectField, HelpButton } from '@/components';
import { getDifficultyOptions } from '@/utils';

import type { DifficultyFieldProps } from '@/types';

export function DifficultyField({ form }: DifficultyFieldProps) {
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
