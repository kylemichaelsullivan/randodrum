'use client';

import { memo } from 'react';

import { ClientOnly } from '@/components/providers';
import { EmptyState } from '@/components/ui/globals';
import { HandLegend } from './HandLegend';
import { MeasuresDisplay } from './MeasuresDisplay';
import { useBeatStore } from '@/stores';

function DisplayBeatContentComponent() {
	const { currentBeat, clearCorruptedBeat } = useBeatStore();

	if (!currentBeat) {
		return <EmptyState message='Use the form above to create a beat!' />;
	}

	if (!Array.isArray(currentBeat.measures)) {
		console.error('DisplayBeatContent: measures is not an array:', currentBeat.measures);
		clearCorruptedBeat();
		return (
			<div className='DisplayBeat flex flex-col gap-4 bg-white border border-light-gray rounded-lg shadow-sm p-6'>
				<div className='text-red p-4 text-center'>
					Error: Invalid beat data structure. Corrupted data has been cleared. Please generate a new
					beat.
				</div>
			</div>
		);
	}

	return (
		<div className='DisplayBeat flex flex-col gap-4 bg-white border border-light-gray rounded-lg shadow-sm w-full p-6'>
			<MeasuresDisplay />
			<HandLegend />
		</div>
	);
}

const DisplayBeatContent = memo(DisplayBeatContentComponent);

export function DisplayBeat() {
	return (
		<ClientOnly fallback={<EmptyState message='Loading beat display…' />}>
			<DisplayBeatContent />
		</ClientOnly>
	);
}
