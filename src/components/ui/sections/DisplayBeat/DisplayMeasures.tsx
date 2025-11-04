import { memo } from 'react';

import { DisplayMeasure } from './DisplayMeasure';
import { useBeatStore } from '@/stores';

function DisplayMeasuresComponent() {
	const { currentBeat } = useBeatStore();

	if (!currentBeat) {
		return null;
	}

	return (
		<div className='DisplayMeasures mx-auto flex flex-wrap justify-center gap-4 self-start'>
			{currentBeat.measures.map((measure, measureIndex) => (
				<DisplayMeasure
					difficulty={currentBeat.difficulty}
					measure={measure}
					measureIndex={measureIndex}
					key={measureIndex}
				/>
			))}
		</div>
	);
}

export const DisplayMeasures = memo(DisplayMeasuresComponent);
