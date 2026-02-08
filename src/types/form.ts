/**
 * TanStack Form TypeScript utilities for RandoDrum
 * Provides properly typed interfaces for TanStack Form usage
 */

import type { ReactNode } from 'react';
import type { BeatFormData } from './beat';

type BaseField = {
	state: { value: BeatFormData[keyof BeatFormData] };
	handleChange: (value: BeatFormData[keyof BeatFormData]) => void;
};

type FormProps<F> = {
	form: {
		Field: (props: {
			name: keyof BeatFormData;
			children: (field: F) => ReactNode;
		}) => ReactNode | Promise<ReactNode>;
	};
};

export type FormInputProps = FormProps<BaseField & { handleBlur: () => void }>;
export type FormSelectProps = FormProps<BaseField>;
