import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BeatFormData } from '@/types';

type FormStore = {
	formValues: BeatFormData;
	setFormValues: (values: Partial<BeatFormData>) => void;
	resetFormValues: () => void;
};

const defaultFormValues: BeatFormData = {
	beats: 4,
	measures: 4,
	difficulty: 'Hey, Not Too Rough',
};

export const useFormStore = create<FormStore>()(
	persist(
		set => ({
			formValues: defaultFormValues,
			setFormValues: (values: Partial<BeatFormData>) =>
				set(state => ({
					formValues: { ...state.formValues, ...values },
				})),
			resetFormValues: () => set({ formValues: defaultFormValues }),
		}),
		{
			name: 'form-storage',
		}
	)
);
