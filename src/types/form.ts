/**
 * TanStack Form TypeScript utilities for RandoDrum
 *
 * This file provides properly typed interfaces for TanStack Form usage,
 * using Zod schemas for type safety.
 */

import type { ReactNode } from 'react';
import type { BeatFormData } from './beat';

// Props types for field components - using the same pattern as BeatForm.tsx
export type BeatsFieldProps = {
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

export type MeasuresFieldProps = {
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

export type DifficultyFieldProps = {
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
