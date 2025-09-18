import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BeatFormData, FormStore } from '@/types';

const defaultFormValues: BeatFormData = {
	beats: 4,
	measures: 4,
	difficulty: 'Hey, Not Too Rough' as BeatFormData['difficulty'],
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
