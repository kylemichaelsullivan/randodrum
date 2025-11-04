'use client';

import { memo } from 'react';

import clsx from 'clsx';
import { ClientOnly, EmptyState, useSticking } from '@/components';
import { DisplayBody } from './DisplayBody';
import { DisplayFooter } from './DisplayFooter';
import { useBeatStore } from '@/stores';

function DisplayBeatContentComponent() {
	const { currentBeat, clearCorruptedBeat } = useBeatStore();
	const { isStickingHidden } = useSticking();

	if (!currentBeat) {
		return <EmptyState message='Use the form above to create a beat!' />;
	}

	const displayBeatClassName =
		'DisplayBeat border-light-gray flex flex-auto flex-col gap-4 rounded-lg border bg-white p-6 shadow-sm';

	if (!Array.isArray(currentBeat.measures)) {
		console.error(
			'DisplayBeatContent: measures is not an array:',
			currentBeat.measures,
		);
		clearCorruptedBeat();
		return (
			<div className={displayBeatClassName}>
				<div className='text-red font-code p-4 text-center'>
					Error: Invalid beat data structure. Corrupted data has been cleared.
					Please generate a new beat.
				</div>
			</div>
		);
	}

	return (
		<div
			className={clsx(displayBeatClassName, 'w-full', {
				hideSticking: isStickingHidden,
			})}
		>
			<DisplayBody />
			<DisplayFooter />
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
