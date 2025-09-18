import { memo, useMemo } from 'react';

import { MeasureContent } from './MeasureContent';
import { MeasureError } from './MeasureError';
import { MeasureHeader } from './MeasureHeader';
import type { DifficultyLevel, Measure } from '@/types';

type MeasureDisplayProps = {
	difficulty: DifficultyLevel;
	measure: Measure;
	measureIndex: number;
};

function MeasureDisplayComponent({ difficulty, measure, measureIndex }: MeasureDisplayProps) {
	const minWidth = useMemo(() => {
		switch (difficulty) {
			case 'Hey, Not Too Rough':
				return 'min-w-[18rem]';
			case 'Hurt Me Plenty':
				return 'min-w-[20rem]';
			case 'Ultra-Violence':
				return 'min-w-[22rem]';
			case 'Drumline!':
				return 'min-w-[24rem]';
			default:
				return 'min-w-[16rem]';
		}
	}, [difficulty]);

	if (!Array.isArray(measure)) {
		console.error('MeasureDisplay: measure is not an array:', measure);
		return <MeasureError measureIndex={measureIndex} />;
	}

	return (
		<div
			className={`MeasureDisplay flex flex-col flex-1 flex-grow-0 gap-3 bg-black border border-light-gray rounded-lg min-w-0 p-4 ${minWidth} max-w-full`}
		>
			<MeasureHeader measureIndex={measureIndex} />
			<MeasureContent measure={measure} />
		</div>
	);
}

export const MeasureDisplay = memo(MeasureDisplayComponent, (prevProps, nextProps) => {
	return (
		prevProps.difficulty === nextProps.difficulty &&
		prevProps.measureIndex === nextProps.measureIndex &&
		JSON.stringify(prevProps.measure) === JSON.stringify(nextProps.measure)
	);
});
