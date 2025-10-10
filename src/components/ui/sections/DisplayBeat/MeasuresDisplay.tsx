import { memo } from 'react';
import { MeasureDisplay } from './MeasureDisplay';
import { useBeatStore } from '@/stores';

function MeasuresDisplayComponent() {
	const { currentBeat } = useBeatStore();

	if (!currentBeat) {
		return null;
	}

	return (
		<div className='MeasuresDisplay flex flex-wrap justify-center gap-4 w-full'>
			{currentBeat.measures.map((measure, measureIndex) => (
				<MeasureDisplay
					difficulty={currentBeat.difficulty}
					measure={measure}
					measureIndex={measureIndex}
					key={measureIndex}
				/>
			))}
		</div>
	);
}

export const MeasuresDisplay = memo(MeasuresDisplayComponent);
