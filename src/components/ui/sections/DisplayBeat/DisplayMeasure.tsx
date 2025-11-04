import { memo } from 'react';

import { MeasureContent } from './MeasureContent';
import { MeasureError } from './MeasureError';
import { MeasureHeader } from './MeasureHeader';

import type { DifficultyLevel, Measure } from '@/types';

type DisplayMeasureProps = {
	difficulty: DifficultyLevel;
	measure: Measure;
	measureIndex: number;
};

function DisplayMeasureComponent({
	measure,
	measureIndex,
}: DisplayMeasureProps) {
	if (!Array.isArray(measure)) {
		console.error('DisplayMeasure: measure is not an array:', measure);
		return <MeasureError measureIndex={measureIndex} />;
	}

	return (
		<div
			className={`DisplayMeasure border-light-gray flex min-w-[10rem] flex-col gap-1 rounded-lg border bg-black p-4`}
		>
			<MeasureHeader measureIndex={measureIndex} />
			<MeasureContent measure={measure} />
		</div>
	);
}

export const DisplayMeasure = memo(
	DisplayMeasureComponent,
	(prevProps, nextProps) => {
		return (
			prevProps.difficulty === nextProps.difficulty &&
			prevProps.measureIndex === nextProps.measureIndex &&
			JSON.stringify(prevProps.measure) === JSON.stringify(nextProps.measure)
		);
	},
);
