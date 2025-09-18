import { memo } from 'react';
import { MeasureDisplay } from './MeasureDisplay';
import { useBeatStore } from '@/stores';

function MeasuresDisplayComponent() {
	const { currentBeat } = useBeatStore();

	if (!currentBeat) {
		return null;
	}

	return (
		<div className='MeasuresDisplay flex flex-col justify-around gap-4 w-full sm:flex-row sm:flex-wrap sm:justify-center'>
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
