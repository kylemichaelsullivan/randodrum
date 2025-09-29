/**
 * TanStack Form TypeScript utilities for RandoDrum
 * Provides properly typed interfaces for TanStack Form usage
 */

import type { ReactNode } from 'react';
import type { BeatFormData } from './beat';

type FormFieldProps = {
	form: {
		Field: (props: {
			name: keyof BeatFormData;
			children: (field: {
				state: { value: BeatFormData[keyof BeatFormData] };
				handleChange: (value: BeatFormData[keyof BeatFormData]) => void;
			}) => ReactNode;
		}) => ReactNode;
	};
};

// Specific field prop types
export type BeatsFieldProps = FormFieldProps;
export type MeasuresFieldProps = FormFieldProps;
export type DifficultyFieldProps = FormFieldProps;
