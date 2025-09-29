import { memo, useMemo } from 'react';

import { createConfigArray, DIFFICULTY_LEVELS } from '@/types';
import { MeasureContent } from './MeasureContent';
import { MeasureError } from './MeasureError';
import { MeasureHeader } from './MeasureHeader';

import type { DifficultyLevel, Measure } from '@/types';

type MeasureDisplayProps = {
	difficulty: DifficultyLevel;
	measure: Measure;
	measureIndex: number;
};

const DIFFICULTY_WIDTH_MAP: Record<DifficultyLevel, number> = {
	'I’m Too Young to Drum': 10,
	'Hey, Not Too Ruff': 14,
	'Hurt Me Plenty': 24,
	'Ultra-Violence': 28,
	'Drumline!': 32,
} as const;

const DIFFICULTY_WIDTH_CONFIGS = createConfigArray(DIFFICULTY_LEVELS, DIFFICULTY_WIDTH_MAP);

function MeasureDisplayComponent({ difficulty, measure, measureIndex }: MeasureDisplayProps) {
	const minWidth = useMemo(() => {
		const config = DIFFICULTY_WIDTH_CONFIGS.find(c => c.name === difficulty);
		return config ? `min-w-[${config.value}rem]` : 'min-w-0';
	}, [difficulty]);

	if (!Array.isArray(measure)) {
		console.error('MeasureDisplay: measure is not an array:', measure);
		return <MeasureError measureIndex={measureIndex} />;
	}

	return (
		<div
			className={`MeasureDisplay flex flex-col flex-1 flex-grow-0 gap-1 bg-black border border-light-gray rounded-lg ${minWidth} max-w-full p-4 overflow-auto`}
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
