'use client';

import { api } from '@/trpc';
import { BeatsField } from './BeatsField';
import { DifficultyField } from './DifficultyField';
import { Form } from '@/components';
import { GenerateBeatButton } from './GenerateBeatButton';
import { MeasuresField } from './MeasuresField';
import { useForm } from '@tanstack/react-form';

import type { BeatFormData } from '@/types';

export function BeatForm() {
	const generateBeatMutation = api.beat.generate.useMutation();

	const form = useForm({
		defaultValues: {
			beats: 4,
			measures: 4,
			difficulty: 'Hey, Not Too Rough' as BeatFormData['difficulty'],
		},
		onSubmit: async ({ value }) => {
			try {
				const result = await generateBeatMutation.mutateAsync(value);
			} catch (error) {
				console.error('Failed to generate beat:', error);
			}
		},
	});

	return (
		<Form
			className='BeatForm flex flex-col gap-4 w-full'
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
