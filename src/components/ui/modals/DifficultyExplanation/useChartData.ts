import { useMemo } from 'react';

import { CHART_DATA, DIFFICULTY_LEVELS } from '@/utils';

import type { DifficultyLevel } from '@/types';

export function useChartData() {
	const chartData = useMemo(() => {
		return DIFFICULTY_LEVELS.map((difficulty: DifficultyLevel) => ({
			difficulty,
			data: CHART_DATA[difficulty],
		})).filter(({ data }) => data !== undefined);
	}, []);

	return chartData;
}

export function useDifficultyData(difficulty: DifficultyLevel) {
	const data = useMemo(() => {
		return CHART_DATA[difficulty];
	}, [difficulty]);

	return data;
}
