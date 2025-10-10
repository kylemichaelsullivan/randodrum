import { memo } from 'react';

import { MeasureContent } from './MeasureContent';
import { MeasureError } from './MeasureError';
import { MeasureHeader } from './MeasureHeader';

import type { DifficultyLevel, Measure } from '@/types';

type MeasureDisplayProps = {
	difficulty: DifficultyLevel;
	measure: Measure;
	measureIndex: number;
};

function MeasureDisplayComponent({ measure, measureIndex }: MeasureDisplayProps) {
	if (!Array.isArray(measure)) {
		console.error('MeasureDisplay: measure is not an array:', measure);
		return <MeasureError measureIndex={measureIndex} />;
	}

	return (
		<div
			className={`MeasureDisplay flex flex-col gap-1 bg-black border border-light-gray rounded-lg p-4 min-w-[10rem]`}
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
