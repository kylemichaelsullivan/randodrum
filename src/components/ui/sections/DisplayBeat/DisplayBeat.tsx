'use client';

import { ClientOnly } from '@/components/providers/hydration-boundary';
import { EmptyState } from '@/components/ui/globals/EmptyState';
import { MeasureDisplay } from './MeasureDisplay';
import { useBeatStore } from '@/stores/beat-store';

function DisplayBeatContent() {
	const { currentBeat } = useBeatStore();

	if (!currentBeat) {
		return <EmptyState message='Use the form above to create a beat!' />;
	}

	return (
		<div className='DisplayBeat flex flex-col gap-4 bg-white border border-light-gray rounded-lg shadow-sm p-6'>
			<div className='flex flex-col gap-4'>
				{currentBeat.measures.map((measure, measureIndex) => (
					<MeasureDisplay measure={measure} measureIndex={measureIndex} key={measureIndex} />
				))}
			</div>
			<div className='border-t border-light-gray pt-4'>
				<div className='flex justify-center gap-6 text-xs text-gray'>
					<div className='flex items-center gap-1'>
						<span className='text-red font-bold'>R</span>
						<span>- Right Hand</span>
					</div>
					<div className='flex items-center gap-1'>
						<span className='text-blue font-bold'>L</span>
						<span>- Left Hand</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export function DisplayBeat() {
	return (
		<ClientOnly fallback={<EmptyState message='Loading beat display…' />}>
			<DisplayBeatContent />
		</ClientOnly>
	);
}
