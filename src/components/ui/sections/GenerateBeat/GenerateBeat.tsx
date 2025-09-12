'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@/trpc/react';

import { BeatsField } from './BeatsField';
import { Form } from '../../forms';
import { DifficultyField } from './DifficultyField';
import { GenerateBeatButton } from './GenerateBeatButton';
import { MeasuresField } from './MeasuresField';
import { useBeatStore } from '@/stores/beat-store';
import { useFormStore } from '@/stores/form-store';

export function GenerateBeat() {
	const generateBeatMutation = api.beat.generate.useMutation();
	const { setCurrentBeat } = useBeatStore();
	const { formValues } = useFormStore();

	const form = useForm({
		defaultValues: formValues,
		onSubmit: async ({ value }) => {
			try {
				const result = await generateBeatMutation.mutateAsync(value);
				if (result.success && result.beat) {
					setCurrentBeat(result.beat);
				}
			} catch (error) {
				console.error('Failed to generate beat:', error);
			}
		},
	});

	return (
		<Form
			className='GenerateBeat items-center flex flex-col gap-4 border-b border-black w-full pb-4'
			onSubmit={e => {
				e.preventDefault();
				e.stopPropagation();
				void form.handleSubmit();
			}}
		>
			<div className='flex flex-col gap-4 w-full md:flex-row'>
				<div className='flex flex-col gap-4 flex-2 w-full sm:flex-row'>
					<BeatsField form={form} />
					<MeasuresField form={form} />
				</div>

				<DifficultyField form={form} />
			</div>

			{/* isPending is from useMutation */}
			<GenerateBeatButton isGenerating={generateBeatMutation.isPending} />
		</Form>
	);
}
